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
            </div>
        </div>

        <!-- Premium Dashboard Hero -->
        <div class="dashboard-hero-card card-glass mb-6">
            <div class="hero-header-row">
                <div class="hero-greetings">
                    <span class="hero-time-greeting" id="hero-greeting-text">Good Evening, Aspirant</span>
                    <h3 class="hero-target-exam" id="hero-target-name">IBPS PO 2026</h3>
                </div>
                <div class="hero-streak-badge">
                    <i class="fas fa-fire"></i>
                    <span id="hero-streak-val">0 Days</span>
                </div>
            </div>
            
            <div class="hero-progress-section my-4">
                <div class="flex justify-between items-center text-xs text-slate-400 mb-1">
                    <span>Course Progress</span>
                    <span class="font-bold text-indigo-400" id="hero-progress-percent">0%</span>
                </div>
                <div class="progress-bar">
                    <div id="hero-progress-fill" class="progress-bar-fill" style="width: 0%"></div>
                </div>
            </div>
            
            <div class="hero-actions-row">
                <button class="btn btn-primary w-full text-center" id="hero-continue-cta" style="border-radius: 12px; font-weight: 700; padding: 12px;">
                    <i class="fas fa-play mr-2"></i> Continue Learning
                </button>
            </div>
        </div>

        <!-- Continue Learning Details (Hidden secondary view) -->
        <div class="continue-card card-glass mb-6 hidden" id="ca-continue-learning">
            <h4 class="card-glass-title mb-4"><i class="fas fa-play-circle text-indigo-400"></i> Active Course</h4>
            <div id="continue-course-content">
                <!-- Populated dynamically -->
            </div>
        </div>

        <!-- Today's Mission -->
        <div class="mission-card card-glass mb-6">
            <div class="mission-header mb-3">
                <h4 class="mission-title"><i class="fas fa-tasks text-indigo-400 mr-2"></i> Today's Mission</h4>
                <span class="mission-status-pct" id="mission-progress-text">0/4 Complete</span>
            </div>
            <div class="progress-bar mb-4" style="height: 6px;">
                <div id="mission-progress-fill" class="progress-bar-fill" style="width: 0%"></div>
            </div>
            <div class="mission-tasks-list">
                <label class="mission-task-item" id="task-item-lesson">
                    <input type="checkbox" id="task-check-lesson" class="task-checkbox">
                    <span class="task-custom-check"><i class="fas fa-check"></i></span>
                    <div class="task-details">
                        <span class="task-label">Watch Today's Lesson</span>
                        <span class="task-subtext">Active enrolled batch syllabus checkpoint</span>
                    </div>
                </label>
                <label class="mission-task-item" id="task-item-affairs">
                    <input type="checkbox" id="task-check-affairs" class="task-checkbox">
                    <span class="task-custom-check"><i class="fas fa-check"></i></span>
                    <div class="task-details">
                        <span class="task-label">Read Current Affairs</span>
                        <span class="task-subtext">Review today's must-read updates</span>
                    </div>
                </label>
                <label class="mission-task-item" id="task-item-mock">
                    <input type="checkbox" id="task-check-mock" class="task-checkbox">
                    <span class="task-custom-check"><i class="fas fa-check"></i></span>
                    <div class="task-details">
                        <span class="task-label">Attempt Mock Test</span>
                        <span class="task-subtext">Practice speed & accuracy metrics</span>
                    </div>
                </label>
                <label class="mission-task-item" id="task-item-quiz">
                    <input type="checkbox" id="task-check-quiz" class="task-checkbox">
                    <span class="task-custom-check"><i class="fas fa-check"></i></span>
                    <div class="task-details">
                        <span class="task-label">Complete Quiz</span>
                        <span class="task-subtext">Test your retention of today's topics</span>
                    </div>
                </label>
            </div>
        </div>

        <!-- Weekly Performance Chart Section -->
        <div class="chart-card card-glass mb-6" id="ca-weekly-chart">
            <div class="chart-header-row mb-4">
                <h4 class="chart-title"><i class="fas fa-chart-bar text-indigo-400"></i> Weekly Performance</h4>
                <div class="chart-tabs">
                    <button class="chart-tab-btn active" data-metric="questions">Questions</button>
                    <button class="chart-tab-btn" data-metric="study">Study Time</button>
                    <button class="chart-tab-btn" data-metric="accuracy">Accuracy</button>
                </div>
            </div>
            
            <!-- Quick metrics row -->
            <div class="chart-quick-metrics mb-4">
                <div class="metric-summary-box">
                    <span class="summary-label">Solved This Week</span>
                    <span class="summary-val" id="chart-sum-questions">0 Qs</span>
                </div>
                <div class="metric-summary-box">
                    <span class="summary-label">Average Accuracy</span>
                    <span class="summary-val" id="chart-sum-accuracy">0%</span>
                </div>
                <div class="metric-summary-box">
                    <span class="summary-label">Hours Studied</span>
                    <span class="summary-val" id="chart-sum-study">0.0 hrs</span>
                </div>
            </div>
            
            <!-- Responsive SVG Chart container -->
            <div class="svg-chart-container" id="svg-chart-container-box">
                <!-- Populated dynamically by JS -->
            </div>
        </div>

        <!-- Streak & Achievements Performance Block -->
        <div class="performance-block-card card-glass mb-6">
            <h4 class="card-glass-title mb-4"><i class="fas fa-award text-yellow-400"></i> Performance Streak & Badges</h4>
            <div class="streak-mini-row mb-4">
                <div class="streak-metric-item">
                    <span class="streak-label"><i class="fas fa-fire text-orange-500 mr-1"></i> Current Streak</span>
                    <span class="streak-val" id="performance-current-streak">0 Days</span>
                </div>
                <div class="streak-vertical-divider"></div>
                <div class="streak-metric-item">
                    <span class="streak-label"><i class="fas fa-trophy text-amber-500 mr-1"></i> Best Streak</span>
                    <span class="streak-val" id="performance-best-streak">0 Days</span>
                </div>
            </div>
            
            <div class="performance-divider-line mb-4"></div>
            
            <div class="achievements-mini-section">
                <div class="achievement-status-row mb-2">
                    <span class="achieve-label">Recent Achievement</span>
                    <span class="achieve-val" id="cc-recent-achievement">None</span>
                </div>
                <div class="achievement-status-row">
                    <span class="achieve-label">Next Unlock Goal</span>
                    <span class="achieve-val text-indigo-400 font-bold" id="cc-next-achievement-goal">Attempt first mock test</span>
                </div>
            </div>
        </div>

        <!-- Smart AI Insights -->
        <div class="insights-card card-glass mb-6" id="ca-ai-insights">
            <div class="insights-header mb-3">
                <i class="fas fa-brain text-purple-400"></i>
                <span class="insights-title">Smart Insights</span>
                <span class="insights-badge">Live Analysis</span>
            </div>
            <div class="insights-content-wrapper">
                <p class="insights-main-text mb-3" id="insights-weekly-improvement">Complete your first Quiz to generate accuracy improvements.</p>
                <div class="insights-subject-metrics mb-3">
                    <div class="subject-metric-box">
                        <span class="subj-label">Strongest Subject</span>
                        <span class="subj-val text-emerald-400" id="insights-strongest-subject">Reasoning</span>
                    </div>
                    <div class="subject-metric-box">
                        <span class="subj-label">Weakest Subject</span>
                        <span class="subj-val text-rose-400" id="insights-weakest-subject">Current Affairs</span>
                    </div>
                </div>
                <div class="insights-action-box">
                    <span class="action-label"><i class="fas fa-arrow-circle-right text-indigo-400 mr-1"></i> Recommended Next Action</span>
                    <a href="mock-tests.html" class="insights-action-btn" id="insights-action-recommendation">Attempt Daily Mock Test</a>
                </div>
            </div>
        </div>

        <!-- Leaderboard Preview -->
        <div class="leaderboard-widget card-glass mb-6" id="ca-leaderboard-preview">
            <h4 class="card-glass-title mb-4"><i class="fas fa-users text-indigo-400 mr-2"></i> Top 3 Aspirants</h4>
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
            </div>
            <a href="interview.html" class="btn btn-outline w-full text-center mt-4 py-2 font-semibold cc-action-btn-ranks" style="font-size: 0.8rem; border-radius: 8px;">
                <span>View Full Rankings</span> <i class="fas fa-chevron-right ml-1"></i>
            </a>
        </div>

        <!-- Recent Activity -->
        <div class="activity-card card-glass mb-6" id="ca-recent-activity">
            <h4 class="card-glass-title mb-4"><i class="fas fa-history text-cyan-400 mr-2"></i> Recent Activity</h4>
            <div class="activity-timeline-wrapper" id="timeline-list-container">
                <div class="timeline-empty">No recent activity logged.</div>
            </div>
            <button id="btn-toggle-all-activities" class="btn btn-outline w-full text-center mt-3 py-2 font-semibold cc-action-btn-ranks" style="font-size: 0.8rem; border-radius: 8px; display: none;">
                View All Activity
            </button>
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

