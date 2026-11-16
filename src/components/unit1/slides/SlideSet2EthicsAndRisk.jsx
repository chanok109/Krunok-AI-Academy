import React from 'react';
import { Icon } from '../../UIPrimitives.jsx';
import { SlideSceneArt, AIraSlideCongrats } from './Unit1SlideWidgets.jsx';

/* =====================================================================
   สไลด์หน่วยที่ 1 · ชุดที่ 2: จริยธรรม AI และการควบคุมตามระดับความเสี่ยง
   ===================================================================== */

export function createSlidesSet2({ finishSlideSet }) {
  return [
  {
    id: "s2-p1",
    variant: "divider",
    theme: "dark-gold",
    tag: "ชุดที่ 2 · เป้าหมาย",
    title: "จริยธรรม AI และการควบคุมตามระดับความเสี่ยง",
    content: (
      <div className="ref-divider-grid">
        <div className="ref-divider-left">
          <span className="ref-divider-pill gold"><Icon name="scale" size={16} /> ชุดที่ 2 · เป้าหมายการเรียนรู้</span>
          <h2 className="ref-divider-title">จริยธรรม AI และการ<br />ควบคุมตามระดับความเสี่ยง</h2>
          <div className="u1-goal-cards">
            <div className="u1-goal-item">
              <span className="u1-goal-ic gold"><Icon name="alert" size={20} /></span>
              <span>บอกปัญหาจริยธรรมของ AI ได้ และรู้วิธีใช้ AI อย่างรับผิดชอบ</span>
            </div>
            <div className="u1-goal-item">
              <span className="u1-goal-ic gold"><Icon name="layers" size={20} /></span>
              <span>อธิบายการควบคุมตามระดับความเสี่ยง และจัดระดับความเสี่ยงของ AI ได้</span>
            </div>
            <div className="u1-goal-item">
              <span className="u1-goal-ic gold"><Icon name="book" size={20} /></span>
              <span>บอกสาระสำคัญของร่างกฎหมาย AI ของไทยได้</span>
            </div>
          </div>
        </div>
        <div className="ref-divider-art">
          <div className="u1-divider-orb gold">
            <svg viewBox="0 0 240 240" width="215" height="215" aria-hidden="true">
              <circle cx="120" cy="120" r="96" fill="rgba(245,158,11,0.14)" stroke="rgba(251,191,36,0.42)" strokeWidth="2" strokeDasharray="6 6" />
              <circle cx="120" cy="120" r="66" fill="rgba(217,119,6,0.22)" />
              <path d="M120 62v116M74 88h92M94 178h52" stroke="#FBBF24" strokeWidth="5" strokeLinecap="round" />
              <path d="M74 88l-18 42h36L74 88zM166 88l-18 42h36l-18-42z" fill="rgba(253,230,138,0.25)" stroke="#FDE68A" strokeWidth="3.5" strokeLinejoin="round" />
              <path d="M56 130a18 12 0 0 0 36 0M148 130a18 12 0 0 0 36 0" fill="#F59E0B" />
              <circle cx="120" cy="62" r="9" fill="#FEF3C7" />
            </svg>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "s2-p2",
    theme: "gold",
    icon: "alert",
    tag: "ชุดที่ 2 · เปิดเรื่องชวนคิด",
    title: "กรณีศึกษา: เมื่อโรงเรียนให้ AI คัดนักเรียนแทนครู",
    footer: "ว32281 · หน่วยที่ 1 · ชุดที่ 2",
    content: (
      <div className="ref-stack">
        <div className="u1-scenario-banner gold">
          <div className="u1-scenario-text">
            <span className="u1-kicker-badge gold"><Icon name="alert" size={16} /> สถานการณ์สมมติ</span>
            <p>
              โรงเรียนจะใช้ AI คัดนักเรียนเข้าโครงการพิเศษ โดยดู <b>คะแนนสอบ</b> <b>รูปถ่าย</b> และ <b>โพสต์ในโซเชียลมีเดีย</b> แล้วตัดสินว่าใครผ่าน <b>โดยไม่มีครูตรวจซ้ำ</b>
            </p>
          </div>
          <svg viewBox="0 0 300 108" className="u1-scenario-svg" aria-hidden="true">
            <rect width="300" height="108" rx="16" fill="#FFFFFF" stroke="#FCD34D" strokeWidth="2" />
            <rect x="16" y="18" width="76" height="22" rx="7" fill="#FEF3C7" />
            <text x="54" y="33" textAnchor="middle" fill="#92400E" fontSize="11.5" fontWeight="700">คะแนนสอบ</text>
            <rect x="16" y="44" width="76" height="22" rx="7" fill="#DBEAFE" />
            <text x="54" y="59" textAnchor="middle" fill="#1E40AF" fontSize="11.5" fontWeight="700">รูปถ่าย</text>
            <rect x="16" y="70" width="76" height="22" rx="7" fill="#FCE7F3" />
            <text x="54" y="85" textAnchor="middle" fill="#9D174D" fontSize="11.5" fontWeight="700">โพสต์โซเชียล</text>
            <path d="M100 54h24" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
            <rect x="130" y="26" width="66" height="56" rx="14" fill="#D97706" />
            <text x="163" y="51" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="800">AI</text>
            <text x="163" y="68" textAnchor="middle" fill="#FEF3C7" fontSize="10.5" fontWeight="700">ตัดสินเอง</text>
            <path d="M202 54h18" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
            <rect x="224" y="26" width="62" height="56" rx="12" fill="#FEE2E2" stroke="#F87171" strokeWidth="2" />
            <text x="255" y="49" textAnchor="middle" fill="#B91C1C" fontSize="11" fontWeight="800">ไม่มีครู</text>
            <text x="255" y="65" textAnchor="middle" fill="#DC2626" fontSize="11" fontWeight="700">ตรวจซ้ำ!</text>
          </svg>
        </div>
        <div className="ref-cards-3">
          <div className="ref-top-card gold u1-q-card">
            <span className="ref-ic-box lg gold"><Icon name="users" size={24} /></span>
            <div className="ref-card-kicker gold">คำถามที่ 1</div>
            <h4>นักเรียนรู้สึกอย่างไร?</h4>
            <p>เมื่อถูกส่องโซเชียลส่วนตัวและตัดสินโดยเครื่องจักร</p>
          </div>
          <div className="ref-top-card rose u1-q-card">
            <span className="ref-ic-box lg rose"><Icon name="scale" size={24} /></span>
            <div className="ref-card-kicker rose">คำถามที่ 2</div>
            <h4>ระบบนี้ยุติธรรมไหม?</h4>
            <p>รูปถ่ายหรือโพสต์เกี่ยวอะไรกับความสามารถทางวิชาการ</p>
          </div>
          <div className="ref-top-card blue u1-q-card">
            <span className="ref-ic-box lg blue"><Icon name="chat" size={24} /></span>
            <div className="ref-card-kicker blue">คำถามที่ 3</div>
            <h4>ถ้าไม่ผ่าน จะถามใครได้?</h4>
            <p>ใครอธิบายเหตุผลและรับผิดชอบผลการคัดเลือกนี้</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "s2-p3",
    theme: "gold",
    icon: "shield",
    tag: "ชุดที่ 2 · พื้นฐาน",
    title: "จริยธรรม กับ กฎหมาย ต่างกันอย่างไร",
    footer: "ว32281 · หน่วยที่ 1 · ชุดที่ 2",
    content: (
      <div className="ref-stack">
        <div className="ref-split-2">
          <div className="ref-top-card green">
            <SlideSceneArt kind="soft-ethics" />
            <div className="ref-icon-head">
              <span className="ref-ic-box green"><Icon name="shield" size={22} /></span>
              <h4>จริยธรรม = สิ่งที่ “ควรทำ”</h4>
            </div>
            <p>ข้อตกลงร่วมกันของสังคม ไม่มีโทษจำคุกหรือปรับ บางครั้งเรียก <b>Soft Law</b></p>
            <div className="ref-ex-line green"><b>เช่น</b> บอกครูตามจริงว่าใช้ AI ช่วยส่วนไหน</div>
          </div>
          <div className="ref-top-card rose">
            <SlideSceneArt kind="hard-law" />
            <div className="ref-icon-head">
              <span className="ref-ic-box rose"><Icon name="book" size={22} /></span>
              <h4>กฎหมาย = สิ่งที่ “ต้องทำ”</h4>
            </div>
            <p>ข้อบังคับของรัฐ ถ้าฝ่าฝืนมีโทษปรับหรือจำคุก บางครั้งเรียก <b>Hard Law</b></p>
            <div className="ref-ex-line rose"><b>เช่น</b> ห้ามโพสต์ภาพตัดต่อที่ทำให้ผู้อื่นอับอาย</div>
          </div>
        </div>
        <div className="ref-soft-banner gold">
          <Icon name="bulb" size={22} />
          <span><b>ทำไมต้องมีทั้งสองอย่าง:</b> กฎหมายออกช้ากว่าเทคโนโลยีเสมอ ช่วงที่ยังไม่มีกฎหมาย จริยธรรมคือเกราะด่านแรกที่ช่วยกำกับดูแลสังคม</span>
        </div>
      </div>
    )
  },
  {
    id: "s2-p4",
    theme: "gold",
    icon: "alert",
    tag: "ชุดที่ 2 · จริยธรรม",
    title: "ปัญหาจริยธรรมของ AI ที่พบบ่อย 8 ประการ",
    footer: "ว32281 · หน่วยที่ 1 · ชุดที่ 2 · ที่มา: แนวทางจริยธรรมปัญญาประดิษฐ์ของประเทศไทย (กระทรวงดีอี)",
    content: (
      <div className="ref-stack">
        <div className="ref-soft-banner gold">
          <Icon name="bulb" size={20} />
          <span><b>จริยธรรม AI</b> คือการสร้างและใช้ AI อย่างถูกต้อง ไม่ทำให้ใครเดือดร้อน · 8 ปัญหาสำคัญที่ต้องระวัง</span>
        </div>
        <div className="ref-cards-4x2">
          {[
            ["1 อคติ ลำเอียง", "AI ตัดสินไม่ยุติธรรมกับคนบางกลุ่ม", "เช่น คัดทุนการศึกษา แต่หักคะแนนนักเรียนต่างจังหวัด", "scale", "gold"],
            ["2 ความเป็นส่วนตัว", "ข้อมูลถูกนำไปใช้ โดยไม่รู้หรือไม่ยินยอม", "เช่น เอารูปเพื่อนให้ AI วิเคราะห์โดยไม่ขอก่อน", "lock", "purple"],
            ["3 อธิบายไม่ได้", "AI ให้คำตอบ แต่ไม่มีใครบอกเหตุผลได้", "เช่น ถูกปฏิเสธเงินกู้ โดยไม่รู้ว่าเพราะอะไร", "info", "blue"],
            ["4 ใครรับผิดชอบ", "เกิดความเสียหาย แต่ไม่ชัดว่าใครรับผิด", "เช่น รถไร้คนขับชนคน ผิดที่บริษัท คนขับ หรือ AI", "users", "rose"],
            ["5 ข้อมูลผิด ข่าวปลอม", "AI สร้างเรื่องเท็จที่ดูน่าเชื่อ แล้วแชร์ต่อ", "เช่น อ้างงานวิจัยที่ไม่มีอยู่จริง", "alert", "gold"],
            ["6 ลิขสิทธิ์", "ใช้ผลงานคนอื่นฝึกหรือเลียนแบบโดยไม่ขอ", "เช่น ใช้ AI ทำเพลงเลียนเสียงศิลปินแล้วขาย", "copy", "purple"],
            ["7 นำไปใช้ทำผิด", "คนร้ายใช้ AI หลอกลวงหรือทำร้ายผู้อื่น", "เช่น ปลอมเสียงลูกโทรขอเงินพ่อแม่", "shield", "rose"],
            ["8 ผลกระทบต่อสังคม", "งานบางอย่างเปลี่ยนไป คนต้องฝึกทักษะใหม่", "เช่น ระบบอัตโนมัติแทนพนักงานบางตำแหน่ง", "globe", "blue"]
          ].map(([t, d, ex, ic, col]) => (
            <div className={`ref-left-card ${col} compact`} key={t}>
              <span className={`ref-ic-box ${col}`}><Icon name={ic} size={18} /></span>
              <div>
                <h4>{t}</h4>
                <p>{d}</p>
                <small>{ex}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: "s2-p5",
    theme: "gold",
    icon: "scale",
    tag: "ชุดที่ 2 · อคติ (AI Bias)",
    title: "ทำไม AI ถึงลำเอียง และเราจะลดอคติได้อย่างไร",
    footer: "ว32281 · หน่วยที่ 1 · ชุดที่ 2",
    content: (
      <div className="ref-stack">
        <div className="ref-flow-3">
          <div className="ref-flow-step warm">
            <span className="ref-ic-box lg gold"><Icon name="book" size={24} /></span>
            <div className="ref-card-kicker gold">ต้นทาง · ข้อมูลฝึก</div>
            <h4>ข้อมูลในอดีตเอนเอียง</h4>
            <p>ผู้ได้รับทุนในอดีตส่วนใหญ่มาจากโรงเรียนใหญ่ในเมืองหลวง</p>
          </div>
          <div className="ref-flow-arrow gold">➔</div>
          <div className="ref-flow-step">
            <span className="ref-ic-box lg blue"><Icon name="cpu" size={24} /></span>
            <div className="ref-card-kicker blue">กลางทาง · โมเดล</div>
            <h4>AI จำรูปแบบผิด ๆ</h4>
            <p>เหมารวมเองว่า “โรงเรียนในเมืองใหญ่ = ผู้สมัครที่มีแนวโน้มผ่าน”</p>
          </div>
          <div className="ref-flow-arrow rose">➔</div>
          <div className="ref-flow-step rose">
            <span className="ref-ic-box lg rose"><Icon name="alert" size={24} /></span>
            <div className="ref-card-kicker rose">ปลายทาง · ผลลัพธ์</div>
            <h4>ตัดสินไม่เป็นธรรม</h4>
            <p>หักคะแนนนักเรียนต่างจังหวัด แม้ผลการเรียนยอดเยี่ยมเท่ากัน</p>
          </div>
        </div>
        <div className="ref-soft-box green">
          <div className="ref-card-kicker green" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Icon name="shield" size={18} /> ลดอคติได้อย่างไร (3 แนวทางป้องกัน)
          </div>
          <div className="ref-cards-3" style={{ marginTop: 10 }}>
            <div className="u1-mini-sol">
              <span className="ref-ic-box green"><Icon name="users" size={18} /></span>
              <div><b>สมดุลข้อมูลฝึก</b><p>ตรวจว่าข้อมูลฝึกมีตัวแทนคนทุกกลุ่มอย่างสมดุล</p></div>
            </div>
            <div className="u1-mini-sol">
              <span className="ref-ic-box green"><Icon name="x" size={18} /></span>
              <div><b>ตัดข้อมูลไม่เกี่ยวออก</b><p>ไม่นำชื่อโรงเรียน รหัสไปรษณีย์ หรือรูปถ่ายมาใช้ตัดสิน</p></div>
            </div>
            <div className="u1-mini-sol">
              <span className="ref-ic-box green"><Icon name="check" size={18} /></span>
              <div><b>ทดสอบ & คนตรวจซ้ำ</b><p>เทียบผลแยกตามกลุ่ม และให้คนตรวจก่อนตัดสินจริง</p></div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "s2-p6",
    theme: "gold",
    icon: "check",
    tag: "ชุดที่ 2 · หลักจริยธรรมของไทย",
    title: "หลักจริยธรรม AI 6 ข้อ ใช้จริงอย่างไร",
    footer: "ว32281 · หน่วยที่ 1 · ชุดที่ 2 · ที่มา: แนวทางจริยธรรมปัญญาประดิษฐ์ของประเทศไทย (กระทรวงดีอี ร่วมกับมหาวิทยาลัยมหิดล)",
    content: (
      <div className="ref-stack">
        <div className="ref-cards-3x2">
          {[
            ["ข้อ 1", "แข่งขันได้และยั่งยืน", "ใช้ AI ช่วยพัฒนาประเทศ ไม่ทำร้ายสังคมหรือสิ่งแวดล้อมในระยะยาว", "gold", "chart"],
            ["ข้อ 2", "ถูกกฎหมาย จริยธรรม มาตรฐาน", "ขอความยินยอมก่อนใช้ข้อมูลส่วนบุคคลตาม PDPA", "green", "check"],
            ["ข้อ 3", "โปร่งใสและรับผิดชอบได้", "บอกผู้ใช้ว่ากำลังคุยกับแชตบอต และมีช่องทางร้องเรียน", "blue", "chat"],
            ["ข้อ 4", "ปลอดภัยและเป็นส่วนตัว", "เข้ารหัสข้อมูล และจำกัดคนที่เข้าถึงข้อมูลได้", "purple", "lock"],
            ["ข้อ 5", "เป็นธรรม", "ทดสอบว่า AI ให้ผลเท่าเทียมทุกกลุ่ม และทุกคนเข้าถึงได้", "rose", "scale"],
            ["ข้อ 6", "น่าเชื่อถือ", "ทดสอบก่อนใช้จริง และติดตามผลอย่างต่อเนื่อง", "cyan", "shield"]
          ].map(([no, title, desc, color, ic]) => (
            <div className={`ref-top-card ${color} compact`} key={no}>
              <div className="ref-icon-head">
                <span className={`ref-ic-box lg ${color}`}><Icon name={ic} size={22} /></span>
                <div>
                  <div className={`ref-card-kicker ${color}`}>{no}</div>
                  <h4>{title}</h4>
                </div>
              </div>
              <p>{desc}</p>
            </div>
          ))}
        </div>
        <div className="ref-soft-banner blue">
          <Icon name="globe" size={20} />
          <span><b>ระดับโลก:</b> UNESCO ออกข้อแนะนำว่าด้วยจริยธรรมของ AI ปี 2021 หัวใจคือ AI ต้องเคารพสิทธิมนุษยชนและศักดิ์ศรีความเป็นมนุษย์</span>
        </div>
      </div>
    )
  },
  {
    id: "s2-p7",
    theme: "gold",
    icon: "layers",
    tag: "ชุดที่ 2 · ควบคุมตามความเสี่ยง",
    title: "ยิ่ง AI ทำพลาดแล้วกระทบคนมาก ยิ่งต้องคุมเข้ม (4 ระดับ)",
    footer: "ว32281 · หน่วยที่ 1 · ชุดที่ 2",
    content: (
      <div className="ref-stack">
        <div className="ref-risk-bars">
          <div className="ref-risk-row">
            <div className="ref-risk-head rose">
              <div className="u1-risk-title"><Icon name="x" size={20} /> <b>ห้ามใช้เด็ดขาด</b></div>
              <span>ยอมรับไม่ได้ · Unacceptable Risk</span>
            </div>
            <div className="ref-risk-body">
              <div><b>ทำไม:</b> ละเมิดสิทธิหรือบงการคน จึงห้ามใช้เด็ดขาด</div>
              <div className="ref-chip-group">
                <span className="ref-tag-chip rose">ให้คะแนนความประพฤติประชาชน</span>
                <span className="ref-tag-chip rose">หลอกล่อจิตใต้สำนึก</span>
                <span className="ref-tag-chip rose">จับอารมณ์นักเรียนในห้องเรียน</span>
              </div>
            </div>
          </div>
          <div className="ref-risk-row">
            <div className="ref-risk-head gold">
              <div className="u1-risk-title"><Icon name="alert" size={20} /> <b>คุมเข้มก่อนใช้</b></div>
              <span>ความเสี่ยงสูง · High Risk</span>
            </div>
            <div className="ref-risk-body">
              <div><b>ทำไม:</b> ตัดสินอนาคตหรือชีวิตคน ต้องทดสอบ มีคนตรวจ และอธิบายผลได้</div>
              <div className="ref-chip-group">
                <span className="ref-tag-chip gold">คัดคนเข้าทำงาน</span>
                <span className="ref-tag-chip gold">ให้คะแนนการกู้เงิน</span>
                <span className="ref-tag-chip gold">ตรวจข้อสอบ คัดเข้าเรียน</span>
                <span className="ref-tag-chip gold">อุปกรณ์การแพทย์</span>
              </div>
            </div>
          </div>
          <div className="ref-risk-row">
            <div className="ref-risk-head blue">
              <div className="u1-risk-title"><Icon name="info" size={20} /> <b>ต้องบอกว่าเป็น AI</b></div>
              <span>ความเสี่ยงจำกัด · Limited Risk</span>
            </div>
            <div className="ref-risk-body">
              <div><b>ทำไม:</b> คนอาจเข้าใจผิดว่าเป็นคนจริงหรือภาพจริง จึงต้องติดป้ายแจ้ง</div>
              <div className="ref-chip-group">
                <span className="ref-tag-chip blue">แชตบอตตอบลูกค้า</span>
                <span className="ref-tag-chip blue">ภาพและข้อความที่ AI สร้าง</span>
                <span className="ref-tag-chip blue">Deepfake ต้องติดป้าย</span>
              </div>
            </div>
          </div>
          <div className="ref-risk-row">
            <div className="ref-risk-head green">
              <div className="u1-risk-title"><Icon name="check" size={20} /> <b>ใช้ได้ตามปกติ</b></div>
              <span>ความเสี่ยงต่ำ · Minimal Risk</span>
            </div>
            <div className="ref-risk-body">
              <div><b>ทำไม:</b> ถ้าพลาดก็กระทบน้อย ไม่มีข้อบังคับเพิ่มเติม</div>
              <div className="ref-chip-group">
                <span className="ref-tag-chip green">ตัวกรองอีเมลขยะ</span>
                <span className="ref-tag-chip green">AI ในเกม</span>
                <span className="ref-tag-chip green">แก้คำผิดอัตโนมัติ</span>
              </div>
            </div>
          </div>
        </div>
        <div className="ref-soft-banner gold">
          <Icon name="book" size={20} />
          <span><b>ที่มา:</b> แบ่ง 4 ระดับตามกฎหมาย AI ของสหภาพยุโรป (EU AI Act) มีผลตั้งแต่ 1 ส.ค. 2567 และทยอยบังคับใช้ทีละส่วน</span>
        </div>
      </div>
    )
  },
  {
    id: "s2-p8",
    theme: "gold",
    icon: "clock",
    tag: "ชุดที่ 2 · EU AI Act",
    title: "กฎหมาย AI ของยุโรป ทยอยบังคับใช้ทีละส่วน",
    footer: "ว32281 · หน่วยที่ 1 · ชุดที่ 2 · ที่มา: casrai.org, secureprivacy.ai (อ้างข่าวคณะมนตรีสหภาพยุโรป)",
    content: (
      <div className="ref-stack">
        <div className="ref-cards-4">
          <div className="ref-top-card green">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="ref-ic-box green"><Icon name="check" size={20} /></span>
              <span className="ref-status-pill green">บังคับใช้แล้ว</span>
            </div>
            <div className="ref-year green">1 ส.ค. 2567</div>
            <p>กฎหมาย EU AI Act เริ่มมีผลใช้บังคับอย่างเป็นทางการ</p>
          </div>
          <div className="ref-top-card green">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="ref-ic-box green"><Icon name="shield" size={20} /></span>
              <span className="ref-status-pill green">บังคับใช้แล้ว</span>
            </div>
            <div className="ref-year green">2 ก.พ. 2568</div>
            <p>ข้อห้ามใช้ AI ระดับยอมรับไม่ได้ (Unacceptable Risk) เริ่มบังคับ</p>
          </div>
          <div className="ref-top-card gold">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="ref-ic-box gold"><Icon name="clock" size={20} /></span>
              <span className="ref-status-pill gold">รอกำหนด</span>
            </div>
            <div className="ref-year gold">2 ธ.ค. 2570</div>
            <p>กฎควบคุม AI ความเสี่ยงสูงแบบระบบทั่วไป (High-Risk Systems)</p>
          </div>
          <div className="ref-top-card gold">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="ref-ic-box gold"><Icon name="flask" size={20} /></span>
              <span className="ref-status-pill gold">รอกำหนด</span>
            </div>
            <div className="ref-year gold">2 ส.ค. 2571</div>
            <p>AI ความเสี่ยงสูงในผลิตภัณฑ์ควบคุม เช่น อุปกรณ์การแพทย์</p>
          </div>
        </div>
        <div className="ref-soft-banner gold">
          <Icon name="info" size={20} />
          <span><b className="hl-green">สีเขียว</b> = เริ่มบังคับแล้ว · <b className="hl-gold">สีส้ม</b> = ยังไม่ถึงกำหนด (เลื่อนออกไปโดยชุดแก้ไข Digital Omnibus on AI เมื่อ มิ.ย. 2569)</span>
        </div>
        <div className="ref-outline-alert rose">
          <Icon name="alert" size={22} />
          <span><b>ค่าปรับสูงสุด:</b> หากฝ่าฝืนใช้ AI ต้องห้าม ปรับได้ถึง <b>35 ล้านยูโร</b> หรือ <b>ร้อยละ 7 ของรายได้ทั้งโลก</b> ของบริษัท</span>
        </div>
      </div>
    )
  },
  {
    id: "s2-p9",
    theme: "gold",
    icon: "book",
    tag: "ชุดที่ 2 · กฎหมาย AI ของไทย",
    title: "ร่าง พ.ร.บ.ว่าด้วยปัญญาประดิษฐ์ พ.ศ. .... 5 เรื่องที่ต้องรู้",
    footer: "ว32281 · หน่วยที่ 1 · ชุดที่ 2 · ที่มา: Thai PBS Policy Watch (1 ส.ค. 2569), Tilleke & Gibbins (2 ก.ค. 2569)",
    content: (
      <div className="ref-stack">
        <div>
          <span className="ref-outline-pill gold">
            <Icon name="clock" size={16} /> <b>สถานะ: ยังเป็นร่าง ยังไม่บังคับใช้</b> · ETDA เปิดรับฟังความเห็น 2 ก.ค. 2569 · ตรวจสอบ 26 ต.ค. 2569
          </span>
        </div>
        <div className="ref-numbered-strips">
          {[
            ["1", "ควบคุมตามความเสี่ยง", "แบ่งเป็น AI ต้องห้าม · ความเสี่ยงสูง · ต้องแจ้งหรือขออนุญาตก่อนใช้", "layers", "gold"],
            ["2", "AI ต้องห้าม", "เช่น แอบชักจูงจิตใจคน หรือใช้ข้อมูลไม่เกี่ยวข้องมาตัดสินคนอย่างไม่เป็นธรรม", "x", "rose"],
            ["3", "AI ความเสี่ยงสูง", "รัฐประกาศภายหลัง ในด้านความมั่นคง สุขภาพ พลังงาน การขนส่ง สาธารณูปโภค", "alert", "gold"],
            ["4", "คนสร้างและคนใช้มีหน้าที่", "ผู้ประยุกต์ใช้ต้องประเมินความเสี่ยง มีคนดูแล เก็บบันทึกอย่างน้อย 6 เดือน", "users", "blue"],
            ["5", "บทลงโทษ", "ปรับ 1–5 ล้านบาท ศาลสั่งหยุดให้บริการหรือบล็อกการเข้าถึงได้", "scale", "rose"]
          ].map(([n, b, d, ic, col]) => (
            <div className="ref-strip-item" key={n}>
              <span className="ref-strip-num gold">{n}</span>
              <span className={`ref-ic-box ${col}`}><Icon name={ic} size={18} /></span>
              <div><b>{b}</b> — {d}</div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: "s2-p10",
    theme: "gold",
    icon: "users",
    tag: "ชุดที่ 2 · ร่าง พ.ร.บ. AI",
    title: "ผู้ให้บริการ (Provider) กับ ผู้ประยุกต์ใช้ (Deployer) มีหน้าที่ต่างกัน",
    footer: "ว32281 · หน่วยที่ 1 · ชุดที่ 2 · ที่มา: Tilleke & Gibbins (2 ก.ค. 2569)",
    content: (
      <div className="ref-stack">
        <div className="ref-split-2">
          <div className="ref-top-card blue">
            <SlideSceneArt kind="provider-lab" />
            <div className="ref-icon-head">
              <span className="ref-ic-box lg blue"><Icon name="cpu" size={24} /></span>
              <div>
                <h4>ผู้ให้บริการ (Provider)</h4>
                <div className="ref-card-kicker blue">บริษัทที่ <b>สร้างหรือพัฒนา AI</b></div>
              </div>
            </div>
            <ul className="ref-bul-list">
              <li>ออกแบบให้ AI ทำงานตรงจุดประสงค์และปลอดภัย</li>
              <li>มีความโปร่งใส ให้มนุษย์ควบคุมได้</li>
              <li>เป็นธรรม ไม่เลือกปฏิบัติต่อกลุ่มใด</li>
              <li>จัดทำคู่มือและข้อจำกัดการใช้งานให้ชัดเจน</li>
            </ul>
          </div>
          <div className="ref-top-card gold">
            <SlideSceneArt kind="deployer-org" />
            <div className="ref-icon-head">
              <span className="ref-ic-box lg gold"><Icon name="home" size={24} /></span>
              <div>
                <h4>ผู้ประยุกต์ใช้ (Deployer)</h4>
                <div className="ref-card-kicker gold">องค์กรที่ <b>ซื้อหรือนำ AI ไปใช้งาน</b></div>
              </div>
            </div>
            <ul className="ref-bul-list">
              <li>ประเมินและบริหารความเสี่ยงก่อนนำไปใช้จริง</li>
              <li>ใช้งานตามคู่มือ และจัดให้มีคนกำกับดูแล</li>
              <li>เก็บบันทึกการทำงาน (Log) อย่างน้อย 6 เดือน</li>
              <li>แจ้งหน่วยงานรัฐทันทีเมื่อพบความเสี่ยงร้ายแรง</li>
            </ul>
          </div>
        </div>
        <div className="ref-soft-banner gold">
          <Icon name="bulb" size={20} />
          <span><b>ตัวอย่างใกล้ตัว:</b> บริษัทซอฟต์แวร์ที่สร้างระบบคัดนักเรียน = <b>Provider</b> · โรงเรียนที่นำระบบนั้นมาใช้คัดนักเรียน = <b>Deployer</b></span>
        </div>
      </div>
    )
  },
  {
    id: "s2-p11",
    theme: "gold",
    icon: "scale",
    tag: "ชุดที่ 2 · เปรียบเทียบ",
    title: "ร่างกฎหมาย AI ไทย เทียบกับ EU AI Act",
    footer: "ว32281 · หน่วยที่ 1 · ชุดที่ 2 · ตรวจสอบ 26 ต.ค. 2569",
    hideDoneBanner: true,
    content: (
      <div className="ref-stack">
        <div className="table-wrap">
          <table className="ref-compare-table">
            <thead>
              <tr>
                <th style={{ width: '24%' }}>ประเด็น</th>
                <th className="th-gold" style={{ width: '38%' }}>🇹🇭 ร่างกฎหมาย AI ของไทย</th>
                <th className="th-blue" style={{ width: '38%' }}>🇪🇺 EU AI Act (สหภาพยุโรป)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="u1-row-ic gold"><Icon name="clock" size={16} /></span> <b>สถานะ (ต.ค. 2569)</b></td>
                <td><span className="ref-status-pill gold">ร่าง</span> ยังเป็นร่าง ยังไม่ใช้บังคับ</td>
                <td><span className="ref-status-pill green">ใช้แล้ว</span> ใช้บังคับแล้ว ทยอยทีละส่วน</td>
              </tr>
              <tr>
                <td><span className="u1-row-ic blue"><Icon name="target" size={16} /></span> <b>แนวคิดหลัก</b></td>
                <td>✓ ควบคุมตามความเสี่ยง</td>
                <td>✓ ควบคุมตามความเสี่ยง (เหมือนกัน)</td>
              </tr>
              <tr>
                <td><span className="u1-row-ic purple"><Icon name="layers" size={16} /></span> <b>การแบ่งกลุ่ม</b></td>
                <td><b>3 กลุ่ม:</b> ต้องห้าม · เสี่ยงสูง · ต้องแจ้ง/ขออนุญาต</td>
                <td><b>4 ระดับ:</b> ยอมรับไม่ได้ · สูง · จำกัด · ต่ำ</td>
              </tr>
              <tr>
                <td><span className="u1-row-ic green"><Icon name="shield" size={16} /></span> <b>ใครกำกับดูแล</b></td>
                <td>หน่วยงานของแต่ละวงการ เช่น การเงิน สาธารณสุข</td>
                <td>หน่วยงานแต่ละประเทศ ร่วมกับสำนักงาน AI ยุโรป</td>
              </tr>
              <tr>
                <td><span className="u1-row-ic rose"><Icon name="alert" size={16} /></span> <b>ค่าปรับสูงสุด</b></td>
                <td><b className="hl-gold">5 ล้านบาท</b></td>
                <td><b className="ref-term-blue">35 ล้านยูโร</b> หรือร้อยละ 7 ของรายได้ทั้งโลก</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="ref-dashed-flow gold">
          <b className="hl-gold">ขั้นต่อไปของร่างไทย:</b>
          <span className="ref-step-pill">1 กฤษฎีกาตรวจ</span>
          <span>➔</span>
          <span className="ref-step-pill">2 คณะรัฐมนตรี</span>
          <span>➔</span>
          <span className="ref-step-pill">3 รัฐสภา</span>
          <span>➔</span>
          <span className="ref-step-pill solid-gold">4 ประกาศในราชกิจจาฯ</span>
        </div>
      </div>
    )
  },
  {
    id: "s2-congrats",
    variant: "divider",
    theme: "dark-gold",
    tag: "เรียนจบชุดที่ 2",
    title: "AIra แสดงความยินดี · เรียนจบจริยธรรม AI และการควบคุมตามระดับความเสี่ยง",
    hideDoneBanner: true,
    content: (
      <AIraSlideCongrats
        tone="gold"
        stepBadge="MISSION 2 / 3 COMPLETED · จบชุดที่ 2"
        completedTitle="จริยธรรม AI และการควบคุมตามระดับความเสี่ยง"
        congratsSpeech="สุดยอดมากเลย! ตอนนี้เราแยกแยะปัญหาจริยธรรม 8 ด้าน เข้าใจหลักจริยธรรม AI 6 ข้อของไทย และรู้วิธีควบคุม AI ตามระดับความเสี่ยงทั้งของยุโรปและร่างกฎหมายไทยแล้ว ไปเรียนเรื่องสุดท้ายของหน่วยนี้กันเลย!"
        nextKicker="เรื่องต่อไปที่ต้องเรียน · ชุดที่ 3"
        nextIcon="shield"
        nextTitle="ข้อมูลส่วนบุคคล (PDPA) และ Deepfake"
        nextDesc="เรียนรู้กฎหมายคุ้มครองข้อมูลส่วนบุคคล (PDPA) สิทธิ 7 ประการ วิธีสังเกตจับผิดสื่อปลอมแปลง Deepfake 4 วิธี และขั้นตอนรับมือเมื่อตกเป็นเหยื่อ"
        primaryLabel="เรียนเรื่องต่อไป: ข้อมูลส่วนบุคคล (PDPA) & Deepfake"
        onPrimary={() => finishSlideSet(["u1-l4"], "u1-item-2", "ชุดที่ 2: จริยธรรมและความเสี่ยง", "set3", "u1-set3")}
        sheetLabel="อ่านใบความรู้เรื่องที่ 2"
        onOpenSheet={() => finishSlideSet(["u1-l4"], "u1-item-2", "ชุดที่ 2: จริยธรรมและความเสี่ยง", "ks2")}
        onMenu={() => finishSlideSet(["u1-l4"], "u1-item-2", "ชุดที่ 2: จริยธรรมและความเสี่ยง", "cover")}
      />
    )
  }
];
}
