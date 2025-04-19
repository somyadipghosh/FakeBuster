document.addEventListener('DOMContentLoaded', function() {
    // Dark Mode Functionality
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    
    // Check for saved dark mode preference or respect OS preference
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedDarkMode = localStorage.getItem('darkMode');
    
    // Apply dark mode if saved preference exists or user OS prefers dark mode
    if (savedDarkMode === 'enabled' || (savedDarkMode === null && prefersDarkMode)) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
    
    // Toggle dark mode on button click
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            if (body.classList.contains('dark-mode')) {
                disableDarkMode();
            } else {
                enableDarkMode();
            }
        });
    }
    
    // Function to enable dark mode
    function enableDarkMode() {
        body.classList.add('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.classList.add('active');
        }
        localStorage.setItem('darkMode', 'enabled');
        
        // Only show toast if this wasn't initial page load
        if (document.readyState === 'complete') {
            showToast('Dark mode enabled', 'info');
        }
    }
    
    // Function to disable dark mode
    function disableDarkMode() {
        body.classList.remove('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.classList.remove('active');
        }
        localStorage.setItem('darkMode', 'disabled');
        
        // Only show toast if this wasn't initial page load
        if (document.readyState === 'complete') {
            showToast('Light mode enabled', 'info');
        }
    }
    
    // Login/Register form toggle functionality
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterBtn = document.getElementById('show-register');
    const showLoginBtn = document.getElementById('show-login');
    
    // Get Started button redirect to registration.html
    const getStartedBtn = document.querySelector('.hero-buttons .primary-btn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = './templates/registration.html';
        });
    }
    
    if (showRegisterBtn && showLoginBtn) {
        // Toggle between login and register forms
        showRegisterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.classList.remove('active');
            registerForm.classList.add('active');
        });
        
        showLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            registerForm.classList.remove('active');
            loginForm.classList.add('active');
        });
    }
    
    // Login button in navbar now redirects to login.html
    const loginNavBtn = document.getElementById('login-nav-btn');
    
    if (loginNavBtn) {
        loginNavBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Redirect to login.html
            window.location.href = './templates/login.html';
        });
    }
    
    // CTA signup button now redirects to login.html with register parameter
    const ctaSignupBtn = document.getElementById('cta-signup-btn');
    if (ctaSignupBtn) {
        ctaSignupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Redirect to login.html with register parameter
            window.location.href = 'login.html?action=register';
        });
    }
    
    // Function to show login modal - kept for reference but no longer used
    function showLoginModal() {
        // Create modal if it doesn't exist
        if (!document.getElementById('login-modal')) {
            createAuthModal('login');
        } else {
            document.getElementById('login-modal').style.display = 'flex';
        }
    }
    
    // Function to show register modal - kept for reference but no longer used
    function showRegisterModal() {
        // Create modal if it doesn't exist
        if (!document.getElementById('register-modal')) {
            createAuthModal('register');
        } else {
            document.getElementById('register-modal').style.display = 'flex';
        }
    }
    
    // Function to create authentication modals - kept for reference but no longer used
    function createAuthModal(type) {
        const modalId = type + '-modal';
        const modalTitle = type === 'login' ? 'Log In to FakeBuster' : 'Create Your FakeBuster Account';
        const modalIcon = type === 'login' ? 'sign-in-alt' : 'user-plus';
        const switchText = type === 'login' ? 'Don\'t have an account? <a href="#" id="show-register-modal">Sign up</a>' : 'Already have an account? <a href="#" id="show-login-modal">Log in</a>';
        const buttonText = type === 'login' ? 'Log In' : 'Sign Up';
        
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'auth-modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="modal-header">
                    <h2><i class="fas fa-${modalIcon}"></i> ${modalTitle}</h2>
                </div>
                <div class="modal-body">
                    <form id="${type}-form">
                        ${type === 'register' ? 
                            `<div class="form-group">
                                <label for="${type}-name"><i class="fas fa-user"></i> Full Name</label>
                                <input type="text" id="${type}-name" placeholder="Enter your name" required>
                            </div>` : ''}
                        <div class="form-group">
                            <label for="${type}-email"><i class="fas fa-envelope"></i> Email Address</label>
                            <input type="email" id="${type}-email" placeholder="Enter your email" required>
                        </div>
                        <div class="form-group">
                            <label for="${type}-password"><i class="fas fa-lock"></i> Password</label>
                            <input type="password" id="${type}-password" placeholder="Enter your password" required>
                            <button type="button" class="password-toggle">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                        ${type === 'register' ? 
                            `<div class="form-group">
                                <label for="confirm-password"><i class="fas fa-lock"></i> Confirm Password</label>
                                <input type="password" id="confirm-password" placeholder="Confirm your password" required>
                                <button type="button" class="password-toggle">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                            <div class="form-options">
                                <div class="terms-agreement">
                                    <input type="checkbox" id="agree-terms" required>
                                    <label for="agree-terms">I agree to the <a href="#">Terms & Conditions</a></label>
                                </div>
                            </div>` : 
                            `<div class="form-options">
                                <div class="remember-me">
                                    <input type="checkbox" id="remember-me">
                                    <label for="remember-me">Remember me</label>
                                </div>
                                <a href="#" class="forgot-password">Forgot password?</a>
                            </div>`}
                        <button type="submit" class="auth-btn">${buttonText}</button>
                    </form>
                    <div class="social-login">
                        <p>Or continue with</p>
                        <div class="social-btns">
                            <button class="google-btn"><i class="fab fa-google"></i></button>
                            <button class="facebook-btn"><i class="fab fa-facebook-f"></i></button>
                            <button class="twitter-btn"><i class="fab fa-twitter"></i></button>
                        </div>
                    </div>
                    <div class="auth-switch">
                        ${switchText}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners for the new modal
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Switch between modals
        if (type === 'login') {
            const showRegisterBtn = document.getElementById('show-register-modal');
            if (showRegisterBtn) {
                showRegisterBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    modal.style.display = 'none';
                    showRegisterModal();
                });
            }
        } else {
            const showLoginBtn = document.getElementById('show-login-modal');
            if (showLoginBtn) {
                showLoginBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    modal.style.display = 'none';
                    showLoginModal();
                });
            }
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Add modal styles if not already in stylesheet
        if (!document.getElementById('modal-styles')) {
            const style = document.createElement('style');
            style.id = 'modal-styles';
            style.textContent = `
                .auth-modal {
                    display: flex;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.7);
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    animation: fadeIn 0.3s ease forwards;
                }
                
                .modal-content {
                    background: white;
                    border-radius: 15px;
                    width: 90%;
                    max-width: 500px;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    animation: slideIn 0.4s ease;
                    position: relative;
                }
                
                .close-modal {
                    position: absolute;
                    top: 15px;
                    right: 20px;
                    font-size: 28px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    color: #fff;
                    z-index: 10;
                }
                
                .close-modal:hover {
                    color: #FFD700;
                    transform: rotate(90deg);
                }
                
                .modal-header {
                    background: linear-gradient(135deg, #1a2a6c, #b21f1f);
                    color: white;
                    padding: 25px 30px;
                    border-radius: 15px 15px 0 0;
                    text-align: center;
                }
                
                .modal-header h2 {
                    margin: 0;
                    font-size: 1.8rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                
                .modal-header h2 i {
                    color: #FFD700;
                }
                
                .modal-body {
                    padding: 30px;
                }
                
                .form-group {
                    margin-bottom: 20px;
                    position: relative;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    color: #333;
                    font-weight: 500;
                }
                
                .form-group input {
                    width: 100%;
                    padding: 12px 15px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 16px;
                    transition: all 0.3s;
                }
                
                .form-group input:focus {
                    border-color: #1a2a6c;
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(26, 42, 108, 0.2);
                }
                
                .password-toggle {
                    position: absolute;
                    right: 15px;
                    top: 38px;
                    background: none;
                    border: none;
                    color: #777;
                    cursor: pointer;
                    font-size: 16px;
                }
                
                .password-toggle:hover {
                    color: #1a2a6c;
                }
                
                .form-options {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                
                .remember-me, .terms-agreement {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .forgot-password {
                    color: #1a2a6c;
                    text-decoration: none;
                }
                
                .forgot-password:hover {
                    text-decoration: underline;
                }
                
                .auth-btn {
                    width: 100%;
                    padding: 12px;
                    border: none;
                    border-radius: 8px;
                    background: linear-gradient(135deg, #1a2a6c, #b21f1f);
                    color: white;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                
                .auth-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                }
                
                .social-login {
                    margin-top: 25px;
                    text-align: center;
                    position: relative;
                }
                
                .social-login p {
                    display: inline-block;
                    padding: 0 15px;
                    background: white;
                    position: relative;
                    z-index: 1;
                    color: #777;
                }
                
                .social-login:before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: #ddd;
                    z-index: 0;
                }
                
                .social-btns {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-top: 15px;
                }
                
                .social-btns button {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    border: 1px solid #ddd;
                    background: white;
                    font-size: 18px;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                
                .google-btn {
                    color: #DB4437;
                }
                
                .facebook-btn {
                    color: #4267B2;
                }
                
                .twitter-btn {
                    color: #1DA1F2;
                }
                
                .social-btns button:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 5px 10px rgba(0,0,0,0.1);
                }
                
                .auth-switch {
                    margin-top: 20px;
                    text-align: center;
                    color: #777;
                }
                
                .auth-switch a {
                    color: #1a2a6c;
                    text-decoration: none;
                    font-weight: 600;
                }
                
                .auth-switch a:hover {
                    text-decoration: underline;
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateY(-50px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                
                @media (max-width: 576px) {
                    .modal-content {
                        width: 95%;
                    }
                    
                    .form-options {
                        flex-direction: column;
                        gap: 10px;
                        align-items: flex-start;
                    }
                    
                    .modal-body {
                        padding: 20px;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Set up password toggle functionality
        const togglePasswordBtns = modal.querySelectorAll('.password-toggle');
        togglePasswordBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const passwordField = this.previousElementSibling;
                const icon = this.querySelector('i');
                
                if (passwordField.type === 'password') {
                    passwordField.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    passwordField.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
        
        // Set up form submission
        const form = modal.querySelector(`#${type}-form`);
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById(`${type}-email`).value.trim();
                const password = document.getElementById(`${type}-password`).value;
                
                // Simple validation
                if (!email || !password) {
                    showToast('Please fill in all fields', 'error');
                    return;
                }
                
                // Email format validation
                if (!validateEmail(email)) {
                    showToast('Please enter a valid email address', 'error');
                    return;
                }
                
                if (type === 'register') {
                    const name = document.getElementById('register-name').value.trim();
                    const confirmPassword = document.getElementById('confirm-password').value;
                    const agreeTerms = document.getElementById('agree-terms').checked;
                    
                    if (!name) {
                        showToast('Please enter your name', 'error');
                        return;
                    }
                    
                    // Password match validation
                    if (password !== confirmPassword) {
                        showToast('Passwords do not match', 'error');
                        return;
                    }
                    
                    // Password strength validation
                    if (password.length < 8) {
                        showToast('Password must be at least 8 characters long', 'error');
                        return;
                    }
                    
                    // Terms agreement validation
                    if (!agreeTerms) {
                        showToast('You must agree to the Terms & Conditions', 'error');
                        return;
                    }
                }
                
                // Show loading state
                const submitBtn = this.querySelector('.auth-btn');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${type === 'login' ? 'Logging in...' : 'Creating account...'}`;
                
                // Simulate API call
                setTimeout(() => {
                    if (type === 'login') {
                        console.log('Login submission:', { email, password });
                    } else {
                        const name = document.getElementById('register-name').value.trim();
                        console.log('Registration submission:', { name, email, password });
                        showToast('Account created successfully! Welcome to FakeBuster.', 'success');
                    }
                    
                    // For demo: Redirect to dashboard
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, type === 'register' ? 1500 : 0);
                    
                    // Reset button state (in case redirect doesn't happen)
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }, 2000);
            });
        }
        
        // Display the modal
        modal.style.display = 'flex';
    }

    // Password visibility toggle
    const togglePasswordBtns = document.querySelectorAll('.password-toggle');
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const passwordField = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordField.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // Helper function to validate email format
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
    }
    
    // Add toast notification function
    function showToast(message, type = 'info') {
        // Check if toast container exists, create if not
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
            
            // Add the CSS for toast if not already in stylesheet
            if (!document.getElementById('toast-styles')) {
                const style = document.createElement('style');
                style.id = 'toast-styles';
                style.textContent = `
                    .toast-container {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        z-index: 9999;
                    }
                    .toast {
                        min-width: 250px;
                        margin-bottom: 10px;
                        padding: 15px 20px;
                        border-radius: 5px;
                        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
                        color: white;
                        font-weight: 500;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        animation: toast-in 0.3s ease forwards;
                    }
                    .toast.info {
                        background-color: #3498db;
                    }
                    .toast.success {
                        background-color: #2ecc71;
                    }
                    .toast.warning {
                        background-color: #f39c12;
                    }
                    .toast.error {
                        background-color: #e74c3c;
                    }
                    .toast-close {
                        background: transparent;
                        border: none;
                        color: white;
                        font-size: 16px;
                        cursor: pointer;
                        margin-left: 10px;
                        opacity: 0.7;
                    }
                    .toast-close:hover {
                        opacity: 1;
                    }
                    @keyframes toast-in {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                    @keyframes toast-out {
                        from {
                            transform: translateX(0);
                            opacity: 1;
                        }
                        to {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // Set icon based on type
        let icon;
        switch(type) {
            case 'success':
                icon = 'fa-check-circle';
                break;
            case 'error':
                icon = 'fa-exclamation-circle';
                break;
            case 'warning':
                icon = 'fa-exclamation-triangle';
                break;
            default:
                icon = 'fa-info-circle';
        }
        
        // Create toast content
        const content = document.createElement('div');
        content.className = 'toast-content';
        content.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
        
        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'toast-close';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.addEventListener('click', function() {
            removeToast(toast);
        });
        
        // Append elements to toast
        toast.appendChild(content);
        toast.appendChild(closeBtn);
        
        // Add toast to container
        toastContainer.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                removeToast(toast);
            }
        }, 5000);
    }
    
    function removeToast(toast) {
        toast.style.animation = 'toast-out 0.3s ease forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }
    
    // Animate stats numbers in the stats highlight section
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statElements = document.querySelectorAll('.stat-number');
                statElements.forEach(stat => {
                    const finalValue = stat.innerText;
                    
                    // Determine if the value contains a percentage or is a number with a suffix like M, B, etc.
                    let suffix = '';
                    let targetNumber;
                    
                    if (finalValue.includes('%')) {
                        targetNumber = parseInt(finalValue);
                        suffix = '%';
                    } else if (finalValue.includes('M+')) {
                        targetNumber = parseFloat(finalValue);
                        suffix = 'M+';
                    } else if (finalValue.includes('B')) {
                        targetNumber = parseFloat(finalValue);
                        suffix = 'B';
                    } else if (finalValue.includes('K+')) {
                        targetNumber = parseFloat(finalValue);
                        suffix = 'K+';
                    } else {
                        targetNumber = parseInt(finalValue);
                    }
                    
                    // Animate from 0 to the target number
                    let startNumber = 0;
                    const duration = 2000; // 2 seconds
                    const interval = 20; // Update every 20ms
                    const steps = duration / interval;
                    const increment = targetNumber / steps;
                    
                    // Start with 0
                    stat.innerText = '0' + suffix;
                    
                    // Begin the counter animation
                    const counter = setInterval(() => {
                        startNumber += increment;
                        
                        if (startNumber >= targetNumber) {
                            clearInterval(counter);
                            stat.innerText = finalValue;
                        } else {
                            // For values with decimals
                            if (suffix === 'M+' || suffix === 'B' || suffix === 'K+') {
                                stat.innerText = startNumber.toFixed(1) + suffix;
                            } else {
                                stat.innerText = Math.floor(startNumber) + suffix;
                            }
                        }
                    }, interval);
                });
                
                // Also animate the icons with a bounce effect
                const statIcons = document.querySelectorAll('.stat-icon i');
                statIcons.forEach((icon, index) => {
                    setTimeout(() => {
                        icon.style.animation = 'bounce 0.6s ease';
                        
                        // Remove the animation after it completes to allow it to be triggered again if needed
                        setTimeout(() => {
                            icon.style.animation = '';
                        }, 600);
                    }, index * 150); // Stagger the animations
                });
                
                statsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    // Observe the stats highlight section
    const statsHighlight = document.querySelector('.stats-highlight');
    if (statsHighlight) {
        statsObserver.observe(statsHighlight);
        
        // Add CSS for bounce animation if it doesn't exist
        if (!document.getElementById('bounce-animation')) {
            const style = document.createElement('style');
            style.id = 'bounce-animation';
            style.textContent = `
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {
                        transform: translateY(0);
                    }
                    40% {
                        transform: translateY(-20px);
                    }
                    60% {
                        transform: translateY(-10px);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Add animation to features to stagger their appearance
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
        
        // Create a new observer for this specific card
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-visible');
                    
                    // Add icon animation when card becomes visible
                    const icon = entry.target.querySelector('.feature-icon i');
                    if (icon) {
                        setTimeout(() => {
                            icon.style.animation = 'icon-spin 1s ease';
                            
                            // Remove animation after completion
                            setTimeout(() => {
                                icon.style.animation = '';
                            }, 1000);
                        }, 300);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        observer.observe(card);
    });
    
    // Add icon spin animation style
    if (!document.getElementById('icon-animations')) {
        const style = document.createElement('style');
        style.id = 'icon-animations';
        style.textContent = `
            @keyframes icon-spin {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
            @keyframes wave {
                0% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
                100% { transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Only process if the href is an actual anchor link
            if (this.getAttribute('href').startsWith('#') && this.getAttribute('href') !== '#') {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80, // Account for fixed header
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Contact form submission handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const subject = document.getElementById('contact-subject').value;
            const message = document.getElementById('contact-message').value.trim();
            
            // Simple validation
            if (!name || !email || !message) {
                showToast('Please fill in all required fields', 'error');
                return;
            }
            
            // Email format validation
            if (!validateEmail(email)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('.contact-submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Simulate API call - replace with actual backend endpoint
            try {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // For demo purposes - show success
                showToast(`Thank you ${name}! Your message has been sent successfully.`, 'success');
                
                // Clear form
                this.reset();
            } catch (error) {
                // Show error
                showToast('Sorry, there was a problem sending your message. Please try again later.', 'error');
            } finally {
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }
    
    // Add video play functionality for the how it works section
    const videoPlaceholder = document.querySelector('.video-placeholder');
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', function() {
            const videoContainer = this.parentElement;
            
            // Add active class for styling
            this.classList.add('active');
            
            // Add a pulsating loading indicator while the iframe loads
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'video-loading';
            loadingIndicator.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
            this.appendChild(loadingIndicator);
            
            // Create an iframe for embedding video (YouTube example)
            const iframe = document.createElement('iframe');
            iframe.setAttribute('src', 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1'); // Replace with your actual video URL
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allowfullscreen', 'true');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.position = 'absolute';
            iframe.style.top = '0';
            iframe.style.left = '0';
            iframe.style.opacity = '0';
            iframe.style.transition = 'opacity 0.5s ease';
            iframe.style.borderRadius = '15px';
            
            // Handle iframe load event
            iframe.onload = function() {
                // Remove loading indicator
                if (loadingIndicator.parentNode) {
                    loadingIndicator.parentNode.removeChild(loadingIndicator);
                }
                
                // Fade in the iframe
                setTimeout(() => {
                    iframe.style.opacity = '1';
                    
                    // Hide the placeholder content
                    const placeholderContent = videoPlaceholder.querySelectorAll('i:not(.fa-circle-notch), p');
                    placeholderContent.forEach(el => {
                        el.style.display = 'none';
                    });
                }, 300);
            };
            
            // Add loading styles
            if (!document.getElementById('video-loading-styles')) {
                const style = document.createElement('style');
                style.id = 'video-loading-styles';
                style.textContent = `
                    .video-loading {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        color: white;
                        font-size: 3em;
                        z-index: 3;
                    }
                    .video-placeholder.active {
                        background: #000;
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Replace placeholder with iframe
            videoContainer.style.paddingBottom = '56.25%'; // 16:9 aspect ratio
            videoContainer.style.position = 'relative';
            videoContainer.appendChild(iframe);
        });
    }
    
    // Add hover animations to use cases section
    const useCaseCards = document.querySelectorAll('.use-case-card');
    useCaseCards.forEach(card => {
        const icon = card.querySelector('.use-case-icon i');
        
        card.addEventListener('mouseenter', () => {
            if (icon) {
                icon.style.animation = 'wave 1s infinite';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (icon) {
                icon.style.animation = '';
            }
        });
    });
    
    // Add subtle animations to testimonial cards
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
        const icon = card.querySelector('.testimonial-image i');
        
        // Observer to animate when testimonial comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add subtle movement to the testimonial icon
                    if (icon) {
                        icon.style.animation = 'pulse 2s infinite';
                    }
                    
                    // Add animation to rating stars
                    const stars = card.querySelectorAll('.testimonial-rating i');
                    stars.forEach((star, index) => {
                        setTimeout(() => {
                            star.style.transform = 'scale(1.3)';
                            star.style.color = '#FFD700';
                            
                            setTimeout(() => {
                                star.style.transform = '';
                            }, 300);
                        }, 300 * index);
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(card);
    });
});