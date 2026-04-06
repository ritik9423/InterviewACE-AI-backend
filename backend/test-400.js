import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

async function test400() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        
        console.log("Testing 2.0 with JSON mode...");
        const response = await axios.post(url, {
            contents: [{ parts: [{ text: "Return a JSON object: {'hi': 'there'}" }] }],
            generationConfig: {
                responseMimeType: "application/json"
            }
        });
        
        console.log("Success:", response.data.candidates[0].content.parts[0].text);
        process.exit(0);
    } catch (e) {
        console.error("400 Error Response:", e.response?.data?.error || e.message);
        process.exit(1);
    }
}

test400();
