// player.js

export const player = {
  x: 100,
  y: 100,
  width: 40,
  height: 40,
  velocityX: 0,
  velocityY: 0,
  speed: 2.5,
  jumpPower: -12,
  grounded: false,
  color: 'red'
};

export const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false
};

export function updatePlayer(player, gravity, platforms, keys, canvasHeight) {
  // ⬇️ ralentit la chute
  player.velocityY += gravity * 0.6;
  player.grounded = false;

  player.x += player.velocityX;
  player.y += player.velocityY;

  for (let plat of platforms) {
    if (
      player.x < plat.x + plat.width &&
      player.x + player.width > plat.x &&
      player.y + player.height > plat.y &&
      player.y + player.height <= plat.y + player.velocityY + gravity * 2
    ) {
      player.y = plat.y - player.height;
      player.velocityY = 0;
      player.grounded = true;
    }
  }

  if (keys.ArrowLeft) player.velocityX = -player.speed;
  else if (keys.ArrowRight) player.velocityX = player.speed;
  else player.velocityX = 0;

  if (keys.ArrowUp && player.grounded) {
    player.velocityY = player.jumpPower;
    player.grounded = false;
  }

  if (player.y > canvasHeight) {
    player.y = 0;
    player.velocityY = 0;
  }
}

export function drawPlayer(ctx, player, name = '') {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  if (name) {
    ctx.fillStyle = 'black';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(name, player.x + player.width / 2, player.y - 10);
  }
}
