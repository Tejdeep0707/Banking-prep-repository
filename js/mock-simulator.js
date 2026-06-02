import { logActivity, fetchUserStats } from './dashboard.js';

import { MOCK_EXAM_DATABASE } from './mock-questions-db.js';

// English Questions Pool
const ENGLISH_POOL = [
    {
        section: "english",
        question: "Choose the synonym that best represents the meaning of the word: ADVERSITY",
        options: ["Prosperity", "Misfortune", "Humility", "Simplicity"],
        answer: 1,
        explanation: "Adversity refers to a state of serious or continued difficulty, hardship, or misfortune. Misfortune is therefore the closest synonym."
    },
    {
        section: "english",
        question: "Identify which part of the following sentence contains a grammatical error: 'Neither of the two candidates (A) / have paid their subscription (B) / by the due date (C) / No error (D)'",
        options: ["Part A", "Part B", "Part C", "Part D (No error)"],
        answer: 1,
        explanation: "'Neither' is a singular pronoun and takes a singular verb. Therefore, 'have paid' in Part B is grammatically incorrect and should be replaced with 'has paid'."
    },
    {
        section: "english",
        question: "Choose the word that is most opposite in meaning (antonym) to: ENIGMATIC",
        options: ["Simple", "Mysterious", "Reticent", "Intractable"],
        answer: 0,
        explanation: "Enigmatic means mysterious or difficult to understand. The opposite is Simple."
    },
    {
        section: "english",
        question: "Choose the correct substitution for the underlined phrase: 'Although he was tired, <u>but he went</u> to work.'",
        options: ["but he went to work", "yet he went to work", "he went to work", "and went to work"],
        answer: 2,
        explanation: "'Although' does not take 'but' as a coordinating conjunction. It can be followed by a comma or 'yet'. 'Although he was tired, he went to work' is grammatically correct."
    },
    {
        section: "english",
        question: "Choose the synonym that best represents the meaning of the word: METICULOUS",
        options: ["Careless", "Painstaking", "Lazy", "Hasty"],
        answer: 1,
        explanation: "Meticulous means showing great attention to detail; very careful and precise. Painstaking is the closest synonym."
    },
    {
        section: "english",
        question: "Choose the word that is most opposite in meaning (antonym) to: ZENITH",
        options: ["Nadir", "Peak", "Apex", "Summit"],
        answer: 0,
        explanation: "Zenith is the highest point reached by a celestial or other object. Nadir is the lowest point, making it the antonym."
    },
    {
        section: "english",
        question: "Fill in the blank with the most appropriate word: 'The candidate's credentials were so __________ that the committee hired him immediately.'",
        options: ["mediocre", "questionable", "stellar", "redundant"],
        answer: 2,
        explanation: "Stellar means exceptionally good or outstanding, which explains why the committee hired him immediately."
    },
    {
        section: "english",
        question: "Identify the misspelled word among the following options:",
        options: ["Liaison", "Questionnaire", "Occurrence", "Reciept"],
        answer: 3,
        explanation: "'Reciept' is misspelled. The correct spelling is 'Receipt'."
    }
];

let MOCK_QUESTIONS = Array(10).fill({ options: [] });

function selectJumbledQuestions() {
    const quantGroups = {};
    const reasoningGroups = {};
    
    MOCK_EXAM_DATABASE.forEach(q => {
        if (q.section === "quant") {
            if (!quantGroups[q.num]) quantGroups[q.num] = [];
            quantGroups[q.num].push(q);
        } else if (q.section === "reasoning") {
            if (!reasoningGroups[q.num]) reasoningGroups[q.num] = [];
            reasoningGroups[q.num].push(q);
        }
    });
    
    const quantNums = Object.keys(quantGroups);
    const selectedQuantNums = shuffleArray(quantNums).slice(0, 3);
    
    const reasoningNums = Object.keys(reasoningGroups);
    const selectedReasoningNums = shuffleArray(reasoningNums).slice(0, 4);
    
    const selectedEnglish = shuffleArray([...ENGLISH_POOL]).slice(0, 3);
    
    const examQuestions = [];
    
    selectedQuantNums.forEach(num => {
        const variants = quantGroups[num];
        const chosen = variants[Math.floor(Math.random() * variants.length)];
        examQuestions.push(convertQuestionFormat(chosen));
    });
    
    selectedReasoningNums.forEach(num => {
        const variants = reasoningGroups[num];
        const chosen = variants[Math.floor(Math.random() * variants.length)];
        examQuestions.push(convertQuestionFormat(chosen));
    });
    
    selectedEnglish.forEach(eq => {
        examQuestions.push({
            section: "english",
            question: eq.question,
            options: eq.options,
            answer: eq.answer,
            explanation: eq.explanation
        });
    });
    
    return examQuestions;
}

