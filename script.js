// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollTop = 0;
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
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

    // Enhanced Form Handling
    function initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const inputs = form.querySelectorAll('input, textarea');
        const submitBtn = form.querySelector('.submit-btn');

        // Input validation patterns
        const patterns = {
            name: /^[a-zA-Z\s]{2,30}$/,
            email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
            message: /^[\s\S]{10,500}$/
        };

        // Validation messages
        const messages = {
            name: {
                invalid: 'Please enter a valid name (2-30 characters)',
                valid: 'Looks good!'
            },
            email: {
                invalid: 'Please enter a valid email address',
                valid: 'Looks good!'
            },
            message: {
                invalid: 'Message must be between 10 and 500 characters',
                valid: 'Looks good!'
            }
        };

        // Real-time validation
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                validateInput(input);
            });

            input.addEventListener('blur', () => {
                validateInput(input);
            });
        });

        function validateInput(input) {
            const pattern = patterns[input.name];
            const messageElement = input.parentElement.querySelector('.validation-message');
            
            if (!pattern) return;

            if (pattern.test(input.value)) {
                input.classList.remove('invalid');
                input.classList.add('valid');
                if (messageElement) {
                    messageElement.textContent = messages[input.name].valid;
                    messageElement.classList.remove('error');
                    messageElement.classList.add('success');
                }
                return true;
            } else {
                input.classList.remove('valid');
                input.classList.add('invalid');
                if (messageElement) {
                    messageElement.textContent = messages[input.name].invalid;
                    messageElement.classList.remove('success');
                    messageElement.classList.add('error');
                }
                return false;
            }
        }

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate all inputs
            let isValid = true;
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                showMessage('Please fix the errors before submitting.', 'error');
                return;
            }

            // Update button state
            submitBtn.disabled = true;
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            try {
                // Collect form data
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Show success message
                showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
                form.reset();

                // Reset input states
                inputs.forEach(input => {
                    input.classList.remove('valid', 'invalid');
                    const messageElement = input.parentElement.querySelector('.validation-message');
                    if (messageElement) {
                        messageElement.textContent = '';
                    }
                });

            } catch (error) {
                showMessage('Something went wrong. Please try again.', 'error');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });

        function showMessage(message, type) {
            const messageContainer = document.createElement('div');
            messageContainer.className = `form-message ${type}`;
            messageContainer.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                ${message}
            `;

            // Remove any existing messages
            const existingMessage = form.querySelector('.form-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            form.appendChild(messageContainer);

            // Auto-remove message after 5 seconds
            setTimeout(() => {
                messageContainer.style.opacity = '0';
                setTimeout(() => messageContainer.remove(), 300);
            }, 5000);
        }
    }

    // Initialize contact form when DOM is loaded
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
    const mobileNavToggle = document.createElement('button');
    mobileNavToggle.className = 'mobile-nav-toggle';
    mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('.navbar').appendChild(mobileNavToggle);

    mobileNavToggle.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.toggle('show');
        mobileNavToggle.innerHTML = navLinks.classList.contains('show') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Update location
    const setLocation = () => {
        const locationElement = document.getElementById('location');
        locationElement.textContent = 'Based in New Delhi, India';
    };

    // Initial updates
    setLocation();

    // Initialize particles
    function initParticles() {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
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
        });
    }

    // Theme toggle functionality
    function initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const html = document.documentElement;
                const currentTheme = html.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                html.setAttribute('data-theme', newTheme);
            });
        }
    }

    // Mouse tracking for interactive backgrounds
    function initMouseTracking() {
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            section.addEventListener('mousemove', (e) => {
                const rect = section.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                
                section.style.setProperty('--mouse-x', `${x}%`);
                section.style.setProperty('--mouse-y', `${y}%`);
            });
        });
    }

    initMouseTracking();
    
    // Update particles configuration for better background effect
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 50,
                density: {
                    enable: true,
                    value_area: 1000
                }
            },
            color: {
                value: ["#00F0FF", "#9B5DE5", "#FF6B6B"]
            },
            shape: {
                type: "circle"
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 2,
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
                speed: 1,
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
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Active Navigation Link
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
            }
        });
    });
}); 