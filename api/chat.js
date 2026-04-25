// api/chat.js — Vercel Serverless Function
// Uses Google Gemini API (gemini-2.0-flash)
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

    // Convert messages from Anthropic format → Gemini format
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

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${apiKey}`,
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

    // Stream back to browser in Anthropic-compatible SSE format
    // so the frontend works completely unchanged
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

      for (const line of lines) {
        const data = line.slice(6).trim();
        if (!data || data === "[DONE]") continue;

        try {
          const parsed = JSON.parse(data);
          const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text || "";

          if (text) {
            // Re-emit in Anthropic SSE format — frontend unchanged
            const anthropicChunk = {
              type: "content_block_delta",
              delta: { text },
            };
            res.write(`data: ${JSON.stringify(anthropicChunk)}\n\n`);
          }
        } catch {}
      }
    }

    res.end();
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