function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function convertQuestionFormat(q) {
    const optsArray = [];
    if (q.options.a) optsArray.push(q.options.a);
    if (q.options.b) optsArray.push(q.options.b);
    if (q.options.c) optsArray.push(q.options.c);
    if (q.options.d) optsArray.push(q.options.d);
    if (q.options.e) optsArray.push(q.options.e);
    
    return {
        section: q.section,
        question: q.question,
        options: optsArray,
        answer: q.answer,
        explanation: q.explanation
    };
}

// 2. Simulator State Tracker
const state = {
    isOpen: false,
    currentScreen: 'instructions', // 'instructions' | 'test' | 'results' | 'review'
    timeRemaining: 300, // 5 minutes in seconds
    timerInterval: null,
    activeSection: 'quant', // 'quant' | 'reasoning' | 'english'
    activeQuestionIndex: 0,
    userAnswers: Array(MOCK_QUESTIONS.length).fill(null),
    markedForReview: Array(MOCK_QUESTIONS.length).fill(false),
    visitedQuestions: Array(MOCK_QUESTIONS.length).fill(false)
};

// Map question indexes to sections
function getSectionRange(section) {
    if (section === 'quant') return [0, 2];
    if (section === 'reasoning') return [3, 6];
    if (section === 'english') return [7, 9];
    return [0, 9];
}

