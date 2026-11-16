import React, { useState } from 'react';
import { Icon, Button } from '../../UIPrimitives.jsx';
import { Callout } from '../../UIHelpers.jsx';
import { LessonSlideDeck } from '../../LessonSlideDeck.jsx';

/* =====================================================================
   Activity 1.1: AI Research & Infographic Sprint (8 Interactive Slides)
   Activity 1.2: AI Garden Designer
   ===================================================================== */
export const ACT11_URL = "https://chanok109.github.io/Krunok-AI-Academy/unit1_AI_Research.html";
export const ACT12_URL = "https://chanok109.github.io/ai-garden/";

const ACT11_TEAMS = [
  { team: 1, numbers: [8, 9, 1, 10, 3, 5, 18, 13], topic: "T1" },
  { team: 2, numbers: [22, 16, 2, 12, 23, 4, 17, 7], topic: "T2" },
  { team: 3, numbers: [15, 14, 24, 11, 6, 20, 21, 19], topic: "T3" }
];

const ACT11_TOPICS = {
  T1: {
    code: "TOPIC 01",
    en: "AI Foundations",
    slug: "AI-Foundations",
    th: "ความหมายและแนวคิดเกี่ยวกับ AI",
    tone: "cyan",
    color: "#0284C7",
    items: [
      "ความหมายของปัญญาประดิษฐ์ (Artificial Intelligence)",
      "นิยาม AI ของ John McCarthy (ค.ศ. 1956)",
      "แนวคิด AI 4 แนวทาง ได้แก่ Thinking Humanly, Thinking Rationally, Acting Humanly และ Acting Rationally",
      "ตัวอย่าง AI ในชีวิตประจำวันอย่างน้อย 2 ตัวอย่าง"
    ],
    q: "AI แตกต่างจากโปรแกรมคอมพิวเตอร์ทั่วไปอย่างไร?"
  },
  T2: {
    code: "TOPIC 02",
    en: "AI History",
    slug: "AI-History",
    th: "ประวัติและพัฒนาการของ AI",
    tone: "gold",
    color: "#D97706",
    items: [
      "เหตุการณ์สำคัญเกี่ยวกับ AI อย่างน้อย 5 เหตุการณ์ ตั้งแต่ ค.ศ. 1950 ถึงปัจจุบัน",
      "การประชุม Dartmouth Conference ค.ศ. 1956",
      "ความหมายและสาเหตุของยุค AI Winter",
      "ปัจจัยที่ทำให้ AI พัฒนาก้าวกระโดด 3 ประการ ได้แก่ Big Data, Computing Power และ Advanced Algorithms"
    ],
    q: "เหตุใดเทคโนโลยี AI จึงพัฒนาอย่างรวดเร็วในช่วงหลัง?"
  },
  T3: {
    code: "TOPIC 03",
    en: "AI Ethics",
    slug: "AI-Ethics",
    th: "จริยธรรมและการใช้ AI อย่างรับผิดชอบ",
    tone: "purple",
    color: "#4F46E5",
    items: [
      "หลักจริยธรรม AI อย่างน้อย 3 ประการ",
      "อคติของข้อมูลและอัลกอริทึม (Data Bias)",
      "อาการ AI สร้างข้อมูลเท็จอย่างมั่นใจ (AI Hallucination)",
      "สื่อสังเคราะห์ปลอมแปลงใบหน้าและเสียง (Deepfake)",
      "แนวทางใช้ AI อย่างปลอดภัยและเคารพข้อมูลส่วนบุคคล"
    ],
    q: "นักเรียนควรตรวจสอบอะไรบ้างก่อนเชื่อหรือแชร์ผลลัพธ์จาก AI?"
  }
};

const ACT11_NUM_MAP = {};
ACT11_TEAMS.forEach(t => t.numbers.forEach(n => { ACT11_NUM_MAP[n] = t; }));

