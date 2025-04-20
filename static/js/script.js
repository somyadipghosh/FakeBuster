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

    // Add toggle functionality for video input methods
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    if (toggleBtns.length > 0) {
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Find all toggle buttons in this group and remove active class
                const parentGroup = this.closest('.toggle-options');
                if (parentGroup) {
                    parentGroup.querySelectorAll('.toggle-btn').forEach(b => {
                        b.classList.remove('active');
                    });
                }
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Hide all toggle sections
                const toggleGroup = this.closest('.input-toggle-group');
                if (toggleGroup) {
                    toggleGroup.querySelectorAll('.toggle-section').forEach(section => {
                        section.classList.remove('active');
                    });
                    
                    // Show the target section
                    const targetId = this.getAttribute('data-target');
                    if (targetId) {
                        const targetSection = document.getElementById(targetId);
                        if (targetSection) {
                            targetSection.classList.add('active');
                        }
                    }
                }
            });
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

    // Audio verification functionality - Enhanced version
    document.getElementById('audio-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const audioInput = document.getElementById('audio-input');
        const audioResultDiv = document.getElementById('audio-result');
        
        if (!audioInput.files || audioInput.files.length === 0) {
            audioResultDiv.innerHTML = '<div class="alert alert-warning">Please select an audio file to verify.</div>';
            return;
        }
        
        // Show loading state
        audioResultDiv.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Analyzing your audio. This may take a moment.</div>';
        
        // Create form data to send the file
        const formData = new FormData();
        formData.append('audio', audioInput.files[0]);
        
        try {
            // Send to Flask backend
            const response = await fetch('http://127.0.0.1:5000/api/detect-fake-audio', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log("Audio analysis result:", result);
            
            // Calculate probability class based on prediction scores
            let resultClass = 'neutral';
            let statusText = 'Inconclusive';
            let icon = 'question-circle';
            
            // Calculate fake probability based on the API response
            const fakeScore = result.fake_score || 0.5;
            const fakeProb = fakeScore * 100;
            
            if (fakeProb < 30) {
                resultClass = 'true';
                statusText = 'Likely Human Voice';
                icon = 'check-circle';
            } else if (fakeProb > 70) {
                resultClass = 'false';
                statusText = 'Likely AI-Generated';
                icon = 'times-circle';
            } else {
                resultClass = 'neutral';
                statusText = 'Uncertain';
                icon = 'exclamation-circle';
            }
            
            // Display results with more detailed information from the API
            audioResultDiv.innerHTML = `
                <div class="result ${resultClass}">
                    <div class="result-header">
                        <i class="fas fa-${icon}"></i>
                        <h3>Analysis Results</h3>
                    </div>
                    <div class="result-content">
                        <p><strong>Status:</strong> ${statusText}</p>
                        <p><strong>AI-generated probability:</strong> ${fakeProb.toFixed(2)}%</p>
                        <p><strong>Real voice probability:</strong> ${(result.real_score * 100).toFixed(2)}%</p>
                        ${result.confidence ? `<p><strong>Confidence level:</strong> ${(result.confidence * 100).toFixed(2)}%</p>` : ''}
                        <div class="probability-bar">
                            <div class="real-prob" style="width: ${(result.real_score * 100).toFixed(2)}%">
                                <span>Real ${(result.real_score * 100).toFixed(0)}%</span>
                            </div>
                            <div class="fake-prob" style="width: ${(result.fake_score * 100).toFixed(2)}%">
                                <span>Fake ${(result.fake_score * 100).toFixed(0)}%</span>
                            </div>
                        </div>
                        <div class="result-explanation">
                            <h4>What this means</h4>
                            ${fakeProb < 30 ? `
                                <p>The audio appears to be a genuine human recording. The analysis detected natural characteristics consistent with human speech, such as:</p>
                                <ul>
                                    <li>Natural variations in tempo and rhythm</li>
                                    <li>Expected breathing patterns</li>
                                    <li>Natural voice formants</li>
                                </ul>
                            ` : fakeProb > 70 ? `
                                <p>The audio shows signs of being artificially generated or manipulated. The analysis detected:</p>
                                <ul>
                                    <li>Unnatural patterns in speech rhythm</li>
                                    <li>Artificial transitions between sounds</li>
                                    <li>Missing or unusual vocal characteristics</li>
                                    <li>Spectral artifacts typical of AI-generated speech</li>
                                </ul>
                            ` : `
                                <p>The analysis shows mixed characteristics, making it difficult to determine if the audio is real or synthetic.</p>
                                <ul>
                                    <li>Some natural speech patterns detected</li>
                                    <li>Some potential synthetic artifacts present</li>
                                    <li>Consider context and source of the audio</li>
                                </ul>
                            `}
                            <p><em>Note: This is an automated analysis and may not be 100% accurate. For critical situations, consult with audio forensics experts.</em></p>
                        </div>
                    </div>
                </div>
            `;

            // Add custom CSS for probability bar if not already in the page
            if (!document.getElementById('probability-bar-styles')) {
                const style = document.createElement('style');
                style.id = 'probability-bar-styles';
                style.textContent = `
                    .probability-bar {
                        display: flex;
                        height: 30px;
                        border-radius: 15px;
                        overflow: hidden;
                        margin: 15px 0;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.12);
                    }
                    .real-prob {
                        background: linear-gradient(to right, #4CAF50, #8BC34A);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        text-shadow: 0 1px 1px rgba(0,0,0,0.2);
                        font-weight: bold;
                        min-width: 40px;
                        transition: width 1s ease-in-out;
                    }
                    .fake-prob {
                        background: linear-gradient(to right, #FF9800, #F44336);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        text-shadow: 0 1px 1px rgba(0,0,0,0.2);
                        font-weight: bold;
                        min-width: 40px;
                        transition: width 1s ease-in-out;
                    }
                `;
                document.head.appendChild(style);
            }
        } catch (error) {
            console.error('Error during audio analysis:', error);
            audioResultDiv.innerHTML = `<div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle"></i> 
                Analysis failed: ${error.message || 'Unknown error occurred'}. Please try again later.
            </div>`;
        }
    });

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

    // Fix for Start Discussion button and Community Forum functionality
    const discussionModal = document.getElementById('discussion-modal');
    const startDiscussionBtn = document.querySelector('.start-discussion-btn');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const discussionForm = document.getElementById('new-discussion-form');
    
    // Open discussion modal when Start Discussion button is clicked
    if (startDiscussionBtn) {
        startDiscussionBtn.addEventListener('click', function() {
            discussionModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    }
    
    // Close discussion modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            discussionModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === discussionModal) {
            discussionModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Handle discussion form submission
    if (discussionForm) {
        discussionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const title = document.getElementById('discussion-title').value;
            const category = document.getElementById('discussion-category').value;
            const tags = document.getElementById('discussion-tags').value;
            const content = document.getElementById('discussion-content').value;
            
            // Validate form
            if (!title || !category || !content) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Create new discussion
            createNewDiscussion(title, category, content, tags);
            
            // Close modal
            discussionModal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset form
            discussionForm.reset();
        });
    }
    
    // Function to create and add a new discussion to the forum
    function createNewDiscussion(title, category, content, tags = '') {
        const topicsList = document.querySelector('.topics-list');
        if (!topicsList) return;
        
        // Create new topic HTML
        const newTopic = document.createElement('div');
        newTopic.className = 'topic-item latest-topic';
        newTopic.innerHTML = `
            <div class="topic-votes">
                <button class="vote-btn"><i class="fas fa-chevron-up"></i></button>
                <span class="vote-count">1</span>
                <button class="vote-btn"><i class="fas fa-chevron-down"></i></button>
            </div>
            <div class="topic-content">
                <div class="topic-header">
                    <h3><a href="#">${title}</a></h3>
                    <span class="topic-badge latest">Latest</span>
                </div>
                <div class="topic-meta">
                    <span class="topic-author"><i class="fas fa-user"></i> You</span>
                    <span class="topic-date"><i class="fas fa-clock"></i> Just now</span>
                    <span class="topic-category"><i class="fas fa-tag"></i> ${category}</span>
                </div>
                <p class="topic-excerpt">${content.substring(0, 150)}${content.length > 150 ? '...' : ''}</p>
                <div class="topic-stats">
                    <span><i class="fas fa-comment"></i> 0 comments</span>
                    <span><i class="fas fa-eye"></i> 1 view</span>
                </div>
            </div>
        `;
        
        // Add to the top of the list
        if (topicsList.firstChild) {
            topicsList.insertBefore(newTopic, topicsList.firstChild);
        } else {
            topicsList.appendChild(newTopic);
        }
        
        // Add vote functionality to the new topic
        const voteButtons = newTopic.querySelectorAll('.vote-btn');
        voteButtons.forEach(btn => {
            btn.addEventListener('click', handleVote);
        });
        
        // Update latest discussion in sidebar
        updateLatestDiscussionInSidebar(title, content);
        
        // Animation for new topic
        newTopic.style.opacity = '0';
        newTopic.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            newTopic.style.opacity = '1';
            newTopic.style.transform = 'translateY(0)';
        }, 10);
    }
    
    // Function to update the latest discussion in the sidebar
    function updateLatestDiscussionInSidebar(title, content) {
        const latestDiscussionsBlock = document.querySelector('.latest-discussions');
        if (!latestDiscussionsBlock) return;
        
        // Generate random avatar
        const randomAvatar = `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`;
        
        // Create new card
        const newCard = document.createElement('div');
        newCard.className = 'latest-discussion-card';
        newCard.innerHTML = `
            <div class="discussion-header">
                <img src="${randomAvatar}" alt="User avatar" class="user-avatar">
                <div class="discussion-info">
                    <h4>${title}</h4>
                    <span class="discussion-poster">You • Just now</span>
                </div>
            </div>
            <p class="discussion-snippet">${content.substring(0, 100)}${content.length > 100 ? '...' : ''}</p>
            <div class="discussion-footer">
                <a href="#" class="read-more-btn">Read More</a>
            </div>
        `;
        
        // Replace existing card
        const existingCard = latestDiscussionsBlock.querySelector('.latest-discussion-card');
        if (existingCard) {
            latestDiscussionsBlock.replaceChild(newCard, existingCard);
        } else {
            latestDiscussionsBlock.appendChild(newCard);
        }
    }
    
    // Handle vote buttons
    function handleVote() {
        const direction = this.innerHTML.includes('up') ? 1 : -1;
        const voteCountElem = this.parentElement.querySelector('.vote-count');
        let currentVotes = parseInt(voteCountElem.textContent);
        
        // Check if user has already voted
        const hasVoted = this.classList.contains('voted');
        
        if (hasVoted) {
            // Remove vote
            currentVotes -= direction;
            this.classList.remove('voted');
            this.style.color = '';
        } else {
            // Add vote
            currentVotes += direction;
            this.classList.add('voted');
            this.style.color = direction > 0 ? '#007BFF' : '#dc3545';
            
            // Remove vote from opposite button if it was selected
            const oppositeBtn = direction > 0 ? 
                this.parentElement.querySelector('.vote-btn:nth-child(3)') : 
                this.parentElement.querySelector('.vote-btn:nth-child(1)');
            
            if (oppositeBtn.classList.contains('voted')) {
                oppositeBtn.classList.remove('voted');
                oppositeBtn.style.color = '';
                currentVotes -= (direction * -1);
            }
        }
        
        voteCountElem.textContent = currentVotes;
        
        // Add a brief animation to the count
        voteCountElem.style.transform = 'scale(1.2)';
        setTimeout(() => {
            voteCountElem.style.transform = 'scale(1)';
        }, 200);
    }
    
    // Attach vote handlers to existing vote buttons
    document.querySelectorAll('.vote-btn').forEach(btn => {
        btn.addEventListener('click', handleVote);
    });
});

