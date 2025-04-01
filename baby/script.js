document.addEventListener('DOMContentLoaded', () => {
    const revealBtn = document.getElementById('revealBtn');
    const letterContainer = document.querySelector('.letter-container');
    const letter = document.querySelector('.letter');
    const scratchOverlay = document.querySelector('.scratch-overlay');
    const scratchCard = document.querySelector('.scratch-card');
    const nameContainer = document.querySelector('.name-container');
    const tom = document.querySelector('.tom');
    const jerry = document.querySelector('.jerry');
    
    // You can change this to the actual baby name
    const babyName = "Tom";
    
    let isScratching = false;
    let scratchProgress = 0;
    const scratchThreshold = 0.7; // 70% of the card needs to be scratched
    
    // Initialize canvas for scratch effect
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '1';
    scratchOverlay.appendChild(canvas);
    
    function resizeCanvas() {
        const rect = scratchOverlay.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        ctx.fillStyle = '#FF69B4';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Add playful animations to Tom and Jerry
    function animateCharacters() {
        tom.style.animation = 'float 3s ease-in-out infinite';
        jerry.style.animation = 'float 3s ease-in-out infinite';
        
        // Random movements
        setInterval(() => {
            if (Math.random() > 0.5) {
                tom.style.transform = 'translateX(20px)';
                setTimeout(() => {
                    tom.style.transform = 'translateX(0)';
                }, 1000);
            } else {
                jerry.style.transform = 'translateX(-20px)';
                setTimeout(() => {
                    jerry.style.transform = 'translateX(0)';
                }, 1000);
            }
        }, 3000);
    }
    
    animateCharacters();
    
    // Scratch card functionality
    function initScratchCard() {
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;
        let points = [];
        let lastTime = 0;
        const BRUSH_SIZE = window.innerWidth <= 768 ? 25 : 30;
        const MIN_DISTANCE = window.innerWidth <= 768 ? 3 : 5;
        
        function getPoint(e) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            
            let x, y;
            if (e.type.includes('touch')) {
                x = (e.touches[0].clientX - rect.left) * scaleX;
                y = (e.touches[0].clientY - rect.top) * scaleY;
            } else {
                x = (e.clientX - rect.left) * scaleX;
                y = (e.clientY - rect.top) * scaleY;
            }
            return { x, y };
        }
        
        function drawPoint(x, y) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, BRUSH_SIZE, 0, Math.PI * 2);
            ctx.fill();
        }
        
        function drawLine(fromX, fromY, toX, toY) {
            const dx = toX - fromX;
            const dy = toY - fromY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const steps = Math.ceil(distance / MIN_DISTANCE);
            
            for (let i = 0; i <= steps; i++) {
                const x = fromX + (dx * i / steps);
                const y = fromY + (dy * i / steps);
                drawPoint(x, y);
            }
        }
        
        function scratch(e) {
            if (!isDrawing) return;
            
            const currentTime = Date.now();
            if (currentTime - lastTime < 16) return; // Limit to ~60fps
            lastTime = currentTime;
            
            const point = getPoint(e);
            
            if (lastX !== 0 && lastY !== 0) {
                drawLine(lastX, lastY, point.x, point.y);
            } else {
                drawPoint(point.x, point.y);
            }
            
            lastX = point.x;
            lastY = point.y;
            
            // Calculate scratch progress less frequently on mobile
            if (Math.random() < (window.innerWidth <= 768 ? 0.1 : 0.05)) {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;
                let scratchedPixels = 0;
                let totalPixels = 0;
                
                for (let i = 0; i < pixels.length; i += 4) {
                    if (pixels[i + 3] === 0) scratchedPixels++;
                    totalPixels++;
                }
                
                scratchProgress = scratchedPixels / totalPixels;
                
                if (scratchProgress >= scratchThreshold && !scratchOverlay.classList.contains('scratched')) {
                    revealName(babyName);
                    scratchOverlay.classList.add('scratched');
                }
            }
        }
        
        function startScratching(e) {
            e.preventDefault(); // Prevent scrolling while scratching
            isDrawing = true;
            const point = getPoint(e);
            lastX = point.x;
            lastY = point.y;
            lastTime = Date.now();
            scratch(e);
        }
        
        function stopScratching() {
            isDrawing = false;
            lastX = 0;
            lastY = 0;
        }
        
        // Mouse events
        canvas.addEventListener('mousedown', startScratching);
        canvas.addEventListener('mousemove', scratch);
        canvas.addEventListener('mouseup', stopScratching);
        canvas.addEventListener('mouseleave', stopScratching);
        
        // Touch events for mobile
        canvas.addEventListener('touchstart', startScratching, { passive: false });
        canvas.addEventListener('touchmove', scratch, { passive: false });
        canvas.addEventListener('touchend', stopScratching);
        canvas.addEventListener('touchcancel', stopScratching);
        
        // Prevent default touch behaviors
        canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
        canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    }
    
    initScratchCard();
    
    function revealName(name) {
        // Show the name container with animation
        nameContainer.classList.add('visible');
        
        // Add "Call me" text
        const callMeText = document.createElement('div');
        callMeText.className = 'call-me-text';
        callMeText.textContent = 'Call me';
        nameContainer.appendChild(callMeText);
        
        // Create stars
        createStars();
        
        // Show the full name immediately
        showFullName(name);
        
        // Celebrate after a short delay
        setTimeout(() => {
            celebrate();
        }, 1000);
    }
    
    function showFullName(name) {
        // Create a new container for the full name
        const fullNameContainer = document.createElement('div');
        fullNameContainer.className = 'full-name-container';
        
        // Create spans for each letter with animation delay
        name.split('').forEach((char, index) => {
            const letterSpan = document.createElement('span');
            letterSpan.className = 'full-name-letter';
            letterSpan.textContent = char;
            letterSpan.style.animationDelay = `${index * 0.1}s`;
            fullNameContainer.appendChild(letterSpan);
        });
        
        // Add the full name container to the name container
        nameContainer.appendChild(fullNameContainer);
    }
    
    function celebrate() {
        // Add confetti effect
        createConfetti();
        
        // Make Tom and Jerry dance
        tom.style.animation = 'float 0.5s ease-in-out infinite';
        jerry.style.animation = 'float 0.5s ease-in-out infinite';
        
        // Start flying stars animation
        startFlyingStarsAnimation();
        
        // Add a success message
        setTimeout(() => {
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Welcome to the world, ' + babyName + '!';
            document.querySelector('.container').appendChild(successMessage);
        }, 1000);
    }
    
    function startFlyingStarsAnimation() {
        let starCount = 0;
        const maxStars = 30; // Increased from 20 to 30
        
        function createStar() {
            if (starCount >= maxStars) return;
            
            const star = document.createElement('div');
            star.className = 'flying-star';
            
            // Random starting position at the bottom
            const startX = Math.random() * window.innerWidth;
            star.style.left = startX + 'px';
            
            // Random size variation (bigger range)
            const size = Math.random() * 100 + 200; // 200px to 300px
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            
            // Random animation duration
            const duration = Math.random() * 3 + 4;
            star.style.animationDuration = duration + 's';
            
            // Random horizontal movement
            const horizontalMovement = (Math.random() - 0.5) * 300;
            star.style.setProperty('--horizontal-movement', horizontalMovement + 'px');
            
            document.body.appendChild(star);
            
            // Remove star after animation
            star.addEventListener('animationend', () => {
                star.remove();
                starCount--;
            });
            
            starCount++;
        }
        
        // Create stars periodically
        const createInterval = setInterval(() => {
            if (starCount < maxStars) {
                createStar();
            }
        }, 200); // Faster creation rate
        
        // Stop creating stars after 15 seconds
        setTimeout(() => {
            clearInterval(createInterval);
        }, 15000);
    }
    
    function createConfetti() {
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confetti.style.opacity = Math.random();
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }
    
    function createStars() {
        const numStars = 12; // Reduced number of stars since they're bigger
        
        for (let i = 0; i < numStars; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // Random position within the name container
            const rect = nameContainer.getBoundingClientRect();
            star.style.left = Math.random() * rect.width + 'px';
            star.style.top = Math.random() * rect.height + 'px';
            
            // Random size (bigger range)
            const size = Math.random() * 30 + 30; // 30px to 60px
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            
            // Random animation delay
            star.style.animationDelay = Math.random() * 2 + 's';
            
            nameContainer.appendChild(star);
        }
    }

    // Add viewport meta tag for mobile
    function addViewportMeta() {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(meta);
    }

    addViewportMeta();
}); 