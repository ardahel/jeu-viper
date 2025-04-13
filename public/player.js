// player.js

const idleImage = new Image();
idleImage.src = './cat.png';

const walk1Image = new Image();
walk1Image.src = './walker1.png';

const walk2Image = new Image();
walk2Image.src = './walker2.png';

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
  sprite: idleImage,
  spriteFrame: 0,
  frameCooldown: 0,
};

export const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
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

  if (keys.ArrowLeft) {
    player.velocityX = -player.speed;
    handleWalkAnim(player);
  } else if (keys.ArrowRight) {
    player.velocityX = player.speed;
    handleWalkAnim(player);
  } else {
    player.velocityX = 0;
    player.sprite = idleImage;
  }

  if (keys.ArrowUp && player.grounded) {
    player.velocityY = player.jumpPower;
    player.grounded = false;
  }

  if (player.y > canvasHeight) {
    player.y = 0;
    player.velocityY = 0;
  }
}

function handleWalkAnim(player) {
  if (player.frameCooldown <= 0) {
    player.spriteFrame = (player.spriteFrame + 1) % 2;
    player.sprite = player.spriteFrame === 0 ? walk1Image : walk2Image;
    player.frameCooldown = 8;
  } else {
    player.frameCooldown--;
  }
}

export function drawPlayer(ctx, player, name = '') {
  ctx.drawImage(player.sprite, player.x, player.y, player.width, player.height);

  if (name) {
    ctx.fillStyle = 'black';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(name, player.x + player.width / 2, player.y - 5);
  }
}
