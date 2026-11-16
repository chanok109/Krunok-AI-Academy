import React from 'react';
import { Icon, AIraBot } from '../../UIPrimitives.jsx';
import { COURSE } from '../../../data/courseData.js';
import { KS_TABS } from './knowledgeData.js';
import { KS_IMAGES } from './knowledgeImages.js';
import {
  KsHeroArtCard,
  RussellNorvigMatrix,
  KsSceneGraphic,
  QuickQuizBox,
  MatryoshkaDiagram,
  scrollToKnowledgeSection
} from './KnowledgeWidgets.jsx';

/* =====================================================================
   ใบความรู้หน่วยที่ 1 · ตอนที่ 1: AI คืออะไร
   ===================================================================== */

export default function Topic1WhatIsAI({ checkedItems = {}, handleCompleteTopic }) {
  return (
    <article className="u1ks-sheet theme-blue" id="ks-part-1">
      {/* Hero Banner */}
      <header className="u1ks-hero blue">
        <div className="u1ks-hero-text">
          <div className="u1ks-hero-badges">
            <span className="u1ks-pill-solid blue">ใบความรู้ 1.1 · ตอนที่ 1</span>
            <span className="u1ks-pill-soft">{COURSE.code} {COURSE.name} · {COURSE.levelShort}</span>
          </div>
          <h1>AI คืออะไร</h1>
          <p className="u1ks-hero-sub">
            ทำความเข้าใจความหมายและหลักการทำงานของปัญญาประดิษฐ์ คำศัพท์พื้นฐาน ความสัมพันธ์ของ AI · ML · DL · Generative AI ประวัติศาสตร์กว่า 70 ปี ประเภทของ AI และการใช้อย่างรู้เท่าทัน
          </p>
          <div className="u1ks-goals-box">
            <div className="u1ks-goals-title">
              <Icon name="target" size={16} /> เป้าหมายการเรียนรู้ประจำบท
            </div>
            <ul>
              <li>อธิบายได้ว่า AI คืออะไร และ AI, ML, DL, Generative AI ต่างกันอย่างไร</li>
              <li>เล่าเหตุการณ์สำคัญในประวัติ AI ได้ และบอกได้ว่าทำไม AI เคยซบเซาแล้วกลับมาบูม</li>
              <li>แยกประเภทของ AI ได้ และรู้ว่า AI ที่ใช้กันอยู่ในปัจจุบันเป็นแบบไหน พร้อมรู้เท่าทันข้อจำกัด</li>
            </ul>
          </div>
        </div>
        <div className="u1ks-hero-art">
          <KsHeroArtCard
            imageSrc={KS_IMAGES.techAi}
            imageAlt="ภาพแนวคิดแกนกลางปัญญาประดิษฐ์และโครงข่ายประสาทเทียม"
            subCaption="AI Core & Foundations"
            caption="ตอนที่ 1 / 3 · พื้นฐาน AI"
            mood="happy"
            tone="blue"
          />
        </div>
      </header>

      {/* Quick Section Jump */}
      <div className="u1ks-toc-strip no-print">
        <span>หัวข้อย่อย:</span>
        <button type="button" onClick={() => scrollToKnowledgeSection('p1-s1')}>
          <Icon name="sparkle" size={14} /> 1. AI รอบตัว
        </button>
        <button type="button" onClick={() => scrollToKnowledgeSection('p1-s2')}>
          <Icon name="globe" size={14} /> 2. ความหมาย & OECD
        </button>
        <button type="button" onClick={() => scrollToKnowledgeSection('p1-s3')}>
          <Icon name="code" size={14} /> 3. คำศัพท์ 4 คำ
        </button>
        <button type="button" onClick={() => scrollToKnowledgeSection('p1-s4')}>
          <Icon name="layers" size={14} /> 4. AI ⊃ ML ⊃ DL ⊃ GenAI
        </button>
        <button type="button" onClick={() => scrollToKnowledgeSection('p1-s5')}>
          <Icon name="clock" size={14} /> 5. ประวัติศาสตร์ & 3 ปัจจัยบูม
        </button>
        <button type="button" onClick={() => scrollToKnowledgeSection('p1-s6')}>
          <Icon name="cpu" size={14} /> 6. ประเภทของ AI
        </button>
        <button type="button" onClick={() => scrollToKnowledgeSection('p1-s7')}>
          <Icon name="alert" size={14} /> 7. ข้อจำกัด 4 ข้อ
        </button>
      </div>

      {/* 1.1 ชวนสำรวจ */}
      <section className="u1ks-section" id="p1-s1">
        <div className="u1ks-sec-head">
          <span className="u1ks-sec-num blue">01</span>
          <div>
            <h2>ชวนสำรวจ: ตั้งแต่ตื่นนอนจนถึงโรงเรียน เราใช้ AI ไปกี่ครั้งแล้ว?</h2>
            <p>หลายคนใช้งาน AI ไปแล้วมากกว่า 5 ครั้งตั้งแต่เช้าโดยไม่รู้ตัว เพราะ AI แทรกอยู่ในแอปพลิเคชันและบริการรอบตัวเรา</p>
          </div>
        </div>

        <div className="u1ks-daily-grid">
          {[
            {
              icon: 'camera',
              tone: 'blue',
              time: '06:30 · ตื่นนอน',
              img: KS_IMAGES.subfieldCv,
              title: 'สแกนใบหน้าปลดล็อกมือถือ',
              desc: 'จดจำใบหน้าเจ้าของเครื่องแม้แสงเปลี่ยนหรือใส่แว่น'
            },
            {
              icon: 'play',
              tone: 'rose',
              time: '07:00 · ก่อนออกจากบ้าน',
              img: KS_IMAGES.appEntertainment,
              title: 'ฟีดคลิปที่แอปเลือกมาให้',
              desc: 'TikTok / YouTube แนะนำคลิปตามพฤติกรรมการดูของเรา'
            },
            {
              icon: 'map',
              tone: 'emerald',
              time: '07:30 · เดินทางไปเรียน',
              img: KS_IMAGES.appTransportation,
              title: 'แผนที่บอกทางเลี่ยงรถติด',
              desc: 'คำนวณสภาพจราจรแบบเรียลไทม์เพื่อหาเส้นทางที่เร็วที่สุด'
            },
            {
              icon: 'globe',
              tone: 'amber',
              time: '12:15 · ค้นคว้าระหว่างวัน',
              img: KS_IMAGES.appCommunication,
              title: 'แอปแปลภาษาอัตโนมัติ',
              desc: 'แปลข้อความ เสียงพูด หรือข้อความจากภาพถ่ายได้ทันที'
            },
            {
              icon: 'chat',
              tone: 'violet',
              time: '19:30 · ทบทวนบทเรียน',
              img: KS_IMAGES.appEducation,
              title: 'ถามแชตบอตเรื่องการบ้าน',
              desc: 'ช่วยสรุปเนื้อหา อธิบายศัพท์ หรือระดมไอเดียรายงาน'
            }
          ].map((item) => (
            <div key={item.title} className={`u1ks-daily-card tone-${item.tone}`}>
              <div className="u1ks-daily-art is-photo">
                <img src={item.img} alt={item.title} className="u1ks-card-photo" loading="lazy" />
                <span className={`u1ks-daily-time tone-${item.tone}`}>{item.time}</span>
              </div>
              <div className="u1ks-daily-body">
                <span className={`u1ks-ic-circle ${item.tone}`}>
                  <Icon name={item.icon} size={20} />
                </span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.desc}</p>
                </div>
              </div>
            </div>
          ))}

          {/* การ์ดสรุปชวนคิด เติมเต็มตาราง 3x2 ให้สมบูรณ์สวยงาม */}
          <div className="u1ks-daily-summary-card">
            <div className="u1ks-daily-aira">
              <AIraBot mood="wink" size={76} float={false} title="" />
            </div>
            <div>
              <span className="u1ks-daily-kicker">
                <Icon name="sparkle" size={13} /> ข้อสังเกตจาก AIra
              </span>
              <strong>AI ไม่ใช่แค่หุ่นยนต์ในหนังไซไฟ!</strong>
              <p>แต่คือซอฟต์แวร์อัจฉริยะที่ซ่อนอยู่ในกล้อง แผนที่ โซเชียลมีเดีย และเครื่องมือเรียนที่เราหยิบใช้ทุกวัน</p>
            </div>
          </div>
        </div>
      </section>

      {/* 1.2 ความหมายของ AI และหลักการทำงาน */}
      <section className="u1ks-section" id="p1-s2">
        <div className="u1ks-sec-head">
          <span className="u1ks-sec-num blue">02</span>
          <div>
            <h2>ความหมายของ AI และหลักการทำงาน 3 ขั้นตอน</h2>
            <p>ทำไมเราจึงกล่าวว่า AI รับข้อมูลเข้ามา แล้วสามารถ “คิดหาคำตอบเอง” ได้?</p>
          </div>
        </div>

        <div className="u1ks-etymology-box with-thumb">
          <img
            src={KS_IMAGES.aiBrain}
            alt="สมองกลปัญญาประดิษฐ์และการเชื่อมโยงข้อมูล"
            className="u1ks-ety-thumb"
            loading="lazy"
          />
          <div className="u1ks-ety-word">
            <div className="u1ks-ety-head">
              <Icon name="cpu" size={16} />
              <span className="en">Artificial</span>
            </div>
            <span className="th">ประดิษฐ์ · มนุษย์สร้างขึ้น</span>
          </div>
          <span className="u1ks-ety-plus">+</span>
          <div className="u1ks-ety-word indigo">
            <div className="u1ks-ety-head">
              <Icon name="bulb" size={16} />
              <span className="en">Intelligence</span>
            </div>
            <span className="th">ความฉลาด · สติปัญญา</span>
          </div>
          <span className="u1ks-ety-plus">=</span>
          <div className="u1ks-ety-result">
            <strong><Icon name="sparkle" size={18} /> ปัญญาประดิษฐ์ (AI)</strong>
            <span>ความฉลาดที่มนุษย์สร้างขึ้นในคอมพิวเตอร์ เพื่อให้ทำงานที่ปกติต้องใช้สติปัญญาของมนุษย์ เช่น มองเห็นภาพ ฟังเข้าใจเสียง ตอบคำถาม แนะนำ หรือตัดสินใจ (คำนี้ตั้งชื่อครั้งแรกโดย <b>John McCarthy</b> ในการประชุมดาร์ตมัธ ค.ศ. 1956)</span>
          </div>
        </div>

        <div className="u1ks-def-callout">
          <div className="u1ks-def-badge">
            <Icon name="globe" size={16} /> นิยามสากลของ OECD (ค.ศ. 2023)
          </div>
          <p className="u1ks-def-quote">
            “ระบบ AI คือระบบที่ใช้เครื่องจักร ซึ่งสามารถ<b>อนุมาน (Infer)</b> จากข้อมูลที่รับเข้ามา ว่าจะสร้างผลลัพธ์อะไร เช่น การทำนาย เนื้อหา คำแนะนำ หรือการตัดสินใจที่มีผลต่อสภาพแวดล้อมจริงหรือเสมือน”
          </p>
          <div className="u1ks-def-subgrid">
            <div>
              <b><Icon name="bulb" size={16} /> คำว่า “อนุมาน” หมายถึงอะไร?</b>
              <span>คือการใช้รูปแบบที่ได้เรียนรู้มา คาดคะเนหรือหาคำตอบกับข้อมูลใหม่อย่างมีเหตุผล นี่คือความหมายของคำว่า “คิดเอง” ในทางคอมพิวเตอร์ ไม่ใช่การมีความรู้สึกนึกคิดแบบมนุษย์</span>
            </div>
            <div>
              <b><Icon name="award" size={16} /> OECD คือใคร?</b>
              <span>องค์การเพื่อความร่วมมือทางเศรษฐกิจและการพัฒนา (สมาชิก 38 ประเทศ) ผู้วางกรอบมาตรฐาน AI สากล ซึ่งนิยามนี้ถูกนำไปใช้เป็นต้นแบบในกฎหมาย <b>EU AI Act</b> ของสหภาพยุโรป</span>
            </div>
          </div>
        </div>

        <RussellNorvigMatrix />

        <div className="u1ks-flow-intro-box">
          <h3 className="u1ks-subhead" style={{ margin: 0 }}>
            หลักการทำงานของระบบ AI 3 ขั้นตอน (Input → Model → Output)
          </h3>
          <p className="u1ks-flow-intro-desc">
            ทำไม AI จึงดูเหมือน “คิดหาคำตอบเองได้”? ไม่ว่าจะเป็นระบบสแกนใบหน้า แผนที่นำทาง หรือแชตบอต ระบบ AI ทุกตัวไม่ได้ทำงานแบบสุ่ม แต่มีวงจรการทำงานเรียงลำดับ <b>3 ขั้นตอน</b> ดังแผนภาพนี้
          </p>
        </div>

        <div className="u1ks-flow-3">
          <div className="u1ks-flow-step step-1">
            <div className="u1ks-flow-top">
              <span className="u1ks-step-tag blue">ขั้นที่ 1 · INPUT</span>
              <span className="u1ks-ic-circle sm blue"><Icon name="camera" size={17} /></span>
            </div>
            <div className="u1ks-card-scene">
              <KsSceneGraphic kind="ks-flow-input" />
            </div>
            <h4>1. รับข้อมูลเข้า (Input)</h4>
            <p>รับข้อมูลดิบจากผู้ใช้หรือเซ็นเซอร์ เช่น รูปภาพ เสียงพูด ข้อความคำสั่ง หรือประวัติการใช้งาน</p>
            <div className="u1ks-flow-ex">ตัวอย่าง: กล้องหน้ามือถือถ่ายภาพใบหน้าของเราขณะยกเครื่องขึ้น</div>
          </div>

          <div className="u1ks-flow-arrow" aria-hidden="true">
            <Icon name="arrowRight" size={24} />
          </div>

          <div className="u1ks-flow-step step-2">
            <div className="u1ks-flow-top">
              <span className="u1ks-step-tag indigo">ขั้นที่ 2 · MODEL</span>
              <span className="u1ks-ic-circle sm indigo"><Icon name="cpu" size={17} /></span>
            </div>
            <div className="u1ks-card-scene">
              <KsSceneGraphic kind="ks-flow-model" />
            </div>
            <h4>2. ประมวลผลด้วยโมเดล (Model)</h4>
            <p>สมองกล AI นำข้อมูลที่รับเข้ามา เปรียบเทียบและอนุมานจากรูปแบบความรู้ที่เคยฝึกฝนไว้</p>
            <div className="u1ks-flow-ex">ตัวอย่าง: โมเดลคำนวณเทียบสัดส่วนจุดสำคัญบนใบหน้าว่าตรงกับเจ้าของเครื่องหรือไม่</div>
          </div>

          <div className="u1ks-flow-arrow" aria-hidden="true">
            <Icon name="arrowRight" size={24} />
          </div>

          <div className="u1ks-flow-step step-3">
            <div className="u1ks-flow-top">
              <span className="u1ks-step-tag teal">ขั้นที่ 3 · OUTPUT</span>
              <span className="u1ks-ic-circle sm teal"><Icon name="sparkle" size={17} /></span>
            </div>
            <div className="u1ks-card-scene">
              <KsSceneGraphic kind="output-light" />
            </div>
            <h4>3. สร้างผลลัพธ์ (Output)</h4>
            <p>ส่งคำตอบออกสู่หน้าจอหรือสั่งการอุปกรณ์ ไม่ว่าจะเป็นคำทำนาย คำแนะนำ การตัดสินใจ หรือเนื้อหาใหม่</p>
            <div className="u1ks-flow-ex">ตัวอย่าง: ตัดสินใจสั่งปลดล็อกหน้าจอทันที (หรือปฏิเสธหากไม่ใช่เจ้าของ)</div>
          </div>
        </div>

        <h3 className="u1ks-subhead">ตารางวิเคราะห์ระบบ AI รอบตัว: รับข้อมูลอะไร (Input) และให้ผลลัพธ์อะไร (Output)</h3>
        <div className="u1ks-table-wrap">
          <table className="u1ks-table">
            <thead>
              <tr>
                <th>ตัวอย่างระบบ AI</th>
                <th>ข้อมูลที่รับเข้า (Input)</th>
                <th>ผลลัพธ์ที่ได้ (Output)</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  icon: 'mail',
                  tone: 'rose',
                  name: 'ตัวกรองอีเมลขยะ (Spam Filter)',
                  inp: 'หัวเรื่อง ชื่อผู้ส่ง ลิงก์ และข้อความในอีเมล',
                  out: 'จำแนกว่าเป็น “อีเมลขยะ” หรือ “อีเมลปกติ”'
                },
                {
                  icon: 'camera',
                  tone: 'blue',
                  name: 'สแกนใบหน้าปลดล็อกเครื่อง',
                  inp: 'ภาพใบหน้าจากกล้องหน้าและเซ็นเซอร์วัดความลึก',
                  out: 'ตัดสินใจว่า “ใช่เจ้าของเครื่อง (ปลดล็อก)” หรือไม่'
                },
                {
                  icon: 'play',
                  tone: 'violet',
                  name: 'ระบบแนะนำฟีดคลิปสั้น',
                  inp: 'ประวัติคลิปที่ดูจบ การกดถูกใจ เวลาที่หยุดดู หรือเลื่อนผ่าน',
                  out: 'จัดลำดับคลิปถัดไปที่คาดว่าผู้ใช้จะสนใจมากที่สุด'
                },
                {
                  icon: 'map',
                  tone: 'emerald',
                  name: 'แผนที่นำทางอัจฉริยะ',
                  inp: 'พิกัดและความเร็วของรถบนท้องถนนจำนวนมาก รวมถึงช่วงเวลา',
                  out: 'คำนวณเส้นทางที่ใช้เวลาน้อยที่สุดและเวลาถึงโดยประมาณ'
                },
                {
                  icon: 'chat',
                  tone: 'amber',
                  name: 'แชตบอต AI (เช่น ChatGPT, Gemini)',
                  inp: 'ข้อความคำสั่งหรือคำถามที่เราพิมพ์เข้าไป (Prompt)',
                  out: 'ข้อความคำตอบ บทสรุป หรือเนื้อหาที่สร้างขึ้นใหม่'
                }
              ].map((row) => (
                <tr key={row.name}>
                  <td>
                    <div className="u1ks-td-with-icon">
                      <span className={`u1ks-ic-circle sm ${row.tone}`}>
                        <Icon name={row.icon} size={16} />
                      </span>
                      <b>{row.name}</b>
                    </div>
                  </td>
                  <td>{row.inp}</td>
                  <td>{row.out}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="u1ks-note-box amber">
          <span className="u1ks-ic-circle sm amber"><Icon name="alert" size={18} /></span>
          <div>
            <b>ข้อสังเกตสำคัญ (Garbage In, Garbage Out):</b> ทุกตัวอย่างต้องมีข้อมูลป้อนเข้าไปก่อน AI จึงจะประมวลผลออกเป็นคำตอบได้ ดังนั้น <b>หากข้อมูลตั้งต้นผิดพลาด ไม่ครบถ้วน หรือมีความลำเอียง ผลลัพธ์ของ AI ก็จะผิดพลาดตามไปด้วย</b>
          </div>
        </div>
      </section>

      {/* 1.3 คำศัพท์พื้นฐาน 4 คำ */}
      <section className="u1ks-section" id="p1-s3">
        <div className="u1ks-sec-head">
          <span className="u1ks-sec-num blue">03</span>
          <div>
            <h2>4 คำศัพท์พื้นฐานที่ต้องรู้ก่อนเรียน AI</h2>
            <p>เข้าใจกลไกเบื้องหลังการฝึกและสั่งงาน AI ด้วยคำสำคัญ 4 คำที่ใช้ตลอดรายวิชานี้</p>
          </div>
        </div>

        <div className="u1ks-cards-4">
          {[
            {
              no: 'คำที่ 1',
              tone: 'blue',
              icon: 'code',
              art: 'vocab-algo',
              title: 'Algorithm (อัลกอริทึม)',
              desc: 'ลำดับขั้นตอนหรือวิธีการคำนวณที่บอกให้คอมพิวเตอร์รู้ว่าต้องทำอะไรก่อน–หลัง เพื่อเรียนรู้หรือแก้ปัญหา'
            },
            {
              no: 'คำที่ 2',
              tone: 'teal',
              icon: 'layers',
              art: 'vocab-data',
              title: 'Training Data (ข้อมูลฝึก)',
              desc: 'ข้อมูลตัวอย่างจำนวนมากที่ใช้สอน AI ยิ่งข้อมูลมีปริมาณมาก หลากหลาย และถูกต้อง โมเดลก็จะยิ่งแม่นยำ'
            },
            {
              no: 'คำที่ 3',
              tone: 'indigo',
              icon: 'cpu',
              art: 'vocab-model',
              title: 'Model (โมเดล)',
              desc: 'เปรียบเสมือน “ก้อนความรู้หรือสมองของ AI” ที่ได้หลังจากการฝึกเสร็จแล้ว พร้อมนำไปใช้ทำนายข้อมูลใหม่'
            },
            {
              no: 'คำที่ 4',
              tone: 'amber',
              icon: 'chat',
              art: 'vocab-prompt',
              title: 'Prompt (พรอมต์)',
              desc: 'ข้อความคำสั่งหรือคำถามที่ผู้ใช้ป้อนให้ AI ทำงาน ยิ่งระบุบริบทและเป้าหมายชัดเจน คำตอบก็ยิ่งตรงใจ'
            }
          ].map((v) => (
            <div key={v.no} className={`u1ks-vocab-card tone-${v.tone}`}>
              <div className="u1ks-vocab-head">
                <span className={`u1ks-ic-circle ${v.tone}`}><Icon name={v.icon} size={20} /></span>
                <small>{v.no}</small>
              </div>
              <div className="u1ks-card-scene">
                <KsSceneGraphic kind={v.art} />
              </div>
              <h4>{v.title}</h4>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="u1ks-analogy-bar">
          <span className="u1ks-analogy-tag"><Icon name="sparkle" size={15} /> เปรียบเทียบกับการเรียนของนักเรียน</span>
          <div className="u1ks-analogy-items">
            <span className="u1ks-analogy-chip"><Icon name="book" size={15} /> <b>Training Data</b> = แบบฝึกหัดที่ใช้หัดทำ</span>
            <span className="u1ks-analogy-chip"><Icon name="code" size={15} /> <b>Algorithm</b> = วิธีอ่านและสรุปบทเรียน</span>
            <span className="u1ks-analogy-chip"><Icon name="bulb" size={15} /> <b>Model</b> = ความรู้ที่ติดตัวหลังเรียนจบ</span>
            <span className="u1ks-analogy-chip"><Icon name="fileText" size={15} /> <b>Prompt</b> = โจทย์ข้อสอบที่ครูถาม</span>
          </div>
        </div>
      </section>

      {/* 1.4 ความสัมพันธ์ AI, ML, DL, GenAI */}
      <section className="u1ks-section" id="p1-s4">
        <div className="u1ks-sec-head">
          <span className="u1ks-sec-num blue">04</span>
          <div>
            <h2>ความสัมพันธ์ของ AI, ML, DL และ Generative AI</h2>
            <p>ทั้ง 4 คำไม่ได้แยกขาดจากกัน แต่ซ้อนทับกันเป็นชั้น ๆ เหมือน “ตุ๊กตาแม่ลูกดก”</p>
          </div>
        </div>
        <MatryoshkaDiagram />
      </section>

      {/* 1.5 ประวัติศาสตร์และทำไม AI จึงกลับมาบูม */}
      <section className="u1ks-section" id="p1-s5">
        <div className="u1ks-sec-head">
          <span className="u1ks-sec-num blue">05</span>
          <div>
            <h2>ประวัติศาสตร์ AI: เคยซบเซา 2 ครั้ง ก่อนก้าวกระโดดหลังปี 2012</h2>
            <p>แนวคิดปัญญาประดิษฐ์มีอายุมากกว่า 70 ปี ผ่านทั้งยุคแห่งความหวังและ “ฤดูหนาวของ AI” ก่อนจะบูมสุดขีดในทศวรรษที่ผ่านมา</p>
          </div>
        </div>

        <div className="u1ks-timeline-grid">
          {[
            {
              year: 'ค.ศ. 1950',
              icon: 'chat',
              img: KS_IMAGES.alanTuring,
              imgCls: 'pos-top',
              captionTag: 'Alan Turing',
              title: 'การทดสอบทัวริง (Turing Test)',
              desc: 'แอลัน ทัวริง เสนอเกณฑ์ว่า หากมนุษย์คุยโต้ตอบแล้วแยกไม่ออกว่าอีกฝ่ายเป็นคนหรือเครื่องจักร ถือว่าเครื่องจักรแสดงความฉลาดได้',
              tone: 'blue'
            },
            {
              year: 'ค.ศ. 1956',
              icon: 'sparkle',
              img: KS_IMAGES.johnMcCarthy,
              imgCls: 'pos-face',
              captionTag: 'John McCarthy',
              title: 'กำเนิดคำว่า “AI” ที่ดาร์ตมัธ',
              desc: 'จอห์น แมคคาร์ธี และคณะนักวิจัยร่วมกันบัญญัติคำว่า Artificial Intelligence อย่างเป็นทางการ',
              tone: 'blue'
            },
            {
              year: 'ทศวรรษ 1970s',
              icon: 'alert',
              scene: 'winter-1',
              title: 'ฤดูหนาวของ AI ครั้งที่ 1',
              desc: 'คอมพิวเตอร์ยุคนั้นยังช้าและหน่วยความจำน้อย ทำไม่ได้อย่างที่คาดหวัง รัฐบาลจึงตัดงบวิจัย',
              tone: 'winter'
            },
            {
              year: 'ปลาย 1980s',
              icon: 'alert',
              scene: 'winter-2',
              title: 'ฤดูหนาวของ AI ครั้งที่ 2',
              desc: 'ระบบผู้เชี่ยวชาญ (Expert System) ดูแลรักษายากและมีข้อจำกัดสูง ทำให้ทุนวิจัยซบเซาลงอีกครั้ง',
              tone: 'winter'
            },
            {
              year: 'ค.ศ. 1997',
              icon: 'trophy',
              img: KS_IMAGES.deepBlue,
              imgCls: 'pos-center',
              captionTag: 'IBM Deep Blue',
              title: 'Deep Blue ชนะแชมป์หมากรุกโลก',
              desc: 'ซูเปอร์คอมพิวเตอร์ของ IBM เอาชนะ แกรี คาสปารอฟ แชมป์โลกหมากรุกสากลได้สำเร็จ',
              tone: 'blue'
            },
            {
              year: 'ค.ศ. 2012',
              icon: 'image',
              img: KS_IMAGES.techDl,
              imgCls: 'pos-center',
              captionTag: 'Deep Neural Net',
              title: 'AlexNet จุดพลุยุค Deep Learning',
              desc: 'ชนะการแข่งขันจำแนกภาพด้วยโครงข่ายประสาทเทียมเชิงลึกบน GPU อย่างถล่มทลาย',
              tone: 'teal'
            },
            {
              year: 'ค.ศ. 2016',
              icon: 'target',
              img: KS_IMAGES.aiBrain,
              imgCls: 'pos-center',
              captionTag: 'DeepMind AlphaGo',
              title: 'AlphaGo ชนะแชมป์โลกหมากล้อม',
              desc: 'เอาชนะ อี เซดล ในเกมหมากล้อมที่มีรูปแบบการเดินซับซ้อนเกินกว่าจะคำนวณตรง ๆ ได้ทั้งหมด',
              tone: 'teal'
            },
            {
              year: 'ค.ศ. 2022',
              icon: 'bot',
              img: KS_IMAGES.chatgpt,
              imgCls: 'fit-contain-dark',
              captionTag: 'Generative AI Era',
              title: 'ChatGPT เปิดให้คนทั่วไปใช้งาน',
              desc: 'จุดกระแส Generative AI ทั่วโลก ทำให้ทุกคนเข้าถึงและใช้งาน AI ผ่านภาษาธรรมชาติได้ทันที',
              tone: 'indigo'
            }
          ].map(ev => (
            <div key={ev.year} className={`u1ks-tl-card tone-${ev.tone}`}>
              <div className={`u1ks-tl-media ${ev.imgCls || ''}`}>
                {ev.img ? (
                  <img src={ev.img} alt={ev.title} className={`u1ks-tl-photo ${ev.imgCls || ''}`} loading="lazy" />
                ) : (
                  <KsSceneGraphic kind={ev.scene} />
                )}
                {ev.captionTag && <span className="u1ks-tl-photo-tag">{ev.captionTag}</span>}
              </div>
              <div className="u1ks-tl-head">
                <span className="u1ks-tl-year">{ev.year}</span>
                <span className={`u1ks-tl-icon tone-${ev.tone}`}>
                  <Icon name={ev.icon} size={16} />
                </span>
              </div>
              <h4>{ev.title}</h4>
              <p>{ev.desc}</p>
            </div>
          ))}
        </div>

        <div className="u1ks-note-box amber" style={{ marginTop: 14 }}>
          <span className="u1ks-ic-circle sm amber"><Icon name="info" size={18} /></span>
          <div>
            <b>ฤดูหนาวของ AI (AI Winter) คืออะไร?</b> คือช่วงเวลาที่เทคโนโลยี AI ยังติดคอขวดด้านฮาร์ดแวร์และข้อมูล ทำให้ทำผลงานไม่ได้ตามคำสัญญา ส่งผลให้ภาครัฐและเอกชนลดความสนใจและตัดงบประมาณสนับสนุนการวิจัย
          </div>
        </div>

        <h3 className="u1ks-subhead">เหตุการณ์สำคัญอื่น ๆ ที่เปลี่ยนโฉมหน้าโลก AI</h3>
        <div className="u1ks-table-wrap">
          <table className="u1ks-table">
            <thead>
              <tr>
                <th>ปี ค.ศ.</th>
                <th>เหตุการณ์สำคัญ</th>
                <th>ความสำคัญต่อวงการ AI</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><span className="u1ks-year-pill">1943</span></td><td>แมคคัลลอก และ พิตส์ เสนอแบบจำลองเซลล์ประสาทเทียม</td><td>จุดเริ่มต้นทางคณิตศาสตร์ของแนวคิด “สมองเทียม”</td></tr>
              <tr><td><span className="u1ks-year-pill">1958</span></td><td>แฟรงก์ โรเซนแบลตต์ สร้าง Perceptron</td><td>โครงข่ายประสาทเทียมรุ่นแรกที่ฝึกให้เรียนรู้จากตัวอย่างได้</td></tr>
              <tr><td><span className="u1ks-year-pill">1966</span></td><td>โจเซฟ ไวเซนบาวม์ สร้างโปรแกรม ELIZA</td><td>แชตบอตรุ่นบุกเบิกของโลกที่จำลองการสนทนาเลียนแบบนักจิตบำบัด</td></tr>
              <tr><td><span className="u1ks-year-pill">1980s</span></td><td>ยุคเฟื่องฟูของระบบผู้เชี่ยวชาญ (Expert System)</td><td>รวบรวมความรู้ผู้เชี่ยวชาญมาเขียนเป็นกฎ <code>ถ้า...แล้ว...</code> สำหรับช่วยวินิจฉัยงานเฉพาะทาง</td></tr>
              <tr><td><span className="u1ks-year-pill">2011</span></td><td>IBM Watson ชนะรายการเกมโชว์ Jeopardy!</td><td>พิสูจน์ความก้าวหน้าในการประมวลผลและเข้าใจคำถามภาษาธรรมชาติที่ซับซ้อน</td></tr>
              <tr><td><span className="u1ks-year-pill">2017</span></td><td>ทีมวิจัย Google คิดค้นสถาปัตยกรรม <b>Transformer</b></td><td>หัวใจสำคัญเบื้องหลังโมเดลภาษาขนาดใหญ่ (LLM) และแชตบอตยุคปัจจุบันทั้งหมด</td></tr>
              <tr><td><span className="u1ks-year-pill gold">2024</span></td><td>รางวัลโนเบลสาขาฟิสิกส์และเคมีมอบให้ผลงานด้าน AI</td><td>โนเบลฟิสิกส์มอบให้ผู้บุกเบิก Neural Network (Hopfield & Hinton) และโนเบลเคมีมอบให้ AI ทำนายโครงสร้างโปรตีน (AlphaFold)</td></tr>
            </tbody>
          </table>
        </div>

        <h3 className="u1ks-subhead">ทำไม AI จึงกลับมาบูมหลังปี 2012? — เพราะมี 3 ปัจจัยมาบรรจบกันครบพอดี</h3>
        <div className="u1ks-cards-3">
          <div className="u1ks-pillar-card blue">
            <div className="u1ks-pillar-top">
              <span className="u1ks-pillar-num">ปัจจัยที่ 1</span>
              <span className="u1ks-ic-circle sm blue"><Icon name="layers" size={17} /></span>
            </div>
            <div className="u1ks-card-scene">
              <KsSceneGraphic kind="big-data" />
            </div>
            <h4>ข้อมูลมหาศาล (Big Data)</h4>
            <p>ผู้คนทั่วโลกสร้างรูปภาพ ข้อความ และวิดีโอบนอินเทอร์เน็ตและสมาร์ตโฟนทุกวัน กลายเป็น “คลังตำราขนาดยักษ์” ให้ AI ใช้ฝึกฝน</p>
          </div>
          <div className="u1ks-pillar-card amber">
            <div className="u1ks-pillar-top">
              <span className="u1ks-pillar-num amber">ปัจจัยที่ 2</span>
              <span className="u1ks-ic-circle sm amber"><Icon name="cpu" size={17} /></span>
            </div>
            <div className="u1ks-card-scene">
              <KsSceneGraphic kind="gpu-chip" />
            </div>
            <h4>คอมพิวเตอร์แรงขึ้น (GPU)</h4>
            <p>ชิปประมวลผลกราฟิก (<b>GPU</b>) ที่เดิมออกแบบมาเพื่อเล่นเกม สามารถคำนวณตัวเลขหลายพันชุดพร้อมกันแบบขนาน จึงฝึกโมเดลขนาดใหญ่ได้เร็วขึ้นมหาศาล</p>
          </div>
          <div className="u1ks-pillar-card indigo">
            <div className="u1ks-pillar-top">
              <span className="u1ks-pillar-num indigo">ปัจจัยที่ 3</span>
              <span className="u1ks-ic-circle sm indigo"><Icon name="sparkle" size={17} /></span>
            </div>
            <div className="u1ks-card-scene">
              <KsSceneGraphic kind="deep-net" />
            </div>
            <h4>อัลกอริทึม Deep Learning</h4>
            <p>โครงข่ายประสาทเทียมหลายชั้นที่เรียนรู้คุณลักษณะเป็นลำดับจากง่ายไปซับซ้อน เช่น เริ่มจากเห็น<b>เส้นขอบ → รูปทรง → ดวงตา/จมูก → ใบหน้าบุคคล</b></p>
          </div>
        </div>

        <div className="u1ks-tip-strip teal">
          <span className="u1ks-ic-circle sm teal"><Icon name="award" size={18} /></span>
          <div>
            <b>การขับเคลื่อนในประเทศไทย:</b> ประเทศไทยมี <b>แผนปฏิบัติการด้านปัญญาประดิษฐ์แห่งชาติเพื่อการพัฒนาประเทศไทย พ.ศ. 2565–2570</b> (Thailand National AI Strategy and Action Plan) เพื่อพัฒนากำลังคน โครงสร้างพื้นฐาน และส่งเสริมการใช้ AI อย่างมีจริยธรรม
          </div>
        </div>
      </section>

      {/* 1.6 ประเภทของ AI */}
      <section className="u1ks-section" id="p1-s6">
        <div className="u1ks-sec-head">
          <span className="u1ks-sec-num blue">06</span>
          <div>
            <h2>ประเภทของ AI: จัดแบ่งได้ 3 มุมมอง</h2>
            <p>ระบบ AI ตัวเดียวกันสามารถจัดประเภทได้หลายแบบ ขึ้นอยู่กับว่าเราใช้เกณฑ์ใดในการพิจารณา</p>
          </div>
        </div>

        <h3 className="u1ks-subhead">เกณฑ์ที่ 1 · แบ่งตามระดับความสามารถเทียบกับมนุษย์ (สำคัญที่สุด!)</h3>
        <div className="u1ks-cards-3">
          <div className="u1ks-type-card active-now">
            <div className="u1ks-type-status green"><Icon name="check" size={13} /> มีใช้จริงแล้ว (AI ทุกตัวตอนนี้!)</div>
            <div className="u1ks-card-scene">
              <KsSceneGraphic kind="ani-bot" />
            </div>
            <h4>1. AI แบบแคบ (ANI)</h4>
            <small>Artificial Narrow Intelligence</small>
            <p>เก่งเฉพาะด้านตามที่ถูกฝึกมาเท่านั้น เช่น AI แปลภาษาเก่งมากแต่ขับรถไม่ได้ หรือ AlphaGo เล่นหมากล้อมชนะแชมป์โลกแต่แต่งเพลงไม่ได้</p>
          </div>
          <div className="u1ks-type-card future">
            <div className="u1ks-type-status amber"><Icon name="flask" size={13} /> ยังไม่มีจริง (กำลังวิจัย)</div>
            <div className="u1ks-card-scene">
              <KsSceneGraphic kind="agi-brain" />
            </div>
            <h4>2. AI ทั่วไป (AGI)</h4>
            <small>Artificial General Intelligence</small>
            <p>มีความฉลาดรอบด้านเทียบเท่ามนุษย์ คิดวางแผน แก้ปัญหาใหม่ ๆ ที่ไม่เคยเจอ และเชื่อมโยงความรู้ข้ามศาสตร์ได้เอง</p>
          </div>
          <div className="u1ks-type-card concept">
            <div className="u1ks-type-status slate"><Icon name="sparkle" size={13} /> เป็นเพียงแนวคิดในอนาคต</div>
            <div className="u1ks-card-scene">
              <KsSceneGraphic kind="asi-core" />
            </div>
            <h4>3. AI เหนือมนุษย์ (ASI)</h4>
            <small>Artificial Super Intelligence</small>
            <p>สติปัญญาที่ฉลาดล้ำกว่าสมองมนุษย์ที่เก่งที่สุดรวมกันในแทบทุกมิติ ทั้งด้านวิทยาศาสตร์ ศิลปะ และการตัดสินใจ</p>
          </div>
        </div>

        <div className="u1ks-split-2" style={{ marginTop: 18 }}>
          <div className="u1ks-panel-box blue-tint">
            <h4>
              <span className="u1ks-ic-circle sm blue"><Icon name="clock" size={17} /></span>
              <span>เกณฑ์ที่ 2 · แบ่งตามวิธีทำงานและความจำ (Arend Hintze, 2016)</span>
            </h4>
            <ol className="u1ks-num-list">
              <li><b>เครื่องจักรตอบสนองอย่างเดียว (Reactive Machines):</b> ดูแค่สถานการณ์ตรงหน้า ไม่มีความจำอดีต เช่น <i>Deep Blue</i> คำนวณตากระดานหมากรุกปัจจุบัน (มีแล้ว)</li>
              <li><b>ความจำช่วงสั้น (Limited Memory):</b> จำข้อมูลหรือบริบทที่เพิ่งเกิดขึ้นมาประกอบการตัดสินใจ เช่น <i>รถยนต์ไร้คนขับ</i> จำว่ารถคันข้าง ๆ เพิ่งเปลี่ยนเลน หรือแชตบอตจำบทสนทนาในห้องแชต (<b>AI ส่วนใหญ่ในปัจจุบัน</b>)</li>
              <li><b>ทฤษฎีจิตใจ (Theory of Mind):</b> เข้าใจอารมณ์ ความเชื่อ และเจตนาที่แท้จริงของมนุษย์ (ยังอยู่ในขั้นวิจัย)</li>
              <li><b>การตระหนักรู้ในตนเอง (Self-Awareness):</b> มีจิตสำนึกและความรู้สึกเป็นของตัวเอง (ยังเป็นแนวคิด)</li>
            </ol>
          </div>

          <div className="u1ks-panel-box indigo-tint">
            <h4>
              <span className="u1ks-ic-circle sm indigo"><Icon name="layers" size={17} /></span>
              <span>เกณฑ์ที่ 3 · แบ่งตามลักษณะงานที่ทำให้เรา</span>
            </h4>
            <ol className="u1ks-num-list">
              <li><b>วิเคราะห์และทำนาย (Analytical / Predictive AI):</b> วิเคราะห์ข้อมูลในอดีตเพื่อคาดการณ์แนวโน้มหรือตรวจจับสิ่งผิดปกติ เช่น <i>พยากรณ์อากาศ, แจ้งเตือนรูดบัตรเครดิตผิดปกติ</i></li>
              <li><b>สร้างสรรค์เนื้อหาใหม่ (Generative AI):</b> สร้างข้อความ ภาพ เสียง วิดีโอ หรือโค้ดใหม่ที่ไม่ซ้ำเดิม เช่น <i>เขียนร่างเรียงความ วาดภาพประกอบ แต่งทำนองเพลง</i></li>
              <li><b>เอเจนต์อัตโนมัติหลายขั้นตอน (Agentic AI):</b> รับเป้าหมายใหญ่แล้ววางแผนย่อยทำงานหลายขั้นเอง เช่น สั่งให้ค้นคว้าข้อมูล เปรียบเทียบ และสรุปตารางให้ โดยมีมนุษย์ตรวจสอบ</li>
            </ol>
            <div className="u1ks-mini-highlight">
              <b>ตัวอย่างการจัดหลายเกณฑ์พร้อมกัน:</b> แชตบอตช่วยร่างเรียงความ = <code>ANI (แบบแคบ)</code> + <code>ความจำช่วงสั้น</code> + <code>สร้างสรรค์ (Generative)</code>
            </div>
          </div>
        </div>

        <h3 className="u1ks-subhead">4 สาขาเทคโนโลยีหลักของปัญญาประดิษฐ์ (Core AI Subfields)</h3>
        <div className="u1ks-cards-4">
          {[
            {
              tone: 'blue',
              icon: 'camera',
              tag: 'Computer Vision',
              img: KS_IMAGES.subfieldCv,
              title: 'คอมพิวเตอร์วิทัศน์ (CV)',
              desc: 'ทำให้คอมพิวเตอร์ “มองเห็นและเข้าใจภาพ/วิดีโอ” เช่น ตรวจจับวัตถุ สแกนใบหน้า หรืออ่านภาพเอกซเรย์'
            },
            {
              tone: 'indigo',
              icon: 'chat',
              tag: 'NLP',
              img: KS_IMAGES.subfieldNlp,
              title: 'การประมวลผลภาษาธรรมชาติ',
              desc: 'ทำให้คอมพิวเตอร์ “เข้าใจและสร้างภาษามนุษย์” เช่น แปลภาษา สรุปบทความ วิเคราะห์ความรู้สึก และแชตบอต'
            },
            {
              tone: 'teal',
              icon: 'mic',
              tag: 'Speech AI',
              img: KS_IMAGES.subfieldSpeech,
              title: 'การประมวลผลเสียงพูด',
              desc: 'แปลงเสียงพูดเป็นข้อความ (Speech-to-Text) และสังเคราะห์เสียงพูดโต้ตอบ เช่น ผู้ช่วยสั่งงานด้วยเสียง'
            },
            {
              tone: 'amber',
              icon: 'cpu',
              tag: 'Robotics',
              img: KS_IMAGES.subfieldRobotics,
              title: 'วิทยาการหุ่นยนต์อัจฉริยะ',
              desc: 'ผสาน AI เข้ากับเซ็นเซอร์และกลไกเครื่องกล เพื่อให้หุ่นยนต์รับรู้สภาพแวดล้อมและเคลื่อนไหวทำงานจริงได้'
            }
          ].map((sf) => (
            <div key={sf.tag} className={`u1ks-vocab-card tone-${sf.tone}`}>
              <div className="u1ks-card-photo-wrap">
                <img src={sf.img} alt={sf.title} className="u1ks-card-photo" loading="lazy" />
                <span className={`u1ks-photo-chip tone-${sf.tone}`}>
                  <Icon name={sf.icon} size={13} /> {sf.tag}
                </span>
              </div>
              <h4>{sf.title}</h4>
              <p>{sf.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 1.7 ข้อจำกัดของ AI 4 ข้อ */}
      <section className="u1ks-section" id="p1-s7">
        <div className="u1ks-sec-head">
          <span className="u1ks-sec-num blue">07</span>
          <div>
            <h2>ข้อจำกัดของ AI 4 ประการที่ต้องรู้เท่าทัน</h2>
            <p>แม้ AI จะดูฉลาดและตอบคล่องแคล่ว แต่มีข้อจำกัดสำคัญที่ผู้ใช้ต้องตรวจสอบทุกครั้ง</p>
          </div>
        </div>

        <div className="u1ks-cards-2x2">
          <div className="u1ks-limit-card rose">
            <div className="u1ks-limit-top">
              <span className="u1ks-ic-circle rose"><Icon name="alert" size={20} /></span>
              <div>
                <h4>1. ภาวะหลอน (Hallucination)</h4>
                <small>แต่งเรื่องผิด ๆ ด้วยน้ำเสียงมั่นใจ</small>
              </div>
            </div>
            <p>แชตบอตทำงานโดยคาดเดาคำถัดไปที่น่าจะเป็นไปได้มากที่สุดจากสถิติ ไม่ได้ตรวจสอบความจริงเสมอไป จึงอาจสร้างชื่อหนังสือ กฎหมาย หรืองานวิจัยปลอมที่ไม่มีอยู่จริงขึ้นมาได้</p>
          </div>

          <div className="u1ks-limit-card amber">
            <div className="u1ks-limit-top">
              <span className="u1ks-ic-circle amber"><Icon name="scale" size={20} /></span>
              <div>
                <h4>2. ความลำเอียงตามข้อมูล (Bias)</h4>
                <small>สะท้อนความไม่สมดุลที่ซ่อนอยู่ในข้อมูลฝึก</small>
              </div>
            </div>
            <p>AI เรียนรู้จากข้อมูลตัวอย่างที่ป้อนให้ หากข้อมูลฝึกไม่ครอบคลุมคนทุกกลุ่ม ผลลัพธ์ก็จะเอนเอียงตาม เช่น ระบบสั่งงานด้วยเสียงที่ฝึกเฉพาะสำเนียงภาษากลางจนฟังสำเนียงท้องถิ่นเพี้ยน หรือระบบคัดกรองทุนที่ให้คะแนนตามชื่อโรงเรียนเดิม</p>
          </div>

          <div className="u1ks-limit-card blue">
            <div className="u1ks-limit-top">
              <span className="u1ks-ic-circle blue"><Icon name="clock" size={20} /></span>
              <div>
                <h4>3. ข้อมูลอาจไม่ทันสมัย (Knowledge Cutoff)</h4>
                <small>จำกัดอยู่แค่วันที่สิ้นสุดการฝึกโมเดล</small>
              </div>
            </div>
            <p>โมเดลพื้นฐานรู้ข้อมูลเพียงถึงช่วงเวลาที่หยุดฝึกเท่านั้น หากไม่ได้เชื่อมต่อระบบค้นหาเว็บแบบเรียลไทม์ อาจตอบเรื่องข่าวสารปัจจุบัน ราคาสินค้า หรือสถานะกฎหมายล่าสุดผิดพลาด</p>
          </div>

          <div className="u1ks-limit-card indigo">
            <div className="u1ks-limit-top">
              <span className="u1ks-ic-circle indigo"><Icon name="bulb" size={20} /></span>
              <div>
                <h4>4. ไม่ได้ “เข้าใจ” จริงแบบมนุษย์</h4>
                <small>ขาดประสบการณ์ชีวิตและสามัญสำนึก (Common Sense)</small>
              </div>
            </div>
            <p>AI เก่งในการจับความสัมพันธ์ของสัญลักษณ์และตัวเลข แต่ไม่มีความเข้าใจบริบทชีวิตจริงหรือความเห็นอกเห็นใจ จึงอาจพลาดในเรื่องพื้นฐานที่มนุษย์มองว่าเข้าใจง่าย</p>
          </div>
        </div>

        <div className="u1ks-safe-banner">
          <span className="u1ks-ic-circle emerald"><Icon name="shield" size={22} /></span>
          <div>
            <strong>หลักการใช้ AI ให้ปลอดภัย 3 ประการ (Use AI Safely):</strong>
            <div className="u1ks-safe-pills">
              <span><Icon name="search" size={14} /> 1. ตรวจสอบข้อมูลกับแหล่งที่เชื่อถือได้เสมอ</span>
              <span><Icon name="book" size={14} /> 2. เปิดดูแหล่งอ้างอิงต้นฉบับด้วยตนเอง</span>
              <span><Icon name="user" size={14} /> 3. ให้ AI เป็นเพียงผู้ช่วยคิด และ <b>“เราเป็นคนตัดสินใจสุดท้าย”</b></span>
            </div>
          </div>
        </div>
      </section>

      <QuickQuizBox quizKey="ks1" />

      <footer className="u1ks-sheet-footer no-print">
        <button
          type="button"
          className={`u1ks-done-btn ${checkedItems['u1-item-1'] ? 'is-done' : ''}`}
          onClick={() => handleCompleteTopic(KS_TABS[0], 'ks2')}
        >
          <Icon name="check" size={18} />
          <span>
            {checkedItems['u1-item-1']
              ? 'อ่านจบตอนที่ 1 แล้ว · ไปตอนที่ 2 (จริยธรรม AI & ความเสี่ยง) →'
              : 'ทำเครื่องหมายว่าอ่านจบตอนที่ 1 และไปตอนที่ 2 →'}
          </span>
        </button>
      </footer>
    </article>
  );
}
