// QUASIBANKING Notification Controller - Premium Refined Version
import { db } from '../firebase-app.js';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const DEFAULT_NOTIFICATIONS = [
    // === EXAM CATEGORY (5 announcements) ===
    {
        id: "notif-exam-1",
        title: "SBI PO 2026 Notification Expected Soon",
        description: "Official recruitment notification expected soon. Candidates should prepare academic documents and eligibility proofs.",
        detailedSummary: "The State Bank of India (SBI) is expected to publish the official notification for recruitment of Probationary Officers (PO) for the fiscal year 2026. Internal sources project a total of 2,000+ vacancies across public branches. Aspirants are advised to organize their graduation credentials, caste certificates (if applicable), and identity verifications beforehand.",
        date: "2026-05-29",
        category: "exam",
        priority: "high",
        read: false,
        fullArticleUrl: "https://www.sbi.co.in",
        importance: "Highly critical for banking career candidates. SBI PO is the premier entry point into banking officer scales. Sections tested require strategic time distribution.",
        recommendedPrep: "Review historical cut-off margins in our syllabus guides. Take the daily mock test and practice quantitative tables to build initial speeds."
    },
    {
        id: "notif-exam-2",
        title: "IBPS Clerk Registration Window Active",
        description: "Online registration window activated for public bank clerk recruitment. Deadline approaching.",
        detailedSummary: "The Institute of Banking Personnel Selection (IBPS) has activated the online application link for the Clerk XVI recruitment drive. Participating public sector banks have compiled an aggregate of 5,800+ vacancies. The online registration fee payment portal will remain active for 21 days from today.",
        date: "2026-05-28",
        category: "exam",
        priority: "high",
        read: false,
        fullArticleUrl: "https://www.ibps.in",
        importance: "Critical entry-level path. Clerk exams focus heavily on calculation speeds and grammatical precision, serving as a reliable entry point to public banks.",
        recommendedPrep: "Ensure digital scans of thumb prints and handwritten declarations match guidelines. Attempt past clerk prelims papers in 1-hour timed environments."
    },
    {
        id: "notif-exam-3",
        title: "RBI Assistant Recruitment Calendar Revised",
        description: "Official recruitment calendar updated. Assistant Prelims and Mains timeline shifted forward.",
        detailedSummary: "The Reserve Bank of India has revised its administrative schedules, shifting the tentative dates for the Assistant Prelims by two weeks. Detailed regional vacancy charts and age eligibility exemptions will be finalized in the forthcoming official brochure.",
        date: "2026-05-27",
        category: "exam",
        priority: "medium",
        read: false,
        fullArticleUrl: "https://www.rbi.org.in",
        importance: "Very high competitiveness. RBI Assistant is highly desired due to prime corporate locations and administrative work hours. Cutoffs often exceed 90 out of 100.",
        recommendedPrep: "Aim for perfect scoring rates in Numerical Ability. Take at least three sectional reasoning mock tests daily."
    },
    {
        id: "notif-exam-4",
        title: "New Banking Recruitment Drive Announced",
        description: "Public and private institutions announce combined drive for specialized credit officers.",
        detailedSummary: "A collaborative recruiting syndicate formed by major public sector lenders and private corporations has announced a drive for Credit Officers, IT Specialists, and Treasury Heads. Selections will combine score cards from professional tests and board interviews.",
        date: "2026-05-26",
        category: "exam",
        priority: "medium",
        read: false,
        fullArticleUrl: "https://economictimes.indiatimes.com",
        importance: "Direct lateral entry option for professional degree holders (MBA Finance, CA, B.Tech) bypassing generic junior officer scales.",
        recommendedPrep: "Revise domain-specific theories. IT applicants should review database managers, and Credit applicants should focus on corporate asset valuations."
    },
    {
        id: "notif-exam-5",
        title: "Regional Rural Bank (RRB) Vacancy Update",
        description: "Revised state-wise vacancy numbers published by IBPS. Rural bank slots increased.",
        detailedSummary: "The cooperative board under IBPS has revised its allocation list for RRB Scale I Officers and Office Assistants, adding 450 additional vacancies across regional rural units. Candidates can update bank preferences in their dashboards.",
        date: "2026-05-25",
        category: "exam",
        priority: "general",
        read: true,
        fullArticleUrl: "https://www.ibps.in",
        importance: "Crucial for candidates desiring placement in regional rural networks. Local language proficiency tests are mandatory during interview steps.",
        recommendedPrep: "Review state agricultural guidelines. Practice writing and speaking tasks in the registered regional state language."
    },

    // === CURRENT AFFAIRS CATEGORY (5 announcements) ===
    {
        id: "notif-affairs-1",
        title: "Monthly Current Affairs Capsule Uploaded",
        description: "May 2026 comprehensive news events, economic tables, and international indices compiled in PDF.",
        detailedSummary: "Our exam panel has compiled the monthly current affairs capsule for May 2026. The study booklet organizes financial highlights, national policy schemes, sports awards, and bilateral military drills into structured study modules.",
        date: "2026-05-29",
        category: "affairs",
        priority: "medium",
        read: false,
        fullArticleUrl: "https://economictimes.indiatimes.com",
        importance: "General Awareness sections hold 40% marks weightage in main papers. Consistent monthly revision guarantees better scores.",
        recommendedPrep: "Download the PDF capsule, mark critical macro numbers, and take the 5-MCQ daily quiz to benchmark retention indices."
    },
    {
        id: "notif-affairs-2",
        title: "RBI Monetary Policy Summary Published",
        description: "Policy repo rate maintained steady at 6.5%. Accommodation withdrawal stance continued.",
        detailedSummary: "The RBI Monetary Policy Committee voted unanimously to keep the policy repo rate unchanged at 6.50% to ensure CPI inflation aligns progressively with the medium-term targets while supporting GDP expansion guidelines.",
        date: "2026-05-28",
        category: "affairs",
        priority: "high",
        read: false,
        fullArticleUrl: "https://www.rbi.org.in",
        importance: "Fundamental concept in banking awareness. Questions on rates, MPC structure, and banking inflation policies appear in both mains and interviews.",
        recommendedPrep: "Memorize current policy rates (Repo, Reverse Repo, MSF, Bank Rate) and study the role of the NSO in calculating inflation metrics."
    },
    {
        id: "notif-affairs-3",
        title: "Economic Survey Notes Added",
        description: "Chapter-wise notes compiling GDP indicators, capital outputs, and agrarian developments.",
        detailedSummary: "Our educational teams have distilled the massive government Economic Survey report into chapter summaries, focusing on GDP estimates, industrial indices, and digital trade statistics.",
        date: "2026-05-26",
        category: "affairs",
        priority: "medium",
        read: true,
        fullArticleUrl: "https://economictimes.indiatimes.com",
        importance: "Highly relevant for RBI Grade B phase 2 papers, specifically the Economic and Social Issues (ESI) descriptive and MCQ segments.",
        recommendedPrep: "Focus on sector-wise capital investments and targets. Create summary sheets of government expenditure values."
    },
    {
        id: "notif-affairs-4",
        title: "Budget Highlights Capsule Released",
        description: "Revisions in tax tax brackets, sector allocations, and infrastructure guidelines summarized.",
        detailedSummary: "The Union Budget highlights study guide is now available in the portal. It summarizes direct tax revisions, capital investments in expressways, and financial targets for green energy projects.",
        date: "2026-05-25",
        category: "affairs",
        priority: "high",
        read: false,
        fullArticleUrl: "https://economictimes.indiatimes.com",
        importance: "Highly frequent question segment. Expected questions include tax rebate boundaries and budget codes for rural programs.",
        recommendedPrep: "Read the 10-page budget PDF. Practice comparing historical budget deficits to current fiscal year projections."
    },
    {
        id: "notif-affairs-5",
        title: "Banking Awareness Weekly Digest Uploaded",
        description: "Weekly brief tracking bank mergers, NPA resolution mandates, and fintech guidelines.",
        detailedSummary: "The weekly banking digest has been released. It documents RBI's PCA updates, SARFAESI Act enforcement guidelines, and digital bank credit lines.",
        date: "2026-05-24",
        category: "affairs",
        priority: "general",
        read: true,
        fullArticleUrl: "https://www.rbi.org.in",
        importance: "Builds a base in commercial banking operations. Highly valuable for clearing technical banking queries in interviews.",
        recommendedPrep: "Read the dynamic banking glossary. Highlight definitions of Capital Adequacy Ratio and Non-Performing Assets."
    },

    // === COURSE CATEGORY (5 announcements) ===
    {
        id: "notif-course-1",
        title: "Advanced Quant Batch Added",
        description: "New live course covering high-level data caselets, probability, and mixtures added.",
        detailedSummary: "A new advanced batch on Quantitative Aptitude has been launched on the dashboard. The module contains 30 live lectures focusing on modern arithmetic puzzles, logical DI, and advanced probability combinations.",
        date: "2026-05-29",
        category: "course",
        priority: "medium",
        read: false,
        fullArticleUrl: "https://www.sbi.co.in",
        importance: "Mains level Quantitative Aptitude is traditionally complex. Developing skills in caselets and line graphs is key to clearing sectional cuts.",
        recommendedPrep: "Attend live classes at 4:00 PM. Solve the daily practice caselet sheets and verify solutions in the class discussions forum."
    },
    {
        id: "notif-course-2",
        title: "English Grammar Booster Released",
        description: "Booster classes focusing on spotting errors, cloze tests, and paragraph configurations.",
        detailedSummary: "The English Booster module has been uploaded to the learning portal. The lectures summarize 120 key grammar rules frequently tested in sentence restructuring and spotting errors.",
        date: "2026-05-27",
        category: "course",
        priority: "general",
        read: false,
        fullArticleUrl: "https://economictimes.indiatimes.com",
        importance: "The English section is highly scoring. Mastering simple sentence rules saves time for Reading Comprehension.",
        recommendedPrep: "Watch the core video tutorials. Solve the 200-question practice workbook and write spelling notes for error spotting."
    },
    {
        id: "notif-course-3",
        title: "New Reasoning Practice Set Added",
        description: "Practice workbook focusing on circular arrangements, floor puzzles, and input-outputs.",
        detailedSummary: "A reasoning puzzle workbook containing 100 mains-standard puzzles has been added. The questions feature variable-based arrangements matching recent IBPS PO prelims setups.",
        date: "2026-05-26",
        category: "course",
        priority: "general",
        read: true,
        fullArticleUrl: "https://www.ibps.in",
        importance: "Reasoning sections can be highly time-consuming. Familiarity with complex floor patterns helps candidates filter out tough questions.",
        recommendedPrep: "Practice solving at least 5 puzzles daily. Time yourself using a stopwatch to establish a sub-6 minute solution limit."
    },
    {
        id: "notif-course-4",
        title: "Interview & GD Module Progress Update",
        description: "Live interactive panels, personality guidelines, and past transcripts uploaded.",
        detailedSummary: "The mock interview scheduler is now live. Enrolled PO candidates can schedule live mock panels with retired bank officials. Personality development materials are available for download.",
        date: "2026-05-25",
        category: "course",
        priority: "high",
        read: false,
        fullArticleUrl: "https://www.rbi.org.in",
        importance: "The final barrier to selection. In officer recruitments, interviews carry a 20% weightage in final ranking calculations.",
        recommendedPrep: "Review your personal details and academic subjects. Revise current banking trends and book mock slots."
    },
    {
        id: "notif-course-5",
        title: "Crash Course Enrollment Open",
        description: "SBI PO 30-Day Prelims Fast-Track Crash Course active for registrations.",
        detailedSummary: "Registrations are open for the SBI PO Prelims 30-day crash course. The course offers daily live workshops, concept checklists, and 15 simulated prelims test sets.",
        date: "2026-05-24",
        category: "course",
        priority: "high",
        read: false,
        fullArticleUrl: "https://www.sbi.co.in",
        importance: "Quick concept reviews in the final month boost candidates' scores by 10-15%.",
        recommendedPrep: "Register before early registrations close to secure study discounts. Review the daily schedule in the course catalog."
    },

    // === MOCK TEST CATEGORY (5 announcements) ===
    {
        id: "notif-mock-1",
        title: "SBI PO Mock Test #5 Released",
        description: "Full-length prelims mock test #5 active. Video guidelines and percentile calculations included.",
        detailedSummary: "The SBI PO Full Prelims Mock Test #5 has been released. The simulation matches actual patterns, balancing sections and incorporating recent question varieties.",
        date: "2026-05-29",
        category: "mock",
        priority: "high",
        read: false,
        fullArticleUrl: "https://www.sbi.co.in",
        importance: "Mock tests build stamina and teach time management. Tracking percentiles gives candidates a view of topper trends.",
        recommendedPrep: "Take the mock in a quiet room with no interruptions. Target at least a 75+ percentile rating."
    },
    {
        id: "notif-mock-2",
        title: "IBPS Clerk Speed Test Added",
        description: "Short speed test papers covering Simplification, approximation, and series indices.",
        detailedSummary: "A collection of 15 speed tests has been added to the test bank. The papers focus on mathematical approximations, speed arithmetic, and basic sequence coding.",
        date: "2026-05-28",
        category: "mock",
        priority: "medium",
        read: false,
        fullArticleUrl: "https://www.ibps.in",
        importance: "Simplification cards represent quick marks. Solving these in seconds leaves more time for word problems.",
        recommendedPrep: "Attempt 2 speed tests daily before starting core chapters. Focus on reducing visual dependencies on paper drafts."
    },
    {
        id: "notif-mock-3",
        title: "RBI Assistant Full Length Test Published",
        description: "High-cutoff mock test simulating rapid response and high accuracy requirements.",
        detailedSummary: "A new full-length test simulating RBI Assistant prelims is live. Given historically high cutoffs, the paper focuses on high accuracy parameters.",
        date: "2026-05-27",
        category: "mock",
        priority: "medium",
        read: false,
        fullArticleUrl: "https://www.rbi.org.in",
        importance: "Since cutoffs are high, candidates must minimize mistakes and skip complex puzzles quickly.",
        recommendedPrep: "Attempt the mock with a target of 90+ responses. Check accuracy stats in the results review."
    },
    {
        id: "notif-mock-4",
        title: "New Performance Analytics Available",
        description: "AI-based dashboard tracking topic-wise accuracy, speed thresholds, and response charts.",
        detailedSummary: "The mock dashboard has been updated. Candidates can now see a detailed topic-wise accuracy breakdown, time-spent graphs, and top percentile ranges.",
        date: "2026-05-26",
        category: "mock",
        priority: "general",
        read: true,
        fullArticleUrl: "https://economictimes.indiatimes.com",
        importance: "Highlights preparation weaknesses, directing study focus toward low-performance chapters.",
        recommendedPrep: "Open the analytics tab. Identify three low-scoring topics and solve 50 practice questions in each."
    },
    {
        id: "notif-mock-5",
        title: "Weekly Challenge Live",
        description: "All-India open leaderboard test challenge. Register and review topper stats.",
        detailedSummary: "The weekly open leaderboard mock contest is active for 48 hours. Compete against thousands of students nationwide and review rank standings.",
        date: "2026-05-25",
        category: "mock",
        priority: "general",
        read: true,
        fullArticleUrl: "https://www.ibps.in",
        importance: "Replicates competitive exam pressure, providing a realistic estimate of national rank positions.",
        recommendedPrep: "Schedule your attempt during actual exam hours. Analyze performance indices immediately upon submission."
    },

    // === SYSTEM CATEGORY (5 announcements) ===
    {
        id: "notif-system-1",
        title: "Dashboard Performance Improved",
        description: "Core servers upgraded. Video load times and transaction speeds increased.",
        detailedSummary: "The learning dashboard has been migrated to faster cloud servers, reducing video buffering delays and improving page transition speeds by 40%.",
        date: "2026-05-29",
        category: "system",
        priority: "general",
        read: true,
        fullArticleUrl: "https://economictimes.indiatimes.com",
        importance: "Ensures seamless study sessions, reducing time lost to page load delays.",
        recommendedPrep: "Clear browser cache files to activate the server changes in your dashboard."
    },
    {
        id: "notif-system-2",
        title: "Notification Center Released",
        description: "Dynamic notification manager with search, filter tabs, and detail modals live.",
        detailedSummary: "We have launched the Notification Center, linking priority tabs, search queries, dynamic counters, and reading modals.",
        date: "2026-05-28",
        category: "system",
        priority: "general",
        read: true,
        fullArticleUrl: "https://economictimes.indiatimes.com",
        importance: "Keeps candidates updated on exam dates and course releases in real-time.",
        recommendedPrep: "Customize your alerts dashboard and clear read notifications periodically."
    },
    {
        id: "notif-system-3",
        title: "Current Affairs Hub Released",
        description: "Knowledge portal launched with daily must-reads, relevance stars, and quiz panels.",
        detailedSummary: "The Current Affairs Hub is live, featuring star ratings, saved articles bookmarks, and daily MCQ quizzes.",
        date: "2026-05-27",
        category: "system",
        priority: "general",
        read: true,
        fullArticleUrl: "https://economictimes.indiatimes.com",
        importance: "Consolidates general awareness, current news, and practice quizzes in one portal.",
        recommendedPrep: "Explore the hub, bookmark critical economic news, and attempt the daily quiz."
    },
    {
        id: "notif-system-4",
        title: "Analytics Engine Upgraded",
        description: "Algorithmic upgrades for response timing charts and topper comparison grids.",
        detailedSummary: "The analytical module now logs response times down to milliseconds, providing insights on time allocation patterns.",
        date: "2026-05-26",
        category: "system",
        priority: "general",
        read: true,
        fullArticleUrl: "https://economictimes.indiatimes.com",
        importance: "Tracks pacing, helping candidates distribute time effectively between sections.",
        recommendedPrep: "Take a mock test to generate statistics and check speed-accuracy charts."
    },
    {
        id: "notif-system-5",
        title: "Mobile Experience Improved",
        description: "Responsive layouts optimized for menus, tables, and interactive quiz radios.",
        detailedSummary: "Rebuilt mobile CSS configurations ensure clean tables, readable text layouts, and responsive quiz interfaces on all smartphones.",
        date: "2026-05-25",
        category: "system",
        priority: "general",
        read: true,
        fullArticleUrl: "https://economictimes.indiatimes.com",
        importance: "Enables revision and practice on the go with zero layout complications.",
        recommendedPrep: "Open the site on a mobile browser and check menu navigations and quiz submissions."
    }
];

