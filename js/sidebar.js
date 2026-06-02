// QuasiBanking Premium Sidebar & Pages Controller
import { EMAIL_CONFIG, loadEmailJS } from './emailjs-loader.js';

const CONFIG = {
    APPX_URL: "YOUR_APPX_BATCH_LINK_HERE",
    UNREAD_NOTIFICATIONS: 0 // Starts at zero
};

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileToggle();
    initActiveNav();
    initMocksRedirect();
    initNotificationBadge();
    initSidebarStats();
    initFAQsAccordion();
    initCountdownTimer();
    initSupportForm();
    initTeaserForm();
});

// 1. Theme Toggle Logic
function initTheme() {
    const themeToggleBtn = document.getElementById('sidebar-theme-toggle');
    if (!themeToggleBtn) return;

    // Load saved theme or default to body's data-theme attribute
    const savedTheme = localStorage.getItem('quasibanking_theme') || document.body.getAttribute('data-theme') || 'dark';
    setTheme(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
}

function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('quasibanking_theme', theme);

    const themeToggleBtn = document.getElementById('sidebar-theme-toggle');
    if (themeToggleBtn) {
        if (theme === 'light') {
            themeToggleBtn.innerHTML = `<i class="fas fa-sun"></i><span>Light Mode</span>`;
        } else {
            themeToggleBtn.innerHTML = `<i class="fas fa-moon"></i><span>Dark Mode</span>`;
        }
    }
}

// Apply theme instantly before DOM is ready to prevent flash
(function() {
    const savedTheme = localStorage.getItem('quasibanking_theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
    }
})();

// 2. Mobile Drawer Logic
function initMobileToggle() {
    const mobileToggle = document.getElementById('mobile-sidebar-toggle');
    const sidebar = document.getElementById('dashboard-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (!mobileToggle || !sidebar || !overlay) return;

    const toggleMenu = (open) => {
        sidebar.classList.toggle('open', open);
        overlay.classList.toggle('active', open);
    };

    mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = sidebar.classList.contains('open');
        toggleMenu(!isOpen);
    });

    overlay.addEventListener('click', () => toggleMenu(false));

    // Close mobile drawer when clicking a link inside it
    const sidebarLinks = sidebar.querySelectorAll('.nav-card');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });
}

// 3. Active Nav State Syncing
function initActiveNav() {
    const navCards = {
        dashboard: document.getElementById('nav-dashboard'),
        courses: document.getElementById('nav-courses'),
        mocks: document.getElementById('nav-mocks'),
        affairs: document.getElementById('nav-affairs'),
        resources: document.getElementById('nav-resources'),
        notifications: document.getElementById('nav-notifications'),
        interview: document.getElementById('nav-interview'),
        contact: document.getElementById('nav-contact')
    };

    const updateActiveState = () => {
        const path = window.location.pathname;
        const hash = window.location.hash;

        // Reset all classes
        Object.values(navCards).forEach(card => {
            if (card) card.classList.remove('active');
        });

        if (path.includes('course-ibps.html') || path.includes('course-rbi.html') || path.includes('course-sbi.html')) {
            if (navCards.courses) navCards.courses.classList.add('active');
        } else if (path.includes('current-affairs.html')) {
            if (navCards.affairs) navCards.affairs.classList.add('active');
        } else if (path.includes('resources.html')) {
            if (navCards.resources) navCards.resources.classList.add('active');
        } else if (path.includes('notifications.html')) {
            if (navCards.notifications) navCards.notifications.classList.add('active');
        } else if (path.includes('contact.html')) {
            if (navCards.contact) navCards.contact.classList.add('active');
        } else if (path.includes('interview.html')) {
            if (navCards.interview) navCards.interview.classList.add('active');
        } else if (path.includes('auth.html')) {
            // Keep all inactive
        } else {
            // Index.html navigation hashes
            if (hash.includes('courses')) {
                if (navCards.courses) navCards.courses.classList.add('active');
            } else if (hash.includes('mock-tests')) {
                if (navCards.mocks) navCards.mocks.classList.add('active');
            } else if (hash.includes('user-stats')) {
                if (navCards.dashboard) navCards.dashboard.classList.add('active');
            } else if (hash.includes('notifications')) {
                if (navCards.notifications) navCards.notifications.classList.add('active');
            } else {
                // If it is index.html and no matching path, set Dashboard active
                if (navCards.dashboard) navCards.dashboard.classList.add('active');
            }
        }
    };

    updateActiveState();
    window.addEventListener('hashchange', updateActiveState);
}

// 4. Centralized redirection for mock tests
function initMocksRedirect() {
    const navMocks = document.getElementById('nav-mocks');
    const qaMock = document.getElementById('qa-mock');

    const handleRedirect = (e) => {
        e.preventDefault();
        window.open(CONFIG.APPX_URL, '_blank');
    };

    if (navMocks) {
        navMocks.addEventListener('click', handleRedirect);
    }
    if (qaMock) {
        qaMock.addEventListener('click', handleRedirect);
    }
}

