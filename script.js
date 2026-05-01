// Move questions back to local array to avoid CORS issues if opening file directly
const questionsData = [
  {
    "id": 1,
    "question": "If 'A' is coded as 1, 'B' as 2, and so on, what is the code for 'BANK'?",
    "options": ["211411", "211412", "211414", "211421"],
    "answer": "211411",
    "topic": "Reasoning Ability"
  },
  {
    "id": 2,
    "question": "What is 15% of 1200?",
    "options": ["150", "180", "210", "120"],
    "answer": "180",
    "topic": "Quantitative Aptitude"
  },
  {
    "id": 3,
    "question": "Who is the current Governor of the Reserve Bank of India (RBI) as of 2024?",
    "options": ["Urjit Patel", "Raghuram Rajan", "Shaktikanta Das", "Nirmala Sitharaman"],
    "answer": "Shaktikanta Das",
    "topic": "Banking Awareness"
  },
  {
    "id": 4,
    "question": "Identify the correctly spelled word.",
    "options": ["Accomodation", "Accommodation", "Acomodation", "Accomodatoin"],
    "answer": "Accommodation",
    "topic": "English Language"
  },
  {
    "id": 5,
    "question": "Which of the following is not a type of banking account?",
    "options": ["Savings Account", "Current Account", "Fixed Deposit", "Social Media Account"],
    "answer": "Social Media Account",
    "topic": "Banking Awareness"
  },
  {
    "id": 6,
    "question": "A sum of money doubles itself in 8 years at simple interest. What is the rate of interest per annum?",
    "options": ["10%", "12.5%", "15%", "18%"],
    "answer": "12.5%",
    "topic": "Quantitative Aptitude"
  },
  {
    "id": 7,
    "question": "In a certain code language, 'COMPUTER' is written as 'RFUVQNPC'. How is 'MEDICINE' written in that code?",
    "options": ["EOJDJEFM", "EOJDEJFM", "MFEJDJOE", "EOJDJFME"],
    "answer": "EOJDJEFM",
    "topic": "Reasoning Ability"
  },
  {
    "id": 8,
    "question": "The 'Headquarters' of the World Bank is located at:",
    "options": ["New York", "London", "Washington D.C.", "Paris"],
    "answer": "Washington D.C.",
    "topic": "Banking Awareness"
  }
];

let questions = questionsData;
let currentQuestionIndex = 0;
let userAnswers = {}; 
let markedForReview = new Set();
let timeLeft = 300; // 5 minutes
let timerInterval;

// DOM Elements
const testInterface = document.getElementById('test-interface');
const resultsInterface = document.getElementById('results-interface');
const questionText = document.getElementById('question-text');
const optionsList = document.getElementById('options-list');
const questionNumberText = document.getElementById('question-number');
const topicTag = document.getElementById('topic-tag');
const progressFill = document.getElementById('progress-fill');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const submitBtn = document.getElementById('submit-btn');
const markBtn = document.getElementById('mark-btn');
const timerDisplay = document.getElementById('timer-display');
const paletteContainer = document.getElementById('question-palette');

// 1. Initialize
function initTest() {
    renderPalette();
    renderQuestion();
    startTimer();
}

// 2. Timer Logic
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            calculateResults(); 
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    if (timeLeft < 60) {
        timerDisplay.parentElement.style.background = '#fee2e2';
        timerDisplay.style.color = '#dc2626';
    }
}

// 3. Question Palette
function renderPalette() {
    paletteContainer.innerHTML = '';
    questions.forEach((_, index) => {
        const btn = document.createElement('button');
        btn.className = 'palette-btn';
        btn.innerText = index + 1;
        btn.onclick = () => jumpToQuestion(index);
        paletteContainer.appendChild(btn);
    });
    updatePaletteUI();
}

function updatePaletteUI() {
    const buttons = paletteContainer.querySelectorAll('.palette-btn');
    buttons.forEach((btn, index) => {
        btn.classList.remove('active', 'answered', 'marked');
        
        if (index === currentQuestionIndex) btn.classList.add('active');
        if (userAnswers[index]) btn.classList.add('answered');
        if (markedForReview.has(index)) btn.classList.add('marked');
    });
}

function jumpToQuestion(index) {
    currentQuestionIndex = index;
    renderQuestion();
}

// 4. Question Rendering
function renderQuestion() {
    const q = questions[currentQuestionIndex];
    questionNumberText.innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    topicTag.innerText = `Topic: ${q.topic}`;
    
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressFill.style.width = `${progress}%`;
    
    questionText.innerText = q.question;
    optionsList.innerHTML = '';

    q.options.forEach(option => {
        const div = document.createElement('div');
        div.className = 'option-item';
        if (userAnswers[currentQuestionIndex] === option) div.classList.add('selected');

        div.innerHTML = `<span>${option}</span>`;
        div.onclick = () => selectOption(option, div);
        optionsList.appendChild(div);
    });

    // Update Nav Buttons
    prevBtn.classList.toggle('hidden', currentQuestionIndex === 0);
    
    if (currentQuestionIndex === questions.length - 1) {
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
    }

    // Update Mark Button Text
    markBtn.innerHTML = markedForReview.has(currentQuestionIndex) 
        ? `<i class="fas fa-bookmark"></i> Unmark` 
        : `<i class="fas fa-bookmark"></i> Mark for Review`;

    updatePaletteUI();
    updateNextButtonState();
}

