class PomodoroTimer {
  constructor() {
    this.workTime = 25 * 60;
    this.breakTime = 5 * 60;
    this.currentTime = this.workTime;
    this.isRunning = false;
    this.isWorkMode = true;
    this.completedPomodoros = 0;
    this.soundEnabled = true;
    this.interval = null;

    this.timerDisplay = document.getElementById('timer');
    this.progressRing = document.getElementById('progress-ring');
    this.startBtn = document.getElementById('startBtn');
    this.pauseBtn = document.getElementById('pauseBtn');
    this.resetBtn = document.getElementById('resetBtn');
    this.soundToggle = document.getElementById('soundToggle');
    this.workModeBtn = document.getElementById('workMode');
    this.breakModeBtn = document.getElementById('breakMode');
    this.tomatoCounter = document.getElementById('tomato-counter');

    this.sounds = {
      start: document.getElementById("sound-start"),
      end: document.getElementById("sound-end"),
      click: document.getElementById("sound-click"),
      tomato: document.getElementById("sound-tomato"),
    };

    this.setupEventListeners();
    this.updateDisplay();
  }

  setupEventListeners() {
    this.startBtn.addEventListener('click', () => {
      this.start();
      this.playSound("start");
    });
    this.pauseBtn.addEventListener('click', () => {
      this.pause();
      this.playSound("click");
    });
    this.resetBtn.addEventListener('click', () => {
      this.reset();
      this.playSound("click");
    });
    this.soundToggle.addEventListener('click', () => this.toggleSound());
    this.workModeBtn.addEventListener('click', () => {
      this.setWorkMode();
      this.playSound("click");
    });
    this.breakModeBtn.addEventListener('click', () => {
      this.setBreakMode();
      this.playSound("click");
    });
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.startBtn.disabled = true;
      this.pauseBtn.disabled = false;

      this.interval = setInterval(() => {
        this.currentTime--;
        this.updateDisplay();
        if (this.currentTime <= 0) this.completeSession();
      }, 1000);
    }
  }

  pause() {
    this.isRunning = false;
    this.startBtn.disabled = false;
    this.pauseBtn.disabled = true;
    clearInterval(this.interval);
  }

  reset() {
    this.pause();
    this.currentTime = this.isWorkMode ? this.workTime : this.breakTime;
    this.updateDisplay();
  }

  setWorkMode() {
    this.pause();
    this.isWorkMode = true;
    this.currentTime = this.workTime;
    this.workModeBtn.classList.add('font-bold');
    this.breakModeBtn.classList.remove('font-bold');
    this.updateDisplay();
  }

  setBreakMode() {
    this.pause();
    this.isWorkMode = false;
    this.currentTime = this.breakTime;
    this.breakModeBtn.classList.add('font-bold');
    this.workModeBtn.classList.remove('font-bold');
    this.updateDisplay();
  }

  completeSession() {
    this.pause();

    if (this.isWorkMode) {
      this.completedPomodoros++;
      this.updateTomatoCounter();
      this.playSound("end");
      this.playSound("tomato");
      this.setBreakMode();
      this.showNotification("Tempo de trabalho completo! Hora de uma pausa!");
    } else {
      this.playSound("end");
      this.setWorkMode();
      this.showNotification("Pausa terminada! Hora de voltar ao trabalho!");
    }

    this.start();
  }

  updateDisplay() {
    const m = Math.floor(this.currentTime / 60);
    const s = this.currentTime % 60;
    this.timerDisplay.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    const total = this.isWorkMode ? this.workTime : this.breakTime;
    const progress = ((total - this.currentTime) / total) * 283;
    this.progressRing.style.strokeDashoffset = 283 - progress;
    this.progressRing.style.stroke = this.isWorkMode ? '#27ae60' : '#3498db';
  }

  updateTomatoCounter() {
    this.tomatoCounter.innerHTML = "";
    for (let i = 0; i < this.completedPomodoros; i++) {
      const img = document.createElement("img");
      img.src = "img/tomate.webp";
      img.alt = "Tomate";
      img.className = "w-8 h-8 bounce";
      this.tomatoCounter.appendChild(img);
      setTimeout(() => img.classList.remove("bounce"), 1000);
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    const icon = this.soundToggle.querySelector("i");
    if (this.soundEnabled) {
        icon.className = "fas fa-volume-up";
    } else {
        icon.className = "fas fa-volume-mute";
    }
  }

  playSound(name) {
    if (this.soundEnabled && this.sounds[name]) {
      this.sounds[name].currentTime = 0;
      this.sounds[name].play();
    }
  }

  showNotification(msg) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("🍅 Tomatempo", { body: msg });
  } else {
    const note = document.createElement("div");
    note.className = "pixel-note";

    const header = document.createElement("div");
    header.className = "pixel-note-header";

    const title = document.createElement("span");
    title.className = "title";
    title.textContent = "🍅 Tomatempo";

    const closeBtn = document.createElement("div");
    closeBtn.className = "close-btn";
    closeBtn.textContent = "X";
    closeBtn.onclick = () => note.remove();

    header.appendChild(title);
    header.appendChild(closeBtn);

    const body = document.createElement("div");
    body.textContent = msg;

    note.appendChild(header);
    note.appendChild(body);

    document.body.appendChild(note);

    setTimeout(() => note.remove(), 4000);
  }
}

}

document.addEventListener("DOMContentLoaded", () => {
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
  new PomodoroTimer();
});
