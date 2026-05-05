/**
 * Uses the firebase/auth library to manage Firebase sign-in/sign-out and
 * exposes firebaseUser, loading, error, and auth methods.
 */

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { app } from "../firebase.mjs";

const FirebaseAuthContext = createContext(null);

export function FirebaseAuthProvider({ children }) {
  const auth = useMemo(() => getAuth(app), []);

  const [firebaseUser, setFirebaseUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let unsub = () => {};

    (async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);

        unsub = onAuthStateChanged(
          auth,
          (u) => {
            setFirebaseUser(u);
            setAuthLoading(false);
            setAuthError(null);
          },
          (err) => {
            setAuthError(err);
            setFirebaseUser(null);
            setAuthLoading(false);
          }
        );
      } catch (err) {
        setAuthError(err);
        setFirebaseUser(null);
        setAuthLoading(false);
      }
    })();

    return () => unsub();
  }, [auth]);

  const signUp = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const value = useMemo(
    () => ({ 
      firebaseUser, 
      user: firebaseUser, // Alias for backward compatibility
      authLoading, 
      loading: authLoading, // Alias for backward compatibility
      authError,
      signUp,
      signIn,
      logout
    }),
    [firebaseUser, authLoading, authError]
  );

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}

export function useFirebaseAuth() {
  const ctx = useContext(FirebaseAuthContext);
  if (!ctx) throw new Error("useFirebaseAuth must be used within FirebaseAuthProvider");
  return ctx;
}



