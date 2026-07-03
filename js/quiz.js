// Quiz Data
const quizzes = {
    1: {
        title: 'Quiz 1: Introducere în Ethical Hacking',
        questions: [
            {
                question: 'Ce este Ethical Hacking?',
                answers: ['Hacking ilegal', 'Testarea securității cu permisiune', 'Furtul de date', 'Spionaj cibernetic'],
                correct: 1
            },
            {
                question: 'Care este principiul principal al etic hacking?',
                answers: ['Să furi date', 'Să testezi sisteme cu permisiune', 'Să daune sisteme', 'Să obții acces neautorizat'],
                correct: 1
            },
            {
                question: 'Ce este penetration testing?',
                answers: ['Hacking pentru plăcere', 'Testare autorizată a securității', 'Furt de identitate', 'Crashing de servere'],
                correct: 1
            }
        ]
    },
    2: {
        title: 'Quiz 2: Network Security',
        questions: [
            {
                question: 'Ce este o vulnerabilitate în rețea?',
                answers: ['O slăbiciune în securitate', 'Un defect de hardware', 'O greșeală în design', 'Toate variante de mai sus'],
                correct: 0
            },
            {
                question: 'La ce sunt folosite firewallurile?',
                answers: ['La încălzire', 'La controlul traficului de rețea', 'La stingerea incendiilor', 'Nimic din astea'],
                correct: 1
            }
        ]
    },
    3: {
        title: 'Quiz 3: Penetration Testing',
        questions: [
            {
                question: 'Care sunt etapele pentestingului?',
                answers: ['Reconnaissance, Scanning, Enumeration, Gaining Access', 'Doar intrarea', 'Doar testul', 'Furtul de date'],
                correct: 0
            }
        ]
    }
};

let currentQuiz = null;
let currentQuestion = 0;
let selectedAnswers = [];

function startQuiz(quizId) {
    currentQuiz = quizId;
    currentQuestion = 0;
    selectedAnswers = [];
    
    document.getElementById('quizzes').style.display = 'none';
    document.getElementById('quiz-content').style.display = 'block';
    
    const quiz = quizzes[quizId];
    document.getElementById('quiz-title').textContent = quiz.title;
    
    loadQuestion();
}

function loadQuestion() {
    const quiz = quizzes[currentQuiz];
    const questions = quiz.questions;
    const current = questions[currentQuestion];
    
    document.getElementById('question-text').textContent = `Întrebarea ${currentQuestion + 1}: ${current.question}`;
    
    const answersDiv = document.getElementById('answers');
    answersDiv.innerHTML = '';
    
    current.answers.forEach((answer, index) => {
        const answerBtn = document.createElement('div');
        answerBtn.className = 'answer-option';
        answerBtn.textContent = answer;
        answerBtn.onclick = () => selectAnswer(index);
        answersDiv.appendChild(answerBtn);
    });
    
    // Update progress
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progress').style.width = progress + '%';
}

function selectAnswer(index) {
    const answers = document.querySelectorAll('.answer-option');
    answers.forEach(ans => ans.classList.remove('selected'));
    answers[index].classList.add('selected');
    selectedAnswers[currentQuestion] = index;
}

function nextQuestion() {
    const quiz = quizzes[currentQuiz];
    
    if (currentQuestion < quiz.questions.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    const quiz = quizzes[currentQuiz];
    let correct = 0;
    
    quiz.questions.forEach((q, index) => {
        if (selectedAnswers[index] === q.correct) {
            correct++;
        }
    });
    
    const percentage = (correct / quiz.questions.length) * 100;
    
    alert(`Rezultat: ${correct}/${quiz.questions.length} (${percentage.toFixed(1)}%)`);
    
    // Resetare
    document.getElementById('quiz-content').style.display = 'none';
    document.getElementById('quizzes').style.display = 'grid';
    currentQuiz = null;
    currentQuestion = 0;
}