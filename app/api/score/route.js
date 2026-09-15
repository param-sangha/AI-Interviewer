import { NextResponse } from "next/server";

function clamp(value, min = 0, max = 100) {
  return Math.min(Math.max(Math.round(value), min), max);
}

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getWords(text) {
  return normalize(text).split(" ").filter(Boolean);
}

function countMatches(text, keywords) {
  const normalized = normalize(text);

  return keywords.filter((keyword) =>
    normalized.includes(keyword.toLowerCase()),
  ).length;
}

/* ---------------- TECHNICAL ---------------- */

function scoreTechnical(question, answer) {
  const a = normalize(answer);

  if (!a) return 20;

  let score = 35;

  const technicalKeywords = [
    "variable",
    "function",
    "object",
    "array",
    "class",
    "method",
    "async",
    "await",
    "promise",
    "callback",
    "closure",
    "scope",
    "api",
    "http",
    "request",
    "response",
    "database",
    "sql",
    "query",
    "table",
    "index",
    "cache",
    "redis",
    "server",
    "client",
    "backend",
    "frontend",
    "algorithm",
    "data structure",
    "complexity",
    "time",
    "space",
    "authentication",
    "authorization",
    "jwt",
    "token",
    "rest",
    "node",
    "react",
    "javascript",
    "typescript",
    "python",
    "java",
    "cpp",
    "error",
    "exception",
    "debug",
  ];

  const matches = countMatches(a, technicalKeywords);

  score += Math.min(matches * 7, 35);

  const words = getWords(answer);

  if (words.length >= 10) score += 8;
  if (words.length >= 20) score += 7;
  if (words.length >= 40) score += 5;

  const explanationWords = [
    "because",
    "means",
    "used",
    "allows",
    "works",
    "difference",
    "example",
    "when",
    "why",
    "how",
  ];

  const explanationMatches = countMatches(a, explanationWords);

  score += Math.min(explanationMatches * 3, 10);

  if (words.length <= 3) score -= 20;
  else if (words.length <= 6) score -= 10;

  return clamp(score);
}

/* ---------------- PROBLEM SOLVING ---------------- */

function scoreProblemSolving(answer) {
  const a = normalize(answer);
  const words = getWords(answer);

  let score = 40;

  const reasoningKeywords = [
    "because",
    "first",
    "then",
    "finally",
    "approach",
    "solution",
    "reason",
    "tradeoff",
    "edge case",
    "complexity",
    "optimize",
    "efficient",
    "alternative",
    "step",
    "debug",
    "test",
  ];

  const matches = countMatches(a, reasoningKeywords);

  score += Math.min(matches * 7, 35);

  if (words.length >= 15) score += 8;
  if (words.length >= 30) score += 7;
  if (words.length >= 50) score += 5;

  if (words.length <= 5) score -= 20;

  return clamp(score);
}

/* ---------------- COMMUNICATION ---------------- */

function scoreCommunication(answer) {
  const words = getWords(answer);

  if (!answer.trim()) return 20;

  let score = 55;

  if (words.length >= 8) score += 10;
  if (words.length >= 20) score += 10;
  if (words.length >= 40) score += 5;

  const fillerWords = [
    "um",
    "umm",
    "uh",
    "like",
    "maybe",
    "actually",
    "basically",
    "probably",
  ];

  const normalized = normalize(answer);

  let fillerCount = 0;

  for (const word of fillerWords) {
    if (normalized.includes(` ${word} `)) {
      fillerCount++;
    }
  }

  score -= Math.min(fillerCount * 4, 15);

  return clamp(score);
}

/* ---------------- CONFIDENCE ---------------- */

function scoreConfidence(answer) {
  const a = normalize(answer);

  let score = 60;

  const uncertainWords = [
    "maybe",
    "i think",
    "not sure",
    "probably",
    "i guess",
    "i dont know",
    "i don't know",
  ];

  const confidentWords = [
    "the reason",
    "because",
    "definitely",
    "the main",
    "for example",
    "in this case",
    "i would",
    "i can",
  ];

  for (const word of uncertainWords) {
    if (a.includes(word)) {
      score -= 8;
    }
  }

  for (const word of confidentWords) {
    if (a.includes(word)) {
      score += 5;
    }
  }

  return clamp(score);
}

/* ---------------- RELEVANCE ---------------- */

