import * as express from 'express';
import * as bodyParser from 'body-parser';
import { JobPostRoutes } from './JobPostRoutes';
import { JobPostModel } from './model/JobPostModel';

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
    const dbConnectionString = process.env.DB_INFO || '';
    console.log("Using database connection:", dbConnectionString);
    
    const jobPostModel = new JobPostModel(dbConnectionString);
    const jobPostRoutes = new JobPostRoutes(jobPostModel);
    this.express.use('/', jobPostRoutes.getRouter());

    // Static file serving
    this.express.use('/images', express.static(__dirname + '/img'));
    this.express.use('/data', express.static(__dirname + '/json'));
    this.express.use('/', express.static(__dirname + '/pages'));
  }
}

export { App };
