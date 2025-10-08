import React from 'react';
import Link from 'next/link';

export default function SupportIndex() {
  return (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui, Arial', minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px' }}>
        <h1 style={{ marginTop: 0 }}>Support Center</h1>
        <p style={{ color: '#6b7280' }}>Choose a topic below to get help.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          <Link href="/support/track" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 24 }}>📦</div>
              <div style={{ fontWeight: 600, marginTop: 8 }}>Track Order</div>
              <div style={{ color: '#6b7280' }}>Check shipping status</div>
            </div>
          </Link>
          <Link href="/support/returns" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 24 }}>↩️</div>
              <div style={{ fontWeight: 600, marginTop: 8 }}>Returns</div>
              <div style={{ color: '#6b7280' }}>Start a return</div>
            </div>
          </Link>
          <Link href="/support/billing" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 24 }}>💳</div>
              <div style={{ fontWeight: 600, marginTop: 8 }}>Billing</div>
              <div style={{ color: '#6b7280' }}>Payment & refunds</div>
            </div>
          </Link>
          <Link href="/support/general" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 24 }}>❓</div>
              <div style={{ fontWeight: 600, marginTop: 8 }}>General</div>
              <div style={{ color: '#6b7280' }}>Other questions</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}



