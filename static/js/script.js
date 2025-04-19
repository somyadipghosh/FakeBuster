// Add scroll animations and tab functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set up the Intersection Observer for fade-in animations
    const animateElements = document.querySelectorAll('.form-card, .dashboard, .hero-content, .site-footer, .step-card, .stat-card, .feature-card, .testimonial, .cta-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animateElements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
    
    // Stats counter animation
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
                    } else if (finalValue.includes('M')) {
                        targetNumber = parseFloat(finalValue);
                        suffix = 'M+';
                    } else if (finalValue.includes('B')) {
                        targetNumber = parseFloat(finalValue);
                        suffix = 'B';
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
                            // For values with decimals (like 70M+)
                            if (suffix === 'M+' || suffix === 'B') {
                                stat.innerText = startNumber.toFixed(1) + suffix;
                            } else {
                                stat.innerText = Math.floor(startNumber) + suffix;
                            }
                        }
                    }, interval);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    // Observe the stats container
    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
        statsObserver.observe(statsContainer);
    }
    
    // Add animation to news items to stagger their appearance
    const newsItems = document.querySelectorAll('.news-item');
    newsItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
        item.classList.add('fade-in');
        observer.observe(item);
    });
    
    // Add staggered animations to the step cards
    const stepCards = document.querySelectorAll('.step-card');
    stepCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.15}s`;
        card.classList.add('fade-in');
        observer.observe(card);
    });
    
    // Add staggered animations to the features
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
        observer.observe(card);
    });
    
    // Add staggered animations to statistics
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('fade-in');
        observer.observe(card);
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80, // Account for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to current button
            btn.classList.add('active');
            
            // Show corresponding content
            const target = btn.getAttribute('data-target');
            document.getElementById(target).classList.add('active');
        });
    });

    // File upload handling - Image
    const imageInput = document.getElementById('image-input');
    const imagePreview = document.getElementById('image-preview');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const removeImageBtn = document.getElementById('remove-image');

    if (imageInput) {
        imageInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                
                // Check file type and size
                if (!file.type.match('image.*')) {
                    alert('Please select an image file');
                    return;
                }
                
                if (file.size > 10 * 1024 * 1024) { // 10MB limit
                    alert('File size exceeds 10MB limit');
                    return;
                }
                
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreviewContainer.style.display = 'block';
                };
                
                reader.readAsDataURL(file);
            }
        });
        
        removeImageBtn.addEventListener('click', function() {
            imageInput.value = '';
            imagePreviewContainer.style.display = 'none';
        });
    }

    // File upload handling - Video
    const videoInput = document.getElementById('video-input');
    const videoPreview = document.getElementById('video-preview');
    const videoPreviewContainer = document.getElementById('video-preview-container');
    const removeVideoBtn = document.getElementById('remove-video');

    if (videoInput) {
        videoInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                
                // Check file type and size
                if (!file.type.match('video.*')) {
                    alert('Please select a video file');
                    return;
                }
                
                if (file.size > 50 * 1024 * 1024) { // 50MB limit
                    alert('File size exceeds 50MB limit');
                    return;
                }
                
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    videoPreview.src = e.target.result;
                    videoPreviewContainer.style.display = 'block';
                };
                
                reader.readAsDataURL(file);
            }
        });
        
        removeVideoBtn.addEventListener('click', function() {
            videoInput.value = '';
            videoPreviewContainer.style.display = 'none';
        });
    }

    // File upload handling - Audio
    const audioInput = document.getElementById('audio-input');
    const audioPreview = document.getElementById('audio-preview');
    const audioPreviewContainer = document.getElementById('audio-preview-container');
    const removeAudioBtn = document.getElementById('remove-audio');

    if (audioInput) {
        audioInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                
                // Check file type and size
                if (!file.type.match('audio.*')) {
                    alert('Please select an audio file');
                    return;
                }
                
                if (file.size > 20 * 1024 * 1024) { // 20MB limit
                    alert('File size exceeds 20MB limit');
                    return;
                }
                
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    audioPreview.src = e.target.result;
                    audioPreviewContainer.style.display = 'block';
                };
                
                reader.readAsDataURL(file);
            }
        });
        
        removeAudioBtn.addEventListener('click', function() {
            audioInput.value = '';
            audioPreviewContainer.style.display = 'none';
        });
    }

    // Drag and drop functionality for file uploads
    const fileUploadContainers = document.querySelectorAll('.file-upload');
    
    fileUploadContainers.forEach(container => {
        container.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#007BFF';
            this.style.backgroundColor = 'rgba(0, 123, 255, 0.05)';
        });
        
        container.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = '#dee2e6';
            this.style.backgroundColor = '';
        });
        
        container.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '#dee2e6';
            this.style.backgroundColor = '';
            
            const fileInput = this.querySelector('.file-input');
            if (fileInput && e.dataTransfer.files.length > 0) {
                fileInput.files = e.dataTransfer.files;
                
                // Trigger the change event manually
                const event = new Event('change', { bubbles: true });
                fileInput.dispatchEvent(event);
            }
        });
    });

    // Mobile Navigation Menu Toggle
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    
    if (navbar && !document.querySelector('.mobile-toggle')) {
        // Create mobile toggle button
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-toggle';
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        navbar.appendChild(mobileToggle);
        
        // Add mobile menu styles
        if (!document.getElementById('mobile-nav-styles')) {
            const style = document.createElement('style');
            style.id = 'mobile-nav-styles';
            style.textContent = `
                .mobile-toggle {
                    display: none;
                    background: none;
                    border: none;
                    color: #1a2a6c;
                    font-size: 1.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    padding: 5px;
                }
                
                .mobile-toggle:hover {
                    color: #FFD700;
                }
                
                @media (max-width: 992px) {
                    .mobile-toggle {
                        display: block;
                    }
                    
                    .nav-links {
                        display: none;
                        flex-direction: column;
                        width: 100%;
                        position: absolute;
                        top: 100%;
                        left: 0;
                        background: white;
                        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                        padding: 10px 0;
                        z-index: 999;
                        animation: slideDown 0.3s ease;
                    }
                    
                    .nav-links li {
                        width: 100%;
                    }
                    
                    .nav-links li a {
                        width: 100%;
                        padding: 12px 20px;
                        justify-content: flex-start;
                    }
                    
                    .nav-links.active {
                        display: flex;
                    }
                    
                    .navbar {
                        justify-content: space-between;
                        flex-wrap: nowrap;
                    }
                    
                    @keyframes slideDown {
                        from {
                            opacity: 0;
                            transform: translateY(-10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Toggle mobile menu
        mobileToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Change icon based on state
            const icon = this.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navbar.contains(event.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileToggle.querySelector('i').className = 'fas fa-bars';
            }
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 992) {
                    navLinks.classList.remove('active');
                    mobileToggle.querySelector('i').className = 'fas fa-bars';
                }
            });
        });
        
        // Add resize handler to reset menu state on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 992 && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileToggle.querySelector('i').className = 'fas fa-bars';
            }
        });
    }
    
    // Highlight active nav item based on scroll position
    const sections = document.querySelectorAll('section, div[id]');
    const navItems = document.querySelectorAll('.nav-links a');
    
    function highlightNavItem() {
        let scrollPosition = window.scrollY + 100; // Offset for navbar height
        
        sections.forEach(section => {
            if (!section.id) return; // Skip sections without id
            
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === '#' + section.id) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavItem);
    highlightNavItem(); // Initial call on page load
    
    // Smooth scroll enhancement for mobile
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                // Account for fixed navbar height
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Form submission handling - News/Text
document.getElementById('news-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const news = document.getElementById('news').value;
    const resultBox = document.getElementById('news-result');
    
    // Show loading animation
    resultBox.innerHTML = '<div class="loading-spinner"></div>';
    resultBox.className = 'result-box';

    try {
        const response = await fetch('/predict/text', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `text=${encodeURIComponent(news)}`
        });

        const result = await response.json();
        
        // Add animation to result display
        resultBox.style.opacity = 0;
        
        setTimeout(() => {
            if (result.prediction === "FAKE") {
                resultBox.className = 'result-box fake-result';
                resultBox.innerHTML = '<div class="result-icon">🛑</div><div class="result-text">FAKE NEWS DETECTED!</div>';
            } else {
                resultBox.className = 'result-box real-result';
                resultBox.innerHTML = '<div class="result-icon">✅</div><div class="result-text">This news appears to be REAL.</div>';
            }
            resultBox.style.opacity = 1;
        }, 300);
    } catch (error) {
        resultBox.className = 'result-box error-result';
        resultBox.innerHTML = '<div class="result-icon">⚠️</div><div class="result-text">Error processing request. Please try again.</div>';
        resultBox.style.opacity = 1;
    }
});

