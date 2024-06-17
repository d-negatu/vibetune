import { createSession, getCurrentSession, endSession } from './sessionManagement.mjs';

// Mock localStorage for testing purposes
const localStorageMock = (() => {
  let storage = {};
  return {
    setItem(key, value) {
      storage[key] = value;
    },
    getItem(key) {
      return storage[key] || null;
    },

    removeItem(key) {
      delete storage[key];
    },
    clear() {
      storage = {};
    }
  };
})();

// Replace the default localStorage with the mock
globalThis.localStorage = localStorageMock;

async function testSessionManagement() {
  try {
    // Test createSession
    const sessionId = await createSession('testUser');
    console.log('Session created with ID:', sessionId);

    // Test getCurrentSession
    const currentSessionId = getCurrentSession();
    console.log('Current session ID:', currentSessionId);

    // Test endSession
    await endSession();
    const sessionAfterEnd = getCurrentSession();
    console.log('Session after end:', sessionAfterEnd);

  } catch (e) {
    console.error('Error during session management tests:', e);
  }
}

testSessionManagement();
