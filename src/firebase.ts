import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  writeBatch,
  Firestore 
} from 'firebase/firestore';
import { Member, Payment, BankDeposit, SystemSettings } from './types';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export function isFirebaseConfigured(settings: SystemSettings): boolean {
  return !!(
    settings.firebaseApiKey &&
    settings.firebaseProjectId &&
    settings.firebaseAppId
  );
}

export function initFirebase(settings: SystemSettings): { app: FirebaseApp; db: Firestore } | null {
  if (!isFirebaseConfigured(settings)) {
    return null;
  }

  const firebaseConfig = {
    apiKey: settings.firebaseApiKey,
    authDomain: settings.firebaseAuthDomain,
    projectId: settings.firebaseProjectId,
    storageBucket: settings.firebaseStorageBucket,
    messagingSenderId: settings.firebaseMessagingSenderId,
    appId: settings.firebaseAppId,
  };

  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    db = getFirestore(app);
    return { app, db };
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    return null;
  }
}

export async function uploadAllToFirebase(
  settings: SystemSettings,
  members: Member[],
  payments: Payment[],
  bankDeposits: BankDeposit[]
): Promise<void> {
  const firebaseInstance = initFirebase(settings);
  if (!firebaseInstance) {
    throw new Error("Firebase is not configured properly.");
  }

  const { db } = firebaseInstance;
  
  try {
    // 1. Save Settings (save as a single document in 'settings' collection with ID 'system_config')
    const settingsDocRef = doc(db, 'settings', 'system_config');
    const { logo, founderPhoto, signature, ...otherSettings } = settings;
    
    await setDoc(settingsDocRef, {
      ...otherSettings,
      logo,
      founderPhoto,
      signature,
      updatedAt: new Date().toISOString()
    });

    // 2. Save Members in batches of 500
    const membersCollection = collection(db, 'members');
    let batch = writeBatch(db);
    let count = 0;

    for (const m of members) {
      const memberDocRef = doc(membersCollection, m.memberId);
      batch.set(memberDocRef, m);
      count++;
      if (count === 500) {
        await batch.commit();
        batch = writeBatch(db);
        count = 0;
      }
    }
    if (count > 0) {
      await batch.commit();
    }

    // 3. Save Payments in batches
    const paymentsCollection = collection(db, 'payments');
    batch = writeBatch(db);
    count = 0;

    for (const p of payments) {
      const paymentDocRef = doc(paymentsCollection, p.receiptNo);
      batch.set(paymentDocRef, p);
      count++;
      if (count === 500) {
        await batch.commit();
        batch = writeBatch(db);
        count = 0;
      }
    }
    if (count > 0) {
      await batch.commit();
    }

    // 4. Save Bank Deposits in batches
    const depositsCollection = collection(db, 'bankDeposits');
    batch = writeBatch(db);
    count = 0;

    for (const d of bankDeposits) {
      const depositDocRef = doc(depositsCollection, d.id);
      batch.set(depositDocRef, d);
      count++;
      if (count === 500) {
        await batch.commit();
        batch = writeBatch(db);
        count = 0;
      }
    }
    if (count > 0) {
      await batch.commit();
    }

    console.log("Uploaded all data successfully to Firestore!");
  } catch (err) {
    console.error("Error uploading to Firestore:", err);
    throw err;
  }
}

export async function downloadAllFromFirebase(
  settings: SystemSettings
): Promise<{
  members: Member[];
  payments: Payment[];
  bankDeposits: BankDeposit[];
  settings?: SystemSettings;
} | null> {
  const firebaseInstance = initFirebase(settings);
  if (!firebaseInstance) {
    return null;
  }

  const { db } = firebaseInstance;

  try {
    // 1. Fetch Settings
    let cloudSettings: SystemSettings | undefined;
    const settingsSnap = await getDocs(collection(db, 'settings'));
    settingsSnap.forEach((docSnap) => {
      if (docSnap.id === 'system_config') {
        cloudSettings = docSnap.data() as SystemSettings;
      }
    });

    // 2. Fetch Members
    const membersSnap = await getDocs(collection(db, 'members'));
    const members: Member[] = [];
    membersSnap.forEach((docSnap) => {
      members.push(docSnap.data() as Member);
    });

    // 3. Fetch Payments
    const paymentsSnap = await getDocs(collection(db, 'payments'));
    const payments: Payment[] = [];
    paymentsSnap.forEach((docSnap) => {
      payments.push(docSnap.data() as Payment);
    });

    // 4. Fetch Bank Deposits
    const depositsSnap = await getDocs(collection(db, 'bankDeposits'));
    const bankDeposits: BankDeposit[] = [];
    depositsSnap.forEach((docSnap) => {
      bankDeposits.push(docSnap.data() as BankDeposit);
    });

    // Sort to maintain original view sorting
    members.sort((a, b) => b.memberId.localeCompare(a.memberId));
    payments.sort((a, b) => b.receiptNo.localeCompare(a.receiptNo));
    bankDeposits.sort((a, b) => b.date.localeCompare(a.date));

    return {
      members,
      payments,
      bankDeposits,
      settings: cloudSettings
    };
  } catch (err) {
    console.error("Error downloading from Firestore:", err);
    throw err;
  }
}

export async function syncSingleItem(
  settings: SystemSettings,
  collectionName: 'members' | 'payments' | 'bankDeposits' | 'settings',
  docId: string,
  data: any
): Promise<void> {
  if (!settings.firebaseSyncEnabled) return;
  
  const firebaseInstance = initFirebase(settings);
  if (!firebaseInstance) return;

  const { db } = firebaseInstance;
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data);
    console.log(`Successfully synced single item to Firestore: ${collectionName}/${docId}`);
  } catch (err) {
    console.error(`Failed to sync single item ${collectionName}/${docId} to Firestore:`, err);
  }
}
