import { useState, useEffect } from "react";
import { demoOutcomes, demoTopics } from "../data/demoCurriculum";

interface ParentDashboardProps {
  username: string;
  onLogout: () => void;
}

export function ParentDashboard({ username, onLogout }: ParentDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [reportType, setReportType] = useState<"daily" | "weekly" | "monthly">("weekly");
  
  const [parentStudyPlan, setParentStudyPlan] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("student_study_plan_v1");
    if (saved) {
      setParentStudyPlan(JSON.parse(saved));
    }
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "student_study_plan_v1" && e.newValue) {
        setParentStudyPlan(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);
  
  // Interactive Chat State
  const [chatMessages, setChatMessages] = useState([
    { sender: "ai", text: "Merhaba Sinan Bey. Öğrenciniz Arda'nın LGS hazırlık gelişimiyle ilgili merak ettiğiniz her şeyi bana sorabilirsiniz. Çocuğumuzun platformdaki gerçek verilerine dayanarak pedagojik ilkeler çerçevesinde yanıtlar sunmaktayım." }
  ]);
  const [inputVal, setInputVal] = useState("");

  // Mock student stats
  const childName = "Arda Yılmaz";
  const getChildGrade = () => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("grade_level_")) {
        const val = localStorage.getItem(key);
        if (val) return val + ". Sınıf";
      }
    }
    return "8. Sınıf";
  };
  const childGrade = getChildGrade();
  const childPoints = 1250;
  const childLevel = 5;

  // Mock billing
  const subscriptionStatus = "Aktif (Düzen Paketi)";
  const monthlyCost = "500 TL / Ay";
  const nextBillingDate = "15.08.2026";

  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  const parentSubjectCards = [
    {
      id: "mat",
      name: "Matematik",
      progress: 88,
      improvement: "+8%",
      status: "good",
      color: "var(--primary)",
      icon: "📐",
      outcomes: [
        { code: "M.6.1.4.1", title: "Kesirlerle toplama ve çıkarma", score: 88, desc: "Kesirlerle toplama ve çıkarma işlemlerini yapar." },
        { code: "M.6.1.4.2", title: "Kesirlerle çarpma ve bölme", score: 55, desc: "Kesirlerle çarpma ve bölme işlemlerini yapar." },
        { code: "M.6.1.5.1", title: "Ondalık Gösterim", score: 88, desc: "Ondalık gösterimleri kesir olarak, kesirleri ondalık gösterim olarak yazar." },
        { code: "M.6.4.1.1", title: "Sütun Grafiği", score: 92, desc: "Verileri sütun grafiği ile gösterir ve yorumlar." }
      ],
      aiTip: "Matematik üslü sayılar ve grafik yorumlama başarısı çok yüksek. Kesirlerle çarpma/bölme işlem pratiklerine 15 dakika ağırlık verilmesini öneririm."
    },
    {
      id: "fen",
      name: "Fen Bilimleri",
      progress: 74,
      improvement: "+14%",
      status: "warning",
      color: "#f59e0b",
      icon: "🧪",
      outcomes: [
        { code: "F.8.3.1.1", title: "Katı Basıncı", score: 82, desc: "Katı basıncını etkileyen değişkenleri deneyerek keşfeder." },
        { code: "F.8.3.1.2", title: "Sıvı Basıncı", score: 45, desc: "Sıvı basıncını etkileyen değişkenleri tahmin eder ve test eder." },
        { code: "F.8.3.1.3", title: "Gaz Basıncı", score: 72, desc: "Gaz basıncının etkilerini günlük yaşam örnekleriyle açıklar." }
      ],
      aiTip: "Sıvı basıncı konusunda formüllerin mantığını kavramakta zorlanıyor. Görsel deney animasyonlarını izlemesi bu hafta için yeterli olacaktır."
    },
    {
      id: "tur",
      name: "Türkçe",
      progress: 95,
      improvement: "+5%",
      status: "excellent",
      color: "#10b981",
      icon: "📖",
      outcomes: [
        { code: "T.8.3.14.1", title: "Paragrafta Anlam", score: 96, desc: "Görsellerle okuduğu metnin içeriğini ilişkilendirir." },
        { code: "T.8.3.16.1", title: "Sözcükte Anlam", score: 94, desc: "Deyim ve atasözlerinin metnin anlamına katkısını belirler." },
        { code: "T.8.4.18.1", title: "Yazım Kuralları", score: 89, desc: "Büyük harflerin ve noktalama işaretlerinin kullanımı." }
      ],
      aiTip: "Okuduğunu anlama ve yorumlama becerisi harika durumda. Paragraf testlerindeki odaklanması çok iyi. Bu şekilde devam edebilir."
    },
    {
      id: "ink",
      name: "T.C. İnkılap Tarihi",
      progress: 82,
      improvement: "+10%",
      status: "good",
      color: "var(--primary)",
      icon: "🕌",
      outcomes: [
        { code: "İ.8.1.1.1", title: "Uyanan Avrupa", score: 85, desc: "Avrupa'daki gelişmelerin Osmanlı Devleti'ne etkilerini analiz eder." },
        { code: "İ.8.1.2.1", title: "Mustafa Kemal'in Çocukluğu", score: 79, desc: "Mustafa Kemal'in askerlik hayatını etkileyen çevreleri açıklar." }
      ],
      aiTip: "Tarihsel kronolojiyi iyi kavrıyor. Mustafa Kemal'in hayatındaki dönüm noktalarıyla ilgili ufak bir test tekrarı faydalı olur."
    },
    {
      id: "din",
      name: "Din Kültürü",
      progress: 90,
      improvement: "+4%",
      status: "excellent",
      color: "#10b981",
      icon: "🌙",
      outcomes: [
        { code: "D.8.1.1.1", title: "Kader ve Kaza", score: 92, desc: "Kader ve kaza kavramlarını ayet ve hadislerle açıklar." },
        { code: "D.8.1.2.1", title: "İnsanın İradesi", score: 88, desc: "İnsanın iradesi ve kader ilişkisini kurar." }
      ],
      aiTip: "Kavramsal eşleştirmeleri başarıyla yapıyor. Ekstra çalışmaya ihtiyaç duymadan günlük tekrarlarını yapması yeterlidir."
    },
    {
      id: "ing",
      name: "İngilizce",
      progress: 60,
      improvement: "-2%",
      status: "danger",
      color: "#ef4444",
      icon: "🇬🇧",
      outcomes: [
        { code: "E.8.1.1.1", title: "Friendship", score: 62, desc: "Making simple inquiries and talking about personal relationships." },
        { code: "E.8.2.1.1", title: "Teen Life", score: 58, desc: "Expressing preferences and describing regular activities." }
      ],
      aiTip: "Kelime (vocabulary) ezberinde küçük bir motivasyon kaybı yaşıyor. Günlük 5 kelime öğrenme oyunuyla eğlenceli hale getirmeyi deneyin."
    }
  ];

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
    <div className="app-container mobile-app-shell">
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
            <span className="icon ai-icon ai-icon-child" aria-hidden="true"></span> Genel Özet & AI Koç
          </a>
          <a onClick={() => setActiveTab("academic")} className={`nav-item ${activeTab === "academic" ? "active" : ""}`}>
            <span className="icon ai-icon ai-icon-insight" aria-hidden="true"></span> Kazanım Karnesi
          </a>
          <a onClick={() => setActiveTab("billing")} className={`nav-item ${activeTab === "billing" ? "active" : ""}`}>
            <span className="icon ai-icon ai-icon-wallet" aria-hidden="true"></span> Abonelik & Ödeme
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

            {/* LIVE ÖĞRENCİ ÇALIŞMA PLANI TAKİBİ */}
            <div className="section-card" style={{ marginTop: 25 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15, borderBottom: "1.5px solid var(--border-light)", paddingBottom: 10 }}>
                <h3 style={{ margin: 0 }}>📅 Arda'nın Bugünkü Çalışma Planı (Canlı Takip)</h3>
                <span style={{ fontSize: "0.82rem", color: "var(--primary)", fontWeight: 800 }}>Canlı Senkronize</span>
              </div>
              
              {parentStudyPlan.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", fontStyle: "italic", margin: 0 }}>
                  Öğrenciniz bugün için henüz bir ders çalışma planı oluşturmadı.
                </p>
              ) : (
                <div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 15, background: "var(--bg-body)", padding: 15, borderRadius: 8, alignItems: "center" }}>
                    <div><strong>Toplam Hedef:</strong> {parentStudyPlan.length} Görev</div>
                    <div><strong>Tamamlanan:</strong> {parentStudyPlan.filter(t => t.completed).length} Görev</div>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, minWidth: "200px" }}>
                      <strong>İlerleme:</strong>
                      <div style={{ flex: 1, height: 8, background: "var(--border-light)", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ width: `${Math.round((parentStudyPlan.filter(t => t.completed).length / parentStudyPlan.length) * 100)}%`, height: "100%", background: "var(--success)", transition: "width 0.3s" }}></div>
                      </div>
                      <span style={{ fontWeight: 850, color: "var(--success)" }}>
                        {Math.round((parentStudyPlan.filter(t => t.completed).length / parentStudyPlan.length) * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {parentStudyPlan.map((task: any, idx: number) => (
                      <div 
                        key={task.id || idx} 
                        style={{ 
                          display: "flex", 
                          justifyContent: "space-between", 
                          alignItems: "center", 
                          padding: "12px 15px", 
                          background: "var(--white)", 
                          borderRadius: 8, 
                          border: "1.5px solid var(--border-light)",
                          borderLeft: `4px solid ${task.completed ? "var(--success)" : "var(--primary)"}`,
                          opacity: task.completed ? 0.75 : 1
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: "1.3rem" }}>{task.icon}</span>
                          <div>
                            <span style={{ fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 800, color: "var(--text-muted)" }}>
                              {task.subject} • {task.topic} ({task.type === "lesson" ? "Konu Anlatımı" : task.type === "test" ? "Mini Test" : "Etkinlik"})
                            </span>
                            <p style={{ margin: "2px 0 0 0", fontSize: "0.88rem", color: "var(--text-main)", fontWeight: 600 }}>
                              {task.action} {task.externalLink && <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "var(--primary)", background: "rgba(99, 102, 241, 0.08)", padding: "2px 6px", borderRadius: 4, marginLeft: 6 }}>🌐 EBA</span>}
                            </p>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--primary)" }}>⏱️ {task.duration} dk</span>
                          <span 
                            style={{ 
                              padding: "4px 8px", 
                              borderRadius: 6, 
                              fontSize: "0.72rem", 
                              fontWeight: 800, 
                              background: task.completed ? "rgba(16, 185, 129, 0.1)" : "rgba(99, 102, 241, 0.1)",
                              color: task.completed ? "var(--success)" : "var(--primary)"
                            }}
                          >
                            {task.completed ? "✓ Tamamlandı" : "⏳ Çalışılıyor"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
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
          <div style={{ width: "100%" }}>
            {!selectedSubjectId ? (
              <div className="card">
                <h3 style={{ marginBottom: 6 }}>🎯 Arda'nın LGS Hazırlık & Akademik Gelişim Haritası</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 20 }}>
                  Öğrencinizin ders bazlı genel başarı durumları ve kazanım seviyeleri. Detaylı alt konuları ve AI koç analizlerini görmek için ders kartlarına tıklayabilirsiniz.
                </p>
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                  {parentSubjectCards.map((subj) => {
                    const statusText = subj.status === "excellent" ? "Çok İyi" : subj.status === "good" ? "İyi" : subj.status === "warning" ? "Geliştirilmeli" : "Kritik Destek";
                    const statusColor = subj.status === "excellent" ? "#10b981" : subj.status === "good" ? "var(--primary)" : subj.status === "warning" ? "#f59e0b" : "#ef4444";
                    
                    return (
                      <div 
                        key={subj.id}
                        onClick={() => setSelectedSubjectId(subj.id)}
                        style={{
                          background: "var(--white)",
                          border: "1.5px solid var(--border-light)",
                          borderLeft: `5px solid ${statusColor}`,
                          borderRadius: "var(--radius-md)",
                          padding: 20,
                          cursor: "pointer",
                          boxShadow: "var(--shadow)",
                          transition: "all 0.2s"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                          <span style={{ fontSize: "1.5rem" }}>{subj.icon}</span>
                          <span style={{ fontSize: "0.72rem", fontWeight: 800, padding: "3px 8px", borderRadius: 4, background: `${statusColor}15`, color: statusColor }}>
                            {statusText}
                          </span>
                        </div>
                        <h4 style={{ margin: "0 0 10px 0", fontSize: "1.1rem" }}>{subj.name}</h4>
                        
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                          <div>
                            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Genel Gelişim:</span>
                            <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--text-main)" }}>%{subj.progress}</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Haftalık Değişim:</span>
                            <div style={{ fontSize: "0.9rem", fontWeight: 800, color: subj.improvement.startsWith("+") ? "#10b981" : "#ef4444" }}>
                              {subj.improvement.startsWith("+") ? "📈" : "📉"} {subj.improvement}
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ width: "100%", height: 6, background: "var(--bg-body)", borderRadius: 3, overflow: "hidden", marginBottom: 12 }}>
                          <div style={{ width: `${subj.progress}%`, height: "100%", background: statusColor, borderRadius: 3 }} />
                        </div>

                        <div style={{ fontSize: "0.78rem", color: "var(--primary)", fontWeight: 700, textAlign: "right" }}>
                          Detayları ve Kazanımları Gör →
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (() => {
              const subj = parentSubjectCards.find(s => s.id === selectedSubjectId);
              if (!subj) return null;
              const statusColor = subj.status === "excellent" ? "#10b981" : subj.status === "good" ? "var(--primary)" : subj.status === "warning" ? "#f59e0b" : "#ef4444";

              return (
                <div className="card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, borderBottom: "1.5px solid var(--border-light)", paddingBottom: 12 }}>
                    <button 
                      onClick={() => setSelectedSubjectId(null)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--primary)",
                        fontWeight: 800,
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 5
                      }}
                    >
                      ← Tüm Derslere Dön
                    </button>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: "1.5rem" }}>{subj.icon}</span>
                      <h3 style={{ margin: 0 }}>{subj.name} Kazanım Detayları</h3>
                    </div>
                  </div>

                  {/* AI Advisory Box for this subject */}
                  <div style={{ background: "rgba(99, 102, 241, 0.05)", borderLeft: `4px solid ${statusColor}`, padding: 18, borderRadius: 8, marginBottom: 25 }}>
                    <h4 style={{ margin: "0 0 6px 0", color: "var(--primary)", fontSize: "0.95rem" }}>🤖 Bu Derse Özel AI Koç Tavsiyesi</h4>
                    <p style={{ margin: 0, fontSize: "0.88rem", lineHeight: 1.5, color: "var(--text-main)" }}>
                      "{subj.aiTip}"
                    </p>
                  </div>

                  {/* Outcomes list */}
                  <h4 style={{ marginBottom: 15 }}>Alt Kazanım Gelişim Seviyeleri</h4>
                  <div className="outcome-list">
                    {subj.outcomes.map((outcome) => {
                      const simulatedStatus = outcome.score > 80 ? "iyi" : outcome.score > 60 ? "orta" : "destek";
                      const badgeBg = simulatedStatus === "iyi" ? "rgba(16, 185, 129, 0.1)" : simulatedStatus === "orta" ? "rgba(245, 158, 11, 0.1)" : "rgba(239, 68, 68, 0.1)";
                      const badgeColor = simulatedStatus === "iyi" ? "#10b981" : simulatedStatus === "orta" ? "#f59e0b" : "#ef4444";

                      return (
                        <div key={outcome.code} className="outcome-row" style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid var(--border-light)" }}>
                          <div style={{ paddingRight: 20 }}>
                            <strong style={{ fontSize: "0.9rem", color: "var(--text-main)" }}>{outcome.title} ({outcome.code})</strong>
                            <p className="outcome-desc" style={{ margin: "4px 0 0 0", fontSize: "0.78rem", color: "var(--text-muted)" }}>{outcome.desc}</p>
                          </div>
                          <div style={{
                            alignSelf: "center",
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            padding: "4px 10px",
                            borderRadius: 20,
                            background: badgeBg,
                            color: badgeColor,
                            whiteSpace: "nowrap"
                          }}>
                            %{outcome.score} {simulatedStatus.toUpperCase()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
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
