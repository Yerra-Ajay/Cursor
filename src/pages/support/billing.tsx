import React, { useState } from 'react';
import Link from 'next/link';

export default function BillingPage() {
  const [topic, setTopic] = useState('Payment issue');
  const [details, setDetails] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const prompt = `Billing help requested. Topic: ${topic}. Details: ${details}. Provide steps to resolve or contact guidance.`;
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
        <h1 style={{ margin: 0 }}>Billing Support</h1>
        <p style={{ color: '#6b7280' }}>Describe your billing issue and we’ll help.</p>

        <form onSubmit={onSubmit} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, display: 'grid', gap: 12 }}>
          <label>
            <div>Topic</div>
            <select value={topic} onChange={e => setTopic(e.target.value)} style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }}>
              <option>Payment issue</option>
              <option>Refund status</option>
              <option>Charge dispute</option>
              <option>Invoice request</option>
              <option>Promo/discount</option>
            </select>
          </label>
          <label>
            <div>Details</div>
            <textarea value={details} onChange={e => setDetails(e.target.value)} rows={4} style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }} />
          </label>
          <button type="submit" disabled={loading} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px 16px', borderRadius: 8, fontWeight: 600, width: 'fit-content' }}>
            {loading ? 'Submitting…' : 'Get Help'}
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



