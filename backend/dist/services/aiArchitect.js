"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRoadmap = generateRoadmap;
const openai_1 = __importDefault(require("openai"));
const client = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
function roundTo2(n) {
    return Math.round((n + Number.EPSILON) * 100) / 100;
}
function validateMilestonesShape(milestones) {
    if (!Array.isArray(milestones)) {
        throw new Error("OpenAI response must be a JSON array");
    }
    if (milestones.length < 3 || milestones.length > 5) {
        throw new Error("OpenAI response must contain 3-5 milestones");
    }
    for (const [i, m] of milestones.entries()) {
        if (!m || typeof m !== "object")
            throw new Error(`Milestone[${i}] must be an object`);
        const mm = m;
        if (typeof mm.title !== "string" || mm.title.trim().length === 0) {
            throw new Error(`Milestone[${i}].title must be a non-empty string`);
        }
        if (typeof mm.payoutAmount !== "number" || !Number.isFinite(mm.payoutAmount) || mm.payoutAmount < 0) {
            throw new Error(`Milestone[${i}].payoutAmount must be a non-negative number`);
        }
        if (!Array.isArray(mm.definitionOfDone)) {
            throw new Error(`Milestone[${i}].definitionOfDone must be an array of strings`);
        }
        if (mm.definitionOfDone.length < 3 || mm.definitionOfDone.length > 5) {
            throw new Error(`Milestone[${i}].definitionOfDone must have 3-5 items`);
        }
        for (const [j, item] of mm.definitionOfDone.entries()) {
            if (typeof item !== "string" || item.trim().length === 0) {
                throw new Error(`Milestone[${i}].definitionOfDone[${j}] must be a non-empty string`);
            }
        }
    }
}
function normalizePayoutsToBudget(milestones, budget) {
    const normalized = milestones.map((m) => ({
        ...m,
        payoutAmount: roundTo2(m.payoutAmount),
    }));
    const sumAll = roundTo2(normalized.reduce((acc, m) => acc + m.payoutAmount, 0));
    const target = roundTo2(budget);
    if (sumAll === target)
        return normalized;
    const sumExceptLast = roundTo2(normalized.slice(0, -1).reduce((acc, m) => acc + m.payoutAmount, 0));
    const last = normalized[normalized.length - 1];
    const correctedLast = roundTo2(target - sumExceptLast);
    if (correctedLast < 0) {
        throw new Error("Milestone payouts exceed the total budget");
    }
    normalized[normalized.length - 1] = { ...last, payoutAmount: correctedLast };
    const verify = roundTo2(normalized.reduce((acc, m) => acc + m.payoutAmount, 0));
    if (verify !== target) {
        throw new Error("Failed to normalize milestone payouts to match budget exactly");
    }
    return normalized;
}
async function generateRoadmap(description, budget) {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is not set");
    }
    if (typeof description !== "string" || description.trim().length === 0) {
        throw new Error("description must be a non-empty string");
    }
    if (typeof budget !== "number" || !Number.isFinite(budget) || budget <= 0) {
        throw new Error("budget must be a positive number");
    }
    const prompt = [
        "You are a Senior Project Manager designing a milestone roadmap for a software project.",
        "Return ONLY a valid JSON array (no markdown, no prose) of 3 to 5 milestones.",
        "",
        "Each milestone object MUST match this TypeScript shape:",
        '{ "title": string, "payoutAmount": number, "definitionOfDone": string[] }',
        "",
        "- title: concise milestone name",
        "- payoutAmount: numeric amount for this milestone",
        "- definitionOfDone: an array of 3-5 technical requirements, written as short, testable statements",
        "",
        `Constraints:`,
        `- Total budget is ${budget}.`,
        `- The sum of payoutAmount across all milestones MUST equal exactly ${budget}.`,
        "- Do not include any extra keys.",
        "",
        `Project description: ${description}`,
    ].join("\n");
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: [{ role: "user", content: prompt }],
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "milestone_roadmap",
                strict: true,
                schema: {
                    type: "array",
                    minItems: 3,
                    maxItems: 5,
                    items: {
                        type: "object",
                        additionalProperties: false,
                        required: ["title", "payoutAmount", "definitionOfDone"],
                        properties: {
                            title: { type: "string", minLength: 1 },
                            payoutAmount: { type: "number", minimum: 0 },
                            definitionOfDone: {
                                type: "array",
                                minItems: 3,
                                maxItems: 5,
                                items: { type: "string", minLength: 1 },
                            },
                        },
                    },
                },
            },
        },
    });
    const content = response.choices[0]?.message?.content;
    if (!content)
        throw new Error("OpenAI returned an empty response");
    let parsed;
    try {
        parsed = JSON.parse(content);
    }
    catch {
        throw new Error("OpenAI did not return valid JSON");
    }
    validateMilestonesShape(parsed);
    return normalizePayoutsToBudget(parsed, budget);
}
