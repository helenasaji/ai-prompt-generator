# ✦ AI Prompt Generator

A modern full-stack web application that transforms raw ideas into structured, high-fidelity prompts for generative AI models, image engines, and coding assistants. Powered by a serverless backend integrated with the Google Gemini API.

[🚀 **Live Demo**](https://ai-prompt-generator-black-seven.vercel.app)

---

## ✨ Features

- **Prompt Builder:** Granular controls for Style, Lighting, Camera angles, and Domain categories.
- **AI-Powered Expansion:** Uses Google Gemini to expand raw concepts into comprehensive 75–100+ word structured prompts.
- **Secure Serverless Proxy:** Keeps API keys hidden from client-side code using Vercel Serverless Functions.
- **Copy to Clipboard:** One-click prompt copying with instant UI feedback.
- **History Tracking:** Local storage caching for quick access to previously generated prompts.
- **Responsive Dark Mode:** Built with vanilla CSS grid, flexbox, and modern glassmorphic styling.

---

## 🛠 Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend:** Node.js (Vercel Serverless Functions)
- **AI Integration:** Google Gemini API (`gemini-3.8-flash`)
- **Hosting & CI/CD:** Vercel

---

## 📁 Project Structure

```text
ai-prompt-generator/
├── api/
│   └── index.js         # Serverless function proxying Gemini API requests
├── index.html           # Core application markup
├── style.css            # Dark mode UI, layout, and animations
├── script.js           # Client-side UI logic, state, and fetch handlers
├── vercel.json          # Routing and serverless function rewrite rules
├── .gitignore           # Ignores sensitive environment files
└── README.md            # Project documentation
