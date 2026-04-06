import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Session from "./models/session-model.js";

async function getSession() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const session = await Session.findOne();
        if (session) {
            console.log("VALID_SESSION_ID:", session._id.toString());
        } else {
            console.log("NO_SESSIONS_FOUND");
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

getSession();
