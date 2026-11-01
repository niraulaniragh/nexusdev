/**
 * NEXUS Portfolio — Main JavaScript
 * Premium interactions, animations, and functionality
 */

(function() {
    'use strict';

    // ----------------------
    // DOM Elements
    // ----------------------
    const navHeader = document.getElementById('nav-header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contact-form');
    const currentYearSpan = document.getElementById('current-year');
    const cursorGlow = document.getElementById('cursor-glow');

    // ----------------------
    // Cursor Glow Effect
    // ----------------------
    function initCursorGlow() {
        if (!cursorGlow || window.matchMedia('(max-width: 768px)').matches) return;
        
        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorGlow.classList.add('active');
        });
        
        document.addEventListener('mouseleave', () => {
            cursorGlow.classList.remove('active');
        });
        
        function animateGlow() {
            const speed = 0.15;
            glowX += (mouseX - glowX) * speed;
            glowY += (mouseY - glowY) * speed;
            
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
            
            requestAnimationFrame(animateGlow);
        }
        
        animateGlow();
    }

    // ----------------------
    // Navigation
    // ----------------------
    function toggleMobileMenu() {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    }

    function closeMobileMenu() {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    function handleNavScroll() {
        if (window.scrollY > 50) {
            navHeader.classList.add('scrolled');
        } else {
            navHeader.classList.remove('scrolled');
        }
    }

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
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

    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            closeMobileMenu();
            
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const headerOffset = 80;
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Throttled scroll handler
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                handleNavScroll();
                updateActiveNavLink();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // ----------------------
    // Scroll Animations
    // ----------------------
    function initScrollAnimations() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            document.querySelectorAll('.animate-on-scroll').forEach(el => {
                el.classList.add('visible');
            });
            return;
        }

        const animatableElements = [
            '.section-header',
            '.about-text',
            '.value-card',
            '.service-card',
            '.tech-showcase',
            '.project-card',
            '.process-step',
            '.contact-header',
            '.contact-links',
            '.contact-form'
        ];

        animatableElements.forEach(selector => {
            document.querySelectorAll(selector).forEach((el, index) => {
                el.classList.add('animate-on-scroll');
                el.style.transitionDelay = `${index * 100}ms`;
            });
        });

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -80px 0px',
            threshold: 0.1
        };

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            animationObserver.observe(el);
        });
    }

    // ----------------------
    // Card Tilt Effect
    // ----------------------
    function initTiltEffect() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion || window.matchMedia('(max-width: 768px)').matches) return;

        const cards = document.querySelectorAll('[data-tilt]');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // ----------------------
    // Contact Form
    // ----------------------
    function initContactForm() {
        if (!contactForm) return;

        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    }

    function handleFormSubmit(e) {
        const formAction = contactForm.getAttribute('action');
        
        // Check if Formspree is configured
        if (formAction.includes('YOUR_FORM_ID')) {
            e.preventDefault();
            
            // Validate all fields first
            const inputs = contactForm.querySelectorAll('[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                handleMailtoFallback();
            }
            return;
        }

        // Validate before Formspree submission
        const requiredFields = contactForm.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) {
            e.preventDefault();
        }
    }

    function validateField(field) {
        const value = field.value.trim();
        
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, 'This field is required');
            return false;
        }
        
        if (field.type === 'email' && value && !isValidEmail(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
        
        clearFieldError(field);
        return true;
    }

    function handleMailtoFallback() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        // Create a clean, professional email format that won't trigger spam filters
        const mailtoSubject = encodeURIComponent(subject);
        const mailtoBody = encodeURIComponent(
`Hi,

${message}

---
From: ${name}
Reply to: ${email}`
        );
        
        const mailtoLink = `mailto:niraulaniragh@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
        
        window.location.href = mailtoLink;
        
        showFormMessage('Opening your email client...', 'success');
        
        setTimeout(() => {
            contactForm.reset();
        }, 1000);
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showFieldError(field, message) {
        clearFieldError(field);
        
        const errorEl = document.createElement('span');
        errorEl.className = 'field-error';
        errorEl.textContent = message;
        errorEl.style.cssText = `
            display: block;
            color: #EF4444;
            font-size: 0.75rem;
            margin-top: 0.5rem;
        `;
        
        field.parentNode.appendChild(errorEl);
        field.style.borderColor = '#EF4444';
    }

    function clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = '';
    }

    function showFormMessage(message, type) {
        const existingMsg = contactForm.querySelector('.form-message');
        if (existingMsg) existingMsg.remove();

        const msgEl = document.createElement('div');
        msgEl.className = `form-message form-message-${type}`;
        msgEl.textContent = message;
        msgEl.style.cssText = `
            padding: 1rem;
            border-radius: 0.75rem;
            font-size: 0.875rem;
            margin-top: 1rem;
            text-align: center;
            ${type === 'success' 
                ? 'background: rgba(34, 197, 94, 0.1); color: #22C55E; border: 1px solid rgba(34, 197, 94, 0.2);' 
                : 'background: rgba(239, 68, 68, 0.1); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.2);'
            }
        `;
        
        contactForm.appendChild(msgEl);

        setTimeout(() => {
            msgEl.style.opacity = '0';
            msgEl.style.transition = 'opacity 0.3s ease';
            setTimeout(() => msgEl.remove(), 300);
        }, 4000);
    }

    // ----------------------
    // Smooth Scroll
    // ----------------------
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ----------------------
    // Current Year
    // ----------------------
    function setCurrentYear() {
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }
    }

    // ----------------------
    // Page Load Animation
    // ----------------------
    function initPageLoadAnimation() {
        document.body.style.opacity = '0';
        
        window.addEventListener('load', () => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        });
    }

    // ----------------------
    // Project Data (for easy updates)
    // ----------------------
    const projectsData = [
        {
            id: 'cs-master-pro',
            title: 'CS Master Pro',
            description: 'An interactive Edexcel IGCSE Computer Science revision platform.',
            tags: ['HTML5', 'CSS3', 'JavaScript', 'Education'],
            liveUrl: 'https://niraulaniragh.github.io/cs-master-pro/',
            repoUrl: 'https://github.com/niraulaniragh/cs-master-pro',
            featured: true
        }
    ];

    window.NEXUS = window.NEXUS || {};
    window.NEXUS.projects = projectsData;

    // ----------------------
    // Initialize
    // ----------------------
    function init() {
        initPageLoadAnimation();
        handleNavScroll();
        updateActiveNavLink();
        setCurrentYear();
        initCursorGlow();
        initScrollAnimations();
        initTiltEffect();
        initContactForm();
        initSmoothScroll();
        
        console.log('%c NEXUS Portfolio ', 'background: linear-gradient(135deg, #568BFF, #9B72FF); color: white; padding: 8px 16px; border-radius: 4px; font-weight: bold;');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
