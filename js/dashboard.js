// DOM elements cache (dynamically checked since they might not be on subpages)
const getStatsSection = () => document.getElementById('command-center-drawer');
const getStatCourses = () => document.getElementById('sidebar-stat-courses');

const drawerHtml = `
<div id="command-center-drawer-overlay" class="drawer-overlay hidden"></div>
<div id="command-center-drawer" class="dashboard-drawer hidden">
    <div class="drawer-header">
        <h3 class="drawer-title"><i class="fas fa-terminal text-indigo-500"></i> Student Command Center</h3>
        <button id="drawer-close-btn" class="drawer-close-btn" aria-label="Close Dashboard">&times;</button>
    </div>
    <div class="drawer-scroll-container">
        <!-- Onboarding Panel (Visible for Guests or New Users) -->
        <div id="ca-onboarding-panel" class="onboarding-card card-glass mb-6 hidden">
            <div class="onboarding-header">
                <i class="fas fa-rocket text-indigo-400 animate-bounce"></i>
                <h3>Welcome to QuasiBanking! Let's kickstart your prep</h3>
            </div>
            <p class="onboarding-desc">Unlock officer scales by establishing consistency. Complete these quick milestones to activate your command stats:</p>
            <div class="onboarding-steps-grid">
                <a href="#courses" class="onboarding-step-item">
                    <div class="step-icon"><i class="fas fa-book-open"></i></div>
                    <span>Start Your First Course</span>
                </a>
                <a href="#" class="onboarding-step-item" id="onboard-mock-btn">
                    <div class="step-icon"><i class="fas fa-file-signature"></i></div>
                    <span>Attempt Your First Mock</span>
                </a>
                <a href="current-affairs.html" class="onboarding-step-item">
                    <div class="step-icon"><i class="fas fa-newspaper"></i></div>
                    <span>Read Today's Current Affairs</span>
                </a>
            </div>
        </div>

        <!-- AI Preparation Insights Card -->
        <div class="insights-card card-glass mb-6" id="ca-ai-insights">
            <div class="insights-header">
                <i class="fas fa-brain text-purple-400"></i>
                <span class="insights-title">AI Performance Insights</span>
                <span class="insights-badge">Live Analysis</span>
            </div>
            <p class="insights-text" id="insights-content-text">Loading personalized preparation metrics... Study consistently to generate AI insights.</p>
        </div>

        <!-- Study Streak Card -->
        <div class="streak-cc-card card-glass mb-6" id="ca-streak-card">
            <div class="streak-flame-container">
                <i class="fas fa-fire flame-pulse-cc"></i>
            </div>
            <div class="streak-data-row mt-4">
                <div class="streak-data-item">
                    <span class="streak-label">Current Streak</span>
                    <span class="streak-val" id="cc-current-streak-val">0 Days</span>
                </div>
                <div class="streak-divider-line"></div>
                <div class="streak-data-item">
                    <span class="streak-label">Best Streak</span>
                    <span class="streak-val" id="cc-best-streak-val">0 Days</span>
                </div>
            </div>
        </div>

        <!-- Quick Actions Row -->
        <div class="quick-actions-row card-glass mb-6" id="ca-quick-actions">
            <h4 class="quick-title">Quick Navigation</h4>
            <div class="quick-actions-grid-cc">
                <a href="#courses" class="cc-action-btn"><i class="fas fa-search"></i> Browse Courses</a>
                <a href="#" class="cc-action-btn" id="cc-mock-btn"><i class="fas fa-stopwatch"></i> Take Mock Test</a>
                <a href="current-affairs.html" class="cc-action-btn"><i class="fas fa-newspaper"></i> Current Affairs</a>
                <a href="notifications.html" class="cc-action-btn"><i class="fas fa-bell"></i> Notifications</a>
                <a href="resources.html" class="cc-action-btn"><i class="fas fa-folder-open"></i> Resources</a>
            </div>
        </div>

        <!-- Target Exam Tracker -->
        <div class="tracker-card card-glass mb-6" id="ca-exam-tracker">
            <div class="tracker-header mb-4">
                <h4>Target: <span class="text-indigo-400 font-bold" id="tracker-target-name">IBPS PO 2026</span></h4>
                <span class="tracker-percent-val" id="tracker-aggregate-progress">0% Complete</span>
            </div>
            <div class="tracker-progress-wrapper mb-6">
                <div class="progress-bar">
                    <div id="tracker-progress-fill" class="progress-bar-fill" style="width: 0%"></div>
                </div>
            </div>
            <div class="tracker-metrics-grid">
                <div class="tracker-metric-item">
                    <span class="metric-label">Topics Completed</span>
                    <span class="metric-val" id="tracker-topics-val">0 / 25</span>
                </div>
                <div class="tracker-metric-item">
                    <span class="metric-label">Mocks Completed</span>
                    <span class="metric-val" id="tracker-mocks-val">0 / 20</span>
                </div>
                <div class="tracker-metric-item">
                    <span class="metric-label">Current Affairs Read</span>
                    <span class="metric-val" id="tracker-ca-val">0%</span>
                </div>
            </div>
        </div>

        <!-- Weekly Performance Chart Section -->
        <div class="chart-card card-glass mb-6" id="ca-weekly-chart">
            <div class="chart-header-row mb-6">
                <h4 class="chart-title"><i class="fas fa-chart-bar text-indigo-400"></i> Weekly Performance</h4>
                <div class="chart-tabs">
                    <button class="chart-tab-btn active" data-metric="questions">Questions</button>
                    <button class="chart-tab-btn" data-metric="study">Study Time</button>
                    <button class="chart-tab-btn" data-metric="accuracy">Accuracy</button>
                </div>
            </div>
            <!-- Responsive SVG Chart container -->
            <div class="svg-chart-container" id="svg-chart-container-box">
                <!-- Populated dynamically by JS -->
            </div>
        </div>

        <!-- Achievements System Widget -->
        <div class="achievements-widget card-glass mb-6" id="ca-achievements-widget">
            <h4 class="card-glass-title mb-4"><i class="fas fa-award text-yellow-400"></i> Achievements</h4>
            <div class="achievements-badge-grid">
                <!-- Badge 1: First Mock -->
                <div class="achievement-badge-card locked" id="badge-mock" title="Complete your first Mock Test to unlock.">
                    <div class="badge-graphic"><i class="fas fa-file-alt"></i></div>
                    <span class="badge-name">First Mock</span>
                    <span class="badge-status">Locked</span>
                </div>
                <!-- Badge 2: 7 Day Streak -->
                <div class="achievement-badge-card locked" id="badge-streak" title="Maintain a 7-day study streak to unlock.">
                    <div class="badge-graphic"><i class="fas fa-fire"></i></div>
                    <span class="badge-name">7 Day Fire</span>
                    <span class="badge-status">Locked</span>
                </div>
                <!-- Badge 3: Current Affairs Explorer -->
                <div class="achievement-badge-card locked" id="badge-affairs" title="Bookmark at least 3 Current Affairs articles to unlock.">
                    <div class="badge-graphic"><i class="fas fa-newspaper"></i></div>
                    <span class="badge-name">GA Explorer</span>
                    <span class="badge-status">Locked</span>
                </div>
                <!-- Badge 4: Accuracy >80% -->
                <div class="achievement-badge-card locked" id="badge-accuracy" title="Achieve an accuracy score of 80% or above in the Daily Quiz.">
                    <div class="badge-graphic"><i class="fas fa-check-double"></i></div>
                    <span class="badge-name">High Accur</span>
                    <span class="badge-status">Locked</span>
                </div>
            </div>
        </div>

        <!-- Continue Learning & Recent Activity -->
        <div class="continue-card card-glass mb-6" id="ca-continue-learning">
            <h4 class="card-glass-title mb-4"><i class="fas fa-play-circle text-indigo-400"></i> Continue Learning</h4>
            <div id="continue-course-content">
                <p class="text-slate-400 text-sm mb-4">No active course in progress. Start an enrolled course below.</p>
                <a href="#courses" class="btn btn-outline w-full text-center">Browse Courses</a>
            </div>
        </div>

        <div class="activity-card card-glass mb-6" id="ca-recent-activity">
            <h4 class="card-glass-title mb-4"><i class="fas fa-history text-cyan-400"></i> Recent Activity</h4>
            <div class="activity-timeline-wrapper" id="timeline-list-container">
                <div class="timeline-empty">No recent activity logged.</div>
            </div>
        </div>

        <!-- Leaderboard Preview -->
        <div class="leaderboard-widget card-glass mb-6" id="ca-leaderboard-preview">
            <h4 class="card-glass-title mb-4"><i class="fas fa-users text-indigo-400"></i> Top 5 Aspirants</h4>
            <div class="leaderboard-list-cc">
                <div class="leaderboard-row-cc pos-1">
                    <span class="rank-badge">1</span>
                    <span class="student-name">Rahul Sharma</span>
                    <span class="student-score">95% Acc</span>
                </div>
                <div class="leaderboard-row-cc pos-2">
                    <span class="rank-badge">2</span>
                    <span class="student-name">Priya Patel</span>
                    <span class="student-score">92% Acc</span>
                </div>
                <div class="leaderboard-row-cc pos-3">
                    <span class="rank-badge">3</span>
                    <span class="student-name">Arjun Singh</span>
                    <span class="student-score">90% Acc</span>
                </div>
                <div class="leaderboard-row-cc">
                    <span class="rank-badge">4</span>
                    <span class="student-name">Sneha Reddy</span>
                    <span class="student-score">89% Acc</span>
                </div>
                <div class="leaderboard-row-cc">
                    <span class="rank-badge">5</span>
                    <span class="student-name">Vivek Gupta</span>
                    <span class="student-score">87% Acc</span>
                </div>
            </div>
            <a href="interview.html" class="btn btn-outline w-full text-center mt-4 py-2 font-semibold cc-action-btn-ranks" style="font-size: 0.8rem; border-radius: 8px;">
                <span>View Full Rankings</span> <i class="fas fa-chevron-right ml-1"></i>
            </a>
        </div>
    </div>
</div>
`;