const ACT11_CHECKS = [
  "จัดทำรายงานขนาด A4 จำนวน 1 หน้าครบถ้วน",
  "จัดทำโปสเตอร์อินโฟกราฟิกขนาด A4 จำนวน 1 หน้าครบถ้วน",
  "ระบุแหล่งอ้างอิงที่น่าเชื่อถืออย่างน้อย 2 แหล่งในรายงาน",
  "ตรวจสอบความถูกต้องของข้อเท็จจริงแล้ว (ไม่มีข้อมูลมั่วจาก AI)",
  "ตรวจสอบตัวสะกดและภาษาไทยในโปสเตอร์เรียบร้อยแล้ว",
  "ระบุชื่อเครื่องมือ AI ที่ใช้ช่วยออกแบบ (เช่น ChatGPT, Claude, Canva)",
  "ใส่ชื่อ-นามสกุล ชั้น และเลขที่ครบทั้ง 2 ชิ้นงาน",
  "ตั้งชื่อไฟล์ทั้ง 2 ชิ้นถูกต้องตามรูปแบบที่ครูกำหนด"
];

export default function MissionSprintDeck({ onBack }) {
  const [studentNo, setStudentNo] = useState(() => Number(localStorage.getItem("krunok_act11_no")) || null);
  const [roomCode, setRoomCode] = useState(() => localStorage.getItem("krunok_act11_room") || "501");
  const [topicTab, setTopicTab] = useState("T1");
  const [summaryText, setSummaryText] = useState(() => localStorage.getItem("krunok_act11_summary") || "");
  const [chk, setChk] = useState(() => {
    try { return JSON.parse(localStorage.getItem("krunok_act11_checks") || "{}"); } catch { return {}; }
  });
  const [copiedMsg, setCopiedMsg] = useState("");

  const pickStudent = n => {
    const num = Number(n) || null;
    setStudentNo(num);
    try { localStorage.setItem("krunok_act11_no", num ? String(num) : ""); } catch {}
    if (num && ACT11_NUM_MAP[num]) {
      setTopicTab(ACT11_NUM_MAP[num].topic);
    }
  };

  const myTeam = studentNo ? ACT11_NUM_MAP[studentNo] : null;
  const myTopic = myTeam ? ACT11_TOPICS[myTeam.topic] : null;

  const promptString = `ฉันเป็นนักเรียนชั้นมัธยมศึกษาปีที่ 5 ต้องการสร้างโปสเตอร์อินโฟกราฟิกภาษาไทย ขนาด A4 แนวตั้ง เรื่อง "${myTopic ? myTopic.th : "[หัวข้อที่ได้รับ]"}" โดยใช้เนื้อหาที่ตรวจสอบแล้ว [${summaryText.trim() || "เนื้อหาสรุป 3–5 ประเด็น"}] ออกแบบให้สวยงาม ทันสมัย อ่านง่าย มีหัวเรื่อง ภาพประกอบ ไอคอน และสรุปสำคัญ ห้ามเพิ่มข้อเท็จจริงหรือแหล่งอ้างอิงที่ไม่ได้ให้`;

  const doCopy = (txt, msg) => {
    try {
      navigator.clipboard.writeText(txt);
      setCopiedMsg(msg);
      setTimeout(() => setCopiedMsg(""), 2200);
    } catch {}
  };

  const doneCheckCount = ACT11_CHECKS.filter((_, i) => chk[i]).length;
  const reportFileName = `${roomCode || "ห้อง"}_${studentNo ? String(studentNo).padStart(2, "0") : "เลขที่"}_${myTopic ? myTopic.slug : "หัวข้อ"}_Report.pdf`;
  const posterFileName = `${roomCode || "ห้อง"}_${studentNo ? String(studentNo).padStart(2, "0") : "เลขที่"}_${myTopic ? myTopic.slug : "หัวข้อ"}_Poster.png`;

  const slidesAct11 = [
    {
      id: "act11-s1",
      theme: "blue",
      icon: "sparkle",
      title: "ภารกิจ AI Research & Infographic Sprint",
      tag: "กิจกรรมที่ 1.1 · 1/8",
      subtitle: "ค้นคว้าปัญญาประดิษฐ์ สรุปเป็นรายงาน 1 หน้า A4 และสร้างโปสเตอร์อินโฟกราฟิกด้วย AI",
      content: (
        <div className="infographic-split">
          <div className="info-left-col">
            <div className="info-hero-banner cyan" style={{ fontSize: "clamp(16px, 1.2vw, 19px)", lineHeight: 1.65 }}>
              <Icon name="bot" size={24} style={{ color: "#0284C7", marginRight: 8, verticalAlign: "middle" }} />
              <b>AIra ชวนทำภารกิจรายบุคคล:</b> นักเรียนแต่ละเลขที่จะได้รับหัวข้อค้นคว้า AI คนละ 1 หัวข้อ (จาก 3 หัวข้อหลัก) เพื่อจัดทำ <b>รายงาน 1 หน้า A4</b> และ <b>โปสเตอร์อินโฟกราฟิก 1 หน้า A4</b> ส่งใน Google Classroom
            </div>
            <div className="chips-grid" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 14 }}>
              {[
                ["3", "หัวข้อค้นคว้า", "#0284C7", "layers"],
                ["2", "ชิ้นงาน A4", "#4F46E5", "fileText"],
                ["100", "นาที (2 คาบ)", "#15803D", "clock"],
                ["20", "คะแนนเต็ม", "#B45309", "trophy"]
              ].map(([num, label, col, ic]) => (
                <div key={label} className="ex-card" style={{ textAlign: "center", justifyContent: "center", padding: "18px 12px", borderRadius: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <span style={{ color: col, opacity: 0.9 }}><Icon name={ic} size={24} /></span>
                    <b style={{ fontSize: "clamp(28px, 2.4vw, 38px)", color: col, display: "block", lineHeight: 1.05 }}>{num}</b>
                    <span style={{ fontSize: "clamp(14.5px, 1.05vw, 17px)", fontWeight: 700, color: "#334155" }}>{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="info-right-col">
            <div className="info-takeaway-box purple">
              <div className="takeaway-header">
                <Icon name="sparkle" size={22} style={{ color: "#4338CA" }} />
                <h4 style={{ color: "#4338CA", fontSize: "clamp(19px, 1.4vw, 23px)" }}>3 ขั้นตอนสั้น ๆ ในการทำกิจกรรม</h4>
              </div>
              <ul className="takeaway-points" style={{ fontSize: "clamp(15.5px, 1.15vw, 18.5px)", lineHeight: 1.65 }}>
                <li><Icon name="check" size={18} style={{ color: "#0284C7", marginTop: 3 }} /><span><b>สไลด์ 2–4:</b> กดเลขที่ของตนเอง (1–24) เพื่อดูทีมและประเด็นที่ต้องค้นคว้า</span></li>
                <li><Icon name="check" size={18} style={{ color: "#4F46E5", marginTop: 3 }} /><span><b>สไลด์ 5–6:</b> ดูโครงสร้างชิ้นงานทั้ง 2 ชิ้น และคัดลอก Prompt สร้างโปสเตอร์</span></li>
                <li><Icon name="check" size={18} style={{ color: "#15803D", marginTop: 3 }} /><span><b>สไลด์ 7–8:</b> ตรวจเช็กลิสต์ 8 ข้อ คัดลอกชื่อไฟล์อัตโนมัติ และส่งงาน</span></li>
              </ul>
              <div style={{ marginTop: 14 }}>
                <a
                  href={ACT11_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn primary"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", width: "100%", justifyContent: "center", fontSize: 16, padding: "12px 18px" }}
                >
                  <Icon name="sparkle" size={18} />
                  เปิดลิงก์กิจกรรมที่ 1.1 ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "act11-s2",
      theme: "blue",
      icon: "users",
      title: "ตรวจสอบหัวข้อของฉัน (กดเลือกเลขที่ 1–24)",
      tag: "เลือกเลขที่ · 2/8",
      subtitle: "คลิกปุ่มเลขที่ของตนเองด้านซ้าย ระบบจะแสดงทีมและโจทย์ค้นคว้าทันทีโดยไม่ต้องล็อกอิน",
      content: (
        <div className="infographic-split">
          <div className="info-left-col">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <b style={{ fontSize: 17 }}>คลิกเลือกเลขที่ของคุณ (1–24):</b>
              <label style={{ fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
                <span>รหัสห้อง:</span>
                <input
                  type="text"
                  value={roomCode}
                  onChange={e => {
                    setRoomCode(e.target.value);
                    try { localStorage.setItem("krunok_act11_room", e.target.value); } catch {}
                  }}
                  style={{ width: 82, padding: "6px 10px", borderRadius: 8, border: "1.5px solid #CBD5E1", textAlign: "center", fontWeight: 700, fontSize: 15 }}
                />
              </label>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 9 }}>
              {Array.from({ length: 24 }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => pickStudent(n)}
                  style={{
                    padding: "12px 0",
                    borderRadius: 12,
                    fontWeight: 800,
                    fontSize: 17,
                    cursor: "pointer",
                    border: studentNo === n ? "2px solid #0284C7" : "1.5px solid #CBD5E1",
                    background: studentNo === n ? "#0284C7" : "#FFFFFF",
                    color: studentNo === n ? "#FFFFFF" : "#0F172A"
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="info-right-col">
            {!myTopic ? (
              <div className="info-takeaway-box cyan" style={{ textAlign: "center", padding: 36 }}>
                <Icon name="target" size={42} style={{ color: "#0284C7", marginBottom: 10 }} />
                <h4 style={{ color: "#0284C7", marginBottom: 8, fontSize: 22 }}>👆 เลือกเลขที่ 1–24 ด้านซ้าย</h4>
                <p className="takeaway-body" style={{ fontSize: 17 }}>เพื่อแสดงกลุ่ม หัวข้อค้นคว้า และคำถามชวนคิดประจำตัวของคุณ</p>
              </div>
            ) : (
              <div className={`info-takeaway-box ${myTopic.tone}`}>
                <div className="takeaway-header" style={{ justifyContent: "space-between" }}>
                  <h4 style={{ color: myTopic.color, fontSize: 21 }}>เลขที่ {studentNo} · TEAM {myTeam.team} ({myTopic.code})</h4>
                  <span className={`hl-pill ${myTopic.tone}`}>{myTopic.en}</span>
                </div>
                <p style={{ fontWeight: 800, fontSize: 19, margin: "8px 0" }}>{myTopic.th}</p>
                <ol style={{ margin: "8px 0", paddingLeft: 22, fontSize: 16, lineHeight: 1.68 }}>
                  {myTopic.items.map(it => <li key={it}>{it}</li>)}
                </ol>
                <div className="takeaway-quote" style={{ fontSize: 16 }}>
                  💡 <b>คำถามชวนคิด:</b> {myTopic.q}
                </div>
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      id: "act11-s3",
      theme: "purple",
      icon: "grid",
      title: "ตารางการแบ่งกลุ่มตามหัวข้อค้นคว้า (3 ทีม)",
      tag: "Groups Board · 3/8",
      subtitle: "นักเรียน 24 คน แบ่งเป็น 3 กลุ่ม กลุ่มละ 8 คน (แลกเปลี่ยนความรู้กันได้ แต่ส่งชิ้นงานรายบุคคล)",
      content: (
        <div className="prose" style={{ maxWidth: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
            {ACT11_TEAMS.map(tObj => {
              const tp = ACT11_TOPICS[tObj.topic];
              const isMine = myTeam && myTeam.team === tObj.team;
              return (
                <div
                  key={tObj.team}
                  className="list-card"
                  style={{
                    border: isMine ? `2.5px solid ${tp.color}` : "1.5px solid #CBD5E1",
                    background: "#FFFFFF",
                    padding: 20,
                    borderRadius: 18
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span className={`hl-pill ${tp.tone}`}>TEAM {tObj.team} · {tp.code}</span>
                    {isMine && <span className="hl-pill green">ทีมของฉัน</span>}
                  </div>
                  <h4 style={{ margin: "6px 0", color: "#0F172A", fontSize: 20 }}>{tp.th}</h4>
                  <p style={{ fontSize: 15, color: "#475569", marginBottom: 12 }}>สมาชิก {tObj.numbers.length} คน (คลิกเลขที่เพื่อเลือก):</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                    {tObj.numbers.map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => pickStudent(num)}
                        style={{
                          padding: "8px 0",
                          borderRadius: 10,
                          fontWeight: 700,
                          fontSize: 15,
                          cursor: "pointer",
                          border: studentNo === num ? `2px solid ${tp.color}` : "1px solid #CBD5E1",
                          background: studentNo === num ? tp.color : "#F8FAFC",
                          color: studentNo === num ? "#FFFFFF" : "#0F172A"
                        }}
                      >
                        #{num}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )
    },
    {
      id: "act11-s4",
      theme: "blue",
      icon: "search",
      title: "รายละเอียดเนื้อหาที่ต้องค้นคว้าทั้ง 3 หัวข้อ",
      tag: "Research Topics · 4/8",
      subtitle: "คลิกสลับดูประเด็นค้นคว้าของ TOPIC 01, 02 และ 03 (อ้างอิงอย่างน้อย 2 แหล่ง)",
      content: (
        <div className="prose" style={{ maxWidth: "100%" }}>
          <div className="seg" role="tablist">
            {Object.entries(ACT11_TOPICS).map(([k, v]) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={topicTab === k}
                onClick={() => setTopicTab(k)}
                style={{ fontSize: 16, padding: "10px 18px" }}
              >
                {v.code}: {v.en} {myTeam && myTeam.topic === k ? "★" : ""}
              </button>
            ))}
          </div>
          {(() => {
            const cur = ACT11_TOPICS[topicTab];
            return (
              <div className={`info-takeaway-box ${cur.tone}`} style={{ marginTop: 16 }}>
                <div className="takeaway-header">
                  <Icon name="book" size={22} style={{ color: cur.color }} />
                  <h4 style={{ color: cur.color, fontSize: 22 }}>{cur.code} · {cur.th} ({cur.en})</h4>
                </div>
                <ol style={{ margin: "10px 0", paddingLeft: 24, fontSize: 17, lineHeight: 1.72 }}>
                  {cur.items.map(it => <li key={it}>{it}</li>)}
                </ol>
                <div className="takeaway-quote" style={{ fontSize: 16.5 }}>
                  💬 <b>คำถามชวนคิดที่ต้องตอบในรายงาน:</b> {cur.q}
                </div>
              </div>
            );
          })()}
        </div>
      )
    },
    {
      id: "act11-s5",
      theme: "green",
      icon: "fileText",
      title: "คำชี้แจงชิ้นงาน 2 ชิ้นที่ต้องส่ง (ชิ้นละ 1 หน้า A4)",
      tag: "Assignments · 5/8",
      subtitle: "จัดทำด้วยตนเองทั้งรายงานสรุปและโปสเตอร์อินโฟกราฟิก",
      content: (
        <div className="two-col" style={{ margin: 0 }}>
          <div className="list-card good" style={{ padding: "22px 26px" }}>
            <h4 style={{ fontSize: 21, display: "flex", alignItems: "center", gap: 10 }}><Icon name="fileText" size={24} /> ชิ้นงานที่ 1: รายงาน 1 หน้า A4 (PDF / DOCX)</h4>
            <ul style={{ fontSize: 17, lineHeight: 1.7 }}>
              <li><b>ชื่อเรื่อง</b> ตามหัวข้อที่ได้รับมอบหมาย</li>
              <li><b>ชื่อผู้จัดทำ / ชั้น / เลขที่</b> ชัดเจน</li>
              <li><b>เนื้อหาสรุปด้วยภาษาของตนเอง</b> ครบทุกประเด็น</li>
              <li><b>ตัวอย่างหรือข้อคิด</b> (ตอบคำถามชวนคิดประจำหัวข้อ)</li>
              <li><b>แหล่งอ้างอิงอย่างน้อย 2 แหล่ง</b> ที่ตรวจสอบได้จริง</li>
            </ul>
          </div>
          <div className="list-card good" style={{ padding: "22px 26px" }}>
            <h4 style={{ fontSize: 21, display: "flex", alignItems: "center", gap: 10 }}><Icon name="image" size={24} /> ชิ้นงานที่ 2: โปสเตอร์อินโฟกราฟิก 1 หน้า A4 (PNG / PDF)</h4>
            <ul style={{ fontSize: 17, lineHeight: 1.7 }}>
              <li><b>ชื่อหัวข้อ</b> และ <b>ประเด็นสำคัญ 3–5 ประเด็น</b></li>
              <li><b>ภาพหรือไอคอนประกอบ</b> และสรุปสาระสำคัญ</li>
              <li><b>เนื้อหาสอดคล้องตรงกับรายงาน</b> ชิ้นงานที่ 1</li>
              <li><b>ตรวจสอบภาษาไทยและข้อเท็จจริง</b> ก่อนส่งเสมอ</li>
              <li><b>ระบุเครื่องมือ AI ที่ใช้</b> (เช่น ChatGPT, Claude, Canva)</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "act11-s6",
      theme: "purple",
      icon: "chat",
      title: "ตัวช่วยสร้าง Prompt สำหรับสร้างอินโฟกราฟิกด้วย AI",
      tag: "AI Prompt Studio · 6/8",
      subtitle: "คัดลอก Prompt ด้านล่างไปใช้ใน ChatGPT, Claude หรือ Canva ได้ทันที",
      content: (
        <div className="infographic-split">
          <div className="info-left-col">
            <label style={{ fontSize: 16.5, fontWeight: 700, display: "block", marginBottom: 8 }}>
              พิมพ์สรุป 3–5 ประเด็นจากรายงานของคุณ (เพื่อใส่ใน Prompt อัตโนมัติ):
            </label>
            <textarea
              rows={4}
              value={summaryText}
              onChange={e => {
                setSummaryText(e.target.value);
                try { localStorage.setItem("krunok_act11_summary", e.target.value); } catch {}
              }}
              placeholder="พิมพ์ประเด็นสำคัญ 3-5 ข้อที่ตรวจสอบแล้วที่นี่..."
              style={{ width: "100%", padding: 14, borderRadius: 12, border: "1.5px solid #CBD5E1", fontSize: 16 }}
            />
            <Callout tone="info" title="ปรับแต่ง Prompt ได้ตามต้องการ">
              สามารถระบุโทนสี สไตล์ภาพ หรือการจัดวางเพิ่มเติมได้ แต่ห้ามให้ AI เพิ่มข้อเท็จจริงหรือแหล่งอ้างอิงที่ไม่มีอยู่จริง
            </Callout>
          </div>
          <div className="info-right-col">
            <div className="info-takeaway-box cyan">
              <div className="takeaway-header" style={{ justifyContent: "space-between" }}>
                <h4 style={{ color: "#0284C7", fontSize: 20 }}>Prompt สำหรับ {studentNo ? `เลขที่ ${studentNo}` : "คุณ"}</h4>
                <Button size="sm" icon="copy" onClick={() => doCopy(promptString, "คัดลอก Prompt แล้ว!")}>
                  คัดลอก Prompt
                </Button>
              </div>
              <p className="takeaway-body" style={{ background: "#FFFFFF", padding: 16, borderRadius: 12, border: "1.5px solid #BAE6FD", fontSize: 16, lineHeight: 1.65 }}>
                {promptString}
              </p>
              {copiedMsg && <div style={{ color: "#15803D", fontWeight: 700, fontSize: 15, marginTop: 8 }}>✓ {copiedMsg}</div>}
            </div>
          </div>
        </div>
      )
    },
    {
      id: "act11-s7",
      theme: "gold",
      icon: "clock",
      title: "แผนเวลา 100 นาที (2 คาบ) & เกณฑ์การให้คะแนน 20 คะแนน",
      tag: "Timeline & Rubric · 7/8",
      subtitle: "บริหารเวลา 5 ขั้นตอน และตรวจสอบเกณฑ์คะแนน (รายงาน 10 + โปสเตอร์ 10)",
      content: (
        <div className="two-col" style={{ margin: 0 }}>
          <div className="list-card" style={{ padding: "22px 26px" }}>
            <h4 style={{ fontSize: 21, display: "flex", alignItems: "center", gap: 10 }}><Icon name="clock" size={24} /> แผนเวลา 100 นาที (คาบละ 50 นาที)</h4>
            <ul style={{ fontSize: 16.5, lineHeight: 1.7 }}>
              <li><b>นาทีที่ 0–10 (10 นาที):</b> รับหัวข้อ อ่านคำชี้แจง และวางแผน</li>
              <li><b>นาทีที่ 10–35 (25 นาที):</b> ค้นคว้าข้อมูลจากอย่างน้อย 2 แหล่ง และตรวจข้อเท็จจริง</li>
              <li><b>นาทีที่ 35–60 (25 นาที):</b> เขียนรายงาน 1 หน้า A4 ด้วยภาษาของตนเอง</li>
              <li><b>นาทีที่ 60–90 (30 นาที):</b> ใช้ AI ออกแบบโปสเตอร์อินโฟกราฟิก และตรวจแก้ภาษาไทย</li>
              <li><b>นาทีที่ 90–100 (10 นาที):</b> ตรวจเช็กลิสต์และส่งใน Google Classroom</li>
            </ul>
          </div>
          <div className="list-card" style={{ padding: "22px 26px" }}>
            <h4 style={{ fontSize: 21, display: "flex", alignItems: "center", gap: 10 }}><Icon name="trophy" size={24} /> เกณฑ์คะแนน 20 คะแนน (รายงาน 10 + โปสเตอร์ 10)</h4>
            <ul style={{ fontSize: 16.5, lineHeight: 1.7 }}>
              <li><b>รายงาน (10 คะแนน):</b> เนื้อหาถูกต้องครบถ้วน (4) · อธิบายเข้าใจและยกตัวอย่าง (3) · แหล่งอ้างอิง ≥ 2 แหล่ง (2) · ความเป็นระเบียบ (1)</li>
              <li><b>โปสเตอร์ (10 คะแนน):</b> เนื้อหาสอดคล้องรายงาน (4) · สื่อสารด้วยภาพสวยงาม (3) · ภาษาไทยถูกต้องอ่านง่าย (2) · ระบุเครื่องมือ AI ที่ใช้ (1)</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "act11-s8",
      theme: "green",
      icon: "check",
      title: "เช็กลิสต์ตรวจงาน 8 ข้อ & ตั้งชื่อไฟล์ส่ง Google Classroom",
      tag: "Checklist & Submit · 8/8",
      subtitle: "ติ๊กตรวจความเรียบร้อย คัดลอกชื่อไฟล์อัตโนมัติ และส่งงานใน Google Classroom",
      content: (
        <div className="infographic-split">
          <div className="info-left-col">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <b style={{ fontSize: 17 }}>เช็กลิสต์ก่อนส่งงาน ({doneCheckCount}/{ACT11_CHECKS.length})</b>
              <button
                type="button"
                onClick={() => { setChk({}); try { localStorage.setItem("krunok_act11_checks", "{}"); } catch {} }}
                style={{ fontSize: 14, color: "#64748B", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
              >
                ล้างเครื่องหมาย
              </button>
            </div>
            <div className="checklist" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {ACT11_CHECKS.map((text, idx) => (
                <label key={idx} className="check" style={{ padding: "10px 14px", fontSize: 15.5 }}>
                  <input
                    type="checkbox"
                    checked={!!chk[idx]}
                    onChange={e => {
                      const next = { ...chk, [idx]: e.target.checked };
                      setChk(next);
                      try { localStorage.setItem("krunok_act11_checks", JSON.stringify(next)); } catch {}
                    }}
                  />
                  <span>{text}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="info-right-col">
            <div className="info-takeaway-box green">
              <div className="takeaway-header">
                <Icon name="check" size={22} style={{ color: "#15803D" }} />
                <h4 style={{ color: "#15803D", fontSize: 20 }}>ชื่อไฟล์มาตรฐานสำหรับส่งงาน</h4>
              </div>
              <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#FFFFFF", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #CBD5E1" }}>
                  <code style={{ fontSize: 15, fontWeight: 700 }}>{reportFileName}</code>
                  <Button size="sm" variant="ghost" onClick={() => doCopy(reportFileName, "คัดลอกชื่อไฟล์รายงานแล้ว!")}>คัดลอก</Button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#FFFFFF", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #CBD5E1" }}>
                  <code style={{ fontSize: 15, fontWeight: 700 }}>{posterFileName}</code>
                  <Button size="sm" variant="ghost" onClick={() => doCopy(posterFileName, "คัดลอกชื่อไฟล์โปสเตอร์แล้ว!")}>คัดลอก</Button>
                </div>
              </div>
              {copiedMsg && <div style={{ color: "#15803D", fontWeight: 700, fontSize: 15, marginTop: 8 }}>✓ {copiedMsg}</div>}
              <div className="takeaway-quote" style={{ marginTop: 12, fontSize: 16 }}>
                📤 อัปโหลดไฟล์ทั้ง 2 ชิ้นในงานที่มอบหมายบน <b>Google Classroom</b> แล้วกด <b>ส่งงาน (Turn in)</b> ให้เรียบร้อยภายในคาบเรียน
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <LessonSlideDeck
      lessonId="u1-act11"
      slides={slidesAct11}
      deckTitle="กิจกรรม 1.1 · AI Research & Infographic Sprint"
      onBack={onBack}
    />
  );
}
