// Prompt templates
const promptTemplates = {
    image: "Create a highly detailed, breathtaking cinematic masterpiece featuring {subject}. Style: {style}. Lighting: {lighting}. Ensure the visual composition is flawless, utilizing professional framing and high resolution.",
    coding: "Act as a senior software engineer. Write a clean, highly optimized, and bug-free script for the following request: {subject}. Include detailed comments explaining the core logic, handle potential edge cases, and ensure industry best practices.",
    writing: "Act as an expert copywriter. Write a compelling, comprehensive, and grammatically flawless piece about: {subject}. Ensure the tone is engaging, the paragraphs are logically structured, and the vocabulary is rich.",
    json: "Act as a backend data generator. Create a highly structured, valid JSON object for the following request: {subject}. Ensure the keys are logically named and nested correctly. Output STRICTLY the JSON data block without any conversational text."
};

// Main generator logic
function generatePrompt() {
    const category = document.getElementById('category').value;
    const subject = document.getElementById('idea').value.trim();
    
    if (!subject) return alert("Please enter a subject first!");

    let finalPrompt = "";

    if (category === "image") {
        const style = document.getElementById('style')?.value || "photorealistic";
        const lighting = document.getElementById('lighting')?.value || "natural light";
        
        finalPrompt = promptTemplates.image
            .replace('{subject}', subject)
            .replace('{style}', style)
            .replace('{lighting}', lighting) + "\n\n" + generateNegativePrompt();
    } else if (promptTemplates[category]) {
        finalPrompt = promptTemplates[category].replace('{subject}', subject);
    } else {
        finalPrompt = `Please thoroughly explain or generate content for the following: ${subject}`;
    }

    document.getElementById('output-box').innerText = finalPrompt;
    saveHistory(finalPrompt);
}

// Append enhancement keywords
function improvePrompt() {
    const current = document.getElementById('output-box').innerText;
    if (!current || current.includes("Your generated prompt")) return alert("Generate a prompt first!");
    
    document.getElementById('output-box').innerText = current + " Make it highly detailed, professional, and visually stunning. Use best practices.";
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
        
