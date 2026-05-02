// --- PREMIUM MOCK TEST ENGINE DATA (30 QUESTIONS) ---
const mockTestData = [
  { "id": 1, "question": "What will come in place of the question mark (?) in the following equation? 35% of 600 + 12^2 - 40 = ?", "options": ["314", "324", "294", "304", "334"], "answer": "314", "topic": "Quant", "difficulty": "easy" },
  { "id": 2, "question": "Find the value of (?): √1024 ÷ 4 + 15 × 5 = ?", "options": ["81", "83", "85", "79", "77"], "answer": "83", "topic": "Quant", "difficulty": "easy" },
  { "id": 3, "question": "The ratio of two numbers A and B is 3:4. If their sum is 140, what is the value of B?", "options": ["60", "70", "80", "90", "100"], "answer": "80", "topic": "Quant", "difficulty": "easy" },
  { "id": 4, "question": "A number, when increased by 20%, becomes 720. Find the original number.", "options": ["580", "620", "640", "600", "660"], "answer": "600", "topic": "Quant", "difficulty": "easy" },
  { "id": 5, "question": "What is the next number in the series? 4, 9, 16, 25, 36, ?", "options": ["45", "47", "49", "51", "53"], "answer": "49", "topic": "Quant", "difficulty": "easy" },
  { "id": 6, "question": "Find the missing number in the series: 10, 11, 19, 46, ?", "options": ["100", "110", "112", "120", "108"], "answer": "110", "topic": "Quant", "difficulty": "moderate" },
  { "id": 7, "question": "The average of 5 numbers is 20. If a 6th number 32 is added, what is the new average?", "options": ["21", "22", "23", "24", "25"], "answer": "22", "topic": "Quant", "difficulty": "moderate" },
  { "id": 8, "question": "A shopkeeper buys an article for ₹800 and sells it for ₹920. Find the profit percentage.", "options": ["12%", "15%", "18%", "20%", "10%"], "answer": "15%", "topic": "Quant", "difficulty": "easy" },
  { "id": 9, "question": "A can complete a work in 10 days and B can do the same work in 15 days. In how many days can they complete it together?", "options": ["5 days", "6 days", "7 days", "8 days", "9 days"], "answer": "6 days", "topic": "Quant", "difficulty": "moderate" },
  { "id": 10, "question": "Find the simple interest on ₹5000 at a rate of 10% per annum for 2 years.", "options": ["₹800", "₹900", "₹1000", "₹1100", "₹1200"], "answer": "₹1000", "topic": "Quant", "difficulty": "easy" },
  { "id": 11, "question": "If 'DELHI' is coded as 'EFMIJ', then how will 'BOMBAY' be coded?", "options": ["CPNCBZ", "CPNCBX", "CPMCBZ", "CQNCBZ", "CPNDBZ"], "answer": "CPNCBZ", "topic": "Reasoning", "difficulty": "easy" },
  { "id": 12, "question": "Statement: All Cats are Dogs. Some Dogs are Rats. Conclusion: I. Some Cats are Rats. II. Some Rats are Dogs.", "options": ["Only I follows", "Only II follows", "Both I and II follow", "Neither I nor II follows", "Either I or II follows"], "answer": "Only II follows", "topic": "Reasoning", "difficulty": "moderate" },
  { "id": 13, "question": "In the following inequality, which conclusion is definitely true? P < Q ≤ R = S", "options": ["P = S", "P > S", "P < S", "Q > S", "Q < P"], "answer": "P < S", "topic": "Reasoning", "difficulty": "easy" },
  { "id": 14, "question": "A is the brother of B. B is the daughter of C. How is C related to A?", "options": ["Father", "Mother", "Uncle", "Grandfather", "Cannot be determined"], "answer": "Cannot be determined", "topic": "Reasoning", "difficulty": "moderate" },
  { "id": 15, "question": "A man walks 5km North, then turns Right and walks 5km. What is the shortest distance from his starting point?", "options": ["5km", "10km", "5√2 km", "7km", "25km"], "answer": "5√2 km", "topic": "Reasoning", "difficulty": "moderate" },
  { "id": 16, "question": "Find the odd one out: 27, 64, 125, 144, 216", "options": ["27", "64", "125", "144", "216"], "answer": "144", "topic": "Reasoning", "difficulty": "easy" },
  { "id": 17, "question": "What is the next term in the series? 15, 30, 60, 120, ?", "options": ["180", "200", "220", "240", "260"], "answer": "240", "topic": "Reasoning", "difficulty": "easy" },
  { "id": 18, "question": "Find the next term: A1, C3, E5, G7, ?", "options": ["H8", "I9", "J10", "I8", "H9"], "answer": "I9", "topic": "Reasoning", "difficulty": "easy" },
  { "id": 19, "question": "In a row of 20 students, Rohan is 10th from the left end. What is his position from the right end?", "options": ["10th", "11th", "9th", "12th", "13th"], "answer": "11th", "topic": "Reasoning", "difficulty": "moderate" },
  { "id": 20, "question": "How many meaningful English words can be formed using the letters 'A', 'E', 'T' (using each letter once)?", "options": ["One", "Two", "Three", "Four", "None"], "answer": "Two", "topic": "Reasoning", "difficulty": "moderate" },
  { "id": 21, "question": "Identify the error: 'Neither of the two candidates (A) / have (B) / completed (C) / the task (D) / No error (E).'", "options": ["A", "B", "C", "D", "E"], "answer": "B", "topic": "English", "difficulty": "moderate" },
  { "id": 22, "question": "Identify the error: 'The list (A) / of items (B) / are (C) / very long (D) / No error (E).'", "options": ["A", "B", "C", "D", "E"], "answer": "C", "topic": "English", "difficulty": "easy" },
  { "id": 23, "question": "Fill in the blank: The weather was so _______ that we decided to stay indoors.", "options": ["pleasant", "gloomy", "bright", "sunny", "cheerful"], "answer": "gloomy", "topic": "English", "difficulty": "easy" },
  { "id": 24, "question": "Fill in the blank: He is senior _______ me in the office.", "options": ["than", "to", "of", "from", "with"], "answer": "to", "topic": "English", "difficulty": "easy" },
  { "id": 25, "question": "Choose the synonym for: DILIGENT", "options": ["Lazy", "Hardworking", "Proud", "Careless", "Wealthy"], "answer": "Hardworking", "topic": "English", "difficulty": "easy" },
  { "id": 26, "question": "Choose the antonym for: ARROGANT", "options": ["Humble", "Proud", "Mean", "Rude", "Selfish"], "answer": "Humble", "topic": "English", "difficulty": "easy" },
  { "id": 27, "question": "Improvement: He 'did not went' to the party last night.", "options": ["did not go", "does not go", "did not gone", "has not go", "No improvement"], "answer": "did not go", "topic": "English", "difficulty": "easy" },
  { "id": 28, "question": "Identify correctly spelled word:", "options": ["Commitment", "Committment", "Comitment", "Comittment", "Commitmant"], "answer": "Commitment", "topic": "English", "difficulty": "moderate" },
  { "id": 29, "question": "Cloze: Technology has _______ the way we communicate with others.", "options": ["destroyed", "transformed", "ignored", "limited", "stopped"], "answer": "transformed", "topic": "English", "difficulty": "easy" },
  { "id": 30, "question": "Meaning of idiom: 'A piece of cake'?", "options": ["Something very tasty", "Something very easy", "A difficult task", "A small portion", "A birthday celebration"], "answer": "Something very easy", "topic": "English", "difficulty": "easy" }
];

