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

// ========== NEW SPECIAL FEATURES ==========

// Floating Hearts System
function createFloatingHeart() {
  const heartsContainer = document.getElementById('floatingHearts');
  const heart = document.createElement('div');
  heart.className = 'floating-heart';
  heart.textContent = ['💖', '💕', '💗', '💝', '❤️', '💓'][Math.floor(Math.random() * 6)];
  heart.style.left = Math.random() * 100 + '%';
  heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
  heart.style.animationDuration = (Math.random() * 4 + 6) + 's';
  heart.style.animationDelay = Math.random() * 2 + 's';
  
  heartsContainer.appendChild(heart);
  
  setTimeout(() => {
    heart.remove();
  }, 10000);
}

// Create floating hearts periodically
setInterval(createFloatingHeart, 2000);
// Create initial hearts
for (let i = 0; i < 5; i++) {
  setTimeout(createFloatingHeart, i * 400);
}

// Sticker System
let stickerPaletteOpen = false;
let isDragging = false;
let currentSticker = null;
let offsetX = 0;
let offsetY = 0;

function toggleStickerPalette() {
  const palette = document.getElementById('stickerPalette');
  stickerPaletteOpen = !stickerPaletteOpen;
  
  if (stickerPaletteOpen) {
    palette.classList.add('active');
  } else {
    palette.classList.remove('active');
  }
}

function addSticker(emoji) {
  const container = document.getElementById('stickerContainer');
  const sticker = document.createElement('div');
  sticker.className = 'sticker';
  sticker.textContent = emoji;
  
  // Random position near center
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const randomX = centerX + (Math.random() - 0.5) * 300;
  const randomY = centerY + (Math.random() - 0.5) * 300;
  
  sticker.style.left = randomX + 'px';
  sticker.style.top = randomY + 'px';
  
  container.appendChild(sticker);
  
  // Make sticker draggable
  sticker.addEventListener('mousedown', startDragging);
  sticker.addEventListener('touchstart', startDragging);
  
  // Double click to remove
  sticker.addEventListener('dblclick', function() {
    sticker.style.animation = 'stickerPop 0.3s reverse';
    setTimeout(() => sticker.remove(), 300);
  });
}

function startDragging(e) {
  e.preventDefault();
  isDragging = true;
  currentSticker = e.target;
  
  const rect = currentSticker.getBoundingClientRect();
  const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
  const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
  
  offsetX = clientX - rect.left;
  offsetY = clientY - rect.top;
  
  currentSticker.style.cursor = 'grabbing';
  currentSticker.style.zIndex = '1000';
}

function dragSticker(e) {
  if (!isDragging || !currentSticker) return;
  
  const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
  const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
  
  currentSticker.style.left = (clientX - offsetX) + 'px';
  currentSticker.style.top = (clientY - offsetY) + 'px';
}

function stopDragging() {
  if (currentSticker) {
    currentSticker.style.cursor = 'move';
    currentSticker.style.zIndex = '';
  }
  isDragging = false;
  currentSticker = null;
}

document.addEventListener('mousemove', dragSticker);
document.addEventListener('touchmove', dragSticker);
document.addEventListener('mouseup', stopDragging);
document.addEventListener('touchend', stopDragging);

// Love Messages System
const loveMessages = [
  "You make my code compile and my heart skip a beat 💕",
  "Every moment with you is a feature, not a bug ✨",
  "You're the missing semicolon that completes my life 💖",
  "Baby, you're the reason I smile at my screen 🌟",
  "You light up my world brighter than any RGB LED 💡",
  "I'd wait forever just to see your message pop up 💬",
  "You're my favorite notification 📱",
  "With you, every day feels like a successful deployment 🚀",
  "You're the best thing I never knew I needed 💝",
  "Just thinking about you makes my day better 🌈",
  "You make the ordinary extraordinary 🎆",
  "My favorite place is wherever you are 🏡",
  "You're my sunshine on the cloudiest days ☀️",
  "I fall for you more every single day 🍂",
  "You're the answer to questions I didn't know to ask 🔮",
  "Being with you feels like coming home 🏠",
  "You're my happy thought 💭",
  "I love the way you see the world 🌍",
  "Your laugh is my favorite sound in the universe 🎵",
  "You make me believe in magic ✨"
];

