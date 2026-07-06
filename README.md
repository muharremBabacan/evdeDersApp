# Ev'de Ders — v1 (Kazanım Bazlı Öğrenme Sistemi)

TypeScript monorepo. React + Vite + PWA (frontend), Firebase Cloud Functions
(backend), Firestore (veritabanı). Mevcut `evders.ardemlabs.com` Firebase
Hosting bağlantısına deploy edilmeye hazırdır.

## Mimari

```
apps/web              -> Öğrenci arayüzü (React + TS + PWA)
functions             -> Cloud Functions (mastery hesaplama, adaptif test üretimi)
packages/shared-types -> Frontend + backend'in ORTAK kullandığı tip ve iş mantığı
scripts/seedFirestore.ts -> Demo müfredatı Firestore'a yükler
firestore.rules       -> Güvenlik kuralları (öğrenci sadece kendi verisini görür)
```

Kritik tasarım kararı: mastery (kazanım seviyesi) hesaplama mantığı
(`packages/shared-types/src/index.ts` içindeki `computeUpdatedMastery`)
hem frontend'de (demo/optimistic gösterim) hem Cloud Functions'ta
(`functions/src/index.ts`) AYNI fonksiyondan çalışır. Böylece istemci ve
sunucu arasında sonuç tutarsızlığı oluşmaz.

## Kurulum ve Deploy (Firebase App Hosting)

Bu proje **Firebase App Hosting** kullanır (klasik Firebase Hosting değil).
App Hosting, Cloud Run tabanlıdır ve GitHub reposuna bağlanıp **her push'ta
otomatik build+deploy** yapar. Domain: `lgsmentor.ardemlabs.com`

### 1) Repoyu GitHub'a gönder

```bash
npm install
git init   # eğer henüz repo değilse
git add . && git commit -m "v1: kazanım bazlı öğrenme motoru"
git remote add origin <senin-repon>
git push -u origin main
```

### 2) Firebase Console'da App Hosting backend'i oluştur

1. Firebase Console → **App Hosting** → **Get started**
2. GitHub reponu bağla, branch: `main`
3. **Root directory**: `apps/web` (monorepo olduğumuz için kritik — App Hosting
   sadece bu klasörü build eder, `apphosting.yaml` de burada okunur)
4. Build/start komutları otomatik algılanır (`package.json`'daki `build` ve
   `start` script'lerinden: `tsc -b && vite build` / `superstatic dist ...`)
5. Custom domain adımında `lgsmentor.ardemlabs.com` gir, verilen DNS
   kayıtlarını `ardemlabs.com` DNS panelinde ekle (aynı süreç: doğrulama
   TXT + yönlendirme kaydı)

### 3) apps/web/apphosting.yaml içindeki değerleri doldur

Firebase Console → Project Settings → General → Your apps → Web app
config'inden alınan değerleri `BURAYA_FIREBASE_CONSOLE_DEGERI` yerine yaz,
commit et, push et — App Hosting otomatik yeniden build eder.

Bu değerler (`apiKey`, `projectId` vb.) **public/istemci bilgisidir**,
gizli değildir — asıl güvenlik `firestore.rules` ile sağlanıyor.

### 4) Firestore + Functions (App Hosting'in kapsamadığı kısım)

App Hosting sadece frontend'i (Cloud Run) yönetir. Firestore kuralları ve
Cloud Functions hâlâ klasik `firebase deploy` ile gider:

```bash
firebase use --add   # projeyi bağla, .firebaserc'i güncelle
npm run seed          # demo müfredatı Firestore'a yükle (service account gerekir)
firebase deploy --only firestore,functions
```

### 5) Lokal geliştirme (App Hosting'e hiç dokunmadan)

```bash
npm run dev   # apps/web altında Vite dev server, demo veriyle çalışır
```


## v1 Kapsamı

- Kazanım ağacı: Subject → Unit → Topic → LearningOutcome
- Demo müfredat: Matematik 6. sınıf, 2 ünite, 4 kazanım, 15 soru
- Diagnostik test alma akışı (her kazanımdan soru)
- Mastery hesaplama (0-100 seviye, zayıf/orta/iyi/tam durum)
- Öğrenci paneli: kazanım bazlı durum görünümü
- Firestore güvenlik kuralları: öğrenci sadece kendi verisine erişir

## v1'de BİLİNÇLİ OLARAK dışarıda tutulanlar (v2 planı)

- Kullanıcı girişi (Firebase Auth) — şu an tek demo öğrenci ID'si sabit
- Gerçek MEB müfredatı — şu an demo veri, `scripts/seedFirestore.ts`
  veri kaynağı değiştirilerek gerçek müfredata geçilecek
- Mevcut Flask sistemindeki öğretmen/veli/muhasebe rolleri
- Adaptif test üretimi UI'ı (backend fonksiyonu `generateNextTest` hazır,
  frontend'e henüz bağlanmadı)
- LGS gerçek sınav sorularının kazanım etiketleme işi (mevcut
  `sorular_pdf` + `parse_lgs_pdfs.py` çıktısı, tek tek kazanım koduna
  eşlenmeli — bu manuel/AI yarı-otomatik bir emek gerektiriyor)

## Sonraki Adım Önerisi

1. Bu v1'i deploy et, gerçek cihazda dene (PWA "ana ekrana ekle" test et)
2. Firebase Auth ekle (email/parola, öğrenci girişi)
3. Gerçek müfredatı (en az 1 ders, 1 sınıf) seed script'e bağla
4. `generateNextTest` fonksiyonunu frontend'e bağlayıp adaptif akışı tamamla
