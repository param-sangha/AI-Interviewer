"use client";

import styles from "./LandingPage.module.css";

export default function LandingPage({ onStart }) {
  return (
    <main className={styles.page}>
      <nav className={styles.navbar}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>✦</div>
          <span>IntervueAI</span>
        </div>

        <button className={styles.navButton} onClick={onStart}>
          Practice now
          <span>→</span>
        </button>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            <span>✦</span>
            AI-POWERED INTERVIEW PRACTICE
          </div>

          <h1>
            Practice interviews.
            <br />
            <span>Build confidence.</span>
          </h1>

          <p className={styles.heroDescription}>
            Practice realistic technical and behavioral interviews with an AI
            interviewer that adapts to your role, experience, and difficulty
            level.
          </p>

          <div className={styles.heroActions}>
            <button className={styles.primaryButton} onClick={onStart}>
              Start interview
              <span>→</span>
            </button>

            <span className={styles.heroNote}>No preparation required</span>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.visualCard}>
            <div className={styles.visualHeader}>
              <div>
                <span className={styles.visualLabel}>AI INTERVIEWER</span>

                <h3>Alex</h3>
              </div>

              <div className={styles.liveIndicator}>
                <span />
                LIVE
              </div>
            </div>

            <div className={styles.visualAvatar}>
              <div className={styles.visualGlow}>
                <div className={styles.visualFace}>
                  <span />
                  <span />
                </div>
              </div>
            </div>

            <div className={styles.visualWave}>
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>

            <p className={styles.visualQuestion}>
              "Tell me about a challenging technical problem you solved."
            </p>

            <div className={styles.visualFooter}>
              <span>◷ 28:42</span>
              <span>🎙 Listening</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>✦</div>

          <div>
            <h3>Adaptive interviews</h3>
            <p>Questions adapt to your answers and experience level.</p>
          </div>
        </div>

        <div className={styles.feature}>
          <div className={styles.featureIcon}>◈</div>

          <div>
            <h3>Real-time conversation</h3>
            <p>Speak naturally with a voice-based AI interviewer.</p>
          </div>
        </div>

        <div className={styles.feature}>
          <div className={styles.featureIcon}>✓</div>

          <div>
            <h3>Instant feedback</h3>
            <p>Get an AI-generated performance score after your interview.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
