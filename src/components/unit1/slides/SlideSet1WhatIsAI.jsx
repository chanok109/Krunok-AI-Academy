import React from 'react';
import { Icon, AIraBot } from '../../UIPrimitives.jsx';
import { SlideSceneArt, AIraSlideCongrats } from './Unit1SlideWidgets.jsx';

/* =====================================================================
   สไลด์หน่วยที่ 1 · ชุดที่ 1: AI คืออะไร มาจากไหน มีกี่แบบ
   ===================================================================== */

export function createSlidesSet1({ finishSlideSet }) {
  return [
  {
    id: "s1-p1",
    variant: "cover",
    theme: "u2-hero",
    title: "1.1 แนวคิดเบื้องต้นเกี่ยวกับปัญญาประดิษฐ์",
    tag: "ใบความรู้ 1.1",
    hideDoneBanner: true,
    content: (
      <div className="u1-hero-part-h">
        <span className="u1-hero-tile-i">
          <Icon name="cpu" size={38} />
        </span>
        <span className="u1-hero-part-n">1.1</span>
        <h2 className="u1-hero-part-title">แนวคิดเบื้องต้นเกี่ยวกับปัญญาประดิษฐ์</h2>
      </div>
    )
  },
  {
    id: "s1-p2",
    variant: "divider",
    theme: "dark-blue",
    tag: "ชุดที่ 1 · เป้าหมาย",
    title: "AI คืออะไร มาจากไหน มีกี่แบบ",
    content: (
      <div className="ref-divider-grid">
        <div className="ref-divider-left">
          <span className="ref-divider-pill blue"><Icon name="sparkle" size={16} /> ชุดที่ 1 · เป้าหมายการเรียนรู้</span>
          <h2 className="ref-divider-title">AI คืออะไร มาจากไหน มีกี่แบบ</h2>
          <div className="ref-divider-sub">เมื่อเรียนจบชุดนี้ นักเรียนจะสามารถ...</div>
          <div className="u1-goal-cards">
            <div className="u1-goal-item">
              <span className="u1-goal-ic blue"><Icon name="bulb" size={22} /></span>
              <span>อธิบายได้ว่า <b>AI คืออะไร</b> และ <b>AI, ML, DL, Generative AI</b> ต่างกันอย่างไร</span>
            </div>
            <div className="u1-goal-item">
              <span className="u1-goal-ic cyan"><Icon name="clock" size={22} /></span>
              <span>เล่าเหตุการณ์สำคัญใน <b>ประวัติศาสตร์ AI</b> และบอกได้ว่าทำไม AI เคยซบเซาแล้วกลับมาบูม</span>
            </div>
            <div className="u1-goal-item">
              <span className="u1-goal-ic purple"><Icon name="layers" size={22} /></span>
              <span>แยก <b>ประเภทของ AI</b> ได้ และรู้ทันข้อจำกัดของ AI ที่ใช้กันอยู่ในปัจจุบัน</span>
            </div>
          </div>
        </div>
        <div className="ref-divider-art">
          <div className="u1-divider-orb blue">
            <AIraBot mood="happy" className="ref-bot-svg" />
          </div>
        </div>
      </div>
    )
  },
  {
    id: "s1-p3",
    variant: "cover",
    theme: "soft-blue",
    tag: "ชุดที่ 1 · เปิดเรื่อง",
    title: "ตั้งแต่ตื่นนอนจนมาถึงโรงเรียนวันนี้ นักเรียนใช้ AI ไปแล้วกี่ครั้ง",
    footer: "ว32281 · หน่วยที่ 1 · ชุดที่ 1",
    content: (
      <div className="ref-wakeup-grid">
        <div className="ref-wakeup-left">
          <span className="u1-kicker-badge blue"><Icon name="clock" size={15} /> เช้านี้กับ AI รอบตัว</span>
          <h2 className="ref-wakeup-title">
            ตั้งแต่ตื่นนอนจนมาถึงโรงเรียนวันนี้<br />
            <span className="u1-grad-inline">นักเรียนใช้ AI ไปแล้วกี่ครั้ง?</span>
          </h2>
          <div className="ref-pill-chips">
            <span className="ref-outline-pill"><span className="pill-ic blue"><Icon name="camera" size={18} /></span> สแกนหน้าปลดล็อกมือถือ</span>
            <span className="ref-outline-pill"><span className="pill-ic rose"><Icon name="play" size={18} /></span> ฟีดคลิปที่แอปเลือกมาให้</span>
            <span className="ref-outline-pill"><span className="pill-ic purple"><Icon name="chat" size={18} /></span> ถามแชตบอตเรื่องการบ้าน</span>
            <span className="ref-outline-pill"><span className="pill-ic green"><Icon name="map" size={18} /></span> แผนที่บอกทางเลี่ยงรถติด</span>
            <span className="ref-outline-pill"><span className="pill-ic gold"><Icon name="globe" size={18} /></span> แปลภาษาอัตโนมัติ</span>
          </div>
          <div className="u1-highlight-note">
            <Icon name="bulb" size={22} />
            <span>หลายคนใช้ AI ไปแล้ว <b>เกิน 5 ครั้งตั้งแต่เช้า</b> โดยไม่ทันสังเกต!</span>
          </div>
        </div>
        <div className="ref-wakeup-right">
          <svg viewBox="0 0 360 300" className="ref-illus-svg" aria-hidden="true">
            <defs>
              <linearGradient id="u1WakeBg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F1EDF9" />
                <stop offset="100%" stopColor="#E3EFFB" />
              </linearGradient>
            </defs>
            <circle cx="185" cy="152" r="126" fill="url(#u1WakeBg)" />
            <circle cx="76" cy="54" r="24" fill="#FBBF24" />
            <rect x="132" y="54" width="96" height="172" rx="18" fill="#14205E" />
            <rect x="141" y="68" width="78" height="142" rx="11" fill="#FFFFFF" />
            <circle cx="180" cy="118" r="22" fill="#DBEAFE" />
            <circle cx="180" cy="112" r="9" fill="#2563EB" />
            <path d="M163 136c3-12 31-12 34 0" fill="#2563EB" />
            <rect x="155" y="152" width="50" height="8" rx="4" fill="#10B981" />
            <rect x="52" y="110" width="66" height="46" rx="12" fill="#E11D48" />
            <polygon points="78,123 78,143 96,133" fill="#FFFFFF" />
            <rect x="242" y="66" width="84" height="52" rx="14" fill="#6061B6" />
            <circle cx="264" cy="92" r="5" fill="#FFFFFF" />
            <circle cx="284" cy="92" r="5" fill="#FFFFFF" />
            <circle cx="304" cy="92" r="5" fill="#FFFFFF" />
            <rect x="246" y="142" width="76" height="52" rx="14" fill="#059669" />
            <path d="M262 178l14-16 12 8 16-18" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="128" y="238" width="104" height="38" rx="12" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2.5" />
            <text x="180" y="263" textAnchor="middle" fill="#B45309" fontSize="17" fontWeight="800">EN ⇄ ไทย</text>
          </svg>
        </div>
      </div>
    )
  },
  {
    id: "s1-p4",
    theme: "blue",
    icon: "bulb",
    tag: "ชุดที่ 1 · AI คืออะไร",
    title: "AI รับข้อมูล แล้ว “คิดเอง” ว่าจะตอบอะไร",
    footer: "ว32281 · หน่วยที่ 1 · ชุดที่ 1",
    content: (
      <div className="ref-stack">
        <div className="ref-split-2">
          <div className="ref-box-outline">
            <div className="ref-formula-row">
              <div>
                <strong className="ref-term-blue">Artificial</strong>
                <span>ประดิษฐ์ · มนุษย์สร้าง</span>
              </div>
              <b className="ref-plus">+</b>
              <div>
                <strong className="ref-term-blue">Intelligence</strong>
                <span>ความฉลาด · ปัญญา</span>
              </div>
            </div>
            <div className="ref-formula-eq">= ความฉลาดที่มนุษย์สร้างขึ้นในคอมพิวเตอร์</div>
          </div>
          <div className="ref-box-soft">
            <Icon name="bot" size={22} style={{ color: "#2563EB", marginRight: 8, verticalAlign: "middle" }} />
            <b>ปัญญาประดิษฐ์ (AI)</b> คือโปรแกรมคอมพิวเตอร์ที่ทำงานซึ่งปกติต้องใช้ความฉลาดของคน เช่น มองภาพแล้วรู้ว่าเป็นอะไร ฟังเสียงแล้วเข้าใจ ตอบคำถาม แปลภาษา
          </div>
        </div>

        <div className="ref-flow-3">
          <div className="ref-flow-step">
            <SlideSceneArt kind="input-scan" />
            <div className="ref-flow-head"><Icon name="camera" size={20} /> <b>1. รับข้อมูล</b> <span className="ref-term-blue">Input</span></div>
            <p>ภาพ เสียง ข้อความ หรือพฤติกรรมการใช้งาน</p>
            <small>เช่น ภาพใบหน้าจากกล้องมือถือ</small>
          </div>
          <div className="ref-flow-arrow">➔</div>
          <div className="ref-flow-step">
            <SlideSceneArt kind="model-brain" />
            <div className="ref-flow-head"><Icon name="cpu" size={20} /> <b>2. ประมวลผล</b> <span className="ref-term-blue">Model</span></div>
            <p>เทียบกับรูปแบบที่เรียนรู้จากข้อมูลฝึก</p>
            <small>เช่น ตรงกับหน้าเจ้าของเครื่องไหม</small>
          </div>
          <div className="ref-flow-arrow">➔</div>
          <div className="ref-flow-step solid-blue">
            <SlideSceneArt kind="output-action" />
            <div className="ref-flow-head"><Icon name="sparkle" size={20} /> <b>3. ให้ผลลัพธ์ Output</b></div>
            <p>ทำนาย แนะนำ ตัดสินใจ หรือสร้างเนื้อหา</p>
            <small><b>เช่น ปลดล็อก หรือไม่ปลดล็อก</b></small>
          </div>
        </div>

        <div className="ref-left-accent-bar purple">
          <Icon name="globe" size={24} />
          <div>
            <div><b>นิยามสากล OECD (2023):</b> AI คือระบบที่ <b>อนุมาน (Infer)</b> จากข้อมูลที่รับเข้ามาว่าจะสร้างผลลัพธ์อะไร เช่น การทำนาย เนื้อหา คำแนะนำ หรือการตัดสินใจ (ใช้รูปแบบที่เรียนรู้มาคาดการณ์คำตอบอย่างมีเหตุผล ไม่ใช่รู้สึกแบบคน)</div>
            <div className="ref-sub-note"><b className="hl-purple">OECD (องค์การเพื่อความร่วมมือทางเศรษฐกิจและการพัฒนา)</b> มีสมาชิก 38 ประเทศ ร่วมวางมาตรฐาน AI ที่ถูกนำไปใช้เป็นต้นแบบในกฎหมาย EU AI Act</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "s1-p5",
    theme: "blue",
    icon: "cpu",
    tag: "ชุดที่ 1 · AI ทำงานอย่างไร",
    title: "AI รอบตัวเรา รับอะไร (Input) ➔ ให้อะไร (Output)",
    footer: "ว32281 · หน่วยที่ 1 · ชุดที่ 1",
    content: (
      <div className="ref-stack">
        <div className="table-wrap">
          <table className="ref-clean-table">
            <thead>
              <tr>
                <th style={{ width: "28%" }}>ตัวอย่างระบบ AI รอบตัว</th>
                <th style={{ width: "38%" }}>📥 รับข้อมูลเข้า (Input)</th>
                <th style={{ width: "34%" }}>📤 ผลลัพธ์ที่ได้ (Output)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="u1-row-ic blue"><Icon name="mail" size={18} /></span> <b>ตัวกรองอีเมลขยะ</b></td>
                <td>หัวเรื่อง ผู้ส่ง ข้อความและลิงก์ในอีเมล</td>
                <td>ตัดสินว่าเป็น <b>“ขยะ”</b> หรือ <b>“ไม่ใช่ขยะ”</b></td>
              </tr>
              <tr>
                <td><span className="u1-row-ic purple"><Icon name="camera" size={18} /></span> <b>สแกนใบหน้าปลดล็อก</b></td>
                <td>ภาพใบหน้าและโครงหน้าจากกล้อง</td>
                <td>ยืนยันว่า <b>ใช่เจ้าของเครื่องหรือไม่</b></td>
              </tr>
              <tr>
                <td><span className="u1-row-ic rose"><Icon name="play" size={18} /></span> <b>ระบบแนะนำฟีดคลิป</b></td>
                <td>คลิปที่ดูจบ กดถูกใจ หรือเลื่อนผ่าน</td>
                <td>คัดเลือก <b>คลิปถัดไปที่น่าจะชอบ</b></td>
              </tr>
              <tr>
                <td><span className="u1-row-ic green"><Icon name="map" size={18} /></span> <b>แผนที่นำทางอัจฉริยะ</b></td>
                <td>ตำแหน่งรถบนถนน ความเร็ว ช่วงเวลา</td>
                <td>คำนวณ <b>เส้นทางที่ไปถึงเร็วที่สุด</b></td>
              </tr>
              <tr>
                <td><span className="u1-row-ic gold"><Icon name="chat" size={18} /></span> <b>แชตบอต AI</b></td>
                <td>ข้อความหรือคำสั่งที่เราพิมพ์ (Prompt)</td>
                <td>สร้าง <b>คำตอบหรือเนื้อหาขึ้นใหม่</b></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="ref-soft-banner blue">
          <Icon name="bulb" size={22} />
          <span><b>หลักสำคัญ (Garbage In, Garbage Out):</b> ทุกตัวอย่างต้องมีข้อมูลเข้าไปก่อน AI จึงคิดผลลัพธ์ออกมาได้ ถ้าข้อมูลผิดหรือไม่ครบ ผลลัพธ์ก็ผิดตาม</span>
        </div>
      </div>
    )
  },
  {
    id: "s1-p6",
    theme: "blue",
    icon: "book",
    tag: "ชุดที่ 1 · คำศัพท์พื้นฐาน",
    title: "4 คำสำคัญที่ต้องรู้ก่อนเรียน AI",
    footer: "ว32281 · หน่วยที่ 1 · ชุดที่ 1",
    content: (
      <div className="ref-stack">
        <div className="ref-grid-2x2">
          <div className="ref-left-card blue">
            <span className="ref-ic-box blue lg"><Icon name="code" size={26} /></span>
            <div>
              <div className="ref-card-kicker blue">คำที่ 1 · วิธีเรียนรู้</div>
              <h4>Algorithm (อัลกอริทึม)</h4>
              <p>ลำดับขั้นตอนหรือสูตรคำนวณที่บอกคอมพิวเตอร์ว่าต้องทำอะไรก่อน-หลัง เพื่อเรียนรู้จากข้อมูล</p>
            </div>
          </div>
          <div className="ref-left-card green">
            <span className="ref-ic-box green lg"><Icon name="layers" size={26} /></span>
            <div>
              <div className="ref-card-kicker green">คำที่ 2 · ตำราฝึกสอน</div>
              <h4>Training Data (ข้อมูลฝึก)</h4>
              <p>ข้อมูลตัวอย่างจำนวนมากที่ใช้สอน AI ยิ่งมีปริมาณมาก หลากหลาย และถูกต้อง AI ก็ยิ่งแม่นยำ</p>
            </div>
          </div>
          <div className="ref-left-card purple">
            <span className="ref-ic-box purple lg"><Icon name="cpu" size={26} /></span>
            <div>
              <div className="ref-card-kicker purple">คำที่ 3 · สมองหลังฝึกเสร็จ</div>
              <h4>Model (โมเดล)</h4>
              <p>“สมองก้อนความรู้” ของ AI ที่ได้หลังจากการฝึกเสร็จแล้ว พร้อมนำไปใช้งานกับข้อมูลใหม่</p>
            </div>
          </div>
          <div className="ref-left-card gold">
            <span className="ref-ic-box gold lg"><Icon name="chat" size={26} /></span>
            <div>
              <div className="ref-card-kicker gold">คำที่ 4 · คำสั่งของเรา</div>
              <h4>Prompt (พรอมต์)</h4>
              <p>ข้อความหรือโจทย์ที่เราพิมพ์สั่งหรือถาม AI ยิ่งระบุเป้าหมายและบริบทชัดเจน คำตอบยิ่งตรงใจ</p>
            </div>
          </div>
        </div>
        <div className="ref-soft-banner blue">
          <Icon name="sparkle" size={22} />
          <span><b>เปรียบเทียบให้เห็นภาพ:</b> ข้อมูลฝึก = <b>แบบฝึกหัด</b> · อัลกอริทึม = <b>วิธีอ่านหนังสือ</b> · โมเดล = <b>ความรู้ในสมองหลังเรียน</b> · พรอมต์ = <b>คำถามที่ครูถาม</b></span>
        </div>
      </div>
    )
  },
  {
    id: "s1-p7",
    theme: "blue",
    icon: "layers",
    tag: "ชุดที่ 1 · ความสัมพันธ์",
    title: "AI, ML, DL และ GenAI ซ้อนกันเหมือนตุ๊กตาแม่ลูกดก",
    footer: "ว32281 · หน่วยที่ 1 · ชุดที่ 1",
    content: (
      <div className="ref-stack">
        <div className="u1-concentric-split">
          <div className="u1-concentric-visual">
            <svg viewBox="0 0 320 300" className="u1-rings-svg" aria-label="แผนภาพวงกลมซ้อน AI ML DL GenAI">
              <circle cx="160" cy="152" r="138" fill="#F7F3FB" stroke="#6E55B0" strokeWidth="3" />
              <text x="160" y="38" textAnchor="middle" fill="#4A3580" fontSize="18" fontWeight="800">AI (ปัญญาประดิษฐ์)</text>
              <circle cx="160" cy="170" r="105" fill="#EFF6FF" stroke="#2563EB" strokeWidth="3" />
              <text x="160" y="88" textAnchor="middle" fill="#1D4ED8" fontSize="16.5" fontWeight="800">Machine Learning</text>
              <circle cx="160" cy="188" r="72" fill="#ECFDF5" stroke="#059669" strokeWidth="3" />
              <text x="160" y="138" textAnchor="middle" fill="#047857" fontSize="15.5" fontWeight="800">Deep Learning</text>
              <circle cx="160" cy="206" r="40" fill="#FEF3C7" stroke="#D97706" strokeWidth="3" />
              <text x="160" y="204" textAnchor="middle" fill="#B45309" fontSize="14.5" fontWeight="800">GenAI</text>
              <text x="160" y="222" textAnchor="middle" fill="#92400E" fontSize="11.5" fontWeight="700">สร้างของใหม่</text>
            </svg>
          </div>
          <div className="ref-nested-box l1">
            <div className="ref-nested-row">
              <span><b className="hl-purple">1. AI (วงนอกสุด):</b> ทุกวิธีที่ทำให้คอมพิวเตอร์ดูฉลาด รวมถึงการเขียนกฎทีละข้อ · <i>เช่น บอตหมากรุก</i></span>
              <span className="ref-ic-box purple"><Icon name="cpu" size={20} /></span>
            </div>
            <div className="ref-nested-box l2">
              <div className="ref-nested-row">
                <span><b className="ref-term-blue">2. Machine Learning (ML):</b> ให้คอมพิวเตอร์ดูตัวอย่างเยอะ ๆ แล้วหารูปแบบเอง · <i>เช่น กรองอีเมลขยะ</i></span>
                <span className="ref-ic-box blue"><Icon name="mail" size={20} /></span>
              </div>
              <div className="ref-nested-box l3">
                <div className="ref-nested-row">
                  <span><b className="hl-green">3. Deep Learning (DL):</b> โครงข่ายประสาทเทียมหลายชั้น เก่งภาพ เสียง ข้อความ · <i>เช่น สแกนใบหน้า</i></span>
                  <span className="ref-ic-box green"><Icon name="camera" size={20} /></span>
                </div>
                <div className="ref-nested-box l4">
                  <div className="ref-nested-row">
                    <span><b className="hl-gold">4. Generative AI:</b> สร้างเนื้อหาใหม่ ข้อความ ภาพ เพลง โค้ด · <i>เช่น ChatGPT, Claude, Gemini</i></span>
                    <span className="ref-ic-box gold"><Icon name="sparkle" size={20} /></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ref-soft-banner blue">
          <Icon name="check" size={22} />
          <span><b>จำง่าย ๆ:</b> GenAI ทุกตัวเป็น DL, ML และ AI เสมอ — แต่ AI บางระบบ (เช่น โปรแกรมกฎเหล็ก If-Else) ไม่จำเป็นต้องเป็น ML</span>
        </div>
      </div>
    )
  },
  {
    id: "s1-p8",
    theme: "blue",
    icon: "clock",
    tag: "ชุดที่ 1 · ประวัติศาสตร์ AI",
    title: "เส้นทาง 70+ ปี: AI เคยซบเซา 2 ครั้ง ก่อนบูมหลังปี 2012",
    footer: "ว32281 · หน่วยที่ 1 · ชุดที่ 1",
    content: (
      <div className="ref-stack">
        <div className="ref-cards-4x2">
          {[
            ["1950", "ทัวริงเสนอ “การทดสอบทัวริง” วัดความฉลาดเครื่องจักร", "blue", "chat"],
            ["1956", "กำเนิดคำว่า “AI” ครั้งแรกที่การประชุมดาร์ตมัธ", "blue", "award"],
            ["1970s", "ฤดูหนาวของ AI ครั้งที่ 1 (เครื่องช้า ทุนวิจัยถูกตัด)", "gold warm-bg", "alert"],
            ["ปลาย 1980s", "ฤดูหนาวของ AI ครั้งที่ 2 (ระบบผู้เชี่ยวชาญถึงทางตัน)", "gold warm-bg", "alert"],
            ["1997", "Deep Blue ของ IBM เอาชนะแชมป์หมากรุกโลก", "blue", "trophy"],
            ["2012", "AlexNet ชนะแข่งดูภาพ จุดพลุยุค Deep Learning", "green", "eye"],
            ["2016", "AlphaGo ชนะแชมป์โลกหมากล้อม (ซับซ้อนมหาศาล)", "green", "puzzle"],
            ["2022", "ChatGPT เปิดตัว คนทั่วโลกใช้งาน Generative AI", "green", "sparkle"]
          ].map(([yr, desc, cls, ic]) => {
            const tone = cls.split(" ")[0];
            return (
              <div className={`ref-top-card ${cls}`} key={yr}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div className={`ref-year ${tone}`}>{yr}</div>
                  <span className={`ref-ic-box ${tone}`}><Icon name={ic} size={18} /></span>
                </div>
                <p>{desc}</p>
              </div>
            );
          })}
        </div>
        <div className="ref-soft-banner gold">
          <Icon name="info" size={22} />
          <span><b>ฤดูหนาวของ AI (AI Winter - การ์ดสีส้ม):</b> ช่วงที่เทคโนโลยีสมัยนั้นยังทำไม่ได้ตามที่คาดหวังไว้ รัฐบาลและเอกชนจึงลดทุนวิจัยลงชั่วคราว</span>
        </div>
      </div>
    )
  },
  {
    id: "s1-p9",
    theme: "blue",
    icon: "sparkle",
    tag: "ชุดที่ 1 · ประวัติเพิ่มเติม",
    title: "7 เหตุการณ์สำคัญที่เปลี่ยนโฉมหน้าโลก AI",
    footer: "ว32281 · หน่วยที่ 1 · ชุดที่ 1",
    content: (
      <div className="table-wrap">
        <table className="ref-clean-table">
          <thead>
            <tr>
              <th style={{ width: "16%" }}>ปี ค.ศ.</th>
              <th style={{ width: "46%" }}>เหตุการณ์ที่เกิดขึ้น</th>
              <th style={{ width: "38%" }}>ความสำคัญต่อวงการ AI</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["1943", "แมคคัลลอกและพิตส์ คิดแบบจำลองเซลล์ประสาทเทียม", "จุดเริ่มต้นของแนวคิด “สมองเทียม”", "blue", "cpu"],
              ["1958", "แฟรงก์ โรเซนแบลตต์ สร้าง Perceptron", "โครงข่ายประสาทเทียมรุ่นแรกที่ฝึกให้เรียนรู้ได้", "blue", "layers"],
              ["1966", "โจเซฟ ไวเซนบาวม์ สร้างโปรแกรม ELIZA", "แชตบอตโต้ตอบภาษามนุษย์รุ่นแรกของโลก", "purple", "chat"],
              ["1980s", "ระบบผู้เชี่ยวชาญ (Expert System) ได้รับความนิยม", "จำลองการตัดสินใจด้วยกฎ “ถ้า...แล้ว...”", "gold", "book"],
              ["2011", "IBM Watson ชนะแชมป์เกมโชว์ตอบคำถาม Jeopardy!", "พิสูจน์ว่า AI เข้าใจภาษาพูดที่ซับซ้อนได้ดีขึ้นมาก", "blue", "trophy"],
              ["2017", "ทีมวิจัย Google คิดค้นสถาปัตยกรรม Transformer", "รากฐานสำคัญของ LLM และแชตบอตยุคปัจจุบัน", "green", "sparkle"],
              ["2024", "รางวัลโนเบลสาขาฟิสิกส์และเคมี มอบให้งานด้าน AI", "AI ก้าวขึ้นเป็นเครื่องมือหลักทางวิทยาศาสตร์ระดับโลก", "rose", "award"]
            ].map(([yr, ev, imp, tone, ic]) => (
              <tr key={yr}>
                <td><span className={`ref-status-pill ${tone === "gold" ? "gold" : tone === "green" ? "green" : "blue-solid"}`}>{yr}</span></td>
                <td><span className={`u1-row-ic ${tone}`}><Icon name={ic} size={16} /></span> <b>{ev}</b></td>
                <td>{imp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  },
  {
    id: "s1-p10",
    theme: "blue",
    icon: "chart",
    tag: "ชุดที่ 1 · ทำไมบูม",
    title: "AI กลับมาบูมก้าวกระโดด เพราะมี 3 ปัจจัยครบพร้อมกัน",
    subtitle: "Big Data (ข้อมูลมหาศาล) + GPU (พลังคำนวณสูง) + Deep Learning (อัลกอริทึมเชิงลึก)",
    footer: "ว32281 · หน่วยที่ 1 · ชุดที่ 1",
    content: (
      <div className="ref-stack">
        <div className="ref-cards-3">
          <div className="ref-top-card blue">
            <SlideSceneArt kind="big-data" />
            <div className="ref-big-num-row">
              <span className="ref-big-num blue">01</span>
              <span className="ref-ic-box blue"><Icon name="globe" size={22} /></span>
            </div>
            <h4>ข้อมูลมหาศาล (Big Data)</h4>
            <p>รูปภาพ ข้อความ และวิดีโอบนอินเทอร์เน็ตและสมาร์ตโฟน กลายเป็น “ตำราเรียนขนาดยักษ์” ให้ AI ฝึกฝน</p>
          </div>
          <div className="ref-top-card gold">
            <SlideSceneArt kind="gpu-chip" />
            <div className="ref-big-num-row">
              <span className="ref-big-num gold">02</span>
              <span className="ref-ic-box gold"><Icon name="cpu" size={22} /></span>
            </div>
            <h4>คอมพิวเตอร์แรงขึ้น (GPU)</h4>
            <p>ชิปการ์ดจอ (GPU) คำนวณตัวเลขหลายพันชุดพร้อมกันได้ ทำให้ฝึกโมเดล AI ขนาดใหญ่ได้เร็วขึ้นหลายร้อยเท่า</p>
          </div>
          <div className="ref-top-card purple">
            <SlideSceneArt kind="deep-net" />
            <div className="ref-big-num-row">
              <span className="ref-big-num purple">03</span>
              <span className="ref-ic-box purple"><Icon name="layers" size={22} /></span>
            </div>
            <h4>อัลกอริทึม Deep Learning</h4>
            <p>โครงข่ายประสาทเทียมหลายชั้น เรียนรู้ซับซ้อนจากง่ายไปยากอัตโนมัติ เช่น จุด ➔ เส้น ➔ รูปทรง ➔ ใบหน้า</p>
          </div>
        </div>
        <div className="ref-soft-banner blue">
          <Icon name="target" size={22} />
          <span><b>สำหรับประเทศไทย:</b> มีแผนปฏิบัติการด้านปัญญาประดิษฐ์แห่งชาติ พ.ศ. 2565–2570 เพื่อพัฒนาบุคลากร โครงสร้างพื้นฐาน และการใช้ AI อย่างมีจริยธรรม</span>
        </div>
      </div>
    )
  },
  {
    id: "s1-p11",
    theme: "blue",
    icon: "cpu",
    tag: "ชุดที่ 1 · ประเภทของ AI ตามความสามารถ",
    title: "AI ทุกตัวที่เราใช้กันในปัจจุบัน ล้วนเป็น “AI แบบแคบ (ANI)”",
    footer: "ว32281 · หน่วยที่ 1 · ชุดที่ 1",
    content: (
      <div className="ref-stack">
        <div className="ref-cards-3">
          <div className="ref-border-card green">
            <SlideSceneArt kind="ani-bot" />
            <div className="ref-badge-row">
              <span className="ref-status-pill green">✓ มีใช้งานจริงแล้ว</span>
              <Icon name="check" size={24} style={{ color: "#15803D" }} />
            </div>
            <h4>1. AI แบบแคบ (ANI)</h4>
            <div className="ref-card-kicker green">Artificial Narrow Intelligence</div>
            <p>เก่งเฉพาะทางตามที่ถูกฝึกมา เช่น แปลภาษาเก่ง วาดรูปสวย หรือเล่นหมากล้อมชนะคน แต่ทำงานข้ามสายเองไม่ได้</p>
          </div>
          <div className="ref-border-card gold">
            <SlideSceneArt kind="agi-brain" />
            <div className="ref-badge-row">
              <span className="ref-status-pill gold">⏳ กำลังวิจัย ยังไม่มีจริง</span>
              <Icon name="cpu" size={24} style={{ color: "#B45309" }} />
            </div>
            <h4>2. AI ทั่วไป (AGI)</h4>
            <div className="ref-card-kicker gold">Artificial General Intelligence</div>
            <p>คิด วิเคราะห์ พลิกแพลง และเรียนรู้ข้ามศาสตร์ได้หลากหลายเทียบเท่ามนุษย์จริง ๆ</p>
          </div>
          <div className="ref-border-card purple">
            <SlideSceneArt kind="asi-core" />
            <div className="ref-badge-row">
              <span className="ref-status-pill purple-solid">✦ แนวคิดในอนาคต</span>
              <Icon name="sparkle" size={24} style={{ color: "#6061B6" }} />
            </div>
            <h4>3. AI เหนือมนุษย์ (ASI)</h4>
            <div className="ref-card-kicker purple">Artificial Super Intelligence</div>
            <p>มีความฉลาดล้ำลึกเหนือกว่าสมองมนุษย์ที่เก่งที่สุดรวมกันในแทบทุกด้าน ทั้งวิทยาศาสตร์และความคิดสร้างสรรค์</p>
          </div>
        </div>
        <div className="ref-soft-banner green">
          <Icon name="bulb" size={22} />
          <span><b>ข้อสังเกตสำคัญ:</b> แม้ ChatGPT หรือ Gemini จะคุยได้หลายเรื่อง แต่เบื้องหลังยังเป็นการคำนวณรูปแบบภาษาและข้อมูลเฉพาะทาง จึงยังจัดเป็น <b>ANI</b> ไม่ใช่ AGI</span>
        </div>
      </div>
    )
  },
  {
    id: "s1-p12",
    theme: "blue",
    icon: "grid",
    tag: "ชุดที่ 1 · การจำแนกประเภทเพิ่มเติม",
    title: "แบ่งได้อีก 2 มุมมอง: ตามความจำ และตามลักษณะงาน",
    footer: "ว32281 · หน่วยที่ 1 · ชุดที่ 1",
    content: (
      <div className="ref-stack">
        <div className="ref-split-2">
          <div className="ref-top-card blue">
            <div className="ref-icon-head">
              <span className="ref-ic-box blue"><Icon name="cpu" size={22} /></span>
              <div>
                <div className="ref-card-kicker blue">มุมมองที่ 1 · แนวคิด Arend Hintze (2016)</div>
                <h4>แบ่งตามวิธีทำงาน & ความจำ</h4>
              </div>
            </div>
            <ol className="ref-num-list" style={{ marginTop: 8 }}>
              <li><b>ตอบสนองอย่างเดียว (Reactive):</b> ดูแค่สถานการณ์ตรงหน้า ไม่จำอดีต เช่น Deep Blue เดินหมากรุก <span className="hl-green">(มีแล้ว)</span></li>
              <li><b>ความจำช่วงสั้น (Limited Memory):</b> จำบริบทล่าสุดมาช่วยตัดสินใจ เช่น รถไร้คนขับ แชตบอต <span className="hl-green">(AI ส่วนใหญ่ในปัจจุบัน)</span></li>
              <li><b>เข้าใจจิตใจคน (Theory of Mind):</b> เข้าใจอารมณ์และความตั้งใจของมนุษย์จริง ๆ <span className="hl-gold">(กำลังวิจัย)</span></li>
              <li><b>ตระหนักรู้ตนเอง (Self-Aware):</b> มีความรู้สึกนึกคิดเป็นของตัวเอง <span style={{ color: "#5A5F8C" }}>(ยังเป็นแนวคิด)</span></li>
            </ol>
          </div>
          <div className="ref-top-card green">
            <div className="ref-icon-head">
              <span className="ref-ic-box green"><Icon name="sparkle" size={22} /></span>
              <div>
                <div className="ref-card-kicker green">มุมมองที่ 2 · แบ่งตามผลลัพธ์ที่ได้</div>
                <h4>แบ่งตามงานที่ AI ทำให้เรา</h4>
              </div>
            </div>
            <ul className="ref-bul-list" style={{ marginTop: 8 }}>
              <li><b>วิเคราะห์และทำนาย (Predictive AI):</b> ดูข้อมูลอดีตแล้วคาดการณ์อนาคต เช่น พยากรณ์อากาศ ตรวจจับธุรกรรมบัตรเครดิตผิดปกติ</li>
              <li><b>สร้างสรรค์เนื้อหาใหม่ (Generative AI):</b> สร้างข้อความ ภาพ เสียง วิดีโอ หรือโค้ดใหม่ตามคำสั่ง</li>
              <li><b>ตัวแทนปฏิบัติงาน (Agentic AI):</b> รับเป้าหมายแล้ววางแผนทำงานหลายขั้นตอนเอง เช่น ค้นข้อมูล ➔ เปรียบเทียบ ➔ สรุปรายงานให้คนตรวจ</li>
            </ul>
          </div>
        </div>
        <div className="ref-soft-banner blue">
          <Icon name="puzzle" size={22} />
          <span><b>ลองจัดกลุ่มดู:</b> แชตบอตช่วยร่างเรียงความ 1 ตัว จัดเป็น <b>แบบแคบ (ANI)</b> + <b>ความจำช่วงสั้น</b> + <b>สร้างสรรค์ (Generative)</b> พร้อมกันได้</span>
        </div>
      </div>
    )
  },
  {
    id: "s1-p13",
    theme: "blue",
    icon: "alert",
    tag: "ชุดที่ 1 · รู้ทัน AI",
    title: "4 ข้อจำกัดสำคัญของ AI ที่ผู้ใช้ต้องรู้ทัน (Limitations of AI)",
    footer: "ว32281 · หน่วยที่ 1 · ชุดที่ 1",
    content: (
      <div className="ref-stack">
        <div className="ref-grid-2x2">
          <div className="ref-left-card rose">
            <span className="ref-ic-box rose lg"><Icon name="alert" size={26} /></span>
            <div>
              <h4>1. ภาวะหลอน <span className="hl-coral">(Hallucination)</span></h4>
              <p>AI คาดเดาคำถัดไปจากความน่าจะเป็น ไม่ได้ตรวจสอบความจริงเสมอ จึงอาจแต่งข้อมูลเท็จที่ฟังดูน่าเชื่อถือ เช่น อ้างชื่อหนังสือที่ไม่มีอยู่จริง</p>
            </div>
          </div>
          <div className="ref-left-card gold">
            <span className="ref-ic-box gold lg"><Icon name="scale" size={26} /></span>
            <div>
              <h4>2. ความลำเอียงตามข้อมูล <span className="hl-gold">(Bias)</span></h4>
              <p>AI เรียนรู้จากข้อมูลตัวอย่างที่ป้อนให้ หากข้อมูลฝึกไม่สมดุล ผลลัพธ์ก็จะเอนเอียงตาม เช่น ระบบสั่งงานด้วยเสียงที่ฟังสำเนียงท้องถิ่นเพี้ยน หรือระบบคัดทุนที่เอนเอียงตามชื่อโรงเรียนเดิม</p>
            </div>
          </div>
          <div className="ref-left-card blue">
            <span className="ref-ic-box blue lg"><Icon name="clock" size={26} /></span>
            <div>
              <h4>3. ข้อมูลมีวันตัดรอบ <span className="ref-term-blue">(Knowledge Cutoff)</span></h4>
              <p>โมเดลรู้เฉพาะข้อมูลจนถึงวันที่สิ้นสุดการฝึก หากไม่ได้เชื่อมต่อค้นเว็บเพิ่มเติม อาจตอบข่าวสาร ราคา หรือกฎหมายใหม่ผิดพลาด</p>
            </div>
          </div>
          <div className="ref-left-card purple">
            <span className="ref-ic-box purple lg"><Icon name="cpu" size={26} /></span>
            <div>
              <h4>4. ไม่เข้าใจความหมายจริง <span className="hl-purple">(No Common Sense)</span></h4>
              <p>AI จับรูปแบบทางสถิติได้เก่งมาก แต่ไม่มีประสบการณ์ชีวิตและสามัญสำนึกแบบมนุษย์ จึงอาจพลาดเรื่องพื้นฐานง่าย ๆ ได้</p>
            </div>
          </div>
        </div>
        <div className="ref-soft-banner green">
          <Icon name="shield" size={22} />
          <span><b>คาถาใช้ AI อย่างปลอดภัย:</b> ตรวจสอบกับแหล่งข้อมูลที่น่าเชื่อถือเสมอ · เปิดเช็กลิงก์อ้างอิงด้วยตนเอง · <b>มนุษย์เป็นคนตัดสินใจคนสุดท้าย</b></span>
        </div>
      </div>
    )
  },
  {
    id: "s1-p14",
    variant: "think",
    theme: "royal-blue",
    tag: "ชุดที่ 1 · ชวนคิดท้ายบท",
    title: "เพื่อนบอกว่า “ChatGPT ตอบได้ทุกเรื่อง แสดงว่าเป็น AGI แล้ว” นักเรียนจะอธิบายเพื่อนว่าอย่างไร",
    hideDoneBanner: true,
    content: (
      <div className="u1-think-grid">
        <div className="ref-think-stage">
          <span className="ref-divider-pill light"><Icon name="chat" size={16} /> ชวนคิดแลกเปลี่ยน (Think-Pair-Share)</span>
          <h2 className="ref-think-title">
            เพื่อนบอกว่า “ChatGPT ตอบได้ทุกเรื่อง<br />
            แสดงว่าเป็น AGI แล้ว”<br />
            นักเรียนจะอธิบายเพื่อนว่าอย่างไร?
          </h2>
          <p className="ref-think-sub">💡 ลองจับคู่คุยกับเพื่อนข้าง ๆ 1 นาที โดยใช้คำสำคัญ: <b>ANI · รูปแบบข้อมูล · อาการหลอน (Hallucination)</b></p>
        </div>
        <div className="u1-think-art">
          <div className="u1-divider-orb royal">
            <AIraBot mood="wink" size={185} className="ref-bot-svg" />
          </div>
        </div>
      </div>
    )
  },
  {
    id: "s1-congrats",
    variant: "divider",
    theme: "dark-navy",
    tag: "เรียนจบชุดที่ 1",
    title: "AIra แสดงความยินดี · เรียนจบ AI คืออะไร",
    hideDoneBanner: true,
    content: (
      <AIraSlideCongrats
        tone="blue"
        stepBadge="MISSION 1 / 3 COMPLETED · จบชุดที่ 1"
        completedTitle="AI คืออะไร"
        congratsSpeech="เก่งมากเลยทุกคน! ตอนนี้เราเข้าใจความหมายของ AI ความสัมพันธ์ AI ⊃ ML ⊃ DL ⊃ GenAI ประวัติศาสตร์ ประเภท และข้อจำกัดของ AI ครบถ้วนแล้ว ไปลุยเรื่องต่อไปกับไอร่ากันเลยนะ!"
        nextKicker="เรื่องต่อไปที่ต้องเรียน · ชุดที่ 2"
        nextIcon="scale"
        nextTitle="จริยธรรม AI และการควบคุมตามระดับความเสี่ยง"
        nextDesc="เรียนรู้ประเด็นจริยธรรม AI 8 ด้าน หลักจริยธรรม AI 6 ข้อของไทย พีระมิดความเสี่ยง 4 ระดับ (EU AI Act) และร่าง พ.ร.บ. AI ของไทย"
        primaryLabel="เรียนเรื่องต่อไป: จริยธรรม AI & ความเสี่ยง"
        onPrimary={() => finishSlideSet(["u1-l1", "u1-l2", "u1-l3"], "u1-item-1", "ชุดที่ 1: AI คืออะไร", "set2", "u1-set2")}
        sheetLabel="อ่านใบความรู้เรื่องที่ 1"
        onOpenSheet={() => finishSlideSet(["u1-l1", "u1-l2", "u1-l3"], "u1-item-1", "ชุดที่ 1: AI คืออะไร", "ks1")}
        onMenu={() => finishSlideSet(["u1-l1", "u1-l2", "u1-l3"], "u1-item-1", "ชุดที่ 1: AI คืออะไร", "cover")}
      />
    )
  }
];
}
