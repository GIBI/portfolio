// --- THREE.JS SETUP (BACKGROUND) ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-canvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
camera.position.z = 5;

// --- MOUSE INTERACTION SETUP ---
const mouse = new THREE.Vector2();
document.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// --- 3D OBJECTS (MATRIX RAIN) ---
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 15000;
const posArray = new Float32Array(particlesCount * 3);
const velocityArray = new Float32Array(particlesCount);
const worldSize = { x: 30, y: 40 }; 

for(let i = 0; i < particlesCount * 3; i+=3) {
    posArray[i] = (Math.random() - 0.5) * worldSize.x;
    posArray[i+1] = (Math.random() - 0.5) * worldSize.y;
    posArray[i+2] = (Math.random() - 0.5) * worldSize.x;
    velocityArray[i/3] = Math.random() * 0.03 + 0.01;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x00ff41,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// --- LIGHTS ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0x00ff41, 1.0);
pointLight.position.set(0, 0, 2);
scene.add(pointLight);

// --- SCROLL ANIMATION ---
const sections = document.querySelectorAll('.content-section');
const navLinks = document.querySelectorAll('.nav-link');
const mobileNavLinks = document.querySelectorAll('.nav-link-mobile');
let lastScrollTop = 0;

function updateOnScroll() {
    const scrollY = window.scrollY;
    const scrollFactorZ = 5 - scrollY * 0.003;
    const scrollFactorY = -scrollY * 0.002;
    camera.position.z += (scrollFactorZ - camera.position.z) * 0.1;
    camera.position.y += (scrollFactorY - camera.position.y) * 0.1;
    
    let currentSectionId = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150; 
        if (scrollY >= sectionTop) {
            currentSectionId = section.getAttribute('id');
        }
    });

    const updateActiveLink = (links) => {
            links.forEach(link => {
                link.classList.remove('active');
                if (link.dataset.section === currentSectionId) {
                    link.classList.add('active');
                }
            });
    };
    updateActiveLink(navLinks);
    updateActiveLink(mobileNavLinks);
    lastScrollTop = scrollY <= 0 ? 0 : scrollY;
}
window.addEventListener('scroll', updateOnScroll);

// --- NAVBAR CLICK & MOBILE MENU ---
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const hamburgerIcon = document.getElementById('hamburger-icon');

const allLinks = document.querySelectorAll('a[href^="#"]');
allLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if(this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView();
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                hamburgerIcon.innerHTML = '&#9776;';
            }
        }
    });
});

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    if (mobileMenu.classList.contains('hidden')) {
        hamburgerIcon.innerHTML = '&#9776;';
    } else {
        hamburgerIcon.innerHTML = '&times;';
    }
});

// --- CERTIFICATE MODAL LOGIC ---
const certModal = document.getElementById('cert-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const viewCertBtns = document.querySelectorAll('.view-cert-btn');
const modalCertImage = document.getElementById('modal-cert-image');
const modalCertName = document.getElementById('modal-cert-name');
const modalCertIssuer = document.getElementById('modal-cert-issuer');
const modalCertDate = document.getElementById('modal-cert-date');

viewCertBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modalCertName.textContent = btn.dataset.name;
        modalCertIssuer.textContent = btn.dataset.issuer;
        modalCertDate.textContent = btn.dataset.date;
        modalCertImage.src = btn.dataset.img;
        certModal.classList.remove('hidden');
    });
});

const closeModal = () => certModal.classList.add('hidden');
modalCloseBtn.addEventListener('click', closeModal);
certModal.addEventListener('click', (e) => {
    if (e.target === certModal) closeModal();
});

// --- TYPEWRITER EFFECT (HERO TEXT) ---
const typewriterTextEl = document.getElementById('typewriter-text');
const titles = ["Junior Cybersecurity Analyst", "CEH v12 Certified", "SOC & Incident Response", "Prompt Engineer"];
let titleIndex = 0, charIndex = 0, isDeleting = false;

function type() {
    const currentTitle = titles[titleIndex];
    if (isDeleting) {
        charIndex--;
    } else {
        charIndex++;
    }
    typewriterTextEl.textContent = currentTitle.substring(0, charIndex);
    let typeSpeed = isDeleting ? 100 : 200;
    if (!isDeleting && charIndex === currentTitle.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typeSpeed = 500;
    }
    setTimeout(type, typeSpeed);
}

