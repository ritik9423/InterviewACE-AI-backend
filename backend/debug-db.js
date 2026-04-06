import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const testConnection = async () => {
    console.log("AI SYSTEM: Testing Database Connection...");
    console.log("URI being used:", process.env.MONGODB_URI ? "Found ✅" : "NOT FOUND ❌");
    
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log("AI SYSTEM: Success! Database connected perfectly. ✅");
        process.exit(0);
    } catch (error) {
        console.error("AI SYSTEM: ERROR DETECTED! ❌");
        console.error("Message:", error.message);
        if (error.message.includes("authentication failed")) {
            console.error("HINT: Aapka Password galat hai! Check local .env line 2.");
        } else if (error.message.includes("querySrv ETIMEOUT") || error.message.includes("selection timeout")) {
            console.error("HINT: Aapka Internet slow hai ya MongoDB Atlas mein 'IP Whitelist' nahi hai.");
        }
        process.exit(1);
    }
};

testConnection();
