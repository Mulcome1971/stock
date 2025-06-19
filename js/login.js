document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Here you would typically make an API call to verify credentials
    // For demo purposes, we'll use a simple check
    if (username === 'admin' && password === 'admin123') {
        // Store login state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        alert('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
}); 