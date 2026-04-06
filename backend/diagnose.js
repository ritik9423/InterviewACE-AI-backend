import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

async function diagnose() {
    const rawKeys = process.env.GEMINI_API_KEY || "";
    const apiKeys = rawKeys.split(",").map(k => k.trim()).filter(k => k.length > 0);
    
    console.log(`Diagnostic: Found ${apiKeys.length} keys in .env\n`);
    
    for (let i = 0; i < apiKeys.length; i++) {
        const key = apiKeys[i];
        console.log(`Checking Key ${i+1}: [${key.slice(0, 8)}...${key.slice(-4)}]`);
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
            const res = await axios.post(url, { contents: [{ parts: [{ text: "hi" }] }] });
            console.log(`   - Status: OK ✅`);
        } catch (e) {
            const msg = e.response?.data?.error?.message || e.message;
            console.log(`   - Status: FAILED ❌ (${msg})`);
        }
    }
}

diagnose();