function showRandomLoveMessage() {
  const modal = document.getElementById('loveNoteModal');
  const text = document.getElementById('loveNoteText');
  const randomMessage = loveMessages[Math.floor(Math.random() * loveMessages.length)];
  
  text.textContent = randomMessage;
  modal.classList.add('active');
  
  // Create some hearts when showing message
  for (let i = 0; i < 10; i++) {
    setTimeout(createFloatingHeart, i * 100);
  }
}

function closeLoveNote() {
  const modal = document.getElementById('loveNoteModal');
  modal.classList.remove('active');
}

// Close modal on background click
document.getElementById('loveNoteModal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeLoveNote();
  }
});

// Confetti System
function triggerConfetti() {
  const colors = ['#ff006e', '#8338ec', '#3a86ff', '#fb5607', '#06ffa5', '#ffbe0b'];
  const confettiCount = 100;
  
  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      createConfettiPiece(colors[Math.floor(Math.random() * colors.length)]);
    }, i * 20);
  }
  
  // Also create some floating hearts during confetti
  for (let i = 0; i < 5; i++) {
    setTimeout(createFloatingHeart, i * 200);
  }
}

function createConfettiPiece(color) {
  const confetti = document.createElement('div');
  confetti.className = 'confetti-piece';
  confetti.style.backgroundColor = color;
  confetti.style.left = Math.random() * window.innerWidth + 'px';
  confetti.style.top = '-20px';
  confetti.style.width = (Math.random() * 10 + 5) + 'px';
  confetti.style.height = (Math.random() * 10 + 5) + 'px';
  confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
  confetti.style.animationDelay = Math.random() * 0.5 + 's';
  
  // Random shapes
  if (Math.random() > 0.5) {
    confetti.style.borderRadius = '50%';
  }
  
  document.body.appendChild(confetti);
  
  setTimeout(() => {
    confetti.remove();
  }, 4000);
}

// Easter Egg: Click hearts to make them multiply
let heartClickCount = 0;
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('floating-heart')) {
    heartClickCount++;
    
    // Create burst of hearts
    for (let i = 0; i < 5; i++) {
      setTimeout(createFloatingHeart, i * 50);
    }
    
    if (heartClickCount >= 10) {
      triggerConfetti();
      heartClickCount = 0;
    }
  }
});

// Special Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
  // Ctrl/Cmd + H = Random Love Message
  if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
    e.preventDefault();
    showRandomLoveMessage();
  }
  
  // Ctrl/Cmd + K = Confetti
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    triggerConfetti();
  }
  
  // Ctrl/Cmd + S = Toggle Stickers
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    toggleStickerPalette();
  }
});

// Auto-show welcome message on first visit
let hasShownWelcome = sessionStorage.getItem('welcomeShown');
if (!hasShownWelcome && window.location.hash === '') {
  setTimeout(() => {
    const welcomeMessages = [
      "Welcome to your special place, baby! 💕",
      "Made with love, just for you ✨",
      "Every pixel here is thinking of you 💖",
      "This is your love laboratory 🧪💕"
    ];
    document.getElementById('loveNoteText').textContent = 
      welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    document.getElementById('loveNoteModal').classList.add('active');
    sessionStorage.setItem('welcomeShown', 'true');
  }, 3000);
}

// Add sparkle effect on hover for important elements
document.querySelectorAll('.neon-button, .experiment-card, .generate-button').forEach(element => {
  element.addEventListener('mouseenter', function() {
    // Create mini sparkles
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const sparkle = document.createElement('div');
        sparkle.textContent = '✨';
        sparkle.style.position = 'fixed';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.fontSize = '20px';
        sparkle.style.zIndex = '9999';
        
        const rect = this.getBoundingClientRect();
        sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
        sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
        
        sparkle.style.animation = 'sparkleFloat 1s ease-out forwards';
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1000);
      }, i * 100);
    }
  });
});

// Add sparkle animation
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
  @keyframes sparkleFloat {
    0% {
      transform: translateY(0) scale(0);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: translateY(-30px) scale(1);
      opacity: 0;
    }
  }
