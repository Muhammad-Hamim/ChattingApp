import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
  onAuthStateChanged,
  deleteUser,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import type {
  LoginCredentials,
  RegisterCredentials,
  User,
  UserData,
} from "@/types/auth";

// Register new user
export const registerUser = async (
  credentials: RegisterCredentials
): Promise<User> => {
  try {
    const { email, password, displayName } = credentials;
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update profile with display name
    await updateProfile(user, { displayName });

    // Send email verification
    await sendEmailVerification(user);

    // Create user document in Firestore
    const userData: UserData = {
      uid: user.uid,
      email: user.email!,
      displayName,
      photoURL: user.photoURL || undefined,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      emailVerified: user.emailVerified,
    };

    await setDoc(doc(db, "users", user.uid), userData);

    return {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
  } catch (error: unknown) {
    const errorCode = (error as { code?: string })?.code || "unknown";
    throw new Error(getErrorMessage(errorCode));
  }
};

// Login user
export const loginUser = async (
  credentials: LoginCredentials
): Promise<User> => {
  try {
    const { email, password } = credentials;
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update last login in Firestore
    await updateDoc(doc(db, "users", user.uid), {
      lastLogin: new Date().toISOString(),
    });

    return {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
  } catch (error: unknown) {
    const errorCode = (error as { code?: string })?.code || "unknown";
    throw new Error(getErrorMessage(errorCode));
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch {
    throw new Error("Failed to logout");
  }
};

// Get current user data from Firestore
export const getCurrentUserData = async (
  uid: string
): Promise<UserData | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        emailVerified: firebaseUser.emailVerified,
      };
      callback(user);
    } else {
      callback(null);
    }
  });
};

// Convert Firebase error codes to user-friendly messages
// Delete user account
export const deleteUserAccount = async (uid: string): Promise<void> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("No user is currently authenticated");
    }

    if (currentUser.uid !== uid) {
      throw new Error("User ID mismatch - cannot delete different user");
    }

    // First, try to delete user document from Firestore
    try {
      await deleteDoc(doc(db, "users", uid));
    } catch (firestoreError) {
      console.warn(
        "Failed to delete user document from Firestore:",
        firestoreError
      );
      // Continue with Firebase Auth deletion even if Firestore fails
    }

    // Delete user from Firebase Auth
    await deleteUser(currentUser);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    const errorCode = (error as { code?: string })?.code || "unknown";
    throw new Error(getErrorMessage(errorCode));
  }
};

const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "This email address is already registered.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/operation-not-allowed":
      return "Email/password accounts are not enabled.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/user-disabled":
      return "This user account has been disabled.";
    case "auth/user-not-found":
      return "No user found with this email address.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    default:
      return "An error occurred. Please try again.";
  }
};
