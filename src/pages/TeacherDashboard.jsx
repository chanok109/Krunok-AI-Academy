import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { COURSE, API_CONFIG, LOCKED_UNITS } from '../data/courseData.js';
import { useApp } from '../context/AppContext.jsx';
import { useRoute } from '../context/RouteContext.jsx';
import { Icon, GlassCard, Button, Badge, DemoBadge, ProgressBar } from '../components/UIPrimitives.jsx';
import { Modal, thaiDateTime } from '../components/UIHelpers.jsx';
import { api } from '../services/apiService.js';
import { UnitScoreBoard } from '../components/UnitScoreBoard.jsx';
import { StudentDetail, projectTitle } from '../components/StudentDetail.jsx';
import { dayTh } from '../components/VisitCalendar.jsx';
import {
  OPEN_UNITS, QUIZ_UNITS, SCORE_COLS, IDLE_DAYS, QUIZ_BINS,
  toRow, groupSummary, quizBins, itemCompletion, demoOverview, passMark
} from '../services/teacherData.js';

// แท็บคะแนนรายกิจกรรม: เฉพาะหน่วยที่เปิดเรียนแล้วและมีมินิเกม
const SCORE_TABS = Object.fromEntries(OPEN_UNITS.filter(u => SCORE_COLS[u.id]).map(u => [u.id, SCORE_COLS[u.id]]));

const RUBRIC = [
  { key: 'problem', label: '1. การระบุปัญหาและขอบเขต', desc: 'ความชัดเจนของปัญหา ประโยชน์ต่อผู้ใช้ และความเหมาะสมในการใช้ AI' },
  { key: 'data', label: '2. คุณภาพและการเตรียมข้อมูล', desc: 'ปริมาณข้อมูล ความหลากหลาย การทำความสะอาด และการป้องกันความลำเอียง' },
  { key: 'model', label: '3. การเลือกและทดสอบโมเดล AI', desc: 'ความถูกต้องของโมเดล การทดสอบด้วยชุดข้อมูลทดสอบ และค่าความแม่นยำ' },
  { key: 'ethics', label: '4. จริยธรรมและความปลอดภัย', desc: 'การปฏิบัติตาม PDPA การคำนึงถึงความเป็นธรรม และการจัดการความเสี่ยง' }
];

const STATUS_FILTERS = [
  { id: 'all', label: 'นักเรียนทั้งหมด', test: () => true },
  { id: 'idle', label: `ต้องติดตาม (ไม่เข้าเรียน ${IDLE_DAYS} วันขึ้นไป)`, test: r => r.flags.idle },
  { id: 'notStarted', label: 'ยังไม่เริ่มเรียน', test: r => r.flags.notStarted },
  { id: 'quizFailed', label: 'ทำแบบทดสอบแล้วยังไม่ผ่าน', test: r => r.flags.quizFailed },
  { id: 'quizPending', label: 'ยังไม่ผ่านแบบทดสอบบางหน่วย', test: r => r.flags.quizPending },
  { id: 'quizAll', label: 'ผ่านแบบทดสอบครบทุกหน่วย', test: r => !r.flags.quizPending }
];
const SORTS = {
  no: { label: 'ห้อง / เลขที่', fn: (a, b) => a.classroom.localeCompare(b.classroom) || a.no - b.no },
  progressDesc: { label: 'ความก้าวหน้า มาก → น้อย', fn: (a, b) => b.openPct - a.openPct },
  progressAsc: { label: 'ความก้าวหน้า น้อย → มาก', fn: (a, b) => a.openPct - b.openPct },
  idle: { label: 'ไม่ได้เข้าเรียนนานที่สุด', fn: (a, b) => (b.daysIdle ?? 9999) - (a.daysIdle ?? 9999) }
};

const idleText = r => (r.lastVisit == null ? 'ยังไม่เคยเข้า' : r.daysIdle === 0 ? 'วันนี้' : `${r.daysIdle} วันที่แล้ว`);
const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);
const csvCell = v => `"${String(v ?? '').replace(/"/g, '""')}"`;

