/**
 * Kullanım (laptopta, proje kök dizininde):
 *   1. Firebase Console > Project Settings > Service Accounts > Generate new private key
 *   2. İndirilen JSON dosyasını scripts/serviceAccountKey.json olarak kaydet
 *      (BU DOSYA .gitignore'DA — asla commit etme)
 *   3. npm run seed
 *
 * Bu script demo müfredatı (apps/web/src/data/demoCurriculum.ts) Firestore'a yükler.
 * Gerçek MEB müfredatı geldiğinde aynı script'in veri kaynağı değiştirilecek,
 * yapı (subjects/units/topics/learningOutcomes/questions) sabit kalacak.
 */
import { initializeApp } from "firebase-admin/app";
import { credential } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import {
  demoSubjects,
  demoUnits,
  demoTopics,
  demoOutcomes,
  demoQuestions,
} from "../apps/web/src/data/demoCurriculum";
import { readFileSync } from "fs";
import { join } from "path";

const serviceAccountPath = join(__dirname, "serviceAccountKey.json");
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));

initializeApp({
  credential: credential.cert(serviceAccount),
});

const db = getFirestore();

async function seed() {
  console.log("Müfredat verisi Firestore'a yükleniyor...");

  const batch = db.batch();

  for (const subject of demoSubjects) {
    batch.set(db.collection("subjects").doc(subject.id), subject);
  }
  for (const unit of demoUnits) {
    batch.set(db.collection("units").doc(unit.id), unit);
  }
  for (const topic of demoTopics) {
    batch.set(db.collection("topics").doc(topic.id), topic);
  }
  for (const outcome of demoOutcomes) {
    batch.set(db.collection("learningOutcomes").doc(outcome.id), outcome);
  }
  for (const question of demoQuestions) {
    batch.set(db.collection("questions").doc(question.id), question);
  }

  await batch.commit();

  console.log(
    `Tamamlandı: ${demoSubjects.length} ders, ${demoUnits.length} ünite, ${demoTopics.length} konu, ${demoOutcomes.length} kazanım, ${demoQuestions.length} soru yüklendi.`
  );
}

seed().catch((err) => {
  console.error("Seed işlemi başarısız:", err);
  process.exit(1);
});
