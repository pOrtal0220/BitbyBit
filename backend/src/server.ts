import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import projectRoutes from "./routes/projectRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in the environment variables");
}
const mongoUri: string = MONGODB_URI;

app.use(cors());
app.use(express.json());

app.use("/api/projects", projectRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

async function start() {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
}

start();

