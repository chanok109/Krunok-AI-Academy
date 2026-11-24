// Quiz scoring and Progress calculation service
import { UNITS, countItems, unitReady, QUIZ_PASS_PERCENT, ACHIEVEMENTS } from '../data/courseData.js';

export function scoreQuiz(questions, answers, passPercent = QUIZ_PASS_PERCENT) {
  const total = questions.length;
  const correct = questions.reduce((n, q) => n + (answers[q.id] === q.answer ? 1 : 0), 0);
  const percent = total ? Math.round((correct / total) * 100) : 0;
  return {
    correct,
    total,
    percent,
    passed: total > 0 && correct * 100 >= passPercent * total
  };
}

export const PROGRESS_VERSION = 1;

export const emptyUnitProgress = () => ({
  completedLessons: [],
  completedActivities: [],
  completedPractice: [],
  quizAttempts: [],
  activityScores: {},
  reflections: {},
  project: null,
  completed: false,
  visitedAt: null,
  updatedAt: null
});

export const emptyProgress = () => ({
  version: PROGRESS_VERSION,
  updatedAt: null,
  lastVisited: null,
  visitDays: [],
  ...Object.fromEntries(UNITS.map(u => [u.id, emptyUnitProgress()]))
});

export const asIdList = x => (Array.isArray(x) ? x.filter(v => typeof v === 'string') : []);

export function normalizeProgress(raw) {
  const base = emptyProgress();
  if (!raw || typeof raw !== 'object') return base;
  base.updatedAt = raw.updatedAt || null;
  base.visitDays = asIdList(raw.visitDays).filter(k => /^\d{4}-\d{2}-\d{2}$/.test(k));
  base.lastVisited = raw.lastVisited && UNITS.some(u => u.id === raw.lastVisited.unitId) ? raw.lastVisited : null;
  for (const u of UNITS) {
    const r = raw[u.id] || {};
    base[u.id] = {
      completedLessons: asIdList(r.completedLessons),
      completedActivities: asIdList(r.completedActivities),
      completedPractice: asIdList(r.completedPractice),
      quizAttempts: Array.isArray(r.quizAttempts) ? r.quizAttempts.filter(a => a && typeof a.percent === 'number') : [],
      activityScores: r.activityScores && typeof r.activityScores === 'object' ? r.activityScores : {},
      reflections: r.reflections && typeof r.reflections === 'object' ? r.reflections : {},
      project: r.project && typeof r.project === 'object' ? r.project : null,
      completed: !!r.completed,
      visitedAt: r.visitedAt || null,
      updatedAt: r.updatedAt || null
    };
  }
  return base;
}

export const quizBest = up => (up && up.quizAttempts ? up.quizAttempts.reduce((b, a) => (!b || a.percent > b.percent ? a : b), null) : null);
export const quizPassed = up => (up && up.quizAttempts ? up.quizAttempts.some(a => a.passed) : false);

export const KIND_FIELD = {
  lessons: 'completedLessons',
  activities: 'completedActivities',
  practice: 'completedPractice'
};

export function unitPercent(unit, up) {
  if (!unit || !up) return 0;
  const total = countItems(unit);
  if (!total) return 0;
  const done =
    unit.lessons.filter(l => up.completedLessons.includes(l.id)).length +
    unit.activities.filter(a => up.completedActivities.includes(a.id)).length +
    unit.practice.filter(p => up.completedPractice.includes(p.id)).length +
    (unit.quiz && quizPassed(up) ? 1 : 0);
  return Math.round((done / total) * 100);
}

export function buildSummary(progress) {
  const units = {};
  let totalItems = 0,
    doneItems = 0,
    activitiesDone = 0,
    activitiesTotal = 0;
  const attempts = [];
  for (const u of UNITS) {
    const up = progress[u.id] || emptyUnitProgress();
    const ready = unitReady(u);
    const percent = unitPercent(u, up);
    const lessonsDone = u.lessons.filter(l => up.completedLessons.includes(l.id)).length;
    const actDone =
      u.activities.filter(a => up.completedActivities.includes(a.id)).length +
      u.practice.filter(x => up.completedPractice.includes(x.id)).length;
    const actTotal = u.activities.length + u.practice.length;
    const best = quizBest(up);
    const last = up.quizAttempts[up.quizAttempts.length - 1] || null;
    up.quizAttempts.forEach(a =>
      attempts.push({
        ...a,
        unitId: u.id
      })
    );
    const total = countItems(u);
    totalItems += total;
    doneItems += lessonsDone + actDone + (u.quiz && quizPassed(up) ? 1 : 0);
    activitiesDone += actDone;
    activitiesTotal += actTotal;
    units[u.id] = {
      ready,
      percent,
      completed: ready && percent === 100,
      visited: !!up.visitedAt,
      visitedAt: up.visitedAt,
      lessonsDone,
      lessonsTotal: u.lessons.length,
      activitiesDone: actDone,
      activitiesTotal: actTotal,
      quizBest: best,
      quizLast: last,
      quizPassed: quizPassed(up)
    };
  }
  attempts.sort((a, b) => String(a.at).localeCompare(String(b.at)));
  const s = {
    units,
    perUnit: Object.fromEntries(UNITS.map(u => [u.id, units[u.id].percent])),
    overall: totalItems ? Math.round((doneItems / totalItems) * 100) : 0,
    totalItems,
    doneItems,
    activitiesDone,
    activitiesTotal,
    readyCount: UNITS.filter(unitReady).length,
    completed: UNITS.filter(u => units[u.id].completed).length,
    lastQuiz: attempts[attempts.length - 1] || null,
    lastVisited: progress.lastVisited
  };
  s.achievements = ACHIEVEMENTS.map(a => ({
    ...a,
    unlocked: !!a.test(s)
  }));
  return s;
}
