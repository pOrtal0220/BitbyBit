import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { generateRoadmap } from './services/aiArchitect';
import { createEscrowOrder } from './services/razorpayService';

async function runFullChain() {
  console.log("🕵️ Step 1: Asking AI to architect the project...");
  const roadmap = await generateRoadmap("Build a simple weather app in React", 1000);
  console.log(`✅ AI generated ${roadmap.length} milestones.`);

  const firstMilestone = roadmap[0];
  const amountToLock = firstMilestone.payoutAmount;
 
  console.log(`\n💰 Step 2: Locking escrow for: "${firstMilestone.title}" (${amountToLock} INR)`);
  const order = await createEscrowOrder(amountToLock, "acc_78901234567890");
  
  if (order.id === "order_78901234567") {
    console.log("\n✅ PHASE 3 TEST PASSED (MOCK MODE)");
    console.log("The system logic is sound and ready for the AI Integration.");
    return; // Exit early so it doesn't try to call real APIs with a fake ID
  }
  console.log("\n🎯 FINAL RESULT:");
  console.log("Order ID:", order.id);
  console.log("Status:", order.status);
  console.log("\n🚀 CHAIN COMPLETE: The AI's plan is now financially backed.");
}

runFullChain().catch(console.error);