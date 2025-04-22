export interface User {
    id: string;       // Firebase Authentication UID
    displayName: string | null;  // Can be null if not provided
    email: string | null;      // Can be null if not provided
    emailVerified: boolean;
    createdAt: Date;
  }  