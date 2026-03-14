"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aiArchitect_1 = require("../services/aiArchitect");
const router = (0, express_1.Router)();
router.post("/generate-roadmap", async (req, res) => {
    try {
        const { description, budget } = req.body ?? {};
        if (typeof description !== "string" || description.trim().length === 0) {
            return res.status(400).json({ error: "description is required and must be a non-empty string" });
        }
        const numericBudget = typeof budget === "number"
            ? budget
            : typeof budget === "string"
                ? Number.parseFloat(budget)
                : NaN;
        if (!Number.isFinite(numericBudget) || numericBudget <= 0) {
            return res.status(400).json({ error: "budget is required and must be a positive number" });
        }
        const roadmap = await (0, aiArchitect_1.generateRoadmap)(description, numericBudget);
        return res.status(200).json({ roadmap });
    }
    catch (err) {
        console.error("Error generating roadmap", err);
        return res.status(500).json({ error: "Failed to generate roadmap" });
    }
});
exports.default = router;
