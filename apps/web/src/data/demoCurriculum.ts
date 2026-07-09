import type { Subject, Unit, Topic, LearningOutcome, Question } from "../types/curriculum";

// NOT: Bu demo veridir. Gerçek MEB müfredatı /scripts/seedFirestore.ts
// içindeki yapı ile Firestore'a yüklenecek — veri kaynağı değişse de
// bu tip yapısı (Subject/Unit/Topic/LearningOutcome) sabit kalır.

export const demoSubjects: Subject[] = [
  { id: "sub_mat6", name: "Matematik", gradeLevel: 6, order: 1 },
  { id: "sub_mat5", name: "Matematik (5. Sınıf)", gradeLevel: 5, order: 2 },
];

export const demoUnits: Unit[] = [
  { id: "unit_sayilar", subjectId: "sub_mat6", name: "Sayılar ve İşlemler", order: 1 },
  { id: "unit_veri", subjectId: "sub_mat6", name: "Veri İşleme", order: 2 },
  { id: "unit_mat5_t1", subjectId: "sub_mat5", name: "1. Tema: Geometrik Şekiller", order: 1 },
  { id: "unit_mat5_t2", subjectId: "sub_mat5", name: "2. Tema: Sayılar ve Nicelikler", order: 2 },
  { id: "unit_mat5_t3", subjectId: "sub_mat5", name: "3. Tema: Geometrik Nicelikler", order: 3 },
];

export const demoTopics: Topic[] = [
  { id: "topic_kesirler", unitId: "unit_sayilar", subjectId: "sub_mat6", name: "Kesirler", order: 1 },
  { id: "topic_ondalik", unitId: "unit_sayilar", subjectId: "sub_mat6", name: "Ondalık Gösterim", order: 2 },
  { id: "topic_sutun_grafik", unitId: "unit_veri", subjectId: "sub_mat6", name: "Sütun Grafiği", order: 1 },
  { id: "topic_mat5_geo1", unitId: "unit_mat5_t1", subjectId: "sub_mat5", name: "Geometrik Şekiller ve Çizimler", order: 1 },
  { id: "topic_mat5_aci", unitId: "unit_mat5_t1", subjectId: "sub_mat5", name: "Açılar ve Doğrular", order: 2 },
  { id: "topic_mat5_ds", unitId: "unit_mat5_t2", subjectId: "sub_mat5", name: "Doğal Sayılar ve İşlemler", order: 1 },
  { id: "topic_mat5_alan", unitId: "unit_mat5_t3", subjectId: "sub_mat5", name: "Çevre ve Alan Ölçümü", order: 1 },
];

export const demoOutcomes: LearningOutcome[] = [
  {
    id: "lo_kesir_1",
    topicId: "topic_kesirler",
    unitId: "unit_sayilar",
    subjectId: "sub_mat6",
    code: "M.6.1.4.1",
    description: "Kesirlerle toplama ve çıkarma işlemlerini yapar.",
    difficulty: "orta",
    order: 1,
  },
  {
    id: "lo_kesir_2",
    topicId: "topic_kesirler",
    unitId: "unit_sayilar",
    subjectId: "sub_mat6",
    code: "M.6.1.4.2",
    description: "Kesirlerle çarpma ve bölme işlemlerini yapar.",
    difficulty: "zor",
    order: 2,
  },
  {
    id: "lo_ondalik_1",
    topicId: "topic_ondalik",
    unitId: "unit_sayilar",
    subjectId: "sub_mat6",
    code: "M.6.1.5.1",
    description: "Ondalık gösterimleri kesir olarak, kesirleri ondalık gösterim olarak yazar.",
    difficulty: "kolay",
    order: 1,
  },
  {
    id: "lo_sutun_1",
    topicId: "topic_sutun_grafik",
    unitId: "unit_veri",
    subjectId: "sub_mat6",
    code: "M.6.4.1.1",
    description: "Verileri sütun grafiği ile gösterir ve yorumlar.",
    difficulty: "orta",
    order: 1,
  },
  {
    id: "lo_mat5_geo1_1",
    topicId: "topic_mat5_geo1",
    unitId: "unit_mat5_t1",
    subjectId: "sub_mat5",
    code: "M.5.1.1.1",
    description: "Nokta, doğru parçası, ışın ve düzlem kavramlarını açıklar.",
    difficulty: "kolay",
    order: 1,
  },
  {
    id: "lo_mat5_aci_1",
    topicId: "topic_mat5_aci",
    unitId: "unit_mat5_t1",
    subjectId: "sub_mat5",
    code: "M.5.1.2.1",
    description: "Açıları dar, dik, geniş ve doğru açı olarak sınıflandırır.",
    difficulty: "orta",
    order: 1,
  },
  {
    id: "lo_mat5_ds_1",
    topicId: "topic_mat5_ds",
    unitId: "unit_mat5_t2",
    subjectId: "sub_mat5",
    code: "M.5.1.3.1",
    description: "Çok basamaklı doğal sayıları okur, yazar ve çözümler.",
    difficulty: "kolay",
    order: 1,
  },
  {
    id: "lo_mat5_alan_1",
    topicId: "topic_mat5_alan",
    unitId: "unit_mat5_t3",
    subjectId: "sub_mat5",
    code: "M.5.1.4.1",
    description: "Dikdörtgenin çevre uzunluğu ve alanını hesaplar.",
    difficulty: "orta",
    order: 1,
  },
];