// 3. UI Template Generator
function renderSimulatorHTML() {
    const container = document.getElementById('mock-simulator-container');
    if (!container) return;

    if (state.currentScreen === 'limit-exceeded') {
        container.innerHTML = `
        <div class="mock-simulator-backdrop">
            <div class="mock-modal card-glass max-w-[500px] w-[90%] p-8 animate-up text-center border border-red-500/20">
                <div class="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6 limit-lock-icon animate-pulse">
                    <i class="fas fa-lock text-3xl text-red-400"></i>
                </div>
                <h2 class="text-3xl font-extrabold text-white mb-3">Daily Limit Reached</h2>
                <p class="text-slate-300 text-sm mb-6 leading-relaxed">
                    Your daily free limit of 8 mock exams has been reached. Please come back tomorrow to continue your preparation!
                </p>
                <div class="bg-white/5 border border-white/10 rounded-xl p-4 text-left mb-8 space-y-2 text-xs text-slate-400">
                    <div class="flex justify-between items-center">
                        <span>Daily Free Limit:</span>
                        <span class="font-bold text-white">8 Tests / 24 hrs</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span>Status:</span>
                        <span class="font-bold text-red-400 flex items-center gap-1">
                            Locked
                        </span>
                    </div>
                </div>
                <button id="exit-limit-btn" class="btn btn-outline w-full py-3 font-semibold rounded-xl hover:scale-105 active:scale-95 transition-all text-white border-white/20">
                    Exit Exam Portal
                </button>
            </div>
        </div>
        `;
        const exitBtn = document.getElementById('exit-limit-btn');
        if (exitBtn) {
            exitBtn.onclick = closeMockSimulator;
        }
        return;
    }

    if (state.currentScreen === 'instructions') {
        container.innerHTML = `
        <div class="mock-simulator-backdrop">
            <div class="mock-modal card-glass max-w-[600px] w-[90%] p-8 animate-up text-center">
                <i class="fas fa-file-signature text-5xl text-indigo-400 mb-6"></i>
                <h2 class="text-3xl font-extrabold text-white mb-2">Free Mock Examination</h2>
                <p class="text-indigo-300 text-sm font-bold uppercase tracking-wider mb-6">SBI PO 2026 Recruitment Standard</p>
                
                <div class="bg-white/5 border border-white/10 rounded-2xl p-6 text-left mb-8 space-y-4 text-slate-300 text-sm leading-relaxed">
                    <div class="flex items-center gap-3 font-semibold text-white">
                        <i class="fas fa-info-circle text-indigo-400 text-base"></i>
                        <span>Test Guidelines & Pattern</span>
                    </div>
                    <ul class="list-disc pl-5 space-y-2">
                        <li><strong>Total Questions:</strong> 10 Questions (3 Quant, 4 Reasoning, 3 English)</li>
                        <li><strong>Time Duration:</strong> 5 minutes (05:00) strict timer.</li>
                        <li><strong>Marking System:</strong> +1.00 Mark for Correct, -0.25 Negative Mark for Incorrect.</li>
                        <li>The test will auto-submit automatically when the countdown timer hits 00:00.</li>
                    </ul>
                </div>
                
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <button id="start-mock-btn" class="btn btn-primary px-8 py-3 font-bold rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all">
                        I am Ready to Begin <i class="fas fa-arrow-right ml-1"></i>
                    </button>
                    <button id="close-mock-btn" class="btn btn-outline px-8 py-3 font-semibold rounded-xl hover:scale-105 active:scale-95 transition-all">
                        Exit Exam Portal
                    </button>
                </div>
            </div>
        </div>
        `;
        bindInstructionListeners();
        return;
    }

    if (state.currentScreen === 'test') {
        const q = MOCK_QUESTIONS[state.activeQuestionIndex];
        const minutes = String(Math.floor(state.timeRemaining / 60)).padStart(2, '0');
        const seconds = String(state.timeRemaining % 60).padStart(2, '0');

        // Retrieve user details for candidate block
        let userName = "Guest Aspirant";
        try {
            const userDetails = JSON.parse(localStorage.getItem('quasibanking_user_details') || '{}');
            if (userDetails.name) {
                userName = userDetails.name;
            }
        } catch (e) {
            console.error(e);
        }

        container.innerHTML = `
        <div class="mock-simulator-backdrop">
            <div class="mock-test-console w-full h-full flex flex-col overflow-hidden animate-up">
                
                <!-- TOP BAR: Timer & Progress -->
                <div class="console-header">
                    <div class="console-title-wrap">
                        <i class="fas fa-graduation-cap text-indigo-400 text-xl"></i>
                        <div class="flex flex-col text-left">
                            <span class="font-bold text-white text-sm md:text-base leading-tight uppercase tracking-wider">SBI PO Preliminary Examination</span>
                            <span class="text-[10px] text-slate-400 font-semibold tracking-wide">ONLINE MOCK TEST PORTAL</span>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-4">
                        <!-- Candidate Quick Info -->
                        <div class="hidden sm:flex items-center gap-3 border-r border-white/10 pr-4 text-left text-xs leading-normal">
                            <div class="w-8 h-8 rounded bg-slate-700 border border-slate-600 flex items-center justify-center text-white font-bold">
                                ${userName.charAt(0).toUpperCase()}
                            </div>
                            <div class="flex flex-col text-white">
                                <span>Candidate: <strong class="text-white">${userName}</strong></span>
                                <span class="text-[10px] text-indigo-300 font-semibold">Subject: Mock Paper</span>
                            </div>
                        </div>

                        <div class="console-timer-badge">
                            <i class="fas fa-clock animate-pulse"></i>
                            <span id="console-timer-text">${minutes}:${seconds}</span>
                        </div>
                    </div>
                </div>

                <!-- SECTION SELECTOR TABS -->
                <div class="console-section-tabs">
                    <button class="section-tab-btn ${state.activeSection === 'quant' ? 'active' : ''}" data-sec="quant">
                        Quantitative Aptitude (Q1-3)
                    </button>
                    <button class="section-tab-btn ${state.activeSection === 'reasoning' ? 'active' : ''}" data-sec="reasoning">
                        Reasoning Ability (Q4-7)
                    </button>
                    <button class="section-tab-btn ${state.activeSection === 'english' ? 'active' : ''}" data-sec="english">
                        English Language (Q8-10)
                    </button>
                </div>

                <!-- MAIN WORKSPACE -->
                <div class="console-workspace flex-1 flex flex-col md:flex-row overflow-hidden">
                    
                    <!-- LEFT COLUMN: Question Content -->
                    <div class="workspace-question flex-1 flex flex-col p-6 md:p-8 overflow-y-auto">
                        <div class="question-header mb-4">
                            <span class="question-number-badge">Question ${state.activeQuestionIndex + 1}</span>
                            <span class="question-section-tag uppercase">${q.section}</span>
                            <span class="ml-auto text-xs text-slate-400">Marks: Correct <span class="text-green-400 font-semibold">+1.00</span> | Incorrect <span class="text-red-400 font-semibold">-0.25</span></span>
                        </div>
                        <p class="question-text text-white font-medium text-base md:text-lg mb-6 leading-relaxed">
                            ${q.question}
                        </p>
                        
                        <div class="question-options-list space-y-3 flex-1">
                            ${q.options.map((opt, idx) => {
                                const isChecked = state.userAnswers[state.activeQuestionIndex] === idx;
                                return `
                                <label class="option-label-card ${isChecked ? 'selected' : ''}">
                                    <input type="radio" name="mock-option" value="${idx}" ${isChecked ? 'checked' : ''} class="hidden">
                                    <div class="option-indicator">${String.fromCharCode(65 + idx)}</div>
                                    <span class="option-text text-slate-300 text-sm md:text-base">${opt}</span>
                                </label>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <!-- RIGHT COLUMN: Palette Grid -->
                    <div class="workspace-palette w-full md:w-[280px] p-6 border-t md:border-t-0 md:border-l border-white/10 flex flex-col overflow-y-auto bg-slate-900/40">
                        
                        <!-- Candidate Detailed Card (Real Exam Style) -->
                        <div class="hidden md:flex flex-col items-center p-4 border border-white/5 bg-white/5 rounded-xl mb-6 text-center">
                            <div class="w-14 h-14 rounded-full bg-indigo-600 border-2 border-indigo-400/30 flex items-center justify-center text-white text-xl font-bold mb-2">
                                ${userName.charAt(0).toUpperCase()}
                            </div>
                            <span class="text-white text-sm font-semibold truncate w-full">${userName}</span>
                            <span class="text-[9px] text-slate-400 uppercase font-bold tracking-widest mt-1">Roll No: QB-${(state.isOpen ? '2026' : '0000')}</span>
                        </div>

                        <h4 class="text-white text-xs font-bold uppercase tracking-wider mb-4">Question Palette</h4>
                        <div class="palette-grid grid grid-cols-5 gap-3 mb-6">
                            ${MOCK_QUESTIONS.map((item, idx) => {
                                let statusClass = 'unvisited';
                                if (state.activeQuestionIndex === idx) {
                                    statusClass = 'active';
                                } else if (state.markedForReview[idx]) {
                                    statusClass = 'review';
                                } else if (state.userAnswers[idx] !== null) {
                                    statusClass = 'answered';
                                } else if (state.visitedQuestions[idx]) {
                                    statusClass = 'unanswered';
                                }
                                return `
                                <button class="palette-circle ${statusClass}" data-idx="${idx}">
                                    ${idx + 1}
                                </button>
                                `;
                            }).join('')}
                        </div>

                        <!-- LEGEND -->
                        <div class="palette-legend mt-auto space-y-2 text-xs text-slate-400 border-t border-white/10 pt-4">
                            <div class="flex items-center gap-2">
                                <span class="legend-dot answered"></span>
                                <span>Answered</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="legend-dot unanswered"></span>
                                <span>Not Answered</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="legend-dot review"></span>
                                <span>Marked for Review</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="legend-dot unvisited"></span>
                                <span>Not Visited</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- FOOTER ACTIONS -->
                <div class="console-footer">
                    <div class="footer-left flex gap-2">
                        <button id="clear-resp-btn" class="btn btn-outline py-2 px-4 text-xs font-semibold rounded-lg">
                            Clear Response
                        </button>
                        <button id="review-resp-btn" class="btn btn-outline py-2 px-4 text-xs font-semibold rounded-lg text-indigo-300 border-indigo-500/20">
                            Mark for Review & Next
                        </button>
                    </div>
                    <div class="footer-right flex gap-3">
                        <button id="prev-question-btn" class="btn btn-outline py-2 px-4 text-xs font-semibold rounded-lg" ${state.activeQuestionIndex === 0 ? 'disabled' : ''}>
                            &larr; Back
                        </button>
                        <button id="save-next-btn" class="btn btn-primary py-2 px-6 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white border-none">
                            Save & Next <i class="fas fa-chevron-right ml-1"></i>
                        </button>
                        <button id="submit-mock-btn" class="btn py-2 px-5 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 border-none">
                            Submit Exam
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
        bindTestConsoleListeners();
        return;
    }

    if (state.currentScreen === 'results') {
        const stats = calculateMockScore();
        const scorePercent = Math.round((stats.correct / MOCK_QUESTIONS.length) * 100);

        container.innerHTML = `
        <div class="mock-simulator-backdrop">
            <div class="mock-modal card-glass max-w-[650px] w-[90%] p-8 animate-up text-center">
                <i class="fas fa-trophy text-5xl text-yellow-400 mb-4"></i>
                <h2 class="text-3xl font-extrabold text-white mb-2">Performance Summary</h2>
                <p class="text-slate-400 text-sm mb-8">Your results are compiled based on negative marking rules (+1.00 / -0.25)</p>
                
                <!-- SCORE METRICS CARD -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <div class="bg-white/5 border border-white/10 rounded-xl p-4">
                        <span class="block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Final Score</span>
                        <span class="text-2xl font-black text-white">${stats.finalScore.toFixed(2)}</span>
                    </div>
                    <div class="bg-white/5 border border-white/10 rounded-xl p-4">
                        <span class="block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Accuracy</span>
                        <span class="text-2xl font-black text-indigo-400">${stats.accuracy}%</span>
                    </div>
                    <div class="bg-white/5 border border-white/10 rounded-xl p-4">
                        <span class="block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Correct</span>
                        <span class="text-2xl font-black text-green-400">${stats.correct}</span>
                    </div>
                    <div class="bg-white/5 border border-white/10 rounded-xl p-4">
                        <span class="block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Incorrect</span>
                        <span class="text-2xl font-black text-red-400">${stats.incorrect}</span>
                    </div>
                </div>

                <div class="bg-white/5 border border-white/10 rounded-2xl p-6 text-left mb-8 space-y-3 text-sm text-slate-300">
                    <div class="flex justify-between">
                        <span>Total Questions attempted:</span>
                        <span class="font-bold text-white">${stats.answered} / 10</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Negative Marks deducted:</span>
                        <span class="font-bold text-red-400">-${(stats.incorrect * 0.25).toFixed(2)} Marks</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Unanswered Questions:</span>
                        <span class="font-bold text-slate-400">${stats.unanswered}</span>
                    </div>
                </div>
                
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <button id="sync-dashboard-btn" class="btn btn-primary px-8 py-3 font-bold rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all">
                        Sync to Dashboard <i class="fas fa-check-circle ml-1"></i>
                    </button>
                    <button id="review-explanation-btn" class="btn btn-outline px-8 py-3 font-semibold rounded-xl hover:scale-105 active:scale-95 transition-all text-indigo-400 border-indigo-500/20">
                        Review Solutions <i class="fas fa-lightbulb ml-1"></i>
                    </button>
                </div>
            </div>
        </div>
        `;
        bindResultsListeners();
        return;
    }

    if (state.currentScreen === 'review') {
        const q = MOCK_QUESTIONS[state.activeQuestionIndex];
        const userAnswerIdx = state.userAnswers[state.activeQuestionIndex];
        
        // Retrieve user details for candidate block
        let userName = "Guest Aspirant";
        try {
            const userDetails = JSON.parse(localStorage.getItem('quasibanking_user_details') || '{}');
            if (userDetails.name) {
                userName = userDetails.name;
            }
        } catch (e) {
            console.error(e);
        }

        container.innerHTML = `
        <div class="mock-simulator-backdrop">
            <div class="mock-test-console w-full h-full flex flex-col overflow-hidden animate-up">
                
                <!-- TOP BAR: Review Status -->
                <div class="console-header" style="background: rgba(99, 102, 241, 0.08);">
                    <div class="console-title-wrap">
                        <i class="fas fa-lightbulb text-amber-400 text-xl"></i>
                        <div class="flex flex-col text-left">
                            <span class="font-bold text-white text-sm md:text-base leading-tight uppercase tracking-wider">Solutions Review Mode</span>
                            <span class="text-[10px] text-indigo-300 font-semibold tracking-wide">ONLINE EXAM CONSOLE</span>
                        </div>
                    </div>
                    <button id="back-results-btn" class="btn btn-outline py-1.5 px-4 text-xs font-semibold rounded-lg text-indigo-300 border-indigo-500/20">
                        &larr; Back to Results
                    </button>
                </div>

                <!-- MAIN WORKSPACE -->
                <div class="console-workspace flex-1 flex flex-col md:flex-row overflow-hidden">
                    
                    <!-- LEFT COLUMN: Question Solution Review -->
                    <div class="workspace-question flex-1 flex flex-col p-6 md:p-8 overflow-y-auto">
                        <div class="question-header mb-4">
                            <span class="question-number-badge bg-indigo-500/20 text-indigo-300">Question ${state.activeQuestionIndex + 1}</span>
                            <span class="question-section-tag uppercase">${q.section}</span>
                        </div>
                        <p class="question-text text-white font-medium text-base md:text-lg mb-6 leading-relaxed">
                            ${q.question}
                        </p>
                        
                        <div class="question-options-list space-y-3 mb-6">
                            ${q.options.map((opt, idx) => {
                                let statusClass = '';
                                if (q.answer === idx) {
                                    statusClass = 'correct-solution';
                                } else if (userAnswerIdx === idx) {
                                    statusClass = 'incorrect-solution';
                                }
                                return `
                                <div class="option-label-card ${statusClass}">
                                    <div class="option-indicator">${String.fromCharCode(65 + idx)}</div>
                                    <span class="option-text text-slate-300 text-sm md:text-base">${opt}</span>
                                    ${q.answer === idx ? '<span class="ml-auto text-green-400 text-xs font-bold uppercase"><i class="fas fa-check-circle mr-1"></i>Correct Answer</span>' : ''}
                                    ${userAnswerIdx === idx && q.answer !== idx ? '<span class="ml-auto text-red-400 text-xs font-bold uppercase"><i class="fas fa-times-circle mr-1"></i>Your Answer</span>' : ''}
                                    ${userAnswerIdx === idx && q.answer === idx ? '<span class="ml-auto text-green-400 text-xs font-bold uppercase"><i class="fas fa-check-double mr-1"></i>Your Choice (Correct)</span>' : ''}
                                </div>
                                `;
                            }).join('')}
                        </div>

                        <!-- EXPLANATION DRAWER -->
                        <div class="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-5 mb-4">
                            <h4 class="font-bold text-white text-sm mb-2 flex items-center gap-2">
                                <i class="fas fa-info-circle text-indigo-400"></i> Detailed Explanation:
                            </h4>
                            <p class="text-slate-300 text-sm leading-relaxed">${q.explanation}</p>
                        </div>
                    </div>

                    <!-- RIGHT COLUMN: Palette Grid -->
                    <div class="workspace-palette w-full md:w-[280px] p-6 border-t md:border-t-0 md:border-l border-white/10 flex flex-col overflow-y-auto bg-slate-900/40">
                        
                        <!-- Candidate Detailed Card (Real Exam Style) -->
                        <div class="hidden md:flex flex-col items-center p-4 border border-white/5 bg-white/5 rounded-xl mb-6 text-center">
                            <div class="w-14 h-14 rounded-full bg-indigo-600 border-2 border-indigo-400/30 flex items-center justify-center text-white text-xl font-bold mb-2">
                                ${userName.charAt(0).toUpperCase()}
                            </div>
                            <span class="text-white text-sm font-semibold truncate w-full">${userName}</span>
                            <span class="text-[9px] text-slate-400 uppercase font-bold tracking-widest mt-1">Roll No: QB-${(state.isOpen ? '2026' : '0000')}</span>
                        </div>

                        <h4 class="text-white text-xs font-bold uppercase tracking-wider mb-4">Quick Navigation</h4>
                        <div class="palette-grid grid grid-cols-5 gap-3 mb-6">
                            ${MOCK_QUESTIONS.map((item, idx) => {
                                let statusClass = 'review-correct';
                                if (state.userAnswers[idx] === null) {
                                    statusClass = 'review-unanswered';
                                } else if (state.userAnswers[idx] !== item.answer) {
                                    statusClass = 'review-incorrect';
                                }
                                
                                if (state.activeQuestionIndex === idx) {
                                    statusClass += ' active-review';
                                }
                                return `
                                <button class="palette-circle ${statusClass}" data-idx="${idx}">
                                    ${idx + 1}
                                </button>
                                `;
                            }).join('')}
                        </div>

                        <div class="palette-legend mt-auto space-y-2 text-xs text-slate-400 border-t border-white/10 pt-4">
                            <div class="flex items-center gap-2">
                                <span class="legend-dot bg-green-500/20 border border-green-500/30"></span>
                                <span>Correct / Earned +1</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="legend-dot bg-red-500/20 border border-red-500/30"></span>
                                <span>Incorrect / Deducted -0.25</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="legend-dot bg-slate-700/30 border border-slate-700/50"></span>
                                <span>Unanswered</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- FOOTER ACTIONS -->
                <div class="console-footer">
                    <button id="prev-review-btn" class="btn btn-outline py-2 px-4 text-xs font-semibold rounded-lg" ${state.activeQuestionIndex === 0 ? 'disabled' : ''}>
                        &larr; Previous Question
                    </button>
                    <button id="next-review-btn" class="btn btn-primary py-2 px-5 text-xs font-bold rounded-lg" ${state.activeQuestionIndex === MOCK_QUESTIONS.length - 1 ? 'disabled' : ''}>
                        Next Question &rarr;
                    </button>
                </div>
            </div>
        </div>
        `;
        bindReviewConsoleListeners();
        return;
    }
}

