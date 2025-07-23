// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initLoadingScreen();
    initNavigation();
    initAnimatedCounters();
    initScrollAnimations();
    initMobileMenu();
    initSmoothScrolling();
    initFloatingEmojis();
    initIntersectionObserver();
    initButtonAnimations();
});

// Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingProgress = document.querySelector('.loading-progress');
    
    // Simulate loading progress
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            // Hide loading screen after a short delay
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                
                // Remove loading screen from DOM after transition
                setTimeout(() => {
                    if (loadingScreen.parentNode) {
                        loadingScreen.parentNode.removeChild(loadingScreen);
                    }
                }, 300);
                
                // Trigger initial animations
                triggerInitialAnimations();
            }, 500);
        }
        loadingProgress.style.width = progress + '%';
    }, 100);
}

// Show Page Function - Make this available globally from the start
window.showPage = function(pageName) {
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Hide all pages
    pages.forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });
    
    // Show target page
    const targetPage = document.getElementById(pageName);
    if (targetPage) {
        targetPage.classList.add('active');
        targetPage.style.display = 'block';
        
        // Scroll to top of page
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Update active navigation states
        updateActiveStates(pageName);
        
        // Trigger page-specific animations
        setTimeout(() => {
            triggerPageAnimations(pageName);
        }, 100);
        
        // Close mobile menu if open
        closeMobileMenu();
    }
};

// Navigation System
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Set initial active states
    updateActiveStates('home');
    
    // Ensure home page is visible initially
    const homePage = document.getElementById('home');
    if (homePage) {
        homePage.style.display = 'block';
    }
    
    // Add click listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            if (targetPage) {
                window.showPage(targetPage);
            }
        });
    });
}

// Update Active Navigation States
function updateActiveStates(activePage) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === activePage) {
            link.classList.add('active');
        }
    });
}

// Animated Counters
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const stepTime = 50; // Update every 50ms
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, stepTime);
    };
    
    // Create intersection observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                animateCounter(entry.target);
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.5
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Scroll Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.stat-card, .activity-card, .story-card, .mission-card, .value-card, .timeline-item, .gallery-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            }
        });
    }, observerOptions);
    
    // Initially hide elements and observe them
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        observer.observe(element);
    });
}

// Mobile Menu
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    let isMenuOpen = false;
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            toggleMobileMenu();
        });
    }
    
    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            nav.style.display = 'block';
            nav.style.position = 'absolute';
            nav.style.top = '100%';
            nav.style.left = '0';
            nav.style.right = '0';
            nav.style.background = 'white';
            nav.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            nav.style.borderRadius = '0 0 12px 12px';
            nav.style.padding = '20px';
            nav.style.zIndex = '1000';
            
            // Animate hamburger
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            closeMobileMenu();
        }
    }
}

function closeMobileMenu() {
    const nav = document.querySelector('.nav');
    const hamburger = document.querySelector('.hamburger');
    
    if (window.innerWidth <= 768) {
        nav.style.display = 'none';
        
        // Reset hamburger animation
        if (hamburger) {
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }
}

// Smooth Scrolling
function initSmoothScrolling() {
    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#') && href !== '#') {
                // Check if it's a page navigation
                const pageName = href.substring(1);
                const targetPage = document.getElementById(pageName);
                if (targetPage && targetPage.classList.contains('page')) {
                    e.preventDefault();
                    window.showPage(pageName);
                } else {
                    // Regular anchor link
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            }
        });
    });
}

// Floating Emojis Animation
function initFloatingEmojis() {
    const floatingEmojis = document.querySelectorAll('.floating-emoji');
    
    floatingEmojis.forEach((emoji, index) => {
        // Randomize animation timing
        const delay = Math.random() * 2;
        const duration = 4 + Math.random() * 4; // 4-8 seconds
        
        emoji.style.animationDelay = delay + 's';
        emoji.style.animationDuration = duration + 's';
        
        // Add random movement
        const moveEmoji = () => {
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            emoji.style.left = x + '%';
            emoji.style.top = y + '%';
        };
        
        // Move emoji every few seconds
        setInterval(moveEmoji, 8000 + Math.random() * 4000);
    });
}

// Intersection Observer for Advanced Animations
function initIntersectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add specific animations based on element class
                if (element.classList.contains('hero-title')) {
                    element.style.animation = 'fadeInDown 1s cubic-bezier(0.16, 1, 0.3, 1)';
                }
                
                if (element.classList.contains('section-title')) {
                    element.style.animation = 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                }
                
                if (element.classList.contains('timeline-item')) {
                    element.style.animation = 'slideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    const elementsToObserve = document.querySelectorAll('.hero-title, .section-title, .timeline-item');
    elementsToObserve.forEach(element => {
        observer.observe(element);
    });
}

