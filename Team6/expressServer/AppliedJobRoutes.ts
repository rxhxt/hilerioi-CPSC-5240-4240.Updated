import * as express from "express";
import { AppliedJobModel } from "../MongooseDB/model/AppliedJobModel";

class AppliedJobRoutes {
  private router: express.Router;
  private appliedJobModel: AppliedJobModel;

  constructor(appliedJobModel: AppliedJobModel) {
    this.router = express.Router();
    this.appliedJobModel = appliedJobModel;
    this.configureRoutes();
  }

  private configureRoutes(): void {
    // Get all applied jobs
    this.router.get("/api/v1/appliedjobs", async (req, res) => {
      await this.appliedJobModel.retrieveAllAppliedJobs(res);
    });

    // Get one by ID
    this.router.get("/api/v1/appliedjobs/:appliedJobId", async (req, res) => {
      const id = req.params.appliedJobId;
      await this.appliedJobModel.retrieveAppliedJobById(res, id);
    });

    // Create a new application record
    this.router.post("/api/v1/appliedjobs", async (req, res) => {
      const payload = req.body;
      await this.appliedJobModel.createAppliedJob(res, payload);
    });
  }

  public getRouter(): express.Router {
    return this.router;
  }
}

export { AppliedJobRoutes };
