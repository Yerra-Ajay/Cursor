import React, { useState } from 'react';
import Link from 'next/link';

export default function ReturnsPage() {
  const [orderId, setOrderId] = useState('');
  const [reason, setReason] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const prompt = `Customer wants to start a return. Order ID: ${orderId}. Reason: ${reason}. Provide next steps and policy summary.`;
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
        <h1 style={{ margin: 0 }}>Start a Return</h1>
        <p style={{ color: '#6b7280' }}>Tell us about your order and why you’re returning.</p>

        <form onSubmit={onSubmit} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, display: 'grid', gap: 12 }}>
          <label>
            <div>Order ID</div>
            <input value={orderId} onChange={e => setOrderId(e.target.value)} required style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }} />
          </label>
          <label>
            <div>Reason</div>
            <textarea value={reason} onChange={e => setReason(e.target.value)} required rows={4} style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }} />
          </label>
          <button type="submit" disabled={loading} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px 16px', borderRadius: 8, fontWeight: 600, width: 'fit-content' }}>
            {loading ? 'Submitting…' : 'Submit Return Request'}
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



