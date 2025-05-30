"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppliedJobRoutes = void 0;
const express = require("express");
class AppliedJobRoutes {
    constructor(appliedJobModel) {
        this.router = express.Router();
        this.appliedJobModel = appliedJobModel;
        this.configureRoutes();
    }
    configureRoutes() {
        // Get all applied jobs
        this.router.get("/api/v1/appliedjobs", (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.appliedJobModel.retrieveAllAppliedJobs(res);
        }));
        // Get one by ID
        this.router.get("/api/v1/appliedjobs/:appliedJobId", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.appliedJobId;
            yield this.appliedJobModel.retrieveAppliedJobById(res, id);
        }));
        // Create a new application record
        this.router.post("/api/v1/appliedjobs", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const payload = req.body;
            yield this.appliedJobModel.createAppliedJob(res, payload);
        }));
    }
    getRouter() {
        return this.router;
    }
}
exports.AppliedJobRoutes = AppliedJobRoutes;
//# sourceMappingURL=AppliedJobRoutes.js.map