import React, { useState, useRef, useEffect } from 'react';
import { sound } from '../utils/audio';
import { Sparkles, MessageCircle, Send, X, Volume2, VolumeX, Bot, Heart } from 'lucide-react';

const SUGGESTIONS = [
  'How did you get your lantern? 🏮',
  'Where are the 5 secret stars? ⭐',
  'What inventions do you build? ⚙️',
  'Tell me a bedtime secret! 🌙'
];

// Rich contextual rule-based dialogue engine
const getRuleBasedResponse = (userInput) => {
  const q = userInput.toLowerCase();

  if (q.includes('lantern') || q.includes('glow') || q.includes('light')) {
    return "My lantern was lying beside me when I first woke up on my little cloud! ✨ It stays quiet during busy daytime hours, but whenever someone’s forgotten wish wanders into the breeze, it hums with warm golden light.";
  }
  if (q.includes('star') || q.includes('hidden') || q.includes('easter') || q.includes('secret') || q.includes('constellation')) {
    return "Ooh! There are five Forgotten Stars scattered around my dream world! Look closely near the Home lantern, the velvet shelves of the Library, my workbench in the Workshop, the glowing lotus in the Garden, and high in Chapter 4's starry sky! ⭐";
  }
  if (q.includes('invention') || q.includes('workshop') || q.includes('clock') || q.includes('build')) {
    return "In my Clockwork Castle, I build things out of dreams! Like mechanical hummingbirds with wound-up wings, sea jars that hold ocean tides, and music boxes that help quiet heavy thoughts. Have you visited the Workshop yet? ⚙️";
  }
  if (q.includes('garden') || q.includes('wish') || q.includes('plant') || q.includes('lotus')) {
    return "The Dream Garden is my favorite sanctuary! When you plant a wish there, starlight rain waters it, and it blooms into a glowing lotus that rises up to warm the night sky. 🌸";
  }
  if (q.includes('who are you') || q.includes('name') || q.includes('yuvvi') || q.includes('ghost')) {
    return "I’m Yuvvi! A tiny friendly cloud ghost who was born when a fallen shooting star brushed against an abandoned daydream. Now I collect forgotten hopes and make sure they find their way to the stars. ✨";
  }
  if (q.includes('sad') || q.includes('tired') || q.includes('heavy') || q.includes('lonely') || q.includes('scared')) {
    return "It’s okay to feel sleepy or heavy sometimes. Even the brightest stars hide behind clouds before they shine again. Rest your thoughts right here — my little cloud is plenty soft enough to share. 🤍";
  }
  if (q.includes('bedtime') || q.includes('secret') || q.includes('sleep') || q.includes('night')) {
    return "Here’s a secret only night wanderers know: when you close your eyes and whisper a wish into your pillow, a tiny spark floats out your window. That’s how the constellations stay lit! 🌙";
  }
  if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    return "Hello there, dreamer! Did you bring a gentle daydream with you today? I'm so happy you floated into my corner of the sky! ✨";
  }

  return "Ooh, that feels like a dream worth remembering! In my world, every curious thought is like a seed waiting for a little starlight. Tell me more, or ask me about my lantern and inventions! 🎈";
};

