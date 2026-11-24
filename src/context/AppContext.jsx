import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { UNITS, KEYS } from '../data/courseData.js';
import { storage } from '../services/storageService.js';
import { auth, api } from '../services/apiService.js';
import { dayKey } from '../services/visitStats.js';
import {
  emptyProgress,
  normalizeProgress,
  unitPercent,
  buildSummary,
  quizBest,
  quizPassed,
  KIND_FIELD
} from '../services/quizService.js';

export const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
  const [status, setStatus] = useState('loading');
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(emptyProgress);
  const [toasts, setToasts] = useState([]);
  const student = user && user.signedIn ? user : null;

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [u, p] = await Promise.all([auth.getUser(), api.loadProgress()]);
        if (!alive) return;
        setUser(u);
        setProgress(normalizeProgress(p));
        setStatus('ready');
      } catch (e) {
        if (alive) setStatus('error');
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const notify = useCallback(t => {
    const id = Math.random().toString(36).slice(2);
    setToasts(xs => [...xs, { id, type: 'info', ...t }]);
    setTimeout(() => setToasts(xs => xs.filter(x => x.id !== id)), t.duration || 4200);
  }, []);

  const dismiss = useCallback(id => setToasts(xs => xs.filter(x => x.id !== id)), []);
  const warnedRef = useRef(false);

  // --- ซิงก์ความก้าวหน้ากับเซิร์ฟเวอร์ (เซิร์ฟเวอร์เป็นคนรวมข้อมูลหลายเครื่อง) ---
  const progressRef = useRef(progress);
  const versionRef = useRef(0); // เพิ่มทุกครั้งที่แก้ในเครื่อง
  const syncedVersionRef = useRef(0); // versionRef ล่าสุดที่เซิร์ฟเวอร์ได้รับแล้ว
  const syncTimerRef = useRef(null);
  const syncWarnedRef = useRef(false);

  const syncNow = useCallback(async () => {
    clearTimeout(syncTimerRef.current);
    const u = storage.get(KEYS.user, null);
    if (!u || !u.signedIn || !u.sessionToken || api.isDemo()) return;
    const sentVersion = versionRef.current;
    const local = progressRef.current;
    try {
      const server = await api.syncProgress(local, buildSummary(local).overall);
      syncWarnedRef.current = false;
      syncedVersionRef.current = sentVersion;
      if (!server) return;
      if (versionRef.current !== sentVersion) {
        // มีการแก้ระหว่างรอ: ส่งใหม่ แทนที่จะเขียนทับของที่เพิ่งทำ
        syncTimerRef.current = setTimeout(syncNow, 1000);
        return;
      }
      const next = normalizeProgress(server);
      progressRef.current = next;
      setProgress(next);
      api.saveProgress(next);
    } catch (e) {
      if (!syncWarnedRef.current) {
        syncWarnedRef.current = true;
        notify({
          type: 'error',
          title: 'ยังบันทึกความก้าวหน้าขึ้นเซิร์ฟเวอร์ไม่ได้',
          message: `${e.message} — ข้อมูลยังอยู่ในเครื่องนี้ และจะลองส่งใหม่อัตโนมัติ`,
          duration: 8000
        });
      }
    }
  }, [notify]);

  const scheduleSync = useCallback(() => {
    clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(syncNow, 3000);
  }, [syncNow]);

  useEffect(() => {
    const onOnline = () => syncNow();
    const onHide = () => document.visibilityState === 'hidden' && syncNow();
    window.addEventListener('online', onOnline);
    document.addEventListener('visibilitychange', onHide);
    return () => {
      window.removeEventListener('online', onOnline);
      document.removeEventListener('visibilitychange', onHide);
    };
  }, [syncNow]);

  useEffect(() => {
    const onStorage = e => {
      if (e.key === KEYS.progress) setProgress(normalizeProgress(storage.get(KEYS.progress, null)));
      if (e.key === KEYS.user) auth.getUser().then(setUser);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const commit = useCallback(
    updater => {
      setProgress(prev => {
        const next = updater(structuredClone(prev));
        next.updatedAt = new Date().toISOString();
        progressRef.current = next;
        versionRef.current += 1;
        scheduleSync();
        api.saveProgress(next).then(ok => {
          if (!ok && !warnedRef.current) {
            warnedRef.current = true;
            notify({
              type: 'error',
              title: 'บันทึกความก้าวหน้าไม่สำเร็จ',
              message: 'เบราว์เซอร์นี้อาจปิดการเก็บข้อมูลหรือพื้นที่เต็ม ความก้าวหน้าล่าสุดอาจหายเมื่อปิดหน้า',
              duration: 8000
            });
          }
          if (ok) warnedRef.current = false;
        });
        return next;
      });
    },
    [notify, scheduleSync]
  );

  // ให้ syncNow ส่งค่าล่าสุดเสมอ (รวมกรณีโหลดครั้งแรก/login/แท็บอื่นแก้)
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    if (status === 'ready') syncNow();
  }, [status, syncNow]);

  const markItem = useCallback(
    (unitId, kind, itemId, done = true) => {
      commit(p => {
        const u = p[unitId],
          field = KIND_FIELD[kind];
        if (!u || !field) return p;
        const set = new Set(u[field]);
        done ? set.add(itemId) : set.delete(itemId);
        u[field] = [...set];
        u.updatedAt = new Date().toISOString();
        u.completed = unitPercent(UNITS.find(x => x.id === unitId), u) === 100;
        return p;
      });
    },
    [commit]
  );

  const recordQuiz = useCallback(
    (unitId, result) => {
      commit(p => {
        const u = p[unitId];
        if (!u) return p;
        const entry = {
          correct: result.correct,
          total: result.total,
          percent: result.percent,
          passed: result.passed,
          at: new Date().toISOString()
        };
        if (typeof result.durationSec === 'number') entry.durationSec = result.durationSec;
        u.quizAttempts = [...u.quizAttempts, entry].slice(-20);
        u.updatedAt = entry.at;
        u.completed = unitPercent(UNITS.find(x => x.id === unitId), u) === 100;
        return p;
      });
    },
    [commit]
  );

  const login = useCallback(async (credentials) => {
    const prev = storage.get(KEYS.user, null);
    const u = await auth.signIn(credentials);
    // เครื่องใช้ร่วมกัน: ความก้าวหน้าในเครื่องเป็นของคนก่อน ห้ามนำไปรวมกับบัญชีนี้
    const sameOwner = prev && String(prev.userId) === String(u.userId);
    const p = sameOwner ? normalizeProgress(await api.loadProgress()) : emptyProgress();
    await api.saveProgress(p);
    progressRef.current = p;
    setProgress(p);
    setUser(u);
    syncNow();
    return u;
  }, [syncNow]);

  // ออกทันที ไม่ต้องรอเซิร์ฟเวอร์: ถ้ามีของค้างให้เบราว์เซอร์ส่งตามหลังเอง
  const logout = useCallback(async () => {
    if (!user) return;
    clearTimeout(syncTimerRef.current);
    if (versionRef.current !== syncedVersionRef.current && user.sessionToken) {
      const local = progressRef.current;
      api.sendProgressInBackground(local, buildSummary(local).overall);
    }
    setUser(await auth.signOut(user));
  }, [user]);

  const resetProgress = useCallback(async () => {
    await api.clearProgress();
    setProgress(emptyProgress());
  }, []);

  const saveActivity = useCallback(
    (unitId, actId, score, max) => {
      commit(p => {
        const u = p[unitId];
        if (!u) return p;
        const at = new Date().toISOString();
        const prev = u.activityScores[actId];
        u.activityScores = {
          ...u.activityScores,
          [actId]: {
            best: Math.max(score, prev ? prev.best : 0),
            last: score,
            // ผลรวมทุกครั้งที่ทำ ใช้หาค่าเฉลี่ย (shortcut: ข้อมูลเก่าไม่มี sum จึงประมาณจาก best × attempts)
            sum: (prev ? (prev.sum != null ? prev.sum : prev.best * prev.attempts) : 0) + score,
            max,
            attempts: (prev ? prev.attempts : 0) + 1,
            at
          }
        };
        if (!u.completedActivities.includes(actId)) u.completedActivities = [...u.completedActivities, actId];
        u.updatedAt = at;
        u.completed = unitPercent(UNITS.find(x => x.id === unitId), u) === 100;
        return p;
      });
      // บันทึกคะแนนรอบนี้ลงชีต ScoreLog ให้ครู (คะแนนสูงสุดยังอยู่ในความก้าวหน้าที่ซิงก์อยู่แล้ว)
      api.saveActivity(unitId, actId, score, max).then(
        r => {
          if (r && r.success === false) throw new Error(r.error);
        }
      ).catch(e =>
        notify({
          type: 'error',
          title: 'ส่งคะแนนมินิเกมให้ครูไม่สำเร็จ',
          message: `${e.message || e} — ลองเล่นด่านนี้ใหม่อีกครั้งเมื่อเชื่อมต่อได้`,
          duration: 8000
        })
      );
    },
    [commit, notify]
  );

  const saveProject = useCallback(
    project => {
      commit(p => {
        const u = p.unit4;
        if (!u) return p;
        u.project = {
          ...project,
          updatedAt: new Date().toISOString()
        };
        u.updatedAt = u.project.updatedAt;
        return p;
      });
    },
    [commit]
  );

  const saveReflection = useCallback(
    (unitId, labId, text) => {
      commit(p => {
        const u = p[unitId];
        if (!u) return p;
        u.reflections = {
          ...u.reflections,
          [labId]: String(text).slice(0, 2000)
        };
        return p;
      });
    },
    [commit]
  );

  const visitUnit = useCallback(
    unitId => {
      commit(p => {
        const at = new Date().toISOString();
        if (!p[unitId]) return p;
        p[unitId].visitedAt = at;
        p.lastVisited = { unitId, at };
        return p;
      });
    },
    [commit]
  );

  // บันทึกวันที่เข้าเรียน วันละครั้ง (ใช้ทำสถิติการเข้าเรียนหน้าแรก)
  const signedIn = !!student;
  useEffect(() => {
    if (status !== 'ready' || !signedIn) return;
    const today = dayKey();
    if (progressRef.current.visitDays?.includes(today)) return;
    commit(p => {
      if (!p.visitDays.includes(today)) p.visitDays = [...p.visitDays, today].sort().slice(-400);
      return p;
    });
  }, [status, signedIn, commit]);

  const summary = useMemo(() => buildSummary(progress), [progress]);
  const prevAch = useRef(null);

  useEffect(() => {
    if (status !== 'ready') return;
    const now = summary.achievements.filter(a => a.unlocked).map(a => a.id);
    if (prevAch.current && user && user.signedIn) {
      summary.achievements
        .filter(a => a.unlocked && !prevAch.current.includes(a.id))
        .forEach(a =>
          notify({
            type: 'success',
            bot: 'cheer',
            duration: 6000,
            title: `ปลดล็อกเหรียญ ${a.name}!`,
            message: `${a.rule}แล้ว AIra ภูมิใจในตัวเธอมาก`
          })
        );
    }
    prevAch.current = now;
  }, [summary, status, notify, user]);

  const value = {
    status,
    user,
    student,
    progress,
    summary,
    toasts,
    notify,
    dismiss,
    login,
    logout,
    resetProgress,
    markItem,
    recordQuiz,
    saveActivity,
    saveReflection,
    saveProject,
    visitUnit,
    quizBest,
    quizPassed
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