`;
document.head.appendChild(sparkleStyle);

console.log('💕 Special features loaded! Press Ctrl+H for love message, Ctrl+K for confetti! 💕');

// ========== SEALED LETTERS SYSTEM ==========

const letters = {
  happy: {
    title: "When You're Happy 😊",
    content: `
      <p>Baby, seeing you happy makes my whole world brighter. Your smile is contagious, and your laughter is my favorite sound in the entire universe.</p>
      
      <p>I hope you know that your happiness matters to me more than anything. Whatever made you smile today, I'm grateful for it. And I hope I'm one of the reasons you're happy too.</p>
      
      <p>Keep shining, baby. Your joy is beautiful, and you deserve all the happiness in the world. I'll do my best to keep adding more reasons for you to smile.</p>
      
      <p class="letter-signature">— Always here to celebrate with you 💕</p>
    `
  },
  sad: {
    title: "When You're Sad 🥺",
    content: `
      <p>Hey baby, I know you're not feeling okay right now, and that's completely fine. It's okay to not be okay sometimes.</p>
      
      <p>I wish I could be there to hug you tight and tell you that everything will be alright. Even though I can't be there physically right now, I want you to know that I'm here for you, always.</p>
      
      <p>You're stronger than you think, braver than you know, and more loved than you could ever imagine. This feeling will pass, and I'll be here through all of it.</p>
      
      <p>Take your time to feel what you need to feel. I'm not going anywhere. Cry if you need to, rest if you need to. I got you, always.</p>
      
      <p class="letter-signature">— Your shoulder to lean on 💙</p>
    `
  },
  stressed: {
    title: "When You're Stressed 😤",
    content: `
      <p>I know you're going through a lot right now, baby. I can see how hard you're working, how much you're carrying. And I'm so proud of you for holding it together.</p>
      
      <p>But remember to breathe, okay? Take a moment. Close your eyes. Inhale. Exhale. You don't have to do everything at once. You don't have to be perfect.</p>
      
      <p>It's okay to take breaks. It's okay to ask for help. It's okay to not have all the answers right now. You're doing better than you think you are.</p>
      
      <p>Whatever you're facing, you'll get through it. You always do. And I believe in you more than you could ever know. One step at a time, baby. You got this.</p>
      
      <p class="letter-signature">— Your biggest supporter 💪</p>
    `
  },
  missing: {
    title: "When You Miss Me 💭",
    content: `
      <p>Baby, I miss you too. Like, a lot. More than words can explain. You're probably reading this and thinking "wow, he's cheesy," but it's true.</p>
      
      <p>Every second we're apart, I'm thinking about you. Wondering what you're doing, if you're smiling, if you're happy. I save our conversations and read them when I miss you. I look at your pictures and smile like an idiot.</p>
      
      <p>I know we can't always be together, but distance doesn't change how I feel about you. If anything, it makes me appreciate every moment we do have even more.</p>
      
      <p>So until we see each other again, keep this in mind: you're always in my thoughts, always in my heart. I'm counting down the moments until I can see you again.</p>
      
      <p class="letter-signature">— Missing you like crazy 💕</p>
    `
  },
  proud: {
    title: "When You Achieve Something 🌟",
    content: `
      <p>BABY!!! I'm so freaking proud of you! Look at you, achieving things, being amazing, showing the world how incredible you are!</p>
      
      <p>I knew you could do it. I always believed in you, even when you doubted yourself. You worked hard for this, you deserved this, and you earned every bit of it.</p>
      
      <p>This is just the beginning. You have so much potential, so much brilliance inside you. The sky isn't even the limit for you - you're going to go beyond that.</p>
      
      <p>I'm so lucky to be here cheering you on. Your success is my success. Your dreams are my dreams. And I'll be here celebrating every win with you, big or small.</p>
      
      <p>Congratulations, baby! You're a star! Keep shining! ✨</p>
      
      <p class="letter-signature">— Your proud boyfriend 🎉</p>
    `
  },
  anytime: {
    title: "Just Because 💕",
    content: `
      <p>Hi baby! You opened this letter just because, and I love that. No special occasion needed - you just wanted to read something from me.</p>
      
      <p>So here's what I want you to know right now, in this random moment:</p>
      
      <p>You are loved. Not for what you do, not for what you achieve, but for who you are. You, with all your quirks, your laugh, your dreams, your fears, your everything - you are loved exactly as you are.</p>
      
      <p>I think about you more than you know. I smile when I see your name pop up on my screen. I save the silly pictures you send me. I replay our conversations in my head. You've become such an important part of my life, and I wouldn't have it any other way.</p>
      
      <p>Thank you for being you. Thank you for letting me be part of your world. Thank you for choosing me.</p>
      
      <p>I love you, baby. Today, tomorrow, always.</p>
      
      <p class="letter-signature">— Yours, always and forever 💖</p>
    `
  }
};

function openLetter(type) {
  const modal = document.getElementById('letterModal');
  const letterText = document.getElementById('letterText');
  const letter = letters[type];
  
  if (letter) {
    letterText.innerHTML = `<h3>${letter.title}</h3>${letter.content}`;
    modal.classList.add('active');
    
    // Create floating hearts when opening letter
    for (let i = 0; i < 15; i++) {
      setTimeout(createFloatingHeart, i * 100);
    }
  }
}

function closeLetter() {
  const modal = document.getElementById('letterModal');
  modal.classList.remove('active');
}

// Close letter modal on background click
document.addEventListener('DOMContentLoaded', function() {
  const letterModal = document.getElementById('letterModal');
  if (letterModal) {
    letterModal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeLetter();
      }
    });
  }
  
  // Initialize all audio players
  initializeAudioPlayers();
});

// ========== PLAYLIST MUSIC PLAYER ==========

let currentlyPlaying = null;
let allAudioElements = [];

function initializeAudioPlayers() {
  const songCards = document.querySelectorAll('.song-card');
  
  songCards.forEach((card, index) => {
    const audio = card.querySelector('.song-audio');
    if (audio) {
      allAudioElements.push(audio);
      
      // Update time display when metadata loads
      audio.addEventListener('loadedmetadata', function() {
        const totalTime = document.getElementById(`total-${index}`);
        if (totalTime) {
          totalTime.textContent = formatTime(audio.duration);
        }
      });
      
      // Update progress bar as song plays
      audio.addEventListener('timeupdate', function() {
        const progress = document.getElementById(`progress-${index}`);
        const currentTime = document.getElementById(`current-${index}`);
        
        if (progress && currentTime) {
          const percentage = (audio.currentTime / audio.duration) * 100;
          progress.style.width = percentage + '%';
          currentTime.textContent = formatTime(audio.currentTime);
        }
      });
      
      // When song ends
      audio.addEventListener('ended', function() {
        const playBtn = card.querySelector('.play-btn');
        const playIcon = playBtn.querySelector('.play-icon');
        playIcon.textContent = '▶';
        playBtn.classList.remove('playing');
        currentlyPlaying = null;
      });
      
      // Make progress bar clickable
      const progressContainer = card.querySelector('.song-progress');
      if (progressContainer) {
        progressContainer.addEventListener('click', function(e) {
          if (audio.duration) {
            const rect = this.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const percentage = clickX / width;
            audio.currentTime = percentage * audio.duration;
          }
        });
      }
    }
  });
}

function playSong(index, button) {
  const songCards = document.querySelectorAll('.song-card');
  const currentCard = songCards[index];
  const audio = currentCard.querySelector('.song-audio');
  const playIcon = button.querySelector('.play-icon');
  
  // If there's a song currently playing and it's not this one, pause it
  if (currentlyPlaying && currentlyPlaying !== audio) {
    currentlyPlaying.pause();
    const allPlayBtns = document.querySelectorAll('.play-btn');
    allPlayBtns.forEach(btn => {
      btn.querySelector('.play-icon').textContent = '▶';
      btn.classList.remove('playing');
    });
  }
  
  // Toggle play/pause
  if (audio.paused) {
    audio.play();
    playIcon.textContent = '⏸';
    button.classList.add('playing');
    currentlyPlaying = audio;
    
    // Create some floating hearts when playing
    for (let i = 0; i < 3; i++) {
      setTimeout(createFloatingHeart, i * 200);
    }
  } else {
    audio.pause();
    playIcon.textContent = '▶';
    button.classList.remove('playing');
    currentlyPlaying = null;
  }
}

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Pause all songs when navigating away from playlist
function backToDashboard() {
  // Pause all audio
  allAudioElements.forEach(audio => {
    if (audio) {
      audio.pause();
    }
  });
  
  // Reset all play buttons
  const allPlayBtns = document.querySelectorAll('.play-btn');
  allPlayBtns.forEach(btn => {
    btn.querySelector('.play-icon').textContent = '▶';
    btn.classList.remove('playing');
  });
  
  currentlyPlaying = null;
  
  // Navigate back
  const activeScreen = document.querySelector('.screen.active');
  switchScreen(activeScreen.id, 'dashboard');
}