// 4. Calculations Helpers
function calculateMockScore() {
    let correct = 0;
    let incorrect = 0;
    let answered = 0;

    state.userAnswers.forEach((ans, idx) => {
        if (ans !== null) {
            answered++;
            if (ans === MOCK_QUESTIONS[idx].answer) {
                correct++;
            } else {
                incorrect++;
            }
        }
    });

    const unanswered = MOCK_QUESTIONS.length - answered;
    const finalScore = Math.max(0, correct * 1.00 - incorrect * 0.25);
    const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;

    return {
        correct,
        incorrect,
        answered,
        unanswered,
        finalScore,
        accuracy
    };
}

// 5. Timer Controller
function startCountdownTimer() {
    stopTimer();
    state.timerInterval = setInterval(() => {
        state.timeRemaining--;
        if (state.timeRemaining <= 0) {
            state.timeRemaining = 0;
            stopTimer();
            alert("⏰ Time is up! Your answers are being submitted automatically.");
            submitMockExam();
        } else {
            // Update only the timer text node to prevent full page re-renders
            const timerEl = document.getElementById('console-timer-text');
            if (timerEl) {
                const minutes = String(Math.floor(state.timeRemaining / 60)).padStart(2, '0');
                const seconds = String(state.timeRemaining % 60).padStart(2, '0');
                timerEl.textContent = `${minutes}:${seconds}`;
            }
        }
    }, 1000);
}