let isShowingAllActivities = false;

function renderActivities() {
    const container = document.getElementById('timeline-list-container');
    if (!container) return;

    let activities = [];
    try {
        activities = JSON.parse(localStorage.getItem('quasibanking_activities') || '[]');
    } catch (e) {
        activities = [];
    }

    const toggleBtn = document.getElementById('btn-toggle-all-activities');

    if (activities.length === 0) {
        container.innerHTML = `<div class="timeline-empty">No recent activity logged.</div>`;
        if (toggleBtn) toggleBtn.style.display = 'none';
        return;
    }

    const visibleActivities = isShowingAllActivities ? activities : activities.slice(0, 3);

    let html = '<div class="activity-timeline">';
    visibleActivities.forEach(act => {
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

    if (toggleBtn) {
        if (activities.length > 3) {
            toggleBtn.style.display = 'block';
            toggleBtn.textContent = isShowingAllActivities ? 'Show Less' : 'View All Activity';
        } else {
            toggleBtn.style.display = 'none';
        }
    }
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

    const currentStreakEl = document.getElementById('performance-current-streak');
    const bestStreakEl = document.getElementById('performance-best-streak');
    const heroStreakEl = document.getElementById('hero-streak-val');
    
    if (currentStreakEl) currentStreakEl.textContent = `${currentStreak} Days`;
    if (bestStreakEl) bestStreakEl.textContent = `${bestStreak} Days`;
    if (heroStreakEl) heroStreakEl.textContent = `${currentStreak} Days`;
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
        { name: 'First Mock', unlocked: mocksCompleted > 0, goal: 'Attempt your first mock test' },
        { name: 'GA Explorer', unlocked: savedArticlesCount >= 3, goal: 'Save 3 Current Affairs articles' },
        { name: 'High Accuracy', unlocked: accuracy >= 80, goal: 'Achieve 80% accuracy in Daily Quiz' },
        { name: '7 Day Fire', unlocked: currentStreak >= 7, goal: 'Maintain a 7-day study streak' }
    ];

    const unlockedList = achievements.filter(b => b.unlocked);
    const lockedList = achievements.filter(b => !b.unlocked);
    
    const recentEl = document.getElementById('cc-recent-achievement');
    const nextEl = document.getElementById('cc-next-achievement-goal');
    
    if (recentEl) {
        if (unlockedList.length > 0) {
            recentEl.textContent = unlockedList[unlockedList.length - 1].name;
            recentEl.className = "achieve-val text-emerald-400 font-bold";
        } else {
            recentEl.textContent = "None";
            recentEl.className = "achieve-val text-slate-400";
        }
    }
    
    if (nextEl) {
        if (lockedList.length > 0) {
            nextEl.textContent = lockedList[0].goal;
        } else {
            nextEl.textContent = "All Unlocked! 🎉";
            nextEl.className = "achieve-val text-emerald-400 font-bold";
        }
    }
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
    
    // Read from localStorage to personalize active values
    const mocksCompleted = parseInt(localStorage.getItem('quasibanking_mocks_completed') || '0', 10);
    const accuracyVal = localStorage.getItem('quasibanking_accuracy') || localStorage.getItem('quasibanking_quiz_accuracy') || '0%';
    const accuracy = parseInt(accuracyVal, 10);
    
    if (metric === 'accuracy') {
        if (accuracy > 0) {
            values[5] = accuracy;
            values[6] = Math.max(50, accuracy - 5);
        }
    } else if (metric === 'questions') {
        if (mocksCompleted > 0) {
            values[5] = Math.min(100, values[5] + mocksCompleted * 15);
        }
    }

    // Dynamic metrics summaries calculation
    let mockOffset = mocksCompleted * 15;
    let questionsValues = [25, 45, 15, 60, 40, 85 + mockOffset, 30];
    const qSum = questionsValues.reduce((a,b) => a+b, 0);

    let studyValues = [45, 90, 30, 120, 75, 180, 60];
    const sSum = (studyValues.reduce((a,b) => a+b, 0) / 60).toFixed(1);

    let accuracyValues = [70, 82, 65, 88, 75, 92, 80];
    if (accuracy > 0) {
        accuracyValues[5] = accuracy;
        accuracyValues[6] = Math.max(50, accuracy - 5);
    }
    const aAvg = Math.round(accuracyValues.reduce((a,b) => a+b, 0) / accuracyValues.length);

    const sumQEl = document.getElementById('chart-sum-questions');
    const sumAEl = document.getElementById('chart-sum-accuracy');
    const sumSEl = document.getElementById('chart-sum-study');

    if (sumQEl) sumQEl.textContent = `${qSum} Qs`;
    if (sumAEl) sumAEl.textContent = `${aAvg}%`;
    if (sumSEl) sumSEl.textContent = `${sSum} hrs`;

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
        link: "index.html#courses",
        progress: 45,
        topics: "11 / 25 Topics Completed"
    },
    "RBI Zenith Batch (Grade B) Phase 1 + 2": {
        link: "index.html#courses",
        progress: 30,
        topics: "7 / 25 Topics Completed"
    },
    "IBPS PO 2026": {
        link: "index.html#courses",
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

// Today's Mission Persistence and UI sync logic
export function saveMissionsState() {
    const states = {
        lesson: document.getElementById('task-check-lesson')?.checked || false,
        affairs: document.getElementById('task-check-affairs')?.checked || false,
        mock: document.getElementById('task-check-mock')?.checked || false,
        quiz: document.getElementById('task-check-quiz')?.checked || false,
        date: new Date().toDateString()
    };
    localStorage.setItem('quasibanking_missions_state', JSON.stringify(states));
    updateMissionProgressUI();
}

export function loadMissionsState() {
    let states = { lesson: false, affairs: false, mock: false, quiz: false, date: '' };
    try {
        const stored = localStorage.getItem('quasibanking_missions_state');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.date === new Date().toDateString()) {
                states = parsed;
            }
        }
    } catch(e) {}
    
    // Auto-detect updates from other actions
    const mocksCompleted = parseInt(localStorage.getItem('quasibanking_mocks_completed') || '0', 10);
    if (mocksCompleted > 0) states.mock = true;
    
    let savedArticlesCount = 0;
    try {
        savedArticlesCount = JSON.parse(localStorage.getItem('quasibanking_saved_articles') || '[]').length;
    } catch (e) {}
    if (savedArticlesCount > 0) states.affairs = true;
    
    const accuracyVal = localStorage.getItem('quasibanking_accuracy') || localStorage.getItem('quasibanking_quiz_accuracy') || '0%';
    const accuracy = parseInt(accuracyVal, 10);
    if (accuracy > 0) states.quiz = true;
    
    let enrolledCourses = [];
    try {
        enrolledCourses = JSON.parse(localStorage.getItem('quasibanking_enrolled_courses') || '[]');
    } catch (e) {}
    if (enrolledCourses.length > 0) states.lesson = true;

    // Apply checks to UI
    const lessonCheck = document.getElementById('task-check-lesson');
    const affairsCheck = document.getElementById('task-check-affairs');
    const mockCheck = document.getElementById('task-check-mock');
    const quizCheck = document.getElementById('task-check-quiz');
    
    if (lessonCheck) lessonCheck.checked = states.lesson;
    if (affairsCheck) affairsCheck.checked = states.affairs;
    if (mockCheck) mockCheck.checked = states.mock;
    if (quizCheck) quizCheck.checked = states.quiz;
    
    updateMissionProgressUI();
}

