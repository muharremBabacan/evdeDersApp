import { useState } from "react";
import { demoOutcomes, demoTopics } from "../data/demoCurriculum";

interface ParentDashboardProps {
  username: string;
  onLogout: () => void;
}

export function ParentDashboard({ username, onLogout }: ParentDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock student stats
  const childName = "Arda Yılmaz";
  const childGrade = "8. Sınıf";
  const childPoints = 1250;
  const childLevel = 5;

  // Mock billing
  const subscriptionStatus = "Aktif (Deneme Süresinde)";
  const monthlyCost = "450 TL / Ay";
  const nextBillingDate = "15.07.2026";

  return (
    <div className="app-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">👪</div>
          <div className="logo-text">
            <h1>EduMentor Veli</h1>
            <span>AI İzleme Paneli</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a onClick={() => setActiveTab("overview")} className={`nav-item ${activeTab === "overview" ? "active" : ""}`}>
            <span className="icon">🏠</span> Genel Özet & Rutin
          </a>
          <a onClick={() => setActiveTab("academic")} className={`nav-item ${activeTab === "academic" ? "active" : ""}`}>
            <span className="icon">📈</span> Kazanım Karnesi
          </a>
          <a onClick={() => setActiveTab("billing")} className={`nav-item ${activeTab === "billing" ? "active" : ""}`}>
            <span className="icon">💳</span> Abonelik & Ödeme
          </a>
        </nav>

        <div className="profile-sidebar-card" style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
          <div className="profile-user">
            <div className="logo-icon" style={{ background: "rgba(255,255,255,0.2)" }}>👤</div>
            <div className="profile-user-info">
              <h3>Sinan Yılmaz</h3>
              <span>Veli Kullanıcısı</span>
            </div>
          </div>
          <div className="profile-level" style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 8 }}>
            <span>Öğrenci: {childName}</span>
            <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }}>Çıkış Yap</a>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        <div className="top-header">
          <div>
            <h2>Merhaba Veli Sinan Bey! 👋</h2>
            <p>Öğrenciniz <strong>{childName}</strong> için AI koçluk analizleri ve 4 yıllık LGS gelişim süreci.</p>
          </div>
        </div>

        {activeTab === "overview" && (
          <div>
            <div className="dashboard-home-grid">
              <div className="dashboard-card">
                <h3>Öğrenci Profili</h3>
                <div style={{ display: "flex", gap: 15, alignItems: "center" }}>
                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80" alt="Student" style={{ borderRadius: "50%" }} />
                  <div>
                    <h4 style={{ margin: 0, fontSize: "1.1rem" }}>{childName}</h4>
                    <p style={{ margin: "4px 0", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                      {childGrade} LGS Grubu | Seviye {childLevel} ({childPoints} Puan)
                    </p>
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <h3>AI Çalışma Stili Analizi</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div>
                    <strong>Öğrenme Hızı:</strong> <span style={{ color: "var(--success)", fontWeight: 700 }}>Yüksek (%15 daha hızlı kavrama)</span>
                  </div>
                  <div>
                    <strong>Tercih Ettiği Stil:</strong> <span style={{ color: "var(--primary)", fontWeight: 700 }}>Görsel & Aktif Soru Çözümü</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="section-card">
              <h3>🤖 AI Rehber Koçun Haftalık Gelişim Raporu</h3>
              <div style={{ background: "var(--bg-body)", padding: 18, borderRadius: 8, borderLeft: "4px solid var(--primary)", lineHeight: 1.6 }}>
                <p style={{ margin: "0 0 10px 0", fontSize: "0.92rem", color: "var(--text-main)" }}>
                  <strong>1. Gözlem:</strong> Arda bu hafta planlanan 4 saatlik LGS çalışma planının %90'ını başarıyla tamamladı. Matematik dersi <strong>Üslü Sayılar</strong> kazanımlarında tam pekiştirme seviyesine ulaştı.
                </p>
                <p style={{ margin: "0 0 10px 0", fontSize: "0.92rem", color: "var(--text-main)" }}>
                  <strong>2. Anlamlandırma:</strong> Fen Bilimlerinde <strong>Sıvı Basıncı</strong> konusunda bazı ufak ayrıntıları kaçırdığı gözlemlendi. Bu durum, konunun soyut yapısı veya görsel deney pratik ihtiyacından kaynaklanabilir.
                </p>
                <p style={{ margin: "0 0 10px 0", fontSize: "0.92rem", color: "var(--text-main)" }}>
                  <strong>3. Yapıcı Öneri:</strong> Günlük planına eklediğimiz 6 dakikalık görsel deney özetini evde birlikte izleyebilir ve günlük yaşam örnekleri üzerinden (örn: su barajları) üzerine sohbet edebilirsiniz.
                </p>
                <p style={{ margin: 0, fontSize: "0.92rem", color: "var(--text-main)" }}>
                  <strong>4. Güçlü Yön:</strong> Arda'nın kendi çalışma planını disiplinli şekilde takip etme gayreti ve hedeflerine olan bağlılığı gelişimini son derece hızlandırıyor.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "academic" && (
          <div className="card">
            <h3>5 - 8. Sınıf Müfredat Kazanım Karnesi ({childName})</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 15 }}>
              Öğrencinizin ortaokul LGS müfredatında yer alan kazanımlardaki güncel durumu.
            </p>
            <div className="outcome-list">
              {demoOutcomes.map((outcome) => {
                const topic = demoTopics.find((t) => t.id === outcome.topicId);
                const simulatedLevel = outcome.code.endsWith("1") ? 88 : 55;
                const simulatedStatus = simulatedLevel > 80 ? "iyi" : "orta";

                return (
                  <div key={outcome.id} className="outcome-row">
                    <div>
                      <strong>{topic?.name} ({outcome.code})</strong>
                      <p className="outcome-desc">{outcome.description}</p>
                    </div>
                    <div className="score-badge">
                      {simulatedStatus.toUpperCase()} (%{simulatedLevel})
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "billing" && (
          <div className="card">
            <h3>Abonelik & Ödeme Yönetimi</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 15, marginTop: 15 }}>
              <div style={{ background: "var(--bg-body)", padding: 15, borderRadius: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <strong>Abonelik Durumu:</strong>
                  <span className="status-badge status-completed">{subscriptionStatus}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <strong>Aylık Ücret:</strong>
                  <strong>{monthlyCost}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <strong>Bir Sonraki Fatura Tarihi:</strong>
                  <span>{nextBillingDate}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button className="primary-btn" style={{ flex: 1, background: "var(--danger)", boxShadow: "none" }} onClick={() => alert("Aboneliğiniz bir sonraki fatura döneminde sonlandırılacaktır.")}>
                  Aboneliği İptal Et
                </button>
                <button className="primary-btn" style={{ flex: 1, background: "var(--white)", border: "1px solid var(--border-light)", color: "var(--text-main)", boxShadow: "none" }} onClick={() => alert("Destek talebi oluşturuldu.")}>
                  Yardım / Destek Al
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
