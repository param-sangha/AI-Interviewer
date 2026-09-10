import { NextResponse } from "next/server";
import {
  AgoraClient,
  Agent,
  Area,
  DeepgramSTT,
  MiniMaxTTS,
  OpenAI,
} from "agora-agents";

const client = new AgoraClient({
  area: Area.US,
  appId: process.env.NEXT_PUBLIC_AGORA_APP_ID,
  appCertificate: process.env.NEXT_AGORA_APP_CERTIFICATE,
});

function buildPrompt(config) {
  const {
    role = "Software Engineer",
    type = "Mixed",
    difficulty = "Medium",
    experience = "0–1 years",
    duration = "30 min",
    jobDescription = "",
  } = config || {};

  let interviewFocus = "";

  if (type === "Technical") {
    interviewFocus = `
Focus mainly on technical questions relevant to the role.
Cover programming fundamentals, problem solving, APIs, databases,
system design basics, debugging, and role-specific technical concepts.
`;
  }

  if (type === "Behavioral") {
    interviewFocus = `
Focus mainly on behavioral and situational questions.
Ask about teamwork, communication, conflict resolution, ownership,
learning from mistakes, problem solving, and past experiences.
Use realistic interview scenarios.
`;
  }

  if (type === "Mixed") {
    interviewFocus = `
Conduct a balanced interview containing both technical and behavioral
questions. Alternate naturally between the two areas.
`;
  }

  return `
You are a professional AI interviewer conducting a realistic mock interview.

CANDIDATE PROFILE
Role: ${role}
Experience level: ${experience}
Difficulty: ${difficulty}
Interview type: ${type}
Target duration: ${duration}

${
  jobDescription
    ? `JOB DESCRIPTION:
${jobDescription}`
    : "No job description was provided. Base the interview on the selected role."
}

INTERVIEW RULES

1. Ask ONE question at a time.
2. After asking a question, STOP and wait for the candidate's answer.
3. Never ask multiple questions in the same response.
4. Keep every spoken response concise and under 20 seconds.
5. Listen carefully to what the candidate actually says.
6. Ask relevant follow-up questions based on their answer.
7. Do not invent things the candidate said.
8. Do not give the candidate the answer unless they explicitly ask for help.
9. Maintain a professional but friendly interview tone.
10. Gradually increase the difficulty when the candidate performs well.
11. If the candidate struggles, ask a simpler follow-up rather than immediately
    giving the answer.
12. Do not repeat questions unnecessarily.
13. Do not turn the interview into a lecture.
14. Keep the conversation focused on evaluating the candidate.

${interviewFocus}

DIFFICULTY

Easy:
Focus on fundamentals and straightforward questions.

Medium:
Test fundamentals plus practical application and reasoning.

Hard:
Ask deeper questions involving trade-offs, debugging, architecture,
edge cases, and practical engineering decisions.

INTERVIEW FLOW

Start with a short introduction.

Then ask questions appropriate for the role and experience level.

For technical questions:
- Ask the candidate to explain their reasoning.
- Ask practical follow-ups.
- Explore edge cases when appropriate.

For behavioral questions:
- Ask for specific examples.
- Probe their actions, decisions, and results.

At the end of the interview, briefly tell the candidate that the interview
is complete. Do not provide a detailed score because scoring is handled
separately by the application.
`;
}

export async function POST(req) {
  try {
    const body = await req.json();

    const { channel, config } = body;

    if (!channel) {
      return NextResponse.json(
        { error: "Channel is required" },
        { status: 400 },
      );
    }

    const prompt = buildPrompt(config);

    console.log("Starting interview with config:", config);

    const agent = new Agent({
      client,
      instructions: prompt,
      greeting:
        "Hi, thanks for making the time. I'm Alex, your AI interviewer. Shall we start?",
      advancedFeatures: {
        enable_rtm: true,
      },
      parameters: {
        data_channel: "rtm",
      },
    })
      .withStt(
        new DeepgramSTT({
          model: "nova-3",
          language: "en",
        }),
      )
      .withLlm(
        new OpenAI({
          model: "gpt-4o-mini",
        }),
      )
      .withTts(
        new MiniMaxTTS({
          model: "speech_2_6_turbo",
          voiceId: "English_captivating_female1",
        }),
      )
      .withTurnDetection({
        mode: "default",
        config: {
          start_of_speech: {
            mode: "vad",
            vad_config: {
              interrupt_duration_ms: 160,
            },
          },
          end_of_speech: {
            mode: "semantic",
            semantic_config: {
              silence_duration_ms: 320,
            },
          },
        },
      });

    const session = agent.createSession({
      channel,
      agentUid: "123456",
      remoteUids: ["*"],
      idleTimeout: 30,
    });

    const { agentId } = await session.start();

    return NextResponse.json({
      agentId,
    });
  } catch (error) {
    console.error("Invite agent error:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to start AI interviewer",
      },
      {
        status: 500,
      },
    );
  }
}
