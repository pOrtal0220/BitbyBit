# BitbyBit
🛡️ Cognizance: Autonomous AI Escrow & Project Architect
Cognizance is a decentralized project management and escrow platform that replaces human project managers with autonomous AI Agents. It uses the Gemini 1.5 Flash model to architect project roadmaps and audit code submissions, ensuring that payments are only released when technical requirements are met.

🚀 The Problem
Human-managed freelancing suffers from:

Scope Creep: Vague requirements lead to disputes.

Payment Anxiety: Freelancers fear not getting paid; employers fear poor quality.

Manual Audits: Reviewing code manually is slow and subjective.

💡 The Solution (The "Agentic" Loop)
Cognizance automates the entire lifecycle:

AI Architect: Gemini takes a prompt and generates a 3-5 step technical roadmap with specific "Definitions of Done."

Autonomous Escrow: Funds are locked in a digital vault upon project launch.

AI Auditor: A specialized Quality Agent scans GitHub repositories to verify code logic against the roadmap.

Instant Disbursement: Funds are released milestone-by-milestone without human intervention once the AI approves the work.

🛠️ Technical Stack
Frontend: React.js, Tailwind CSS, Lucide Icons, Framer Motion

Backend: Node.js, Express, TypeScript

AI Engine: Google Gemini 1.5 Flash (via @google/generative-ai)

Database: MongoDB (Mongoose ODM)

Styling: Custom "Terminal-Dark" and "Enterprise-Light" themes

🏗️ System Architecture
Employer Instance: Launches projects, approves AI-generated roadmaps, and locks capital.

Freelancer Instance: Explores the market for "Funded" contracts, claims tasks, and submits code for AI review.

AI Node (The Brain): * Architect Service: aiArchitect.ts (Generative roadmap logic)

Audit Service: qualityAgent.ts (Semantic code analysis)

🛠️ Installation & Setup
Prerequisites
Node.js (v18+)

MongoDB Atlas account

Google AI (Gemini) API Key

1. Clone the Repository
Bash
git clone https://github.com/your-username/cognizance.git
cd cognizance
2. Backend Setup
Bash
cd backend
npm install
# Create a .env file
PORT=5000
MONGODB_URI=your_mongodb_uri
GEMINI_API_KEY=your_gemini_key
npm run dev
3. Frontend Setup
Bash
cd frontend
npm install
# Ensure api.js points to http://localhost:5000/api
npm run dev
📺 Demo Flow
Login: Choose "Employer" or "Freelancer" persona.

Architect: (Employer) Input "Build a React Weather App" → AI generates 3 specific milestones.

Fund: (Employer) Lock 5000 INR into the Escrow Vault.

Claim: (Freelancer) See the project appear in "Explore" and claim it.

Audit: (Freelancer) Paste a GitHub URL → AI Auditor verifies requirements → Milestone turns green → Confetti!

📜 License
This project was built for the Cognizance Hackathon 2026. Distributed under the MIT License.
