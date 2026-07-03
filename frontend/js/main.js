// API Configuration
const API_URL = 'http://localhost:3000/api';
let currentCourseId = null;
let currentLessonId = null;
let currentQuizId = null;

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    const appContainer = document.getElementById('appContainer');
    const authContainer = document.getElementById('authContainer');

    if (token) {
        showDashboard();
    } else {
        showLogin();
    }
}

// Show login form
function showLogin() {
    const authContainer = document.getElementById('authContainer');
    const appContainer = document.getElementById('appContainer');
    const lessonContainer = document.getElementById('lessonContainer');
    const quizContainer = document.getElementById('quizContainer');
    const resultsContainer = document.getElementById('resultsContainer');

    authContainer.classList.remove('hidden');
    appContainer.classList.add('hidden');
    lessonContainer.classList.add('hidden');
    quizContainer.classList.add('hidden');
    resultsContainer.classList.add('hidden');

    authContainer.innerHTML = `
        <div class="container">
            <div class="auth-form">
                <h2>Conectare</h2>
                <div id="messageContainer"></div>
                <form id="loginForm">
                    <div class="form-group">
                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Parola:</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Conectare</button>
                    <button type="button" class="btn btn-secondary mt-1" onclick="toggleRegister()">
                        Nu ai cont? Inregistrare
                    </button>
                </form>
            </div>
        </div>
    `;

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

// Show register form
function showRegister() {
    const authContainer = document.getElementById('authContainer');

    authContainer.innerHTML = `
        <div class="container">
            <div class="auth-form">
                <h2>Inregistrare</h2>
                <div id="messageContainer"></div>
                <form id="registerForm">
                    <div class="form-group">
                        <label for="username">Utilizator:</label>
                        <input type="text" id="username" name="username" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Parola:</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Inregistrare</button>
                    <button type="button" class="btn btn-secondary mt-1" onclick="toggleRegister()">
                        Deja ai cont? Conectare
                    </button>
                </form>
            </div>
        </div>
    `;

    document.getElementById('registerForm').addEventListener('submit', handleRegister);
}

// Toggle between login and register
function toggleRegister() {
    const authContainer = document.getElementById('authContainer');
    if (authContainer.querySelector('#loginForm')) {
        showRegister();
    } else {
        showLogin();
    }
}

// Show dashboard
async function showDashboard() {
    const appContainer = document.getElementById('appContainer');
    const authContainer = document.getElementById('authContainer');
    const lessonContainer = document.getElementById('lessonContainer');
    const quizContainer = document.getElementById('quizContainer');
    const resultsContainer = document.getElementById('resultsContainer');

    authContainer.classList.add('hidden');
    appContainer.classList.remove('hidden');
    lessonContainer.classList.add('hidden');
    quizContainer.classList.add('hidden');
    resultsContainer.classList.add('hidden');

    const courseContainer = document.getElementById('courseContainer');
    if (courseContainer) courseContainer.remove();

    await loadUserProfile();
    await loadCourses();
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageContainer = document.getElementById('messageContainer');

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Eroare la conectare');
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        showMessage('Conectare reusita!', 'success', messageContainer);
        setTimeout(() => showDashboard(), 1000);
    } catch (error) {
        showMessage(error.message, 'error', messageContainer);
    }
}

// Handle register
async function handleRegister(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageContainer = document.getElementById('messageContainer');

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Eroare la inregistrare');
        }

        showMessage('Inregistrare reusita! Conecteaza-te acum.', 'success', messageContainer);
        setTimeout(() => showLogin(), 1000);
    } catch (error) {
        showMessage(error.message, 'error', messageContainer);
    }
}

// Load user profile
async function loadUserProfile() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) return;

    document.getElementById('username').textContent = user.username;
    document.getElementById('totalScore').textContent = user.progress.totalScore || 0;
    document.getElementById('completedCourses').textContent = user.progress.completedQuizzes.length;
}

