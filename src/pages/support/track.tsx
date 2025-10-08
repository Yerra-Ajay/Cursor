import React, { useState } from 'react';
import Link from 'next/link';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const prompt = `Customer wants to track order. Order ID: ${orderId}. Email: ${email}. Provide tracking steps and status if possible.`;
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }], siteName: 'TechStore Pro', faqUrl: '/sample-faq.md' })
      });
      const data = await res.json();
      setResult(data.reply || 'No result.');
    } catch {
      setResult('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui, Arial', minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px' }}>
        <nav style={{ marginBottom: 16 }}><Link href="/">← Back to Support</Link></nav>
        <h1 style={{ margin: 0 }}>Track Your Order</h1>
        <p style={{ color: '#6b7280' }}>Enter your order details to get the latest status.</p>

        <form onSubmit={onSubmit} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, display: 'grid', gap: 12 }}>
          <label>
            <div>Order ID</div>
            <input value={orderId} onChange={e => setOrderId(e.target.value)} required style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }} />
          </label>
          <label>
            <div>Email</div>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }} />
          </label>
          <button type="submit" disabled={loading} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px 16px', borderRadius: 8, fontWeight: 600, width: 'fit-content' }}>
            {loading ? 'Checking…' : 'Check Status'}
          </button>
        </form>

        {result && (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginTop: 16 }}>
            {result}
          </div>
        )}
      </div>
    </div>
  );
}