// Initialize notification database in local storage
let notifications = null;
try {
    notifications = JSON.parse(localStorage.getItem('quasibanking_notifications'));
} catch (e) {
    notifications = null;
}
if (!notifications || notifications.length === 0) {
    notifications = DEFAULT_NOTIFICATIONS;
    localStorage.setItem('quasibanking_notifications', JSON.stringify(notifications));
}

async function loadFirestoreNotifications() {
    try {
        const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        
        let cached = [];
        try {
            cached = JSON.parse(localStorage.getItem('quasibanking_notifications')) || [];
        } catch (e) {
            cached = [];
        }

        const liveNotifs = snap.docs.map(doc => {
            const data = doc.data();
            const id = doc.id;
            
            const cachedItem = cached.find(item => item.id === id);
            const isRead = cachedItem ? !!cachedItem.read : false;
            
            let dateStr = new Date().toISOString().split('T')[0];
            if (data.createdAt) {
                const d = typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate() : new Date(data.createdAt);
                dateStr = d.toISOString().split('T')[0];
            }

            return {
                id: id,
                title: data.title || "",
                description: data.desc || "",
                detailedSummary: data.desc || data.title || "",
                date: dateStr,
                category: data.category || "system",
                priority: data.priority || "general",
                read: isRead,
                fullArticleUrl: data.link || "",
                importance: data.priority === 'high' ? 'Highly critical for banking career candidates.' : 'General announcement.',
                recommendedPrep: 'Please check the official link and prepare accordingly.'
            };
        });

        if (liveNotifs.length > 0) {
            const merged = [...liveNotifs];
            
            DEFAULT_NOTIFICATIONS.forEach(defNotif => {
                if (!merged.some(n => n.id === defNotif.id)) {
                    const cachedItem = cached.find(item => item.id === defNotif.id);
                    if (cachedItem) {
                        defNotif.read = !!cachedItem.read;
                    }
                    merged.push(defNotif);
                }
            });

            notifications = merged;
            localStorage.setItem('quasibanking_notifications', JSON.stringify(notifications));
            updateNotificationBadges();
            
            if (document.getElementById('notif-sections-wrapper')) {
                renderNotificationCenterReal();
            }
        }
    } catch (e) {
        console.error("Error loading notifications from Firestore:", e);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    initBellDropdown();
    initNotificationCenter();
    updateNotificationBadges();
    
    // Asynchronously fetch live notifications from Firestore
    await loadFirestoreNotifications();
});

