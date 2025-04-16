export class ChatSystem {
    constructor(game) {
        this.game = game;
        this.chatContainer = document.getElementById('chatContainer');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.chatInput.value.trim()) {
                this.sendMessage(this.chatInput.value.trim());
                this.chatInput.value = '';
            } else if (e.key === 'Escape') {
                this.chatInput.blur();
            }
        });

        // Raccourci clavier pour ouvrir le chat
        document.addEventListener('keydown', (e) => {
            if (e.code === 'KeyT') {
                this.chatInput.focus();
            }
        });

        this.game.network.onChatMessage(this.handleMessage.bind(this));
    }

    sendMessage(text) {
        this.game.network.sendChatMessage({
            username: this.game.state.getCurrentPlayer().username,
            text: text
        });
    }

    handleMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.textContent = `${message.username}: ${message.text}`;
        this.chatMessages.appendChild(messageElement);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    show() {
        this.chatContainer.style.display = 'block';
    }

    hide() {
        this.chatContainer.style.display = 'none';
    }

    position() {
        this.chatContainer.style.right = '20px';
        this.chatContainer.style.top = '50%';
        this.chatContainer.style.transform = 'translateY(-50%)';
    }
} 