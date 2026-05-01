// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyD1_lHiHPGrcLC4chuwgydnMN1an5HMFpY",
    authDomain: "qualisbankingclass.firebaseapp.com",
    projectId: "qualisbankingclass",
    storageBucket: "qualisbankingclass.firebasestorage.app",
    messagingSenderId: "327531054214",
    appId: "1:327531054214:web:4e56ace39451038a8afd07",
    measurementId: "G-PY7YJ848XS"
};

// Initialize Firebase (Compat)
let auth;
try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    auth = firebase.auth();
    console.log("Firebase initialized successfully.");
} catch (error) {
    console.error("Firebase initialization failed:", error);
}

// --- UI LOGIC ---
let isLoginMode = true;
const formTitle = document.getElementById('form-title');
const formSubtitle = document.getElementById('form-subtitle');
const submitBtn = document.getElementById('submit-btn');
const btnLogin = document.getElementById('btn-login');
const btnSignup = document.getElementById('btn-signup');
const footerText = document.getElementById('footer-text');
const errorDisplay = document.getElementById('error-display');

function toggleMode(login) {
    isLoginMode = login;
    if (errorDisplay) errorDisplay.style.display = 'none';
    
    if (isLoginMode) {
        if (formTitle) formTitle.innerText = "Welcome Back";
        if (formSubtitle) formSubtitle.innerText = "Please enter your details to continue.";
        if (submitBtn) submitBtn.innerText = "Login to Account";
        if (btnLogin) btnLogin.classList.add('active');
        if (btnSignup) btnSignup.classList.remove('active');
        if (footerText) footerText.innerHTML = `Don't have an account? <a href="#" onclick="toggleMode(false)" style="color: var(--accent-color); font-weight: 600; text-decoration: none;">Sign Up</a>`;
    } else {
        if (formTitle) formTitle.innerText = "Create Account";
        if (formSubtitle) formSubtitle.innerText = "Join us to start your preparation.";
        if (submitBtn) submitBtn.innerText = "Create Free Account";
        if (btnSignup) btnSignup.classList.add('active');
        if (btnLogin) btnLogin.classList.remove('active');
        if (footerText) footerText.innerHTML = `Already have an account? <a href="#" onclick="toggleMode(true)" style="color: var(--accent-color); font-weight: 600; text-decoration: none;">Login</a>`;
    }
}

if (btnLogin) btnLogin.onclick = () => toggleMode(true);
if (btnSignup) btnSignup.onclick = () => toggleMode(false);

window.toggleMode = toggleMode; 

// --- AUTHENTICATION FLOW ---
const authForm = document.getElementById('auth-form');
if (authForm) {
    authForm.onsubmit = async (e) => {
        e.preventDefault();
        
        if (!auth) {
            showError("<b>Configuration Missing:</b> Firebase failed to initialize. Please check your internet connection.");
            return;
        }

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (errorDisplay) errorDisplay.style.display = 'none';
        submitBtn.disabled = true;
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        try {
            if (isLoginMode) {
                await auth.signInWithEmailAndPassword(email, password);
            } else {
                await auth.createUserWithEmailAndPassword(email, password);
            }
            // SUCCESS
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Success! Redirecting...';
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 800);
        } catch (error) {
            console.error("Auth Error:", error.code);
            showError(formatAuthError(error.code));
            submitBtn.disabled = false;
            submitBtn.innerText = originalBtnText;
        }
    };
}

function showError(msg) {
    if (errorDisplay) {
        errorDisplay.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${msg}`;
        errorDisplay.style.display = 'block';
    } else {
        alert(msg);
    }
}

function formatAuthError(code) {
    switch (code) {
        case 'auth/user-not-found':
            return '<b>Account not found.</b> Click "Sign Up" above to create an account.';
        case 'auth/wrong-password':
            return 'Incorrect password. Try again.';
        case 'auth/email-already-in-use':
            return 'This email is already registered. Try logging in.';
        case 'auth/weak-password':
            return 'Password is too weak (min 6 characters).';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your internet connection.';
        case 'auth/configuration-not-found':
            return 'Firebase Configuration Error: Please ensure you have enabled <b>Email/Password</b> authentication in your Firebase Console under "Authentication" -> "Sign-in method".';
        default:
            return `Error: ${code.replace('auth/', '').replace(/-/g, ' ')}`;
    }
}