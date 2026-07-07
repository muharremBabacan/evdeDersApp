import { useState } from "react";

interface OnlineRegisterProps {
  onRegisterComplete: (studentName: string) => void;
  onBackToLogin: () => void;
}

export function OnlineRegister({ onRegisterComplete, onBackToLogin }: OnlineRegisterProps) {
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [studentName, setStudentName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("8");
  const [studentUsername, setStudentUsername] = useState("");
  const [studentPassword, setStudentPassword] = useState("123");

  // Payment mock states
  const [cardNumber, setCardNumber] = useState("4355 8800 1122 3344");
  const [cardExpiry, setCardExpiry] = useState("12/29");
  const [cardCvv, setCardCvv] = useState("321");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!parentName.trim() || !studentName.trim() || !studentUsername.trim()) {
      alert("Lütfen zorunlu alanları doldurun.");
      return;
    }
    alert(`Ödeme onaylandı! 🎉\n\nÖğrenci ${studentName} (${gradeLevel}. Sınıf) sisteme kaydedildi.\nKullanıcı adı: ${studentUsername}`);
    onRegisterComplete(studentUsername);
  }

  return (
    <div className="login-container" style={{ padding: "40px 16px" }}>
      <div className="login-card" style={{ maxWidth: 500, textAlign: "left" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 900, margin: 0 }}>Veli Online Kayıt & Ödeme</h2>
          <button onClick={onBackToLogin} style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 700, cursor: "pointer" }}>Giriş Ekranı</button>
        </div>
        <p className="login-subtitle" style={{ marginBottom: 20 }}>Çocuğunuz için 5. Sınıftan 8. Sınıfa kadar AI destekli çalışma rutinini başlatın.</p>

        <form onSubmit={handleSubmit}>
          {/* PARENT DETAILS */}
          <h3 style={{ fontSize: "0.95rem", fontWeight: 800, textTransform: "uppercase", borderBottom: "1.5px solid var(--border-light)", paddingBottom: 6, marginBottom: 12 }}>1. Veli Bilgileri</h3>
          
          <div className="form-group">
            <label>Veli Ad Soyad *</label>
            <input type="text" value={parentName} onChange={(e) => setParentName(e.target.value)} placeholder="Örn: Sinan Yılmaz" required />
          </div>
          <div className="form-group">
            <label>Veli İletişim Telefonu *</label>
            <input type="text" value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} placeholder="Örn: 0555-000-0000" required />
          </div>

          {/* STUDENT DETAILS */}
          <h3 style={{ fontSize: "0.95rem", fontWeight: 800, textTransform: "uppercase", borderBottom: "1.5px solid var(--border-light)", paddingBottom: 6, marginBottom: 12, marginTop: 20 }}>2. Öğrenci Bilgileri</h3>

          <div style={{ display: "flex", gap: 10 }}>
            <div className="form-group" style={{ flex: 2 }}>
              <label>Öğrenci Ad Soyad *</label>
              <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Örn: Arda Yılmaz" required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Sınıf Seviyesi</label>
              <select value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)}>
                <option value="5">5. Sınıf</option>
                <option value="6">6. Sınıf</option>
                <option value="7">7. Sınıf</option>
                <option value="8">8. Sınıf (LGS)</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Öğrenci Giriş Adı *</label>
              <input type="text" value={studentUsername} onChange={(e) => setStudentUsername(e.target.value)} placeholder="Örn: ardayilmaz" required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Giriş Şifresi</label>
              <input type="password" value={studentPassword} onChange={(e) => setStudentPassword(e.target.value)} placeholder="123" />
            </div>
          </div>

          {/* CHECKOUT CARD DETAILS */}
          <h3 style={{ fontSize: "0.95rem", fontWeight: 800, textTransform: "uppercase", borderBottom: "1.5px solid var(--border-light)", paddingBottom: 6, marginBottom: 12, marginTop: 20 }}>3. Ödeme & Abonelik Girişi</h3>

          <div className="form-group">
            <label>Kart Numarası</label>
            <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="4355 8800 1122 3344" />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
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
            <strong style={{ color: "var(--success)" }}>💳 Aylık AI Mentor Abonelik Bedeli: 450 TL</strong>
            <p>Kayıt sonrasında 7 gün ücretsiz deneme süreniz başlayacaktır. İstediğiniz an veli panelinden iptal edebilirsiniz.</p>
          </div>

          <button type="submit" className="primary-btn" style={{ background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 6px 16px rgba(16, 185, 129, 0.25)" }}>
            Ödemeyi Tamamla ve Kayıt Ol
          </button>
        </form>
      </div>
    </div>
  );
}
