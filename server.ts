import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Initialize Gemini Client server-side
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  // API endpoint for AI Astrophysics Assistant / Problem Solver
  app.post("/api/ai-solve", async (req, res) => {
    try {
      const { prompt, calculatorContext } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
      }

      const systemInstruction = `You are an expert Professor of Astronomy and Astrophysics at a top-tier research university, as well as an expert AI Cosmic Tutor. 
Provide clear, rigorous, educational, and scientifically accurate explanations, derivations, step-by-step problem-solving, and physical intuition.
If calculator context is provided (such as variable values and calculation results), analyze the values, explain what they physically imply in the universe (e.g., orbital stability, cosmological expansion rates, stellar evolution stage, event horizon size), and give fascinating astrophysical context. Use Markdown formatting with LaTeX math notation where appropriate.`;

      const fullPrompt = calculatorContext 
        ? `Context / Current Calculation State:\n${JSON.stringify(calculatorContext, null, 2)}\n\nUser Question / Request:\n${prompt}`
        : prompt;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: fullPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ result: response.text || "No response generated." });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate AI response." });
    }
  });

  // Vite middleware setup for development
  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`AstroCalc Pro server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
