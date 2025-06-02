import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as crypto from 'crypto';
import * as passport from 'passport';
import GooglePassportObj from './GooglePassport';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import { JobPostModel } from './model/JobPostModel';
import { AppliedJobModel } from './model/AppliedJobModel';

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
    this.express.use((req, res, next) => {// CORS
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
    this.express.use(session({   // Session configuration
      secret: process.env.SESSION_SECRET || 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }
    }));

    this.express.use(cookieParser());
    this.express.use(passport.initialize());
    this.express.use(passport.session());
  }

  private validateAuth(req, res, next):void {
    if (req.isAuthenticated()) { 
      console.log("user is authenticated"); 
      console.log(JSON.stringify(req.user));
      return next(); }
    console.log("user is not authenticated");
    res.redirect('/');
  }

  private routes(): void {
    let router = express.Router();

    
    // Authentication routes
    router.get('/auth/google',
      passport.authenticate('google', { scope: ['profile', 'email'] })
    );

    router.get('/auth/google/callback',
      passport.authenticate('google', { failureRedirect: '/' }),
      (req, res) => {
        console.log("Successfully authenticated user");
        res.redirect('/#/dashboard');
      }
    );


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
    router.get('/api/v1/appliedjobs/unprotected', async (req, res) => {
      await this.appliedJobModel.retrieveAllAppliedJobs(res);
    });

    router.get('/api/v1/appliedjobs/unprotected/:appliedJobId', async (req, res) => {
      const id = req.params.appliedJobId;
      await this.appliedJobModel.retrieveAppliedJobById(res, id);
    });

    router.post('/api/v1/appliedjobs/unprotected', async (req, res) => {
      const payload = req.body;
      await this.appliedJobModel.createAppliedJob(res, payload);
    });

    router.get('/api/v1/appliedjobs', this.validateAuth, async (req, res) => {
      await this.appliedJobModel.retrieveAllAppliedJobs(res);
    });

    router.get('/api/v1/appliedjobs/:appliedJobId', this.validateAuth, async (req, res) => {
      const id = req.params.appliedJobId;
      await this.appliedJobModel.retrieveAppliedJobById(res, id);
    });

    router.post('/api/v1/appliedjobs', this.validateAuth, async (req, res) => {
      const payload = req.body;
      await this.appliedJobModel.createAppliedJob(res, payload);
    });

    this.express.use('/', router);

    // Static files
    this.express.use('/images', express.static(__dirname + '/img'));
    console.log("Serving static files from: " + __dirname + '/dist/job-fetchr');
    
    this.express.use('/', express.static(__dirname + '/dist/job-fetchr'));
  }
}

export { App };