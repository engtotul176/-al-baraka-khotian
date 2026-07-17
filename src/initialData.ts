/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Member, Payment, BankDeposit, SystemSettings } from './types';

// Standard high-fidelity vector representations of Logo, Founder, and Signature
// Stored as base64 or inline-renderable SVGs for seamless operation and customization.

export const DEFAULT_LOGO_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <circle cx="200" cy="200" r="190" fill="%23013220" stroke="%23d4af37" stroke-width="8" />
  <circle cx="200" cy="200" r="175" fill="none" stroke="%23ffffff" stroke-width="2" stroke-dasharray="8 4" />
  
  <!-- Crescent & Star -->
  <path d="M 185,45 A 30,30 0 1,0 225,85 A 25,25 0 1,1 185,45 Z" fill="%23d4af37" />
  <polygon points="212,52 215,60 223,61 217,67 219,75 212,71 205,75 207,67 201,61 209,60" fill="%23ffffff" />
  
  <!-- Arabic Text (Al-Baraka) -->
  <text x="200" y="125" font-family="'Courier New', monospace" font-size="28" font-weight="bold" fill="%23ffffff" text-anchor="middle">البركة</text>

  <!-- Trees & Buildings Vector -->
  <!-- Building Left (Light) -->
  <rect x="215" y="105" width="25" height="110" fill="%23555" opacity="0.3" />
  <!-- Buildings Right (Gold/Green accented) -->
  <rect x="220" y="90" width="30" height="120" fill="%238a9a86" />
  <rect x="255" y="110" width="25" height="100" fill="%234f5d4e" />
  <!-- Building Windows -->
  <line x1="230" y1="100" x2="230" y2="200" stroke="%23ffffff" stroke-width="2" stroke-dasharray="3 3" />
  <line x1="240" y1="100" x2="240" y2="200" stroke="%23ffffff" stroke-width="2" stroke-dasharray="3 3" />
  <line x1="265" y1="120" x2="265" y2="200" stroke="%23ffffff" stroke-width="2" stroke-dasharray="3 3" />
  
  <!-- Green Land and House -->
  <!-- Green Tree on Left -->
  <path d="M 140,210 Q 110,170 140,140 Q 170,170 140,210 Z" fill="%232e8b57" />
  <path d="M 155,200 Q 130,175 155,150 Q 180,175 155,200 Z" fill="%233cb371" />
  <rect x="138" y="195" width="5" height="25" fill="%238b4513" />
  <rect x="153" y="190" width="4" height="25" fill="%238b4513" />
  
  <!-- House Center -->
  <polygon points="150,210 190,170 230,210" fill="%23224422" stroke="%23d4af37" stroke-width="2" />
  <rect x="160" y="210" width="60" height="40" fill="%23ffffff" stroke="%23224422" stroke-width="2" />
  <!-- Door -->
  <rect x="185" y="225" width="12" height="25" fill="%238b4513" />
  <!-- Window -->
  <rect x="167" y="220" width="10" height="10" fill="%23add8e6" stroke="%23224422" />
  <rect x="203" y="220" width="10" height="10" fill="%23add8e6" stroke="%23224422" />
  
  <!-- Green Landscape Arcs -->
  <path d="M 50,240 Q 200,190 350,240 L 350,290 Q 200,240 50,290 Z" fill="%23004b23" />
  <path d="M 30,260 Q 200,210 370,260 L 370,330 Q 200,270 30,330 Z" fill="%231b4332" />

  <!-- Outer text banner holding -->
  <path d="M 90,265 L 310,265" stroke="%23d4af37" stroke-width="4" />
  
  <!-- Organization Name (Bangla) -->
  <text x="200" y="295" font-family="'Siyam Rupali', 'SolaimanLipi', Arial, sans-serif" font-size="34" font-weight="bold" fill="%23ffffff" text-anchor="middle" letter-spacing="2">আল-বারাকা</text>
  <text x="200" y="325" font-family="'Siyam Rupali', 'SolaimanLipi', Arial, sans-serif" font-size="18" font-weight="bold" fill="%23d4af37" text-anchor="middle" letter-spacing="1">― ভূমি প্রকল্প ―</text>
  
  <!-- Slogan -->
  <text x="200" y="348" font-family="'Siyam Rupali', 'SolaimanLipi', Arial, sans-serif" font-size="11" fill="%23ffffff" text-anchor="middle">একমাসে সঞ্চয়, একমাসে ক্রয়</text>
  
  <!-- Core values footer -->
  <text x="200" y="375" font-family="'Siyam Rupali', 'SolaimanLipi', Arial, sans-serif" font-size="9" fill="%23d4af37" text-anchor="middle">সততা  |  স্বচ্ছতা  |  আস্থা  |  নিশ্চয়তা</text>
  
  <!-- Decorative Stars -->
  <polygon points="105,200 108,206 115,207 110,212 111,219 105,215 99,219 100,212 95,207 102,206" fill="%23d4af37" />
  <polygon points="295,200 298,206 305,207 300,212 301,219 295,215 289,219 290,212 285,207 292,206" fill="%23d4af37" />
