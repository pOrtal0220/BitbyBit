import dotenv from "dotenv";
dotenv.config();
import { generateRoadmap } from "./services/aiArchitect";

dotenv.config();

async function main() {
  try {
    const description = "Python script to scrape real estate data";
    const budget = 500;

    console.log("Requesting AI roadmap...");
    console.log({ description, budget });

    const roadmap = await generateRoadmap(description, budget);

    console.log("\nGenerated roadmap:");
    console.log(JSON.stringify(roadmap, null, 2));
  } catch (err) {
    console.error("Error while testing AI Architect:", err);
    process.exit(1);
  }
}

main();

