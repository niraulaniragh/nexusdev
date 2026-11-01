/**
 * NEXUS Portfolio — Main JavaScript
 * Handles navigation, animations, form, and interactions
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

    // ----------------------
    // Navigation
    // ----------------------
    
    // Mobile menu toggle
    function toggleMobileMenu() {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    }

    // Close mobile menu
    function closeMobileMenu() {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Handle scroll for nav background
    function handleNavScroll() {
        if (window.scrollY > 50) {
            navHeader.classList.add('scrolled');
        } else {
            navHeader.classList.remove('scrolled');
        }
    }

    // Update active navigation link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 100;

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

    // Event listeners for navigation
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Close mobile menu when link is clicked
            closeMobileMenu();
            
            // Smooth scroll to section
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

    // Scroll event handlers
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

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // ----------------------
    // Scroll Animations
    // ----------------------
    
    function initScrollAnimations() {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            // Skip animations for users who prefer reduced motion
            document.querySelectorAll('.animate-on-scroll').forEach(el => {
                el.classList.add('visible');
            });
            return;
        }

        // Add animation classes to elements
        const animatableElements = [
            '.section-label',
            '.section-title',
            '.about-text',
            '.value-card',
            '.service-card',
            '.tech-category',
            '.project-card',
            '.process-step',
            '.contact-header',
            '.contact-info',
            '.contact-form'
        ];

        animatableElements.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add('animate-on-scroll');
            });
        });

        // Intersection Observer for scroll animations
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
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
    // Contact Form
    // ----------------------
    
    function initContactForm() {
        if (!contactForm) return;

        contactForm.addEventListener('submit', handleFormSubmit);
    }

    function handleFormSubmit(e) {
        const formAction = contactForm.getAttribute('action');
        
        // Check if Formspree is configured
        if (formAction.includes('YOUR_FORM_ID')) {
            e.preventDefault();
            handleMailtoFallback();
            return;
        }

        // If Formspree is configured, let it handle the submission
        // The form will submit normally to Formspree
        
        // Basic validation
        const requiredFields = contactForm.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                showFieldError(field, 'This field is required');
            } else {
                clearFieldError(field);
            }
        });

        // Email validation
        const emailField = contactForm.querySelector('#email');
        if (emailField && emailField.value && !isValidEmail(emailField.value)) {
            isValid = false;
            showFieldError(emailField, 'Please enter a valid email address');
        }

        if (!isValid) {
            e.preventDefault();
        }
    }

    function handleMailtoFallback() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validate required fields
        if (!name || !email || !subject || !message) {
            showFormMessage('Please fill in all fields.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Construct mailto link
        const mailtoSubject = encodeURIComponent(`[NEXUS Portfolio] ${subject}`);
        const mailtoBody = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        );
        
        // Replace with your actual email
        const mailtoLink = `mailto:your.email@example.com?subject=${mailtoSubject}&body=${mailtoBody}`;
        
        // Open default email client
        window.location.href = mailtoLink;
        
        // Show feedback
        showFormMessage('Opening your email client...', 'success');
        
        // Clear form after a delay
        setTimeout(() => {
            contactForm.reset();
        }, 1000);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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
            margin-top: 0.25rem;
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
        // Remove existing messages
        const existingMsg = contactForm.querySelector('.form-message');
        if (existingMsg) existingMsg.remove();

        const msgEl = document.createElement('div');
        msgEl.className = `form-message form-message-${type}`;
        msgEl.textContent = message;
        msgEl.style.cssText = `
            padding: 1rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            margin-top: 1rem;
            ${type === 'success' 
                ? 'background: rgba(34, 197, 94, 0.1); color: #22C55E; border: 1px solid rgba(34, 197, 94, 0.3);' 
                : 'background: rgba(239, 68, 68, 0.1); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.3);'
            }
        `;
        
        contactForm.appendChild(msgEl);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            msgEl.remove();
        }, 5000);
    }

    // Clear field errors on input
    document.querySelectorAll('.contact-form input, .contact-form textarea').forEach(field => {
        field.addEventListener('input', () => {
            clearFieldError(field);
        });
    });

    // ----------------------
    // Current Year
    // ----------------------
    
    function setCurrentYear() {
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }
    }

    // ----------------------
    // Button Hover Effects
    // ----------------------
    
    function initButtonEffects() {
        const buttons = document.querySelectorAll('.btn-primary');
        
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                this.style.setProperty('--mouse-x', `${x}px`);
                this.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    // ----------------------
    // Smooth Scroll for Anchor Links
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
    // Project Data Structure
    // ----------------------
    
    /**
     * Project data structure for easy updates
     * To add a new project, add an object to this array with the following properties:
     * 
     * @property {string} id - Unique identifier
     * @property {string} title - Project name
     * @property {string} description - Brief description
     * @property {string[]} tags - Technology tags
     * @property {string} liveUrl - Live project URL (optional)
     * @property {string} repoUrl - GitHub repository URL (optional)
     * @property {string} imageUrl - Project screenshot URL (optional)
     * @property {boolean} featured - Whether to feature prominently
     * @property {boolean} comingSoon - Mark as coming soon placeholder
     */
    const projectsData = [
        {
            id: 'cs-master-pro',
            title: 'CS Master Pro',
            description: 'An interactive Edexcel IGCSE Computer Science revision platform designed to make learning and exam preparation more engaging.',
            tags: ['HTML5', 'CSS3', 'JavaScript', 'Education'],
            liveUrl: 'https://niraulaniragh.github.io/cs-master-pro/',
            repoUrl: 'https://github.com/niraulaniragh/cs-master-pro',
            featured: true,
            comingSoon: false
        },
        {
            id: 'future-project-01',
            title: 'Future Project 01',
            description: 'A new project is in development. Stay tuned for updates.',
            tags: [],
            featured: false,
            comingSoon: true
        },
        {
            id: 'future-project-02',
            title: 'Future Project 02',
            description: 'Another exciting project is on the way.',
            tags: [],
            featured: false,
            comingSoon: true
        }
    ];

    // Export projects data for potential dynamic rendering
    window.NEXUS = window.NEXUS || {};
    window.NEXUS.projects = projectsData;

    // ----------------------
    // Initialize
    // ----------------------
    
    function init() {
        // Initial state
        handleNavScroll();
        updateActiveNavLink();
        setCurrentYear();
        
        // Initialize components
        initScrollAnimations();
        initContactForm();
        initButtonEffects();
        initSmoothScroll();
        
        // Log ready state
        console.log('NEXUS Portfolio initialized');
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
