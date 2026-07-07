import { useState } from "react";
import { demoQuestions, demoOutcomes } from "../data/demoCurriculum";

interface TeacherDashboardProps {
  username: string;
  onLogout: () => void;
}

export function TeacherDashboard({ username, onLogout }: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState("students");

  // Mock Students List
  const students = [
    { id: "student_demo_1", name: "Arda Yılmaz", grade: "8. Sınıf", lastScore: "%75", points: 1250 },
    { id: "student_demo_2", name: "Zeynep Çelik", grade: "8. Sınıf", lastScore: "%60", points: 950 },
    { id: "student_demo_3", name: "Can Demir", grade: "8. Sınıf", lastScore: "%90", points: 1400 }
  ];

  // Mock assignments
  const [assignments, setAssignments] = useState([
    { id: 1, title: "Çarpanlar ve Katlar Pekiştirme", subject: "Matematik", dueDate: "10.07.2026", count: 20 },
    { id: 2, title: "Üslü Sayılar Genel Tarama", subject: "Matematik", dueDate: "15.07.2026", count: 15 }
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("Matematik");
  const [newDueDate, setNewDueDate] = useState("12.07.2026");

  // Feedback note state
  const [selectedStudent, setSelectedStudent] = useState(students[0].name);
  const [feedbackNote, setFeedbackNote] = useState("");
  const [notesLog, setNotesLog] = useState([
    { id: 1, student: "Arda Yılmaz", note: "Cebirsel ifadeler testinde çok gayretliydi. Hatalarını inceledi, yükseliş trendi devam ediyor.", date: "05.07.2026" }
  ]);

  function handleCreateAssignment(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newAss = {
      id: Date.now(),
      title: newTitle,
      subject: newSubject,
      dueDate: newDueDate,
      count: 10
    };
    setAssignments(prev => [newAss, ...prev]);
    setNewTitle("");
    alert("Ödev başarıyla oluşturuldu ve öğrencilere atandı!");
  }

  function handleAddFeedback(e: React.FormEvent) {
    e.preventDefault();
    if (!feedbackNote.trim()) return;
    const newNote = {
      id: Date.now(),
      student: selectedStudent,
      note: feedbackNote,
      date: new Date().toLocaleDateString("tr-TR")
    };
    setNotesLog(prev => [newNote, ...prev]);
    setFeedbackNote("");
    alert("Öğrenci durum kartına yeni rehberlik notu eklendi!");
  }

  return (
    <div className="app-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">👩‍🏫</div>
          <div className="logo-text">
            <h1>EduMentor Hoca</h1>
            <span>Öğretmen Paneli</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a onClick={() => setActiveTab("students")} className={`nav-item ${activeTab === "students" ? "active" : ""}`}>
            <span className="icon">👨‍🎓</span> Öğrenci Listesi
          </a>
          <a onClick={() => setActiveTab("assignments")} className={`nav-item ${activeTab === "assignments" ? "active" : ""}`}>
            <span className="icon">📝</span> Ödev Yönetimi
          </a>
          <a onClick={() => setActiveTab("feedback")} className={`nav-item ${activeTab === "feedback" ? "active" : ""}`}>
            <span className="icon">💬</span> Geri Bildirim Girişi
          </a>
          <a onClick={() => setActiveTab("questions")} className={`nav-item ${activeTab === "questions" ? "active" : ""}`}>
            <span className="icon">📂</span> Soru Havuzu
          </a>
        </nav>

        <div className="profile-sidebar-card" style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}>
          <div className="profile-user">
            <div className="logo-icon" style={{ background: "rgba(255,255,255,0.2)" }}>👤</div>
            <div className="profile-user-info">
              <h3>Ahmet Demir</h3>
              <span>Matematik Öğretmeni</span>
            </div>
          </div>
          <div className="profile-level" style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 8 }}>
            <span>Branş: LGS Matematik</span>
            <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }}>Çıkış Yap</a>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        <div className="top-header">
          <div>
            <h2>Merhaba Ahmet Öğretmenim! 👋</h2>
            <p>Sınıflarınız ve öğrencilerin kazanım bazlı gelişim göstergeleri.</p>
          </div>
        </div>

        {activeTab === "students" && (
          <div className="card">
            <h3>Sınıf Listesi & Öğrenci Durumları</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 15 }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Öğrenci Adı</th>
                  <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Sınıf Seviyesi</th>
                  <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Son Test Skoru</th>
                  <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Toplam Puan</th>
                </tr>
              </thead>
              <tbody>
                {students.map((std) => (
                  <tr key={std.id}>
                    <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)" }}><strong>{std.name}</strong></td>
                    <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)" }}>{std.grade}</td>
                    <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)" }}>
                      <span className="score-badge">{std.lastScore}</span>
                    </td>
                    <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)" }}>{std.points} Puan (Lvl {Math.floor(std.points/250)+1})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "assignments" && (
          <div>
            <div className="dashboard-card">
              <h3>Yeni Ödev Ata</h3>
              <form onSubmit={handleCreateAssignment} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
                <div style={{ flex: 1, minWidth: 200 }} className="form-group">
                  <label>Ödev Başlığı</label>
                  <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Örn: Üslü Sayılar Kazanım Ödevi" required />
                </div>
                <div style={{ width: 150 }} className="form-group">
                  <label>Ders Branşı</label>
                  <select value={newSubject} onChange={(e) => setNewSubject(e.target.value)}>
                    <option value="Matematik">Matematik</option>
                    <option value="Fen Bilimleri">Fen Bilimleri</option>
                  </select>
                </div>
                <div style={{ width: 150 }} className="form-group">
                  <label>Son Teslim Vade</label>
                  <input type="text" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} placeholder="15.07.2026" />
                </div>
                <button type="submit" className="primary-btn" style={{ height: 42, width: "auto" }}>Ödevi Yayınla</button>
              </form>
            </div>

            <div className="section-card">
              <h3>Aktif Ödev Listesi</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
                <thead>
                  <tr>
                    <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Başlık</th>
                    <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Ders</th>
                    <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Son Tarih</th>
                    <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Soru Sayısı</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((ass) => (
                    <tr key={ass.id}>
                      <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)" }}><strong>{ass.title}</strong></td>
                      <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)" }}>{ass.subject}</td>
                      <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)", color: "var(--danger)", fontWeight: 700 }}>{ass.dueDate}</td>
                      <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)" }}>{ass.count} Soru</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "feedback" && (
          <div>
            <div className="dashboard-card">
              <h3>Rehberlik / Durum Kartı Geri Bildirim Ekle</h3>
              <form onSubmit={handleAddFeedback}>
                <div className="form-group" style={{ marginBottom: 12 }}>
                  <label>Öğrenci Seçin</label>
                  <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
                    {students.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 12 }}>
                  <label>Gelişim / Ödev Takip Notu</label>
                  <textarea
                    rows={4}
                    value={feedbackNote}
                    onChange={(e) => setFeedbackNote(e.target.value)}
                    placeholder="Öğrencinin haftalık ders performansı, çözmesi gereken konu eksikleri veya genel durumu..."
                    style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid var(--border-light)", fontFamily: "sans-serif" }}
                    required
                  />
                </div>
                <button type="submit" className="primary-btn" style={{ width: "auto" }}>Geri Bildirimi Kaydet</button>
              </form>
            </div>

            <div className="section-card">
              <h3>Geçmiş Geri Bildirimler</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {notesLog.map((n) => (
                  <div key={n.id} style={{ background: "var(--bg-body)", padding: 12, borderRadius: 8, borderLeft: "3px solid var(--primary)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <strong>Öğrenci: {n.student}</strong>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{n.date}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-main)" }}>{n.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "questions" && (
          <div className="card">
            <h3>Soru Havuzu ({demoQuestions.length} Kayıtlı Soru)</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 15 }}>
              {demoQuestions.map((q) => {
                const outcome = demoOutcomes.find(o => o.id === q.outcomeId);
                return (
                  <div key={q.id} style={{ background: "var(--bg-body)", padding: 15, borderRadius: 8, border: "1px solid var(--border-light)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 700 }}>Kazanım: {outcome?.code}</span>
                      <span className="status-badge status-completed" style={{ fontSize: "0.7rem", padding: "2px 6px" }}>{q.difficulty.toUpperCase()}</span>
                    </div>
                    <p style={{ margin: "4px 0 8px 0", fontWeight: 700 }}>{q.text}</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                      {q.options.map((opt, idx) => (
                        <div key={idx} style={{ fontSize: "0.82rem", color: opt === q.correctAnswer ? "var(--success)" : "var(--text-muted)", fontWeight: opt === q.correctAnswer ? 700 : 500 }}>
                          {String.fromCharCode(65 + idx)}) {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
