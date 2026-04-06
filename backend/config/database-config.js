import mongoose from "mongoose";

let cachedConnection = null;

// Disable buffering to catch connection errors immediately
mongoose.set('bufferCommands', false);

export const connectDB = async () => {
    if (cachedConnection) {
        console.log("AI SYSTEM: Using cached MongoDB connection ✅");
        return cachedConnection;
    }

    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }

        console.log("AI SYSTEM: Connecting to MongoDB Atlas... 🔄");
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 8000, // Slightly more time for cold starts
            maxPoolSize: 1, // Crucial for serverless functions
            socketTimeoutMS: 45000,
        });
        
        cachedConnection = conn;
        console.log(`AI SYSTEM: MongoDB Connected: ${conn.connection.host} ✅`);
        return conn;
    } catch (error) {
        console.error(`AI SYSTEM: MongoDB Connection Error ❌: ${error.message}`);
        throw error;
    }
};
