import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
/*
## Core Features to Build First

1. **Authentication** (Email/Password, Google Sign-in)
2. **Transaction CRUD** (Create, Read, Update, Delete)
3. **Categories** (Income/Expense categories)
4. **Dashboard** (Balance overview, recent transactions)
5. **Basic Reports** (Monthly summary, category breakdown)

## Firestore Data Structure
```
users/{userId}
  - email
  - displayName
  - createdAt

transactions/{transactionId}
  - userId
  - amount
  - type (income/expense)
  - category
  - description
  - date
  - createdAt

categories/{categoryId}
  - userId
  - name
  - type
  - icon
  - color

  */