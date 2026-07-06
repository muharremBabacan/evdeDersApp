import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import {
  computeUpdatedMastery,
  levelToStatus,
  type TestAttempt,
  type MasteryRecord,
} from "@dershane/shared-types";

initializeApp();
const db = getFirestore();

/**
 * TEK DOĞRULUK KAYNAĞI: Bir öğrenci test denemesi kaydettiğinde
 * (students/{studentId}/testAttempts/{attemptId}) bu trigger otomatik
 * çalışır ve ilgili kazanımların mastery seviyesini günceller.
 *
 * Frontend'deki apps/web/src/lib/mastery.ts içindeki computeUpdatedMastery
 * ile AYNI paylaşılan fonksiyonu kullanır (packages/shared-types) —
 * yani istemci ve sunucu asla farklı sonuç üretmez, sadece istemci
 * offline modda geçici/optimistic gösterim yapar, gerçek kayıt burada olur.
 */
export const onTestAttemptCreated = onDocumentCreated(
  "students/{studentId}/testAttempts/{attemptId}",
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const attempt = snap.data() as TestAttempt;
    const studentId = event.params.studentId;

    // İlgili sorulara bak (difficulty bilgisi için)
    const questionIds = attempt.answers.map((a) => a.questionId);
    if (questionIds.length === 0) return;

    const questionsSnap = await db
      .collection("questions")
      .where("id", "in", questionIds.slice(0, 30)) // Firestore 'in' limiti 30
      .get();
    const questionById = new Map(
      questionsSnap.docs.map((d) => [d.id, d.data()])
    );

    const batch = db.batch();

    for (const answer of attempt.answers) {
      const question = questionById.get(answer.questionId);
      if (!question) continue;

      const masteryRef = db
        .collection("students")
        .doc(studentId)
        .collection("mastery")
        .doc(answer.outcomeId);

      const existingSnap = await masteryRef.get();
      const existing = existingSnap.exists
        ? (existingSnap.data() as MasteryRecord)
        : null;

      const newLevel = computeUpdatedMastery(
        existing?.level ?? null,
        answer.isCorrect,
        question.difficulty
      );

      const updated: MasteryRecord = {
        outcomeId: answer.outcomeId,
        studentId,
        level: newLevel,
        status: levelToStatus(newLevel),
        attemptsCount: (existing?.attemptsCount ?? 0) + 1,
        correctCount: (existing?.correctCount ?? 0) + (answer.isCorrect ? 1 : 0),
        lastTestedAt: new Date().toISOString(),
      };

      batch.set(masteryRef, updated);
    }

    await batch.commit();
  }
);

/**
 * Callable function: öğrenciye kişiselleştirilmiş bir sonraki test
 * (en zayıf kazanımlara öncelik vererek) oluşturur.
 * v1'de basit kural: mastery seviyesi en düşük 5 kazanımdan soru seç.
 * v2'de bu fonksiyon Claude API çağrısıyla zenginleştirilebilir
 * (bkz. mevcut Flask sistemindeki call_claude yaklaşımı).
 */
export const generateNextTest = onCall(async (request) => {
  const studentId = request.data?.studentId;
  if (!studentId) {
    throw new HttpsError("invalid-argument", "studentId gerekli");
  }

  const masterySnap = await db
    .collection("students")
    .doc(studentId)
    .collection("mastery")
    .orderBy("level", "asc")
    .limit(5)
    .get();

  const weakOutcomeIds = masterySnap.docs.map((d) => d.id);

  if (weakOutcomeIds.length === 0) {
    return { outcomeIds: [], questions: [], message: "Henüz mastery verisi yok, diagnostik test önerilir." };
  }

  const questionsSnap = await db
    .collection("questions")
    .where("outcomeId", "in", weakOutcomeIds)
    .limit(15)
    .get();

  return {
    outcomeIds: weakOutcomeIds,
    questions: questionsSnap.docs.map((d) => d.data()),
  };
});