function stopTimer() {
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
    }
}

// 6. Action Helpers
function checkDailyMockLimit() {
    let timestamps = [];
    try {
        timestamps = JSON.parse(localStorage.getItem('quasibanking_mock_timestamps') || '[]');
    } catch(e) {
        timestamps = [];
    }
    if (!Array.isArray(timestamps)) timestamps = [];
    
    const now = Date.now();
    const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;
    
    // Filter out timestamps older than 24 hours
    const recentTimestamps = timestamps.filter(ts => ts > twentyFourHoursAgo);
    
    // Save back the filtered list
    localStorage.setItem('quasibanking_mock_timestamps', JSON.stringify(recentTimestamps));
    
    return recentTimestamps.length >= 8;
}

export function openMockSimulator() {
    state.isOpen = true;
    state.timeRemaining = 300;
    state.activeSection = 'quant';
    state.activeQuestionIndex = 0;

    // Check daily limit
    if (checkDailyMockLimit()) {
        state.currentScreen = 'limit-exceeded';
    } else {
        state.currentScreen = 'instructions';
        // Select jumbled questions
        MOCK_QUESTIONS = selectJumbledQuestions();
    }

    state.userAnswers = Array(MOCK_QUESTIONS.length).fill(null);
    state.markedForReview = Array(MOCK_QUESTIONS.length).fill(false);
    state.visitedQuestions = Array(MOCK_QUESTIONS.length).fill(false);
    state.visitedQuestions[0] = true; // Mark first question visited

    // Full screen overlay toggle: hide site frame
    document.body.classList.add('mock-console-active');

    const container = document.getElementById('mock-simulator-container');
    if (container) {
        container.classList.remove('hidden');
        renderSimulatorHTML();
    }
}