// --- CORE ENGINE STATE ---
let questions = [];
let currentQuestionIndex = 0;
let userAnswers = {}; 
let markedForReview = new Set();
let timeLeft = 1800; // 30 minutes
let timerInterval;
let currentTestId = 1;
let questionStartTime = Date.now();
let timeSpentPerQuestion = {}; // { index: seconds }

// --- PERSISTENCE ---
const STORAGE_KEY = 'quasibanking_mock_progress';

function saveProgress() {
    const data = {
        testId: currentTestId,
        answers: userAnswers,
        marked: Array.from(markedForReview),
        timeLeft: timeLeft,
        timeSpent: timeSpentPerQuestion
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadProgress() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return false;
    const data = JSON.parse(saved);
    if (data.testId !== currentTestId) return false;
    
    userAnswers = data.answers || {};
    markedForReview = new Set(data.marked || []);
    timeLeft = data.timeLeft || 1800;
    timeSpentPerQuestion = data.timeSpent || {};
    return true;
}

function clearProgress() {
    localStorage.removeItem(STORAGE_KEY);
}

// --- INITIALIZATION ---
const getEl = (id) => document.getElementById(id);

function initTest() {
    const urlParams = new URLSearchParams(window.location.search);
    currentTestId = parseInt(urlParams.get('id')) || 1;
    
    // Simulate 3 tests via seeded shuffle
    questions = shuffleArray(mockTestData, currentTestId * 777);

    const hasSaved = loadProgress();
    
    renderPalette();
    renderQuestion();
    startTimer();
    
    if (hasSaved) console.log("Progress restored from local storage.");
}

function shuffleArray(array, seed) {
    let m = array.length, t, i;
    let seededRandom = function() {
        var x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }
    let arr = [...array];
    while (m) {
        i = Math.floor(seededRandom() * m--);
        t = arr[m]; arr[m] = arr[i]; arr[i] = t;
    }
    return arr;
}

// --- TIMER ---
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerUI();
        trackTime();
        
        if (timeLeft % 10 === 0) saveProgress(); // Auto-save every 10s
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            calculateResults(true); // Auto-submit
        }
    }, 1000);
}

