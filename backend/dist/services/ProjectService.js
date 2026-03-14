"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.transitionMilestone = transitionMilestone;
const mongoose_1 = __importStar(require("mongoose"));
const Project_1 = require("../models/Project");
async function transitionMilestone(projectId, milestoneId, targetStatus) {
    const session = await mongoose_1.default.startSession();
    try {
        let result;
        await session.withTransaction(async () => {
            const project = await Project_1.ProjectModel.findById(projectId).session(session);
            if (!project) {
                throw new Error("Project not found");
            }
            const milestoneObjectId = new mongoose_1.Types.ObjectId(milestoneId);
            const milestone = project.milestones?.find((m) => {
                const id = m._id;
                return id?.equals(milestoneObjectId);
            });
            if (!milestone) {
                throw new Error("Milestone not found");
            }
            const currentStatus = milestone.status;
            if (targetStatus === Project_1.MilestoneStatus.PAID && currentStatus !== Project_1.MilestoneStatus.APPROVED) {
                throw new Error("A milestone cannot be PAID unless it is currently APPROVED");
            }
            if (targetStatus === Project_1.MilestoneStatus.APPROVED && project.status !== Project_1.ProjectStatus.IN_PROGRESS) {
                throw new Error("A milestone cannot be APPROVED unless the Project status is IN_PROGRESS");
            }
            milestone.status = targetStatus;
            await project.save({ session });
            result = project.toObject();
        });
        return result;
    }
    finally {
        await session.endSession();
    }
}
