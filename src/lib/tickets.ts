export type TicketStatus = 'open' | 'closed';

export interface Ticket {
  id: string;
  email: string;
  subject: string;
  description: string;
  createdAt: number;
  status: TicketStatus;
}

declare global { // eslint-disable-next-line no-var
  var __ticketStore: Ticket[] | undefined;
}

const ticketStore: Ticket[] = (globalThis as any).__ticketStore || [];
(globalThis as any).__ticketStore = ticketStore;

function generateId(): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  const ts = Date.now().toString(36).slice(-4).toUpperCase();
  return `TS-${ts}-${rand}`;
}

export function createTicket(email: string, subject: string, description: string): Ticket {
  const ticket: Ticket = {
    id: generateId(),
    email,
    subject,
    description,
    createdAt: Date.now(),
    status: 'open'
  };
  ticketStore.unshift(ticket);
  // Keep only the latest 100 for demo
  if (ticketStore.length > 100) ticketStore.pop();
  (globalThis as any).__ticketStore = ticketStore;
  return ticket;
}

export function listTickets(limit = 20): Ticket[] {
  return ticketStore.slice(0, limit);
}


