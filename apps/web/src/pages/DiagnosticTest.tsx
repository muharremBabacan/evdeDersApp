import { useMemo, useState } from "react";
import { demoOutcomes, demoQuestions } from "../data/demoCurriculum";
import { evaluateAnswers, scorePercentage } from "../lib/mastery";
import type { TestAnswer } from "@dershane/shared-types";

interface DiagnosticTestProps {
  studentId: string;
  onComplete: (answers: TestAnswer[]) => void;
}

export function DiagnosticTest({ onComplete }: DiagnosticTestProps) {
  // v1 demo: her kazanımdan 1 soru seçilir (basit diagnostik).
  const questions = useMemo(() => {
    return demoOutcomes.map((outcome) => {
      const pool = demoQuestions.filter((q) => q.outcomeId === outcome.id);
      return pool[0];
    });
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[currentIndex];
  const currentOutcome = demoOutcomes.find((o) => o.id === currentQuestion?.outcomeId);

  function handleSelect(option: string) {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }));
  }

  function handleNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      const evaluated = evaluateAnswers(questions, answers);
      setFinished(true);
      onComplete(evaluated);
    }
  }

  if (finished) {
    return <div className="card">Test tamamlandı, sonuçların işleniyor...</div>;
  }

  if (!currentQuestion) {
    return <div className="card">Bu öğrenci için soru bulunamadı.</div>;
  }

  return (
    <div className="card">
      <p className="progress-label">
        Soru {currentIndex + 1} / {questions.length} — {currentOutcome?.description}
      </p>
      <h2>{currentQuestion.text}</h2>
      <div className="options">
        {currentQuestion.options.map((opt) => (
          <button
            key={opt}
            className={answers[currentQuestion.id] === opt ? "option selected" : "option"}
            onClick={() => handleSelect(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
      <button
        className="primary"
        disabled={!answers[currentQuestion.id]}
        onClick={handleNext}
      >
        {currentIndex < questions.length - 1 ? "Sonraki Soru" : "Testi Tamamla"}
      </button>
    </div>
  );
}

// Yardımcı: dışarıdan skor hesaplamak isteyenler için re-export
export { scorePercentage };
