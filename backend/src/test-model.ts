import { ProjectModel, ProjectStatus, MilestoneStatus } from "./models/Project";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function testModel() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("Connected to MongoDB...");

  const mockProject = new ProjectModel({
    employerId: new mongoose.Types.ObjectId(),
    totalBudget: 500,
    githubRepoUrl: "https://github.com/testuser/test-repo", // Testing new field
    currentMilestoneIndex: 0, // Testing new field
    status: ProjectStatus.DRAFT,
    milestones: [
      {
        title: "Setup",
        payoutAmount: 500,
        status: MilestoneStatus.PENDING,
        definitionOfDone: ["Repo created"]
      }
    ]
  });

  try {
    const saved = await mockProject.save();
    console.log("✅ Model Verification Passed!");
    console.log("Saved Project ID:", saved._id);
    console.log("Stored GitHub URL:", saved.githubRepoUrl);
    
    // Cleanup
    await ProjectModel.deleteOne({ _id: saved._id });
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Model Verification Failed:", err);
  }
}

testModel();