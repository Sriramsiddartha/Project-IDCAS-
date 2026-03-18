import React, { useState, useEffect, useRef } from 'react';
import './LLMChat.css';

const LLMChat = ({ sessionId, onClose }) => {
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Hello! I am your IDCAS Data Expert. How can I help you with your cleaning pipeline today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const resp = await fetch(`http://localhost:8000/ask_llm`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    query: input,
                    session_id: sessionId 
                })
            });
            const data = await resp.json();
            setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="llm-chat-drawer">
            <div className="chat-header">
                <h3>AI Data Assistant</h3>
                <button className="chat-close-btn" onClick={onClose} title="Close Chat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>

            <div className="chat-messages">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.role === 'user' ? 'message-user' : 'message-ai'}`}>
                        {msg.content}
                    </div>
                ))}
                {isTyping && <div className="ai-typing">AI is thinking...</div>}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
                <input
                    className="chat-input"
                    placeholder="Ask about your data..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                />
                <button className="chat-send-btn" onClick={handleSend} disabled={isTyping}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </div>
        </div>
    );
};

export default LLMChat;
