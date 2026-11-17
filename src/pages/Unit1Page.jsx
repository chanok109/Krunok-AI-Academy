import React, { useState, useEffect, useRef } from 'react';
import { UnitHeroBg, UnitObjectives } from '../components/UnitHero.jsx';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext.jsx';
import { useRoute } from '../context/RouteContext.jsx';
import { Icon, Button, Badge, DemoBadge, ProgressRing } from '../components/UIPrimitives.jsx';
import { Callout, Celebrate, Modal } from '../components/UIHelpers.jsx';
import { AiQuestGame } from '../components/AiQuestGame.jsx';
import { MyUnitScores } from '../components/MyUnitScores.jsx';
import { U1_SCORE_COLS } from '../components/unitScoreColumns.js';
import { QuizRunner } from '../components/QuizRunner.jsx';
import { LessonSlideDeck } from '../components/LessonSlideDeck.jsx';
import airaMascotUrl from '../assets/aira-mascot.png';
import { KS_IMAGES } from '../components/unit1/knowledge/knowledgeImages.js';

const U1_ART = {
  aiConcept: KS_IMAGES.techAi,
  aiEthics: KS_IMAGES.aiEthics,
  deepfakeSafety: KS_IMAGES.aiLaw
};

/* ไฟล์แยกย่อยของหน่วยที่ 1 (ใบความรู้ & สไลด์แต่ละเรื่อง) */
import Unit1KnowledgeSheet from '../components/unit1/knowledge/Unit1KnowledgeSheet.jsx';
import MissionSprintDeck, { ACT11_URL, ACT12_URL } from '../components/unit1/slides/MissionSprintDeck.jsx';
import { createSlidesSet1 } from '../components/unit1/slides/SlideSet1WhatIsAI.jsx';
import { createSlidesSet2 } from '../components/unit1/slides/SlideSet2EthicsAndRisk.jsx';
import { createSlidesSet3 } from '../components/unit1/slides/SlideSet3PdpaAndDeepfake.jsx';

import {
  U1_CHECKED,
  U1_OBJECTIVES,
  U1_ITEMS,
  U1_REFS,
  U1_QUIZ
} from '../data/unit1Data.js';

