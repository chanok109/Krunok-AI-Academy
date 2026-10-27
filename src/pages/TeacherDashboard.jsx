import React, { useMemo, useState } from 'react';
import { COURSE, UNITS } from '../data/courseData.js';
import { useApp } from '../context/AppContext.jsx';
import { useRoute } from '../context/RouteContext.jsx';
import { Icon, AIraBot, GlassCard, Button, Badge, DemoBadge, ProgressRing, ProgressBar } from '../components/UIPrimitives.jsx';

export function TeacherDashboard() {
  const { user, summary } = useApp();
  const { navigate } = useRoute();
  const [selectedClass, setSelectedClass] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  // Demo student data for demonstration
  const mockStudents = useMemo(() => [
    { id: 'std-1', name: 'ชญานนท์ เจริญวิทย์', classroom: 'ม.5/1', u1: 100, u2: 100, u3: 85, u4: 60, quizAvg: 92, status: 'กำลังทำโครงงาน' },
    { id: 'std-2', name: 'กานต์พิชชา วงศ์สุวรรณ', classroom: 'ม.5/1', u1: 100, u2: 90, u3: 80, u4: 40, quizAvg: 88, status: 'กำลังพัฒนาโมเดล' },
    { id: 'std-3', name: 'ณภัทร สิริโสภณ', classroom: 'ม.5/2', u1: 100, u2: 100, u3: 100, u4: 100, quizAvg: 96, status: 'เสร็จสมบูรณ์' },
    { id: 'std-4', name: 'พิมพ์มาดา รัตนกุล', classroom: 'ม.5/2', u1: 100, u2: 75, u3: 50, u4: 0, quizAvg: 80, status: 'เรียนหน่วยที่ 3' },
    { id: 'std-5', name: 'ธนกฤต ปัญญาวงศ์', classroom: 'ม.5/3', u1: 90, u2: 60, u3: 0, u4: 0, quizAvg: 74, status: 'เรียนหน่วยที่ 2' },
    { id: 'std-6', name: 'มนัสวี ตามวงค์', classroom: 'ม.5/4', u1: 100, u2: 100, u3: 95, u4: 90, quizAvg: 94, status: 'รอการประเมิน' },
  ], []);

  const filteredStudents = useMemo(() => {
    if (selectedClass === 'all') return mockStudents;
    return mockStudents.filter(s => s.classroom === selectedClass);
  }, [mockStudents, selectedClass]);

  return (
    <div style={{ display: 'grid', gap: 24, padding: '16px 0' }}>
      {/* Header */}
      <GlassCard pad={false} className="welcome" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
              <Badge tone="cyan" dot>แดชบอร์ดครูผู้สอน</Badge>
              <Badge>{COURSE.code} {COURSE.name}</Badge>
              <DemoBadge />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
              ระบบจัดการและติดตามการเรียนรู้ <span className="grad-text">KruNok AI Academy</span>
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>
              ครูผู้สอน: <strong>{COURSE.teacher}</strong> · {COURSE.school}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Button variant="ghost" icon="refresh" onClick={() => window.location.reload()}>
              รีเฟรชข้อมูล
            </Button>
            <Button variant="primary" icon="home" onClick={() => navigate('home')}>
              กลับหน้านักเรียน
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Backend & Database Connection Status */}
      <GlassCard style={{ borderLeft: '4px solid var(--neon)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'rgba(0, 229, 255, 0.12)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--neon)'
            }}>
              <Icon name="cpu" size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <strong style={{ fontSize: 16 }}>Google Apps Script Backend (Phase 1 Ready)</strong>
                <Badge tone="ok">Database Schema 8 Sheets</Badge>
              </div>
              <p style={{ color: 'var(--dim)', fontSize: 13, marginTop: 2 }}>
                ฐานข้อมูล Google Sheets พร้อมใช้งาน: Users, Units, Lessons, Progress, QuizAttempts, Projects, Assessments, AuditLogs
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button size="sm" variant="ghost" icon="sparkle" onClick={() => alert('Backend Phase 1 อยู่ใน backend/Code.gs และ backend/README-Phase1.md')}>
              ดูสถานะ Backend
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Stats Summary Cards */}
      <section className="stats4" aria-label="ภาพรวมสถิติชั้นเรียน">
        <GlassCard pad={false} className="stat">
          <div className="stat-body">
            <span className="stat-num grad-text">168</span>
            <span className="stat-lbl">นักเรียนทั้งหมด (6 ห้อง)</span>
            <small style={{ color: 'var(--muted)', fontSize: 12 }}>ระดับชั้น ม.5</small>
          </div>
        </GlassCard>

        <GlassCard pad={false} className="stat">
          <div className="stat-body">
            <span className="stat-num" style={{ color: 'var(--ok)' }}>89%</span>
            <span className="stat-lbl">อัตราผ่าน Quiz เฉลี่ย</span>
            <small style={{ color: 'var(--muted)', fontSize: 12 }}>เกณฑ์ผ่าน 70%</small>
          </div>
        </GlassCard>

        <GlassCard pad={false} className="stat">
          <div className="stat-body">
            <span className="stat-num" style={{ color: 'var(--cyan)' }}>76%</span>
            <span className="stat-lbl">ความก้าวหน้าเฉลี่ย</span>
            <small style={{ color: 'var(--muted)', fontSize: 12 }}>หน่วยที่ 1 ถึง 4</small>
          </div>
        </GlassCard>

        <GlassCard pad={false} className="stat">
          <div className="stat-body">
            <span className="stat-num" style={{ color: 'var(--gold)' }}>42</span>
            <span className="stat-lbl">โครงงาน AI ส่งแล้ว</span>
            <small style={{ color: 'var(--muted)', fontSize: 12 }}>Unit 4 Project Studio</small>
          </div>
        </GlassCard>
      </section>

      {/* Classroom Filter & Table */}
      <GlassCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Icon name="user" size={18} />
            <strong style={{ fontSize: 17 }}>รายชื่อและความก้าวหน้าของผู้เรียน</strong>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>เลือกห้องเรียน:</span>
            <select
              className="input"
              style={{ width: 'auto', padding: '6px 12px', fontSize: 13 }}
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
            >
              <option value="all">ทุกห้องเรียน (ม.5/1 - ม.5/6)</option>
              {COURSE.classrooms.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Student Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left', color: 'var(--muted)' }}>
                <th style={{ padding: '10px 12px' }}>รหัสนักเรียน</th>
                <th style={{ padding: '10px 12px' }}>ชื่อ - นามสกุล</th>
                <th style={{ padding: '10px 12px' }}>ห้อง</th>
                <th style={{ padding: '10px 12px' }}>Unit 1</th>
                <th style={{ padding: '10px 12px' }}>Unit 2</th>
                <th style={{ padding: '10px 12px' }}>Unit 3</th>
                <th style={{ padding: '10px 12px' }}>Unit 4</th>
                <th style={{ padding: '10px 12px' }}>Quiz เฉลี่ย</th>
                <th style={{ padding: '10px 12px' }}>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s, idx) => (
                <tr key={s.id} style={{ borderBottom: '1px solid rgba(155,135,245,.1)', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.015)' }}>
                  <td style={{ padding: '12px', fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--dim)' }}>{s.id}</td>
                  <td style={{ padding: '12px', fontWeight: 500 }}>{s.name}</td>
                  <td style={{ padding: '12px' }}><Badge tone="cyan">{s.classroom}</Badge></td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 12 }}>{s.u1}%</span>
                      <ProgressBar value={s.u1} />
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 12 }}>{s.u2}%</span>
                      <ProgressBar value={s.u2} />
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 12 }}>{s.u3}%</span>
                      <ProgressBar value={s.u3} />
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 12 }}>{s.u4}%</span>
                      <ProgressBar value={s.u4} />
                    </div>
                  </td>
                  <td style={{ padding: '12px', fontWeight: 600, color: s.quizAvg >= 70 ? 'var(--ok)' : 'var(--warn)' }}>
                    {s.quizAvg}%
                  </td>
                  <td style={{ padding: '12px' }}>
                    <Badge tone={s.status === 'เสร็จสมบูรณ์' ? 'ok' : 'info'}>{s.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

export default TeacherDashboard;
