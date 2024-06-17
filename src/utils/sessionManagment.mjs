import { db } from '../firebase.mjs';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

export async function createSession(userId) {
  const sessionId = `session_${userId}_${new Date().getTime()}`;
  await addDoc(collection(db, 'sessions'), {
    userId: userId,
    sessionId: sessionId,
    createdAt: serverTimestamp()
  });
  localStorage.setItem('currentSessionId', sessionId);
  return sessionId;
}

export function getCurrentSession() {
  return localStorage.getItem('currentSessionId');
}

export async function endSession() {
  const sessionId = getCurrentSession();
  if (sessionId) {
    const q = query(collection(db, 'sessions'), where('sessionId', '==', sessionId));
    const sessionSnapshot = await getDocs(q);
    sessionSnapshot.forEach(async (sessionDoc) => {
      await deleteDoc(doc(db, 'sessions', sessionDoc.id));
    });
    localStorage.removeItem('currentSessionId');
  }
}
