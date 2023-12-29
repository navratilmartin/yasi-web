// firebaseAuthService.ts
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

// Sign in function
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem('isAuthenticated', 'true');
    console.log('userCredential', userCredential)
    if(userCredential.user.email !== null) localStorage.setItem('userEmail', userCredential.user.email)
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in: ', error);
    throw error;
  }
};

// Sign up function
export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    localStorage.setItem('isAuthenticated', 'true');
    if(userCredential.user.email !== null) localStorage.setItem('userEmail', userCredential.user.email)
    return userCredential.user;
  } catch (error) {
    console.error('Error signing up: ', error);
    throw error;
  }
};

// Sign out function
export const signOutUser = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    } catch (error) {
    console.error('Error signing out: ', error);
    throw error;
  }
};