import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";
import Question from "../models/question-model.js";
import Session from "../models/session-model.js";
import {
  conceptExplainPrompt,
  questionAnswerPrompt,
  evaluateAnswerPrompt,
} from "../utils/prompts-util.js";

// AI SYSTEM: Initialize Gemini globally to ensure all functions can access it
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

/**
 * Robust helper to try multiple Gemini models in order of preference.
 * This ensures "it just works" even if some models are 404/Not Found.
 */
const callGeminiWithFallback = async (prompt) => {
  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-pro"];
  let lastError;
  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      // Trigger a check to see if text() works (catches most errors)
      response.text();
      console.log(`AI SYSTEM: Successfully used model [${modelName}] ✅`);
      return result;
    } catch (err) {
      lastError = err;
      console.warn(`AI SYSTEM: Model [${modelName}] failed. Trying next... 🔄`);
    }
  }
  throw lastError;
};

// @desc    Generate + SAVE interview questions for a session
// @route   POST /api/ai/generate-questions
// @access  Private
export const generateInterviewQuestions = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: "sessionId is required" });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    const { role, experience, topicsToFocus } = session;
    const prompt = questionAnswerPrompt(role, experience, topicsToFocus, 5); 
    
    // Call AI with robust fallback system
    const result = await callGeminiWithFallback(prompt);
    const response = await result.response;
    const rawText = response.text();

    // High-class JSON cleaning
    const cleanedText = rawText
      .replace(/^```json\s*/, "")
      .replace(/^```\s*/, "")
      .replace(/```$/, "")
      .replace(/^json\s*/, "")
      .trim();

    let questions;
    try {
      questions = JSON.parse(cleanedText);
    } catch {
      const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
      if (jsonMatch) questions = JSON.parse(jsonMatch[0]);
      else throw new Error("AI returned invalid JSON format");
    }

    // Save questions
    const saved = await Question.insertMany(
      questions.map((q) => ({
        session: sessionId,
        question: q.question,
        answer: q.answer || "",
      }))
    );

    // Link to session
    session.questions.push(...saved.map((q) => q._id));
    await session.save();

    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    console.error("Generate Questions Error:", error);
    res.status(500).json({ success: false, message: "AI Generation failed", error: error.message });
  }
};

// @desc    Evaluate a candidate's answer
// @route   POST /api/ai/evaluate-answer
// @access  Private
export const evaluateAnswer = async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ success: false, message: "Question and Answer are required" });
    }

    const prompt = evaluateAnswerPrompt(question, answer);
    
    // Call AI with robust fallback system
    const result = await callGeminiWithFallback(prompt);
    const response = await result.response;
    const rawText = response.text();
    console.log("AI SYSTEM: Raw evaluation text:", rawText);

    let evaluation;
    try {
      // Robust JSON extraction
      const jsonStart = rawText.indexOf('{');
      const jsonEnd = rawText.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonStr = rawText.substring(jsonStart, jsonEnd + 1);
        evaluation = JSON.parse(jsonStr);
      } else {
        throw new Error("No JSON object found in AI response");
      }
    } catch (parseError) {
      console.error("AI SYSTEM: JSON Parse Error:", parseError);
      console.error("AI SYSTEM: Cleaned text was:", rawText);
      throw new Error("Failed to parse AI evaluation response");
    }

    res.status(200).json({ success: true, data: evaluation });
  } catch (error) {
    console.error("AI SYSTEM: Evaluation Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "AI Evaluation failed", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Generate explanation for an interview question
// @route   POST /api/ai/generate-explanation
// @access  Private
export const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ success: false, message: "Question is required" });
    }

    const prompt = conceptExplainPrompt(question);
    
    // Call AI with robust fallback system
    const result = await callGeminiWithFallback(prompt);
    const response = await result.response;
    const rawText = response.text();

    const cleanedText = rawText
      .replace(/^```json\s*/, "")
      .replace(/^```\s*/, "")
      .replace(/```$/, "")
      .replace(/^json\s*/, "")
      .trim();

    const explanation = JSON.parse(cleanedText);
    res.status(200).json({ success: true, data: explanation });
  } catch (error) {
    console.error("Explanation Error:", error);
    res.status(500).json({ success: false, message: "AI Explanation failed", error: error.message });
  }
};

// @desc    Get Session by ID with questions
// @route   GET /api/ai/session/:id
// @access  Private
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("questions")
      .populate("user", "name email");

    if (!session) return res.status(404).json({ success: false, message: "Session not found" });

    // Authorization check
    if (session.user._id.toString() !== req.user._id.toString()) {
       return res.status(403).json({ success: false, message: "Unauthorized access to this session" });
    }

    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch session", error: error.message });
  }
};