// Toggle dropdown panel & populate items
function initBellDropdown() {
    const bellBtn = document.getElementById('nav-notif-bell');
    const dropdown = document.getElementById('nav-notif-dropdown');
    const dropdownList = document.getElementById('dropdown-notif-list');
    const markAllReadBtn = document.getElementById('mark-all-read-btn');

    if (!bellBtn || !dropdown) return;

    // Toggle dropdown visibility
    bellBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
        if (!dropdown.classList.contains('hidden')) {
            renderDropdownList('all');
        }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== bellBtn && !bellBtn.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });

    // Bind priority tabs inside dropdown
    const tabs = dropdown.querySelectorAll('.dropdown-tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.stopPropagation();
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderDropdownList(tab.dataset.priority);
        });
    });

    // Mark all read action in dropdown
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            markAllAsRead();
            const activeTab = dropdown.querySelector('.dropdown-tab-btn.active');
            renderDropdownList(activeTab ? activeTab.dataset.priority : 'all');
        });
    }

    // Function to render notification rows inside navbar dropdown
    function renderDropdownList(priorityFilter) {
        if (!dropdownList) return;

        let filtered = notifications;
        if (priorityFilter !== 'all') {
            filtered = notifications.filter(n => n.priority === priorityFilter);
        }

        if (filtered.length === 0) {
            dropdownList.innerHTML = `<div class="dropdown-empty">No notifications found</div>`;
            return;
        }

        dropdownList.innerHTML = filtered.map(notif => {
            const unreadDot = !notif.read ? `<span class="unread-dot-indicator"></span>` : '';
            return `
                <div class="dropdown-item ${notif.read ? 'read' : 'unread'}" data-id="${notif.id}">
                    <div class="dropdown-item-header">
                        <span class="dropdown-item-priority priority-${notif.priority}">${notif.priority.toUpperCase()}</span>
                        <span class="dropdown-item-date">${notif.date}</span>
                        ${unreadDot}
                    </div>
                    <div class="dropdown-item-title">${notif.title}</div>
                    <div class="dropdown-item-desc">${notif.description}</div>
                </div>
            `;
        }).join('');

        // Bind click listeners on dropdown items to toggle modal open
        dropdownList.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const notifId = item.dataset.id;
                dropdown.classList.add('hidden');
                openSummaryModal(notifId);
            });
        });
    }
}

