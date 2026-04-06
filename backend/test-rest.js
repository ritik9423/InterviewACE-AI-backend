import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

async function test() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        // Trying 'v1' instead of 'v1beta'
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        
        console.log("Testing REST API approach (v1)...");
        const response = await axios.post(url, {
            contents: [{ parts: [{ text: "Say 'REST API (v1) is working!'" }] }]
        });
        
        console.log("Success:", response.data.candidates[0].content.parts[0].text);
        process.exit(0);
    } catch (e) {
        console.error("Failure:", e.response?.data?.error?.message || e.message);
        process.exit(1);
    }
}

test();
