// api/chat.js — Vercel Serverless Function
// Uses Google Gemini API
// Set GEMINI_API_KEY in Vercel Environment Variables

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Gemini API key not configured on server." });
  }

  try {
    const { messages, system } = req.body;

    // Convert to Gemini format
    const geminiContents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const body = {
      system_instruction: {
        parts: [{ text: system }],
      },
      contents: geminiContents,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    };

    // Try models in order until one works
    const models = [
      "gemini-2.0-flash-lite",
      "gemini-1.5-flash-latest",
      "gemini-pro",
    ];

    let responseData = null;
    let lastError = null;

    for (const model of models) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        responseData = await response.json();
        break;
      } else {
        lastError = await response.text();
        console.error(`Model ${model} failed:`, lastError);
      }
    }

    if (!responseData) {
      return res.status(500).json({ error: "All models failed", details: lastError });
    }

    const text = responseData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!text) {
      return res.status(500).json({ error: "Empty response", raw: responseData });
    }

    // Send in Anthropic SSE format so frontend works unchanged
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const chunk = { type: "content_block_delta", delta: { text } };
    res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    res.end();

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
}
