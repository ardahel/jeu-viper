// main.js
import { player, keys, updatePlayer, drawPlayer } from './player.js';
import { bgImage, platforms, gravity } from './map.js';
import { setupKeyboard } from './game.js';
import { handleLogin, handleSignup, showSignupForm, showLoginForm } from './auth.js';
import { setupChat } from './chat.js';
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let socket;
let otherPlayers = {};
let currentUsername = '';
const chatBubbles = {}; // ID -> { text, timer }

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
  for (const [id, p] of Object.entries(otherPlayers)) {
    ctx.fillStyle = 'blue';
    ctx.fillRect(p.x, p.y, player.width, player.height);
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.fillText(p.username, p.x, p.y - 5);
    if (chatBubbles[id]) {
      drawBubble(p.x, p.y - 35, chatBubbles[id].text);
    }
  }
  drawPlayer(ctx, player, currentUsername, keys.ArrowLeft || keys.ArrowRight);
}

function drawBubble(x, y, text) {
  ctx.font = '12px Arial';
  const padding = 6;
  const maxWidth = 120;
  const metrics = ctx.measureText(text);
  const width = Math.min(metrics.width, maxWidth) + padding * 2;
  const height = 24;
  ctx.fillStyle = 'white';
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x + player.width / 2 - width / 2, y, width, height, 6);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = 'black';
  ctx.fillText(text, x + player.width / 2 - width / 2 + padding, y + 16);
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

  socket.on('chatMessage', ({ username, message, id }) => {
    const log = document.getElementById('chat-messages');
    if (log) {
      const msg = document.createElement('div');
      msg.textContent = `${username}: ${message}`;
      log.appendChild(msg);
      log.scrollTop = log.scrollHeight;
    }
    if (id) {
      chatBubbles[id] = { text: message, timer: Date.now() };
      setTimeout(() => delete chatBubbles[id], 3000);
    }
  });

  // Call setupChat after socket is initialized and pass chatBubbles
  setupChat(socket, currentUsername, chatBubbles);

  const input = document.getElementById('chat-input');
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim() !== '') {
        const message = input.value.trim();
        socket.emit('chatMessage', {
          username: currentUsername,
          message,
          id: socket.id
        });
        input.value = '';
      }
    });
  }
}

function startGameAfterLogin() {
  document.getElementById('authContainer').style.display = 'none';
  canvas.style.display = 'block';
  initSocket();
  loop();
}

setupKeyboard(keys);
bgImage.onload = () => loop();

// --- Authentication Event Listeners ---
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('loginUser').value;
  const password = document.getElementById('loginPass').value;

  const res = await handleLogin(username, password);
  const data = await res.json();

  if (res.ok) {
    currentUsername = data.username;
    startGameAfterLogin();
  } else {
    alert(data.message);
  }
});

document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('signupUser').value;
  const password = document.getElementById('signupPass').value;

  const res = await handleSignup(username, password);
  const data = await res.json();

  if (res.ok) {
    alert('Compte créé, connecte-toi maintenant');
    showLoginForm();
  } else {
    alert(data.message);
  }
});

document.getElementById('showSignup')?.addEventListener('click', (e) => {
  e.preventDefault();
  showSignupForm();
});

document.getElementById('showLogin')?.addEventListener('click', (e) => {
  e.preventDefault();
  showLoginForm();
});
