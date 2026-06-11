import { auth } from '../firebase-app.js';
import { fetchUserStats } from './dashboard.js';
import { EMAIL_CONFIG, loadEmailJS } from './emailjs-loader.js';
import { escapeHtml } from './security-utils.js';

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
                    <span style="font-weight: 800; font-size: 1.1rem; letter-spacing: 0.5px; text-transform: uppercase;">${escapeHtml(options.name)}</span>
                </div>
                <span style="font-size: 0.8rem; opacity: 0.85; display: block; margin-bottom: 6px;">${escapeHtml(options.description)}</span>
                <span style="font-size: 1.5rem; font-weight: 850; letter-spacing: 0.5px;">₹${amountINR}</span>
                <div style="margin-top: 10px; display: inline-block; background: rgba(255,255,255,0.15); padding: 4px 12px; border-radius: 50px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #a5b4fc;">
                    🛡️ Razorpay Sandbox Simulator
                </div>
            </div>

            <!-- Content Area -->
            <div style="padding: 24px;">
                <!-- User details -->
                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 12px; border-radius: 12px; margin-bottom: 20px; font-size: 0.8rem; display: flex; flex-direction: column; gap: 4px; color: #94a3b8;">
                    <div><strong style="color: #f1f5f9;">Billing Contact:</strong> ${escapeHtml(options.prefill.email)}</div>
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

function ensureCourseModalHTML() {
    if (document.getElementById('course-modal')) return;

    const modalHTML = `
    <div id="course-modal" class="modal-overlay">
        <div class="modal-content bg-[#1e293b] border border-gray-700 rounded-[32px] p-10 max-w-[450px] w-[90%] relative shadow-2xl transition-all duration-300">
            <button class="absolute top-4 right-4 w-10 h-10 rounded-full text-gray-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition" id="modal-close" style="background: rgba(255, 255, 255, 0.05); border: none; cursor: pointer;">
                <i class="fas fa-times text-lg"></i>
            </button>
            
            <!-- Lead Capture Form Step -->
            <div id="enroll-form-container">
                <div class="text-center mb-6">
                    <h2 class="text-2xl font-extrabold text-white mb-2" id="modal-title">Enroll in Course</h2>
                    <div class="w-16 h-1 bg-indigo-500 mx-auto mb-4 rounded-full"></div>
                    <p class="text-gray-400 text-sm px-6">Please fill in your details to start the enrollment process. Our admissions team will reach out immediately.</p>
                </div>

                <form id="enroll-lead-form" class="space-y-4 text-left" novalidate>
                    <div id="enroll-success-toast" class="contact-toast hidden success-msg mb-4">
                        <i class="fas fa-check-circle"></i> Enrollment Inquiry Submitted Successfully
                    </div>
                    <div id="enroll-error-toast" class="contact-toast hidden error-msg mb-4">
                        <i class="fas fa-exclamation-circle"></i> Unable to send message right now. Please try again.
                    </div>

                    <div class="form-group" style="margin-bottom: 16px;">
                        <label for="enroll-name" class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Name *</label>
                        <input type="text" id="enroll-name" name="name" placeholder="John Doe" required class="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 w-full focus:border-indigo-500 focus:outline-none" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px; color: white; width: 100%; box-sizing: border-box;">
                        <span class="inline-error hidden"></span>
                    </div>

                    <div class="form-group" style="margin-bottom: 16px;">
                        <label for="enroll-phone" class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Phone Number *</label>
                        <input type="tel" id="enroll-phone" name="phone" placeholder="9876543210" required class="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 w-full focus:border-indigo-500 focus:outline-none" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px; color: white; width: 100%; box-sizing: border-box;">
                        <span class="inline-error hidden"></span>
                    </div>

                    <div class="form-group" style="margin-bottom: 16px;">
                        <label for="enroll-email" class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address *</label>
                        <input type="email" id="enroll-email" name="email" placeholder="john@example.com" required class="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 w-full focus:border-indigo-500 focus:outline-none" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px; color: white; width: 100%; box-sizing: border-box;">
                        <span class="inline-error hidden"></span>
                    </div>

                    <div class="form-group" style="margin-bottom: 16px;">
                        <label for="enroll-course-name" class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Interested Course</label>
                        <input type="text" id="enroll-course-name" name="course_name" readonly class="bg-white/5 border border-white/10 text-slate-300 rounded-xl px-4 py-3 w-full cursor-not-allowed font-semibold focus:outline-none" value="" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px; color: #cbd5e1; width: 100%; box-sizing: border-box;">
                    </div>

                    <button type="submit" id="enroll-submit-btn" class="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-center text-lg mt-6" style="border: none; cursor: pointer;">
                        <span>Submit Inquiry & Enroll</span>
                    </button>
                </form>
            </div>

            <!-- Lead Capture Success Step -->
            <div id="enroll-success-container" class="hidden text-center py-6">
                <div class="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6" style="width: 64px; height: 64px; background: rgba(16,185,129,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
                    <i class="fas fa-check text-3xl text-green-500" style="color: #10b981; font-size: 1.8rem;"></i>
                </div>
                <h3 class="text-xl font-bold text-white mb-2" style="font-size: 1.25rem; font-weight: 800; color: white; margin-bottom: 8px;">✓ Enrollment Inquiry Submitted</h3>
                <p id="enroll-success-desc" class="text-slate-400 text-sm mb-8" style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 32px;">Redirecting you to the course portal...</p>
                
                <div class="flex flex-col gap-3" style="display: flex; flex-direction: column; gap: 12px;">
                    <a href="https://wa.me/918520929943?text=Hi%20QuasiBanking%2C%20I%20want%20details%20about%20your%20banking%20courses." target="_blank" rel="noopener noreferrer" class="w-full py-3 bg-[#25d366] text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2 text-sm decoration-none" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; background: #25d366; color: white; border-radius: 12px; font-weight: 700; text-decoration: none; border: none; font-size: 0.9rem; cursor: pointer;">
                        <i class="fab fa-whatsapp" style="font-size: 1.1rem;"></i> Chat on WhatsApp
                    </a>
                    <button id="enroll-success-close-btn" class="w-full py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all active:scale-[0.98] text-sm" style="padding: 12px; background: rgba(255,255,255,0.03); color: white; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); font-weight: 700; font-size: 0.9rem; cursor: pointer;">
                        Continue Browsing
                    </button>
                </div>
            </div>
        </div>
    </div>`;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = modalHTML;
    document.body.appendChild(tempDiv.firstElementChild);
}