// Animate values helper
export function animateValue(id, start, end, duration, isPercent = false) {
    const obj = document.getElementById(id);
    if (!obj) return;
    if (end === 0) {
        obj.textContent = "0" + (isPercent ? "%" : "");
        return;
    }

    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        obj.textContent = value + (isPercent ? "%" : "");
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Activity logger helper
export function logActivity(actionText) {
    let activities = [];
    try {
        activities = JSON.parse(localStorage.getItem('quasibanking_activities') || '[]');
    } catch (e) {
        activities = [];
    }
    
    if (activities.length > 0 && activities[0].text === actionText && Date.now() - activities[0].timestamp < 5000) {
        return;
    }

    activities.unshift({ text: actionText, timestamp: Date.now() });
    activities = activities.slice(0, 10);
    localStorage.setItem('quasibanking_activities', JSON.stringify(activities));
    
    renderActivities();
}

function getRelativeTimeString(timestamp) {
    const diff = Date.now() - timestamp;
    if (diff < 10000) return 'Just now';
    if (diff < 60000) {
        const secs = Math.floor(diff / 1000);
        return `${secs}s ago`;
    }
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

function renderActivities() {
    const container = document.getElementById('timeline-list-container');
    if (!container) return;

    let activities = [];
    try {
        activities = JSON.parse(localStorage.getItem('quasibanking_activities') || '[]');
    } catch (e) {
        activities = [];
    }

    if (activities.length === 0) {
        container.innerHTML = `<div class="timeline-empty">No recent activity logged.</div>`;
        return;
    }

    let html = '<div class="activity-timeline">';
    activities.forEach(act => {
        html += `
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content-wrapper">
                    <span class="timeline-text">${escapeHtml(act.text)}</span>
                    <span class="timeline-time" data-timestamp="${act.timestamp}">${getRelativeTimeString(act.timestamp)}</span>
                </div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
}

// Update streak calculator
function updateStreak() {
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    
    let currentStreak = parseInt(localStorage.getItem('quasibanking_streak') || '0', 10);
    let bestStreak = parseInt(localStorage.getItem('quasibanking_best_streak') || '0', 10);
    const lastStreakDate = localStorage.getItem('quasibanking_last_streak_date');

    if (!lastStreakDate) {
        currentStreak = 1;
        bestStreak = Math.max(bestStreak, 1);
        localStorage.setItem('quasibanking_streak', currentStreak.toString());
        localStorage.setItem('quasibanking_best_streak', bestStreak.toString());
        localStorage.setItem('quasibanking_last_streak_date', today);
        logActivity("🏠 Visited Student Command Center & started a study streak!");
    } else if (lastStreakDate !== today) {
        const d1 = new Date(today);
        const d2 = new Date(lastStreakDate);
        const diffTime = Math.abs(d1 - d2);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            currentStreak += 1;
            if (currentStreak > bestStreak) {
                bestStreak = currentStreak;
                localStorage.setItem('quasibanking_best_streak', bestStreak.toString());
            }
            localStorage.setItem('quasibanking_streak', currentStreak.toString());
            localStorage.setItem('quasibanking_last_streak_date', today);
            logActivity(`🔥 Maintained a ${currentStreak}-day learning streak!`);
        } else if (diffDays > 1) {
            currentStreak = 1;
            localStorage.setItem('quasibanking_streak', currentStreak.toString());
            localStorage.setItem('quasibanking_last_streak_date', today);
            logActivity("🔥 Started a new learning streak!");
        }
    }

    const currentStreakEl = document.getElementById('cc-current-streak-val');
    const bestStreakEl = document.getElementById('cc-best-streak-val');
    
    if (currentStreakEl) currentStreakEl.textContent = `${currentStreak} Days`;
    if (bestStreakEl) bestStreakEl.textContent = `${bestStreak} Days`;
}

// Achievements system checker
function checkAchievements() {
    const mocksCompleted = parseInt(localStorage.getItem('quasibanking_mocks_completed') || '0', 10);
    const currentStreak = parseInt(localStorage.getItem('quasibanking_streak') || '0', 10);
    
    let savedArticlesCount = 0;
    try {
        savedArticlesCount = JSON.parse(localStorage.getItem('quasibanking_saved_articles') || '[]').length;
    } catch (e) {}

    const accuracyVal = localStorage.getItem('quasibanking_accuracy') || localStorage.getItem('quasibanking_quiz_accuracy') || '0%';
    const accuracy = parseInt(accuracyVal, 10);

    const achievements = [
        { id: 'badge-mock', unlocked: mocksCompleted > 0 },
        { id: 'badge-streak', unlocked: currentStreak >= 7 },
        { id: 'badge-affairs', unlocked: savedArticlesCount >= 3 },
        { id: 'badge-accuracy', unlocked: accuracy >= 80 }
    ];

    achievements.forEach(badge => {
        const el = document.getElementById(badge.id);
        if (!el) return;

        const statusEl = el.querySelector('.badge-status');
        if (badge.unlocked) {
            if (el.classList.contains('locked')) {
                el.classList.remove('locked');
                el.classList.add('unlocked');
                if (statusEl) statusEl.textContent = 'Unlocked';
                logActivity(`🏆 Unlocked Achievement: ${el.querySelector('.badge-name')?.textContent || 'Milestone'}`);
            } else {
                el.classList.remove('locked');
                el.classList.add('unlocked');
                if (statusEl) statusEl.textContent = 'Unlocked';
            }
        } else {
            el.classList.add('locked');
            el.classList.remove('unlocked');
            if (statusEl) statusEl.textContent = 'Locked';
        }
    });
}

// Weekly Chart Rendering
const chartData = {
    questions: {
        values: [25, 45, 15, 60, 40, 85, 30],
        unit: '',
        colorStart: '#6366f1',
        colorEnd: 'rgba(99, 102, 241, 0.2)',
        hoverColor: '#818cf8',
        max: 100
    },
    study: {
        values: [45, 90, 30, 120, 75, 180, 60],
        unit: 'm',
        colorStart: '#06b6d4',
        colorEnd: 'rgba(6, 182, 212, 0.2)',
        hoverColor: '#22d3ee',
        max: 200
    },
    accuracy: {
        values: [70, 82, 65, 88, 75, 92, 80],
        unit: '%',
        colorStart: '#fbbf24',
        colorEnd: 'rgba(251, 191, 36, 0.2)',
        hoverColor: '#fbbf24',
        max: 100
    }
};

export function renderWeeklyChart(metric = 'questions') {
    const container = document.getElementById('svg-chart-container-box');
    if (!container) return;

    const config = chartData[metric];
    let values = [...config.values];
    if (metric === 'accuracy') {
        const accuracyVal = localStorage.getItem('quasibanking_accuracy') || localStorage.getItem('quasibanking_quiz_accuracy') || '0%';
        const accuracy = parseInt(accuracyVal, 10);
        if (accuracy > 0) {
            values[5] = accuracy;
            values[6] = Math.max(50, accuracy - 5);
        }
    } else if (metric === 'questions') {
        const mocksCompleted = parseInt(localStorage.getItem('quasibanking_mocks_completed') || '0', 10);
        if (mocksCompleted > 0) {
            values[5] = Math.min(100, values[5] + mocksCompleted * 10);
        }
    }

    const svgWidth = 600;
    const svgHeight = 250;
    const paddingLeft = 50;
    const paddingRight = 20;
    const paddingTop = 30;
    const paddingBottom = 40;
    
    const plotWidth = svgWidth - paddingLeft - paddingRight;
    const plotHeight = svgHeight - paddingTop - paddingBottom;
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const barSpacing = plotWidth / days.length;
    const barWidth = barSpacing * 0.55;
    
    let svgHtml = `
        <svg viewBox="0 0 ${svgWidth} ${svgHeight}" width="100%" height="100%" class="svg-chart-element">
            <defs>
                <linearGradient id="gradient-${metric}" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="${config.colorStart}" stop-opacity="1"/>
                    <stop offset="100%" stop-color="${config.colorEnd}" stop-opacity="0.15"/>
                </linearGradient>
            </defs>
    `;
    
    const numGridLines = 4;
    for (let i = 0; i <= numGridLines; i++) {
        const y = paddingTop + (plotHeight / numGridLines) * i;
        const value = Math.round(config.max - (config.max / numGridLines) * i);
        svgHtml += `
            <line x1="${paddingLeft}" y1="${y}" x2="${svgWidth - paddingRight}" y2="${y}" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1" />
            <text x="${paddingLeft - 10}" y="${y + 4}" fill="#94a3b8" font-size="11" font-weight="600" text-anchor="end">${value}${config.unit}</text>
        `;
    }
    
    for (let i = 0; i < days.length; i++) {
        const val = values[i];
        const barHeight = (val / config.max) * plotHeight;
        const x = paddingLeft + i * barSpacing + (barSpacing - barWidth) / 2;
        const y = paddingTop + plotHeight - barHeight;
        
        svgHtml += `
            <g class="chart-bar-group" data-val="${val}${config.unit}" data-day="${days[i]}">
                <rect x="${x - 5}" y="${paddingTop}" width="${barWidth + 10}" height="${plotHeight}" fill="transparent" class="bar-hitbox" />
                <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="url(#gradient-${metric})" rx="4" class="chart-bar-rect">
                    <animate attributeName="height" from="0" to="${barHeight}" dur="0.6s" fill="freeze" />
                    <animate attributeName="y" from="${paddingTop + plotHeight}" to="${y}" dur="0.6s" fill="freeze" />
                </rect>
                <g class="bar-value-tag" opacity="0">
                    <rect x="${x + barWidth/2 - 25}" y="${y - 30}" width="50" height="22" rx="4" fill="#0f172a" stroke="${config.colorStart}" stroke-width="1" />
                    <text x="${x + barWidth/2}" y="${y - 15}" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">${val}${config.unit}</text>
                </g>
                <text x="${x + barWidth / 2}" y="${svgHeight - 12}" fill="#94a3b8" font-size="11" font-weight="600" text-anchor="middle">${days[i]}</text>
            </g>
        `;
    }
    
    svgHtml += `</svg>`;
    container.innerHTML = svgHtml;
    
    const groups = container.querySelectorAll('.chart-bar-group');
    groups.forEach(g => {
        g.addEventListener('mouseenter', () => {
            const tag = g.querySelector('.bar-value-tag');
            if (tag) tag.setAttribute('opacity', '1');
            const rect = g.querySelector('.chart-bar-rect');
            if (rect) rect.setAttribute('fill', config.hoverColor);
        });
        g.addEventListener('mouseleave', () => {
            const tag = g.querySelector('.bar-value-tag');
            if (tag) tag.setAttribute('opacity', '0');
            const rect = g.querySelector('.chart-bar-rect');
            if (rect) rect.setAttribute('fill', `url(#gradient-${metric})`);
        });
    });
}

function initChartTabs() {
    const tabs = document.querySelectorAll('.chart-tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderWeeklyChart(tab.dataset.metric);
        });
    });
}