</svg>`;

export const DEFAULT_FOUNDER_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400">
  <defs>
    <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%231a2a6c" />
      <stop offset="100%" stop-color="%232753a7" />
    </linearGradient>
    <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="%23ffdbac" />
      <stop offset="100%" stop-color="%23f1c27d" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="300" height="400" fill="%23111827" />
  <circle cx="150" cy="140" r="100" fill="%231f2937" stroke="%23d4af37" stroke-width="2" />
  
  <!-- Body/Suit -->
  <path d="M 50,340 C 50,300 80,260 110,250 L 190,250 C 220,260 250,300 250,340 L 250,400 L 50,400 Z" fill="url(%23suitGrad)" />
  
  <!-- White Shirt -->
  <polygon points="125,250 175,250 150,290" fill="%23ffffff" />
  
  <!-- Striped Tie -->
  <polygon points="142,280 158,280 162,380 150,400 138,380" fill="%231d4ed8" stroke="%23ffffff" stroke-width="1" />
  <line x1="142" y1="290" x2="158" y2="310" stroke="%23ffffff" stroke-width="3" />
  <line x1="142" y1="310" x2="158" y2="330" stroke="%23ffffff" stroke-width="3" />
  <line x1="142" y1="330" x2="158" y2="350" stroke="%23ffffff" stroke-width="3" />
  <line x1="142" y1="350" x2="158" y2="370" stroke="%23ffffff" stroke-width="3" />
  <line x1="142" y1="370" x2="158" y2="390" stroke="%23ffffff" stroke-width="3" />
  
  <!-- Suit Lapels -->
  <polygon points="110,250 135,310 120,315" fill="%23111827" />
  <polygon points="190,250 165,310 180,315" fill="%23111827" />
  
  <!-- Neck -->
  <rect x="135" y="210" width="30" height="50" fill="url(%23skinGrad)" />
  
  <!-- Head & Ears -->
  <circle cx="115" cy="160" r="12" fill="url(%23skinGrad)" />
  <circle cx="185" cy="160" r="12" fill="url(%23skinGrad)" />
  <path d="M 115,160 C 115,100 185,100 185,160 C 185,210 115,210 115,160 Z" fill="url(%23skinGrad)" />
  
  <!-- Hair (Black, Short, Well Groomed) -->
  <path d="M 113,145 C 113,110 187,110 187,145 C 180,125 120,125 113,145 Z" fill="%231a1a1a" />
  <path d="M 113,140 Q 150,110 187,135 L 180,115 Q 150,105 120,115 Z" fill="%230c0c0c" />
  
  <!-- Beard & Mustache (Black, Trimmed) -->
  <path d="M 117,165 C 117,215 183,215 183,165 C 183,185 180,215 150,225 C 120,215 117,185 117,165 Z" fill="%231c1c1c" />
  <path d="M 135,185 Q 150,180 165,185 Q 150,195 135,185 Z" fill="%23121212" /> <!-- Mustache -->
  
  <!-- Eyes & Eyebrows -->
  <rect x="126" y="148" width="14" height="4" fill="%23121212" rx="2" />
  <rect x="160" y="148" width="14" height="4" fill="%23121212" rx="2" />
  <circle cx="133" cy="157" r="4.5" fill="%23ffffff" />
  <circle cx="167" cy="157" r="4.5" fill="%23ffffff" />
  <circle cx="133" cy="157" r="2.5" fill="%234a3728" />
  <circle cx="167" cy="157" r="2.5" fill="%234a3728" />
  <circle cx="134" cy="156" r="1" fill="%23ffffff" />
  <circle cx="168" cy="156" r="1" fill="%23ffffff" />
  
  <!-- Glasses (Black Frames, Professional) -->
  <rect x="122" y="151" width="22" height="13" fill="none" stroke="%23000000" stroke-width="2.5" rx="3" />
  <rect x="156" y="151" width="22" height="13" fill="none" stroke="%23000000" stroke-width="2.5" rx="3" />
  <line x1="144" y1="157" x2="156" y2="157" stroke="%23000000" stroke-width="3" />
  <line x1="117" y1="156" x2="122" y2="156" stroke="%23000000" stroke-width="2" />
  <line x1="178" y1="156" x2="183" y2="156" stroke="%23000000" stroke-width="2" />

  <!-- Nose & Mouth -->
  <path d="M 147,165 Q 150,178 153,165" fill="none" stroke="%23d09a5c" stroke-width="2.5" stroke-linecap="round" />
  <path d="M 142,192 Q 150,198 158,192" fill="none" stroke="%23ffffff" stroke-width="1.5" />
</svg>`;

