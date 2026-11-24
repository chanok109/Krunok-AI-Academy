import React from 'react';
import { Icon, Badge, Button, ProgressBar } from './UIPrimitives.jsx';
import { Modal, thaiDateTime } from './UIHelpers.jsx';
import { VisitCalendar, dayTh } from './VisitCalendar.jsx';
import { OPEN_UNITS, SCORE_COLS, passMark } from '../services/teacherData.js';

const num = x => +(+x).toFixed(2);
export const projectTitle = p => (p ? (p.present && p.present.name) || (p.plan && p.plan.title) || '' : '');
const idleText = r => (r.lastVisit == null ? 'ยังไม่เคยเข้าเรียน' : r.daysIdle === 0 ? 'วันนี้' : `${r.daysIdle} วันที่แล้ว`);

// รายละเอียดผลการเรียนของนักเรียน 1 คน (เปิดจากตารางรายชื่อในแดชบอร์ดครู)
export function StudentDetail({ row, onClose, onAssess }) {
  if (!row) return null;
  const attempts = OPEN_UNITS.flatMap(u =>
    row.progress[u.id].quizAttempts.map(a => ({ ...a, unit: u }))
  ).sort((a, b) => String(b.at).localeCompare(String(a.at)));

  return (
    <Modal open onClose={onClose} title={`${row.name} · ${row.classroom} เลขที่ ${row.no}`}>
      <div className="sd">
        <p className="sd-meta">
          รหัส {row.userId} · เข้าเรียนล่าสุด {idleText(row)}
          {row.syncedAt ? ` · ซิงก์ข้อมูลล่าสุด ${thaiDateTime(row.syncedAt)}` : ' · ยังไม่มีข้อมูลบนเซิร์ฟเวอร์'}
        </p>

        <h4><Icon name="map" size={16} /> ความก้าวหน้ารายหน่วย</h4>
        <div className="sd-units">
          {OPEN_UNITS.map(u => {
            const su = row.summary.units[u.id];
            const q = row.quiz[u.id];
            return (
              <div key={u.id} className="sd-unit">
                <div className="sd-unit-head"><b>หน่วยที่ {u.no}</b><span>{su.percent}%</span></div>
                <ProgressBar value={su.percent} />
                <ul>
                  <li>บทเรียน {su.lessonsDone}/{su.lessonsTotal}</li>
                  <li>กิจกรรม {su.activitiesDone}/{su.activitiesTotal}</li>
                  {q && <li>แบบทดสอบ {q.best == null ? 'ยังไม่ได้ทำ' : `ดีที่สุด ${q.best}% (${q.attempts} ครั้ง)`}</li>}
                </ul>
                {q && q.attempts > 0 && <Badge tone={q.passed ? 'ok' : 'demo'}>{q.passed ? 'ผ่านเกณฑ์' : `ยังไม่ผ่าน (เกณฑ์ ${passMark(u.id)}%)`}</Badge>}
              </div>
            );
          })}
        </div>

        <h4><Icon name="target" size={16} /> ประวัติการทำแบบทดสอบ</h4>
        {attempts.length === 0 ? <p className="sd-empty">ยังไม่ได้ทำแบบทดสอบ</p> : (
          <div className="sd-table-wrap">
            <table className="sd-table">
              <thead><tr><th>วันที่</th><th>หน่วย</th><th>คะแนน</th><th>ร้อยละ</th><th>ผล</th></tr></thead>
              <tbody>
                {attempts.map((a, i) => (
                  <tr key={i}>
                    <td>{a.at ? thaiDateTime(a.at) : '–'}</td>
                    <td>หน่วยที่ {a.unit.no}</td>
                    <td>{a.correct}/{a.total}</td>
                    <td>{a.percent}%</td>
                    <td>{a.passed ? <Badge tone="ok">ผ่าน</Badge> : <Badge tone="demo">ไม่ผ่าน</Badge>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <h4><Icon name="puzzle" size={16} /> คะแนนมินิเกม (ค่าเฉลี่ยทุกครั้งที่เล่น)</h4>
        <div className="sd-table-wrap">
          <table className="sd-table">
            <thead><tr><th>หน่วย</th><th>ด่าน</th><th>เฉลี่ย</th><th>ดีที่สุด</th><th>เล่น</th></tr></thead>
            <tbody>
              {OPEN_UNITS.flatMap(u => (SCORE_COLS[u.id] || []).map(c => {
                const s = row.progress[u.id].activityScores[c.id];
                const avg = s ? (s.attempts ? (s.sum ?? s.best * s.attempts) / s.attempts : s.best) : null;
                return (
                  <tr key={c.id}>
                    <td>หน่วยที่ {u.no}</td>
                    <td>{c.group} · {c.label}</td>
                    <td>{s ? `${num(avg)}/${c.max}` : '–'}</td>
                    <td>{s ? `${s.best}/${c.max}` : '–'}</td>
                    <td>{s ? `${s.attempts} ครั้ง` : 'ยังไม่เล่น'}</td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>

        <h4><Icon name="clock" size={16} /> การเข้าเรียนเว็บไซต์</h4>
        <p className="sd-meta">
          เข้าเรียนทั้งหมด {row.visit.total} วัน · ต่อเนื่องสูงสุด {row.visit.best} วัน · เดือนนี้ {row.visit.month} วัน
          {row.visit.first ? ` · เริ่มเข้าเรียน ${dayTh(row.visit.first)}` : ''}
        </p>
        <VisitCalendar weeks={row.visit.weeks} />

        {(row.project || row.assessment) && (
          <>
            <h4><Icon name="bulb" size={16} /> โครงงาน AI (หน่วยที่ 4)</h4>
            <div className="sd-project">
              <b>{projectTitle(row.project) || 'ยังไม่ได้ระบุชื่อโครงงาน'}</b>
              {(row.project?.present?.abstract || row.project?.plan?.problem) && <p>{row.project.present?.abstract || row.project.plan.problem}</p>}
              {(row.project?.evidence || []).filter(e => /^https?:\/\//.test(e.url || '')).map((e, i) => (
                <a key={i} href={e.url} target="_blank" rel="noopener noreferrer">{e.label || 'หลักฐาน'} ↗</a>
              ))}
              {row.assessment && <p>ผลประเมินล่าสุด {row.assessment.totalScore}/{row.assessment.maxScore} · {row.assessment.feedback || 'ไม่มีข้อเสนอแนะ'}</p>}
              <Button icon="target" onClick={() => onAssess(row)}>{row.assessment ? 'แก้ผลการประเมิน' : 'ประเมินโครงงาน'}</Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
