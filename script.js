// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send this data to a server
        console.log('Form submitted:', data);
        
        // Show success message
        alert('Thank you for your message! I will get back to you soon.');
        
        // Clear form
        this.reset();
    });
}

// Add active class to nav links on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Mobile navigation toggle (if needed in the future)
function toggleMobileNav() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('show');
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Loading Animation
    const loader = document.querySelector('.loading-animation');
    setTimeout(() => {
        loader.classList.add('hide');
    }, 1000);

    // Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');

    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
        cursorDot.style.transform = `translate(${e.clientX - 2}px, ${e.clientY - 2}px)`;
    });

    document.addEventListener('mousedown', () => cursor.style.transform += ' scale(0.8)');
    document.addEventListener('mouseup', () => cursor.style.transform = cursor.style.transform.replace(' scale(0.8)', ''));

    // Scroll Progress
    const scrollProgress = document.querySelector('.scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY) / (document.documentElement.scrollHeight - window.innerHeight);
        scrollProgress.style.transform = `scaleX(${scrollPercent})`;
    });

    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const htmlElement = document.documentElement;
    const moonIcon = '<i class="fas fa-moon"></i>';
    const sunIcon = '<i class="fas fa-sun"></i>';

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    themeToggle.innerHTML = savedTheme === 'dark' ? sunIcon : moonIcon;

    // Theme toggle handler
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        themeToggle.innerHTML = newTheme === 'dark' ? sunIcon : moonIcon;
        localStorage.setItem('theme', newTheme);
    });

    // 3D Card Effect
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.querySelector('.project-card-inner').style.transform = 
                `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.querySelector('.project-card-inner').style.transform = 
                'rotateX(0) rotateY(0)';
        });
    });

    // Contact Form Handling with Google Sheets
    function initContactForm() {
        const form = document.getElementById('contact-form');
        const submitBtn = document.getElementById('submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnSpinner = submitBtn.querySelector('.btn-spinner');
        const messageInput = document.getElementById('message');

        // Replace this URL with your Google Apps Script Web App URL
        const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

        if (!form) return;

        // Form validation patterns
        const patterns = {
            name: /^[a-zA-Z\s]{2,50}$/,
            email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: /^[\s\S]{10,500}$/
        };

        // Validation messages
        const messages = {
            name: 'Name should be 2-50 characters long and contain only letters',
            email: 'Please enter a valid email address',
            message: 'Message should be between 10 and 500 characters'
        };

        // Real-time validation
        form.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', () => validateField(field));
            field.addEventListener('blur', () => validateField(field));
        });

        function validateField(field) {
            const pattern = patterns[field.name];
            const errorDisplay = field.parentElement.querySelector('.validation-message');
            
            if (!pattern) return true;

            const isValid = pattern.test(field.value);
            field.classList.toggle('error', !isValid);
            
            if (errorDisplay) {
                errorDisplay.textContent = isValid ? '' : messages[field.name];
                errorDisplay.style.display = isValid ? 'none' : 'block';
            }
            
            return isValid;
        }

        function validateForm() {
            let isValid = true;
            form.querySelectorAll('input, textarea').forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });
            return isValid;
        }

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            if (!validateForm()) {
                Toastify({
                    text: "❌ Please fix the errors before submitting",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    style: {
                        background: "linear-gradient(to right, #ff5f6d, #ffc371)",
                    }
                }).showToast();
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnSpinner.style.display = 'inline-block';

            try {
                const formData = new FormData(form);
                const data = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    message: formData.get('message'),
                    timestamp: new Date().toISOString()
                };

                const response = await fetch(GOOGLE_SHEETS_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.status === 'success') {
                    // Show success message
                    Toastify({
                        text: "✅ Message Sent Successfully!",
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        style: {
                            background: "linear-gradient(to right, #00b09b, #96c93d)",
                        }
                    }).showToast();

                    // Reset form
                    form.reset();
                    // Remove any existing error messages
                    form.querySelectorAll('.validation-message').forEach(msg => {
                        msg.textContent = '';
                        msg.style.display = 'none';
                    });
                    form.querySelectorAll('input, textarea').forEach(field => {
                        field.classList.remove('error');
                    });
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                console.error('Submission Error:', error);
                // Show error message
                Toastify({
                    text: "❌ Failed to submit. Please try again.",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    style: {
                        background: "linear-gradient(to right, #ff5f6d, #ffc371)",
                    }
                }).showToast();
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                btnText.style.display = 'inline-block';
                btnSpinner.style.display = 'none';
            }
        });
    }

    // Initialize contact form
    initContactForm();

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };

    // Observe skill progress bars
    const skillBars = document.querySelectorAll('.skill-progress-bar');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.getAttribute('data-progress') + '%';
                skillObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    skillBars.forEach(bar => {
        bar.style.width = '0';
        skillObserver.observe(bar);
    });

    // Mobile Navigation
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Close mobile menu when clicking on a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Active section highlighting
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    function setActiveNavItem() {
        const scrollPosition = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    // Update active section on scroll
    window.addEventListener('scroll', setActiveNavItem);

    // Touch event handling for mobile devices
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Disable hover effects on touch devices
        const hoverElements = document.querySelectorAll('.project-card, .skill-item, .experience-item');
        hoverElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-hover');
            });
            
            element.addEventListener('touchend', function() {
                this.classList.remove('touch-hover');
            });
        });
    }

    // Optimize animations for mobile
    const animatedElements = document.querySelectorAll('[data-aos]');
    let isMobile = window.innerWidth <= 768;

    function updateAnimations() {
        isMobile = window.innerWidth <= 768;
        animatedElements.forEach(element => {
            if (isMobile) {
                element.setAttribute('data-aos-duration', '600');
                element.setAttribute('data-aos-offset', '0');
            } else {
                element.setAttribute('data-aos-duration', '800');
                element.setAttribute('data-aos-offset', '100');
            }
        });
    }

    // Update animations on resize
    window.addEventListener('resize', updateAnimations);
    updateAnimations();

    // Initialize AOS with mobile-optimized settings
    AOS.init({
        duration: isMobile ? 600 : 800,
        once: true,
        offset: isMobile ? 0 : 100,
        disable: window.innerWidth < 768 ? 'phone' : false
    });

    // Optimize particle effect for mobile
    if (typeof particlesJS !== 'undefined') {
        const particleConfig = {
            particles: {
                number: {
                    value: window.innerWidth < 768 ? 40 : 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: ["#00F0FF", "#9B5DE5", "#FF6B6B"]
                },
                shape: {
                    type: "circle"
                },
                opacity: {
                    value: 0.6,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#00F0FF",
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: {
                        enable: true,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: true,
                        mode: "grab"
                    },
                    onclick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 0.5
                        }
                    },
                    push: {
                        particles_nb: 3
                    }
                }
            },
            retina_detect: true
        };
        particlesJS('particles-js', particleConfig);
    }

    // Handle orientation change
    window.addEventListener('orientationchange', () => {
        // Reset mobile menu
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
        
        // Update animations and layouts
        setTimeout(() => {
            updateAnimations();
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }, 300);
    });

    // Update location
    const setLocation = () => {
        const locationElement = document.getElementById('location');
        locationElement.textContent = 'Based in New Delhi, India';
    };

    // Initial updates
    setLocation();
}); 