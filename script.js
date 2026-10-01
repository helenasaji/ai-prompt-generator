// 1. Basic History Save Function (prevents errors when called later)
function saveHistory(promptText) {
    let history = JSON.parse(localStorage.getItem('promptHistory')) || [];
    history.unshift(promptText);
    if (history.length > 5) history.pop(); // Keeps the last 5 prompts
    localStorage.setItem('promptHistory', JSON.stringify(history));
}

// 2. Main API Call & UI Logic
async function generatePrompt() {
    const format = document.getElementById('format').value;
    const subject = document.getElementById('idea').value.trim();
    const outputBox = document.getElementById('output-box');
    const generateBtn = document.getElementById('generate-btn');
    
    if (!subject) return alert("Please enter a subject first!");

    // Disable button & inject spinner state
    generateBtn.disabled = true;
    outputBox.innerHTML = `
        <div class="loading-state">
            <span class="spinner"></span>
            <span>Crafting prompt with Gemini...</span>
        </div>
    `;

    const style = document.getElementById('style')?.value || "Not specified";
    const lighting = document.getElementById('lighting')?.value || "Not specified";
    const camera = document.getElementById('camera')?.value || "Not specified";

    let promptInstruction = `
        You are an expert AI image prompt engineer. The user's raw idea is: "${subject}".
        Additional settings: Style="${style}", Lighting="${lighting}", Camera="${camera}".
        
        Your task:
        1. Fix any spelling or grammar mistakes.
        2. Expand the idea into a highly detailed, professional image generation prompt (at least 75-100 words).
        3. Strictly include the requested camera angles, lighting conditions, and mood.
    `;

    if (format === "JSON") {
        promptInstruction += `
        4. OUTPUT FORMAT: You must return the prompt ONLY as a valid, parsable JSON object. 
        Use this exact structure:
        {
            "prompt": "The detailed descriptive text here",
            "negative_prompt": "Things to avoid, bad quality, blurry, etc.",
            "style": "${style}",
            "lighting": "${lighting}",
            "camera": "${camera}"
        }
        Do NOT wrap the JSON in markdown blocks (no \`\`\`json). Return ONLY the raw JSON text.`;
    } else {
        promptInstruction += `
        4. OUTPUT FORMAT: Output ONLY the final generated prompt text as a plain paragraph. 
        Do not talk to me, do not use markdown, just give me the raw text.`;
    }

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
        outputBox.innerText = "⚠️ API Notice: " + error.message;
        console.error(error);
    } finally {
        generateBtn.disabled = false;
    }
}

// 3. Event Listener for the Generate Button
document.getElementById('generate-btn').addEventListener('click', generatePrompt);

// 4. Event Listener for the Copy Button
document.getElementById('copy-btn').addEventListener('click', async () => {
    const outputBox = document.getElementById('output-box');
    const copyBtn = document.getElementById('copy-btn');
    const textToCopy = outputBox.innerText;

    // Prevent copying if the box is empty, showing the placeholder, or currently loading
    if (!textToCopy || 
        textToCopy === "Your generated prompt will appear here..." || 
        textToCopy.includes("Crafting prompt")) {
        return; 
    }

    try {
        // Modern async clipboard API
        await navigator.clipboard.writeText(textToCopy);
        
        // Visual feedback
        copyBtn.innerText = "✅ Copied!";
        
        // Reset the button text after 2 seconds
        setTimeout(() => {
            copyBtn.innerText = "📋 Copy";
        }, 2000);
        
    } catch (err) {
        console.error("Failed to copy text: ", err);
        alert("Failed to copy text to clipboard. Your browser might block this feature.");
    }
});
