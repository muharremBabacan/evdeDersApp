import {
  computeUpdatedMastery,
  levelToStatus,
  type MasteryRecord,
  type Question,
  type TestAnswer,
} from "../types/curriculum";

/**
 * Bir test denemesindeki cevapları değerlendirir ve her kazanım (outcome)
 * için güncellenmiş mastery kaydını üretir.
 *
 * v1'de bu hesap frontend'de yapılıyor (demo/offline mod için).
 * v2'de gerçek Firestore ile çalışırken bu AYNI fonksiyon
 * bir Cloud Function içinde de kullanılacak (functions/src/index.ts
 * içindeki onTestSubmitted tetikleyicisi) — tek doğruluk kaynağı budur.
 */
export function evaluateAnswers(
  questions: Question[],
  studentAnswers: Record<string, string>
): TestAnswer[] {
  return questions.map((q) => {
    const studentAnswer = studentAnswers[q.id] ?? "";
    return {
      questionId: q.id,
      outcomeId: q.outcomeId,
      studentAnswer,
      isCorrect: studentAnswer.trim() === q.correctAnswer.trim(),
    };
  });
}

export function updateMasteryFromAnswers(
  existingRecords: Record<string, MasteryRecord>,
  answers: TestAnswer[],
  questions: Question[],
  studentId: string
): Record<string, MasteryRecord> {
  const questionById = new Map(questions.map((q) => [q.id, q]));
  const updated = { ...existingRecords };

  for (const answer of answers) {
    const question = questionById.get(answer.questionId);
    if (!question) continue;

    const prev = updated[answer.outcomeId];
    const newLevel = computeUpdatedMastery(
      prev?.level ?? null,
      answer.isCorrect,
      question.difficulty
    );

    updated[answer.outcomeId] = {
      outcomeId: answer.outcomeId,
      studentId,
      level: newLevel,
      status: levelToStatus(newLevel),
      attemptsCount: (prev?.attemptsCount ?? 0) + 1,
      correctCount: (prev?.correctCount ?? 0) + (answer.isCorrect ? 1 : 0),
      lastTestedAt: new Date().toISOString(),
    };
  }

  return updated;
}

export function scorePercentage(answers: TestAnswer[]): number {
  if (answers.length === 0) return 0;
  const correct = answers.filter((a) => a.isCorrect).length;
  return Math.round((correct / answers.length) * 100);
}
