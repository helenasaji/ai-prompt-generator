// Main AI generator logic
async function generatePrompt() {
    const category = document.getElementById('category').value;
    const subject = document.getElementById('idea').value.trim();
    const outputBox = document.getElementById('output-box');
    
    if (!subject) return alert("Please enter a subject first!");

    // Securely get the API key from the browser, or ask the user for it
    let API_KEY = localStorage.getItem("gemini_api_key");
    if (!API_KEY) {
        API_KEY = prompt("Enter your Gemini API Key to use the AI Generator:");
        if (!API_KEY) return alert("API Key is required to use the AI.");
        localStorage.setItem("gemini_api_key", API_KEY);
    }

    outputBox.innerText = "✨ AI is fixing grammar and expanding your prompt...";

    // Capture dropdown choices
    const style = document.getElementById('style')?.value || "Not specified";
    const lighting = document.getElementById('lighting')?.value || "Not specified";
    const camera = document.getElementById('camera')?.value || "Not specified";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    // Instruct the AI on exactly how to build the prompt
    const promptInstruction = `
        You are an expert prompt engineer. The user wants to generate a prompt for the category: ${category}. 
        Their raw idea is: "${subject}".
        Additional settings: Style="${style}", Lighting="${lighting}", Camera="${camera}".
        
        Your task:
        1. Fix any spelling or grammar mistakes in the raw idea.
        2. Expand the idea into a very long, highly detailed, and professional prompt (at least 75-100 words).
        3. If it is an image prompt, strictly include the requested camera angles, lighting conditions, and mood. Add standard negative prompts at the end.
        4. If it is a coding or JSON prompt, enforce strict industry best practices and clean structures.
        5. Output ONLY the final generated prompt text. Do not talk to me, do not use markdown, just give me the raw text.
    `;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptInstruction }] }]
            })
        });

        if (!response.ok) throw new Error("API Error");

        const data = await response.json();
        const aiGeneratedPrompt = data.candidates[0].content.parts[0].text;
        
        outputBox.innerText = aiGeneratedPrompt;
        saveHistory(aiGeneratedPrompt);

    } catch (error) {
        outputBox.innerText = "⚠️ Error connecting to AI. Your API key might be invalid.";
        localStorage.removeItem("gemini_api_key"); 
        console.error(error);
    }
}

// Append enhancement keywords manually
function improvePrompt() {
    const current = document.getElementById('output-box').innerText;
    if (!current || current.includes("✨") || current.includes("⚠️")) return alert("Generate a prompt first!");
    
    document.getElementById('output-box').innerText = current + " Make it highly detailed, professional, and visually stunning. Use best practices.";
}

// Clipboard copy logic
function copyPrompt() {
    const textToCopy = document.getElementById('output-box').innerText;
    if (textToCopy && !textToCopy.includes("✨")) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            const copyBtn = document.getElementById('copy-btn');
            copyBtn.innerText = "✓ Copied!";
            setTimeout(() => { copyBtn.innerText = "📋 Copy Prompt"; }, 2000);
        });
    }
}

// Save to localStorage
function saveHistory(promptText) {
    let history = JSON.parse(localStorage.getItem('promptHistory')) || [];
    history.unshift(promptText);
    
    if (history.length > 10) history.pop();
    
    localStorage.setItem('promptHistory', JSON.stringify(history));
    loadHistory();
}

// Load and display history list
function loadHistory() {
    const historyList = document.getElementById('history-list'); 
    if (!historyList) return;

    historyList.innerHTML = "";
    let history = JSON.parse(localStorage.getItem('promptHistory')) || [];

    history.forEach((savedItem) => {
        const li = document.createElement('li');
        li.innerText = savedItem.length > 40 ? savedItem.substring(0, 40) + "..." : savedItem;
        
        li.addEventListener('click', () => {
            document.getElementById('output-box').innerText = savedItem;
        });
        
        historyList.appendChild(li);
    });
}

// Attach event listeners on page load
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('generate-btn')?.addEventListener('click', generatePrompt);
    document.getElementById('improve-btn')?.addEventListener('click', improvePrompt);
    document.getElementById('copy-btn')?.addEventListener('click', copyPrompt);
    
    loadHistory();
});
