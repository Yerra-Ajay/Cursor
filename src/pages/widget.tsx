import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { NextPage } from 'next';

type Message = { role: 'user' | 'assistant'; content: string };

const Widget: NextPage = () => {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: 'Hi! I\'m here to help with orders, shipping, returns, and more.'
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const params = useMemo(() => {
    if (typeof window === 'undefined') return new URLSearchParams('');
    return new URLSearchParams(window.location.search);
  }, []);
  const siteName = params.get('siteName') || 'Support';
  const brandColor = params.get('brandColor') || '#2563eb';
  const faqUrl = params.get('faqUrl') || '';
  const logoUrl = params.get('logoUrl') || '/logo.svg';

  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages.length]);

  const send = useCallback(async () => {
    if (!input.trim()) return;
    const newUserMsg: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, newUserMsg], siteName, faqUrl })
      });
      const data = await res.json();
      const assistantMsg: Message = { role: 'assistant', content: (data.reply ?? 'Sorry, I could not generate a response.') };
      setMessages(prev => [...prev, assistantMsg]);
      if (data.escalate) {
        window.top?.location.assign('/support/ticket');
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, siteName, faqUrl]);

  return (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui, Arial', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: brandColor, color: '#fff', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src={logoUrl} alt="logo" style={{ width: 20, height: 20, borderRadius: 4, background: '#fff' }} />
        <div style={{ fontWeight: 700 }}>{siteName} — Chat Support</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 12, background: '#f8fafc' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 8, flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: m.role === 'user' ? brandColor : '#e5e7eb', color: m.role === 'user' ? '#fff' : '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
              {m.role === 'user' ? 'You' : 'AI'}
            </div>
            <div style={{ background: m.role === 'user' ? brandColor : '#fff', color: m.role === 'user' ? '#fff' : '#111827', padding: '8px 12px', borderRadius: 12, maxWidth: '75%', boxShadow: m.role === 'assistant' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none' }}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#e5e7eb', color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>AI</div>
            <div style={{ background: '#fff', color: '#111827', padding: '8px 12px', borderRadius: 12, maxWidth: '75%', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}>
              <span style={{ opacity: 0.8 }}>Typing</span>
              <span style={{ animation: 'blink 1.2s infinite' }}>...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: 'flex', gap: 8, padding: 12, borderTop: '1px solid #e5e7eb' }}>
        <input
          placeholder="Ask a question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') send(); }}
          style={{ flex: 1, padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }}
        />
        <button onClick={send} disabled={isLoading} style={{ background: brandColor, color: '#fff', padding: '10px 14px', borderRadius: 8, border: 'none' }}>
          {isLoading ? 'Sending…' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default Widget;


