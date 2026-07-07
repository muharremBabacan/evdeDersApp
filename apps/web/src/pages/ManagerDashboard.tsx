import { useState } from "react";

interface ManagerDashboardProps {
  username: string;
  onLogout: () => void;
}

export function ManagerDashboard({ username, onLogout }: ManagerDashboardProps) {
  const [activeTab, setActiveTab] = useState("registration");

  // Mock Student registration database
  const [studentsList, setStudentsList] = useState([
    { id: 1, name: "Arda Yılmaz", grade: "8. Sınıf", no: "20260001", parent: "Sinan Yılmaz", phone: "0555-000-0001" },
    { id: 2, name: "Zeynep Çelik", grade: "8. Sınıf", no: "20260002", parent: "Orhan Çelik", phone: "0555-000-0002" }
  ]);

  // Form states - Registration
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentNo, setStudentNo] = useState("");
  const [gradeLevel, setGradeLevel] = useState("8");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");

  // Form states - Classes
  const [assignStudent, setAssignStudent] = useState("Arda Yılmaz");
  const [assignClass, setAssignClass] = useState("8-A LGS Hazırlık");
  const [classAssignmentsLog, setClassAssignmentsLog] = useState([
    { id: 1, student: "Arda Yılmaz", className: "8-A LGS Hazırlık", date: "06.07.2026" }
  ]);

  // Form states - Employee
  const [employeeName, setEmployeeName] = useState("");
  const [employeeRole, setEmployeeRole] = useState("Teacher");
  const [employeeSalary, setEmployeeSalary] = useState("45000");
  const [employeeSsk, setEmployeeSsk] = useState("8500");
  const [employeesList, setEmployeesList] = useState([
    { id: 1, name: "Ahmet Demir", role: "Matematik Öğretmeni", salary: 45000, ssk: 8500 },
    { id: 2, name: "Ayşe Kaya", role: "Muhasebe Sorumlusu", salary: 40000, ssk: 8000 }
  ]);

  function handleRegisterStudent(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !studentNo.trim()) return;

    const newStudent = {
      id: Date.now(),
      name: `${firstName} ${lastName}`,
      grade: `${gradeLevel}. Sınıf`,
      no: studentNo,
      parent: parentName || "Belirtilmedi",
      phone: parentPhone || "Belirtilmedi"
    };

    setStudentsList(prev => [newStudent, ...prev]);
    alert(`Öğrenci ${newStudent.name} (No: ${newStudent.no}) başarıyla kaydedildi!`);

    // Reset forms
    setFirstName("");
    setLastName("");
    setStudentNo("");
    setParentName("");
    setParentPhone("");
  }

  function handleAssignClass(e: React.FormEvent) {
    e.preventDefault();
    const newAssignment = {
      id: Date.now(),
      student: assignStudent,
      className: assignClass,
      date: new Date().toLocaleDateString("tr-TR")
    };
    setClassAssignmentsLog(prev => [newAssignment, ...prev]);
    alert(`${assignStudent} başarıyla ${assignClass} sınıfına atandı!`);
  }

  function handleRegisterEmployee(e: React.FormEvent) {
    e.preventDefault();
    if (!employeeName.trim() || !employeeSalary.trim()) return;

    const newEmp = {
      id: Date.now(),
      name: employeeName,
      role: employeeRole === "Teacher" ? "Öğretmen" : employeeRole === "Accounting" ? "Muhasebeci" : "Yönetici",
      salary: parseFloat(employeeSalary),
      ssk: parseFloat(employeeSsk)
    };

    setEmployeesList(prev => [newEmp, ...prev]);
    setEmployeeName("");
    setEmployeeSalary("45000");
    setEmployeeSsk("8500");
    alert(`Çalışan ${newEmp.name} (${newEmp.role}) maaş ve SSK bilgileriyle kaydedildi!`);
  }

  // Financial aggregates
  const totalPayroll = employeesList.reduce((sum, e) => sum + e.salary, 0);
  const totalSsk = employeesList.reduce((sum, e) => sum + e.ssk, 0);

  return (
    <div className="app-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">🏢</div>
          <div className="logo-text">
            <h1>EduMentor Admin</h1>
            <span>Dershane Kayıt Kabul</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a onClick={() => setActiveTab("registration")} className={`nav-item ${activeTab === "registration" ? "active" : ""}`}>
            <span className="icon">📝</span> Öğrenci Kayıt
          </a>
          <a onClick={() => setActiveTab("classes")} className={`nav-item ${activeTab === "classes" ? "active" : ""}`}>
            <span className="icon">🏫</span> Sınıf Atama
          </a>
          <a onClick={() => setActiveTab("employees")} className={`nav-item ${activeTab === "employees" ? "active" : ""}`}>
            <span className="icon">👥</span> Çalışan Yönetimi
          </a>
        </nav>

        <div className="profile-sidebar-card" style={{ background: "linear-gradient(135deg, #4f46e5, #4338ca)" }}>
          <div className="profile-user">
            <div className="logo-icon" style={{ background: "rgba(255,255,255,0.2)" }}>👤</div>
            <div className="profile-user-info">
              <h3>Kemal Doğan</h3>
              <span>Sekreter / Yönetici</span>
            </div>
          </div>
          <div className="profile-level" style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 8 }}>
            <span>Yetki: Kayıt Kontrol</span>
            <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }}>Çıkış Yap</a>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        <div className="top-header">
          <div>
            <h2>Merhaba Kemal Bey! 👋</h2>
            <p>Öğrenci kayıt kabul işlemleri, sınıf dağılımı ve personel bordro yönetimi.</p>
          </div>
        </div>

        {activeTab === "registration" && (
          <div>
            <div className="dashboard-card">
              <h3>Yeni Öğrenci & Veli Kayıt Girişi</h3>
              <form onSubmit={handleRegisterStudent}>
                <div style={{ display: "flex", gap: 15, marginBottom: 12 }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Öğrenci Adı</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Örn: Arda" required />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Öğrenci Soyadı</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Örn: Yılmaz" required />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 15, marginBottom: 12 }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Okul Numarası (Kullanıcı Adı Olacaktır)</label>
                    <input type="text" value={studentNo} onChange={(e) => setStudentNo(e.target.value)} placeholder="Örn: 20260012" required />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Sınıf Seviyesi</label>
                    <select value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)}>
                      <option value="5">5. Sınıf</option>
                      <option value="6">6. Sınıf</option>
                      <option value="7">7. Sınıf</option>
                      <option value="8">8. Sınıf (LGS Hazırlık)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 15, marginBottom: 12 }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Veli Ad Soyad</label>
                    <input type="text" value={parentName} onChange={(e) => setParentName(e.target.value)} placeholder="Örn: Sinan Yılmaz" />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Veli Telefon Numarası</label>
                    <input type="text" value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} placeholder="Örn: 0555-000-0000" />
                  </div>
                </div>

                <button type="submit" className="primary-btn" style={{ width: "auto" }}>Öğrenci & Veli Kaydını Yap</button>
              </form>
            </div>

            <div className="section-card">
              <h3>Kayıtlı Öğrenci Rehberi ({studentsList.length} Öğrenci)</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
                <thead>
                  <tr>
                    <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Öğrenci No</th>
                    <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Ad Soyad</th>
                    <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Sınıf</th>
                    <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Veli</th>
                    <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>İletişim</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsList.map(std => (
                    <tr key={std.id}>
                      <td style={{ padding: 8, borderBottom: "1px solid var(--border-light)" }}>{std.no}</td>
                      <td style={{ padding: 8, borderBottom: "1px solid var(--border-light)" }}><strong>{std.name}</strong></td>
                      <td style={{ padding: 8, borderBottom: "1px solid var(--border-light)" }}>{std.grade}</td>
                      <td style={{ padding: 8, borderBottom: "1px solid var(--border-light)" }}>{std.parent}</td>
                      <td style={{ padding: 8, borderBottom: "1px solid var(--border-light)", color: "var(--text-muted)" }}>{std.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "classes" && (
          <div>
            <div className="dashboard-card">
              <h3>Dershane Sınıf Atama Girişi</h3>
              <form onSubmit={handleAssignClass} style={{ display: "flex", gap: 15, alignItems: "flex-end" }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Kayıtlı Öğrenci Seçin</label>
                  <select value={assignStudent} onChange={(e) => setAssignStudent(e.target.value)}>
                    {studentsList.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Atanacak Dershane Şubesi</label>
                  <select value={assignClass} onChange={(e) => setAssignClass(e.target.value)}>
                    <option value="8-A LGS Hazırlık">8-A LGS Hazırlık</option>
                    <option value="8-B LGS Sayısal">8-B LGS Sayısal</option>
                    <option value="7-A Başarı Grubu">7-A Başarı Grubu</option>
                  </select>
                </div>
                <button type="submit" className="primary-btn" style={{ width: "auto" }}>Sınıf Atamasını Yap</button>
              </form>
            </div>

            <div className="section-card">
              <h3>Geçmiş Sınıf Atama Kayıtları</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
                <thead>
                  <tr>
                    <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Öğrenci</th>
                    <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Sınıf / Şube</th>
                    <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Atama Tarihi</th>
                  </tr>
                </thead>
                <tbody>
                  {classAssignmentsLog.map(log => (
                    <tr key={log.id}>
                      <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)" }}><strong>{log.student}</strong></td>
                      <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)" }}>{log.className}</td>
                      <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)", color: "var(--text-muted)" }}>{log.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "employees" && (
          <div>
            <div className="dashboard-card">
              <h3>Çalışan Bordro Girişi</h3>
              <form onSubmit={handleRegisterEmployee}>
                <div style={{ display: "flex", gap: 15, marginBottom: 12 }}>
                  <div className="form-group" style={{ flex: 2 }}>
                    <label>Çalışan Ad Soyad</label>
                    <input type="text" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} placeholder="Örn: Ahmet Demir" required />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Çalışan Rolü</label>
                    <select value={employeeRole} onChange={(e) => setEmployeeRole(e.target.value)}>
                      <option value="Teacher">Öğretmen</option>
                      <option value="Accounting">Muhasebe</option>
                      <option value="Manager">Sekreter/Yönetici</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 15, marginBottom: 12 }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Net Maaş (TL)</label>
                    <input type="number" value={employeeSalary} onChange={(e) => setEmployeeSalary(e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>SSK Primi (TL)</label>
                    <input type="number" value={employeeSsk} onChange={(e) => setEmployeeSsk(e.target.value)} required />
                  </div>
                </div>

                <button type="submit" className="primary-btn" style={{ width: "auto" }}>Çalışanı Kaydet</button>
              </form>
            </div>

            <div className="section-card">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}>
                <h3>Maaş Bordrosu & Personel Listesi</h3>
                <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                  Toplam Net Maaş: <strong>{totalPayroll.toLocaleString("tr-TR")} TL</strong> | Toplam SSK: <strong>{totalSsk.toLocaleString("tr-TR")} TL</strong>
                </div>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Çalışan</th>
                    <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Unvan</th>
                    <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>Net Maaş</th>
                    <th style={{ borderBottom: "2px solid var(--border-light)", padding: 8 }}>SSK Primi</th>
                  </tr>
                </thead>
                <tbody>
                  {employeesList.map(e => (
                    <tr key={e.id}>
                      <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)" }}><strong>{e.name}</strong></td>
                      <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)" }}>{e.role}</td>
                      <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)" }}>{e.salary.toLocaleString("tr-TR")} TL</td>
                      <td style={{ padding: 10, borderBottom: "1px solid var(--border-light)", color: "var(--text-muted)" }}>{e.ssk.toLocaleString("tr-TR")} TL</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
