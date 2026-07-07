import { useState, useEffect } from "react";
import { demoOutcomes, demoTopics, demoQuestions } from "../data/demoCurriculum";
import { evaluateAnswers, scorePercentage } from "../lib/mastery";
import { updateMasteryFromAnswers } from "../lib/mastery";
import type { MasteryRecord } from "../types/curriculum";

interface StudentDashboardProps {
  username: string;
  onLogout: () => void;
}

export function StudentDashboard({ username, onLogout }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState("home");
  const [masteryRecords, setMasteryRecords] = useState<Record<string, MasteryRecord>>(() => {
    const saved = localStorage.getItem("masteryRecords");
    return saved ? JSON.parse(saved) : {};
  });

  // Diagnostics state
  const [testMode, setTestMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [testAnswers, setTestAnswers] = useState<Record<string, string>>({});
  const [testQuestions, setTestQuestions] = useState<typeof demoQuestions>([]);

  // Interactive Checklist State
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    math: true,
    science: false,
    turkish: true,
    english: false,
  });

  // AI Routine Planner State
  const [availableHours, setAvailableHours] = useState("2");
  const [routineResult, setRoutineResult] = useState<Array<{ subject: string; topic: string; duration: number; action: string }>>([
    { subject: "Matematik", topic: "Çarpanlar ve Katlar", duration: 50, action: "Konu Pekiştirme Soruları" },
    { subject: "Fen Bilimleri", topic: "Sıvı Basıncı", duration: 40, action: "Deney Temelli Video Anlatım" },
    { subject: "Türkçe", topic: "Paragrafta Anlam", duration: 30, action: "Okuma Hızı Egzersizi" }
  ]);

  // Flashcards state
  const [flashcardOpen, setFlashcardOpen] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);

  // Video state
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");

  // Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "ai" | "student"; text: string }>>([
    { sender: "ai", text: "Merhaba! Bugün ders çalışmak için ne kadar vaktin var? Süreni girerek sana özel LGS hazırlık rutini oluşturabilirsin! 👇" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("masteryRecords", JSON.stringify(masteryRecords));
  }, [masteryRecords]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Flashcards deck
  const flashcardsDeck = [
    { q: "Katıların basıncı yüzey alanı ile ters orantılı mıdır?", a: "Evet! Yüzey alanı küçüldükçe, katının uyguladığı basınç artar (Örn: Çivinin ucu)." },
    { q: "Sıvıların basıncı nelere bağlıdır?", a: "Sıvının derinliğine (h) ve yoğunluğuna (d) bağlıdır. Derinlik arttıkça sıvı basıncı artar." },
    { q: "Pascal Prensibi nedir?", a: "Kapalı kaplardaki sıvıların, üzerlerine uygulanan basıncı her yöne aynen iletmesi prensibidir (Örn: Hidrolik frenler)." },
    { q: "Açık hava basıncı hangi deney ile ispatlanmıştır?", a: "Toriçelli Deneyi ile. Cıva dolu boru kullanılarak açık hava basıncı 76 cmHg olarak ölçülmüştür." }
  ];

  // Dynamic calculations
  const totalCompletedTasks = Object.keys(checklist).filter(k => checklist[k]).length;
  const totalTasks = Object.keys(checklist).length;
  const progressPercent = Math.round((totalCompletedTasks / totalTasks) * 100);

  const completedOutcomesCount = Object.values(masteryRecords).filter(r => r.status === "iyi" || r.status === "tam").length;
  const totalOutcomesCount = demoOutcomes.length;
  const targetPercent = totalOutcomesCount > 0 ? Math.round((completedOutcomesCount / totalOutcomesCount) * 100) : 0;

  const totalPoints = 800 + Object.keys(masteryRecords).length * 150;
  const studentLevel = Math.floor(totalPoints / 250) + 1;

  // Generate study routine based on available duration
  function generateStudyRoutine() {
    const minutes = parseFloat(availableHours) * 60;
    if (isNaN(minutes) || minutes <= 0) {
      alert("Lütfen geçerli bir çalışma süresi girin.");
      return;
    }

    // Sort outcomes by lowest mastery level (weakest topics first)
    const outcomesWithRecords = demoOutcomes.map(outcome => {
      const record = masteryRecords[outcome.id];
      return { outcome, level: record ? record.level : 50 }; // default 50
    }).sort((a, b) => a.level - b.level);

    // Pick top 3 weakest outcomes and allocate time
    const generated = [];
    const subjects = ["Matematik", "Fen Bilimleri", "Türkçe"];
    const actions = ["Kazanım Tarama Soru Çözümü", "Video Dersi & Analoji Tekrarı", "Özet Okuma ve Flashcard"];

    const segments = 3;
    const segmentDuration = Math.round(minutes / segments);

    for (let i = 0; i < segments; i++) {
      const item = outcomesWithRecords[i % outcomesWithRecords.length];
      const topic = demoTopics.find(t => t.id === item.outcome.topicId);
      
      generated.push({
        subject: subjects[i],
        topic: topic ? topic.name : "Genel LGS",
        duration: segmentDuration,
        action: actions[i]
      });
    }

    setRoutineResult(generated);
    alert("Yapay Zeka zayıf olduğunuz kazanımları tarayarak yeni ders çalışma rutininizi oluşturdu!");
  }

  // Launch test
  function startDiagnosticTest() {
    const selected = demoOutcomes.map((outcome) => {
      const pool = demoQuestions.filter((q) => q.outcomeId === outcome.id);
      return pool[0];
    });
    setTestQuestions(selected);
    setTestAnswers({});
    setCurrentQuestionIndex(0);
    setTestMode(true);
  }

  function handleSelectAnswer(option: string) {
    const currentQ = testQuestions[currentQuestionIndex];
    setTestAnswers(prev => ({ ...prev, [currentQ.id]: option }));
  }

  function handleNextQuestion() {
    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const evaluated = evaluateAnswers(testQuestions, testAnswers);
      const updated = updateMasteryFromAnswers(
        masteryRecords,
        evaluated,
        demoQuestions,
        username
      );
      setMasteryRecords(updated);
      setTestMode(false);
      setActiveTab("home");
      alert(`Tebrikler! Test başarıyla tamamlandı. Kazanım skorunuz: %${scorePercentage(evaluated)}`);
    }
  }

  function handleChecklistToggle(subject: string) {
    setChecklist(prev => ({ ...prev, [subject]: !prev[subject] }));
  }

  function handleSendChatMessage() {
    if (!chatInput.trim()) return;
    const studentText = chatInput;
    setChatMessages(prev => [...prev, { sender: "student", text: studentText }]);
    setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let response = "LGS hazırlık planlaman için harika bir konu! Çözemediğin soruları bana gönderebilir, konu özetlerine çalışabilirsin.";
      const textLower = studentText.toLowerCase();
      if (textLower.includes("matematik") || textLower.includes("soru")) {
        response = "Matematikte üslü ifadeler konusundan günde 20 soru çözmeni öneririm. Çarpanlar ve Katlar konusundaki eksiklerini kapatırsan deneme netlerin hızla yükselecek!";
      } else if (textLower.includes("fen") || textLower.includes("basınç")) {
        response = "Fen Bilimlerinde Basınç konusu LGS'de çok belirleyicidir. Katı basıncında formülü P=G/S olarak aklında tutmalısın.";
      } else if (textLower.includes("zor") || textLower.includes("stres")) {
        response = "Unutma, düzenli uyku ve günde 25 dakika kesintisiz çalışmak stresini azaltacaktır. Sen çok iyi ilerliyorsun!";
      }
      setChatMessages(prev => [...prev, { sender: "ai", text: response }]);
    }, 1000);
  }

  return (
    <div className="app-container">
      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">✨</div>
          <div className="logo-text">
            <h1>EduMentor AI</h1>
            <span>Akıllı Öğrenme Koçun</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a onClick={() => { setTestMode(false); setActiveTab("home"); }} className={`nav-item ${activeTab === "home" && !testMode ? "active" : ""}`}>
            <span className="icon">🏠</span> Ana Sayfa
          </a>
          <a onClick={() => { setTestMode(false); setActiveTab("study-plan"); }} className={`nav-item ${activeTab === "study-plan" ? "active" : ""}`}>
            <span className="icon">📅</span> Çalışma Planım
          </a>
          <a onClick={() => { setTestMode(false); setActiveTab("ai-routine"); }} className={`nav-item ${activeTab === "ai-routine" ? "active" : ""}`}>
            <span className="icon">⏱️</span> AI Rutinim
          </a>
          <a onClick={() => { startDiagnosticTest(); }} className={`nav-item ${testMode ? "active" : ""}`}>
            <span className="icon">✏️</span> Diagnostik Test
          </a>
          <a onClick={() => { setTestMode(false); setActiveTab("exams"); }} className={`nav-item ${activeTab === "exams" ? "active" : ""}`}>
            <span className="icon">📈</span> Denemelerim
          </a>
          <a onClick={() => { setTestMode(false); setActiveTab("ai-coach"); }} className={`nav-item ${activeTab === "ai-coach" ? "active" : ""}`}>
            <span className="icon">🤖</span> AI Koçum <span className="badge">Yeni</span>
          </a>
          <a onClick={() => { setTestMode(false); setActiveTab("reports"); }} className={`nav-item ${activeTab === "reports" ? "active" : ""}`}>
            <span className="icon">📊</span> Raporlarım
          </a>
        </nav>

        <div className="profile-sidebar-card">
          <div className="profile-user">
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" alt="Student Profile" />
            <div className="profile-user-info">
              <h3>{username === "lgs_arda" ? "Arda Yılmaz" : username}</h3>
              <span>8. Sınıf Öğrencisi</span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
            <div className="profile-points-badge">{totalPoints} Puan</div>
            <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "rgba(255,255,255,0.95)" }}>Seviye {studentLevel}</span>
          </div>
          <div className="profile-level">
            <span>Hedef: LGS 2026</span>
            <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }}>Çıkış Yap</a>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* HEADER */}
        <div className="top-header">
          <div className="top-header-welcome">
            <h2>Merhaba {username === "lgs_arda" ? "Arda" : username}! 👋</h2>
            <p>Bugün harika bir gün, hedeflerine bir adım daha yaklaş!</p>
          </div>
          <div className="top-header-stats">
            <div className="top-stat-item streak">🔥 7 Günlük Seri</div>
            <div className="top-stat-item target">🎯 {targetPercent}% Hedefe Ulaşma</div>
            <button className="notification-bell-btn" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        {/* DIAGNOSTIC TEST MODE PANEL */}
        {testMode ? (
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span className="progress-label">Soru {currentQuestionIndex + 1} / {testQuestions.length}</span>
              <button className="btn-solve" onClick={() => setTestMode(false)} style={{ background: "var(--danger)" }}>Testten Çık</button>
            </div>
            {testQuestions[currentQuestionIndex] ? (
              <div>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 20 }}>
                  {testQuestions[currentQuestionIndex].text}
                </h2>
                <div className="options">
                  {testQuestions[currentQuestionIndex].options.map((opt) => (
                    <button
                      key={opt}
                      className={testAnswers[testQuestions[currentQuestionIndex].id] === opt ? "option selected" : "option"}
                      onClick={() => handleSelectAnswer(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <button
                  className="primary"
                  disabled={!testAnswers[testQuestions[currentQuestionIndex].id]}
                  onClick={handleNextQuestion}
                  style={{ padding: "12px", borderRadius: "8px" }}
                >
                  {currentQuestionIndex < testQuestions.length - 1 ? "Sonraki Soru" : "Testi Tamamla"}
                </button>
              </div>
            ) : (
              <p>Soru bulunamadı.</p>
            )}
          </div>
        ) : (
          /* TAB PANELS */
          <>
            {/* PANEL: HOME */}
            {activeTab === "home" && (
              <div className="dashboard-home-grid">
                <div>
                  {/* AI COACH WIDGET */}
                  <div className="dashboard-card ai-coach-card-layout">
                    <div className="ai-avatar-wrap">🤖</div>
                    <div className="ai-speech-bubble-wrap">
                      <h4 style={{ margin: "0 0 8px 0", fontSize: "0.8rem", color: "var(--primary)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 800 }}>Akıllı Yapay Zeka Koçun</h4>
                      <div className="ai-speech-bubble">
                        Matematikte üslü sayılar ve çarpanlar konularında kendini oldukça geliştirmişsin! Fen bilimlerinde basınç konusuna çalışarak hedeflerini tamamlayabilirsin.
                      </div>
                      <div className="ai-coach-actions">
                        <button className="btn-card-primary" onClick={() => setActiveTab("study-plan")}>Bugünkü Planın</button>
                        <button className="btn-card-secondary" onClick={() => setActiveTab("ai-coach")}>Koçumla Sohbet Et</button>
                      </div>
                    </div>
                  </div>

                  {/* INTERACTIVE CHECKLIST */}
                  <div className="dashboard-card">
                    <h3>Bugünkü Çalışma Planım</h3>
                    <div className="today-plan-list">
                      <div className={`today-plan-item ${checklist.math ? "completed" : ""}`} onClick={() => handleChecklistToggle("math")}>
                        <div className="plan-item-left">
                          <div className="plan-item-icon-box">📐</div>
                          <div className="plan-item-info">
                            <h4>Matematik</h4>
                            <p>Çarpanlar ve Katlar - 20 Soru Çözümü</p>
                          </div>
                        </div>
                        <div className="plan-item-status"></div>
                      </div>

                      <div className={`today-plan-item ${checklist.science ? "completed" : ""}`} onClick={() => handleChecklistToggle("science")}>
                        <div className="plan-item-left">
                          <div className="plan-item-icon-box">🧪</div>
                          <div className="plan-item-info">
                            <h4>Fen Bilimleri</h4>
                            <p>Basınç - Konu Anlatımı Video Takibi</p>
                          </div>
                        </div>
                        <div className="plan-item-status"></div>
                      </div>

                      <div className={`today-plan-item ${checklist.turkish ? "completed" : ""}`} onClick={() => handleChecklistToggle("turkish")}>
                        <div className="plan-item-left">
                          <div className="plan-item-icon-box">📖</div>
                          <div className="plan-item-info">
                            <h4>Türkçe</h4>
                            <p>Paragrafta Anlam - 10 Paragraf Sorusu</p>
                          </div>
                        </div>
                        <div className="plan-item-status"></div>
                      </div>

                      <div className={`today-plan-item ${checklist.english ? "completed" : ""}`} onClick={() => handleChecklistToggle("english")}>
                        <div className="plan-item-left">
                          <div className="plan-item-icon-box">🅰️</div>
                          <div className="plan-item-info">
                            <h4>İngilizce</h4>
                            <p>LGS Kelime Kartları Ezber Çalışması</p>
                          </div>
                        </div>
                        <div className="plan-item-status"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  {/* CIRCULAR PROGRESS */}
                  <div className="dashboard-card">
                    <h3>Günlük İlerleme</h3>
                    <div className="daily-progress-row">
                      <div className="progress-circle-wrap">
                        <svg width="100" height="100" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--border-light)" strokeWidth="8" />
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--primary)" strokeWidth="8"
                            strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * progressPercent) / 100}
                            strokeLinecap="round" transform="rotate(-90 50 50)" />
                        </svg>
                        <div className="progress-circle-label">
                          <h4>{progressPercent}%</h4>
                          <span>Bitti</span>
                        </div>
                      </div>
                      <div className="progress-tasks-list">
                        <div className={`progress-task-item ${checklist.math ? "completed" : ""}`}>Matematik</div>
                        <div className={`progress-task-item ${checklist.science ? "completed" : ""}`}>Fen Bilimleri</div>
                        <div className={`progress-task-item ${checklist.turkish ? "completed" : ""}`}>Türkçe</div>
                        <div className={`progress-task-item ${checklist.english ? "completed" : ""}`}>İngilizce</div>
                      </div>
                    </div>
                  </div>

                  {/* RADAR PERFORMANCE GRAPH */}
                  <div className="dashboard-card">
                    <h3>Performans Analizim</h3>
                    <div style={{ height: 180, display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <svg width="180" height="180" viewBox="0 0 200 200">
                        <polygon points="100,20 180,80 150,170 50,170 20,80" fill="transparent" stroke="#333" strokeWidth="1" />
                        <polygon points="100,50 160,95 137,150 63,150 40,95" fill="transparent" stroke="#444" strokeWidth="1" />
                        <polygon points="100,80 140,110 125,140 75,140 60,110" fill="transparent" stroke="#555" strokeWidth="1" />
                        <text x="100" y="15" fill="var(--text-muted)" fontSize="10" textAnchor="middle">Matematik</text>
                        <text x="195" y="80" fill="var(--text-muted)" fontSize="10" textAnchor="start">Fen</text>
                        <text x="160" y="185" fill="var(--text-muted)" fontSize="10" textAnchor="middle">İngilizce</text>
                        <text x="40" y="185" fill="var(--text-muted)" fontSize="10" textAnchor="middle">Türkçe</text>
                        <text x="5" y="80" fill="var(--text-muted)" fontSize="10" textAnchor="end">Sosyal</text>
                        <polygon points="100,45 165,90 120,150 70,140 45,95" fill="rgba(99, 102, 241, 0.25)" stroke="var(--primary)" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>

                  {/* RECOMMENDED STUDIES */}
                  <div className="dashboard-card">
                    <h3>Önerilen Çalışmalar</h3>
                    <div className="recommendation-list">
                      <div className="recommendation-item">
                        <div className="rec-left">
                          <div className="rec-icon">📺</div>
                          <div className="rec-info">
                            <h4>Basınç Konu Anlatımı</h4>
                            <p>6 dk video ders özeti</p>
                          </div>
                        </div>
                        <button className="rec-action-btn" onClick={() => { setVideoTitle("Sıvı ve Katı Basıncı"); setVideoOpen(true); }}>▶</button>
                      </div>

                      <div className="recommendation-item">
                        <div className="rec-left">
                          <div className="rec-icon">🎴</div>
                          <div className="rec-info">
                            <h4>Ezber Kartları</h4>
                            <p>Basınç formülleri tekrarı</p>
                          </div>
                        </div>
                        <button className="rec-action-btn" onClick={() => { setFlashcardIndex(0); setFlashcardOpen(true); }}>🗂️</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PANEL: STUDY PLAN */}
            {activeTab === "study-plan" && (
              <div className="card">
                <h3>Müfredat Kazanım Takibi</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 15 }}>
                  Aşağıda diagnostik ve adaptif testlerinizin sonucunda güncellenen kişisel öğrenme seviyeleriniz listelenmiştir.
                </p>
                <div className="outcome-list">
                  {demoOutcomes.map((outcome) => {
                    const topic = demoTopics.find((t) => t.id === outcome.topicId);
                    const record = masteryRecords[outcome.id];
                    
                    const statusColors: Record<string, string> = {
                      zayif: "var(--danger)",
                      orta: "var(--warning)",
                      iyi: "var(--primary)",
                      tam: "var(--success)",
                    };

                    return (
                      <div key={outcome.id} className="outcome-row">
                        <div>
                          <strong>{topic?.name} ({outcome.code})</strong>
                          <p className="outcome-desc">{outcome.description}</p>
                        </div>
                        <div
                          className="mastery-badge"
                          style={{
                            background: record ? statusColors[record.status] : "#555",
                            color: "white",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontWeight: 800,
                          }}
                        >
                          {record ? `${record.status.toUpperCase()} (%${record.level})` : "Ölçülmedi"}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button className="primary" onClick={startDiagnosticTest} style={{ marginTop: 20, width: "auto", padding: "10px 20px" }}>
                  Kazanım Tespit Testi Başlat
                </button>
              </div>
            )}

            {/* PANEL: AI ROUTINE PLANNER */}
            {activeTab === "ai-routine" && (
              <div>
                <div className="dashboard-card">
                  <h3>⏱️ AI Çalışma Rutini Planlayıcısı</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 15 }}>
                    Bugün ne kadar çalışabileceğinizi girin. AI, en zayıf olduğunuz kazanımları tarayarak size özel ders çalışma süresi ve görevleri dağıtacaktır.
                  </p>
                  
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }} className="form-group">
                    <div style={{ flex: 1 }}>
                      <label>Bugün Kaç Saat Çalışabilirsin?</label>
                      <input 
                        type="number" 
                        value={availableHours} 
                        onChange={(e) => setAvailableHours(e.target.value)} 
                        placeholder="Örn: 2"
                        style={{ padding: 10, borderRadius: 8, border: "1.5px solid var(--border-light)" }}
                      />
                    </div>
                    <button onClick={generateStudyRoutine} className="primary-btn" style={{ width: "auto", padding: "11px 20px" }}>
                      AI Rutinimi Hazırla
                    </button>
                  </div>
                </div>

                <div className="section-card">
                  <h3>Günlük Çalışma Yol Haritam</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 10 }}>
                    {routineResult.map((item, idx) => (
                      <div key={idx} style={{ background: "var(--bg-body)", padding: 15, borderRadius: 8, borderLeft: "4px solid var(--primary)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <span style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 700, textTransform: "uppercase" }}>{item.subject}</span>
                          <h4 style={{ margin: "2px 0 4px 0", fontSize: "0.95rem" }}>{item.topic}</h4>
                          <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>{item.action}</p>
                        </div>
                        <div style={{ background: "rgba(99, 102, 241, 0.08)", padding: "8px 12px", borderRadius: 6, fontWeight: 800, color: "var(--primary)", fontSize: "0.9rem" }}>
                          ⏱️ {item.duration} Dakika
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dashboard-card">
                  <h3>🧠 Öğrenme Tarzı Analizi</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginTop: 10 }}>
                    <div style={{ padding: 12, background: "var(--bg-body)", borderRadius: 8 }}>
                      <strong style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Öğrenme Stili</strong>
                      <p style={{ margin: "4px 0 0 0", fontWeight: 800, color: "var(--primary)" }}>Görsel & Uygulamalı Soru Çözümü</p>
                    </div>
                    <div style={{ padding: 12, background: "var(--bg-body)", borderRadius: 8 }}>
                      <strong style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>En Verimli Saatlerin</strong>
                      <p style={{ margin: "4px 0 0 0", fontWeight: 800, color: "var(--success)" }}>16:00 - 18:30 (Okul Sonrası)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PANEL: EXAMS */}
            {activeTab === "exams" && (
              <div className="card">
                <h3>LGS Deneme Sınavı Sonuçlarım</h3>
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 15 }}>
                  <thead>
                    <tr>
                      <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Sınav Adı</th>
                      <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Puan</th>
                      <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Başarı Durumu</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)" }}>LGS Genel Deneme 1</td>
                      <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)" }}>442 Puan</td>
                      <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)", color: "var(--success)", fontWeight: 700 }}>✓ Hedef Üstü</td>
                    </tr>
                    <tr>
                      <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)" }}>LGS Kurumsal Deneme 2</td>
                      <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)" }}>425 Puan</td>
                      <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)", color: "var(--primary)", fontWeight: 700 }}>✓ Hedefe Yakın</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* PANEL: AI COACH */}
            {activeTab === "ai-coach" && (
              <div className="card" style={{ padding: 15 }}>
                <h3>🤖 AI Rehber Öğretmen Sohbeti</h3>
                <div className="chat-container" style={{ height: 350, display: "flex", flexDirection: "column", background: "var(--white)", borderRadius: 12, border: "1px solid var(--border-light)", overflow: "hidden", marginTop: 15 }}>
                  <div className="chat-messages" style={{ flex: 1, padding: 15, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
                    {chatMessages.map((m, idx) => (
                      <div key={idx} className={`chat-bubble ${m.sender === "ai" ? "advisor" : "student"}`}>
                        {m.text}
                      </div>
                    ))}
                    {isTyping && (
                      <div className="chat-typing">
                        <span></span><span></span><span></span>
                      </div>
                    )}
                  </div>
                  <div className="chat-input-bar">
                    <input
                      type="text"
                      placeholder="AI Koçuna LGS hakkında bir soru sor..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleSendChatMessage(); }}
                    />
                    <button onClick={handleSendChatMessage}>Gönder</button>
                  </div>
                </div>
              </div>
            )}

            {/* PANEL: REPORTS */}
            {activeTab === "reports" && (
              <div className="card">
                <h3>🕒 Ders Çalışma Dağılım Grafiğim</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Haftalık çözülen soru ve konu anlatım sürelerinin ders dağılımları.</p>
                <div style={{ display: "flex", gap: 20, marginTop: 15, justifyContent: "center" }}>
                  <div style={{ textAlign: "center", padding: 12, background: "var(--bg-body)", borderRadius: 8, flex: 1 }}>
                    <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--primary)" }}>5.2 Saat</span>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>Matematik</p>
                  </div>
                  <div style={{ textAlign: "center", padding: 12, background: "var(--bg-body)", borderRadius: 8, flex: 1 }}>
                    <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--success)" }}>3.8 Saat</span>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>Fen Bilimleri</p>
                  </div>
                  <div style={{ textAlign: "center", padding: 12, background: "var(--bg-body)", borderRadius: 8, flex: 1 }}>
                    <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--warning)" }}>2.5 Saat</span>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>Türkçe</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* VIDEO LESSON MODAL OVERLAY */}
      {videoOpen && (
        <div className="modal-overlay" style={{ display: "flex" }}>
          <div className="modal-content-card" style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <h3>{videoTitle} Video Dersi</h3>
              <button className="modal-close-btn" onClick={() => setVideoOpen(false)}>&times;</button>
            </div>
            <div className="modal-body" style={{ background: "black", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ color: "white", textAlign: "center" }}>
                <span style={{ fontSize: "3rem", display: "block" }}>🎬</span>
                <strong>Basınç Video Konu Anlatımı Oynatılıyor...</strong>
                <p style={{ fontSize: "0.75rem", color: "#999" }}>Süre: 06:12 / AI Koçun Tarafından Önerildi</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-solve" onClick={() => setVideoOpen(false)}>Kapat</button>
            </div>
          </div>
        </div>
      )}

      {/* FLASHCARDS MODAL OVERLAY */}
      {flashcardOpen && (
        <div className="modal-overlay" style={{ display: "flex" }}>
          <div className="modal-content-card" style={{ maxWidth: 450 }}>
            <div className="modal-header">
              <h3>Basınç Flashcard Kartları ({flashcardIndex + 1} / {flashcardsDeck.length})</h3>
              <button className="modal-close-btn" onClick={() => setFlashcardOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="flashcard-game-container">
                <div className={`flashcard-perspective ${flashcardFlipped ? "flipped" : ""}`} onClick={() => setFlashcardFlipped(!flashcardFlipped)}>
                  <div className="flashcard-inner">
                    <div className="flashcard-front">
                      <span style={{ fontSize: "2rem", marginBottom: 8 }}>❓</span>
                      <strong style={{ fontSize: "1.05rem" }}>{flashcardsDeck[flashcardIndex].q}</strong>
                      <span className="flashcard-tip-text">Cevabı görmek için karta tıklayın</span>
                    </div>
                    <div className="flashcard-back">
                      <span style={{ fontSize: "2rem", marginBottom: 8 }}>💡</span>
                      <strong style={{ fontSize: "1.05rem" }}>{flashcardsDeck[flashcardIndex].a}</strong>
                      <span className="flashcard-tip-text">Tıklayarak geri çevirin</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, width: "100%", justifyContent: "center", marginTop: 10 }}>
                  <button className="btn-card-secondary" onClick={() => { setFlashcardFlipped(false); setFlashcardIndex(prev => (prev - 1 + flashcardsDeck.length) % flashcardsDeck.length); }}>Geri</button>
                  <button className="btn-card-primary" onClick={() => { setFlashcardFlipped(false); setFlashcardIndex(prev => (prev + 1) % flashcardsDeck.length); }}>İleri</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
