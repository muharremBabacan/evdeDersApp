import { useMemo, useState } from "react";

interface OnlineRegisterProps {
  onRegisterComplete: (studentName: string) => void;
  onBackToLogin: () => void;
  defaultPackage?: string;
}

type RegisterStep = "grade" | "package" | "details";

type PackageKey = "duzen" | "gelisim" | "premium";

interface PackageInfo {
  title: string;
  price: string;
  installment: string;
  desc: string;
  icon: string;
}

const packagesInfo: Record<PackageKey, PackageInfo> = {
  duzen: {
    title: "Düzen Paketi",
    price: "500 TL / Ay",
    installment: "Aylık ödeme",
    desc: "Günlük çalışma planı, görev tamamlama takibi, mini test ve haftalık veli raporu.",
    icon: "⏱️",
  },
  gelisim: {
    title: "Gelişim Paketi",
    price: "1.000 TL / Ay",
    installment: "Video ve simülasyon destekli",
    desc: "Kazanım bazlı seviye takibi, video çalışma odası, simülasyonlar ve takviye ihtiyacı sinyalleri.",
    icon: "📈",
  },
  premium: {
    title: "Yoğun Takip Paketi",
    price: "2.000 TL / Ay",
    installment: "Yakın akademik takip",
    desc: "Detaylı yazılı/deneme analizi, aylık gelişim raporu ve 8. sınıflar için LGS destek modu.",
    icon: "🎯",
  },
};

function normalizeStudentUsername(studentName: string) {
  const normalized = studentName
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 18);

  return normalized ? `${normalized}${Math.floor(100 + Math.random() * 900)}` : `ogrenci${Date.now().toString().slice(-4)}`;
}

