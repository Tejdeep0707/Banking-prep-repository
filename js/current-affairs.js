// QUASIBANKING Current Affairs & Daily Quiz Controller - Premium Version
import { db } from '../firebase-app.js';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const DAILY_QUIZ_QUESTIONS = [
    {
        id: "q-1",
        question: "1. What is the primary objective of the RBI keeping the repo rate unchanged in the latest MPC meeting?",
        options: [
            "To increase commercial loan margins immediately",
            "To align inflation with target bands while supporting GDP growth guidelines",
            "To restrict retail deposits in rural cooperatives",
            "To appreciate the currency exchange rates instantly"
        ],
        answer: 1,
        explanation: "By keeping the policy repo rate steady at 6.5%, the MPC aims to steer inflation progressively towards the 4% target while providing a stable monetary environment for growth."
    },
    {
        id: "q-2",
        question: "2. Which of the following describes the core focus of the government's 'Lakhpati Didi' scheme expansion?",
        options: [
            "Providing interest-free corporate cards to urban tech firms",
            "Skilling rural self-help group members to earn a minimum of ₹1 Lakh annually",
            "Distributing subsidies directly to commercial gold importers",
            "Refinancing long-term infrastructure expressways"
        ],
        answer: 1,
        explanation: "The Lakhpati Didi scheme focuses on empowering rural women in Self-Help Groups (SHGs) with technical skills (e.g. drone operations, solar systems) to earn at least ₹1 Lakh per annum."
    },
    {
        id: "q-3",
        question: "3. What major decision was reached at the BRICS / G20 discussions regarding international settlements?",
        options: [
            "Adopting a single unified currency for all member states",
            "Transitioning bilateral trade payments to local currencies of member states",
            "Replacing all commercial banks with digital central banks",
            "Banning multi-lateral developmental lending programs"
        ],
        answer: 1,
        explanation: "Member nations agreed to develop local currency frameworks to clear bilateral trade payments, reducing transaction costs and FX dependencies on international reserve currencies."
    },
    {
        id: "q-4",
        question: "4. Under RBI guidelines, the e-Rupee central bank digital currency (CBDC) pilot program covers:",
        options: [
            "Only wholesale cross-border operations",
            "Both wholesale and retail commercial pilot segments",
            "Cryptocurrency utility tokens exchanges",
            "Only secondary commercial paper auctions"
        ],
        answer: 1,
        explanation: "The RBI CBDC (Digital Rupee) pilot operates in two segments: CBDC-Retail (e-R-R) for public transactions and CBDC-Wholesale (e-R-W) for interbank settlement clearing."
    },
    {
        id: "q-5",
        question: "5. Autonomous drone swarm technologies showcased by DRDO are primarily designed for:",
        options: [
            "Commercial shipping routing in coastal regions",
            "High-altitude border surveillance and tactical logistics",
            "Agricultural crop sprayers in flat land cooperatives",
            "Automated cargo logistics in smart cities"
        ],
        answer: 1,
        explanation: "DRDO's drone swarm technology is customized for high-altitude border security, allowing autonomous surveillance, intelligence gathering, and supply drops in GPS-denied environments."
    }
];

let caArticles = [];
let savedArticleIds = [];
try {
    savedArticleIds = JSON.parse(localStorage.getItem('quasibanking_saved_articles')) || [];
} catch (e) {
    savedArticleIds = [];
}

let savedArticleMeta = {};
try {
    savedArticleMeta = JSON.parse(localStorage.getItem('quasibanking_saved_articles_meta')) || {};
} catch (e) {
    savedArticleMeta = {};
}

let recentlyViewedIds = [];
try {
    recentlyViewedIds = JSON.parse(localStorage.getItem('quasibanking_recent_articles')) || [];
} catch (e) {
    recentlyViewedIds = [];
}

let isLoading = true;

