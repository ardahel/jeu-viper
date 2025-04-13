// main.js
import { player, keys, updatePlayer, drawPlayer } from './player.js';
import { bgImage, platforms, gravity } from './map.js';
import { setupKeyboard } from './game.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let socket;
let otherPlayers = {};
let currentUsername = '';

function update() {
  updatePlayer(player, gravity, platforms, keys, canvas.height);

  if (socket) {
    socket.emit('move', {
      x: player.x,
      y: player.y,
      username: currentUsername
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (bgImage.complete) {
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  }

  for (const p of Object.values(otherPlayers)) {
    ctx.fillStyle = 'blue';
    ctx.fillRect(p.x, p.y, player.width, player.height);
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.fillText(p.username, p.x, p.y - 5);
  }

  drawPlayer(ctx, player, currentUsername);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

function initSocket() {
  socket = io();

  socket.emit('register', { username: currentUsername });

  socket.on('playersUpdate', (players) => {
    otherPlayers = {};
    for (const [id, p] of Object.entries(players)) {
      if (p.username !== currentUsername) {
        otherPlayers[id] = p;
      }
    }
  });

  socket.on('chatMessage', ({ username, message }) => {
    const log = document.getElementById('chatLog');
    const msg = document.createElement('div');
    msg.textContent = `${username}: ${message}`;
    log.appendChild(msg);
    log.scrollTop = log.scrollHeight;
  });

  const input = document.getElementById('chatInput');
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim() !== '') {
      const msg = input.value.trim();
      socket.emit('chatMessage', {
        username: currentUsername,
        message: msg
      });
      input.value = '';
    }
  });
}

setupKeyboard(keys);

// Déplacement dans bgImage.onload APRES connexion
function startGameAfterLogin() {
  bgImage.onload = () => {
    initSocket();
    loop();
  };
  if (bgImage.complete) {
    initSocket();
    loop();
  }
}

// Login/signup handlers
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('loginUser').value;
  const password = document.getElementById('loginPass').value;

  const res = await fetch('https://jeu-viper.onrender.com/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (res.ok) {
    currentUsername = data.username;
    document.getElementById('authContainer').style.display = 'none';
    startGameAfterLogin();
  } else {
    alert(data.message);
  }
});

document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('signupUser').value;
  const password = document.getElementById('signupPass').value;

  const res = await fetch('https://jeu-viper.onrender.com/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (res.ok) {
    alert('Compte créé, connecte-toi maintenant');
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'inline';
  } else {
    alert(data.message);
  }
});

document.getElementById('showSignup').onclick = () => {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('signupForm').style.display = 'inline';
};

document.getElementById('showLogin').onclick = () => {
  document.getElementById('signupForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'inline';
};
