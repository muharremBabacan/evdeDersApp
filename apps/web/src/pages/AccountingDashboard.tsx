import { useState } from "react";

interface AccountingDashboardProps {
  username: string;
  onLogout: () => void;
}

export function AccountingDashboard({ username, onLogout }: AccountingDashboardProps) {
  const [activeTab, setActiveTab] = useState("collections");

  // Mock Students database for collections dropdown
  const students = ["Arda Yılmaz", "Zeynep Çelik", "Can Demir"];

  // Mock collections ledger state
  const [collections, setCollections] = useState([
    { id: 1, student: "Arda Yılmaz", amount: 7500, date: "05.07.2026", method: "Kredi Kartı" },
    { id: 2, student: "Zeynep Çelik", amount: 7500, date: "04.07.2026", method: "Nakit" }
  ]);

  // Form states - Collections
  const [selectedStudent, setSelectedStudent] = useState(students[0]);
  const [collectAmount, setCollectAmount] = useState("7500");
  const [collectMethod, setCollectMethod] = useState("Kredi Kartı");

  // Mock operating expenses state
  const [expenses, setExpenses] = useState([
    { id: 1, title: "Dershane Kira Bedeli", category: "Kira", amount: 20000, date: "01.07.2026" },
    { id: 2, title: "Elektrik Faturası", category: "Fatura", amount: 4500, date: "03.07.2026" }
  ]);

  // Form states - Expenses
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Kira");
  const [expenseAmount, setExpenseAmount] = useState("");

  function handleAddCollection(e: React.FormEvent) {
    e.preventDefault();
    if (!collectAmount.trim()) return;

    const newColl = {
      id: Date.now(),
      student: selectedStudent,
      amount: parseFloat(collectAmount),
      date: new Date().toLocaleDateString("tr-TR"),
      method: collectMethod
    };

    setCollections(prev => [newColl, ...prev]);
    alert(`${selectedStudent} öğrencisinden ${newColl.amount.toLocaleString("tr-TR")} TL tahsilat başarıyla kaydedildi!`);
  }

  function handleAddExpense(e: React.FormEvent) {
    e.preventDefault();
    if (!expenseTitle.trim() || !expenseAmount.trim()) return;

    const newExp = {
      id: Date.now(),
      title: expenseTitle,
      category: expenseCategory,
      amount: parseFloat(expenseAmount),
      date: new Date().toLocaleDateString("tr-TR")
    };

    setExpenses(prev => [newExp, ...prev]);
    setExpenseTitle("");
    setExpenseAmount("");
    alert(`Gider kalemi "${newExp.title}" (${newExp.amount.toLocaleString("tr-TR")} TL) başarıyla kaydedildi!`);
  }

  // Financial aggregates
  const totalIncome = collections.reduce((sum, c) => sum + c.amount, 0);
  const totalOpExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  
  // Payroll constants for aggregate report
  const totalPayroll = 85000; // AHmet Demir + Ayşe Kaya net + ssk (simulated)
  const totalOutflow = totalOpExpenses + totalPayroll;
  const netCashFlow = totalIncome - totalOutflow;

  return (
    <div className="app-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">💰</div>
          <div className="logo-text">
            <h1>EduMentor Finans</h1>
            <span>Dershane Muhasebe</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a onClick={() => setActiveTab("collections")} className={`nav-item ${activeTab === "collections" ? "active" : ""}`}>
            <span className="icon">📥</span> Taksit Tahsilatı
          </a>
          <a onClick={() => setActiveTab("expenses")} className={`nav-item ${activeTab === "expenses" ? "active" : ""}`}>
            <span className="icon">📤</span> Gider Girişi
          </a>
          <a onClick={() => setActiveTab("reports")} className={`nav-item ${activeTab === "reports" ? "active" : ""}`}>
            <span className="icon">📊</span> Nakit Akış Raporu
          </a>
        </nav>

        <div className="profile-sidebar-card" style={{ background: "linear-gradient(135deg, #059669, #047857)" }}>
          <div className="profile-user">
            <div className="logo-icon" style={{ background: "rgba(255,255,255,0.2)" }}>👤</div>
            <div className="profile-user-info">
              <h3>Ayşe Kaya</h3>
              <span>Muhasebe Sorumlusu</span>
            </div>
          </div>
          <div className="profile-level" style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 8 }}>
            <span>Birim: Gelir & Gider</span>
            <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }}>Çıkış Yap</a>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        <div className="top-header">
          <div>
            <h2>Merhaba Ayşe Hanım! 👋</h2>
            <p>Dershane öğrenci taksit ödemeleri, işletme gider faturaları ve nakit kasa durumu.</p>
          </div>
        </div>

        {activeTab === "collections" && (
          <div>
            <div className="dashboard-card">
              <h3>Yeni Taksit Tahsilat Girişi</h3>
              <form onSubmit={handleAddCollection} style={{ display: "flex", gap: 15, alignItems: "flex-end" }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Öğrenci Seçin</label>
                  <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
                    {students.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ width: 180 }}>
                  <label>Tahsil Edilen Tutar (TL)</label>
                  <input type="number" value={collectAmount} onChange={(e) => setCollectAmount(e.target.value)} required />
                </div>
                <div className="form-group" style={{ width: 180 }}>
                  <label>Ödeme Yöntemi</label>
                  <select value={collectMethod} onChange={(e) => setCollectMethod(e.target.value)}>
                    <option value="Kredi Kartı">Kredi Kartı</option>
                    <option value="Nakit">Nakit</option>
                    <option value="Banka Havalesi">Banka Havalesi</option>
                  </select>
                </div>
                <button type="submit" className="primary-btn" style={{ width: "auto" }}>Ödemeyi Kaydet</button>
              </form>
            </div>

            <div className="section-card">
              <h3>Tahsilat Kasa Kayıt Defteri</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
                <thead>
                  <tr>
                    <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Öğrenci</th>
                    <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Tutar</th>
                    <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Tarih</th>
                    <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Yöntem</th>
                  </tr>
                </thead>
                <tbody>
                  {collections.map(c => (
                    <tr key={c.id}>
                      <td style={{ padding: 8, borderBottom: "1px solid var(--border-light)" }}><strong>{c.student}</strong></td>
                      <td style={{ padding: 8, borderBottom: "1px solid var(--border-light)", color: "var(--success)", fontWeight: 700 }}>+{c.amount.toLocaleString("tr-TR")} TL</td>
                      <td style={{ padding: 8, borderBottom: "1px solid var(--border-light)" }}>{c.date}</td>
                      <td style={{ padding: 8, borderBottom: "1px solid var(--border-light)", color: "var(--text-muted)" }}>{c.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "expenses" && (
          <div>
            <div className="dashboard-card">
              <h3>İşletme Gider Kaydı Girişi</h3>
              <form onSubmit={handleAddExpense} style={{ display: "flex", gap: 15, alignItems: "flex-end" }}>
                <div className="form-group" style={{ flex: 2 }}>
                  <label>Gider Fatura / İşlem Açıklaması</label>
                  <input type="text" value={expenseTitle} onChange={(e) => setExpenseTitle(e.target.value)} placeholder="Örn: Haziran Elektrik Faturası" required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Kategori</label>
                  <select value={expenseCategory} onChange={(e) => setExpenseCategory(e.target.value)}>
                    <option value="Kira">Kira Gideri</option>
                    <option value="Fatura">Elektrik/Su/İnternet</option>
                    <option value="Kırtasiye">Kırtasiye & Sınav Kitapçıkları</option>
                    <option value="Mutfak">Gıda & Mutfak</option>
                  </select>
                </div>
                <div className="form-group" style={{ width: 150 }}>
                  <label>Tutar (TL)</label>
                  <input type="number" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} placeholder="Tutar girin" required />
                </div>
                <button type="submit" className="primary-btn" style={{ width: "auto" }}>Gideri Kaydet</button>
              </form>
            </div>

            <div className="section-card">
              <h3>Gider Kayıt Defteri</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
                <thead>
                  <tr>
                    <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Açıklama</th>
                    <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Kategori</th>
                    <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Tutar</th>
                    <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Tarih</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map(e => (
                    <tr key={e.id}>
                      <td style={{ padding: 8, borderBottom: "1px solid var(--border-light)" }}><strong>{e.title}</strong></td>
                      <td style={{ padding: 8, borderBottom: "1px solid var(--border-light)" }}>{e.category}</td>
                      <td style={{ padding: 8, borderBottom: "1px solid var(--border-light)", color: "var(--danger)", fontWeight: 700 }}>-{e.amount.toLocaleString("tr-TR")} TL</td>
                      <td style={{ padding: 8, borderBottom: "1px solid var(--border-light)", color: "var(--text-muted)" }}>{e.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="card">
            <h3>Dershane Nakit Akış Raporu</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginTop: 15 }}>
              <div style={{ flex: 1, minWidth: 200, padding: 20, borderRadius: 12, background: "rgba(16, 185, 129, 0.08)", border: "1.5px solid rgba(16, 185, 129, 0.2)" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 800 }}>Toplam Gelir (Taksitler)</span>
                <h4 style={{ margin: "5px 0 0 0", fontSize: "1.8rem", color: "var(--success)", fontWeight: 900 }}>+{totalIncome.toLocaleString("tr-TR")} TL</h4>
              </div>
              <div style={{ flex: 1, minWidth: 200, padding: 20, borderRadius: 12, background: "rgba(239, 68, 68, 0.08)", border: "1.5px solid rgba(239, 68, 68, 0.2)" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 800 }}>Toplam Gider (Bordro+Faturalar)</span>
                <h4 style={{ margin: "5px 0 0 0", fontSize: "1.8rem", color: "var(--danger)", fontWeight: 900 }}>-{totalOutflow.toLocaleString("tr-TR")} TL</h4>
              </div>
              <div style={{ flex: 1, minWidth: 200, padding: 20, borderRadius: 12, background: netCashFlow >= 0 ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)", border: "1.5px solid rgba(0,0,0,0.05)" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 800 }}>Net Kasa Kalan Akış</span>
                <h4 style={{ margin: "5px 0 0 0", fontSize: "1.8rem", color: netCashFlow >= 0 ? "var(--success)" : "var(--danger)", fontWeight: 900 }}>
                  {netCashFlow.toLocaleString("tr-TR")} TL
                </h4>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
