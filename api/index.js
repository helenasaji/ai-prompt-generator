const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/generate', async (req, res) => {
    const { promptInstruction } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY; 

    if (!API_KEY) {
        return res.status(500).json({ error: "API key is missing on the server." });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptInstruction }] }]
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || "Google API Error");
        res.json({ result: data.candidates[0].content.parts[0].text });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CRITICAL FOR VERCEL: Export the app instead of app.listen()
module.exports = app;
