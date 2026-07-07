interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: (defaultPackage?: string) => void;
}

export function LandingPage({ onNavigateToLogin, onNavigateToRegister }: LandingPageProps) {
  return (
    <div className="landing-layout">
      {/* NAVBAR */}
      <header className="landing-navbar">
        <div className="landing-logo-wrap">
          <div className="landing-logo-icon">✨</div>
          <strong>EVDE DERS APP</strong>
        </div>
        <nav className="landing-nav-links">
          <a href="#ozellikler">Modüller</a>
          <a href="#ozellikler">Özellikler</a>
          <a href="#fiyatlar">Fiyatlar</a>
        </nav>
        <div className="landing-nav-actions">
          <button onClick={onNavigateToLogin} className="landing-login-btn">Giriş Yap ▼</button>
          <button onClick={() => onNavigateToRegister("dijital")} className="landing-cta-btn">7 Gün Ücretsiz Dene</button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="landing-hero">
        <span className="hero-badge">🚀 Ortaokul LGS Hazırlık Programı (5 - 8. Sınıf)</span>
        <h1>Öğrenci AI Koçluğu ile LGS'ye 4 Yılda Evden Hazırlanın</h1>
        <p style={{ fontSize: "1.28rem", fontWeight: 850, color: "var(--primary)", margin: "0 auto 20px auto", maxWidth: 680, lineHeight: 1.4 }}>
          "Biz sana sadece soru vermiyoruz; düzenli çalışma alışkanlığı kazandırıyoruz."
        </p>
        <p>
          Çocuğunuzun çalışma stilini ve zamanını öğrenen yapay zeka koçuyla, 5. sınıftan 8. sınıfa kadar 
          bireyselleştirilmiş LGS hazırlık ve okul yazılı ders çalışma rutinini hemen başlatın.
        </p>
        <div className="hero-ctas">
          <button onClick={() => onNavigateToRegister("dijital")} className="landing-cta-btn-large">7 Gün Ücretsiz Dene</button>
          <a href="#fiyatlar" className="landing-secondary-btn-large">Paketleri İncele</a>
        </div>
      </section>

      {/* MODULES / FEATURES SECTION */}
      <section id="ozellikler" className="landing-features">
        <div className="section-title-wrap">
          <h2>Evde Ders App Modülleri</h2>
          <p>Yapay zeka akademik koçluk sistemimizin sunduğu tüm kolaylıkları keşfedin.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card-item">
            <div className="feature-icon-box">⏱️</div>
            <h3>Kişiye Özel AI Rutin</h3>
            <p>Öğrencinin günlük boş vakitlerine ve kazanım eksiklerine göre dakikalara bölünmüş günlük ders çalışma programı çıkarır.</p>
          </div>

          <div className="feature-card-item">
            <div className="feature-icon-box">🤖</div>
            <h3>7/24 AI Rehber Öğretmen</h3>
            <p>Öğrencinin sorularını yanıtlayan, motivasyonunu takip eden ve konu anlatımlarında analojiler kuran yapay zeka koçu.</p>
          </div>

          <div className="feature-card-item">
            <div className="feature-icon-box">📈</div>
            <h3>Akademik Durum Takibi</h3>
            <p>5. sınıftan 8. sınıfa kadar tüm derslerin kazanımları tek bir ekranda toplanır, veli ve öğrenci gelişimini canlı izler.</p>
          </div>

          <div className="feature-card-item">
            <div className="feature-icon-box">📝</div>
            <h3>Yazılı & LGS Denemeleri</h3>
            <p>Çözülen diagnostik testlerin sonucuna göre otomatik yeni kazanım testleri üretilir ve eksik konu raporları hazırlanır.</p>
          </div>

          <div className="feature-card-item">
            <div className="feature-icon-box">👪</div>
            <h3>Akıllı Veli Analiz Ekranı</h3>
            <p>Velilere öğrencinin haftalık ilerlemesi, verimli olduğu ders saatleri ve çalışma tarzı hakkında detaylı AI analiz raporu sunulur.</p>
          </div>

          <div className="feature-card-item">
            <div className="feature-icon-box">🔒</div>
            <h3>KVKK Uyumlu Güvenli Bulut</h3>
            <p>Tüm veriler en yüksek güvenlik standartlarına ve KVKK mevzuatına tam uyumlu olarak şifreli sunucularda saklanır.</p>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="fiyatlar" className="landing-pricing">
        <div className="section-title-wrap">
          <h2>LGS Hazırlık Eğitim Paketleri</h2>
          <p>Çocuğunuzun ihtiyacına en uygun koçluk düzeyini seçerek hemen başlayın. Paketler arası geçiş yapabilirsiniz.</p>
        </div>

        <div className="pricing-grid-layout" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
          {/* PACKAGE 1 */}
          <div className="pricing-card-box" style={{ padding: "25px 20px" }}>
            <h3 style={{ fontSize: "1.15rem" }}>🌱 Başlangıç</h3>
            <p className="price-desc" style={{ minHeight: "50px", fontSize: "0.8rem" }}>Temel çalışma planı ve günlük görev takibi ile alışkanlık oluşturma adımı.</p>
            <div className="price-amount-wrap">
              <strong className="new-price" style={{ fontSize: "1.8rem" }}>Ücretsiz</strong>
            </div>
            <div className="price-installments" style={{ minHeight: "19px" }}>Her zaman ücretsiz</div>
            
            <ul className="price-features-list" style={{ gap: "8px", marginBottom: "25px" }}>
              <li>✓ Temel Çalışma Planı</li>
              <li>✓ Günlük Görev Dağıtımı</li>
              <li>✓ Basit İlerleme Takibi</li>
              <li>✓ Kısa Geri Bildirimler</li>
              <li><del>✗ Ayrıntılı AI Analizleri</del></li>
            </ul>

            <button onClick={() => onNavigateToRegister("baslangic")} className="price-buy-btn" style={{ padding: "10px" }}>Hemen Başla</button>
          </div>

          {/* PACKAGE 2 */}
          <div className="pricing-card-box" style={{ padding: "25px 20px" }}>
            <h3 style={{ fontSize: "1.15rem" }}>🚀 Düzen Paketi</h3>
            <p className="price-desc" style={{ minHeight: "50px", fontSize: "0.8rem" }}>Ertelenen ders analizleri ve otomatik revizyonlarla çalışma alışkanlığı kazanma.</p>
            <div className="price-amount-wrap">
              <strong className="new-price" style={{ fontSize: "1.8rem" }}>₺500</strong>
              <span className="price-period">/ Ay</span>
            </div>
            <div className="price-installments" style={{ minHeight: "19px" }}>Aylık Ödeme</div>
            
            <ul className="price-features-list" style={{ gap: "8px", marginBottom: "25px" }}>
              <li>✓ Otomatik Haftalık Planlar</li>
              <li>✓ Günlük Plan Revizyonu</li>
              <li>✓ Ertelenen Ders Tespiti</li>
              <li>✓ Temel Veli Raporları</li>
              <li>✓ Motivasyon Mesajları</li>
            </ul>

            <button onClick={() => onNavigateToRegister("duzen")} className="price-buy-btn" style={{ padding: "10px" }}>Satın Al</button>
          </div>

          {/* PACKAGE 3 */}
          <div className="pricing-card-box" style={{ padding: "25px 20px" }}>
            <h3 style={{ fontSize: "1.15rem" }}>🎯 Gelişim Paketi</h3>
            <p className="price-desc" style={{ minHeight: "50px", fontSize: "0.8rem" }}>Ders bazlı uzman AI koçları ve deneme yorumlarıyla akademik gelişimi kişiselleştirme.</p>
            <div className="price-amount-wrap">
              <strong className="new-price" style={{ fontSize: "1.8rem" }}>₺1.200</strong>
              <span className="price-period">/ Ay</span>
            </div>
            <div className="price-installments" style={{ minHeight: "19px" }}>Aylık Ödeme</div>
            
            <ul className="price-features-list" style={{ gap: "8px", marginBottom: "25px" }}>
              <li>✓ Ders Bazlı Uzman AI</li>
              <li>✓ Performans Optimizasyonu</li>
              <li>✓ Eksik Kazanım Analizi</li>
              <li>✓ Deneme Sınavı Yorumları</li>
              <li>✓ Bireysel Öğrenme DNA'sı</li>
            </ul>

            <button onClick={() => onNavigateToRegister("gelisim")} className="price-buy-btn" style={{ padding: "10px" }}>Satın Al</button>
          </div>

          {/* PACKAGE 4 */}
          <div className="pricing-card-box popular" style={{ padding: "25px 20px" }}>
            <div className="popular-badge">EN POPÜLER</div>
            <h3 style={{ fontSize: "1.15rem" }}>👑 Premium Paket</h3>
            <p className="price-desc" style={{ minHeight: "50px", fontSize: "0.8rem" }}>Uzun dönem başarı takibi ve erken risk tespitleriyle ailenin dijital danışmanı.</p>
            <div className="price-amount-wrap">
              <strong className="new-price" style={{ fontSize: "1.8rem" }}>₺2.000</strong>
              <span className="price-period">/ Ay</span>
            </div>
            <div className="price-installments" style={{ minHeight: "19px" }}>Aylık Ödeme</div>
            
            <ul className="price-features-list" style={{ gap: "8px", marginBottom: "25px" }}>
              <li>✓ Uzun Dönem Takip & Hafıza</li>
              <li>✓ Otomatik Tempo Ayarı</li>
              <li>✓ Motivasyon Eğilim Analizi</li>
              <li>✓ Erken Başarı Risk Analizi</li>
              <li>✓ Proaktif Veli Önerileri</li>
            </ul>

            <button onClick={() => onNavigateToRegister("premium")} className="price-buy-btn-popular" style={{ padding: "10px" }}>Satın Al</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <p>EduMentor & Evde Ders App &copy; Copyright 2026. Tüm Hakları Saklıdır.</p>
      </footer>
    </div>
  );
}
