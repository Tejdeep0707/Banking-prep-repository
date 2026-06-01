import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    onAuthStateChanged,
} from 'firebase/auth';
import { auth, authReady } from './firebase-app.js';

/* ── Constants ──────────────────────────────────────────── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_SUBMIT_GAP_MS = 3000;
const MAX_ATTEMPTS_PER_MIN = 8;

/* ── State ──────────────────────────────────────────────── */
let isLoginMode = true;
let lastSubmitAt = 0;
let attemptsThisMinute = 0;
let minuteWindowStart = Date.now();

const getEl = (id) => document.getElementById(id);

/* ── UI Helpers ─────────────────────────────────────────── */
function showError(msg) {
    const el = getEl('error-display');
    const success = getEl('success-display');
    if (success) success.style.display = 'none';
    el.innerHTML = msg;
    el.style.display = 'block';
}

function showSuccess(msg) {
    const el = getEl('success-display');
    const error = getEl('error-display');
    if (error) error.style.display = 'none';
    el.innerHTML = msg;
    el.style.display = 'block';
}

function clearMessages() {
    getEl('error-display').style.display = 'none';
    getEl('success-display').style.display = 'none';
}

function setFieldError(id, msg) {
    const el = getEl(id);
    if (el) el.textContent = msg || '';
}

function setLoading(active, text = 'Processing...') {
    const overlay = getEl('auth-loading');
    const card = getEl('auth-card');
    const form = getEl('auth-form');
    const forgotForm = getEl('forgot-form');
    const submitBtn = getEl('submit-btn');
    const resetBtn = getEl('reset-submit-btn');

    if (overlay) {
        overlay.hidden = !active;
        overlay.setAttribute('aria-hidden', String(!active));
        getEl('loading-text').textContent = text;
    }
    if (card) card.classList.toggle('is-loading', active);
    if (form) form.querySelectorAll('input, button').forEach((el) => { el.disabled = active; });
    if (forgotForm) forgotForm.querySelectorAll('input, button').forEach((el) => { el.disabled = active; });
    if (submitBtn) submitBtn.disabled = active;
    if (resetBtn) resetBtn.disabled = active;
}

function checkThrottle() {
    const now = Date.now();
    if (now - minuteWindowStart > 60_000) {
        minuteWindowStart = now;
        attemptsThisMinute = 0;
    }
    attemptsThisMinute += 1;
    if (attemptsThisMinute > MAX_ATTEMPTS_PER_MIN) {
        showError('Too many attempts. Please wait a minute and try again.');
        return false;
    }
    if (now - lastSubmitAt < MIN_SUBMIT_GAP_MS) {
        showError('Please wait a few seconds before trying again.');
        return false;
    }
    lastSubmitAt = now;
    return true;
}

/* ── Validation ─────────────────────────────────────────── */
function validateEmail(email) {
    if (!email) return 'Email is required.';
    if (!EMAIL_RE.test(email)) return 'Enter a valid email address.';
    return '';
}

function getPasswordChecks(password) {
    return {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    };
}

function validatePassword(password, forSignup) {
    if (!password) return 'Password is required.';
    if (!forSignup) return '';

    const checks = getPasswordChecks(password);
    if (!checks.length) return 'Password must be at least 8 characters.';
    if (!checks.upper) return 'Include at least one uppercase letter.';
    if (!checks.lower) return 'Include at least one lowercase letter.';
    if (!checks.special) return 'Include at least one special character.';
    return '';
}

function updatePasswordRules(password) {
    const list = getEl('password-rules');
    if (!list) return;
    const checks = getPasswordChecks(password);
    list.querySelectorAll('li').forEach((li) => {
        const rule = li.dataset.rule;
        li.classList.toggle('valid', Boolean(checks[rule]));
    });
}

