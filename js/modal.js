import { auth } from '../firebase-app.js';
import { fetchUserStats } from './dashboard.js';

// DOM Elements Cache
const elements = {};

function initElements() {
    elements.courseModal = document.getElementById('course-modal');
    elements.modalClose = document.getElementById('modal-close');
    elements.modalCTA = document.getElementById('modal-cta');
    elements.modalTitle = document.getElementById('modal-title');
    elements.modalDesc = document.getElementById('modal-desc');
    elements.modalPrice = document.getElementById('modal-price');

    elements.paymentModal = document.getElementById('payment-modal');
    elements.paymentClose = document.getElementById('payment-modal-close');
    elements.paymentSuccessClose = document.getElementById('payment-success-close');
    elements.paymentTitle = document.getElementById('payment-course-title');
    elements.paymentPrice = document.getElementById('payment-price');
    elements.paymentOrigPrice = document.getElementById('payment-original-price');
    elements.paymentSuccessMsg = document.getElementById('payment-success-msg');
    
    elements.stepSelect = document.getElementById('payment-step-select');
    elements.stepProcessing = document.getElementById('payment-step-processing');
    elements.stepSuccess = document.getElementById('payment-step-success');
    elements.payNowBtn = document.getElementById('pay-now-btn');
}

// Error feedback placeholder
let errorBanner = null;
function showPaymentError(msg) {
    if (!errorBanner) {
        errorBanner = document.createElement('div');
        errorBanner.style.cssText = 'color: #ef4444; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); padding: 12px; border-radius: 12px; font-size: 0.85rem; margin-top: 15px; text-align: center; font-weight: 500;';
        const container = elements.stepSelect;
        if (container) container.appendChild(errorBanner);
    }
    errorBanner.textContent = msg;
    errorBanner.style.display = 'block';
}

function clearPaymentError() {
    if (errorBanner) {
        errorBanner.style.display = 'none';
    }
}

