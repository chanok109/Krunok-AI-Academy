import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { UNITS, KEYS } from '../data/courseData.js';
import { storage } from '../services/storageService.js';
import { auth, api } from '../services/apiService.js';
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
    [notify]
  );

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

  const login = useCallback(async ({ displayName, classroom }) => {
    const u = await auth.signIn({ displayName, classroom });
    const fresh = emptyProgress();
    await api.saveProgress(fresh);
    setProgress(fresh);
    setUser(u);
    return u;
  }, []);

  const resume = useCallback(async () => {
    const u = await auth.resume(user);
    setUser(u);
    return u;
  }, [user]);

  const logout = useCallback(async () => {
    if (user) setUser(await auth.signOut(user));
  }, [user]);

  const forgetUser = useCallback(async () => {
    await auth.forget();
    setUser(null);
    setProgress(emptyProgress());
  }, []);

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
    },
    [commit]
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
    resume,
    logout,
    forgetUser,
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