// 5. Unread notification badge visibility
function initNotificationBadge() {
    const badge = document.getElementById('sidebar-notif-badge');
    if (!badge) return;

    if (CONFIG.UNREAD_NOTIFICATIONS > 0) {
        badge.textContent = CONFIG.UNREAD_NOTIFICATIONS;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

// 6. Sync profile statistics & animate progress bar
function initSidebarStats() {
    // 1. Enrolled Courses count: from 'quasibanking_enrolled_courses' localstorage key
    let enrolledCourses = [];
    try {
        enrolledCourses = JSON.parse(localStorage.getItem('quasibanking_enrolled_courses') || '[]');
    } catch (e) {
        enrolledCourses = [];
    }
    const enrolledCount = enrolledCourses.length;

    // 2. Mocks count: fallback to "0" if not set in local storage
    const mocksCompleted = localStorage.getItem('quasibanking_mocks_completed') || '0';

    // 3. Accuracy: fallback to "0%" if not set
    const accuracyVal = localStorage.getItem('quasibanking_accuracy') || '0%';

    // 4. Streak: fallback to "0 Days" if not set
    const streakDays = localStorage.getItem('quasibanking_streak') || '0 Days';

    // Calculate progress percent: if 3 courses total, 1 course enrolled = 33%, 2 = 66%, 3 = 100%
    const progressPercent = Math.min(100, enrolledCount > 0 ? Math.round((enrolledCount / 3) * 100) : 0);

    // Update DOM elements:
    const progressFill = document.getElementById('sidebar-progress-fill');
    const progressText = document.getElementById('sidebar-progress-percent');
    const statCourses = document.getElementById('sidebar-stat-courses');
    const statMocks = document.getElementById('sidebar-stat-mocks');
    const statAccuracy = document.getElementById('sidebar-stat-accuracy');
    const statStreak = document.getElementById('sidebar-stat-streak');

    if (statCourses) statCourses.textContent = enrolledCount;
    if (statMocks) statMocks.textContent = mocksCompleted;
    if (statAccuracy) {
        statAccuracy.textContent = accuracyVal.endsWith('%') ? accuracyVal : `${accuracyVal}%`;
    }
    if (statStreak) {
        statStreak.textContent = streakDays.includes('Day') ? streakDays : `${streakDays} Days`;
    }

    // Animate progress bar fill
    if (progressFill && progressText) {
        progressFill.style.width = '0%';
        progressText.textContent = '0%';

        setTimeout(() => {
            progressFill.style.width = `${progressPercent}%`;
            
            // Ticker effect for percent label
            let current = 0;
            const interval = setInterval(() => {
                if (current >= progressPercent) {
                    progressText.textContent = `${progressPercent}%`;
                    clearInterval(interval);
                } else {
                    current++;
                    progressText.textContent = `${current}%`;
                }
            }, 8);
        }, 100);
    }
}
window.initSidebarStats = initSidebarStats;

// 7. Interactive FAQs Accordion in contact.html
function initFAQsAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.closest('.faq-item');
            const answer = item.querySelector('.faq-answer');
            const isActive = item.classList.contains('active');

            // Close all other active accordion items
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) otherAnswer.style.maxHeight = null;
                }
            });

            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = null;
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

// 8. Ticking Launch Countdown Timer in interview.html
function initCountdownTimer() {
    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    // Target date: July 15, 2026 00:00:00
    const targetDate = new Date('July 15, 2026 00:00:00').getTime();

    const updateTimer = () => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            clearInterval(timerInterval);
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
}