function initModals() {
    ensureCourseModalHTML();
    initElements();
    
    // Trigger dynamic loading of EmailJS SDK
    loadEmailJS();

    const openEnrollmentLeadModal = (title) => {
        const enrollForm = document.getElementById('enroll-lead-form');
        const enrollFormContainer = document.getElementById('enroll-form-container');
        const enrollSuccessContainer = document.getElementById('enroll-success-container');
        
        if (enrollForm) enrollForm.reset();
        if (enrollFormContainer) enrollFormContainer.classList.remove('hidden');
        if (enrollSuccessContainer) enrollSuccessContainer.classList.add('hidden');
        
        const successToast = document.getElementById('enroll-success-toast');
        const errorToast = document.getElementById('enroll-error-toast');
        if (successToast) successToast.classList.add('hidden');
        if (errorToast) errorToast.classList.add('hidden');

        // Clear validation styles
        const enrollNameEl = document.getElementById('enroll-name');
        const enrollPhoneEl = document.getElementById('enroll-phone');
        const enrollEmailEl = document.getElementById('enroll-email');
        [enrollNameEl, enrollPhoneEl, enrollEmailEl].forEach(el => {
            if (el) {
                el.classList.remove('error-input');
                const inlineErr = el.parentElement.querySelector('.inline-error');
                if (inlineErr) inlineErr.classList.add('hidden');
            }
        });

        // Auto-fill course name
        const courseNameInput = document.getElementById('enroll-course-name');
        if (courseNameInput) courseNameInput.value = title;

        const courseModal = document.getElementById('course-modal');
        if (courseModal) {
            courseModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    const closePreviewModal = () => {
        const courseModal = document.getElementById('course-modal');
        if (courseModal) {
            courseModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // Global click interceptor for course enrollment triggers
    document.addEventListener('click', (e) => {
        // 1. Enrollment trigger click
        const target = e.target.closest('button, a');
        if (target) {
            const text = target.textContent.trim().toLowerCase();
            const matchesText = text === 'enroll now' || text === 'join batch' || text === 'register now' || target.classList.contains('enroll-btn');
            
            // Exclude payment modal trigger "pay now" and sidebar links
            if (matchesText && target.id !== 'pay-now-btn' && !target.closest('#payment-modal')) {
                e.preventDefault();
                e.stopPropagation();

                let courseTitle = "";
                
                // Try to find course title
                if (target.dataset.courseName) {
                    courseTitle = target.dataset.courseName;
                } else {
                    const card = target.closest('.course-card, .popular-slide, .series-card, .course-info-box');
                    if (card) {
                        const titleEl = card.querySelector('.course-title, .course-main-title, h2, h3');
                        if (titleEl) {
                            courseTitle = titleEl.innerText.trim();
                        }
                    }
                }

                if (!courseTitle) {
                    courseTitle = "General Banking Batch";
                }

                openEnrollmentLeadModal(courseTitle);
                return;
            }
        }

        // 2. Modal close buttons click
        if (e.target.id === 'modal-close' || e.target.id === 'enroll-success-close-btn') {
            closePreviewModal();
            return;
        }

        // 3. Click outside modal content to close
        const courseModal = document.getElementById('course-modal');
        if (e.target === courseModal) {
            closePreviewModal();
        }
    });

    // Clear validation error highlights as user types
    document.addEventListener('input', (e) => {
        const id = e.target.id;
        if (id === 'enroll-name' || id === 'enroll-phone' || id === 'enroll-email') {
            e.target.classList.remove('error-input');
            const inlineErr = e.target.parentElement.querySelector('.inline-error');
            if (inlineErr) inlineErr.classList.add('hidden');
        }
    });

    // Handle enrollment form submission
    document.addEventListener('submit', async (e) => {
        if (e.target.id !== 'enroll-lead-form') return;
        e.preventDefault();

        const enrollForm = e.target;
        const enrollFormContainer = document.getElementById('enroll-form-container');
        const enrollSuccessContainer = document.getElementById('enroll-success-container');
        const successToast = document.getElementById('enroll-success-toast');
        const errorToast = document.getElementById('enroll-error-toast');
        const submitBtn = document.getElementById('enroll-submit-btn');
        const submitBtnText = submitBtn ? submitBtn.querySelector('span') : null;

        if (successToast) successToast.classList.add('hidden');
        if (errorToast) errorToast.classList.add('hidden');

        const enrollNameEl = document.getElementById('enroll-name');
        const enrollPhoneEl = document.getElementById('enroll-phone');
        const enrollEmailEl = document.getElementById('enroll-email');
        const enrollCourseNameEl = document.getElementById('enroll-course-name');

        const inputsToValidate = [
            { el: enrollNameEl, validate: val => val.length >= 2, errorMsg: "Name must be at least 2 characters." },
            { el: enrollPhoneEl, validate: val => /^\d{10,}$/.test(val.replace(/\D/g, '')), errorMsg: "Phone number must be at least 10 digits." },
            { el: enrollEmailEl, validate: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), errorMsg: "Please enter a valid email address." }
        ];

        let isValid = true;
        inputsToValidate.forEach(input => {
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

        if (!isValid) return;

        const name = enrollNameEl.value.trim();
        const phone = enrollPhoneEl.value.trim();
        const email = enrollEmailEl.value.trim();
        const courseName = enrollCourseNameEl.value;
        
        const timestamp = new Date().toLocaleString();
        const templateParams = {
            name: name,
            phone: phone,
            email: email,
            course_name: courseName,
            subject: `New Enrollment Inquiry - ${courseName}`,
            page_url: window.location.href,
            inquiry_source: `Course Enrollment Lead`,
            timestamp: timestamp
        };

        // Disable submit button & show sending state
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
                phone: phone,
                email: email,
                course_name: courseName,
                page_url: window.location.href,
                timestamp: timestamp
            });
            localStorage.setItem('quasibanking_failed_inquiries', JSON.stringify(failedList));

            if (errorToast) {
                const errMsg = err ? (err.message || err.text || JSON.stringify(err)) : "EmailJS config missing or SDK failed to load";
                errorToast.innerHTML = `<i class="fas fa-exclamation-circle"></i> Unable to send message right now. (Detail: ${escapeHtml(errMsg)}). Please try again or contact us via WhatsApp.`;
                errorToast.classList.remove('hidden');
            }
        };

        const triggerSuccessAndRedirect = () => {
            // Hide form container and show success container
            if (enrollFormContainer) enrollFormContainer.classList.add('hidden');
            if (enrollSuccessContainer) enrollSuccessContainer.classList.remove('hidden');
            
            const successDesc = document.getElementById('enroll-success-desc');
            if (successDesc) {
                successDesc.textContent = "Redirecting you to the course portal...";
            }
            
            enrollForm.reset();

            // Set delay (e.g. 1200ms) before opening the course link in a new tab and closing the modal
            setTimeout(() => {
                window.open("https://www.quasibankingclasses.com/new-courses/2?source=website", "_blank");
                closePreviewModal();
            }, 1200);
        };

        try {
            const emailjs = await loadEmailJS();
            const keysConfigured = EMAIL_CONFIG.SERVICE_ID && EMAIL_CONFIG.TEMPLATE_ID && EMAIL_CONFIG.PUBLIC_KEY;
            
            if (emailjs && keysConfigured) {
                await emailjs.send(EMAIL_CONFIG.SERVICE_ID, EMAIL_CONFIG.TEMPLATE_ID, templateParams, {
                    publicKey: EMAIL_CONFIG.PUBLIC_KEY
                });
                triggerSuccessAndRedirect();
            } else {
                console.warn("EmailJS not configured or failed to load. Saving lead to localStorage.");
                handleFailure("EmailJS SDK not loaded or keys are missing.");
                triggerSuccessAndRedirect();
            }
        } catch (err) {
            console.error("EmailJS lead capture failed:", err);
            handleFailure(err);
            triggerSuccessAndRedirect();
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                if (submitBtnText) submitBtnText.innerHTML = 'Submit Inquiry & Enroll';
            }
        }
    });
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