export const YuvviChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'yuvvi',
      text: "Hullo! I'm Yuvvi. I collect sleepy wishes and build magical things. What wonder are you thinking of today? ✨"
    }
  ]);
  const [input, setInput] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend = input) => {
    const text = textToSend.trim();
    if (!text || isTyping) return;

    if (soundEnabled) sound.playChime(587.33, 'sine', 0.25);

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Realistic typing delay
    setTimeout(() => {
      const reply = getRuleBasedResponse(text);
      if (soundEnabled) sound.playChime(659.25, 'sine', 0.45);

      setMessages((prev) => [
        ...prev,
        {
          id: `yuvvi-${Date.now()}`,
          sender: 'yuvvi',
          text: reply
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => {
            sound.playLanternGlow();
            setIsOpen(true);
          }}
          className="yuvvi-chat-trigger"
          aria-label="Open chat with Yuvvi"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 870,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.65rem 1.25rem',
            borderRadius: '999px',
            backgroundColor: 'var(--color-bg-base)',
            border: '1.5px solid var(--color-gold)',
            color: 'var(--color-gold)',
            fontFamily: 'var(--font-rounded)',
            fontWeight: 700,
            fontSize: '0.9rem',
            boxShadow: '0 8px 30px rgba(255, 217, 133, 0.35)',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <span style={{ fontSize: '1.25rem' }}>🏮</span>
          <span>Chat with Yuvvi</span>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div
          className="yuvvi-chat-window"
          role="dialog"
          aria-label="Chat with Yuvvi"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: 'min(92vw, 380px)',
            height: '520px',
            backgroundColor: 'var(--color-bg-base)',
            border: '1.5px solid var(--color-indigo-border)',
            borderRadius: '24px',
            boxShadow: 'var(--shadow-lg), 0 0 40px rgba(109, 85, 168, 0.35)',
            zIndex: 890,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'riseIntoSky 0.3s ease-out'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1rem 1.2rem',
              backgroundColor: 'var(--color-card-bg)',
              borderBottom: '1px solid var(--color-card-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#15152D',
                  border: '1.5px solid var(--color-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 10px rgba(255, 217, 133, 0.4)'
                }}
              >
                <span style={{ fontSize: '1rem' }}>👻</span>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-main)', fontFamily: 'var(--font-rounded)' }}>
                  Yuvvi
                </h4>
                <span style={{ fontSize: '0.74rem', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4ADE80' }} />
                  Floating & Listening
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
                aria-label={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
                style={{
                  background: 'none',
                  border: 'none',
                  color: soundEnabled ? 'var(--color-moon-blue)' : 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close Chat"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div
            style={{
              flex: 1,
              padding: '1rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}
          >
            {messages.map((msg) => {
              const isYuvvi = msg.sender === 'yuvvi';
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: isYuvvi ? 'flex-start' : 'flex-end',
                    gap: '8px'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '82%',
                      padding: '0.75rem 1rem',
                      borderRadius: isYuvvi ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                      backgroundColor: isYuvvi ? 'var(--color-card-bg)' : 'var(--color-purple)',
                      border: isYuvvi ? '1px solid var(--color-indigo-border)' : 'none',
                      color: isYuvvi ? 'var(--color-text-main)' : '#FFFFFF',
                      fontSize: '0.88rem',
                      lineHeight: 1.5,
                      fontFamily: isYuvvi ? 'var(--font-rounded)' : 'var(--font-sans)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div style={{ display: 'flex', gap: '6px', padding: '6px 12px' }}>
                <span className="animate-twinkle" style={{ color: 'var(--color-gold)' }}>✨</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                  Yuvvi is thinking...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div
            style={{
              padding: '0.4rem 0.8rem',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              borderTop: '1px solid var(--color-card-border)',
              backgroundColor: 'rgba(21, 21, 45, 0.4)'
            }}
          >
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSend(suggestion)}
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '0.74rem',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--color-card-bg)',
                  border: '1px solid var(--color-card-border)',
                  color: 'var(--color-text-sub)',
                  cursor: 'pointer'
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div
            style={{
              padding: '0.8rem 1rem',
              backgroundColor: 'var(--color-card-bg)',
              borderTop: '1px solid var(--color-card-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <input
              type="text"
              placeholder="Ask Yuvvi about dreams or stars..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                padding: '0.65rem 0.95rem',
                borderRadius: '999px',
                backgroundColor: 'rgba(12, 12, 26, 0.85)',
                border: '1px solid var(--color-indigo-border)',
                color: 'var(--color-text-main)',
                fontSize: '0.88rem'
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              aria-label="Send Message"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: input.trim() ? 'var(--color-gold)' : 'rgba(182, 164, 255, 0.2)',
                color: '#15152D',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() ? 'pointer' : 'default',
                transition: 'all 0.2s ease'
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
