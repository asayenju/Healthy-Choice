const mockAuth = {
    currentUser: {
      uid: 'test-uid',
      email: 'test@example.com',
      emailVerified: false,
    },
    createUserWithEmailAndPassword: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
  };
  
  export const getAuth = jest.fn(() => mockAuth);