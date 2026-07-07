import { useState } from "react";
import { demoOutcomes, demoTopics } from "../data/demoCurriculum";

interface ParentDashboardProps {
  username: string;
  onLogout: () => void;
}

export function ParentDashboard({ username, onLogout }: ParentDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [reportType, setReportType] = useState<"daily" | "weekly" | "monthly">("weekly");
  
  // Interactive Chat State
  const [chatMessages, setChatMessages] = useState([
    { sender: "ai", text: "Merhaba Sinan Bey. Öğrenciniz Arda'nın LGS hazırlık gelişimiyle ilgili merak ettiğiniz her şeyi bana sorabilirsiniz. Çocuğumuzun platformdaki gerçek verilerine dayanarak pedagojik ilkeler çerçevesinde yanıtlar sunmaktayım." }
  ]);
  const [inputVal, setInputVal] = useState("");

  // Mock student stats
  const childName = "Arda Yılmaz";
  const childGrade = "8. Sınıf";
  const childPoints = 1250;
  const childLevel = 5;

  // Mock billing
  const subscriptionStatus = "Aktif (Düzen Paketi)";
  const monthlyCost = "500 TL / Ay";
  const nextBillingDate = "15.08.2026";

  function handleSendMessage(text: string) {
    if (!text.trim()) return;
    
    // Add user message
    const userMsg = { sender: "user", text };
    setChatMessages(prev => [...prev, userMsg]);
    setInputVal("");

    // Simulate AI response
    setTimeout(() => {
      let responseText = "";
      const query = text.toLowerCase();

      if (query.includes("nasıl") || query.includes("durum") || query.includes("hafta")) {
        responseText = "Gözlem: Arda bu hafta çalışma hedeflerinin %90'ını başarıyla tamamladı. Anlamlandırma: Son günlerde okul yoğunluğu nedeniyle fen bilimleri özetlerini ertelediğini görüyoruz. Yapıcı Öneri: Bugün ona dersleri sormak yerine, gününün nasıl geçtiği üzerine sohbet edebilirsiniz. Güçlü Yön: Kendi planını sorumlulukla yürütme gayreti gelişimini hızlandırıyor.";
      } else if (query.includes("matematik")) {
        responseText = "Gözlem: Matematik üslü sayılar kazanımlarındaki başarı oranı %88 ile son derece güçlü. Anlamlandırma: Soruları çözerken gösterdiği odaklanma düzeyi yüksek. Yapıcı Öneri: Çabasını ve başarısını fark ettiğinizi ona hissettirmeniz motivasyonunu koruyacaktır. Güçlü Yön: Analitik düşünme ve soru analiz becerisi oldukça yüksektir.";
      } else if (query.includes("baskı") || query.includes("zorla")) {
        responseText = "Gelişim Odaklı Görüş: Arda'nın çalışma planını kendi disipliniyle yürütme becerisi zaten iyi durumda. Bu aşamada ders çalışması yönünde yapılacak bir baskı, çocuğun kendi hedeflerine duyduğu motivasyonu olumsuz etkileyebilir. Bunun yerine, oluşturduğu düzenli çalışma rutinine saygı duyarak onu cesaretlendirmenizi öneririm.";
      } else {
        responseText = "Gözlem ve Değerlendirme: Arda'nın son verilerine göre LGS hazırlık programındaki düzen puanı 92/100 seviyesindedir. Günlük görevlerini istikrarlı bir şekilde tamamlamaktadır. Bu dönemde kısa süreli ve hedefe yönelik çalışma rutinini desteklemek en yapıcı adımdır.";
      }

      setChatMessages(prev => [...prev, { sender: "ai", text: responseText }]);
    }, 600);
  }

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
            <span className="icon">🏠</span> Genel Özet & AI Koç
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
            <h2>Merhaba Sinan Bey! 👋</h2>
            <p>Öğrenciniz <strong>{childName}</strong> için AI koçluk analizleri ve 4 yıllık LGS gelişim süreci.</p>
          </div>
        </div>

        {/* EBEVEYN TAVSİYESİ BANNER */}
        <div className="banner-tip" style={{ background: "rgba(99, 102, 241, 0.08)", borderLeft: "4px solid var(--primary)", padding: "14px 20px", borderRadius: 8, marginBottom: 20 }}>
          <span style={{ fontSize: "1.1rem", marginRight: 8 }}>💡</span>
          <strong style={{ color: "var(--primary)" }}>Günün Ebeveyn Tavsiyesi: </strong>
          <span style={{ fontSize: "0.9rem", color: "var(--text-main)", fontWeight: 600 }}>
            "Bugün Arda'ya derslerini sormak yerine, gününün nasıl geçtiği hakkında genel bir sohbet kurmayı tercih edin. Çalışma gayretini fark ettiğinizi hissettirmek güvenini artıracaktır."
          </span>
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
                    <strong>Düzen Puanı:</strong> <span style={{ color: "var(--primary)", fontWeight: 800 }}>92 / 100 (İstikrarlı)</span>
                  </div>
                  <div>
                    <strong>Tercih Ettiği Stil:</strong> <span style={{ color: "var(--primary)", fontWeight: 700 }}>Görsel & Aktif Soru Çözümü</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TIME-SERIES REPORTS (DAILY, WEEKLY, MONTHLY) */}
            <div className="section-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15, borderBottom: "1.5px solid var(--border-light)", paddingBottom: 10 }}>
                <h3 style={{ margin: 0 }}>📊 Zaman Bazlı AI Değerlendirmeleri</h3>
                <div style={{ display: "flex", gap: 8 }}>
                  {(["daily", "weekly", "monthly"] as const).map(type => (
                    <button 
                      key={type}
                      onClick={() => setReportType(type)}
                      style={{
                        padding: "6px 14px",
                        fontSize: "0.78rem",
                        fontWeight: 800,
                        borderRadius: 6,
                        border: "1px solid var(--border-light)",
                        cursor: "pointer",
                        background: reportType === type ? "var(--primary)" : "var(--white)",
                        color: reportType === type ? "white" : "var(--text-main)",
                        transition: "all 0.2s"
                      }}
                    >
                      {type === "daily" ? "Günlük" : type === "weekly" ? "Haftalık" : "Aylık Rapor"}
                    </button>
                  ))}
                </div>
              </div>

              {/* REPORT CONTENTS */}
              {reportType === "daily" && (
                <div style={{ background: "var(--bg-body)", padding: 18, borderRadius: 8, borderLeft: "4px solid #10b981" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 15, marginBottom: 15 }}>
                    <div><strong>Bugünkü Tamamlanma:</strong> <span style={{ color: "var(--success)" }}>%85</span></div>
                    <div><strong>En Çok Vakit Harcanan:</strong> <span>Matematik (90 dk)</span></div>
                    <div><strong>En Çok Zorlanılan Kazanım:</strong> <span style={{ color: "var(--danger)" }}>Fen Bilimleri (Sıvı Basıncı)</span></div>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.5 }}>
                    <strong>AI Günlük Değerlendirmesi:</strong> Bugün Matematik planındaki tüm görevleri başarıyla tamamladı. Sıvı Basıncı konusunda erteleme eğilimi gösterdiği için plana mini bir videolu konu anlatımı ekledik. Yarın bu konuyu sormak yerine çabasını destekleyin.
                  </p>
                </div>
              )}

              {reportType === "weekly" && (
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
              )}

              {reportType === "monthly" && (
                <div style={{ background: "var(--bg-body)", padding: 18, borderRadius: 8, borderLeft: "4px solid #06b6d4" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 15, marginBottom: 15 }}>
                    <div><strong>Aylık Düzen Puanı Değişimi:</strong> <span style={{ color: "var(--success)" }}>+12% Artış</span></div>
                    <div><strong>Öğrenme Alışkanlığı Trendi:</strong> <span>Görsel Odaklı</span></div>
                    <div><strong>Hedeflere Yakınlık:</strong> <span style={{ color: "var(--primary)" }}>%78 Uyumlu</span></div>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.5 }}>
                    <strong>Öğrenme DNA'sı Özeti:</strong> Arda en yüksek verimlilik oranına 16:00-18:00 saatleri arasında ulaşıyor. Matematikteki gelişim hızı oldukça istikrarlıdır. Önümüzdeki ay, Sıvı Basıncı gibi soyut Fen kazanımlarını oyunlaştırılmış LGS denemeleriyle desteklemeye devam edeceğiz. Herhangi bir başarı riski bulunmamaktadır.
                  </p>
                </div>
              )}
            </div>

            {/* INTERACTIVE VELI AI CHATBOT BOX */}
            <div className="section-card" style={{ marginTop: 25 }}>
              <h3>💬 AI Veli Danışmanına Sorun</h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: -4, marginBottom: 15 }}>
                Arda'nın akademik durumu, çalışma stili ve LGS hedefleri hakkında aklınıza takılanları pedagojik ilkelere bağlı kalarak yanıtlarım.
              </p>

              {/* Chat Log */}
              <div style={{ height: "200px", overflowY: "auto", border: "1.5px solid var(--border-light)", borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", gap: 10, background: "var(--white)", marginBottom: 12 }}>
                {chatMessages.map((msg, index) => (
                  <div 
                    key={index} 
                    style={{
                      alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                      background: msg.sender === "user" ? "var(--primary)" : "var(--bg-body)",
                      color: msg.sender === "user" ? "white" : "var(--text-main)",
                      padding: "10px 14px",
                      borderRadius: 8,
                      maxWidth: "80%",
                      fontSize: "0.85rem",
                      lineHeight: 1.45,
                      border: msg.sender === "ai" ? "1.5px solid var(--border-light)" : "none"
                    }}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              {/* Quick Actions (Chips) */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                {[
                  "Bu hafta genel olarak nasıl gidiyor?",
                  "Matematik başarısını artırmak için ne yapmalıyım?",
                  "Sence ders çalışması için baskı yapmalı mıyım?"
                ].map(q => (
                  <button 
                    key={q}
                    onClick={() => handleSendMessage(q)}
                    style={{
                      background: "rgba(99, 102, 241, 0.06)",
                      border: "1px solid rgba(99, 102, 241, 0.15)",
                      color: "var(--primary)",
                      fontSize: "0.78rem",
                      padding: "6px 12px",
                      borderRadius: 20,
                      cursor: "pointer",
                      fontWeight: 700,
                      transition: "all 0.2s"
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div style={{ display: "flex", gap: 10 }}>
                <input 
                  type="text" 
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Arda'nın çalışma rutini hakkında bir soru yazın..."
                  style={{ flex: 1, padding: 12, border: "1.5px solid var(--border-light)", borderRadius: 8, fontSize: "0.85rem" }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage(inputVal); }}
                />
                <button onClick={() => handleSendMessage(inputVal)} className="primary-btn" style={{ boxShadow: "none", padding: "0 20px" }}>Gönder</button>
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