// Global badges count sync
function updateNotificationBadges() {
    const unreadCount = notifications.filter(n => !n.read).length;
    
    // Header Bell Badge
    const bellBadge = document.getElementById('nav-notif-bell-badge');
    if (bellBadge) {
        if (unreadCount > 0) {
            bellBadge.textContent = unreadCount;
            bellBadge.classList.remove('hidden');
            bellBadge.classList.add('pulse-badge');
        } else {
            bellBadge.classList.add('hidden');
            bellBadge.classList.remove('pulse-badge');
        }
    }

    // Sidebar Navigation Card Badge
    const sidebarBadge = document.getElementById('sidebar-notif-badge');
    if (sidebarBadge) {
        if (unreadCount > 0) {
            sidebarBadge.textContent = unreadCount;
            sidebarBadge.classList.remove('hidden');
        } else {
            sidebarBadge.classList.add('hidden');
        }
    }
}

// Mark single notification as read
function markAsRead(id) {
    notifications = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem('quasibanking_notifications', JSON.stringify(notifications));
    updateNotificationBadges();
    
    // Rerender center if page is active
    if (document.getElementById('notif-sections-wrapper')) {
        renderNotificationCenterReal();
    }
}

// Mark all notifications as read
function markAllAsRead() {
    notifications = notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem('quasibanking_notifications', JSON.stringify(notifications));
    updateNotificationBadges();
    
    // Rerender center if page is active
    if (document.getElementById('notif-sections-wrapper')) {
        renderNotificationCenterReal();
    }
}

