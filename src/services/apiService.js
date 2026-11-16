// Authentication and API service adapter for KruNok AI Academy
import { COURSE, KEYS, LEGACY_KEYS, API_CONFIG, quizPassPercent } from '../data/courseData.js';
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

export const sheetsAuth = {
  async getUser() {
    LEGACY_KEYS.forEach(k => storage.remove(k));
    const u = storage.get(KEYS.user, null);
    if (!isValidUser(u)) return null;
    // ผู้ใช้ที่ login ก่อนมี session token ต้องเข้าระบบใหม่หนึ่งครั้ง
    if (!u.sessionToken) return null;
    if (u) {
      const cleanName = u.name ? u.name.trim() : (u.displayName || '').replace(/^(นาย|นางสาว|นาง|เด็กชาย|เด็กหญิง|ด\.ช\.|ด\.ญ\.|ครู)\s*/, '').split(/\s+/)[0];
      if (cleanName && u.displayName !== cleanName) {
        u.displayName = cleanName;
        storage.set(KEYS.user, u);
      }
    }
    return u;
  },

  async signIn({ username, password }) {
    const uClean = String(username || '').trim();
    const pClean = String(password || '').trim();

    if (!uClean || !pClean) {
      throw new Error('กรุณากรอกรหัสประจำตัว (Username) และรหัสผ่าน (Password)');
    }
    if (!API_CONFIG.gasEndpoint) {
      throw new Error('ยังไม่ได้กำหนด GAS Web App URL');
    }

    // ตรวจรหัสผ่านที่เซิร์ฟเวอร์เท่านั้น — ห้ามดึงชีต Users มาเทียบในเบราว์เซอร์
    let data = null;
    try {
      const res = await fetch(API_CONFIG.gasEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'login', username: uClean, password: pClean })
      });
      data = res.ok ? JSON.parse(await res.text()) : null;
    } catch (e) {
      data = null;
    }
    if (!data) {
      throw new Error('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง');
    }
    if (!data.success || !data.user || !data.user.sessionToken) {
      throw new Error(data.error || 'เข้าสู่ระบบไม่สำเร็จ');
    }

    const loggedUser = { ...data.user, signedIn: true };
    if (!storage.set(KEYS.user, loggedUser)) {
      throw new Error('STORAGE_BLOCKED');
    }
    return loggedUser;
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
  sheets: sheetsAuth,
  demo: demoAuth,
  google: googleAuth
};

export const auth = AUTH_ADAPTERS[API_CONFIG.authProvider] || sheetsAuth;

export const api = {
  isDemo: () => API_CONFIG.dataMode === 'demo' || !API_CONFIG.gasEndpoint,

  async callGas(action, payload = {}) {
    if (!API_CONFIG.gasEndpoint) {
      throw new Error('ยังไม่ได้กำหนด GAS Web App URL');
    }
    const user = storage.get(KEYS.user, null);
    const bodyObj = {
      action,
      sessionToken: user?.sessionToken || undefined,
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
    const data = await res.json();
    if (data && data.error === 'SESSION_EXPIRED') {
      // ให้รีเฟรชครั้งหน้าพาไปหน้า login; ความก้าวหน้ายังอยู่ใน localStorage
      if (user) storage.set(KEYS.user, { ...user, signedIn: false });
      throw new Error('หมดเวลาการเข้าสู่ระบบ กรุณาออกจากระบบแล้วเข้าสู่ระบบใหม่');
    }
    return data;
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

  /** ส่งความก้าวหน้าทั้งก้อนไปรวมกับข้อมูลบนเซิร์ฟเวอร์ แล้วคืนก้อนที่รวมแล้ว (null ในโหมด demo) */
  async syncProgress(progress, overallPercent) {
    if (api.isDemo()) return null;
    const resp = await api.callGas('progress/sync', { progress, overallPercent });
    if (!resp || !resp.success) throw new Error(resp?.error || 'ซิงก์ความก้าวหน้าไม่สำเร็จ');
    return resp.progress;
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
    const r = scoreQuiz(questions, answers, quizPassPercent(unitId));
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
      return api.callGas('activity/submit', { unitId, actId, score, max });
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
