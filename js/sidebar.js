// QuasiBanking Premium Sidebar & Pages Controller
import { EMAIL_CONFIG, loadEmailJS } from './emailjs-loader.js';

const CONFIG = {
    APPX_URL: "https://www.quasibankingclasses.com/new-courses/2?source=website",
    UNREAD_NOTIFICATIONS: 0 // Starts at zero
};

document.addEventListener('DOMContentLoaded', () => {
    initDropdowns();
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

// Apply theme instantly before DOM is ready to prevent flash
(function() {
    document.body.setAttribute('data-theme', 'light');
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

    // Close mobile drawer when clicking a link inside it (but not dropdown triggers)
    const sidebarLinks = sidebar.querySelectorAll('.nav-card, .dropdown-item');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.classList.contains('dropdown-trigger')) {
                return; // Do not close drawer when expanding dropdown
            }
            toggleMenu(false);
        });
    });
}

// 3. Active Nav State Syncing
function initActiveNav() {
    const navCards = {
        dashboard: document.getElementById('nav-dashboard'),
        courses: document.getElementById('nav-courses-trigger') || document.getElementById('nav-courses'),
        mocks: document.getElementById('nav-mocks-trigger') || document.getElementById('nav-mocks'),
        notifications: document.getElementById('nav-notifications'),
        interview: document.getElementById('nav-interview'),
        contact: document.getElementById('nav-contact')
    };

    const topNavCards = {
        dashboard: document.getElementById('top-nav-dashboard'),
        courses: document.getElementById('top-nav-courses-trigger'),
        mocks: document.getElementById('top-nav-mocks-trigger'),
        notifications: document.getElementById('top-nav-notifications'),
        interview: document.getElementById('top-nav-interview'),
        contact: document.getElementById('top-nav-contact')
    };

    const updateActiveState = () => {
        const path = window.location.pathname;
        const hash = window.location.hash;

        // Reset all classes
        Object.values(navCards).forEach(card => {
            if (card) card.classList.remove('active');
        });
        Object.values(topNavCards).forEach(card => {
            if (card) card.classList.remove('active');
        });

        const dropdownItems = document.querySelectorAll('.dropdown-item, .header-dropdown-item');
        dropdownItems.forEach(item => item.classList.remove('active'));

        let activeKey = null;
        let subActiveId = null;

        if (path.includes('course-ibps.html') || path.includes('course-rbi.html') || path.includes('course-sbi.html')) {
            activeKey = 'courses';
            if (path.includes('course-sbi.html')) {
                subActiveId = 'nav-sbi-courses';
            } else if (path.includes('course-rbi.html')) {
                subActiveId = 'nav-rbi-courses';
            } else if (path.includes('course-ibps.html')) {
                subActiveId = 'nav-ibps-courses';
            }
        } else if (path.includes('mock-tests.html')) {
            activeKey = 'mocks';
            if (hash.includes('sbi')) {
                subActiveId = 'nav-sbi-mocks';
            } else if (hash.includes('rbi')) {
                subActiveId = 'nav-rbi-mocks';
            } else if (hash.includes('ibps')) {
                subActiveId = 'nav-ibps-mocks';
            }
        } else if (path.includes('notifications.html')) {
            activeKey = 'notifications';
        } else if (path.includes('contact.html')) {
            activeKey = 'contact';
        } else if (path.includes('interview.html')) {
            activeKey = 'interview';
        } else if (path.includes('auth.html')) {
            // Keep all inactive
        } else {
            // Index.html navigation hashes
            if (hash.includes('courses')) {
                activeKey = 'courses';
            } else if (hash.includes('mock-tests')) {
                activeKey = 'mocks';
            } else if (hash.includes('user-stats')) {
                activeKey = 'dashboard';
            } else if (hash.includes('notifications')) {
                activeKey = 'notifications';
            } else {
                // If it is index.html and no matching path, set Dashboard active
                activeKey = 'dashboard';
            }
        }

        if (activeKey) {
            if (navCards[activeKey]) navCards[activeKey].classList.add('active');
            if (topNavCards[activeKey]) topNavCards[activeKey].classList.add('active');
        }

        if (subActiveId) {
            const items = document.querySelectorAll(`[id="${subActiveId}"]`);
            items.forEach(item => item.classList.add('active'));
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

    if (navMocks && !navMocks.classList.contains('dropdown-trigger')) {
        navMocks.addEventListener('click', handleRedirect);
    }
    if (qaMock) {
        qaMock.addEventListener('click', handleRedirect);
    }
}

// 4.5 Dropdowns Controller
function initDropdowns() {
    // 1. Sidebar Dropdowns
    const coursesTrigger = document.getElementById('nav-courses-trigger');
    const mocksTrigger = document.getElementById('nav-mocks-trigger');
    const coursesMenu = document.getElementById('courses-dropdown');
    const mocksMenu = document.getElementById('mocks-dropdown');

    const toggleDropdown = (trigger, menu, forceOpen) => {
        if (!trigger || !menu) return;
        const isOpen = trigger.classList.contains('open');
        const shouldOpen = forceOpen !== undefined ? forceOpen : !isOpen;

        if (shouldOpen) {
            // Close other sidebar dropdowns
            [coursesTrigger, mocksTrigger].forEach(t => {
                if (t && t !== trigger) {
                    t.classList.remove('open');
                    t.setAttribute('aria-expanded', 'false');
                    const arrow = t.querySelector('.dropdown-arrow');
                    if (arrow) arrow.style.transform = '';
                }
            });
            [coursesMenu, mocksMenu].forEach(m => {
                if (m && m !== menu) {
                    m.classList.remove('open');
                    m.style.maxHeight = null;
                }
            });

            trigger.classList.add('open');
            trigger.setAttribute('aria-expanded', 'true');
            menu.classList.add('open');
            menu.style.maxHeight = menu.scrollHeight + 'px';
        } else {
            trigger.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
            menu.classList.remove('open');
            menu.style.maxHeight = null;
        }
    };

    if (coursesTrigger && coursesMenu) {
        coursesTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            toggleDropdown(coursesTrigger, coursesMenu);
        });
    }

    if (mocksTrigger && mocksMenu) {
        mocksTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            toggleDropdown(mocksTrigger, mocksMenu);
        });
    }

    // Auto-open sidebar dropdowns on page load if matched
    const path = window.location.pathname;
    const autoOpen = () => {
        if (path.includes('course-ibps.html') || path.includes('course-rbi.html') || path.includes('course-sbi.html')) {
            toggleDropdown(coursesTrigger, coursesMenu, true);
        } else if (path.includes('mock-tests.html')) {
            toggleDropdown(mocksTrigger, mocksMenu, true);
        }
    };
    autoOpen();
    window.addEventListener('hashchange', autoOpen);

    // 1.5. Sidebar Sub-Dropdowns
    const subTriggers = document.querySelectorAll('.sidebar-sub-trigger');
    subTriggers.forEach(subTrigger => {
        subTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const subMenu = subTrigger.nextElementSibling;
            if (!subMenu) return;
            const isOpen = subTrigger.classList.contains('open');

            // Close other sibling submenus inside the same parent dropdown menu
            const container = subTrigger.closest('.dropdown-menu');
            if (container) {
                container.querySelectorAll('.sidebar-sub-trigger').forEach(t => {
                    if (t !== subTrigger) {
                        t.classList.remove('open');
                        const m = t.nextElementSibling;
                        if (m) {
                            m.classList.remove('open');
                            m.style.maxHeight = null;
                        }
                    }
                });
            }

            if (isOpen) {
                subTrigger.classList.remove('open');
                subMenu.classList.remove('open');
                subMenu.style.maxHeight = null;
            } else {
                subTrigger.classList.add('open');
                subMenu.classList.add('open');
                subMenu.style.maxHeight = subMenu.scrollHeight + 'px';
            }

            // Recalculate parent dropdown height
            const parentDropdown = subTrigger.closest('.dropdown-menu');
            if (parentDropdown) {
                // Temporarily allow overflow/unset max-height to get correct scrollHeight, then update
                parentDropdown.style.maxHeight = 'none';
                const newHeight = parentDropdown.scrollHeight;
                parentDropdown.style.maxHeight = newHeight + 'px';
            }
        });
    });

    // 2. Top Header Dropdowns and Profile Popover (Event Delegation)
    document.addEventListener('click', (e) => {
        // A.5 Header Sub-Dropdowns click handler for mobile/tablet clicks
        const headerSubTrigger = e.target.closest('.header-sub-trigger');
        if (headerSubTrigger) {
            e.preventDefault();
            e.stopPropagation();
            const subMenu = headerSubTrigger.nextElementSibling;
            if (subMenu) {
                const isOpen = subMenu.classList.contains('open');
                // Close other sibling sub-menus
                const parentMenu = headerSubTrigger.closest('.header-dropdown-menu');
                if (parentMenu) {
                    parentMenu.querySelectorAll('.header-sub-menu').forEach(m => {
                        if (m !== subMenu) m.classList.remove('open');
                    });
                    parentMenu.querySelectorAll('.header-sub-trigger').forEach(t => {
                        if (t !== headerSubTrigger) t.classList.remove('active');
                    });
                }

                if (isOpen) {
                    headerSubTrigger.classList.remove('active');
                    subMenu.classList.remove('open');
                } else {
                    headerSubTrigger.classList.add('active');
                    subMenu.classList.add('open');
                }
            }
            return;
        } else {
            // Clicked elsewhere - close all header sub-menus
            document.querySelectorAll('.header-sub-menu').forEach(m => m.classList.remove('open'));
            document.querySelectorAll('.header-sub-trigger').forEach(t => t.classList.remove('active'));
        }

        // A. Header Navigation Dropdowns
        const headerTrigger = e.target.closest('.header-dropdown .dropdown-trigger');
        if (headerTrigger) {
            e.preventDefault();
            e.stopPropagation();
            const menu = headerTrigger.nextElementSibling;
            const isOpen = menu.classList.contains('open');

            // Close all header dropdowns first
            document.querySelectorAll('.header-dropdown-menu').forEach(m => {
                if (m !== menu) m.classList.remove('open');
            });
            document.querySelectorAll('.header-dropdown .dropdown-trigger').forEach(t => {
                if (t !== headerTrigger) {
                    t.classList.remove('open');
                    t.setAttribute('aria-expanded', 'false');
                }
            });

            if (isOpen) {
                headerTrigger.classList.remove('open');
                menu.classList.remove('open');
                headerTrigger.setAttribute('aria-expanded', 'false');
            } else {
                headerTrigger.classList.add('open');
                menu.classList.add('open');
                headerTrigger.setAttribute('aria-expanded', 'true');
            }
        } else {
            // Clicked outside header dropdowns - close them
            document.querySelectorAll('.header-dropdown-menu').forEach(m => m.classList.remove('open'));
            document.querySelectorAll('.header-dropdown .dropdown-trigger').forEach(t => {
                t.classList.remove('open');
                t.setAttribute('aria-expanded', 'false');
            });
        }

        // B. Profile Avatar Popover Click handling
        const avatarBtn = e.target.closest('#top-profile-avatar-btn');
        const popover = document.getElementById('profile-popover-panel');

        if (avatarBtn && popover) {
            e.stopPropagation();
            const isOpen = popover.classList.contains('open');
            if (isOpen) {
                popover.classList.remove('open');
                avatarBtn.setAttribute('aria-expanded', 'false');
            } else {
                popover.classList.add('open');
                avatarBtn.setAttribute('aria-expanded', 'true');
            }
        } else if (popover && !e.target.closest('#profile-popover-panel')) {
            popover.classList.remove('open');
            const avatarBtnEl = document.getElementById('top-profile-avatar-btn');
            if (avatarBtnEl) avatarBtnEl.setAttribute('aria-expanded', 'false');
        }
    });
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

    const topProgressFill = document.getElementById('top-progress-fill');
    const topProgressText = document.getElementById('top-progress-percent');
    const topStatCourses = document.getElementById('top-stat-courses');
    const topStatMocks = document.getElementById('top-stat-mocks');
    const topStatAccuracy = document.getElementById('top-stat-accuracy');
    const topStatStreak = document.getElementById('top-stat-streak');

    const setVal = (el, val) => { if (el) el.textContent = val; };

    setVal(statCourses, enrolledCount);
    setVal(topStatCourses, enrolledCount);
    
    setVal(statMocks, mocksCompleted);
    setVal(topStatMocks, mocksCompleted);

    const formattedAccuracy = accuracyVal.endsWith('%') ? accuracyVal : `${accuracyVal}%`;
    setVal(statAccuracy, formattedAccuracy);
    setVal(topStatAccuracy, formattedAccuracy);

    const formattedStreak = streakDays.includes('Day') ? streakDays : `${streakDays} Days`;
    setVal(statStreak, formattedStreak);
    setVal(topStatStreak, formattedStreak);

    // Animate progress bar fill
    const animateFill = (fillEl, textEl) => {
        if (fillEl && textEl) {
            fillEl.style.width = '0%';
            textEl.textContent = '0%';

            setTimeout(() => {
                fillEl.style.width = `${progressPercent}%`;
                
                // Ticker effect for percent label
                let current = 0;
                const interval = setInterval(() => {
                    if (current >= progressPercent) {
                        textEl.textContent = `${progressPercent}%`;
                        clearInterval(interval);
                    } else {
                        current++;
                        textEl.textContent = `${current}%`;
                    }
                }, 8);
            }, 100);
        }
    };

    animateFill(progressFill, progressText);
    animateFill(topProgressFill, topProgressText);
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