// Clear all notifications marked as read
function clearReadNotifications() {
    notifications = notifications.filter(n => !n.read);
    localStorage.setItem('quasibanking_notifications', JSON.stringify(notifications));
    updateNotificationBadges();
    
    // Rerender center if page is active
    if (document.getElementById('notif-sections-wrapper')) {
        renderNotificationCenterReal();
    }
}

// Open Premium Summary Modal
function openSummaryModal(id) {
    const notif = notifications.find(n => n.id === id);
    if (!notif) return;

    // Mark as read
    markAsRead(id);

    // Populate modal fields
    const modal = document.getElementById('notif-summary-modal');
    const modalTitle = document.getElementById('modal-notif-title');
    const modalExplanation = document.getElementById('modal-explanation');
    const modalRelevance = document.getElementById('modal-relevance');
    const modalAction = document.getElementById('modal-action');
    const modalPriority = document.getElementById('modal-priority-badge');
    const modalCategory = document.getElementById('modal-category-badge');
    const modalDate = document.getElementById('modal-date');
    const modalLink = document.getElementById('modal-external-link');

    if (modalTitle) modalTitle.textContent = notif.title;
    if (modalExplanation) modalExplanation.textContent = notif.detailedSummary;
    if (modalRelevance) modalRelevance.textContent = notif.importance;
    if (modalAction) modalAction.textContent = notif.recommendedPrep;
    if (modalDate) modalDate.innerHTML = `<i class="far fa-calendar-alt"></i> ${notif.date}`;
    
    if (modalPriority) {
        modalPriority.textContent = notif.priority.toUpperCase();
        modalPriority.className = `badge badge-priority-${notif.priority}`;
    }
    if (modalCategory) {
        modalCategory.textContent = notif.category.toUpperCase();
        modalCategory.className = `badge badge-category`;
    }

    if (modalLink) {
        modalLink.href = notif.fullArticleUrl || '#';
    }

    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('active');
    }
}

