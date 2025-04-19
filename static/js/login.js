document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.querySelector('.toggle-password');
    const forgotPasswordLink = document.querySelector('.forgot-link');
    
    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const targetInput = document.getElementById(targetId);
        
        if (targetInput.type === 'password') {
            targetInput.type = 'text';
            this.classList.remove('fa-eye');
            this.classList.add('fa-eye-slash');
        } else {
            targetInput.type = 'password';
            this.classList.remove('fa-eye-slash');
            this.classList.add('fa-eye');
        }
    });
    
    // Forgot password link click
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Password reset functionality will be implemented soon.');
    });
    
    // Form submission event
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = passwordInput.value;
        const rememberMe = document.getElementById('remember').checked;
        
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Here you would typically send the login data to your backend for authentication
        console.log('Login attempt:', {
            email,
            password,
            rememberMe
        });
        
        alert('Login successful! Redirecting to dashboard...');
        // Here you would redirect to the dashboard or home page after successful login
        window.location.href = '../templates/index.html';
    });
    
    // Helper function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});