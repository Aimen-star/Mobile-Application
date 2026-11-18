import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

function ensureFirebaseAuth() {
  if (!auth) {
    throw new Error(
      'Firebase is not configured yet. Add your Firebase web config to .env.local and restart the app.',
    );
  }

  return auth;
}

export function createAccount(email, password) {
  return createUserWithEmailAndPassword(ensureFirebaseAuth(), email.trim(), password);
}

export function signIn(email, password) {
  return signInWithEmailAndPassword(ensureFirebaseAuth(), email.trim(), password);
}

/*export function requestPasswordReset(email) {
  return sendPasswordResetEmail(ensureFirebaseAuth(), email.trim());
}*/

export function signOutUser() {
  return signOut(ensureFirebaseAuth());
}

export function observeAuthState(onUserChanged, onError) {
  if (typeof onUserChanged !== 'function' || typeof onError !== 'function') {
    throw new TypeError('Auth state and error callbacks are required.');
  }

  if (!auth) {
    onUserChanged(null);
    return () => undefined;
  }

  return onAuthStateChanged(auth, onUserChanged, onError);
}
