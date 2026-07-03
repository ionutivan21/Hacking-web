// Simple Authentication System
const users = JSON.parse(localStorage.getItem('users')) || [];

document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Bine ai venit, ' + user.name + '!');
        window.location.href = 'dashboard.html';
    } else {
        alert('Email sau parolă incorect!');
    }
});

document.getElementById('registerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('nume').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (password !== confirmPassword) {
        alert('Parolele nu se potrivesc!');
        return;
    }
    
    if (users.find(u => u.email === email)) {
        alert('Email deja înregistrat!');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        createdAt: new Date()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Înregistrare reușită! Poți face log in acum.');
    window.location.href = 'login.html';
});