// Form submission handling - Image
document.getElementById('image-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const imageInput = document.getElementById('image-input');
    const resultBox = document.getElementById('image-result');
    
    if (!imageInput.files || imageInput.files.length === 0) {
        resultBox.className = 'result-box error-result';
        resultBox.innerHTML = '<div class="result-icon">⚠️</div><div class="result-text">Please select an image to analyze.</div>';
        return;
    }
    
    // Show loading animation
    resultBox.innerHTML = '<div class="loading-spinner"></div>';
    resultBox.className = 'result-box';

    try {
        const formData = new FormData();
        formData.append('image', imageInput.files[0]);
        
        const response = await fetch('/predict/image', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        
        // Add animation to result display
        resultBox.style.opacity = 0;
        
        setTimeout(() => {
            if (result.prediction === "FAKE" || result.prediction === "MANIPULATED") {
                resultBox.className = 'result-box fake-result';
                resultBox.innerHTML = `
                    <div class="result-icon">🛑</div>
                    <div class="result-text">IMAGE MANIPULATION DETECTED!</div>
                    <div class="result-details">
                        <p>Confidence: ${result.confidence}%</p>
                        <p>Type: ${result.manipulation_type || 'Digital Alteration'}</p>
                    </div>
                `;
            } else {
                resultBox.className = 'result-box real-result';
                resultBox.innerHTML = `
                    <div class="result-icon">✅</div>
                    <div class="result-text">This image appears to be AUTHENTIC.</div>
                    <div class="result-details">
                        <p>Confidence: ${result.confidence}%</p>
                    </div>
                `;
            }
            resultBox.style.opacity = 1;
        }, 300);
    } catch (error) {
        resultBox.className = 'result-box error-result';
        resultBox.innerHTML = '<div class="result-icon">⚠️</div><div class="result-text">Error processing request. Please try again.</div>';
        resultBox.style.opacity = 1;
    }
});