// Button Animations
function initButtonAnimations() {
    const buttons = document.querySelectorAll('.btn');
    
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
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Add hover sound effect (visual feedback)
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add ripple keyframes to document
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Trigger Initial Animations
function triggerInitialAnimations() {
    // Animate hero elements
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    
    if (heroTitle) {
        setTimeout(() => {
            heroTitle.style.animation = 'fadeInDown 1s cubic-bezier(0.16, 1, 0.3, 1)';
        }, 200);
    }
    
    if (heroSubtitle) {
        setTimeout(() => {
            heroSubtitle.style.animation = 'fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1)';
        }, 400);
    }
    
    if (heroButtons) {
        setTimeout(() => {
            heroButtons.style.animation = 'fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1)';
        }, 600);
    }
    
    // Start floating emoji animations
    const floatingEmojis = document.querySelectorAll('.floating-emoji');
    floatingEmojis.forEach((emoji, index) => {
        setTimeout(() => {
            emoji.style.opacity = '0.7';
            emoji.style.animation = `float ${4 + index}s ease-in-out infinite`;
        }, 800 + index * 200);
    });
}

// Trigger Page-Specific Animations
function triggerPageAnimations(pageName) {
    const page = document.getElementById(pageName);
    if (!page) return;
    
    // Reset and trigger animations for the current page
    const animatedElements = page.querySelectorAll('.stat-card, .activity-card, .story-card, .mission-card, .value-card, .gallery-item, .benefit-item');
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            element.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        }, index * 100);
    });
    
    // Page-specific animations
    switch(pageName) {
        case 'work':
            animateGalleryItems();
            break;
        case 'motive':
            animateTimelineItems();
            animateValueCards();
            break;
        case 'donate':
        case 'volunteer':
            animateComingSoon();
            break;
    }
}

// Animate Gallery Items
function animateGalleryItems() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.transform = 'scale(1)';
            item.style.opacity = '1';
            item.style.animation = 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        }, index * 150);
    });
}

// Animate Timeline Items
function animateTimelineItems() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
            item.style.animation = 'slideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        }, index * 200);
    });
}

// Animate Value Cards
function animateValueCards() {
    const valueCards = document.querySelectorAll('.value-card');
    
    valueCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) rotate(0deg)';
            card.style.animation = 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        }, index * 100);
    });
}

// Animate Coming Soon
function animateComingSoon() {
    const comingSoonContent = document.querySelector('.coming-soon-content');
    
    if (comingSoonContent) {
        comingSoonContent.style.opacity = '0';
        comingSoonContent.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            comingSoonContent.style.opacity = '1';
            comingSoonContent.style.transform = 'scale(1)';
            comingSoonContent.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        }, 200);
    }
}

// Handle footer links
document.addEventListener('click', function(e) {
    const target = e.target;
    
    // Handle footer page navigation
    if (target.matches('.footer-links a[href^="#"]')) {
        e.preventDefault();
        const href = target.getAttribute('href');
        const pageName = href.substring(1);
        if (document.getElementById(pageName)) {
            window.showPage(pageName);
        }
    }
    
    // Handle newsletter signup
    if (target.textContent === 'Notify Me') {
        const emailInput = target.parentNode.querySelector('input[type="email"]');
        if (emailInput && emailInput.value) {
            // Placeholder for newsletter signup
            target.textContent = 'Thank You! 🎉';
            target.disabled = true;
            target.style.background = '#28a745';
            
            setTimeout(() => {
                target.textContent = 'Notify Me';
                target.disabled = false;
                target.style.background = '';
                emailInput.value = '';
            }, 3000);
        } else {
            // Shake animation for empty email
            emailInput.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                emailInput.style.animation = '';
            }, 500);
        }
    }
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle Window Resize
window.addEventListener('resize', debounce(() => {
    // Close mobile menu on resize
    if (window.innerWidth > 768) {
        const nav = document.querySelector('.nav');
        if (nav) {
            nav.style.display = '';
            nav.style.position = '';
            nav.style.top = '';
            nav.style.left = '';
            nav.style.right = '';
            nav.style.background = '';
            nav.style.boxShadow = '';
            nav.style.borderRadius = '';
            nav.style.padding = '';
        }
        
        closeMobileMenu();
    }
}, 250));

// Add shake animation
if (!document.querySelector('#shake-styles')) {
    const style = document.createElement('style');
    style.id = 'shake-styles';
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
}

// Preload next page content (performance optimization)
function preloadPageContent(pageName) {
    const page = document.getElementById(pageName);
    if (page && !page.classList.contains('preloaded')) {
        // Mark as preloaded
        page.classList.add('preloaded');
        
        // Trigger any lazy loading for images (if implemented later)
        const lazyImages = page.querySelectorAll('[data-src]');
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
        });
    }
}

// Easter Egg: Konami Code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up, Up, Down, Down, Left, Right, Left, Right, B, A

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    konamiCode = konamiCode.slice(-10); // Keep only last 10 keypresses
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Easter egg activated!
        document.body.style.animation = 'rainbow 2s infinite';
        
        // Add rainbow animation
        if (!document.querySelector('#rainbow-styles')) {
            const style = document.createElement('style');
            style.id = 'rainbow-styles';
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 4000);
        
        konamiCode = [];
    }
});