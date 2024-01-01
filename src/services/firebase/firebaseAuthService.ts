import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem('isAuthenticated', 'true');
    if(userCredential.user.email !== null) localStorage.setItem('userEmail', userCredential.user.email)
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    localStorage.setItem('isAuthenticated', 'true');
    if(userCredential.user.email !== null) localStorage.setItem('userEmail', userCredential.user.email)
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    } catch (error) {
    throw error;
  }
};