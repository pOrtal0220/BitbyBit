import { model, Schema, Types } from "mongoose";

export enum ProjectStatus {
  DRAFT = "DRAFT",
  FUNDED = "FUNDED",
  IN_PROGRESS = "IN_PROGRESS",
  REVIEWING = "REVIEWING",
  COMPLETED = "COMPLETED",
}

export enum MilestoneStatus {
  PENDING = "PENDING",
  LOCKED = "LOCKED",
  SUBMITTED = "SUBMITTED",
  APPROVED = "APPROVED",
  PAID = "PAID",
}

export type ProjectMilestone = {
  title: string;
  payoutAmount: number;
  status: MilestoneStatus;
  definitionOfDone: string[];
};

export type Project = {
  employerId: string; // Changed to String for flexibility
  freelancerId?: string;
  description: string; // Added to Type
  totalBudget: number;
  milestones: ProjectMilestone[];
  razorpayOrderId?: string;
  status: ProjectStatus;
  githubRepoUrl?: string;
  currentMilestoneIndex: number;
};

const milestoneSchema = new Schema<ProjectMilestone>(
  {
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
  },
  { _id: true }
);

const projectSchema = new Schema<Project>(
  {
    employerId: { type: String, required: true, index: true }, // Matches Route logic
    freelancerId: { type: String, index: true },
    description: { type: String, required: true }, // Added to Schema
    totalBudget: { type: Number, required: true, min: 0 },
    milestones: { type: [milestoneSchema], default: [], required: true },
    razorpayOrderId: { type: String },
    githubRepoUrl: { type: String, trim: true },
    currentMilestoneIndex: { type: Number, default: 0 },
    status: {
      type: String,
      enum: Object.values(ProjectStatus),
      default: ProjectStatus.DRAFT,
      required: true,
    },
  },
  { timestamps: true }
);

export const ProjectModel = model<Project>("Project", projectSchema);