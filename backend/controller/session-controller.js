import Question from "../models/question-model.js";
import Session from "../models/session-model.js";

// @desc    Create a new session and linked questions
// @route   POST /api/sessions/create
// @access  Private
export const createSession = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, description, questions = [] } =
      req.body;
    const userId = req.user._id;

    console.log(`AI SYSTEM: Creating new session for [${role}]... 📝`);

    // Create the session
    const session = await Session.create({
      user: userId,
      role: role || "Software Engineer",
      experience: experience || 0,
      topicsToFocus: topicsToFocus || "General",
      description: description || "",
    });

    // Create questions and collect their IDs if any were provided (usually empty at start)
    const questionDocs = await Promise.all(
      questions.map(async (q) => {
        const question = await Question.create({
          session: session._id,
          question: q.question,
          answer: q.answer || "No answer provided",
          note: q.note || "",
          isPinned: q.isPinned || false,
        });
        return question._id;
      }),
    );

    // Update session with question IDs
    if (questionDocs.length > 0) {
      session.questions = questionDocs;
      await session.save();
    }

    console.log(`AI SYSTEM: Session [${session._id}] created successfully! ✅`);
    res.status(201).json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error("AI SYSTEM: Create Session Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create session",
      error: error.message,
    });
  }
};

// @desc    Get all sessions for the logged-in user
// @route   GET /api/sessions/my-sessions
// @access  Private
export const getMySessions = async (req, res) => {
  try {
    const userId = req.user._id;

    const sessions = await Session.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("questions");

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error) {
    console.error("Get Sessions Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get a session by ID with populated questions
// @route   GET /api/sessions/:id
// @access  Private
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("questions")
      .populate("user", "name email");

    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    // Check if the session belongs to the logged-in user
    if (session.user._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error("Get Session Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