function initApp() {
    initFiltersAndSearch();
    loadCurrentAffairsData();
    initQuiz();
    checkCapsulesAvailability();
    initSummaryModal();
    updateStatsDashboard();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

async function loadFirestoreCurrentAffairs() {
    try {
        const q = query(collection(db, 'current_affairs'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        
        const liveArticles = snap.docs.map(doc => {
            const data = doc.data();
            const id = doc.id;
            
            let dateStr = new Date().toISOString().split('T')[0];
            if (data.createdAt) {
                const d = typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate() : new Date(data.createdAt);
                dateStr = d.toISOString().split('T')[0];
            }

            return {
                id: id,
                category: data.category || "banking",
                title: data.title || "",
                summary: data.summary || "",
                why_it_matters: "Critical updates for general awareness and preparation.",
                detailed_explanation: data.summary || "",
                exam_relevance: data.exam ? `Specifically relevant for ${data.exam}.` : "Relevant for all major banking exams.",
                key_facts: [data.summary || ""],
                memory_points: "Focus on key dates and macro facts.",
                exam_questions: ["What was the main topic outlined in this article?"],
                date: dateStr,
                importance: "high",
                reading_time: "3 Min Read",
                fullArticleUrl: data.source || "https://www.rbi.org.in",
                ibps_stars: 4,
                sbi_stars: 4,
                rbi_stars: 4,
                is_must_read: false
            };
        });

        const uniqueLive = liveArticles.filter(la => !caArticles.some(a => a.id === la.id));
        caArticles = [...uniqueLive, ...caArticles];
    } catch (e) {
        console.error("Error loading current affairs from Firestore:", e);
    }
}

// Fetch current affairs articles from data/current-affairs.json
function loadCurrentAffairsData() {
    const listContainer = document.getElementById('ca-articles-list');
    const mustReadContainer = document.getElementById('must-read-container');

    if (!listContainer && !mustReadContainer) return;

    isLoading = true;

    // Dynamically resolve directory path to handle subfolders or specific hosts correctly
    const basePath = window.location.pathname.endsWith('.html') 
        ? window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'))
        : window.location.pathname.replace(/\/$/, '');
    const jsonPath = `${window.location.origin}${basePath}/data/current-affairs.json`;

    console.log('Fetching current affairs from:', jsonPath);

    fetch(jsonPath)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(async (data) => {
            caArticles = data.articles;
            
            // Load live articles from Firestore and prepend them
            await loadFirestoreCurrentAffairs();
            
            isLoading = false;
            renderMustRead();
            
            // Render currently active category
            const activeBtn = document.querySelector('.ca-sidebar-filter-btn.active');
            const category = activeBtn ? activeBtn.dataset.category : 'today-important';
            const searchInput = document.getElementById('ca-search-input');
            const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
            renderArticlesList(category, query);

            renderSavedArticles();
            renderRecentlyViewed();
            renderWeeklyImportant();
            updateStatsDashboard();
        })
        .catch(err => {
            isLoading = false;
            console.error('Error fetching current affairs:', err);
            if (listContainer) listContainer.innerHTML = `<div class="ca-error">Failed to load articles. Please try reloading the page.</div>`;
        });
}

// Render Featured Must Read Article
function renderMustRead() {
    const container = document.getElementById('must-read-container');
    if (!container) return;

    const featured = caArticles.find(a => a.is_must_read);
    if (!featured) {
        container.innerHTML = `<div class="must-read-empty">No featured must-read article for today.</div>`;
        return;
    }

    const isBookmarked = savedArticleIds.includes(featured.id);

    container.innerHTML = `
        <div class="must-read-body">
            <div class="must-read-meta mb-3">
                <span class="badge badge-priority-${featured.importance}">${featured.importance.toUpperCase()} IMPORTANCE</span>
                <span class="must-read-date"><i class="far fa-calendar-alt"></i> ${featured.date}</span>
                <span class="must-read-reading-time"><i class="far fa-clock"></i> ${featured.reading_time || '3 Min Read'}</span>
                <button class="ca-bookmark-btn ${isBookmarked ? 'saved' : ''}" data-id="${featured.id}" aria-label="Bookmark article">
                    <i class="${isBookmarked ? 'fas' : 'far'} fa-star"></i> <span>${isBookmarked ? 'Saved' : 'Save Article'}</span>
                </button>
            </div>
            <h3>${featured.title}</h3>
            <p class="must-read-summary mb-4">${featured.summary}</p>
            
            <div class="must-read-relevance-box mb-4">
                <div class="relevance-title"><i class="fas fa-bullseye"></i> Exam Relevance Ratings:</div>
                <div class="relevance-stars-row">
                    <span class="relevance-star-tag">IBPS ${getStarString(featured.ibps_stars)}</span>
                    <span class="relevance-star-tag">SBI ${getStarString(featured.sbi_stars)}</span>
                    <span class="relevance-star-tag">RBI ${getStarString(featured.rbi_stars)}</span>
                </div>
            </div>

            <div class="must-read-why-box mb-5">
                <div class="why-title"><i class="fas fa-graduation-cap"></i> Why it matters for Banking Exams:</div>
                <p class="why-content">${featured.why_it_matters}</p>
            </div>

            <div class="must-read-actions-row">
                <button class="btn btn-primary btn-ca-summary" data-id="${featured.id}">
                    <i class="fas fa-book-open"></i> Read Summary
                </button>
                <a href="${featured.fullArticleUrl || 'https://www.rbi.org.in'}" target="_blank" class="btn btn-outline btn-ca-article" data-id="${featured.id}">
                    <i class="fas fa-external-link-alt"></i> Read Full Article
                </a>
            </div>
        </div>
    `;

    // Bind actions
    container.querySelector('.ca-bookmark-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleBookmark(featured.id);
    });

    container.querySelector('.btn-ca-summary').addEventListener('click', (e) => {
        e.stopPropagation();
        openCaSummaryModal(featured.id);
    });

    container.querySelector('.btn-ca-article').addEventListener('click', () => {
        addToRecentViewed(featured.id);
    });
}

// Render articles in the active tab
// Render articles in the active tab
function renderArticlesList(categoryFilter, searchFilter = '') {
    const listContainer = document.getElementById('ca-articles-list');
    if (!listContainer) return;

    if (isLoading) {
        listContainer.innerHTML = `<div class="ca-loader">Fetching latest current affairs...</div>`;
        return;
    }

    let filtered = caArticles;
    
    // Category filter
    if (categoryFilter === 'today-important') {
        filtered = filtered.filter(a => a.is_must_read || a.importance === 'high');
    } else if (categoryFilter === 'schemes') {
        const schemeKeywords = ['scheme', 'mission', 'yojana', 'initiative', 'pm-', 'lakhpati', 'awas', 'abhiyan', 'pradhan mantri', 'nrlm'];
        filtered = filtered.filter(a => {
            const text = (a.title + ' ' + a.summary + ' ' + (a.why_it_matters || '')).toLowerCase();
            return schemeKeywords.some(keyword => text.includes(keyword));
        });
    } else if (categoryFilter !== 'all') {
        filtered = filtered.filter(a => a.category === categoryFilter);
    }

    // Search filter
    if (searchFilter) {
        filtered = filtered.filter(a => 
            a.title.toLowerCase().includes(searchFilter) || 
            a.summary.toLowerCase().includes(searchFilter) ||
            (a.why_it_matters && a.why_it_matters.toLowerCase().includes(searchFilter)) ||
            (a.exam_relevance && a.exam_relevance.toLowerCase().includes(searchFilter))
        );
    }

    if (filtered.length === 0) {
        listContainer.innerHTML = `<div class="ca-empty-list">No articles found matching the criteria.</div>`;
        return;
    }

    listContainer.innerHTML = filtered.map(art => {
        const isBookmarked = savedArticleIds.includes(art.id);
        const importanceClass = `badge-priority-${art.importance}`;
        return `
            <div class="ca-article-card" data-id="${art.id}">
                <div class="ca-card-meta">
                    <span class="badge ${importanceClass}">${art.importance.toUpperCase()} IMPORTANCE</span>
                    <span class="ca-card-date"><i class="far fa-calendar-alt"></i> ${art.date}</span>
                    <span class="ca-card-reading-time"><i class="far fa-clock"></i> ${art.reading_time || '3 Min Read'}</span>
                </div>
                
                <h4>${art.title}</h4>
                <p class="ca-card-desc"><strong>2-Minute Summary:</strong> ${art.summary}</p>

                <div class="card-details-block">
                    <div class="detail-item">
                        <div class="detail-item-title"><i class="fas fa-graduation-cap text-indigo-400"></i> Why It Matters:</div>
                        <div class="detail-item-content">${art.why_it_matters || 'Critical updates for financial policy assessments.'}</div>
                    </div>
                </div>

                <div class="card-relevance-pill">
                    <strong><i class="fas fa-bullseye text-purple-400"></i> Exam Relevance:</strong>
                    <span>${art.exam_relevance || 'Direct relevance for general awareness phase of PO and Clerk posts.'}</span>
                </div>

                <div class="ca-card-actions">
                    <div class="card-actions-left">
                        <button class="btn btn-primary btn-ca-card-summary" onclick="event.stopPropagation(); window.handleSummaryOpen('${art.id}')">
                            <i class="fas fa-book-open"></i> Read Summary
                        </button>
                        <a href="${art.fullArticleUrl || 'https://www.rbi.org.in'}" target="_blank" class="btn btn-outline btn-ca-card-article" onclick="window.handleRecentView('${art.id}')">
                            <i class="fas fa-external-link-alt"></i> Full Source
                        </a>
                    </div>
                    <button class="ca-bookmark-btn ${isBookmarked ? 'saved' : ''}" onclick="event.stopPropagation(); window.handleBookmarkToggle('${art.id}')" aria-label="Bookmark article">
                        <i class="${isBookmarked ? 'fas' : 'far'} fa-star"></i> <span>${isBookmarked ? 'Saved' : 'Save'}</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Render bookmarked articles in Saved Articles shelf
function renderSavedArticles() {
    const savedContainer = document.getElementById('ca-saved-list');
    if (!savedContainer) return;

    const savedArticles = caArticles.filter(a => savedArticleIds.includes(a.id));

    // Update dynamic saved count badges
    const countBadge = document.getElementById('ca-saved-count-badge');
    const lastSavedText = document.getElementById('ca-saved-last-date');

    if (countBadge) countBadge.textContent = savedArticles.length;

    if (savedArticles.length === 0) {
        savedContainer.innerHTML = `
            <div class="saved-empty-message">
                <i class="far fa-star"></i>
                <h3>No articles bookmarked yet</h3>
                <p>Click the "⭐ Save Article" button on any news card to bookmark it for offline review and quick quiz prep revision.</p>
            </div>
        `;
        if (lastSavedText) lastSavedText.textContent = '';
        return;
    }

    // Determine the last saved timestamp
    let lastDateStr = '';
    const dates = Object.values(savedArticleMeta);
    if (dates.length > 0) {
        const latest = new Date(Math.max(...dates.map(d => new Date(d))));
        lastDateStr = `Last saved: ${latest.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${latest.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (lastSavedText) lastSavedText.textContent = lastDateStr;

    savedContainer.innerHTML = savedArticles.map(art => {
        const importanceClass = `badge-priority-${art.importance}`;
        return `
            <div class="ca-article-card bookmarked" data-id="${art.id}">
                <div class="ca-card-meta mb-3">
                    <span class="badge ${importanceClass}">${art.importance.toUpperCase()}</span>
                    <span class="ca-card-date"><i class="far fa-calendar-alt"></i> ${art.date}</span>
                </div>
                <h4>${art.title}</h4>
                <p class="ca-card-desc mb-4">${art.summary}</p>
                <div class="ca-card-footer">
                    <button class="btn-text btn-ca-card-summary" onclick="event.stopPropagation(); window.handleSummaryOpen('${art.id}')">
                        <i class="fas fa-book-open"></i> Read Summary
                    </button>
                    <button class="ca-bookmark-btn saved" onclick="event.stopPropagation(); window.handleBookmarkToggle('${art.id}')" title="Remove Bookmark">
                        <i class="fas fa-trash-alt"></i> <span>Unsave</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Toggle Bookmarks and save to Local Storage
function toggleBookmark(id) {
    const now = new Date().toISOString();
    if (savedArticleIds.includes(id)) {
        savedArticleIds = savedArticleIds.filter(itemId => itemId !== id);
        delete savedArticleMeta[id];
    } else {
        savedArticleIds.push(id);
        savedArticleMeta[id] = now;
    }
    localStorage.setItem('quasibanking_saved_articles', JSON.stringify(savedArticleIds));
    localStorage.setItem('quasibanking_saved_articles_meta', JSON.stringify(savedArticleMeta));

    // Refresh UI elements
    renderMustRead();
    
    const activeBtn = document.querySelector('.ca-sidebar-filter-btn.active');
    const searchInput = document.getElementById('ca-search-input');
    const activeCategory = activeBtn ? activeBtn.dataset.category : 'today-important';
    const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    renderArticlesList(activeCategory, searchQuery);
    renderSavedArticles();
    updateStatsDashboard();
}
window.handleBookmarkToggle = toggleBookmark;

// Tab filtering and search bindings
function initFiltersAndSearch() {
    const filters = document.querySelectorAll('.ca-sidebar-filter-btn');
    const searchInput = document.getElementById('ca-search-input');

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(f => f.classList.remove('active'));
            btn.classList.add('active');
            
            const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
            renderArticlesList(btn.dataset.category, query);
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const activeBtn = document.querySelector('.ca-sidebar-filter-btn.active');
            const category = activeBtn ? activeBtn.dataset.category : 'today-important';
            const query = searchInput.value.toLowerCase().trim();
            renderArticlesList(category, query);
        });
    }
}

// Star formatting utility
function getStarString(starsCount) {
    return '★'.repeat(starsCount) + '☆'.repeat(5 - starsCount);
}

// ==========================================================================
// RECENTLY VIEWED & WEEKLY CRITICAL SEGMENT LOGIC
// ==========================================================================

function addToRecentViewed(id) {
    // Prevent duplicate entries, shift, and push
    recentlyViewedIds = recentlyViewedIds.filter(itemId => itemId !== id);
    recentlyViewedIds.unshift(id);
    if (recentlyViewedIds.length > 5) {
        recentlyViewedIds.pop();
    }
    localStorage.setItem('quasibanking_recent_articles', JSON.stringify(recentlyViewedIds));
    renderRecentlyViewed();
    updateStatsDashboard();
}
window.handleRecentView = addToRecentViewed;

function renderRecentlyViewed() {
    const container = document.getElementById('ca-recently-viewed-list');
    if (!container) return;

    if (recentlyViewedIds.length === 0) {
        container.innerHTML = `<div class="list-empty">No articles viewed recently.</div>`;
        return;
    }

    const recentArticles = recentlyViewedIds
        .map(id => caArticles.find(a => a.id === id))
        .filter(Boolean);

    container.innerHTML = recentArticles.map(art => {
        return `
            <div class="list-item-row" onclick="window.handleSummaryOpen('${art.id}')">
                <div class="list-item-bullet-icon"><i class="fas fa-history text-cyan-400"></i></div>
                <div class="list-item-desc-text">
                    <span class="list-item-headline">${art.title}</span>
                    <span class="list-item-meta">${art.date} &bull; ${art.reading_time || '3 Min Read'}</span>
                </div>
            </div>
        `;
    }).join('');
}

function renderWeeklyImportant() {
    const container = document.getElementById('ca-weekly-important-list');
    if (!container) return;

    // Filter weekly important articles (importance === 'high')
    const importantArticles = caArticles.filter(a => a.importance === 'high').slice(0, 3);

    if (importantArticles.length === 0) {
        container.innerHTML = `<div class="list-empty">No weekly highlights found.</div>`;
        return;
    }

    container.innerHTML = importantArticles.map(art => {
        return `
            <div class="list-item-row" onclick="window.handleSummaryOpen('${art.id}')">
                <div class="list-item-bullet-icon"><i class="fas fa-star text-amber-400"></i></div>
                <div class="list-item-desc-text">
                    <span class="list-item-headline font-semibold">${art.title}</span>
                    <span class="list-item-meta text-rose-400"><i class="fas fa-exclamation-triangle"></i> HIGH ALERT</span>
                </div>
            </div>
        `;
    }).join('');
}

// ==========================================================================
// TOP STATS DASHBOARD UPDATES
// ==========================================================================
function updateStatsDashboard() {
    // 1. Streak count
    const streakCount = document.getElementById('ca-streak-count');
    if (streakCount) {
        const savedStreak = localStorage.getItem('quasibanking_streak') || '5 Days';
        streakCount.textContent = savedStreak.includes('Day') ? savedStreak : `${savedStreak} Days`;
    }

    // 2. Quiz accuracy score
    const quizScore = document.getElementById('ca-quiz-score');
    if (quizScore) {
        const accuracy = localStorage.getItem('quasibanking_quiz_accuracy') || '80%';
        quizScore.textContent = accuracy.endsWith('%') ? accuracy : `${accuracy}%`;
    }

    // 3. Weekly High Alerts count
    const weeklyCount = document.getElementById('ca-weekly-count');
    if (weeklyCount) {
        const highAlerts = caArticles.filter(a => a.importance === 'high').length;
        weeklyCount.textContent = `${highAlerts} High Alert${highAlerts !== 1 ? 's' : ''}`;
    }

    // 4. Recently viewed count
    const recentCount = document.getElementById('ca-recent-count');
    if (recentCount) {
        const count = recentlyViewedIds.length;
        recentCount.textContent = `${count} Article${count !== 1 ? 's' : ''}`;
    }
}

// ==========================================================================
// READ SUMMARY MODAL LOGIC
// ==========================================================================
function initSummaryModal() {
    const closeBtn = document.getElementById('ca-modal-close');
    const overlay = document.getElementById('ca-summary-modal');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeCaSummaryModal);
    }
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeCaSummaryModal();
        });
    }
}

function openCaSummaryModal(id) {
    const art = caArticles.find(a => a.id === id);
    if (!art) return;

    // Track recently viewed
    addToRecentViewed(id);

    const overlay = document.getElementById('ca-summary-modal');
    const title = document.getElementById('ca-modal-title');
    const explanation = document.getElementById('ca-modal-explanation');
    const relevance = document.getElementById('ca-modal-relevance');
    const keyfacts = document.getElementById('ca-modal-keyfacts');
    const memory = document.getElementById('ca-modal-memory');
    const questions = document.getElementById('ca-modal-questions');
    const dateText = document.getElementById('ca-modal-date');
    const importance = document.getElementById('ca-modal-importance-badge');
    const category = document.getElementById('ca-modal-category-badge');
    const externalLink = document.getElementById('ca-modal-external-link');

    if (title) title.textContent = art.title;
    if (explanation) explanation.textContent = art.detailed_explanation || art.summary;
    if (relevance) relevance.textContent = art.exam_relevance || art.why_it_matters;
    if (memory) memory.textContent = art.memory_points || "Focus on memorizing dates, percentages, and approving committees.";
    if (dateText) dateText.innerHTML = `<i class="far fa-calendar-alt"></i> ${art.date} &bull; ${art.reading_time || '3 Min Read'}`;
    
    if (importance) {
        importance.textContent = `${art.importance.toUpperCase()} IMPORTANCE`;
        importance.className = `badge badge-priority-${art.importance}`;
    }
    if (category) {
        category.textContent = art.category.toUpperCase();
    }
    if (externalLink) {
        externalLink.href = art.fullArticleUrl || 'https://www.rbi.org.in';
    }

    // Populate bullet points lists
    if (keyfacts) {
        const facts = art.key_facts || ["Key indicators remain unchanged.", "Details published in the latest gazette outline implementation guidelines."];
        keyfacts.innerHTML = facts.map(fact => `<li><i class="fas fa-check-circle text-emerald-400 mr-2"></i><span>${fact}</span></li>`).join('');
    }

    if (questions) {
        const qList = art.exam_questions || ["What was the main outcome highlighted in this report?", "Explain the impact of these changes on commercial lending values."];
        questions.innerHTML = qList.map(q => `<li><i class="far fa-question-circle text-indigo-400 mr-2"></i><span>${q}</span></li>`).join('');
    }

    if (overlay) {
        overlay.classList.remove('hidden');
        overlay.classList.add('active');
    }
}
window.handleSummaryOpen = openCaSummaryModal;

function closeCaSummaryModal() {
    const overlay = document.getElementById('ca-summary-modal');
    if (overlay) {
        overlay.classList.remove('active');
        overlay.classList.add('hidden');
    }
}

// ==========================================================================
// DAILY QUIZ COMPONENT UPGRADE
// ==========================================================================
function initQuiz() {
    const container = document.getElementById('quiz-questions-container');
    const quizForm = document.getElementById('daily-quiz-form');
    const resultsDisplay = document.getElementById('quiz-results-display');
    const scoreText = document.getElementById('quiz-score-text');
    const feedbackTitle = document.getElementById('quiz-feedback-title');
    const feedbackDesc = document.getElementById('quiz-feedback-desc');
    const submitBtn = document.getElementById('quiz-submit-button');
    const retryBtn = document.getElementById('quiz-retry-button');

    if (!container || !quizForm) return;

    // Render Quiz Questions
    function renderQuizQuestions() {
        container.innerHTML = DAILY_QUIZ_QUESTIONS.map((q, qIndex) => {
            return `
                <div class="quiz-question-card mb-6" id="question-card-${qIndex}">
                    <p class="quiz-question-title font-bold mb-4">${q.question}</p>
                    <div class="quiz-options-list">
                        ${q.options.map((opt, optIndex) => `
                            <label class="quiz-option-item" for="q-${qIndex}-opt-${optIndex}">
                                <input type="radio" name="question-${qIndex}" id="q-${qIndex}-opt-${optIndex}" value="${optIndex}" required>
                                <span class="option-text">${opt}</span>
                            </label>
                        `).join('')}
                    </div>
                    <div class="quiz-explanation-box hidden" id="explanation-${qIndex}">
                        <div class="explanation-heading"><i class="fas fa-info-circle"></i> Explanation:</div>
                        <p class="explanation-text">${q.explanation}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderQuizQuestions();

    // Submit Answer Sheet Handler
    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let score = 0;
        DAILY_QUIZ_QUESTIONS.forEach((q, qIndex) => {
            const selected = quizForm.querySelector(`input[name="question-${qIndex}"]:checked`);
            const answerIndex = parseInt(selected.value, 10);
            
            const explanationBox = document.getElementById(`explanation-${qIndex}`);
            const qCard = document.getElementById(`question-card-${qIndex}`);

            // Reveal explanations
            if (explanationBox) explanationBox.classList.remove('hidden');

            // Grade questions
            if (answerIndex === q.answer) {
                score++;
                if (qCard) qCard.classList.add('correct-answer');
            } else {
                if (qCard) qCard.classList.add('incorrect-answer');
                // Highlight the correct option visually
                const correctOption = quizForm.querySelector(`label[for="q-${qIndex}-opt-${q.answer}"]`);
                if (correctOption) correctOption.classList.add('highlight-correct');
            }

            // Disable all radio buttons
            quizForm.querySelectorAll(`input[name="question-${qIndex}"]`).forEach(radio => radio.disabled = true);
        });

        // Save Accuracy in local storage
        const accuracy = Math.round((score / 5) * 100);
        localStorage.setItem('quasibanking_quiz_accuracy', `${accuracy}%`);

        // Show Score Card
        if (scoreText) scoreText.textContent = `${score}/5`;
        if (resultsDisplay) resultsDisplay.classList.remove('hidden');

        // Set feedback message and customized improvement recommendations
        if (feedbackTitle && feedbackDesc) {
            if (score === 5) {
                feedbackTitle.textContent = "🏆 Perfect Score! Brilliant Work!";
                feedbackDesc.innerHTML = "You have exceptional retention of banking guidelines. Keep this momentum! <br><strong class='text-emerald-400'>Recommendation:</strong> Study advanced capital market notes and attempt banking awareness mock sets.";
            } else if (score >= 3) {
                feedbackTitle.textContent = "👍 Well Done! Decent Effort!";
                feedbackDesc.innerHTML = "Good understanding. Review the explanations of incorrect questions to secure full scores next time. <br><strong class='text-amber-400'>Recommendation:</strong> Revise static banking rules regarding RBI's monetary policy tools and open markets.";
            } else {
                feedbackTitle.textContent = "📚 Keep Practicing!";
                feedbackDesc.innerHTML = "Use our monthly capsules to revise core terms. Keep testing yourself daily. <br><strong class='text-rose-400'>Recommendation:</strong> Re-read the weekly digests and basic dictionary terms (Repo, inflation indices) before trying mocks.";
            }
        }

        // Toggle buttons
        if (submitBtn) submitBtn.classList.add('hidden');
        if (retryBtn) retryBtn.classList.remove('hidden');

        // Update dashboard values
        updateStatsDashboard();

        // Scroll to results card
        resultsDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    // Retry Quiz Action
    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            renderQuizQuestions();
            if (resultsDisplay) resultsDisplay.classList.add('hidden');
            if (submitBtn) submitBtn.classList.remove('hidden');
            if (retryBtn) retryBtn.classList.add('hidden');
        });
    }
}

// ==========================================================================
// MONTHLY CAPSULE safety availability downloader check
// ==========================================================================
function checkCapsulesAvailability() {
    const cards = document.querySelectorAll('.capsule-download-card-new');
    cards.forEach(card => {
        const filename = card.dataset.filename;
        const actionContainer = card.querySelector('.capsule-action-container');
        if (!actionContainer) return;

        const path = `RESOURCES/${filename}`;

        // Attempt a HEAD request on the PDF asset path
        fetch(path, { method: 'HEAD' })
            .then(res => {
                if (res.ok) {
                    // File is present! Render active download button
                    actionContainer.innerHTML = `
                        <a href="${path}" class="btn btn-primary capsule-download-btn" download>
                            <i class="fas fa-file-pdf"></i> Download PDF
                        </a>
                    `;
                } else {
                    // File returns 404/error. Render COMING SOON tag
                    renderComingSoonBadge(actionContainer);
                }
            })
            .catch(() => {
                // Network failure or local CORS block. Render COMING SOON fallback
                renderComingSoonBadge(actionContainer);
            });
    });

    function renderComingSoonBadge(container) {
        container.innerHTML = `
            <span class="capsule-coming-soon-badge">
                <i class="fas fa-clock"></i> COMING SOON
            </span>
        `;
    }
}
