// api/chat.js — Vercel Serverless Function
// Uses Google Gemini API (gemini-2.0-flash) — non-streaming for reliability
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

    // Use non-streaming endpoint for reliability
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini error:", err);
      return res.status(500).json({ error: "Gemini API error", details: err });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!text) {
      return res.status(500).json({ error: "Empty response from Gemini", raw: data });
    }

    // Send as a single SSE chunk in Anthropic format so frontend works unchanged
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