function updateTimerUI() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const display = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    getEl('timer-display').innerText = display;
    
    if (timeLeft < 300) getEl('timer-box').style.color = '#ef4444';
}

function trackTime() {
    const now = Date.now();
    const elapsed = Math.floor((now - questionStartTime) / 1000);
    timeSpentPerQuestion[currentQuestionIndex] = (timeSpentPerQuestion[currentQuestionIndex] || 0) + 1;
    questionStartTime = now;
}

// --- RENDERING ---
function renderPalette() {
    const container = getEl('question-palette');
    container.innerHTML = '';
    questions.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = 'palette-dot';
        dot.innerText = idx + 1;
        dot.id = `palette-dot-${idx}`;
        dot.onclick = () => {
            currentQuestionIndex = idx;
            renderQuestion();
        };
        container.appendChild(dot);
    });
}

function renderQuestion() {
    questionStartTime = Date.now(); // Reset time tracker for new question
    const q = questions[currentQuestionIndex];
    const optsContainer = getEl('options-list');
    
    getEl('question-number').innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    getEl('topic-tag').innerText = q.topic.toUpperCase();
    getEl('progress-fill').style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;
    getEl('question-text').innerText = q.question;
    
    optsContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D', 'E'];
    
    q.options.forEach((opt, idx) => {
        const card = document.createElement('div');
        card.className = `option-card ${userAnswers[currentQuestionIndex] === opt ? 'selected' : ''}`;
        card.innerHTML = `
            <div class="option-index">${letters[idx]}</div>
            <span>${opt}</span>
        `;
        card.onclick = () => {
            userAnswers[currentQuestionIndex] = opt;
            saveProgress();
            renderQuestion();
            updatePaletteUI();
        };
        optsContainer.appendChild(card);
    });

    getEl('prev-btn').classList.toggle('hidden', currentQuestionIndex === 0);
    const isLast = currentQuestionIndex === questions.length - 1;
    getEl('next-btn').classList.toggle('hidden', isLast);
    getEl('submit-btn').classList.toggle('hidden', !isLast);
    
    getEl('next-btn').disabled = !userAnswers[currentQuestionIndex];
    getEl('next-btn').classList.toggle('btn-disabled', !userAnswers[currentQuestionIndex]);
    
    getEl('mark-btn').innerHTML = markedForReview.has(currentQuestionIndex) 
        ? `<i class="fas fa-bookmark"></i> Unmarked` 
        : `<i class="far fa-bookmark"></i> Mark`;

    updatePaletteUI();
}

function updatePaletteUI() {
    questions.forEach((_, idx) => {
        const dot = getEl(`palette-dot-${idx}`);
        if (!dot) return;
        dot.className = 'palette-dot';
        if (idx === currentQuestionIndex) dot.classList.add('active');
        if (markedForReview.has(idx)) dot.classList.add('marked');
        else if (userAnswers[idx]) dot.classList.add('answered');
    });
}

// --- ACTIONS ---
getEl('next-btn').onclick = () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    }
};

getEl('prev-btn').onclick = () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
};

getEl('mark-btn').onclick = () => {
    if (markedForReview.has(currentQuestionIndex)) markedForReview.delete(currentQuestionIndex);
    else markedForReview.add(currentQuestionIndex);
    saveProgress();
    updatePaletteUI();
};

getEl('submit-btn').onclick = () => {
    if (confirm("Submit Final Answers?")) {
        clearInterval(timerInterval);
        calculateResults();
    }
};

function confirmExit() {
    if (confirm("Exit Test? Your progress will be saved.")) {
        window.location.href = 'index.html';
    }
}

