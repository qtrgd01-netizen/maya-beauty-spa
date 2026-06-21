/* ============================================
   Maya Beauty Spa & Fitness — JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Preloader ----
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 800);
    });
    // Fallback: hide preloader after 3s even if load event doesn't fire
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 3000);

    // ---- AOS Init ----
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 80,
        disable: window.innerWidth < 768 ? 'phone' : false,
    });

    // ---- Navbar Scroll Effect ----
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function handleNavScroll() {
        const scrollY = window.scrollY;

        // Background effect
        if (scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlight
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll(); // initial call

    // ---- Mobile Menu Toggle ----
    const hamburger = document.getElementById('hamburger');
    const navLinksContainer = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
        document.body.style.overflow = navLinksContainer.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
        if (navLinksContainer.classList.contains('active') &&
            !navLinksContainer.contains(e.target) &&
            !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ---- Counter Animation ----
    const counters = document.querySelectorAll('.stat-number[data-count]');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };

            updateCounter();
        });

        countersAnimated = true;
    }

    // Trigger counter when hero stats are in view
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(heroStats);
    }

    // ---- Hero Particles ----
    const particlesContainer = document.getElementById('heroParticles');

    function createParticles() {
        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(201, 169, 110, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: particleFloat ${Math.random() * 10 + 10}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            particlesContainer.appendChild(particle);
        }
    }

    // Add particle animation keyframes dynamically
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes particleFloat {
            0%, 100% { transform: translate(0, 0); opacity: 0.3; }
            25% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); opacity: 0.6; }
            50% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); opacity: 0.3; }
            75% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); opacity: 0.5; }
        }
    `;
    document.head.appendChild(particleStyle);
    createParticles();

    // ---- Testimonials Slider ----
    const track = document.getElementById('testimonialsTrack');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    const dotsContainer = document.getElementById('testimonialsDots');
    const testimonialCards = track ? track.querySelectorAll('.testimonial-card') : [];

    let currentSlide = 0;
    let slidesPerView = 3;
    let autoplayInterval;

    function updateSlidesPerView() {
        if (window.innerWidth <= 768) {
            slidesPerView = 1;
        } else if (window.innerWidth <= 992) {
            slidesPerView = 2;
        } else {
            slidesPerView = 3;
        }
    }

    function getTotalSlides() {
        return Math.max(0, testimonialCards.length - slidesPerView + 1);
    }

    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        const total = getTotalSlides();
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateSlider() {
        if (!track || testimonialCards.length === 0) return;
        const cardWidth = testimonialCards[0].offsetWidth + 20; // including margin
        track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;

        // Update dots
        const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function goToSlide(index) {
        updateSlidesPerView();
        const total = getTotalSlides();
        currentSlide = Math.max(0, Math.min(index, total - 1));
        updateSlider();
    }

    function nextSlide() {
        const total = getTotalSlides();
        if (currentSlide < total - 1) {
            goToSlide(currentSlide + 1);
        } else {
            goToSlide(0);
        }
    }

    function prevSlide() {
        const total = getTotalSlides();
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        } else {
            goToSlide(total - 1);
        }
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoplay();
            startAutoplay();
        });

        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoplay();
            startAutoplay();
        });
    }

    // Initialize slider
    updateSlidesPerView();
    createDots();
    updateSlider();
    startAutoplay();

    // Handle resize
    window.addEventListener('resize', () => {
        updateSlidesPerView();
        createDots();
        goToSlide(0);
        startAutoplay();
    });

    // Pause on hover
    if (track) {
        track.addEventListener('mouseenter', stopAutoplay);
        track.addEventListener('mouseleave', startAutoplay);
    }

    // Touch / swipe support for testimonials
    let touchStartX = 0;
    let touchEndX = 0;

    if (track) {
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoplay();
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            startAutoplay();
        }, { passive: true });
    }

    // ---- Back to Top Button ----
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---- Booking Form ----
    const bookingForm = document.getElementById('bookingForm');

    if (bookingForm) {
        // Set min date to today
        const dateInput = document.getElementById('preferredDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(bookingForm);
            const data = Object.fromEntries(formData.entries());

            // Build WhatsApp message
            const serviceNames = {
                'moroccan-bath': 'Moroccan Bath',
                'hair-care': 'Hair Care',
                'nail-services': 'Nail Services',
                'skincare-facials': 'Skin Care & Facials',
                'makeup': 'Professional Makeup',
                'madero-therapy': 'Madero Therapy',
                'korean-head-spa': 'Korean Head Spa',
                'body-massage': 'Body Massage',
                'fitness-wellness': 'Fitness & Wellness',
                'bridal-package': 'Bridal Package',
                'other': 'Other'
            };

            const serviceName = serviceNames[data.service] || data.service;
            const timeOptions = {
                '10': '10:00 AM', '11': '11:00 AM', '12': '12:00 PM',
                '13': '1:00 PM', '14': '2:00 PM', '15': '3:00 PM',
                '16': '4:00 PM', '17': '5:00 PM', '18': '6:00 PM',
                '19': '7:00 PM', '20': '8:00 PM', '21': '9:00 PM'
            };
            const timeStr = timeOptions[data.time] || data.time;

            const message = `Hello Maya Beauty Spa! 💅\n\n` +
                `📋 *New Booking Request*\n\n` +
                `👤 Name: ${data.fullName}\n` +
                `📞 Phone: ${data.phoneNumber}\n` +
                `💆 Service: ${serviceName}\n` +
                `📅 Date: ${data.date}\n` +
                `🕐 Time: ${timeStr}\n` +
                (data.notes ? `📝 Notes: ${data.notes}\n` : '');

            const encoded = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/97466076098?text=${encoded}`;

            // Show success state in form
            bookingForm.innerHTML = `
                <div class="form-success">
                    <i class="fas fa-check-circle"></i>
                    <h3>Booking Request Sent!</h3>
                    <p>Thank you, ${data.fullName}! Your booking request has been prepared.</p>
                    <p>You will be redirected to WhatsApp to confirm your appointment.</p>
                    <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" 
                       class="btn btn-primary" style="margin-top: 24px; display: inline-flex;">
                        <i class="fab fa-whatsapp"></i>
                        <span>Confirm on WhatsApp</span>
                    </a>
                    <button type="button" class="btn btn-outline" 
                            style="margin-top: 12px; border-color: var(--light-gray); color: var(--dark-gray);"
                            onclick="location.reload()">
                        <span>Make Another Booking</span>
                    </button>
                </div>
            `;

            // Also open WhatsApp automatically
            window.open(whatsappUrl, '_blank');
        });
    }

    // ---- Smooth Scroll for all anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ---- Lazy load images (future-proofing) ----
    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imgObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imgObserver.observe(img);
        });
    }

    // ---- Parallax effect on hero (subtle) ----
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const hero = document.querySelector('.hero-content');
        if (hero && scrollY < window.innerHeight) {
            hero.style.transform = `translateY(${scrollY * 0.15}px)`;
            hero.style.opacity = 1 - scrollY / (window.innerHeight * 0.8);
        }
    }, { passive: true });

    // ---- Mobile WhatsApp Floating Button ----
    const whatsappMobile = document.createElement('a');
    whatsappMobile.href = 'https://wa.me/97466076098';
    whatsappMobile.target = '_blank';
    whatsappMobile.rel = 'noopener noreferrer';
    whatsappMobile.className = 'whatsapp-mobile-float';
    whatsappMobile.innerHTML = '<i class="fab fa-whatsapp"></i>';
    whatsappMobile.setAttribute('aria-label', 'Chat on WhatsApp');
    document.body.appendChild(whatsappMobile);

});
