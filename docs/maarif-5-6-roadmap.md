# Maarif Uyumlu 5-6. Sınıf Yol Haritası

Bu doküman, Evde Ders App içinde 5 ve 6. sınıflar için Maarif Modeli uyumlu, telif güvenli ve ölçeklenebilir ders çalışma yapısını tanımlar.

## Temel Karar

- Başlangıç kapsamı sadece 5 ve 6. sınıftır.
- Ders kapsamı: Matematik, Fen Bilimleri, Türkçe, Sosyal Bilgiler.
- İngilizce şimdilik kapsam dışıdır.
- 7 ve 8. sınıflar ikinci fazdır; LGS beceri haritası ile ayrıca ele alınacaktır.
- MEB/TYMM PDF'leri kullanıcıya gösterilecek içerik değil, iç müfredat uyum referansıdır.

## Telif Güvenli İçerik İlkesi

- PDF metinleri, yönergeleri, soruları ve etkinlikleri uygulamada birebir kullanılmaz.
- Ders anlatımı, mini test, destekleme, zenginleştirme ve veli raporları özgün yazılır.
- PDF'ler sadece sınıf, ders, tema, öğrenme sırası ve seviye mantığını doğrulamak için kullanılır.
- Uygulama içinde MEB sayfası, PDF sayfası veya kitap metni servis edilmez.
- İç veri modelinde kaynak notu yalnızca "Maarif uyum referansı" düzeyinde tutulur.

## Mevcut PDF Envanteri

### Fen Bilimleri

- `Fen Bilimleri 5 Farklılaştırma Etkinlikleri.pdf` - 85 sayfa
- `Fen Bilimleri 6 Farklılaştırma Etkinlikleri.pdf` - 76 sayfa
- `FenBilimleri_5. sınıf_1kitap.pdf` - 166 sayfa
- `FenBilimleri_5. sınıf_2kitap.pdf` - 152 sayfa
- `FenBilimleri_6. sınıf_1kitap.pdf` - 186 sayfa
- `FenBilimleri_6. sınıf_2kitap.pdf` - 131 sayfa
- `fen_marifmodeli.pdf` - 85 sayfa, Fen 5 farklılaştırma dosyası ile aynı kapsamda görünüyor

### Matematik

- `Matematik 5 Farklılaştırma Etkinlikleri.pdf` - 123 sayfa
- `Matematik 6 Farklılaştırma Etkinlikleri.pdf` - 106 sayfa
- `Matematik_5. sınıf_1kitap.pdf` - 171 sayfa
- `Matematik_5. sınıf_2kitap.pdf` - 189 sayfa
- `Matematik_6. sınıf_1kitap.pdf` - 222 sayfa
- `Matematik_6. sınıf_2kitap.pdf` - 166 sayfa

### Türkçe

- `Türkçe 5 Farklılaştırma Etkinlikleri.pdf` - 118 sayfa
- `Türkçe 6 Farklılaştırma Etkinlikleri.pdf` - 100 sayfa
- `Türkçe_5. sınıf_1kitap.pdf` - 182 sayfa
- `Türkçe_5. sınıf_2kitap.pdf` - 160 sayfa
- `Türkçe_6. sınıf_1kitap.pdf` - 177 sayfa
- `Türkçe_6. sınıf_2kitap.pdf` - 162 sayfa

### Sosyal Bilgiler

- `Sosyal Bilgiler 5 Farklılaştırma Etkinlikleri.pdf` - 195 sayfa
- `Sosyal Bilgiler 6 Farklılaştırma Etkinlikleri.pdf` - 96 sayfa
- `Sosyal Bilgiler 5 1. Kitap.pdf` - 154 sayfa
- `Sosyal Bilgiler 5 2. Kitap.pdf` - 150 sayfa
- `Sosyal Bilgiler 6 1. Kitap.pdf` - 187 sayfa
- `Sosyal Bilgiler 6 2. Kitap.pdf` - 116 sayfa

## Hedef Veri Modeli

Her konu şu yapıda tutulmalıdır:

```ts
type CurriculumLesson = {
  id: string;
  grade: 5 | 6;
  subject: "Fen Bilimleri" | "Matematik" | "Türkçe" | "Sosyal Bilgiler";
  term: 1 | 2;
  unitTitle: string;
  topicTitle: string;
  outcomeSummary: string;
  sourceAlignment: "Maarif uyum referansı";
  originalLesson: {
    shortExplanation: string;
    keyIdeas: string[];
    workedExample?: string;
  };
  miniQuiz: Array<{
    id: string;
    skill: string;
    question: string;
    options: string[];
    correctAnswer: string;
    hint: string;
    remediation: string;
  }>;
  supportPath: {
    trigger: "miniQuizBelowThreshold";
    explanation: string;
    practiceSteps: string[];
  };
  enrichmentPath: {
    trigger: "miniQuizHighSuccess";
    task: string;
    outputType: "poster" | "shortReport" | "model" | "dailyLifeObservation" | "conceptMap";
  };
  parentReport: {
    successText: string;
    supportText: string;
    enrichmentText: string;
  };
};
```