// 9. Contact form validator and real EmailJS submission
function initSupportForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    // Trigger EmailJS dynamic script loading in the background
    loadEmailJS();

    const successToast = document.getElementById('contact-success');
    const errorToast = document.getElementById('contact-error');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const submitBtnText = submitBtn ? submitBtn.querySelector('span') : null;

    const inputs = [
        { el: document.getElementById('contact-name'), validate: val => val.length >= 2, errorMsg: "Name must be at least 2 characters." },
        { el: document.getElementById('contact-email'), validate: val => validateEmail(val), errorMsg: "Please enter a valid email address." },
        { el: document.getElementById('contact-phone'), validate: val => /^\d{10,}$/.test(val.replace(/\D/g, '')), errorMsg: "Phone number must be at least 10 digits." },
        { el: document.getElementById('contact-category'), validate: val => val !== "" && val !== null, errorMsg: "Please select a query category." },
        { el: document.getElementById('contact-subject'), validate: val => val.length > 0, errorMsg: "Subject is required." },
        { el: document.getElementById('contact-message'), validate: val => val.length >= 10, errorMsg: "Message must be at least 10 characters." }
    ];

    // Clear validation errors on user typing
    inputs.forEach(input => {
        if (!input.el) return;
        const inlineErr = input.el.parentElement.querySelector('.inline-error');
        const clearError = () => {
            input.el.classList.remove('error-input');
            if (inlineErr) inlineErr.classList.add('hidden');
        };
        input.el.addEventListener('input', clearError);
        input.el.addEventListener('change', clearError);
    });

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (successToast) successToast.classList.add('hidden');
        if (errorToast) errorToast.classList.add('hidden');

        let isValid = true;
        inputs.forEach(input => {
            if (!input.el) return;
            const value = input.el.value.trim();
            const inlineErr = input.el.parentElement.querySelector('.inline-error');
            
            if (!input.validate(value)) {
                isValid = false;
                input.el.classList.add('error-input');
                if (inlineErr) {
                    inlineErr.textContent = input.errorMsg;
                    inlineErr.classList.remove('hidden');
                }
            } else {
                input.el.classList.remove('error-input');
                if (inlineErr) {
                    inlineErr.classList.add('hidden');
                }
            }
        });

        if (!isValid) {
            if (errorToast) {
                errorToast.innerHTML = `<i class="fas fa-exclamation-circle"></i> Please fill in all required fields correctly.`;
                errorToast.classList.remove('hidden');
            }
            return;
        }

        // Get submission params
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const phone = document.getElementById('contact-phone').value.trim();
        const category = document.getElementById('contact-category').value;
        const subject = document.getElementById('contact-subject').value.trim();
        const message = document.getElementById('contact-message').value.trim();
        
        const inquirySource = window.location.pathname.includes('contact.html') ? "Contact Page" : "Homepage Contact Form";
        const timestamp = new Date().toLocaleString();
        
        const templateParams = {
            name: name,
            email: email,
            phone: phone,
            category: category,
            subject: subject,
            message: message,
            inquiry_source: inquirySource,
            page_url: window.location.href,
            timestamp: timestamp
        };

        // Disable button & show sending state with spinner
        if (submitBtn) {
            submitBtn.disabled = true;
            if (submitBtnText) submitBtnText.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';
        }

        const handleFailure = (err) => {
            let failedList = [];
            try {
                failedList = JSON.parse(localStorage.getItem('quasibanking_failed_inquiries') || '[]');
            } catch(e) {}
            failedList.push({
                name: name,
                email: email,
                phone: phone,
                category: category,
                subject: subject,
                timestamp: timestamp
            });
            localStorage.setItem('quasibanking_failed_inquiries', JSON.stringify(failedList));

            if (errorToast) {
                const errMsg = err ? (err.message || err.text || JSON.stringify(err)) : "EmailJS config missing or SDK failed to load";
                errorToast.innerHTML = `Unable to send message right now. (Detail: ${errMsg}). Please try again or contact us via <a href="https://wa.me/918520929943?text=Hi%20QuasiBanking%2C%20I%20have%20an%20inquiry." target="_blank" rel="noopener noreferrer" style="color: #34d399; font-weight: 700; text-decoration: underline;">WhatsApp</a>.`;
                errorToast.classList.remove('hidden');
            }
        };

        try {
            const emailjs = await loadEmailJS();
            const keysConfigured = EMAIL_CONFIG.SERVICE_ID && EMAIL_CONFIG.TEMPLATE_ID && EMAIL_CONFIG.PUBLIC_KEY;
            
            if (emailjs && keysConfigured) {
                await emailjs.send(EMAIL_CONFIG.SERVICE_ID, EMAIL_CONFIG.TEMPLATE_ID, templateParams, {
                    publicKey: EMAIL_CONFIG.PUBLIC_KEY
                });
                if (successToast) {
                    successToast.innerHTML = `<i class="fas fa-check-circle"></i> <strong>✓ Message Sent Successfully</strong><br>We've received your inquiry and will get back to you shortly.`;
                    successToast.classList.remove('hidden');
                }
                contactForm.reset();
            } else {
                console.warn("EmailJS not configured or failed to load. Saving to localStorage.");
                handleFailure("EmailJS SDK not loaded or keys are missing.");
            }
        } catch (err) {
            console.error("EmailJS sending failed:", err);
            handleFailure(err);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                if (submitBtnText) submitBtnText.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
            }
        }
    });
}

// 10. Teaser email signup form validator
function initTeaserForm() {
    const teaserForm = document.getElementById('teaser-form');
    if (!teaserForm) return;

    teaserForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const successToast = document.getElementById('teaser-success');
        const errorToast = document.getElementById('teaser-error');
        if (successToast) successToast.classList.add('hidden');
        if (errorToast) errorToast.classList.add('hidden');

        const email = document.getElementById('teaser-email').value.trim();

        if (!email || !validateEmail(email)) {
            if (errorToast) errorToast.classList.remove('hidden');
            return;
        }

        if (successToast) successToast.classList.remove('hidden');
        teaserForm.reset();
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}