import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { transcript } = await req.json();

    const text = transcript
      .filter((line) => line.final)
      .map((line) => `${line.role}: ${line.text}`)
      .join("\n");

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: {
          type: "json_object",
        },
        messages: [
          {
            role: "system",
            content:
              'Grade this mock developer interview. Reply with JSON only: {"score": 0-100, "feedback": "string"}. Only use what the candidate actually said. Never invent anything.',
          },
          {
            role: "user",
            content: text || "No interview transcript was recorded.",
          },
        ],
      }),
    });

    // Get the raw response first
    const raw = await res.text();

    console.log("OpenAI status:", res.status);
    console.log("OpenAI response:", raw);

    // Handle OpenAI errors
    if (!res.ok) {
      return NextResponse.json(
        {
          error: "OpenAI API request failed",
          details: raw,
        },
        { status: 500 },
      );
    }

    const data = JSON.parse(raw);

    // Make sure choices exists
    if (!data.choices?.[0]?.message?.content) {
      return NextResponse.json(
        {
          error: "Unexpected OpenAI response",
          details: data,
        },
        { status: 500 },
      );
    }

    const result = JSON.parse(data.choices[0].message.content);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Score API error:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to generate score",
      },
      { status: 500 },
    );
  }
}
