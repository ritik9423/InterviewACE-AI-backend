import dotenv from "dotenv";
dotenv.config();

import https from "https";
import Question from "../models/question-model.js";
import Session from "../models/session-model.js";
import {
  conceptExplainPrompt,
  questionAnswerPrompt,
  evaluateAnswerPrompt,
} from "../utils/prompts-util.js";

/**
 * Standard Node https wrapper for stable Gemini REST calls on Windows.
 * This avoids the 'libuv assertion' crashes found in SDKs/fetch engines.
 */
const callGeminiREST = (url, data) => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      },
      timeout: 60000 // 60s timeout for complex AI generation
    };

    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 400) {
            const errorMsg = parsed.error?.message || `API Error: ${res.statusCode}`;
            const error = new Error(errorMsg);
            error.statusCode = res.statusCode;
            reject(error);
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(new Error("Neural Link Data Corruption: Invalid JSON response."));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.on('timeout', () => {
        req.destroy();
        reject(new Error("Neural Link Timed Out: AI is unresponsive."));
    });
    req.write(postData);
    req.end();
  });
};

/**
 * Robust helper to try multiple Gemini models in order of preference.
 * Supports multiple API keys (comma-separated in GEMINI_API_KEY) for rotation.
 */
const callGeminiWithFallback = async (prompt) => {
  // Ordered by speed/reliability for the free tier
  const models = [
    { name: "gemini-2.0-flash", version: "v1beta" },
    { name: "gemini-2.5-flash", version: "v1beta" },
    { name: "gemini-2.5-pro", version: "v1beta" },
    { name: "gemini-2.0-flash-lite", version: "v1beta" },
    { name: "gemini-2.5-flash-lite", version: "v1beta" }
  ];

  const rawKeys = process.env.GEMINI_API_KEY || "";
  const apiKeys = rawKeys.split(",").map(k => k.trim()).filter(k => k.length > 0);
  
  if (apiKeys.length === 0) throw new Error("No Gemini API Keys found.");

  let lastError;
  const MAX_RETRIES_PER_MODEL = 2;

  for (let kIdx = 0; kIdx < apiKeys.length; kIdx++) {
    const apiKey = apiKeys[kIdx];
    
    for (const modelConfig of models) {
      const { name, version } = modelConfig;

      for (let attempt = 0; attempt < MAX_RETRIES_PER_MODEL; attempt++) {
        try {
          console.log(`AI SYSTEM: Syncing [${kIdx + 1}/${apiKeys.length}] | Model [${name}] | Attempt ${attempt + 1} ⚡`);
          const url = `https://generativelanguage.googleapis.com/${version}/models/${name}:generateContent?key=${apiKey}`;
          
          const payload = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.8,
              topK: 64,
              topP: 0.95,
              maxOutputTokens: 8192,
              responseMimeType: "application/json"
            }
          };

          const response = await callGeminiREST(url, payload);
          const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;
          
          if (!text) throw new Error("AI returned empty content.");
          
          console.log(`AI SYSTEM: Success with [${name}] ✅`);
          return text;
        } catch (err) {
          lastError = err;
          const isRateLimited = err.statusCode === 429 || err.message?.toLowerCase().includes("quota");
          const isHighDemand = err.statusCode === 503 || err.message?.toLowerCase().includes("high demand");
          const isNotFound = err.statusCode === 404 || err.message?.toLowerCase().includes("not found");

          if (isNotFound) {
            console.warn(`AI SYSTEM: [${name}] not available for this key. Skipping...`);
            break; // Skip this model instantly (no delay)
          }

          if (isRateLimited || isHighDemand) {
            if (attempt < MAX_RETRIES_PER_MODEL - 1) {
                console.warn(`AI SYSTEM: [${name}] busy. Cooling down 3s...`);
                await new Promise(r => setTimeout(r, 3000));
                continue; 
            }
          }
          
          console.warn(`AI SYSTEM: [${name}] exhausted. Trying next fallback...`);
          await new Promise(r => setTimeout(r, 1000)); // Short gap
          break; 
        }
      }
    }
  }
  throw lastError;
};

