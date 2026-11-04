import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Campaign, DonationReceipt, DonorWallEntry, TrustSettings, CauseCategory, AdminUser, NewsletterSubscriber } from '../types/donation';
import { DEFAULT_TRUST_SETTINGS } from '../data/mockData';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  Download,
  CheckCircle,
  X,
  Save,
  Search,
  FileSpreadsheet,
  Settings,
  ListOrdered,
  Users,
  UserCheck,
  ShieldAlert,
  Sparkles,
  Key,
  Mail,
  UserPlus,
  ToggleLeft,
  ToggleRight,
  Filter,
  Check,
  SendHorizontal
} from 'lucide-react';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  campaigns: Campaign[];
  onUpdateCampaigns: (campaigns: Campaign[]) => void;
  receipts: DonationReceipt[];
  onUpdateReceipts: (receipts: DonationReceipt[]) => void;
  donorWall: DonorWallEntry[];
  onUpdateDonorWall: (entries: DonorWallEntry[]) => void;
  trustSettings: TrustSettings;
  onUpdateTrustSettings: (settings: TrustSettings) => void;
  subscribers?: NewsletterSubscriber[];
  onUpdateSubscribers?: (subscribers: NewsletterSubscriber[]) => void;
  adminEmail?: string;
  currentAdminEmail?: string;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  campaigns,
  onUpdateCampaigns,
  receipts,
  onUpdateReceipts,
  donorWall,
  onUpdateDonorWall,
  trustSettings,
  onUpdateTrustSettings,
  subscribers = [],
  onUpdateSubscribers,
  adminEmail,
  currentAdminEmail
}) => {
  // Tabs: 'campaigns' | 'ledger' | 'subscribers' | 'council' | 'moderation' | 'settings'
  const [activeTab, setActiveTab] = useState<'campaigns' | 'ledger' | 'subscribers' | 'council' | 'moderation' | 'settings'>('council');

  // Currently acting admin
  const [selectedAdminId, setSelectedAdminId] = useState<string>('admin-1');

  // Campaign create / edit state
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState<boolean>(false);
  const [campaignFormData, setCampaignFormData] = useState<Partial<Campaign>>({
    title: '',
    subtitle: '',
    category: 'water',
    categoryLabel: 'Clean Water',
    location: '',
    targetAmount: 2000000,
    raisedAmount: 0,
    donorCount: 0,
    daysLeft: 30,
    emergencyMultiplier: 1,
    summary: '',
    svgTheme: 'water'
  });

  // Settings form
  const [settingsForm, setSettingsForm] = useState<TrustSettings>(trustSettings);
  const [settingsSavedNotice, setSettingsSavedNotice] = useState<boolean>(false);

  // New admin form modal
  const [isAddingAdmin, setIsAddingAdmin] = useState<boolean>(false);
  const [newAdminName, setNewAdminName] = useState<string>('');
  const [newAdminEmail, setNewAdminEmail] = useState<string>('');
  const [newAdminRole, setNewAdminRole] = useState<'Co-Admin' | 'Trustee'>('Co-Admin');
  const [newAdminDesignation, setNewAdminDesignation] = useState<string>('');

  // Ledger search
  const [ledgerSearch, setLedgerSearch] = useState<string>('');

  // Newsletter Subscribers management state
  const [subscribersList, setSubscribersList] = useState<NewsletterSubscriber[]>(subscribers);
  const [subscriberSearch, setSubscriberSearch] = useState<string>('');
  const [subscriberStatusFilter, setSubscriberStatusFilter] = useState<'all' | 'active' | 'unsubscribed'>('all');
  const [isAddingSubscriber, setIsAddingSubscriber] = useState<boolean>(false);
  const [newSubEmail, setNewSubEmail] = useState<string>('');
  const [newSubName, setNewSubName] = useState<string>('');
  const [newSubFreq, setNewSubFreq] = useState<'weekly_dispatch' | 'monthly_impact' | 'critical_alerts'>('weekly_dispatch');
  const [newSubInterests, setNewSubInterests] = useState<string>('water, medical');
  const [testDispatchNotice, setTestDispatchNotice] = useState<string | null>(null);

  // Sync internal list when external subscribers prop updates
  React.useEffect(() => {
    if (subscribers && subscribers.length > 0) {
      setSubscribersList(subscribers);
    }
  }, [subscribers]);

  if (!isOpen) return null;

  const adminsList = (trustSettings && Array.isArray(trustSettings.admins) && trustSettings.admins.length > 0)
    ? trustSettings.admins
    : DEFAULT_TRUST_SETTINGS.admins;

  const activeAdmin = adminsList.find((a) => a.id === selectedAdminId) || adminsList[0] || DEFAULT_TRUST_SETTINGS.admins[0];

  // Campaign deletion
  const handleDeleteCampaign = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this initiative?')) {
      const updated = campaigns.filter((c) => c.id !== id);
      onUpdateCampaigns(updated);
    }
  };

  // Start campaign editing
  const handleStartEdit = (camp: Campaign) => {
    setEditingCampaignId(camp.id);
    setIsCreatingCampaign(false);
    setCampaignFormData({ ...camp });
    setActiveTab('campaigns');
  };

  // Save campaign edit or creation
  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignFormData.title) return;

    if (isCreatingCampaign) {
      const newCamp: Campaign = {
        id: `initiative-${Date.now()}`,
        title: campaignFormData.title || 'Untitled Initiative',
        subtitle: campaignFormData.subtitle || '',
        category: (campaignFormData.category as CauseCategory) || 'water',
        categoryLabel:
          campaignFormData.category === 'water'
            ? 'Clean Water'
            : campaignFormData.category === 'medical'
            ? 'Medical Care'
            : campaignFormData.category === 'ecology'
            ? 'Ecology'
            : campaignFormData.category === 'crisis'
            ? 'Crisis Relief'
            : 'Education',
        location: campaignFormData.location || 'India',
        targetAmount: Number(campaignFormData.targetAmount) || 1000000,
        raisedAmount: Number(campaignFormData.raisedAmount) || 0,
        donorCount: Number(campaignFormData.donorCount) || 0,
        daysLeft: Number(campaignFormData.daysLeft) || 30,
        emergencyMultiplier: Number(campaignFormData.emergencyMultiplier) || 1,
        summary: campaignFormData.summary || '',
        impactMetrics: [
          { label: 'Direct Beneficiaries', value: '2,500+ Individuals' },
          { label: 'Ground Output', value: '100% Verified' }
        ],
        fieldNotes: [
          `${new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}: Authorized by ${activeAdmin.name} (${activeAdmin.role}).`
        ],
        milestones: [
          { date: 'Initial', title: 'Survey & Authorization', description: 'Gram Panchayat & statutory permissions.', completed: true },
          { date: 'Upcoming', title: 'Ground Implementation', description: 'Procurement of relief materials.', completed: false }
        ],
        svgTheme: campaignFormData.svgTheme || 'water',
        imageUrl: campaignFormData.imageUrl || undefined,
        imageAlt: campaignFormData.imageAlt || undefined
      };
      onUpdateCampaigns([newCamp, ...campaigns]);
      setIsCreatingCampaign(false);
    } else if (editingCampaignId) {
      const updated = campaigns.map((c) => {
        if (c.id === editingCampaignId) {
          return {
            ...c,
            ...campaignFormData,
            targetAmount: Number(campaignFormData.targetAmount),
            raisedAmount: Number(campaignFormData.raisedAmount),
            daysLeft: Number(campaignFormData.daysLeft),
            emergencyMultiplier: Number(campaignFormData.emergencyMultiplier)
          } as Campaign;
        }
        return c;
      });
      onUpdateCampaigns(updated);
      setEditingCampaignId(null);
    }
  };

  // Save trust settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTrustSettings(settingsForm);
    setSettingsSavedNotice(true);
    setTimeout(() => setSettingsSavedNotice(false), 3000);
  };

  // Add new co-admin
  const handleAddAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName || !newAdminEmail) return;

    const newAdmin: AdminUser = {
      id: `admin-${Date.now()}`,
      name: newAdminName.trim(),
      email: newAdminEmail.trim(),
      role: newAdminRole,
      designation: newAdminDesignation.trim() || 'Co-Admin & Project Verification Trustee',
      permissions: ['Campaign Management', 'Field Logs', 'Ledger Oversight'],
      avatarColor: 'bg-indigo-600',
      isPrimary: false
    };

    const updated = {
      ...trustSettings,
      admins: [...adminsList, newAdmin]
    };
    onUpdateTrustSettings(updated);
    setSettingsForm(updated);
    setIsAddingAdmin(false);
    setNewAdminName('');
    setNewAdminEmail('');
    setNewAdminDesignation('');
  };

  // Delete / remove admin
  const handleRemoveAdmin = (id: string) => {
    if (id === 'admin-1') {
      alert('Super Admin cannot be removed.');
      return;
    }
    if (window.confirm('Revoke administrator privileges for this member?')) {
      const updatedAdmins = adminsList.filter((a) => a.id !== id);
      const updated = { ...trustSettings, admins: updatedAdmins };
      onUpdateTrustSettings(updated);
      setSettingsForm(updated);
    }
  };

  // Export ledger to CSV
  const handleExportCSV = () => {
    if (receipts.length === 0) {
      alert('No donation records found to export.');
      return;
    }
    const headers = [
      'Receipt ID',
      'Date',
      'Donor Name',
      'Donor Email',
      'Donor PAN (80G)',
      'Designated Cause',
      'Direct Gift (INR)',
      'Fee Covered (INR)',
      'Total Paid (INR)',
      'Payment Method',
      'Section 80G Reg No',
      'Auditing Admin'
    ];
    const rows = receipts.map((r) => [
      `"${r.receiptId}"`,
      `"${r.transactionDate}"`,
      `"${r.donorName.replace(/"/g, '""')}"`,
      `"${r.donorEmail}"`,
      `"${r.donorPAN || 'N/A'}"`,
      `"${r.campaignTitle.replace(/"/g, '""')}"`,
      r.amount,
      r.feeCovered,
      r.totalPaid,
      `"${r.paymentMethod}"`,
      `"${r.section80GRegNo}"`,
      `"${activeAdmin.name}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Kindred_Horizons_80G_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete / hide donor wall entry
  const handleDeleteDonorEntry = (id: string) => {
    const updated = donorWall.filter((d) => d.id !== id);
    onUpdateDonorWall(updated);
  };

  // Delete transaction from ledger
  const handleDeleteReceipt = (receiptId: string) => {
    if (window.confirm(`Delete receipt #${receiptId} from statutory records?`)) {
      const updated = receipts.filter((r) => r.receiptId !== receiptId);
      onUpdateReceipts(updated);
    }
  };

  // Toggle subscriber active / unsubscribed status
  const handleToggleSubscriberStatus = (id: string) => {
    const updated = subscribersList.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          status: s.status === 'active' ? ('unsubscribed' as const) : ('active' as const)
        };
      }
      return s;
    });
    setSubscribersList(updated);
    if (onUpdateSubscribers) onUpdateSubscribers(updated);
  };

  // Delete subscriber from database
  const handleDeleteSubscriber = (id: string) => {
    if (window.confirm('Delete this subscriber from the database?')) {
      const updated = subscribersList.filter((s) => s.id !== id);
      setSubscribersList(updated);
      if (onUpdateSubscribers) onUpdateSubscribers(updated);
    }
  };

  // Add new subscriber manually
  const handleAddSubscriberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = newSubEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) return;

    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email: cleanEmail,
      name: newSubName.trim() || undefined,
      subscribedAt: new Date().toISOString(),
      source: 'Admin Portal Entry',
      status: 'active',
      preferredFrequency: newSubFreq,
      interests: newSubInterests.split(',').map((s) => s.trim()).filter(Boolean)
    };

    const updated = [newSub, ...subscribersList];
    setSubscribersList(updated);
    if (onUpdateSubscribers) onUpdateSubscribers(updated);

    setIsAddingSubscriber(false);
    setNewSubEmail('');
    setNewSubName('');
    setNewSubInterests('water, medical');
  };

  // Export subscribers to CSV
  const handleExportSubscribersCSV = () => {
    const headers = [
      'Subscriber ID',
      'Email Address',
      'Full Name',
      'Subscribed Date',
      'Status',
      'Cadence Preference',
      'Acquisition Source',
      'Topics'
    ];
    const rows = subscribersList.map((s) => [
      `"${s.id}"`,
      `"${s.email}"`,
      `"${(s.name || '').replace(/"/g, '""')}"`,
      `"${s.subscribedAt}"`,
      `"${s.status}"`,
      `"${s.preferredFrequency}"`,
      `"${s.source}"`,
      `"${(s.interests || []).join('; ')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Kindred_Horizons_Subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simulate sending mock dispatch email
  const handleSendMockDispatch = (email: string) => {
    setTestDispatchNotice(`Test field dispatch & Section 80G update delivered to ${email}`);
    setTimeout(() => setTestDispatchNotice(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-2xl max-w-5xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col"
      >
        {/* Admin Portal Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center font-mono font-bold text-base shadow-xs">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-serif font-bold text-stone-900">
                  Trust Executive Admin Portal
                </h2>
                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-sm border border-amber-300">
                  EXECUTIVE GOVERNANCE
                </span>
              </div>
              <p className="text-xs text-stone-500 font-mono flex items-center gap-1.5 mt-0.5">
                <span>Active Operator:</span>
                <strong className="text-stone-900">{activeAdmin.name}</strong>
                <span className="text-stone-400">({activeAdmin.role})</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="p-1 rounded-md text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('council')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'council'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Council ({adminsList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('campaigns');
                setIsCreatingCampaign(false);
                setEditingCampaignId(null);
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'campaigns'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Campaigns Control ({campaigns.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ledger')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'ledger'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Donation Ledger ({receipts.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('subscribers')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'subscribers'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Subscribers ({subscribersList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('moderation')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'moderation'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Donor Wall Moderation ({donorWall.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'settings'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Section 80G Setup</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-sm border border-emerald-200 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>256-Bit Escrow Vault Active</span>
          </div>
        </div>

        {/* Tab 0: Admin Council (Lavanya Gurbhele, Bhakti Kapse, Aarya Sarode) */}
        {activeTab === 'council' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <h3 className="text-lg font-serif font-semibold text-stone-900">
                  Trust Executive Leadership Council
                </h3>
                <p className="text-xs text-stone-500">
                  Authorized Trustees with executive administrative authority, signature verification, and 80G compliance oversight.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingAdmin(true)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Add Trustee / Co-Admin</span>
              </button>
            </div>

            {/* Add Co-Admin Form Modal */}
            {isAddingAdmin && (
              <form onSubmit={handleAddAdminSubmit} className="p-5 bg-amber-50/60 border border-amber-200 rounded-xl space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                  <h4 className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-amber-700" />
                    <span>Appoint New Co-Admin or Trustee</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsAddingAdmin(false)}
                    className="text-xs text-stone-500 hover:text-stone-800"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bhakti Kapse"
                      value={newAdminName}
                      onChange={(e) => setNewAdminName(e.target.value)}
                      className="w-full py-2 px-3 bg-white border border-stone-300 rounded-md text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">
                      Official Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="bhakti.kapse@kindredhorizons.org"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      className="w-full py-2 px-3 bg-white border border-stone-300 rounded-md text-stone-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">
                      Role Privilege
                    </label>
                    <select
                      value={newAdminRole}
                      onChange={(e) => setNewAdminRole(e.target.value as 'Co-Admin' | 'Trustee')}
                      className="w-full py-2 px-3 bg-white border border-stone-300 rounded-md text-stone-900"
                    >
                      <option value="Co-Admin">Co-Admin (Operations & Campaign Control)</option>
                      <option value="Trustee">Trustee (Statutory & Auditing Signatory)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">
                      Designation & Focus Area
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Director of Field Operations & Project Verification"
                      value={newAdminDesignation}
                      onChange={(e) => setNewAdminDesignation(e.target.value)}
                      className="w-full py-2 px-3 bg-white border border-stone-300 rounded-md text-stone-900"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingAdmin(false)}
                    className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-200/50 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-stone-900 text-white text-xs font-semibold rounded-md flex items-center gap-1 shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5 text-amber-400" />
                    <span>Confirm Appointment</span>
                  </button>
                </div>
              </form>
            )}

            {/* List of Council Members */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {adminsList.map((admin) => {
                const isSelected = selectedAdminId === admin.id;
                return (
                  <motion.div
                    key={admin.id}
                    whileHover={{ y: -3 }}
                    className={`bg-white rounded-xl border p-5 transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-500 shadow-md ring-2 ring-amber-400/20'
                        : 'border-stone-200 shadow-xs hover:border-stone-300'
                    }`}
                  >
                    <div>
                      {/* Top Row: Avatar & Role */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-11 h-11 rounded-xl text-white font-bold flex items-center justify-center font-serif text-lg shadow-xs ${admin.avatarColor}`}
                          >
                            {admin.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-stone-900">
                              {admin.name}
                            </h4>
                            <div className="text-[11px] font-mono text-stone-500 truncate max-w-[170px]">
                              {admin.email}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm border shrink-0 ${
                            admin.isPrimary
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-stone-100 text-stone-800 border-stone-200'
                          }`}
                        >
                          {admin.role}
                        </span>
                      </div>

                      {/* Designation */}
                      <p className="text-xs font-medium text-stone-800 mb-3 bg-stone-50 p-2 rounded-md border border-stone-100">
                        {admin.designation}
                      </p>

                      {/* Permissions Pills */}
                      <div className="space-y-1 mb-4">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
                          Assigned Capabilities:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {admin.permissions.map((perm, pIdx) => (
                            <span
                              key={pIdx}
                              className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-xs font-mono"
                            >
                              {perm}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setSelectedAdminId(admin.id)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-amber-100 text-amber-900 font-bold'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                        }`}
                      >
                        {isSelected ? '✓ Active Session' : 'Act as this Admin'}
                      </button>

                      {!admin.isPrimary && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAdmin(admin.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Revoke Admin Access"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Statutory Signatory Trust Note */}
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between text-xs text-stone-600 font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Official Section 80G Form 10BD statements are jointly countersigned by <strong>Lavanya Gurbhele</strong>, <strong>Bhakti Kapse</strong>, <strong>Aarya Sarode</strong>, and <strong>Aastha Kelelkar</strong>.
                </span>
              </div>
              <span className="text-stone-400">CBDT Authorized</span>
            </div>
          </div>
        )}

        {/* Tab 1: Campaigns Control */}
        {activeTab === 'campaigns' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-serif font-semibold text-stone-900">
                  Cause & Campaign Management
                </h3>
                <p className="text-xs text-stone-500">
                  Full control to launch new initiatives, edit targets in ₹, adjust days left, and toggle emergency multipliers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreatingCampaign(true);
                  setEditingCampaignId(null);
                  setCampaignFormData({
                    title: '',
                    subtitle: '',
                    category: 'water',
                    categoryLabel: 'Clean Water',
                    location: 'India',
                    targetAmount: 2000000,
                    raisedAmount: 0,
                    donorCount: 0,
                    daysLeft: 30,
                    emergencyMultiplier: 1,
                    summary: '',
                    svgTheme: 'water'
                  });
                }}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Create New Campaign</span>
              </button>
            </div>

            {/* Campaign Form (Create / Edit) */}
            {(isCreatingCampaign || editingCampaignId) && (
              <form onSubmit={handleSaveCampaign} className="p-5 bg-stone-50 rounded-xl border border-stone-200 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <h4 className="text-sm font-semibold text-stone-900">
                    {isCreatingCampaign ? 'Create New Philanthropic Campaign' : 'Edit Campaign Parameters'}
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingCampaign(false);
                      setEditingCampaignId(null);
                    }}
                    className="text-xs text-stone-500 hover:text-stone-800"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Campaign Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bundelkhand Solar Groundwater Aquifers"
                      value={campaignFormData.title || ''}
                      onChange={(e) => setCampaignFormData({ ...campaignFormData, title: e.target.value })}
                      className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-md text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Location / District
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Barmer & Mahoba, India"
                      value={campaignFormData.location || ''}
                      onChange={(e) => setCampaignFormData({ ...campaignFormData, location: e.target.value })}
                      className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-md text-stone-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Subtitle / Brief Manifesto
                    </label>
                    <input
                      type="text"
                      placeholder="One-line summary for the card deck"
                      value={campaignFormData.subtitle || ''}
                      onChange={(e) => setCampaignFormData({ ...campaignFormData, subtitle: e.target.value })}
                      className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-md text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Category
                    </label>
                    <select
                      value={campaignFormData.category || 'water'}
                      onChange={(e) => {
                        const val = e.target.value as CauseCategory;
                        setCampaignFormData({
                          ...campaignFormData,
                          category: val,
                          svgTheme: val === 'all' ? 'water' : val
                        });
                      }}
                      className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-md text-stone-900"
                    >
                      <option value="water">Clean Water</option>
                      <option value="medical">Medical Care</option>
                      <option value="crisis">Crisis Relief</option>
                      <option value="ecology">Ecology & Forests</option>
                      <option value="education">Girls Education & STEM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Target Funding Goal (₹ in Rupees)
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="2500000"
                      value={campaignFormData.targetAmount || ''}
                      onChange={(e) => setCampaignFormData({ ...campaignFormData, targetAmount: Number(e.target.value) })}
                      className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-md text-stone-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Currently Raised (₹ in Rupees)
                    </label>
                    <input
                      type="number"
                      placeholder="1800000"
                      value={campaignFormData.raisedAmount || 0}
                      onChange={(e) => setCampaignFormData({ ...campaignFormData, raisedAmount: Number(e.target.value) })}
                      className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-md text-stone-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Days Remaining
                    </label>
                    <input
                      type="number"
                      value={campaignFormData.daysLeft || 30}
                      onChange={(e) => setCampaignFormData({ ...campaignFormData, daysLeft: Number(e.target.value) })}
                      className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-md text-stone-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Emergency Match Multiplier
                    </label>
                    <select
                      value={campaignFormData.emergencyMultiplier || 1}
                      onChange={(e) => setCampaignFormData({ ...campaignFormData, emergencyMultiplier: Number(e.target.value) })}
                      className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-md text-stone-900"
                    >
                      <option value={1}>1x (Standard)</option>
                      <option value={2}>2x (Emergency 2:1 Match Active)</option>
                      <option value={3}>3x (Critical Crisis Triple Match)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Realistic Field Photo URL (High-Resolution Documentary Photo)
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... or field photograph URL"
                      value={campaignFormData.imageUrl || ''}
                      onChange={(e) => setCampaignFormData({ ...campaignFormData, imageUrl: e.target.value })}
                      className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-md text-stone-900 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Detailed Field Proposal & Justification
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Comprehensive overview of ground operations, beneficiaries, and equipment."
                      value={campaignFormData.summary || ''}
                      onChange={(e) => setCampaignFormData({ ...campaignFormData, summary: e.target.value })}
                      className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-md text-stone-900"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingCampaign(false);
                      setEditingCampaignId(null);
                    }}
                    className="px-4 py-2 border border-stone-200 text-stone-600 hover:bg-stone-100 text-xs font-medium rounded-md cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isCreatingCampaign ? 'Publish Campaign' : 'Update Campaign'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Campaign Table List */}
            <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Initiative Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Target (₹)</th>
                    <th className="py-3 px-4">Raised (₹)</th>
                    <th className="py-3 px-4">Progress</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {campaigns.map((c) => {
                    const percent = Math.min(100, Math.round((c.raisedAmount / c.targetAmount) * 100));
                    return (
                      <tr key={c.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3 px-4 font-semibold text-stone-900 max-w-xs truncate">
                          {c.title}
                          {c.emergencyMultiplier && c.emergencyMultiplier > 1 && (
                            <span className="ml-1.5 text-[9px] font-mono text-amber-700 bg-amber-50 px-1 py-0.5 rounded border border-amber-200">
                              {c.emergencyMultiplier}x
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-stone-600">{c.categoryLabel}</td>
                        <td className="py-3 px-4 text-stone-600">{c.location}</td>
                        <td className="py-3 px-4 font-mono font-medium text-stone-900 tabular-nums">
                          ₹{c.targetAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-stone-900 tabular-nums">
                          ₹{c.raisedAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 font-mono text-stone-700">
                          {percent}% ({c.donorCount} donors)
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(c)}
                            className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded cursor-pointer"
                            title="Edit Campaign"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCampaign(c.id)}
                            className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded cursor-pointer"
                            title="Delete Campaign"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Donation Ledger */}
        {activeTab === 'ledger' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-serif font-semibold text-stone-900">
                  Statutory Donation Ledger & Section 80G Records
                </h3>
                <p className="text-xs text-stone-500">
                  Every transaction recorded with donor PAN, date, timestamp, and Form 10BE tax eligibility.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Export 80G Ledger (.CSV)</span>
                </button>
              </div>
            </div>

            {/* Search Filter */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by Donor Name, Email, PAN card, or Receipt ID..."
                value={ledgerSearch}
                onChange={(e) => setLedgerSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-stone-900"
              />
            </div>

            {/* Table */}
            <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Receipt #</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Donor Name</th>
                    <th className="py-3 px-4">Donor PAN (80G)</th>
                    <th className="py-3 px-4">Amount (₹)</th>
                    <th className="py-3 px-4">Payment / UPI</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {receipts
                    .filter((r) => {
                      if (!ledgerSearch) return true;
                      const q = ledgerSearch.toLowerCase();
                      return (
                        r.receiptId.toLowerCase().includes(q) ||
                        r.donorName.toLowerCase().includes(q) ||
                        r.donorEmail.toLowerCase().includes(q) ||
                        (r.donorPAN && r.donorPAN.toLowerCase().includes(q))
                      );
                    })
                    .map((r) => (
                      <tr key={r.receiptId} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-stone-900">
                          #{r.receiptId}
                        </td>
                        <td className="py-3 px-4 text-stone-500 font-mono">{r.transactionDate}</td>
                        <td className="py-3 px-4 font-medium text-stone-900">
                          {r.donorName}
                          <div className="text-[10px] text-stone-400 font-mono">{r.donorEmail}</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-stone-700">
                          {r.donorPAN ? (
                            <span className="font-semibold text-stone-900">{r.donorPAN}</span>
                          ) : (
                            <span className="text-stone-400 italic">Not Provided</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-serif font-bold text-stone-900 tabular-nums">
                          ₹{r.totalPaid.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-stone-600 font-mono text-[11px]">
                          {r.paymentMethod}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteReceipt(r.receiptId)}
                            className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Void / Delete Transaction"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  {receipts.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-stone-500 text-xs">
                        No transactions recorded yet. Make a donation in Rupees to test the ledger!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Newsletter & Field Dispatch Subscribers */}
        {activeTab === 'subscribers' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <h3 className="text-lg font-serif font-semibold text-stone-900">
                  Newsletter & Field Dispatch Subscribers
                </h3>
                <p className="text-xs text-stone-500">
                  Manage email subscribers receiving grassroots field telemetry, emergency appeals, and Section 80G tax briefs.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsAddingSubscriber(true)}
                  className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Add Subscriber</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportSubscribersCSV}
                  className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-300"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Simulated Dispatch Notification Banner */}
            {testDispatchNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 font-mono">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{testDispatchNotice}</span>
              </div>
            )}

            {/* Subscriber Metrics Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl">
                <div className="text-[11px] font-mono text-stone-500 uppercase tracking-wider">Total Enrolled</div>
                <div className="mt-1 text-2xl font-serif font-bold text-stone-900">
                  {subscribersList.length}
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">Grassroots patron base</div>
              </div>

              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                <div className="text-[11px] font-mono text-emerald-800 uppercase tracking-wider">Active Subscribers</div>
                <div className="mt-1 text-2xl font-serif font-bold text-emerald-900">
                  {subscribersList.filter((s) => s.status === 'active').length}
                </div>
                <div className="text-[11px] text-emerald-700 mt-0.5 font-medium">
                  {subscribersList.length > 0
                    ? `${Math.round((subscribersList.filter((s) => s.status === 'active').length / subscribersList.length) * 100)}% Deliverability`
                    : '100%'}
                </div>
              </div>

              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl">
                <div className="text-[11px] font-mono text-stone-500 uppercase tracking-wider">Fortnightly Dispatches</div>
                <div className="mt-1 text-2xl font-serif font-bold text-stone-900">
                  {subscribersList.filter((s) => s.preferredFrequency === 'weekly_dispatch').length}
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">High-engagement readers</div>
              </div>

              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl">
                <div className="text-[11px] font-mono text-amber-900 uppercase tracking-wider">80G Tax Alerts</div>
                <div className="mt-1 text-2xl font-serif font-bold text-amber-950">
                  {subscribersList.filter((s) => s.preferredFrequency === 'monthly_impact').length}
                </div>
                <div className="text-[11px] text-amber-800 mt-0.5">Form 10BE recipients</div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Filter by email, name, or cause tag..."
                  value={subscriberSearch}
                  onChange={(e) => setSubscriberSearch(e.target.value)}
                  className="w-full text-xs py-2 pl-8 pr-3 bg-white border border-stone-300 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-stone-500 font-mono"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-1.5 text-xs text-stone-500 font-mono">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Status:</span>
                </div>
                <select
                  value={subscriberStatusFilter}
                  onChange={(e) => setSubscriberStatusFilter(e.target.value as any)}
                  className="text-xs py-1.5 px-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-hidden font-mono"
                >
                  <option value="all">All Subscribers ({subscribersList.length})</option>
                  <option value="active">Active Only ({subscribersList.filter((s) => s.status === 'active').length})</option>
                  <option value="unsubscribed">Unsubscribed ({subscribersList.filter((s) => s.status === 'unsubscribed').length})</option>
                </select>
              </div>
            </div>

            {/* Subscribers Table */}
            <div className="border border-stone-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100/80 border-b border-stone-200 text-stone-600 font-mono text-[11px] uppercase">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Subscriber</th>
                    <th className="py-2.5 px-4 font-semibold">Cadence</th>
                    <th className="py-2.5 px-4 font-semibold">Source</th>
                    <th className="py-2.5 px-4 font-semibold">Enrolled</th>
                    <th className="py-2.5 px-4 font-semibold">Status</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {subscribersList
                    .filter((s) => {
                      if (subscriberStatusFilter !== 'all' && s.status !== subscriberStatusFilter) {
                        return false;
                      }
                      if (!subscriberSearch) return true;
                      const q = subscriberSearch.toLowerCase();
                      return (
                        s.email.toLowerCase().includes(q) ||
                        (s.name && s.name.toLowerCase().includes(q)) ||
                        (s.interests && s.interests.some((i) => i.toLowerCase().includes(q))) ||
                        s.source.toLowerCase().includes(q)
                      );
                    })
                    .map((sub) => (
                      <tr key={sub.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                              {sub.name ? sub.name.slice(0, 2).toUpperCase() : sub.email.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-mono font-medium text-stone-900">{sub.email}</div>
                              {sub.name && (
                                <div className="text-[11px] text-stone-500">{sub.name}</div>
                              )}
                              {sub.interests && sub.interests.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {sub.interests.map((tag) => (
                                    <span key={tag} className="text-[9px] font-mono px-1.5 py-0.2 bg-stone-100 text-stone-600 rounded-xs border border-stone-200">
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold ${
                              sub.preferredFrequency === 'weekly_dispatch'
                                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                : sub.preferredFrequency === 'monthly_impact'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {sub.preferredFrequency === 'weekly_dispatch'
                              ? 'Fortnightly Field Log'
                              : sub.preferredFrequency === 'monthly_impact'
                              ? 'Monthly 80G Brief'
                              : 'Disaster Appeals'}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-stone-600 font-mono text-[11px]">
                          {sub.source}
                        </td>

                        <td className="py-3 px-4 text-stone-500 font-mono text-[11px]">
                          {new Date(sub.subscribedAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>

                        <td className="py-3 px-4">
                          {sub.status === 'active' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                              <span>Active</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-200 text-stone-700">
                              <span>Unsubscribed</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleSendMockDispatch(sub.email)}
                              className="p-1.5 text-stone-500 hover:text-amber-600 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
                              title="Send Simulated Dispatch Email"
                            >
                              <SendHorizontal className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleSubscriberStatus(sub.id)}
                              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
                              title={sub.status === 'active' ? 'Mark as Unsubscribed' : 'Reactivate Subscription'}
                            >
                              {sub.status === 'active' ? (
                                <ToggleRight className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <ToggleLeft className="w-4 h-4 text-stone-400" />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteSubscriber(sub.id)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
                              title="Delete Subscriber Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                  {subscribersList.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-stone-500 text-xs">
                        No subscribers registered yet. Add one manually or test the website's subscription forms!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Manual Add Subscriber Modal */}
            {isAddingSubscriber && (
              <div className="fixed inset-0 z-60 bg-stone-950/70 flex items-center justify-center p-4">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-5 h-5 text-amber-500" />
                      <h4 className="text-base font-serif font-bold text-stone-900">Add New Subscriber</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddingSubscriber(false)}
                      className="text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleAddSubscriberSubmit} className="mt-4 space-y-4">
                    <div>
                      <label className="block text-xs font-mono text-stone-700 mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="patron@domain.in"
                        value={newSubEmail}
                        onChange={(e) => setNewSubEmail(e.target.value)}
                        className="w-full text-xs py-2.5 px-3 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-mono focus:outline-hidden focus:border-stone-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-stone-700 mb-1">
                        Full Name (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Vikramaditya Rao"
                        value={newSubName}
                        onChange={(e) => setNewSubName(e.target.value)}
                        className="w-full text-xs py-2.5 px-3 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-hidden focus:border-stone-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-stone-700 mb-1">
                        Preferred Dispatch Cadence
                      </label>
                      <select
                        value={newSubFreq}
                        onChange={(e) => setNewSubFreq(e.target.value as any)}
                        className="w-full text-xs py-2.5 px-3 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-mono focus:outline-hidden"
                      >
                        <option value="weekly_dispatch">Fortnightly Field Log (Photos & Telemetry)</option>
                        <option value="monthly_impact">Monthly 80G Brief (Audited Financials)</option>
                        <option value="critical_alerts">Urgent Disaster Appeals (Disaster Triage)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-stone-700 mb-1">
                        Topic Tags (Comma-separated)
                      </label>
                      <input
                        type="text"
                        placeholder="water, medical, ecology, csr"
                        value={newSubInterests}
                        onChange={(e) => setNewSubInterests(e.target.value)}
                        className="w-full text-xs py-2.5 px-3 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-mono focus:outline-hidden focus:border-stone-500"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingSubscriber(false)}
                        className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-semibold rounded-lg hover:bg-stone-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
                      >
                        Add to Subscriber Database
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Donor Wall Moderation */}
        {activeTab === 'moderation' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-serif font-semibold text-stone-900">
                Live Donor Wall Moderation
              </h3>
              <p className="text-xs text-stone-500">
                Review and moderate community tributes, memorials, and public messages to keep the platform respectful.
              </p>
            </div>

            <div className="space-y-3">
              {donorWall.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 bg-white border border-stone-200 rounded-xl flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-stone-900">{entry.donorName}</span>
                      <span className="text-xs font-serif font-bold text-stone-800 tabular-nums">
                        ₹{entry.amount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] font-mono text-stone-500">({entry.timestamp})</span>
                    </div>

                    {entry.tributeName && (
                      <div className="text-xs text-amber-800 font-medium mt-1">
                        {entry.tributeType === 'in_memory' ? 'In memory of ' : 'In honor of '}
                        {entry.tributeName}
                      </div>
                    )}

                    {entry.message && (
                      <p className="text-xs text-stone-600 italic mt-1 bg-stone-50 p-2 rounded-md">
                        "{entry.message}"
                      </p>
                    )}
                    <div className="text-[11px] text-stone-400 mt-1">
                      Campaign: {entry.campaignTitle}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteDonorEntry(entry.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer shrink-0"
                    title="Remove from Donor Wall"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Statutory & Trust Setup */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <h3 className="text-lg font-serif font-semibold text-stone-900">
                  Statutory Registrations & Bank Gateway
                </h3>
                <p className="text-xs text-stone-500">
                  Update your Indian Trust PAN, Section 80G approval number, NITI Aayog Darpan ID, and UPI VPA.
                </p>
              </div>
              {settingsSavedNotice && (
                <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Settings Saved Successfully</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Trust Registered Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.trustName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, trustName: e.target.value })}
                  className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-md text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Super Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={settingsForm.superAdminEmail}
                  onChange={(e) => setSettingsForm({ ...settingsForm, superAdminEmail: e.target.value })}
                  className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-md text-stone-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Trust PAN (Permanent Account Number)
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.trustPan}
                  onChange={(e) => setSettingsForm({ ...settingsForm, trustPan: e.target.value.toUpperCase() })}
                  className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-md text-stone-900 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Section 80G Registration Number (Form 10BE)
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.section80GRegNo}
                  onChange={(e) => setSettingsForm({ ...settingsForm, section80GRegNo: e.target.value })}
                  className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-md text-stone-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  NITI Aayog NGO Darpan ID
                </label>
                <input
                  type="text"
                  value={settingsForm.darpanId}
                  onChange={(e) => setSettingsForm({ ...settingsForm, darpanId: e.target.value })}
                  className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-md text-stone-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Ministry of Corporate Affairs CSR-1 Reg. No.
                </label>
                <input
                  type="text"
                  value={settingsForm.csrRegNo}
                  onChange={(e) => setSettingsForm({ ...settingsForm, csrRegNo: e.target.value })}
                  className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-md text-stone-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Designated UPI VPA ID (For Instant UPI QR & Payments)
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.upiVpa}
                  onChange={(e) => setSettingsForm({ ...settingsForm, upiVpa: e.target.value })}
                  className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-md text-stone-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Bank Account Number (NEFT/RTGS)
                </label>
                <input
                  type="text"
                  value={settingsForm.accountNumber}
                  onChange={(e) => setSettingsForm({ ...settingsForm, accountNumber: e.target.value })}
                  className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-md text-stone-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Bank IFSC Code
                </label>
                <input
                  type="text"
                  value={settingsForm.ifscCode}
                  onChange={(e) => setSettingsForm({ ...settingsForm, ifscCode: e.target.value.toUpperCase() })}
                  className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-md text-stone-900 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Bank Branch Name
                </label>
                <input
                  type="text"
                  value={settingsForm.bankBranch}
                  onChange={(e) => setSettingsForm({ ...settingsForm, bankBranch: e.target.value })}
                  className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-md text-stone-900"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4 text-amber-400" />
                <span>Save Statutory Trust Configurations</span>
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