// Dark Mode toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    
    // Apply dark mode if saved preference exists
    if (savedDarkMode === 'enabled') {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
    
    // Toggle dark mode on button click
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
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
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>'; // Change to sun icon
        }
        localStorage.setItem('darkMode', 'enabled');
    }
    
    // Function to disable dark mode
    function disableDarkMode() {
        body.classList.remove('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.classList.remove('active');
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>'; // Change to moon icon
        }
        localStorage.setItem('darkMode', 'disabled');
    }
});

// Chatbot functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotContainer = document.getElementById('chatbot-container');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const messagesContainer = document.getElementById('chatbot-messages');
    
    // Pre-defined bot responses
    const botResponses = {
        greetings: [
            "Hello! How can I help you today?", 
            "Hi there! I'm FakeBuster's assistant. What can I do for you?",
            "Welcome to FakeBuster! I'm here to answer your questions."
        ],
        farewell: [
            "Goodbye! Feel free to chat again if you have more questions.",
            "Have a great day! Come back anytime.",
            "Thanks for chatting. I'm here if you need more help."
        ],
        unknown: [
            "I'm not sure I understand. Could you rephrase that?",
            "I'm still learning. Could you ask that in a different way?",
            "I don't have information about that yet. Is there something else I can help with?"
        ],
        about: [
            "FakeBuster is an AI-powered platform that helps detect fake news, manipulated images, deepfake videos, and synthetic audio.",
            "We're a media verification platform dedicated to fighting misinformation using advanced AI technology."
        ],
        how: [
            "FakeBuster works by analyzing content using our trained AI models. Just upload your media or paste text to get started!",
            "Our system compares your content against known patterns of fake media and provides a verification result within seconds."
        ],
        features: [
            "FakeBuster can detect fake news, manipulated images, deepfake videos, and synthetic audio. We also provide educational resources on spotting misinformation.",
            "Our main features include multi-media verification, instant results, source tracking, and educational resources."
        ],
        accuracy: [
            "Our AI models achieve over 93% accuracy in detecting fake content across various media types.",
            "FakeBuster has been tested against thousands of verified examples with a 93% success rate."
        ],
        cost: [
            "The basic verification features of FakeBuster are free to use. We also offer premium plans for organizations and high-volume users.",
            "You can use our core verification tools at no cost. Premium features are available through subscription plans."
        ]
    };
    
    // Function to find the most relevant response
    function findResponse(message) {
        message = message.toLowerCase();
        
        // Check for greetings
        if (message.match(/^(hi|hello|hey|greetings)/)) {
            return getRandom(botResponses.greetings);
        }
        
        // Check for farewells
        if (message.match(/(bye|goodbye|see you|farewell)/)) {
            return getRandom(botResponses.farewell);
        }
        
        // Check for questions about FakeBuster
        if (message.includes("what is") || message.includes("who are") || message.includes("about fakebuster")) {
            return getRandom(botResponses.about);
        }
        
        // Check for how it works questions
        if (message.match(/(how|work|process|analyze|detect)/)) {
            return getRandom(botResponses.how);
        }
        
        // Check for feature questions
        if (message.match(/(feature|can it|able to|capability)/)) {
            return getRandom(botResponses.features);
        }
        
        // Check for accuracy questions
        if (message.match(/(accuracy|reliable|success rate|how good)/)) {
            return getRandom(botResponses.accuracy);
        }
        
        // Check for cost/pricing questions
        if (message.match(/(cost|price|subscription|pay|free)/)) {
            return getRandom(botResponses.cost);
        }
        
        // If no match, return unknown response
        return getRandom(botResponses.unknown);
    }
    
    // Helper function to get random item from array
    function getRandom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    // Function to add a new message to the chat
    function addMessage(content, isUser = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(isUser ? 'user-message' : 'bot-message');
        messageElement.textContent = content;
        messagesContainer.appendChild(messageElement);
        
        // Scroll to bottom of messages
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Function to show typing indicator
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('typing-indicator');
        typingIndicator.id = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            typingIndicator.appendChild(dot);
        }
        
        messagesContainer.appendChild(typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Function to remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Toggle chatbot visibility
    chatbotToggle.addEventListener('click', function() {
        chatbotContainer.classList.toggle('active');
        this.classList.toggle('active');
        
        // If opening the chatbot and no messages, add welcome message
        if (chatbotContainer.classList.contains('active') && messagesContainer.children.length === 0) {
            setTimeout(() => {
                addMessage("👋 Hi there! I'm FakeBuster's assistant. How can I help you today?");
            }, 300);
        }
    });
    
    // Close chatbot
    chatbotClose.addEventListener('click', function() {
        chatbotContainer.classList.remove('active');
        chatbotToggle.classList.remove('active');
    });
    
    // Handle message submission
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const message = messageInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessage(message, true);
        messageInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Simulate thinking time and respond
        setTimeout(() => {
            removeTypingIndicator();
            addMessage(findResponse(message));
        }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
    });
});