export function OnlineRegister({ onRegisterComplete, onBackToLogin, defaultPackage }: OnlineRegisterProps) {
  const defaultPackageKey: PackageKey =
    defaultPackage === "duzen" || defaultPackage === "gelisim" || defaultPackage === "premium"
      ? defaultPackage
      : "gelisim";

  const [step, setStep] = useState<RegisterStep>("grade");
  const [selectedGrade, setSelectedGrade] = useState("8");
  const [selectedPackage, setSelectedPackage] = useState<PackageKey>(defaultPackageKey);

  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [studentName, setStudentName] = useState("");
  const [dailyStudyTime, setDailyStudyTime] = useState("45");
  const [mainGoal, setMainGoal] = useState("duzen");

  const selectedPackageInfo = packagesInfo[selectedPackage];

  const studentUsernamePreview = useMemo(() => {
    if (!studentName.trim()) return "Kayıt sonrası oluşturulur";
    return normalizeStudentUsername(studentName);
  }, [studentName]);

  function handleNextStep() {
    if (step === "grade") {
      setStep("package");
    } else if (step === "package") {
      setStep("details");
    }
  }

  function handleBackStep() {
    if (step === "package") {
      setStep("grade");
    } else if (step === "details") {
      setStep("package");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!parentName.trim() || !parentPhone.trim() || !studentName.trim()) {
      alert("Lütfen veli adı, veli telefonu ve öğrenci adını doldurun.");
      return;
    }

    const studentUsername = normalizeStudentUsername(studentName);
    const enrollmentDraft = {
      parentName,
      parentPhone,
      parentEmail,
      studentName,
      studentUsername,
      gradeLevel: selectedGrade,
      packageKey: selectedPackage,
      packageTitle: selectedPackageInfo.title,
      packagePrice: selectedPackageInfo.price,
      dailyStudyTime,
      mainGoal,
      status: "pending_setup",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("grade_level_" + studentUsername, selectedGrade);
    localStorage.setItem("enrollment_draft_" + studentUsername, JSON.stringify(enrollmentDraft));

    alert(
      `Kayıt başvurusu alındı.\n\nÖğrenci: ${studentName}\nSınıf: ${selectedGrade}. sınıf\nPaket: ${selectedPackageInfo.title} (${selectedPackageInfo.price})\nÖğrenci giriş adı: ${studentUsername}\n\nBir sonraki adımda ödeme ve hesap aktivasyonu bağlanacaktır.`
    );

    onRegisterComplete(studentUsername);
  }

  return (
    <div className="login-container" style={{ padding: "40px 16px" }}>
      <div className="login-card" style={{ maxWidth: 620, textAlign: "left" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 16 }}>
          <div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 900, margin: 0 }}>Veli Kayıt Başvurusu</h2>
            <p className="login-subtitle" style={{ margin: "6px 0 0 0" }}>
              Çocuğunuzun sınıfına göre AI mentorlu çalışma paneli hazırlanır.
            </p>
          </div>
          <button onClick={onBackToLogin} style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
            Giriş Ekranı
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 25 }}>
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: "var(--primary)" }} />
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: step === "package" || step === "details" ? "var(--primary)" : "var(--border-light)" }} />
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: step === "details" ? "var(--primary)" : "var(--border-light)" }} />
        </div>

        {step === "grade" && (
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 850, marginBottom: 8 }}>Çocuğunuz kaçıncı sınıfta?</h3>
            <p className="login-subtitle" style={{ marginBottom: 20 }}>
              Platform 5, 6, 7 ve 8. sınıf öğrencileri için evde ders çalışma düzeni kurar. 8. sınıfta LGS destek modu ayrıca devreye girer.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginBottom: 25 }}>
              {[
                { val: "5", label: "5. Sınıf", sub: "Alışkanlık ve temel beceri" },
                { val: "6", label: "6. Sınıf", sub: "Konu düzeni ve tekrar" },
                { val: "7", label: "7. Sınıf", sub: "Akademik dayanıklılık" },
                { val: "8", label: "8. Sınıf", sub: "Okul başarısı + LGS destek modu" },
              ].map((item) => (
                <div
                  key={item.val}
                  onClick={() => setSelectedGrade(item.val)}
                  style={{
                    padding: 16,
                    borderRadius: "var(--radius-md)",
                    border: selectedGrade === item.val ? "2px solid var(--primary)" : "1.5px solid var(--border-light)",
                    background: selectedGrade === item.val ? "rgba(99, 102, 241, 0.04)" : "var(--bg-body)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <strong style={{ display: "block", fontSize: "1.1rem" }}>{item.label}</strong>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{item.sub}</span>
                </div>
              ))}
            </div>

            <button onClick={handleNextStep} className="primary-btn">İleri: Paketi Seç</button>
          </div>
        )}

        {step === "package" && (
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 850, marginBottom: 8 }}>Takip düzeyini seçin</h3>
            <p className="login-subtitle" style={{ marginBottom: 20 }}>
              Paketler ücretsiz değildir. Her paket çocuğunuzun günlük planını, öğrenci panelini ve veli takibini farklı derinlikte hazırlar.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 25 }}>
              {(Object.keys(packagesInfo) as PackageKey[]).map((key) => {
                const packageInfo = packagesInfo[key];
                const isSelected = selectedPackage === key;
                return (
                  <div
                    key={key}
                    onClick={() => setSelectedPackage(key)}
                    style={{
                      display: "flex",
                      gap: 15,
                      padding: 16,
                      borderRadius: "var(--radius-md)",
                      border: isSelected ? "2px solid var(--primary)" : "1.5px solid var(--border-light)",
                      background: isSelected ? "rgba(99, 102, 241, 0.04)" : "var(--bg-body)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <span style={{ fontSize: "2rem", alignSelf: "center" }}>{packageInfo.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                        <strong style={{ fontSize: "0.95rem" }}>{packageInfo.title}</strong>
                        <strong style={{ color: "var(--primary)", fontSize: "1rem", whiteSpace: "nowrap" }}>{packageInfo.price}</strong>
                      </div>
                      <p style={{ margin: "4px 0 6px 0", fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.4 }}>{packageInfo.desc}</p>
                      <div style={{ display: "inline-block", background: "rgba(16, 185, 129, 0.08)", color: "var(--success)", fontSize: "0.72rem", padding: "2px 8px", borderRadius: 4, fontWeight: 800 }}>
                        {packageInfo.installment}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleBackStep} className="primary-btn" style={{ background: "var(--white)", border: "1px solid var(--border-light)", color: "var(--text-main)", boxShadow: "none" }}>Geri</button>
              <button onClick={handleNextStep} className="primary-btn" style={{ flex: 2 }}>İleri: Veli ve Öğrenci Bilgileri</button>
            </div>
          </div>
        )}

        {step === "details" && (
          <form onSubmit={handleSubmit}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 850, marginBottom: 15 }}>Veli ve öğrenci bilgileri</h3>

            <div className="form-group">
              <label>Veli Ad Soyad *</label>
              <input type="text" value={parentName} onChange={(e) => setParentName(e.target.value)} placeholder="Örn: Sinan Yılmaz" required />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Veli Telefon *</label>
                <input type="tel" value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} placeholder="Örn: 0555 000 0000" required />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Veli E-posta</label>
                <input type="email" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} placeholder="veli@ornek.com" />
              </div>
            </div>

            <div className="form-group">
              <label>Öğrenci Ad Soyad *</label>
              <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Örn: Arda Yılmaz" required />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Günlük hedef çalışma süresi</label>
                <select value={dailyStudyTime} onChange={(e) => setDailyStudyTime(e.target.value)}>
                  <option value="30">30 dakika</option>
                  <option value="45">45 dakika</option>
                  <option value="60">60 dakika</option>
                  <option value="90">90 dakika</option>
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Öncelikli hedef</label>
                <select value={mainGoal} onChange={(e) => setMainGoal(e.target.value)}>
                  <option value="duzen">Ders çalışma düzeni</option>
                  <option value="eksik">Eksik konu kapatma</option>
                  <option value="yazili">Okul yazılılarına hazırlık</option>
                  <option value="lgs">8. sınıf LGS destek modu</option>
                </select>
              </div>
            </div>

            <div className="demo-info-box" style={{ background: "rgba(16,185,129,0.05)", borderColor: "var(--success)" }}>
              <strong style={{ color: "var(--success)" }}>
                Seçilen plan: {selectedPackageInfo.title} ({selectedPackageInfo.price})
              </strong>
              <p>
                {selectedGrade}. sınıf için öğrenci paneli hazırlanır. Öğrenci giriş adı: <code>{studentUsernamePreview}</code>
              </p>
              <p style={{ marginTop: 6 }}>
                Bu ekranda kart bilgisi alınmaz. Gerçek ödeme ve hesap aktivasyonu sonraki entegrasyon adımında güvenli ödeme altyapısına bağlanacaktır.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={handleBackStep} className="primary-btn" style={{ background: "var(--white)", border: "1px solid var(--border-light)", color: "var(--text-main)", boxShadow: "none" }}>Geri</button>
              <button type="submit" className="primary-btn" style={{ flex: 2, background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 6px 16px rgba(16, 185, 129, 0.25)" }}>
                Kayıt Başvurusunu Oluştur
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