// Close Summary Modal
function closeSummaryModal() {
    const modal = document.getElementById('notif-summary-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.classList.add('hidden');
    }
}

// Render logic inside full notifications.html page
function initNotificationCenter() {
    const wrapper = document.getElementById('notif-sections-wrapper');
    if (!wrapper) return; // Exit if not on notifications.html

    const searchInput = document.getElementById('notif-search-input');
    const priorityButtons = document.querySelectorAll('#priority-filter-buttons .filter-btn');
    const typeButtons = document.querySelectorAll('#type-filter-buttons .filter-btn');
    const markAllBtn = document.getElementById('center-mark-all-read');
    const clearReadBtn = document.getElementById('center-clear-read');
    const modalCloseBtn = document.getElementById('notif-modal-close');
    const modalOverlay = document.getElementById('notif-summary-modal');

    // Render on search
    if (searchInput) {
        searchInput.addEventListener('input', triggerRenderWithSkeleton);
    }

    // Render on priority buttons change
    priorityButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            priorityButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            triggerRenderWithSkeleton();
        });
    });

    // Render on category buttons change
    typeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            typeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            triggerRenderWithSkeleton();
        });
    });

    // Bind action panel actions
    if (markAllBtn) {
        markAllBtn.addEventListener('click', markAllAsRead);
    }
    if (clearReadBtn) {
        clearReadBtn.addEventListener('click', clearReadNotifications);
    }

    // Bind modal close buttons
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeSummaryModal);
    }
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeSummaryModal();
            }
        });
    }

    // Initial render
    triggerRenderWithSkeleton();
}

let skeletonTimeout = null;

function triggerRenderWithSkeleton() {
    showSkeletons();
    
    // Smooth rendering transition - clear and show cards after 300ms
    if (skeletonTimeout) clearTimeout(skeletonTimeout);
    skeletonTimeout = setTimeout(() => {
        renderNotificationCenterReal();
    }, 300);
}

