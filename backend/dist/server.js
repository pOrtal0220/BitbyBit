"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_dns_1 = __importDefault(require("node:dns"));
node_dns_1.default.setServers(['8.8.8.8', '8.8.4.4']);
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in the environment variables");
}
const mongoUri = MONGODB_URI;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/projects", projectRoutes_1.default);
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
async function start() {
    try {
        await mongoose_1.default.connect(mongoUri);
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (err) {
        console.error("Failed to start server", err);
        process.exit(1);
    }
}
start();
