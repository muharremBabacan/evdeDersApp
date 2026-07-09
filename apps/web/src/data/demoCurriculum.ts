import type { Subject, Unit, Topic, LearningOutcome, Question } from "../types/curriculum";

// NOT: Bu demo veridir. Gerçek MEB müfredatı /scripts/seedFirestore.ts
// içindeki yapı ile Firestore'a yüklenecek — veri kaynağı değişse de
// bu tip yapısı (Subject/Unit/Topic/LearningOutcome) sabit kalır.

export const demoSubjects: Subject[] = [
  { id: "sub_mat5", name: "Matematik (5. Sınıf)", gradeLevel: 5, order: 1 },
  { id: "sub_mat6", name: "Matematik (6. Sınıf)", gradeLevel: 6, order: 2 },
];

export const demoUnits: Unit[] = [
  // 5. Sınıf Temaları (Maarif Modeli)
  { id: "unit_mat5_t1", subjectId: "sub_mat5", name: "1. Tema: Geometrik Şekiller", order: 1 },
  { id: "unit_mat5_t2", subjectId: "sub_mat5", name: "2. Tema: Sayılar ve Nicelikler", order: 2 },
  { id: "unit_mat5_t3", subjectId: "sub_mat5", name: "3. Tema: Geometrik Nicelikler", order: 3 },
  { id: "unit_mat5_t4", subjectId: "sub_mat5", name: "4. Tema: Sayılar ve Nicelikler (2): Kesirler", order: 4 },
  { id: "unit_mat5_t5", subjectId: "sub_mat5", name: "5. Tema: İstatistiksel Araştırma Süreci", order: 5 },
  { id: "unit_mat5_t6", subjectId: "sub_mat5", name: "6. Tema: İşlemlerle Cebirsel Düşünme", order: 6 },
  { id: "unit_mat5_t7", subjectId: "sub_mat5", name: "7. Tema: Veriden Olasılığa", order: 7 },

  // 6. Sınıf Temaları (Maarif Modeli)
  { id: "unit_mat6_t1", subjectId: "sub_mat6", name: "1. Tema: Sayılar ve Nicelikler (1)", order: 1 },
  { id: "unit_mat6_t2", subjectId: "sub_mat6", name: "2. Tema: İstatistiksel Araştırma Süreci", order: 2 },
  { id: "unit_mat6_t3", subjectId: "sub_mat6", name: "3. Tema: Sayılar ve Nicelikler (2)", order: 3 },
  { id: "unit_mat6_t4", subjectId: "sub_mat6", name: "4. Tema: Veriden Olasılığa", order: 4 },
  { id: "unit_mat6_t5", subjectId: "sub_mat6", name: "5. Tema: Geometrik Şekiller", order: 5 },
  { id: "unit_mat6_t6", subjectId: "sub_mat6", name: "6. Tema: İşlemlerle Cebirsel Düşünme", order: 6 },
  { id: "unit_mat6_t7", subjectId: "sub_mat6", name: "7. Tema: Geometrik Nicelikler", order: 7 },
];