// Show skeleton loading cards to simulate dynamic updates
function showSkeletons() {
    const categories = ['exam', 'affairs', 'course', 'mock', 'system'];
    categories.forEach(cat => {
        const list = document.getElementById(`list-${cat}-notifs`);
        const section = document.getElementById(`notif-section-${cat}`);
        if (list && section) {
            section.classList.remove('hidden');
            list.innerHTML = `
                <div class="skeleton-card">
                    <div class="skeleton-header">
                        <div class="skeleton-badge-pulse"></div>
                        <div class="skeleton-badge-pulse"></div>
                        <div class="skeleton-date-pulse"></div>
                    </div>
                    <div class="skeleton-title-pulse"></div>
                    <div class="skeleton-text-pulse"></div>
                    <div class="skeleton-text-pulse"></div>
                    <div class="skeleton-footer-pulse">
                        <div class="skeleton-btn-pulse"></div>
                        <div class="skeleton-btn-pulse"></div>
                    </div>
                </div>
                <div class="skeleton-card">
                    <div class="skeleton-header">
                        <div class="skeleton-badge-pulse"></div>
                        <div class="skeleton-badge-pulse"></div>
                        <div class="skeleton-date-pulse"></div>
                    </div>
                    <div class="skeleton-title-pulse"></div>
                    <div class="skeleton-text-pulse"></div>
                    <div class="skeleton-text-pulse"></div>
                    <div class="skeleton-footer-pulse">
                        <div class="skeleton-btn-pulse"></div>
                        <div class="skeleton-btn-pulse"></div>
                    </div>
                </div>
            `;
        }
    });

    const emptyState = document.getElementById('notif-empty-state');
    if (emptyState) emptyState.classList.add('hidden');
}

// Render the actual data and cards inside notifications.html
function renderNotificationCenterReal() {
    const searchInput = document.getElementById('notif-search-input');
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const activePriorityBtn = document.querySelector('#priority-filter-buttons .filter-btn.active');
    const activeTypeBtn = document.querySelector('#type-filter-buttons .filter-btn.active');

    const priorityFilter = activePriorityBtn ? activePriorityBtn.dataset.priority : 'all';
    const typeFilter = activeTypeBtn ? activeTypeBtn.dataset.type : 'all';

    // Lists DOM Elements
    const lists = {
        exam: document.getElementById('list-exam-notifs'),
        affairs: document.getElementById('list-affairs-notifs'),
        course: document.getElementById('list-course-notifs'),
        mock: document.getElementById('list-mock-notifs'),
        system: document.getElementById('list-system-notifs')
    };

    // Sections blocks
    const sections = {
        exam: document.getElementById('notif-section-exam'),
        affairs: document.getElementById('notif-section-affairs'),
        course: document.getElementById('notif-section-course'),
        mock: document.getElementById('notif-section-mock'),
        system: document.getElementById('notif-section-system')
    };

    // Reset list contents
    Object.values(lists).forEach(list => { if (list) list.innerHTML = ''; });

    let matchingCount = 0;

    notifications.forEach(notif => {
        // 1. Search Query check
        const matchSearch = notif.title.toLowerCase().includes(query) || notif.description.toLowerCase().includes(query);
        if (!matchSearch) return;

        // 2. Priority check
        if (priorityFilter !== 'all') {
            if (priorityFilter === 'unread' && notif.read) return;
            if (priorityFilter !== 'unread' && notif.priority !== priorityFilter) return;
        }

        // 3. Category/Type check
        if (typeFilter !== 'all' && notif.category !== typeFilter) return;

        matchingCount++;

        // Render card
        const cardList = lists[notif.category];
        if (cardList) {
            const card = document.createElement('div');
            card.className = `notif-premium-card ${notif.read ? 'read' : 'unread'}`;
            card.setAttribute('data-id', notif.id);
            card.innerHTML = `
                <div class="notif-card-header">
                    <span class="badge badge-priority-${notif.priority}">${notif.priority.toUpperCase()}</span>
                    <span class="badge badge-category">${notif.category.toUpperCase()}</span>
                    <span class="notif-card-date"><i class="far fa-calendar-alt"></i> ${notif.date}</span>
                </div>
                <h3>${notif.title}</h3>
                <p>${notif.description}</p>
                <div class="notif-card-actions-row">
                    <button class="btn btn-primary btn-summary" data-id="${notif.id}">
                        <i class="fas fa-book-open"></i> Read Summary
                    </button>
                    <a href="${notif.fullArticleUrl}" target="_blank" class="btn btn-outline btn-article" data-id="${notif.id}">
                        <i class="fas fa-external-link-alt"></i> Read Full Article
                    </a>
                    ${!notif.read ? `
                        <button class="btn btn-text btn-mark-read" data-id="${notif.id}">
                            <i class="fas fa-check"></i> Mark as Read
                        </button>
                    ` : `
                        <span class="read-receipt"><i class="fas fa-check-double text-emerald-500"></i> Read</span>
                    `}
                </div>
            `;

            // Read summary event
            card.querySelector('.btn-summary').addEventListener('click', (e) => {
                e.stopPropagation();
                openSummaryModal(notif.id);
            });

            // Read full article event (marks as read as well)
            card.querySelector('.btn-article').addEventListener('click', () => {
                markAsRead(notif.id);
            });

            // Mark read listener
            const markBtn = card.querySelector('.btn-mark-read');
            if (markBtn) {
                markBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    markAsRead(notif.id);
                });
            }

            cardList.appendChild(card);
        }
    });

    // Hide empty sections
    Object.keys(lists).forEach(key => {
        const sect = sections[key];
        const list = lists[key];
        if (sect && list) {
            if (list.children.length === 0) {
                sect.classList.add('hidden');
            } else {
                sect.classList.remove('hidden');
            }
        }
    });

    // Empty state trigger
    const emptyState = document.getElementById('notif-empty-state');
    if (emptyState) {
        if (matchingCount === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
        }
    }

    // Render the featured notification card
    renderFeaturedNotification();

    // Render filter counts next to names
    renderFilterCounters();
}

