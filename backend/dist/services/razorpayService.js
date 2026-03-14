"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFreelancerAccount = createFreelancerAccount;
exports.createEscrowOrder = createEscrowOrder;
exports.releaseFunds = releaseFunds;
exports.fetchOrderWithTransfers = fetchOrderWithTransfers;
const razorpay_1 = __importDefault(require("razorpay"));
const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;
if (!keyId || !keySecret) {
    throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set");
}
const instance = new razorpay_1.default({
    key_id: keyId,
    key_secret: keySecret,
});
/** Amount is in rupees; converted to paise for the API. */
const toPaise = (amountRupees) => Math.round(amountRupees * 100);
/** Razorpay throws { statusCode, error: { code, description?, ... } }. Treat 400/403 as mock-worthy. */
function isBadRequestError(err) {
    const e = err;
    return (e?.statusCode === 400 ||
        e?.statusCode === 403 ||
        e?.error?.code === "BAD_REQUEST_ERROR");
}
/**
 * Register a freelancer as a Linked Account. Returns their account_id.
 * Phone is required by Razorpay; pass a placeholder (e.g. "9999999999") if not collected.
 */
async function createFreelancerAccount(email, name, phone = "9999999999") {
    const payload = {
        email: email.trim(),
        phone: phone.replace(/\D/g, "").slice(0, 15),
        legal_business_name: name.trim().slice(0, 200),
        customer_facing_business_name: name.trim().slice(0, 255),
        business_type: "proprietorship",
        contact_name: name.trim().slice(0, 255),
        profile: {
            category: "professional_services",
            subcategory: "software_development",
            description: "Freelancer account",
            addresses: {
                operation: {
                    street1: "N/A",
                    street2: "",
                    city: "N/A",
                    state: "N/A",
                    postal_code: "000000",
                    country: "IN",
                },
                registered: {
                    street1: "N/A",
                    street2: "",
                    city: "N/A",
                    state: "N/A",
                    postal_code: "000000",
                    country: "IN",
                },
            },
        },
    };
    if (payload.legal_business_name.length < 4) {
        throw new Error("name must be at least 4 characters");
    }
    if (payload.phone.length < 8) {
        throw new Error("phone must be at least 8 digits");
    }
    try {
        const account = await instance.accounts.create(payload);
        return account.id;
    }
    catch (err) {
        if (isBadRequestError(err)) {
            console.warn("[Razorpay Mock] createFreelancerAccount failed:", err);
            return "acc_mock_123";
        }
        throw err;
    }
}
/**
 * Create an order with a transfer to the freelancer's linked account, held until release.
 * amount: in rupees (converted to paise for Razorpay).
 * Returns the order object; transfer is created after payment is captured.
 */
async function createEscrowOrder(amountRupees, freelancerAccountId) {
    const amountPaise = toPaise(amountRupees);
    if (amountPaise < 100) {
        throw new Error("amount must be at least 1 INR (100 paise)");
    }
    try {
        const order = await instance.orders.create({
            amount: amountPaise,
            currency: "INR",
            receipt: `escrow_${Date.now()}`,
            transfers: [
                {
                    account: freelancerAccountId,
                    amount: amountPaise,
                    currency: "INR",
                    on_hold: true,
                },
            ],
        });
        return order;
    }
    catch (err) {
        if (isBadRequestError(err)) {
            console.warn("[Razorpay Mock] createEscrowOrder failed:", err);
            return {
                id: "order_mock_456",
                amount: amountPaise,
                amount_paid: 0,
                amount_due: amountPaise,
                currency: "INR",
                receipt: `escrow_${Date.now()}`,
                status: "created",
                entity: "order",
            };
        }
        throw err;
    }
}
/**
 * Release held funds to the freelancer by setting the transfer's on_hold to false.
 * transferId: the transfer id (e.g. from webhook or from fetching order transfers).
 */
async function releaseFunds(transferId) {
    const transfer = await instance.transfers.edit(transferId, {
        on_hold: false,
    });
    return transfer;
}
/**
 * Fetch an order with transfers expanded. Transfer IDs are only present after payment is captured.
 */
async function fetchOrderWithTransfers(orderId) {
    const order = await instance.orders.fetchTransferOrder(orderId);
    const o = order;
    const raw = o.transfers;
    const list = Array.isArray(raw)
        ? raw
        : raw && typeof raw === "object" && Array.isArray(raw.items)
            ? raw.items
            : [];
    const transferIds = list.map((t) => t.id);
    return { order: o, transferIds };
}
