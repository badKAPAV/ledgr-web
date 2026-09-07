export interface ParticipantData {
  name: string;
  phoneOrContactId?: string;
  shareAmount: number;
  status: 'pending' | 'settled';
  upiLink: string;
}

export interface SplitDocument {
  id: string;
  title: string;
  totalAmount: number;
  payeeVpa: string;
  payeeName: string;
  createdAt: number;
  participants: Record<string, ParticipantData>;
}
