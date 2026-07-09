import { useState } from "react";

interface OnlineRegisterProps {
  onRegisterComplete: (studentName: string) => void;
  onBackToLogin: () => void;
  defaultPackage?: string;
}

export function OnlineRegister({ onRegisterComplete, onBackToLogin, defaultPackage }: OnlineRegisterProps) {
  const [step, setStep] = useState<"grade" | "package" | "payment">("grade");
  
  // Selections
  const [selectedGrade, setSelectedGrade] = useState("8");
  const [selectedPackage, setSelectedPackage] = useState(defaultPackage || "duzen");
  
  // Veli / Student Info
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentUsername, setStudentUsername] = useState("");
  const [studentPassword, setStudentPassword] = useState("123");

  // Payment mock states
  const [cardNumber, setCardNumber] = useState("4355 8800 1122 3344");
  const [cardExpiry, setCardExpiry] = useState("12/29");
  const [cardCvv, setCardCvv] = useState("321");

  const packagesInfo: Record<string, { title: string; normalPrice: string; promoPrice: string; installment: string; desc: string; icon: string }> = {
    baslangic: {
      title: "🌱 Başlangıç (Ücretsiz)",
      normalPrice: "",
      promoPrice: "Ücretsiz",
      installment: "Taahhütsüz & Ücretsiz Deneme",
      desc: "Temel çalışma planı ve günlük görev takibi ile çalışma alışkanlığı edinme adımı.",
      icon: "🌱"
    },
    duzen: {
      title: "🚀 Düzen Paketi",
      normalPrice: "750 TL",
      promoPrice: "500 TL / Ay",
      installment: "Aylık Ödeme Seçeneği",
      desc: "Ertelenen ders analizleri, otomatik rutin revizyonları ve düzenli çalışma alışkanlığı kazandırma koçluğu.",
      icon: "🚀"
    },
    gelisim: {
      title: "🎯 Gelişim Paketi",
      normalPrice: "1.800 TL",
      promoPrice: "1.200 TL / Ay",
      installment: "Aylık Ödeme Seçeneği",
      desc: "Ders bazlı uzman AI koçları, deneme analizi yorumlama ve performansa göre anlık plan optimizasyonu.",
      icon: "🎯"
    },
    premium: {
      title: "👑 Premium Paketi",
      normalPrice: "3.000 TL",
      promoPrice: "2.000 TL / Ay",
      installment: "Aylık Ödeme Seçeneği",
      desc: "Uzun dönem başarı/motivasyon takibi, proaktif veli danışmanı raporları ve erken başarı risk analizi.",
      icon: "👑"
    }
  };

  function handleNextStep() {
    if (step === "grade") {
      setStep("package");
    } else if (step === "package") {
      setStep("payment");
    }
  }

  function handleBackStep() {
    if (step === "package") {
      setStep("grade");
    } else if (step === "payment") {
      setStep("package");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!parentName.trim() || !studentName.trim() || !studentUsername.trim()) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }
    
    const pack = packagesInfo[selectedPackage];
    localStorage.setItem("grade_level_" + studentUsername, selectedGrade);
    alert(`Ödeme Onaylandı! 🎉\n\n${studentName} öğrencimiz ${selectedGrade}. Sınıf ${pack.title} aboneliği ile kaydedildi.\nKullanıcı adı: ${studentUsername}`);
    onRegisterComplete(studentUsername);
  }

  return (
    <div className="login-container" style={{ padding: "40px 16px" }}>
      <div className="login-card" style={{ maxWidth: 580, textAlign: "left" }}>
        
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 900, margin: 0 }}>UzemGO & EduMentor Kayıt</h2>
          <button onClick={onBackToLogin} style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 700, cursor: "pointer" }}>Giriş Ekranı</button>
        </div>

        {/* STEP PROGRESS TRACKER */}
        <div style={{ display: "flex", gap: 8, marginBottom: 25 }}>
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: step === "grade" || step === "package" || step === "payment" ? "var(--primary)" : "var(--border-light)" }} />
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: step === "package" || step === "payment" ? "var(--primary)" : "var(--border-light)" }} />
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: step === "payment" ? "var(--primary)" : "var(--border-light)" }} />
        </div>

        {/* STEP 1: SELECT GRADE */}
        {step === "grade" && (
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 850, marginBottom: 8 }}>Çocuğunuz Kaçıncı Sınıfta?</h3>
            <p className="login-subtitle" style={{ marginBottom: 20 }}>5. Sınıftan 8. Sınıf LGS Hazırlığa kadar uygun seviyeyi belirleyin.</p>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginBottom: 25 }}>
              {[
                { val: "5", label: "5. Sınıf", sub: "Temel Eğitim & Alıştırma" },
                { val: "6", label: "6. Sınıf", sub: "Müfredat Pekiştirme" },
                { val: "7", label: "7. Sınıf", sub: "LGS Ön Hazırlık" },
                { val: "8", label: "8. Sınıf (LGS)", sub: "LGS Yoğun Kamp Programı" }
              ].map(item => (
                <div 
                  key={item.val}
                  onClick={() => setSelectedGrade(item.val)}
                  style={{
                    padding: 16,
                    borderRadius: "var(--radius-md)",
                    border: selectedGrade === item.val ? "2px solid var(--primary)" : "1.5px solid var(--border-light)",
                    background: selectedGrade === item.val ? "rgba(99, 102, 241, 0.04)" : "var(--bg-body)",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  <strong style={{ display: "block", fontSize: "1.1rem" }}>{item.label}</strong>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{item.sub}</span>
                </div>
              ))}
            </div>

            <button onClick={handleNextStep} className="primary-btn">İleri: Eğitim Paketini Seç</button>
          </div>
        )}

        {/* STEP 2: SELECT PACKAGE */}
        {step === "package" && (
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 850, marginBottom: 8 }}>Eğitim Paketi Seçin</h3>
            <p className="login-subtitle" style={{ marginBottom: 20 }}>İhtiyacınıza en uygun AI koçluk programını belirleyin (Kitaplı veya Canlı rehberlik).</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 25 }}>
              {Object.keys(packagesInfo).map(key => {
                const p = packagesInfo[key];
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
                      transition: "all 0.2s"
                    }}
                  >
                    <span style={{ fontSize: "2rem", alignSelf: "center" }}>{p.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <strong style={{ fontSize: "0.95rem" }}>{p.title}</strong>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ textDecoration: "line-through", color: "var(--text-muted)", fontSize: "0.75rem", marginRight: 6 }}>{p.normalPrice}</span>
                          <strong style={{ color: "var(--primary)", fontSize: "1rem" }}>{p.promoPrice}</strong>
                        </div>
                      </div>
                      <p style={{ margin: "4px 0 6px 0", fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.4 }}>{p.desc}</p>
                      <div style={{ display: "inline-block", background: "rgba(16, 185, 129, 0.08)", color: "var(--success)", fontSize: "0.72rem", padding: "2px 8px", borderRadius: 4, fontWeight: 800 }}>
                        💳 {p.installment}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleBackStep} className="primary-btn" style={{ background: "var(--white)", border: "1px solid var(--border-light)", color: "var(--text-main)", boxShadow: "none" }}>Geri</button>
              <button onClick={handleNextStep} className="primary-btn" style={{ flex: 2 }}>İleri: Ödeme ve Kayıt</button>
            </div>
          </div>
        )}

        {/* STEP 3: PAYMENT FORM */}
        {step === "payment" && (
          <form onSubmit={handleSubmit}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 850, marginBottom: 15 }}>Kayıt ve Taksit / Kart Ödeme</h3>

            <div className="form-group">
              <label>Veli Ad Soyad *</label>
              <input type="text" value={parentName} onChange={(e) => setParentName(e.target.value)} placeholder="Örn: Sinan Yılmaz" required />
            </div>
            <div className="form-group">
              <label>Veli İletişim Telefonu *</label>
              <input type="text" value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} placeholder="Örn: 0555-000-0000" required />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <div className="form-group" style={{ flex: 2 }}>
                <label>Öğrenci Ad Soyad *</label>
                <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Örn: Arda Yılmaz" required />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Öğrenci Giriş Adı *</label>
                <input type="text" value={studentUsername} onChange={(e) => setStudentUsername(e.target.value)} placeholder="ardayilmaz" required />
              </div>
            </div>

            <div className="form-group">
              <label>Kredi Kartı Numarası (Peşin Fiyatına 12 Taksit İmkanı)</label>
              <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="4355 8800 1122 3344" />
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Son Kullanma</label>
                <input type="text" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="MM/YY" />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>CVV</label>
                <input type="text" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} placeholder="321" />
              </div>
            </div>

            <div className="demo-info-box" style={{ background: "rgba(16,185,129,0.05)", borderColor: "var(--success)" }}>
              <strong style={{ color: "var(--success)" }}>💳 Seçilen Program: {packagesInfo[selectedPackage].title} ({packagesInfo[selectedPackage].promoPrice})</strong>
              <p>Çocuğunuz {selectedGrade}. Sınıf programına dahil edilecektir. Tüm banka kartlarına vade farksız 12 taksit otomatik uygulanır.</p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={handleBackStep} className="primary-btn" style={{ background: "var(--white)", border: "1px solid var(--border-light)", color: "var(--text-main)", boxShadow: "none" }}>Geri</button>
              <button type="submit" className="primary-btn" style={{ flex: 2, background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 6px 16px rgba(16, 185, 129, 0.25)" }}>
                Ödeme Yap ve Kaydı Tamamla
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
