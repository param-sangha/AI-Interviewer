"use client";

import styles from "./InterviewScreen.module.css";

export default function InterviewScreen({
  lines,
  ready,
  elapsed,
  duration,
  micOn,
  loading,
  onToggleMic,
  onFinish,
}) {
  function getRemainingSeconds() {
    const minutes = parseInt(duration, 10) || 30;
    return Math.max(minutes * 60 - elapsed, 0);
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");

    const secs = (seconds % 60).toString().padStart(2, "0");

    return `${mins}:${secs}`;
  }

  return (
    <main className={styles.shell}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>✦</div>
          <span>InterviewAI</span>
        </div>

        <div className={styles.status}>
          <span className={`${styles.statusDot} ${ready ? styles.live : ""}`} />
          {ready ? "Interview in progress" : "Connecting..."}
        </div>

        <div
          className={`${styles.timer} ${
            getRemainingSeconds() <= 60 ? styles.timerWarning : ""
          }`}
        >
          <span>◷</span>
          {formatTime(getRemainingSeconds())}
        </div>
      </header>

      <section className={styles.layout}>
        {/* Interviewer */}
        <div className={styles.interviewerPanel}>
          <div className={styles.panelLabel}>
            <span>AI INTERVIEWER</span>

            <span className={styles.liveBadge}>
              <i />
              LIVE
            </span>
          </div>

          <div className={styles.avatarArea}>
            <div className={styles.avatarGlow}>
              <div className={styles.avatar}>
                <div className={styles.avatarFace}>
                  <span />
                  <span />
                </div>
              </div>
            </div>

            <div className={styles.speakingBars}>
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>

            <h2>Alex</h2>

            <p>{ready ? "AI Interviewer" : "Preparing your interview..."}</p>
          </div>

          <div className={styles.tip}>
            <span>✦</span>

            <div>
              <strong>Interview tip</strong>

              <p>Take your time and explain your thought process clearly.</p>
            </div>
          </div>
        </div>

        {/* Transcript */}
        <div className={styles.transcriptPanel}>
          <div className={styles.transcriptHeader}>
            <div>
              <p className={styles.eyebrow}>LIVE TRANSCRIPT</p>
              <h2>Conversation</h2>
            </div>

            <span className={styles.messageCount}>{lines.length} messages</span>
          </div>

          <div className={styles.messages}>
            {lines.length === 0 && (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>◌</div>

                <h3>Waiting for the interviewer...</h3>

                <p>Your conversation will appear here in real time.</p>
              </div>
            )}

            {lines.map((line, index) => (
              <div
                key={index}
                className={`${styles.message} ${
                  line.role === "agent"
                    ? styles.interviewerMessage
                    : styles.userMessage
                }`}
              >
                <div className={styles.messageAvatar}>
                  {line.role === "agent" ? "✦" : "Y"}
                </div>

                <div className={styles.messageContent}>
                  <div className={styles.messageName}>
                    {line.role === "agent" ? "Alex · AI Interviewer" : "You"}
                  </div>

                  <div
                    className={`${styles.messageText} ${
                      !line.final ? styles.partial : ""
                    }`}
                  >
                    {line.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className={styles.controls}>
            <button
              className={`${styles.micButton} ${!micOn ? styles.micOff : ""}`}
              onClick={onToggleMic}
              disabled={!ready}
            >
              <span>{micOn ? "🎙" : "🔇"}</span>

              {micOn ? "Mute microphone" : "Unmute microphone"}
            </button>

            <button
              className={styles.endButton}
              onClick={onFinish}
              disabled={!ready || loading}
            >
              {loading ? "Finishing..." : "End interview"}

              <span>■</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