// Form submission handling - Video
document.getElementById('video-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const videoInput = document.getElementById('video-input');
    const resultBox = document.getElementById('video-result');
    
    if (!videoInput.files || videoInput.files.length === 0) {
        resultBox.className = 'result-box error-result';
        resultBox.innerHTML = '<div class="result-icon">⚠️</div><div class="result-text">Please select a video to analyze.</div>';
        return;
    }
    
    // Show loading animation
    resultBox.innerHTML = '<div class="loading-spinner"></div><p class="processing-message">Processing video... This may take a few moments.</p>';
    resultBox.className = 'result-box';

    try {
        const formData = new FormData();
        formData.append('video', videoInput.files[0]);
        
        const response = await fetch('/predict/video', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        
        // Add animation to result display
        resultBox.style.opacity = 0;
        
        setTimeout(() => {
            if (result.prediction === "FAKE" || result.prediction === "DEEPFAKE") {
                resultBox.className = 'result-box fake-result';
                resultBox.innerHTML = `
                    <div class="result-icon">🛑</div>
                    <div class="result-text">DEEPFAKE DETECTED!</div>
                    <div class="result-details">
                        <p>Confidence: ${result.confidence}%</p>
                        <p>Method: ${result.fake_method || 'AI-Generated Content'}</p>
                    </div>
                `;
            } else {
                resultBox.className = 'result-box real-result';
                resultBox.innerHTML = `
                    <div class="result-icon">✅</div>
                    <div class="result-text">This video appears to be AUTHENTIC.</div>
                    <div class="result-details">
                        <p>Confidence: ${result.confidence}%</p>
                    </div>
                `;
            }
            resultBox.style.opacity = 1;
        }, 300);
    } catch (error) {
        resultBox.className = 'result-box error-result';
        resultBox.innerHTML = '<div class="result-icon">⚠️</div><div class="result-text">Error processing request. Please try again.</div>';
        resultBox.style.opacity = 1;
    }
});

