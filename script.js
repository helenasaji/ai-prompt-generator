// Prompt templates and categories
const promptCategories = ["image", "coding", "writing", "data", "study"];

const promptTemplates = {
    image: "Create a {style} image of {subject}. Lighting: {lighting}. Camera: {camera}. Mood: {mood}.",
    coding: "Act as an expert developer. Write a {language} script to {subject}. Ensure it is optimized and commented.",
    writing: "Write a {tone} piece about {subject}. Format it clearly."
};

// Main generator logic
function generatePrompt() {
    const category = document.getElementById('category').value;
    const subject = document.getElementById('idea').value.trim();
    
    if (!subject) {
        alert("Please enter a subject first!");
        return;
    }

    let finalPrompt = "";

    if (category === "image") {
        const style = document.getElementById('style')?.value || "standard";
        const lighting = document.getElementById('lighting')?.value || "natural";
        
        finalPrompt = promptTemplates.image
            .replace('{subject}', subject)
            .replace('{style}', style)
            .replace('{lighting}', lighting);
            
        finalPrompt += "\n\n" + generateNegativePrompt();
    } else {
        finalPrompt = `Please help me with the following: ${subject}`;
    }

    document.getElementById('output-box').innerText = finalPrompt;
    saveHistory(finalPrompt);
}

// Append enhancement keywords
function improvePrompt() {
    const currentPrompt = document.getElementById('output-box').innerText;
    
    if (!currentPrompt || currentPrompt.includes("Your generated prompt")) {
        alert("Generate a prompt first before improving it!");
        return;
    }

    const enhancedPrompt = currentPrompt + " Make it highly detailed, professional, and visually stunning. Use best practices.";
    document.getElementById('output-box').innerText = enhancedPrompt;
}

// Default image negative tags
function generateNegativePrompt() {
    return "Negative prompt: blurry, low quality, distorted, oversaturated, deformed, text, watermark.";
}

// Clipboard copy logic
function copyPrompt() {
    const textToCopy = document.getElementById('output-box').innerText;
    
    if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            const copyBtn = document.getElementById('copy-btn');
            copyBtn.innerText = "✓ Copied!";
            setTimeout(() => { copyBtn.innerText = "📋 Copy Prompt"; }, 2000);
        });
    }
}

// Save to localStorage (max 10 items)
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
