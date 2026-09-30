const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allows your frontend to communicate with this backend
app.use(express.json());

// Test route to ensure the server is running
app.get('/api/status', (req, res) => {
    res.json({ message: "Backend is running securely." });
});

// Future AI Generation Route
app.post('/api/generate', async (req, res) => {
    const { prompt } = req.body;
    
    // 1. You will take the prompt from the frontend
    // 2. Attach process.env.AI_API_KEY securely here
    // 3. Send the request to the AI provider
    // 4. Send the result back to the frontend
    
    res.json({ success: true, pending: "AI integration coming soon!" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