/** Map Firebase error codes to user-friendly messages */
function formatAuthError(code) {
    const map = {
        'auth/user-not-found': 'No account found with this email. Switch to <strong>Sign Up</strong> to create one!',
        'auth/wrong-password': 'Incorrect password. Try again or click <strong>Forgot Password</strong>.',
        'auth/invalid-credential': 'Invalid email or password. Please check and try again.',
        'auth/email-already-in-use': 'This email is already registered. Switch to <strong>Login</strong> to sign in!',
        'auth/weak-password': 'Password is too weak. Use at least 6 characters with a mix of letters and symbols.',
        'auth/invalid-email': 'Invalid email address format.',
        'auth/too-many-requests': 'Too many failed attempts. Your account has been temporarily locked. Please try again later or reset your password.',
        'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
        'auth/user-disabled': 'This account has been disabled. Please contact support.',
        'auth/operation-not-allowed': 'Email/Password sign-in is not enabled. Please contact the administrator.',
        'auth/requires-recent-login': 'Please log in again to complete this action.',
    };
    return map[code] || `Something went wrong (${code || 'unknown'}). Please try again.`;
}

/* ── View Toggles ───────────────────────────────────────── */
function showAuthForm() {
    getEl('auth-form').hidden = false;
    getEl('forgot-form').hidden = true;
    getEl('auth-toggle').hidden = false;
    getEl('footer-text').hidden = false;
    getEl('form-title').hidden = false;
    getEl('form-subtitle').hidden = false;
    clearMessages();
}

function showForgotForm() {
    getEl('auth-form').hidden = true;
    getEl('forgot-form').hidden = false;
    getEl('auth-toggle').hidden = true;
    getEl('footer-text').hidden = true;
    getEl('form-title').textContent = 'Reset Password';
    getEl('form-subtitle').textContent = 'We will email you a secure reset link.';
    getEl('form-title').hidden = false;
    getEl('form-subtitle').hidden = false;
    const resetEmail = getEl('email').value.trim();
    if (resetEmail) getEl('reset-email').value = resetEmail;
    clearMessages();
}

function toggleMode(login) {
    isLoginMode = login;
    clearMessages();
    setFieldError('email-error', '');
    setFieldError('password-error', '');

    getEl('form-title').textContent = login ? 'Welcome Back' : 'Create Account';
    getEl('form-subtitle').textContent = login
        ? 'Please enter your details to continue.'
        : 'Create your account to start preparing.';
    getEl('submit-label').textContent = login ? 'Login to Account' : 'Create Account';
    getEl('btn-login').classList.toggle('active', login);
    getEl('btn-signup').classList.toggle('active', !login);
    getEl('forgot-password-link').hidden = !login;
    getEl('password-rules').hidden = login;

    const footer = getEl('footer-text');
    footer.innerHTML = login
        ? `Don't have an account? <a href="#" id="footer-toggle-link">Create one</a>`
        : `Already have an account? <a href="#" id="footer-toggle-link">Login</a>`;
    bindFooterToggle();
    getEl('password').autocomplete = login ? 'current-password' : 'new-password';
}

function bindFooterToggle() {
    const link = getEl('footer-toggle-link');
    if (!link) return;
    link.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMode(!isLoginMode);
    });
}

