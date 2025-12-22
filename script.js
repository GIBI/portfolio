document.addEventListener('DOMContentLoaded', () => {
    console.log("System Online: Initializing Cyber Portfolio...");

    // ==========================================
    // 1. THREE.JS BACKGROUND (MATRIX RAIN)
    // ==========================================
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        camera.position.z = 5;

        // Mouse Interaction
        const mouse = new THREE.Vector2();
        document.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Matrix Particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 5000; 
        const posArray = new Float32Array(particlesCount * 3);
        const velocityArray = new Float32Array(particlesCount);
        const worldSize = { x: 40, y: 50 }; 

        for(let i = 0; i < particlesCount * 3; i+=3) {
            posArray[i] = (Math.random() - 0.5) * worldSize.x;
            posArray[i+1] = (Math.random() - 0.5) * worldSize.y;
            posArray[i+2] = (Math.random() - 0.5) * worldSize.x;
            velocityArray[i/3] = Math.random() * 0.05 + 0.02;
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.03,
            color: 0x00ff41,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Animation Loop
        function animate() {
            requestAnimationFrame(animate);
            const positions = particlesGeometry.attributes.position.array;
            for (let i = 0; i < particlesCount; i++) {
                positions[i*3 + 1] -= velocityArray[i];
                if (positions[i*3 + 1] < -worldSize.y / 2) {
                    positions[i*3 + 1] = worldSize.y / 2;
                }
            }
            particlesGeometry.attributes.position.needsUpdate = true;

            // Parallax Effect
            scene.rotation.y += (mouse.x * 0.2 - scene.rotation.y) * 0.05;
            scene.rotation.x += (mouse.y * 0.2 - scene.rotation.x) * 0.05;

            renderer.render(scene, camera);
        }
        animate();

        // Handle Resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // ==========================================
    // 2. CHATBOT LOGIC
    // ==========================================
    const chatToggle = document.getElementById('chat-toggle-btn');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const messagesContainer = document.getElementById('chat-messages');
    const chatBadge = document.getElementById('chat-badge');

    // Toggle Chat Function
    function toggleChat() {
        // 1. Hide notification badge on first click
        if (chatBadge && !chatBadge.classList.contains('hidden')) {
            chatBadge.classList.add('hidden');
        }

        // 2. Toggle Window Visibility with Animation
        if (chatWindow.classList.contains('hidden')) {
            chatWindow.classList.remove('hidden');
            setTimeout(() => {
                chatWindow.classList.add('open');
                chatWindow.classList.remove('opacity-0', 'scale-95');
                chatWindow.classList.add('opacity-100', 'scale-100');
            }, 10);
            if(chatInput) chatInput.focus();
        } else {
            chatWindow.classList.remove('open');
            chatWindow.classList.remove('opacity-100', 'scale-100');
            chatWindow.classList.add('opacity-0', 'scale-95');
            setTimeout(() => {
                chatWindow.classList.add('hidden');
            }, 300);
        }
    }

    // Attach Listeners
    if (chatToggle) chatToggle.addEventListener('click', toggleChat);
    if (closeChat) closeChat.addEventListener('click', toggleChat);

    // Bot Knowledge Base
    const botBrain = {
        "hello": "Greetings. How can I assist you with Gibin's portfolio?",
        "hi": "System online. Hello.",
        "skills": "Gibin specializes in Threat Intelligence, SOC Operations, Penetration Testing, and Python automation. <br><a href='#skills' class='underline text-green-400'>Click here to see full skills</a>.",
        "experience": "He has interned at Falconfeeds (Dark Web Monitoring), Pheme Software (Vuln Scanner Dev), and Eye Q Dot Net.",
        "projects": "Key projects include an Automated Pen-Testing Tool, an IoT Smart Garage, and AI Video generation. <br><a href='#projects' class='underline text-green-400'>View Projects</a>.",
        "contact": "You can reach him at <strong>gibigibin3@gmail.com</strong> or via LinkedIn.",
        "resume": "You can download the CV from the navigation bar.",
        "default": "Command not recognized. Try keywords like: 'skills', 'projects', 'resume', or 'contact'."
    };

    // Handle User Input
    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userText = chatInput.value.trim();
            if (!userText) return;

            // Add User Message
            addMessage(userText, 'user');
            chatInput.value = '';

            // Simulate "Thinking"
            const typingId = 'typing-' + Date.now();
            const typingDiv = document.createElement('div');
            typingDiv.id = typingId;
            typingDiv.classList.add('bot-msg', 'flex', 'items-center', 'gap-1');
            typingDiv.innerHTML = `<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>`;
            messagesContainer.appendChild(typingDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Bot Response Delay
            setTimeout(() => {
                const typingElement = document.getElementById(typingId);
                if(typingElement) typingElement.remove();
                
                let response = botBrain["default"];
                const lowerInput = userText.toLowerCase();
                
                for (const key in botBrain) {
                    if (lowerInput.includes(key)) {
                        response = botBrain[key];
                        break;
                    }
                }
                addMessage(response, 'bot');
            }, 600);
        });
    }

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add(sender === 'user' ? 'user-msg' : 'bot-msg');
        msgDiv.innerHTML = text;
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // ==========================================
    // 3. UI LOGIC (MOBILE MENU & MODALS)
    // ==========================================
    
    // Mobile Menu
    const mobileMenuBtn = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
        });
        document.querySelectorAll('.nav-link-mobile').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
            });
        });
    }

    // Certificate Modal
    const certModal = document.getElementById('cert-modal');
    if (certModal) {
        const viewBtns = document.querySelectorAll('.view-cert-btn');
        const closeBtn = document.getElementById('modal-close-btn');
        const modalImg = document.getElementById('modal-cert-image');
        const modalName = document.getElementById('modal-cert-name');
        const modalIssuer = document.getElementById('modal-cert-issuer');
        const modalDate = document.getElementById('modal-cert-date');

        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modalName.textContent = btn.dataset.name;
                modalIssuer.textContent = btn.dataset.issuer;
                modalDate.textContent = btn.dataset.date;
                modalImg.src = btn.dataset.img;
                certModal.classList.remove('hidden');
            });
        });

        if(closeBtn) {
            closeBtn.addEventListener('click', () => certModal.classList.add('hidden'));
        }
        certModal.addEventListener('click', (e) => {
            if (e.target === certModal) certModal.classList.add('hidden');
        });
    }

    // ==========================================
    // 4. TYPEWRITER EFFECT
    // ==========================================
    const textElement = document.getElementById('typewriter-text');
    if (textElement) {
        const roles = ["Cybersecurity Analyst", "Penetration Tester", "SOC Analyst", "Threat Hunter"];
        let roleIndex = 0, charIndex = 0, isDeleting = false;

        function type() {
            const currentRole = roles[roleIndex];
            if (isDeleting) {
                textElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                textElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;
            if (!isDeleting && charIndex === currentRole.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500;
            }
            setTimeout(type, typeSpeed);
        }
        setTimeout(type, 1000);
    }

    // ==========================================
    // 5. CYBER TV (LIGHTWEIGHT VERSION)
    // ==========================================
    const tvContainer = document.getElementById('tv-container');
    if (tvContainer && window.innerWidth > 768) { // Only load on Desktop
        const tvScene = new THREE.Scene();
        const tvCamera = new THREE.PerspectiveCamera(45, tvContainer.clientWidth / tvContainer.clientHeight, 0.1, 100);
        tvCamera.position.set(0, 0, 5);
        const tvRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        tvRenderer.setSize(tvContainer.clientWidth, tvContainer.clientHeight);
        tvContainer.appendChild(tvRenderer.domElement);

        const tvGeo = new THREE.BoxGeometry(4, 3, 0.3);
        const tvMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
        const tvMesh = new THREE.Mesh(tvGeo, tvMat);
        tvMesh.rotation.y = -0.1; 
        tvMesh.position.x = -0.3;
        tvScene.add(tvMesh);
        
        const tvLight = new THREE.DirectionalLight(0xffffff, 1);
        tvLight.position.set(5, 5, 5);
        tvScene.add(tvLight);
        
        function animateTV() {
            requestAnimationFrame(animateTV);
            tvMesh.rotation.y = -0.1 + Math.sin(Date.now() * 0.001) * 0.05; // Gentle float
            tvRenderer.render(tvScene, tvCamera);
        }
        animateTV();
    }
});