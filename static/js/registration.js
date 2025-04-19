document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    const verifyEmailBtn = document.getElementById('verifyEmailBtn');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const strengthMeterFill = document.getElementById('strength-meter-fill');
    const strengthText = document.getElementById('strength-text');
    const passwordMatch = document.getElementById('password-match');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    const termsCheckbox = document.getElementById('terms');
    const termsLink = document.querySelector('.terms-link');
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    const githubLoginBtn = document.getElementById('githubLoginBtn');
    const microsoftLoginBtn = document.getElementById('microsoftLoginBtn');
    
    // Toggle password visibility
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
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
    });
    
    // Social login functionality
    googleLoginBtn.addEventListener('click', function() {
        // In a real implementation, this would use Google OAuth
        console.log('Google sign-in initiated');
        
        // Example of how to use Google Sign-In (this is placeholder code)
        // You would need to include the Google Sign-In API in your HTML
        // and configure it with your client ID
        try {
            // Simulating Google sign-in process
            showSocialLoginMessage('Google');
            
            // In production, you would use something like:
            // gapi.auth2.getAuthInstance().signIn().then(handleGoogleSignIn);
        } catch (error) {
            console.error('Google sign-in error:', error);
            alert('Error signing in with Google. Please try again.');
        }
    });
    
    githubLoginBtn.addEventListener('click', function() {
        // In a real implementation, this would use GitHub OAuth
        console.log('GitHub sign-in initiated');
        
        // Example of GitHub OAuth flow (this is placeholder code)
        try {
            // Simulating GitHub sign-in process
            showSocialLoginMessage('GitHub');
            
            // In production, you would redirect to GitHub authorization URL:
            // const githubAuthUrl = 'https://github.com/login/oauth/authorize?client_id=YOUR_CLIENT_ID&scope=user:email&redirect_uri=YOUR_REDIRECT_URI';
            // window.location.href = githubAuthUrl;
        } catch (error) {
            console.error('GitHub sign-in error:', error);
            alert('Error signing in with GitHub. Please try again.');
        }
    });

    microsoftLoginBtn.addEventListener('click', function() {
        // In a real implementation, this would use Microsoft Authentication Library (MSAL)
        console.log('Microsoft sign-in initiated');
        
        // Example of how to use Microsoft Authentication (this is placeholder code)
        try {
            // Simulating Microsoft sign-in process
            showSocialLoginMessage('Microsoft');
            
            // In production, you would use something like:
            // const msalConfig = {
            //     auth: {
            //         clientId: "YOUR_CLIENT_ID",
            //         authority: "https://login.microsoftonline.com/common"
            //     }
            // };
            // const msalInstance = new msal.PublicClientApplication(msalConfig);
            // msalInstance.loginPopup().then(handleMicrosoftSignIn);
        } catch (error) {
            console.error('Microsoft sign-in error:', error);
            alert('Error signing in with Microsoft. Please try again.');
        }
    });
    
    function showSocialLoginMessage(provider) {
        alert(`${provider} authentication would happen here.\n\nIn a real implementation, you would be redirected to ${provider} to authenticate and then back to this site after successful authentication.`);
    }
    
    // Check password strength
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        
        updateStrengthMeter(strength);
    });
    
    // Check if passwords match
    confirmPasswordInput.addEventListener('input', function() {
        const password = passwordInput.value;
        const confirmPassword = this.value;
        
        if (!confirmPassword) {
            passwordMatch.textContent = '';
            passwordMatch.className = '';
            return;
        }
        
        if (password === confirmPassword) {
            passwordMatch.textContent = 'Passwords match';
            passwordMatch.className = 'match-success';
        } else {
            passwordMatch.textContent = 'Passwords do not match';
            passwordMatch.className = 'match-error';
        }
    });
    
    // Email verification button click event
    verifyEmailBtn.addEventListener('click', function() {
        const email = document.getElementById('email').value;
        
        if (!email) {
            alert('Please enter your email address');
            return;
        }
        
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Show alert for email verification
        alert('Please check your email for the OTP verification link');
        
        // Here you would typically send an API request to your backend
        // to send a verification email with OTP to the user
    });
    
    // Terms and conditions link click
    termsLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Terms and Conditions\n\n1. By registering, you agree to our privacy policy.\n2. Your data will be securely stored and will not be shared with third parties.\n3. You must be at least 18 years old to register.\n4. You agree to receive emails about account activities.');
    });
    
    // Form submission event
    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const mobile = document.getElementById('mobile').value;
        const dob = document.getElementById('dob').value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (!fullName || !email || !mobile || !dob || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }
        
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        if (!isValidMobile(mobile)) {
            alert('Please enter a valid 10-digit mobile number');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        if (calculatePasswordStrength(password) < 2) {
            alert('Please choose a stronger password');
            return;
        }
        
        if (!termsCheckbox.checked) {
            alert('Please agree to the Terms and Conditions');
            return;
        }
        
        // Here you would typically send the registration data to your backend
        console.log('Registration data:', {
            fullName,
            email,
            mobile,
            dob,
            password,
            termsAccepted: termsCheckbox.checked
        });
        
        alert('Registration successful! Thank you for registering.');
        registrationForm.reset();
    });
    
    // Helper function to calculate password strength (0: very weak, 1: weak, 2: medium, 3: strong, 4: very strong)
    function calculatePasswordStrength(password) {
        let strength = 0;
        
        if (!password) return strength;
        
        // Length check
        if (password.length >= 8) strength += 1;
        if (password.length >= 12) strength += 1;
        
        // Complexity checks
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        // Cap at 4
        return Math.min(strength, 4);
    }
    
    // Helper function to update the strength meter
    function updateStrengthMeter(strength) {
        // Remove all classes first
        strengthMeterFill.className = 'strength-meter-fill';
        
        let strengthClass = '';
        let strengthLabel = '';
        
        switch(strength) {
            case 0:
                strengthClass = '';
                strengthLabel = 'Very weak';
                strengthMeterFill.style.width = '10%';
                strengthMeterFill.style.backgroundColor = '#ff4d4d';
                break;
            case 1:
                strengthClass = 'strength-weak';
                strengthLabel = 'Weak';
                break;
            case 2:
                strengthClass = 'strength-medium';
                strengthLabel = 'Medium';
                break;
            case 3:
                strengthClass = 'strength-good';
                strengthLabel = 'Good';
                break;
            case 4:
                strengthClass = 'strength-strong';
                strengthLabel = 'Strong';
                break;
        }
        
        if (strength > 0) {
            strengthMeterFill.classList.add(strengthClass);
        }
        
        strengthText.textContent = strengthLabel;
    }
    
    // Helper function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Helper function to validate mobile number
    function isValidMobile(mobile) {
        const mobileRegex = /^\d{10}$/;
        return mobileRegex.test(mobile);
    }
});