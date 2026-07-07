import { useState } from "react";

interface LoginPageProps {
  onLogin: (role: string, username: string) => void;
  onNavigateToRegister: () => void;
}

export function LoginPage({ onLogin, onNavigateToRegister }: LoginPageProps) {
  const [role, setRole] = useState("student");
  const [username, setUsername] = useState("lgs_arda");
  const [password, setPassword] = useState("123");

  const demoAccounts: Record<string, { user: string; label: string }> = {
    student: { user: "lgs_arda", label: "Öğrenci (Arda Yılmaz)" },
    parent: { user: "veli_sinan", label: "Veli (Sinan Yılmaz)" },
    teacher: { user: "hoca_ahmet", label: "Öğretmen (Ahmet Demir)" },
    manager: { user: "admin_kemal", label: "Yönetici / Sekreter" },
    accounting: { user: "muhasebe_ayse", label: "Muhasebe Yetkilisi" },
  };

  function handleRoleChange(selectedRole: string) {
    setRole(selectedRole);
    setUsername(demoAccounts[selectedRole].user);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }
    onLogin(role, username);
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">✨</div>
        <h2>EduMentor AI</h2>
        <p className="login-subtitle">Akıllı Kişiselleştirilmiş Öğrenim & AI Akademik Koçluk</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="role-select">Giriş Rolü</label>
            <select
              id="role-select"
              value={role}
              onChange={(e) => handleRoleChange(e.target.value)}
            >
              <option value="student">Öğrenci Girişi</option>
              <option value="parent">Veli Girişi</option>
              <option value="teacher">Öğretmen Girişi</option>
              <option value="manager">Yönetici / Kayıt Kabul</option>
              <option value="accounting">Muhasebe Yetkilisi</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="username">Kullanıcı Adı</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Kullanıcı adınızı girin"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
            />
          </div>

          <div className="demo-info-box">
            <strong>💡 Hızlı Giriş Notu:</strong>
            <p>Seçtiğiniz role göre test hesapları otomatik doldurulur. Şifre: <code>123</code></p>
          </div>

          <button type="submit" className="primary-btn">
            Giriş Yap
          </button>
        </form>

        <div style={{ marginTop: 20, paddingTop: 15, borderTop: "1px solid var(--border-light)", fontSize: "0.88rem" }}>
          <span>Öğrencinizi kaydetmek mi istiyorsunuz?</span>
          <button 
            onClick={onNavigateToRegister}
            style={{ 
              background: "none", 
              border: "none", 
              color: "var(--primary)", 
              fontWeight: 700, 
              cursor: "pointer", 
              marginLeft: 5,
              fontSize: "inherit"
            }}
          >
            Online Kayıt Olun &rsaquo;
          </button>
        </div>
      </div>
    </div>
  );
}
