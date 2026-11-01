/**
 * NEXUS Portfolio — Enhanced JavaScript
 * Premium interactions, custom cursor, animations
 */

(function() {
    'use strict';

    // Elements
    const loader = document.getElementById('loader');
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    const cursorGlow = document.getElementById('cursor-glow');
    const navHeader = document.getElementById('nav-header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contact-form');

    // State
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let outlineX = 0, outlineY = 0;

    // ----------------------
    // Loader
    // ----------------------
    function initLoader() {
        document.body.classList.add('loading');
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.classList.remove('loading');
            }, 1800);
        });
    }

    // ----------------------
    // Custom Cursor
    // ----------------------
    function initCursor() {
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
            return;
        }

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (cursorGlow) {
                cursorGlow.classList.add('active');
            }
        });

        document.addEventListener('mouseleave', () => {
            if (cursorGlow) cursorGlow.classList.remove('active');
        });

        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .magnetic, [data-tilt]');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline?.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline?.classList.remove('hovering');
            });
        });

        animateCursor();
    }

    function animateCursor() {
        const speed = 0.15;
        const outlineSpeed = 0.1;

        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;
        outlineX += (mouseX - outlineX) * outlineSpeed;
        outlineY += (mouseY - outlineY) * outlineSpeed;

        if (cursorDot) {
            cursorDot.style.left = cursorX + 'px';
            cursorDot.style.top = cursorY + 'px';
        }

        if (cursorOutline) {
            cursorOutline.style.left = outlineX + 'px';
            cursorOutline.style.top = outlineY + 'px';
        }

        if (cursorGlow) {
            cursorGlow.style.left = mouseX + 'px';
            cursorGlow.style.top = mouseY + 'px';
        }

        requestAnimationFrame(animateCursor);
    }

    // ----------------------
    // Magnetic Buttons
    // ----------------------
    function initMagneticButtons() {
        const magneticElements = document.querySelectorAll('.magnetic');
        
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ----------------------
    // Navigation
    // ----------------------
    function initNavigation() {
        if (navToggle) {
            navToggle.addEventListener('click', toggleMobileMenu);
        }

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                closeMobileMenu();
                
                const targetId = link.getAttribute('href');
                if (targetId.startsWith('#')) {
                    e.preventDefault();
                    smoothScrollTo(targetId);
                }
            });
        });

        window.addEventListener('scroll', throttle(handleScroll, 100));
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    function toggleMobileMenu() {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    }

    function closeMobileMenu() {
        navToggle?.setAttribute('aria-expanded', 'false');
        navMenu?.classList.remove('active');
        document.body.style.overflow = '';
    }

    function handleScroll() {
        // Nav background
        if (window.scrollY > 50) {
            navHeader?.classList.add('scrolled');
        } else {
            navHeader?.classList.remove('scrolled');
        }

        // Active nav link
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    function smoothScrollTo(targetId) {
        const target = document.querySelector(targetId);
        if (target) {
            const offset = 80;
            const position = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: position, behavior: 'smooth' });
        }
    }

    // ----------------------
    // Scroll Animations
    // ----------------------
    function initScrollAnimations() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const animatableSelectors = [
            '.section-header',
            '.about-text',
            '.about-highlights',
            '.value-card',
            '.service-card',
            '.tech-card',
            '.project-featured',
            '.upcoming-card',
            '.process-step',
            '.contact-info',
            '.contact-form-wrapper',
            '.cta-content'
        ];

        animatableSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add('animate-on-scroll');
            });
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    // ----------------------
    // Tilt Effect
    // ----------------------
    function initTiltEffect() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (window.innerWidth < 768) return;

        const cards = document.querySelectorAll('[data-tilt]');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 15;
                const rotateY = (centerX - x) / 15;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ----------------------
    // Contact Form
    // ----------------------
    function initContactForm() {
        if (!contactForm) return;

        contactForm.addEventListener('submit', handleSubmit);

        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearError(input));
        });
    }

    function handleSubmit(e) {
        e.preventDefault();

        const inputs = contactForm.querySelectorAll('[required]');
        let valid = true;

        inputs.forEach(input => {
            if (!validateField(input)) valid = false;
        });

        if (valid) {
            sendEmail();
        }
    }

    function validateField(field) {
        const value = field.value.trim();

        if (field.hasAttribute('required') && !value) {
            showError(field, 'This field is required');
            return false;
        }

        if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            showError(field, 'Please enter a valid email');
            return false;
        }

        clearError(field);
        return true;
    }

    function showError(field, message) {
        clearError(field);
        
        const error = document.createElement('span');
        error.className = 'field-error';
        error.textContent = message;
        error.style.cssText = 'display:block;color:#ef4444;font-size:0.75rem;margin-top:0.5rem;';
        
        field.parentNode.appendChild(error);
        field.style.borderColor = '#ef4444';
    }

    function clearError(field) {
        const error = field.parentNode.querySelector('.field-error');
        if (error) error.remove();
        field.style.borderColor = '';
    }

    function sendEmail() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        const mailto = `mailto:niraulaniragh@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
`Hi,

${message}

---
From: ${name}
Reply to: ${email}`
        )}`;

        window.location.href = mailto;
        
        showMessage('Opening your email client...', 'success');
        setTimeout(() => contactForm.reset(), 1000);
    }

    function showMessage(text, type) {
        const existing = contactForm.querySelector('.form-message');
        if (existing) existing.remove();

        const msg = document.createElement('div');
        msg.className = 'form-message';
        msg.textContent = text;
        msg.style.cssText = `
            padding: 1rem;
            border-radius: 0.75rem;
            font-size: 0.875rem;
            margin-top: 1rem;
            text-align: center;
            background: ${type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'};
            color: ${type === 'success' ? '#10b981' : '#ef4444'};
            border: 1px solid ${type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'};
        `;

        contactForm.appendChild(msg);
        setTimeout(() => msg.remove(), 4000);
    }

    // ----------------------
    // Utilities
    // ----------------------
    function throttle(fn, wait) {
        let time = Date.now();
        return function() {
            if ((time + wait - Date.now()) < 0) {
                fn();
                time = Date.now();
            }
        };
    }

    function setCurrentYear() {
        const el = document.getElementById('current-year');
        if (el) el.textContent = new Date().getFullYear();
    }

    // ----------------------
    // Initialize
    // ----------------------
    function init() {
        initLoader();
        initCursor();
        initMagneticButtons();
        initNavigation();
        initScrollAnimations();
        initTiltEffect();
        initContactForm();
        setCurrentYear();
        handleScroll();

        // Smooth scroll for all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId !== '#') {
                    e.preventDefault();
                    smoothScrollTo(targetId);
                }
            });
        });

        console.log('%c NEXUS Portfolio ', 'background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 10px 20px; border-radius: 6px; font-weight: bold; font-size: 14px;');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
