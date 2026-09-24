document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const ideaInput = document.getElementById('idea');
    const categorySelect = document.getElementById('category');
    const outputBox = document.getElementById('output-box');

    // A simple dictionary of prompt templates
    const templates = {
        image: "Create a highly detailed, photorealistic image of {subject}. Cinematic lighting, 8k resolution, wide-angle composition.",
        coding: "Act as an expert software developer. Write clean, optimized code for the following request: {subject}. Include comments explaining the logic.",
        writing: "Write a compelling, well-structured piece about {subject}. Use an engaging tone and organize the paragraphs logically."
    };

    // Generate button logic
    generateBtn.addEventListener('click', () => {
        const userIdea = ideaInput.value.trim();
        const category = categorySelect.value;

        if (!userIdea) {
            outputBox.textContent = "Please enter an idea first!";
            return;
        }

        // Replace the {subject} placeholder with the user's text
        const finalPrompt = templates[category].replace('{subject}', userIdea);
        outputBox.textContent = finalPrompt;
    });

    // Copy button logic
    copyBtn.addEventListener('click', () => {
        const textToCopy = outputBox.textContent;
        
        if (textToCopy && textToCopy !== "Your generated prompt will appear here..." && textToCopy !== "Please enter an idea first!") {
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = "✓ Copied!";
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            });
        }
    });
});

