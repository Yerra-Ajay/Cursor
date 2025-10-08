# GPT Support MVP

Lightweight, embeddable customer support chat widget powered by GPT. Drop-in for any ecommerce site. Free to host on Vercel.

## Features
- Embeddable chat widget via a single script tag
- GPT-powered responses with optional site/FAQ URL context
- No database required
- Works on any site (Shopify, WooCommerce, custom)

## Quickstart (Local)
1. Install Node 18+.
2. Copy `.env.example` to `.env.local` and set keys.
3. Install and run:
   ```bash
   npm install
   npm run dev
   ```
4. Open `http://localhost:3000` for configurator and docs.

## Deploy (Free on Vercel)
1. Push this repo to GitHub.
2. Import to Vercel → Framework: Next.js.
3. Add environment variables from `.env.example`.
4. Deploy. Your base URL will be like `https://your-app.vercel.app`.

## Embed the Widget
Place this before the closing `</body>` on your storefront:

```html
<script
  src="https://YOUR_APP_DOMAIN/widget.js"
  data-site-name="Acme Store"
  data-brand-color="#2563eb"
  data-faq-url="https://acme.com/faq"
  defer
></script>
```

Optional data-attrs:
- `data-site-name`: Display name in the chat header
- `data-brand-color`: Hex color for header and button
- `data-faq-url`: Public URL for context fetching (markdown/FAQ)

## How It Works
- `public/widget.js` injects an iframe pointing to `/widget` with query params
- `/widget` renders the chat UI and calls `/api/chat`
- `/api/chat` sends user messages to GPT with optional fetched context

## Environment
Create `.env.local` with:
```
OPENAI_API_KEY=PLACEHOLDER
MODEL=gpt-4o-mini
```

You can use any OpenAI-compatible endpoint by setting `OPENAI_BASE_URL`.

## Mock Mode (No API Key)
If `OPENAI_API_KEY` is missing or set to `PLACEHOLDER`, the app runs in mock mode:
- Returns friendly canned responses (refunds, shipping, returns)
- Falls back to snippets from the provided FAQ
- Great for demos/case studies without billing

Sample data: `public/sample-faq.md`. The configurator defaults to this path for quick testing.

## Case Study Notes
- Architecture kept minimal: static script + iframe + single API route
- Zero-database to simplify review and deployment
- Easily extensible with auth, conversation storage, or CRM webhooks


