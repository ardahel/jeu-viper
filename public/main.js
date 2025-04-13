// main.js
import { player, keys, updatePlayer, drawPlayer } from './player.js';
import { bgImage, platforms, gravity } from './map.js';
import { setupKeyboard } from './game.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let socket;
let otherPlayers = {};
let myId = null;

function update() {
  updatePlayer(player, gravity, platforms, keys, canvas.height);

  socket.emit('move', {
    x: player.x,
    y: player.y,
    username: getUsername()
  });
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
  }

  drawPlayer(ctx, player, getUsername());
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

function initSocket() {
  socket = io();

  socket.on('connect', () => {
    myId = socket.id;
    socket.emit('register', { username: getUsername() });
  });

  socket.on('playersUpdate', (players) => {
    otherPlayers = {};
    for (const [id, p] of Object.entries(players)) {
      if (id !== myId) {
        otherPlayers[id] = p;
      }
    }
  });
}

setupKeyboard(keys);
bgImage.onload = () => {
  initSocket();
  loop();
};
