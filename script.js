// Main generator logic connecting to Vercel Backend
async function generatePrompt() {
    const category = document.getElementById('category').value;
    const subject = document.getElementById('idea').value.trim();
    const outputBox = document.getElementById('output-box');
    
    if (!subject) return alert("Please enter a subject first!");

    outputBox.innerText = "✨ AI is working its magic securely through Vercel...";

    const style = document.getElementById('style')?.value || "Not specified";
    const lighting = document.getElementById('lighting')?.value || "Not specified";
    const camera = document.getElementById('camera')?.value || "Not specified";

    const promptInstruction = `
        You are an expert prompt engineer. The user wants to generate a prompt for the category: ${category}. 
        Their raw idea is: "${subject}".
        Additional settings: Style="${style}", Lighting="${lighting}", Camera="${camera}".
        
        Your task:
        1. Fix any spelling or grammar mistakes.
        2. Expand the idea into a very long, highly detailed, and professional prompt (at least 75-100 words).
        3. If it is an image prompt, strictly include the requested camera angles, lighting conditions, and mood.
        4. Output ONLY the final generated prompt text. Do not talk to me, do not use markdown, just give me the raw text.
    `;

    try {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ promptInstruction: promptInstruction })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Backend Error");
        
        outputBox.innerText = data.result;
        saveHistory(data.result);

    } catch (error) {
        outputBox.innerText = "⚠️ Error connecting to backend: " + error.message;
        console.error(error);
    }
}

// Append enhancement keywords
function improvePrompt() {
    const current = document.getElementById('output-box').innerText;
    if (!current || current.includes("Your generated prompt") || current.includes("⚠️")) {
        return alert("Generate a valid prompt first!");
    }
    
    document.getElementById('output-box').innerText = current + " Make it highly detailed, professional, and visually stunning. Use best practices.";
}

// Clipboard copy logic
function copyPrompt() {
    const textToCopy = document.getElementById('output-box').innerText;
    if (textToCopy && !textToCopy.includes("⚠️") && !textToCopy.includes("✨")) {
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
