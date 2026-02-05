// Particle System
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
    this.opacity = Math.random() * 0.5 + 0.2;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > canvas.width) this.x = 0;
    if (this.x < 0) this.x = canvas.width;
    if (this.y > canvas.height) this.y = 0;
    if (this.y < 0) this.y = canvas.height;
  }

  draw() {
    ctx.fillStyle = `rgba(131, 56, 236, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        ctx.strokeStyle = `rgba(131, 56, 236, ${0.15 * (1 - distance / 120)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let particle of particles) {
    particle.update();
    particle.draw();
  }

  connectParticles();
  animationId = requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// Screen Navigation
function switchScreen(fromId, toId) {
  const fromScreen = document.getElementById(fromId);
  const toScreen = document.getElementById(toId);

  fromScreen.style.animation = 'fadeOut 0.3s ease';

  setTimeout(() => {
    fromScreen.classList.remove('active');
    toScreen.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 300);
}

function startExperiment() {
  switchScreen('welcome', 'dashboard');
}

function runExperiment(experimentId) {
  switchScreen('dashboard', experimentId);
}

function backToDashboard() {
  const activeScreen = document.querySelector('.screen.active');
  switchScreen(activeScreen.id, 'dashboard');
}

// Reason Generator
const reasons = [
  "Your laugh makes everything better, even bad jokes",
  "You understand my weird sense of humor perfectly",
  "You make ordinary moments feel extraordinary",
  "Your smile is literally my favorite notification",
  "You're the perfect balance of chaos and calm",
  "You make me want to be a better person",
  "Your random 3am thoughts are my favorite conversations",
  "You turn my bad days into good ones just by existing",
  "You're cute even when you're being a total gremlin",
  "You remember the tiny details I mention in passing",
  "Your energy is infectious in the best way possible",
  "You make me laugh until my stomach hurts",
  "You're brilliant and you don't even realize it",
  "You're my favorite person to do nothing with",
  "You make me feel understood without saying a word",
  "Your weird quirks are actually my favorite things about you",
  "You're brave in ways you don't give yourself credit for",
  "You light up every room you walk into",
  "You make me feel at home wherever we are",
  "You're the plot twist I never saw coming but needed"
];

let reasonCount = 0;

function generateReason() {
  const display = document.getElementById('reasonDisplay');
  const counter = document.getElementById('reasonCount');
  
  // Random reason
  const randomReason = reasons[Math.floor(Math.random() * reasons.length)];
  
  // Fade out
  display.style.opacity = '0';
  display.style.transform = 'scale(0.9)';
  
  setTimeout(() => {
    display.querySelector('p').textContent = randomReason;
    display.style.opacity = '1';
    display.style.transform = 'scale(1)';
    reasonCount++;
    counter.textContent = reasonCount;
  }, 300);
}

// Initialize reason display transition
document.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById('reasonDisplay');
  if (display) {
    display.style.transition = 'all 0.3s ease';
  }
});

// Quiz
let quizAnswered = false;

function answerQuiz(answer) {
  if (quizAnswered) return;
  
  quizAnswered = true;
  const quizCard = document.getElementById('quizCard');
  const quizResult = document.getElementById('quizResult');
  const meterFill = document.getElementById('meterFill');
  const compatScore = document.getElementById('compatScore');
  
  // Hide question
  quizCard.style.animation = 'fadeOut 0.5s ease';
  
  setTimeout(() => {
    quizCard.style.display = 'none';
    quizResult.style.display = 'block';
    
    // Animate meter
    setTimeout(() => {
      meterFill.style.width = '100%';
      
      // Animate score counting
      let currentScore = 0;
      const scoreInterval = setInterval(() => {
        currentScore += 2;
        compatScore.textContent = currentScore;
        
        if (currentScore >= 100) {
          clearInterval(scoreInterval);
          compatScore.textContent = '100';
        }
      }, 20);
    }, 500);
  }, 500);
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const activeScreen = document.querySelector('.screen.active');
    if (activeScreen && activeScreen.id !== 'welcome' && activeScreen.id !== 'dashboard') {
      backToDashboard();
    }
  }
});

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    to {
      opacity: 0;
      transform: scale(0.95) translateY(-20px);
    }
  }
`;
document.head.appendChild(style);

// Typing Effect for Terminal
function typeText(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';
  
  const typing = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(typing);
    }
  }, speed);
}

// Initialize typing effects on load
window.addEventListener('load', () => {
  const typingLines = document.querySelectorAll('.typing-effect');
  
  typingLines.forEach((line, index) => {
    const text = line.getAttribute('data-text');
    const delay = (index + 1) * 800 + 300; // Stagger the typing
    
    setTimeout(() => {
      typeText(line, text, 30);
    }, delay);
  });
});

// Add interactive hover effects to experiment cards
document.querySelectorAll('.experiment-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    const icon = this.querySelector('.experiment-icon');
    icon.style.transform = 'scale(1.2) rotate(5deg)';
    icon.style.transition = 'transform 0.3s ease';
  });
  
  card.addEventListener('mouseleave', function() {
    const icon = this.querySelector('.experiment-icon');
    icon.style.transform = 'scale(1) rotate(0deg)';
  });
});

// Mobile touch effects
if ('ontouchstart' in window) {
  document.querySelectorAll('.experiment-card, .quiz-option, .generate-button').forEach(el => {
    el.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.95)';
    });
    
    el.addEventListener('touchend', function() {
      setTimeout(() => {
        this.style.transform = '';
      }, 100);
    });
  });
}

// Particle system optimization for mobile
if (window.innerWidth < 768) {
  // Reduce particles on mobile
  function initParticlesMobile() {
    particles = [];
    const particleCount = Math.floor((canvas.width * canvas.height) / 30000);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }
  initParticlesMobile();
}

// Easter Egg: Secret code
const secretCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
let secretIndex = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === secretCode[secretIndex]) {
    secretIndex++;
    if (secretIndex === secretCode.length) {
      activateSecretMode();
      secretIndex = 0;
    }
  } else {
    secretIndex = 0;
  }
});

function activateSecretMode() {
  // Add extra particles burst
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle());
  }
  
  // Change colors temporarily
  document.documentElement.style.setProperty('--accent-purple', '#ff006e');
  
  setTimeout(() => {
    document.documentElement.style.setProperty('--accent-purple', '#8338ec');
    // Remove extra particles
    particles = particles.slice(0, Math.floor((canvas.width * canvas.height) / 15000));
  }, 5000);
  
  console.log('🎉 Secret mode activated! Love you! 💜');
}

// Smooth scroll for all sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Performance optimization: pause particles when tab is hidden
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    cancelAnimationFrame(animationId);
  } else {
    animateParticles();
  }
});