// --- ANALYTICS & RESULTS ---
async function calculateResults(isAuto = false) {
    if (isAuto) alert("Time is up! Your test has been submitted automatically.");
    
    let correct = 0, wrong = 0, attempted = 0;
    const topicStats = { "Quant": {c:0, t:0}, "Reasoning": {c:0, t:0}, "English": {c:0, t:0} };
    
    questions.forEach((q, idx) => {
        const uAns = userAnswers[idx];
        topicStats[q.topic].t++;
        if (uAns) {
            attempted++;
            if (uAns === q.answer) {
                correct++;
                topicStats[q.topic].c++;
            } else {
                wrong++;
            }
        }
    });

    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    
    // Time Analysis
    const times = Object.values(timeSpentPerQuestion);
    const avgTime = times.length ? Math.round(times.reduce((a,b) => a+b, 0) / questions.length) : 0;
    const fastTime = times.length ? Math.min(...times) : 0;
    const slowTime = times.length ? Math.max(...times) : 0;

    // Switch UI
    getEl('test-interface').classList.add('hidden');
    getEl('test-sidebar').classList.add('hidden');
    getEl('timer-box').classList.add('hidden');
    getEl('results-interface').classList.remove('hidden');

    // Update Overall Stats
    getEl('res-score').innerText = `${correct}/30`;
    getEl('res-accuracy').innerText = `${accuracy}%`;
    getEl('res-attempted').innerText = attempted;
    getEl('res-correct').innerText = correct;
    getEl('res-wrong').innerText = wrong;
    getEl('res-test-id').innerText = currentTestId;

    // Update Time Stats
    getEl('res-time-avg').innerText = `${avgTime}s`;
    getEl('res-time-fast').innerText = `${fastTime}s`;
    getEl('res-time-slow').innerText = `${slowTime}s`;

    // Render Sectional Bars
    const barBox = getEl('sectional-bars');
    barBox.innerHTML = '';
    for (let t in topicStats) {
        const s = topicStats[t];
        const p = Math.round((s.c / 10) * 100);
        barBox.innerHTML += `
            <div style="margin-bottom: 20px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.85rem;">
                    <span style="font-weight:700; color:white;">${t}</span>
                    <span style="color:var(--text-muted);">${s.c}/10</span>
                </div>
                <div style="height:8px; background:rgba(255,255,255,0.05); border-radius:10px; overflow:hidden;">
                    <div style="width:${p}%; height:100%; background:var(--primary-color);"></div>
                </div>
            </div>
        `;
    }

    // Feedback
    let feedback = "";
    if (accuracy > 80) feedback = "Excellent work! You have a strong grasp of the fundamentals. Focus on maintaining speed.";
    else if (accuracy > 50) feedback = "Good effort. You are strong in some areas but need more practice in others. Review the wrong answers below.";
    else feedback = "Needs significant improvement. Focus on concept building for each section and attempt the test again.";
    getEl('feedback-text').innerText = feedback;

    // Review Section
    renderReview();
    
    // Sync to Firebase
    const user = firebase.auth().currentUser;
    if (user) {
        const db = firebase.firestore();
        try {
            await db.collection("testResults").add({
                userId: user.uid,
                email: user.email,
                testId: currentTestId,
                score: correct,
                accuracy: accuracy,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (e) { console.error(e); }
    }
    
    clearProgress();
}

function renderReview() {
    const container = getEl('review-container');
    container.innerHTML = '';
    
    questions.forEach((q, idx) => {
        const card = document.createElement('div');
        card.className = 'review-question-card';
        const uAns = userAnswers[idx];
        const isCorrect = uAns === q.answer;
        
        let optionsHtml = '';
        q.options.forEach(opt => {
            let stateClass = 'review-neutral';
            if (opt === q.answer) stateClass = 'review-correct';
            else if (opt === uAns && !isCorrect) stateClass = 'review-wrong';
            
            optionsHtml += `<div class="review-option ${stateClass}">${opt} ${opt === q.answer ? '✓' : ''}</div>`;
        });

        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
                <span style="font-weight:800; color:var(--primary-light);">#${idx + 1} - ${q.topic}</span>
                <span style="font-weight:700; color:${uAns ? (isCorrect ? '#4ade80' : '#f87171') : '#94a3b8'};">
                    ${uAns ? (isCorrect ? 'CORRECT' : 'WRONG') : 'UNATTEMPTED'}
                </span>
            </div>
            <p style="font-size:1.1rem; font-weight:500; margin-bottom:20px;">${q.question}</p>
            ${optionsHtml}
        `;
        container.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', initTest);