function closeMockSimulator() {
    state.isOpen = false;
    stopTimer();
    document.body.classList.remove('mock-console-active');
    const container = document.getElementById('mock-simulator-container');
    if (container) {
        container.classList.add('hidden');
        container.innerHTML = '';
    }
}

function submitMockExam() {
    stopTimer();
    state.currentScreen = 'results';
    renderSimulatorHTML();
}

function syncScoresToDashboard() {
    const stats = calculateMockScore();
    
    // Track timestamps for daily limit
    let timestamps = [];
    try {
        timestamps = JSON.parse(localStorage.getItem('quasibanking_mock_timestamps') || '[]');
    } catch(e) {
        timestamps = [];
    }
    if (!Array.isArray(timestamps)) timestamps = [];
    timestamps.push(Date.now());
    localStorage.setItem('quasibanking_mock_timestamps', JSON.stringify(timestamps));
    
    // Read local stats
    let currentMocks = parseInt(localStorage.getItem('quasibanking_mocks_completed') || '0', 10);
    currentMocks += 1;
    localStorage.setItem('quasibanking_mocks_completed', currentMocks.toString());
    
    // Average or overwrite accuracy
    localStorage.setItem('quasibanking_accuracy', `${stats.accuracy}%`);
    localStorage.setItem('quasibanking_quiz_accuracy', `${stats.accuracy}%`);

    logActivity(`📝 Completed mock exam: SBI PO Mock Test #${currentMocks} (Accuracy: ${stats.accuracy}%)`);
    
    fetchUserStats();
    closeMockSimulator();
}