function selectOption(option, element) {
    userAnswers[currentQuestionIndex] = option;
    document.querySelectorAll('.option-item').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
    updateNextButtonState();
    updatePaletteUI();
}

function updateNextButtonState() {
    const hasAnswer = userAnswers[currentQuestionIndex];
    nextBtn.disabled = !hasAnswer;
    nextBtn.classList.toggle('btn-disabled', !hasAnswer);
    submitBtn.disabled = !hasAnswer && (currentQuestionIndex === questions.length - 1);
}

// 5. Actions
nextBtn.onclick = () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    }
};

prevBtn.onclick = () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
};

markBtn.onclick = () => {
    if (markedForReview.has(currentQuestionIndex)) {
        markedForReview.delete(currentQuestionIndex);
    } else {
        markedForReview.add(currentQuestionIndex);
    }
    renderQuestion();
};

submitBtn.onclick = () => {
    if (confirm("Are you sure you want to submit the test?")) {
        clearInterval(timerInterval);
        calculateResults();
    }
};

// 6. Results Logic
function calculateResults() {
    let correct = 0;
    const topicStats = {};
    let weakTopics = [];

    questions.forEach((q, index) => {
        if (!topicStats[q.topic]) topicStats[q.topic] = { total: 0, correct: 0 };
        topicStats[q.topic].total++;

        if (userAnswers[index] === q.answer) {
            correct++;
            topicStats[q.topic].correct++;
        }
    });

    for (let topic in topicStats) {
        if ((topicStats[topic].correct / topicStats[topic].total) < 0.7) {
            weakTopics.push(topic);
        }
    }

    const total = questions.length;
    const attempted = Object.keys(userAnswers).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    const stats = {
        correct: correct,
        total: total,
        attempted: attempted,
        accuracy: accuracy,
        weakTopics: weakTopics
    };

    testInterface.classList.add('hidden');
    resultsInterface.classList.remove('hidden');

    document.getElementById('results-score').innerText = `${correct}/${total}`;
    document.getElementById('total-attempted').innerText = attempted;
    document.getElementById('correct-answers').innerText = correct;
    document.getElementById('accuracy-pct').innerText = `${accuracy}%`;

    // NEW: Save to Firebase
    saveTestToCloud(stats);

    renderInsights(topicStats);
}

async function saveTestToCloud(stats) {
    const user = firebase.auth().currentUser;
    if (!user) {
        console.warn("User not logged in. Results not saved to cloud.");
        return;
    }

    const db = firebase.firestore();
    try {
        await db.collection("testResults").add({
            userId: user.uid,
            email: user.email,
            score: stats.correct,
            totalQuestions: stats.total,
            accuracy: stats.accuracy,
            attempted: stats.attempted,
            weakTopics: stats.weakTopics,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log("Performance synced to cloud! ☁️");
    } catch (error) {
        console.error("Error saving to Firestore:", error);
    }
}

function renderInsights(topicStats) {
    const container = document.getElementById('insights-container');
    container.innerHTML = '';

    let strong = [], weak = [];

    for (const topic in topicStats) {
        const stats = topicStats[topic];
        const pct = (stats.correct / stats.total) * 100;
        
        const card = document.createElement('div');
        card.className = 'modern-card';
        card.style.padding = '20px';
        card.style.marginBottom = '15px';
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h4 style="margin:0;">${topic}</h4>
                <span style="font-size: 0.8rem; font-weight: 700; color: ${pct >= 70 ? '#16a34a' : '#dc2626'}">
                    ${stats.correct}/${stats.total} Correct
                </span>
            </div>
            <div class="progress-bar" style="margin: 10px 0; height: 8px; background: #f1f5f9;">
                <div class="progress-fill" style="width: ${pct}%; background: ${pct >= 70 ? '#16a34a' : '#dc2626'}"></div>
            </div>
        `;
        container.appendChild(card);

        if (pct >= 70) strong.push(topic);
        else weak.push(topic);
    }

    const summary = document.createElement('div');
    summary.className = 'modern-card';
    summary.style.background = 'var(--primary-gradient)';
    summary.style.color = 'white';
    summary.style.marginTop = '20px';
    summary.innerHTML = `
        <h3 style="color: white;">Diagnostic Summary 🎯</h3>
        <p style="margin-top:10px;"><b>Strongest Areas:</b> ${strong.length ? strong.join(', ') : 'None'}</p>
        <p><b>Focus Required:</b> ${weak.length ? weak.join(', ') : 'None'}</p>
    `;
    container.appendChild(summary);
}

// Start!
document.addEventListener('DOMContentLoaded', initTest);