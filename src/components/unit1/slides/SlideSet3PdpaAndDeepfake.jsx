import React from 'react';
import { Icon } from '../../UIPrimitives.jsx';
import { SlideSceneArt, AIraSlideCongrats } from './Unit1SlideWidgets.jsx';

/* =====================================================================
   สไลด์หน่วยที่ 1 · ชุดที่ 3: ข้อมูลส่วนบุคคล (PDPA) และ Deepfake
   ===================================================================== */

export function createSlidesSet3({ finishSlideSet }) {
  return [
  {
    id: "s3-p27",
    variant: "divider",
    theme: "dark-rose",
    tag: "ชุดที่ 3 · เปิดเรื่อง",
    title: "ข้อมูลส่วนบุคคล (PDPA) และ Deepfake",
    content: (
      <div className="ref-divider-grid">
        <div className="ref-divider-left">
          <span className="ref-divider-pill rose"><Icon name="lock" size={16} /> ชุดที่ 3 · กฎหมายดิจิทัลใกล้ตัว</span>
          <h2 className="ref-divider-title">ข้อมูลส่วนบุคคล (PDPA)<br />และ Deepfake</h2>
          <div className="ref-dark-casebox rose">
            <div className="ref-case-tag"><Icon name="alert" size={14} /> กรณีศึกษาเปิดเรื่อง</div>
            <p>
              เช้าวันจันทร์ <b>“ต้น”</b> พบภาพหน้าตัวเองถูก AI ตัดต่อให้น่าอับอาย ส่งต่อในกลุ่มไลน์ห้องกว่า 40 ครั้ง ตอนเย็นแม่ได้รับโทรศัพท์เสียงเหมือนต้น ขอให้โอนเงินด่วน 5,000 บาท
            </p>
            <p style={{ marginTop: 10, color: '#FECDD3', fontWeight: 600 }}>
              ชวนคิด: เรื่องนี้ผิดกฎหมายไหม ใครผิด และถ้าเป็นต้น จะทำอะไรเป็นอย่างแรก?
            </p>
          </div>
        </div>
        <div className="ref-divider-art">
          <div className="u1-divider-orb rose">
            <svg viewBox="0 0 240 240" width="215" height="215" aria-hidden="true">
              <circle cx="120" cy="120" r="96" fill="rgba(244,63,94,0.14)" stroke="rgba(251,113,133,0.42)" strokeWidth="2" strokeDasharray="6 6" />
              <path d="M120 46l62 26v46c0 42-27 72-62 86-35-14-62-44-62-86V72l62-26z" fill="rgba(225,29,72,0.28)" stroke="#FB7185" strokeWidth="3.5" />
              <rect x="96" y="108" width="48" height="38" rx="9" fill="#FFE4E6" />
              <path d="M106 108V96a14 14 0 0 1 28 0v12" fill="none" stroke="#FFE4E6" strokeWidth="5" strokeLinecap="round" />
              <circle cx="120" cy="126" r="5" fill="#BE123C" />
              <rect x="150" y="60" width="52" height="26" rx="13" fill="#F43F5E" />
              <text x="176" y="77" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="800">FAKE!</text>
            </svg>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "s3-p28",
    theme: "rose",
    icon: "lock",
    tag: "ชุดที่ 3 · PDPA",
    title: "PDPA ปกป้องข้อมูลของเรา (ใช้บังคับแล้วตั้งแต่ 1 มิ.ย. 2565)",
    footer: "ว32281 · หน่วยที่ 1 · ชุดที่ 3 · ที่มา: แนวปฏิบัติ PDPA กับ AI ของ สคส. (ต.ค. 2569)",
    content: (
      <div className="ref-stack">
        <div className="ref-split-2">
          <div className="ref-top-card blue">
            <SlideSceneArt kind="pdpa-id" />
            <div className="ref-icon-head">
              <span className="ref-ic-box lg blue"><Icon name="user" size={24} /></span>
              <div>
                <h4>ข้อมูลส่วนบุคคลทั่วไป</h4>
                <div className="ref-card-kicker blue">Personal Data</div>
              </div>
            </div>
            <p>ข้อมูลที่บอกได้ว่าเป็นใคร ทั้งโดยตรงหรือเมื่อนำไปรวมกับข้อมูลอื่น</p>
            <div className="ref-chip-group">
              {["ชื่อ-นามสกุล", "เลขบัตรประชาชน", "เบอร์โทร", "อีเมล", "รูปถ่าย"].map(x => (
                <span className="ref-tag-chip blue" key={x}>{x}</span>
              ))}
            </div>
          </div>
          <div className="ref-top-card rose">
            <SlideSceneArt kind="pdpa-bio" />
            <div className="ref-icon-head">
              <span className="ref-ic-box lg rose"><Icon name="lock" size={24} /></span>
              <div>
                <h4>ข้อมูลอ่อนไหว (มาตรา 26)</h4>
                <div className="ref-card-kicker rose">Sensitive Data · คุ้มครองเข้มงวด</div>
              </div>
            </div>
            <p>หากรั่วไหลอาจถูกเลือกปฏิบัติ ต้องขอความยินยอมโดยชัดแจ้งก่อนเก็บ</p>
            <div className="ref-chip-group">
              {["ศาสนา", "สุขภาพ", "ความพิการ", "ประวัติอาชญากรรม", "ลายนิ้วมือ", "ข้อมูลใบหน้า"].map(x => (
                <span className="ref-tag-chip rose" key={x}>{x}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="ref-outline-alert rose">
          <Icon name="chat" size={22} />
          <span><b>ข้อควรระวังยุค AI:</b> ข้อความที่พิมพ์สั่ง AI (Prompt) และคำตอบของ AI ก็อาจมีข้อมูลส่วนบุคคลได้ <b>ห้ามพิมพ์ข้อมูลส่วนตัวของตนเองหรือเพื่อนลงแชตบอตสาธารณะ</b></span>
        </div>
      </div>
    )
  },
  {
    id: "s3-p29",
    theme: "rose",
    icon: "users",
    tag: "ชุดที่ 3 · PDPA",
    title: "ใครเป็นใครใน PDPA มี 3 บทบาทหลัก",
    footer: "ว32281 · หน่วยที่ 1 · ชุดที่ 3",
    content: (
      <div className="ref-stack">
        <div className="ref-cards-3">
          <div className="ref-top-card blue">
            <div className="ref-icon-head">
              <span className="ref-ic-box lg blue"><Icon name="user" size={24} /></span>
              <div>
                <h4>เจ้าของข้อมูล</h4>
                <div className="ref-card-kicker blue">Data Subject</div>
              </div>
            </div>
            <span className="ref-status-pill blue-solid">เป็นเจ้าของสิทธิ</span>
            <p>ตัวบุคคลที่ข้อมูลระบุถึง เช่น ชื่อ รูป เบอร์โทร มีสิทธิขอดู ขอแก้ ขอลบ</p>
            <div className="ref-ex-line blue"><b>เช่น</b> นักเรียนที่กรอกใบสมัคร</div>
          </div>
          <div className="ref-top-card gold">
            <div className="ref-icon-head">
              <span className="ref-ic-box lg gold"><Icon name="home" size={24} /></span>
              <div>
                <h4>ผู้ควบคุมข้อมูล</h4>
                <div className="ref-card-kicker gold">Data Controller</div>
              </div>
            </div>
            <span className="ref-status-pill gold-solid">เป็นคนตัดสินใจ</span>
            <p>ผู้ตัดสินใจว่าจะเก็บข้อมูลอะไร เอาไปใช้ทำอะไร และต้องรับผิดชอบหลัก</p>
            <div className="ref-ex-line gold"><b>เช่น</b> โรงเรียน หรือบริษัทเจ้าของแอป</div>
          </div>
          <div className="ref-top-card rose">
            <div className="ref-icon-head">
              <span className="ref-ic-box lg rose"><Icon name="cpu" size={24} /></span>
              <div>
                <h4>ผู้ประมวลผลข้อมูล</h4>
                <div className="ref-card-kicker rose">Data Processor</div>
              </div>
            </div>
            <span className="ref-status-pill rose-solid">ทำตามคำสั่ง</span>
            <p>ผู้จัดการข้อมูลแทนผู้ควบคุม ทำได้เฉพาะที่ถูกสั่ง ห้ามเอาไปใช้เอง</p>
            <div className="ref-ex-line rose"><b>เช่น</b> บริษัทคลาวด์ที่โรงเรียนจ้าง</div>
          </div>
        </div>
        <div className="ref-dashed-flow rose">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
            <b className="hl-coral"><Icon name="sparkle" size={16} /> ตัวอย่างเก็บคะแนนสอบ:</b>
            <span className="ref-status-pill blue-solid">นักเรียน</span>
            <span>ให้ข้อมูล ➔</span>
            <span className="ref-status-pill gold-solid">โรงเรียน</span>
            <span>จ้างและสั่งให้เก็บ ➔</span>
            <span className="ref-status-pill rose-solid">บริษัทคลาวด์</span>
          </div>
          <div style={{ marginTop: 6 }}>โรงเรียนต้องรับผิดชอบดูแลให้บริษัทคลาวด์รักษาข้อมูลอย่างปลอดภัย และใช้ตามคำสั่งเท่านั้น</div>
        </div>
      </div>
    )
  },
  {
    id: "s3-p30",
    theme: "rose",
    icon: "check",
    tag: "ชุดที่ 3 · ความยินยอมและสิทธิ",
    title: "ความยินยอมที่ถูกต้อง (Consent) และสิทธิของเรา 7 ข้อ",
    subtitle: "ความยินยอม คือการที่เราอนุญาตให้เก็บและใช้ข้อมูลโดยสมัครใจ ไม่ถูกหลอกหรือบังคับ",
    footer: "ว32281 · หน่วยที่ 1 · ชุดที่ 3",
    content: (
      <div className="ref-stack">
        <div className="ref-cards-3">
          <div className="ref-soft-box green">
            <div className="ref-card-kicker green" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="check" size={20} /> ขอแบบถูกต้อง
            </div>
            <div className="ref-consent-mock good">
              <div className="mock-lines"><span /><span /></div>
              <span className="mock-box unchecked" />
            </div>
            <ul className="ref-check-list good">
              <li>✓ บอกชัดว่าเก็บอะไร ไปใช้ทำอะไร</li>
              <li>✓ แยกจากข้อความอื่น อ่านเข้าใจง่าย</li>
              <li>✓ ไม่บังคับ และถอนความยินยอมได้ง่าย</li>
            </ul>
          </div>
          <div className="ref-soft-box rose">
            <div className="ref-card-kicker rose" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="alert" size={20} /> ขอแบบไม่ถูกต้อง
            </div>
            <div className="ref-consent-mock bad">
              <div className="mock-lines"><span /><span /><span /></div>
              <span className="mock-box checked">✓</span>
            </div>
            <ul className="ref-check-list bad">
              <li>⚠ ซ่อนไว้ในตัวหนังสือเล็ก ๆ ยาว ๆ</li>
              <li>⚠ ติ๊กเครื่องหมายถูกไว้ให้ล่วงหน้า</li>
              <li>⚠ ขอเกินจำเป็น เช่น แอปไฟฉายขอดูรายชื่อ</li>
            </ul>
          </div>
          <div className="ref-top-card rose">
            <div className="ref-card-kicker rose" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="shield" size={20} /> สิทธิของเจ้าของข้อมูล 7 ข้อ
            </div>
            <ol className="ref-circle-num-list rose">
              <li><span>1</span> <div><b>ได้รับแจ้ง</b> รู้ว่าเก็บอะไร เพื่ออะไร</div></li>
              <li><span>2</span> <div><b>ขอดู ขอสำเนา</b> ข้อมูลของตัวเอง</div></li>
              <li><span>3</span> <div><b>ขอให้แก้ไข</b> เมื่อข้อมูลผิด</div></li>
              <li><span>4</span> <div><b>ขอให้ลบ</b> เมื่อหมดความจำเป็น</div></li>
              <li><span>5</span> <div><b>ขอให้ระงับ</b> หยุดใช้ชั่วคราว</div></li>
              <li><span>6</span> <div><b>คัดค้าน</b> เช่น ไม่ให้ใช้ทำโฆษณา</div></li>
              <li><span>7</span> <div><b>ขอโอนย้าย</b> ไปผู้ให้บริการอื่น</div></li>
            </ol>
          </div>
        </div>
        <div className="ref-outline-alert rose">
          <Icon name="scale" size={22} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <b>ฝ่าฝืน PDPA มีโทษครบ 3 ด้าน:</b>
            <span className="ref-tag-chip rose"><b>ทางแพ่ง</b> ชดใช้ค่าเสียหาย</span>
            <span className="ref-tag-chip rose"><b>ทางอาญา</b> จำคุก / ปรับ</span>
            <span className="ref-tag-chip rose"><b>ทางปกครอง</b> ปรับสูงสุด 5 ล้านบาท</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "s3-p31",
    theme: "rose",
    icon: "eye",
    tag: "ชุดที่ 3 · Deepfake",
    title: "จับผิด Deepfake ด้วย 4 วิธี",
    footer: "ว32281 · หน่วยที่ 1 · ชุดที่ 3",
    content: (
      <div className="ref-stack">
        <div className="ref-soft-box rose">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
            <span className="ref-status-pill purple-solid">Deep Learning</span>
            <b className="hl-coral">+</b>
            <span className="ref-status-pill rose-solid">Fake (ปลอม)</span>
            <b className="hl-coral">=</b>
            <span className="ref-status-pill rose-solid">Deepfake</span>
            <span>ภาพ เสียง หรือคลิปที่ AI สร้างให้เหมือนคนจริงพูดหรือทำสิ่งที่เขาไม่เคยทำ</span>
          </div>
        </div>
        <div className="ref-cards-4">
          <div className="ref-top-card rose">
            <span className="ref-ic-box lg rose"><Icon name="eye" size={24} /></span>
            <div className="ref-card-kicker rose">วิธีที่ 1 · ใช้ตา</div>
            <h4>ดูใบหน้า & แสงเงา</h4>
            <ul className="ref-bul-list">
              <li>ปากขยับไม่ตรงเสียง</li>
              <li>ตากะพริบแปลก ๆ</li>
              <li>ขอบหน้า ฟัน นิ้วมือเบลอ</li>
            </ul>
          </div>
          <div className="ref-top-card rose">
            <span className="ref-ic-box lg rose"><Icon name="mic" size={24} /></span>
            <div className="ref-card-kicker rose">วิธีที่ 2 · ใช้หู</div>
            <h4>ฟังน้ำเสียง</h4>
            <ul className="ref-bul-list">
              <li>เสียงแบน ไร้อารมณ์</li>
              <li>จังหวะหายใจผิดธรรมชาติ</li>
              <li>พูดเร่งรัดให้รีบโอนเงิน</li>
            </ul>
          </div>
          <div className="ref-top-card rose">
            <span className="ref-ic-box lg rose"><Icon name="search" size={24} /></span>
            <div className="ref-card-kicker rose">วิธีที่ 3 · ใช้เหตุผล</div>
            <h4>เช็กแหล่งที่มา</h4>
            <ul className="ref-bul-list">
              <li>ใครโพสต์เป็นคนแรก</li>
              <li>สำนักข่าวหลักรายงานไหม</li>
              <li>ค้นหาภาพย้อนกลับ</li>
            </ul>
          </div>
          <div className="ref-top-card solid-rose">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="ref-card-icon white"><Icon name="phone" size={24} /></span>
              <span className="ref-status-pill gold-solid">ได้ผลที่สุด!</span>
            </div>
            <div className="ref-card-kicker light">วิธีที่ 4 · ใช้การยืนยัน</div>
            <h4 style={{ color: '#FFF' }}>วางสายแล้วโทรกลับ</h4>
            <ul className="ref-bul-list light">
              <li>วางสายก่อน อย่ารีบโอน</li>
              <li>โทรกลับเบอร์เดิมที่บันทึกไว้</li>
              <li>ถามคำถามลับที่รู้กันในบ้าน</li>
            </ul>
          </div>
        </div>
        <div className="ref-outline-alert rose">
          <Icon name="alert" size={22} />
          <span><b>ระวัง:</b> Deepfake ยุคใหม่สมจริงจนตาเปล่าแทบดูไม่ออก <b>วิธีที่ 3 (เช็กที่มา) และวิธีที่ 4 (โทรกลับยืนยัน)</b> จึงสำคัญที่สุด</span>
        </div>
      </div>
    )
  },
  {
    id: "s3-p32",
    theme: "rose",
    icon: "camera",
    tag: "ชุดที่ 3 · Deepfake",
    title: "Deepfake ทำได้ 3 แบบ (รู้ทันเพื่อป้องกันตัว)",
    footer: "ว32281 · หน่วยที่ 1 · ชุดที่ 3",
    content: (
      <div className="ref-stack">
        <div className="ref-cards-3">
          <div className="ref-top-card blue">
            <SlideSceneArt kind="face-swap" />
            <div className="ref-icon-head">
              <span className="ref-ic-box blue"><Icon name="camera" size={20} /></span>
              <div>
                <div className="ref-card-kicker blue">แบบที่ 1 · Face Swap</div>
                <h4>สลับใบหน้า</h4>
              </div>
            </div>
            <p>AI เรียนรู้ใบหน้าจากรูปหรือคลิป แล้วนำไปสวมทับใบหน้าคนอื่นในคลิปวิดีโอ</p>
            <div className="ref-ex-line blue"><b>อันตราย:</b> เอาหน้าเพื่อนไปใส่ในภาพน่าอับอาย</div>
          </div>
          <div className="ref-top-card gold">
            <SlideSceneArt kind="voice-clone" />
            <div className="ref-icon-head">
              <span className="ref-ic-box gold"><Icon name="mic" size={20} /></span>
              <div>
                <div className="ref-card-kicker gold">แบบที่ 2 · Voice Cloning</div>
                <h4>ปลอมเสียงพูด</h4>
              </div>
            </div>
            <p>AI ฟังเสียงตัวอย่างเพียงไม่กี่วินาที แล้วสังเคราะห์ประโยคใหม่ด้วยน้ำเสียงคนนั้น</p>
            <div className="ref-ex-line gold"><b>อันตราย:</b> ปลอมเสียงลูกโทรหลอกพ่อแม่โอนเงิน</div>
          </div>
          <div className="ref-top-card rose">
            <SlideSceneArt kind="ai-gen" />
            <div className="ref-icon-head">
              <span className="ref-ic-box rose"><Icon name="image" size={20} /></span>
              <div>
                <div className="ref-card-kicker rose">แบบที่ 3 · AI-Generated</div>
                <h4>สร้างใหม่ทั้งหมด</h4>
              </div>
            </div>
            <p>สร้างภาพหรือคลิปของบุคคลที่ไม่มีอยู่จริง หรือเหตุการณ์ที่ไม่เคยเกิดขึ้นเลย</p>
            <div className="ref-ex-line rose"><b>อันตราย:</b> ภาพข่าวปลอม เช่น ไฟไหม้หรือภัยพิบัติลวง</div>
          </div>
        </div>
        <div className="ref-outline-alert rose">
          <Icon name="shield" size={24} />
          <div>
            <div><b className="hl-coral">วิธีป้องกันตัวเอง:</b> ปัจจุบัน AI ใช้รูปและเสียงตั้งต้นน้อยลงมาก สิ่งที่เราโพสต์สาธารณะจึงอาจถูกผู้ไม่หวังดีนำไปใช้ได้</div>
            <div className="ref-chip-group" style={{ marginTop: 8 }}>
              <span className="ref-tag-chip rose"><Icon name="lock" size={14} /> ตั้งบัญชีโซเชียลเป็นส่วนตัว</span>
              <span className="ref-tag-chip rose"><Icon name="eye" size={14} /> คิดก่อนโพสต์รูปหน้าชัด ๆ และคลิปเสียง</span>
              <span className="ref-tag-chip rose"><Icon name="users" size={14} /> ตั้งรหัสลับไว้ถามยืนยันกันในครอบครัว</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "s3-p33",
    theme: "rose",
    icon: "scale",
    tag: "ชุดที่ 3 · กฎหมายที่ใช้ได้แล้ว",
    title: "ทำ Deepfake ทำร้ายคนอื่น ผิดกฎหมายไทยแล้วตอนนี้",
    footer: "ว32281 · หน่วยที่ 1 · ชุดที่ 3 · ร่าง พ.ร.บ. AI จะเพิ่มมาตรการ Deepfake 4 ชั้น ยังไม่บังคับใช้",
    content: (
      <div className="ref-stack">
        <div className="ref-law-layout">
          <div className="ref-grid-2x2">
            <div className="ref-left-card rose">
              <span className="ref-ic-box rose"><Icon name="image" size={20} /></span>
              <div>
                <span className="ref-status-pill rose-solid">พ.ร.บ.คอมพิวเตอร์ ม.16</span>
                <p style={{ marginTop: 6 }}><b>ผิดเมื่อ:</b> โพสต์ภาพตัดต่อ ทำให้คนอื่นอับอาย เสียชื่อเสียง</p>
                <p className="hl-coral" style={{ marginTop: 4 }}><b>โทษ:</b> จำคุกไม่เกิน 3 ปี และปรับไม่เกิน 200,000 บาท</p>
              </div>
            </div>
            <div className="ref-left-card rose">
              <span className="ref-ic-box rose"><Icon name="alert" size={20} /></span>
              <div>
                <span className="ref-status-pill rose-solid">พ.ร.บ.คอมพิวเตอร์ ม.14(1)</span>
                <p style={{ marginTop: 6 }}><b>ผิดเมื่อ:</b> นำข้อมูลเท็จเข้าสู่ระบบเพื่อหลอกลวง เช่น คลิปปลอมชวนลงทุน</p>
                <p className="hl-coral" style={{ marginTop: 4 }}><b>โทษ:</b> จำคุกไม่เกิน 5 ปี หรือปรับไม่เกิน 100,000 บาท</p>
              </div>
            </div>
            <div className="ref-left-card gold">
              <span className="ref-ic-box gold"><Icon name="chat" size={20} /></span>
              <div>
                <span className="ref-status-pill gold-solid">ประมวลกฎหมายอาญา ม.328</span>
                <p style={{ marginTop: 6 }}><b>ผิดเมื่อ:</b> หมิ่นประมาทด้วยการโฆษณาผ่านภาพ คลิป หรือข้อความ</p>
                <p className="hl-gold" style={{ marginTop: 4 }}><b>โทษ:</b> จำคุกไม่เกิน 2 ปี และปรับไม่เกิน 200,000 บาท</p>
              </div>
            </div>
            <div className="ref-left-card gold">
              <span className="ref-ic-box gold"><Icon name="scale" size={20} /></span>
              <div>
                <span className="ref-status-pill gold-solid">ประมวลกฎหมายอาญา ม.341, 343</span>
                <p style={{ marginTop: 6 }}><b>ผิดเมื่อ:</b> หลอกลวงจนได้เงินหรือทรัพย์สินไป (ความผิดฐานฉ้อโกง)</p>
                <p className="hl-gold" style={{ marginTop: 4 }}><b>โทษ:</b> ตามฐานฉ้อโกง หากหลอกประชาชนทั่วไป (ม.343) โทษหนักขึ้น</p>
              </div>
            </div>
          </div>
          <div className="ref-soft-box rose">
            <div className="ref-card-kicker rose" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="shield" size={20} /> ถ้าตกเป็นผู้เสียหาย ทำ 4 ขั้นตอน
            </div>
            <ol className="ref-circle-num-list rose" style={{ marginTop: 10 }}>
              <li><span>1</span> <div><b>เก็บหลักฐานก่อน</b> แคปให้เห็น URL ชื่อบัญชี วันเวลา</div></li>
              <li><span>2</span> <div><b>บอกผู้ใหญ่ที่ไว้ใจ</b> พ่อแม่ ผู้ปกครอง หรือครู</div></li>
              <li><span>3</span> <div><b>รายงานแพลตฟอร์ม</b> กด Report ขอให้ลบเนื้อหา</div></li>
              <li><span>4</span> <div><b>แจ้งความภายใน 3 เดือน</b> ตำรวจไซเบอร์ โทร <b>1441</b></div></li>
            </ol>
          </div>
        </div>
        <div className="ref-soft-banner gold">
          <Icon name="alert" size={20} />
          <span><b>คนแชร์หรือส่งต่อก็เสี่ยงผิดกฎหมาย!</b> เพราะถือว่าช่วยเผยแพร่ เมื่อพบเห็นควรหยุดส่งต่อ กดรายงาน และแจ้งเจ้าตัวหรือครู</span>
        </div>
      </div>
    )
  },
  {
    id: "s3-p34",
    theme: "rose",
    icon: "clock",
    tag: "ชุดที่ 3 · การแจ้งความดำเนินคดี",
    title: "แจ้งความต้องรีบ: ความผิดยอมความได้ กับ อาญาแผ่นดิน",
    footer: "ว32281 · หน่วยที่ 1 · ชุดที่ 3 · ที่มา: Legardy, เดลินิวส์",
    content: (
      <div className="ref-stack">
        <div className="ref-split-2">
          <div className="ref-top-card gold">
            <div className="ref-icon-head" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="ref-ic-box lg gold"><Icon name="clock" size={24} /></span>
                <div>
                  <h4>ความผิดอันยอมความได้</h4>
                  <small>เช่น ตัดต่อภาพ ม.16 · หมิ่นประมาท ม.328</small>
                </div>
              </div>
              <span className="ref-status-pill gold-solid">ต้องแจ้งใน 3 เดือน</span>
            </div>
            <div className="ref-qa-box gold">
              <small>ใครเริ่มคดี</small>
              <div>ผู้เสียหายต้องไปร้องทุกข์ด้วยตนเอง</div>
            </div>
            <div className="ref-qa-box gold">
              <small>มีเวลาจำกัดไหม</small>
              <div><b className="hl-coral">มี! ภายใน 3 เดือน</b> นับแต่รู้เรื่องและรู้ตัวผู้กระทำผิด เลยกำหนดแล้วขาดอายุความ</div>
            </div>
            <div className="ref-qa-box gold">
              <small>ตกลงยอมความกันได้ไหม</small>
              <div>ได้ ถ้ายอมความกันหรือถอนคำร้องทุกข์ คดีอาญาระงับทันที</div>
            </div>
          </div>
          <div className="ref-top-card rose">
            <div className="ref-icon-head" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="ref-ic-box lg rose"><Icon name="scale" size={24} /></span>
                <div>
                  <h4>ความผิดอาญาแผ่นดิน</h4>
                  <small>เช่น ข้อมูลเท็จหลอกลวง ม.14(1) · ฉ้อโกงประชาชน ม.343</small>
                </div>
              </div>
              <span className="ref-status-pill rose-solid">ยอมความไม่ได้</span>
            </div>
            <div className="ref-qa-box rose">
              <small>ใครเริ่มคดี</small>
              <div>รัฐดำเนินคดีเองได้ และผู้ใดพบเห็นก็กล่าวโทษแจ้งความได้</div>
            </div>
            <div className="ref-qa-box rose">
              <small>มีเวลาจำกัดไหม</small>
              <div>ไม่จำกัดแค่ 3 เดือน (ใช้อายุความยาวนานตามอัตราโทษ เช่น 10–15 ปี)</div>
            </div>
            <div className="ref-qa-box rose">
              <small>ตกลงยอมความกันได้ไหม</small>
              <div>ไม่ได้ แม้ผู้เสียหายไม่ติดใจ ตำรวจและอัยการก็ยังต้องดำเนินคดีต่อ</div>
            </div>
          </div>
        </div>
        <div className="ref-outline-alert rose">
          <Icon name="alert" size={22} />
          <span><b className="hl-coral">ข้อสำคัญเมื่อไปสถานีตำรวจ:</b> ต้องแจ้งว่าขอ <b>“ร้องทุกข์เพื่อดำเนินคดีตามกฎหมาย”</b> เพราะการลงบันทึกประจำวันไว้เป็นหลักฐานเฉย ๆ ยังไม่นับเป็นการร้องทุกข์!</span>
        </div>
      </div>
    )
  },
  {
    id: "s3-congrats",
    variant: "divider",
    theme: "dark-rose",
    tag: "เรียนจบชุดที่ 3",
    title: "AIra แสดงความยินดี · เรียนจบข้อมูลส่วนบุคคล (PDPA) และ Deepfake",
    hideDoneBanner: true,
    content: (
      <AIraSlideCongrats
        tone="rose"
        stepBadge="MISSION 3 / 3 COMPLETED · จบครบทั้ง 3 ชุดสไลด์!"
        completedTitle="ข้อมูลส่วนบุคคล (PDPA) และ Deepfake"
        congratsSpeech="ปรบมือให้ตัวเองดัง ๆ เลย! นักเรียนเรียนเนื้อหาสไลด์หน่วยที่ 1 ครบทั้ง 3 เรื่องเรียบร้อยแล้ว รู้ทันทั้งเทคโนโลยี AI จริยธรรม ความเสี่ยง กฎหมาย PDPA และ Deepfake ขั้นต่อไปไปลงมือทำกิจกรรมและทำแบบทดสอบหลังเรียนกันเลย!"
        nextKicker="ขั้นตอนต่อไป · ลงมือปฏิบัติ & วัดผล"
        nextIcon="sparkle"
        nextTitle="กิจกรรมที่ 1.1–1.2 และแบบทดสอบหลังเรียน หน่วยที่ 1 (10 ข้อ)"
        nextDesc="กลับไปยังหน้าชุดการเรียนรู้เพื่อทำกิจกรรม AI Research & Infographic Sprint / AI Garden Designer หรือเริ่มทำแบบทดสอบหลังเรียน 10 ข้อทันที"
        primaryLabel="ไปขั้นต่อไป: กิจกรรมลงมือปฏิบัติ (เมนูบทเรียน)"
        onPrimary={() => finishSlideSet(["u1-l5", "u1-l6"], "u1-item-3", "ชุดที่ 3: PDPA และ Deepfake", "cover")}
        secondaryLabel="เริ่มทำแบบทดสอบหลังเรียน (10 ข้อ)"
        onSecondary={() => finishSlideSet(["u1-l5", "u1-l6"], "u1-item-3", "ชุดที่ 3: PDPA และ Deepfake", "posttest")}
        sheetLabel="อ่านใบความรู้เรื่องที่ 3"
        onOpenSheet={() => finishSlideSet(["u1-l5", "u1-l6"], "u1-item-3", "ชุดที่ 3: PDPA และ Deepfake", "ks3")}
      />
    )
  }
];
}