export const demoTopics: Topic[] = [
  // 5. Sınıf Konuları
  { id: "topic_mat5_geo1", unitId: "unit_mat5_t1", subjectId: "sub_mat5", name: "Geometrik Şekiller ve Çizimler", order: 1 },
  { id: "topic_mat5_aci", unitId: "unit_mat5_t1", subjectId: "sub_mat5", name: "Açılar ve Doğrular", order: 2 },
  { id: "topic_mat5_ds", unitId: "unit_mat5_t2", subjectId: "sub_mat5", name: "Doğal Sayılar ve İşlemler", order: 1 },
  { id: "topic_mat5_alan", unitId: "unit_mat5_t3", subjectId: "sub_mat5", name: "Çevre ve Alan Ölçümü", order: 1 },
  { id: "topic_mat5_kesir", unitId: "unit_mat5_t4", subjectId: "sub_mat5", name: "Kesirler, Ondalık ve Yüzdeler", order: 1 },
  { id: "topic_mat5_tablo", unitId: "unit_mat5_t5", subjectId: "sub_mat5", name: "Araştırma Soruları ve Tablo/Grafik", order: 1 },
  { id: "topic_mat5_cebir", unitId: "unit_mat5_t6", subjectId: "sub_mat5", name: "İşlem Önceliği ve Örüntüler", order: 1 },
  { id: "topic_mat5_olas", unitId: "unit_mat5_t7", subjectId: "sub_mat5", name: "Olayların Olasılığı", order: 1 },

  // 6. Sınıf Konuları
  { id: "topic_mat6_carpan", unitId: "unit_mat6_t1", subjectId: "sub_mat6", name: "Çarpanlar ve Katlar", order: 1 },
  { id: "topic_mat6_istatistik", unitId: "unit_mat6_t2", subjectId: "sub_mat6", name: "Araştırma Soruları ve Veri", order: 1 },
  { id: "topic_mat6_ondalik", unitId: "unit_mat6_t3", subjectId: "sub_mat6", name: "Ondalık Gösterim ve Yuvarlama", order: 1 },
  { id: "topic_mat6_olasilik", unitId: "unit_mat6_t4", subjectId: "sub_mat6", name: "Olasılık Tahmin Etme", order: 1 },
  { id: "topic_mat6_acilar", unitId: "unit_mat6_t5", subjectId: "sub_mat6", name: "Açılar ve Dörtgenler", order: 1 },
  { id: "topic_mat6_cebir", unitId: "unit_mat6_t6", subjectId: "sub_mat6", name: "Cebirsel Düşünme ve Algoritma", order: 1 },
  { id: "topic_mat6_alan", unitId: "unit_mat6_t7", subjectId: "sub_mat6", name: "Paralelkenar, Üçgen ve Çember", order: 1 },
];

export const demoOutcomes: LearningOutcome[] = [
  // 5. Sınıf Kazanımları
  { id: "lo_mat5_geo1_1", topicId: "topic_mat5_geo1", unitId: "unit_mat5_t1", subjectId: "sub_mat5", code: "M.5.1.1.1", description: "Nokta, doğru parçası, ışın ve düzlem kavramlarını açıklar.", difficulty: "kolay", order: 1 },
  { id: "lo_mat5_aci_1", topicId: "topic_mat5_aci", unitId: "unit_mat5_t1", subjectId: "sub_mat5", code: "M.5.1.2.1", description: "Açıları dar, dik, geniş ve doğru açı olarak sınıflandırır.", difficulty: "orta", order: 1 },
  { id: "lo_mat5_ds_1", topicId: "topic_mat5_ds", unitId: "unit_mat5_t2", subjectId: "sub_mat5", code: "M.5.1.3.1", description: "Çok basamaklı doğal sayıları okur, yazar ve çözümler.", difficulty: "kolay", order: 1 },
  { id: "lo_mat5_alan_1", topicId: "topic_mat5_alan", unitId: "unit_mat5_t3", subjectId: "sub_mat5", code: "M.5.1.4.1", description: "Dikdörtgenin çevre uzunluğu ve alanını hesaplar.", difficulty: "orta", order: 1 },
  { id: "lo_mat5_kesir_1", topicId: "topic_mat5_kesir", unitId: "unit_mat5_t4", subjectId: "sub_mat5", code: "M.5.2.1.1", description: "Kesirleri karşılaştırır, ondalık gösterim ve yüzde ile ifade eder.", difficulty: "orta", order: 1 },
  { id: "lo_mat5_tablo_1", topicId: "topic_mat5_tablo", unitId: "unit_mat5_t5", subjectId: "sub_mat5", code: "M.5.2.2.1", description: "Araştırma sorularına uygun veri toplar ve sıklık tablosu/sütun grafiği ile gösterir.", difficulty: "orta", order: 1 },
  { id: "lo_mat5_cebir_1", topicId: "topic_mat5_cebir", unitId: "unit_mat5_t6", subjectId: "sub_mat5", code: "M.5.2.3.1", description: "Basit sayı örüntülerini inceler, üslü ifadeler ve işlem önceliğini uygular.", difficulty: "orta", order: 1 },
  { id: "lo_mat5_olas_1", topicId: "topic_mat5_olas", unitId: "unit_mat5_t7", subjectId: "sub_mat5", code: "M.5.2.4.1", description: "Basit olayların gerçekleşme olasılığını tahmin eder ve karşılaştırır.", difficulty: "orta", order: 1 },

  // 6. Sınıf Kazanımları
  { id: "lo_mat6_carpan_1", topicId: "topic_mat6_carpan", unitId: "unit_mat6_t1", subjectId: "sub_mat6", code: "M.6.1.1.1", description: "Doğal sayıların çarpanlarını ve katlarını bulur; asal sayıları belirler.", difficulty: "orta", order: 1 },
  { id: "lo_mat6_istatistik_1", topicId: "topic_mat6_istatistik", unitId: "unit_mat6_t2", subjectId: "sub_mat6", code: "M.6.2.1.1", description: "İstatistiksel araştırma soruları oluşturur ve verileri aritmetik ortalama/açıklıkla özetler.", difficulty: "orta", order: 1 },
  { id: "lo_mat6_ondalik_1", topicId: "topic_mat6_ondalik", unitId: "unit_mat6_t3", subjectId: "sub_mat6", code: "M.6.3.1.1", description: "Ondalık gösterimleri basamak değerlerine göre çözümler ve yuvarlar.", difficulty: "kolay", order: 1 },
  { id: "lo_mat6_olasilik_1", topicId: "topic_mat6_olasilik", unitId: "unit_mat6_t4", subjectId: "sub_mat6", code: "M.6.4.1.1", description: "Bir olayın gerçekleşme olasılığını tahmin eder.", difficulty: "orta", order: 1 },
  { id: "lo_mat6_acilar_1", topicId: "topic_mat6_acilar", unitId: "unit_mat6_t5", subjectId: "sub_mat6", code: "M.6.5.1.1", description: "Açılar arasındaki ilişkileri ve dörtgenlerin kenar/köşegen özelliklerini belirler.", difficulty: "zor", order: 1 },
  { id: "lo_mat6_cebir_1", topicId: "topic_mat6_cebir", unitId: "unit_mat6_t6", subjectId: "sub_mat6", code: "M.6.6.1.1", description: "Cebirsel ifadeleri yazar, değerini hesaplar ve basit örüntüleri modeller.", difficulty: "orta", order: 1 },
  { id: "lo_mat6_alan_1", topicId: "topic_mat6_alan", unitId: "unit_mat6_t7", subjectId: "sub_mat6", code: "M.6.7.1.1", description: "Paralelkenar ve üçgenin alanını hesaplar; çemberin çevresini bulur.", difficulty: "zor", order: 1 },
];

