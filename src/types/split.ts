export interface ParticipantData {
  id?: string;
  name: string;
  phoneOrContactId?: string;
  shareAmount: number;
  status: 'pending' | 'settled';
  upiLink: string;
  gatewayUrl?: string;
}

export interface SplitDocument {
  id: string;
  title: string;
  totalAmount: number;
  payeeVpa: string;
  payeeName: string;
  strategy?: string;
  createdAt: number;
  participants: Record<string, ParticipantData>;
}

