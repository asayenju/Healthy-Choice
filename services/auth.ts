import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebaseConfig";

export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    try {
        // 1. Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. save additional user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            displayName: displayName || null,
            emailVerified: user.emailVerified || false,
            createdAt: new Date(),
        })

        console.log("User created & saved to Firestore:", user.uid);
        return user;
    } catch (error) {
        console.log("Error during signup:", error);
        throw error
    }
}

export const signInWithEmail = async (email: string, password: string) => {
    try {
        // 1. sign in with firebase auth
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. fetch additional user data from firestore
        const userDoc = await getDoc(doc(db, "user", user.uid));

        //check if user exists in firestore
        if (!userDoc.exists()) {
            throw new Error("User not found in Firestore");
        }

        const userData = userDoc.data();
        
        console.log("signed in successfully!", {
            authUser: user,
            firestoreUser: userData
        });
        return {user, userData};
        
    } catch (error) {
        console.log("Sign-in Failed:", error);
        throw error;
    }
}