export const demoQuestions: Question[] = [
  // 5. Sınıf Soruları
  { id: "q16", outcomeId: "lo_mat5_geo1_1", text: "Bir ucu kapalı, diğer ucu sonsuza uzayan geometrik çizim hangisidir?", options: ["Doğru", "Işın", "Doğru Parçası", "Açı"], correctAnswer: "Işın", difficulty: "kolay", source: "MANUEL" },
  { id: "q17", outcomeId: "lo_mat5_geo1_1", text: "İki ucu da sınırlandırılmış olan düz çizgiye ne denir?", options: ["Işın", "Düzlem", "Doğru Parçası", "Doğru"], correctAnswer: "Doğru Parçası", difficulty: "kolay", source: "MANUEL" },
  { id: "q18", outcomeId: "lo_mat5_aci_1", text: "Ölçüsü 115 derece olan bir açı hangi açı çeşidine girer?", options: ["Dik Açı", "Dar Açı", "Geniş Açı", "Doğru Açı"], correctAnswer: "Geniş Açı", difficulty: "orta", source: "MANUEL" },
  { id: "q19", outcomeId: "lo_mat5_aci_1", text: "Düzlemde hiç kesişmeyen doğrulara ne ad verilir?", options: ["Dik Doğrular", "Paralel Doğrular", "Çakışık Doğrular", "Kesişen Doğrular"], correctAnswer: "Paralel Doğrular", difficulty: "orta", source: "MANUEL" },
  { id: "q20", outcomeId: "lo_mat5_ds_1", text: "12 005 080 sayısının doğru okunuşu hangisidir?", options: ["On iki milyon beş yüz seksen", "On iki milyon beş bin seksen", "On iki milyon elli bin seksen", "Yüz yirmi milyon beş bin seksen"], correctAnswer: "On iki milyon beş bin seksen", difficulty: "kolay", source: "MANUEL" },
  { id: "q21", outcomeId: "lo_mat5_ds_1", text: "34 509 120 sayısındaki '5' rakamının basamak değeri kaçtır?", options: ["500 000", "50 000", "5 000", "50"], correctAnswer: "500 000", difficulty: "orta", source: "MANUEL" },
  { id: "q22", outcomeId: "lo_mat5_alan_1", text: "Uzun kenarı 10 cm, kısa kenarı 6 cm olan bir dikdörtgenin çevresi kaç cm'dir?", options: ["16", "32", "60", "40"], correctAnswer: "32", difficulty: "kolay", source: "MANUEL" },
  { id: "q23", outcomeId: "lo_mat5_alan_1", text: "Alanı 48 santimetrekare olan bir dikdörtgenin kenarları tam sayı ise çevresi en az kaç cm olabilir?", options: ["28", "32", "26", "22"], correctAnswer: "28", difficulty: "zor", source: "MANUEL" },
  { id: "q38", outcomeId: "lo_mat5_kesir_1", text: "Payı 1 olan kesirlere ne ad verilir?", options: ["Birim Kesir", "Bileşik Kesir", "Tam Sayılı Kesir", "Denk Kesir"], correctAnswer: "Birim Kesir", difficulty: "kolay", source: "MANUEL" },
  { id: "q39", outcomeId: "lo_mat5_kesir_1", text: "0,75 ondalık gösteriminin yüzde sembolü ile yazılışı hangisidir?", options: ["%7,5", "%0,75", "%75", "%750"], correctAnswer: "%75", difficulty: "orta", source: "MANUEL" },
  { id: "q40", outcomeId: "lo_mat5_tablo_1", text: "Bir okuldaki öğrencilerin en sevdiği spor dalını araştırmak için en uygun yöntem hangisidir?", options: ["Tahmin etme", "Rastgele sayı seçme", "Anket uygulama ve veri toplama", "Rapor okuma"], correctAnswer: "Anket uygulama ve veri toplama", difficulty: "orta", source: "MANUEL" },
  { id: "q41", outcomeId: "lo_mat5_tablo_1", text: "Ende edilen verilerin dikey veya yatay sütunlar halinde gösterildiği grafiğe ne denir?", options: ["Daire Grafiği", "Sütun Grafiği", "Çizgi Grafiği", "Sıklık Tablosu"], correctAnswer: "Sütun Grafiği", difficulty: "kolay", source: "MANUEL" },
  { id: "q42", outcomeId: "lo_mat5_cebir_1", text: "3 x (5 + 4) işleminin sonucu kaçtır?", options: ["27", "19", "12", "32"], correctAnswer: "27", difficulty: "kolay", source: "MANUEL" },
  { id: "q43", outcomeId: "lo_mat5_cebir_1", text: "2, 5, 8, 11... şeklinde devam eden örüntünün 5. terimi kaçtır?", options: ["14", "13", "12", "15"], correctAnswer: "14", difficulty: "orta", source: "MANUEL" },
  { id: "q44", outcomeId: "lo_mat5_olas_1", text: "Hilesiz bir madeni para havaya atıldığında üst yüze yazı gelmesi olasılığı nedir?", options: ["Kesin Olay", "Eş Olasılıklı (1/2)", "İmkânsız Olay", "Daha Fazla Olasılıklı"], correctAnswer: "Eş Olasılıklı (1/2)", difficulty: "kolay", source: "MANUEL" },
  { id: "q45", outcomeId: "lo_mat5_olas_1", text: "Bir torbada 3 kırmızı ve 3 mavi top vardır. Rastgele çekilen bir topun kırmızı olma olasılığı ile mavi olma olasılığı için hangisi doğrudur?", options: ["Kırmızı olma olasılığı daha fazladır", "Mavi olma olasılığı daha fazladır", "Olasılıkları eşittir", "Kırmızı çekmek imkansızdır"], correctAnswer: "Olasılıkları eşittir", difficulty: "orta", source: "MANUEL" },

  // 6. Sınıf Soruları
  { id: "q24", outcomeId: "lo_mat6_carpan_1", text: "36 sayısının kaç tane pozitif tam sayı çarpanı vardır?", options: ["6", "8", "9", "10"], correctAnswer: "9", difficulty: "orta", source: "MANUEL" },
  { id: "q25", outcomeId: "lo_mat6_carpan_1", text: "Aşağıdakilerden hangisi bir asal sayıdır?", options: ["15", "21", "29", "33"], correctAnswer: "29", difficulty: "kolay", source: "MANUEL" },
  { id: "q26", outcomeId: "lo_mat6_istatistik_1", text: "Bir gruptaki verilerin toplamının veri sayısına bölünmesiyle hangisi elde edilir?", options: ["Açıklık", "Medyan", "Aritmetik Ortalama", "Mod"], correctAnswer: "Aritmetik Ortalama", difficulty: "kolay", source: "MANUEL" },
  { id: "q27", outcomeId: "lo_mat6_istatistik_1", text: "7, 12, 5, 23, 18 sayı grubunun açıklığı kaçtır?", options: ["18", "23", "5", "6"], correctAnswer: "18", difficulty: "orta", source: "MANUEL" },
  { id: "q28", outcomeId: "lo_mat6_ondalik_1", text: "3,485 ondalık gösteriminin yüzde birler basamağına göre yuvarlanmış hali nedir?", options: ["3,48", "3,49", "3,50", "3,40"], correctAnswer: "3,49", difficulty: "orta", source: "MANUEL" },
  { id: "q29", outcomeId: "lo_mat6_ondalik_1", text: "12,704 sayısındaki '0' rakamının bulunduğu basamağın adı nedir?", options: ["Onda birler basamağı", "Yüzde birler basamağı", "Binde birler basamağı", "Birler basamağı"], correctAnswer: "Yüzde birler basamağı", difficulty: "kolay", source: "MANUEL" },
  { id: "q30", outcomeId: "lo_mat6_olasilik_1", text: "Bir zar atıldığında üst yüze gelen sayının 7 olması olayının olasılığı türü nedir?", options: ["Kesin Olay", "İmkânsız Olay", "Eş Olasılıklı Olay", "Daha Fazla Olasılıklı Olay"], correctAnswer: "İmkânsız Olay", difficulty: "kolay", source: "MANUEL" },
  { id: "q31", outcomeId: "lo_mat6_olasilik_1", text: "Havaya atılan hilesiz bir madeni paranın tura gelme olasılığı kaçtır?", options: ["1", "0", "1/2", "1/4"], correctAnswer: "1/2", difficulty: "orta", source: "MANUEL" },
  { id: "q32", outcomeId: "lo_mat6_acilar_1", text: "İki iç açısı 50° ve 70° olan bir üçgenin üçüncü iç açısı kaç derecedir?", options: ["50°", "60°", "70°", "80°"], correctAnswer: "60°", difficulty: "orta", source: "MANUEL" },
  { id: "q33", outcomeId: "lo_mat6_acilar_1", text: "Karşılıklı kenarları paralel ve tüm kenar uzunlukları eşit olan fakat açıları dik olmayan dörtgen hangisidir?", options: ["Kare", "Yamuk", "Eşkenar Dörtgen", "Dikdörtgen"], correctAnswer: "Eşkenar Dörtgen", difficulty: "zor", source: "MANUEL" },
  { id: "q34", outcomeId: "lo_mat6_cebir_1", text: "'Bir sayının 3 katının 5 fazlası' ifadesinin cebirsel gösterimi hangisidir?", options: ["3x - 5", "3(x + 5)", "3x + 5", "x/3 + 5"], correctAnswer: "3x + 5", difficulty: "kolay", source: "MANUEL" },
  { id: "q35", outcomeId: "lo_mat6_cebir_1", text: "Kuralı 4n - 1 olan sayı örüntüsünün 5. terimi kaçtır?", options: ["19", "20", "21", "24"], correctAnswer: "19", difficulty: "orta", source: "MANUEL" },
  { id: "q36", outcomeId: "lo_mat6_alan_1", text: "Tabanı 8 cm, yüksekliği 5 cm olan bir üçgenin alanını hesaplayınız.", options: ["40", "20", "15", "10"], correctAnswer: "20", difficulty: "orta", source: "MANUEL" },
  { id: "q37", outcomeId: "lo_mat6_alan_1", text: "Yarıçapı 5 cm olan bir çemberin çevre uzunluğu kaç cm'dir? (pi = 3 alınız)", options: ["15", "30", "45", "60"], correctAnswer: "30", difficulty: "zor", source: "MANUEL" },
];
