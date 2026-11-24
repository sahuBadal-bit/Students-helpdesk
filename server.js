
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.PORT || 3000;

// Check API key
if (!process.env.GEMINI_API_KEY) {
  console.error("ERROR: GEMINI_API_KEY is missing from your .env file");
  process.exit(1);
}

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.use(express.json());
app.use(cors());

// Home
app.get("/", (req, res) => {
  res.send("CampusAI Gemini Backend is running 🚀");
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    project: "CampusAI",
    status: "Backend Online",
    ai: "Gemini Connected"
  });
});

// AI Chat API
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      success: false,
      error: "Please enter a message."
    });
  }

  try {
    const prompt = `
You are CampusAI, a friendly and helpful college student helpdesk assistant.

Your purpose:
- Help students with exams, timetables, attendance, admissions, scholarships, fees, documents, college facilities, and general academic questions.
- Explain things clearly in simple student-friendly language.
- Be polite, supportive, and concise.
- Use bullet points when they make an answer easier to understand.
- If you are unsure about a college-specific rule, date, fee, deadline, or official policy, do not invent it. Tell the student to verify it with the official college notice or office.
- You can also answer general knowledge and study questions.
- Never pretend you have access to private student records or live college data.

Student question:
${message.trim()}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt
    });

    const reply =
      response.text ||
      "Sorry, I couldn't generate a response. Please try again.";

    res.json({
      success: true,
      reply: reply
    });

  } catch (error) {
    console.error("Gemini API error:", error.message);

    res.status(500).json({
      success: false,
      error: "CampusAI AI is temporarily unavailable. Please try again."
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`CampusAI Gemini backend running at http://localhost:${PORT}`);
});
