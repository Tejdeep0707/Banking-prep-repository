// --- UI & SIDEBAR LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    function toggleSidebar() {
        if (!sidebar || !sidebarOverlay) return;
        const isActive = sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
        document.body.style.overflow = isActive ? 'hidden' : '';
    }

    if (sidebarToggle) sidebarToggle.onclick = toggleSidebar;
    if (sidebarClose) sidebarClose.onclick = toggleSidebar;
    if (sidebarOverlay) sidebarOverlay.onclick = toggleSidebar;

    // --- CAROUSEL NAVIGATION LOGIC (STRICT FIX) ---
    const carousel = document.getElementById('course-carousel');
    const prevBtn = document.getElementById('course-prev');
    const nextBtn = document.getElementById('course-next');

    if (carousel && prevBtn && nextBtn) {
        const updateArrowStates = () => {
            const isAtStart = carousel.scrollLeft <= 5;
            const isAtEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 5;
            
            prevBtn.disabled = isAtStart;
            nextBtn.disabled = isAtEnd;
        };

        const scrollBySet = (direction) => {
            const cardWidth = carousel.querySelector('.course-card').offsetWidth + 30; // Card width + gap
            carousel.scrollBy({ 
                left: direction * cardWidth * 2, // Scroll by 2 cards at a time
                behavior: 'smooth' 
            });
        };

        prevBtn.onclick = () => scrollBySet(-1);
        nextBtn.onclick = () => scrollBySet(1);

        carousel.addEventListener('scroll', updateArrowStates);
        window.addEventListener('resize', updateArrowStates);
        
        // Initial setup
        updateArrowStates();
    }

    // --- COURSE PREVIEW MODAL LOGIC ---
    const courseModal = document.getElementById('course-modal');
    const modalClose = document.getElementById('modal-close');
    const modalCTA = document.getElementById('modal-cta');
    const courseCards = document.querySelectorAll('.course-card');

    if (courseModal && modalClose && modalCTA) {
        courseCards.forEach(card => {
            card.onclick = (e) => {
                e.preventDefault(); // Prevent immediate redirect
                
                // Extract data from card
                const title = card.querySelector('.course-title').innerText;
                const desc = card.querySelector('.course-subtitle').innerText;
                const targetURL = card.getAttribute('href');

                // Populate Modal
                document.getElementById('modal-title').innerText = title;
                document.getElementById('modal-desc').innerText = desc;
                modalCTA.setAttribute('href', targetURL);

                // Show Modal
                courseModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Disable scroll
            };
        });

        // Close Modal Logic
        const closeModal = () => {
            courseModal.classList.remove('active');
            document.body.style.overflow = ''; // Re-enable scroll
        };

        modalClose.onclick = closeModal;
        courseModal.onclick = (e) => {
            if (e.target === courseModal) closeModal();
        };

        // Modal CTA Click
        modalCTA.onclick = () => {
            closeModal();
            // Link will follow target="_blank" naturally from href
        };
    }

    // --- FIREBASE AUTH STATE ---
    if (typeof firebase !== 'undefined') {
        const checkAuth = setInterval(() => {
            if (firebase.apps.length > 0) {
                clearInterval(checkAuth);
                initAuthState();
            }
        }, 100);
    }
});