/* ── Initialization ─────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    if (!getEl('auth-form')) return;

    // Wait for Firebase to be ready
    authReady
        .then(() => {
            // If user is already signed in, redirect immediately
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                unsubscribe(); // Only check once on page load
                if (user) {
                    window.location.href = 'index.html';
                    return;
                }
                setupAuthPage();
            });
        })
        .catch((err) => {
            console.error('Firebase auth init failed:', err);
            // Still set up the page; errors will surface on submit
            setupAuthPage();
        });
});

function setupAuthPage() {
    getEl('btn-login').addEventListener('click', () => toggleMode(true));
    getEl('btn-signup').addEventListener('click', () => toggleMode(false));
    bindFooterToggle();

    getEl('forgot-password-link').addEventListener('click', showForgotForm);
    getEl('back-to-login').addEventListener('click', () => {
        showAuthForm();
        toggleMode(true);
    });

    getEl('toggle-password').addEventListener('click', () => {
        const input = getEl('password');
        const icon = getEl('toggle-password-icon');
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        icon.classList.toggle('fa-eye', !show);
        icon.classList.toggle('fa-eye-slash', show);
        getEl('toggle-password').setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    });

    getEl('password').addEventListener('input', (e) => {
        if (!isLoginMode) updatePasswordRules(e.target.value);
    });

    getEl('auth-form').addEventListener('submit', handleAuthSubmit);
    getEl('forgot-form').addEventListener('submit', handleForgotSubmit);

    toggleMode(true);
}

/* ── Auth Submit (Login / Sign Up) ──────────────────────── */
async function handleAuthSubmit(e) {
    e.preventDefault();
    clearMessages();

    const email = getEl('email').value.trim();
    const password = getEl('password').value;
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password, !isLoginMode);

    getEl('email').classList.toggle('input-invalid', Boolean(emailErr));
    getEl('password').classList.toggle('input-invalid', Boolean(passErr));
    setFieldError('email-error', emailErr);
    setFieldError('password-error', passErr);

    if (emailErr || passErr) return;
    if (!checkThrottle()) return;

    if (isLoginMode) {
        /* ── LOGIN ──────────────────────────────────────── */
        setLoading(true, 'Signing you in...');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store display info for UI state (NO passwords stored!)
            localStorage.setItem('quasibanking_resources_unlocked', 'true');
            localStorage.setItem('quasibanking_user_details', JSON.stringify({
                name: user.displayName || email.split('@')[0],
                email: user.email,
                uid: user.uid,
                exam: 'SBI PO',
                timestamp: Date.now(),
            }));

            setLoading(true, 'Success! Redirecting...');
            setTimeout(() => { window.location.href = 'index.html'; }, 800);

        } catch (error) {
            setLoading(false);
            showError(formatAuthError(error.code));

            // Highlight the relevant field based on error type
            if (['auth/user-not-found', 'auth/invalid-email'].includes(error.code)) {
                getEl('email').classList.add('input-invalid');
            } else if (['auth/wrong-password', 'auth/weak-password'].includes(error.code)) {
                getEl('password').classList.add('input-invalid');
            } else {
                // For generic errors like invalid-credential, highlight both
                getEl('email').classList.add('input-invalid');
                getEl('password').classList.add('input-invalid');
            }
        }
    } else {
        /* ── SIGN UP ────────────────────────────────────── */
        setLoading(true, 'Creating your account...');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Send email verification (non-blocking)
            try {
                await sendEmailVerification(user);
            } catch (verifyErr) {
                console.warn('Email verification send failed:', verifyErr);
            }

            // Store display info for UI state
            localStorage.setItem('quasibanking_resources_unlocked', 'true');
            localStorage.setItem('quasibanking_user_details', JSON.stringify({
                name: user.displayName || email.split('@')[0],
                email: user.email,
                uid: user.uid,
                exam: 'SBI PO',
                timestamp: Date.now(),
            }));

            setLoading(true, 'Account created! Redirecting...');
            showSuccess('🎉 Account created successfully! Redirecting to home...');
            setTimeout(() => { window.location.href = 'index.html'; }, 1500);

        } catch (error) {
            setLoading(false);
            showError(formatAuthError(error.code));

            if (['auth/email-already-in-use', 'auth/invalid-email'].includes(error.code)) {
                getEl('email').classList.add('input-invalid');
            } else if (['auth/weak-password'].includes(error.code)) {
                getEl('password').classList.add('input-invalid');
            }
        }
    }
}

/* ── Forgot Password Submit ─────────────────────────────── */
async function handleForgotSubmit(e) {
    e.preventDefault();
    clearMessages();

    const email = getEl('reset-email').value.trim();
    const emailErr = validateEmail(email);
    getEl('reset-email').classList.toggle('input-invalid', Boolean(emailErr));
    setFieldError('reset-email-error', emailErr);
    if (emailErr) return;
    if (!checkThrottle()) return;

    setLoading(true, 'Sending reset link...');

    try {
        await sendPasswordResetEmail(auth, email);
        setLoading(false);
        showSuccess(`✉️ Reset link sent to <strong>${email}</strong>. Check your inbox (and spam folder)!`);
        getEl('reset-email').value = '';
    } catch (error) {
        setLoading(false);
        // For security, don't reveal if the email exists or not
        if (error.code === 'auth/user-not-found') {
            showSuccess(`✉️ If an account exists for <strong>${email}</strong>, a reset link has been sent. Check your inbox!`);
            getEl('reset-email').value = '';
        } else {
            showError(formatAuthError(error.code));
        }
    }
}
