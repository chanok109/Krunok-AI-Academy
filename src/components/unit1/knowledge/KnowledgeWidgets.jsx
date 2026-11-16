import React, { useState } from 'react';
import { Icon, AIraBot } from '../../UIPrimitives.jsx';
import { MINI_QUIZZES } from './knowledgeData.js';
import { SlideSceneArt } from '../slides/Unit1SlideWidgets.jsx';
import { KS_IMAGES } from './knowledgeImages.js';

export const U1_KS_ART = {
  aiConcept: KS_IMAGES.aiBrain,
  aiEthics: KS_IMAGES.aiEthics,
  aiLaw: KS_IMAGES.aiLaw,
  deepfakeSafety: KS_IMAGES.deepfakeSafety
};

/* =====================================================================
   คอมโพเนนต์ประกอบใบความรู้หน่วยที่ 1
   (การ์ดรูปภาพ · อินโฟกราฟิก · ภาพเวกเตอร์ · กล่องคำถามท้ายบท · แผนภาพ)
   ===================================================================== */

export function scrollToKnowledgeSection(sectionId) {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* การ์ดภาพประกอบหัวบท (ภาพจากโฟลเดอร์ image + น้อง AIra คู่ใจ) */
export function KsHeroArtCard({
  imageSrc,
  imageAlt,
  caption,
  subCaption,
  mood = 'happy',
  tone = 'blue'
}) {
  return (
    <div className={`u1ks-hero-visual-card tone-${tone}`}>
      <div className="u1ks-hero-photo-frame">
        <img src={imageSrc} alt={imageAlt} loading="eager" />
        {subCaption && (
          <span className={`u1ks-hero-photo-tag tone-${tone}`}>
            <Icon name="sparkle" size={12} />
            <span>{subCaption}</span>
          </span>
        )}
      </div>
      <div className="u1ks-hero-mascot-strip">
        <div className="u1ks-hero-mascot-avatar">
          <AIraBot mood={mood} size={58} title={imageAlt} />
        </div>
        <div className="u1ks-hero-mascot-meta">
          <span className="u1ks-hero-caption">{caption}</span>
          <small>เรียนรู้ไปกับ AIra</small>
        </div>
      </div>
    </div>
  );
}

/* ตารางอินโฟกราฟิก 4 แนวทางของปัญญาประดิษฐ์ (Russell & Norvig, 2021) แบบตัวอักษรคมชัดขนาดใหญ่ */
export function RussellNorvigMatrix() {
  const cards = [
    {
      key: 'th',
      tone: 'cyan',
      en: 'Thinking Humanly',
      th: 'การคิดคล้ายมนุษย์',
      icon: 'bulb',
      desc: 'การประมวลผลและตัดสินใจที่เลียนแบบกระบวนการคิดทางจิตวิทยาและกลไกการทำงานของสมองมนุษย์ เพื่อเข้าใจว่ามนุษย์คิดอย่างไร',
      pillIcon: 'user',
      pill: 'Cognitive Modeling',
      tag: 'จิตวิทยาการรู้คิด'
    },
    {
      key: 'tr',
      tone: 'violet',
      en: 'Thinking Rationally',
      th: 'การคิดอย่างมีเหตุผล',
      icon: 'code',
      desc: 'คิดและอนุมานข้อสรุปอย่างถูกต้องโดยใช้หลักตรรกศาสตร์ (Laws of Thought) เพื่อให้ได้ข้อสรุปที่สมเหตุสมผลและถูกต้องตามหลักความจริง',
      pillIcon: 'scale',
      pill: 'Laws of Thought',
      tag: 'ตรรกศาสตร์อนุมาน'
    },
    {
      key: 'ah',
      tone: 'sky',
      en: 'Acting Humanly',
      th: 'การกระทำคล้ายมนุษย์',
      icon: 'bot',
      desc: 'แสดงพฤติกรรมและการกระทำจนแยกไม่ออกจากมนุษย์ สื่อสารและแก้ปัญหาได้เสมือนคนจริงตามมาตรฐานการประเมิน',
      pillIcon: 'chat',
      pill: 'Turing Test (1950)',
      tag: 'การทดสอบของทัวริง'
    },
    {
      key: 'ar',
      tone: 'highlight',
      crown: true,
      en: 'Acting Rationally',
      th: 'การกระทำอย่างมีเหตุผล',
      icon: 'target',
      desc: 'ตัวแทนอัจฉริยะที่รับรู้สภาพแวดล้อมผ่านเซนเซอร์ แล้วตัดสินใจเลือกการกระทำที่ดีที่สุดผ่านตัวขับเคลื่อนเพื่อให้บรรลุเป้าหมายอย่างถูกต้อง',
      pillIcon: 'award',
      pill: 'Rational Agent',
      tag: 'แนวคิดหลักของ AI ปัจจุบัน'
    }
  ];

  return (
    <div className="u1ks-rn-board" role="region" aria-label="แนวคิด 4 แนวทางของปัญญาประดิษฐ์ Russell & Norvig (2021)">
      <div className="u1ks-rn-header">
        <span className="u1ks-rn-kicker">
          <Icon name="book" size={16} />
          <span>RUSSELL &amp; NORVIG (2021) · ARTIFICIAL INTELLIGENCE: A MODERN APPROACH</span>
        </span>
        <h3>แนวคิด 4 แนวทางของปัญญาประดิษฐ์</h3>
        <p>
          จัดกลุ่มนิยาม AI ตาม 2 มิติสำคัญ:{' '}
          <b className="hl-cyan">ความคิด vs การกระทำ</b> และ{' '}
          <b className="hl-violet">เหมือนมนุษย์ vs อย่างมีเหตุผล</b>
        </p>
      </div>

      <div className="u1ks-rn-matrix">
        {/* แถวหัวตารางด้านบน */}
        <div className="u1ks-rn-corner">มิติแนวคิด</div>
        <div className="u1ks-rn-colhead cyan">
          <Icon name="user" size={20} />
          <strong>เหมือนมนุษย์</strong>
          <span>(Humanly)</span>
        </div>
        <div className="u1ks-rn-colhead violet">
          <Icon name="scale" size={20} />
          <strong>อย่างมีเหตุผล</strong>
          <span>(Rationally)</span>
        </div>

        {/* แถวที่ 1: ความคิด (Thinking) */}
        <div className="u1ks-rn-rowhead cyan">
          <span className="u1ks-rn-row-ic cyan">
            <Icon name="bulb" size={24} />
          </span>
          <strong>ความคิด</strong>
          <span>(Thinking)</span>
        </div>

        {cards.slice(0, 2).map((c) => (
          <div key={c.key} className={`u1ks-rn-card tone-${c.tone}`}>
            <div className="u1ks-rn-card-top">
              <div>
                <h4>{c.en}</h4>
                <div className="u1ks-rn-sub">{c.th}</div>
              </div>
              <span className={`u1ks-rn-card-ic tone-${c.tone}`}>
                <Icon name={c.icon} size={22} />
              </span>
            </div>
            <p className="u1ks-rn-desc">{c.desc}</p>
            <div className="u1ks-rn-foot">
              <span className={`u1ks-rn-pill tone-${c.tone}`}>
                <Icon name={c.pillIcon} size={15} />
                <span>{c.pill}</span>
              </span>
              <span className="u1ks-rn-tag">{c.tag}</span>
            </div>
          </div>
        ))}

        {/* แถวที่ 2: การกระทำ (Acting) */}
        <div className="u1ks-rn-rowhead amber">
          <span className="u1ks-rn-row-ic amber">
            <Icon name="cpu" size={24} />
          </span>
          <strong>การกระทำ</strong>
          <span>(Acting)</span>
        </div>

        {cards.slice(2, 4).map((c) => (
          <div key={c.key} className={`u1ks-rn-card tone-${c.tone}`}>
            <div className="u1ks-rn-card-top">
              <div>
                <h4>
                  <span>{c.en}</span>
                  {c.crown && (
                    <span className="u1ks-rn-crown" title="แนวคิดหลักของ AI สมัยใหม่">
                      <Icon name="trophy" size={18} />
                    </span>
                  )}
                </h4>
                <div className="u1ks-rn-sub">{c.th}</div>
              </div>
              <span className={`u1ks-rn-card-ic tone-${c.tone}`}>
                <Icon name={c.icon} size={22} />
              </span>
            </div>
            <p className="u1ks-rn-desc">{c.desc}</p>
            <div className="u1ks-rn-foot">
              <span className={`u1ks-rn-pill tone-${c.tone}`}>
                <Icon name={c.pillIcon} size={15} />
                <span>{c.pill}</span>
              </span>
              <span className="u1ks-rn-tag">{c.tag}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="u1ks-rn-summary">
        <span className="u1ks-rn-sum-ic">
          <Icon name="bulb" size={22} />
        </span>
        <p>
          <b>ข้อสรุปสำคัญ:</b> ปัจจุบันแนวทาง{' '}
          <strong className="hl-cyan">“Rational Agent (ตัวแทนที่กระทำอย่างมีเหตุผล)”</strong>{' '}
          เป็นแนวคิดหลักของการศึกษาและพัฒนา AI สมัยใหม่ เนื่องจากสามารถกำหนดเป้าหมายเชิงคณิตศาสตร์และวัดผลความสำเร็จได้อย่างชัดเจน
        </p>
      </div>
    </div>
  );
}

/* ภาพประกอบเวกเตอร์เฉพาะจุดสำหรับใบความรู้หน่วยที่ 1 */
export function KsSceneGraphic({ kind }) {
  switch (kind) {
    /* แบนเนอร์ภาพสำหรับช่วง AI Winter ครั้งที่ 1 และ 2 ในไทม์ไลน์ */
    case 'winter-1':
      return (
        <svg viewBox="0 0 280 150" className="u1ks-illust-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ksWin1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>
          <rect width="280" height="150" fill="url(#ksWin1)" />
          <circle cx="236" cy="28" r="44" fill="#38BDF8" opacity="0.12" />
          <rect x="34" y="32" width="96" height="68" rx="10" fill="#0F172A" stroke="#64748B" strokeWidth="2" />
          <text x="82" y="62" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="800" fontFamily="Prompt, sans-serif">RAM ต่ำ</text>
          <text x="82" y="81" textAnchor="middle" fill="#F97316" fontSize="11.5" fontWeight="700" fontFamily="Prompt, sans-serif">คำนวณช้า</text>
          <path d="M150 44l28 24 22-10 42 38" fill="none" stroke="#FB923C" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <polygon points="246,100 232,98 242,87" fill="#FB923C" />
          <rect x="148" y="106" width="102" height="24" rx="12" fill="#EA580C" />
          <text x="199" y="122" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="800" fontFamily="Prompt, sans-serif">AI WINTER #1</text>
        </svg>
      );

    case 'winter-2':
      return (
        <svg viewBox="0 0 280 150" className="u1ks-illust-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ksWin2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1E1B4B" />
              <stop offset="100%" stopColor="#312E81" />
            </linearGradient>
          </defs>
          <rect width="280" height="150" fill="url(#ksWin2)" />
          <rect x="28" y="26" width="122" height="26" rx="7" fill="rgba(255,255,255,0.1)" stroke="#818CF8" strokeWidth="1.5" />
          <text x="89" y="43" textAnchor="middle" fill="#E0E7FF" fontSize="11" fontWeight="700" fontFamily="Prompt, sans-serif">IF... THEN... (กฎซับซ้อน)</text>
          <rect x="28" y="60" width="122" height="26" rx="7" fill="rgba(255,255,255,0.1)" stroke="#FDBA74" strokeWidth="1.5" />
          <text x="89" y="77" textAnchor="middle" fill="#FED7AA" fontSize="11" fontWeight="700" fontFamily="Prompt, sans-serif">ดูแลรักษายาก · ต้นทุนสูง</text>
          <circle cx="206" cy="60" r="28" fill="rgba(251, 146, 60, 0.18)" stroke="#FB923C" strokeWidth="2" />
          <path d="M196 50l20 20M216 50l-20 20" stroke="#FDBA74" strokeWidth="3.5" strokeLinecap="round" />
          <rect x="148" y="106" width="104" height="24" rx="12" fill="#EA580C" />
          <text x="200" y="122" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="800" fontFamily="Prompt, sans-serif">AI WINTER #2</text>
        </svg>
      );

    /* --- ภาพประกอบหลักจริยธรรม AI ของประเทศไทย 6 ข้อ --- */
    case 'thai-ethic-1':
      return (
        <svg viewBox="0 0 280 104" className="u1ks-illust-svg" aria-hidden="true">
          <defs>
            <linearGradient id="te1Bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ECFDF5" />
              <stop offset="100%" stopColor="#D1FAE5" />
            </linearGradient>
          </defs>
          <rect width="280" height="104" rx="12" fill="url(#te1Bg)" />
          {/* กราฟเติบโตอย่างยั่งยืน */}
          <rect x="28" y="58" width="18" height="28" rx="5" fill="#6EE7B7" />
          <rect x="54" y="44" width="18" height="42" rx="5" fill="#34D399" />
          <rect x="80" y="28" width="18" height="58" rx="5" fill="#10B981" />
          <path d="M26 50l28-14 28-14 24-6" fill="none" stroke="#047857" strokeWidth="3" strokeLinecap="round" />
          <polygon points="110,14 98,13 104,23" fill="#047857" />
          {/* วงกลมโลกสีเขียวและใบไม้ */}
          <circle cx="198" cy="52" r="32" fill="#FFFFFF" stroke="#34D399" strokeWidth="2.5" />
          <path d="M184 58c2-16 16-24 28-22-2 14-10 26-28 22z" fill="#10B981" />
          <path d="M184 58c8-6 15-11 22-16" fill="none" stroke="#ECFDF5" strokeWidth="2" strokeLinecap="round" />
          <text x="198" y="96" textAnchor="middle" fill="#065F46" fontSize="10.5" fontWeight="800" fontFamily="Prompt, sans-serif">พัฒนาเศรษฐกิจคู่สิ่งแวดล้อม</text>
        </svg>
      );

    case 'thai-ethic-2':
      return (
        <svg viewBox="0 0 280 104" className="u1ks-illust-svg" aria-hidden="true">
          <defs>
            <linearGradient id="te2Bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#EFF6FF" />
              <stop offset="100%" stopColor="#DBEAFE" />
            </linearGradient>
          </defs>
          <rect width="280" height="104" rx="12" fill="url(#te2Bg)" />
          {/* ตราชั่งกฎหมาย */}
          <circle cx="76" cy="52" r="32" fill="#FFFFFF" stroke="#60A5FA" strokeWidth="2.2" />
          <path d="M76 28v46M56 38h40M64 74h24" stroke="#1D4ED8" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M56 38l-8 16h16l-8-16zM96 38l-8 16h16l-8-16z" fill="#93C5FD" stroke="#1D4ED8" strokeWidth="1.8" strokeLinejoin="round" />
          {/* ป้ายมาตรฐาน PDPA & ISO */}
          <rect x="130" y="22" width="124" height="26" rx="8" fill="#2563EB" />
          <text x="192" y="39" textAnchor="middle" fill="#FFFFFF" fontSize="11.5" fontWeight="800" fontFamily="Prompt, sans-serif">✓ กฎหมาย PDPA</text>
          <rect x="130" y="56" width="124" height="26" rx="8" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="1.8" />
          <text x="192" y="73" textAnchor="middle" fill="#1E40AF" fontSize="11.5" fontWeight="700" fontFamily="Prompt, sans-serif">✓ มาตรฐานสากล</text>
        </svg>
      );

    case 'thai-ethic-3':
      return (
        <svg viewBox="0 0 280 104" className="u1ks-illust-svg" aria-hidden="true">
          <defs>
            <linearGradient id="te3Bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="100%" stopColor="#FEF3C7" />
            </linearGradient>
          </defs>
          <rect width="280" height="104" rx="12" fill="url(#te3Bg)" />
          {/* หน้าต่างแชตแจ้งโปร่งใส */}
          <rect x="24" y="18" width="150" height="68" rx="12" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2" />
          <rect x="36" y="28" width="96" height="18" rx="9" fill="#FEF3C7" />
          <text x="84" y="41" textAnchor="middle" fill="#92400E" fontSize="10.5" fontWeight="800" fontFamily="Prompt, sans-serif">กำลังสนทนากับ AI</text>
          <rect x="36" y="54" width="124" height="8" rx="4" fill="#FDE68A" />
          <rect x="36" y="68" width="94" height="8" rx="4" fill="#FCD34D" />
          {/* แว่นขยายตรวจสอบได้ */}
          <circle cx="218" cy="48" r="24" fill="#D97706" />
          <circle cx="215" cy="45" r="10" fill="none" stroke="#FFFFFF" strokeWidth="2.8" />
          <line x1="223" y1="53" x2="231" y2="61" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          <text x="218" y="88" textAnchor="middle" fill="#92400E" fontSize="10.5" fontWeight="800" fontFamily="Prompt, sans-serif">ตรวจสอบเหตุผลได้</text>
        </svg>
      );

    case 'thai-ethic-4':
      return (
        <svg viewBox="0 0 280 104" className="u1ks-illust-svg" aria-hidden="true">
          <defs>
            <linearGradient id="te4Bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#EEF2FF" />
              <stop offset="100%" stopColor="#E0E7FF" />
            </linearGradient>
          </defs>
          <rect width="280" height="104" rx="12" fill="url(#te4Bg)" />
          {/* โล่และแม่กุญแจเข้ารหัส */}
          <path d="M78 18l34 12v22c0 21-14 34-34 40-20-6-34-19-34-40V30l34-12z" fill="#4F46E5" />
          <rect x="66" y="48" width="24" height="19" rx="4" fill="#FFFFFF" />
          <path d="M71 48v-6a7 7 0 0 1 14 0v6" fill="none" stroke="#FFFFFF" strokeWidth="2.8" />
          {/* แถบเข้ารหัส */}
          <rect x="132" y="24" width="122" height="24" rx="8" fill="#FFFFFF" stroke="#818CF8" strokeWidth="1.8" />
          <text x="193" y="40" textAnchor="middle" fill="#3730A3" fontSize="11" fontWeight="800" fontFamily="Prompt, sans-serif">🔒 เข้ารหัสข้อมูล</text>
          <rect x="132" y="56" width="122" height="24" rx="8" fill="#FFFFFF" stroke="#A5B4FC" strokeWidth="1.8" />
          <text x="193" y="72" textAnchor="middle" fill="#4338CA" fontSize="11" fontWeight="700" fontFamily="Prompt, sans-serif">จำกัดสิทธิ์เข้าถึง</text>
        </svg>
      );

    case 'thai-ethic-5':
      return (
        <svg viewBox="0 0 280 104" className="u1ks-illust-svg" aria-hidden="true">
          <defs>
            <linearGradient id="te5Bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F5F3FF" />
              <stop offset="100%" stopColor="#EDE9FE" />
            </linearGradient>
          </defs>
          <rect width="280" height="104" rx="12" fill="url(#te5Bg)" />
          {/* ผู้คนหลากหลายกลุ่มยืนบนฐานเท่าเทียมกัน */}
          <circle cx="82" cy="36" r="11" fill="#7C3AED" />
          <path d="M66 64c3-11 29-11 32 0" fill="#8B5CF6" />
          <circle cx="140" cy="36" r="11" fill="#0D9488" />
          <path d="M124 64c3-11 29-11 32 0" fill="#14B8A6" />
          <circle cx="198" cy="36" r="11" fill="#2563EB" />
          <path d="M182 64c3-11 29-11 32 0" fill="#3B82F6" />
          <rect x="46" y="68" width="188" height="22" rx="11" fill="#6D28D9" />
          <text x="140" y="83" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="800" fontFamily="Prompt, sans-serif">เข้าถึงเท่าเทียม · ไม่เลือกปฏิบัติ</text>
        </svg>
      );

    case 'thai-ethic-6':
      return (
        <svg viewBox="0 0 280 104" className="u1ks-illust-svg" aria-hidden="true">
          <defs>
            <linearGradient id="te6Bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F0FDFA" />
              <stop offset="100%" stopColor="#CCFBF1" />
            </linearGradient>
          </defs>
          <rect width="280" height="104" rx="12" fill="url(#te6Bg)" />
          {/* มาตรวัดความแม่นยำและการตรวจติดตาม */}
          <circle cx="76" cy="52" r="30" fill="#0D9488" />
          <path d="M63 52l9 9 18-18" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="124" y="22" width="132" height="28" rx="9" fill="#FFFFFF" stroke="#2DD4BF" strokeWidth="1.8" />
          <text x="190" y="40" textAnchor="middle" fill="#115E59" fontSize="11.5" fontWeight="800" fontFamily="Prompt, sans-serif">ผ่านการทดสอบแม่นยำ</text>
          <rect x="124" y="56" width="132" height="28" rx="9" fill="#FFFFFF" stroke="#5EEAD4" strokeWidth="1.8" />
          <path d="M138 70h16l6-8 8 16 6-8h18" fill="none" stroke="#0D9488" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <text x="224" y="74" textAnchor="middle" fill="#0F766E" fontSize="10.5" fontWeight="700" fontFamily="Prompt, sans-serif">ตรวจซ้ำ</text>
        </svg>
      );

    /* --- 3 ขั้นตอนการทำงานของระบบ AI (Input -> Model -> Output) แบบมีคำอธิบายในภาพชัดเจน --- */
    case 'ks-flow-input':
      return (
        <svg viewBox="0 0 280 112" className="u1ks-illust-svg" aria-hidden="true">
          <rect width="280" height="112" rx="12" fill="#EFF6FF" />
          {/* ชิปประเภทข้อมูลนำเข้า */}
          <rect x="16" y="16" width="114" height="24" rx="8" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1.6" />
          <circle cx="30" cy="28" r="5" fill="#2563EB" />
          <text x="41" y="32" fill="#1E3A8A" fontSize="12" fontWeight="700" fontFamily="Prompt, sans-serif">รูปภาพ / กล้อง</text>

          <rect x="16" y="44" width="114" height="24" rx="8" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1.6" />
          <circle cx="30" cy="56" r="5" fill="#0284C7" />
          <text x="41" y="60" fill="#1E3A8A" fontSize="12" fontWeight="700" fontFamily="Prompt, sans-serif">เสียงพูด / เพลง</text>

          <rect x="16" y="72" width="114" height="24" rx="8" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1.6" />
          <circle cx="30" cy="84" r="5" fill="#4F46E5" />
          <text x="41" y="88" fill="#1E3A8A" fontSize="12" fontWeight="700" fontFamily="Prompt, sans-serif">ข้อความ / คำสั่ง</text>

          {/* ลูกศรส่งเข้าเซ็นเซอร์รับข้อมูล */}
          <path d="M138 56h28M159 49l8 7-8 7" fill="none" stroke="#2563EB" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />

          {/* กรอบรับข้อมูลใบหน้า/เซ็นเซอร์ */}
          <rect x="176" y="18" width="88" height="76" rx="12" fill="#1D4ED8" />
          <circle cx="220" cy="46" r="12" fill="#DBEAFE" />
          <path d="M204 72c3-9 29-9 32 0" fill="#DBEAFE" />
          <text x="220" y="87" textAnchor="middle" fill="#EFF6FF" fontSize="10.5" fontWeight="700" fontFamily="Prompt, sans-serif">ข้อมูลดิบ (Input)</text>
        </svg>
      );

    case 'ks-flow-model':
      return (
        <svg viewBox="0 0 280 112" className="u1ks-illust-svg" aria-hidden="true">
          <rect width="280" height="112" rx="12" fill="#EEF2FF" />
          {/* เส้นเชื่อมโครงข่ายประสาทเทียม */}
          <line x1="54" y1="28" x2="138" y2="38" stroke="#818CF8" strokeWidth="2" />
          <line x1="54" y1="56" x2="138" y2="38" stroke="#818CF8" strokeWidth="2" />
          <line x1="54" y1="56" x2="138" y2="74" stroke="#818CF8" strokeWidth="2" />
          <line x1="54" y1="84" x2="138" y2="74" stroke="#818CF8" strokeWidth="2" />
          <line x1="138" y1="38" x2="222" y2="56" stroke="#6366F1" strokeWidth="2.4" />
          <line x1="138" y1="74" x2="222" y2="56" stroke="#6366F1" strokeWidth="2.4" />

          {/* โหนดชั้นรับข้อมูล */}
          <circle cx="54" cy="28" r="8" fill="#6366F1" />
          <circle cx="54" cy="56" r="8" fill="#6366F1" />
          <circle cx="54" cy="84" r="8" fill="#6366F1" />

          {/* โหนดชั้นวิเคราะห์รูปแบบ */}
          <circle cx="138" cy="38" r="12" fill="#4F46E5" />
          <circle cx="138" cy="74" r="12" fill="#4F46E5" />

          {/* โหนดสรุปการอนุมาน */}
          <circle cx="222" cy="56" r="22" fill="#3730A3" stroke="#A5B4FC" strokeWidth="3" />
          <text x="222" y="53" textAnchor="middle" fill="#FFFFFF" fontSize="10.5" fontWeight="800" fontFamily="Prompt, sans-serif">AI</text>
          <text x="222" y="66" textAnchor="middle" fill="#E0E7FF" fontSize="9.5" fontWeight="700" fontFamily="Prompt, sans-serif">อนุมาน</text>

          <rect x="74" y="88" width="132" height="19" rx="9.5" fill="#FFFFFF" stroke="#A5B4FC" strokeWidth="1.2" />
          <text x="140" y="101" textAnchor="middle" fill="#312E81" fontSize="10.5" fontWeight="700" fontFamily="Prompt, sans-serif">เทียบกับรูปแบบที่ฝึกมา</text>
        </svg>
      );

    case 'output-light':
      return (
        <svg viewBox="0 0 280 112" className="u1ks-illust-svg" aria-hidden="true">
          <rect width="280" height="112" rx="12" fill="#ECFDF5" />
          <circle cx="54" cy="56" r="26" fill="#10B981" />
          <path d="M42 56l8 8 16-16" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

          <rect x="96" y="18" width="168" height="34" rx="10" fill="#FFFFFF" stroke="#34D399" strokeWidth="1.8" />
          <circle cx="114" cy="35" r="6" fill="#10B981" />
          <text x="128" y="39" fill="#065F46" fontSize="12" fontWeight="800" fontFamily="Prompt, sans-serif">ตัดสินใจ / ปลดล็อกจอ</text>

          <rect x="96" y="60" width="168" height="34" rx="10" fill="#FFFFFF" stroke="#6EE7B7" strokeWidth="1.6" />
          <circle cx="114" cy="77" r="6" fill="#F59E0B" />
          <text x="128" y="81" fill="#0F766E" fontSize="12" fontWeight="700" fontFamily="Prompt, sans-serif">ทำนาย / สร้างคำตอบใหม่</text>
        </svg>
      );

    /* --- 4 คำศัพท์พื้นฐาน --- */
    case 'vocab-algo':
      return (
        <svg viewBox="0 0 220 76" className="u1ks-illust-svg" aria-hidden="true">
          <rect width="220" height="76" rx="12" fill="#EFF6FF" />
          <rect x="18" y="22" width="44" height="32" rx="8" fill="#2563EB" />
          <text x="40" y="42" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="800">ขั้น 1</text>
          <path d="M68 38h16" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
          <rect x="88" y="22" width="44" height="32" rx="8" fill="#3B82F6" />
          <text x="110" y="42" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="800">ขั้น 2</text>
          <path d="M138 38h16" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
          <rect x="158" y="22" width="44" height="32" rx="8" fill="#0284C7" />
          <text x="180" y="42" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="800">ขั้น 3</text>
        </svg>
      );

    case 'vocab-data':
      return (
        <svg viewBox="0 0 220 76" className="u1ks-illust-svg" aria-hidden="true">
          <rect width="220" height="76" rx="12" fill="#F0FDFA" />
          <rect x="24" y="16" width="48" height="44" rx="8" fill="#FFFFFF" stroke="#5EEAD4" strokeWidth="2" />
          <circle cx="48" cy="33" r="7" fill="#14B8A6" />
          <rect x="34" y="46" width="28" height="5" rx="2.5" fill="#0D9488" />
          <rect x="86" y="16" width="48" height="44" rx="8" fill="#FFFFFF" stroke="#5EEAD4" strokeWidth="2" />
          <rect x="96" y="27" width="28" height="5" rx="2.5" fill="#0F766E" />
          <rect x="96" y="37" width="22" height="5" rx="2.5" fill="#14B8A6" />
          <rect x="96" y="47" width="26" height="5" rx="2.5" fill="#5EEAD4" />
          <rect x="148" y="16" width="48" height="44" rx="8" fill="#0D9488" />
          <text x="172" y="38" textAnchor="middle" fill="#FFFFFF" fontSize="11.5" fontWeight="800">DATA</text>
          <text x="172" y="51" textAnchor="middle" fill="#CCFBF1" fontSize="10" fontWeight="700">10,000+</text>
        </svg>
      );

    case 'vocab-model':
      return (
        <svg viewBox="0 0 220 76" className="u1ks-illust-svg" aria-hidden="true">
          <rect width="220" height="76" rx="12" fill="#EEF2FF" />
          <line x1="56" y1="22" x2="110" y2="38" stroke="#818CF8" strokeWidth="2" />
          <line x1="56" y1="54" x2="110" y2="38" stroke="#818CF8" strokeWidth="2" />
          <line x1="110" y1="38" x2="164" y2="22" stroke="#818CF8" strokeWidth="2" />
          <line x1="110" y1="38" x2="164" y2="54" stroke="#818CF8" strokeWidth="2" />
          <circle cx="56" cy="22" r="7" fill="#6366F1" />
          <circle cx="56" cy="54" r="7" fill="#6366F1" />
          <circle cx="110" cy="38" r="18" fill="#4F46E5" />
          <text x="110" y="42" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="800">AI</text>
          <circle cx="164" cy="22" r="7" fill="#14B8A6" />
          <circle cx="164" cy="54" r="7" fill="#14B8A6" />
        </svg>
      );

    case 'vocab-prompt':
      return (
        <svg viewBox="0 0 220 76" className="u1ks-illust-svg" aria-hidden="true">
          <rect width="220" height="76" rx="12" fill="#FFFBEB" />
          <rect x="20" y="20" width="180" height="36" rx="18" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2" />
          <circle cx="40" cy="38" r="9" fill="#FEF3C7" />
          <polygon points="40,31 42,36 47,38 42,40 40,45 38,40 33,38 38,36" fill="#D97706" />
          <text x="54" y="42" fill="#92400E" fontSize="11.5" fontWeight="700" fontFamily="Prompt, sans-serif">สรุปเรื่อง AI ให้หน่อย</text>
          <circle cx="180" cy="38" r="12" fill="#D97706" />
          <path d="M176 38h8M181 34l4 4-4 4" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    /* --- 4 วิธีจับผิด Deepfake --- */
    case 'df-check-eye':
      return (
        <svg viewBox="0 0 220 78" className="u1ks-illust-svg" aria-hidden="true">
          <rect width="220" height="78" rx="12" fill="#FFF1F2" />
          <circle cx="88" cy="39" r="24" fill="#FFE4E6" stroke="#FB7185" strokeWidth="2" strokeDasharray="4 3" />
          <circle cx="80" cy="34" r="3.5" fill="#BE123C" />
          <circle cx="96" cy="34" r="3.5" fill="#BE123C" />
          <path d="M79 47h18" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="132" cy="40" r="16" fill="rgba(255,255,255,0.85)" stroke="#E11D48" strokeWidth="3" />
          <line x1="144" y1="51" x2="158" y2="64" stroke="#BE123C" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'df-check-ear':
      return (
        <svg viewBox="0 0 220 78" className="u1ks-illust-svg" aria-hidden="true">
          <rect width="220" height="78" rx="12" fill="#FFFBEB" />
          {[14, 30, 18, 40, 12, 36, 20, 32, 14].map((h, idx) => (
            <rect
              key={idx}
              x={34 + idx * 17}
              y={39 - h / 2}
              width="9"
              height={h}
              rx="4.5"
              fill={idx % 2 === 0 ? '#F59E0B' : '#EA580C'}
            />
          ))}
        </svg>
      );

    case 'df-check-source':
      return (
        <svg viewBox="0 0 220 78" className="u1ks-illust-svg" aria-hidden="true">
          <rect width="220" height="78" rx="12" fill="#EFF6FF" />
          <rect x="34" y="16" width="152" height="46" rx="10" fill="#FFFFFF" stroke="#60A5FA" strokeWidth="2" />
          <circle cx="60" cy="39" r="12" fill="#DBEAFE" />
          <path d="M55 39l4 4 8-8" fill="none" stroke="#1D4ED8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="82" y="30" width="84" height="7" rx="3.5" fill="#2563EB" />
          <rect x="82" y="43" width="60" height="6" rx="3" fill="#93C5FD" />
        </svg>
      );

    case 'df-check-call':
      return (
        <svg viewBox="0 0 220 78" className="u1ks-illust-svg" aria-hidden="true">
          <rect width="220" height="78" rx="12" fill="#FFE4E6" />
          <circle cx="62" cy="39" r="20" fill="#EF4444" />
          <path d="M55 32l14 14M69 32L55 46" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          <path d="M94 39h28M114 31l8 8-8 8" fill="none" stroke="#BE123C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="156" cy="39" r="20" fill="#10B981" />
          <path d="M148 39l6 6 11-11" fill="none" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    default:
      return <SlideSceneArt kind={kind} />;
  }
}

export function QuickQuizBox({ quizKey }) {
  const questions = MINI_QUIZZES[quizKey] || [];
  const [answers, setAnswers] = useState({});

  if (!questions.length) return null;

  return (
    <div className="u1ks-quiz-card no-print">
      <div className="u1ks-quiz-head-row">
        <div className="u1ks-quiz-head">
          <span className="u1ks-quiz-badge">
            <Icon name="puzzle" size={16} /> ทดสอบความเข้าใจประจำบท
          </span>
          <h4>ลองตอบเช็กความเข้าใจก่อนไปบทถัดไป</h4>
        </div>
        <div className="u1ks-quiz-mascot" aria-hidden="true">
          <AIraBot mood="cheer" size={64} float={false} title="" />
        </div>
      </div>
      <div className="u1ks-quiz-list">
        {questions.map((item) => {
          const picked = answers[item.id];
          const chosenOpt = item.options.find(o => o.id === picked);
          const isRight = !!chosenOpt?.correct;
          return (
            <div key={item.id} className="u1ks-quiz-item">
              <p className="u1ks-quiz-q">{item.q}</p>
              <div className="u1ks-quiz-opts">
                {item.options.map((opt) => {
                  const active = picked === opt.id;
                  let stateCls = '';
                  if (active) stateCls = opt.correct ? 'is-right' : 'is-wrong';
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className={`u1ks-quiz-opt ${stateCls}`}
                      onClick={() => setAnswers(prev => ({ ...prev, [item.id]: opt.id }))}
                    >
                      <span className="u1ks-opt-letter">{opt.id.toUpperCase()}</span>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
              {picked && (
                <div className={`u1ks-quiz-fb ${isRight ? 'ok' : 'retry'}`}>
                  <Icon name={isRight ? 'check' : 'info'} size={18} />
                  <div>
                    {isRight ? (
                      <span>{item.explain}</span>
                    ) : (
                      <span>ยังไม่ใช่นะ ลองพิจารณาตัวเลือกอื่นอีกครั้ง! (คำใบ้: อ่านทบทวนหัวข้อด้านบนประกอบ)</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MatryoshkaDiagram() {
  const layers = [
    {
      cls: 'l-ai',
      tone: 'blue',
      icon: 'cpu',
      badge: 'ชั้นที่ 1 · วงนอกสุด',
      title: 'Artificial Intelligence (AI)',
      img: KS_IMAGES.techAi,
      desc: (
        <>
          ทุกเทคนิคที่ทำให้คอมพิวเตอร์ทำงานได้อย่างชาญฉลาด รวมถึงโปรแกรมยุคแรกที่มนุษย์เขียนกฎ <code>ถ้า...แล้ว...</code> ให้ทีละข้อ เช่น <b>บอตหมากรุก</b>
        </>
      )
    },
    {
      cls: 'l-ml',
      tone: 'sky',
      icon: 'chart',
      badge: 'ชั้นที่ 2 · การเรียนรู้ของเครื่อง',
      title: 'Machine Learning (ML)',
      img: KS_IMAGES.techMl,
      desc: (
        <>
          เปลี่ยนจากการเขียนกฎเองทั้งหมด เป็นการป้อนตัวอย่างจำนวนมากให้คอมพิวเตอร์<b>หารูปแบบเอง</b> เช่น <b>ตัวกรองอีเมลขยะ</b>
        </>
      )
    },
    {
      cls: 'l-dl',
      tone: 'teal',
      icon: 'layers',
      badge: 'ชั้นที่ 3 · การเรียนรู้เชิงลึก',
      title: 'Deep Learning (DL)',
      img: KS_IMAGES.techDl,
      desc: (
        <>
          ใช้<b>โครงข่ายประสาทเทียมหลายชั้น (Neural Network)</b> เลียนแบบการส่งสัญญาณสมอง เก่งกับข้อมูลซับซ้อนอย่างภาพ เสียง และข้อความ เช่น <b>สแกนใบหน้า</b>
        </>
      )
    },
    {
      cls: 'l-gen',
      tone: 'amber',
      icon: 'sparkle',
      badge: 'ชั้นที่ 4 · วงในสุด',
      title: 'Generative AI (GenAI)',
      img: KS_IMAGES.techGenai,
      desc: (
        <>
          AI ที่ต่อยอดจาก Deep Learning จนสามารถ<b>สร้างสรรค์สิ่งใหม่</b>ได้ ทั้งบทความ รูปภาพ เพลง วิดีโอ และโค้ด เช่น <b>ChatGPT, Claude, Gemini</b>
        </>
      )
    }
  ];

  return (
    <div className="u1ks-diagram-card">
      <div className="u1ks-matryoshka-grid">
        <div className="u1ks-circles-svg-wrap">
          <svg viewBox="0 0 420 380" className="u1ks-circles-svg" role="img" aria-label="แผนภาพวงกลมซ้อน AI, Machine Learning, Deep Learning และ Generative AI">
            <defs>
              <radialGradient id="ksAiFill" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#EFF6FF" />
                <stop offset="100%" stopColor="#DBEAFE" />
              </radialGradient>
            </defs>
            {/* Outer: AI */}
            <circle cx="210" cy="190" r="172" fill="url(#ksAiFill)" stroke="#2563EB" strokeWidth="3" />
            <text x="210" y="48" textAnchor="middle" fill="#1E40AF" fontSize="19" fontWeight="800" fontFamily="Prompt, sans-serif">
              AI · ปัญญาประดิษฐ์
            </text>
            <text x="210" y="69" textAnchor="middle" fill="#3B82F6" fontSize="12.5" fontWeight="600" fontFamily="Sarabun, sans-serif">
              เช่น บอตหมากรุกแบบเขียนกฎตายตัว
            </text>

            {/* 2nd: ML */}
            <circle cx="210" cy="214" r="132" fill="#E0F2FE" stroke="#0284C7" strokeWidth="3" />
            <text x="210" y="114" textAnchor="middle" fill="#075985" fontSize="17.5" fontWeight="800" fontFamily="Prompt, sans-serif">
              Machine Learning (ML)
            </text>
            <text x="210" y="134" textAnchor="middle" fill="#0369A1" fontSize="12.5" fontWeight="600" fontFamily="Sarabun, sans-serif">
              เช่น ตัวกรองอีเมลขยะ
            </text>

            {/* 3rd: DL */}
            <circle cx="210" cy="240" r="92" fill="#CCFBF1" stroke="#0D9488" strokeWidth="3" />
            <text x="210" y="180" textAnchor="middle" fill="#115E59" fontSize="16.5" fontWeight="800" fontFamily="Prompt, sans-serif">
              Deep Learning (DL)
            </text>
            <text x="210" y="199" textAnchor="middle" fill="#0F766E" fontSize="12" fontWeight="600" fontFamily="Sarabun, sans-serif">
              เช่น ระบบสแกนใบหน้า
            </text>

            {/* Inner: GenAI */}
            <circle cx="210" cy="268" r="52" fill="#FEF3C7" stroke="#D97706" strokeWidth="3" />
            <text x="210" y="264" textAnchor="middle" fill="#92400E" fontSize="15.5" fontWeight="800" fontFamily="Prompt, sans-serif">
              Generative AI
            </text>
            <text x="210" y="283" textAnchor="middle" fill="#B45309" fontSize="11.5" fontWeight="700" fontFamily="Sarabun, sans-serif">
              ChatGPT · Gemini
            </text>
          </svg>
        </div>

        <div className="u1ks-layer-cards">
          {layers.map((l) => (
            <div key={l.cls} className={`u1ks-layer-item ${l.cls} with-thumb`}>
              <img src={l.img} alt={l.title} className="u1ks-layer-thumb" loading="lazy" />
              <div className="u1ks-layer-content">
                <div className="u1ks-layer-head">
                  <span className={`u1ks-ic-circle sm ${l.tone}`}><Icon name={l.icon} size={16} /></span>
                  <div className="u1ks-layer-badge">{l.badge}</div>
                </div>
                <h5>{l.title}</h5>
                <p>{l.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="u1ks-tip-strip blue">
        <Icon name="bulb" size={20} />
        <div>
          <b>จำง่าย ๆ เหมือนห้องเรียน:</b> นักเรียน ม.5 ทุกคนเป็นนักเรียนของโรงเรียน แต่นักเรียนทุกคนในโรงเรียนไม่จำเป็นต้องอยู่ ม.5 — เช่นเดียวกัน <b>Generative AI ทุกตัวเป็น DL, ML และ AI ด้วยเสมอ แต่ AI ไม่จำเป็นต้องเป็น ML เสมอไป!</b>
        </div>
      </div>
    </div>
  );
}

export function RiskPyramidDiagram() {
  const tiers = [
    {
      level: 'ระดับบนสุด · ห้ามใช้เด็ดขาด',
      name: 'ความเสี่ยงที่ยอมรับไม่ได้ (Unacceptable Risk)',
      tone: 'red',
      icon: 'x',
      why: 'ละเมิดสิทธิมนุษยชนขั้นพื้นฐาน หรือแอบบงการพฤติกรรมมนุษย์',
      examples: 'ระบบให้คะแนนความประพฤติประชาชน (Social Scoring), AI หลอกล่อจิตใต้สำนึก, ระบบจับอารมณ์นักเรียนในห้องเรียนหรือพนักงานในที่ทำงาน'
    },
    {
      level: 'ระดับที่ 2 · คุมเข้มก่อนและระหว่างใช้',
      name: 'ความเสี่ยงสูง (High Risk)',
      tone: 'orange',
      icon: 'alert',
      why: 'ใช้ตัดสินเรื่องสำคัญที่มีผลต่อชีวิต การเรียน สุขภาพ หรืออาชีพ ต้องผ่านการทดสอบ อธิบายเหตุผลได้ และมีมนุษย์ตรวจซ้ำ',
      examples: 'AI คัดใบสมัครงาน, ประเมินคะแนนขอกู้เงิน, ตรวจข้อสอบ/คัดนักเรียนเข้าเรียน, อุปกรณ์การแพทย์, ระบบโครงสร้างพื้นฐาน'
    },
    {
      level: 'ระดับที่ 3 · ต้องโปร่งใส บอกให้ผู้ใช้รู้',
      name: 'ความเสี่ยงจำกัด (Limited Risk)',
      tone: 'amber',
      icon: 'eye',
      why: 'คนทั่วไปอาจเข้าใจผิดว่ากำลังคุยกับมนุษย์จริงหรือดูภาพจริง จึงต้องแจ้งหรือติดป้ายกำกับให้ชัดเจน',
      examples: 'แชตบอตตอบคำถามลูกค้า, ข้อความ ภาพ เสียง หรือคลิป Deepfake ที่สร้างหรือดัดแปลงด้วย AI'
    },
    {
      level: 'ระดับฐานล่าง · ใช้ได้ตามปกติ',
      name: 'ความเสี่ยงต่ำ (Minimal Risk)',
      tone: 'green',
      icon: 'check',
      why: 'หากทำงานผิดพลาดก็กระทบต่อสิทธิหรือความปลอดภัยน้อยมาก ไม่มีข้อบังคับทางกฎหมายเพิ่มเติม',
      examples: 'ตัวกรองอีเมลขยะ (Spam Filter), AI ควบคุมตัวละครในวิดีโอเกม, ระบบเดาคำหรือแก้คำผิดอัตโนมัติบนคีย์บอร์ด'
    }
  ];

  return (
    <div className="u1ks-risk-stack">
      <div className="u1ks-pyramid-visual">
        <svg viewBox="0 0 360 270" className="u1ks-pyramid-svg" role="img" aria-label="พีระมิดระดับความเสี่ยงของ AI 4 ระดับ">
          {/* Arrow indicator */}
          <line x1="26" y1="242" x2="26" y2="28" stroke="#64748B" strokeWidth="2.5" strokeDasharray="4 4" />
          <polygon points="26,18 20,32 32,32" fill="#DC2626" />
          <text x="26" y="260" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="700" fontFamily="Prompt, sans-serif">คุมเข้มขึ้น</text>

          {/* Tier 1 Top */}
          <polygon points="195,18 145,74 245,74" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2.5" />
          <text x="195" y="54" textAnchor="middle" fill="#991B1B" fontSize="12.5" fontWeight="800" fontFamily="Prompt, sans-serif">ห้ามใช้</text>
          <text x="195" y="68" textAnchor="middle" fill="#B91C1C" fontSize="10" fontWeight="700">Unacceptable</text>

          {/* Tier 2 */}
          <polygon points="141,80 104,134 286,134 249,80" fill="#FFEDD5" stroke="#EA580C" strokeWidth="2.5" />
          <text x="195" y="106" textAnchor="middle" fill="#9A3412" fontSize="13.5" fontWeight="800" fontFamily="Prompt, sans-serif">ความเสี่ยงสูง (High Risk)</text>
          <text x="195" y="123" textAnchor="middle" fill="#C2410C" fontSize="11" fontWeight="600">ต้องทดสอบ · มีคนดูแล · อธิบายผลได้</text>

          {/* Tier 3 */}
          <polygon points="100,140 66,194 324,194 290,140" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.5" />
          <text x="195" y="166" textAnchor="middle" fill="#92400E" fontSize="13.5" fontWeight="800" fontFamily="Prompt, sans-serif">ความเสี่ยงจำกัด (Limited Risk)</text>
          <text x="195" y="183" textAnchor="middle" fill="#B45309" fontSize="11" fontWeight="600">ต้องแจ้งว่าเป็น AI · ติดป้ายกำกับ</text>

          {/* Tier 4 Base */}
          <polygon points="62,200 38,250 352,250 328,200" fill="#DCFCE7" stroke="#16A34A" strokeWidth="2.5" />
          <text x="195" y="224" textAnchor="middle" fill="#166534" fontSize="13.5" fontWeight="800" fontFamily="Prompt, sans-serif">ความเสี่ยงต่ำ (Minimal Risk)</text>
          <text x="195" y="241" textAnchor="middle" fill="#15803D" fontSize="11" fontWeight="600">ใช้งานได้ตามปกติ</text>
        </svg>
      </div>

      <div className="u1ks-risk-cards">
        {tiers.map(t => (
          <div key={t.name} className={`u1ks-risk-row tone-${t.tone}`}>
            <div className="u1ks-risk-head">
              <span className={`u1ks-risk-pill tone-${t.tone}`}>
                <Icon name={t.icon} size={13} />
                <span>{t.level}</span>
              </span>
              <h5>{t.name}</h5>
            </div>
            <p><b>ทำไมต้องคุมระดับนี้:</b> {t.why}</p>
            <p className="u1ks-risk-ex"><b>ตัวอย่างระบบ:</b> {t.examples}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
