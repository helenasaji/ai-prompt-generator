module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { promptInstruction } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY; 

    if (!API_KEY) {
        return res.status(500).json({ error: "API key is missing on the server." });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptInstruction }] }]
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            return res.status(500).json({ error: data.error?.message || "Google API Error" });
        }
        return res.status(200).json({ result: data.candidates[0].content.parts[0].text });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
