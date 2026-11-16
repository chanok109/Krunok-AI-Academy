import React from 'react';
import { Icon, AIraBot } from '../../UIPrimitives.jsx';
import { U1_REFS, U1_CHECKED } from '../../../data/unit1Data.js';
import { SELF_CHECK_GOALS } from './knowledgeData.js';
import { KS_IMAGES } from './knowledgeImages.js';

/* =====================================================================
   ใบความรู้หน่วยที่ 1 · ตอนที่ 4: สรุปท้ายหน่วย ตรวจสอบตนเอง และแหล่งอ้างอิง
   ===================================================================== */

export default function Topic4SummaryAndRefs({
  selfChecks = {},
  selfCheckedCount = 0,
  toggleSelfCheck,
  onBack
}) {
  const pct = Math.round((selfCheckedCount / SELF_CHECK_GOALS.length) * 100);

  return (
    <article className="u1ks-sheet theme-indigo" id="ks-summary">
      <header className="u1ks-hero indigo">
        <div className="u1ks-hero-text">
          <div className="u1ks-hero-badges">
            <span className="u1ks-pill-solid indigo">สรุปท้ายหน่วยการเรียนรู้ที่ 1</span>
            <span className="u1ks-pill-soft">ข้อมูลกฎหมายตรวจสอบเมื่อ {U1_CHECKED}</span>
          </div>
          <h1>6 เรื่องที่ต้องจำ & ตรวจสอบตนเอง</h1>
          <p className="u1ks-hero-sub">
            ทบทวนแก่นสำคัญทั้ง 3 ตอนของหน่วยที่ 1 ประเมินความเข้าใจของตนเองตามเป้าหมายการเรียนรู้ และศึกษาเอกสารอ้างอิงทางการเพิ่มเติม
          </p>
          <div className="u1ks-summary-art-trio">
            <div className="u1ks-trio-item">
              <img src={KS_IMAGES.techAi} alt="AI คืออะไร" />
              <span>1. พื้นฐาน AI</span>
            </div>
            <div className="u1ks-trio-item">
              <img src={KS_IMAGES.aiEthics} alt="จริยธรรม AI" />
              <span>2. จริยธรรม & ความเสี่ยง</span>
            </div>
            <div className="u1ks-trio-item">
              <img src={KS_IMAGES.aiLaw} alt="PDPA & Deepfake" />
              <span>3. กฎหมาย & Deepfake</span>
            </div>
          </div>
        </div>
        <div className="u1ks-hero-art">
          <div className="u1ks-hero-aira">
            <AIraBot mood="cheer" title="AIra สรุปหน่วยที่ 1" />
            <span className="u1ks-hero-caption">ทบทวนก่อนทำแบบทดสอบ!</span>
          </div>
        </div>
      </header>

      <section className="u1ks-section">
        <div className="u1ks-sec-head">
          <span className="u1ks-sec-num indigo"><Icon name="sparkle" size={22} /></span>
          <div>
            <h2>สรุปหน่วยที่ 1: 6 เรื่องสำคัญที่ต้องจำให้แม่น</h2>
            <p>ภาพรวมสาระสำคัญตั้งแต่พื้นฐานการทำงานของ AI จนถึงจริยธรรมและกฎหมายคุ้มครองสิทธิ</p>
          </div>
        </div>

        <div className="u1ks-cards-3">
          {[
            { tag: 'ตอนที่ 1 · ข้อ 1', title: 'AI รับข้อมูลแล้วอนุมานผลลัพธ์เอง', desc: 'ทำงานผ่าน Input → Model → Output โดยอาศัยรูปแบบที่เรียนรู้จากข้อมูลฝึก ไม่ได้คิดหรือรู้สึกเหมือนมนุษย์', tone: 'blue', icon: 'bulb' },
            { tag: 'ตอนที่ 1 · ข้อ 2', title: 'AI ⊃ ML ⊃ DL ⊃ GenAI ซ้อนกันเป็นชั้น', desc: 'Generative AI ทุกตัวเป็น Deep Learning, Machine Learning และ AI เสมอ แต่ AI ไม่จำเป็นต้องเป็น ML ทุกตัว', tone: 'teal', icon: 'layers' },
            { tag: 'ตอนที่ 1 · ข้อ 3', title: 'AI ปัจจุบันล้วนเป็น ANI และหลอนได้', desc: 'เก่งเฉพาะงานที่ฝึกมา (Narrow AI) และอาจเกิด Hallucination หรือลำเอียงตามข้อมูล จึงต้องตรวจสอบทุกครั้ง', tone: 'indigo', icon: 'bot' },
            { tag: 'ตอนที่ 2 · ข้อ 4', title: 'ยิ่งกระทบชีวิตคนมาก ยิ่งต้องคุมเข้ม', desc: 'หัวใจของกฎหมาย AI สากล (EU AI Act) แบ่งความเสี่ยง 4 ระดับ ตั้งแต่อนุญาตทั่วไปจนถึงห้ามใช้เด็ดขาด', tone: 'amber', icon: 'scale' },
            { tag: 'ตอนที่ 2 · ข้อ 5', title: 'ร่าง พ.ร.บ. AI ของไทย ยังไม่บังคับใช้', desc: 'อยู่ในขั้นตอนร่างกฎหมาย แบ่งการกำกับตามความเสี่ยง และกำหนดหน้าที่ทั้งผู้สร้าง (Provider) และผู้นำไปใช้ (Deployer)', tone: 'violet', icon: 'book' },
            { tag: 'ตอนที่ 3 · ข้อ 6', title: 'PDPA และ พ.ร.บ.คอมพิวเตอร์ ใช้บังคับแล้ว!', desc: 'คุ้มครองข้อมูลส่วนบุคคลและเอาผิดคนทำ/แชร์ Deepfake ทำร้ายผู้อื่นได้ทันที คดียอมความได้ต้องร้องทุกข์ใน 3 เดือน', tone: 'rose', icon: 'shield' }
          ].map(card => (
            <div key={card.tag} className={`u1ks-takeaway6-card tone-${card.tone}`}>
              <div className="u1ks-t6-top">
                <span className={`u1ks-ic-circle ${card.tone}`}><Icon name={card.icon} size={20} /></span>
                <span>{card.tag}</span>
              </div>
              <h4>{card.title}</h4>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ขยายความรู้: การประยุกต์ใช้ AI ในโลกยุคใหม่ */}
      <section className="u1ks-section">
        <div className="u1ks-sec-head">
          <span className="u1ks-sec-num indigo"><Icon name="globe" size={22} /></span>
          <div>
            <h2>ขยายความรู้: AI พลิกโฉมโลกในหลากหลายวงการอย่างไร?</h2>
            <p>สำรวจตัวอย่างการนำปัญญาประดิษฐ์ไปประยุกต์แก้ปัญหาจริง ตั้งแต่วงการแพทย์ เกษตรอัจฉริยะ การเงิน จนถึงการศึกษา</p>
          </div>
        </div>

        <div className="u1ks-app-showcase-banner">
          <img
            src={KS_IMAGES.aiApplications}
            alt="ภาพรวมการประยุกต์ใช้ปัญญาประดิษฐ์ในโลกอนาคต"
            loading="lazy"
          />
          <div>
            <span className="u1ks-pill-solid indigo">AI in Action · โลกแห่งการใช้งานจริง</span>
            <h3>จากห้องทดลองสู่อุตสาหกรรมที่ยกระดับคุณภาพชีวิตมนุษย์</h3>
            <p>
              เมื่อนำเทคโนโลยี Computer Vision, NLP, Machine Learning และ Robotics มาผสานเข้ากับความรู้เฉพาะทางในแต่ละสาขาอาชีพ AI จึงกลายเป็นเครื่องมือช่วยวิเคราะห์ข้อมูลซับซ้อน ลดความผิดพลาด และเพิ่มประสิทธิภาพการทำงานอย่างก้าวกระโดด
            </p>
          </div>
        </div>

        <div className="u1ks-cards-3" style={{ marginTop: 16 }}>
          {[
            {
              tone: 'teal',
              icon: 'flask',
              tag: 'Healthcare',
              img: KS_IMAGES.appHealthcare,
              title: 'การแพทย์และสาธารณสุข',
              desc: 'ช่วยแพทย์ตรวจจับจุดผิดปกติในภาพเอกซเรย์ปอดหรือ MRI ตั้งแต่ระยะเริ่มต้น และช่วยวิเคราะห์โครงสร้างโปรตีนเพื่อพัฒนายาใหม่'
            },
            {
              tone: 'emerald',
              icon: 'map',
              tag: 'Smart Agriculture',
              img: KS_IMAGES.appAgriculture,
              title: 'เกษตรอัจฉริยะ (Smart Farming)',
              desc: 'ใช้โดรนและเซ็นเซอร์ร่วมกับ AI วิเคราะห์ความสมบูรณ์ของพืช โรคใบพืช และคำนวณปริมาณน้ำ–ปุ๋ยเฉพาะจุดอย่างแม่นยำ'
            },
            {
              tone: 'blue',
              icon: 'shield',
              tag: 'FinTech & Security',
              img: KS_IMAGES.appFinance,
              title: 'การเงินและความปลอดภัยธุรกรรม',
              desc: 'ตรวจจับธุรกรรมบัตรเครดิตหรือการโอนเงินที่ผิดปกติแบบเรียลไทม์ เพื่อระงับการทุจริตก่อนเกิดความเสียหาย'
            },
            {
              tone: 'indigo',
              icon: 'map',
              tag: 'Smart Mobility',
              img: KS_IMAGES.appTransportation,
              title: 'คมนาคมและการเดินทางอัจฉริยะ',
              desc: 'วิเคราะห์สภาพจราจรและอุบัติเหตุล่วงหน้า คำนวณเส้นทางขนส่งที่ประหยัดพลังงาน รวมถึงระบบช่วยขับขี่ปลอดภัย'
            },
            {
              tone: 'violet',
              icon: 'book',
              tag: 'EdTech',
              img: KS_IMAGES.appEducation,
              title: 'การศึกษาเฉพาะบุคคล',
              desc: 'เป็นติวเตอร์ผู้ช่วยอธิบายบทเรียนที่ซับซ้อน ปรับระดับแบบฝึกหัดให้เหมาะกับความเข้าใจของผู้เรียนแต่ละคน'
            },
            {
              tone: 'amber',
              icon: 'globe',
              tag: 'Global Communication',
              img: KS_IMAGES.appCommunication,
              title: 'การสื่อสารไร้พรมแดน',
              desc: 'แปลบทสนทนาเสียงพูดและข้อความข้ามภาษาแบบเรียลไทม์ ช่วยทลายกำแพงภาษาในการทำงานและการเรียนรู้ทั่วโลก'
            }
          ].map((app) => (
            <div key={app.tag} className={`u1ks-vocab-card tone-${app.tone}`}>
              <div className="u1ks-card-photo-wrap">
                <img src={app.img} alt={app.title} className="u1ks-card-photo" loading="lazy" />
                <span className={`u1ks-photo-chip tone-${app.tone}`}>
                  <Icon name={app.icon} size={13} /> {app.tag}
                </span>
              </div>
              <h4>{app.title}</h4>
              <p>{app.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Self-check Checklist */}
      <section className="u1ks-section no-print">
        <div className="u1ks-sec-head">
          <span className="u1ks-sec-num indigo"><Icon name="check" size={22} /></span>
          <div>
            <h2>แบบตรวจสอบความเข้าใจด้วยตนเอง ({selfCheckedCount}/{SELF_CHECK_GOALS.length} ข้อ)</h2>
            <p>ลองติ๊กเช็กทีละข้อว่าเราอธิบายเรื่องเหล่านี้ได้แล้วหรือยัง ข้อไหนยังไม่มั่นใจสามารถกดแท็บกลับไปทบทวนได้ทันที</p>
          </div>
        </div>

        <div className="u1ks-selfcheck-progress">
          <div className="u1ks-sc-prog-top">
            <span><Icon name="trophy" size={16} /> ความพร้อมก่อนทำแบบทดสอบประจำหน่วย</span>
            <strong>{selfCheckedCount} / {SELF_CHECK_GOALS.length} ข้อ ({pct}%)</strong>
          </div>
          <div className="u1ks-sc-prog-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div className="u1ks-sc-prog-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="u1ks-selfcheck-list">
          {SELF_CHECK_GOALS.map((g) => {
            const checked = !!selfChecks[g.id];
            const setTone = g.set === 'ตอนที่ 1' ? 'blue' : g.set === 'ตอนที่ 2' ? 'amber' : 'rose';
            return (
              <label key={g.id} className={`u1ks-selfcheck-row ${checked ? 'is-checked' : ''}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleSelfCheck(g.id)}
                />
                <span className={`u1ks-sc-tag tone-${setTone}`}>{g.set}</span>
                <span className="u1ks-sc-text">{g.text}</span>
              </label>
            );
          })}
        </div>
      </section>

      {/* References */}
      <section className="u1ks-section">
        <div className="u1ks-sec-head">
          <span className="u1ks-sec-num indigo"><Icon name="openBook" size={22} /></span>
          <div>
            <h2>แหล่งอ้างอิงและเอกสารขยายความรู้</h2>
            <p>ข้อมูลกฎหมายตรวจสอบสถานะเมื่อ {U1_CHECKED} · ครูและนักเรียนสามารถเปิดศึกษาต้นฉบับเพิ่มเติมได้จากรายการด้านล่าง</p>
          </div>
        </div>

        <ul className="u1ks-ref-list">
          {U1_REFS.map((r) => (
            <li key={r.url}>
              <span className="u1ks-ic-circle sm indigo"><Icon name="globe" size={15} /></span>
              <span className="u1ks-ref-badge">{r.tag}</span>
              <a href={r.url} target="_blank" rel="noopener noreferrer">
                <span>{r.title}</span>
                <Icon name="external" size={14} />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <footer className="u1ks-sheet-footer no-print">
        <button
          type="button"
          className="u1ks-done-btn is-done"
          onClick={onBack}
        >
          <Icon name="grid" size={18} />
          <span>กลับสู่หน้าหลักหน่วยที่ 1 เพื่อทำกิจกรรมและแบบทดสอบหลังเรียน</span>
        </button>
      </footer>
    </article>
  );
}
