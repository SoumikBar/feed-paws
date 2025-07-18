// Feed Paws Initiative - Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });
    });

    // Fix hero buttons to properly scroll to sections
    const heroJoinBtn = document.querySelector('.hero-btn[href="#join"]');
    const heroDonateBtn = document.querySelector('.hero-btn[href="#donate"]');
    
    if (heroJoinBtn) {
        heroJoinBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const joinSection = document.querySelector('#join');
            if (joinSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = joinSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    if (heroDonateBtn) {
        heroDonateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const donateSection = document.querySelector('#donate');
            if (donateSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = donateSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Handle external links properly
    const externalLinks = document.querySelectorAll('a[href^="http"], a[href^="mailto:"]');
    externalLinks.forEach(link => {
        if (!link.hasAttribute('target')) {
            link.setAttribute('target', '_blank');
        }
        
        link.addEventListener('click', function(e) {
            // Don't prevent default for external links, let them open normally
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening...';
            
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 1000);
        });
    });

    // Animated Counter for Impact Section
    function animateCounter(element, target, duration = 2000) {
        const startValue = 0;
        const increment = target / (duration / 16);
        let currentValue = startValue;
        
        const updateCounter = () => {
            currentValue += increment;
            if (currentValue >= target) {
                element.textContent = target;
                return;
            }
            element.textContent = Math.floor(currentValue);
            requestAnimationFrame(updateCounter);
        };
        
        updateCounter();
    }

    // Intersection Observer for Counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    }, {
        threshold: 0.5
    });

    // Observe all counter elements
    const counters = document.querySelectorAll('.impact-number');
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // Scroll Animation for Fade-in Elements
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Add fade-in class to sections and observe them
    const sectionsToAnimate = document.querySelectorAll('.about, .impact, .gallery, .join-us, .donation, .contact');
    sectionsToAnimate.forEach(section => {
        section.classList.add('fade-in');
        fadeInObserver.observe(section);
    });

    // Copy UPI ID Functionality
    window.copyUPI = function() {
        const upiId = 'soushthab@ptyes';
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.innerHTML;
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(upiId).then(() => {
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyBtn.style.background = '#96CEB4';
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    copyBtn.style.background = '';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                fallbackCopy(upiId, copyBtn, originalText);
            });
        } else {
            fallbackCopy(upiId, copyBtn, originalText);
        }
    };

    // Fallback copy function for older browsers
    function fallbackCopy(text, button, originalText) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                button.innerHTML = '<i class="fas fa-check"></i> Copied!';
                button.style.background = '#96CEB4';
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.background = '';
                }, 2000);
            } else {
                throw new Error('Copy command failed');
            }
        } catch (err) {
            console.error('Fallback copy failed: ', err);
            button.innerHTML = '<i class="fas fa-exclamation"></i> Copy manually';
            
            setTimeout(() => {
                button.innerHTML = originalText;
            }, 2000);
        }
        
        document.body.removeChild(textArea);
    }

    // Donation Amount Selection
    window.showDonationMessage = function(amount) {
        const button = event.target;
        const originalText = button.textContent;
        
        // Create and show donation message
        const message = document.createElement('div');
        message.className = 'donation-message';
        message.innerHTML = `
            <div class="donation-popup">
                <i class="fas fa-heart"></i>
                <h3>Thank You!</h3>
                <p>Your donation of ₹${amount} will help us feed more animals!</p>
                <p>Please use the UPI ID: <strong>soushthab@ptyes</strong></p>
                <button onclick="closeDonationMessage()" class="btn btn--primary">Got it!</button>
            </div>
        `;
        
        message.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease-out;
        `;
        
        const popup = message.querySelector('.donation-popup');
        popup.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            text-align: center;
            max-width: 400px;
            margin: 1rem;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            animation: bounceIn 0.5s ease-out;
        `;
        
        const icon = popup.querySelector('i');
        icon.style.cssText = `
            font-size: 3em;
            color: #FF6B6B;
            margin-bottom: 1rem;
        `;
        
        const title = popup.querySelector('h3');
        title.style.cssText = `
            color: #FF6B6B;
            margin-bottom: 1rem;
            font-size: 1.5em;
        `;
        
        const paragraphs = popup.querySelectorAll('p');
        paragraphs.forEach(p => {
            p.style.cssText = `
                margin-bottom: 1rem;
                line-height: 1.6;
            `;
        });
        
        const closeBtn = popup.querySelector('button');
        closeBtn.style.cssText = `
            background: #FF6B6B;
            color: white;
            border: none;
            padding: 0.8rem 1.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        `;
        
        closeBtn.addEventListener('mouseover', () => {
            closeBtn.style.background = '#FF5252';
            closeBtn.style.transform = 'translateY(-2px)';
        });
        
        closeBtn.addEventListener('mouseout', () => {
            closeBtn.style.background = '#FF6B6B';
            closeBtn.style.transform = 'translateY(0)';
        });
        
        document.body.appendChild(message);
        
        // Animate button
        button.style.background = '#96CEB4';
        button.textContent = '✓ Selected';
        
        setTimeout(() => {
            button.style.background = '';
            button.textContent = originalText;
        }, 3000);
    };

    // Close donation message
    window.closeDonationMessage = function() {
        const message = document.querySelector('.donation-message');
        if (message) {
            message.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                message.remove();
            }, 300);
        }
    };

    // Gallery images error handling and fallback
    const galleryImages = document.querySelectorAll('.gallery-item img');
    galleryImages.forEach((img, index) => {
        img.addEventListener('error', function() {
            console.warn('Image failed to load:', this.src);
            // Create a colorful placeholder
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                width: 100%;
                height: 250px;
                background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.2em;
                border-radius: 0.5rem;
                text-align: center;
                padding: 1rem;
            `;
            
            const titles = [
                'Feeding Street Dogs',
                'Community Outreach',
                'Volunteer Drive',
                'Animal Care',
                'Feeding Program',
                'Compassionate Care'
            ];
            
            placeholder.innerHTML = `
                <i class="fas fa-heart" style="font-size: 2em; margin-bottom: 0.5rem;"></i>
                <h4>${titles[index] || 'Feed Paws Initiative'}</h4>
                <p>Making a difference</p>
            `;
            
            this.parentNode.replaceChild(placeholder, this);
        });
        
        // Force load the image
        img.onerror = img.onerror;
        if (img.complete && img.naturalWidth === 0) {
            img.onerror();
        }
    });

    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    const heroBackground = document.querySelector('.hero-background');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        if (heroBackground && scrolled < hero.offsetHeight) {
            heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    });

    // Add hover effects to gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click effect to buttons
    const buttons = document.querySelectorAll('.btn, .amount-btn, .copy-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
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
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                pointer-events: none;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Loading animation
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

    // Scroll to top functionality
    const scrollToTop = document.createElement('button');
    scrollToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTop.className = 'scroll-to-top';
    scrollToTop.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: #FF6B6B;
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        z-index: 1000;
        transform: translateY(100px);
        opacity: 0;
    `;
    
    scrollToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    scrollToTop.addEventListener('mouseover', function() {
        this.style.transform = this.style.transform.replace('translateY(100px)', '') + ' scale(1.1)';
        this.style.background = '#FF5252';
    });
    
    scrollToTop.addEventListener('mouseout', function() {
        this.style.transform = this.style.transform.replace(' scale(1.1)', '');
        this.style.background = '#FF6B6B';
    });
    
    document.body.appendChild(scrollToTop);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            scrollToTop.style.transform = 'translateY(0)';
            scrollToTop.style.opacity = '1';
        } else {
            scrollToTop.style.transform = 'translateY(100px)';
            scrollToTop.style.opacity = '0';
        }
    });

    // Add dynamic CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
        
        .nav-menu.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            padding: 1rem;
            border-radius: 0 0 1rem 1rem;
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        
        .header {
            transition: transform 0.3s ease;
        }
        
        @media (max-width: 768px) {
            .nav-menu {
                display: none;
            }
        }
    `;
    
    document.head.appendChild(style);

    // Enhanced mobile experience
    if (window.innerWidth <= 768) {
        // Add touch-friendly interactions
        const touchElements = document.querySelectorAll('.impact-card, .gallery-item, .social-link');
        touchElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            element.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        });
    }

    console.log('🐾 Feed Paws Initiative website loaded successfully! 💖');
    
    // Ensure all images try to load
    setTimeout(() => {
        const allImages = document.querySelectorAll('img');
        allImages.forEach(img => {
            if (!img.complete) {
                img.src = img.src; // Force reload
            }
        });
    }, 1000);
});