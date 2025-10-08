import type { NextApiRequest, NextApiResponse } from 'next';
import { createTicket, listTickets, type Ticket } from '@/lib/tickets';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, subject, description } = req.body || {};
    if (!email || !subject || !description) {
      res.status(400).json({ error: 'Missing fields' });
      return;
    }
    const ticket = createTicket(String(email), String(subject), String(description));
    res.status(200).json({ ticket });
    return;
  }

  if (req.method === 'GET') {
    const tickets = listTickets(20);
    res.status(200).json({ tickets });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}


