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
            "subject_details": "Detailed visual description of the main subject",
            "background_environment": "Detailed description of the setting and surroundings",
            "color_palette": "Primary colors, tones, and contrast",
            "mood_and_atmosphere": "The emotional feel of the image",
            "master_prompt": "The full, combined long-form prompt (75-100 words)",
            "negative_prompt": "Things to avoid, bad quality, blurry, extra limbs, bad anatomy",
            "style": "${style}",
            "lighting": "${lighting}",
            "camera": "${camera}"
        }
        Do NOT wrap the JSON in markdown blocks (no \`\`\`json). Return ONLY the raw JSON object.`;
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
        
        let finalOutput = data.result;

        // Clean and Prettify JSON if that format was selected
        if (format === "JSON") {
            // Strip out any markdown formatting the AI stubbornly included
            finalOutput = finalOutput.replace(/```json/gi, "").replace(/```/g, "").trim();
            
            try {
                // Parse and re-stringify with 4 spaces for beautiful indentation
                const parsedJSON = JSON.parse(finalOutput);
                finalOutput = JSON.stringify(parsedJSON, null, 4);
            } catch (parseError) {
                console.warn("Could not perfectly format JSON, outputting raw text instead.");
            }
        }
        
        outputBox.innerText = finalOutput;
        saveHistory(finalOutput);

    } catch (error) {
        outputBox.innerText = "⚠️ API Notice: " + error.message;
        console.error(error);
    } finally {
        generateBtn.disabled = false;
    }
}