function scoreRelevance(question, answer) {
  const qWords = getWords(question).filter((word) => word.length > 3);

  const a = normalize(answer);

  if (!qWords.length || !a) return 50;

  let matches = 0;

  for (const word of qWords) {
    if (a.includes(word)) {
      matches++;
    }
  }

  const relevance = matches / qWords.length;

  let score = 45 + relevance * 45;

  if (getWords(answer).length <= 4) {
    score -= 20;
  }

  return clamp(score);
}

/* ---------------- JOB DESCRIPTION MATCHING ---------------- */

function extractJobSkills(jobDescription) {
  const text = normalize(jobDescription);

  const skills = [
    "javascript",
    "typescript",
    "react",
    "next.js",
    "node.js",
    "express",
    "python",
    "java",
    "c++",
    "sql",
    "mysql",
    "postgresql",
    "mongodb",
    "redis",
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "gcp",
    "graphql",
    "rest api",
    "rest apis",
    "jwt",
    "oauth",
    "microservices",
    "kafka",
    "git",
    "github",
    "linux",
    "html",
    "css",
    "tailwind",
    "algorithms",
    "data structures",
    "system design",
    "machine learning",
    "artificial intelligence",
  ];

  return skills.filter((skill) => text.includes(skill.toLowerCase()));
}

