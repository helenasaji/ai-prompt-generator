// data.js
const promptData = {
    // Base templates for different categories
    templates: {
        image: "Create an image of {subject}. Style: {style}. Lighting: {lighting}. Camera specs: {camera}.",
        coding: "Act as an expert software developer. Write clean, optimized code for the following request: {subject}. Ensure best practices and include comments.",
        writing: "Write a well-structured piece about {subject}. Use an engaging tone, logical paragraphs, and clear headings."
    },
    
    // Default negative prompts for image generation
    negativePrompts: {
        image: "blurry, low quality, distorted, watermark, signature, bad anatomy, extra limbs, poorly drawn face"
    },

    // Keywords used to calculate the Prompt Score
    scoringKeywords: {
        lighting: ["golden hour", "moody", "studio", "neon", "volumetric", "sunlight", "cinematic lighting"],
        camera: ["35mm", "wide angle", "macro", "drone", "8k", "dslr", "telephoto", "depth of field"],
        style: ["photorealistic", "cinematic", "cyberpunk", "anime", "watercolor", "oil painting", "3d render"]
    }
};
