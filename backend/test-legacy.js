import dotenv from "dotenv";
dotenv.config();
import https from "https";

async function testLegacy() {
    return new Promise((resolve, reject) => {
        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        
        const data = JSON.stringify({
            contents: [{ parts: [{ text: "Say 'LEGACY HTTPS IS WORKING!'" }] }]
        });

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        console.log("Testing LEGACY HTTPS approach...");
        const req = https.request(url, options, (res) => {
            let body = '';
            res.on('data', (d) => body += d);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    if (res.statusCode !== 200) {
                        reject(new Error(parsed.error?.message || `Status: ${res.statusCode}`));
                    } else {
                        resolve(parsed.candidates?.[0]?.content?.parts?.[0]?.text);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
}

testLegacy().then(t => {
    console.log("Success:", t);
    process.exit(0);
}).catch(e => {
    console.error("Failure:", e.message);
    process.exit(1);
});
