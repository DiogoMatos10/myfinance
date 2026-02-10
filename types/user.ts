export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  defaultCurrency: string;
  initialBalance?: number;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    dateFormat: string;
    notifications: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}
