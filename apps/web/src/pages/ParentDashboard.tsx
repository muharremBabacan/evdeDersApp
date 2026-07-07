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

  // Mock attendance
  const attendance = { present: 48, absent: 2, late: 1 };

  // Mock notes
  const teacherNotes = [
    { id: 1, teacher: "Ahmet Demir (Matematik)", note: "Arda cebirsel ifadeler testinde çok gayretliydi. Hatalarını inceledi, yükseliş trendi devam ediyor.", date: "05.07.2026" },
    { id: 2, teacher: "Merve Şahin (Fen Bilgisi)", note: "Sıvı basıncı konusunda küçük detayları kaçırabiliyor. Soru çözerek pekiştirmesi gerekiyor.", date: "03.07.2026" }
  ];

  // Mock payments
  const installments = [
    { id: 1, amount: "7,500 TL", date: "15.06.2026", status: "Ödendi", method: "Kredi Kartı" },
    { id: 2, amount: "7,500 TL", date: "15.07.2026", status: "Bekliyor", method: "-" },
    { id: 3, amount: "7,500 TL", date: "15.08.2026", status: "Bekliyor", method: "-" },
    { id: 4, amount: "7,500 TL", date: "15.09.2026", status: "Bekliyor", method: "-" }
  ];

  return (
    <div className="app-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">👪</div>
          <div className="logo-text">
            <h1>EduMentor Veli</h1>
            <span>Öğrenci Durum Takibi</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a onClick={() => setActiveTab("overview")} className={`nav-item ${activeTab === "overview" ? "active" : ""}`}>
            <span className="icon">🏠</span> Genel Özet
          </a>
          <a onClick={() => setActiveTab("academic")} className={`nav-item ${activeTab === "academic" ? "active" : ""}`}>
            <span className="icon">📈</span> Akademik Durum
          </a>
          <a onClick={() => setActiveTab("attendance")} className={`nav-item ${activeTab === "attendance" ? "active" : ""}`}>
            <span className="icon">📅</span> Devamsızlık Takibi
          </a>
          <a onClick={() => setActiveTab("financials")} className={`nav-item ${activeTab === "financials" ? "active" : ""}`}>
            <span className="icon">💳</span> Ödeme Takibi
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
            <p>Öğrenciniz <strong>{childName}</strong> için güncel durum ve analiz paneli.</p>
          </div>
        </div>

        {activeTab === "overview" && (
          <div>
            <div className="dashboard-home-grid">
              <div className="dashboard-card">
                <h3>Öğrenci Künyesi</h3>
                <div style={{ display: "flex", gap: 15, alignItems: "center" }}>
                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80" alt="Student" style={{ borderRadius: "50%" }} />
                  <div>
                    <h4 style={{ margin: 0, fontSize: "1.1rem" }}>{childName}</h4>
                    <p style={{ margin: "4px 0", color: "var(--text-muted)", fontSize: "0.85rem" }}>{childGrade} | Seviye {childLevel} ({childPoints} Puan)</p>
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <h3>Devam Durumu</h3>
                <div style={{ display: "flex", justifyContent: "space-between", textAlign: "center" }}>
                  <div>
                    <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--success)" }}>{attendance.present}</span>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>Katılım</p>
                  </div>
                  <div>
                    <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--danger)" }}>{attendance.absent}</span>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>Devamsızlık</p>
                  </div>
                  <div>
                    <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--warning)" }}>{attendance.late}</span>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>Geç Giriş</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="section-card">
              <h3>Öğretmen Değerlendirmeleri</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                {teacherNotes.map((n) => (
                  <div key={n.id} style={{ background: "var(--bg-body)", padding: 15, borderRadius: 8, borderLeft: "4px solid var(--primary)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <strong>{n.teacher}</strong>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{n.date}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--text-main)", lineHeight: 1.5 }}>{n.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "academic" && (
          <div className="card">
            <h3>Akademik Kazanım Karnesi ({childName})</h3>
            <div className="outcome-list" style={{ marginTop: 15 }}>
              {demoOutcomes.map((outcome) => {
                const topic = demoTopics.find((t) => t.id === outcome.topicId);
                // Simulated mastery data for child
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

        {activeTab === "attendance" && (
          <div className="card">
            <h3>Devamsızlık Kayıt Çizelgesi</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 15 }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Tarih</th>
                  <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Ders Seansı</th>
                  <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Durum</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: 8, borderBottom: "1px solid var(--border-light)" }}>04.07.2026</td>
                  <td style={{ padding: 8, borderBottom: "1px solid var(--border-light)" }}>Fen Bilgisi - Öğleden Sonra</td>
                  <td style={{ padding: 8, borderBottom: "1px solid var(--border-light)", color: "var(--danger)" }}>✖ Gelmedi</td>
                </tr>
                <tr>
                  <td style={{ padding: 8, borderBottom: "1px solid var(--border-light)" }}>03.07.2026</td>
                  <td style={{ padding: 8, borderBottom: "1px solid var(--border-light)" }}>Matematik - Sabah Seansı</td>
                  <td style={{ padding: 8, borderBottom: "1px solid var(--border-light)", color: "var(--success)" }}>✓ Katıldı</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "financials" && (
          <div className="card">
            <h3>Taksit Planı & Muhasebe Kaydı</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 15 }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Taksit Tutarı</th>
                  <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Vade Tarihi</th>
                  <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Ödeme Durumu</th>
                  <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Ödeme Türü</th>
                </tr>
              </thead>
              <tbody>
                {installments.map((inst) => (
                  <tr key={inst.id}>
                    <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)" }}><strong>{inst.amount}</strong></td>
                    <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)" }}>{inst.date}</td>
                    <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)" }}>
                      <span className={`status-badge ${inst.status === "Ödendi" ? "status-completed" : "status-pending"}`}>
                        {inst.status}
                      </span>
                    </td>
                    <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)", color: "var(--text-muted)" }}>{inst.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
