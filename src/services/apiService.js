// Authentication and API service adapter for KruNok AI Academy
import { COURSE, KEYS, LEGACY_KEYS, API_CONFIG } from '../data/courseData.js';
import { storage } from './storageService.js';
import { scoreQuiz } from './quizService.js';

export function isValidUser(u) {
  if (!u || typeof u.displayName !== 'string' || u.displayName.trim().length < 2) {
    return false;
  }
  // User role can be STUDENT, TEACHER, or ADMIN
  const role = u.role || (u.mode === 'demo' ? 'STUDENT' : 'STUDENT');
  if (role === 'TEACHER' || role === 'ADMIN') {
    return true;
  }
  // Students must belong to one of the course classrooms
  return COURSE.classrooms.includes(u.classroom);
}

export const demoAuth = {
  async getUser() {
    LEGACY_KEYS.forEach(k => storage.remove(k));
    const u = storage.get(KEYS.user, null);
    return isValidUser(u) ? u : null;
  },
  async signIn({ displayName, classroom, role = 'STUDENT' }) {
    const user = {
      id: 'demo-' + Math.random().toString(36).slice(2, 9),
      userId: 'USR-DEMO-' + Math.random().toString(36).slice(2, 7),
      displayName: displayName.trim(),
      email: `${displayName.trim().toLowerCase().replace(/\s+/g, '')}@student.pcccr.ac.th`,
      classroom,
      role: role.toUpperCase(),
      status: 'ACTIVE',
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

export const googleAuth = {
  async getUser() {
    const u = storage.get(KEYS.user, null);
    return isValidUser(u) ? u : null;
  },
  async signInWithToken({ idToken, classroom, displayName }) {
    if (!API_CONFIG.gasEndpoint) {
      throw new Error('ยังไม่ได้ระบุ Google Apps Script Web App URL');
    }
    const res = await api.callGas('auth/verify', {
      idToken,
      classroom,
      displayName
    });
    if (!res || !res.success || !res.user) {
      throw new Error(res?.error || 'การยืนยันตัวตนด้วย Google ล้มเหลว');
    }
    const user = {
      ...res.user,
      id: res.user.userId,
      idToken,
      mode: 'google',
      signedIn: true,
      lastLogin: new Date().toISOString()
    };
    storage.set(KEYS.user, user);
    return user;
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
  demo: demoAuth,
  google: googleAuth
};

export const auth = AUTH_ADAPTERS[API_CONFIG.authProvider] || demoAuth;

export const api = {
  isDemo: () => API_CONFIG.dataMode === 'demo' || !API_CONFIG.gasEndpoint,

  async callGas(action, payload = {}) {
    if (!API_CONFIG.gasEndpoint) {
      throw new Error('ยังไม่ได้กำหนด GAS Web App URL');
    }
    const user = storage.get(KEYS.user, null);
    const bodyObj = {
      action,
      idToken: user?.idToken || (user?.mode === 'demo' ? `DEMO_MOCK_TOKEN:${user.id}:${user.email || 'demo@pcccr.ac.th'}:${user.displayName}` : ''),
      ...payload
    };

    const res = await fetch(API_CONFIG.gasEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(bodyObj)
    });

    if (!res.ok) {
      throw new Error(`Google Apps Script Server Error: ${res.statusText}`);
    }
    return await res.json();
  },

  async loadProgress() {
    return storage.get(KEYS.progress, null);
  },

  async saveProgress(p) {
    return storage.set(KEYS.progress, p);
  },

  async clearProgress() {
    storage.remove(KEYS.progress);
  },

  /**
   * ส่งและตรวจข้อสอบ (Server-Side Quiz Grading)
   * เมื่ออยู่ในโหมด Production: ส่งไปยัง Google Apps Script ให้ตรวจคะแนนที่เซิร์ฟเวอร์
   * เมื่ออยู่ในโหมด Demo: จำลองการตรวจฝั่งไคลเอนต์ด้วยรูปแบบผลลัพธ์เดียวกัน
   */
  async submitQuiz(unitId, answers, durationSeconds, attemptId, questions = []) {
    if (!api.isDemo()) {
      const resp = await api.callGas('quiz/submit', {
        unitId,
        answers,
        durationSeconds,
        attemptId
      });
      if (!resp || !resp.success) {
        throw new Error(resp?.error || 'บันทึกคะแนนข้อสอบไม่สำเร็จ');
      }
      return resp.result;
    }

    // Demo Mode fallback
    const r = scoreQuiz(questions, answers);
    return {
      duplicate: false,
      attemptId,
      score: r.correct,
      maxScore: r.total,
      percentage: r.percent,
      passed: r.passed,
      durationSeconds,
      submittedAt: new Date().toISOString()
    };
  },

  /**
   * บันทึกการจบบทเรียน
   */
  async saveLesson(unitId, lessonId) {
    if (!api.isDemo()) {
      return api.callGas('progress/saveLesson', { unitId, lessonId });
    }
    return { success: true };
  },

  /**
   * บันทึกคะแนนกิจกรรม Lab
   */
  async saveActivity(unitId, actId, score, max) {
    if (!api.isDemo()) {
      return api.callGas('progress/saveActivity', { unitId, actId, score, max });
    }
    return { success: true };
  },

  /**
   * ส่งข้อเสนอโครงงาน Capstone
   */
  async submitProject(projectData) {
    if (!api.isDemo()) {
      return api.callGas('project/submit', projectData);
    }
    return { success: true, projectId: 'PRJ-DEMO-' + Date.now() };
  },

  /**
   * ดึงข้อมูลรายชื่อนักเรียนและคะแนนสำหรับครูผู้สอน
   */
  async getTeacherRoster(classroom = 'all') {
    if (!api.isDemo()) {
      return api.callGas('teacher/getRoster', { classroom });
    }
    // Return null in Demo Mode to use local mock data
    return null;
  },

  /**
   * ครูประเมินโครงงานและให้ข้อเสนอแนะ
   */
  async assessStudentProject(assessmentData) {
    if (!api.isDemo()) {
      return api.callGas('teacher/assessProject', assessmentData);
    }
    return { success: true, assessmentId: 'ASM-DEMO-' + Date.now() };
  },

  /**
   * สถิติภาพรวมชั้นเรียน
   */
  async getTeacherAnalytics() {
    if (!api.isDemo()) {
      return api.callGas('teacher/getAnalytics', {});
    }
    return null;
  }
};
