import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

const API_URL = import.meta.env.PROD ? import.meta.env.VITE_API_URL : 'http://localhost:5000';

const Chat = ({ currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const response = await fetch(`${API_URL}/api/chat/messages`);
            if (!response.ok) throw new Error('Erreur lors de la récupération des messages');
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des messages:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const response = await fetch(`${API_URL}/api/chat/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: newMessage,
                    userId: currentUser.id,
                    username: currentUser.username,
                    timestamp: new Date().toISOString()
                }),
            });

            if (!response.ok) throw new Error('Erreur lors de l\'envoi du message');
            
            setNewMessage('');
            fetchMessages();
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
        }
    };

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h3>Chat</h3>
            </div>
            
            <div className="messages-container">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`message ${message.userId === currentUser.id ? 'own-message' : ''}`}
                    >
                        <div className="message-header">
                            <span className="username">{message.username}</span>
                            <span className="timestamp">{formatTimestamp(message.timestamp)}</span>
                        </div>
                        <div className="message-content">{message.content}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form className="message-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
                />
                <button type="submit">Envoyer</button>
            </form>
        </div>
    );
};

export default Chat; 