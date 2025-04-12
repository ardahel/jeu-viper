import { player, keys, updatePlayer, drawPlayer } from './player.js';
import { bgImage, platforms, gravity } from './map.js';
import { setupKeyboard } from './game.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function update() {
  updatePlayer(player, gravity, platforms, keys, canvas.height);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (bgImage.complete) {
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  }
  drawPlayer(ctx, player, currentUsername);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

setupKeyboard(keys);
bgImage.onload = () => loop();