function calculateJobMatch(jobDescription, transcript) {
  if (!jobDescription?.trim()) {
    return {
      score: null,
      matchedSkills: [],
      missingSkills: [],
    };
  }

  const requiredSkills = extractJobSkills(jobDescription);

  if (!requiredSkills.length) {
    return {
      score: 50,
      matchedSkills: [],
      missingSkills: [],
    };
  }

  const candidateText = normalize(
    transcript
      .filter(
        (line) =>
          line.role === "user" && line.final && typeof line.text === "string",
      )
      .map((line) => line.text)
      .join(" "),
  );

  const matchedSkills = [];
  const missingSkills = [];

  for (const skill of requiredSkills) {
    if (candidateText.includes(skill.toLowerCase())) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  const score = clamp((matchedSkills.length / requiredSkills.length) * 100);

  return {
    score,
    matchedSkills,
    missingSkills,
  };
}

/* ---------------- FEEDBACK ---------------- */

function generateStrengths(metrics, answerCount) {
  const strengths = [];

  if (metrics.technical >= 70) {
    strengths.push("Good understanding of technical concepts.");
  }

  if (metrics.problemSolving >= 70) {
    strengths.push("Shows a structured problem-solving approach.");
  }

  if (metrics.communication >= 70) {
    strengths.push("Communicates ideas clearly.");
  }

  if (metrics.confidence >= 70) {
    strengths.push("Answers with good confidence and directness.");
  }

  if (metrics.relevance >= 70) {
    strengths.push("Answers are generally relevant to the questions.");
  }

  if (!strengths.length) {
    strengths.push(
      answerCount > 0
        ? "Attempted the interview questions."
        : "Interview was completed.",
    );
  }

  return strengths.slice(0, 4);
}

function generateWeaknesses(metrics) {
  const weaknesses = [];

  if (metrics.technical < 65) {
    weaknesses.push(
      "Technical explanations could be more detailed and precise.",
    );
  }

  if (metrics.problemSolving < 65) {
    weaknesses.push(
      "Explain your reasoning and problem-solving approach more clearly.",
    );
  }

  if (metrics.communication < 65) {
    weaknesses.push(
      "Try to structure answers more clearly and avoid unnecessary filler.",
    );
  }

  if (metrics.confidence < 65) {
    weaknesses.push("Give more direct answers and reduce uncertain language.");
  }

  if (metrics.relevance < 65) {
    weaknesses.push(
      "Make sure each answer directly addresses the interviewer's question.",
    );
  }

  return weaknesses.slice(0, 5);
}

function generateTopics(metrics, jobMatch) {
  const topics = [];

  if (metrics.technical < 70) {
    topics.push("Programming fundamentals");
  }

  if (metrics.problemSolving < 70) {
    topics.push("DSA and problem-solving");
    topics.push("Time and space complexity");
  }

  if (metrics.communication < 70) {
    topics.push("Technical communication");
  }

  if (jobMatch?.missingSkills?.length) {
    topics.push(...jobMatch.missingSkills);
  }

  if (!topics.length) {
    topics.push(
      "Advanced system design",
      "Performance optimization",
      "Scalable backend architecture",
    );
  }

  return [...new Set(topics)].slice(0, 7);
}

/* ---------------- API ---------------- */

export async function POST(req) {
  try {
    const { transcript, config } = await req.json();

    if (!Array.isArray(transcript)) {
      return NextResponse.json(
        { error: "Invalid transcript." },
        { status: 400 },
      );
    }

    /* Pair interviewer questions with candidate answers */

    const pairs = [];

    for (let i = 0; i < transcript.length; i++) {
      const line = transcript[i];

      if (line.role !== "assistant" || !line.final) {
        continue;
      }

      let answer = null;

      for (let j = i + 1; j < transcript.length; j++) {
        if (transcript[j].role === "user" && transcript[j].final) {
          answer = transcript[j];
          break;
        }

        if (transcript[j].role === "assistant") {
          break;
        }
      }

      if (answer) {
        pairs.push({
          question: line.text || "",
          answer: answer.text || "",
        });
      }
    }

    /* Fallback if pairing fails */

    if (!pairs.length) {
      const candidateAnswers = transcript.filter(
        (line) =>
          line.role === "user" && line.final && typeof line.text === "string",
      );

      for (const answer of candidateAnswers) {
        pairs.push({
          question: "",
          answer: answer.text,
        });
      }
    }

    /* No answers */

    if (!pairs.length) {
      return NextResponse.json({
        score: 0,
        technical: 0,
        problemSolving: 0,
        communication: 0,
        confidence: 0,
        relevance: 0,

        jobMatchScore: null,
        matchedSkills: [],
        missingSkills: [],

        strengths: [],
        weaknesses: ["No candidate answers were recorded."],

        feedback:
          "No candidate responses were recorded, so the interview could not be evaluated.",

        recommendedTopics: [
          "Programming fundamentals",
          "Technical communication",
        ],
      });
    }

    /* Calculate interview scores */

    let technicalTotal = 0;
    let problemSolvingTotal = 0;
    let communicationTotal = 0;
    let confidenceTotal = 0;
    let relevanceTotal = 0;

    for (const pair of pairs) {
      technicalTotal += scoreTechnical(pair.question, pair.answer);

      problemSolvingTotal += scoreProblemSolving(pair.answer);

      communicationTotal += scoreCommunication(pair.answer);

      confidenceTotal += scoreConfidence(pair.answer);

      relevanceTotal += scoreRelevance(pair.question, pair.answer);
    }

    const count = pairs.length;

    const technical = clamp(technicalTotal / count);

    const problemSolving = clamp(problemSolvingTotal / count);

    const communication = clamp(communicationTotal / count);

    const confidence = clamp(confidenceTotal / count);

    const relevance = clamp(relevanceTotal / count);

    /* Calculate JD match */

    const jobMatch = calculateJobMatch(
      config?.jobDescription || "",
      transcript,
    );

    /* Overall score */

    const score = clamp(
      technical * 0.3 +
        problemSolving * 0.25 +
        communication * 0.15 +
        confidence * 0.1 +
        relevance * 0.2,
    );

    const strengths = generateStrengths(
      {
        technical,
        problemSolving,
        communication,
        confidence,
        relevance,
      },
      count,
    );

    const weaknesses = generateWeaknesses({
      technical,
      problemSolving,
      communication,
      confidence,
      relevance,
    });

    const recommendedTopics = generateTopics(
      {
        technical,
        problemSolving,
        communication,
        confidence,
        relevance,
      },
      jobMatch,
    );

    const feedback = `You completed ${count} candidate ${
      count === 1 ? "response" : "responses"
    }. Your overall performance score was ${score}/100. ${
      strengths[0] || ""
    } Focus on the improvement areas below to perform better in future interviews.`;

    console.log("SCORING PAIRS:", pairs);

    console.log("JOB MATCH:", jobMatch);

    console.log("SCORING RESULT:", {
      score,
      technical,
      problemSolving,
      communication,
      confidence,
      relevance,
    });

    return NextResponse.json({
      score,
      technical,
      problemSolving,
      communication,
      confidence,
      relevance,

      jobMatchScore: jobMatch.score,
      matchedSkills: jobMatch.matchedSkills,
      missingSkills: jobMatch.missingSkills,

      strengths,
      weaknesses,
      feedback,
      recommendedTopics,
    });
  } catch (error) {
    console.error("Score API error:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to generate score.",
      },
      { status: 500 },
    );
  }
}
