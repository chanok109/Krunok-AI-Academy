// Authentication and API service adapter for KruNok AI Academy
import { COURSE, KEYS, LEGACY_KEYS, API_CONFIG } from '../data/courseData.js';
import { storage } from './storageService.js';

export function isValidUser(u) {
  return (
    !!u &&
    typeof u.displayName === 'string' &&
    u.displayName.trim().length >= 2 &&
    COURSE.classrooms.includes(u.classroom) &&
    u.mode === 'demo'
  );
}

export const demoAuth = {
  async getUser() {
    LEGACY_KEYS.forEach(k => storage.remove(k));
    const u = storage.get(KEYS.user, null);
    return isValidUser(u) ? u : null;
  },
  async signIn({ displayName, classroom }) {
    const user = {
      displayName: displayName.trim(),
      classroom,
      mode: 'demo',
      joinedAt: new Date().toISOString(),
      signedIn: true
    };
    if (!storage.set(KEYS.user, user)) throw new Error('STORAGE_BLOCKED');
    return user;
  },
  async resume(user) {
    const next = {
      ...user,
      signedIn: true
    };
    if (!storage.set(KEYS.user, next)) throw new Error('STORAGE_BLOCKED');
    return next;
  },
  async signOut(user) {
    const next = {
      ...user,
      signedIn: false
    };
    storage.set(KEYS.user, next);
    return next;
  },
  async forget() {
    storage.remove(KEYS.user);
    storage.remove(KEYS.progress);
  }
};

export const AUTH_ADAPTERS = {
  demo: demoAuth
};

export const auth = AUTH_ADAPTERS[API_CONFIG.authProvider] || demoAuth;

export const api = {
  isDemo: () => API_CONFIG.dataMode === 'demo' || !API_CONFIG.gasEndpoint,
  async loadProgress() {
    return storage.get(KEYS.progress, null);
  },
  async saveProgress(p) {
    return storage.set(KEYS.progress, p);
  },
  async clearProgress() {
    storage.remove(KEYS.progress);
  }
};
