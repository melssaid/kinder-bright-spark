export type DeliveryStatus = 'pending' | 'sent' | 'failed';

export interface MessageDelivery {
  id: string;
  studentId: string;
  parentId: string;
  reportId: string;
  channel: 'whatsapp';
  status: DeliveryStatus;
  messageBody: string;
  providerMessageId?: string | null;
  sentAt?: string | null;
  createdAt: string;
}
