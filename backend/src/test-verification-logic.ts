import { getRepoContent } from "./services/githubService";
import { auditCodeSubmission } from "./services/qualityAgent";

async function runVerificationTest() {
  console.log("🚀 Testing Autonomous Verification...");

  // 1. Fetch code from a real public repo (Octocat's example)
  const code = await getRepoContent("https://github.com/octocat/Spoon-Knife", "README.md");
  console.log("✅ Code fetched from GitHub.");

  // 2. Mock requirements
  const requirements = ["Must contain the words Spoon and Knife", "Must be a Markdown file"];

  // 3. Ask the AI Judge
  console.log("🤖 AI Agent is auditing the work...");
  const audit = await auditCodeSubmission(code as string, requirements);
  
  console.log("\n--- AUDIT RESULT ---");
  console.log("Status:", audit.pass ? "PASSED ✅" : "FAILED ❌");
  console.log("Feedback:", audit.feedback);
}

runVerificationTest();