export const DEFAULT_SIGNATURE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100">
  <path d="M 20,60 C 40,30 45,20 50,45 C 55,70 65,80 70,55 C 75,30 80,40 85,50 C 90,60 100,65 110,45 C 120,25 125,75 130,60 C 135,45 145,40 155,50 L 175,55 M 35,50 L 55,25 M 65,55 L 140,55 C 160,55 180,65 160,70 C 140,75 80,75 90,72" fill="none" stroke="%23000000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;

export const INITIAL_MEMBERS_RAW = [
  { sNo: 1, name: "প্রকৌশলী মোঃ তানভীন আহমেদ টুটুল", mobile: "01672965561" },
  { sNo: 2, name: "মোঃ রুমান", mobile: "01735449806" },
  { sNo: 3, name: "মোঃ মাহমুদুল হক (সোহেল)", mobile: "0172284662" },
  { sNo: 4, name: "প্রকৌশলী মোঃ মাহমুদুল হাসান (মাসুম)", mobile: "01710335567" },
  { sNo: 5, name: "রাকিবুল হাসান (শিপন)", mobile: "01911919786" },
  { sNo: 6, name: "মোঃ আরমান হোসেন", mobile: "01701633900" },
  { sNo: 7, name: "জাকির হোসেন তালুকদার", mobile: "01753477371" },
  { sNo: 8, name: "প্রকৌশলী খন্দকার মাহবুবুল ইসলাম (রুবেল)", mobile: "01740062064" },
  { sNo: 9, name: "প্রকৌশলী আব্দুল্লাহ আল-আমিন", mobile: "01675889289" },
  { sNo: 10, name: "আরাফাত মিয়া", mobile: "+6583538114" },
  { sNo: 11, name: "প্রকৌশলী নাজমুল হুদা", mobile: "01736111176" },
  { sNo: 12, name: "সানি", mobile: "01316043100" },
  { sNo: 13, name: "তৌফাইল হোসেন", mobile: "01711482922" },
  { sNo: 14, name: "প্রকৌশলী এমামুল", mobile: "01309002170" },
  { sNo: 15, name: "আলআমিন", mobile: "01768731721" },
  { sNo: 16, name: "ফিরোজ আহমেদ", mobile: "01719370435" },
  { sNo: 17, name: "মোহাম্মদ আসরাফুল ইসলাম", mobile: "01719072785" },
  { sNo: 18, name: "মোঃ মাহবুব আলম (নাজমুল)", mobile: "01911169184" },
  { sNo: 19, name: "সামি", mobile: "01905841894" },
  { sNo: 20, name: "মোঃ আব্দুল কালাম আজাদ", mobile: "01724694195" },
  { sNo: 21, name: "আব্দুল্লাহ আল মামুন (শিবলু)", mobile: "01677169099" },
  { sNo: 22, name: "শাহীন ভাই", mobile: "01758293694" },
  { sNo: 23, name: "তাজউদ্দিন ফকির", mobile: "01975792592" },
  { sNo: 24, name: "পারভেজ", mobile: "01761115117" },
  { sNo: 25, name: "মোমেন", mobile: "01770449090" },
  { sNo: 26, name: "প্রকৌশলী রুকন", mobile: "01716661744" },
  { sNo: 27, name: "আমিনুল", mobile: "01783812285" },
  { sNo: 28, name: "রাকিবুল ভাই", mobile: "01793351833" },
  { sNo: 29, name: "শামীম", mobile: "01782213445" },
  { sNo: 30, name: "প্রকৌশলী ওমর ফারুক", mobile: "01642556819" }
];

