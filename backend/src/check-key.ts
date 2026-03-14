import dotenv from 'dotenv';
dotenv.config();

console.log("--- Key Sanity Check ---");
const key = process.env.GEMINI_API_KEY;

if (!key) {
  console.log("❌ Error: GEMINI_API_KEY is missing from .env");
} else {
  console.log(`✅ Key found! Length: ${key.length} characters`);
  console.log(`Starts with: ${key.substring(0, 5)}...`);
  console.log(`Ends with: ...${key.substring(key.length - 3)}`);
}