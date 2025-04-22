// __tests__/auth.test.ts
import { signUpWithEmail, signInWithEmail } from '../services/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebaseConfig";

// Mock Firebase Auth module
jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
}));

// Mock Firebase Firestore module
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
}));

// Mock the firebaseConfig module
jest.mock("@/config/firebaseConfig", () => ({
  auth: {},
  db: {},
}));

describe('Auth Functions', () => {
  beforeEach(() => {
    // Clear mocks before each test
    (createUserWithEmailAndPassword as jest.Mock).mockClear();
    (signInWithEmailAndPassword as jest.Mock).mockClear();
    (setDoc as jest.Mock).mockClear();
    (getDoc as jest.Mock).mockClear();
  });

  describe('signUpWithEmail', () => {
    it('should create a user and save data to Firestore', async () => {
      // Arrange
      const mockUserCredential = { user: { uid: 'test-uid', emailVerified: true } };
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);
      (setDoc as jest.Mock).mockResolvedValue(undefined); // setDoc returns void (Promise<void>)

      const email = 'test@example.com';
      const password = 'password123';
      const displayName = 'Test User';

      // Act
      const user = await signUpWithEmail(email, password, displayName);

      // Assert
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, email, password);
      expect(setDoc).toHaveBeenCalledWith(doc(db, "users", 'test-uid'), {
        id: 'test-uid',
        displayName: displayName,
        emailVerified: true,
        createdAt: expect.any(Date),
      });
      expect(user).toEqual(mockUserCredential.user);
    });

    it('should handle errors during signup', async () => {
      // Arrange
      const mockError = new Error('Signup failed');
      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(mockError);

      const email = 'test@example.com';
      const password = 'password123';
      const displayName = 'Test User';

      // Act & Assert
      await expect(signUpWithEmail(email, password, displayName)).rejects.toThrow(mockError);
    });
  });

  describe('signInWithEmail', () => {
    it('should sign in a user and fetch data from Firestore', async () => {
      // Arrange
      const mockUserCredential = { user: { uid: 'test-uid' } };
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);

      const mockUserData = { displayName: 'Test User', emailVerified: true };
      (getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        data: () => mockUserData,
      });

      const email = 'test@example.com';
      const password = 'password123';

      // Act
      const { user, userData } = await signInWithEmail(email, password);

      // Assert
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, email, password);
      expect(getDoc).toHaveBeenCalledWith(doc(db, "user", 'test-uid'));
      expect(user).toEqual(mockUserCredential.user);
      expect(userData).toEqual(mockUserData);
    });

    it('should handle errors during signin', async () => {
      // Arrange
      const mockError = new Error('Signin failed');
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(mockError);

      const email = 'test@example.com';
      const password = 'password123';

      // Act & Assert
      await expect(signInWithEmail(email, password)).rejects.toThrow(mockError);
    });
  });
});
