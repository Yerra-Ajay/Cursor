import React, { useState } from 'react';
import Link from 'next/link';

export default function TicketPage() {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, subject, description })
    });
    const data = await res.json();
    if (data && data.ticket && data.ticket.id) {
      setTicketId(String(data.ticket.id));
      setSubmitted(true);
    }
  }

  return (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui, Arial', minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
        <nav style={{ marginBottom: 16 }}><Link href="/">← Back to Support</Link></nav>
        <h1 style={{ marginTop: 0 }}>Create Support Ticket</h1>
        <p style={{ color: '#6b7280' }}>Tell us what happened and we’ll get back to you shortly.</p>

        {submitted ? (
          <div style={{ background: '#ecfdf5', border: '1px solid #10b981', color: '#065f46', borderRadius: 12, padding: 16 }}>
            Your ticket <strong>{ticketId}</strong> has been submitted. We’ve sent a confirmation to your email. Our team will reply within 1–2 business days.
          </div>
        ) : (
          <form onSubmit={onSubmit} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, display: 'grid', gap: 12 }}>
            <label>
              <div>Email</div>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }} />
            </label>
            <label>
              <div>Subject</div>
              <input value={subject} onChange={e => setSubject(e.target.value)} required style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }} />
            </label>
            <label>
              <div>Description</div>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5} required style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }} />
            </label>
            <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px 16px', borderRadius: 8, fontWeight: 600, width: 'fit-content' }}>
              Submit Ticket
            </button>
          </form>
        )}
      </div>
    </div>
  );
}


