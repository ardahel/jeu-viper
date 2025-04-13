// server.js
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './db.js';
import setupSignupRoute from './signup/signup.js';
import setupLoginRoute from './login/login.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://jeu-viper.onrender.com',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
});

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://jeu-viper.onrender.com',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

app.use(express.json());
await connectDB();

setupSignupRoute(app);
setupLoginRoute(app);
app.use(express.static('public'));

const players = {};

io.on('connection', (socket) => {
  console.log(`🟢 Player connected: ${socket.id}`);

  socket.on('register', (data) => {
    const username = typeof data.username === 'string' && data.username.trim() !== '' ? data.username : `guest_${Math.floor(Math.random() * 1000)}`;
    players[socket.id] = {
      username,
      x: 100,
      y: 100,
      velocityX: 0,
      velocityY: 0,
      grounded: false,
      keys: {}
    };
    io.emit('playersUpdate', players);
  });

  socket.on('keyInput', (keys) => {
    if (players[socket.id]) {
      players[socket.id].keys = keys;
    }
  });

  socket.on('move', (pos) => {
    const player = players[socket.id];
    if (player) {
      const speed = 3;
      const jumpPower = -12;
      const gravity = 0.4;

      player.velocityY += gravity;
      player.grounded = false;

      // simulate movement server-side
      if (player.keys?.ArrowLeft) player.velocityX = -speed;
      else if (player.keys?.ArrowRight) player.velocityX = speed;
      else player.velocityX = 0;

      player.x += player.velocityX;
      player.y += player.velocityY;

      if (player.keys?.ArrowUp && player.grounded) {
        player.velocityY = jumpPower;
        player.grounded = false;
      }

      player.x = pos.x;
      player.y = pos.y;
      io.emit('playersUpdate', players);
    }
  });

  socket.on('chatMessage', (msg) => {
    const username = players[socket.id]?.username || '???';
    io.emit('chatMessage', { username, message: msg });
  });

  socket.on('disconnect', () => {
    console.log(`🔴 Player disconnected: ${socket.id}`);
    delete players[socket.id];
    io.emit('playersUpdate', players);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Serveur Web + Socket lancé sur : http://localhost:${PORT}`);
});
