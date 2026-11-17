import React, { useState, useEffect, useRef, useCallback } from 'react';
import { UnitHeroBg, UnitObjectives } from '../components/UnitHero.jsx';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext.jsx';
import { Icon, Badge, DemoBadge, ProgressRing, AIraBot } from '../components/UIPrimitives.jsx';
import { Modal, Callout } from '../components/UIHelpers.jsx';
import { QuizRunner } from '../components/QuizRunner.jsx';
import { CvMiniGame } from '../components/CvMiniGame.jsx';
import { U2_QUIZ, U2_REFS } from '../data/unit2Data.js';

const U2_OBJECTIVES = [
  "อธิบายหลักการมองเห็นของคอมพิวเตอร์และโครงสร้างข้อมูลภาพดิจิทัล (พิกเซล, BGR, Grayscale) ได้",
  "ติดตั้งและใช้งานภาษา Python ร่วมกับ OpenCV สำหรับอ่าน แสดงผล และบันทึกภาพเบื้องต้นได้",
  "ประยุกต์ใช้เทคนิคการประมวลผลภาพ อ่านวิดีโอจากกล้อง และแยกวัตถุตามสีด้วยปริภูมิสี HSV ได้",
  "อธิบายและทดลองการตรวจจับใบหน้าด้วย Haar Cascade / YuNet พร้อมตระหนักถึงกฎหมาย PDPA ได้"
];

const U2_CHECK_STORAGE_KEY = 'krunok_u2_timeline_checks_v1';

const U2_ITEM_PROGRESS_MAP = {
  'u2-item-1': [{ kind: 'activities', id: 'u2-a1' }],
  'u2-item-2': [{ kind: 'lessons', id: 'u2-l1' }],
  'u2-item-3': [{ kind: 'lessons', id: 'u2-l2' }],
  'u2-item-4': [{ kind: 'activities', id: 'u2-a2' }],
  'u2-item-5': [
    { kind: 'lessons', id: 'u2-l3' },
    { kind: 'activities', id: 'u2-a3' }
  ],
  'u2-item-6': [{ kind: 'lessons', id: 'u2-l4' }],
  'u2-item-7': [{ kind: 'activities', id: 'u2-a4' }],
  'u2-item-8': [{ kind: 'lessons', id: 'u2-l5' }],
  'u2-item-9': [{ kind: 'activities', id: 'u2-a5' }]
};

