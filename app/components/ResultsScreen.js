"use client";

import styles from "./ResultsScreen.module.css";

export default function ResultsScreen({ score, config, onRestart }) {
  const numericScore = Math.min(Math.max(Number(score?.score) || 0, 0), 100);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}>✦</div>
            <span>InterviewAI</span>
          </div>
        </header>

        <section className={styles.card}>
          <div className={styles.resultsIcon}>✓</div>

          <p className={styles.eyebrow}>INTERVIEW COMPLETE</p>

          <h1>Your interview results</h1>

          <p className={styles.subtitle}>
            Here is how you performed during your mock interview.
          </p>

          <div className={styles.interviewMeta}>
            <div>
              <small>ROLE</small>
              <strong>{config?.role || "Software Engineer"}</strong>
            </div>

            <div>
              <small>TYPE</small>
              <strong>{config?.type || "Mixed"}</strong>
            </div>

            <div>
              <small>DIFFICULTY</small>
              <strong>{config?.difficulty || "Medium"}</strong>
            </div>

            <div>
              <small>DURATION</small>
              <strong>{config?.duration || "30 min"}</strong>
            </div>
          </div>

          <div
            className={styles.scoreCircle}
            style={{
              "--score": `${numericScore}%`,
            }}
          >
            <div className={styles.scoreInner}>
              <strong>{numericScore}</strong>
              <span>/100</span>
            </div>
          </div>

          <div className={styles.performance}>
            <div className={styles.performanceHeader}>
              <span>Overall performance</span>
              <strong>{numericScore}/100</strong>
            </div>

            <div className={styles.progress}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${numericScore}%`,
                }}
              />
            </div>
          </div>

          <div className={styles.feedbackBox}>
            <div className={styles.feedbackTitle}>
              <span>✦</span>
              AI Feedback
            </div>

            <p>
              {score?.feedback ||
                "No feedback was generated for this interview."}
            </p>
          </div>

          <button className={styles.restartButton} onClick={onRestart}>
            Start new interview
            <span>→</span>
          </button>
        </section>
      </div>
    </main>
  );
}
