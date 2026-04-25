const questions = [
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
  }
];

let currentQuestionIndex = 0;
let userAnswers = {}; 

// DOM Elements
const testInterface = document.getElementById('test-interface');
const resultsInterface = document.getElementById('results-interface');
const questionText = document.getElementById('question-text');
const optionsList = document.getElementById('options-list');
const questionNumber = document.getElementById('question-number');
const topicTag = document.getElementById('topic-tag');
const progressFill = document.getElementById('progress-fill');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const submitBtn = document.getElementById('submit-btn');

// Initialization
function initTest() {
    renderQuestion();
}

function renderQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    
    // Update Meta Information
    questionNumber.innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    topicTag.innerText = `Topic: ${currentQuestion.topic}`;
    
    // Update Progress Bar
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressFill.style.width = `${progress}%`;

    // Update Question Text
    questionText.innerText = currentQuestion.question;

    // Clear and Render Options
    optionsList.innerHTML = '';
    currentQuestion.options.forEach(option => {
        const optionItem = document.createElement('div');
        optionItem.className = 'option-item';
        if (userAnswers[currentQuestionIndex] === option) {
            optionItem.classList.add('selected');
        }

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'option';
        radio.value = option;
        radio.checked = userAnswers[currentQuestionIndex] === option;

        const label = document.createElement('span');
        label.innerText = option;

        optionItem.appendChild(radio);
        optionItem.appendChild(label);

        // Click handler for the whole div
        optionItem.onclick = () => {
            selectOption(option, optionItem);
        };

        optionsList.appendChild(optionItem);
    });

    // Update Navigation Buttons
    updateNavButtons();
}

function selectOption(option, element) {
    // Save selection
    userAnswers[currentQuestionIndex] = option;

    // UI Feedback: highlight selected
    document.querySelectorAll('.option-item').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
    element.querySelector('input').checked = true;

    // Enable "Next" or "Submit"
    enableNextAction();
}

function enableNextAction() {
    if (currentQuestionIndex === questions.length - 1) {
        submitBtn.classList.remove('btn-disabled');
        submitBtn.disabled = false;
    } else {
        nextBtn.classList.remove('btn-disabled');
        nextBtn.disabled = false;
    }
}

function updateNavButtons() {
    // Show/Hide Previous Button
    if (currentQuestionIndex > 0) {
        prevBtn.classList.remove('hidden');
    } else {
        prevBtn.classList.add('hidden');
    }

    // Toggle Next vs Submit
    if (currentQuestionIndex === questions.length - 1) {
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
    }

    // Check if current question already has an answer to enable Next/Submit
    if (userAnswers[currentQuestionIndex]) {
        enableNextAction();
    } else {
        nextBtn.classList.add('btn-disabled');
        nextBtn.disabled = true;
        submitBtn.classList.add('btn-disabled');
        submitBtn.disabled = true;
    }
}

// Event Listeners
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

submitBtn.onclick = () => {
    const unansweredCount = questions.length - Object.keys(userAnswers).length;
    
    if (unansweredCount > 0) {
        const confirmSubmit = confirm(`You have ${unansweredCount} unanswered questions. Are you sure you want to submit?`);
        if (!confirmSubmit) return;
    }

    calculateResults();
};

function calculateResults() {
    let correctCount = 0;
    
    questions.forEach((q, index) => {
        if (userAnswers[index] === q.answer) {
            correctCount++;
        }
    });

    const totalQuestions = questions.length;
    const attemptedCount = Object.keys(userAnswers).length;
    const accuracy = Math.round((correctCount / totalQuestions) * 100);

    // Display Results
    testInterface.classList.add('hidden');
    resultsInterface.classList.remove('hidden');

    document.getElementById('results-score').innerText = `${correctCount}/${totalQuestions}`;
    document.getElementById('total-attempted').innerText = attemptedCount;
    document.getElementById('correct-answers').innerText = correctCount;
    document.getElementById('accuracy-pct').innerText = `${accuracy}%`;

    // Performance Message
    const perfMsgEl = document.getElementById('performance-msg');
    perfMsgEl.className = 'performance-msg'; // Reset

    if (accuracy >= 80) {
        perfMsgEl.innerText = "Excellent Performance! You're ready for the exam.";
        perfMsgEl.classList.add('perf-excellent');
    } else if (accuracy >= 60) {
        perfMsgEl.innerText = "Good Performance. Keep practicing to improve.";
        perfMsgEl.classList.add('perf-good');
    } else {
        perfMsgEl.innerText = "Needs Improvement. Focus on the basics and try again.";
        perfMsgEl.classList.add('perf-needs-improvement');
    }
}

// Start the app
initTest();