import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/landing.css';

export function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/onboarding');
  };

  return (
    <div className="landing-page">
      {/* Floating Elements */}
      <div className="floating-elements">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
        <div className="floating-shape shape-5"></div>
      </div>

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <span>AnnonsHjälpen</span>
          </div>
          <div className="nav-menu">
            <a href="#features" className="nav-link">Funktioner</a>
            <a href="#pricing" className="nav-link">Priser</a>
            <a href="#testimonials" className="nav-link">Recensioner</a>
            <a href="#contact" className="nav-link">Kontakt</a>
            <button className="btn-primary" onClick={handleGetStarted}>Kom igång</button>
          </div>
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Enkla annonser för <span className="highlight gradient-text">hantverkare</span></h1>
              <p className="hero-subtitle">Slipp dyra reklambyråer! Skapa professionella annonser för Facebook, Google och Instagram på 5 minuter. <span className="highlight-text">Perfekt för snickare, elektriker, rörmokare och andra hantverkare.</span></p>
              <div className="hero-buttons">
                <button className="btn-primary large pulse-button" onClick={handleGetStarted}>
                  <span className="button-text">Testa gratis i 14 dagar</span>
                  <span className="button-glow"></span>
                </button>
                <button className="btn-secondary large">
                  <i className="fas fa-play"></i>
                  Se demo
                </button>
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Nöjda hantverkare</span>
                </div>
                <div className="stat">
                  <span className="stat-number">95%</span>
                  <span className="stat-label">Sparar tid</span>
                </div>
                <div className="stat">
                  <span className="stat-number">3x</span>
                  <span className="stat-label">Fler kunder</span>
                </div>
              </div>
            </div>
            <div className="hero-image">
              <div className="glass-card">
                <div className="card-glow"></div>
              </div>
              <div className="dashboard-preview">
                <div className="preview-header">
                  <div className="preview-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="preview-title">AnnonsHjälpen Dashboard</span>
                </div>
                <div className="preview-content">
                  <div className="stats-overlay">
                    <div className="live-stat">
                      <div className="stat-dot"></div>
                      <span>47 aktiva annonser</span>
                    </div>
                    <div className="live-stat">
                      <div className="stat-dot"></div>
                      <span>156% ROI denna månad</span>
                    </div>
                  </div>
                  <div className="preview-sidebar">
                    <div className="sidebar-item active">
                      <i className="fas fa-tachometer-alt"></i>
                      Översikt
                    </div>
                    <div className="sidebar-item">
                      <i className="fas fa-bullhorn"></i>
                      Mina Annonser
                    </div>
                    <div className="sidebar-item">
                      <i className="fas fa-chart-line"></i>
                      Statistik
                    </div>
                  </div>
                  <div className="preview-main">
                    <div className="ad-card premium-card">
                      <div className="card-header">
                        <span className="ad-status active">Aktiv</span>
                        <div className="trend-indicator up">
                          <i className="fas fa-arrow-up"></i>
                          <span>+23%</span>
                        </div>
                      </div>
                      <h4>Snickartjänster i Stockholm</h4>
                      <div className="metrics">
                        <span className="metric">67 klick</span>
                        <span className="metric">12 kontakter</span>
                        <span className="metric">kr 2,340 kostnad</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" data-progress="78"></div>
                      </div>
                    </div>
                    <div className="ad-card premium-card">
                      <div className="card-header">
                        <span className="ad-status pending">Optimerar</span>
                        <div className="trend-indicator">
                          <i className="fas fa-brain"></i>
                          <span>AI</span>
                        </div>
                      </div>
                      <h4>Badrumsrenovering Malmö</h4>
                      <div className="metrics">
                        <span className="metric">23 klick</span>
                        <span className="metric">3 kontakter</span>
                        <span className="metric">kr 890 kostnad</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" data-progress="45"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header reveal-on-scroll">
            <div className="section-badge">
              <i className="fas fa-magic"></i>
              <span>Kraftfulla funktioner</span>
            </div>
            <h2>Allt du behöver för framgångsrika annonser</h2>
            <p>Ingen teknisk kunskap krävs - vi gör jobbet åt dig</p>
          </div>
          <div className="features-grid reveal-on-scroll">
            <div className="feature-card glass-effect" data-tilt="">
              <div className="feature-icon">
                <i className="fas fa-magic"></i>
              </div>
              <h3>Automatisk annonskapande</h3>
              <p>Berätta vad du gör så skapar vi professionella annonser automatiskt. Ingen design-kunskap behövs.</p>
            </div>
            <div className="feature-card glass-effect" data-tilt="">
              <div className="feature-icon">
                <i className="fas fa-link"></i>
              </div>
              <h3>Koppla alla konton</h3>
              <p>Hantera Facebook, Google Ads och Instagram från en plats. En inloggning - alla dina annonser.</p>
            </div>
            <div className="feature-card glass-effect" data-tilt="">
              <div className="feature-icon">
                <i className="fas fa-chart-bar"></i>
              </div>
              <h3>Enkla rapporter</h3>
              <p>Se hur dina annonser presterar med rapporter som alla förstår. Inga krångliga siffror.</p>
            </div>
            <div className="feature-card glass-effect" data-tilt="">
              <div className="feature-icon">
                <i className="fas fa-headset"></i>
              </div>
              <h3>Svensk support</h3>
              <p>Pratar du svenska? Vi också! Få hjälp på svenska när du behöver det.</p>
            </div>
            <div className="feature-card glass-effect" data-tilt="">
              <div className="feature-icon">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>Fungerar överallt</h3>
              <p>Hantera dina annonser från mobilen, paddan eller datorn. Alltid uppdaterat.</p>
            </div>
            <div className="feature-card glass-effect" data-tilt="">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Säkert & tryggt</h3>
              <p>Dina konton är säkra hos oss. Bank-nivå säkerhet för alla dina uppgifter.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header reveal-on-scroll">
            <div className="section-badge">
              <i className="fas fa-rocket"></i>
              <span>Snabb start</span>
            </div>
            <h2>Så enkelt funkar det</h2>
            <p>Från registrering till första annons på under 10 minuter</p>
          </div>
          <div className="steps reveal-on-scroll">
            <div className="step" data-step="1">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Koppla dina konton</h3>
                <p>Logga in med ditt Facebook och Google-konto. Vi gör resten säkert.</p>
              </div>
            </div>
            <div className="step" data-step="1">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Berätta om ditt företag</h3>
                <p>Fyll i vad du gör, var du jobbar och vem du vill nå. Tar 2 minuter.</p>
              </div>
            </div>
            <div className="step" data-step="1">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Vi skapar dina annonser</h3>
                <p>Vårt system skapar professionella annonser anpassade för ditt yrke.</p>
              </div>
            </div>
            <div className="step" data-step="1">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Få fler kunder</h3>
                <p>Följ resultaten i vår enkla översikt och få fler kontakter varje dag.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing">
        <div className="container">
          <div className="section-header reveal-on-scroll">
            <div className="section-badge">
              <i className="fas fa-tag"></i>
              <span>Transparenta priser</span>
            </div>
            <h2>Enkla priser - inga dolda kostnader</h2>
            <p>Välj det som passar ditt företag bäst</p>
          </div>
          <div className="pricing-grid reveal-on-scroll">
            <div className="pricing-card glass-effect" data-tilt="">
              <h3>Starter</h3>
              <div className="price">
                <span className="currency">kr</span>
                <span className="amount">299</span>
                <span className="period">/månad</span>
              </div>
              <ul className="features-list">
                <li><i className="fas fa-check"></i>2 annonskanaler</li>
                <li><i className="fas fa-check"></i>10 aktiva annonser</li>
                <li><i className="fas fa-check"></i>Grundläggande rapporter</li>
                <li><i className="fas fa-check"></i>Email-support</li>
              </ul>
              <button className="btn-secondary full-width">Välj Starter</button>
            </div>
            <div className="pricing-card popular glass-effect" data-tilt="">
              <div className="popular-badge">Populärast</div>
              <h3>Professionell</h3>
              <div className="price">
                <span className="currency">kr</span>
                <span className="amount">599</span>
                <span className="period">/månad</span>
              </div>
              <ul className="features-list">
                <li><i className="fas fa-check"></i>Alla annonskanaler</li>
                <li><i className="fas fa-check"></i>Obegränsade annonser</li>
                <li><i className="fas fa-check"></i>Avancerade rapporter</li>
                <li><i className="fas fa-check"></i>Telefonsupport</li>
                <li><i className="fas fa-check"></i>Prioriterad support</li>
              </ul>
              <button className="btn-primary full-width">Välj Professionell</button>
            </div>
            <div className="pricing-card glass-effect" data-tilt="">
              <h3>Enterprise</h3>
              <div className="price">
                <span className="currency">kr</span>
                <span className="amount">999</span>
                <span className="period">/månad</span>
              </div>
              <ul className="features-list">
                <li><i className="fas fa-check"></i>Allt i Professionell</li>
                <li><i className="fas fa-check"></i>Flera företag</li>
                <li><i className="fas fa-check"></i>White-label lösning</li>
                <li><i className="fas fa-check"></i>Dedikerad kontakt</li>
                <li><i className="fas fa-check"></i>Custom integrationer</li>
              </ul>
              <button className="btn-secondary full-width">Kontakta oss</button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials">
        <div className="container">
          <div className="section-header reveal-on-scroll">
            <div className="section-badge">
              <i className="fas fa-heart"></i>
              <span>Kundrecensioner</span>
            </div>
            <h2>Vad säger våra kunder?</h2>
            <p>Hör från hantverkare som använder AnnonsHjälpen varje dag</p>
          </div>
          <div className="testimonials-grid reveal-on-scroll">
            <div className="testimonial-card glass-effect" data-tilt="">
              <div className="stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p>"Tidigare betalade jag 8000 kr/månad till en byrå. Nu gör jag det själv för en bråkdel av priset och får bättre resultat!"</p>
              <div className="testimonial-author">
                <div className="author-info">
                  <h4>Erik Johansson</h4>
                  <span>Snickare, Stockholm</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card glass-effect" data-tilt="">
              <div className="stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p>"Jag är 62 år och inte så bra med datorer, men detta var så enkelt att även jag klarade det. Får nu 2-3 nya kunder varje vecka!"</p>
              <div className="testimonial-author">
                <div className="author-info">
                  <h4>Bengt Svensson</h4>
                  <span>Rörmokare, Göteborg</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card glass-effect" data-tilt="">
              <div className="stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p>"Fantastisk support på svenska! De hjälpte mig sätta upp allt och följde upp så att jag fick bra resultat från dag ett."</p>
              <div className="testimonial-author">
                <div className="author-info">
                  <h4>Maria Andersson</h4>
                  <span>Elektriker, Malmö</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Redo att få fler kunder?</h2>
            <p>Gå med i hundratals hantverkare som redan använder AnnonsHjälpen för att växa sina företag</p>
            <div className="cta-buttons">
              <button className="btn-primary large" onClick={handleGetStarted}>Testa gratis i 14 dagar</button>
              <p className="cta-note">Inget kreditkort krävs • Avsluta när du vill</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="logo">
                <span>AnnonsHjälpen</span>
              </div>
              <p>Gör reklam enkelt för hantverkare</p>
              <div className="social-links">
                <a href="#"><i className="fab fa-facebook"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-linkedin"></i></a>
              </div>
            </div>
            <div className="footer-section">
              <h4>Produkt</h4>
              <ul>
                <li><a href="#features">Funktioner</a></li>
                <li><a href="#pricing">Priser</a></li>
                <li><a href="#">Integrationer</a></li>
                <li><a href="#">API</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><a href="#">Hjälpcenter</a></li>
                <li><a href="#contact">Kontakt</a></li>
                <li><a href="#">Guider</a></li>
                <li><a href="#">Status</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Företag</h4>
              <ul>
                <li><a href="#">Om oss</a></li>
                <li><a href="#">Karriär</a></li>
                <li><a href="#">Blogg</a></li>
                <li><a href="#">Press</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-legal">
              <a href="#">Integritetspolicy</a>
              <a href="#">Användarvillkor</a>
              <a href="#">Cookies</a>
            </div>
            <p>&copy; 2024 AnnonsHjälpen. Alla rättigheter förbehållna.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}