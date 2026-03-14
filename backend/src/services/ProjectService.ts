import mongoose, { Types } from "mongoose";
import { MilestoneStatus, ProjectModel, ProjectStatus } from "../models/Project";

export async function createProjectFromRoadmap(data: {
  description: string;
  budget: number;
  employerId: string;
  milestones: any[];
}) {
  return await ProjectModel.create({
    description: data.description,
    totalBudget: data.budget,
    employerId: data.employerId,
    milestones: data.milestones.map(m => ({
      ...m,
      status: MilestoneStatus.PENDING
    })),
    status: ProjectStatus.DRAFT
  });
}

export async function fundAndActivateProject(projectId: string) {
  // Use "FUNDED" string or ProjectStatus.FUNDED if available
  const project = await ProjectModel.findByIdAndUpdate(
    projectId,
    { status: "FUNDED" }, 
    { new: true }
  );
  if (!project) throw new Error("Project not found");
  return project;
}

export async function transitionMilestone(
  projectId: string,
  milestoneId: string,
  targetStatus: MilestoneStatus
) {
  const session = await mongoose.startSession();
  try {
    let result: any;
    await session.withTransaction(async () => {
      const project = await ProjectModel.findById(projectId).session(session);
      if (!project) throw new Error("Project not found");

      const mId = new Types.ObjectId(milestoneId);
      const milestone = project.milestones?.find((m: any) => m._id.equals(mId));

      if (!milestone) throw new Error("Milestone not found");

      // Inside transitionMilestone in ProjectService.ts
        milestone.status = targetStatus;

        const allPaid = project.milestones.every((m: any) => m.status === MilestoneStatus.PAID);

        if (allPaid) {
          project.status = ProjectStatus.COMPLETED;
          // DO NOT increment index here
        } else if (targetStatus === MilestoneStatus.PAID) {
          project.currentMilestoneIndex += 1;
        }

      await project.save({ session });
      result = project.toObject();
    });
    return result;
  } finally {
    await session.endSession();
  }
}