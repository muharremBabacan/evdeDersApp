// ============================================================
// KAZANIM AĞACI: Subject -> Unit -> Topic -> LearningOutcome
// ============================================================

export type Difficulty = "kolay" | "orta" | "zor";
export type GradeLevel = 5 | 6 | 7 | 8;
export type MasteryStatus = "zayif" | "orta" | "iyi" | "tam";

export interface Subject {
  id: string;
  name: string; // "Matematik"
  gradeLevel: GradeLevel;
  order: number;
}

export interface Unit {
  id: string;
  subjectId: string;
  name: string; // "Sayılar ve İşlemler"
  order: number;
}

export interface Topic {
  id: string;
  unitId: string;
  subjectId: string;
  name: string; // "Kesirler"
  order: number;
}

export interface LearningOutcome {
  id: string;
  topicId: string;
  unitId: string;
  subjectId: string;
  code: string; // MEB kazanım kodu, örn "M.6.1.4.1"
  description: string;
  difficulty: Difficulty;
  order: number;
}

// ============================================================
// SORU HAVUZU
// ============================================================

export type QuestionSource = "MEB" | "LGS_GECMIS" | "AI_URETIM" | "MANUEL";

export interface Question {
  id: string;
  outcomeId: string;
  text: string;
  options: string[]; // 4 seçenek
  correctAnswer: string; // options içindeki birebir eşleşme
  difficulty: Difficulty;
  source: QuestionSource;
}

// ============================================================
// ÖĞRENCİ MASTERY (KAZANIM SEVİYESİ) TAKİBİ
// ============================================================

export interface MasteryRecord {
  outcomeId: string;
  studentId: string;
  level: number; // 0-100
  status: MasteryStatus;
  attemptsCount: number;
  correctCount: number;
  lastTestedAt: string; // ISO timestamp
}

export function levelToStatus(level: number): MasteryStatus {
  if (level < 40) return "zayif";
  if (level < 65) return "orta";
  if (level < 85) return "iyi";
  return "tam";
}

// ============================================================
// TEST DENEMESİ (diagnostik veya pekiştirme testi)
// ============================================================

export type TestKind = "diagnostik" | "pekistirme" | "deneme_lgs";

export interface TestAnswer {
  questionId: string;
  outcomeId: string;
  studentAnswer: string;
  isCorrect: boolean;
}

export interface TestAttempt {
  id: string;
  studentId: string;
  kind: TestKind;
  outcomeIds: string[]; // bu testte hangi kazanımlar ölçüldü
  answers: TestAnswer[];
  scorePct: number;
  startedAt: string;
  finishedAt: string;
}

// ============================================================
// MASTERY GÜNCELLEME MANTIĞI (backend + frontend'de paylaşılan çekirdek kural)
// Basit ağırlıklı ortalama: yeni sonuç eskiye göre %40 ağırlıklı işlenir.
// Bu fonksiyon Cloud Function içinde test submit edilince çağrılır.
// ============================================================

export function computeUpdatedMastery(
  previousLevel: number | null,
  isCorrect: boolean,
  difficulty: Difficulty
): number {
  const difficultyWeight: Record<Difficulty, number> = {
    kolay: 0.7,
    orta: 1.0,
    zor: 1.3,
  };
  const base = previousLevel ?? 50; // hiç veri yoksa nötr başlangıç
  const delta = isCorrect ? 15 : -12;
  const weightedDelta = delta * difficultyWeight[difficulty];
  const next = base * 0.6 + (base + weightedDelta) * 0.4;
  return Math.max(0, Math.min(100, Math.round(next)));
}
