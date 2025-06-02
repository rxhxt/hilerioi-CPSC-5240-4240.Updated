import * as express from "express";
import { AppliedJobModel } from "./model/AppliedJobModel";


// Ensure validateAuth is used in the routes

class AppliedJobRoutes {
  private router: express.Router;
  private appliedJobModel: AppliedJobModel;

  constructor(appliedJobModel: AppliedJobModel) {
    this.router = express.Router();
    this.appliedJobModel = appliedJobModel;
    this.configureRoutes();
  }

  private configureRoutes(): void {
    // -------------------Validated Routes below-------------------

    // Get all applied jobs
    this.router.get("/api/v1/appliedjobs", this.validateAuth, async (req, res) => {
      await this.appliedJobModel.retrieveAllAppliedJobs(res);
    });

    // Get one by ID
    this.router.get("/api/v1/appliedjobs/:appliedJobId", this.validateAuth, async (req, res) => {
      const id = req.params.appliedJobId;
      await this.appliedJobModel.retrieveAppliedJobById(res, id);
    });

    // Create a new application record
    this.router.post("/api/v1/appliedjobs", this.validateAuth, async (req, res) => {
      const payload = req.body;
      await this.appliedJobModel.createAppliedJob(res, payload);
    });


    // -------------------Non Validated Routes below-------------------
    // Get all applied jobs
    this.router.get("/api/v1/appliedjobs/unprotected", async (req, res) => {
      await this.appliedJobModel.retrieveAllAppliedJobs(res);
    });

    // Get one by ID
    this.router.get("/api/v1/appliedjobs/unprotected/:appliedJobId", async (req, res) => {
      const id = req.params.appliedJobId;
      await this.appliedJobModel.retrieveAppliedJobById(res, id);
    });

    // Create a new application record
    this.router.post("/api/v1/appliedjobs/unprotected", async (req, res) => {
      const payload = req.body;
      await this.appliedJobModel.createAppliedJob(res, payload);
    });
  }

  public getRouter(): express.Router {
    return this.router;
  }

  private validateAuth(req: express.Request, res: express.Response, next: express.NextFunction): void {
      console.log('Validating authentication');
  }
}

export { AppliedJobRoutes };
