export type VisitorStatus = 'Pending' | 'Approved' | 'Denied' | 'Expired';

export interface VisitorRecord {
  id: string;
  fullName: string;
  contactNumber: string;
  purpose: string;
  residentName: string;
  roomNumber: string;
  idType: string;
  idNumber: string;
  notes: string;
  imageUrl: string | null;
  status: VisitorStatus;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export interface VisitorFormInput {
  fullName: string;
  contactNumber: string;
  purpose: string;
  residentName: string;
  roomNumber: string;
  idType: string;
  idNumber: string;
  notes: string;
  imageUrl?: string | null;
}