// Load courses
async function loadCourses() {
    const token = localStorage.getItem('token');
    const coursesList = document.getElementById('coursesList');

    try {
        const response = await fetch(`${API_URL}/courses`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const courses = await response.json();

        coursesList.innerHTML = courses.map(course => `
            <div class="course-card" onclick="openCourse(${course.id})">
                <div class="course-header">
                    <h3>${course.title}</h3>
                    <span class="course-level">${course.level}</span>
                </div>
                <div class="course-body">
                    <p>${course.description}</p>
                    <div class="course-meta">
                        <span>Timp: ${course.duration}</span>
                        <span>Lectii: ${course.lessons.length}</span>
                    </div>
                    <button class="course-btn">Deschide Cursul</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Eroare la preluarea cursurilor:', error);
    }
}

// Open course
async function openCourse(courseId) {
    const token = localStorage.getItem('token');
    currentCourseId = courseId;

    try {
        const response = await fetch(`${API_URL}/courses/${courseId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const course = await response.json();
        const appContainer = document.getElementById('appContainer');
        appContainer.classList.add('hidden');

        const courseContainer = document.createElement('div');
        courseContainer.id = 'courseContainer';
        courseContainer.innerHTML = `
            <div class="container">
                <div class="course-view">
                    <a href="#" class="back-btn" onclick="showDashboard()">Inapoi la Dashboard</a>
                    <h2>${course.title}</h2>
                    <p>${course.description}</p>
                    <div class="lessons-list">
                        ${course.lessons.map(lesson => `
                            <div class="lesson-item" onclick="openLesson(${courseId}, ${lesson.id})">
                                <h3>${lesson.title}</h3>
                                <span class="lesson-duration">Timp: ${lesson.duration}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(courseContainer);
    } catch (error) {
        console.error('Eroare:', error);
    }
}

// Open lesson
async function openLesson(courseId, lessonId) {
    const token = localStorage.getItem('token');
    currentCourseId = courseId;
    currentLessonId = lessonId;

    try {
        const response = await fetch(`${API_URL}/courses/${courseId}/lessons/${lessonId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const lesson = await response.json();
        const courseContainer = document.getElementById('courseContainer');
        const lessonContainer = document.getElementById('lessonContainer');

        if (courseContainer) courseContainer.style.display = 'none';
        lessonContainer.classList.remove('hidden');

        document.getElementById('lessonTitle').textContent = lesson.title;
        document.getElementById('lessonContent').innerHTML = `
            <p>${lesson.content.replace(/\n/g, '<br>')}</p>
        `;
    } catch (error) {
        console.error('Eroare:', error);
    }
}

// Load quiz for lesson
async function loadQuizForLesson() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_URL}/quiz`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const quizzes = await response.json();
        const quiz = quizzes.find(q => q.courseId === currentCourseId);

        if (quiz) {
            currentQuizId = quiz.id;
            displayQuiz(quiz);
        } else {
            alert('Nu exista quiz pentru acest curs.');
        }
    } catch (error) {
        console.error('Eroare:', error);
    }
}

// Display quiz
function displayQuiz(quiz) {
    const lessonContainer = document.getElementById('lessonContainer');
    const quizContainer = document.getElementById('quizContainer');

    lessonContainer.classList.add('hidden');
    quizContainer.classList.remove('hidden');

    document.getElementById('quizTitle').textContent = quiz.title;

    const questionsContainer = document.getElementById('questionsContainer');
    questionsContainer.innerHTML = quiz.questions.map(question => `
        <div class="question-block">
            <h4>${question.question}</h4>
            ${question.options.map((option, index) => `
                <div class="option">
                    <input type="radio" name="question_${question.id}" value="${index}" id="q${question.id}_${index}" required>
                    <label for="q${question.id}_${index}">${option}</label>
                </div>
            `).join('')}
        </div>
    `).join('');
}

// Submit quiz
async function submitQuiz(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const formData = new FormData(document.getElementById('quizForm'));
    const answers = {};
    
    for (let [key, value] of formData.entries()) {
        const questionId = parseInt(key.replace('question_', ''));
        answers[questionId] = parseInt(value);
    }

    try {
        const response = await fetch(`${API_URL}/quiz/${currentQuizId}/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ answers })
        });

        const result = await response.json();
        displayResults(result);
    } catch (error) {
        console.error('Eroare:', error);
    }
}

// Display results
function displayResults(result) {
    const quizContainer = document.getElementById('quizContainer');
    const resultsContainer = document.getElementById('resultsContainer');

    quizContainer.classList.add('hidden');
    resultsContainer.classList.remove('hidden');

    document.getElementById('scorePercentage').textContent = result.score;
    document.getElementById('correctCount').textContent = result.correctAnswers;
    document.getElementById('totalCount').textContent = result.totalQuestions;

    const passStatus = document.getElementById('passStatus');
    if (result.passed) {
        passStatus.textContent = 'AI TRECUT TESTUL!';
        passStatus.style.color = '#00c896';
    } else {
        passStatus.textContent = 'NU AI TRECUT TESTUL. INCEARCA DIN NOU!';
        passStatus.style.color = '#ff4757';
    }

    const resultsDetails = document.getElementById('resultsDetails');
    resultsDetails.innerHTML = `
        <div class="results-explanations">
            ${result.results.map(r => `
                <div class="result-item ${r.isCorrect ? 'correct' : 'incorrect'}">
                    <h5>${r.isCorrect ? 'CORECT' : 'INCORECT'} - ${r.question}</h5>
                    <p><strong>Raspunsul tau:</strong> ${r.userAnswer !== undefined ? r.userAnswer : 'Nerespuns'}</p>
                    <p><strong>Raspunsul corect:</strong> ${r.correctAnswer}</p>
                    <p><strong>Explicatie:</strong> ${r.explanation}</p>
                </div>
            `).join('')}
        </div>
    `;
}

// Show message
function showMessage(message, type, container) {
    if (!container) return;
    
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.textContent = message;
    
    container.innerHTML = '';
    container.appendChild(messageEl);
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showLogin();
}

// Update auth link
document.addEventListener('DOMContentLoaded', () => {
    const authLink = document.getElementById('authLink');
    if (authLink) {
        authLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (localStorage.getItem('token')) {
                logout();
            } else {
                showLogin();
            }
        });
    }

    checkAuth();
});