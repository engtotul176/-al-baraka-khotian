/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Member, Payment, BankDeposit, SystemSettings } from './types';
import { 
  getInitialMembers, 
  getInitialPayments, 
  getInitialBankDeposits, 
  DEFAULT_SETTINGS 
} from './initialData';
import { exportToExcel, toBanglaDigits, formatCurrencyBangla } from './utils';
import { isFirebaseConfigured, downloadAllFromFirebase, syncSingleItem } from './firebase';

// Sub Components Imports
import DashboardSheet from './components/DashboardSheet';
import MembersSheet from './components/MembersSheet';
import PaymentEntrySheet from './components/PaymentEntrySheet';
import ReceiptSheet from './components/ReceiptSheet';
import BankDepositSheet from './components/BankDepositSheet';
import MemberLedgerSheet from './components/MemberLedgerSheet';
import ReportsSheet from './components/ReportsSheet';
import GoogleAppsScriptSheet from './components/GoogleAppsScriptSheet';
import ManualSheet from './components/ManualSheet';
import SettingsSheet from './components/SettingsSheet';

// Lucide Icons
import { 
  LayoutDashboard, 
  Users, 
  Receipt, 
  Printer, 
  Landmark, 
  FileText, 
  FileChartLine, 
  FileCode, 
  FileQuestion, 
  Settings, 
  Download, 
  Info,
  Calendar
} from 'lucide-react';

