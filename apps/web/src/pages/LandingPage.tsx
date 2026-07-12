interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: (defaultPackage?: string) => void;
}

export function LandingPage({ onNavigateToLogin, onNavigateToRegister }: LandingPageProps) {
  return (
    <div className="landing-layout">
      <header className="landing-navbar">
        <div className="landing-logo-wrap">
          <div className="landing-logo-icon">✨</div>
          <strong>EVDE DERS APP</strong>
        </div>
        <nav className="landing-nav-links">
          <a href="#raporlar">Veli Takibi</a>
          <a href="#yolculuk">5-8 Yolculuğu</a>
          <a href="#fiyatlar">Fiyatlar</a>
        </nav>
        <div className="landing-nav-actions">
          <button onClick={onNavigateToLogin} className="landing-login-btn">Giriş Yap ▼</button>
          <button onClick={() => onNavigateToRegister("gelisim")} className="landing-cta-btn">Kayıt Ol</button>
        </div>
      </header>

      <section className="landing-hero">
        <span className="hero-badge">5, 6, 7 ve 8. sınıflar için AI mentorlu evde ders çalışma platformu</span>
        <h1>Çocuğunuzun ders yolculuğunda yanında olan AI mentor</h1>
        <p style={{ fontSize: "1.28rem", fontWeight: 850, color: "var(--primary)", margin: "0 auto 20px auto", maxWidth: 760, lineHeight: 1.4 }}>
          Siz her an yanında olamasanız da, Evde Ders App çocuğunuzun çalışma düzenini takip eder, ihtiyaçlarını fark eder ve sizi sürecin bir parçası yapar.
        </p>
        <p>
          AI mentor, bir öğretmen gibi yol gösterir, bir veli hassasiyetiyle düzenini takip eder ve size günlük/haftalık raporlarla bilgi verir.
          Böylece çocuğunuz hedeflerine ilerlerken siz de nerede olduğunu, hangi derste zorlandığını ve nasıl destek olabileceğinizi bilirsiniz.
        </p>
        <div className="hero-ctas">
          <button onClick={() => onNavigateToRegister("gelisim")} className="landing-cta-btn-large">Çocuğumun Ders Yolculuğunu Başlat</button>
          <a href="#raporlar" className="landing-secondary-btn-large">Veli Takibini Gör</a>
        </div>
      </section>

      <section className="landing-features">
        <div className="section-title-wrap">
          <h2>Velinin en büyük sorunu belirsizliktir</h2>
          <p>Çocuğun başında beklemeden süreci görmek, doğru zamanda destek olmak ve geç kalmadan eksikleri fark etmek gerekir.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card-item">
            <div className="feature-icon-box">?</div>
            <h3>Çalışıyor mu?</h3>
            <p>Günlük görevler, çalışma süresi ve tamamlanan aktiviteler veli raporunda sade şekilde görünür.</p>
          </div>

          <div className="feature-card-item">
            <div className="feature-icon-box">📊</div>
            <h3>Seviyesi yeterli mi?</h3>
            <p>Ders ve kazanım bazlı gelişim takip edilir; öğrencinin sınıf düzeyine göre güçlü ve zayıf alanları belirlenir.</p>
          </div>

          <div className="feature-card-item">
            <div className="feature-icon-box">⚠️</div>
            <h3>Takviye gerekiyor mu?</h3>
            <p>Bir konu tekrar tekrar zor geliyorsa sistem erken uyarı verir ve tekrar, mini test veya ek destek önerir.</p>
          </div>
        </div>
      </section>

      <section id="raporlar" className="landing-features" style={{ paddingTop: 40 }}>
        <div className="section-title-wrap">
          <h2>Sizin için takip eder, rapor verir</h2>
          <p>Veli her ayrıntıyla uğraşmaz; sistem çalışmayı analiz eder ve anlaşılır sonuçlara çevirir.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card-item">
            <div className="feature-icon-box">☀️</div>
            <h3>Günlük Rapor</h3>
            <p>Bugün çalıştı mı, kaç dakika çalıştı, hangi görevleri tamamladı ve hangi konuda zorlandı?</p>
          </div>

          <div className="feature-card-item">
            <div className="feature-icon-box">📅</div>
            <h3>Haftalık Rapor</h3>
            <p>Bu hafta hangi derslerde ilerledi, hangi konular tekrar istiyor ve çalışma düzeni ne durumda?</p>
          </div>

          <div className="feature-card-item">
            <div className="feature-icon-box">🎯</div>
            <h3>Aylık Gelişim</h3>
            <p>Sınıf düzeyi, alışkanlık gelişimi ve derslerdeki genel ilerleme aylık özetle takip edilir.</p>
          </div>

          <div className="feature-card-item">
            <div className="feature-icon-box">👪</div>
            <h3>Veli Önerisi</h3>
            <p>Bu hafta çocuğa nasıl yaklaşmalı, nerede teşvik etmeli, nerede destek almayı düşünmeli?</p>
          </div>
        </div>
      </section>

      <section id="yolculuk" className="landing-features" style={{ paddingTop: 40 }}>
        <div className="section-title-wrap">
          <h2>5. sınıftan 8. sınıfa düzenli okul başarısı</h2>
          <p>Öğrenci önce evde ders çalışma alışkanlığı kazanır; sınıf düzeyi ilerledikçe temel beceri, tekrar disiplini ve sınav farkındalığı gelişir.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card-item">
            <div className="feature-icon-box">5</div>
            <h3>5. Sınıf: Alışkanlık</h3>
            <p>Kısa görevler, düzenli tekrar ve evde ders çalışma davranışı kazandırılır.</p>
          </div>

          <div className="feature-card-item">
            <div className="feature-icon-box">6</div>
            <h3>6. Sınıf: Temel Güçlendirme</h3>
            <p>Matematik, Türkçe ve Fen temelleri konu anlatımı, mini test ve simülasyonlarla pekiştirilir.</p>
          </div>

          <div className="feature-card-item">
            <div className="feature-icon-box">7</div>
            <h3>7. Sınıf: Akademik Dayanıklılık</h3>
            <p>Paragraf, problem, fen yorumlama ve düzenli soru çözme refleksi güçlendirilir.</p>
          </div>

          <div className="feature-card-item">
            <div className="feature-icon-box">8</div>
            <h3>8. Sınıf: LGS Destek Modu</h3>
            <p>Okul ders planına ek olarak deneme analizi, eksik kazanım kapatma, süre yönetimi ve net artırma desteği verilir.</p>
          </div>
        </div>
      </section>

      <section id="ozellikler" className="landing-features" style={{ paddingTop: 40 }}>
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
            <h3>Yazılı & Sınav Takibi</h3>
            <p>Çözülen diagnostik testlerin sonucuna göre otomatik yeni kazanım testleri üretilir; 8. sınıfta LGS denemeleri de takip edilir.</p>
          </div>

          <div className="feature-card-item">
            <div className="feature-icon-box">👪</div>
            <h3>Akıllı Veli Analiz Ekranı</h3>
            <p>Velilere öğrencinin haftalık ilerlemesi, verimli olduğu ders saatleri ve çalışma tarzı hakkında detaylı AI analiz raporu sunulur.</p>
          </div>

          <div className="feature-card-item">
            <div className="feature-icon-box">🔒</div>
            <h3>KVKK Uyumlu Güvenli Bulut</h3>
            <p>Tüm veriler yüksek güvenlik standartlarına ve KVKK beklentilerine uygun şekilde güvenli bulut altyapısında saklanır.</p>
          </div>
        </div>
      </section>

      <section id="fiyatlar" className="landing-pricing">
        <div className="section-title-wrap">
          <h2>Basit ve anlaşılır paketler</h2>
          <p>Çocuğunuzun ihtiyacına göre başlayın; düzen oturdukça paketinizi değiştirebilirsiniz.</p>
        </div>

        <div className="pricing-grid-layout">
          <div className="pricing-card-box">
            <h3>Düzen Paketi</h3>
            <p className="price-desc">Evde ders çalışma alışkanlığı kazandırmak isteyen veliler için.</p>
            <div className="price-amount-wrap">
              <strong className="new-price">₺500</strong>
              <span className="price-period">/ Ay</span>
            </div>
            <div className="price-installments">1 öğrenci hesabı</div>
            <ul className="price-features-list">
              <li>✓ Günlük çalışma planı</li>
              <li>✓ Görev tamamlama takibi</li>
              <li>✓ Mini test ve tekrar</li>
              <li>✓ Haftalık veli raporu</li>
              <li>✓ Temel AI mentor yönlendirmesi</li>
            </ul>
            <button onClick={() => onNavigateToRegister("duzen")} className="price-buy-btn">Düzen Kazandır</button>
          </div>

          <div className="pricing-card-box popular">
            <div className="popular-badge">ÖNERİLEN</div>
            <h3>Gelişim Paketi</h3>
            <p className="price-desc">Seviye, eksik konu ve takviye ihtiyacını düzenli görmek isteyen veliler için.</p>
            <div className="price-amount-wrap">
              <strong className="new-price">₺1.000</strong>
              <span className="price-period">/ Ay</span>
            </div>
            <div className="price-installments">Video ve simülasyon destekli</div>
            <ul className="price-features-list">
              <li>✓ Düzen paketindeki her şey</li>
              <li>✓ Kazanım bazlı seviye takibi</li>
              <li>✓ Video ve çalışma odası</li>
              <li>✓ Simülasyonlu öğrenme içerikleri</li>
              <li>✓ Günlük ve haftalık veli raporu</li>
              <li>✓ Takviye ihtiyacı sinyalleri</li>
            </ul>
            <button onClick={() => onNavigateToRegister("gelisim")} className="price-buy-btn-popular">Gelişimi Takip Et</button>
          </div>

          <div className="pricing-card-box">
            <h3>Yoğun Takip Paketi</h3>
            <p className="price-desc">Daha yakın takip, aylık gelişim raporu ve 8. sınıflar için LGS destek modu isteyen aileler için.</p>
            <div className="price-amount-wrap">
              <strong className="new-price">₺2.000</strong>
              <span className="price-period">/ Ay</span>
            </div>
            <div className="price-installments">Yakın akademik takip</div>
            <ul className="price-features-list">
              <li>✓ Gelişim paketindeki her şey</li>
              <li>✓ Detaylı deneme ve yazılı analizi</li>
              <li>✓ 8. sınıf için LGS destek modu</li>
              <li>✓ Süre yönetimi çalışmaları</li>
              <li>✓ Aylık gelişim raporu</li>
              <li>✓ Veli için aksiyon önerileri</li>
            </ul>
            <button onClick={() => onNavigateToRegister("premium")} className="price-buy-btn">Yakın Takip Başlat</button>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>Evde Ders App &copy; 2026. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}
