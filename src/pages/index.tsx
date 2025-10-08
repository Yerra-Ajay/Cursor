import React, { useMemo, useState } from 'react';

type Message = { role: 'user' | 'assistant'; content: string };

export default function Home() {
  const [siteName, setSiteName] = useState('TechStore Pro');
  const [brandColor, setBrandColor] = useState('#2563eb');
  const [faqUrl, setFaqUrl] = useState('/sample-faq.md');
  const [logoUrl, setLogoUrl] = useState('');
  const [tickets, setTickets] = useState<Array<{ id: string; subject: string; createdAt: number; status: string }>>([]);
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm here to help with orders, shipping, returns, and more. What can I assist you with today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const script = useMemo(() => {
    const params = [
      `data-site-name="${siteName}"`,
      `data-brand-color="${brandColor}"`,
      faqUrl ? `data-faq-url="${faqUrl}"` : '',
      logoUrl ? `data-logo-url="${logoUrl}"` : ''
    ].filter(Boolean).join('\n  ');

    return `<script\n  src="${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/widget.js"\n  ${params}\n  defer\n></script>`;
  }, [siteName, brandColor, faqUrl, logoUrl]);

  React.useEffect(() => {
    let active = true;
    async function fetchTickets() {
      try {
        const res = await fetch('/api/tickets');
        const data = await res.json();
        if (active && data && Array.isArray(data.tickets)) {
          setTickets(data.tickets);
        }
      } catch {}
    }
    fetchTickets();
    const id = setInterval(fetchTickets, 5000);
    return () => { active = false; clearInterval(id); };
  }, []);

  async function sendMessage() {
    const text = input.trim();
    if (!text) return;
    const newUser: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, newUser]);
    setInput('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, newUser], siteName, faqUrl })
      });
      const data = await res.json();
      const reply = (data && data.reply) ? String(data.reply) : 'Sorry, I could not generate a response.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      if (data.escalate) {
        window.location.assign('/support/ticket');
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui, Arial', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '16px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/logo.svg" alt="TechStore Pro" style={{ width: 32, height: 32 }} />
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#111827' }}>TechStore Pro</h1>
          </div>
          <nav style={{ display: 'flex', gap: 24 }}>
            <a href="#" style={{ color: '#6b7280', textDecoration: 'none' }}>Help Center</a>
            <a href="#" style={{ color: '#6b7280', textDecoration: 'none' }}>Contact Us</a>
            <a href="#" style={{ color: '#6b7280', textDecoration: 'none' }}>Track Order</a>
          </nav>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Hero Section */}
        <section style={{ padding: '60px 0', textAlign: 'center' }}>
          <h2 style={{ fontSize: 48, fontWeight: 700, color: '#111827', marginBottom: 16 }}>
            How can we help you today?
          </h2>
          <p style={{ fontSize: 20, color: '#6b7280', marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
            Get instant answers to your questions with our AI-powered support assistant
          </p>
          
          {/* Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, maxWidth: 800, margin: '0 auto' }}>
            <a href="/support/track" style={{ padding: '16px 24px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'inherit' }}>
              <span style={{ fontSize: 24 }}>📦</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 600 }}>Track Order</div>
                <div style={{ fontSize: 14, color: '#6b7280' }}>Check shipping status</div>
              </div>
            </a>
            <a href="/support/returns" style={{ padding: '16px 24px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'inherit' }}>
              <span style={{ fontSize: 24 }}>↩️</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 600 }}>Returns</div>
                <div style={{ fontSize: 14, color: '#6b7280' }}>Start a return</div>
              </div>
            </a>
            <a href="/support/billing" style={{ padding: '16px 24px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'inherit' }}>
              <span style={{ fontSize: 24 }}>💳</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 600 }}>Billing</div>
                <div style={{ fontSize: 14, color: '#6b7280' }}>Payment issues</div>
              </div>
            </a>
            <a href="/support/general" style={{ padding: '16px 24px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'inherit' }}>
              <span style={{ fontSize: 24 }}>❓</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 600 }}>General</div>
                <div style={{ fontSize: 14, color: '#6b7280' }}>Other questions</div>
              </div>
            </a>
          </div>
        </section>

        {/* Live Chat Section */}
        <section style={{ background: '#fff', borderRadius: 16, padding: 40, marginBottom: 40, border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ width: 48, height: 48, background: brandColor, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20 }}>
              🤖
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: '#111827' }}>Chat with our AI Assistant</h3>
              <p style={{ margin: 0, color: '#6b7280' }}>Get instant help 24/7</p>
            </div>
          </div>
          
          <div style={{ background: '#f8fafc', borderRadius: 12, padding: 20, marginBottom: 12, maxHeight: 320, overflowY: 'auto' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-end', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                <div style={{ width: 32, height: 32, background: m.role === 'user' ? brandColor : '#e5e7eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: m.role === 'user' ? '#fff' : '#111827' }}>
                  {m.role === 'user' ? 'You' : 'AI'}
                </div>
                <div style={{ background: m.role === 'user' ? brandColor : '#fff', color: m.role === 'user' ? '#fff' : '#111827', padding: '12px 16px', borderRadius: 12, maxWidth: '70%', boxShadow: m.role === 'assistant' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none' }}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
                <div style={{ width: 32, height: 32, background: '#e5e7eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#111827' }}>AI</div>
                <div style={{ background: '#fff', color: '#111827', padding: '12px 16px', borderRadius: 12, maxWidth: '70%', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}>
                  Typing...
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <input
              placeholder="Ask a question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
              style={{ flex: 1, padding: 12, border: '1px solid #e5e7eb', borderRadius: 8 }}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              style={{ background: brandColor, color: '#fff', border: 'none', padding: '12px 20px', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}
            >
              {isLoading ? 'Sending…' : 'Send'}
            </button>
          </div>
        </section>

        {/* Live Tickets */}
        <section style={{ marginBottom: 40 }}>
          <h3 style={{ fontSize: 28, fontWeight: 600, color: '#111827', marginBottom: 16, textAlign: 'center' }}>Live Tickets</h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
            {(['all','open','closed'] as const).map(k => (
              <button key={k} onClick={() => setFilter(k)} style={{
                padding: '6px 10px', borderRadius: 9999, border: '1px solid #e5e7eb', cursor: 'pointer',
                background: filter === k ? '#2563eb' : '#fff', color: filter === k ? '#fff' : '#111827', fontSize: 12, fontWeight: 600
              }}>{k.toUpperCase()}</button>
            ))}
          </div>
          {tickets.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#6b7280' }}>No tickets yet.</div>
          ) : (
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              {tickets.filter(t => filter === 'all' ? true : t.status === filter).map(t => {
                const isOpen = t.status === 'open';
                const borderColor = isOpen ? '#93C5FD' : '#D1D5DB';
                const pillBg = isOpen ? '#D1FAE5' : '#E5E7EB';
                const pillColor = isOpen ? '#065F46' : '#374151';
                const icon = isOpen ? '🟢' : '⚪';
                return (
                  <div key={t.id} style={{ background: '#fff', border: `2px solid ${borderColor}`, borderRadius: 12, padding: 14, display: 'grid', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ fontSize: 18 }}>{icon}</div>
                      <div style={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.subject}</div>
                    </div>
                    <div style={{ color: '#6b7280', fontSize: 12 }}>{new Date(t.createdAt).toLocaleString()}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ background: pillBg, color: pillColor, padding: '4px 8px', borderRadius: 9999, fontSize: 12, fontWeight: 700 }}>{t.status.toUpperCase()}</span>
                      <button onClick={() => { navigator.clipboard.writeText(t.id); }} title="Copy ticket ID" style={{ border: '1px solid #e5e7eb', background: '#fff', borderRadius: 8, padding: '6px 8px', cursor: 'pointer' }}>📋 {t.id}</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* FAQ Section */}
        <section style={{ marginBottom: 40 }}>
          <h3 style={{ fontSize: 28, fontWeight: 600, color: '#111827', marginBottom: 24, textAlign: 'center' }}>
            Frequently Asked Questions
          </h3>
          <div style={{ display: 'grid', gap: 16 }}>
            {[
              { q: "How long does shipping take?", a: "Standard shipping takes 3-5 business days. Express options are available." },
              { q: "What's your return policy?", a: "We accept returns within 30 days in original condition." },
              { q: "How do I track my order?", a: "Use your order number to track shipping status in real-time." },
              { q: "Do you offer international shipping?", a: "Yes, we ship to over 50 countries worldwide." }
            ].map((faq, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 600, color: '#111827' }}>{faq.q}</h4>
                <p style={{ margin: 0, color: '#6b7280' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Options */}
        <section style={{ background: '#fff', borderRadius: 16, padding: 40, border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: 24, fontWeight: 600, color: '#111827', marginBottom: 24, textAlign: 'center' }}>
            Still need help?
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📧</div>
              <h4 style={{ margin: '0 0 8px 0', fontWeight: 600 }}>Email Support</h4>
              <p style={{ margin: '0 0 16px 0', color: '#6b7280' }}>Get help via email</p>
              <a href="mailto:support@techstore.com" style={{ color: brandColor, textDecoration: 'none', fontWeight: 600 }}>
                support@techstore.com
              </a>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📞</div>
              <h4 style={{ margin: '0 0 8px 0', fontWeight: 600 }}>Phone Support</h4>
              <p style={{ margin: '0 0 16px 0', color: '#6b7280' }}>Mon-Fri, 9am-6pm EST</p>
              <a href="tel:+1-800-TECHSTORE" style={{ color: brandColor, textDecoration: 'none', fontWeight: 600 }}>
                1-800-TECHSTORE
              </a>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>💬</div>
              <h4 style={{ margin: '0 0 8px 0', fontWeight: 600 }}>Live Chat</h4>
              <p style={{ margin: '0 0 16px 0', color: '#6b7280' }}>Available 24/7</p>
              <button 
                onClick={() => {
                  const chatButton = document.querySelector('button[aria-controls="gpt-support-iframe"]') as HTMLButtonElement;
                  if (chatButton) chatButton.click();
                }}
                style={{ color: brandColor, textDecoration: 'none', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Start Chat
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer style={{ background: '#111827', color: '#9ca3af', padding: '40px 0', marginTop: 60 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <p style={{ margin: 0 }}>&copy; 2024 TechStore Pro. All rights reserved.</p>
        </div>
      </footer>

      {/* Hidden configurator for developers */}
      <div style={{ position: 'fixed', bottom: 20, left: 20, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, maxWidth: 300, fontSize: 12 }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: 14, fontWeight: 600 }}>Developer Config</h4>
        <div style={{ display: 'grid', gap: 8 }}>
          <input 
            placeholder="Site name" 
            value={siteName} 
            onChange={e => setSiteName(e.target.value)} 
            style={{ padding: 4, border: '1px solid #d1d5db', borderRadius: 4, fontSize: 12 }}
          />
          <input 
            placeholder="Brand color" 
            value={brandColor} 
            onChange={e => setBrandColor(e.target.value)} 
            style={{ padding: 4, border: '1px solid #d1d5db', borderRadius: 4, fontSize: 12 }}
          />
          <input 
            placeholder="FAQ URL" 
            value={faqUrl} 
            onChange={e => setFaqUrl(e.target.value)} 
            style={{ padding: 4, border: '1px solid #d1d5db', borderRadius: 4, fontSize: 12 }}
          />
        </div>
        <details style={{ marginTop: 8 }}>
          <summary style={{ cursor: 'pointer', fontSize: 12 }}>Embed Code</summary>
          <pre style={{ background: '#f3f4f6', padding: 8, borderRadius: 4, fontSize: 10, overflow: 'auto', marginTop: 4 }}>
            <code>{script}</code>
          </pre>
        </details>
      </div>
    </div>
  );
}