// @desc    Generate + SAVE interview questions for a session
// @route   POST /api/ai/generate-questions
export const generateInterviewQuestions = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ success: false, message: "sessionId is required" });

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ success: false, message: "Session track not found" });

    const prompt = questionAnswerPrompt(session.role, session.experience, session.topicsToFocus, 10); 
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ success: false, message: "Gemini API Key missing in environment." });
    }

    console.log(`AI SYSTEM: Building Neural Matrix for session [${sessionId}]... 🤖`);
    const rawText = await callGeminiWithFallback(prompt);

    // Robust JSON Extraction
    let cleanedText = rawText.trim();
    // Only strip outer markdown blocks if they exist
    if (cleanedText.startsWith("```json")) cleanedText = cleanedText.replace(/^```json/, "");
    if (cleanedText.endsWith("```")) cleanedText = cleanedText.replace(/```$/, "");
    
    // Find the actual boundaries of the JSON array
    const firstBracket = cleanedText.indexOf("[");
    const lastBracket = cleanedText.lastIndexOf("]");
    if (firstBracket === -1 || lastBracket === -1) throw new Error("Invalid AI Response: JSON array not found.");
    cleanedText = cleanedText.substring(firstBracket, lastBracket + 1);

    const questions = JSON.parse(cleanedText);
    if (!Array.isArray(questions)) throw new Error("Invalid matrix structure: Array expected.");

    const validQuestions = questions.filter(q => q.question).map((q) => ({
        session: sessionId,
        question: q.question,
        answer: q.answer || "No suggested answer provided.",
    }));

    const saved = await Question.insertMany(validQuestions);
    session.questions.push(...saved.map((q) => q._id));
    await session.save();

    console.log("AI SYSTEM: Neural Link Synchronization Successful! ✅");
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    console.error("AI SYSTEM: Matrix Generation Failure:", error.message);
    
    let statusCode = error.statusCode || 500;
    let userFriendlyMessage = error.message || "AI Matrix Generation failed.";
    
    if (statusCode === 401) userFriendlyMessage = "AI Link Failed: Your Gemini API Key is invalid.";
    if (statusCode === 429) userFriendlyMessage = "Critical Neural Overload: System is rotating keys. Please wait 10s and try again.";
    if (statusCode === 503) userFriendlyMessage = "Grid Instability: AI High Demand. Please try again in 30s.";
    
    res.status(statusCode).json({ success: false, message: userFriendlyMessage });
  }
};

// ... (other functions: evaluateAnswer, generateConceptExplanation, getSessionById)
// Keeping the same direct REST/https pattern for all to ensure stability.

export const evaluateAnswer = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const prompt = evaluateAnswerPrompt(question, answer);
    const rawText = await callGeminiWithFallback(prompt);
    
    const jsonStart = rawText.indexOf('{');
    const jsonEnd = rawText.lastIndexOf('}');
    const evaluation = JSON.parse(rawText.substring(jsonStart, jsonEnd + 1));

    res.status(200).json({ success: true, data: evaluation });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: "Neural Evaluation failed", error: error.message });
  }
};

export const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;
    const prompt = conceptExplainPrompt(question);
    const rawText = await callGeminiWithFallback(prompt);

    const firstBrace = rawText.indexOf('{');
    const lastBrace = rawText.lastIndexOf('}');
    const explanation = JSON.parse(rawText.substring(firstBrace, lastBrace + 1));

    res.status(200).json({ success: true, data: explanation });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: "AI Explanation failed", error: error.message });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate("questions").populate("user", "name email");
    if (!session) return res.status(404).json({ success: false, message: "Session track unavailable." });

    const sessionUserId = session.user?._id || session.user;
    const currentUserId = req.user?._id || req.user;

    if (!sessionUserId || sessionUserId.toString() !== currentUserId.toString()) {
       return res.status(403).json({ success: false, message: "Unauthorized access detected." });
    }
    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: "Neural Link Synchronization Failure.", error: error.message });
  }
};
