import type { MessageDelivery } from '../types';

export const whatsappService = {
  buildShareUrl(message: string) {
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  },

  createPendingDelivery(input: Omit<MessageDelivery, 'id' | 'createdAt' | 'status'>): MessageDelivery {
    return {
      ...input,
      id: crypto.randomUUID(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  },
};
