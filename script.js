/* ============================================
   Birthday Surprise App for Reyhan/Juan
   ============================================ */

const app = {
  currentScene: 0,
  scenes: [
    "scene-loading",
    "scene-intro",
    "scene-guess",
    "scene-prank",
    "scene-reveal",
    "scene-hat",
    "scene-pacar",
    "scene-friends",
    "scene-memory",
    "scene-candles",
    "scene-finale",
  ],
  hatPlaced: false,
  candlesBlown: 0,
  totalCandles: 5,
  musicPlaying: false,
  currentFriendIndex: 0,

  // Memory game state
  memory: {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    totalPairs: 6,
    moves: 0,
    locked: false,
    timer: null,
    seconds: 0,
  },

  // ===== SCENE NAVIGATION =====
  goToScene(index) {
    if (index < 0 || index >= this.scenes.length) return;
    const current = document.getElementById(this.scenes[this.currentScene]);
    const next = document.getElementById(this.scenes[index]);
    if (current) current.classList.remove("active");
    if (next) next.classList.add("active");
    this.currentScene = index;
    this.onSceneEnter(index);
  },

  nextScene() {
    this.goToScene(this.currentScene + 1);
  },

  onSceneEnter(index) {
    const name = this.scenes[index];
    if (name === "scene-memory") this.initMemoryGame();
    if (name === "scene-finale") this.startConfetti();
    if (name === "scene-pacar") this.resetEnvelope();
    if (name === "scene-prank") this.startPrankSequence();
  },

  // ===== PRANK SEQUENCE =====
  startPrankSequence() {
    const jk = document.getElementById("prankJk");
    jk.classList.remove("visible");
    // Show "hehe bercanda" after 3.5 seconds
    setTimeout(() => {
      jk.classList.add("visible");
    }, 3500);
    // Auto-transition to reveal scene after 6.5 seconds
    setTimeout(() => {
      this.nextScene();
    }, 6500);
  },

  // ===== LOADING =====
  startLoading() {
    const fill = document.getElementById("loadingBarFill");
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress > 100) progress = 100;
      fill.style.width = progress + "%";
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => this.goToScene(1), 500);
      }
    }, 200);
  },

  // ===== COUNTDOWN =====
  updateCountdown() {
    const target = new Date("2026-05-14T00:00:00+07:00");
    const now = new Date();
    const diff = target - now;
    const el = document.getElementById("introCountdown");
    if (!el) return;
    if (diff <= 0) {
      el.innerHTML = "🎉 Hari ini ulang tahunnya! 🎉";
      return;
    }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    el.innerHTML = `⏰ ${h} jam ${m} menit ${s} detik lagi...`;
  },

  // ===== HAT =====
  placeHat() {
    if (this.hatPlaced) return;
    this.hatPlaced = true;
    const hat = document.getElementById("partyHat");
    const btn = document.getElementById("btnPlaceHat");
    const avatarImg = document.getElementById("hatAvatarImg");
    hat.classList.add("placed");
    if (avatarImg) avatarImg.src = "img/ekspresi/smile.png";
    btn.style.display = "none";
    // Sparkles
    this.createSparkles();
    // Show next button after delay
    setTimeout(() => {
      const nextBtn = document.createElement("button");
      nextBtn.className = "btn-glow";
      nextBtn.innerHTML =
        '<span>Lanjut baca pesan!</span><span class="btn-icon">💌</span>';
      nextBtn.onclick = () => this.nextScene();
      nextBtn.style.animation = "fadeInUp .5s both";
      document.querySelector("#scene-hat .scene-inner").appendChild(nextBtn);
    }, 1200);
  },

  createSparkles() {
    const container = document.getElementById("hatSparkles");
    for (let i = 0; i < 20; i++) {
      const s = document.createElement("div");
      s.className = "sparkle";
      s.style.left = Math.random() * 100 + "%";
      s.style.top = 40 + Math.random() * 30 + "%";
      s.style.animationDelay = Math.random() * 0.5 + "s";
      s.style.animationDuration = 0.8 + Math.random() * 0.5 + "s";
      container.appendChild(s);
      setTimeout(() => s.remove(), 2000);
    }
  },

  // ===== ENVELOPE (PACAR MESSAGE) =====
  resetEnvelope() {
    const ec = document.getElementById("envelopeContainer");
    const lc = document.getElementById("letterContainer");
    ec.classList.remove("hidden");
    lc.classList.remove("visible");
  },

  openEnvelope() {
    const envelope = document.getElementById("envelope");
    const ec = document.getElementById("envelopeContainer");
    const lc = document.getElementById("letterContainer");
    envelope.classList.add("opened");
    setTimeout(() => {
      ec.classList.add("hidden");
      lc.classList.add("visible");
      this.typeMessage();
    }, 800);
  },

  typeMessage() {
    const msg =
      "Barakallah fii umrik, Reyju\n\nHope you do your best in this year! 💕";
    const el = document.getElementById("letterText");
    el.innerHTML = "";
    let i = 0;
    const speed = 30;
    const type = () => {
      if (i < msg.length) {
        if (msg[i] === "\n") {
          el.innerHTML += "<br>";
        } else {
          el.innerHTML += msg[i];
        }
        i++;
        setTimeout(type, speed);
      }
    };
    type();
  },

  // ===== MANAGE AUDIO =====
  toggleMusic() {
    const audio = document.getElementById("bgMusic");
    const icon = document.getElementById("musicIcon");
    if (this.musicPlaying) {
      audio.pause();
      icon.textContent = "🔇";
    } else {
      audio.play().catch(() => {});
      icon.textContent = "🔊";
    }
    this.musicPlaying = !this.musicPlaying;
  },

  // ===== FRIENDS SLIDER =====
  nextFriend() {
    const cards = document.querySelectorAll(".friend-msg-card");
    if (cards.length === 0) return;
    cards[this.currentFriendIndex].classList.remove("active");
    this.currentFriendIndex = (this.currentFriendIndex + 1) % cards.length;
    cards[this.currentFriendIndex].classList.add("active");
  },
  prevFriend() {
    const cards = document.querySelectorAll(".friend-msg-card");
    if (cards.length === 0) return;
    cards[this.currentFriendIndex].classList.remove("active");
    this.currentFriendIndex =
      (this.currentFriendIndex - 1 + cards.length) % cards.length;
    cards[this.currentFriendIndex].classList.add("active");
  },

  // ===== MEMORY GAME =====
  initMemoryGame() {
    const grid = document.getElementById("memoryGrid");
    const complete = document.getElementById("gameComplete");
    grid.innerHTML = "";
    complete.classList.remove("visible");
    this.memory = {
      cards: [],
      flippedCards: [],
      matchedPairs: 0,
      totalPairs: 8,
      moves: 0,
      locked: false,
      timer: null,
      seconds: 0,
    };
    document.getElementById("moveCount").textContent = "0";
    document.getElementById("matchCount").textContent = "0";
    document.getElementById("gameTimer").textContent = "0:00";

    // Card images - using aib photos
    const images = [
      "img/aib/WhatsApp Image 2026-05-13 at 7.43.55 PM.jpeg",
      "img/aib/WhatsApp Image 2026-05-13 at 7.44.04 PM.jpeg",
      "img/aib/WhatsApp Image 2026-05-13 at 7.44.06 PM (1).jpeg",
      "img/aib/WhatsApp Image 2026-05-13 at 7.44.06 PM (2).jpeg",
      "img/aib/WhatsApp Image 2026-05-13 at 7.44.07 PM (1).jpeg",
      "img/aib/WhatsApp Image 2026-05-13 at 7.44.07 PM.jpeg",
      "img/aib/WhatsApp Image 2026-05-13 at 7.44.29 PM.jpeg",
      "img/aib/WhatsApp Image 2026-05-13 at 9.53.27 PM.jpeg",
    ];
    // Create pairs
    const pairs = [...images, ...images];
    // Shuffle
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }
    this.memory.cards = pairs;
    pairs.forEach((img, i) => {
      const card = document.createElement("div");
      card.className = "memory-card";
      card.dataset.index = i;
      card.dataset.image = img;
      card.innerHTML = `
        <div class="memory-card-inner">
          <div class="memory-card-back"></div>
          <div class="memory-card-front"><img src="${img}" alt="card" loading="lazy"></div>
        </div>`;
      card.addEventListener("click", () => this.flipCard(card));
      grid.appendChild(card);
    });
  },

  flipCard(card) {
    const mem = this.memory;
    if (mem.locked) return;
    if (
      card.classList.contains("flipped") ||
      card.classList.contains("matched")
    )
      return;
    if (mem.flippedCards.length >= 2) return;

    card.classList.add("flipped");
    mem.flippedCards.push(card);

    // Start timer on first flip
    if (!mem.timer) {
      mem.timer = setInterval(() => {
        mem.seconds++;
        const m = Math.floor(mem.seconds / 60);
        const s = mem.seconds % 60;
        document.getElementById("gameTimer").textContent =
          `${m}:${s.toString().padStart(2, "0")}`;
      }, 1000);
    }

    if (mem.flippedCards.length === 2) {
      mem.moves++;
      document.getElementById("moveCount").textContent = mem.moves;
      const [c1, c2] = mem.flippedCards;
      if (c1.dataset.image === c2.dataset.image) {
        // Match!
        c1.classList.add("matched");
        c2.classList.add("matched");
        mem.matchedPairs++;
        document.getElementById("matchCount").textContent = mem.matchedPairs;
        mem.flippedCards = [];
        if (mem.matchedPairs === mem.totalPairs) this.gameWon();
      } else {
        // No match
        mem.locked = true;
        setTimeout(() => {
          c1.classList.remove("flipped");
          c2.classList.remove("flipped");
          mem.flippedCards = [];
          mem.locked = false;
        }, 800);
      }
    }
  },

  gameWon() {
    clearInterval(this.memory.timer);
    setTimeout(() => {
      const complete = document.getElementById("gameComplete");
      const result = document.getElementById("gameResult");
      const m = Math.floor(this.memory.seconds / 60);
      const s = this.memory.seconds % 60;
      result.textContent = `Selesai dalam ${this.memory.moves} langkah dan ${m}:${s.toString().padStart(2, "0")}! 🏆`;
      complete.classList.add("visible");
    }, 600);
  },

  // ===== CANDLE BLOWING =====
  blowCandle(index) {
    const candle = document.querySelector(`.candle[data-index="${index}"]`);
    if (!candle || candle.classList.contains("blown")) return;
    candle.classList.add("blown");
    this.candlesBlown++;
    document.getElementById("candlesLeft").textContent =
      this.totalCandles - this.candlesBlown;

    if (this.candlesBlown >= this.totalCandles) {
      // All candles blown!
      setTimeout(() => {
        const scene = document.getElementById("scene-candles");
        scene.classList.add("lights-on");
        const title = scene.querySelector(".candle-title");
        const sub = scene.querySelector(".candle-sub");
        const progress = document.getElementById("candleProgress");
        title.textContent = "🎉 Selamat! 🎉";
        title.style.cssText =
          "-webkit-text-fill-color: unset; color: var(--amber);";
        sub.textContent = "Semoga harapanmu terwujud!";
        progress.innerHTML = "";
        const btn = document.createElement("button");
        btn.className = "btn-glow";
        btn.innerHTML =
          '<span>Lihat Surprise Terakhir!</span><span class="btn-icon">🎁</span>';
        btn.style.animation = "fadeInUp .8s both";
        btn.onclick = () => this.nextScene();
        progress.appendChild(btn);
      }, 1000);
    }
  },

  // ===== CONFETTI =====
  startConfetti() {
    const canvas = document.getElementById("confettiCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = [
      "#ff6b35",
      "#ffaa00",
      "#4d9fff",
      "#ff4d8d",
      "#6c5ce7",
      "#00ff88",
      "#fff",
    ];
    const particles = [];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 8 + 4,
        h: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        vy: Math.random() * 3 + 1.5,
        vx: (Math.random() - 0.5) * 2,
        rot: Math.random() * 360,
        rv: (Math.random() - 0.5) * 8,
      });
    }

    this.confettiRunning = true;
    const animate = () => {
      if (!this.confettiRunning) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;
        p.rot += p.rv;
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      requestAnimationFrame(animate);
    };
    animate();
  },

  // ===== MUSIC =====
  toggleMusic() {
    const audio = document.getElementById("bgMusic");
    const icon = document.getElementById("musicIcon");
    if (this.musicPlaying) {
      audio.pause();
      icon.textContent = "🔇";
    } else {
      audio.play().catch(() => {});
      icon.textContent = "🔊";
    }
    this.musicPlaying = !this.musicPlaying;
  },

  // ===== RESTART =====
  restart() {
    this.confettiRunning = false;
    const canvas = document.getElementById("confettiCanvas");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    this.hatPlaced = false;
    this.candlesBlown = 0;
    // Reset hat
    const hat = document.getElementById("partyHat");
    hat.classList.remove("placed");
    document.getElementById("hatAvatarImg").src = "img/ekspresi/biasa.png";
    const hatBtn = document.getElementById("btnPlaceHat");
    hatBtn.style.display = "";
    // Remove dynamically added buttons in hat scene
    const extraBtns = document.querySelectorAll("#scene-hat .btn-glow");
    extraBtns.forEach((b) => b.remove());
    // Reset candles
    document
      .querySelectorAll(".candle")
      .forEach((c) => c.classList.remove("blown"));
    const cs = document.getElementById("scene-candles");
    cs.classList.remove("lights-on");
    cs.querySelector(".candle-title").textContent = "Make a Wish! ✨";
    cs.querySelector(".candle-title").style.cssText = "";
    cs.querySelector(".candle-sub").innerHTML =
      "Pejamkan mata, lalu buat harapanmu...<br>Ketuk lilin untuk meniupnya! 🕯️";
    document.getElementById("candleProgress").innerHTML =
      'Lilin tersisa: <span id="candlesLeft">5</span>';
    // Go to intro
    this.goToScene(1);
  },

  // ===== MUSIC =====
  toggleMusic() {
    const audio = document.getElementById("bgMusic");
    const icon = document.getElementById("musicIcon");
    if (!audio) return;
    audio.loop = true;
    if (audio.paused) {
      audio.play().then(() => {
        icon.textContent = "🔊";
      }).catch(() => {});
    } else {
      audio.pause();
      icon.textContent = "🔇";
    }
  },

  // ===== INIT =====
  init() {
    this.startLoading();
    this.updateCountdown();
    setInterval(() => this.updateCountdown(), 1000);
    // Resize confetti canvas on resize
    window.addEventListener("resize", () => {
      const c = document.getElementById("confettiCanvas");
      if (c) {
        c.width = window.innerWidth;
        c.height = window.innerHeight;
      }
    });
    // Fix mobile viewport height
    const setVH = () => {
      document.documentElement.style.setProperty('--vh', window.innerHeight + 'px');
    };
    setVH();
    window.addEventListener('resize', setVH);
  },
};

// Start the app
document.addEventListener("DOMContentLoaded", () => app.init());