export const getInitialMembers = (): Member[] => {
  return INITIAL_MEMBERS_RAW.map((m) => {
    const paddedId = String(m.sNo).padStart(2, '0');
    return {
      memberId: `AB-${paddedId}`,
      name: m.name,
      fatherName: "মোঃ রহমান আলী",
      motherName: "মোসাম্মৎ আমেনা খাতুন",
      mobile: m.mobile,
      whatsapp: m.mobile.startsWith('+') ? m.mobile : `+88${m.mobile}`,
      nid: `461829${m.sNo}03192`,
      birthDate: "1990-01-01",
      address: "ঢাকা, বাংলাদেশ",
      profession: m.name.includes("প্রকৌশলী") ? "প্রকৌশলী (Engineer)" : "ব্যবসা (Business)",
      joiningDate: "2026-01-01",
      nominee: "মোসাম্মৎ সালমা বেগম",
      nomineeMobile: m.mobile,
      photo: DEFAULT_FOUNDER_SVG,
      status: 'Active',
      remarks: "প্রতিষ্ঠাতা সদস্য"
    };
  });
};

export const getInitialPayments = (): Payment[] => {
  const months = ["January", "February", "March", "April", "May", "June"];
  const payments: Payment[] = [];
  let receiptCounter = 1;

  // Let's create registration fee payments for all 30 members to give us an initial pool of money
  INITIAL_MEMBERS_RAW.forEach((m, idx) => {
    const paddedId = String(m.sNo).padStart(2, '0');
    const memberId = `AB-${paddedId}`;
    
    // Registration Fee for everyone
    payments.push({
      receiptNo: `AB-2026-${String(receiptCounter++).padStart(4, '0')}`,
      memberId,
      memberName: m.name,
      month: "January",
      year: 2026,
      paymentType: "Registration Fee",
      amount: 1000,
      entryDate: "2026-01-05",
      remarks: "রেজিস্ট্রেশন ফি পরিশোধ"
    });

    // Add some monthly deposits for active months to make reports live and beautiful!
    if (idx < 20) {
      // Members 1 to 20 paid Jan, Feb, Mar, Apr, May
      months.forEach((month, mIdx) => {
        payments.push({
          receiptNo: `AB-2026-${String(receiptCounter++).padStart(4, '0')}`,
          memberId,
          memberName: m.name,
          month,
          year: 2026,
          paymentType: "Monthly Deposit",
          amount: 2000,
          entryDate: `2026-0${mIdx + 1}-10`,
          remarks: `${month} মাসের মাসিক সঞ্চয়`
        });
      });
    } else {
      // Members 21 to 30 paid only Jan, Feb (they are currently due!)
      ["January", "February"].forEach((month, mIdx) => {
        payments.push({
          receiptNo: `AB-2026-${String(receiptCounter++).padStart(4, '0')}`,
          memberId,
          memberName: m.name,
          month,
          year: 2026,
          paymentType: "Monthly Deposit",
          amount: 2000,
          entryDate: `2026-0${mIdx + 1}-10`,
          remarks: `${month} মাসের মাসিক সঞ্চয়`
        });
      });
    }
    
    // Give some people meeting fees & fines
    if (idx % 5 === 0) {
      payments.push({
        receiptNo: `AB-2026-${String(receiptCounter++).padStart(4, '0')}`,
        memberId,
        memberName: m.name,
        month: "March",
        year: 2026,
        paymentType: "Meeting Fee",
        amount: 100,
        entryDate: "2026-03-15",
        remarks: "সাধারণ সভা ফি"
      });
    }
    if (idx % 7 === 0) {
      payments.push({
        receiptNo: `AB-2026-${String(receiptCounter++).padStart(4, '0')}`,
        memberId,
        memberName: m.name,
        month: "April",
        year: 2026,
        paymentType: "Fine",
        amount: 50,
        entryDate: "2026-04-20",
        remarks: "বিলম্ব জরিমানা"
      });
    }
  });

  return payments;
};