// Pagination functionality for forum
document.addEventListener('DOMContentLoaded', function() {
    // Handle pagination
    const pagingElements = document.querySelectorAll('.topics-paging .paging-number, .topics-paging .paging-btn');
    const topicsList = document.querySelector('.topics-list');
    
    if (pagingElements && topicsList) {
        // Sample data for demonstration - each page will show different discussions
        const pageData = {
            1: [
                {
                    title: "How to identify AI-generated images?",
                    badge: "Hot", 
                    author: "JaneDoe", 
                    time: "2 hours ago",
                    category: "Image Verification",
                    excerpt: "I've been seeing a lot of hyper-realistic images lately and I'm having trouble determining which are real and which are AI-generated...",
                    votes: 42,
                    comments: 18,
                    views: 124,
                    isNew: false,
                    isLatest: false
                },
                {
                    title: "Spotting deepfakes in political videos",
                    badge: "New", 
                    author: "TechWatcher", 
                    time: "Yesterday",
                    category: "Video Analysis",
                    excerpt: "With the upcoming elections, we're seeing an increase in manipulated political content. Here are some tips to identify deepfakes...",
                    votes: 36,
                    comments: 24,
                    views: 231,
                    isNew: true,
                    isLatest: false
                },
                {
                    title: "Success story: FakeBuster helped debunk viral misinformation",
                    badge: "", 
                    author: "FactChecker", 
                    time: "3 days ago",
                    category: "Success Stories",
                    excerpt: "I want to share how I used FakeBuster to verify a viral news story that was spreading false information about climate change...",
                    votes: 29,
                    comments: 32,
                    views: 378,
                    isNew: false,
                    isLatest: false
                },
                {
                    title: "Best practices for verifying audio clips",
                    badge: "Latest", 
                    author: "AudioExpert", 
                    time: "Just now",
                    category: "Audio Verification",
                    excerpt: "I've compiled a guide for identifying synthetic audio based on my experience as an audio engineer. These techniques have helped me spot AI-generated voices...",
                    votes: 18,
                    comments: 5,
                    views: 47,
                    isNew: false,
                    isLatest: true
                }
            ],
            2: [
                {
                    title: "Detecting image manipulation using metadata",
                    badge: "Tutorial", 
                    author: "MetadataExpert", 
                    time: "4 hours ago",
                    category: "Image Verification",
                    excerpt: "Learn how to examine image metadata to find clues about possible manipulation. This step-by-step guide will show you the tools and techniques...",
                    votes: 53,
                    comments: 15,
                    views: 210,
                    isNew: false,
                    isLatest: false
                },
                {
                    title: "New AI detection model released",
                    badge: "News", 
                    author: "AIResearcher", 
                    time: "Today",
                    category: "Research & Technology",
                    excerpt: "Our team has just released a new model that can detect AI-generated content with 97% accuracy. Here's how it works and how you can use it...",
                    votes: 61,
                    comments: 27,
                    views: 302,
                    isNew: true,
                    isLatest: false
                },
                {
                    title: "Analyzing political speeches for misleading claims",
                    badge: "", 
                    author: "PoliticalAnalyst", 
                    time: "2 days ago",
                    category: "Political Content",
                    excerpt: "In this election season, I've been using FakeBuster to analyze various political speeches. Here's what I found and how you can verify claims yourself...",
                    votes: 38,
                    comments: 41,
                    views: 415,
                    isNew: false,
                    isLatest: false
                },
                {
                    title: "Is this viral TikTok real or fake?",
                    badge: "Latest", 
                    author: "SocialMediaWatcher", 
                    time: "1 hour ago",
                    category: "Social Media",
                    excerpt: "A viral TikTok showing a politician saying controversial things has been shared millions of times. I used FakeBuster to determine if it's authentic...",
                    votes: 27,
                    comments: 19,
                    views: 183,
                    isNew: false,
                    isLatest: true
                }
            ],
            3: [
                {
                    title: "Deep learning models for synthetic text detection",
                    badge: "Technical", 
                    author: "DeepLearningDev", 
                    time: "5 hours ago",
                    category: "Technical Discussion",
                    excerpt: "I've been experimenting with different neural network architectures for detecting AI-generated text. Here are my findings and recommendations...",
                    votes: 48,
                    comments: 22,
                    views: 176,
                    isNew: false,
                    isLatest: false
                },
                {
                    title: "Legal implications of sharing manipulated content",
                    badge: "Legal", 
                    author: "DigitalLawyer", 
                    time: "Yesterday",
                    category: "Legal Discussion",
                    excerpt: "What are the legal consequences of knowingly sharing manipulated media? This post explores the current laws and regulations across different jurisdictions...",
                    votes: 41,
                    comments: 33,
                    views: 287,
                    isNew: false,
                    isLatest: false
                },
                {
                    title: "Verification challenge: Can you spot the fake?",
                    badge: "Challenge", 
                    author: "VerificationExpert", 
                    time: "2 days ago",
                    category: "Interactive",
                    excerpt: "Test your skills with these 10 examples of media content. Can you identify which ones are authentic and which ones are manipulated?",
                    votes: 73,
                    comments: 56,
                    views: 529,
                    isNew: true,
                    isLatest: false
                },
                {
                    title: "How social media platforms are fighting misinformation",
                    badge: "Latest", 
                    author: "PlatformAnalyst", 
                    time: "30 minutes ago",
                    category: "Platform Policies",
                    excerpt: "A comparative analysis of how major social media platforms are implementing measures to combat the spread of synthetic and manipulated media...",
                    votes: 32,
                    comments: 14,
                    views: 142,
                    isNew: false,
                    isLatest: true
                }
            ]
        };

        // Function to generate HTML for a topic item
        function generateTopicHTML(topic) {
            let topicClass = "";
            if (topic.isNew) topicClass = "new-topic";
            if (topic.isLatest) topicClass = "latest-topic";
            
            let badgeHTML = "";
            if (topic.badge) {
                let badgeClass = "";
                if (topic.badge === "New") badgeClass = "new";
                if (topic.badge === "Latest") badgeClass = "latest";
                badgeHTML = `<span class="topic-badge ${badgeClass}">${topic.badge}</span>`;
            }
            
            return `
                <div class="topic-item ${topicClass}">
                    <div class="topic-votes">
                        <button class="vote-btn"><i class="fas fa-chevron-up"></i></button>
                        <span class="vote-count">${topic.votes}</span>
                        <button class="vote-btn"><i class="fas fa-chevron-down"></i></button>
                    </div>
                    <div class="topic-content">
                        <div class="topic-header">
                            <h3><a href="#">${topic.title}</a></h3>
                            ${badgeHTML}
                        </div>
                        <div class="topic-meta">
                            <span class="topic-author"><i class="fas fa-user"></i> ${topic.author}</span>
                            <span class="topic-date"><i class="fas fa-clock"></i> ${topic.time}</span>
                            <span class="topic-category"><i class="fas fa-tag"></i> ${topic.category}</span>
                        </div>
                        <p class="topic-excerpt">${topic.excerpt}</p>
                        <div class="topic-stats">
                            <span><i class="fas fa-comment"></i> ${topic.comments} comments</span>
                            <span><i class="fas fa-eye"></i> ${topic.views} views</span>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Function to update the topics list with data for a specific page
        function showPageContent(pageNum) {
            if (!pageData[pageNum]) return;
            
            // Show loading state
            topicsList.style.opacity = "0.5";
            
            // Simulate loading delay
            setTimeout(() => {
                let topicsHTML = '';
                
                // Generate HTML for each topic in this page
                pageData[pageNum].forEach(topic => {
                    topicsHTML += generateTopicHTML(topic);
                });
                
                // Update the list
                topicsList.innerHTML = topicsHTML;
                topicsList.style.opacity = "1";
                
                // Add event listeners to new vote buttons
                attachVoteListeners();
                
                // Update sidebar latest discussions if this is a different page
                if (pageNum != 1) {
                    updateLatestDiscussionSidebar(pageData[pageNum].find(topic => topic.isLatest));
                }
                
                // Scroll to top of forum section
                const forumSection = document.querySelector('.community-forum');
                if (forumSection) {
                    window.scrollTo({
                        top: forumSection.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }, 500); // Simulate network delay
        }
        
        // Update sidebar with the latest discussion from the current page
        function updateLatestDiscussionSidebar(latestTopic) {
            if (!latestTopic) return;
            
            const latestDiscussionsBlock = document.querySelector('.latest-discussions');
            if (latestDiscussionsBlock) {
                const newCard = document.createElement('div');
                newCard.className = 'latest-discussion-card';
                
                // Generate random avatar
                const randomAvatar = `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`;
                
                newCard.innerHTML = `
                    <div class="discussion-header">
                        <img src="${randomAvatar}" alt="User avatar" class="user-avatar">
                        <div class="discussion-info">
                            <h4>${latestTopic.title}</h4>
                            <span class="discussion-poster">${latestTopic.author} • ${latestTopic.time}</span>
                        </div>
                    </div>
                    <p class="discussion-snippet">${latestTopic.excerpt.substring(0, 100)}${latestTopic.excerpt.length > 100 ? '...' : ''}</p>
                    <div class="discussion-footer">
                        <a href="#" class="read-more-btn">Read More</a>
                    </div>
                `;
                
                // Find existing latest discussion card and replace it
                const existingCard = latestDiscussionsBlock.querySelector('.latest-discussion-card');
                if (existingCard) {
                    existingCard.parentNode.replaceChild(newCard, existingCard);
                    
                    // Add fade-in animation
                    newCard.style.opacity = '0';
                    setTimeout(() => {
                        newCard.style.opacity = '1';
                    }, 10);
                }
            }
        }
        
        // Add click handlers for pagination elements
        pagingElements.forEach(el => {
            el.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get current page
                const currentPage = document.querySelector('.paging-current');
                let currentPageNum = parseInt(currentPage.getAttribute('data-page'));
                
                // Determine target page
                let targetPage;
                if (this.classList.contains('paging-btn')) {
                    // Handle prev/next buttons
                    const direction = this.getAttribute('data-page');
                    if (direction === 'prev') {
                        targetPage = Math.max(1, currentPageNum - 1);
                    } else if (direction === 'next') {
                        targetPage = Math.min(Object.keys(pageData).length, currentPageNum + 1);
                    }
                } else {
                    // Direct page number click
                    targetPage = parseInt(this.getAttribute('data-page'));
                }
                
                // If no change or invalid target, exit
                if (!targetPage || targetPage === currentPageNum) return;
                
                // Update pagination UI
                currentPage.classList.remove('paging-current');
                currentPage.classList.add('paging-number');
                
                // Find the new current page element
                let newCurrentPage;
                if (document.querySelector(`[data-page="${targetPage}"]`)) {
                    newCurrentPage = document.querySelector(`[data-page="${targetPage}"]`);
                    newCurrentPage.classList.remove('paging-number');
                    newCurrentPage.classList.add('paging-current');
                }
                
                // Show content for the target page
                showPageContent(targetPage);
            });
        });
        
        // Function to attach vote button event handlers
        function attachVoteListeners() {
            const voteButtons = document.querySelectorAll('.vote-btn');
            
            voteButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const direction = btn.innerHTML.includes('up') ? 1 : -1;
                    const voteCountElem = btn.parentElement.querySelector('.vote-count');
                    let currentVotes = parseInt(voteCountElem.textContent);
                    
                    // Check if user has already voted
                    const hasVoted = btn.classList.contains('voted');
                    
                    if (hasVoted) {
                        // Remove vote
                        currentVotes -= direction;
                        btn.classList.remove('voted');
                        btn.style.color = '';
                    } else {
                        // Add vote
                        currentVotes += direction;
                        btn.classList.add('voted');
                        btn.style.color = direction > 0 ? '#007BFF' : '#dc3545';
                        
                        // Remove vote from opposite button if it was selected
                        const oppositeBtn = direction > 0 ? 
                            btn.parentElement.querySelector('.vote-btn:nth-child(3)') : 
                            btn.parentElement.querySelector('.vote-btn:nth-child(1)');
                        
                        if (oppositeBtn.classList.contains('voted')) {
                            oppositeBtn.classList.remove('voted');
                            oppositeBtn.style.color = '';
                            currentVotes -= (direction * -1);
                        }
                    }
                    
                    voteCountElem.textContent = currentVotes;
                    
                    // Add a brief animation to the count
                    voteCountElem.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        voteCountElem.style.transform = 'scale(1)';
                    }, 200);
                });
            });
        }
        
        // Initialize vote button handlers
        attachVoteListeners();
    }

    // Filter buttons functionality (Trending, Recent, Most Commented)
    const filterButtons = document.querySelectorAll('.topic-filters .filter-btn');
    
    if (filterButtons.length > 0 && topicsList) {
        // Sample data for filtered topics
        const filteredTopics = {
            trending: [
                {
                    title: "Verification challenge: Can you spot the fake?",
                    badge: "Hot", 
                    author: "VerificationExpert", 
                    time: "2 days ago",
                    category: "Interactive",
                    excerpt: "Test your skills with these 10 examples of media content. Can you identify which ones are authentic and which ones are manipulated?",
                    votes: 73,
                    comments: 56,
                    views: 529,
                    isNew: true,
                    isLatest: false
                },
                {
                    title: "New AI detection model released",
                    badge: "Trending", 
                    author: "AIResearcher", 
                    time: "Today",
                    category: "Research & Technology",
                    excerpt: "Our team has just released a new model that can detect AI-generated content with 97% accuracy. Here's how it works and how you can use it...",
                    votes: 61,
                    comments: 27,
                    views: 302,
                    isNew: true,
                    isLatest: false
                },
                {
                    title: "Detecting image manipulation using metadata",
                    badge: "Popular", 
                    author: "MetadataExpert", 
                    time: "4 hours ago",
                    category: "Image Verification",
                    excerpt: "Learn how to examine image metadata to find clues about possible manipulation. This step-by-step guide will show you the tools and techniques...",
                    votes: 53,
                    comments: 15,
                    views: 210,
                    isNew: false,
                    isLatest: false
                }
            ],
            recent: [
                {
                    title: "How social media platforms are fighting misinformation",
                    badge: "Latest", 
                    author: "PlatformAnalyst", 
                    time: "30 minutes ago",
                    category: "Platform Policies",
                    excerpt: "A comparative analysis of how major social media platforms are implementing measures to combat the spread of synthetic and manipulated media...",
                    votes: 32,
                    comments: 14,
                    views: 142,
                    isNew: false,
                    isLatest: true
                },
                {
                    title: "Best practices for verifying audio clips",
                    badge: "New", 
                    author: "AudioExpert", 
                    time: "Just now",
                    category: "Audio Verification",
                    excerpt: "I've compiled a guide for identifying synthetic audio based on my experience as an audio engineer. These techniques have helped me spot AI-generated voices...",
                    votes: 18,
                    comments: 5,
                    views: 47,
                    isNew: false,
                    isLatest: true
                },
                {
                    title: "Is this viral TikTok real or fake?",
                    badge: "Recent", 
                    author: "SocialMediaWatcher", 
                    time: "1 hour ago",
                    category: "Social Media",
                    excerpt: "A viral TikTok showing a politician saying controversial things has been shared millions of times. I used FakeBuster to determine if it's authentic...",
                    votes: 27,
                    comments: 19,
                    views: 183,
                    isNew: false,
                    isLatest: true
                },
                {
                    title: "Deep learning models for synthetic text detection",
                    badge: "", 
                    author: "DeepLearningDev", 
                    time: "5 hours ago",
                    category: "Technical Discussion",
                    excerpt: "I've been experimenting with different neural network architectures for detecting AI-generated text. Here are my findings and recommendations...",
                    votes: 48,
                    comments: 22,
                    views: 176,
                    isNew: false,
                    isLatest: false
                }
            ],
            commented: [
                {
                    title: "Verification challenge: Can you spot the fake?",
                    badge: "Active", 
                    author: "VerificationExpert", 
                    time: "2 days ago",
                    category: "Interactive",
                    excerpt: "Test your skills with these 10 examples of media content. Can you identify which ones are authentic and which ones are manipulated?",
                    votes: 73,
                    comments: 56,
                    views: 529,
                    isNew: false,
                    isLatest: false
                },
                {
                    title: "Analyzing political speeches for misleading claims",
                    badge: "Discussed", 
                    author: "PoliticalAnalyst", 
                    time: "2 days ago",
                    category: "Political Content",
                    excerpt: "In this election season, I've been using FakeBuster to analyze various political speeches. Here's what I found and how you can verify claims yourself...",
                    votes: 38,
                    comments: 41,
                    views: 415,
                    isNew: false,
                    isLatest: false
                },
                {
                    title: "Success story: FakeBuster helped debunk viral misinformation",
                    badge: "", 
                    author: "FactChecker", 
                    time: "3 days ago",
                    category: "Success Stories",
                    excerpt: "I want to share how I used FakeBuster to verify a viral news story that was spreading false information about climate change...",
                    votes: 29,
                    comments: 32,
                    views: 378,
                    isNew: false,
                    isLatest: false
                },
                {
                    title: "Legal implications of sharing manipulated content",
                    badge: "", 
                    author: "DigitalLawyer", 
                    time: "Yesterday",
                    category: "Legal Discussion",
                    excerpt: "What are the legal consequences of knowingly sharing manipulated media? This post explores the current laws and regulations across different jurisdictions...",
                    votes: 41,
                    comments: 33,
                    views: 287,
                    isNew: false,
                    isLatest: false
                }
            ]
        };
        
        // Function to show filtered content
        function showFilteredContent(filterType) {
            if (!filteredTopics[filterType]) return;
            
            // Show loading state
            topicsList.style.opacity = "0.5";
            
            // Simulate loading delay
            setTimeout(() => {
                let topicsHTML = '';
                
                // Generate HTML for each topic in this filter
                filteredTopics[filterType].forEach(topic => {
                    topicsHTML += generateTopicHTML(topic);
                });
                
                // Update the list
                topicsList.innerHTML = topicsHTML;
                topicsList.style.opacity = "1";
                
                // Add event listeners to new vote buttons
                attachVoteListeners();
            }, 300); // Shorter delay for filters
        }
        
        // Add click handlers for filter buttons
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all filter buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get filter type
                const filterType = this.getAttribute('data-filter');
                
                // Show content based on filter
                if (filterType === 'all') {
                    // Show default content (page 1)
                    showPageContent(1);
                    
                    // Update pagination UI to show page 1 as active
                    const currentPage = document.querySelector('.paging-current');
                    if (currentPage) {
                        currentPage.classList.remove('paging-current');
                        currentPage.classList.add('paging-number');
                    }
                    
                    const firstPage = document.querySelector('[data-page="1"]');
                    if (firstPage) {
                        firstPage.classList.remove('paging-number');
                        firstPage.classList.add('paging-current');
                    }
                } else {
                    // Show filtered content
                    showFilteredContent(filterType);
                }
            });
        });
    }
});