function updateMissionProgressUI() {
    const checks = [
        document.getElementById('task-check-lesson')?.checked || false,
        document.getElementById('task-check-affairs')?.checked || false,
        document.getElementById('task-check-mock')?.checked || false,
        document.getElementById('task-check-quiz')?.checked || false
    ];
    const completedCount = checks.filter(Boolean).length;
    const progressPct = Math.round((completedCount / 4) * 100);
    
    const progressText = document.getElementById('mission-progress-text');
    const progressFill = document.getElementById('mission-progress-fill');
    
    if (progressText) progressText.textContent = `${completedCount}/4 Complete`;
    if (progressFill) progressFill.style.width = `${progressPct}%`;
}

function bindMissionCheckboxes() {
    const checkboxes = [
        'task-check-lesson',
        'task-check-affairs',
        'task-check-mock',
        'task-check-quiz'
    ];
    checkboxes.forEach(id => {
        const chk = document.getElementById(id);
        if (chk) {
            chk.addEventListener('change', saveMissionsState);
        }
    });
}

// Redesigned Smart Insights calculator
function updateAIInsights() {
    const mocksCompleted = parseInt(localStorage.getItem('quasibanking_mocks_completed') || '0', 10);
    const accuracyVal = localStorage.getItem('quasibanking_accuracy') || localStorage.getItem('quasibanking_quiz_accuracy') || '0%';
    const accuracy = parseInt(accuracyVal, 10);
    
    let enrolledCourses = [];
    try {
        enrolledCourses = JSON.parse(localStorage.getItem('quasibanking_enrolled_courses') || '[]');
    } catch(e) {}
    
    const weeklyImprEl = document.getElementById('insights-weekly-improvement');
    const strongestSubjEl = document.getElementById('insights-strongest-subject');
    const weakestSubjEl = document.getElementById('insights-weakest-subject');
    const recommendEl = document.getElementById('insights-action-recommendation');
    
    if (accuracy > 0) {
        if (weeklyImprEl) weeklyImprEl.textContent = `Your accuracy improved 12% this week compared to last week.`;
        if (strongestSubjEl) strongestSubjEl.textContent = accuracy >= 80 ? "Quantitative Aptitude" : "Banking Awareness";
        if (weakestSubjEl) weakestSubjEl.textContent = "Reasoning";
        if (recommendEl) {
            recommendEl.textContent = "Practice High-level Reasoning Mocks";
            recommendEl.onclick = (e) => {
                e.preventDefault();
                closeDashboardDrawer();
                if (typeof window.openMockSimulator === 'function') {
                    window.openMockSimulator();
                } else {
                    window.location.hash = 'mocks';
                }
            };
        }
    } else {
        if (weeklyImprEl) weeklyImprEl.textContent = `Complete your first Daily Quiz checkpoint to generate AI performance improvements.`;
        if (strongestSubjEl) strongestSubjEl.textContent = "Undetermined";
        if (weakestSubjEl) weakestSubjEl.textContent = "Undetermined";
        if (recommendEl) {
            recommendEl.textContent = "Attempt Daily Mock Test";
            recommendEl.onclick = (e) => {
                e.preventDefault();
                closeDashboardDrawer();
                window.location.href = "mock-tests.html";
            };
        }
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
    
    // Greeting greeting time calculation
    const d = new Date();
    const hrs = d.getHours();
    let greetingText = "Good Evening, Aspirant";
    if (hrs < 12) greetingText = "Good Morning, Aspirant";
    else if (hrs < 17) greetingText = "Good Afternoon, Aspirant";
    
    const greetingEl = document.getElementById('hero-greeting-text');
    if (greetingEl) greetingEl.textContent = greetingText;

    // Continue Learning redirect bindings
    const continueCta = document.getElementById('hero-continue-cta');

    if (enrolledCourses.length === 0) {
        if (onboardingPanel) onboardingPanel.classList.remove('hidden');
        updateTrackerUI(0, 0, 0, 'IBPS PO 2026');
        
        const continueContent = document.getElementById('continue-course-content');
        if (continueContent) {
            continueContent.innerHTML = `
                <p class="text-slate-400 text-sm mb-4">No active course in progress. Start an enrolled course below.</p>
                <a href="#courses" class="btn btn-outline w-full text-center py-2" style="border-radius: 8px;">Browse Courses</a>
            `;
        }

        if (continueCta) {
            continueCta.innerHTML = `<i class="fas fa-search mr-2"></i> Browse Courses`;
            continueCta.onclick = (e) => {
                e.preventDefault();
                closeDashboardDrawer();
                const coursesEl = document.getElementById('courses');
                if (coursesEl) {
                    coursesEl.scrollIntoView({ behavior: 'smooth' });
                } else {
                    window.location.hash = 'courses';
                }
            };
        }
    } else {
        if (onboardingPanel) onboardingPanel.classList.add('hidden');
        
        const activeCourseTitle = enrolledCourses[enrolledCourses.length - 1];
        let meta = courseMetadata[activeCourseTitle];
        if (!meta) {
            meta = {
                link: 'index.html#courses',
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

        if (continueCta) {
            continueCta.innerHTML = `<i class="fas fa-play mr-2"></i> Continue Learning`;
            continueCta.onclick = (e) => {
                e.preventDefault();
                closeDashboardDrawer();
                window.location.href = meta.link;
            };
        }

        const topicsCount = Math.min(25, enrolledCourses.length * 8);
        const caPercentage = Math.min(100, Math.round((savedArticlesCount / 5) * 100));
        const aggregate = Math.min(100, Math.round((topicsCount / 25 * 50) + (Math.min(20, mocksCompleted) / 20 * 30) + (caPercentage * 0.2)));
        
        let trackerTargetName = 'IBPS PO 2026';
        if (activeCourseTitle.includes('RBI')) trackerTargetName = 'RBI Grade B 2026';
        else if (activeCourseTitle.includes('SBI')) trackerTargetName = 'SBI PO 2026';
        
        updateTrackerUI(topicsCount, mocksCompleted, caPercentage, trackerTargetName, aggregate);
    }

    loadMissionsState();
    updateAIInsights();
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
    const trackerTarget = document.getElementById('hero-target-name');
    const progressPct = document.getElementById('hero-progress-percent');
    const progressFill = document.getElementById('hero-progress-fill');

    if (trackerTarget) trackerTarget.textContent = targetName;
    if (progressPct) progressPct.textContent = `${aggregate}%`;
    if (progressFill) progressFill.style.width = `${aggregate}%`;
}

function bindMockSimulators() {
    const mockButtons = ['onboard-mock-btn', 'cc-mock-btn'];
    
    mockButtons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (typeof window.openMockSimulator === 'function') {
                    window.openMockSimulator();
                } else {
                    console.warn("window.openMockSimulator not loaded yet. Attempting default behavior.");
                }
            };
        }
    });
}

// Slider Drawer Control Functions
export function openDashboardDrawer() {
    const drawer = document.getElementById('command-center-drawer');
    const overlay = document.getElementById('command-center-drawer-overlay');
    if (!drawer || !overlay) return;

    drawer.classList.remove('hidden');
    overlay.classList.remove('hidden');
    
    setTimeout(() => {
        drawer.classList.add('open');
        overlay.classList.add('active');
    }, 10);

    fetchUserStats();
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

    document.body.style.overflow = '';
}

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

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeDashboardDrawer();
        }
    });

    // Bind checkboxes and toggles right after injection
    bindMissionCheckboxes();
    loadMissionsState();

    const activityToggleBtn = document.getElementById('btn-toggle-all-activities');
    if (activityToggleBtn) {
        activityToggleBtn.addEventListener('click', () => {
            isShowingAllActivities = !isShowingAllActivities;
            renderActivities();
        });
    }
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
