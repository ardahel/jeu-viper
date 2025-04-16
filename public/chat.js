export function setupChat(socket, currentUsername, chatBubbles) {
  let lastMessageTime = 0;
  let messageTimestamps = [];
  let isMuted = false;
  let muteExpires = 0;
  let warnings = 0;

  socket.on('chatMessage', ({ username, message, id }) => {
    const log = document.getElementById('chat-messages');
    if (log) {
      const msg = document.createElement('div');
      msg.textContent = `${username}: ${message}`;
      log.appendChild(msg);
      log.scrollTop = log.scrollHeight;
    }

    if (id && chatBubbles) {
      chatBubbles[id] = { text: message, timer: Date.now() };
      setTimeout(() => delete chatBubbles[id], 3000);
    }
  });

  const input = document.getElementById('chat-input');
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim() !== '') {
        const now = Date.now();

        // Si mute
        if (isMuted) {
          if (now < muteExpires) {
            showWarning("Tu es temporairement mute pour spam (30 min).", true);
            return;
          } else {
            isMuted = false;
            warnings = 0;
            messageTimestamps = [];
          }
        }

        // Cooldown de 2 secondes
        if (now - lastMessageTime < 2000) {
          showWarning("Patiente un peu avant d’envoyer un autre message.");
          return;
        }

        
        messageTimestamps.push(now);
        messageTimestamps = messageTimestamps.filter(t => now - t < 10000);

        if (messageTimestamps.length >= 5) {
          warnings++;
          if (warnings >= 1) {
            isMuted = true;
            muteExpires = now + 30 * 60 * 1000; // 30 min
            showWarning("Tu as été mute pour spam (30 minutes).", true);
            return;
          }
        }

        lastMessageTime = now;
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

  function showWarning(text, isMute = false) {
    const log = document.getElementById('chat-messages');
    if (log) {
      const msg = document.createElement('div');
      msg.textContent = text;
      msg.style.color = 'red';
      msg.style.fontWeight = 'bold';
      if (isMute) msg.style.background = '#ffd6d6';
      log.appendChild(msg);
      log.scrollTop = log.scrollHeight;
    }
  }
}
