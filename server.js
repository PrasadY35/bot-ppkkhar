import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Enable CORS to allow requests from your GitHub Pages site
app.use(cors({
    origin: "*",  // Change this to your exact frontend URL if needed
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// ✅ Test Route: Check if backend is running
app.get("/", (req, res) => {
    res.json({ message: "✅ AI Backend is Running! 🚀" });
});

// ✅ AI Chat Route
app.post("/ask", async (req, res) => {
    try {
        const userMessage = req.body.message;
        if (!userMessage) {
            return res.status(400).json({ error: "Message is required!" });
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "OpenAI API Key is missing!" });
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userMessage }]
            })
        });

        const data = await response.json();

        if (!data.choices || data.choices.length === 0) {
            return res.status(500).json({ error: "Invalid response from OpenAI!" });
        }

        res.json({ reply: data.choices[0].message.content });

    } catch (error) {
        console.error("🔥 AI Error:", error);
        res.status(500).json({ error: "Something went wrong!" });
    }
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
