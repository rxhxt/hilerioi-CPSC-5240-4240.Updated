import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as crypto from 'crypto';
import * as passport from 'passport';
import * as path from 'path'; 
import GooglePassportObj from './GooglePassport';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import { JobPostModel } from './model/JobPostModel';
import { AppliedJobModel } from './model/AppliedJobModel';

// Extend Express Request interface to include Passport methods
declare global {
  namespace Express {
    interface Request {
      isAuthenticated(): boolean;
      logout(callback: (err: any) => void): void;
      user?: any;
    }
  }
}

class App {
  public express: express.Application;
  public googlePassportObj: GooglePassportObj;
  private jobPostModel: JobPostModel;
  private appliedJobModel: AppliedJobModel;

  constructor() {
    this.googlePassportObj = new GooglePassportObj();
    this.express = express();
    this.middleware();
    this.routes();
    
    const dbProtocol = process.env.DB_PROTOCAL || 'mongodb://';
    const dbUser = process.env.DB_USER || '';
    const dbPassword = process.env.DB_PASSWORD || '';
    const dbInfo = process.env.DB_INFO || '';
    let dbConnectionString = '';
    if (dbUser && dbPassword) {
      dbConnectionString = `${dbProtocol}${dbUser}:${dbPassword}${dbInfo}`;
    } else {
      dbConnectionString = `${dbProtocol}${dbInfo}`;
    }
    console.log("Using database connection:", dbConnectionString.replace(/:([^:@]{1,})@/, ':****@'));
    // Initialize models
    this.jobPostModel = new JobPostModel(dbConnectionString);
    this.appliedJobModel = new AppliedJobModel(dbConnectionString);
  }
  
  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    
    // Updated CORS configuration for same-origin setup
    this.express.use((req, res, next) => {
      // Since frontend and backend are served from same origin, we need different CORS handling
      const allowedOrigins = process.env.NODE_ENV === 'production' 
        ? [process.env.AZURE_URL || 'https://your-azure-app.azurewebsites.net'] 
        : ['http://localhost:8080']; // Same port as your backend
    
      const origin = req.headers.origin;
      if (origin && allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
      }
      
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
    });

    // Updated session configuration
    this.express.use(session({
      secret: process.env.SESSION_SECRET || 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
      }
    }) as any);

    this.express.use(cookieParser() as any);
    this.express.use(passport.initialize() as any);
    this.express.use(passport.session());
  }

  private validateAuth(req: express.Request, res: express.Response, next: express.NextFunction):void {
    if (req.isAuthenticated()) { 
      console.log("user is authenticated"); 
      console.log(JSON.stringify(req.user));
      return next(); }
    console.log("user is not authenticated");
    res.redirect('/login');
  }

  private routes(): void {
    let router = express.Router();

    // Authentication routes
    router.get('/login',
      passport.authenticate('google', { scope: ['profile', 'email'] })
    );

    router.get('/auth/google/callback',
      passport.authenticate('google', { failureRedirect: '/' }),
      (req, res) => {
        console.log("Successfully authenticated user");
        res.redirect('/');
      }
    );

    // API routes
    router.get('/api/v1/auth/status', (req, res) => {
      console.log("Checking authentication status");
      if (req.isAuthenticated()) {
        res.json({ 
          authenticated: true, 
          user: req.user 
        });
      } else {
        res.json({ 
          authenticated: false 
        });
      }
    });

    router.post('/api/v1/auth/logout', (req, res) => {
      req.logout((err) => {
        if (err) {
          return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ success: true });
      });
    });

    // JobPost routes
    router.get('/api/v1/jobposts/unprotected', async (req, res) => {
      await this.jobPostModel.retrieveAllJobPosts(res);
    });

    router.get('/api/v1/jobposts/unprotected/:jobPostId', async (req, res) => {
      const jobPostId = req.params.jobPostId;
      await this.jobPostModel.retrieveJobPostsById(res, jobPostId);
    });

    router.post('/api/v1/jobposts/unprotected', async (req, res) => {
      const jobPostData = req.body;
      await this.jobPostModel.CreateJobPost(res, jobPostData);
    });

    router.get('/api/v1/jobposts', this.validateAuth, async (req, res) => {
      await this.jobPostModel.retrieveAllJobPosts(res);
    });

    router.get('/api/v1/jobposts/:jobPostId', this.validateAuth, async (req, res) => {
      const jobPostId = req.params.jobPostId;
      await this.jobPostModel.retrieveJobPostsById(res, jobPostId);
    });

    router.post('/api/v1/jobposts', this.validateAuth, async (req, res) => {
      const jobPostData = req.body;
      await this.jobPostModel.CreateJobPost(res, jobPostData);
    });

    // AppliedJob routes
    router.get('/api/v1/appliedjobs', this.validateAuth, async (req, res) => {
      const userId = req.user?.ssoID; // Get user ID from authenticated user
      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }
      await this.appliedJobModel.retrieveAllAppliedJobs(res, userId);
    });

    router.get('/api/v1/appliedjobs/:appliedJobId', this.validateAuth, async (req, res) => {
      const id = req.params.appliedJobId;
      const userId = req.user?.ssoID;
      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }
      await this.appliedJobModel.retrieveAppliedJobById(res, id, userId);
    });

    router.post('/api/v1/appliedjobs', this.validateAuth, async (req, res) => {
      const payload = req.body;
      const userId = req.user?.ssoID;
      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }
      await this.appliedJobModel.createAppliedJob(res, payload, userId);
    });

    // Apply the router with all API and auth routes FIRST
    this.express.use('/', router);

    // Static files
    this.express.use('/images', express.static(__dirname + '/img'));
    this.express.use('/', express.static(__dirname + '/dist/job-fetchr/browser'));

    
    // Catch-all handler for Angular app - MUST BE LAST
    // this.express.get('*', (req, res) => {
    //   console.log('Serving Angular app for path:', req.path);
    //   res.sendFile(__dirname + '/dist/job-fetchr/browser');
    // });
  }
}

export { App };