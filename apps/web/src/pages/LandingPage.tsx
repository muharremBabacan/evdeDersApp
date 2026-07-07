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
          <p>Dilediğiniz paketi seçerek online kayıt olabilir, kredi kartınız ile taksitli ödeme gerçekleştirebilirsiniz.</p>
        </div>

        <div className="pricing-grid-layout">
          {/* PACKAGE 1 */}
          <div className="pricing-card-box">
            <h3>Standart AI Paket</h3>
            <p className="price-desc">Evde kendi disipliniyle çalışmak ve zengin sınav içeriğine ulaşmak isteyen öğrenciler için ideal.</p>
            <div className="price-amount-wrap">
              <span className="old-price">₺12.000</span>
              <strong className="new-price">₺4.990</strong>
              <span className="price-period">/ Yıl</span>
            </div>
            <div className="price-installments">12 taksit imkanıyla</div>
            
            <ul className="price-features-list">
              <li>✓ 5-8. Sınıf LGS Eğitim Müfredatı</li>
              <li>✓ LGS Deneme Sınavları Çözümü</li>
              <li>✓ Akıllı Çalışma Planı & Süre Sayacı</li>
              <li>✓ Gelişim Durum Kartı & Veli Takip Paneli</li>
              <li><del>✗ 7/24 AI Rehber Koç Asistanı</del></li>
            </ul>

            <button onClick={() => onNavigateToRegister("dijital")} className="price-buy-btn">Hemen Satın Al</button>
          </div>

          {/* PACKAGE 2 */}
          <div className="pricing-card-box popular">
            <div className="popular-badge">EN POPÜLER</div>
            <h3>Premium VIP AI Paket</h3>
            <p className="price-desc">Yapay zeka koç desteğiyle, hedeflerini adım adım analiz ederek sınava hazırlanmak isteyen öğrenciler için.</p>
            <div className="price-amount-wrap">
              <span className="old-price">₺24.000</span>
              <strong className="new-price">₺9.990</strong>
              <span className="price-period">/ Yıl</span>
            </div>
            <div className="price-installments">12 taksit imkanıyla</div>
            
            <ul className="price-features-list">
              <li>✓ Tüm Standart LGS İçerikleri</li>
              <li>✓ Yapay Zeka (AI) Rehber Koç (7/24 Aktif)</li>
              <li>✓ Kişiye Özel Akıllı Çalışma Planı</li>
              <li>✓ AI Destekli Gelişim ve Karne Analizleri</li>
              <li>✓ Seviyeye Göre Basılı Soru Bankası Seti</li>
            </ul>

            <button onClick={() => onNavigateToRegister("plus")} className="price-buy-btn-popular">Hemen Satın Al</button>
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
