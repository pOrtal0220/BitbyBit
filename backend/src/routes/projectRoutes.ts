import { Router } from "express";
import { generateRoadmap } from "../services/aiArchitect";
import { 
  createProjectFromRoadmap, 
  fundAndActivateProject, 
  transitionMilestone 
} from "../services/ProjectService";
import { ProjectModel, MilestoneStatus } from "../models/Project";

const router = Router();

// 1. GENERATE ROADMAP
router.post("/generate-roadmap", async (req, res) => {
  try {
    const { description, budget, employerId } = req.body ?? {};
    const roadmap = await generateRoadmap(description, Number(budget));
    const project = await createProjectFromRoadmap({
      description,
      budget: Number(budget),
      employerId: employerId || "demo_user",
      milestones: roadmap
    });
    return res.status(200).json({ project });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 2. EXPLORE (The "Marketplace" fetch)
router.get("/explore", async (req, res) => {
  try {
    console.log("🔍 Fetching funded, unassigned projects...");
    const projects = await ProjectModel.find({ 
      status: "FUNDED",
      $or: [
        { freelancerId: { $exists: false } },
        { freelancerId: null },
        { freelancerId: "" }
      ]
    });
    console.log(`✨ Found ${projects.length} available projects`);
    return res.status(200).json({ projects });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 3. JOIN PROJECT (The "Claim" logic)
router.post("/join", async (req, res) => {
  try {
    const { projectId, freelancerId } = req.body;
    const project = await ProjectModel.findByIdAndUpdate(
      projectId,
      { freelancerId, status: "IN_PROGRESS" },
      { new: true }
    );
    return res.status(200).json({ success: true, project });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 4. FUND/LOCK ESCROW
router.post("/fund", async (req, res) => {
  try {
    const { projectId } = req.body;
    const project = await fundAndActivateProject(projectId);
    return res.status(200).json({ success: true, project });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 5. GET PROJECTS BY ROLE & ID
router.get("/my-projects/:role/:userId", async (req, res) => {
  try {
    const { role, userId } = req.params;
    const filter = role === 'employer' ? { employerId: userId } : { freelancerId: userId };
    const projects = await ProjectModel.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ projects });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 6. PAYOUT
router.post("/payout", async (req, res) => {
  try {
    const { projectId, milestoneId } = req.body;
    const updatedProject = await transitionMilestone(projectId, milestoneId, MilestoneStatus.PAID);
    return res.status(200).json({ success: true, project: updatedProject });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;