// 7. Event Binding & Listeners
function bindInstructionListeners() {
    const startBtn = document.getElementById('start-mock-btn');
    const closeBtn = document.getElementById('close-mock-btn');

    if (startBtn) {
        startBtn.onclick = () => {
            state.currentScreen = 'test';
            renderSimulatorHTML();
            startCountdownTimer();
        };
    }
    if (closeBtn) {
        closeBtn.onclick = closeMockSimulator;
    }
}

function bindTestConsoleListeners() {
    // 1. Radio Options selectors
    const optionLabels = document.querySelectorAll('.option-label-card');
    optionLabels.forEach(lbl => {
        lbl.onclick = (e) => {
            const radio = lbl.querySelector('input[type="radio"]');
            if (radio) {
                const optVal = parseInt(radio.value, 10);
                state.userAnswers[state.activeQuestionIndex] = optVal;
                
                // Clear selection states & highlight clicked
                optionLabels.forEach(l => l.classList.remove('selected'));
                lbl.classList.add('selected');

                // Update palette status color instantly
                const circle = document.querySelector(`.palette-circle[data-idx="${state.activeQuestionIndex}"]`);
                if (circle) {
                    circle.className = 'palette-circle answered';
                }
            }
        };
    });

    // 2. Action buttons
    const clearBtn = document.getElementById('clear-resp-btn');
    if (clearBtn) {
        clearBtn.onclick = () => {
            state.userAnswers[state.activeQuestionIndex] = null;
            state.markedForReview[state.activeQuestionIndex] = false;
            
            // Uncheck active selection UI
            optionLabels.forEach(l => l.classList.remove('selected'));
            const radio = document.querySelector('input[name="mock-option"]:checked');
            if (radio) radio.checked = false;

            const circle = document.querySelector(`.palette-circle[data-idx="${state.activeQuestionIndex}"]`);
            if (circle) {
                circle.className = 'palette-circle active';
            }
        };
    }

    const reviewBtn = document.getElementById('review-resp-btn');
    if (reviewBtn) {
        reviewBtn.onclick = () => {
            state.markedForReview[state.activeQuestionIndex] = true;
            nextQuestion();
        };
    }

    const prevBtn = document.getElementById('prev-question-btn');
    if (prevBtn) {
        prevBtn.onclick = () => {
            if (state.activeQuestionIndex > 0) {
                state.activeQuestionIndex--;
                state.visitedQuestions[state.activeQuestionIndex] = true;
                syncActiveSection();
                renderSimulatorHTML();
            }
        };
    }

    const saveNextBtn = document.getElementById('save-next-btn');
    if (saveNextBtn) {
        saveNextBtn.onclick = nextQuestion;
    }

    const submitBtn = document.getElementById('submit-mock-btn');
    if (submitBtn) {
        submitBtn.onclick = () => {
            const unansweredCount = MOCK_QUESTIONS.length - state.userAnswers.filter(ans => ans !== null).length;
            const confirmMsg = unansweredCount > 0 
                ? `You have ${unansweredCount} unanswered question(s) remaining.\nAre you sure you want to submit the exam?`
                : `Are you sure you want to submit the exam?`;
            
            if (confirm(confirmMsg)) {
                submitMockExam();
            }
        };
    }

    // 3. Section Selectors Tabs
    const tabs = document.querySelectorAll('.section-tab-btn');
    tabs.forEach(tab => {
        tab.onclick = () => {
            const section = tab.dataset.sec;
            const range = getSectionRange(section);
            state.activeSection = section;
            state.activeQuestionIndex = range[0];
            state.visitedQuestions[state.activeQuestionIndex] = true;
            renderSimulatorHTML();
        };
    });

    // 4. Palette Circle click jump
    const circles = document.querySelectorAll('.palette-circle');
    circles.forEach(circle => {
        circle.onclick = () => {
            const targetIdx = parseInt(circle.dataset.idx, 10);
            state.activeQuestionIndex = targetIdx;
            state.visitedQuestions[state.activeQuestionIndex] = true;
            syncActiveSection();
            renderSimulatorHTML();
        };
    });
}