function VisionStage({ mood = "happy" }) {
  return (
    <div className="vision-stage">
      <svg className="vision-net" viewBox="0 0 480 390" aria-hidden="true">
        <defs>
          <linearGradient id="cvCardGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F5F8FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#F1EDF9" stopOpacity="0.75" />
          </linearGradient>

          <radialGradient id="cvIrisRad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00F0FF" />
            <stop offset="35%" stopColor="#7DB8FF" />
            <stop offset="70%" stopColor="#7475C4" />
            <stop offset="100%" stopColor="#00105B" />
          </radialGradient>

          <filter id="cvGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <pattern id="cvDots" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="rgba(116, 117, 196, 0.22)" />
          </pattern>

          <clipPath id="cvEyeClip">
            <path d="M125 155 Q265 65 405 155 Q265 245 125 155 Z" />
          </clipPath>

          <linearGradient id="cvLaserGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0" />
            <stop offset="35%" stopColor="#00E5FF" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#7DB8FF" stopOpacity="0.85" />
            <stop offset="65%" stopColor="#00E5FF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 1. Holographic Rounded Canvas */}
        <rect
          x="12"
          y="14"
          width="456"
          height="356"
          rx="26"
          fill="url(#cvCardGrad)"
          stroke="rgba(165, 180, 252, 0.45)"
          strokeWidth="1.5"
          filter="drop-shadow(0 12px 28px rgba(116, 117, 196, 0.08))"
        />
        <rect x="12" y="14" width="456" height="356" rx="26" fill="url(#cvDots)" />

        {/* 2. Pixel Matrix (Left side: 5x7 grid) */}
        <g transform="translate(36, 68)">
          {[
            ["#D9CDEE", "#E8E1F4", "#BFD9F5", "#D9CDEE", "#9CC8F5"],
            ["#E8E1F4", "#D9CDEE", "#D9CDEE", "#E2D7F0", "#BFD9F5"],
            ["#BFD9F5", "#D9CDEE", "#C9B5E0", "#D9CDEE", "#E8E1F4"],
            ["#D9CDEE", "#7DB8FF", "#D9CDEE", "#E8E1F4", "#D9CDEE"],
            ["#E8E1F4", "#D9CDEE", "#E8E1F4", "#D9CDEE", "#BFD9F5"],
            ["#BFD9F5", "#E8E1F4", "#D9CDEE", "#C9B5E0", "#D9CDEE"],
            ["#D9CDEE", "#BFD9F5", "#E8E1F4", "#D9CDEE", "#7DB8FF"]
          ].map((row, r) =>
            row.map((color, c) => (
              <rect
                key={`${r}-${c}`}
                className="art-matrix-cell"
                x={c * 15}
                y={r * 15}
                width="11"
                height="11"
                rx="2.5"
                fill={color}
                opacity="0.88"
                style={{ animationDelay: `${(r * 5 + c) * 0.08}s` }}
              />
            ))
          )}
        </g>

        {/* RGB Pill Badge on Left */}
        <g transform="translate(18, 192)">
          <rect
            width="132"
            height="26"
            rx="7"
            fill="#FFFFFF"
            stroke="#D9CDEE"
            strokeWidth="1.2"
            filter="drop-shadow(0 3px 8px rgba(96, 97, 182, 0.08))"
          />
          <text
            x="10"
            y="17"
            fill="#2E3566"
            fontSize="10.5"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="700"
            letterSpacing="0.2"
          >
            BGR(0, 255, 128)
          </text>
        </g>

        {/* 3. Computer Vision Cyber Eye */}
        <path
          d="M125 155 Q265 65 405 155 Q265 245 125 155 Z"
          fill="#100C26"
          stroke="#6061B6"
          strokeWidth="3"
          filter="url(#cvGlow)"
        />
        <path
          d="M142 155 Q265 80 388 155 Q265 230 142 155 Z"
          fill="none"
          stroke="rgba(125, 184, 255, 0.35)"
          strokeWidth="1.2"
        />

        {/* Iris */}
        <circle
          className="art-iris-pulse"
          cx="265"
          cy="155"
          r="46"
          fill="url(#cvIrisRad)"
          filter="url(#cvGlow)"
        />
        <circle
          cx="265"
          cy="155"
          r="36"
          fill="none"
          stroke="rgba(255, 255, 255, 0.45)"
          strokeDasharray="3 4"
        />
        <circle cx="265" cy="155" r="19" fill="#0A071B" />
        <circle cx="253" cy="144" r="6.5" fill="#FFFFFF" opacity="0.95" />
        <circle cx="277" cy="165" r="2.5" fill="#7DB8FF" opacity="0.85" />

        {/* Laser Scanning Beam */}
        <g clipPath="url(#cvEyeClip)">
          <g className="cv-laser-sweep">
            <rect
              x="120"
              y="142"
              width="290"
              height="26"
              fill="url(#cvLaserGrad)"
            />
            <line
              x1="120"
              x2="410"
              y1="155"
              y2="155"
              stroke="#00F0FF"
              strokeWidth="3.2"
              filter="url(#cvGlow)"
            />
            <line
              x1="130"
              x2="400"
              y1="155"
              y2="155"
              stroke="#FFFFFF"
              strokeWidth="1.4"
              opacity="0.95"
            />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 -42; 0 42; 0 -42"
              dur="2.4s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
            />
          </g>
        </g>

        {/* Yellow Bounding Box Reticles */}
        <g className="art-reticle-pulse">
          <path
            d="M195 95 h-16 v16 M335 95 h16 v16 M195 215 h-16 v-16 M335 215 h16 v-16"
            fill="none"
            stroke="#FBBF24"
            strokeWidth="3.2"
            strokeLinecap="round"
            filter="url(#cvGlow)"
          />
        </g>

        {/* 4. Top-Right Badges */}
        <g transform="translate(300, 32)">
          <rect
            width="150"
            height="27"
            rx="7"
            fill="#FFFFFF"
            stroke="#BFD9F5"
            strokeWidth="1.2"
            filter="drop-shadow(0 3px 10px rgba(77, 155, 224, 0.12))"
          />
          <text
            x="75"
            y="17.5"
            textAnchor="middle"
            fill="#1F67B3"
            fontSize="10.5"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="700"
          >
            shape (480, 640, 3)
          </text>
        </g>

        <g transform="translate(295, 68)">
          <rect
            width="122"
            height="27"
            rx="7"
            fill="#FBBF24"
            filter="drop-shadow(0 4px 12px rgba(245, 158, 11, 0.28))"
          />
          <text
            x="61"
            y="18.5"
            textAnchor="middle"
            fill="#78350F"
            fontSize="13"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="800"
          >
            eye
          </text>
        </g>

        <g transform="translate(330, 225)">
          <rect
            width="90"
            height="25"
            rx="6"
            fill="#FFFBEB"
            stroke="#FDE68A"
            strokeWidth="1.2"
            filter="drop-shadow(0 3px 8px rgba(217, 119, 6, 0.1))"
          />
          <text
            x="45"
            y="16.5"
            textAnchor="middle"
            fill="#B45309"
            fontSize="11"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="700"
          >
            cat 93%
          </text>
        </g>
      </svg>

      {/* 5. AIra Mascot in Foreground */}
      <div className="vision-aira-wrapper">
        <AIraBot mood={mood} className="vision-aira-bot" title="AIra ผู้ช่วยปฏิบัติการคอมพิวเตอร์วิทัศน์" />
        <div className="vision-aira-badge">
          AI LAB ASSISTANT
        </div>
      </div>
    </div>
  );
}