// Render Featured Notification card at the top
function renderFeaturedNotification() {
    const featuredSection = document.getElementById('featured-notification-section');
    if (!featuredSection) return;

    // Extract the latest unread high-priority notification, or fallback to the latest high-priority
    let featured = notifications.find(n => n.priority === 'high' && !n.read);
    if (!featured) {
        featured = notifications.find(n => n.priority === 'high');
    }

    if (!featured) {
        featuredSection.classList.add('hidden');
        return;
    }

    featuredSection.classList.remove('hidden');
    featuredSection.innerHTML = `
        <div class="featured-notif-card ${featured.read ? 'read' : 'unread'}" data-id="${featured.id}">
            <div class="featured-glow-backdrop"></div>
            <div class="featured-content">
                <div class="featured-badge-row">
                    <span class="badge-featured-label"><i class="fas fa-star text-amber-400"></i> FEATURED ALERT</span>
                    <span class="badge badge-priority-high">HIGH</span>
                    <span class="badge badge-category">${featured.category.toUpperCase()}</span>
                    <span class="featured-date"><i class="far fa-calendar-alt"></i> ${featured.date}</span>
                </div>
                <h3>${featured.title}</h3>
                <p>${featured.description}</p>
                <div class="featured-actions">
                    <button class="btn btn-primary btn-modal-summary" data-id="${featured.id}">
                        <i class="fas fa-book-open"></i> Read Summary
                    </button>
                    <a href="${featured.fullArticleUrl}" target="_blank" class="btn btn-outline btn-full-article" data-id="${featured.id}">
                        <i class="fas fa-external-link-alt"></i> Read Full Article
                    </a>
                    ${!featured.read ? `
                        <button class="btn btn-text btn-mark-read-quick" data-id="${featured.id}">
                            <i class="fas fa-check"></i> Mark as Read
                        </button>
                    ` : `
                        <span class="read-receipt"><i class="fas fa-check-double text-emerald-500"></i> Read</span>
                    `}
                </div>
            </div>
        </div>
    `;

    // Bind listeners
    featuredSection.querySelector('.btn-modal-summary').addEventListener('click', (e) => {
        e.stopPropagation();
        openSummaryModal(featured.id);
    });

    featuredSection.querySelector('.btn-full-article').addEventListener('click', () => {
        markAsRead(featured.id);
    });

    const quickReadBtn = featuredSection.querySelector('.btn-mark-read-quick');
    if (quickReadBtn) {
        quickReadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            markAsRead(featured.id);
        });
    }
}

// Render dynamic counters inside categories and priority filter buttons
function renderFilterCounters() {
    // 1. Category counters
    const typeButtons = document.querySelectorAll('#type-filter-buttons .filter-btn');
    typeButtons.forEach(btn => {
        const type = btn.dataset.type;
        let count = 0;
        if (type === 'all') {
            count = notifications.length;
            btn.innerHTML = `All Categories <span class="filter-counter">${count}</span>`;
        } else {
            count = notifications.filter(n => n.category === type).length;
            const names = {
                exam: "Exam Alert",
                affairs: "Current Affairs",
                course: "Course Update",
                mock: "Mock Tests",
                system: "System Update"
            };
            btn.innerHTML = `${names[type]} <span class="filter-counter">${count}</span>`;
        }
    });

    // 2. Priority counters
    const priorityButtons = document.querySelectorAll('#priority-filter-buttons .filter-btn');
    priorityButtons.forEach(btn => {
        const priority = btn.dataset.priority;
        let count = 0;
        if (priority === 'all') {
            count = notifications.length;
            btn.innerHTML = `All <span class="filter-counter">${count}</span>`;
        } else if (priority === 'unread') {
            count = notifications.filter(n => !n.read).length;
            btn.innerHTML = `Unread <span class="filter-counter">${count}</span>`;
        } else {
            count = notifications.filter(n => n.priority === priority).length;
            const names = {
                high: "High",
                medium: "Medium",
                general: "General"
            };
            btn.innerHTML = `${names[priority]} <span class="filter-counter">${count}</span>`;
        }
    });
}