function bindResultsListeners() {
    const syncBtn = document.getElementById('sync-dashboard-btn');
    const reviewBtn = document.getElementById('review-explanation-btn');

    if (syncBtn) {
        syncBtn.onclick = syncScoresToDashboard;
    }
    if (reviewBtn) {
        reviewBtn.onclick = () => {
            state.currentScreen = 'review';
            state.activeQuestionIndex = 0;
            renderSimulatorHTML();
        };
    }
}

function bindReviewConsoleListeners() {
    const backBtn = document.getElementById('back-results-btn');
    const prevBtn = document.getElementById('prev-review-btn');
    const nextBtn = document.getElementById('next-review-btn');

    if (backBtn) {
        backBtn.onclick = () => {
            state.currentScreen = 'results';
            renderSimulatorHTML();
        };
    }
    if (prevBtn) {
        prevBtn.onclick = () => {
            if (state.activeQuestionIndex > 0) {
                state.activeQuestionIndex--;
                renderSimulatorHTML();
            }
        };
    }
    if (nextBtn) {
        nextBtn.onclick = () => {
            if (state.activeQuestionIndex < MOCK_QUESTIONS.length - 1) {
                state.activeQuestionIndex++;
                renderSimulatorHTML();
            }
        };
    }

    // Palette navigation jump in review mode
    const circles = document.querySelectorAll('.palette-circle');
    circles.forEach(circle => {
        circle.onclick = () => {
            const targetIdx = parseInt(circle.dataset.idx, 10);
            state.activeQuestionIndex = targetIdx;
            renderSimulatorHTML();
        };
    });
}

// 8. Navigation State helpers
function nextQuestion() {
    if (state.activeQuestionIndex < MOCK_QUESTIONS.length - 1) {
        state.activeQuestionIndex++;
        state.visitedQuestions[state.activeQuestionIndex] = true;
        syncActiveSection();
        renderSimulatorHTML();
    } else {
        // Wrap around or alert to submit
        alert("🎉 You've reached the last question! Click the red 'Submit Exam' button at the bottom right to complete the test.");
    }
}

function syncActiveSection() {
    const q = MOCK_QUESTIONS[state.activeQuestionIndex];
    state.activeSection = q.section;
}

// Bind Mock Simulator triggers on DOM Load
function initMockSimulatorListeners() {
    // Hijack index mock buttons
    const mockToggles = ['nav-mocks', 'qa-mock', 'cc-mock-btn', 'onboard-mock-btn'];
    mockToggles.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openMockSimulator();
            });
        }
    });

    // Check if triggered from subpage redirect query string (?triggerMock=true)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('triggerMock') === 'true') {
        // Clean the URL query params without reloading to keep it neat
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({ path: newUrl }, '', newUrl);
        
        setTimeout(() => {
            openMockSimulator();
        }, 300);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMockSimulatorListeners);
} else {
    initMockSimulatorListeners();
}
window.openMockSimulator = openMockSimulator;
