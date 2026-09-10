"use client";

import { useEffect, useState } from "react";
import InterviewSetup from "./components/InterviewSetup";
import InterviewScreen from "./components/InterviewScreen";
import ResultsScreen from "./components/ResultsScreen";
import LandingPage from "./components/LandingPage";

const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID;
const CHANNEL = "interview-room";
const UID = 111222;

let rtc;
let mic;
let rtm;
let convoAI;
let agentId;

function getDurationSeconds(duration) {
  const minutes = parseInt(duration, 10);
  return (minutes || 30) * 60;
}

async function post(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export default function Home() {
  const [lines, setLines] = useState([]);
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [micOn, setMicOn] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [interviewConfig, setInterviewConfig] = useState(null);

  useEffect(() => {
    if (!started || !ready || loading) return;

    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [started, ready, loading]);

  useEffect(() => {
    if (!started || !ready || !interviewConfig || loading) {
      return;
    }

    const maxSeconds = getDurationSeconds(interviewConfig.duration);

    if (elapsed >= maxSeconds) {
      finish();
    }
  }, [elapsed, started, ready, interviewConfig, loading]);

  async function start(config) {
    try {
      setInterviewConfig(config);
      setStarted(true);
      setLoading(true);
      setElapsed(0);
      setLines([]);
      setScore(null);
      setReady(false);
      setMicOn(true);

      const { default: AgoraRTC } = await import("agora-rtc-sdk-ng");

      const { default: AgoraRTM } = await import("agora-rtm-sdk");

      const {
        ConversationalAIAPI,
        EConversationalAIAPIEvents,
        ETranscriptHelperMode,
        EMessageType,
      } = await import("agora-agent-client-toolkit");

      const tokenResponse = await fetch("/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel: CHANNEL,
          uid: UID,
        }),
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok) {
        throw new Error(tokenData.error || "Failed to get Agora token");
      }

      const { rtcToken, rtmToken } = tokenData;

      rtc = AgoraRTC.createClient({
        mode: "rtc",
        codec: "vp8",
      });

      await rtc.join(APP_ID, CHANNEL, rtcToken, UID);

      mic = await AgoraRTC.createMicrophoneAudioTrack({
        AEC: true,
        ANS: true,
        AGC: true,
      });

      await rtc.publish([mic]);

      rtc.on("user-published", async (user, type) => {
        if (type === "audio") {
          await rtc.subscribe(user, type);

          user.audioTrack.play();
        }
      });

      rtm = new AgoraRTM.RTM(APP_ID, String(UID));

      await rtm.login({
        token: rtmToken,
      });

      await rtm.subscribe(CHANNEL);

      convoAI = await ConversationalAIAPI.init({
        rtcEngine: rtc,
        rtmEngine: rtm,
        renderMode: ETranscriptHelperMode.TEXT,
      });

      convoAI.on(EConversationalAIAPIEvents.TRANSCRIPT_UPDATED, (items) => {
        setLines(
          items.map((item) => ({
            role:
              item.metadata?.object === EMessageType.USER_TRANSCRIPTION
                ? "user"
                : "agent",

            text: item.text,

            final: item.status !== 0,
          })),
        );
      });

      convoAI.subscribeMessage(CHANNEL);

      const inviteData = await post("/api/invite-agent", {
        channel: CHANNEL,
        config,
      });

      agentId = inviteData.agentId;

      setReady(true);
      setLoading(false);
    } catch (error) {
      console.error("Interview start error:", error);

      setStarted(false);
      setReady(false);
      setLoading(false);

      try {
        mic?.close();
        await rtc?.leave();
        await rtm?.logout();
      } catch {}

      alert(error.message || "Failed to start interview");
    }
  }

  async function toggleMic() {
    if (!mic) return;

    try {
      const nextState = !micOn;

      await mic.setEnabled(nextState);

      setMicOn(nextState);
    } catch (error) {
      console.error("Microphone error:", error);
    }
  }

  async function finish() {
    if (loading) return;

    try {
      setLoading(true);

      if (agentId) {
        try {
          await post("/api/stop-agent", {
            agentId,
          });
        } catch (error) {
          console.error("Stop agent error:", error);
        }
      }

      agentId = null;

      try {
        convoAI?.unsubscribe();
        convoAI?.destroy();
      } catch (error) {
        console.error("Conversational AI cleanup error:", error);
      }

      convoAI = null;

      try {
        mic?.close();
      } catch (error) {
        console.error("Microphone cleanup error:", error);
      }

      mic = null;

      try {
        await rtc?.leave();
      } catch (error) {
        console.error("RTC cleanup error:", error);
      }

      rtc = null;

      try {
        await rtm?.logout();
      } catch (error) {
        console.error("RTM cleanup error:", error);
      }

      rtm = null;

      const result = await post("/api/score", {
        transcript: lines,
      });

      setScore(result);
      setReady(false);
      setStarted(false);
      setLoading(false);
    } catch (error) {
      console.error("Interview finish error:", error);

      setLoading(false);

      alert(error.message || "Failed to finish interview");
    }
  }

  function resetInterview() {
    setLines([]);
    setStarted(false);
    setReady(false);
    setScore(null);
    setElapsed(0);
    setMicOn(true);
    setShowSetup(false);
    setInterviewConfig(null);

    rtc = null;
    mic = null;
    rtm = null;
    convoAI = null;
    agentId = null;
  }

  if (score) {
    return (
      <ResultsScreen
        score={score}
        config={interviewConfig}
        onRestart={resetInterview}
      />
    );
  }

  if (started) {
    return (
      <InterviewScreen
        lines={lines}
        ready={ready}
        elapsed={elapsed}
        duration={interviewConfig?.duration || "30 min"}
        micOn={micOn}
        loading={loading}
        onToggleMic={toggleMic}
        onFinish={finish}
      />
    );
  }

  if (showSetup) {
    return (
      <main className="app-shell">
        <InterviewSetup
          onBack={() => setShowSetup(false)}
          onStart={(config) => {
            setInterviewConfig(config);
            setShowSetup(false);
            start(config);
          }}
        />
      </main>
    );
  }
  return <LandingPage onStart={() => setShowSetup(true)} />;
}
