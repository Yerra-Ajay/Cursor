import type { NextApiRequest, NextApiResponse } from 'next';

type Message = { role: 'user' | 'assistant' | 'system'; content: string };

async function fetchFaqText(url: string | null): Promise<string | null> {
  if (!url) return null;
  try {
    const res = await fetch(url, { headers: { 'Accept': 'text/plain, text/markdown, text/html;q=0.9' } });
    const text = await res.text();
    // Basic strip of HTML tags if any
    return text.replace(/<[^>]*>/g, ' ').slice(0, 12000);
  } catch {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { messages, siteName, faqUrl } = req.body as { messages: Message[]; siteName?: string; faqUrl?: string };
  if (!Array.isArray(messages)) {
    res.status(400).json({ error: 'Invalid messages' });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;

  const model = process.env.MODEL || 'gpt-4o-mini';
  const base = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

  const faqText = await fetchFaqText(faqUrl ?? null);

  const system: Message = {
    role: 'system',
    content: [
      'You are a helpful ecommerce support assistant. Be concise and friendly.',
      siteName ? `Store: ${siteName}` : null,
      faqText ? `Useful context from the store:\n${faqText}` : null,
      'If unsure, politely ask for clarification or suggest contacting human support.'
    ].filter(Boolean).join('\n\n')
  } as Message;

  const body = {
    model,
    messages: [system, ...messages].map(m => ({ role: m.role, content: m.content }))
  };

  try {
    // Mock mode if API key absent or placeholder
    if (!apiKey || apiKey === 'PLACEHOLDER') {
      const lastUser = [...messages].reverse().find(m => m.role === 'user');
      const q = (lastUser?.content || '').toLowerCase();

      function mockReply(question: string): { reply: string; handlingScore: number } {
        const text = question;
        const has = (re: RegExp) => re.test(text);
        let handlingScore = 0.4; // default simple

        if (!text.trim()) {
          return { reply: "Hi! I'm your support assistant. Ask me about orders, shipping, returns, refunds, and more.", handlingScore };
        }

        // Order & tracking (generic "order" too)
        if (has(/\border\b/)) return { reply: 'For orders: you can track status from your account → Orders, or the email link. Cancellations are possible within 60 minutes. To change address, update before shipment or request a carrier intercept once shipped.', handlingScore: 0.5 };
        if (has(/track|tracking|where.*order|order status/)) return { reply: 'You can track your order using the tracking link in your confirmation email or from your account → Orders.', handlingScore: 0.4 };
        if (has(/cancel( my)? order|order cancel/)) return { reply: 'Orders can be cancelled within 60 minutes of purchase from your account → Orders. If it has shipped, start a return after delivery.', handlingScore: 0.5 };
        if (has(/change.*address|wrong address|update address/)) return { reply: 'If your order has not shipped, you can update the address from your account. If shipped, the carrier may allow an intercept.', handlingScore: 0.6 };

        // Shipping
        if (has(/ship|shipping|delivery|when.*arrive/)) return { reply: 'Standard shipping is 3–5 business days. Express options are available at checkout. You’ll receive an email with tracking when it ships.', handlingScore: 0.4 };
        if (has(/international|customs|duty|import/)) return { reply: 'We ship to 50+ countries. Duties/taxes may apply depending on destination and are shown at checkout when available.', handlingScore: 0.6 };

        // Returns & Refunds & Exchanges
        if (has(/return|exchange|replace/)) return { reply: 'We accept returns within 30 days in original condition. Start a return from your account → Orders. Exchanges are processed once the return is received.', handlingScore: 0.5 };
        if (has(/refund|money back|get.*money/)) return { reply: 'Refunds are issued to the original payment method within 5–7 business days after we receive and inspect the return.', handlingScore: 0.5 };
        if (has(/warranty|defect|broken|damaged/)) { return { reply: 'Sorry about that. Please attach photos and start a warranty claim via the support portal; we will replace or refund as appropriate.', handlingScore: 0.8 }; }

        // Payments & Discounts
        if (has(/payment|pay|card|credit|debit|upi|netbanking/)) return { reply: 'We accept major cards, PayPal, and supported wallets. If payment fails, try another method or contact your bank to allow online transactions.', handlingScore: 0.5 };
        if (has(/discount.*today|today.*deal|today.*offer|today.*sale|flash sale|deal of the day/)) return { reply: 'Today’s offers: 10% off sitewide with code TODAY10, 20% off orders over $100 with code SAVE20, and free shipping over $50. Offers end at midnight UTC.', handlingScore: 0.5 };
        if (has(/coupon|promo|discount|code|offer code/)) return { reply: 'Apply your promo code on the cart or checkout page. Only one code per order unless specified.', handlingScore: 0.5 };

        // Products & Sizing
        if (has(/size|sizing|fit/)) return { reply: 'Please refer to the size guide on the product page. If unsure, choose your usual size; we offer easy exchanges.', handlingScore: 0.4 };
        if (has(/stock|in stock|availability/)) return { reply: 'If an item shows “In stock”, it usually ships within 1–2 business days. Out-of-stock items may have a restock date on the product page.', handlingScore: 0.4 };

        // Account & Support
        if (has(/account|login|sign in|password/)) return { reply: 'Manage your account from the Sign In page. Reset your password via the “Forgot password” link and follow the email instructions.', handlingScore: 0.4 };
        if (has(/hours|contact|help|support/)) return { reply: 'Support hours: Mon–Fri, 9am–5pm (UTC). Contact us via chat, email support@example.com, or call 1-800-TECHSTORE.', handlingScore: 0.4 };

        // Shipping costs and methods
        if (has(/shipping cost|delivery charge|how much shipping|free shipping/)) return 'Shipping: Standard from $5, Express from $15. Free shipping on orders over $50 (US). Rates vary by location and will show at checkout.';
        if (has(/p.o. box|po box|apo|fpo/)) return 'We can ship to most P.O. Boxes and APO/FPO addresses via standard methods. Some oversized items may be excluded.';

        // Order issues
        if (has(/missing|not.*received|never.*arrived/)) { return { reply: 'If your package hasn’t arrived, check the tracking details and contact the carrier. If it’s marked delivered but missing, reach out and we’ll help.', handlingScore: 0.8 }; }
        if (has(/wrong item|incorrect|received.*wrong/)) { return { reply: 'Sorry for the mix-up. Start an exchange from your account with photos; we’ll send the correct item at no cost.', handlingScore: 0.75 }; }

        // Gifts & gift cards
        if (has(/gift card|giftcard|gift-card/)) return { reply: 'Digital gift cards are delivered by email immediately after purchase and can be redeemed at checkout.', handlingScore: 0.4 };

        // Cash on delivery / COD
        if (has(/cod|cash on delivery/)) return { reply: 'Cash on Delivery is not currently supported. Please choose from our available online payment methods.', handlingScore: 0.5 };

        // Fallback to FAQ
        if (faqText) return { reply: 'Here\'s what I found in the FAQ: ' + faqText.slice(0, 240) + '...', handlingScore: 0.7 };

        return { reply: "I didn't quite get that. Ask me about orders, shipping, returns, refunds, payments, or discounts.", handlingScore: 0.7 };
      }

      const { reply, handlingScore } = mockReply(q);
      const escalate = handlingScore > 0.7;
      res.status(200).json({ reply, handlingScore, escalate });
      return;
    }

    const resp = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    if (!resp.ok) {
      const errText = await resp.text();
      res.status(500).json({ error: 'Upstream error', detail: errText });
      return;
    }
    const data = await resp.json();
    const reply = data.choices?.[0]?.message?.content || '';
    // For real model, estimate handlingScore based on heuristic (length/confidence not available). Default high.
    const handlingScore = 0.85;
    const escalate = handlingScore > 0.7;
    res.status(200).json({ reply, handlingScore, escalate });
  } catch (e) {
    res.status(500).json({ error: 'Request failed' });
  }
}