// คะแนนรายกิจกรรมโหมดสาธิต: ค่าเฉลี่ยจาก activityScores ในข้อมูลจำลอง (โหมดจริงใช้ ScoreLog ผ่าน leaderboard/get)
const demoUnitScores = r => Object.fromEntries(Object.keys(SCORE_TABS).map(id => {
  const up = r.progress[id];
  const tries = up.quizAttempts;
  return [id, {
    activities: Object.fromEntries(Object.entries(up.activityScores).map(([k, s]) => [k, { best: +((s.sum ?? s.best) / (s.attempts || 1)).toFixed(2), max: s.max }])),
    quiz: tries.length ? { correct: +(tries.reduce((n, a) => n + a.correct, 0) / tries.length).toFixed(2) } : null
  }];
}));

export function TeacherDashboard() {
  const { user, notify } = useApp();
  const { navigate } = useRoute();

  const [activeTab, setActiveTab] = useState('roster');
  const [selectedClass, setSelectedClass] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('no');
  const [searchQuery, setSearchQuery] = useState('');
  const [detail, setDetail] = useState(null);

  // ข้อมูลนักเรียนทั้งหมด (แผ่นงาน Users + ProgressSnapshots + QuizAttempts + Assessments)
  const [raw, setRaw] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [loadedAt, setLoadedAt] = useState(null);
  const [loading, setLoading] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      if (api.isDemo()) {
        setRaw(demoOverview());
      } else {
        const r = await api.getTeacherOverview();
        if (!r || !r.success) throw new Error((r && r.error) || 'โหลดข้อมูลไม่สำเร็จ');
        setRaw(r.students);
      }
      setLoadedAt(new Date().toISOString());
    } catch (e) {
      setLoadError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const rows = useMemo(() => (raw || []).map(s => toRow(s)), [raw]);
  const classes = useMemo(() => {
    const found = [...new Set(rows.map(r => r.classroom))];
    return [...new Set([...COURSE.classrooms.filter(c => found.includes(c)), ...found.sort()])];
  }, [rows]);
  const classRows = useMemo(() => (selectedClass === 'all' ? rows : rows.filter(r => r.classroom === selectedClass)), [rows, selectedClass]);
  const stats = useMemo(() => groupSummary(classRows), [classRows]);

  const filteredRows = useMemo(() => {
    const f = STATUS_FILTERS.find(x => x.id === filterStatus) || STATUS_FILTERS[0];
    const q = searchQuery.trim().toLowerCase();
    return classRows
      .filter(f.test)
      .filter(r => !q || r.name.toLowerCase().includes(q) || String(r.userId).includes(q) || String(r.no) === q)
      .sort(SORTS[sortBy].fn);
  }, [classRows, filterStatus, searchQuery, sortBy]);

  // แท็บคะแนนรายกิจกรรม (โหมดจริง: ScoreLog ค่าเฉลี่ยทุกครั้ง แบบเดียวกับ Leaderboard ของนักเรียน)
  const [boards, setBoards] = useState({});
  useEffect(() => {
    const unitId = activeTab;
    if (!SCORE_TABS[unitId] || api.isDemo() || boards[unitId]?.students) return undefined;
    let alive = true;
    setBoards(b => ({ ...b, [unitId]: { error: '', students: null } }));
    api.getLeaderboard(unitId)
      .then(r => {
        if (!alive) return;
        if (!r || !r.success) throw new Error((r && r.error) || 'โหลดคะแนนไม่สำเร็จ');
        const students = r.students.map((x, i) => ({
          id: `${x.classroom}-${x.no}-${i}`, name: x.name, no: x.no, classroom: x.classroom,
          unitScores: { [unitId]: {
            activities: Object.fromEntries(Object.entries(x.activities || {}).map(([k, v]) => [k, { best: v }])),
            quiz: x.quiz == null ? null : { correct: x.quiz }
          } }
        })).sort((p, q) => p.classroom.localeCompare(q.classroom) || p.no - q.no);
        setBoards(b => ({ ...b, [unitId]: { error: '', students } }));
      })
      .catch(e => alive && setBoards(b => ({ ...b, [unitId]: { error: e.message || String(e), students: null } })));
    return () => { alive = false; };
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps
  const board = boards[activeTab] || {};
  const demoBoardRows = useMemo(() => (api.isDemo() ? rows.map(r => ({ ...r, unitScores: demoUnitScores(r) })) : []), [rows]);

  // ประเมินโครงงาน (หน่วยที่ 4)
  const [evaluating, setEvaluating] = useState(null);
  const [rubricScores, setRubricScores] = useState({ problem: 3, data: 3, model: 3, ethics: 3 });
  const [feedbackText, setFeedbackText] = useState('');
  const [isSavingEval, setIsSavingEval] = useState(false);
  const openAssess = r => {
    setDetail(null);
    setEvaluating(r);
    setRubricScores({ problem: 3, data: 3, model: 3, ethics: 3, ...(r.assessment?.rubricScores || {}) });
    setFeedbackText(r.assessment?.feedback || '');
  };
  const totalRubric = RUBRIC.reduce((n, c) => n + (rubricScores[c.key] || 0), 0);
  const saveAssessment = async () => {
    if (!evaluating) return;
    setIsSavingEval(true);
    try {
      const r = await api.assessStudentProject({
        studentUserId: evaluating.userId,
        projectId: 'PRJ-' + evaluating.userId,
        rubricScores,
        totalScore: totalRubric,
        maxScore: 16,
        feedback: feedbackText
      });
      if (r && r.success === false) throw new Error(r.error || 'บันทึกไม่สำเร็จ');
      const assessment = { totalScore: totalRubric, maxScore: 16, rubricScores, feedback: feedbackText, updatedAt: new Date().toISOString() };
      setRaw(prev => prev.map(s => (s.userId === evaluating.userId ? { ...s, assessment } : s)));
      notify({ type: 'success', title: 'บันทึกผลการประเมินแล้ว', message: `${evaluating.name} ได้ ${totalRubric}/16 คะแนน` });
      setEvaluating(null);
    } catch (e) {
      notify({ type: 'error', title: 'บันทึกผลการประเมินไม่สำเร็จ', message: e.message || 'กรุณาลองใหม่อีกครั้ง' });
    } finally {
      setIsSavingEval(false);
    }
  };

  // ส่งออก CSV (เปิดใน Excel ได้ภาษาไทยถูกต้อง)
  const exportCSV = () => {
    const headers = [
      'ห้อง', 'เลขที่', 'รหัสนักเรียน', 'ชื่อ-นามสกุล',
      ...OPEN_UNITS.map(u => `ความก้าวหน้าหน่วยที่ ${u.no} (%)`),
      ...QUIZ_UNITS.flatMap(u => [`แบบทดสอบหน่วยที่ ${u.no} ดีที่สุด (%)`, `แบบทดสอบหน่วยที่ ${u.no} จำนวนครั้ง`, `แบบทดสอบหน่วยที่ ${u.no} ผล`]),
      'เข้าเรียนทั้งหมด (วัน)', 'เข้าเรียนล่าสุด', 'สถานะ'
    ];
    const lines = filteredRows.map(r => [
      r.classroom, r.no, r.userId, r.name,
      ...OPEN_UNITS.map(u => r.summary.units[u.id].percent),
      ...QUIZ_UNITS.flatMap(u => [r.quiz[u.id].best ?? '', r.quiz[u.id].attempts, r.quiz[u.id].attempts ? (r.quiz[u.id].passed ? 'ผ่าน' : 'ไม่ผ่าน') : 'ยังไม่ทำ']),
      r.visit.total, r.lastVisit ? dayTh(r.lastVisit) : 'ยังไม่เคยเข้า',
      r.flags.idle ? 'ต้องติดตาม' : 'ปกติ'
    ].map(csvCell).join(','));
    const csv = '﻿' + [headers.map(csvCell).join(','), ...lines].join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `KruNok_AI_Academy_ผลการเรียน_${selectedClass === 'all' ? 'ทุกห้อง' : selectedClass.replace('/', '-')}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    notify({ type: 'success', title: 'ส่งออกไฟล์ CSV แล้ว', message: `${filteredRows.length} คน · เปิดด้วย Excel ได้` });
  };

  // ทดสอบการเชื่อมต่อ Apps Script
  const [gasUrlInput, setGasUrlInput] = useState(API_CONFIG.gasEndpoint || '');
  const [isTestingGas, setIsTestingGas] = useState(false);
  const [gasTestResult, setGasTestResult] = useState(null);
  const testGas = async () => {
    if (!gasUrlInput.trim()) { setGasTestResult({ ok: false, msg: 'กรุณากรอก URL ของ Google Apps Script Web App' }); return; }
    setIsTestingGas(true);
    setGasTestResult(null);
    try {
      const data = await (await fetch(gasUrlInput.trim() + '?action=ping')).json();
      if (!data || data.status !== 'online') throw new Error('ตอบกลับไม่ตรงรูปแบบ');
      localStorage.setItem('krunok_gas_endpoint', gasUrlInput.trim());
      localStorage.setItem('krunok_data_mode', 'gas');
      setGasTestResult({ ok: true, msg: `เชื่อมต่อสำเร็จ: ${data.app} (${data.courseCode || COURSE.code}) · ${thaiDateTime(data.timestamp)}` });
    } catch (err) {
      setGasTestResult({ ok: false, msg: `เชื่อมต่อไม่สำเร็จ: ${err.message} — ตรวจว่า Deploy เป็น Web App (Who has access: Anyone) แล้ว` });
    } finally {
      setIsTestingGas(false);
    }
  };

  const isAuthorized = user && (user.role === 'TEACHER' || user.role === 'ADMIN' || user.mode === 'demo');
  if (!isAuthorized) {
    return (
      <div style={{ maxWidth: 640, margin: '60px auto', padding: '0 16px' }}>
        <GlassCard style={{ textAlign: 'center', padding: '40px 24px' }}>
          <div style={{ color: 'var(--warn)', marginBottom: 16 }}><Icon name="lock" size={48} /></div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>หน้านี้สำหรับครูผู้สอนเท่านั้น</h2>
          <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
            บัญชี <strong>{user?.displayName || 'นักเรียน'}</strong> ไม่มีสิทธิ์ดูผลการเรียนของผู้อื่น
          </p>
          <Button variant="primary" icon="home" onClick={() => navigate('home')}>กลับหน้าหลัก</Button>
        </GlassCard>
      </div>
    );
  }

  const classPicker = (
    <div className="td-classes" role="tablist" aria-label="เลือกห้องเรียน">
      {['all', ...classes].map(c => (
        <button key={c} type="button" role="tab" aria-selected={selectedClass === c} className={`tag ${selectedClass === c ? 'active' : ''}`} onClick={() => setSelectedClass(c)}>
          {c === 'all' ? 'ทุกห้อง' : c}
        </button>
      ))}
    </div>
  );

  return (
    <div className="td">
      {/* หัวแดชบอร์ด */}
      <GlassCard pad={false} className="welcome td-head">
        <div>
          <div className="td-badges">
            <Badge tone="cyan" dot>แดชบอร์ดครูผู้สอน</Badge>
            <Badge>{COURSE.code} {COURSE.name}</Badge>
            {api.isDemo() ? <DemoBadge /> : <Badge tone="ok">ข้อมูลจริงจาก Google Sheets</Badge>}
          </div>
          <h1>ระบบติดตามผลการเรียนรู้และประเมินผล <span className="grad-text">KruNok AI Academy</span></h1>
          <p className="td-sub">
            ครูผู้สอน: <strong>{COURSE.teacher}</strong> · {COURSE.school}
            {loadedAt && <> · ข้อมูลเมื่อ {thaiDateTime(loadedAt)}</>}
          </p>
        </div>
        <div className="td-tabs">
          <Button variant={activeTab === 'roster' ? 'primary' : 'ghost'} icon="users" onClick={() => setActiveTab('roster')}>ติดตามรายบุคคล</Button>
          {Object.keys(SCORE_TABS).map(u => (
            <Button key={u} variant={activeTab === u ? 'primary' : 'ghost'} icon="trophy" onClick={() => setActiveTab(u)}>
              คะแนนหน่วยที่ {OPEN_UNITS.find(x => x.id === u).no}
            </Button>
          ))}
          <Button variant={activeTab === 'analytics' ? 'primary' : 'ghost'} icon="chart" onClick={() => setActiveTab('analytics')}>วิเคราะห์ภาพรวม</Button>
          <Button variant={activeTab === 'settings' ? 'primary' : 'ghost'} icon="cpu" onClick={() => setActiveTab('settings')}>ระบบหลังบ้าน</Button>
          <Button variant="ghost" icon="refresh" disabled={loading} onClick={load}>{loading ? 'กำลังโหลด…' : 'โหลดใหม่'}</Button>
        </div>
      </GlassCard>

      {loadError && (
        <GlassCard className="td-error" role="alert">
          <b>โหลดข้อมูลนักเรียนไม่สำเร็จ:</b> {loadError}
          <p>ถ้าเพิ่งอัปเดต backend/Code.gs ให้ Deploy เวอร์ชันใหม่ใน Apps Script (Deploy → Manage deployments → New version) แล้วกด “โหลดใหม่”</p>
        </GlassCard>
      )}

      {/* ตัวเลขสรุป */}
      {raw && (
        <section className="td-kpis" aria-label="สรุปภาพรวม">
          <div className="td-kpi">
            <span className="td-kpi-lbl"><Icon name="users" size={15} />นักเรียน {selectedClass === 'all' ? 'ทุกห้อง' : selectedClass}</span>
            <b>{stats.total}<small>คน</small></b>
            <span className="td-kpi-sub">เข้าเรียนใน {IDLE_DAYS} วันล่าสุด {stats.activeWeek} คน ({pct(stats.activeWeek, stats.total)}%)</span>
          </div>
          <div className="td-kpi">
            <span className="td-kpi-lbl"><Icon name="chart" size={15} />ความก้าวหน้าเฉลี่ย</span>
            <b>{stats.avgOpen}<small>%</small></b>
            <span className="td-kpi-sub">{OPEN_UNITS.map(u => `หน่วย ${u.no}: ${stats.unitAvg[u.id]}%`).join(' · ')}</span>
          </div>
          <div className="td-kpi">
            <span className="td-kpi-lbl"><Icon name="target" size={15} />ผ่านแบบทดสอบหลังเรียน</span>
            {QUIZ_UNITS.map(u => (
              <span key={u.id} className="td-kpi-line">
                หน่วย {u.no} <b>{stats.quizPassed[u.id]}</b> คน <small>({pct(stats.quizPassed[u.id], stats.total)}%)</small>
              </span>
            ))}
          </div>
          <button type="button" className={`td-kpi td-kpi-alert ${filterStatus === 'idle' && activeTab === 'roster' ? 'on' : ''}`} onClick={() => { setActiveTab('roster'); setFilterStatus('idle'); }}>
            <span className="td-kpi-lbl"><Icon name="alert" size={15} />ต้องติดตาม</span>
            <b>{stats.idle}<small>คน</small></b>
            <span className="td-kpi-sub">ไม่ได้เข้าเรียน {IDLE_DAYS} วันขึ้นไป · ยังไม่เริ่ม {stats.notStarted} คน</span>
          </button>
        </section>
      )}

      {!raw && !loadError && <GlassCard><p className="td-empty">กำลังโหลดข้อมูลนักเรียนจาก Google Sheets…</p></GlassCard>}

      {/* แท็บ 1: ติดตามรายบุคคล */}
      {raw && activeTab === 'roster' && (
        <GlassCard>
          <div className="td-toolbar">
            {classPicker}
            <div className="td-filters">
              <input type="search" className="input" placeholder="ค้นหาชื่อ รหัส หรือเลขที่" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} aria-label="ค้นหานักเรียน" />
              <select className="input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} aria-label="กรองตามสถานะ">
                {STATUS_FILTERS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
              </select>
              <select className="input" value={sortBy} onChange={e => setSortBy(e.target.value)} aria-label="เรียงลำดับ">
                {Object.entries(SORTS).map(([k, s]) => <option key={k} value={k}>เรียงตาม{s.label}</option>)}
              </select>
              <Button variant="primary" icon="download" onClick={exportCSV} disabled={!filteredRows.length}>ส่งออก CSV</Button>
            </div>
          </div>
          <p className="td-count">แสดง {filteredRows.length} จาก {classRows.length} คน · คลิกชื่อเพื่อดูรายละเอียด</p>

          <div className="td-table-wrap">
            <table className="td-table">
              <thead>
                <tr>
                  <th>ห้อง</th><th>เลขที่</th><th className="l">ชื่อ - นามสกุล</th>
                  {OPEN_UNITS.map(u => <th key={u.id}>หน่วยที่ {u.no}</th>)}
                  {QUIZ_UNITS.map(u => <th key={u.id}>แบบทดสอบ {u.no}</th>)}
                  <th>เข้าเรียน</th><th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.length === 0 ? (
                  <tr><td colSpan={5 + OPEN_UNITS.length + QUIZ_UNITS.length} className="td-empty">ไม่พบนักเรียนตามเงื่อนไขที่เลือก</td></tr>
                ) : filteredRows.map(r => (
                  <tr key={r.userId}>
                    <td>{r.classroom}</td>
                    <td>{r.no}</td>
                    <td className="l">
                      <button type="button" className="td-name" onClick={() => setDetail(r)}>{r.name}</button>
                      <small>{r.userId}</small>
                    </td>
                    {OPEN_UNITS.map(u => (
                      <td key={u.id} className="td-prog">
                        <span>{r.summary.units[u.id].percent}%</span>
                        <ProgressBar value={r.summary.units[u.id].percent} />
                      </td>
                    ))}
                    {QUIZ_UNITS.map(u => {
                      const q = r.quiz[u.id];
                      return (
                        <td key={u.id}>
                          {q.attempts === 0 ? <span className="td-dim">ยังไม่ทำ</span> : (
                            <span className={`td-quiz ${q.passed ? 'ok' : 'no'}`} title={`ทำ ${q.attempts} ครั้ง · เกณฑ์ ${passMark(u.id)}%`}>
                              {q.best}%<small>{q.passed ? 'ผ่าน' : 'ไม่ผ่าน'} · {q.attempts} ครั้ง</small>
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td><span className="td-visit">{r.visit.total} วัน<small>{idleText(r)}</small></span></td>
                    <td>
                      {r.flags.notStarted ? <Badge tone="demo">ยังไม่เริ่ม</Badge>
                        : r.flags.idle ? <Badge tone="demo">ต้องติดตาม</Badge>
                        : <Badge tone="ok">ปกติ</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* แท็บคะแนนรายกิจกรรมของแต่ละหน่วย */}
      {raw && SCORE_TABS[activeTab] && !api.isDemo() && !board.students && (
        <GlassCard>
          <p className="td-empty">{board.error ? `โหลดคะแนนไม่สำเร็จ: ${board.error}` : 'กำลังโหลดคะแนนจากแผ่นงาน Users และ ScoreLog…'}</p>
        </GlassCard>
      )}
      {raw && SCORE_TABS[activeTab] && (api.isDemo() || board.students) && (
        <UnitScoreBoard
          key={activeTab}
          unitId={activeTab}
          columns={SCORE_TABS[activeTab]}
          students={api.isDemo() ? demoBoardRows : board.students}
          selectedClass={selectedClass}
          onSelectClass={setSelectedClass}
        />
      )}

      {/* แท็บ 2: วิเคราะห์ภาพรวม */}
      {raw && activeTab === 'analytics' && (
        <div className="td-grid">
          <GlassCard className="td-wide">
            <h3><Icon name="grid" size={18} />เปรียบเทียบรายห้อง</h3>
            <div className="td-table-wrap">
              <table className="td-table">
                <thead>
                  <tr>
                    <th className="l">ห้อง</th><th>นักเรียน</th>
                    {OPEN_UNITS.map(u => <th key={u.id}>ความก้าวหน้า หน่วย {u.no}</th>)}
                    {QUIZ_UNITS.map(u => <th key={u.id}>ผ่านแบบทดสอบ หน่วย {u.no}</th>)}
                    <th>เข้าเรียนใน {IDLE_DAYS} วัน</th><th>เข้าเรียนเฉลี่ย</th><th>ต้องติดตาม</th>
                  </tr>
                </thead>
                <tbody>
                  {[...classes, 'all'].map(c => {
                    const g = groupSummary(c === 'all' ? rows : rows.filter(r => r.classroom === c));
                    return (
                      <tr key={c} className={c === 'all' ? 'td-total' : ''}>
                        <td className="l">{c === 'all' ? 'รวมทุกห้อง' : c}</td>
                        <td>{g.total}</td>
                        {OPEN_UNITS.map(u => <td key={u.id} className="td-prog"><span>{g.unitAvg[u.id]}%</span><ProgressBar value={g.unitAvg[u.id]} /></td>)}
                        {QUIZ_UNITS.map(u => <td key={u.id}>{g.quizPassed[u.id]}/{g.total} <small className="td-dim">({pct(g.quizPassed[u.id], g.total)}%)</small></td>)}
                        <td>{pct(g.activeWeek, g.total)}%</td>
                        <td>{g.avgVisitDays} วัน</td>
                        <td>{g.idle} คน</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </GlassCard>

          <GlassCard className="td-wide td-classbar">{classPicker}</GlassCard>

          {QUIZ_UNITS.map(u => {
            const bins = quizBins(classRows, u.id);
            const peak = Math.max(1, ...bins);
            return (
              <GlassCard key={u.id}>
                <h3><Icon name="target" size={18} />คะแนนแบบทดสอบหน่วยที่ {u.no} (คะแนนดีที่สุดของแต่ละคน)</h3>
                <p className="td-note">ทำแล้ว {stats.quizTried[u.id]} จาก {stats.total} คน · ผ่าน {stats.quizPassed[u.id]} คน (เกณฑ์ {passMark(u.id)}%)</p>
                <div className="td-bins">
                  {QUIZ_BINS.map((b, i) => (
                    <div key={b.label} className="td-bin">
                      <span className="td-bin-val">{bins[i]} คน</span>
                      <span className="td-bin-bar"><i style={{ height: `${(bins[i] / peak) * 100}%` }} /></span>
                      <span className="td-bin-lbl">{b.label}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            );
          })}

          {OPEN_UNITS.map(u => {
            const items = itemCompletion(classRows, u);
            return (
              <GlassCard key={u.id}>
                <h3><Icon name="list" size={18} />หน่วยที่ {u.no}: นักเรียนทำส่วนไหนเสร็จแล้วบ้าง</h3>
                <p className="td-note">ส่วนที่มีคนทำน้อยคือจุดที่ควรทบทวนหรือติดตาม</p>
                <div className="td-items">
                  {items.map(it => (
                    <div key={it.id} className="td-item">
                      <div><span className="td-kind">{it.kind}</span>{it.title}<b>{it.done}/{stats.total}</b></div>
                      <ProgressBar value={pct(it.done, stats.total)} />
                    </div>
                  ))}
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* แท็บ 3: ระบบหลังบ้าน */}
      {activeTab === 'settings' && (
        <div className="td-grid">
          <GlassCard className="td-wide">
            <h3><Icon name="cpu" size={18} />การเชื่อมต่อ Google Apps Script</h3>
            <p className="td-note">ทดสอบ URL ของ Web App ที่ Deploy ไว้ ถ้าเชื่อมต่อได้ระบบจะจำ URL นี้ไว้ในเครื่องนี้</p>
            <div className="td-gas">
              <input type="url" className="input" placeholder="https://script.google.com/macros/s/.../exec" value={gasUrlInput} onChange={e => setGasUrlInput(e.target.value)} aria-label="URL ของ Apps Script Web App" />
              <Button variant="primary" icon="refresh" disabled={isTestingGas} onClick={testGas}>{isTestingGas ? 'กำลังทดสอบ…' : 'ทดสอบการเชื่อมต่อ'}</Button>
            </div>
            {gasTestResult && <p className={`td-gas-result ${gasTestResult.ok ? 'ok' : 'no'}`} role="status">{gasTestResult.msg}</p>}
          </GlassCard>
          <GlassCard className="td-wide">
            <h3><Icon name="layers" size={18} />แผ่นงานที่ระบบใช้ใน Google Sheets</h3>
            <div className="td-sheets">
              {[
                ['Users', 'รายชื่อนักเรียนและครู ใช้เข้าสู่ระบบ (class, no, username, password, title, name, lastname)'],
                ['ProgressSnapshots', 'ความก้าวหน้าของนักเรียนแต่ละคน รวมวันที่เข้าเรียน (ซิงก์อัตโนมัติจากเว็บไซต์)'],
                ['QuizAttempts', 'ผลแบบทดสอบหลังเรียนทุกครั้ง (เซิร์ฟเวอร์ตรวจคำตอบเอง)'],
                ['ScoreLog', 'คะแนนมินิเกมและแบบทดสอบทุกครั้งที่ทำ ใช้คิดคะแนนเฉลี่ยในแท็บคะแนนรายหน่วย'],
                ['Assessments', 'ผลประเมินโครงงานหน่วยที่ 4 โดยครู'],
                ['AuditLogs', 'บันทึกการเข้าสู่ระบบและการกระทำสำคัญ']
              ].map(([name, desc]) => (
                <div key={name} className="td-sheet"><b>{name}</b><span>{desc}</span></div>
              ))}
            </div>
            {LOCKED_UNITS.length > 0 && (
              <p className="td-note">หน่วยที่ยังปิดสำหรับนักเรียน: {LOCKED_UNITS.join(', ')} (ไม่นับในตัวเลขสรุป เปิดได้ที่ LOCKED_UNITS ใน courseData.js)</p>
            )}
          </GlassCard>
        </div>
      )}

      <StudentDetail row={detail} onClose={() => setDetail(null)} onAssess={openAssess} />

      {/* ประเมินโครงงาน (หน่วยที่ 4) */}
      <Modal open={!!evaluating} onClose={() => setEvaluating(null)} title={evaluating ? `ประเมินโครงงาน: ${evaluating.name} (${evaluating.classroom})` : ''}>
        {evaluating && (
          <div className="td-rubric">
            <p className="td-note">โครงงาน: <b>{projectTitle(evaluating.project) || 'ยังไม่ได้ระบุชื่อ'}</b></p>
            {RUBRIC.map(c => (
              <fieldset key={c.key} className="td-crit">
                <legend>{c.label} <Badge tone="cyan">{rubricScores[c.key]}/4</Badge></legend>
                <p>{c.desc}</p>
                <div className="td-pts">
                  {[1, 2, 3, 4].map(pt => (
                    <button key={pt} type="button" aria-pressed={rubricScores[c.key] === pt} className={`btn ${rubricScores[c.key] === pt ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setRubricScores(p => ({ ...p, [c.key]: pt }))}>
                      {pt} คะแนน
                    </button>
                  ))}
                </div>
              </fieldset>
            ))}
            <p className="td-rubric-total">คะแนนรวม <b>{totalRubric}/16</b></p>
            <label className="td-note" htmlFor="td-feedback">ข้อเสนอแนะถึงนักเรียน</label>
            <textarea id="td-feedback" className="input" rows={3} value={feedbackText} onChange={e => setFeedbackText(e.target.value)} placeholder="คำชม จุดที่ควรพัฒนา หรือคำแนะนำเพิ่มเติม" />
            <div className="td-actions">
              <Button variant="ghost" onClick={() => setEvaluating(null)}>ยกเลิก</Button>
              <Button variant="primary" icon="check" disabled={isSavingEval} onClick={saveAssessment}>{isSavingEval ? 'กำลังบันทึก…' : 'บันทึกผลการประเมิน'}</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default TeacherDashboard;