// Course metadata for rendering Continue Learning
const courseMetadata = {
    "SBI Victory Batch 2026: Prelims + Mains": {
        link: "course-sbi.html",
        progress: 45,
        topics: "11 / 25 Topics Completed"
    },
    "RBI Zenith Batch (Grade B) Phase 1 + 2": {
        link: "course-rbi.html",
        progress: 30,
        topics: "7 / 25 Topics Completed"
    },
    "IBPS PO 2026": {
        link: "course-ibps.html",
        progress: 60,
        topics: "15 / 25 Topics Completed"
    }
};

let lastCheckedEnrolledLength = -1;
function checkEnrollmentLogs(enrolledCourses) {
    if (lastCheckedEnrolledLength === -1) {
        lastCheckedEnrolledLength = enrolledCourses.length;
        return;
    }
    if (enrolledCourses.length > lastCheckedEnrolledLength) {
        const newCourse = enrolledCourses[enrolledCourses.length - 1];
        logActivity(`📚 Enrolled in course: ${newCourse}`);
        lastCheckedEnrolledLength = enrolledCourses.length;
    }
}

// Fetch user stats core driver
export async function fetchUserStats(userId) {
    const statsSection = getStatsSection();
    if (!statsSection) return;

    let enrolledCourses = [];
    try {
        enrolledCourses = JSON.parse(localStorage.getItem('quasibanking_enrolled_courses') || '[]');
    } catch (e) {
        enrolledCourses = [];
    }
    const mocksCompleted = parseInt(localStorage.getItem('quasibanking_mocks_completed') || '0', 10);
    const accuracyVal = localStorage.getItem('quasibanking_accuracy') || localStorage.getItem('quasibanking_quiz_accuracy') || '0%';
    
    let savedArticlesCount = 0;
    try {
        savedArticlesCount = JSON.parse(localStorage.getItem('quasibanking_saved_articles') || '[]').length;
    } catch (e) {}

    checkEnrollmentLogs(enrolledCourses);
    updateStreak();
    
    const currentStreak = parseInt(localStorage.getItem('quasibanking_streak') || '0', 10);

    const onboardingPanel = document.getElementById('ca-onboarding-panel');
    const aiInsightsPanel = document.getElementById('ca-ai-insights');
    
    if (enrolledCourses.length === 0) {
        if (onboardingPanel) onboardingPanel.classList.remove('hidden');
        updateTrackerUI(0, 0, 0, 'IBPS PO 2026');
        
        if (aiInsightsPanel) {
            aiInsightsPanel.querySelector('.insights-text').textContent = "Welcome, Aspirant! Enroll in a course or attempt a mock test to activate personalized preparation insights. Target guidelines: Daily study time > 2 hours.";
        }
        
        const continueContent = document.getElementById('continue-course-content');
        if (continueContent) {
            continueContent.innerHTML = `
                <p class="text-slate-400 text-sm mb-4">No active course in progress. Start an enrolled course below.</p>
                <a href="#courses" class="btn btn-outline w-full text-center py-2" style="border-radius: 8px;">Browse Courses</a>
            `;
        }
    } else {
        if (onboardingPanel) onboardingPanel.classList.add('hidden');
        
        const activeCourseTitle = enrolledCourses[enrolledCourses.length - 1];
        let meta = courseMetadata[activeCourseTitle];
        if (!meta) {
            meta = {
                link: activeCourseTitle.includes('RBI') ? 'course-rbi.html' : (activeCourseTitle.includes('SBI') ? 'course-sbi.html' : 'course-ibps.html'),
                progress: 35,
                topics: "9 / 25 Topics Completed"
            };
        }

        const continueContent = document.getElementById('continue-course-content');
        if (continueContent) {
            continueContent.innerHTML = `
                <div class="continue-learning-item">
                    <div class="continue-course-header flex justify-between items-center" style="margin-bottom: 8px;">
                        <span class="continue-course-name font-bold text-white text-sm" style="display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">${activeCourseTitle}</span>
                        <span class="continue-course-progress-pct text-indigo-400 font-semibold text-sm">${meta.progress}%</span>
                    </div>
                    <div class="progress-bar my-3" style="background: rgba(255,255,255,0.06); height: 8px; border-radius: 4px; overflow: hidden;">
                        <div class="progress-bar-fill" style="width: ${meta.progress}%; background: linear-gradient(90deg, var(--primary-color), var(--secondary-color)); height: 100%;"></div>
                    </div>
                    <div class="continue-course-footer flex justify-between items-center mt-4">
                        <span class="text-slate-400 text-xs">${meta.topics}</span>
                        <a href="${meta.link}" class="btn btn-primary px-4 py-2 font-semibold text-xs text-center" style="border-radius: 8px; white-space: nowrap;">Resume <i class="fas fa-arrow-right ml-1"></i></a>
                    </div>
                </div>
            `;
        }

        const topicsCount = Math.min(25, enrolledCourses.length * 8);
        const caPercentage = Math.min(100, Math.round((savedArticlesCount / 5) * 100));
        const aggregate = Math.min(100, Math.round((topicsCount / 25 * 50) + (Math.min(20, mocksCompleted) / 20 * 30) + (caPercentage * 0.2)));
        
        let trackerTargetName = 'IBPS PO 2026';
        if (activeCourseTitle.includes('RBI')) trackerTargetName = 'RBI Grade B 2026';
        else if (activeCourseTitle.includes('SBI')) trackerTargetName = 'SBI PO 2026';
        
        updateTrackerUI(topicsCount, mocksCompleted, caPercentage, trackerTargetName, aggregate);

        if (aiInsightsPanel) {
            let insightText = `Excellent consistency! You are actively preparing for ${trackerTargetName} with ${enrolledCourses.length} enrolled batch(es). Maintain your ${currentStreak}-day streak to access curated topic suggestions.`;
            if (parseInt(accuracyVal, 10) >= 80) {
                insightText = `Outstanding performance! Your Daily Quiz accuracy stands at ${accuracyVal}. Focus on high-level reasoning sectional mocks to cement your selection.`;
            } else if (mocksCompleted === 0) {
                insightText = `Good start! You have covered core concepts in ${activeCourseTitle}. We highly recommend attempting your first mock test today to evaluate speed and time split limits.`;
            }
            aiInsightsPanel.querySelector('.insights-text').textContent = insightText;
        }
    }


    renderActivities();
    checkAchievements();
    
    const activeChartTab = document.querySelector('.chart-tab-btn.active');
    const activeMetric = activeChartTab ? activeChartTab.dataset.metric : 'questions';
    renderWeeklyChart(activeMetric);

    if (window.initSidebarStats) {
        window.initSidebarStats();
    }
}

