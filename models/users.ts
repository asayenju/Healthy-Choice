export interface User {
    id: string;       // Firebase Authentication UID
    displayName: string | null;  // Can be null if not provided
    email: string | null;      // Can be null if not provided
    photoURL?: string;  // Optional profile picture URL
    emailVerified: boolean;
    createdAt: Date;
  }  