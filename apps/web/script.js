// Enhanced interactivity and animations for premium experience
console.log('🚀 AnnonsHjälpen Premium Experience Loading...');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAllEffects();
});

function initializeAllEffects() {
    initMobileMenu();
    initSmoothScrolling();
    initNavbarScrollEffect();
    initScrollRevealAnimations();
    initProgressBars();
    initFloatingElements();
    initStatAnimations();
    initPremiumButtons();
    initModalSystem();
    initParallaxEffects();
    initTypewriterEffect();
    
    console.log('✨ All premium effects initialized');
}

// Mobile menu functionality
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Animate hamburger lines
            const spans = hamburger.querySelectorAll('span');
            if (hamburger.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            
            const spans = hamburger?.querySelectorAll('span');
            if (spans) {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });
}

// Enhanced smooth scrolling with easing
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 90;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Add a subtle bounce effect to the target
                target.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    target.style.transform = 'scale(1)';
                }, 200);
            }
        });
    });
}

// Advanced navbar scroll effects
function initNavbarScrollEffect() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll direction
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Advanced 3D tilt effects
function initTiltEffects() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transformStyle = 'preserve-3d';
        });
        
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });
}

// Sophisticated scroll reveal animations
function initScrollRevealAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered animation delay
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                    
                    // Add extra effects for certain elements
                    if (entry.target.classList.contains('feature-card')) {
                        entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                    }
                    
                    if (entry.target.classList.contains('step')) {
                        const stepNumber = entry.target.querySelector('.step-number');
                        if (stepNumber) {
                            stepNumber.style.animation = 'bounceIn 0.6s ease-out 0.3s forwards';
                        }
                    }
                }, index * 100);
            }
        });
    }, observerOptions);

    // Observe all reveal elements
    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        observer.observe(el);
    });
    
    // Observe individual cards for staggered animation - Fixed
    document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card, .step').forEach((el, index) => {
        // Elements stay visible by default
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.style.transition = `all 0.8s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// Animated progress bars
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const targetWidth = progressBar.getAttribute('data-progress') || '0';
                
                setTimeout(() => {
                    progressBar.style.width = targetWidth + '%';
                }, 500);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
}

// Simplified floating elements
function initFloatingElements() {
    const floatingShapes = document.querySelectorAll('.floating-shape');
    
    // Simple floating animation without performance issues
    floatingShapes.forEach((shape, index) => {
        const duration = 30000 + index * 5000; // Slower, staggered timing
        shape.style.animationDuration = duration + 'ms';
    });
}

// Advanced counter animations
function initStatAnimations() {
    const stats = document.querySelectorAll('.stat-number');
    let hasAnimated = false;
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                setTimeout(() => {
                    animateStats();
                }, 500);
            }
        });
    }, { threshold: 0.7 });
    
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        statsObserver.observe(heroSection);
    }
    
    function animateStats() {
        stats.forEach((stat, index) => {
            const finalText = stat.textContent;
            const numericValue = parseInt(finalText.replace(/\D/g, ''));
            const suffix = finalText.replace(/\d/g, '');
            
            if (numericValue) {
                let current = 0;
                const increment = numericValue / 60; // 60 frames for smooth animation
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= numericValue) {
                        current = numericValue;
                        clearInterval(timer);
                        
                        // Add a celebration effect
                        stat.style.transform = 'scale(1.1)';
                        setTimeout(() => {
                            stat.style.transform = 'scale(1)';
                        }, 200);
                    }
                    stat.textContent = Math.floor(current) + suffix;
                }, 16); // ~60 FPS
            }
        });
    }
}

// Premium button effects
function initPremiumButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    buttons.forEach(button => {
        // Add ripple effect
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Enhanced hover effects
        button.addEventListener('mouseenter', function() {
            this.style.filter = 'brightness(1.1) saturate(1.2)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.filter = 'brightness(1) saturate(1)';
        });
    });
}

// Advanced modal system
function initModalSystem() {
    // Demo button functionality
    document.querySelectorAll('button').forEach(button => {
        if (button.textContent.includes('demo') || button.textContent.includes('Demo')) {
            button.addEventListener('click', () => {
                showDemoModal();
            });
        }
        
        if (button.textContent.includes('Testa gratis') || button.textContent.includes('Kom igång')) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                showSignupModal();
            });
        }
    });
    
    // Pricing button functionality
    document.querySelectorAll('.pricing-card button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const card = e.target.closest('.pricing-card');
            const planName = card.querySelector('h3').textContent;
            
            if (button.textContent.includes('Kontakta oss')) {
                showContactModal(planName);
            } else {
                showSignupModal(planName);
            }
        });
    });
}

// Enhanced modal functions
function showDemoModal() {
    const modal = createModal(`
        <div class="modal-content premium-modal">
            <div class="modal-header">
                <h3><i class="fas fa-play-circle"></i> Produktdemo</h3>
                <button class="close-btn" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="demo-video-container">
                <div class="video-placeholder">
                    <div class="play-button">
                        <i class="fas fa-play"></i>
                    </div>
                    <div class="video-overlay">
                        <h4>Se hur enkelt det är!</h4>
                        <p>Denna demo visar hur du skapar din första annons på 5 minuter</p>
                    </div>
                </div>
            </div>
            <div class="demo-features">
                <div class="demo-feature">
                    <i class="fas fa-check-circle"></i>
                    <span>Automatisk AI-optimering</span>
                </div>
                <div class="demo-feature">
                    <i class="fas fa-check-circle"></i>
                    <span>Realtidsstatistik</span>
                </div>
                <div class="demo-feature">
                    <i class="fas fa-check-circle"></i>
                    <span>Direkt publicering</span>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn-primary" onclick="closeModal(); showSignupModal();">
                    <i class="fas fa-rocket"></i>
                    Testa själv nu
                </button>
                <button class="btn-secondary" onclick="closeModal()">
                    Stäng
                </button>
            </div>
        </div>
    `);
    document.body.appendChild(modal);
    
    // Animate modal in
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function showSignupModal(plan = 'Professionell') {
    const modal = createModal(`
        <div class="modal-content premium-modal">
            <div class="modal-header">
                <h3><i class="fas fa-user-plus"></i> Kom igång med AnnonsHjälpen</h3>
                <button class="close-btn" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="signup-progress">
                <div class="progress-step active">
                    <span>1</span>
                    <label>Företagsinfo</label>
                </div>
                <div class="progress-step">
                    <span>2</span>
                    <label>Personuppgifter</label>
                </div>
                <div class="progress-step">
                    <span>3</span>
                    <label>Bekräftelse</label>
                </div>
            </div>
            
            <form class="signup-form premium-form">
                <div class="form-step active" data-step="1">
                    <div class="form-group">
                        <label><i class="fas fa-building"></i> Företagsnamn *</label>
                        <input type="text" placeholder="t.ex. Johanssons Snickeri" required>
                    </div>
                    
                    <div class="form-group">
                        <label><i class="fas fa-tools"></i> Din bransch *</label>
                        <select required>
                            <option value="">Välj din bransch</option>
                            <option value="snickare">🔨 Snickare</option>
                            <option value="elektriker">⚡ Elektriker</option>
                            <option value="rörmokare">🔧 Rörmokare</option>
                            <option value="målare">🎨 Målare</option>
                            <option value="byggnads">🏗️ Byggnads & Renovering</option>
                            <option value="mark">🌱 Mark & Trädgård</option>
                            <option value="annat">📋 Annat</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label><i class="fas fa-map-marker-alt"></i> Var arbetar du? *</label>
                        <input type="text" placeholder="t.ex. Stockholm, Göteborg, Malmö" required>
                    </div>
                </div>
                
                <div class="form-step" data-step="2">
                    <div class="form-row">
                        <div class="form-group">
                            <label><i class="fas fa-user"></i> Förnamn *</label>
                            <input type="text" required>
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-user"></i> Efternamn *</label>
                            <input type="text" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label><i class="fas fa-envelope"></i> E-post *</label>
                        <input type="email" placeholder="din@email.se" required>
                    </div>
                    
                    <div class="form-group">
                        <label><i class="fas fa-phone"></i> Telefonnummer *</label>
                        <input type="tel" placeholder="070-123 45 67" required>
                    </div>
                </div>
                
                <div class="form-step" data-step="3">
                    <div class="plan-summary premium-summary">
                        <h4><i class="fas fa-crown"></i> Valt paket: ${plan}</h4>
                        <div class="benefits">
                            <div class="benefit">
                                <i class="fas fa-check-circle"></i>
                                <span>14 dagars gratis provperiod</span>
                            </div>
                            <div class="benefit">
                                <i class="fas fa-check-circle"></i>
                                <span>Inget kreditkort krävs</span>
                            </div>
                            <div class="benefit">
                                <i class="fas fa-check-circle"></i>
                                <span>Avsluta när du vill</span>
                            </div>
                            <div class="benefit">
                                <i class="fas fa-check-circle"></i>
                                <span>Svensk support</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button type="button" class="btn-secondary prev-btn" onclick="previousStep()" style="display: none;">
                        <i class="fas fa-arrow-left"></i>
                        Tillbaka
                    </button>
                    <button type="button" class="btn-primary next-btn" onclick="nextStep()">
                        Nästa
                        <i class="fas fa-arrow-right"></i>
                    </button>
                    <button type="submit" class="btn-primary submit-btn" style="display: none;">
                        <i class="fas fa-rocket"></i>
                        Starta gratis provperiod
                    </button>
                </div>
            </form>
        </div>
    `);
    
    const form = modal.querySelector('.signup-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        showSuccessMessage();
    });
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
}

function showContactModal(plan = 'Enterprise') {
    const modal = createModal(`
        <div class="modal-content premium-modal">
            <div class="modal-header">
                <h3><i class="fas fa-handshake"></i> Kontakta oss - ${plan}</h3>
                <button class="close-btn" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="contact-intro">
                <p>Berätta om dina behov så kontaktar vi dig inom 24 timmar för en skräddarsydd lösning.</p>
            </div>
            
            <form class="contact-form premium-form">
                <div class="form-row">
                    <div class="form-group">
                        <label><i class="fas fa-building"></i> Företagsnamn *</label>
                        <input type="text" required>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-users"></i> Antal anställda</label>
                        <select>
                            <option value="1">1 person (bara jag)</option>
                            <option value="2-5">2-5 personer</option>
                            <option value="6-10">6-10 personer</option>
                            <option value="11+">11+ personer</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label><i class="fas fa-user"></i> Kontaktperson *</label>
                        <input type="text" required>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-briefcase"></i> Titel</label>
                        <input type="text" placeholder="VD, Marknadsansvarig, etc.">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label><i class="fas fa-envelope"></i> E-post *</label>
                        <input type="email" required>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-phone"></i> Telefonnummer *</label>
                        <input type="tel" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label><i class="fas fa-comments"></i> Berätta om dina behov</label>
                    <textarea rows="4" placeholder="t.ex. Vi behöver hantera annonser för flera företag/varumärken, anpassade rapporter, API-integration..."></textarea>
                </div>
                
                <div class="form-group">
                    <label><i class="fas fa-calendar-alt"></i> Önskad kontakttid</label>
                    <select>
                        <option value="">Spelar ingen roll</option>
                        <option value="morning">Förmiddag (08-12)</option>
                        <option value="afternoon">Eftermiddag (12-17)</option>
                        <option value="evening">Kväll (17-20)</option>
                    </select>
                </div>
                
                <div class="modal-actions">
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-paper-plane"></i>
                        Skicka förfrågan
                    </button>
                    <button type="button" class="btn-secondary" onclick="closeModal()">
                        Stäng
                    </button>
                </div>
            </form>
        </div>
    `);
    
    const form = modal.querySelector('.contact-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        showSuccessMessage('Tack! Vi kontaktar dig inom 24 timmar för att diskutera dina behov.');
    });
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
}

// Multi-step form functionality
let currentStep = 1;

function nextStep() {
    const currentStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const progressStep = document.querySelector(`.progress-step:nth-child(${currentStep})`);
    
    // Validate current step
    const requiredFields = currentStepEl.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#ff6b6b';
            setTimeout(() => {
                field.style.borderColor = '';
            }, 2000);
        }
    });
    
    if (!isValid) {
        // Shake animation for invalid form
        currentStepEl.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            currentStepEl.style.animation = '';
        }, 500);
        return;
    }
    
    if (currentStep < 3) {
        // Hide current step
        currentStepEl.classList.remove('active');
        progressStep.classList.add('completed');
        
        currentStep++;
        
        // Show next step
        const nextStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        const nextProgressStep = document.querySelector(`.progress-step:nth-child(${currentStep})`);
        
        setTimeout(() => {
            nextStepEl.classList.add('active');
            nextProgressStep.classList.add('active');
        }, 300);
        
        // Update buttons
        document.querySelector('.prev-btn').style.display = 'block';
        
        if (currentStep === 3) {
            document.querySelector('.next-btn').style.display = 'none';
            document.querySelector('.submit-btn').style.display = 'block';
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        const currentStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        const progressStep = document.querySelector(`.progress-step:nth-child(${currentStep})`);
        
        currentStepEl.classList.remove('active');
        progressStep.classList.remove('active');
        
        currentStep--;
        
        const prevStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        const prevProgressStep = document.querySelector(`.progress-step:nth-child(${currentStep})`);
        
        setTimeout(() => {
            prevStepEl.classList.add('active');
            prevProgressStep.classList.remove('completed');
        }, 300);
        
        // Update buttons
        if (currentStep === 1) {
            document.querySelector('.prev-btn').style.display = 'none';
        }
        
        document.querySelector('.next-btn').style.display = 'block';
        document.querySelector('.submit-btn').style.display = 'none';
    }
}

function createModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = content;
    
    // Close modal on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    return modal;
}

function closeModal() {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        modal.classList.add('hide');
        setTimeout(() => {
            modal.remove();
        }, 300);
    });
    
    // Reset form step
    currentStep = 1;
}

function showSuccessMessage(message = 'Tack för din registrering! Vi skickar instruktioner till din e-post inom några minuter.') {
    closeModal();
    
    const successModal = createModal(`
        <div class="modal-content success-modal">
            <div class="success-animation">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="success-particles">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <h3>🎉 Välkommen till AnnonsHjälpen!</h3>
            <p>${message}</p>
            <div class="success-features">
                <div class="success-feature">
                    <i class="fas fa-rocket"></i>
                    <span>Kom igång på 5 minuter</span>
                </div>
                <div class="success-feature">
                    <i class="fas fa-headset"></i>
                    <span>Svensk support hjälper dig</span>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn-primary" onclick="closeModal()">
                    <i class="fas fa-heart"></i>
                    Fantastiskt!
                </button>
            </div>
        </div>
    `);
    
    document.body.appendChild(successModal);
    setTimeout(() => successModal.classList.add('show'), 10);
    
    // Trigger confetti effect
    createConfetti();
}

// Removed problematic parallax effects
function initParallaxEffects() {
    // Parallax effects removed to improve performance
    console.log('Parallax effects disabled for better performance');
}

// Simplified typewriter effect
function initTypewriterEffect() {
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        // Just show the text immediately - no typewriter effect
        heroTitle.style.opacity = '1';
    }
}

// Confetti effect
function createConfetti() {
    const colors = ['#CC785C', '#8B4513', '#F4EDE4', '#FFB800', '#28CA42'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            top: -10px;
            left: ${Math.random() * 100}vw;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            transform: rotate(${Math.random() * 360}deg);
            animation: confetti-fall ${Math.random() * 3 + 2}s linear infinite;
            z-index: 10000;
            pointer-events: none;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Add dynamic styles
const dynamicStyles = `
    <style>
    /* Modal Styles */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .modal-overlay.show {
        opacity: 1;
        visibility: visible;
    }
    
    .modal-overlay.hide {
        opacity: 0;
        visibility: hidden;
    }
    
    .modal-content {
        background: white;
        border-radius: 24px;
        padding: 0;
        max-width: 600px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        transform: translateY(40px) scale(0.9);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    
    .modal-overlay.show .modal-content {
        transform: translateY(0) scale(1);
    }
    
    .premium-modal {
        border: 1px solid var(--border-light);
    }
    
    .modal-header {
        padding: 2rem 2rem 1rem;
        border-bottom: 1px solid var(--border-light);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--gradient-bg);
    }
    
    .modal-header h3 {
        margin: 0;
        color: var(--text-dark);
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 1.5rem;
    }
    
    .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--text-light);
        cursor: pointer;
        padding: 8px;
        border-radius: 8px;
        transition: all 0.3s ease;
    }
    
    .close-btn:hover {
        background: var(--accent-beige);
        color: var(--primary-orange);
        transform: scale(1.1);
    }
    
    /* Demo Modal */
    .demo-video-container {
        padding: 2rem;
    }
    
    .video-placeholder {
        aspect-ratio: 16/9;
        background: linear-gradient(135deg, var(--bg-cream) 0%, var(--accent-beige) 100%);
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
    }
    
    .play-button {
        width: 80px;
        height: 80px;
        background: var(--gradient-primary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 8px 32px var(--shadow-medium);
    }
    
    .play-button:hover {
        transform: scale(1.1);
        box-shadow: 0 12px 48px var(--shadow-strong);
    }
    
    .video-overlay {
        position: absolute;
        top: 1rem;
        left: 1rem;
        right: 1rem;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 1rem;
    }
    
    .video-overlay h4 {
        margin: 0 0 0.5rem 0;
        color: var(--text-dark);
    }
    
    .video-overlay p {
        margin: 0;
        color: var(--text-medium);
        font-size: 0.9rem;
    }
    
    .demo-features {
        display: flex;
        justify-content: space-around;
        padding: 1rem 2rem;
        background: var(--bg-cream);
    }
    
    .demo-feature {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--text-dark);
        font-weight: 500;
    }
    
    .demo-feature i {
        color: #28CA42;
    }
    
    /* Form Styles */
    .premium-form {
        padding: 2rem;
    }
    
    .signup-progress {
        display: flex;
        justify-content: space-between;
        margin-bottom: 2rem;
        position: relative;
    }
    
    .signup-progress::before {
        content: '';
        position: absolute;
        top: 20px;
        left: 20px;
        right: 20px;
        height: 2px;
        background: var(--border-light);
        z-index: 1;
    }
    
    .progress-step {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        position: relative;
        z-index: 2;
    }
    
    .progress-step span {
        width: 40px;
        height: 40px;
        background: var(--border-light);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-light);
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .progress-step.active span {
        background: var(--gradient-primary);
        color: white;
        transform: scale(1.1);
    }
    
    .progress-step.completed span {
        background: #28CA42;
        color: white;
    }
    
    .progress-step label {
        font-size: 0.8rem;
        color: var(--text-medium);
        font-weight: 500;
    }
    
    .form-step {
        display: none;
        animation: slideIn 0.5s ease-out;
    }
    
    .form-step.active {
        display: block;
    }
    
    .form-group {
        margin-bottom: 1.5rem;
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: var(--text-dark);
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid var(--border-light);
        border-radius: 12px;
        font-size: 16px;
        transition: all 0.3s ease;
        background: white;
    }
    
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: var(--primary-orange);
        box-shadow: 0 0 0 3px rgba(204, 120, 92, 0.1);
    }
    
    .premium-summary {
        background: var(--gradient-bg);
        padding: 1.5rem;
        border-radius: 16px;
        border: 1px solid var(--border-light);
    }
    
    .premium-summary h4 {
        margin-bottom: 1rem;
        color: var(--text-dark);
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .benefits {
        display: grid;
        gap: 12px;
    }
    
    .benefit {
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--text-dark);
    }
    
    .benefit i {
        color: #28CA42;
        font-size: 1.1rem;
    }
    
    .contact-intro {
        padding: 1rem 2rem;
        background: var(--bg-cream);
        margin: 0 2rem;
        border-radius: 12px;
        margin-bottom: 1rem;
    }
    
    .contact-intro p {
        margin: 0;
        color: var(--text-medium);
        text-align: center;
    }
    
    /* Success Modal */
    .success-modal {
        text-align: center;
        padding: 3rem;
    }
    
    .success-animation {
        position: relative;
        margin-bottom: 2rem;
    }
    
    .success-icon {
        font-size: 5rem;
        color: #28CA42;
        animation: successBounce 0.6s ease-out;
    }
    
    .success-particles {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    
    .success-particles span {
        position: absolute;
        width: 6px;
        height: 6px;
        background: var(--primary-orange);
        border-radius: 50%;
        animation: particle 1s ease-out infinite;
    }
    
    .success-particles span:nth-child(1) { animation-delay: 0s; top: -30px; left: -30px; }
    .success-particles span:nth-child(2) { animation-delay: 0.2s; top: -30px; left: 30px; }
    .success-particles span:nth-child(3) { animation-delay: 0.4s; top: 30px; left: -30px; }
    .success-particles span:nth-child(4) { animation-delay: 0.6s; top: 30px; left: 30px; }
    .success-particles span:nth-child(5) { animation-delay: 0.8s; top: 0; left: 0; }
    
    .success-features {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin: 2rem 0;
        flex-wrap: wrap;
    }
    
    .success-feature {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--text-dark);
        font-weight: 500;
    }
    
    .success-feature i {
        color: var(--primary-orange);
    }
    
    /* Modal Actions */
    .modal-actions {
        padding: 1.5rem 2rem 2rem;
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    /* Ripple Effect */
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    /* Animations */
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes successBounce {
        0%, 20%, 53%, 80%, 100% {
            transform: scale(1);
        }
        40%, 43% {
            transform: scale(1.1);
        }
        70% {
            transform: scale(1.05);
        }
        90% {
            transform: scale(1.02);
        }
    }
    
    @keyframes particle {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(2) translate(var(--random-x, 20px), var(--random-y, 20px));
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes confetti-fall {
        0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
    
    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: scale(0.3);
        }
        50% {
            opacity: 1;
            transform: scale(1.05);
        }
        70% {
            transform: scale(0.9);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    /* Mobile Menu Styles */
    @media (max-width: 768px) {
        .nav-menu.active {
            display: flex;
            position: absolute;
            top: 90px;
            left: 0;
            width: 100%;
            flex-direction: column;
            background: rgba(253, 252, 251, 0.95);
            backdrop-filter: blur(20px);
            box-shadow: 0 8px 32px var(--shadow-light);
            padding: 2rem;
            gap: 1.5rem;
            animation: slideDown 0.3s ease-out;
        }
        
        .form-row {
            grid-template-columns: 1fr;
        }
        
        .success-features {
            flex-direction: column;
            align-items: center;
        }
        
        .modal-actions {
            flex-direction: column;
        }
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', dynamicStyles);

console.log('🎨 Premium design system loaded');
console.log('🚀 AnnonsHjälpen - Ready to impress!');
console.log('💡 Klicka på knapparna för att se alla coola effekter!');