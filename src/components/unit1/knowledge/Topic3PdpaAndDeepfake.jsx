import React from 'react';
import { Icon } from '../../UIPrimitives.jsx';
import { COURSE } from '../../../data/courseData.js';
import { KS_TABS } from './knowledgeData.js';
import { KS_IMAGES } from './knowledgeImages.js';
import {
  U1_KS_ART,
  KsHeroArtCard,
  KsSceneGraphic,
  QuickQuizBox,
  scrollToKnowledgeSection
} from './KnowledgeWidgets.jsx';

/* =====================================================================
   ใบความรู้หน่วยที่ 1 · ตอนที่ 3: ข้อมูลส่วนบุคคล (PDPA) และ Deepfake
   ===================================================================== */

export default function Topic3PdpaAndDeepfake({ checkedItems = {}, handleCompleteTopic }) {
  return (
    <article className="u1ks-sheet theme-rose" id="ks-part-3">
      <header className="u1ks-hero rose">
        <div className="u1ks-hero-text">
          <div className="u1ks-hero-badges">
            <span className="u1ks-pill-solid rose">ใบความรู้ 1.1 · ตอนที่ 3</span>
            <span className="u1ks-pill-soft">{COURSE.code} {COURSE.name} · {COURSE.levelShort}</span>
          </div>
          <h1>ข้อมูลส่วนบุคคล (PDPA) และ Deepfake</h1>
          <p className="u1ks-hero-sub">
            รู้เท่าทันสิทธิคุ้มครองข้อมูลส่วนบุคคลตามกฎหมาย PDPA ที่มีผลบังคับใช้แล้ว ฝึกทักษะจับผิดและป้องกันภัยจากคลิปปลอม Deepfake พร้อมเรียนรู้ข้อกฎหมายไทยที่ใช้ดำเนินคดีได้จริงในปัจจุบัน
          </p>
          <div className="u1ks-goals-box">
            <div className="u1ks-goals-title">
              <Icon name="target" size={16} /> เป้าหมายการเรียนรู้ประจำบท
            </div>
            <ul>
              <li>แยกข้อมูลส่วนบุคคลทั่วไปกับข้อมูลอ่อนไหว ระบุ 3 บทบาทใน PDPA ความยินยอม และสิทธิ 7 ข้อได้</li>
              <li>อธิบายรูปแบบของ Deepfake และใช้ 4 วิธีตรวจสอบเพื่อไม่ให้ตกเป็นเหยื่อหลอกลวงได้</li>
              <li>ระบุข้อกฎหมายไทยที่ใช้เอาผิด Deepfake ได้ทันที รวมถึงขั้นตอนแจ้งความร้องทุกข์อย่างถูกต้อง</li>
            </ul>
          </div>
        </div>
        <div className="u1ks-hero-art">
          <KsHeroArtCard
            imageSrc={U1_KS_ART.deepfakeSafety}
            imageAlt="ภาพแนวคิดการคุ้มครองข้อมูลส่วนบุคคลและการตรวจสอบสื่อสังเคราะห์ Deepfake"
            subCaption="PDPA & Deepfake Safety"
            caption="ตอนที่ 3 / 3 · กฎหมายใกล้ตัว & ภัยไซเบอร์"
            mood="happy"
            tone="rose"
          />
        </div>
      </header>

      <div className="u1ks-toc-strip no-print">
        <span>หัวข้อย่อย:</span>
        <button type="button" onClick={() => scrollToKnowledgeSection('p3-s1')}>
          <Icon name="alert" size={14} /> 1. กรณีศึกษาของ “ต้น”
        </button>
        <button type="button" onClick={() => scrollToKnowledgeSection('p3-s2')}>
          <Icon name="lock" size={14} /> 2. รู้จัก PDPA & ข้อมูลอ่อนไหว
        </button>
        <button type="button" onClick={() => scrollToKnowledgeSection('p3-s3')}>
          <Icon name="users" size={14} /> 3. 3 บทบาท & สิทธิ 7 ข้อ
        </button>
        <button type="button" onClick={() => scrollToKnowledgeSection('p3-s4')}>
          <Icon name="eye" size={14} /> 4. จับผิด Deepfake 4 วิธี
        </button>
        <button type="button" onClick={() => scrollToKnowledgeSection('p3-s5')}>
          <Icon name="camera" size={14} /> 5. Deepfake 3 แบบ & การป้องกัน
        </button>
        <button type="button" onClick={() => scrollToKnowledgeSection('p3-s6')}>
          <Icon name="scale" size={14} /> 6. กฎหมายเอาผิด & แจ้งความ 3 เดือน
        </button>
      </div>

      {/* 3.1 กรณีศึกษาเปิดเรื่อง */}
      <section className="u1ks-section" id="p3-s1">
        <div className="u1ks-case-banner rose">
          <div className="u1ks-case-icon"><Icon name="alert" size={26} /></div>
          <div>
            <span className="u1ks-case-kicker">สถานการณ์เปิดเรื่อง · เกิดขึ้นได้จริงในวัยเรียน</span>
            <h3>เช้าวันจันทร์อันวุ่นวายของ “ต้น”</h3>
            <p>
              เช้าวันจันทร์ “ต้น” พบว่าภาพใบหน้าของตนเองถูกคนนำ AI ไปตัดต่อเป็นภาพน่าอับอาย แล้วส่งต่อในกลุ่มไลน์ห้องเรียนมากกว่า <b>40 ครั้ง</b> ตกเย็นวันเดียวกัน แม่ของต้นยังได้รับสายโทรศัพท์ที่มี<b>น้ำเสียงเหมือนต้นทุกประการ</b> โทรมาขอให้รีบโอนเงินด่วน <b>5,000 บาท</b> — เหตุการณ์นี้ผิดกฎหมายข้อใดบ้าง? คนกดแชร์ผิดด้วยไหม? และถ้าเป็นต้นควรทำอย่างไรเป็นอย่างแรก?
            </p>
            <div className="u1ks-case-tags rose">
              <span><Icon name="image" size={14} /> ตัดต่อภาพแชร์ต่อ 40+ ครั้ง</span>
              <span><Icon name="phone" size={14} /> ปลอมเสียงหลอกโอนเงิน 5,000 บาท</span>
              <span><Icon name="scale" size={14} /> แจ้งความร้องทุกข์อย่างไรให้ทันเวลา?</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3.2 PDPA ข้อมูลส่วนบุคคล vs ข้อมูลอ่อนไหว */}
      <section className="u1ks-section" id="p3-s2">
        <div className="u1ks-sec-head">
          <span className="u1ks-sec-num rose">01</span>
          <div>
            <h2>พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)</h2>
            <p><span className="u1ks-inline-tag green">บังคับใช้จริงแล้วตั้งแต่วันที่ 1 มิถุนายน 2565</span> เพื่อคุ้มครองไม่ให้ใครนำข้อมูลส่วนตัวของเราไปเก็บ ใช้ หรือเปิดเผยโดยมิชอบ</p>
          </div>
        </div>

        <div className="u1ks-split-2">
          <div className="u1ks-compare-card blue">
            <div className="u1ks-compare-top">
              <span className="u1ks-compare-pill blue"><Icon name="user" size={13} /> ข้อมูลส่วนบุคคลทั่วไป</span>
              <span className="u1ks-ic-circle sm blue"><Icon name="fileText" size={17} /></span>
            </div>
            <div className="u1ks-card-scene">
              <KsSceneGraphic kind="pdpa-id" />
            </div>
            <h4>ระบุตัวบุคคลได้ทางตรงหรือทางอ้อม</h4>
            <p>ข้อมูลใด ๆ ที่ทำให้รู้ว่าเป็นใคร ไม่ว่าจากข้อมูลชิ้นนั้นโดยตรง หรือเมื่อนำไปประกอบรวมกับข้อมูลอื่น (ไม่รวมข้อมูลของผู้เสียชีวิต)</p>
            <div className="u1ks-tag-cloud">
              <span>ชื่อ–นามสกุล</span>
              <span>เลขประจำตัวประชาชน</span>
              <span>เบอร์โทรศัพท์</span>
              <span>ที่อยู่ / อีเมล</span>
              <span>รูปถ่ายที่เห็นใบหน้า</span>
            </div>
          </div>

          <div className="u1ks-compare-card rose">
            <div className="u1ks-compare-top">
              <span className="u1ks-compare-pill rose"><Icon name="lock" size={13} /> ข้อมูลส่วนบุคคลอ่อนไหว (มาตรา 26)</span>
              <span className="u1ks-ic-circle sm rose"><Icon name="shield" size={17} /></span>
            </div>
            <div className="u1ks-dual-photo-strip">
              <div className="u1ks-dual-photo-item">
                <img src={KS_IMAGES.subfieldCv} alt="ข้อมูลจำลองใบหน้า Biometrics" loading="lazy" />
                <span>ข้อมูลจำลองใบหน้า</span>
              </div>
              <div className="u1ks-dual-photo-item">
                <img src={KS_IMAGES.appHealthcare} alt="ข้อมูลสุขภาพและประวัติการรักษา" loading="lazy" />
                <span>ข้อมูลสุขภาพ</span>
              </div>
            </div>
            <h4>ต้องขอ “ความยินยอมโดยชัดแจ้ง” ก่อนเก็บ</h4>
            <p>ข้อมูลที่มีความละเอียดอ่อนสูง หากรั่วไหลอาจทำให้เจ้าของข้อมูลถูกเลือกปฏิบัติหรือได้รับความเสียหายร้ายแรง กฎหมายจึงคุ้มครองเข้มงวดเป็นพิเศษ</p>
            <div className="u1ks-tag-cloud rose">
              <span>เชื้อชาติ / ศาสนา</span>
              <span>ข้อมูลสุขภาพ / ความพิการ</span>
              <span>ประวัติอาชญากรรม</span>
              <span>ลายนิ้วมือ</span>
              <span>ข้อมูลจำลองใบหน้า (Biometrics)</span>
            </div>
          </div>
        </div>

        <div className="u1ks-note-box amber" style={{ marginTop: 14 }}>
          <span className="u1ks-ic-circle sm amber"><Icon name="chat" size={18} /></span>
          <div>
            <b>ข้อควรระวังเมื่อใช้แชตบอต AI (แนวปฏิบัติ PDPA กับ AI ของ สคส. ต.ค. 2569):</b> ทั้งข้อความที่เราพิมพ์สั่ง AI (Prompt) และไฟล์ที่อัปโหลดเข้าไปอาจถูกเก็บไว้ในระบบของผู้ให้บริการ ดังนั้น <b>ห้ามพิมพ์เลขบัตรประชาชน เบอร์โทร ข้อมูลสุขภาพ หรืออัปโหลดรูปเพื่อนลงในแชตบอตสาธารณะโดยไม่จำเป็นและไม่ได้รับความยินยอม</b>
          </div>
        </div>
      </section>

      {/* 3.3 ใครเป็นใครใน PDPA + ความยินยอม + สิทธิ 7 ข้อ */}
      <section className="u1ks-section" id="p3-s3">
        <div className="u1ks-sec-head">
          <span className="u1ks-sec-num rose">02</span>
          <div>
            <h2>3 บทบาทหลักใน PDPA ความยินยอมที่ถูกต้อง และสิทธิ 7 ข้อของเรา</h2>
            <p>จำง่าย ๆ ด้วย 3 คำสำคัญ: <b>“เป็นเจ้าของ · เป็นคนตัดสินใจ · ทำตามคำสั่ง”</b> (กำกับดูแลโดย สคส. หรือ PDPC)</p>
          </div>
        </div>

        <div className="u1ks-cards-3">
          <div className="u1ks-pdpa-role tone-blue">
            <div className="u1ks-ethic8-top">
              <span className="u1ks-role-chip blue">1. เป็นเจ้าของ</span>
              <span className="u1ks-ic-circle sm blue"><Icon name="user" size={17} /></span>
            </div>
            <h4>เจ้าของข้อมูลส่วนบุคคล</h4>
            <small>Data Subject</small>
            <p>บุคคลธรรมดาที่ข้อมูลนั้นระบุไปถึง มีสิทธิรับรู้ ขอดู ขอแก้ไข หรือขอลบข้อมูลของตน เช่น <b>นักเรียนที่กรอกใบสมัครเรียน</b></p>
          </div>
          <div className="u1ks-pdpa-role tone-indigo">
            <div className="u1ks-ethic8-top">
              <span className="u1ks-role-chip indigo">2. เป็นคนตัดสินใจ</span>
              <span className="u1ks-ic-circle sm indigo"><Icon name="shield" size={17} /></span>
            </div>
            <h4>ผู้ควบคุมข้อมูลส่วนบุคคล</h4>
            <small>Data Controller</small>
            <p>บุคคลหรือองค์กรที่มีอำนาจตัดสินใจว่าจะเก็บข้อมูลอะไร ไปใช้เพื่ออะไร และต้องรับผิดชอบหลัก เช่น <b>โรงเรียน หรือบริษัทเจ้าของแอป</b></p>
          </div>
          <div className="u1ks-pdpa-role tone-teal">
            <div className="u1ks-ethic8-top">
              <span className="u1ks-role-chip teal">3. ทำตามคำสั่ง</span>
              <span className="u1ks-ic-circle sm teal"><Icon name="cpu" size={17} /></span>
            </div>
            <h4>ผู้ประมวลผลข้อมูลส่วนบุคคล</h4>
            <small>Data Processor</small>
            <p>ผู้ที่ดำเนินการเก็บหรือประมวลผลข้อมูลแทนตามคำสั่งของผู้ควบคุมเท่านั้น ห้ามนำไปใช้เอง เช่น <b>บริษัทระบบคลาวด์ที่โรงเรียนจ้างเก็บคะแนนสอบ</b></p>
          </div>
        </div>

        <h3 className="u1ks-subhead">การขอความยินยอม (Consent): แบบไหนถูกต้อง vs ไม่ถูกต้อง?</h3>
        <div className="u1ks-split-2">
          <div className="u1ks-consent-card ok">
            <h4>
              <span className="u1ks-ic-circle sm emerald"><Icon name="check" size={17} /></span>
              <span>การขอความยินยอมที่ถูกต้องตามกฎหมาย</span>
            </h4>
            <ul>
              <li>แจ้งวัตถุประสงค์ชัดเจนว่าเก็บข้อมูลอะไร ไปใช้ทำอะไร</li>
              <li>แยกส่วนออกจากเงื่อนไขสัญญาอื่นอย่างชัดเจน อ่านเข้าใจง่าย</li>
              <li>ให้ผู้ใช้อิสระในการเลือกเอง ไม่บังคับ และถอนความยินยอมได้ง่ายเมื่อไรก็ได้</li>
              <li><i>หมายเหตุ:</i> กรณีผู้เยาว์อายุไม่เกิน 10 ปี ต้องขอความยินยอมจากผู้ปกครองโดยตรง (มาตรา 20)</li>
            </ul>
          </div>
          <div className="u1ks-consent-card bad">
            <h4>
              <span className="u1ks-ic-circle sm rose"><Icon name="x" size={17} /></span>
              <span>การขอความยินยอมที่ไม่ถูกต้อง (หลอกลวง/มัดมือชก)</span>
            </h4>
            <ul>
              <li>ซ่อนข้อความขออนุญาตไว้ในเงื่อนไขตัวหนังสือขนาดเล็กยาวหลายหน้า</li>
              <li>ทำเครื่องหมายถูก (Pre-ticked box) ไว้ในช่องยินยอมให้ล่วงหน้า</li>
              <li>ขอสิทธิ์เข้าถึงข้อมูลเกินความจำเป็น เช่น <b>แอปไฟฉายแต่บังคับขอดูรายชื่อผู้ติดต่อและรูปภาพทั้งหมด</b></li>
            </ul>
          </div>
        </div>

        <h3 className="u1ks-subhead">สิทธิของเจ้าของข้อมูลส่วนบุคคล 7 ประการ และบทลงโทษ 3 ด้าน</h3>
        <div className="u1ks-rights-grid">
          {[
            ['1', 'info', 'blue', 'สิทธิได้รับแจ้ง', 'รู้ตั้งแต่ต้นว่าใครเก็บข้อมูลอะไร ไปใช้เพื่ออะไร'],
            ['2', 'search', 'teal', 'สิทธิขอเข้าถึงและขอสำเนา', 'ขอดูและขอรับสำเนาข้อมูลของตนเองได้'],
            ['3', 'fileText', 'amber', 'สิทธิขอให้แก้ไข', 'เมื่อข้อมูลไม่ถูกต้องหรือเปลี่ยนใหม่ให้เป็นปัจจุบัน'],
            ['4', 'x', 'rose', 'สิทธิขอให้ลบหรือทำลาย', 'เมื่อหมดความจำเป็นหรือถอนความยินยอมแล้ว'],
            ['5', 'lock', 'indigo', 'สิทธิขอให้ระงับการใช้', 'สั่งให้หยุดใช้ข้อมูลชั่วคราวระหว่างรอตรวจสอบ'],
            ['6', 'eyeOff', 'violet', 'สิทธิคัดค้าน', 'เช่น คัดค้านไม่ให้นำข้อมูลไปใช้ทำการตลาดตรง'],
            ['7', 'refresh', 'emerald', 'สิทธิขอโอนย้ายข้อมูล', 'ขอรับข้อมูลในรูปแบบดิจิทัลเพื่อส่งต่อผู้ให้บริการรายอื่น']
          ].map(([num, icon, tone, title, desc]) => (
            <div key={num} className={`u1ks-right-pill-card tone-${tone}`}>
              <span className={`u1ks-ic-circle sm ${tone}`}>
                <Icon name={icon} size={16} />
              </span>
              <div>
                <b>{num}. {title}</b>
                <span>{desc}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="u1ks-penalty-bar">
          <b><Icon name="scale" size={17} /> ฝ่าฝืน PDPA มีความรับผิดครบทั้ง 3 ด้าน:</b>
          <span className="p-chip"><b>ทางแพ่ง:</b> ชดใช้ค่าเสียหายจริง + ค่าสินไหมเชิงลงโทษสูงสุด 2 เท่า</span>
          <span className="p-chip"><b>ทางอาญา:</b> จำคุกไม่เกิน 6 เดือน – 1 ปี หรือปรับไม่เกิน 5 แสน – 1 ล้านบาท</span>
          <span className="p-chip"><b>ทางปกครอง:</b> โทษปรับสูงสุดไม่เกิน <b>5,000,000 บาท</b></span>
        </div>
      </section>

      {/* 3.4 จับผิด Deepfake 4 วิธี */}
      <section className="u1ks-section" id="p3-s4">
        <div className="u1ks-sec-head">
          <span className="u1ks-sec-num rose">03</span>
          <div>
            <h2>รู้จัก Deepfake และเทคนิคจับผิด 4 วิธี</h2>
            <p><code>Deep Learning</code> + <code>Fake (ของปลอม)</code> = <b>Deepfake</b> คือภาพ เสียง หรือวิดีโอที่ AI สังเคราะห์ขึ้นให้ดูเหมือนบุคคลจริงกำลังพูดหรือทำในสิ่งที่เขาไม่เคยทำ</p>
          </div>
        </div>

        <div className="u1ks-cards-4">
          <div className="u1ks-df4-card tone-rose">
            <div className="u1ks-vocab-head">
              <span className="u1ks-ic-circle rose"><Icon name="eye" size={20} /></span>
              <small>วิธีที่ 1 · ใช้ตาสังเกต</small>
            </div>
            <div className="u1ks-card-scene">
              <KsSceneGraphic kind="df-check-eye" />
            </div>
            <h4>ดูใบหน้าและแสงเงา</h4>
            <ul>
              <li>ริมฝีปากขยับไม่ตรงกับเสียงพูด</li>
              <li>จังหวะกะพริบตาแข็งหรือแปลกผิดปกติ</li>
              <li>ขอบใบหน้า ซี่ฟัน หู หรือนิ้วมือเบลอผิดรูป</li>
            </ul>
          </div>

          <div className="u1ks-df4-card tone-amber">
            <div className="u1ks-vocab-head">
              <span className="u1ks-ic-circle amber"><Icon name="mic" size={20} /></span>
              <small>วิธีที่ 2 · ใช้หูฟัง</small>
            </div>
            <div className="u1ks-card-scene">
              <KsSceneGraphic kind="df-check-ear" />
            </div>
            <h4>ฟังน้ำเสียงและจังหวะ</h4>
            <ul>
              <li>โทนเสียงราบเรียบ ไร้อารมณ์ผิดธรรมชาติ</li>
              <li>จังหวะเว้นวรรคหรือเสียงหายใจแปลก ๆ</li>
              <li>มักสร้างสถานการณ์ฉุกเฉินเร่งให้รีบโอนเงิน</li>
            </ul>
          </div>

          <div className="u1ks-df4-card tone-blue">
            <div className="u1ks-vocab-head">
              <span className="u1ks-ic-circle blue"><Icon name="search" size={20} /></span>
              <small>วิธีที่ 3 · ใช้เหตุผล</small>
            </div>
            <div className="u1ks-card-scene">
              <KsSceneGraphic kind="df-check-source" />
            </div>
            <h4>เช็กแหล่งที่มา</h4>
            <ul>
              <li>ตรวจสอบว่าบัญชีใดเป็นคนโพสต์คนแรก</li>
              <li>สำนักข่าวหลักที่น่าเชื่อถือรายงานตรงกันไหม</li>
              <li>นำภาพไปค้นหาย้อนกลับ (Reverse Image Search)</li>
            </ul>
          </div>

          <div className="u1ks-df4-card best">
            <div className="u1ks-best-ribbon">ได้ผลที่สุด!</div>
            <div className="u1ks-vocab-head">
              <span className="u1ks-ic-circle white"><Icon name="phone" size={20} /></span>
              <small>วิธีที่ 4 · ใช้การยืนยัน</small>
            </div>
            <div className="u1ks-card-scene">
              <KsSceneGraphic kind="df-check-call" />
            </div>
            <h4>วางสายแล้วโทรกลับ</h4>
            <ul>
              <li>ตั้งสติ วางสายก่อน <b>อย่ารีบโอนเงินเด็ดขาด</b></li>
              <li>กดโทรกลับไปยังเบอร์เดิมของเจ้าตัวที่บันทึกไว้</li>
              <li>ถาม <b>“คำลับเฉพาะในครอบครัว”</b> เพื่อพิสูจน์ตัวจริง</li>
            </ul>
          </div>
        </div>

        <div className="u1ks-note-box rose" style={{ marginTop: 14 }}>
          <span className="u1ks-ic-circle sm rose"><Icon name="alert" size={18} /></span>
          <div>
            <b>ทำไมวิธีที่ 3 และ 4 จึงสำคัญที่สุด?</b> เพราะโมเดลสร้างภาพและเสียงยุคใหม่มีความคมชัดสมจริงสูงมากจนการมองด้วยตาเปล่าหรือฟังด้วยหูเพียงอย่างเดียวอาจแยกไม่ออก การเช็กแหล่งที่มาและการโทรกลับยืนยันนอกช่องทางเดิมจึงปลอดภัยที่สุดเสมอ
          </div>
        </div>
      </section>

      {/* 3.5 Deepfake 3 แบบ และการป้องกันตัวเอง */}
      <section className="u1ks-section" id="p3-s5">
        <div className="u1ks-sec-head">
          <span className="u1ks-sec-num rose">04</span>
          <div>
            <h2>Deepfake ทำได้ 3 รูปแบบ (รู้ทันกลไกเพื่อป้องกันตัวเอง)</h2>
            <p>ปัจจุบัน AI ใช้รูปถ่ายเพียงไม่กี่ใบหรือเสียงสั้น ๆ ไม่กี่วินาทีก็สร้างสื่อปลอมได้แล้ว</p>
          </div>
        </div>

        <div className="u1ks-cards-3">
          <div className="u1ks-dftype-card blue">
            <div className="u1ks-ethic8-top">
              <span className="u1ks-pill-solid blue">แบบที่ 1 · Face Swap</span>
              <span className="u1ks-ic-circle sm blue"><Icon name="camera" size={17} /></span>
            </div>
            <div className="u1ks-card-photo-wrap">
              <img src={KS_IMAGES.subfieldCv} alt="การวิเคราะห์โครงหน้าเพื่อสลับใบหน้า Face Swap" className="u1ks-card-photo" loading="lazy" />
            </div>
            <h4>การสลับใบหน้า</h4>
            <p>AI เรียนรู้โครงหน้าจากภาพถ่ายหรือคลิป แล้วนำไปสวมทับแทนใบหน้าบุคคลอื่นในวิดีโอ</p>
            <div className="u1ks-danger-line"><b>ภัยที่พบบ่อย:</b> นำใบหน้าเพื่อนหรือคนดังไปตัดต่อใส่ในภาพลามกหรือภาพน่าอับอาย</div>
          </div>

          <div className="u1ks-dftype-card amber">
            <div className="u1ks-ethic8-top">
              <span className="u1ks-pill-solid amber">แบบที่ 2 · Voice Cloning</span>
              <span className="u1ks-ic-circle sm amber"><Icon name="mic" size={17} /></span>
            </div>
            <div className="u1ks-card-photo-wrap">
              <img src={KS_IMAGES.subfieldSpeech} alt="การวิเคราะห์คลื่นเสียงเพื่อเลียนแบบเสียงพูด Voice Cloning" className="u1ks-card-photo" loading="lazy" />
            </div>
            <h4>การปลอมเสียงพูด</h4>
            <p>AI วิเคราะห์ตัวอย่างเสียงพูดสั้น ๆ แล้วสังเคราะห์เป็นประโยคคำพูดใหม่ด้วยน้ำเสียงของคนนั้น</p>
            <div className="u1ks-danger-line"><b>ภัยที่พบบ่อย:</b> แก๊งคอลเซ็นเตอร์ปลอมเสียงลูกหลานโทรหลอกพ่อแม่ว่าเกิดอุบัติเหตุเพื่อขอเงิน</div>
          </div>

          <div className="u1ks-dftype-card rose">
            <div className="u1ks-ethic8-top">
              <span className="u1ks-pill-solid rose">แบบที่ 3 · AI-Generated</span>
              <span className="u1ks-ic-circle sm rose"><Icon name="sparkle" size={17} /></span>
            </div>
            <div className="u1ks-card-photo-wrap">
              <img src={KS_IMAGES.techGenai} alt="การสังเคราะห์ภาพและเสียงขึ้นใหม่ทั้งหมดด้วย Generative AI" className="u1ks-card-photo" loading="lazy" />
            </div>
            <h4>สร้างขึ้นใหม่ทั้งหมด 100%</h4>
            <p>สร้างภาพบุคคลที่ไม่มีตัวตนอยู่จริง หรือสร้างคลิปเหตุการณ์จำลองที่ไม่เคยเกิดขึ้นเลย</p>
            <div className="u1ks-danger-line"><b>ภัยที่พบบ่อย:</b> สร้างภาพข่าวปลอม เช่น เหตุระเบิด ไฟไหม้ หรือคลิปคนดังชวนลงทุนปลอม</div>
          </div>
        </div>

        <div className="u1ks-safe-banner rose-tone" style={{ marginTop: 14 }}>
          <span className="u1ks-ic-circle rose"><Icon name="lock" size={22} /></span>
          <div>
            <strong>3 เกราะป้องกันตนเองไม่ให้ตกเป็นเป้าหมายของ Deepfake:</strong>
            <div className="u1ks-safe-pills">
              <span><Icon name="lock" size={14} /> 1. ตั้งค่าบัญชีโซเชียลมีเดียเป็นส่วนตัว (Private Account)</span>
              <span><Icon name="camera" size={14} /> 2. คิดไตร่ตรองก่อนโพสต์รูปหน้าตรงชัด ๆ และคลิปเสียงสาธารณะ</span>
              <span><Icon name="shield" size={14} /> 3. ตกลง “รหัสลับหรือคำถามลับ” ไว้ใช้ตรวจสอบกันภายในครอบครัว</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3.6 กฎหมายไทยที่ใช้เอาผิดได้แล้วตอนนี้ และการแจ้งความ */}
      <section className="u1ks-section" id="p3-s6">
        <div className="u1ks-sec-head">
          <span className="u1ks-sec-num rose">05</span>
          <div>
            <h2>กฎหมายไทยที่ใช้เอาผิด Deepfake ได้ทันทีในปัจจุบัน & การแจ้งความ</h2>
            <p>แม้ร่าง พ.ร.บ. AI จะยังไม่บังคับใช้ แต่การใช้ AI ตัดต่อหรือหลอกลวงผู้อื่น <b>มีความผิดตามกฎหมายไทยที่มีผลบังคับใช้แล้วทันที!</b></p>
          </div>
        </div>

        <div className="u1ks-law-banner-box">
          <img src={KS_IMAGES.aiLaw} alt="ความยุติธรรมทางกฎหมายดิจิทัลและการบังคับใช้กฎหมายไทย" loading="lazy" />
          <div>
            <span className="u1ks-pill-solid rose">บังคับใช้จริงแล้วในปัจจุบัน</span>
            <h4>ใช้ AI สร้างภาพ/เสียงปลอมทำร้ายผู้อื่น = ผิดทั้ง พ.ร.บ.คอมพิวเตอร์ และประมวลกฎหมายอาญา</h4>
            <p>กฎหมายลงโทษที่ “การกระทำและผลกระทบต่อผู้เสียหาย” ไม่ว่าจะตัดต่อด้วยโปรแกรมทั่วไปหรือสร้างด้วย AI ก็รับโทษตามกฎหมายเช่นเดียวกัน</p>
          </div>
        </div>

        <div className="u1ks-table-wrap">
          <table className="u1ks-table">
            <thead>
              <tr>
                <th>กฎหมายและมาตรา</th>
                <th>การกระทำที่เป็นความผิด</th>
                <th>อัตราโทษตามกฎหมาย</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="u1ks-td-with-icon">
                    <span className="u1ks-ic-circle sm rose"><Icon name="image" size={15} /></span>
                    <b>พ.ร.บ.คอมพิวเตอร์ มาตรา 16</b>
                  </div>
                </td>
                <td>นำภาพของผู้อื่นที่เกิดจากการสร้าง ตัดต่อ หรือดัดแปลงเข้าสู่ระบบคอมพิวเตอร์ โดยประการที่น่าจะทำให้ผู้นั้นเสียชื่อเสียง ถูกดูหมิ่น ถูกเกลียดชัง หรือได้รับความอับอาย</td>
                <td>จำคุกไม่เกิน <b>3 ปี</b> และปรับไม่เกิน <b>200,000 บาท</b></td>
              </tr>
              <tr>
                <td>
                  <div className="u1ks-td-with-icon">
                    <span className="u1ks-ic-circle sm amber"><Icon name="alert" size={15} /></span>
                    <b>พ.ร.บ.คอมพิวเตอร์ มาตรา 14(1)</b>
                  </div>
                </td>
                <td>นำเข้าข้อมูลคอมพิวเตอร์ที่บิดเบือนหรือปลอม เพื่อหลอกลวงประชาชน (เช่น คลิป Deepfake คนดังหลอกชวนลงทุน)</td>
                <td>จำคุกไม่เกิน <b>5 ปี</b> หรือปรับไม่เกิน <b>100,000 บาท</b> หรือทั้งจำทั้งปรับ</td>
              </tr>
              <tr>
                <td>
                  <div className="u1ks-td-with-icon">
                    <span className="u1ks-ic-circle sm indigo"><Icon name="chat" size={15} /></span>
                    <b>ประมวลกฎหมายอาญา มาตรา 328</b>
                  </div>
                </td>
                <td>หมิ่นประมาทด้วยการโฆษณา ผ่านภาพ คลิปวิดีโอ หรือข้อความที่เผยแพร่สู่สาธารณะ</td>
                <td>จำคุกไม่เกิน <b>2 ปี</b> และปรับไม่เกิน <b>200,000 บาท</b></td>
              </tr>
              <tr>
                <td>
                  <div className="u1ks-td-with-icon">
                    <span className="u1ks-ic-circle sm blue"><Icon name="scale" size={15} /></span>
                    <b>ประมวลกฎหมายอาญา มาตรา 341, 343</b>
                  </div>
                </td>
                <td>หลอกลวงผู้อื่นด้วยการแสดงข้อความอันเป็นเท็จจนได้ไปซึ่งเงินหรือทรัพย์สิน (ฉ้อโกง / ฉ้อโกงประชาชน)</td>
                <td>จำคุกไม่เกิน <b>3 ปี</b> (ม.341) หรือไม่เกิน <b>5 ปี</b> กรณีฉ้อโกงประชาชน (ม.343) และมีโทษปรับ</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="u1ks-split-2" style={{ marginTop: 18 }}>
          <div className="u1ks-panel-box rose-border">
            <h4>
              <span className="u1ks-ic-circle sm rose"><Icon name="shield" size={17} /></span>
              <span>หากตกเป็นผู้เสียหาย ต้องทำ 4 ขั้นตอนทันที</span>
            </h4>
            <ol className="u1ks-num-list">
              <li><b>เก็บหลักฐานก่อนถูกลบ:</b> แคปหน้าจอให้เห็นลิงก์ URL ชื่อบัญชีผู้โพสต์ ข้อความ และวันเวลาอย่างชัดเจน</li>
              <li><b>บอกผู้ใหญ่ที่ไว้ใจได้ทันที:</b> แจ้งพ่อแม่ ผู้ปกครอง หรือครูที่ปรึกษา ไม่ต้องเก็บไว้เครียดตามลำพัง</li>
              <li><b>กดรายงานแพลตฟอร์ม (Report):</b> แจ้งผู้ให้บริการโซเชียลมีเดียเพื่อระงับและลบเนื้อหาโดยเร็ว</li>
              <li><b>แจ้งความดำเนินคดีภายใน 3 เดือน:</b> ติดต่อสถานีตำรวจ หรือ <b>ตำรวจไซเบอร์ สายด่วน 1441</b> (หรือเว็บไซต์ <code>thaipoliceonline.go.th</code>)</li>
            </ol>
            <div className="u1ks-mini-highlight rose">
              <b>เตือนเพื่อนในกลุ่มแชต:</b> คนที่กดแชร์หรือส่งต่อภาพตัดต่อก็มีความเสี่ยงผิดกฎหมายฐานร่วมกันเผยแพร่! เมื่อพบเห็นต้อง<b>หยุดส่งต่อ กดรายงาน และแจ้งเจ้าตัวหรือครู</b>
            </div>
          </div>

          <div className="u1ks-panel-box amber-border">
            <h4>
              <span className="u1ks-ic-circle sm amber"><Icon name="clock" size={17} /></span>
              <span>แจ้งความต้องรีบ! “ยอมความได้” vs “อาญาแผ่นดิน”</span>
            </h4>
            <div className="u1ks-law-type-sub">
              <strong className="amber">1. ความผิดอันยอมความได้ (เช่น ตัดต่อภาพ ม.16 · หมิ่นประมาท ม.328)</strong>
              <ul>
                <li><b>ใครเริ่มคดี:</b> ผู้เสียหายต้องไปแจ้งความร้องทุกข์ด้วยตนเอง</li>
                <li><b>กำหนดเวลาสำคัญ:</b> ต้องร้องทุกข์<b>ภายใน 3 เดือน</b> นับแต่วันที่รู้เรื่องและรู้ตัวผู้กระทำผิด หากพ้นกำหนดจะขาดอายุความทันที!</li>
                <li><b>การยอมความ:</b> หากตกลงกันได้หรือถอนคำร้องทุกข์ คดีอาญาจะระงับจบลง</li>
              </ul>
            </div>
            <div className="u1ks-law-type-sub" style={{ marginTop: 10 }}>
              <strong className="rose">2. ความผิดอาญาแผ่นดิน (เช่น ข้อมูลเท็จหลอกลวง ม.14(1) · ฉ้อโกงประชาชน ม.343)</strong>
              <ul>
                <li><b>ใครเริ่มคดี:</b> รัฐดำเนินคดีเองได้ และผู้พบเห็นสามารถกล่าวโทษแจ้งความได้</li>
                <li><b>กำหนดเวลา:</b> ไม่ถูกจำกัดแค่ 3 เดือน (ใช้อายุความยาว 10–15 ปีตามอัตราโทษ)</li>
                <li><b>การยอมความ:</b> ยอมความไม่ได้ แม้ถอนแจ้งความ อัยการก็ยังฟ้องคดีต่อได้</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="u1ks-note-box rose" style={{ marginTop: 14 }}>
          <span className="u1ks-ic-circle sm rose"><Icon name="scale" size={18} /></span>
          <div>
            <b>ข้อสำคัญที่สุดเวลาไปสถานีตำรวจ:</b> ต้องแจ้งพนักงานสอบสวนอย่างชัดเจนว่าขอ <b>“ร้องทุกข์เพื่อดำเนินคดีตามกฎหมาย”</b> เพราะหากแจ้งขอ <i>“ลงบันทึกประจำวันไว้เป็นหลักฐานเฉย ๆ”</i> กฎหมายยังไม่นับเป็นการร้องทุกข์ และอาจทำให้คดีขาดอายุความ 3 เดือนได้!
          </div>
        </div>
      </section>

      <QuickQuizBox quizKey="ks3" />

      <footer className="u1ks-sheet-footer no-print">
        <button
          type="button"
          className={`u1ks-done-btn ${checkedItems['u1-item-3'] ? 'is-done' : ''}`}
          onClick={() => handleCompleteTopic(KS_TABS[2], 'summary')}
        >
          <Icon name="check" size={18} />
          <span>
            {checkedItems['u1-item-3']
              ? 'อ่านจบตอนที่ 3 แล้ว · ไปหน้าสรุปหน่วยที่ 1 & ขยายความรู้ →'
              : 'ทำเครื่องหมายว่าอ่านจบตอนที่ 3 และไปหน้าสรุปหน่วยที่ 1 →'}
          </span>
        </button>
      </footer>
    </article>
  );
}
