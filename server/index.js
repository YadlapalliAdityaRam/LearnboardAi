const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");


async function startServer() {
    const app = express();
    const PORT = process.env.PORT || 5000;

    // Middleware
    app.use(cors());
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ extended: true, limit: "50mb" }));

    // Apollo Server setup
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await server.start();

    // GraphQL endpoint
    app.use("/graphql", expressMiddleware(server));

    // Root Route
    app.get("/", (req, res) => {
        res.status(200).send("LearnboardAI GraphQL Server Running");
    });

    app.get("/health", (req, res) => {
        res.status(200).send("OK");
    });

    // Error handler
    app.use((err, req, res, next) => {
        console.error("❌ Server error:", err.message);
        res.status(500).json({ error: err.message || "Internal server error" });
    });

    app.listen(PORT, () => {
        console.log("\n" + "=".repeat(55));
        console.log("🚀 LearnBoard AI Server (Express + GraphQL)");
        console.log("=".repeat(55));
        if (process.env.OPENROUTER_API_KEY) {
            console.log("✅ OpenRouter API key configured");
        } else {
            console.log("❌ OPENROUTER_API_KEY not set in .env!");
        }
        console.log(`\n📡 http://localhost:${PORT}/graphql`);
        console.log("=".repeat(55) + "\n");
    });
}

startServer().catch(console.error);