// --- CYBER TV SCRIPT ---
function setupCyberTV() {
    const container = document.getElementById('tv-container');
    if (!container) return;

    const tvScene = new THREE.Scene();
    const tvCamera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    tvCamera.position.set(0, 0, 5);

    const tvRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    tvRenderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(tvRenderer.domElement);

    const tvGeometry = new THREE.BoxGeometry(4, 3, 0.3);
    const tvMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const tvFrame = new THREE.Mesh(tvGeometry, tvMaterial);
    tvFrame.rotation.y = -0.1; 
    tvFrame.position.x = -0.3;
    tvScene.add(tvFrame);

    const screenGeometry = new THREE.PlaneGeometry(3, 2);
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 1024;
    screenCanvas.height = 680;
    const ctx = screenCanvas.getContext('2d');

    const factsList = [
        "⚠️ ALERT: Global ransomware attacks surge by 40% this month.",
        "💾 Breach detected: Major corporation leaked confidential data.",
        "🛡️ Cybersecurity tip: Enable 2FA to prevent account hacks.",
        "🚨 Phishing attacks rising: Over 90% target email users.",
        "🖥️ IoT vulnerability: Millions of devices exposed online.",
        "🔒 Encryption failures discovered in cloud storage systems.",
        "💡 Fact: First computer virus appeared in 1986, called Brain."
    ];
    let index = Math.floor(Math.random() * factsList.length);
    let currentFact = factsList[index];
    let tvCharIndex = 0;
    let typedText = "";

    function wrapText(text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let line = '';
        for(let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
                lines.push(line);
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line);
        return lines;
    }

    function typeWriterTV() {
        if(tvCharIndex < currentFact.length) {
            typedText += currentFact.charAt(tvCharIndex);
            tvCharIndex++;
        } else {
            setTimeout(() => {
                index = Math.floor(Math.random() * factsList.length);
                currentFact = factsList[index];
                tvCharIndex = 0;
                typedText = "";
            }, 4000);
        }
    }

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    const screenMaterial = new THREE.MeshBasicMaterial({ map: screenTexture });
    const tvScreen = new THREE.Mesh(screenGeometry, screenMaterial);
    tvScreen.position.z = 0.16;
    tvScreen.rotation.y = -0.1;
    tvScreen.position.x = -0.3;
    tvScene.add(tvScreen);

    const tvAmbientLight = new THREE.AmbientLight(0xffffff, 0.8);
    tvScene.add(tvAmbientLight);
    const tvDirectionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    tvDirectionalLight.position.set(5, 5, 5);
    tvScene.add(tvDirectionalLight);

    function drawScreen() {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, screenCanvas.width, screenCanvas.height);
        ctx.fillStyle = "#0f0";
        ctx.font = '60px monospace';
        const lines = wrapText(typedText, screenCanvas.width - 0);
        for(let i = 0; i < lines.length; i++){
            ctx.fillText(lines[i], 30, 100 + i * 60);
        }
        for(let i = 0; i < 6; i++){
            const y = Math.random() * screenCanvas.height;
            ctx.fillStyle = `rgba(0,255,0,${Math.random()*0.3})`;
            ctx.fillRect(Math.random() * screenCanvas.width, y, Math.random() * screenCanvas.width, 2);
        }
        screenTexture.needsUpdate = true;
    }

    function animateTV() {
        requestAnimationFrame(animateTV);
        typeWriterTV();
        drawScreen();
        tvRenderer.render(tvScene, tvCamera);
    }
    animateTV();

    window.addEventListener('resize', () => {
        if (!container.clientWidth || !container.clientHeight) return;
        tvCamera.aspect = container.clientWidth / container.clientHeight;
        tvCamera.updateProjectionMatrix();
        tvRenderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// --- WINDOW RESIZE (MAIN SCENE)---
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
window.addEventListener('resize', onWindowResize);

// --- ANIMATION LOOP (MAIN SCENE) ---
function animate() {
    // Animate Matrix Rain
    const positions = particlesMesh.geometry.attributes.position.array;
    for (let i = 0; i < particlesCount; i++) {
        positions[i*3 + 1] -= velocityArray[i];
        if (positions[i*3 + 1] < -worldSize.y / 2) {
            positions[i*3 + 1] = worldSize.y / 2;
        }
    }
    particlesMesh.geometry.attributes.position.needsUpdate = true;
    
    // Mouse interaction
    const targetRotationX = mouse.y * 0.2;
    const targetRotationY = mouse.x * 0.2;
    scene.rotation.y += (targetRotationY - scene.rotation.y) * 0.05;
    scene.rotation.x += (targetRotationX - scene.rotation.x) * 0.05;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, 1000); 
    setupCyberTV();
});

animate();