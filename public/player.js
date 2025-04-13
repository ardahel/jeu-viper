// player.js

const catIdle = new Image();
catIdle.src = './cat.png';

const catWalk1 = new Image();
catWalk1.src = './walker1.png';

const catWalk2 = new Image();
catWalk2.src = './walker2.png';

export const player = {
  x: 100,
  y: 100,
  width: 40,
  height: 40,
  velocityX: 0,
  velocityY: 0,
  speed: 3,
  jumpPower: -12,
  grounded: false,
  frame: 0,
  lastMoveTime: 0,
  color: 'red'
};

export const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false
};

export function updatePlayer(player, gravity, platforms, keys, canvasHeight) {
  player.velocityY += gravity;
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

  if (player.velocityX !== 0) {
    if (Date.now() - player.lastMoveTime > 100) {
      player.frame = (player.frame + 1) % 2;
      player.lastMoveTime = Date.now();
    }
  }
}

export function drawPlayer(ctx, player, name = '') {
  let sprite = catIdle;
  if (player.velocityX !== 0) {
    sprite = player.frame === 0 ? catWalk1 : catWalk2;
  }

  ctx.drawImage(sprite, player.x, player.y, player.width, player.height);

  if (name) {
    ctx.fillStyle = 'black';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(name, player.x + player.width / 2, player.y - 10);
  }
}
