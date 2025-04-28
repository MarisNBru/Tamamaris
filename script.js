let hunger = 0;
let happiness = 100;
let isSleeping = false;
let isWakingUp = false;

// 🛠 TESTMODUS EINSTELLEN
const useTestHour = false;  // true = Testmodus aktiv, false = normale Zeit
const testHour = 9;      // Simuliere: 9:06 Uhr morgens

const feedSound = new Audio('feed.mp3');
const hugSound = new Audio('hug.mp3');
const sleepSound = new Audio('sleep.mp3');
let sleepTimerInterval;

function saveState() {
  const state = {
    hunger: hunger,
    happiness: happiness,
    isSleeping: isSleeping,
    isWakingUp: isWakingUp,
    lastTime: new Date().getTime()
  };
  localStorage.setItem('tamagotchiState', JSON.stringify(state));
}

function loadState() {
  const stateString = localStorage.getItem('tamagotchiState');
  if (stateString) {
    const state = JSON.parse(stateString);
    const now = new Date().getTime();
    const minutesGone = Math.floor((now - state.lastTime) / 60000);

    hunger = Math.min(100, state.hunger + minutesGone * 0.5);
    happiness = Math.max(0, state.happiness - minutesGone * 0.5);
    isSleeping = state.isSleeping || false;
    isWakingUp = state.isWakingUp || false;
  }
}

function showMessage(text) {
  const messageArea = document.getElementById('messageArea');
  messageArea.innerText = text;
  messageArea.style.opacity = 1;
}

function randomMessage(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function feed() {
  if (isSleeping) {
    showMessage("I'm dreaming about you... 😴");
    return;
  }
  hunger = Math.max(0, hunger - 10);
  happiness = Math.min(100, happiness + 5);
  feedSound.play();
  showMessage(randomMessage([
    "Yummy, thank's! 🍔",
    "Mjam mjam, tasty! 😋",
    "God damn that's good! 🍕",
    "Mhhhmm... 🥪"
  ]));
  update();
  saveState();
}

function hug() {
  if (isSleeping) {
    showMessage("Besitos... 😚🌙✨");
    return;
  }
  happiness = Math.min(100, happiness + 10);
  hugSound.play();
  showMessage(randomMessage([
    "I miss you! 🤗",
    "CUUUUUUUUUDDDLEE! ❤️",
    "I feel so comfy! 🥰",
    "Cuddling is the best thing! 🧸"
  ]));
  update();
  saveState();
}

function sleep() {
  hunger = Math.min(100, hunger + 3);
  happiness = Math.min(100, happiness + 20);
  sleepSound.play();
  isSleeping = true;
  isWakingUp = false;

  update();
  saveState();

  const realHour = new Date().getHours();
  const hour = useTestHour ? testHour : realHour;

  let sleepDuration;
  if (hour >= 22 || hour < 6) {
    const now = new Date();
    const wakeupTime = new Date();
    wakeupTime.setHours(9, 0, 0, 0);
    sleepDuration = wakeupTime.getTime() - now.getTime();
    if (sleepDuration < 0) {
      sleepDuration += 24 * 60 * 60 * 1000;
    }
  } else {
    sleepDuration = 10 * 60 * 1000;
  }

  let remainingTime = sleepDuration;
  const sleepButton = document.getElementById('sleepButton');

  clearInterval(sleepTimerInterval);
  sleepTimerInterval = setInterval(() => {
    remainingTime -= 1000;
    if (remainingTime <= 0) {
      clearInterval(sleepTimerInterval);
      isSleeping = false;
      sleepButton.innerText = "Sleep 😴";
      showMessage("I'm awake again! ☀️");
      update();
      saveState();
    } else {
      const minutes = Math.floor(remainingTime / 60000);
      const seconds = Math.floor((remainingTime % 60000) / 1000);
      sleepButton.innerText = `Wake up in ${minutes}m ${seconds}s`;
    }
  }, 1000);
}

function forceSleepAtNight() {
  isSleeping = true;
  isWakingUp = false;
  hunger = Math.min(100, hunger + 3);
  happiness = Math.min(100, happiness + 20);
  sleepSound.play();
  showMessage("It's late, I'm going to sleep now... 🌙😴");
  update();
  saveState();
}

function checkWakeUp() {
  const realHour = new Date().getHours();
  const hour = useTestHour ? testHour : realHour;

  if (isSleeping && hour >= 9 && hour < 10) {
    isSleeping = false;
    isWakingUp = true;
    showMessage("Good Morning! ☀️");
    update();
    saveState();
  } else if (isWakingUp && hour >= 10 && hour < 22) {
    isWakingUp = false;
    update();
    saveState();
  }
}

function update() {
  document.getElementById('hunger').innerText = Math.floor(hunger);
  document.getElementById('happiness').innerText = Math.floor(happiness);

  const tamagotchi = document.getElementById('tamagotchi');
  if (isSleeping) {
    tamagotchi.src = 'sleep.png';
  } else if (isWakingUp) {
    tamagotchi.src = 'wakeup.png';
  } else {
    if (happiness > 70) {
      tamagotchi.src = 'happy.png';
    } else if (happiness > 40) {
      tamagotchi.src = 'neutral.png';
    } else {
      tamagotchi.src = 'sad.png';
    }
  }
}

function setDayOrNight() {
  const realHour = new Date().getHours();
  const hour = useTestHour ? testHour : realHour;
  const body = document.body;
  if (hour >= 6 && hour < 22) {
    body.classList.remove('night');
    body.classList.add('day');
  } else {
    body.classList.remove('day');
    body.classList.add('night');
  }
}

window.onload = function() {
  loadState();
  
  const realHour = new Date().getHours();
  const hour = useTestHour ? testHour : realHour;

  setDayOrNight();

  if ((hour >= 22 || hour < 9) && !isSleeping) {
    forceSleepAtNight();
  }

  checkWakeUp();
  update();

  // NEU: Direkt beim Start passende Nachricht anzeigen
  if (isSleeping) {
    showMessage("I'm dreaming about you... 😴");
  } else if (isWakingUp) {
    showMessage("Good Morning sweetie! ☀️");
  } else {
    showMessage("Hope you have a great Day! 🧸");
  }
};



setInterval(() => {
  hunger = Math.min(100, hunger + 0.5);
  happiness = Math.max(0, happiness - 0.5);
  checkWakeUp();
  update();
  saveState();
}, 10000);

window.addEventListener('beforeunload', saveState);