/* ภาพประกอบเวทีหลักของหน่วยที่ 1 (AI ⊃ ML ⊃ DL ⊃ GenAI + น้อง AIra + ป้ายหัวใจสำคัญ) */
function AIFoundationStage({ completed }) {
  return (
    <div className="u1-foundation-stage" aria-hidden="true">
      <div className="u1-stage-card">
        <div className="u1-stage-svg-wrap">
          <span className="u1-floating-chip chip-ai">
            <Icon name="cpu" size={14} /> AI · ML · DL
          </span>
          <span className="u1-floating-chip chip-ethics">
            <Icon name="scale" size={14} /> จริยธรรม AI
          </span>
          <span className="u1-floating-chip chip-genai">
            <Icon name="sparkle" size={14} /> Generative AI
          </span>
          <span className="u1-floating-chip chip-pdpa">
            <Icon name="shield" size={14} /> PDPA & Deepfake
          </span>

          <svg
            className="u1-stage-rings-svg"
            viewBox="0 0 360 316"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="u1StageGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#7475C4" stopOpacity="0.22" />
                <stop offset="60%" stopColor="#7DB8FF" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="u1OrbitStroke1" x1="30" y1="20" x2="330" y2="296" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3B82F6" stopOpacity="0.55" />
                <stop offset="0.5" stopColor="#8C74C6" stopOpacity="0.45" />
                <stop offset="1" stopColor="#4D9BE0" stopOpacity="0.55" />
              </linearGradient>
              <linearGradient id="u1OrbitStroke2" x1="70" y1="60" x2="290" y2="256" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7475C4" stopOpacity="0.65" />
                <stop offset="1" stopColor="#4D9BE0" stopOpacity="0.65" />
              </linearGradient>
            </defs>

            <circle cx="180" cy="158" r="142" fill="url(#u1StageGlow)" />

            {/* วงซ้อนชั้น AI > ML > DL > GenAI */}
            <circle cx="180" cy="158" r="128" stroke="url(#u1OrbitStroke1)" strokeWidth="1.8" strokeDasharray="6 6" fill="rgba(255,255,255,0.38)" />
            <circle cx="180" cy="158" r="98" stroke="url(#u1OrbitStroke2)" strokeWidth="1.8" fill="rgba(238,242,255,0.45)" />
            <circle cx="180" cy="158" r="68" stroke="#7DB8FF" strokeOpacity="0.65" strokeWidth="1.8" strokeDasharray="4 4" fill="rgba(224,242,254,0.48)" />

            {/* เส้นโครงข่ายประสาทเทียมประดับฉาก */}
            <g stroke="#9C9AD8" strokeOpacity="0.38" strokeWidth="1.3">
              <line x1="66" y1="98" x2="114" y2="126" />
              <line x1="294" y1="98" x2="246" y2="126" />
              <line x1="72" y1="222" x2="118" y2="192" />
              <line x1="288" y1="222" x2="242" y2="192" />
            </g>

            {/* จุดโหนด Neural Nodes */}
            <circle cx="66" cy="98" r="5.5" fill="#3B82F6" />
            <circle cx="294" cy="98" r="5.5" fill="#F59E0B" />
            <circle cx="72" cy="222" r="5.5" fill="#10B981" />
            <circle cx="288" cy="222" r="5.5" fill="#F43F5E" />
            <circle cx="180" cy="30" r="5" fill="#7475C4" />
            <circle cx="180" cy="286" r="5" fill="#4D9BE0" />
          </svg>

          <div className="u1-stage-mascot-wrap">
            <img
              src={airaMascotUrl}
              alt="น้องหุ่นยนต์ AIra ผู้ช่วยการเรียนรู้"
              className="u1-stage-mascot-img"
            />
          </div>
        </div>

        <div className="u1-stage-speech">
          <span className="u1-stage-online-dot" />
          <span>
            {completed
              ? 'ยอดเยี่ยมมากค่ะ! เรียนครบหน่วยที่ 1 เรียบร้อยแล้ว 🎉'
              : 'มาสำรวจพื้นฐาน AI จริยธรรม และความปลอดภัยดิจิทัลไปกับ AIra กันนะคะ!'}
          </span>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   หน้าหลักหน่วยการเรียนรู้ที่ 1 (สารบัญชุดการเรียนรู้ กิจกรรม และแบบทดสอบ)
   ===================================================================== */
function Unit1Page() {
  const { progress, summary, markItem, visitUnit } = useApp();
  const { navigate } = useRoute();

  useEffect(() => {
    visitUnit("unit1");
  }, [visitUnit]);

  // Section state: 'cover' | 'ks1' | 'ks2' | 'ks3' | 'set1' | 'set2' | 'set3' | 'act11' | 'posttest' | 'activities'
  const [section, setSection] = useState("cover");
  const [refsOpen, setRefsOpen] = useState(false);
  const [party, setParty] = useState(null);
  const [isBrowserFs, setIsBrowserFs] = useState(
    () => typeof document !== "undefined" && !!(document.fullscreenElement || document.webkitFullscreenElement)
  );
  const partyTimer = useRef(null);
  const curriculumRef = useRef(null);

  useEffect(() => {
    const onFs = () => setIsBrowserFs(!!(document.fullscreenElement || document.webkitFullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    document.addEventListener("webkitfullscreenchange", onFs);
    return () => {
      document.removeEventListener("fullscreenchange", onFs);
      document.removeEventListener("webkitfullscreenchange", onFs);
    };
  }, []);

  const toggleBrowserFs = () => {
    const doc = document;
    const el = doc.documentElement;
    if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
      if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
      else if (el.webkitRequestFullscreen) doc.documentElement.webkitRequestFullscreen();
    } else {
      if (doc.exitFullscreen) doc.exitFullscreen().catch(() => {});
      else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
    }
  };

  useEffect(() => () => clearTimeout(partyTimer.current), []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [section]);

  const up = progress["unit1"];
  const su = summary.units["unit1"];

  const lessonsDone = up.completedLessons.filter(x => U1_ITEMS[x]).length;
  const actsDone = up.completedActivities.filter(x => U1_ITEMS[x]).length;

  const set1Done = ["u1-l1", "u1-l2", "u1-l3"].every(id => up.completedLessons.includes(id));
  const set2Done = up.completedLessons.includes("u1-l4");
  const set3Done = ["u1-l5", "u1-l6"].every(id => up.completedLessons.includes(id));

  // Timeline checklist state for "เลือกชุดการเรียนรู้"
  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      const saved = localStorage.getItem("krunok_u1_timeline_checks_v2");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    const init = {};
    if (set1Done) init["u1-item-1"] = true;
    if (set2Done) init["u1-item-2"] = true;
    if (set3Done) init["u1-item-3"] = true;
    if (up.completedActivities.includes("u1-a1")) init["u1-item-4"] = true;
    if (up.completedActivities.includes("u1-a2")) init["u1-item-5"] = true;
    if (actsDone >= 4) init["u1-item-minigame"] = true;
    if (su.quizPassed) init["u1-item-6"] = true;
    return init;
  });

  useEffect(() => {
    try {
      localStorage.setItem("krunok_u1_timeline_checks_v2", JSON.stringify(checkedItems));
    } catch (e) {}
  }, [checkedItems]);

  useEffect(() => {
    if (actsDone >= 4) {
      setCheckedItems(prev => (prev["u1-item-minigame"] ? prev : { ...prev, "u1-item-minigame": true }));
    }
  }, [actsDone]);

  useEffect(() => {
    if (su.quizPassed) {
      setCheckedItems(prev => (prev["u1-item-6"] ? prev : { ...prev, "u1-item-6": true }));
    }
  }, [su.quizPassed]);

  const markChecked = (id) => {
    setCheckedItems(prev => (prev[id] ? prev : { ...prev, [id]: true }));
  };

  const exitSectionToCover = () => {
    if (typeof document !== "undefined" && (document.fullscreenElement || document.webkitFullscreenElement)) {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
    setSection("cover");
  };

  const resolveQuizReviewSection = (lessonId) => {
    if (lessonId === "u1-l4") return "ks2";
    if (lessonId === "u1-l5" || lessonId === "u1-l6") return "ks3";
    return "ks1";
  };

  const resolveQuizReviewTitle = (lessonId) => {
    if (lessonId === "u1-l4") return "ใบความรู้ตอนที่ 2: จริยธรรม AI และการควบคุมตามระดับความเสี่ยง";
    if (lessonId === "u1-l5" || lessonId === "u1-l6") return "ใบความรู้ตอนที่ 3: ข้อมูลส่วนบุคคล (PDPA) และ Deepfake";
    return "ใบความรู้ตอนที่ 1: AI คืออะไร";
  };

  const toggleCheck = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleResetChecks = () => {
    setCheckedItems({});
    try {
      localStorage.removeItem("krunok_u1_timeline_checks_v2");
    } catch (e) {}
  };

  const markSetDone = (lessonIds, title) => {
    lessonIds.forEach(id => {
      if (!up.completedLessons.includes(id)) {
        markItem("unit1", "lessons", id, true);
      }
    });
    setParty({
      title: `เรียนจบ${title}แล้ว!`,
      sub: "บันทึกความก้าวหน้าเรียบร้อย"
    });
    clearTimeout(partyTimer.current);
    partyTimer.current = setTimeout(() => setParty(null), 2500);
  };

  const finishSlideSet = (lessonIds, itemKey, title, targetSection, nextDeckLessonId = "") => {
    markSetDone(lessonIds, title);
    if (itemKey) {
      setCheckedItems(prev => ({ ...prev, [itemKey]: true }));
    }
    if (nextDeckLessonId) {
      try {
        sessionStorage.removeItem(`slide_${nextDeckLessonId}`);
      } catch (e) {}
    }
    setSection(targetSection);
  };

  const slidesSet1 = createSlidesSet1({ finishSlideSet });
  const slidesSet2 = createSlidesSet2({ finishSlideSet });
  const slidesSet3 = createSlidesSet3({ finishSlideSet });

  return (
    <>
      <Celebrate data={party} />

      {/* =====================================================================
         1. Cover Page
         ===================================================================== */}
      {section === "cover" && (
        <div className="u1-cover-view">
          {/* 1.1 Hero Section */}
          <section
            className="glass u1-hero hero-unit1 u1-hero-enhanced"
            aria-labelledby="unit1-title"
          >
            <UnitHeroBg />
            <div className="u1-hero-left">
              <div className="u1-hero-meta-row">
                <Badge tone="cyan">
                  <Icon name="cpu" size={12} /> UNIT 01
                </Badge>
                <Badge>
                  <Icon name="scale" size={12} /> AI Foundations & Ethics
                </Badge>
                <Badge>
                  <Icon name="clock" size={12} /> 6 ชั่วโมงเรียน
                </Badge>
                <DemoBadge />
              </div>

              <div>
                <h1 id="unit1-title" className="u1-hero-title">
                  แนวคิดเบื้องต้นเกี่ยวกับ<span className="grad-text">ปัญญาประดิษฐ์</span>
                </h1>
                <p className="u1-hero-lead" style={{ marginTop: 6 }}>
                  ปูพื้นฐานความเข้าใจตั้งแต่ความหมายและวิวัฒนาการของ AI จริยธรรมและการควบคุมตามระดับความเสี่ยง ไปจนถึงการคุ้มครองข้อมูลส่วนบุคคล (PDPA) และการรู้เท่าทันภัย Deepfake
                </p>
              </div>

              <div className="u1-hero-progress-box">
                <ProgressRing
                  value={su.percent}
                  size={50}
                  stroke={6}
                  label="ความก้าวหน้าหน่วยที่ 1"
                />
                <div className="u1-hero-progress-stats">
                  <div className="u1-hero-progress-title">
                    <span>ความก้าวหน้าภาพรวมหน่วยที่ 1</span>
                    <span className="u1-hero-progress-pct">{su.percent}%</span>
                  </div>
                  <div className="u1-hero-stat-pills">
                    <Badge>
                      <Icon name="book" size={12} />
                      บทเรียน {lessonsDone}/6
                    </Badge>
                    <Badge>
                      <Icon name="puzzle" size={12} />
                      กิจกรรม {actsDone}/4
                    </Badge>
                    <Badge tone={su.quizPassed ? "ok" : ""}>
                      <Icon name="target" size={12} />
                      {su.quizBest
                        ? `แบบทดสอบดีที่สุด ${su.quizBest.correct}/${U1_QUIZ.length}`
                        : "ยังไม่ได้ทำแบบทดสอบ"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <AIFoundationStage completed={su.completed} />
          </section>
          <UnitObjectives items={U1_OBJECTIVES} />

          {/* 1.2 Unit Completed Medal Banner */}
          {su.completed && (
            <div className="glass unit-done" role="status">
              <span className="medal-wrap" style={{ filter: "drop-shadow(0 0 14px rgba(255,214,109,.6))" }}>
                <span
                  className="medal"
                  style={{
                    background: "linear-gradient(150deg,#FFE7A3,var(--gold) 45%,var(--lavender))",
                    color: "var(--navy)"
                  }}
                >
                  <Icon name="trophy" size={26} />
                </span>
              </span>
              <div style={{ display: "grid", gap: 4, minWidth: 0 }}>
                <strong style={{ fontSize: 18 }}>
                  เรียนครบหน่วยที่ 1 แล้ว! ได้รับเหรียญ AI Explorer
                </strong>
                <span style={{ color: "var(--muted)", fontSize: 14 }}>
                  เรียนครบทุกบท ทำกิจกรรมครบ และผ่านแบบทดสอบเรียบร้อยแล้ว
                </span>
              </div>
              <Button
                variant="ghost"
                iconRight="chevR"
                onClick={() => navigate("unit2")}
              >
                ไปหน่วยที่ 2
              </Button>
            </div>
          )}

          {/* 1.4 My scores (own scores only) */}
          <MyUnitScores unitId="unit1" columns={U1_SCORE_COLS} />

          {/* 1.5 Curriculum Roadmap Timeline */}
          <div className="u1-cover-sets-section" ref={curriculumRef}>
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

            {(() => {
              const timelineSteps = [
                {
                  id: "step-1",
                  stepNum: 1,
                  tone: "emerald",
                  icon: "cpu",
                  kicker: "ใบความรู้ 1.1 · 3 ตอนหลัก",
                  title: "แนวคิดเบื้องต้นเกี่ยวกับปัญญาประดิษฐ์",
                  desc: "ศึกษาความหมาย เทคโนโลยีหลัก วิวัฒนาการ จริยธรรม AI การควบคุมความเสี่ยง และกฎหมายคุ้มครองข้อมูลส่วนบุคคล",
                  items: [
                    {
                      id: "u1-item-1",
                      kicker: "ตอนที่ 1 / 3",
                      kickerTone: "emerald",
                      thumb: U1_ART.aiConcept,
                      thumbIcon: "cpu",
                      title: "AI คืออะไร",
                      desc: "ความหมายของ AI ตามนิยามสากล คำศัพท์พื้นฐาน 4 คำ ประวัติศาสตร์ AI และความสัมพันธ์ของ AI · ML · DL · GenAI",
                      tags: ["นิยาม OECD & 3 ขั้นตอน", "Timeline 70+ ปี", "AI ⊃ ML ⊃ DL ⊃ GenAI", "ANI / AGI / ASI"],
                      actions: (
                        <>
                          <button
                            type="button"
                            className="curr-btn-ghost teal"
                            onClick={() => setSection("ks1")}
                          >
                            <Icon name="openBook" size={14} /> ใบความรู้
                          </button>
                          <button
                            type="button"
                            className="curr-btn-solid teal"
                            onClick={() => setSection("set1")}
                          >
                            <Icon name="slidePlay" size={14} /> สไลด์เต็มจอ
                          </button>
                        </>
                      )
                    },
                    {
                      id: "u1-item-2",
                      kicker: "ตอนที่ 2 / 3",
                      kickerTone: "emerald",
                      thumb: U1_ART.aiEthics,
                      thumbIcon: "scale",
                      title: "จริยธรรม AI และการควบคุมตามระดับความเสี่ยง",
                      desc: "ความต่างของจริยธรรมกับกฎหมาย ปัญหาจริยธรรม 8 ประการ การลดอคติ AI และกฎหมายควบคุมความเสี่ยง 4 ระดับ",
                      tags: ["8 ปัญหาจริยธรรม", "หลักจริยธรรม AI ไทย 6 ข้อ", "AI Risk 4 ระดับ", "ร่าง พ.ร.บ. AI"],
                      actions: (
                        <>
                          <button
                            type="button"
                            className="curr-btn-ghost teal"
                            onClick={() => setSection("ks2")}
                          >
                            <Icon name="openBook" size={14} /> ใบความรู้
                          </button>
                          <button
                            type="button"
                            className="curr-btn-solid teal"
                            onClick={() => setSection("set2")}
                          >
                            <Icon name="slidePlay" size={14} /> สไลด์เต็มจอ
                          </button>
                        </>
                      )
                    },
                    {
                      id: "u1-item-3",
                      kicker: "ตอนที่ 3 / 3",
                      kickerTone: "emerald",
                      thumb: U1_ART.deepfakeSafety,
                      thumbIcon: "shield",
                      title: "ข้อมูลส่วนบุคคล (PDPA) และ Deepfake",
                      desc: "สิทธิเจ้าของข้อมูลส่วนบุคคล 7 ข้อตาม PDPA วิธีสังเกตและป้องกันภัย Deepfake และข้อกฎหมายไทยที่บังคับใช้จริง",
                      tags: ["กฎหมาย PDPA", "สิทธิ 7 ข้อ", "จับผิด Deepfake 4 วิธี", "พ.ร.บ. คอมพิวเตอร์"],
                      actions: (
                        <>
                          <button
                            type="button"
                            className="curr-btn-ghost teal"
                            onClick={() => setSection("ks3")}
                          >
                            <Icon name="openBook" size={14} /> ใบความรู้
                          </button>
                          <button
                            type="button"
                            className="curr-btn-solid teal"
                            onClick={() => setSection("set3")}
                          >
                            <Icon name="slidePlay" size={14} /> สไลด์เต็มจอ
                          </button>
                        </>
                      )
                    }
                  ]
                },
                {
                  id: "step-2",
                  stepNum: 2,
                  tone: "orange",
                  icon: "sparkle",
                  kicker: "ลงมือปฏิบัติ · 2 ภารกิจ",
                  title: "กิจกรรมลงมือปฏิบัติ",
                  desc: "ประยุกต์ใช้ความรู้ผ่านภารกิจสืบค้นและออกแบบ Infographic ด้วย AI และจำลองสถานการณ์สวน AI เพื่อตัดสินใจเชิงจริยธรรม",
                  items: [
                    {
                      id: "u1-item-4",
                      kicker: "ภารกิจที่ 1.1",
                      kickerTone: "orange",
                      tileIcon: "image",
                      tileTone: "orange",
                      title: "กิจกรรมที่ 1.1 AI Research & Infographic Sprint",
                      desc: "ค้นคว้าหัวข้อ AI ตามเลขที่ ออกแบบโปสเตอร์อินโฟกราฟิกขนาด A4 อย่างสร้างสรรค์ พร้อมระบุแหล่งอ้างอิงและส่งงาน",
                      tags: ["งานเดี่ยว/คู่", "100 นาที", "ค้นคว้าตามเลขที่ 1–24", "ออกแบบ A4", "ส่ง Google Classroom"],
                      actions: (
                        <a
                          href={ACT11_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="curr-btn-solid orange"
                          onClick={() => {
                            markChecked("u1-item-4");
                            if (!up.completedActivities.includes("u1-a1")) {
                              markItem("unit1", "activities", "u1-a1", true);
                            }
                          }}
                        >
                          <Icon name="external" size={14} /> เปิดกิจกรรม
                        </a>
                      )
                    },
                    {
                      id: "u1-item-5",
                      kicker: "ภารกิจที่ 1.2",
                      kickerTone: "orange",
                      tileIcon: "globe",
                      tileTone: "orange",
                      title: "กิจกรรมที่ 1.2 AI Decision & Ethics Garden Designer",
                      desc: "ห้องทดลองจำลองสถานการณ์สวน AI วิเคราะห์ผลกระทบต่อผู้มีส่วนได้ส่วนเสีย และฝึกตัดสินใจอย่างมีจริยธรรม",
                      tags: ["Interactive Lab", "จำลองสถานการณ์สวน AI", "วิเคราะห์ผลกระทบ", "20 คะแนน"],
                      actions: (
                        <a
                          href={ACT12_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="curr-btn-solid orange"
                          onClick={() => {
                            markChecked("u1-item-5");
                            if (!up.completedActivities.includes("u1-a2")) {
                              markItem("unit1", "activities", "u1-a2", true);
                            }
                          }}
                        >
                          <Icon name="external" size={14} /> เปิดกิจกรรม
                        </a>
                      )
                    }
                  ]
                },
                {
                  id: "step-minigame",
                  stepNum: 3,
                  tone: "rose",
                  icon: "puzzle",
                  kicker: "ฝึกทบทวนความรู้ · 4 ด่าน",
                  title: "AI QUEST",
                  desc: "สนุกกับเกม AI QUEST 4 ด่านเพื่อเช็กความเข้าใจเรื่องความหมาย AI ประวัติศาสตร์ จริยธรรม และ Deepfake ก่อนทำแบบทดสอบ",
                  items: [
                    {
                      id: "u1-item-minigame",
                      kicker: actsDone >= 4 ? "ผ่านครบ 4 ด่าน ✓" : `ผ่านแล้ว ${actsDone}/4 ด่าน`,
                      kickerTone: actsDone >= 4 ? "emerald" : "rose",
                      tileIcon: "puzzle",
                      tileTone: "rose",
                      title: "ฝึกมินิเกมทบทวนความรู้ (4 ด่านโต้ตอบ)",
                      desc: "ประกอบด้วยด่าน AI or Not AI, Timeline Challenge, Ethics Challenge และ Deepfake Detective",
                      tags: ["AI or Not AI", "Timeline Challenge", "Ethics Challenge", "Deepfake Detective"],
                      actions: (
                        <button
                          type="button"
                          className="curr-btn-solid rose"
                          onClick={() => {
                            setSection("activities");
                          }}
                        >
                          <Icon name="puzzle" size={14} /> ฝึกมินิเกมทบทวน (4 ด่าน)
                        </button>
                      )
                    }
                  ]
                },
                {
                  id: "step-3",
                  stepNum: 4,
                  tone: "purple",
                  icon: "target",
                  kicker: "วัดผลสัมฤทธิ์",
                  title: "แบบทดสอบหลังเรียน หน่วยที่ 1 (10 ข้อ)",
                  desc: "วัดความรู้ความเข้าใจหน่วยการเรียนรู้ที่ 1 แบบปรนัย 4 ตัวเลือก 10 ข้อ เกณฑ์ผ่าน 60% (6/10 ข้อ) พร้อมเฉลยละเอียด",
                  items: [
                    {
                      id: "u1-item-6",
                      kicker: su.quizPassed ? "ผ่านเกณฑ์แล้ว ✓" : "Post-Test · 10 ข้อ",
                      kickerTone: su.quizPassed ? "emerald" : "purple",
                      tileIcon: "award",
                      tileTone: "purple",
                      title: "แบบทดสอบวัดผลการเรียนรู้หลังเรียน (Unit 1 Post-Test)",
                      desc: su.quizBest
                        ? `คะแนนสูงสุดที่ทำได้: ${su.quizBest.correct}/${U1_QUIZ.length} ข้อ (${su.quizBest.percent}%) · สามารถทำซ้ำเพื่อทบทวนความเข้าใจได้`
                        : "ทดสอบความเข้าใจครบทั้ง 3 ตอน ผ่านเกณฑ์ 6 ข้อขึ้นไปเพื่อปลดล็อกเหรียญรางวัล AI Explorer",
                      tags: ["ปรนัย 4 ตัวเลือก", "10 ข้อ", "เกณฑ์ผ่าน 60% (6/10 ข้อ)", "เฉลยละเอียดรายข้อ"],
                      actions: (
                        <button
                          type="button"
                          className="curr-btn-solid purple"
                          onClick={() => setSection("posttest")}
                        >
                          <Icon name="target" size={14} /> เริ่มทำแบบทดสอบ
                        </button>
                      )
                    }
                  ]
                },
                {
                  id: "step-4",
                  stepNum: 5,
                  tone: "teal",
                  icon: "fileText",
                  kicker: "แหล่งอ้างอิง",
                  title: "แหล่งอ้างอิงและเอกสารศึกษาเพิ่มเติม",
                  desc: "รวบรวมเอกสารเผยแพร่ทางการ กฎหมาย AI ระดับสากล จริยธรรมปัญญาประดิษฐ์ของไทย และแหล่งข้อมูลตรวจสอบล่าสุด",
                  items: [
                    {
                      id: "u1-item-7",
                      kicker: "เอกสารทางการ",
                      kickerTone: "sky",
                      tileIcon: "fileText",
                      tileTone: "sky",
                      title: "แหล่งอ้างอิงและข้อมูลตรวจสอบกฎหมาย AI (EU AI Act, PDPA, ETDA)",
                      desc: "ลิงก์ตรงสู่เว็บไซต์ทางการของคณะกรรมาธิการยุโรป, ETDA, สำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (สคส.) และ OECD",
                      tags: ["EU AI Act", "ร่าง พ.ร.บ. AI ไทย", "PDPA สคส.", "ETDA", `ตรวจสอบเมื่อ ${U1_CHECKED}`],
                      actions: (
                        <button
                          type="button"
                          className="curr-btn-solid teal"
                          onClick={() => {
                            markChecked("u1-item-7");
                            setRefsOpen(true);
                          }}
                        >
                          <Icon name="fileText" size={14} /> เปิดแหล่งอ้างอิง
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
                            <div className={`curr-step-circle tone-${step.tone} ${stepAllDone ? "is-done" : ""}`}>
                              {stepAllDone ? <Icon name="check" size={18} stroke={2.6} /> : step.stepNum}
                            </div>
                            {idx < timelineSteps.length - 1 && (
                              <div className="curr-step-line" />
                            )}
                          </div>

                          <div className={`curr-step-card tone-${step.tone}`}>
                            <div className="curr-card-head">
                              <div className="curr-card-head-top">
                                <span className={`curr-card-kicker tone-${step.tone}`}>
                                  <Icon name={step.icon} size={13} />
                                  {step.kicker}
                                </span>
                                {stepAllDone && (
                                  <span className="curr-card-done-badge">
                                    <Icon name="check" size={12} stroke={2.5} /> ครบทุกหัวข้อ
                                  </span>
                                )}
                              </div>
                              <h3 className="curr-card-title">{step.title}</h3>
                              {step.desc && (
                                <p className="curr-card-desc">{step.desc}</p>
                              )}
                            </div>

                            <div className="curr-subitems-list">
                              {step.items.map(it => {
                                const isChecked = !!checkedItems[it.id];
                                return (
                                  <div
                                    key={it.id}
                                    className={`curr-subitem-row u1-enhanced-row ${isChecked ? "is-checked" : ""}`}
                                  >
                                    <div className="u1-item-left-group">
                                      <label
                                        className="curr-check-label"
                                        title={isChecked ? "คลิกเพื่อยกเลิกเครื่องหมาย" : "คลิกเพื่อทำเครื่องหมายว่าเรียนแล้ว"}
                                      >
                                        <input
                                          type="checkbox"
                                          className="curr-checkbox-hidden"
                                          checked={isChecked}
                                          onChange={() => toggleCheck(it.id)}
                                        />
                                        <span className={`curr-custom-checkbox ${isChecked ? "is-checked" : ""}`}>
                                          <Icon name="check" size={13} stroke={3} />
                                        </span>
                                      </label>

                                      {it.thumb ? (
                                        <div className="u1-subitem-visual has-thumb" aria-hidden="true">
                                          <img src={it.thumb} alt="" className="u1-subitem-thumb" loading="lazy" />
                                          <span className={`u1-subitem-thumb-badge tone-${it.kickerTone}`}>
                                            <Icon name={it.thumbIcon} size={12} />
                                          </span>
                                        </div>
                                      ) : (
                                        <div className={`u1-subitem-visual icon-tile tone-${it.tileTone}`} aria-hidden="true">
                                          <Icon name={it.tileIcon} size={23} />
                                        </div>
                                      )}

                                      <div className="curr-subitem-info">
                                        <div className="u1-subitem-head-row">
                                          {it.kicker && (
                                            <span className={`u1-subitem-kicker tone-${it.kickerTone}`}>
                                              {it.kicker}
                                            </span>
                                          )}
                                          <div className="curr-subitem-title" style={{ marginBottom: 0 }}>
                                            {it.title}
                                          </div>
                                        </div>
                                        {it.desc && (
                                          <p className="u1-subitem-desc">{it.desc}</p>
                                        )}
                                        {it.tags && (
                                          <div className="curr-subitem-meta">
                                            {it.tags.map(tag => (
                                              <span key={tag} className="curr-tag-pill">{tag}</span>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div className="curr-subitem-actions">
                                      {it.actions}
                                    </div>
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
              );
            })()}
          </div>
        </div>
      )}

      {/* =====================================================================
         2. Study Views (Knowledge Sheet, Fullscreen Slides, Quiz, Practice Lab)
         ===================================================================== */}
      {section !== "cover" && (
        <div className="u1-study-view">
          {(section === "ks1" || section === "ks2" || section === "ks3") && (
            <Unit1KnowledgeSheet
              initialTopic={section}
              onBack={() => setSection("cover")}
              onOpenSlides={(targetSet) => setSection(targetSet)}
              checkedItems={checkedItems}
              onToggleCheck={toggleCheck}
              onMarkSetDone={markSetDone}
              isBrowserFs={isBrowserFs}
              onToggleBrowserFs={toggleBrowserFs}
            />
          )}

          {section === "set1" && (
            <div className="u1-set-container">
              <LessonSlideDeck
                lessonId="u1-set1"
                slides={slidesSet1}
                unitLabel="UNIT 01"
                deckTitle="1.1 แนวคิดเบื้องต้นเกี่ยวกับปัญญาประดิษฐ์"
                onBack={() => setSection("cover")}
                finishLabel="เรื่องต่อไป →"
                onFinish={() => finishSlideSet(["u1-l1", "u1-l2", "u1-l3"], "u1-item-1", "ชุดที่ 1: AI คืออะไร", "set2", "u1-set2")}
              />
            </div>
          )}

          {section === "set2" && (
            <div className="u1-set-container">
              <LessonSlideDeck
                lessonId="u1-set2"
                slides={slidesSet2}
                unitLabel="UNIT 01"
                deckTitle="1.1 จริยธรรม AI และการควบคุมตามระดับความเสี่ยง"
                onBack={() => setSection("cover")}
                finishLabel="เรื่องต่อไป →"
                onFinish={() => finishSlideSet(["u1-l4"], "u1-item-2", "ชุดที่ 2: จริยธรรมและความเสี่ยง", "set3", "u1-set3")}
              />
            </div>
          )}

          {section === "set3" && (
            <div className="u1-set-container">
              <LessonSlideDeck
                lessonId="u1-set3"
                slides={slidesSet3}
                unitLabel="UNIT 01"
                deckTitle="1.1 ข้อมูลส่วนบุคคล (PDPA) และ Deepfake"
                onBack={() => setSection("cover")}
                finishLabel="ไปทำกิจกรรม →"
                onFinish={() => finishSlideSet(["u1-l5", "u1-l6"], "u1-item-3", "ชุดที่ 3: PDPA และ Deepfake", "cover")}
              />
            </div>
          )}

          {section === "act11" && (
            <div className="u1-set-container">
              <MissionSprintDeck onBack={() => setSection("cover")} />
            </div>
          )}

          {section === "posttest" && createPortal(
            <div className="lesson-slide-deck deck-fullscreen u1-posttest-fullscreen">
              <div className="deck-toolbar">
                <div className="deck-toolbar-left">
                  <button
                    type="button"
                    className="deck-fs-back-btn"
                    onClick={exitSectionToCover}
                  >
                    <Icon name="grid" size={15} />
                    <span>เมนูบทเรียน</span>
                  </button>
                  <div className="deck-fs-unit-meta">
                    <span className="deck-fs-unit-kicker">UNIT 01</span>
                    <span className="deck-fs-unit-title">แบบทดสอบหลังเรียน (ปรนัย 10 ข้อ)</span>
                  </div>
                </div>
                <div className="deck-toolbar-right">
                  <button
                    type="button"
                    className={`deck-fullscreen-btn ${isBrowserFs ? "active" : ""}`}
                    onClick={toggleBrowserFs}
                    title={isBrowserFs ? "ออกจากโหมดเต็มจอ (หรือกด Esc)" : "ขยายแบบทดสอบให้เต็มจอทั้งหมด"}
                    aria-label={isBrowserFs ? "ออกจากเต็มจอ" : "เต็มจอ"}
                  >
                    <Icon name={isBrowserFs ? "minimize" : "expand"} size={15} />
                    <span>{isBrowserFs ? "ออกจากเต็มจอ" : "เต็มจอ"}</span>
                  </button>
                </div>
              </div>
              <div className="deck-slide-stage">
                <div className="deck-slide-card deck-quiz-fullscreen-card">
                  <div className="deck-slide-body">
                    <QuizRunner
                      unitId="unit1"
                      questions={U1_QUIZ}
                      lessonTitle={resolveQuizReviewTitle}
                      onGoLesson={(lid) => setSection(resolveQuizReviewSection(lid))}
                    />
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )}

          {section === "activities" && (
            <div className="u1-activities-container">
              <div className="u1-activities-topbar">
                <Button variant="ghost" icon="chevL" onClick={() => setSection("cover")}>
                  กลับหน้าหลักหน่วยที่ 1
                </Button>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <Badge tone="cyan">
                    <Icon name="puzzle" size={12} /> มินิเกมฝึกทบทวน {actsDone}/4 ด่าน
                  </Badge>
                  <button
                    type="button"
                    className="curr-btn-solid indigo"
                    onClick={() => setSection("posttest")}
                  >
                    <Icon name="target" size={14} /> ไปทำแบบทดสอบหลังเรียน
                  </button>
                </div>
              </div>

              <AiQuestGame />
            </div>
          )}
        </div>
      )}

      {/* References Modal */}
      <Modal
        open={refsOpen}
        onClose={() => setRefsOpen(false)}
        title="แหล่งอ้างอิงหน่วยที่ 1"
      >
        <Callout tone="warn" icon="info" title="ข้อมูลการตรวจสอบความถูกต้อง">
          ตรวจสอบข้อมูลกฎหมายเมื่อ {U1_CHECKED} · ข้อมูล EU AI Act ตรวจจากเว็บไซต์ทางการของคณะกรรมาธิการยุโรปและคณะมนตรีสหภาพยุโรป สถานะร่าง พ.ร.บ. AI ของไทยตรวจจากรายงานข่าวที่อ้างข้อมูลของ ETDA และกระทรวงดีอี ส่วน PDPA อ้างอิงจากเอกสารเผยแพร่ของ สคส. ครูควรตรวจสถานะล่าสุดอีกครั้งก่อนใช้สอน
        </Callout>
        <ul className="u1-ref-cards">
          {U1_REFS.map(r => (
            <li key={r.url} className="u1-ref-card-item">
              <div className="u1-ref-card-left">
                <span className="ref-tag">{r.tag}</span>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="u1-ref-link"
                >
                  {r.title}
                </a>
              </div>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`เปิดลิงก์ ${r.title}`}
                style={{ color: "#2563EB", flexShrink: 0, display: "inline-flex" }}
              >
                <Icon name="external" size={16} />
              </a>
            </li>
          ))}
        </ul>
      </Modal>
    </>
  );
}

export default Unit1Page;
export { Unit1Page };
