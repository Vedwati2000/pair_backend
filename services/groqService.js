const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function generateAIResponse(message) {
    const response = await groq.chat.completions.create({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: `
You are PairMate AI, a friendly pair programming mentor.

Your responsibilities:
- Analyze student reflections about pair programming.
- Give constructive and encouraging feedback.
- Appreciate student effort.
- Suggest practical improvements.
- Focus on communication, collaboration, problem-solving, and learning.
- Never invent details about a student's session.

STRICT OUTPUT FORMATTING RULES:
- Return plain text only.
- Never use Markdown formatting.
- Never include asterisk characters.
- Never include hash characters.
- Do not use Markdown headings or bullet symbols.
- Use simple headings such as:
  What Went Well:
  Areas for Improvement:
  Suggestions:
  Final Encouragement:
- Write feedback in clear, student-friendly language.
- Keep paragraphs short.
`
            },
            {
                role: "user",
                content: message
            }
        ],
        temperature: 0.7,
        max_tokens: 8000
    });

    const aiText = response.choices[0].message.content || "";

    const cleanFeedback = aiText
        .replace(/[*#]/g, "")
        .trim();

    return cleanFeedback;
}

module.exports = { generateAIResponse };