// Dynamically load Razorpay SDK
function loadRazorpayScript() {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

function openPaymentModal(courseTitle, price = '999') {
    const { paymentModal, paymentTitle, paymentPrice, paymentOrigPrice, paymentSuccessMsg, stepSelect, stepProcessing, stepSuccess } = elements;
    if (!paymentModal) return;

    if (paymentTitle) paymentTitle.textContent = courseTitle;
    if (paymentPrice) paymentPrice.textContent = `₹${price}`;
    
    if (paymentOrigPrice) {
        const originalPrice = parseInt(price) * 2;
        paymentOrigPrice.textContent = `₹${originalPrice}`;
    }
    
    if (paymentSuccessMsg) {
        paymentSuccessMsg.textContent = `Welcome to ${courseTitle} Batch 🎉`;
    }

    // Reset steps
    if (stepSelect) stepSelect.classList.remove('hidden');
    if (stepProcessing) stepProcessing.classList.add('hidden');
    if (stepSuccess) stepSuccess.classList.add('hidden');
    clearPaymentError();

    paymentModal.classList.remove('hidden');
    paymentModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePaymentModal() {
    const { paymentModal } = elements;
    if (!paymentModal) return;
    paymentModal.classList.remove('active');
    paymentModal.classList.add('hidden');
    document.body.style.overflow = '';
}

function handleEnrollmentSuccess(courseTitle) {
    let enrolled = [];
    try {
        enrolled = JSON.parse(localStorage.getItem('quasibanking_enrolled_courses') || '[]');
    } catch (e) {
        enrolled = [];
    }
    if (!enrolled.includes(courseTitle)) {
        enrolled.push(courseTitle);
        localStorage.setItem('quasibanking_enrolled_courses', JSON.stringify(enrolled));
    }
    
    // Update Dashboard UI
    const user = auth.currentUser;
    if (user) {
        fetchUserStats(user.uid);
    }
    
    // Transition to Success Step
    const { stepProcessing, stepSuccess } = elements;
    if (stepProcessing) stepProcessing.classList.add('hidden');
    if (stepSuccess) stepSuccess.classList.remove('hidden');
}

function openMockRazorpayGateway(options) {
    const overlay = document.createElement('div');
    overlay.id = 'mock-razorpay-overlay';
    overlay.style.cssText = 'position: fixed; inset: 0; z-index: 6000; display: flex; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(4px);';
    
    const amountINR = (options.amount / 100).toFixed(2);
    const { stepSelect, stepProcessing } = elements;
    
    overlay.innerHTML = `
        <div style="position: relative; width: 100%; max-width: 380px; background: #1e293b; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); overflow: hidden; font-family: system-ui, -apple-system, sans-serif; color: #f8fafc; animation: fadeIn 0.25s ease;">
            <!-- Top bar -->
            <div style="background: #6366f1; padding: 20px; position: relative; text-align: center;">
                <button id="mock-rzp-close" style="position: absolute; right: 15px; top: 15px; background: none; border: none; color: white; font-size: 24px; cursor: pointer; opacity: 0.8; transition: opacity 0.2s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.8">&times;</button>
                <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 8px;">
                    <span style="font-weight: 800; font-size: 1.1rem; letter-spacing: 0.5px; text-transform: uppercase;">${options.name}</span>
                </div>
                <span style="font-size: 0.8rem; opacity: 0.85; display: block; margin-bottom: 6px;">${options.description}</span>
                <span style="font-size: 1.5rem; font-weight: 850; letter-spacing: 0.5px;">₹${amountINR}</span>
                <div style="margin-top: 10px; display: inline-block; background: rgba(255,255,255,0.15); padding: 4px 12px; border-radius: 50px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #a5b4fc;">
                    🛡️ Razorpay Sandbox Simulator
                </div>
            </div>

            <!-- Content Area -->
            <div style="padding: 24px;">
                <!-- User details -->
                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 12px; border-radius: 12px; margin-bottom: 20px; font-size: 0.8rem; display: flex; flex-direction: column; gap: 4px; color: #94a3b8;">
                    <div><strong style="color: #f1f5f9;">Billing Contact:</strong> ${options.prefill.email}</div>
                </div>

                <!-- Simulation selection -->
                <div style="margin-bottom: 24px;">
                    <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #94a3b8; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;">Payment Method</label>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="display: flex; align-items: center; justify-content: space-between; padding: 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; cursor: pointer; transition: all 0.2s;" class="mock-option">
                            <span style="display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 0.9rem;">
                                <i class="fas fa-credit-card" style="color: #818cf8;"></i> Simulated Card
                            </span>
                            <input type="radio" name="mock-pay-method" value="card" checked style="accent-color: #6366f1;">
                        </label>
                        <label style="display: flex; align-items: center; justify-content: space-between; padding: 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; cursor: pointer; transition: all 0.2s;" class="mock-option">
                            <span style="display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 0.9rem;">
                                <i class="fas fa-mobile-alt" style="color: #34d399;"></i> Simulated UPI / QR
                            </span>
                            <input type="radio" name="mock-pay-method" value="upi" style="accent-color: #6366f1;">
                        </label>
                    </div>
                </div>

                <!-- Processing Simulator State -->
                <div id="mock-rzp-processing" style="display: none; flex-direction: column; align-items: center; text-align: center; gap: 12px; padding: 10px 0 20px;">
                    <div style="width: 32px; height: 32px; border: 3px solid rgba(99,102,241,0.2); border-top-color: #6366f1; border-radius: 50%; animation: mock-spin 0.6s linear infinite;"></div>
                    <span style="font-size: 0.85rem; font-weight: 500; color: #a5b4fc;">Processing simulation...</span>
                </div>

                <!-- Action Button -->
                <button id="mock-rzp-submit" style="width: 100%; padding: 16px; background: #6366f1; border: none; border-radius: 12px; color: white; font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);">
                    Pay ₹${amountINR}
                </button>
                
                <div style="margin-top: 15px; text-align: center;">
                    <button id="mock-rzp-fail" style="background: none; border: none; color: #f87171; font-size: 0.75rem; font-weight: 600; cursor: pointer; text-decoration: underline;">Simulate Failure</button>
                </div>
            </div>
        </div>
        <style>
            @keyframes mock-spin {
                to { transform: rotate(360deg); }
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
            .mock-option:hover {
                border-color: rgba(99,102,241,0.4) !important;
                background: rgba(99,102,241,0.05) !important;
            }
        </style>
    `;

    document.body.appendChild(overlay);

    const closeBtn = overlay.querySelector('#mock-rzp-close');
    const submitBtn = overlay.querySelector('#mock-rzp-submit');
    const failBtn = overlay.querySelector('#mock-rzp-fail');
    const processingArea = overlay.querySelector('#mock-rzp-processing');

    closeBtn.addEventListener('click', () => {
        overlay.remove();
        if (options.modal && typeof options.modal.ondismiss === 'function') {
            options.modal.ondismiss();
        }
    });

    submitBtn.addEventListener('click', () => {
        submitBtn.disabled = true;
        failBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
        submitBtn.style.cursor = 'not-allowed';
        if (processingArea) processingArea.style.display = 'flex';

        setTimeout(() => {
            overlay.remove();
            if (typeof options.handler === 'function') {
                options.handler({
                    razorpay_payment_id: 'pay_mock_' + Math.random().toString(36).substring(2, 11)
                });
            }
        }, 1500);
    });

    failBtn.addEventListener('click', (e) => {
        e.preventDefault();
        overlay.remove();
        if (options.modal && typeof options.modal.ondismiss === 'function') {
            options.modal.ondismiss();
        }
        if (stepProcessing) stepProcessing.classList.add('hidden');
        if (stepSelect) stepSelect.classList.remove('hidden');
        showPaymentError('Payment Transaction failed. Simulator rejected authorization.');
    });
}

async function triggerRazorpayPayment() {
    const title = elements.paymentTitle?.textContent || 'Course Enrollment';
    const priceStr = elements.paymentPrice?.textContent?.replace('₹', '') || '999';
    const price = parseInt(priceStr);

    const { stepSelect, stepProcessing } = elements;
    clearPaymentError();

    const userEmail = auth.currentUser?.email || 'student@quasibanking.com';

    const options = {
        key: 'rzp_test_mockkey12345', // Standard Razorpay mock Key ID for client-only testing
        amount: price * 100, // Amount in paise
        currency: 'INR',
        name: 'QuasiBanking Classes',
        description: title,
        image: 'RESOURCES/MAINWEBSITELOGO.jpeg',
        handler: function (response) {
            console.log('Payment Successful. Ref:', response.razorpay_payment_id);
            handleEnrollmentSuccess(title);
        },
        prefill: {
            name: userEmail.split('@')[0],
            email: userEmail
        },
        theme: {
            color: '#6366f1' // Matches branding color
        },
        modal: {
            ondismiss: function () {
                if (stepProcessing) stepProcessing.classList.add('hidden');
                if (stepSelect) stepSelect.classList.remove('hidden');
                showPaymentError('Payment cancelled by user.');
            }
        }
    };

    // Check if we should use the sandbox simulator instead of calling official SDK which validates keys
    const useSimulator = options.key === 'rzp_test_mockkey12345' || options.key.includes('mock');
    if (useSimulator) {
        openMockRazorpayGateway(options);
        return;
    }

    if (stepSelect) stepSelect.classList.add('hidden');
    if (stepProcessing) stepProcessing.classList.remove('hidden');

    const loaded = await loadRazorpayScript();
    if (!loaded) {
        if (stepProcessing) stepProcessing.classList.add('hidden');
        if (stepSelect) stepSelect.classList.remove('hidden');
        showPaymentError('Failed to load payment gateway. Check your connection.');
        return;
    }

    try {
        const rzp = new window.Razorpay(options);
        rzp.open();
    } catch (e) {
        console.error('Razorpay Init Error:', e);
        if (stepProcessing) stepProcessing.classList.add('hidden');
        if (stepSelect) stepSelect.classList.remove('hidden');
        showPaymentError('Payment Gateway Init failed.');
    }
}

function initModals() {
    initElements();
    const { courseModal, modalClose, modalCTA, paymentClose, paymentSuccessClose, payNowBtn } = elements;

    // Attach Enroll listeners to all course-card and popular-slide items
    const attachEnrollListeners = (selector, titleSelector, descSelector) => {
        document.querySelectorAll(selector).forEach(card => {
            const enrollBtn = card.querySelector('.enroll-btn');
            if (!enrollBtn) return;

            enrollBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const titleEl = card.querySelector(titleSelector);
                const descEl = card.querySelector(descSelector);
                if (!titleEl || !descEl) return;

                const title = titleEl.innerText;
                const desc = descEl.innerText;
                const price = enrollBtn.getAttribute('data-price') || '999';

                if (elements.modalTitle) elements.modalTitle.innerText = title;
                if (elements.modalDesc) elements.modalDesc.innerText = desc;
                if (elements.modalPrice) elements.modalPrice.innerText = `₹${price}`;

                if (courseModal) {
                    courseModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
    };

    attachEnrollListeners('.course-card', '.course-title', '.course-subtitle');
    attachEnrollListeners('.popular-slide', '.course-main-title', '.feature-list');

    // Close preview modal functions
    const closePreviewModal = () => {
        if (courseModal) {
            courseModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (modalClose) {
        modalClose.addEventListener('click', closePreviewModal);
    }

    if (courseModal) {
        courseModal.addEventListener('click', (e) => {
            if (e.target === courseModal) closePreviewModal();
        });
    }

    // Modal CTA (Confirm & Enroll) -> opens payment modal
    if (modalCTA) {
        modalCTA.addEventListener('click', () => {
            const title = elements.modalTitle?.innerText || 'SBI Clerk';
            const price = elements.modalPrice?.innerText?.replace('₹', '') || '999';
            closePreviewModal();
            openPaymentModal(title, price);
        });
    }

    // Payment Modal closing logic
    if (paymentClose) {
        paymentClose.addEventListener('click', closePaymentModal);
    }

    if (elements.paymentModal) {
        elements.paymentModal.addEventListener('click', (e) => {
            if (e.target === elements.paymentModal) closePaymentModal();
        });
    }

    if (paymentSuccessClose) {
        paymentSuccessClose.addEventListener('click', () => {
            closePaymentModal();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Pay Now triggers Razorpay
    if (payNowBtn) {
        payNowBtn.addEventListener('click', triggerRazorpayPayment);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModals);
} else {
    initModals();
}

// Local storage synchronization for updates across tabs
window.addEventListener('storage', (e) => {
    if (e.key === 'quasibanking_enrolled_courses') {
        const user = auth.currentUser;
        if (user) {
            fetchUserStats(user.uid);
        }
    }
});
