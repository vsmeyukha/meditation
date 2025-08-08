import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
  try {
    const body = await req.json();
    const { mood, energy, topic } = body as {
      mood?: string;
      energy?: string;
      topic?: string;
    };
    const prompt = `You are a gentle meditation teacher. Write a concise (120-180 words) guidance for a short practice. Context: mood=${mood ?? "unknown"}, energy=${energy ?? "unknown"}, topic=${topic ?? "general"}. Tone: warm, spiritual, grounded. Include brief breath pacing and one compassion cue. Avoid medical claims.`;

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You write meditations that are short, kind, and non-clinical.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.8,
      }),
    });
    if (!resp.ok) {
      const text = await resp.text();
      return new Response(JSON.stringify({ error: text }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }
    interface ChatMessage {
      role: string;
      content: string;
    }
    interface ChatChoice {
      index: number;
      message: ChatMessage;
    }
    interface ChatResponse {
      choices?: ChatChoice[];
    }
    const data = (await resp.json()) as ChatResponse;
    const content = data.choices?.[0]?.message?.content ?? "";
    return new Response(JSON.stringify({ content }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Bad request" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
}
