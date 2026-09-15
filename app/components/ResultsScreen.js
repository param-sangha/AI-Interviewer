"use client";

import styles from "./ResultsScreen.module.css";

function ScoreCard({ label, value }) {
  return (
    <div className={styles.scoreCard}>
      <div className={styles.scoreCardTop}>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

      <div className={styles.progress}>
        <div className={styles.progressFill} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function ResultsScreen({ score, config, onRestart }) {
  const numericScore = Math.min(Math.max(Number(score?.score) || 0, 0), 100);

  const technical = Number(score?.technical) || 0;
  const problemSolving = Number(score?.problemSolving) || 0;
  const communication = Number(score?.communication) || 0;
  const confidence = Number(score?.confidence) || 0;
  const relevance = Number(score?.relevance) || 0;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}>✦</div>
            <span>IntervueAI</span>
          </div>
        </header>

        {/* Title */}
        <section className={styles.titleSection}>
          <div className={styles.resultsIcon}>✓</div>

          <p className={styles.eyebrow}>INTERVIEW COMPLETE</p>

          <h1>Your interview results</h1>

          <p className={styles.subtitle}>
            Here's a breakdown of your performance and areas you can improve.
          </p>
        </section>

        {/* Overall Score */}
        <section className={styles.overviewCard}>
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

          <div className={styles.overviewContent}>
            <p className={styles.overviewLabel}>OVERALL PERFORMANCE</p>

            <h2>
              {numericScore >= 80
                ? "Excellent performance"
                : numericScore >= 65
                  ? "Good performance"
                  : numericScore >= 50
                    ? "Decent performance"
                    : "Keep practicing"}
            </h2>

            <p>
              {score?.feedback ||
                "Your interview performance has been analyzed."}
            </p>
          </div>
        </section>

        {/* Interview Info */}
        <section className={styles.metaGrid}>
          <div>
            <span>ROLE</span>
            <strong>{config?.role || "Software Engineer"}</strong>
          </div>

          <div>
            <span>TYPE</span>
            <strong>{config?.type || "Mixed"}</strong>
          </div>

          <div>
            <span>DIFFICULTY</span>
            <strong>{config?.difficulty || "Medium"}</strong>
          </div>

          <div>
            <span>DURATION</span>
            <strong>{config?.duration || "30 min"}</strong>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>ANALYSIS</p>
              <h2>Performance breakdown</h2>
            </div>
          </div>

          <div className={styles.scoreGrid}>
            <ScoreCard label="Technical Knowledge" value={technical} />

            <ScoreCard label="Problem Solving" value={problemSolving} />

            <ScoreCard label="Communication" value={communication} />

            <ScoreCard label="Confidence" value={confidence} />

            <ScoreCard label="Answer Relevance" value={relevance} />
          </div>
        </section>
        {score?.jobMatchScore !== null &&
          score?.jobMatchScore !== undefined && (
            <section className={styles.jobMatchCard}>
              <div className={styles.jobMatchHeader}>
                <div>
                  <p className={styles.eyebrow}>JOB DESCRIPTION MATCH</p>

                  <h2>{score.jobMatchScore}% match</h2>
                </div>

                <div className={styles.jobMatchScore}>
                  {score.jobMatchScore}%
                </div>
              </div>

              <div className={styles.progress}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${score.jobMatchScore}%`,
                  }}
                />
              </div>

              <div className={styles.skillColumns}>
                <div>
                  <h3>Matched skills</h3>

                  <div className={styles.skillList}>
                    {(score.matchedSkills || []).length > 0 ? (
                      score.matchedSkills.map((skill) => (
                        <span key={skill}>✓ {skill}</span>
                      ))
                    ) : (
                      <p>No specific skills matched.</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3>Skills to improve</h3>

                  <div className={styles.skillList}>
                    {(score.missingSkills || []).length > 0 ? (
                      score.missingSkills.map((skill) => (
                        <span key={skill}>→ {skill}</span>
                      ))
                    ) : (
                      <p>No major skill gaps detected.</p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

        {/* Strengths + Weaknesses */}
        <section className={styles.twoColumn}>
          <div className={styles.infoCard}>
            <div className={styles.infoHeader}>
              <div className={styles.infoIcon}>✓</div>
              <h3>Strengths</h3>
            </div>

            <ul>
              {(score?.strengths || []).map((strength, index) => (
                <li key={index}>
                  <span>✓</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoHeader}>
              <div className={styles.infoIcon}>!</div>
              <h3>Areas to improve</h3>
            </div>

            <ul>
              {(score?.weaknesses || []).map((weakness, index) => (
                <li key={index}>
                  <span>→</span>
                  {weakness}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Recommended Topics */}
        <section className={styles.topicsCard}>
          <div>
            <p className={styles.eyebrow}>RECOMMENDED</p>

            <h2>Topics to practice</h2>

            <p>Focus on these areas before your next interview.</p>
          </div>

          <div className={styles.topicList}>
            {(score?.recommendedTopics || []).map((topic, index) => (
              <span key={index}>{topic}</span>
            ))}
          </div>
        </section>

        {/* AI Feedback */}
        <section className={styles.feedbackCard}>
          <div className={styles.feedbackHeader}>
            <div className={styles.feedbackIcon}>✦</div>

            <div>
              <p className={styles.eyebrow}>AI INSIGHTS</p>

              <h2>Interview feedback</h2>
            </div>
          </div>

          <p className={styles.feedbackText}>
            {score?.feedback || "No additional feedback was generated."}
          </p>
        </section>

        {/* Action */}
        <div className={styles.actions}>
          <button className={styles.restartButton} onClick={onRestart}>
            Start new interview
            <span>→</span>
          </button>
        </div>
      </div>
    </main>
  );
}