// Form submission handling - Audio
document.getElementById('audio-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const audioInput = document.getElementById('audio-input');
    const resultBox = document.getElementById('audio-result');
    
    if (!audioInput.files || audioInput.files.length === 0) {
        resultBox.className = 'result-box error-result';
        resultBox.innerHTML = '<div class="result-icon">⚠️</div><div class="result-text">Please select an audio file to analyze.</div>';
        return;
    }
    
    // Show loading animation
    resultBox.innerHTML = '<div class="loading-spinner"></div><p class="processing-message">Processing audio... This may take a few moments.</p>';
    resultBox.className = 'result-box';

    try {
        const formData = new FormData();
        formData.append('audio', audioInput.files[0]);
        
        const response = await fetch('/predict/audio', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        
        // Add animation to result display
        resultBox.style.opacity = 0;
        
        setTimeout(() => {
            if (result.prediction === "FAKE" || result.prediction === "SYNTHETIC") {
                resultBox.className = 'result-box fake-result';
                resultBox.innerHTML = `
                    <div class="result-icon">🛑</div>
                    <div class="result-text">SYNTHETIC VOICE DETECTED!</div>
                    <div class="result-details">
                        <p>Confidence: ${result.confidence}%</p>
                        <p>Method: ${result.generation_method || 'AI Voice Synthesis'}</p>
                    </div>
                `;
            } else {
                resultBox.className = 'result-box real-result';
                resultBox.innerHTML = `
                    <div class="result-icon">✅</div>
                    <div class="result-text">This audio appears to be AUTHENTIC.</div>
                    <div class="result-details">
                        <p>Confidence: ${result.confidence}%</p>
                    </div>
                `;
            }
            resultBox.style.opacity = 1;
        }, 300);
    } catch (error) {
        resultBox.className = 'result-box error-result';
        resultBox.innerHTML = '<div class="result-icon">⚠️</div><div class="result-text">Error processing request. Please try again.</div>';
        resultBox.style.opacity = 1;
    }
});

// Contact form submission handler
document.getElementById('contact-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form fields
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const phone = document.getElementById('contact-phone')?.value.trim() || '';
    const organization = document.getElementById('contact-organization')?.value.trim() || '';
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value.trim();
    
    // Get checkbox values
    const newsletter = document.getElementById('contact-newsletter')?.checked || false;
    const terms = document.getElementById('contact-terms')?.checked || false;
    
    // Get radio button selections
    const sourceOptions = document.querySelectorAll('input[name="source"]');
    let source = '';
    for (const option of sourceOptions) {
        if (option.checked) {
            source = option.value;
            break;
        }
    }
    
    // Get preferred contact method
    const contactMethodOptions = document.querySelectorAll('input[name="contact-method"]');
    let contactMethod = 'email'; // Default
    for (const option of contactMethodOptions) {
        if (option.checked) {
            contactMethod = option.value;
            break;
        }
    }
    
    // Create submit button reference to show loading state
    const submitBtn = this.querySelector('.contact-submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Compile form data
    const formData = {
        name,
        email,
        phone,
        organization,
        subject,
        message,
        newsletter,
        source,
        contactMethod
    };
    
    console.log('Form data being submitted:', formData);
    
    // Simulate API call (replace with actual backend endpoint)
    try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // For demo purposes - show success
        alert(`Thank you ${name}! Your message has been sent successfully. We will contact you soon via your preferred method: ${contactMethod}.`);
        
        // Clear form
        this.reset();
        
        // Default radio button selection after reset
        document.getElementById('method-email').checked = true;
    } catch (error) {
        // Show error
        alert('Sorry, there was a problem sending your message. Please try again later.');
    } finally {
        // Restore button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
});