export const demoQuestions: Question[] = [
  // lo_kesir_1
  { id: "q1", outcomeId: "lo_kesir_1", text: "1/2 + 1/4 işleminin sonucu kaçtır?", options: ["1/6", "2/6", "3/4", "2/4"], correctAnswer: "3/4", difficulty: "kolay", source: "MANUEL" },
  { id: "q2", outcomeId: "lo_kesir_1", text: "3/5 - 1/5 işleminin sonucu kaçtır?", options: ["2/5", "2/10", "4/5", "1/5"], correctAnswer: "2/5", difficulty: "kolay", source: "MANUEL" },
  { id: "q3", outcomeId: "lo_kesir_1", text: "2/3 + 1/6 işleminin sonucu kaçtır?", options: ["3/6", "5/6", "3/9", "1/2"], correctAnswer: "5/6", difficulty: "orta", source: "MANUEL" },
  { id: "q4", outcomeId: "lo_kesir_1", text: "7/8 - 3/4 işleminin sonucu kaçtır?", options: ["1/8", "4/4", "1/4", "3/8"], correctAnswer: "1/8", difficulty: "orta", source: "MANUEL" },
  { id: "q5", outcomeId: "lo_kesir_1", text: "1 1/2 + 2 1/3 işleminin sonucu kaçtır?", options: ["3 5/6", "3 1/6", "4 1/6", "3 2/3"], correctAnswer: "3 5/6", difficulty: "zor", source: "MANUEL" },

  // lo_kesir_2
  { id: "q6", outcomeId: "lo_kesir_2", text: "1/2 x 2/3 işleminin sonucu kaçtır?", options: ["2/6", "1/3", "3/5", "2/5"], correctAnswer: "1/3", difficulty: "kolay", source: "MANUEL" },
  { id: "q7", outcomeId: "lo_kesir_2", text: "3/4 ÷ 1/2 işleminin sonucu kaçtır?", options: ["3/8", "3/2", "1/2", "6/4"], correctAnswer: "3/2", difficulty: "orta", source: "MANUEL" },
  { id: "q8", outcomeId: "lo_kesir_2", text: "2/5 x 5/6 işleminin sonucu kaçtır?", options: ["1/3", "10/30", "2/6", "7/11"], correctAnswer: "1/3", difficulty: "orta", source: "MANUEL" },
  { id: "q9", outcomeId: "lo_kesir_2", text: "5/6 ÷ 2/3 işleminin sonucu kaçtır?", options: ["5/4", "10/18", "5/9", "3/4"], correctAnswer: "5/4", difficulty: "zor", source: "MANUEL" },
  { id: "q10", outcomeId: "lo_kesir_2", text: "4/9 x 3/8 işleminin sonucu kaçtır?", options: ["1/6", "12/72", "7/17", "1/3"], correctAnswer: "1/6", difficulty: "zor", source: "MANUEL" },

  // lo_ondalik_1
  { id: "q11", outcomeId: "lo_ondalik_1", text: "3/10 kesrinin ondalık gösterimi nedir?", options: ["0.3", "3.0", "0.03", "1.3"], correctAnswer: "0.3", difficulty: "kolay", source: "MANUEL" },
  { id: "q12", outcomeId: "lo_ondalik_1", text: "0.75 ondalık gösteriminin kesir hali nedir?", options: ["75/10", "3/4", "7/5", "5/7"], correctAnswer: "3/4", difficulty: "orta", source: "MANUEL" },
  { id: "q13", outcomeId: "lo_ondalik_1", text: "7/100 kesrinin ondalık gösterimi nedir?", options: ["0.7", "0.07", "7.00", "0.007"], correctAnswer: "0.07", difficulty: "kolay", source: "MANUEL" },

  // lo_sutun_1
  { id: "q14", outcomeId: "lo_sutun_1", text: "Sütun grafiğinde çubukların yüksekliği neyi temsil eder?", options: ["Rengi", "Sıklığı/değeri", "Adını", "Şeklini"], correctAnswer: "Sıklığı/değeri", difficulty: "kolay", source: "MANUEL" },
  { id: "q15", outcomeId: "lo_sutun_1", text: "Bir sütun grafiğinde en yüksek çubuk neyi gösterir?", options: ["En küçük değeri", "En sık tekrar eden/en büyük değeri", "Ortalamayı", "Toplamı"], correctAnswer: "En sık tekrar eden/en büyük değeri", difficulty: "orta", source: "MANUEL" },

  // lo_mat5_geo1_1
  { id: "q16", outcomeId: "lo_mat5_geo1_1", text: "Bir ucu kapalı, diğer ucu sonsuza uzayan geometrik çizim hangisidir?", options: ["Doğru", "Işın", "Doğru Parçası", "Açı"], correctAnswer: "Işın", difficulty: "kolay", source: "MANUEL" },
  { id: "q17", outcomeId: "lo_mat5_geo1_1", text: "İki ucu da sınırlandırılmış olan düz çizgiye ne denir?", options: ["Işın", "Düzlem", "Doğru Parçası", "Doğru"], correctAnswer: "Doğru Parçası", difficulty: "kolay", source: "MANUEL" },

  // lo_mat5_aci_1
  { id: "q18", outcomeId: "lo_mat5_aci_1", text: "Ölçüsü 115 derece olan bir açı hangi açı çeşidine girer?", options: ["Dik Açı", "Dar Açı", "Geniş Açı", "Doğru Açı"], correctAnswer: "Geniş Açı", difficulty: "orta", source: "MANUEL" },
  { id: "q19", outcomeId: "lo_mat5_aci_1", text: "Düzlemde hiç kesişmeyen doğrulara ne ad verilir?", options: ["Dik Doğrular", "Paralel Doğrular", "Çakışık Doğrular", "Kesişen Doğrular"], correctAnswer: "Paralel Doğrular", difficulty: "orta", source: "MANUEL" },

  // lo_mat5_ds_1
  { id: "q20", outcomeId: "lo_mat5_ds_1", text: "12 005 080 sayısının doğru okunuşu hangisidir?", options: ["On iki milyon beş yüz seksen", "On iki milyon beş bin seksen", "On iki milyon elli bin seksen", "Yüz yirmi milyon beş bin seksen"], correctAnswer: "On iki milyon beş bin seksen", difficulty: "kolay", source: "MANUEL" },
  { id: "q21", outcomeId: "lo_mat5_ds_1", text: "34 509 120 sayısındaki '5' rakamının basamak değeri kaçtır?", options: ["500 000", "50 000", "5 000", "50"], correctAnswer: "500 000", difficulty: "orta", source: "MANUEL" },

  // lo_mat5_alan_1
  { id: "q22", outcomeId: "lo_mat5_alan_1", text: "Uzun kenarı 10 cm, kısa kenarı 6 cm olan bir dikdörtgenin çevresi kaç cm'dir?", options: ["16", "32", "60", "40"], correctAnswer: "32", difficulty: "kolay", source: "MANUEL" },
  { id: "q23", outcomeId: "lo_mat5_alan_1", text: "Alanı 48 santimetrekare olan bir dikdörtgenin kenarları tam sayı ise çevresi en az kaç cm olabilir?", options: ["28", "32", "26", "22"], correctAnswer: "28", difficulty: "zor", source: "MANUEL" },
];
