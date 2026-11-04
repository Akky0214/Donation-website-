export type CauseCategory = 'all' | 'water' | 'medical' | 'crisis' | 'ecology' | 'education';

export type DonationFrequency = 'once' | 'monthly';

export interface CampaignMilestone {
  date: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface Campaign {
  id: string;
  title: string;
  subtitle: string;
  category: CauseCategory;
  categoryLabel: string;
  location: string;
  targetAmount: number; // in INR (₹)
  raisedAmount: number; // in INR (₹)
  donorCount: number;
  daysLeft: number;
  emergencyMultiplier?: number; // e.g. 2x match
  summary: string;
  impactMetrics: {
    label: string;
    value: string;
  }[];
  fieldNotes: string[];
  milestones: CampaignMilestone[];
  svgTheme: 'water' | 'medical' | 'ecology' | 'crisis' | 'education';
  imageUrl?: string;
  imageAlt?: string;
}

export interface DonorWallEntry {
  id: string;
  donorName: string;
  amount: number; // in INR (₹)
  frequency: DonationFrequency;
  campaignTitle: string;
  timestamp: string;
  tributeType?: 'in_honor' | 'in_memory' | 'general';
  tributeName?: string;
  message?: string;
  isAnonymous?: boolean;
}

export interface DonationReceipt {
  receiptId: string;
  transactionDate: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  donorPAN?: string; // Indian Permanent Account Number for Section 80G Form 10BE
  campaignTitle: string;
  amount: number; // in INR (₹)
  feeCovered: number;
  totalPaid: number;
  frequency: DonationFrequency;
  paymentMethod: string;
  upiVpa?: string;
  cardLast4?: string;
  taxDeductiblePercentage: number;
  taxDeductibleAmount: number;
  section80GRegNo: string;
  trustPAN: string;
  darpanId: string;
  tributeType?: string;
  tributeName?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Co-Admin' | 'Trustee';
  designation: string;
  permissions: string[];
  avatarColor: string;
  isPrimary?: boolean;
}

export interface TrustSettings {
  trustName: string;
  trustPan: string;
  section80GRegNo: string;
  darpanId: string;
  csrRegNo: string;
  upiVpa: string;
  superAdminEmail: string;
  accountNumber: string;
  ifscCode: string;
  bankBranch: string;
  admins: AdminUser[];
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: string;
  source: string;
  status: 'active' | 'unsubscribed';
  preferredFrequency: 'weekly_dispatch' | 'monthly_impact' | 'critical_alerts';
  interests?: string[];
}
