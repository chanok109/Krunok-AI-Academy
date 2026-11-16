import React from 'react';
import { Icon } from '../../UIPrimitives.jsx';
import { COURSE } from '../../../data/courseData.js';
import { U1_CHECKED } from '../../../data/unit1Data.js';
import { KS_TABS } from './knowledgeData.js';
import { KS_IMAGES } from './knowledgeImages.js';
import {
  U1_KS_ART,
  KsHeroArtCard,
  KsSceneGraphic,
  QuickQuizBox,
  RiskPyramidDiagram,
  scrollToKnowledgeSection
} from './KnowledgeWidgets.jsx';

/* =====================================================================
   ใบความรู้หน่วยที่ 1 · ตอนที่ 2: จริยธรรม AI และการควบคุมตามระดับความเสี่ยง
   ===================================================================== */

export default function Topic2EthicsAndRisk({ checkedItems = {}, handleCompleteTopic }) {
  return (
    <article className="u1ks-sheet theme-amber" id="ks-part-2">
      <header className="u1ks-hero amber">
        <div className="u1ks-hero-text">
          <div className="u1ks-hero-badges">
            <span className="u1ks-pill-solid amber">ใบความรู้ 1.1 · ตอนที่ 2</span>
            <span className="u1ks-pill-soft">{COURSE.code} {COURSE.name} · {COURSE.levelShort}</span>
          </div>
          <h1>จริยธรรม AI และการควบคุมตามระดับความเสี่ยง</h1>
          <p className="u1ks-hero-sub">
            เรียนรู้ความแตกต่างระหว่างจริยธรรมกับกฎหมาย ปัญหาจริยธรรมของ AI 8 ประการ สาเหตุและการลดอคติของ AI หลักจริยธรรม AI ของไทย 6 ข้อ แนวคิดการควบคุมตามระดับความเสี่ยง 4 ระดับ (EU AI Act) และร่าง พ.ร.บ. AI ของประเทศไทย
          </p>
          <div className="u1ks-goals-box">
            <div className="u1ks-goals-title">
              <Icon name="target" size={16} /> เป้าหมายการเรียนรู้ประจำบท
            </div>
            <ul>
              <li>บอกปัญหาจริยธรรมของ AI ได้ และรู้วิธีใช้ AI อย่างมีความรับผิดชอบ</li>
              <li>อธิบายหลักการควบคุมตามระดับความเสี่ยง และจัดระดับความเสี่ยงของระบบ AI ได้</li>
              <li>บอกสถานะและสาระสำคัญของร่างพระราชบัญญัติว่าด้วยปัญญาประดิษฐ์ของไทยได้</li>
            </ul>
          </div>
        </div>
        <div className="u1ks-hero-art">
          <KsHeroArtCard
            imageSrc={U1_KS_ART.aiEthics}
            imageAlt="ภาพแนวคิดจริยธรรมปัญญาประดิษฐ์และการกำกับดูแลอย่างสมดุล"
            subCaption="AI Ethics & Governance"
            caption="ตอนที่ 2 / 3 · จริยธรรม & กฎหมาย AI"
            mood="wink"
            tone="amber"
          />
        </div>
      </header>

      <div className="u1ks-toc-strip no-print">
        <span>หัวข้อย่อย:</span>
        <button type="button" onClick={() => scrollToKnowledgeSection('p2-s1')}>
          <Icon name="bulb" size={14} /> 1. กรณีศึกษาชวนคิด
        </button>
        <button type="button" onClick={() => scrollToKnowledgeSection('p2-s2')}>
          <Icon name="scale" size={14} /> 2. จริยธรรม vs กฎหมาย
        </button>
        <button type="button" onClick={() => scrollToKnowledgeSection('p2-s3')}>
          <Icon name="alert" size={14} /> 3. ปัญหาจริยธรรม 8 ข้อ
        </button>
        <button type="button" onClick={() => scrollToKnowledgeSection('p2-s4')}>
          <Icon name="award" size={14} /> 4. อคติ AI & จริยธรรมไทย 6 ข้อ
        </button>
        <button type="button" onClick={() => scrollToKnowledgeSection('p2-s5')}>
          <Icon name="layers" size={14} /> 5. ความเสี่ยง 4 ระดับ & EU AI Act
        </button>
        <button type="button" onClick={() => scrollToKnowledgeSection('p2-s6')}>
          <Icon name="fileText" size={14} /> 6. ร่าง พ.ร.บ. AI ของไทย
        </button>
      </div>

      {/* 2.1 สถานการณ์เปิดเรื่อง */}
      <section className="u1ks-section" id="p2-s1">
        <div className="u1ks-case-banner amber">
          <div className="u1ks-case-icon"><Icon name="bulb" size={26} /></div>
          <div>
            <span className="u1ks-case-kicker">สถานการณ์ชวนคิดก่อนเริ่มเรียน</span>
            <h3>“ถ้าโรงเรียนใช้ AI คัดนักเรียนเข้าโครงการพิเศษ โดยไม่มีครูตรวจซ้ำ...”</h3>
            <p>
              สมมติว่าโรงเรียนนำระบบ AI มาคัดเลือกนักเรียนเข้าโครงการห้องเรียนพิเศษ โดยให้ AI วิเคราะห์จาก <b>คะแนนสอบ รูปถ่ายใบหน้า และโพสต์ในโซเชียลมีเดีย</b> แล้วประกาศผลทันทีว่าใครผ่านหรือไม่ผ่าน โดยไม่มีครูตรวจสอบซ้ำ — นักเรียนคิดว่าระบบนี้ยุติธรรมหรือไม่? หากไม่ผ่าน เราจะถามเหตุผลจากใครได้?
            </p>
            <div className="u1ks-case-tags">
              <span><Icon name="scale" size={14} /> ยุติธรรมหรือไม่?</span>
              <span><Icon name="lock" size={14} /> ล่วงละเมิดพื้นที่ส่วนตัวไหม?</span>
              <span><Icon name="users" size={14} /> ใครเป็นผู้รับผิดชอบผลตัดสิน?</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2.2 จริยธรรม กับ กฎหมาย ต่างกันอย่างไร */}
      <section className="u1ks-section" id="p2-s2">
        <div className="u1ks-sec-head">
          <span className="u1ks-sec-num amber">01</span>
          <div>
            <h2>จริยธรรม (Soft Law) กับ กฎหมาย (Hard Law) ต่างกันอย่างไร?</h2>
            <p>ในการกำกับดูแลเทคโนโลยี เรามีทั้งกติกาทางสังคมและข้อบังคับทางกฎหมายทำงานคู่กัน</p>
          </div>
        </div>

        <div className="u1ks-split-2">
          <div className="u1ks-compare-card emerald">
            <div className="u1ks-compare-top">
              <span className="u1ks-compare-pill emerald"><Icon name="check" size={13} /> Soft Law · สิ่งที่ “ควรทำ”</span>
              <span className="u1ks-ic-circle sm emerald"><Icon name="bulb" size={17} /></span>
            </div>
            <div className="u1ks-card-photo-wrap tall">
              <img src={KS_IMAGES.aiEthics} alt="จริยธรรมปัญญาประดิษฐ์และความปลอดภัยดิจิทัล" className="u1ks-card-photo" loading="lazy" />
            </div>
            <h4>จริยธรรม (Ethics)</h4>
            <p>แนวปฏิบัติและข้อตกลงร่วมกันของสังคมหรือวิชาชีพเพื่อให้เกิดความถูกต้องและเป็นธรรม <b>ไม่มีบทลงโทษจำคุกหรือปรับตามกฎหมาย</b> แต่ส่งผลต่อความน่าเชื่อถือ</p>
            <div className="u1ks-compare-ex"><b>ตัวอย่าง:</b> นักเรียนแจ้งครูตามความจริงว่าใช้ AI ช่วยจัดโครงร่างรายงานส่วนใด และไม่คัดลอกคำตอบ AI ทั้งดุ้นมาส่งเป็นงานตัวเอง</div>
          </div>

          <div className="u1ks-compare-card rose">
            <div className="u1ks-compare-top">
              <span className="u1ks-compare-pill rose"><Icon name="scale" size={13} /> Hard Law · สิ่งที่ “ต้องทำ”</span>
              <span className="u1ks-ic-circle sm rose"><Icon name="shield" size={17} /></span>
            </div>
            <div className="u1ks-card-photo-wrap tall">
              <img src={KS_IMAGES.aiLaw} alt="กฎหมายดิจิทัลและการกำกับดูแลปัญญาประดิษฐ์" className="u1ks-card-photo" loading="lazy" />
            </div>
            <h4>กฎหมาย (Law)</h4>
            <p>ข้อบังคับที่รัฐตราขึ้นอย่างเป็นทางการ ทุกคนมีหน้าที่ต้องปฏิบัติตาม <b>หากฝ่าฝืนมีบทลงโทษชัดเจน</b> ทั้งทางแพ่ง ทางอาญา หรือทางปกครอง</p>
            <div className="u1ks-compare-ex"><b>ตัวอย่าง:</b> ห้ามนำภาพใบหน้าผู้อื่นไปใช้ AI ตัดต่อเผยแพร่ให้เกิดความอับอายหรือเสียหาย (มีความผิดตาม พ.ร.บ.คอมพิวเตอร์)</div>
          </div>
        </div>

        <div className="u1ks-tip-strip amber">
          <span className="u1ks-ic-circle sm amber"><Icon name="clock" size={18} /></span>
          <div>
            <b>ทำไมต้องมีทั้งจริยธรรมและกฎหมาย?</b> เพราะเทคโนโลยีพัฒนาไปอย่างรวดเร็ว ขณะที่กระบวนการร่างกฎหมายต้องใช้เวลานาน <b>กฎหมายจึงออกตามหลังเทคโนโลยีเสมอ</b> ในช่วงที่ยังไม่มีกฎหมายเฉพาะ “จริยธรรม” คือเข็มทิศสำคัญที่ช่วยป้องกันไม่ให้เกิดความเสียหายต่อสังคม
          </div>
        </div>
      </section>

      {/* 2.3 ปัญหาจริยธรรมของ AI ที่พบบ่อย 8 ประการ */}
      <section className="u1ks-section" id="p2-s3">
        <div className="u1ks-sec-head">
          <span className="u1ks-sec-num amber">02</span>
          <div>
            <h2>ปัญหาจริยธรรมของ AI ที่พบบ่อย 8 ประการ</h2>
            <p>จริยธรรม AI คือการพัฒนาและใช้งาน AI อย่างถูกต้อง ไม่สร้างความเดือดร้อนให้ผู้อื่น (อ้างอิงแนวทางจริยธรรม AI ของกระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม)</p>
          </div>
        </div>

        <div className="u1ks-cards-4">
          {[
            { n: '1', tone: 'amber', icon: 'scale', title: 'อคติและความลำเอียง', desc: 'AI ตัดสินใจหรือทำงานไม่เป็นธรรมกับคนบางกลุ่ม เช่น ระบบคัดเลือกทุนที่หักคะแนนนักเรียนต่างจังหวัด หรือระบบเสียงที่ไม่เข้าใจสำเนียงท้องถิ่น' },
            { n: '2', tone: 'rose', icon: 'lock', title: 'การละเมิดความเป็นส่วนตัว', desc: 'นำข้อมูลหรือรูปภาพของผู้อื่นไปป้อนให้ AI วิเคราะห์หรือฝึกโมเดลโดยที่เจ้าตัวไม่รู้หรือไม่ยินยอม' },
            { n: '3', tone: 'indigo', icon: 'eyeOff', title: 'อธิบายเหตุผลไม่ได้ (Black Box)', desc: 'AI ปฏิเสธผลลัพธ์ เช่น ไม่ให้สินเชื่อเงินกู้หรือไม่ผ่านการคัดเลือก โดยไม่มีใครอธิบายได้ว่าเพราะเหตุใด' },
            { n: '4', tone: 'violet', icon: 'users', title: 'ความคลุมเครือเรื่องผู้รับผิดชอบ', desc: 'เมื่อเกิดความเสียหาย เช่น รถยนต์ไร้คนขับเฉี่ยวชน ไม่ชัดเจนว่าความผิดอยู่ที่ผู้ผลิต ผู้ขับ หรือซอฟต์แวร์' },
            { n: '5', tone: 'rose', icon: 'alert', title: 'ข้อมูลเท็จและข่าวปลอม', desc: 'AI สร้างเนื้อหาปลอมหรืออ้างอิงงานวิจัยที่ไม่มีอยู่จริงอย่างแนบเนียน ทำให้ผู้คนหลงเชื่อและแชร์ต่อ' },
            { n: '6', tone: 'blue', icon: 'book', title: 'การละเมิดลิขสิทธิ์', desc: 'นำผลงานศิลปะ บทเพลง หรือเสียงพากย์ของศิลปินไปฝึกหรือเลียนแบบเพื่อการค้าโดยไม่ได้รับอนุญาต' },
            { n: '7', tone: 'amber', icon: 'shield', title: 'การนำไปใช้ในทางที่ผิด', desc: 'มิจฉาชีพใช้ AI เป็นเครื่องมือหลอกลวง เช่น โคลนเสียงลูกหลานโทรหลอกให้ผู้ปกครองโอนเงินด่วน' },
            { n: '8', tone: 'teal', icon: 'chart', title: 'ผลกระทบต่ออาชีพและสังคม', desc: 'ระบบอัตโนมัติเข้ามาทำงานแทนบางตำแหน่ง ทำให้แรงงานต้องปรับตัวและเรียนรู้ทักษะใหม่อย่างเร่งด่วน' }
          ].map(item => (
            <div key={item.n} className={`u1ks-ethic8-card tone-${item.tone}`}>
              <div className="u1ks-ethic8-top">
                <span className={`u1ks-ethic8-num tone-${item.tone}`}>ข้อ {item.n}</span>
                <span className={`u1ks-ic-circle sm ${item.tone}`}><Icon name={item.icon} size={17} /></span>
              </div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2.4 ทำไม AI ถึงลำเอียง & หลักจริยธรรมไทย 6 ข้อ */}
      <section className="u1ks-section" id="p2-s4">
        <div className="u1ks-sec-head">
          <span className="u1ks-sec-num amber">03</span>
          <div>
            <h2>เจาะลึก: ทำไม AI จึงลำเอียง และหลักจริยธรรม AI ของไทย 6 ข้อ</h2>
            <p>เข้าใจวงจรการเกิดอคติในโมเดล พร้อมแนวทางป้องกันและกรอบจริยธรรมระดับประเทศ</p>
          </div>
        </div>

        <div className="u1ks-bias-box">
          <h4><Icon name="scale" size={19} /> ทำไม AI ถึงลำเอียง? (กรณีศึกษาระบบ AI คัดกรองผู้สมัครรับทุนการศึกษา)</h4>
          <div className="u1ks-flow-3 compact">
            <div className="u1ks-flow-step warn-1">
              <div className="u1ks-flow-top">
                <span className="u1ks-step-tag amber">1. ข้อมูลในอดีตเอนเอียง</span>
                <span className="u1ks-ic-circle sm amber"><Icon name="layers" size={16} /></span>
              </div>
              <p>ข้อมูลผู้ได้รับทุนในอดีตส่วนใหญ่มาจากโรงเรียนขนาดใหญ่ในเมืองหลวง เพราะเคยเข้าถึงข่าวสารการรับสมัครได้มากกว่าพื้นที่ห่างไกล</p>
            </div>
            <div className="u1ks-flow-arrow" aria-hidden="true"><Icon name="arrowRight" size={22} /></div>
            <div className="u1ks-flow-step warn-2">
              <div className="u1ks-flow-top">
                <span className="u1ks-step-tag amber">2. AI จำรูปแบบผิด ๆ</span>
                <span className="u1ks-ic-circle sm amber"><Icon name="cpu" size={16} /></span>
              </div>
              <p>เมื่อนำประวัติเก่าไปสอน AI โมเดลจึงจับรูปแบบเหมารวมเอาเองว่า <b>“ชื่อโรงเรียนหรือรหัสไปรษณีย์ในเมืองใหญ่ = ผู้สมัครที่มีแนวโน้มผ่าน”</b></p>
            </div>
            <div className="u1ks-flow-arrow" aria-hidden="true"><Icon name="arrowRight" size={22} /></div>
            <div className="u1ks-flow-step warn-3">
              <div className="u1ks-flow-top">
                <span className="u1ks-step-tag rose">3. ตัดสินอย่างไม่เป็นธรรม</span>
                <span className="u1ks-ic-circle sm rose"><Icon name="alert" size={16} /></span>
              </div>
              <p>AI หักคะแนนใบสมัครของนักเรียนจากโรงเรียนต่างจังหวัดโดยอัตโนมัติ แม้จะมีผลการเรียนและผลงานยอดเยี่ยมเท่ากัน</p>
            </div>
          </div>
          <div className="u1ks-fix-row">
            <b><Icon name="shield" size={16} /> ลดอคติของ AI ได้อย่างไร?</b>
            <span><Icon name="check" size={14} /> ตรวจข้อมูลฝึกให้มีตัวแทนทุกภูมิภาคและทุกกลุ่มอย่างสมดุล</span>
            <span><Icon name="check" size={14} /> ตัดข้อมูลที่ไม่เกี่ยวกับความสามารถออก (เช่น ชื่อโรงเรียน รหัสไปรษณีย์ รูปถ่าย)</span>
            <span><Icon name="check" size={14} /> ทดสอบผลลัพธ์แยกตามกลุ่ม และให้กรรมการมนุษย์ตรวจซ้ำก่อนตัดสินจริง</span>
          </div>
        </div>

        <div className="u1ks-thai6-header-banner">
          <div className="u1ks-thai6-hb-left">
            <span className="u1ks-thai6-kicker">
              <Icon name="award" size={15} /> THAILAND AI ETHICS GUIDELINE · กระทรวงดีอี × มหาวิทยาลัยมหิดล
            </span>
            <h3>หลักจริยธรรมปัญญาประดิษฐ์ของประเทศไทย 6 ประการ</h3>
            <p>กรอบแนวทางระดับชาติเพื่อให้การออกแบบ พัฒนา และใช้งาน AI ในสังคมไทยมีความปลอดภัย โปร่งใส และเป็นธรรมต่อทุกคน</p>
          </div>
          <div className="u1ks-thai6-hb-badge">
            <strong>6</strong>
            <span>หลักจริยธรรมไทย</span>
          </div>
        </div>

        <div className="u1ks-thai6-grid">
          {[
            {
              num: '01',
              tone: 'emerald',
              icon: 'chart',
              scene: 'thai-ethic-1',
              en: 'Competitiveness & Sustainability',
              title: 'แข่งขันได้และยั่งยืน',
              desc: 'ใช้ AI ยกระดับการพัฒนาเศรษฐกิจและคุณภาพชีวิตของคนในสังคม โดยไม่ทำลายสิ่งแวดล้อมและสังคมในระยะยาว',
              ex: 'เช่น ใช้ AI ช่วยวิเคราะห์น้ำและปุ๋ยในแปลงเกษตรเพื่อลดต้นทุนและรักษาสิ่งแวดล้อม'
            },
            {
              num: '02',
              tone: 'blue',
              icon: 'scale',
              scene: 'thai-ethic-2',
              en: 'Compliance with Laws & Standards',
              title: 'สอดคล้องกับกฎหมาย จริยธรรม และมาตรฐาน',
              desc: 'ปฏิบัติตามกฎหมายและมาตรฐานสากลอย่างเคร่งครัด เคารพสิทธิขั้นพื้นฐานของประชาชนในทุกขั้นตอน',
              ex: 'เช่น ขอความยินยอมเจ้าของข้อมูลส่วนบุคคลอย่างถูกต้องตามกฎหมาย PDPA ก่อนนำไปใช้'
            },
            {
              num: '03',
              tone: 'amber',
              icon: 'eye',
              scene: 'thai-ethic-3',
              en: 'Transparency & Accountability',
              title: 'โปร่งใสและรับผิดชอบได้',
              desc: 'แจ้งให้ผู้ใช้ทราบชัดเจนเมื่อกำลังโต้ตอบกับ AI สามารถอธิบายหลักการตัดสินใจได้ และมีผู้รับผิดชอบเมื่อเกิดปัญหา',
              ex: 'เช่น แชตบอตแจ้งตัวตนตั้งแต่ต้นว่าเป็น AI และเปิดช่องทางให้ติดต่อเจ้าหน้าที่มนุษย์ได้'
            },
            {
              num: '04',
              tone: 'indigo',
              icon: 'lock',
              scene: 'thai-ethic-4',
              en: 'Security & Privacy',
              title: 'มั่นคงปลอดภัยและเป็นส่วนตัว',
              desc: 'มีระบบป้องกันภัยคุกคามทางไซเบอร์ เข้ารหัสข้อมูลสำคัญ และปกป้องความเป็นส่วนตัวไม่ให้ข้อมูลรั่วไหล',
              ex: 'เช่น เข้ารหัสฐานข้อมูลผู้เรียนและจำกัดสิทธิ์เฉพาะเจ้าหน้าที่ที่เกี่ยวข้องเท่านั้น'
            },
            {
              num: '05',
              tone: 'violet',
              icon: 'users',
              scene: 'thai-ethic-5',
              en: 'Fairness, Equity & Diversity',
              title: 'เป็นธรรมและเท่าเทียม',
              desc: 'ป้องกันไม่ให้ AI เลือกปฏิบัติต่อกลุ่มใดกลุ่มหนึ่ง และสนับสนุนให้คนทุกกลุ่มเข้าถึงประโยชน์ของ AI ได้อย่างทั่วถึง',
              ex: 'เช่น ทดสอบโมเดลกับผู้ใช้ทุกภูมิภาคและออกแบบระบบให้ผู้พิการเข้าถึงใช้งานได้สะดวก'
            },
            {
              num: '06',
              tone: 'teal',
              icon: 'award',
              scene: 'thai-ethic-6',
              en: 'Reliability',
              title: 'น่าเชื่อถือ',
              desc: 'ผ่านการทดสอบความถูกต้องแม่นยำตามเกณฑ์มาตรฐานก่อนนำไปใช้จริง และมีการติดตามตรวจสอบคุณภาพอย่างสม่ำเสมอ',
              ex: 'เช่น ทดสอบความแม่นยำของ AI ช่วยคัดกรองโรคและตรวจประเมินผลซ้ำเป็นระยะ'
            }
          ].map(p => (
            <div key={p.num} className={`u1ks-thai6-rich-card tone-${p.tone}`}>
              <div className={`u1ks-thai6-card-bar tone-${p.tone}`}>
                <span className={`u1ks-thai6-num-pill tone-${p.tone}`}>หลักที่ {p.num}</span>
                <span className="u1ks-thai6-en">{p.en}</span>
                <span className={`u1ks-ic-circle sm ${p.tone}`}><Icon name={p.icon} size={17} /></span>
              </div>
              <div className="u1ks-card-scene">
                <KsSceneGraphic kind={p.scene} />
              </div>
              <h4>{p.title}</h4>
              <p>{p.desc}</p>
              <div className={`u1ks-thai6-ex tone-${p.tone}`}>
                <Icon name="sparkle" size={14} />
                <span>{p.ex}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="u1ks-tip-strip blue" style={{ marginTop: 14 }}>
          <span className="u1ks-ic-circle sm blue"><Icon name="globe" size={18} /></span>
          <div>
            <b>กรอบจริยธรรมระดับโลก (UNESCO, ค.ศ. 2021):</b> องค์การยูเนสโกออก <i>ข้อแนะนำว่าด้วยจริยธรรมของปัญญาประดิษฐ์</i> โดยมีหัวใจสำคัญคือ <b>AI ต้องเคารพสิทธิมนุษยชน ศักดิ์ศรีความเป็นมนุษย์ และอยู่ภายใต้การกำกับดูแลของมนุษย์เสมอ</b>
          </div>
        </div>
      </section>

      {/* 2.5 การควบคุมตามระดับความเสี่ยง & EU AI Act */}
      <section className="u1ks-section" id="p2-s5">
        <div className="u1ks-sec-head">
          <span className="u1ks-sec-num amber">04</span>
          <div>
            <h2>การควบคุม AI ตามระดับความเสี่ยง (Risk-Based Approach) และ EU AI Act</h2>
            <p>เปรียบเหมือนยานพาหนะ: จักรยานแทบไม่ต้องมีใบอนุญาต รถยนต์ต้องมีใบขับขี่ ส่วนรถบรรทุกสารเคมีต้องคุมเข้มเป็นพิเศษ — <b>ยิ่ง AI ทำพลาดแล้วกระทบชีวิตคนมาก ยิ่งต้องควบคุมเข้มงวด</b></p>
          </div>
        </div>

        <RiskPyramidDiagram />

        <h3 className="u1ks-subhead">ตัวอย่างระบบ AI ความเสี่ยงสูง (High-Risk AI) ในชีวิตจริงที่ต้องมีมนุษย์ตรวจสอบเสมอ</h3>
        <div className="u1ks-cards-4">
          {[
            {
              tone: 'rose',
              icon: 'flask',
              tag: 'Healthcare AI',
              img: KS_IMAGES.appHealthcare,
              title: 'การแพทย์และวินิจฉัยโรค',
              desc: 'AI ช่วยอ่านภาพเอกซเรย์ปอดหรือคัดกรองรอยโรค แพทย์ต้องเป็นผู้ตรวจยืนยันผลขั้นสุดท้ายเสมอ'
            },
            {
              tone: 'amber',
              icon: 'book',
              tag: 'Education AI',
              img: KS_IMAGES.appEducation,
              title: 'การคัดเลือกเข้าศึกษาต่อ',
              desc: 'AI ประเมินคะแนนหรือคัดกรองผู้สมัครเรียน ต้องโปร่งใส อธิบายเกณฑ์ได้ และไม่มีอคติ'
            },
            {
              tone: 'blue',
              icon: 'chart',
              tag: 'Financial AI',
              img: KS_IMAGES.appFinance,
              title: 'สินเชื่อและการเงินธนาคาร',
              desc: 'AI ประเมินความเสี่ยงอนุมัติเงินกู้และตรวจจับทุจริต ต้องเปิดโอกาสให้ผู้กู้โต้แย้งและตรวจสอบได้'
            },
            {
              tone: 'indigo',
              icon: 'camera',
              tag: 'Biometric ID',
              img: KS_IMAGES.subfieldCv,
              title: 'ระบบไบโอเมตริกซ์ระบุตัวตน',
              desc: 'การสแกนใบหน้ายืนยันตัวตนในพื้นที่สำคัญ ต้องคุ้มครองข้อมูลอ่อนไหวและป้องกันความผิดพลาด'
            }
          ].map((hr) => (
            <div key={hr.tag} className={`u1ks-vocab-card tone-${hr.tone}`}>
              <div className="u1ks-card-photo-wrap">
                <img src={hr.img} alt={hr.title} className="u1ks-card-photo" loading="lazy" />
                <span className={`u1ks-photo-chip tone-${hr.tone}`}>
                  <Icon name={hr.icon} size={13} /> {hr.tag}
                </span>
              </div>
              <h4>{hr.title}</h4>
              <p>{hr.desc}</p>
            </div>
          ))}
        </div>

        <h3 className="u1ks-subhead">ไทม์ไลน์การบังคับใช้กฎหมาย EU AI Act (กฎหมาย AI ฉบับใหญ่ฉบับแรกของโลก)</h3>
        <div className="u1ks-eu-timeline">
          <div className="u1ks-eu-node active">
            <span className="u1ks-eu-status green"><Icon name="check" size={12} /> บังคับใช้แล้ว</span>
            <strong>1 ส.ค. 2567</strong>
            <p>กฎหมาย EU AI Act เริ่มมีผลใช้บังคับอย่างเป็นทางการ</p>
          </div>
          <div className="u1ks-eu-node active">
            <span className="u1ks-eu-status green"><Icon name="check" size={12} /> บังคับใช้แล้ว</span>
            <strong>2 ก.พ. 2568</strong>
            <p>เริ่มบังคับข้อห้ามใช้ AI ระดับความเสี่ยงที่ยอมรับไม่ได้ (Unacceptable Risk)</p>
          </div>
          <div className="u1ks-eu-node pending">
            <span className="u1ks-eu-status amber"><Icon name="clock" size={12} /> กำหนดถัดไป</span>
            <strong>2 ธ.ค. 2570</strong>
            <p>เริ่มบังคับกฎคุมเข้ม AI ความเสี่ยงสูงแบบระบบทั่วไป (ปรับเลื่อนตามชุดแก้ไข Digital Omnibus on AI มิ.ย. 2569)</p>
          </div>
          <div className="u1ks-eu-node pending">
            <span className="u1ks-eu-status amber"><Icon name="clock" size={12} /> กำหนดถัดไป</span>
            <strong>2 ส.ค. 2571</strong>
            <p>บังคับใช้กับ AI ความเสี่ยงสูงที่ฝังอยู่ในผลิตภัณฑ์ควบคุม เช่น อุปกรณ์การแพทย์</p>
          </div>
        </div>
        <div className="u1ks-note-box rose" style={{ marginTop: 12 }}>
          <span className="u1ks-ic-circle sm rose"><Icon name="scale" size={18} /></span>
          <div>
            <b>บทลงโทษสูงสุดของ EU AI Act:</b> บริษัทที่ฝ่าฝืนนำ AI ต้องห้ามมาใช้งาน มีโทษปรับสูงสุดถึง <b>35 ล้านยูโร</b> หรือ <b>ร้อยละ 7 ของรายได้รวมทั่วโลกต่อปี</b> (แล้วแต่จำนวนใดสูงกว่า)
          </div>
        </div>
      </section>

      {/* 2.6 ร่าง พ.ร.บ. AI ของประเทศไทย */}
      <section className="u1ks-section" id="p2-s6">
        <div className="u1ks-sec-head">
          <span className="u1ks-sec-num amber">05</span>
          <div>
            <h2>ร่าง พ.ร.บ.ว่าด้วยปัญญาประดิษฐ์ พ.ศ. .... ของประเทศไทย</h2>
            <p>สถานะปัจจุบัน: <b>ยังเป็นร่างกฎหมาย ยังไม่มีผลใช้บังคับ</b> (ETDA เปิดรับฟังความคิดเห็นเมื่อ 2 ก.ค. 2569 · ข้อมูลตรวจสอบ {U1_CHECKED})</p>
          </div>
        </div>

        <div className="u1ks-thai-law-grid">
          {[
            { n: '1', icon: 'layers', t: 'ควบคุมตามระดับความเสี่ยง', d: 'แบ่งการกำกับดูแลออกเป็น 3 กลุ่มสำคัญ ได้แก่ ระบบ AI ต้องห้าม, ระบบ AI ความเสี่ยงสูง และระบบที่ต้องแจ้งหรือขออนุญาตก่อนใช้' },
            { n: '2', icon: 'shield', t: 'ห้ามใช้ AI ที่บงการหรือเลือกปฏิบัติ', d: 'ห้ามใช้ AI แอบชักจูงจิตใจคนให้เกิดอันตราย หรือนำข้อมูลที่ไม่เกี่ยวข้องมาประเมินจัดระดับบุคคลอย่างไม่เป็นธรรม' },
            { n: '3', icon: 'alert', t: 'กำหนดกลุ่มความเสี่ยงสูงในกิจการสำคัญ', d: 'รัฐจะประกาศกำหนดภายหลังในด้านความมั่นคง สุขภาพอนามัย พลังงาน การขนส่ง และสาธารณูปโภคหลัก' },
            { n: '4', icon: 'users', t: 'แยกหน้าที่ผู้สร้างและผู้นำไปใช้ชัดเจน', d: 'องค์กรที่นำ AI ความเสี่ยงสูงไปใช้ ต้องประเมินความเสี่ยง จัดให้มีคนกำกับดูแล และเก็บบันทึกการทำงาน (Log) อย่างน้อย 6 เดือน' },
            { n: '5', icon: 'scale', t: 'บทลงโทษและคำสั่งระงับบริการ', d: 'มีโทษปรับทางปกครองตั้งแต่ 1–5 ล้านบาท และศาลมีอำนาจสั่งระงับการให้บริการหรือปิดกั้นการเข้าถึงได้ (รวมถึงผู้ให้บริการต่างชาติที่มีผลต่อคนในไทย)' }
          ].map(item => (
            <div key={item.n} className="u1ks-law5-item">
              <span className="u1ks-law5-num">{item.n}</span>
              <span className="u1ks-ic-circle sm amber"><Icon name={item.icon} size={17} /></span>
              <div>
                <h4>{item.t}</h4>
                <p>{item.d}</p>
              </div>
            </div>
          ))}
        </div>

        <h3 className="u1ks-subhead">เปรียบเทียบหน้าที่: “ผู้ให้บริการ (Provider)” กับ “ผู้ประยุกต์ใช้ (Deployer)”</h3>
        <div className="u1ks-split-2">
          <div className="u1ks-role-box blue">
            <div className="u1ks-role-head">
              <span className="u1ks-ic-circle blue"><Icon name="cpu" size={20} /></span>
              <div>
                <h4>ผู้ให้บริการ (Provider)</h4>
                <small>บริษัทหรือผู้พัฒนาที่ “สร้างระบบ AI”</small>
              </div>
            </div>
            <div className="u1ks-card-scene" style={{ marginBottom: 12 }}>
              <KsSceneGraphic kind="provider-lab" />
            </div>
            <ul className="u1ks-check-ul">
              <li>ออกแบบและพัฒนาให้ AI ทำงานได้ตรงตามจุดประสงค์และปลอดภัย</li>
              <li>ทำให้ระบบมีความโปร่งใส และเปิดให้มนุษย์เข้าควบคุมแก้ไขได้</li>
              <li>ตรวจสอบข้อมูลฝึกให้เป็นธรรม ไม่เลือกปฏิบัติ</li>
              <li>จัดทำคู่มือการใช้งานและระบุข้อจำกัดของระบบให้ชัดเจน</li>
            </ul>
          </div>

          <div className="u1ks-role-box amber">
            <div className="u1ks-role-head">
              <span className="u1ks-ic-circle amber"><Icon name="users" size={20} /></span>
              <div>
                <h4>ผู้ประยุกต์ใช้ (Deployer)</h4>
                <small>องค์กร โรงพยาบาล หรือโรงเรียนที่ “ซื้อหรือนำ AI ไปใช้งาน”</small>
              </div>
            </div>
            <div className="u1ks-card-scene" style={{ marginBottom: 12 }}>
              <KsSceneGraphic kind="deployer-org" />
            </div>
            <ul className="u1ks-check-ul">
              <li>ประเมินและบริหารจัดการความเสี่ยงก่อนนำไปใช้กับประชาชนหรือนักเรียน</li>
              <li>ใช้งานตามคู่มืออย่างเคร่งครัด และจัดให้มีบุคลากรมนุษย์คอยกำกับดูแล</li>
              <li>จัดเก็บบันทึกการทำงานของระบบ (System Log) ไว้อย่างน้อย <b>6 เดือน</b></li>
              <li>แจ้งหน่วยงานกำกับดูแลทันทีเมื่อพบความเสี่ยงหรือเหตุผิดปกติร้ายแรง</li>
            </ul>
          </div>
        </div>

        <h3 className="u1ks-subhead">ตารางเปรียบเทียบ ร่างกฎหมาย AI ของไทย กับ EU AI Act</h3>
        <div className="u1ks-table-wrap">
          <table className="u1ks-table">
            <thead>
              <tr>
                <th>ประเด็นเปรียบเทียบ</th>
                <th>ร่าง พ.ร.บ. AI ของประเทศไทย</th>
                <th>EU AI Act (สหภาพยุโรป)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>สถานะกฎหมาย (ต.ค. 2569)</b></td>
                <td><span className="u1ks-inline-tag amber">ยังเป็นร่าง</span> ยังไม่มีผลใช้บังคับ</td>
                <td><span className="u1ks-inline-tag green">ใช้บังคับแล้ว</span> ทยอยบังคับใช้ทีละหมวด</td>
              </tr>
              <tr>
                <td><b>แนวคิดหลัก</b></td>
                <td>ควบคุมตามระดับความเสี่ยง (Risk-Based)</td>
                <td>ควบคุมตามระดับความเสี่ยง (ต้นแบบเดียวกัน)</td>
              </tr>
              <tr>
                <td><b>การจัดแบ่งกลุ่ม</b></td>
                <td><b>3 กลุ่มหลัก:</b> ต้องห้าม · ความเสี่ยงสูง · ต้องแจ้ง/ขออนุญาต</td>
                <td><b>4 ระดับ:</b> ยอมรับไม่ได้ · สูง · จำกัด · ต่ำ</td>
              </tr>
              <tr>
                <td><b>หน่วยงานกำกับดูแล</b></td>
                <td>หน่วยงานกำกับดูแลรายสาขา (เช่น การเงิน สาธารณสุข) ร่วมกับ ETDA</td>
                <td>หน่วยงานระดับชาติของแต่ละประเทศสมาชิก ร่วมกับ EU AI Office</td>
              </tr>
              <tr>
                <td><b>อัตราโทษปรับสูงสุด</b></td>
                <td><b>5 ล้านบาท</b></td>
                <td><b>35 ล้านยูโร</b> หรือ <b>7% ของรายได้ทั่วโลก</b></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="u1ks-analogy-bar">
          <span className="u1ks-analogy-tag amber"><Icon name="list" size={15} /> ขั้นตอนต่อไปของร่างกฎหมายไทย</span>
          <div className="u1ks-analogy-items">
            <span className="u1ks-analogy-chip"><b>1.</b> กฤษฎีกาตรวจพิจารณา</span>
            <span className="u1ks-analogy-chip"><b>2.</b> เสนอคณะรัฐมนตรี (ครม.)</span>
            <span className="u1ks-analogy-chip"><b>3.</b> รัฐสภาพิจารณาเห็นชอบ</span>
            <span className="u1ks-analogy-chip"><b>4.</b> ประกาศในราชกิจจานุเบกษาจึงใช้บังคับ</span>
          </div>
        </div>
      </section>

      <QuickQuizBox quizKey="ks2" />

      <footer className="u1ks-sheet-footer no-print">
        <button
          type="button"
          className={`u1ks-done-btn ${checkedItems['u1-item-2'] ? 'is-done' : ''}`}
          onClick={() => handleCompleteTopic(KS_TABS[1], 'ks3')}
        >
          <Icon name="check" size={18} />
          <span>
            {checkedItems['u1-item-2']
              ? 'อ่านจบตอนที่ 2 แล้ว · ไปตอนที่ 3 (PDPA และ Deepfake) →'
              : 'ทำเครื่องหมายว่าอ่านจบตอนที่ 2 และไปตอนที่ 3 →'}
          </span>
        </button>
      </footer>
    </article>
  );
}
