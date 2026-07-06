import { useState } from "react";
import { DiagnosticTest } from "./pages/DiagnosticTest";
import { Dashboard } from "./pages/Dashboard";
import { demoQuestions } from "./data/demoCurriculum";
import { updateMasteryFromAnswers } from "./lib/mastery";
import type { MasteryRecord, TestAnswer } from "@dershane/shared-types";
import "./styles.css";

const DEMO_STUDENT_ID = "student_demo_1";

export default function App() {
  const [mode, setMode] = useState<"test" | "dashboard">("test");
  const [masteryRecords, setMasteryRecords] = useState<Record<string, MasteryRecord>>({});

  function handleTestComplete(answers: TestAnswer[]) {
    const updated = updateMasteryFromAnswers(
      masteryRecords,
      answers,
      demoQuestions,
      DEMO_STUDENT_ID
    );
    setMasteryRecords(updated);
    setMode("dashboard");
  }

  return (
    <div className="app-shell">
      <header>
        <h1>Ev'de Ders — Kazanım Takip (v1 Demo)</h1>
      </header>
      <main>
        {mode === "test" ? (
          <DiagnosticTest studentId={DEMO_STUDENT_ID} onComplete={handleTestComplete} />
        ) : (
          <Dashboard masteryRecords={masteryRecords} onRetakeTest={() => setMode("test")} />
        )}
      </main>
    </div>
  );
}