export default function App() {
  // Shared States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [bankDeposits, setBankDeposits] = useState<BankDeposit[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);

  // Focus-navigation states
  const [selectedReceiptNo, setSelectedReceiptNo] = useState('');
  const [selectedLedgerMemberId, setSelectedLedgerMemberId] = useState('');

  // Cloud Sync Status states
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Cloud Sync Function
  const syncFromCloud = async (currentSettings: SystemSettings = settings) => {
    if (!isFirebaseConfigured(currentSettings) || !currentSettings.firebaseSyncEnabled) return;
    setIsSyncing(true);
    setSyncError(null);
    try {
      const data = await downloadAllFromFirebase(currentSettings);
      if (data) {
        if (data.members.length > 0 || data.payments.length > 0 || data.bankDeposits.length > 0) {
          saveMembers(data.members);
          savePayments(data.payments);
          saveDeposits(data.bankDeposits);
        }
        if (data.settings) {
          // Merge credentials from local setting to avoid overwriting API keys on sync
          const mergedSettings: SystemSettings = {
            ...data.settings,
            firebaseApiKey: currentSettings.firebaseApiKey || data.settings.firebaseApiKey,
            firebaseAuthDomain: currentSettings.firebaseAuthDomain || data.settings.firebaseAuthDomain,
            firebaseProjectId: currentSettings.firebaseProjectId || data.settings.firebaseProjectId,
            firebaseStorageBucket: currentSettings.firebaseStorageBucket || data.settings.firebaseStorageBucket,
            firebaseMessagingSenderId: currentSettings.firebaseMessagingSenderId || data.settings.firebaseMessagingSenderId,
            firebaseAppId: currentSettings.firebaseAppId || data.settings.firebaseAppId,
            firebaseSyncEnabled: currentSettings.firebaseSyncEnabled,
          };
          saveSettings(mergedSettings);
        }
      }
    } catch (err: any) {
      console.error("Cloud auto-sync failed:", err);
      setSyncError("ক্লাউড থেকে ডাটা লোড করতে ব্যর্থ হয়েছে। আপনার ইন্টারনেট কানেকশন বা ফায়ারবেস কনফিগ চেক করুন।");
    } finally {
      setIsSyncing(false);
    }
  };

  // 1. Initialize data on Mount
  useEffect(() => {
    let activeSettings: SystemSettings = DEFAULT_SETTINGS;
    try {
      const storedMembers = localStorage.getItem('ab_members');
      const storedPayments = localStorage.getItem('ab_payments');
      const storedDeposits = localStorage.getItem('ab_deposits');
      const storedSettings = localStorage.getItem('ab_settings');

      if (storedMembers) {
        setMembers(JSON.parse(storedMembers));
      } else {
        const initM = getInitialMembers();
        setMembers(initM);
        localStorage.setItem('ab_members', JSON.stringify(initM));
      }

      if (storedPayments) {
        setPayments(JSON.parse(storedPayments));
      } else {
        const initP = getInitialPayments();
        setPayments(initP);
        localStorage.setItem('ab_payments', JSON.stringify(initP));
      }

      if (storedDeposits) {
        setBankDeposits(JSON.parse(storedDeposits));
      } else {
        const initD = getInitialBankDeposits();
        setBankDeposits(initD);
        localStorage.setItem('ab_deposits', JSON.stringify(initD));
      }

      if (storedSettings) {
        activeSettings = JSON.parse(storedSettings);
        setSettings(activeSettings);
      } else {
        setSettings(DEFAULT_SETTINGS);
        localStorage.setItem('ab_settings', JSON.stringify(DEFAULT_SETTINGS));
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }

    // Auto-sync from cloud if configured and enabled
    if (activeSettings && isFirebaseConfigured(activeSettings) && activeSettings.firebaseSyncEnabled) {
      syncFromCloud(activeSettings);
    }
  }, []);

  // 2. Persist state changes
  const saveMembers = (updated: Member[]) => {
    setMembers(updated);
    localStorage.setItem('ab_members', JSON.stringify(updated));
  };

  const savePayments = (updated: Payment[]) => {
    setPayments(updated);
    localStorage.setItem('ab_payments', JSON.stringify(updated));
  };

  const saveDeposits = (updated: BankDeposit[]) => {
    setBankDeposits(updated);
    localStorage.setItem('ab_deposits', JSON.stringify(updated));
  };

  const saveSettings = (updated: SystemSettings) => {
    setSettings(updated);
    localStorage.setItem('ab_settings', JSON.stringify(updated));
  };

  // 3. State update functions passed to sheets
  const handleAddMember = (m: Member) => {
    const updated = [m, ...members];
    saveMembers(updated);
    if (settings.firebaseSyncEnabled) {
      syncSingleItem(settings, 'members', m.memberId, m);
    }
  };

  const handleUpdateMember = (m: Member) => {
    const updated = members.map(old => old.memberId === m.memberId ? m : old);
    saveMembers(updated);
    if (settings.firebaseSyncEnabled) {
      syncSingleItem(settings, 'members', m.memberId, m);
    }
  };

  const handleAddPayment = (p: Payment) => {
    const updated = [p, ...payments];
    savePayments(updated);
    if (settings.firebaseSyncEnabled) {
      syncSingleItem(settings, 'payments', p.receiptNo, p);
    }
  };

  const handleAddBankDeposit = (b: BankDeposit) => {
    const updated = [b, ...bankDeposits];
    saveDeposits(updated);
    if (settings.firebaseSyncEnabled) {
      syncSingleItem(settings, 'bankDeposits', b.id, b);
    }
  };

  const handleUpdateSettings = (s: SystemSettings) => {
    saveSettings(s);
    if (s.firebaseSyncEnabled) {
      syncSingleItem(s, 'settings', 'system_config', s);
    }
  };

  // 4. Batch Import (for Restore from Backup)
  const handleImportData = (imported: {
    members: Member[];
    payments: Payment[];
    bankDeposits: BankDeposit[];
    settings?: SystemSettings;
  }) => {
    saveMembers(imported.members);
    savePayments(imported.payments);
    saveDeposits(imported.bankDeposits);
    if (imported.settings) {
      saveSettings(imported.settings);
    }
  };

  // 5. Database Reset Controls
  const handleRestoreDemoData = () => {
    const confirm = window.confirm("সতর্কতা: এটি করলে বর্তমান সব সদস্য ও পেমেন্ট ডাটা মুছে গিয়ে পুনরায় পূর্বনির্ধারিত ডেমো ডাটা (৩০ জন সদস্য এবং টেস্ট হিসাবসমূহ) লোড হবে। আপনি কি নিশ্চিতভাবে রিসেট করতে চান?");
    if (!confirm) return;
    
    const initM = getInitialMembers();
    const initP = getInitialPayments();
    const initD = getInitialBankDeposits();
    
    saveMembers(initM);
    savePayments(initP);
    saveDeposits(initD);
    saveSettings(DEFAULT_SETTINGS);
    
    setSelectedReceiptNo('');
    setSelectedLedgerMemberId('');
    
    alert("সফলভাবে ডেমো ডাটা রিস্টোর করা হয়েছে!");
  };

  const handleClearAllData = () => {
    const confirm = window.confirm("সতর্কতা: এটি করলে আপনার ডাটাবেজের সকল সদস্য, পেমেন্ট আদায় এবং ব্যাংক জমার রেকর্ড চিরতরে মুছে যাবে! এটি আর পুনরুদ্ধার করা সম্ভব হবে না। আপনি কি সম্পূর্ণ নতুনভাবে নিজের রিয়াল ডাটা এন্ট্রি শুরু করতে চান?");
    if (!confirm) return;
    
    saveMembers([]);
    savePayments([]);
    saveDeposits([]);
    
    setSelectedReceiptNo('');
    setSelectedLedgerMemberId('');
    
    alert("আপনার ডাটাবেজ সফলভাবে খালি করা হয়েছে! এখন আপনি নতুন সদস্য ও আদায় হিসাব এন্ট্রি শুরু করতে পারেন।");
  };

  const handleResetSettingsToDefault = () => {
    const confirm = window.confirm("আপনি কি নিশ্চিতভাবে সকল সেটিংস (ফি ও প্রতিষ্ঠানের তথ্য) ডিফল্ট মানে রিসেট করতে চান?");
    if (!confirm) return;
    
    saveSettings(DEFAULT_SETTINGS);
    alert("সেটিংস সফলভাবে ডিফল্ট মানে রিসেট করা হয়েছে!");
  };

  // Initialize receipt focus if empty and payments loaded
  useEffect(() => {
    if (!selectedReceiptNo && payments.length > 0) {
      setSelectedReceiptNo(payments[0].receiptNo);
    }
  }, [payments, selectedReceiptNo]);

  // Initialize ledger focus if empty and members loaded
  useEffect(() => {
    if (!selectedLedgerMemberId && members.length > 0) {
      setSelectedLedgerMemberId(members[0].memberId);
    }
  }, [members, selectedLedgerMemberId]);

  // Handle Export to real Excel sheet
  const handleExportExcelClick = () => {
    exportToExcel(members, payments, bankDeposits, settings);
  };

  // Tabs metadata
  const TABS_METADATA = [
    { id: 'dashboard', name: 'ড্যাশবোর্ড', icon: LayoutDashboard, color: 'border-b-emerald-800' },
    { id: 'members', name: 'সদস্য ডাটাবেজ', icon: Users, color: 'border-b-sky-700' },
    { id: 'payment', name: 'আদায় এন্ট্রি', icon: Receipt, color: 'border-b-yellow-600' },
    { id: 'receipt', name: 'প্রাপ্তির রশিদ', icon: Printer, color: 'border-b-gold' },
    { id: 'bank', name: 'ব্যাংক ডিপোজিট', icon: Landmark, color: 'border-b-blue-700' },
    { id: 'ledger', name: 'সদস্য খতিয়ান', icon: FileText, color: 'border-b-purple-700' },
    { id: 'reports', name: 'আর্থিক রিপোর্ট', icon: FileChartLine, color: 'border-b-indigo-700' },
    { id: 'script', name: 'গুগল স্ক্রিপ্ট', icon: FileCode, color: 'border-b-teal-700' },
    { id: 'manual', name: 'ব্যবহারকারী গাইড', icon: FileQuestion, color: 'border-b-amber-700' },
    { id: 'settings', name: 'সেটিংস', icon: Settings, color: 'border-b-slate-700' }
  ];

  return (
    <div id="workbook-root" className="min-h-screen bg-slate-50 flex flex-col font-sans select-none antialiased">
      {/* Top Professional Header Bar (No Print) */}
      <header className="bg-primary text-white border-b-4 border-gold shadow-md no-print px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-full border border-gold/40 p-0.5 flex items-center justify-center">
            <img 
              src={settings.logo} 
              alt="Al-Baraka Logo" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold font-sans flex items-center gap-1.5 leading-none">
              {settings.orgName} <span className="text-[10px] bg-gold text-primary font-bold px-2 py-0.5 rounded-full font-sans">স্মার্ট খতিয়ান</span>
            </h1>
            <p className="text-[10px] text-gold-light mt-1 font-sans">{settings.orgSlogan}</p>
          </div>
        </div>

        {/* Global Toolbar Action buttons */}
        <div className="flex items-center gap-2">
          {/* Main Excel Export button */}
          <button
            onClick={handleExportExcelClick}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-1 border border-emerald-600/50 shadow-sm transition-colors cursor-pointer"
            title="গুগল শিটস ও মাইক্রোসফট এক্সেল ফাইল জেনারেট করুন"
          >
            <Download size={13} className="text-gold" />
            Export to Excel (.xlsx)
          </button>
          
          <div className="text-[10px] text-gray-300 font-medium bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl hidden md:block">
            সদস্য: <strong className="text-gold font-bold">{toBanglaDigits(members.length)}</strong> | মোট আদায়: <strong className="text-gold font-bold font-mono">{formatCurrencyBangla(payments.reduce((sum, p) => sum + p.amount, 0))}</strong>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* Workbook Sheet Tabs Selector (No Print) */}
        <nav className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 no-print pb-px">
          {TABS_METADATA.map(tab => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border-b-2 border-transparent ${
                  isActive 
                    ? `bg-white text-primary shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.03)] border-b-primary font-extrabold ${tab.color}`
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <IconComp size={14} className={isActive ? 'text-gold' : 'text-slate-400'} />
                {tab.name}
              </button>
            );
          })}
        </nav>

        {/* Active Sheet Content Container */}
        <div id="sheet-viewport" className="focus:outline-none min-h-[500px]">
          {activeTab === 'dashboard' && (
            <DashboardSheet
              members={members}
              payments={payments}
              bankDeposits={bankDeposits}
              onSelectTab={setActiveTab}
              onSelectReceipt={setSelectedReceiptNo}
            />
          )}

          {activeTab === 'members' && (
            <MembersSheet
              members={members}
              onAddMember={handleAddMember}
              onUpdateMember={handleUpdateMember}
              onSelectTab={setActiveTab}
              onSelectMemberLedger={setSelectedLedgerMemberId}
            />
          )}

          {activeTab === 'payment' && (
            <PaymentEntrySheet
              members={members}
              payments={payments}
              settings={settings}
              onAddPayment={handleAddPayment}
              onSelectTab={setActiveTab}
              onSelectReceipt={setSelectedReceiptNo}
            />
          )}

          {activeTab === 'receipt' && (
            <ReceiptSheet
              payments={payments}
              members={members}
              settings={settings}
              selectedReceiptNo={selectedReceiptNo}
              onSelectReceipt={setSelectedReceiptNo}
            />
          )}

          {activeTab === 'bank' && (
            <BankDepositSheet
              bankDeposits={bankDeposits}
              payments={payments}
              onAddBankDeposit={handleAddBankDeposit}
            />
          )}

          {activeTab === 'ledger' && (
            <MemberLedgerSheet
              members={members}
              payments={payments}
              settings={settings}
              selectedMemberId={selectedLedgerMemberId}
              onSelectMemberId={setSelectedLedgerMemberId}
              onSelectTab={setActiveTab}
              onSelectReceipt={setSelectedReceiptNo}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsSheet
              members={members}
              payments={payments}
              settings={settings}
              onSelectTab={setActiveTab}
              onSelectReceipt={setSelectedReceiptNo}
              onSelectMemberLedger={setSelectedLedgerMemberId}
            />
          )}

          {activeTab === 'script' && (
            <GoogleAppsScriptSheet
              settings={settings}
            />
          )}

          {activeTab === 'manual' && (
            <ManualSheet />
          )}

          {activeTab === 'settings' && (
            <SettingsSheet
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              members={members}
              payments={payments}
              bankDeposits={bankDeposits}
              onImportData={handleImportData}
              onRestoreDemoData={handleRestoreDemoData}
              onClearAllData={handleClearAllData}
              onResetSettingsToDefault={handleResetSettingsToDefault}
              isSyncing={isSyncing}
              syncError={syncError}
              onSyncFromCloud={() => syncFromCloud(settings)}
            />
          )}
        </div>
      </main>

      {/* Footer Branding Bar (No Print) */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-[10px] text-slate-400 font-sans tracking-wide no-print flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl w-full mx-auto">
        <p>© {toBanglaDigits("২০২৬")} {settings.orgName}. সর্বস্বত্ব সংরক্ষিত।</p>
        <p className="flex items-center gap-1 justify-center">
          <Info size={12} className="text-gold" />
          রিয়েল-টাইম ডাটা ইন্টিগ্রেশন এবং লোকাল স্টোরেজ দ্বারা পরিচালিত।
        </p>
      </footer>
    </div>
  );
}