function updateTrackerUI(topics, mocks, caPct, targetName, aggregate = 0) {
    const trackerTarget = document.getElementById('tracker-target-name');
    const aggProgress = document.getElementById('tracker-aggregate-progress');
    const progressFill = document.getElementById('tracker-progress-fill');
    
    const topicsVal = document.getElementById('tracker-topics-val');
    const mocksVal = document.getElementById('tracker-mocks-val');
    const caVal = document.getElementById('tracker-ca-val');

    if (trackerTarget) trackerTarget.textContent = targetName;
    if (aggProgress) aggProgress.textContent = `${aggregate}% Complete`;
    if (progressFill) progressFill.style.width = `${aggregate}%`;
    
    if (topicsVal) topicsVal.textContent = `${topics} / 25`;
    if (mocksVal) mocksVal.textContent = `${mocks} / 20`;
    if (caVal) caVal.textContent = `${caPct}%`;
}

function bindMockSimulators() {
    const mockButtons = ['onboard-mock-btn', 'cc-mock-btn'];
    
    const handleMockCompletion = (e) => {
        e.preventDefault();
        e.stopPropagation();

        let currentMocks = parseInt(localStorage.getItem('quasibanking_mocks_completed') || '0', 10);
        currentMocks += 1;
        localStorage.setItem('quasibanking_mocks_completed', currentMocks.toString());
        
        const newAccuracy = Math.floor(Math.random() * 20) + 75;
        localStorage.setItem('quasibanking_accuracy', `${newAccuracy}%`);
        localStorage.setItem('quasibanking_quiz_accuracy', `${newAccuracy}%`);

        logActivity(`📝 Completed mock exam: SBI PO Mock Test #${currentMocks} (Accuracy: ${newAccuracy}%)`);
        
        alert(`🎉 Mock Exam Completed Successfully!\nAccuracy: ${newAccuracy}%\nDashboard and stats updated in the Command Center.`);

        fetchUserStats();
    };

    mockButtons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.onclick = handleMockCompletion;
        }
    });
}