export default function Unit2Page() {
  const { progress, summary, visitUnit, markItem } = useApp();
  const curriculumRef = useRef(null);

  // Checked state for 10 curriculum items
  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      const saved = localStorage.getItem(U2_CHECK_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Active portal viewer: null | { mode: 'read' | 'slide' | 'posttest', src?, title?, slideSrc? }
  const [activePortal, setActivePortal] = useState(null);
  const [refsOpen, setRefsOpen] = useState(false);
  const [isBrowserFs, setIsBrowserFs] = useState(() => !!(typeof document !== 'undefined' && document.fullscreenElement));

  useEffect(() => {
    visitUnit('unit2');
  }, [visitUnit]);

  const su = summary?.units?.unit2 || { percent: 0, completed: false, quizPassed: false, quizBest: null };
  const up = progress?.unit2 || { completedLessons: [], completedActivities: [] };
  const lessonsDone = up.completedLessons?.length || 0;
  const actsDone = up.completedActivities?.length || 0;

  // Persist checked items
  useEffect(() => {
    try {
      localStorage.setItem(U2_CHECK_STORAGE_KEY, JSON.stringify(checkedItems));
    } catch {
      // ignore storage errors
    }
  }, [checkedItems]);

  // Auto-mark posttest item if quiz passed
  useEffect(() => {
    if (su.quizPassed && !checkedItems['u2-item-10']) {
      setCheckedItems(prev => ({ ...prev, 'u2-item-10': true }));
    }
  }, [su.quizPassed, checkedItems]);

  // Keep ticks and course progress in step: record ticks made before progress saving worked,
  // and restore ticks from synced progress on a new device (localStorage starts empty there)
  useEffect(() => {
    if (!markItem) return;
    const isDone = m =>
      (m.kind === 'lessons' ? up.completedLessons : up.completedActivities)?.includes(m.id);
    const restore = {};
    Object.entries(U2_ITEM_PROGRESS_MAP).forEach(([itemId, maps]) => {
      if (checkedItems[itemId]) maps.forEach(m => !isDone(m) && markItem('unit2', m.kind, m.id, true));
      else if (maps.every(isDone)) restore[itemId] = true;
    });
    if (Object.keys(restore).length) setCheckedItems(prev => ({ ...prev, ...restore }));
  }, [up, checkedItems, markItem]);

  // Listen for fullscreen changes & postMessage exit from /unit2/index.html
  useEffect(() => {
    const onFsChange = () => setIsBrowserFs(!!document.fullscreenElement);
    const onMsg = e => {
      if (e?.data && e.data.type === 'krunok-u2-exit') {
        if (document.fullscreenElement) {
          document.exitFullscreen?.().catch(() => {});
        }
        setActivePortal(null);
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    window.addEventListener('message', onMsg);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      window.removeEventListener('message', onMsg);
    };
  }, []);

  // Lock body scroll when portal is active
  useEffect(() => {
    if (!activePortal) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [activePortal]);

  const syncProgressForItem = useCallback(
    (itemId, done) => {
      const mapped = U2_ITEM_PROGRESS_MAP[itemId];
      if (!mapped || !markItem) return;
      mapped.forEach(m => markItem('unit2', m.kind, m.id, done));
    },
    [markItem]
  );

  const toggleCheck = useCallback(
    itemId => {
      setCheckedItems(prev => {
        const nextVal = !prev[itemId];
        syncProgressForItem(itemId, nextVal);
        return { ...prev, [itemId]: nextVal };
      });
    },
    [syncProgressForItem]
  );

  const markChecked = useCallback(
    itemId => {
      setCheckedItems(prev => {
        if (prev[itemId]) return prev;
        return { ...prev, [itemId]: true };
      });
      syncProgressForItem(itemId, true);
    },
    [syncProgressForItem]
  );

  const handleResetChecks = useCallback(() => {
    setCheckedItems({});
    Object.keys(U2_ITEM_PROGRESS_MAP).forEach(itemId => syncProgressForItem(itemId, false));
  }, [syncProgressForItem]);

  const toggleBrowserFs = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    } else {
      document.documentElement.requestFullscreen?.().catch(() => {});
    }
  }, []);

  const openViewer = useCallback(
    (mode, src, title, slideSrc = null, itemId = null) => {
      if (itemId) markChecked(itemId);
      setActivePortal({ mode, src, title, slideSrc });
    },
    [markChecked]
  );

  const closePortal = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
    setActivePortal(null);
  }, []);

  const gamePlayed = ['u2-g1', 'u2-g3', 'u2-g4', 'u2-g5'].filter(id => up.completedActivities?.includes(id)).length;

  const timelineSteps = [
    {
      id: 'u2-step-1',
      stepNum: 1,
      tone: 'purple',
      kicker: 'เตรียมเครื่อง',
      title: 'ติดตั้ง VS Code, Python และ OpenCV 4',
      desc: (
        <>
          ทำครั้งเดียวก่อนเริ่มเขียนโค้ด ทดสอบว่า{' '}
          <code className="curr-inline-code">import cv2</code> ทำงานได้
        </>
      ),
      items: [
        {
          id: 'u2-item-1',
          title: 'ขั้นตอนการติดตั้ง',
          codePills: ['pip install "opencv-python<5"'],
          actions: (
            <a
              href="unit2/setup.html"
              target="_blank"
              rel="noopener noreferrer"
              className="curr-btn-solid purple"
              onClick={() => markChecked('u2-item-1')}
            >
              <Icon name="external" size={14} /> เปิดคู่มือ
            </a>
          )
        }
      ]
    },
    {
      id: 'u2-step-2',
      stepNum: 2,
      tone: 'teal',
      kicker: 'ใบความรู้ 2.1',
      title: 'แนวคิดคอมพิวเตอร์วิทัศน์',
      desc: 'คอมพิวเตอร์ "มองเห็น" ภาพเป็นตารางตัวเลข แต่ละพิกเซลเก็บค่าสี B G R',
      items: [
        {
          id: 'u2-item-2',
          title: '2.1.1 แนวคิดคอมพิวเตอร์วิทัศน์',
          subtext: 'งานหลัก 4 แบบ · ภาพคือตารางตัวเลข · ผสมสี B G R',
          actions: (
            <>
              <button
                type="button"
                className="curr-btn-ghost teal"
                onClick={() =>
                  openViewer(
                    'read',
                    'unit2/index.html?only=t21,t22#t21',
                    '2.1.1 แนวคิดคอมพิวเตอร์วิทัศน์',
                    'unit2/index.html#a21-1',
                    'u2-item-2'
                  )
                }
              >
                <Icon name="openBook" size={14} /> อ่าน
              </button>
              <button
                type="button"
                className="curr-btn-solid teal"
                onClick={() =>
                  openViewer(
                    'slide',
                    'unit2/index.html#a21-1',
                    '2.1.1 แนวคิดคอมพิวเตอร์วิทัศน์',
                    null,
                    'u2-item-2'
                  )
                }
              >
                <Icon name="slidePlay" size={14} /> สไลด์
              </button>
            </>
          )
        },
        {
          id: 'u2-item-3',
          title: '2.1.2 การอ่าน แสดงผล และบันทึกภาพด้วย OpenCV',
          codePills: ['cv2.imread()', 'cv2.imshow()', 'cv2.imwrite()'],
          actions: (
            <>
              <button
                type="button"
                className="curr-btn-ghost teal"
                onClick={() =>
                  openViewer(
                    'read',
                    'unit2/index.html?only=t21,t22#t22',
                    '2.1.2 การอ่าน แสดงผล และบันทึกภาพด้วย OpenCV',
                    'unit2/index.html#a21-t22',
                    'u2-item-3'
                  )
                }
              >
                <Icon name="openBook" size={14} /> อ่าน
              </button>
              <button
                type="button"
                className="curr-btn-solid teal"
                onClick={() =>
                  openViewer(
                    'slide',
                    'unit2/index.html#a21-t22',
                    '2.1.2 การอ่าน แสดงผล และบันทึกภาพด้วย OpenCV',
                    null,
                    'u2-item-3'
                  )
                }
              >
                <Icon name="slidePlay" size={14} /> สไลด์
              </button>
            </>
          )
        },
        {
          id: 'u2-item-2s',
          title: 'สรุปโค้ดคำสั่ง ใบความรู้ 2.1',
          subtext: 'รวมทุกคำสั่งไว้ในโปรแกรมเดียว · คัดลอกไปรันได้ทันที',
          actions: (
            <button
              type="button"
              className="curr-btn-ghost teal"
              onClick={() =>
                openViewer(
                  'read',
                  'unit2/index.html?only=t22#sum21',
                  'สรุปโค้ดคำสั่ง ใบความรู้ 2.1',
                  null,
                  'u2-item-2s'
                )
              }
            >
              <Icon name="openBook" size={14} /> อ่าน
            </button>
          )
        }
      ]
    },
    {
      id: 'u2-step-3',
      stepNum: 3,
      tone: 'amber',
      kicker: 'ลงมือทำ',
      title: 'กิจกรรมที่ 2.1 นักสำรวจภาพ',
      desc: 'ค้นหาคอมพิวเตอร์วิทัศน์ในชีวิตจริง แล้วเขียนโปรแกรมสำรวจตัวเลขในภาพที่ถ่ายเอง ใช้ความรู้จากขั้นที่ 2',
      items: [
        {
          id: 'u2-item-4',
          title: 'ใบงานกิจกรรมที่ 2.1',
          subtext: 'งานเดี่ยว · 50 นาที · 3 ตอน · 20 คะแนน',
          actions: (
            <a
              href="https://chanok109.github.io/Krunok-AI-Academy/krunok-ai-academy/unit2/activity-2-1.html"
              target="_blank"
              rel="noopener noreferrer"
              className="curr-btn-solid amber"
              onClick={() => markChecked('u2-item-4')}
            >
              <Icon name="external" size={14} /> เปิดกิจกรรม
            </a>
          )
        }
      ]
    },
    {
      id: 'u2-step-game',
      stepNum: 4,
      tone: 'rose',
      kicker: 'ฝึกทบทวนความรู้ · 4 ด่าน',
      title: 'CV QUEST',
      desc: 'สนุกกับเกม CV QUEST 4 ด่านทบทวนใบความรู้ 2.1 เรื่องคอมพิวเตอร์วิทัศน์ ขั้นตอนการมองเห็น และโค้ด OpenCV',
      items: [
        {
          id: 'u2-item-game',
          title: 'ฝึกมินิเกมทบทวนความรู้ (4 ด่านโต้ตอบ)',
          subtext: `เล่นแล้ว ${gamePlayed}/4 ด่าน · ใช่ CV ไหม? · เรียงขั้นตอน · อ่านโค้ด · เรียงโค้ด`,
          actions: (
            <button
              type="button"
              className="curr-btn-solid rose"
              onClick={() => {
                markChecked('u2-item-game');
                setActivePortal({ mode: 'game' });
              }}
            >
              <Icon name="puzzle" size={14} /> ฝึกมินิเกมทบทวน (4 ด่าน)
            </button>
          )
        }
      ]
    },
    {
      id: 'u2-step-4',
      stepNum: 5,
      tone: 'teal',
      kicker: 'ใบความรู้ 2.2',
      title: 'พื้นฐานการประมวลผลภาพ',
      desc: 'เปลี่ยนตัวเลขในตารางพิกเซลเพื่อสร้างภาพใหม่ เข้าถึงพิกเซล ตัดภาพ ปรับขนาด และพลิกภาพด้วย OpenCV',
      // one item per topic; 'u2-item-5' (last topic) keeps the lesson/activity progress mapping
      items: [
        { id: 'u2-item-5a', anchor: 't221', title: '2.2.1 การประมวลผลภาพ', subtext: 'เปลี่ยนตัวเลขในตารางพิกเซลเพื่อสร้างภาพใหม่' },
        { id: 'u2-item-5b', anchor: 't222', title: '2.2.2 การเข้าถึงพิกเซล', codePills: ['img[y, x]'] },
        { id: 'u2-item-5c', anchor: 't223', title: '2.2.3 การตัดภาพ', codePills: ['img[y1:y2, x1:x2]'] },
        { id: 'u2-item-5d', anchor: 't224', title: '2.2.4 การปรับขนาด', codePills: ['cv2.resize()'] },
        { id: 'u2-item-5', anchor: 't225', title: '2.2.5 การพลิกภาพ', codePills: ['cv2.flip()'] },
        { id: 'u2-item-5e', anchor: 't226', title: 'หัวข้อเสริม: ทำทีละหลายรูป', codePills: ['for + glob'] }
      ].map(it => ({
        ...it,
        actions: (
          <>
            <button
              type="button"
              className="curr-btn-ghost teal"
              onClick={() =>
                openViewer('read', `unit2/index.html?only=t23#${it.anchor}`, it.title, `unit2/index.html#a22-${it.anchor}`, it.id)
              }
            >
              <Icon name="openBook" size={14} /> อ่าน
            </button>
            <button
              type="button"
              className="curr-btn-solid teal"
              onClick={() => openViewer('slide', `unit2/index.html#a22-${it.anchor}`, it.title, null, it.id)}
            >
              <Icon name="slidePlay" size={14} /> สไลด์
            </button>
          </>
        )
      })).concat({
        id: 'u2-item-5s',
        title: 'สรุปโค้ดคำสั่ง ใบความรู้ 2.2',
        subtext: 'รวมทุกคำสั่งไว้ในโปรแกรมเดียว · คัดลอกไปรันได้ทันที',
        actions: (
          <button
            type="button"
            className="curr-btn-ghost teal"
            onClick={() =>
              openViewer('read', 'unit2/index.html?only=t23#sum22', 'สรุปโค้ดคำสั่ง ใบความรู้ 2.2', null, 'u2-item-5s')
            }
          >
            <Icon name="openBook" size={14} /> อ่าน
          </button>
        )
      })
    },
    {
      id: 'u2-step-5',
      stepNum: 6,
      tone: 'blue',
      kicker: 'ใบความรู้ 2.3',
      title: 'อ่านภาพจากกล้องและวิดีโอ',
      desc: 'เข้าใจเฟรมและ FPS เปิดกล้องหรืออ่านไฟล์วิดีโอ ประมวลผลทีละเฟรมด้วยลูป และบันทึกวิดีโอออกเป็นไฟล์',
      items: [
        {
          id: 'u2-item-6',
          title: 'เปิดกล้อง อ่านเฟรมด้วยลูป และบันทึกวิดีโอ',
          codePills: ['cv2.VideoCapture()', 'cap.read()', 'cap.release()', 'cv2.VideoWriter()'],
          actions: (
            <>
              <button
                type="button"
                className="curr-btn-ghost teal"
                onClick={() =>
                  openViewer(
                    'read',
                    'unit2/index.html?only=t24#t24',
                    '2.3 อ่านภาพจากกล้องและวิดีโอ',
                    'unit2/index.html#a23-1',
                    'u2-item-6'
                  )
                }
              >
                <Icon name="openBook" size={14} /> อ่าน
              </button>
              <button
                type="button"
                className="curr-btn-solid teal"
                onClick={() =>
                  openViewer(
                    'slide',
                    'unit2/index.html#a23-1',
                    '2.3 อ่านภาพจากกล้องและวิดีโอ',
                    null,
                    'u2-item-6'
                  )
                }
              >
                <Icon name="slidePlay" size={14} /> สไลด์
              </button>
            </>
          )
        }
      ]
    },
    {
      id: 'u2-step-6',
      stepNum: 7,
      tone: 'rose',
      kicker: 'ใบความรู้ 2.4',
      title: 'การตรวจจับสีด้วยปริภูมิสี HSV',
      desc: 'เข้าใจค่า Hue · Saturation · Value แปลงสีจาก BGR เป็น HSV สร้างหน้ากาก (Mask) และแยกวัตถุตามสีแบบเรียลไทม์',
      items: [
        {
          id: 'u2-item-7',
          title: 'แปลงสี HSV สร้างหน้ากาก และแยกวัตถุตามสี',
          codePills: ['cv2.cvtColor()', 'cv2.inRange()', 'cv2.bitwise_and()'],
          actions: (
            <>
              <button
                type="button"
                className="curr-btn-ghost teal"
                onClick={() =>
                  openViewer(
                    'read',
                    'unit2/index.html?only=t25#t25',
                    '2.4 การตรวจจับสีด้วยปริภูมิสี HSV',
                    'unit2/index.html#a24-1',
                    'u2-item-7'
                  )
                }
              >
                <Icon name="openBook" size={14} /> อ่าน
              </button>
              <button
                type="button"
                className="curr-btn-solid teal"
                onClick={() =>
                  openViewer(
                    'slide',
                    'unit2/index.html#a24-1',
                    '2.4 การตรวจจับสีด้วยปริภูมิสี HSV',
                    null,
                    'u2-item-7'
                  )
                }
              >
                <Icon name="slidePlay" size={14} /> สไลด์
              </button>
            </>
          )
        }
      ]
    },
    {
      id: 'u2-step-7',
      stepNum: 8,
      tone: 'teal',
      kicker: 'ใบความรู้ 2.5',
      title: 'การตรวจจับใบหน้าด้วย Haar Cascade',
      desc: 'เรียนรู้ลักษณะเด่น Haar โหลดโมเดล ตรวจจับใบหน้า วาดกรอบนับจำนวน ต่อยอด YuNet และจริยธรรมการใช้ภาพบุคคล (PDPA)',
      items: [
        {
          id: 'u2-item-8',
          title: 'ตรวจจับใบหน้าด้วย Haar Cascade, YuNet และจริยธรรมภาพบุคคล',
          codePills: ['cv2.CascadeClassifier()', 'detectMultiScale()', 'PDPA'],
          actions: (
            <>
              <button
                type="button"
                className="curr-btn-ghost teal"
                onClick={() =>
                  openViewer(
                    'read',
                    'unit2/index.html?only=t26#t26',
                    '2.5 การตรวจจับใบหน้าด้วย Haar Cascade',
                    'unit2/index.html#a25-1',
                    'u2-item-8'
                  )
                }
              >
                <Icon name="openBook" size={14} /> อ่าน
              </button>
              <button
                type="button"
                className="curr-btn-solid teal"
                onClick={() =>
                  openViewer(
                    'slide',
                    'unit2/index.html#a25-1',
                    '2.5 การตรวจจับใบหน้าด้วย Haar Cascade',
                    null,
                    'u2-item-8'
                  )
                }
              >
                <Icon name="slidePlay" size={14} /> สไลด์
              </button>
            </>
          )
        }
      ]
    },
    {
      id: 'u2-step-8',
      stepNum: 9,
      tone: 'amber',
      kicker: 'ลงมือทำ & ทบทวน',
      title: 'ชุดโค้ดตัวอย่างและสรุปทบทวนหน่วยที่ 2',
      desc: 'ดาวน์โหลดไฟล์โค้ดตัวอย่าง Python บทที่ 2.3–2.5 พร้อมไฟล์ภาพและวิดีโอตัวอย่างสำหรับรันจริงใน VS Code และทบทวนคำศัพท์สำคัญ',
      items: [
        {
          id: 'u2-item-9',
          title: 'ชุดโค้ดตัวอย่าง Python บทที่ 2.3–2.5 และสรุปคำศัพท์',
          codePills: ['code-2.3-2.5.zip', 'fruits.png', 'balls.mp4', 'faces.png'],
          actions: (
            <>
              <button
                type="button"
                className="curr-btn-ghost teal"
                onClick={() =>
                  openViewer(
                    'read',
                    'unit2/index.html#sum',
                    'สรุปและคำศัพท์สำคัญ หน่วยที่ 2',
                    null,
                    'u2-item-9'
                  )
                }
              >
                <Icon name="openBook" size={14} /> สรุปบทเรียน
              </button>
              <a
                href="code/code-2.3-2.5.zip"
                download
                className="curr-btn-solid amber"
                onClick={() => markChecked('u2-item-9')}
              >
                <Icon name="download" size={14} /> ดาวน์โหลดโค้ด
              </a>
            </>
          )
        }
      ]
    },
    {
      id: 'u2-step-9',
      stepNum: 10,
      tone: 'indigo',
      kicker: 'วัดผลสัมฤทธิ์',
      title: 'แบบทดสอบหลังเรียน หน่วยที่ 2 (15 ข้อ)',
      desc: 'วัดความรู้ความเข้าใจพื้นฐานคอมพิวเตอร์วิทัศน์และ OpenCV แบบปรนัย 4 ตัวเลือก 15 ข้อ เกณฑ์ผ่าน 70% พร้อมเฉลยละเอียด',
      items: [
        {
          id: 'u2-item-10',
          title: 'แบบทดสอบวัดผลการเรียนรู้หลังเรียน (Unit 2 Post-Test)',
          subtext: 'ปรนัย 4 ตัวเลือก · 15 ข้อ · เกณฑ์ผ่าน 70% · บันทึกคะแนน',
          actions: (
            <button
              type="button"
              className="curr-btn-solid indigo"
              onClick={() => setActivePortal({ mode: 'posttest' })}
            >
              <Icon name="target" size={14} /> เริ่มทำแบบทดสอบ
            </button>
          )
        }
      ]
    },
    {
      id: 'u2-step-10',
      stepNum: 11,
      tone: 'purple',
      kicker: 'ค้นคว้าต่อ',
      title: 'แหล่งเรียนรู้เพิ่มเติม',
      desc: 'เอกสารอ้างอิงคำสั่งและชุดข้อมูลภาพที่ใช้ในหน่วยที่ 2 สำหรับอ่านทบทวนหรือศึกษาต่อ',
      items: [
        {
          id: 'u2-item-11',
          title: 'แหล่งอ้างอิง หน่วยที่ 2',
          subtext: 'เอกสาร OpenCV · NumPy · ชุดข้อมูลภาพ COCO และ scikit-image',
          actions: (
            <button
              type="button"
              className="curr-btn-solid purple"
              onClick={() => {
                markChecked('u2-item-11');
                setRefsOpen(true);
              }}
            >
              <Icon name="book" size={14} /> เปิดแหล่งอ้างอิง
            </button>
          )
        }
      ]
    }
  ];

  const allValidItemIds = new Set(timelineSteps.flatMap(s => s.items.map(it => it.id)));
  const totalItems = timelineSteps.reduce((acc, s) => acc + s.items.length, 0);
  const checkedCount = Object.keys(checkedItems).filter(k => allValidItemIds.has(k) && checkedItems[k]).length;
  const progressPct = totalItems > 0 ? Math.min(100, Math.round((checkedCount / totalItems) * 100)) : 0;

  return (
    <div className="unit2-container">
      {/* 1. Unit 2 Hero Banner */}
      <section className="glass u1-hero hero-unit2" aria-labelledby="unit2-title">
        <UnitHeroBg />
        <div style={{ display: 'grid', gap: 14, minWidth: 0 }}>
          <div className="hero-meta">
            <Badge tone="cyan">UNIT 02</Badge>
            <Badge>Computer Vision Fundamentals</Badge>
            <DemoBadge />
          </div>

          <h1 id="unit2-title">
            พื้นฐาน<br />
            <span className="grad-text">คอมพิวเตอร์วิทัศน์</span>
          </h1>

          <div className="u1-progress">
            <ProgressRing
              value={su.percent}
              size={64}
              stroke={7}
              label="ความก้าวหน้าหน่วยที่ 2"
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <Badge>
                <Icon name="book" size={12} />
                บทเรียน {lessonsDone}/5
              </Badge>
              <Badge>
                <Icon name="puzzle" size={12} />
                กิจกรรม {actsDone}/5
              </Badge>
              <Badge tone={su.quizPassed ? 'ok' : ''}>
                <Icon name="target" size={12} />
                {su.quizBest
                  ? `แบบทดสอบดีที่สุด ${su.quizBest.correct}/15`
                  : 'ยังไม่ได้ทำแบบทดสอบ'}
              </Badge>
            </div>
          </div>
        </div>

        <VisionStage mood={su.completed ? 'cheer' : 'happy'} />
      </section>
      <UnitObjectives items={U2_OBJECTIVES} />

      {/* 2. Curriculum Progress Card & Numbered Step Timeline */}
      <div className="u1-cover-sets-section" ref={curriculumRef} style={{ marginTop: 28 }}>
        <div className="section-title">
          <div className="u1-section-heading-box">
            <span className="curr-section-kicker">
              <Icon name="sparkle" size={13} /> CURRICULUM ROADMAP
            </span>
            <h2>
              <Icon name="book" size={24} style={{ color: "#7475C4" }} />
              เลือกชุดการเรียนรู้ตามลำดับขั้น
            </h2>
          </div>
          <span className="hint">
            คลิกเครื่องหมายถูกหน้าหัวข้อเพื่อบันทึกความก้าวหน้า หรือกดเข้าเรียนแต่ละหัวข้อได้ทันที
          </span>
        </div>

        <div className="u1-curriculum-container">
          <div className="curriculum-progress-card">
            <div className="curr-prog-left">
              <div className="curr-prog-icon-badge">
                <Icon name="sparkle" size={18} />
              </div>
              <div className="curr-prog-text">
                <span className="curr-prog-kicker">CURRICULUM PROGRESS</span>
                <span className="curr-prog-label">
                  เรียนแล้ว <b>{checkedCount} / {totalItems}</b> หัวข้อ <span className="curr-prog-percent">({progressPct}%)</span>
                </span>
              </div>
            </div>

            <div className="curr-prog-track-wrapper">
              <div className="curr-prog-track">
                <div
                  className="curr-prog-fill"
                  style={{ width: `${progressPct}%` }}
                >
                  <span className="curr-prog-shimmer" />
                </div>
              </div>
              <span className="curr-prog-indicator">{progressPct}%</span>
            </div>

            <div className="curr-prog-right">
              <button
                type="button"
                className="curr-reset-btn"
                onClick={handleResetChecks}
                title="รีเซ็ตเครื่องหมายทั้งหมด"
              >
                <Icon name="refresh" size={13} />
                <span>ล้างเครื่องหมาย</span>
              </button>
            </div>
          </div>

          <div className="curriculum-timeline">
            {timelineSteps.map((step, idx) => {
              const stepAllDone = step.items.every(it => checkedItems[it.id]);
              return (
                <div key={step.id} className="curr-step-item">
                  <div className="curr-step-rail">
                    <div
                      className={`curr-step-circle tone-${step.tone} ${
                        stepAllDone ? 'is-done' : ''
                      }`}
                    >
                      {stepAllDone ? (
                        <Icon name="check" size={18} stroke={2.6} />
                      ) : (
                        step.stepNum
                      )}
                    </div>
                    {idx < timelineSteps.length - 1 && <div className="curr-step-line" />}
                  </div>

                  <div className={`curr-step-card tone-${step.tone}`}>
                    <div className="curr-card-head">
                      <div className="curr-card-head-top">
                        <span className={`curr-card-kicker tone-${step.tone}`}>
                          {step.kicker}
                        </span>
                        {stepAllDone && (
                          <span className="curr-card-done-badge">
                            <Icon name="check" size={12} stroke={2.5} /> ครบทุกหัวข้อ
                          </span>
                        )}
                      </div>
                      <h3 className="curr-card-title">{step.title}</h3>
                      {step.desc && <p className="curr-card-desc">{step.desc}</p>}
                    </div>

                    <div className="curr-subitems-list">
                      {step.items.map(it => {
                        const isChecked = !!checkedItems[it.id];
                        return (
                          <div
                            key={it.id}
                            className={`curr-subitem-row ${isChecked ? 'is-checked' : ''}`}
                          >
                            <label
                              className="curr-check-label"
                              title={
                                isChecked
                                  ? 'คลิกเพื่อยกเลิกเครื่องหมาย'
                                  : 'คลิกเพื่อทำเครื่องหมายว่าเรียนแล้ว'
                              }
                            >
                              <input
                                type="checkbox"
                                className="curr-checkbox-hidden"
                                checked={isChecked}
                                onChange={() => toggleCheck(it.id)}
                              />
                              <span
                                className={`curr-custom-checkbox ${
                                  isChecked ? 'is-checked' : ''
                                }`}
                              >
                                <Icon name="check" size={13} stroke={3} />
                              </span>
                            </label>

                            <div className="curr-subitem-info">
                              <div className="curr-subitem-title">{it.title}</div>
                              {it.subtext && (
                                <div className="curr-subitem-subtext">{it.subtext}</div>
                              )}
                              {it.codePills && (
                                <div className="curr-subitem-meta">
                                  {it.codePills.map(code => (
                                    <code key={code} className="curr-code-pill">
                                      {code}
                                    </code>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="curr-subitem-actions">{it.actions}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Fullscreen Portal for Web Read / Interactive Slide Deck */}
      {activePortal &&
        (activePortal.mode === 'read' || activePortal.mode === 'slide') &&
        createPortal(
          <div className="u2-portal-overlay">
            {activePortal.mode === 'read' && (
              <div className="u2-portal-topbar">
                <div className="deck-toolbar-left">
                  <button
                    type="button"
                    className="deck-fs-back-btn"
                    onClick={closePortal}
                  >
                    <Icon name="grid" size={15} />
                    <span>เมนูบทเรียน</span>
                  </button>
                  <div className="deck-fs-unit-meta">
                    <span className="deck-fs-unit-kicker">UNIT 02 · ใบความรู้</span>
                    <span className="deck-fs-unit-title">{activePortal.title}</span>
                  </div>
                </div>
                <div className="deck-toolbar-right" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {activePortal.slideSrc && (
                    <button
                      type="button"
                      className="curr-btn-solid teal"
                      style={{ padding: '6px 14px', fontSize: 13 }}
                      onClick={() =>
                        setActivePortal(prev => ({
                          ...prev,
                          mode: 'slide',
                          src: prev.slideSrc
                        }))
                      }
                    >
                      <Icon name="slidePlay" size={14} /> สไลด์เต็มจอ
                    </button>
                  )}
                  <button
                    type="button"
                    className={`deck-fullscreen-btn ${isBrowserFs ? 'active' : ''}`}
                    onClick={toggleBrowserFs}
                  >
                    <Icon name={isBrowserFs ? 'minimize' : 'expand'} size={15} />
                    <span>{isBrowserFs ? 'ออกจากเต็มจอ' : 'เต็มจอ'}</span>
                  </button>
                </div>
              </div>
            )}
            <iframe
              key={activePortal.src}
              src={activePortal.src}
              title={activePortal.title}
              className="u2-portal-iframe"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; camera"
            />
          </div>,
          document.body
        )}

      {/* 4. Fullscreen Portal for Unit 2 Post-Test (15 Questions) */}
      {activePortal &&
        (activePortal.mode === 'posttest' || activePortal.mode === 'game') &&
        createPortal(
          <div className="lesson-slide-deck deck-fullscreen u1-posttest-fullscreen">
            <div className="deck-toolbar">
              <div className="deck-toolbar-left">
                <button
                  type="button"
                  className="deck-fs-back-btn"
                  onClick={closePortal}
                >
                  <Icon name="grid" size={15} />
                  <span>เมนูบทเรียน</span>
                </button>
                <div className="deck-fs-unit-meta">
                  <span className="deck-fs-unit-kicker">UNIT 02</span>
                  <span className="deck-fs-unit-title">
                    {activePortal.mode === 'game' ? 'มินิเกม แนวคิดคอมพิวเตอร์วิทัศน์' : 'แบบทดสอบหลังเรียน (ปรนัย 15 ข้อ)'}
                  </span>
                </div>
              </div>
              <div className="deck-toolbar-right">
                <button
                  type="button"
                  className={`deck-fullscreen-btn ${isBrowserFs ? 'active' : ''}`}
                  onClick={toggleBrowserFs}
                  title={isBrowserFs ? 'ออกจากโหมดเต็มจอ (หรือกด Esc)' : 'ขยายแบบทดสอบให้เต็มจอทั้งหมด'}
                  aria-label={isBrowserFs ? 'ออกจากเต็มจอ' : 'เต็มจอ'}
                >
                  <Icon name={isBrowserFs ? 'minimize' : 'expand'} size={15} />
                  <span>{isBrowserFs ? 'ออกจากเต็มจอ' : 'เต็มจอ'}</span>
                </button>
              </div>
            </div>
            <div className="deck-slide-stage">
              <div className="deck-slide-card deck-quiz-fullscreen-card">
                <div className="deck-slide-body">
                  {activePortal.mode === 'game' ? <CvMiniGame /> : <QuizRunner
                    unitId="unit2"
                    questions={U2_QUIZ}
                    lessonTitle={() => 'แบบทดสอบหลังเรียน หน่วยที่ 2'}
                    onGoLesson={() =>
                      openViewer(
                        'slide',
                        'unit2/index.html#a21-1',
                        '2.1.1 แนวคิดคอมพิวเตอร์วิทัศน์',
                        null,
                        'u2-item-2'
                      )
                    }
                  />}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* 5. References Modal */}
      <Modal
        open={refsOpen}
        onClose={() => setRefsOpen(false)}
        title="แหล่งอ้างอิงหน่วยที่ 2"
      >
        <Callout tone="info" icon="info" title="เอกสารอ้างอิงทางเทคนิค">
          รวบรวมจากเอกสารทางการของ OpenCV 4.x, NumPy และชุดข้อมูลมาตรฐานสำหรับการศึกษาด้านคอมพิวเตอร์วิทัศน์
        </Callout>
        <ul className="ref-list" style={{ marginTop: 14 }}>
          {U2_REFS.map(r => (
            <li key={r.url}>
              <span className="ref-tag">{r.tag}</span>
              <a href={r.url} target="_blank" rel="noopener noreferrer">
                {r.title}
              </a>
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
}

export { Unit2Page };