## Öğrenci Akışı

1. Öğrenci sınıfına göre ders seçer.
2. Sadece seçilen dersin konuları görünür.
3. Öğrenci bir konu seçer.
4. Sistem özgün kısa anlatım gösterir.
5. Öğrenci mini test çözer.
6. Sonuca göre üç yoldan biri çalışır:
   - Yetersiz: destekleme yolu
   - Yeterli: konu tamamlandı
   - Çok iyi: zenginleştirme yolu
7. Veliye sade rapor cümlesi üretilir.

## Pilot Uygulama

İlk pilot: 5. sınıf Fen Bilimleri.

Neden:

- Yeni müfredat kapsamı net.
- Ders kitabı ve farklılaştırma kılavuzu mevcut.
- Fen konuları simülasyon, gözlem ve modelleme için uygun.
- Öğrenci ve veliye hızlı değer gösterir.

Pilot hedef:

- 1 ünite veya küçük bir konu grubu seçilecek.
- En az 3 konu için özgün ders akışı hazırlanacak.
- Her konu için 5-8 özgün soru olacak.
- Başarısız cevaplarda ipucu ve tekrar adımı çalışacak.
- Başarı durumunda konu tamamlandı olarak işaretlenecek.
- Veli raporu için kısa, anlaşılır çıktı üretilecek.

## Uygulama Fazları

### Faz 1 - İçerik Altyapısı

- `apps/web/src/data/maarifCurriculum.ts` dosyası oluştur.
- Ortak `CurriculumLesson` tipini `apps/web/src/types/curriculum.ts` içine ekle veya ayrı `maarif.ts` tipi oluştur.
- İlk pilot dersleri statik veri olarak ekle.
- Mevcut `studyContentDb` içinde dağınık duran içerikleri zamanla bu yapıya taşı.

### Faz 2 - Ders Çalış Sayfası

- Mevcut `study-room-v2` akışını yeni curriculum veri modeline bağla.
- Ders seçimi, konu listesi, anlatım, mini test, sonuç analizi aynı kalır.
- Destekleme ve zenginleştirme kartları sonuç ekranına eklenir.

### Faz 3 - Veli Raporu

- Öğrenci sonuçlarından veli rapor metni üret.
- Önce localStorage ile prototip yapılır.
- Sonra Firestore şemasına taşınır.

### Faz 4 - 5-6 Yayılım

- 5 Fen pilotu tamamlandıktan sonra sırayla:
  1. 5 Matematik
  2. 5 Türkçe
  3. 5 Sosyal
  4. 6 Fen
  5. 6 Matematik
  6. 6 Türkçe
  7. 6 Sosyal

## Değişecek Dosyalar - İlk Kod Fazı

Kod yazımına geçildiğinde tahmini dosyalar:

- `apps/web/src/types/curriculum.ts`
- `apps/web/src/data/maarifCurriculum.ts`
- `apps/web/src/pages/StudentDashboard.tsx`
- Gerekirse `apps/web/src/pages/ParentDashboard.tsx`

## Etkilenecek Sistemler

- Öğrenci ders çalışma sayfası
- Konu tamamlama ve mini test akışı
- Veli rapor akışı, ikinci fazda
- Firebase/Auth/ödeme akışına ilk fazda dokunulmayacak

## Risk Analizi

### Düşük Risk

- Yeni statik curriculum veri dosyası eklemek.
- Mevcut ders çalışma sayfasına sınırlı veri bağlamak.
- LocalStorage üzerinden pilot ilerleme tutmak.

### Orta Risk

- `StudentDashboard.tsx` zaten büyük ve karmaşık. Küçük parça halinde değiştirilmeli.
- Eski `studyContentDb` ile yeni `maarifCurriculum` geçici olarak birlikte yaşayabilir.

### Kritik Risk

- Auth, ödeme, Firestore kullanıcı verisi ve canlı kayıt akışına pilot fazda dokunulmamalı.
- MEB metni veya soru içeriği birebir uygulamaya alınmamalı.

## Rollback Planı

- İlk fazda yeni dosyalar bağımsız tutulur.
- `StudentDashboard.tsx` içinde sadece `study-room-v2` veri kaynağı değiştirilir.
- Sorun olursa:
  1. `study-room-v2` eski `studyContentDb` yapısına döndürülür.
  2. Yeni `maarifCurriculum.ts` dosyası devre dışı bırakılır.
  3. Build tekrar alınır.

## Bir Sonraki Net Görev

Kodlamaya geçmeden önce yapılacak ilk iş:

1. 5. sınıf Fen Bilimleri için 3 konuluk pilot curriculum verisi yaz.
2. İçerikleri tamamen özgün üret.
3. `study-room-v2` sayfasını bu veri ile besle.
4. Build al.
5. Tarayıcıda öğrenci akışını kontrol et.