// Slider Drawer Control Functions
export function openDashboardDrawer() {
    const drawer = document.getElementById('command-center-drawer');
    const overlay = document.getElementById('command-center-drawer-overlay');
    if (!drawer || !overlay) return;

    // Reset visibility classes
    drawer.classList.remove('hidden');
    overlay.classList.remove('hidden');
    
    // Animate open
    setTimeout(() => {
        drawer.classList.add('open');
        overlay.classList.add('active');
    }, 10);

    // Refresh stats inside the drawer
    fetchUserStats();

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

export function closeDashboardDrawer() {
    const drawer = document.getElementById('command-center-drawer');
    const overlay = document.getElementById('command-center-drawer-overlay');
    if (!drawer || !overlay) return;

    drawer.classList.remove('open');
    overlay.classList.remove('active');
    
    setTimeout(() => {
        drawer.classList.add('hidden');
        overlay.classList.add('hidden');
    }, 300);

    // Restore body scroll
    document.body.style.overflow = '';
}

// Expose open and close drawer to window for other scripts to use
window.openDashboardDrawer = openDashboardDrawer;
window.closeDashboardDrawer = closeDashboardDrawer;

function injectDashboardDrawer() {
    if (!document.getElementById('dashboard-sidebar')) return;
    if (document.getElementById('command-center-drawer')) return;

    const drawerWrapper = document.createElement('div');
    drawerWrapper.innerHTML = drawerHtml;
    
    while (drawerWrapper.firstChild) {
        document.body.appendChild(drawerWrapper.firstChild);
    }

    const closeBtn = document.getElementById('drawer-close-btn');
    const overlay = document.getElementById('command-center-drawer-overlay');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeDashboardDrawer);
    }
    if (overlay) {
        overlay.addEventListener('click', closeDashboardDrawer);
    }

    // Escape key listener to close drawer
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeDashboardDrawer();
        }
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject the drawer HTML if sidebars exist on the page
    injectDashboardDrawer();

    // 2. Bind trigger events on sidebar Dashboard click
    const navDashboard = document.getElementById('nav-dashboard');
    if (navDashboard) {
        navDashboard.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openDashboardDrawer();
        });
    }

    // 3. Bind trigger events on sidebar Resume Learning click
    const qaResume = document.getElementById('qa-resume');
    if (qaResume) {
        qaResume.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openDashboardDrawer();
        });
    }

    // 4. Bind chart tabs and mock buttons inside the drawer
    initChartTabs();
    bindMockSimulators();
    
    // 5. Run initial user stats check
    fetchUserStats();
});