export const getInitialBankDeposits = (): BankDeposit[] => {
  return [
    {
      id: "BD-0001",
      date: "2026-01-20",
      bankName: "ইসলামী ব্যাংক বাংলাদেশ লিমিটেড",
      branch: "মিরপুর শাখা",
      amount: 45000,
      slipNumber: "SL-92817",
      reference: "ব্যাংক জমা - জানুয়ারি সঞ্চয়",
      remarks: "মাসিক সভার সিদ্ধান্ত মোতাবেক জমা"
    },
    {
      id: "BD-0002",
      date: "2026-03-10",
      bankName: "ইসলামী ব্যাংক বাংলাদেশ লিমিটেড",
      branch: "মিরপুর শাখা",
      amount: 60000,
      slipNumber: "SL-94012",
      reference: "ব্যাংক জমা - ফেব্রুয়ারি ও মার্চ",
      remarks: "সাধারণ তহবিল স্থানান্তর"
    },
    {
      id: "BD-0003",
      date: "2026-05-15",
      bankName: "ইসলামী ব্যাংক বাংলাদেশ লিমিটেড",
      branch: "মিরপুর শাখা",
      amount: 80000,
      slipNumber: "SL-96120",
      reference: "ব্যাংক জমা - এপ্রিল ও মে",
      remarks: "সঞ্চয় তহবিল স্থানান্তর"
    }
  ];
};

export const DEFAULT_SETTINGS: SystemSettings = {
  monthlyAmount: 2000,
  registrationFee: 1000,
  meetingFee: 100,
  fine: 50,
  orgName: "আল-বারাকা ভূমি প্রকল্প",
  orgSlogan: "একমাসে সঞ্চয়, একমাসে ক্রয়",
  orgMobile: "01672965561",
  orgEmail: "albarakaland@gmail.com",
  orgAddress: "মিরপুর, ঢাকা, বাংলাদেশ",
  founderName: "প্রকৌশলী মোঃ তানভীন আহমেদ টুটুল",
  founderMobile: "01672965561",
  founderDesignation: "প্রতিষ্ঠাতা ও স্বপ্নদ্রষ্টা",
  logo: DEFAULT_LOGO_SVG,
  founderPhoto: DEFAULT_FOUNDER_SVG,
  signature: DEFAULT_SIGNATURE_SVG,
  firebaseApiKey: "",
  firebaseAuthDomain: "",
  firebaseProjectId: "",
  firebaseStorageBucket: "",
  firebaseMessagingSenderId: "",
  firebaseAppId: "",
  firebaseSyncEnabled: false
};
