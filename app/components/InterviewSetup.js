"use client";

import { useState } from "react";
import styles from "./InterviewSetup.module.css";

export default function InterviewSetup({ onBack, onStart }) {
  const [role, setRole] = useState("Full Stack Engineer");
  const [type, setType] = useState("Mixed");
  const [difficulty, setDifficulty] = useState("Medium");
  const [experience, setExperience] = useState("0–1 years");
  const [duration, setDuration] = useState("30 min");
  const [jobDescription, setJobDescription] = useState("");

  function handleStart() {
    onStart({
      role,
      type,
      difficulty,
      experience,
      duration,
      jobDescription,
    });
  }

  const roles = [
    ["Backend Engineer", "⚙"],
    ["Frontend Engineer", "◈"],
    ["Full Stack Engineer", "◇"],
    ["Software Engineer", "⌘"],
  ];

  return (
    <section className={styles.setupPage}>
      <div className={styles.container}>
        <header className={styles.header}>
          <button className={styles.backButton} onClick={onBack}>
            ← Back
          </button>

          <div className={styles.brand}>
            <div className={styles.brandIcon}>✦</div>
            <span>InterviewAI</span>
          </div>
        </header>

        <div className={styles.heading}>
          <div className={styles.badge}>
            <span>✦</span>
            Customize your interview
          </div>

          <h1>
            Prepare for your
            <br />
            <span>next interview.</span>
          </h1>

          <p>
            Configure your interview experience before you start. The AI
            interviewer will adapt to your selections.
          </p>
        </div>

        <div className={styles.card}>
          {/* Role */}
          <div className={styles.section}>
            <label>What role are you interviewing for?</label>

            <div className={styles.roleGrid}>
              {roles.map(([item, icon]) => (
                <button
                  key={item}
                  className={`${styles.roleCard} ${
                    role === item ? styles.selected : ""
                  }`}
                  onClick={() => setRole(item)}
                >
                  <span className={styles.roleIcon}>{icon}</span>

                  <span className={styles.roleName}>{item}</span>

                  {role === item && <span className={styles.check}>✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Type */}
          <div className={styles.section}>
            <label>Interview type</label>

            <div className={styles.segmented}>
              {["Technical", "Behavioral", "Mixed"].map((item) => (
                <button
                  key={item}
                  className={type === item ? styles.active : ""}
                  onClick={() => setType(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty + Experience */}
          <div className={styles.row}>
            <div className={styles.section}>
              <label>Difficulty</label>

              <div className={styles.smallGrid}>
                {["Easy", "Medium", "Hard"].map((item) => (
                  <button
                    key={item}
                    className={`${styles.smallOption} ${
                      difficulty === item ? styles.selected : ""
                    }`}
                    onClick={() => setDifficulty(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <label>Experience</label>

              <div className={styles.experienceGrid}>
                {["0–1 years", "1–3 years", "3–5 years", "5+ years"].map(
                  (item) => (
                    <button
                      key={item}
                      className={`${styles.smallOption} ${
                        experience === item ? styles.selected : ""
                      }`}
                      onClick={() => setExperience(item)}
                    >
                      {item}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className={styles.section}>
            <label>Interview duration</label>

            <div className={styles.durationGrid}>
              {["15 min", "30 min", "45 min"].map((item) => (
                <button
                  key={item}
                  className={`${styles.durationCard} ${
                    duration === item ? styles.selected : ""
                  }`}
                  onClick={() => setDuration(item)}
                >
                  <span className={styles.durationIcon}>◷</span>

                  <span className={styles.durationText}>
                    <strong>{item}</strong>
                    <small>Mock interview</small>
                  </span>

                  {duration === item && <span className={styles.check}>✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Job description */}
          <div className={styles.section}>
            <div className={styles.labelRow}>
              <label>Job description</label>
              <span>Optional</span>
            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={5}
            />

            <p className={styles.hint}>
              Add a job description to make the interview more relevant to the
              role.
            </p>
          </div>

          {/* Summary */}
          <div className={styles.summary}>
            <div className={styles.summaryTitle}>
              <span>✦</span>
              Your interview
            </div>

            <div className={styles.summaryItems}>
              <div>
                <small>ROLE</small>
                <strong>{role}</strong>
              </div>

              <div>
                <small>TYPE</small>
                <strong>{type}</strong>
              </div>

              <div>
                <small>LEVEL</small>
                <strong>{difficulty}</strong>
              </div>

              <div>
                <small>DURATION</small>
                <strong>{duration}</strong>
              </div>
            </div>
          </div>

          <button className={styles.startButton} onClick={handleStart}>
            Start AI interview
            <span>→</span>
          </button>

          <p className={styles.note}>
            🎙️ Make sure your microphone is connected before starting.
          </p>
        </div>
      </div>
    </section>
  );
}