function initAuthState() {
    firebase.auth().onAuthStateChanged(async (user) => {
        const welcomeMsg = document.getElementById('welcome-msg');
        const headerAuthBtn = document.getElementById('header-auth-btn');
        const sidebarAuthSection = document.getElementById('sidebar-auth-section');
        const statsSection = document.getElementById('user-stats');

        if (user) {
            // User is signed in
            const userName = user.email.split('@')[0];
            const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);
            
            if (welcomeMsg) {
                // Keep the Brand Heading, but add a personalized greeting below or above
                const existingContent = welcomeMsg.innerHTML;
                if (!existingContent.includes('Hi,')) {
                    welcomeMsg.insertAdjacentHTML('beforebegin', `<p id="user-greeting" style="color: var(--primary-color); font-weight: 700; margin-bottom: 10px; font-size: 1.1rem; animation: fadeIn 1s ease;">Hi, ${displayName} 👋</p>`);
                }
            }

            // Update Header with User Icon/Profile
            if (headerAuthBtn) {
                headerAuthBtn.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.05); padding: 5px 15px; border-radius: 50px; border: 1px solid var(--glass-border); height: 44px;">
                        <span style="font-weight: 600; font-size: 0.9rem; color: var(--text-main);">Hi, ${displayName}</span>
                        <div style="width: 32px; height: 32px; flex-shrink: 0; background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.8rem;">
                            ${displayName.charAt(0)}
                        </div>
                    </div>
                `;
            }

            // Update Sidebar with Profile & Logout (Premium Card)
            if (sidebarAuthSection) {
                sidebarAuthSection.innerHTML = `
                    <div class="sidebar-profile-card">
                        <div class="profile-info">
                            <h4>${displayName}</h4>
                            <p>${user.email}</p>
                        </div>
                        <button onclick="handleLogout()" class="signout-btn">
                            <i class="fas fa-sign-out-alt"></i> Sign Out
                        </button>
                    </div>
                `;
            }

            // Show Stats if available
            if (statsSection) {
                statsSection.classList.remove('hidden');
                fetchUserStats(user.uid);
            }

        } else {
            // No user is signed in - REDIRECT TO LOGIN
            if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.includes('mock-test.html')) {
                window.location.href = 'auth.html';
            }
            
            if (headerAuthBtn) {
                headerAuthBtn.innerHTML = `<a href="auth.html" class="btn btn-primary">Login</a>`;
            }
        }
    });
}

async function fetchUserStats(userId) {
    if (typeof firebase === 'undefined') return;
    const db = firebase.firestore();
    try {
        // Fetch ALL results for this user to calculate accurate averages
        const snapshot = await db.collection("testResults")
            .where("userId", "==", userId)
            .orderBy("timestamp", "desc")
            .get();

        if (snapshot.empty) {
            console.log("No test results found for user.");
            return;
        }

        let totalTests = snapshot.size;
        let sumAccuracy = 0;
        let latestDoc = snapshot.docs[0].data();

        snapshot.forEach(doc => {
            const data = doc.data();
            sumAccuracy += (data.accuracy || 0);
        });

        const statTotal = document.getElementById('stat-total');
        const statAvg = document.getElementById('stat-avg');
        const statLatest = document.getElementById('stat-latest');

        if (statTotal) statTotal.innerText = totalTests;
        if (statAvg) statAvg.innerText = Math.round(sumAccuracy / totalTests) + "%";
        if (statLatest) statLatest.innerText = `${latestDoc.score}/${latestDoc.totalQuestions}`;
        
        console.log(`Synced ${totalTests} tests for user ${userId}`);
    } catch (error) {
        console.error("Error fetching stats:", error);
    }
}

function handleLogout() {
    firebase.auth().signOut().then(() => {
        window.location.href = 'auth.html';
    }).catch((error) => {
        console.error("Logout Error:", error);
    });
}
window.handleLogout = handleLogout;

// --- PAYMENT MODAL LOGIC ---
const paymentModal = document.getElementById('payment-modal');
const paymentModalClose = document.getElementById('payment-modal-close');
const payNowBtn = document.getElementById('pay-now-btn');
const paymentStepSelect = document.getElementById('payment-step-select');
const paymentStepProcessing = document.getElementById('payment-step-processing');
const paymentStepSuccess = document.getElementById('payment-step-success');
const paymentSuccessClose = document.getElementById('payment-success-close');
const modalCta = document.getElementById('modal-cta');

function openPaymentModal(courseTitle) {
    document.getElementById('payment-course-title').textContent = courseTitle;
    document.getElementById('payment-success-msg').textContent = `Welcome to ${courseTitle} Batch 🎉`;
    
    // Reset steps
    paymentStepSelect.classList.remove('hidden');
    paymentStepProcessing.classList.add('hidden');
    paymentStepSuccess.classList.add('hidden');
    paymentModalClose.classList.remove('hidden');
    
    paymentModal.classList.remove('hidden');
    paymentModal.classList.add('active'); // Ensure opacity transition
}

function closePaymentModal() {
    paymentModal.classList.add('hidden');
}

if (modalCta) {
    modalCta.addEventListener('click', (e) => {
        e.preventDefault();
        const courseTitle = document.getElementById('modal-title').textContent;
        // Close course modal first
        document.getElementById('course-modal').classList.remove('active');
        openPaymentModal(courseTitle);
    });
}

if (paymentModalClose) {
    paymentModalClose.addEventListener('click', closePaymentModal);
}

if (payNowBtn) {
    payNowBtn.addEventListener('click', () => {
        paymentStepSelect.classList.add('hidden');
        paymentStepProcessing.classList.remove('hidden');
        paymentModalClose.classList.add('hidden'); // Disable closing during processing

        setTimeout(() => {
            paymentStepProcessing.classList.add('hidden');
            paymentStepSuccess.classList.remove('hidden');
        }, 2000);
    });
}

if (paymentSuccessClose) {
    paymentSuccessClose.addEventListener('click', closePaymentModal);
}

// Update the enrollment logic for the hero/cards to open the payment modal if needed
window.addEventListener('click', (e) => {
    if (e.target === paymentModal) closePaymentModal();
});