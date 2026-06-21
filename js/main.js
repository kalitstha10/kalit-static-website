/* -------------------------------------------------------------
   Kalit Prasad Lacoul - Culinary Portfolio JavaScript Logic
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    // === 1. Sticky Navbar & Active Link Highlight on Scroll ===
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Sticky transition
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link indicator
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });


    // === 2. Mobile Hamburger Menu Toggle ===
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinksArray = Array.from(navLinks);

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinksArray.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    }


    // === 3. Skills Tag Fade-in Animation (Intersection Observer) ===
    const skillsSection = document.querySelector('.skills-section');
    const skillTags = document.querySelectorAll('.skill-tag');

    const animateSkills = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillTags.forEach((tag, index) => {
                    setTimeout(() => {
                        tag.classList.add('animate');
                    }, index * 50); // Staggered delay of 50ms per tag
                });
                observer.unobserve(entry.target);
            }
        });
    };

    const skillsObserver = new IntersectionObserver(animateSkills, {
        threshold: 0.15
    });

    if (skillsSection && skillTags.length > 0) {
        skillsObserver.observe(skillsSection);
    }


    // === 4. Portfolio Filter System ===
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.classList.remove('hide');
                    // Add subtle scaling entrance animation
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });


    // === 5. CV Iframe Modal (View CV Modal) ===
    const viewCvBtns = document.querySelectorAll('.view-cv-btn');
    const cvModal = document.getElementById('cvModal');
    const closeCvModalBtn = document.getElementById('closeCvModal');

    if (cvModal && closeCvModalBtn) {
        viewCvBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                cvModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Lock background scroll
            });
        });

        const closeModal = () => {
            cvModal.classList.remove('active');
            document.body.style.overflow = ''; // Unlock scroll
        };

        closeCvModalBtn.addEventListener('click', closeModal);

        // Close on clicking modal background overlay
        cvModal.addEventListener('click', (e) => {
            if (e.target === cvModal) {
                closeModal();
            }
        });

        // Close on Esc key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && cvModal.classList.contains('active')) {
                closeModal();
            }
        });
    }


    // === 6. Portfolio Image Lightbox Modal ===
    const lightbox = document.getElementById('lightboxModal');
    const lightboxImg = document.querySelector('.lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');

    if (lightbox && lightboxImg && lightboxClose) {
        lightboxTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const card = trigger.closest('.portfolio-card');
                const imgSrc = card.querySelector('img').src;
                const title = card.querySelector('h4').textContent;
                
                lightboxImg.src = imgSrc;
                lightboxCaption.textContent = title;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        lightboxClose.addEventListener('click', closeLightbox);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }


    // === 7. Contact Form Handling & Success Toast ===
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toastMessage');

    if (contactForm && toast) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Perform simple field checks
            const name = document.getElementById('formName').value.trim();
            const email = document.getElementById('formEmail').value.trim();
            const subject = document.getElementById('formSubject').value.trim();
            const message = document.getElementById('formMessage').value.trim();

            if (!name || !email || !subject || !message) {
                alert('Please fill out all the fields.');
                return;
            }

            // Perform FormSubmit AJAX POST
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

            fetch("https://formsubmit.co/ajax/kalitstha10@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    subject: subject,
                    message: message
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .then(data => {
                // Reset form
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;

                // Show success toast
                toast.classList.add('show');

                // Hide success toast after 4 seconds
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 4000);
            })
            .catch(error => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                alert('There was a problem sending your message. Please try again later or contact me directly via WhatsApp/Phone.');
                console.error('Error submitting contact form:', error);
            });
        });
    }
});
