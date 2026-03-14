"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
const razorpayService_1 = require("./services/razorpayService");
async function main() {
    try {
        console.log("Creating test freelancer linked account...");
        const accountId = await (0, razorpayService_1.createFreelancerAccount)("test-freelancer@example.com", "Test Freelancer");
        console.log("account_id:", accountId);
        console.log("\nCreating escrow order for 50000 paise (₹500)...");
        const order = await (0, razorpayService_1.createEscrowOrder)(500, accountId);
        const orderId = order.id;
        console.log("order_id:", orderId);
        const { transferIds } = await (0, razorpayService_1.fetchOrderWithTransfers)(orderId);
        const transferId = transferIds[0] ?? "N/A (created after payment capture)";
        console.log("transfer_id:", transferId);
    }
    catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}
main();
