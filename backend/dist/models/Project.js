"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectModel = exports.MilestoneStatus = exports.ProjectStatus = void 0;
const mongoose_1 = require("mongoose");
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["DRAFT"] = "DRAFT";
    ProjectStatus["FUNDED"] = "FUNDED";
    ProjectStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ProjectStatus["REVIEWING"] = "REVIEWING";
    ProjectStatus["COMPLETED"] = "COMPLETED";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
var MilestoneStatus;
(function (MilestoneStatus) {
    MilestoneStatus["PENDING"] = "PENDING";
    MilestoneStatus["LOCKED"] = "LOCKED";
    MilestoneStatus["SUBMITTED"] = "SUBMITTED";
    MilestoneStatus["APPROVED"] = "APPROVED";
    MilestoneStatus["PAID"] = "PAID";
})(MilestoneStatus || (exports.MilestoneStatus = MilestoneStatus = {}));
const milestoneSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    payoutAmount: { type: Number, required: true, min: 0 },
    status: {
        type: String,
        enum: Object.values(MilestoneStatus),
        default: MilestoneStatus.PENDING,
        required: true,
    },
    definitionOfDone: {
        type: [String],
        default: [],
        required: true,
    },
}, {});
const projectSchema = new mongoose_1.Schema({
    employerId: { type: mongoose_1.Schema.Types.ObjectId, required: true, index: true },
    freelancerId: { type: mongoose_1.Schema.Types.ObjectId, required: true, index: true },
    totalBudget: { type: Number, required: true, min: 0 },
    milestones: { type: [milestoneSchema], default: [], required: true },
    stripePaymentIntentId: { type: String },
    status: {
        type: String,
        enum: Object.values(ProjectStatus),
        default: ProjectStatus.DRAFT,
        required: true,
    },
}, { timestamps: true });
exports.ProjectModel = (0, mongoose_1.model)("Project", projectSchema);
