import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

async function listModels() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
        
        console.log("Listing models...");
        const response = await axios.get(url);
        
        console.log("Models found:", response.data.models.map(m => m.name));
        process.exit(0);
    } catch (e) {
        console.error("Failure:", e.response?.data?.error?.message || e.message);
        process.exit(1);
    }
}

listModels();
