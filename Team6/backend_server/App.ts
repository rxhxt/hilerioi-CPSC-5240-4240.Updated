import * as express from 'express';
import * as bodyParser from 'body-parser';
import { JobPostRoutes } from './JobPostRoutes';
import { JobPostModel } from './model/JobPostModel';
import { AppliedJobRoutes } from './AppliedJobRoutes';
import { AppliedJobModel } from './model/AppliedJobModel';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
  }

  private routes(): void {
    // Get environment variables
    const dbProtocol = process.env.DB_PROTOCAL || 'mongodb://';
    const dbUser = process.env.DB_USER || '';
    const dbPassword = process.env.DB_PASSWORD || '';
    const dbInfo = process.env.DB_INFO || '';
    
    // Construct the full MongoDB connection string
    let dbConnectionString = '';
    
    if (dbUser && dbPassword) {
      // If user and password are provided, include them in the connection string
      dbConnectionString = `${dbProtocol}${dbUser}:${dbPassword}${dbInfo}`;
    } else {
      // If no authentication, just use protocol and info
      dbConnectionString = `${dbProtocol}${dbInfo}`;
    }
    
    // Log connection string (hide password for security)
    console.log("Using database connection:", dbConnectionString.replace(/:([^:@]{1,})@/, ':****@'));
    
    const jobPostModel = new JobPostModel(dbConnectionString);
    const jobPostRoutes = new JobPostRoutes(jobPostModel);   
    this.express.use('/', jobPostRoutes.getRouter());

    const appliedJobModel = new AppliedJobModel(dbConnectionString);
    const appliedJobRoutes = new AppliedJobRoutes(appliedJobModel);
    this.express.use('/', appliedJobRoutes.getRouter());

    //static files
    this.express.use('/images', express.static(__dirname + '/img'));
    this.express.use('/data', express.static(__dirname + '/json'));
    this.express.use('/', express.static(__dirname + '/pages'));
    this.express.use('/', express.static(__dirname + '/dist'));

  }
}

export { App };