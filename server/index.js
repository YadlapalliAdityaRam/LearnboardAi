const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Enable CORS for frontend (Allow all for now, or specify Netlify URL later)
app.use(cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL || "*"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Routes
app.use("/api/lessons", require("./routes/lessons"));
app.use("/api/quiz", require("./routes/quiz"));
app.use("/api/flashcards", require("./routes/flashcards"));
app.use("/api/tutor", require("./routes/tutor"));

// Root Route - To verify the server is running on Render
app.get("/", (req, res) => {
    res.status(200).send("LearnboardAI Backend Running");
});

// Simple Health Check Route required by some Render configurations
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

// Detailed API Health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        apiConfigured: !!process.env.OPENROUTER_API_KEY,
        model: require("./config/ai").GEMINI_MODEL,
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error("❌ Server error:", err.message);
    res.status(500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, () => {
    console.log("\n" + "=".repeat(55));
    console.log("🚀 LearnBoard AI Server (Express)");
    console.log("=".repeat(55));
    if (process.env.OPENROUTER_API_KEY) {
        console.log("✅ OpenRouter API key configured");
    } else {
        console.log("❌ OPENROUTER_API_KEY not set in .env!");
    }
    console.log(`\n📡 http://localhost:${PORT}`);
    console.log("=".repeat(55) + "\n");
});
