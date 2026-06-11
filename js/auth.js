import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, authReady } from '../firebase-app.js';
import { fetchUserStats } from './dashboard.js';
import { escapeHtml } from './security-utils.js';

// DOM Elements Cache
const elements = {
    getWelcomeMsg: () => document.getElementById('welcome-msg'),
    getHeaderAuthBtn: () => document.getElementById('header-auth-btn'),
    getStatsSection: () => document.getElementById('user-stats'),
};

function initAuthState() {
    onAuthStateChanged(auth, async (user) => {
        const welcomeMsg = elements.getWelcomeMsg();
        const headerAuthBtn = elements.getHeaderAuthBtn();
        const statsSection = elements.getStatsSection();
        const sidebarAvatar = document.getElementById('sidebar-avatar');
        const sidebarUsername = document.getElementById('sidebar-username');
        const sidebarLogoutBtn = document.getElementById('sidebar-logout-btn');

        if (user) {
            const userName = user.displayName || (user.email ? user.email.split('@')[0] : 'aspirant');
            const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);

            // Sync localStorage user details from Firebase (source of truth)
            localStorage.setItem('quasibanking_resources_unlocked', 'true');
            const existingDetails = (() => {
                try { return JSON.parse(localStorage.getItem('quasibanking_user_details') || '{}'); }
                catch { return {}; }
            })();
            localStorage.setItem('quasibanking_user_details', JSON.stringify({
                name: displayName,
                email: user.email,
                uid: user.uid,
                exam: existingDetails.exam || 'SBI PO',
                timestamp: existingDetails.timestamp || Date.now(),
            }));

            if (welcomeMsg && !document.getElementById('user-greeting')) {
                welcomeMsg.insertAdjacentHTML('beforebegin', `<p id="user-greeting" style="color: var(--primary-color); font-weight: 700; margin-bottom: 10px; font-size: 1.1rem; animation: fadeIn 1s ease;">Hi, ${escapeHtml(displayName)} 👋</p>`);
            }

            if (headerAuthBtn) {
                headerAuthBtn.innerHTML = `
                    <div class="profile-dropdown-container">
                        <button id="top-profile-avatar-btn" class="profile-avatar-btn" aria-haspopup="true" aria-expanded="false">
                            <span class="avatar-letter" id="top-avatar-letter">${escapeHtml(displayName.charAt(0))}</span>
                            <span class="avatar-status-ring"></span>
                        </button>
                        <div id="profile-popover-panel" class="profile-popover-panel">
                            <div class="popover-profile-card">
                                <div class="popover-avatar" id="top-avatar-popup">${escapeHtml(displayName.charAt(0))}</div>
                                <div class="popover-profile-info">
                                    <span class="popover-username" id="top-username">${escapeHtml(displayName)}</span>
                                    <span class="popover-role">Student</span>
                                </div>
                            </div>
                            

                            <div class="popover-actions">
                                <button id="top-logout-btn" class="popover-action-btn logout-btn" onclick="handleLogout()" title="Logout">
                                    <i class="fas fa-sign-out-alt"></i>
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }

            if (sidebarAvatar) sidebarAvatar.textContent = displayName.charAt(0).toUpperCase();
            if (sidebarUsername) sidebarUsername.textContent = displayName;
            if (sidebarLogoutBtn) sidebarLogoutBtn.classList.remove('hidden');

            if (statsSection) {
                statsSection.classList.remove('hidden');
            }
            fetchUserStats(user.uid);

            if (typeof window.initSidebarStats === 'function') {
                window.initSidebarStats();
            }
        } else {
            // User is signed out — clean up UI and localStorage
            const greeting = document.getElementById('user-greeting');
            if (greeting) greeting.remove();

            if (headerAuthBtn) {
                headerAuthBtn.innerHTML = `<a href="auth.html" class="btn btn-primary btn-login-icon" title="Login"><i class="fas fa-user"></i></a>`;
            }

            if (sidebarAvatar) sidebarAvatar.textContent = 'G';
            if (sidebarUsername) sidebarUsername.textContent = 'Guest Aspirant';
            if (sidebarLogoutBtn) sidebarLogoutBtn.classList.add('hidden');

            fetchUserStats(null);
        }
    });
}

function handleLogout() {
    // Clear all user-specific storage keys
    const userKeys = [
        'quasibanking_enrolled_courses',
        'quasibanking_user_details',
        'quasibanking_resources_unlocked',
        'quasibanking_activities',
        'quasibanking_streak',
        'quasibanking_best_streak',
        'quasibanking_last_streak_date',
        'quasibanking_mocks_completed',
        'quasibanking_accuracy',
        'quasibanking_quiz_accuracy',
        'quasibanking_saved_articles',
        'quasibanking_saved_articles_meta',
        'quasibanking_recent_articles',
        'quasibanking_notifications',
        'quasibanking_saved_resources',
        'quasibanking_registered_users', // Clean up legacy plain-text user DB
    ];
    userKeys.forEach(key => localStorage.removeItem(key));

    signOut(auth).then(() => {
        window.location.href = 'auth.html';
    }).catch((error) => console.error('Logout Error:', error));
}

// Bind to window for compatibility with any legacy inline onclick code if present
window.handleLogout = handleLogout;

function initAuth() {
    authReady.then(initAuthState).catch((err) => console.error('Auth init failed:', err));
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
} else {
    initAuth();
}
