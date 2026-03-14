"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const aiArchitect_1 = require("./services/aiArchitect");
dotenv_1.default.config();
async function main() {
    try {
        const description = "Python script to scrape real estate data";
        const budget = 500;
        console.log("Requesting AI roadmap...");
        console.log({ description, budget });
        const roadmap = await (0, aiArchitect_1.generateRoadmap)(description, budget);
        console.log("\nGenerated roadmap:");
        console.log(JSON.stringify(roadmap, null, 2));
    }
    catch (err) {
        console.error("Error while testing AI Architect:", err);
        process.exit(1);
    }
}
main();
