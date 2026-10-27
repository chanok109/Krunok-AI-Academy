import React, { useMemo, useState, useEffect } from 'react';
import { COURSE, UNITS, QUIZ_PASS_PERCENT, API_CONFIG } from '../data/courseData.js';
import { useApp } from '../context/AppContext.jsx';
import { useRoute } from '../context/RouteContext.jsx';
import { Icon, AIraBot, GlassCard, Button, Badge, DemoBadge, ProgressRing, ProgressBar } from '../components/UIPrimitives.jsx';
import { Modal } from '../components/UIHelpers.jsx';
import { api } from '../services/apiService.js';

export function TeacherDashboard() {
  const { user, notify } = useApp();
  const { navigate } = useRoute();

  const [selectedClass, setSelectedClass] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('roster'); // 'roster' | 'analytics' | 'settings'

  // Assessment Modal State
  const [evaluatingStudent, setEvaluatingStudent] = useState(null);
  const [rubricScores, setRubricScores] = useState({
    problem: 4,
    data: 3,
    model: 4,
    ethics: 4
  });
  const [feedbackText, setFeedbackText] = useState('');
  const [isSavingEval, setIsSavingEval] = useState(false);

  // Endpoint settings
  const [gasUrlInput, setGasUrlInput] = useState(API_CONFIG.gasEndpoint || '');
  const [isTestingGas, setIsTestingGas] = useState(false);
  const [gasTestResult, setGasTestResult] = useState(null);

  // Student Data (Initial Mock Dataset for 6 classes, expandable with GAS API)
  const [students, setStudents] = useState([
    {
      id: 'STD-50101',
      name: 'ชญานนท์ เจริญวิทย์',
      classroom: 'ม.5/1',
      email: 'chayanon@student.pcccr.ac.th',
      u1: 100, u2: 100, u3: 90, u4: 75,
      q1: 100, q2: 93, q3: 87,
      quizAvg: 93,
      projectTitle: 'ระบบตรวจจับและจำแนกพันธุ์ข้าวเหนียวเขี้ยวงูเชียงรายด้วย Computer Vision',
      projectDesc: 'พัฒนาโมเดล AI ตรวจจับเมล็ดข้าวเหนียวที่มีรอยตำหนิและจำแนกสายพันธุ์บริสุทธิ์เพื่อเกษตรกรท้องถิ่น',
      projectEvidence: 'https://github.com/pcccr-ai/sticky-rice-vision',
      projectStatus: 'SUBMITTED',
      projectScore: null,
      teacherFeedback: ''
    },
    {
      id: 'STD-50102',
      name: 'กานต์พิชชา วงศ์สุวรรณ',
      classroom: 'ม.5/1',
      email: 'kanpitcha@student.pcccr.ac.th',
      u1: 100, u2: 95, u3: 85, u4: 60,
      q1: 93, q2: 87, q3: 80,
      quizAvg: 87,
      projectTitle: 'แบบจำลองทำนายค่าฝุ่น PM2.5 ในพื้นที่โรงเรียนด้วย Machine Learning',
      projectDesc: 'วิเคราะห์ข้อมูลสภาพอากาศ ความชื้น และทิศทางลมเพื่อแจ้งเตือนกิจกรรมกลางแจ้งของนักเรียน',
      projectEvidence: 'https://drive.google.com/pcccr-pm25-model',
      projectStatus: 'ASSESSED',
      projectScore: 15,
      teacherFeedback: 'โมเดลและขั้นตอนการทดสอบดีเยี่ยม ควรเพิ่มช่วงเวลาการพยากรณ์ล่วงหน้า 3 ชั่วโมง'
    },
    {
      id: 'STD-50201',
      name: 'ณภัทร สิริโสภณ',
      classroom: 'ม.5/2',
      email: 'naphat@student.pcccr.ac.th',
      u1: 100, u2: 100, u3: 100, u4: 100,
      q1: 100, q2: 100, q3: 100,
      quizAvg: 100,
      projectTitle: 'AI ผู้ช่วยแปลภาษามือไทยแบบเรียลไทม์ด้วย MediaPipe & Hand Landmark',
      projectDesc: 'ประยุกต์ใช้ 21 Hand Keypoints แปลภาษามือพื้นฐาน 10 ท่าเป็นเสียงพูดสำหรับผู้บกพร่องทางการได้ยิน',
      projectEvidence: 'https://github.com/naphat/thai-sign-language-ai',
      projectStatus: 'ASSESSED',
      projectScore: 16,
      teacherFeedback: 'โครงงานระดับยอดเยี่ยม มีการคำนึงถึงจริยธรรมและการใช้งานจริงอย่างครบถ้วน'
    },
    {
      id: 'STD-50202',
      name: 'พิมพ์มาดา รัตนกุล',
      classroom: 'ม.5/2',
      email: 'pimmada@student.pcccr.ac.th',
      u1: 100, u2: 85, u3: 65, u4: 40,
      q1: 87, q2: 73, q3: 67,
      quizAvg: 76,
      projectTitle: 'ระบบคัดแยกใบชาอู่หลงแม่สลองด้วยการประมวลผลภาพ',
      projectDesc: 'คัดแยกใบชาตามคุณภาพยอดอ่อน 3 ใบเพื่อเพิ่มมูลค่าผลผลิตชาเชียงราย',
      projectEvidence: '',
      projectStatus: 'DRAFT',
      projectScore: null,
      teacherFeedback: ''
    },
    {
      id: 'STD-50301',
      name: 'ธนกฤต ปัญญาวงศ์',
      classroom: 'ม.5/3',
      email: 'thanakrit@student.pcccr.ac.th',
      u1: 95, u2: 70, u3: 60, u4: 20,
      q1: 80, q2: 67, q3: 60,
      quizAvg: 69,
      projectTitle: 'ตรวจจับการสวมหมวกนิรภัยบริเวณทางเข้าโรงเรียน',
      projectDesc: 'ตรวจจับผู้ขับขี่รถจักรยานยนต์ที่ไม่สวมหมวกนิรภัยเพื่อสถิติด้านความปลอดภัย',
      projectEvidence: '',
      projectStatus: 'DRAFT',
      projectScore: null,
      teacherFeedback: ''
    },
    {
      id: 'STD-50401',
      name: 'มนัสวี ตามวงค์',
      classroom: 'ม.5/4',
      email: 'manaswee@student.pcccr.ac.th',
      u1: 100, u2: 100, u3: 95, u4: 90,
      q1: 100, q2: 93, q3: 93,
      quizAvg: 95,
      projectTitle: 'Smart Greenhouse: การตรวจจับโรคใบจุดในผักสลัดไฮโดรโปนิกส์',
      projectDesc: 'ใช้อุปกรณ์ Edge AI ตรวจจับโรคใบไหม้และใบจุดในโรงเรือนอัจฉริยะ',
      projectEvidence: 'https://github.com/manaswee/smart-greenhouse-ai',
      projectStatus: 'SUBMITTED',
      projectScore: null,
      teacherFeedback: ''
    },
    {
      id: 'STD-50501',
      name: 'ภานุวัฒน์ แสงแก้ว',
      classroom: 'ม.5/5',
      email: 'panuwat@student.pcccr.ac.th',
      u1: 100, u2: 90, u3: 80, u4: 50,
      q1: 87, q2: 80, q3: 73,
      quizAvg: 80,
      projectTitle: 'ระบบตรวจนับจำนวนรถเข้า-ออกลานจอดรถด้วย OpenCV & YOLO',
      projectDesc: 'ตรวจนับการจราจรและแจ้งเตือนจำนวนช่องจอดรถว่างแบบเรียลไทม์',
      projectEvidence: 'https://github.com/panuwat/parking-vision',
      projectStatus: 'DRAFT',
      projectScore: null,
      teacherFeedback: ''
    },
    {
      id: 'STD-50601',
      name: 'อภิชญา บุญเรือง',
      classroom: 'ม.5/6',
      email: 'apichaya@student.pcccr.ac.th',
      u1: 100, u2: 100, u3: 90, u4: 85,
      q1: 93, q2: 87, q3: 87,
      quizAvg: 89,
      projectTitle: 'AI คัดแยกขยะรีไซเคิลในโรงอาหารด้วยเสียงและภาพ',
      projectDesc: 'จำแนกขวดพลาสติก กระป๋องอลูมิเนียม และกล่องนมพร้อมระบบคะแนนสะสมความดี',
      projectEvidence: 'https://github.com/apichaya/smart-bin-ai',
      projectStatus: 'SUBMITTED',
      projectScore: null,
      teacherFeedback: ''
    }
  ]);

  // Load real roster from GAS if configured
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!api.isDemo()) {
          const resp = await api.getTeacherRoster(selectedClass);
          if (alive && resp && resp.success && Array.isArray(resp.roster) && resp.roster.length > 0) {
            // Merge with local structure
            const mapped = resp.roster.map(r => ({
              id: r.userId,
              name: r.displayName,
              classroom: r.classroom || 'ม.5/1',
              email: r.email,
              u1: r.quizScores.unit1 > 0 ? 100 : 50,
              u2: r.quizScores.unit2 > 0 ? 100 : 30,
              u3: r.quizScores.unit3 > 0 ? 100 : 20,
              u4: r.projectStatus === 'SUBMITTED' ? 80 : 20,
              q1: r.quizScores.unit1 || 0,
              q2: r.quizScores.unit2 || 0,
              q3: r.quizScores.unit3 || 0,
              quizAvg: Math.round(((r.quizScores.unit1 || 0) + (r.quizScores.unit2 || 0) + (r.quizScores.unit3 || 0)) / 3),
              projectTitle: r.projectTitle || 'โครงงานปัญญาประดิษฐ์',
              projectDesc: '',
              projectEvidence: '',
              projectStatus: r.projectStatus || 'NOT_STARTED',
              projectScore: r.latestAssessment ? r.latestAssessment.totalScore : null,
              teacherFeedback: r.latestAssessment ? r.latestAssessment.feedback : ''
            }));
            setStudents(mapped);
          }
        }
      } catch (e) {
        console.warn('Failed to load server roster:', e);
      }
    })();
    return () => { alive = false; };
  }, [selectedClass]);

  // Filter students based on classroom, status, and search query
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      if (selectedClass !== 'all' && s.classroom !== selectedClass) return false;
      if (filterStatus === 'passed' && s.quizAvg < QUIZ_PASS_PERCENT) return false;
      if (filterStatus === 'failed' && s.quizAvg >= QUIZ_PASS_PERCENT) return false;
      if (filterStatus === 'submitted' && s.projectStatus !== 'SUBMITTED') return false;
      if (filterStatus === 'assessed' && s.projectStatus !== 'ASSESSED') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        return s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.classroom.includes(q);
      }
      return true;
    });
  }, [students, selectedClass, filterStatus, searchQuery]);

  // Aggregate statistics
  const stats = useMemo(() => {
    const list = selectedClass === 'all' ? students : students.filter(s => s.classroom === selectedClass);
    const total = list.length;
    if (!total) return { total: 0, passRate: 0, avgQuiz: 0, avgProgress: 0, submittedProjects: 0, assessedProjects: 0 };

    const passedCount = list.filter(s => s.quizAvg >= QUIZ_PASS_PERCENT).length;
    const avgQuiz = Math.round(list.reduce((acc, s) => acc + s.quizAvg, 0) / total);
    const avgProgress = Math.round(list.reduce((acc, s) => acc + (s.u1 + s.u2 + s.u3 + s.u4) / 4, 0) / total);
    const submittedProjects = list.filter(s => s.projectStatus === 'SUBMITTED' || s.projectStatus === 'ASSESSED').length;
    const assessedProjects = list.filter(s => s.projectStatus === 'ASSESSED').length;

    return {
      total,
      passRate: Math.round((passedCount / total) * 100),
      avgQuiz,
      avgProgress,
      submittedProjects,
      assessedProjects
    };
  }, [students, selectedClass]);

  // Open Assessment Modal for a student
  const handleOpenAssess = (student) => {
    setEvaluatingStudent(student);
    setRubricScores({
      problem: 4,
      data: 3,
      model: 4,
      ethics: 4
    });
    setFeedbackText(student.teacherFeedback || '');
  };

  // Submit Assessment
  const handleSaveAssessment = async () => {
    if (!evaluatingStudent) return;
    setIsSavingEval(true);
    const totalScore = rubricScores.problem + rubricScores.data + rubricScores.model + rubricScores.ethics;

    try {
      await api.assessStudentProject({
        studentUserId: evaluatingStudent.id,
        projectId: 'PRJ-' + evaluatingStudent.id,
        rubricScores,
        totalScore,
        maxScore: 16,
        feedback: feedbackText
      });

      // Update in local state
      setStudents(prev => prev.map(s => {
        if (s.id === evaluatingStudent.id) {
          return {
            ...s,
            projectStatus: 'ASSESSED',
            projectScore: totalScore,
            teacherFeedback: feedbackText
          };
        }
        return s;
      }));

      notify({
        type: 'success',
        title: 'บันทึกผลการประเมินแล้ว',
        message: `ประเมินโครงงานของ ${evaluatingStudent.name} (${totalScore}/16 คะแนน) เรียบร้อย`
      });
      setEvaluatingStudent(null);
    } catch (e) {
      notify({
        type: 'error',
        title: 'บันทึกผลการประเมินไม่สำเร็จ',
        message: e.message || 'กรุณาลองใหม่อีกครั้ง'
      });
    } finally {
      setIsSavingEval(false);
    }
  };

  // Export Roster to CSV with UTF-8 BOM
  const handleExportCSV = () => {
    const headers = [
      'รหัสนักเรียน',
      'ชื่อ-นามสกุล',
      'ห้องเรียน',
      'อีเมล',
      'ความก้าวหน้า U1 (%)',
      'ความก้าวหน้า U2 (%)',
      'ความก้าวหน้า U3 (%)',
      'ความก้าวหน้า U4 (%)',
      'คะแนน Quiz U1 (%)',
      'คะแนน Quiz U2 (%)',
      'คะแนน Quiz U3 (%)',
      'คะแนนเฉลี่ยรวม (%)',
      'ผลการประเมินแบบทดสอบ',
      'ชื่อโครงงาน AI',
      'สถานะโครงงาน',
      'คะแนนโครงงาน (เต็ม 16)',
      'ข้อเสนอแนะครูผู้สอน'
    ];

    const rows = filteredStudents.map(s => [
      `"${s.id}"`,
      `"${s.name}"`,
      `"${s.classroom}"`,
      `"${s.email}"`,
      s.u1,
      s.u2,
      s.u3,
      s.u4,
      s.q1,
      s.q2,
      s.q3,
      s.quizAvg,
      s.quizAvg >= QUIZ_PASS_PERCENT ? 'ผ่านเกณฑ์' : 'ไม่ผ่านเกณฑ์',
      `"${(s.projectTitle || '').replace(/"/g, '""')}"`,
      `"${s.projectStatus}"`,
      s.projectScore != null ? s.projectScore : '-',
      `"${(s.teacherFeedback || '').replace(/"/g, '""')}"`
    ]);

    // Prepend UTF-8 BOM (\uFEFF) so Microsoft Excel opens Thai characters without garbling
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KruNok_AI_Academy_คะแนน_${selectedClass === 'all' ? 'ทุกห้อง' : selectedClass}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    notify({
      type: 'success',
      title: 'ส่งออกไฟล์ CSV สำเร็จ',
      message: 'ดาวน์โหลดไฟล์ผลการเรียนสำหรับเปิดใน Excel เรียบร้อยแล้ว'
    });
  };

  // Test GAS Endpoint Connection
  const handleTestGas = async () => {
    if (!gasUrlInput.trim()) {
      alert('กรุณากรอก URL ของ Google Apps Script Web App');
      return;
    }
    setIsTestingGas(true);
    setGasTestResult(null);
    try {
      const resp = await fetch(gasUrlInput.trim() + '?action=ping');
      const data = await resp.json();
      if (data && data.status === 'online') {
        localStorage.setItem('krunok_gas_endpoint', gasUrlInput.trim());
        localStorage.setItem('krunok_data_mode', 'gas');
        setGasTestResult({
          ok: true,
          msg: `เชื่อมต่อสำเร็จ! ระบบ: ${data.app} (ว32281) Schema v${data.version}`
        });
        notify({
          type: 'success',
          title: 'เชื่อมต่อ Google Apps Script สำเร็จ',
          message: 'บันทึก URL ลงในระบบเรียบร้อยแล้ว'
        });
      } else {
        throw new Error('ตอบกลับไม่ตรงรูปแบบ');
      }
    } catch (err) {
      setGasTestResult({
        ok: false,
        msg: `เชื่อมต่อไม่สำเร็จ: ${err.message}. ตรวจสอบว่าได้ Deploy เป็น Web App (Who has access: Anyone) หรือยัง`
      });
    } finally {
      setIsTestingGas(false);
    }
  };

  // Role Guard Check (RBAC)
  const isAuthorized = user && (user.role === 'TEACHER' || user.role === 'ADMIN' || user.mode === 'demo');

  if (!isAuthorized) {
    return (
      <div style={{ maxWidth: 640, margin: '60px auto', padding: '0 16px' }}>
        <GlassCard style={{ textAlign: 'center', padding: '40px 24px' }}>
          <div style={{ color: 'var(--warn)', marginBottom: 16 }}>
            <Icon name="lock" size={48} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>สิทธิ์การเข้าถึงถูกจำกัด (Access Restricted)</h2>
          <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
            หน้านี้สำหรับคุณครูผู้สอนและผู้ดูแลระบบรายวิชา ว32281 เท่านั้น<br />
            บัญชีปัจจุบันของคุณ <strong>({user?.displayName || 'นักเรียน'})</strong> ไม่มีสิทธิ์เข้าถึงข้อมูลผลการเรียนของผู้อื่น
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Button variant="primary" icon="home" onClick={() => navigate('home')}>
              กลับสู่บทเรียนนักเรียน
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: 24, padding: '16px 0' }}>
      {/* Header Banner */}
      <GlassCard pad={false} className="welcome" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
              <Badge tone="cyan" dot>แดชบอร์ดครูผู้สอน (Teacher Dashboard)</Badge>
              <Badge>{COURSE.code} {COURSE.name}</Badge>
              {api.isDemo() ? <DemoBadge /> : <Badge tone="ok">GAS Production Connected</Badge>}
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
              ระบบติดตามผลการเรียนรู้และประเมินผล <span className="grad-text">KruNok AI Academy</span>
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>
              ครูผู้สอน: <strong>{COURSE.teacher}</strong> · {COURSE.school}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <Button
              variant={activeTab === 'roster' ? 'primary' : 'ghost'}
              icon="grid"
              onClick={() => setActiveTab('roster')}
            >
              รายชื่อนักเรียน
            </Button>
            <Button
              variant={activeTab === 'analytics' ? 'primary' : 'ghost'}
              icon="chart"
              onClick={() => setActiveTab('analytics')}
            >
              สถิติภาพรวม
            </Button>
            <Button
              variant={activeTab === 'settings' ? 'primary' : 'ghost'}
              icon="cpu"
              onClick={() => setActiveTab('settings')}
            >
              สถานะ Backend
            </Button>
            <Button variant="ghost" icon="home" onClick={() => navigate('home')}>
              มุมมองนักเรียน
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* KPI Stats Overview */}
      <section className="stats4" aria-label="ภาพรวมสถิติชั้นเรียน">
        <GlassCard pad={false} className="stat">
          <div className="stat-body">
            <span className="stat-num grad-text">{stats.total}</span>
            <span className="stat-lbl">นักเรียนในห้องที่เลือก</span>
            <small style={{ color: 'var(--muted)', fontSize: 12 }}>ระดับชั้น ม.5 (ห้อง {selectedClass === 'all' ? 'ทั้งหมด' : selectedClass})</small>
          </div>
        </GlassCard>

        <GlassCard pad={false} className="stat">
          <div className="stat-body">
            <span className="stat-num" style={{ color: stats.passRate >= 70 ? 'var(--ok)' : 'var(--warn)' }}>
              {stats.passRate}%
            </span>
            <span className="stat-lbl">อัตราผ่าน Quiz</span>
            <small style={{ color: 'var(--muted)', fontSize: 12 }}>เกณฑ์ผ่าน {QUIZ_PASS_PERCENT}% ขึ้นไป</small>
          </div>
        </GlassCard>

        <GlassCard pad={false} className="stat">
          <div className="stat-body">
            <span className="stat-num" style={{ color: 'var(--cyan)' }}>{stats.avgProgress}%</span>
            <span className="stat-lbl">ความก้าวหน้าเฉลี่ย</span>
            <small style={{ color: 'var(--muted)', fontSize: 12 }}>หน่วยที่ 1 ถึง 4</small>
          </div>
        </GlassCard>

        <GlassCard pad={false} className="stat">
          <div className="stat-body">
            <span className="stat-num" style={{ color: 'var(--gold)' }}>
              {stats.submittedProjects} / {stats.total}
            </span>
            <span className="stat-lbl">โครงงานที่ส่งแล้ว</span>
            <small style={{ color: 'var(--muted)', fontSize: 12 }}>ตรวจแล้ว {stats.assessedProjects} รายการ</small>
          </div>
        </GlassCard>
      </section>

      {/* TAB 1: STUDENT ROSTER & SCORE MANAGEMENT */}
      {activeTab === 'roster' && (
        <GlassCard>
          {/* Controls Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
            {/* Classrooms Selector */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>ห้องเรียน:</span>
              <button
                className={`tag ${selectedClass === 'all' ? 'active' : ''}`}
                style={{ cursor: 'pointer', padding: '6px 14px' }}
                onClick={() => setSelectedClass('all')}
              >
                ทุกห้อง
              </button>
              {COURSE.classrooms.map(c => (
                <button
                  key={c}
                  className={`tag ${selectedClass === c ? 'active' : ''}`}
                  style={{ cursor: 'pointer', padding: '6px 14px' }}
                  onClick={() => setSelectedClass(c)}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Actions: Export CSV & Filter */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="ค้นหาชื่อหรือรหัสนักเรียน..."
                className="input"
                style={{ width: 200, padding: '6px 12px', fontSize: 13 }}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />

              <select
                className="input"
                style={{ width: 'auto', padding: '6px 12px', fontSize: 13 }}
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="passed">ผ่าน Quiz (≥70%)</option>
                <option value="failed">ยังไม่ผ่าน Quiz (&lt;70%)</option>
                <option value="submitted">ส่งโครงงานแล้ว</option>
                <option value="assessed">ตรวจโครงงานแล้ว</option>
              </select>

              <Button
                variant="primary"
                icon="trophy"
                onClick={handleExportCSV}
                title="ส่งออกไฟล์คะแนนในรูปแบบ CSV สำหรับเปิดด้วย Microsoft Excel"
              >
                ส่งออก CSV (Excel)
              </Button>
            </div>
          </div>

          {/* Table Container */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--line)', textAlign: 'left', color: 'var(--muted)', fontSize: 13 }}>
                  <th style={{ padding: '12px' }}>รหัส</th>
                  <th style={{ padding: '12px' }}>ชื่อ - นามสกุล</th>
                  <th style={{ padding: '12px' }}>ห้อง</th>
                  <th style={{ padding: '12px' }}>Unit 1</th>
                  <th style={{ padding: '12px' }}>Unit 2</th>
                  <th style={{ padding: '12px' }}>Unit 3</th>
                  <th style={{ padding: '12px' }}>Unit 4</th>
                  <th style={{ padding: '12px' }}>Quiz เฉลี่ย</th>
                  <th style={{ padding: '12px' }}>สถานะโครงงาน</th>
                  <th style={{ padding: '12px' }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ textAlign: 'center', padding: '36px', color: 'var(--muted)' }}>
                      ไม่พบข้อมูลนักเรียนตามเงื่อนไขที่เลือก
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s, idx) => (
                    <tr
                      key={s.id}
                      style={{
                        borderBottom: '1px solid rgba(155,135,245,.1)',
                        background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.015)'
                      }}
                    >
                      <td style={{ padding: '12px', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--dim)' }}>
                        {s.id}
                      </td>
                      <td style={{ padding: '12px', fontWeight: 600 }}>
                        {s.name}
                        <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 400 }}>{s.email}</div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <Badge tone="cyan">{s.classroom}</Badge>
                      </td>
                      <td style={{ padding: '12px', minWidth: 90 }}>
                        <div style={{ fontSize: 12, marginBottom: 2 }}>{s.u1}%</div>
                        <ProgressBar value={s.u1} />
                      </td>
                      <td style={{ padding: '12px', minWidth: 90 }}>
                        <div style={{ fontSize: 12, marginBottom: 2 }}>{s.u2}%</div>
                        <ProgressBar value={s.u2} />
                      </td>
                      <td style={{ padding: '12px', minWidth: 90 }}>
                        <div style={{ fontSize: 12, marginBottom: 2 }}>{s.u3}%</div>
                        <ProgressBar value={s.u3} />
                      </td>
                      <td style={{ padding: '12px', minWidth: 90 }}>
                        <div style={{ fontSize: 12, marginBottom: 2 }}>{s.u4}%</div>
                        <ProgressBar value={s.u4} />
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{
                            fontWeight: 700,
                            color: s.quizAvg >= QUIZ_PASS_PERCENT ? 'var(--ok)' : 'var(--warn)'
                          }}>
                            {s.quizAvg}%
                          </span>
                          <Badge tone={s.quizAvg >= QUIZ_PASS_PERCENT ? 'ok' : 'demo'}>
                            {s.quizAvg >= QUIZ_PASS_PERCENT ? 'ผ่าน' : 'ไม่ผ่าน'}
                          </Badge>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        {s.projectStatus === 'ASSESSED' ? (
                          <Badge tone="ok">ตรวจแล้ว ({s.projectScore}/16)</Badge>
                        ) : s.projectStatus === 'SUBMITTED' ? (
                          <Badge tone="cyan">รอตรวจ</Badge>
                        ) : (
                          <Badge tone="info">ยังไม่ส่ง</Badge>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <Button
                          size="sm"
                          variant={s.projectStatus === 'SUBMITTED' ? 'primary' : 'ghost'}
                          icon="target"
                          onClick={() => handleOpenAssess(s)}
                        >
                          {s.projectStatus === 'ASSESSED' ? 'ดู/แก้ผลตรวจ' : 'ตรวจโครงงาน'}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* TAB 2: VISUAL ANALYTICS & LEARNING PROGRESS */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'grid', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            <GlassCard>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="chart" size={18} />
                อัตราการผ่านเกณฑ์ Quiz แต่ละหน่วยการเรียน (≥70%)
              </h3>
              <div style={{ display: 'grid', gap: 14 }}>
                {UNITS.slice(0, 3).map(u => {
                  const passCount = filteredStudents.filter(s => (s['q' + u.no] || 0) >= QUIZ_PASS_PERCENT).length;
                  const pct = filteredStudents.length ? Math.round((passCount / filteredStudents.length) * 100) : 0;
                  return (
                    <div key={u.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                        <span><strong>หน่วยที่ {u.no}:</strong> {u.title}</span>
                        <span style={{ fontWeight: 700, color: pct >= 70 ? 'var(--ok)' : 'var(--warn)' }}>
                          {pct}% ({passCount}/{filteredStudents.length} คน)
                        </span>
                      </div>
                      <ProgressBar value={pct} />
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            <GlassCard>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="puzzle" size={18} />
                สถานะการส่งโครงงาน AI Capstone (Unit 4)
              </h3>
              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                    <span>ตรวจและประเมินแล้ว (Assessed)</span>
                    <span style={{ fontWeight: 700, color: 'var(--ok)' }}>
                      {filteredStudents.filter(s => s.projectStatus === 'ASSESSED').length} คน
                    </span>
                  </div>
                  <ProgressBar value={filteredStudents.length ? Math.round((filteredStudents.filter(s => s.projectStatus === 'ASSESSED').length / filteredStudents.length) * 100) : 0} />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                    <span>รอการตรวจ (Pending Review)</span>
                    <span style={{ fontWeight: 700, color: 'var(--cyan)' }}>
                      {filteredStudents.filter(s => s.projectStatus === 'SUBMITTED').length} คน
                    </span>
                  </div>
                  <ProgressBar value={filteredStudents.length ? Math.round((filteredStudents.filter(s => s.projectStatus === 'SUBMITTED').length / filteredStudents.length) * 100) : 0} />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                    <span>กำลังพัฒนา / ยังไม่ส่ง (Drafting)</span>
                    <span style={{ fontWeight: 700, color: 'var(--muted)' }}>
                      {filteredStudents.filter(s => s.projectStatus !== 'SUBMITTED' && s.projectStatus !== 'ASSESSED').length} คน
                    </span>
                  </div>
                  <ProgressBar value={filteredStudents.length ? Math.round((filteredStudents.filter(s => s.projectStatus !== 'SUBMITTED' && s.projectStatus !== 'ASSESSED').length / filteredStudents.length) * 100) : 0} />
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* TAB 3: BACKEND & SETTINGS */}
      {activeTab === 'settings' && (
        <div style={{ display: 'grid', gap: 20 }}>
          <GlassCard style={{ borderLeft: '4px solid var(--neon)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
              การเชื่อมต่อ Google Apps Script & Google Sheets Backend
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
              ระบบรองรับการเชื่อมต่อกับ Google Apps Script Web App เพื่อบันทึกคะแนนนักเรียนลงใน Google Sheets ทั้ง 8 ตารางอย่างปลอดภัย
            </p>

            <div style={{ display: 'grid', gap: 12, maxWidth: 600 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                Google Apps Script Web App URL:
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="input"
                  value={gasUrlInput}
                  onChange={e => setGasUrlInput(e.target.value)}
                  style={{ flex: 1 }}
                />
                <Button
                  variant="primary"
                  icon="refresh"
                  disabled={isTestingGas}
                  onClick={handleTestGas}
                >
                  {isTestingGas ? 'กำลังทดสอบ...' : 'ทดสอบ & บันทึก'}
                </Button>
              </div>

              {gasTestResult && (
                <div style={{
                  padding: 12,
                  borderRadius: 8,
                  fontSize: 13,
                  background: gasTestResult.ok ? 'rgba(76, 217, 100, 0.12)' : 'rgba(255, 69, 58, 0.12)',
                  color: gasTestResult.ok ? 'var(--ok)' : 'var(--warn)',
                  border: `1px solid ${gasTestResult.ok ? 'var(--ok)' : 'var(--warn)'}`
                }}>
                  {gasTestResult.msg}
                </div>
              )}
            </div>
          </GlassCard>

          <GlassCard>
            <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>โครงสร้างฐานข้อมูล Google Sheets (Schema 8 แผ่นงาน)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
              {['Users', 'Units', 'Lessons', 'Progress', 'QuizAttempts', 'Projects', 'Assessments', 'AuditLogs'].map(sheet => (
                <div key={sheet} style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--line)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{sheet}</span>
                  <Badge tone="cyan">Ready</Badge>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* PROJECT EVALUATION MODAL */}
      {evaluatingStudent && (
        <Modal
          title={`ตรวจและประเมินโครงงาน AI: ${evaluatingStudent.name} (${evaluatingStudent.classroom})`}
          onClose={() => setEvaluatingStudent(null)}
        >
          <div style={{ display: 'grid', gap: 16 }}>
            {/* Project Overview */}
            <div style={{ padding: 14, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--line)' }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 2 }}>ชื่อโครงงาน:</div>
              <strong style={{ fontSize: 16, color: 'var(--cyan)' }}>
                {evaluatingStudent.projectTitle || 'ยังไม่ได้ระบุชื่อโครงงาน'}
              </strong>
              {evaluatingStudent.projectDesc && (
                <p style={{ fontSize: 13, color: 'var(--text)', marginTop: 8, lineHeight: 1.5 }}>
                  {evaluatingStudent.projectDesc}
                </p>
              )}
              {evaluatingStudent.projectEvidence && (
                <div style={{ marginTop: 8 }}>
                  <a
                    href={evaluatingStudent.projectEvidence}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: 13, color: 'var(--neon)', textDecoration: 'underline' }}
                  >
                    🔗 เปิดดูผลงาน / ซอร์สโค้ด / เอกสารแนบ
                  </a>
                </div>
              )}
            </div>

            {/* Rubric Evaluation (4 Criteria x 4 Points = 16 Points) */}
            <div style={{ display: 'grid', gap: 12 }}>
              <h4 style={{ fontSize: 15, fontWeight: 700 }}>เกณฑ์การประเมินรูบริก (Rubric Assessment — เต็ม 16 คะแนน)</h4>

              {[
                { key: 'problem', label: '1. การระบุปัญหาและขอบเขต (Problem Definition)', desc: 'ความชัดเจนของปัญหา ประโยชน์ต่อผู้ใช้ และความเหมาะสมในการใช้ AI' },
                { key: 'data', label: '2. คุณภาพและการเตรียมข้อมูล (Data Preparation)', desc: 'ปริมาณข้อมูล ความหลากหลาย การทำความสะอาด และการป้องกันความลำเอียง' },
                { key: 'model', label: '3. การเลือกและฝึกโมเดล AI (Model & Evaluation)', desc: 'ความถูกต้องของโมเดล การทดสอบด้วยชุดข้อมูลทดสอบ และค่าความแม่นยำ' },
                { key: 'ethics', label: '4. จริยธรรมและความปลอดภัย (Ethics & Safety)', desc: 'การปฏิบัติตาม PDPA การคำนึงถึงความเป็นธรรม และการจัดการความเสี่ยง' },
              ].map(crit => (
                <div key={crit.key} style={{ padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <strong style={{ fontSize: 13 }}>{crit.label}</strong>
                    <Badge tone="cyan">{rubricScores[crit.key]} / 4 คะแนน</Badge>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>{crit.desc}</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[1, 2, 3, 4].map(pt => (
                      <button
                        key={pt}
                        type="button"
                        className={`btn ${rubricScores[crit.key] === pt ? 'btn-primary' : 'btn-ghost'}`}
                        style={{ flex: 1, padding: '4px 0', fontSize: 12 }}
                        onClick={() => setRubricScores(prev => ({ ...prev, [crit.key]: pt }))}
                      >
                        {pt} คะแนน
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Rubric Score */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              borderRadius: 8,
              background: 'rgba(0, 229, 255, 0.08)',
              border: '1px solid rgba(0, 229, 255, 0.2)'
            }}>
              <span style={{ fontWeight: 600 }}>คะแนนรวมรูบริก:</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--neon)' }}>
                {rubricScores.problem + rubricScores.data + rubricScores.model + rubricScores.ethics} / 16 คะแนน
              </span>
            </div>

            {/* Individual Feedback */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                ข้อเสนอแนะและคำแนะนำรายบุคคลจากคุณครู:
              </label>
              <textarea
                className="input"
                rows={3}
                placeholder="เขียนคำแนะนำ คำชมเชย หรือจุดที่ควรพัฒนาเพิ่มเติมให้นักเรียน..."
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
              <Button variant="ghost" onClick={() => setEvaluatingStudent(null)}>
                ยกเลิก
              </Button>
              <Button
                variant="primary"
                icon="check"
                disabled={isSavingEval}
                onClick={handleSaveAssessment}
              >
                {isSavingEval ? 'กำลังบันทึก...' : 'บันทึกผลการประเมิน'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default TeacherDashboard;
