import React from 'react';
import { thaiDate } from './UIHelpers.jsx';

const DOW_TH = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];
export const dayTh = k => thaiDate(`${k}T00:00`); // อ่านเป็นเวลาเครื่อง ไม่ใช่ UTC

// ปฏิทินการเข้าเรียน 12 สัปดาห์ (weeks มาจาก visitStats) ใช้ทั้งหน้าแรกและแดชบอร์ดครู
export function VisitCalendar({ weeks }) {
  return (
    <>
      <div className="visit-cal" role="img" aria-label={`ปฏิทินการเข้าเรียน 12 สัปดาห์ล่าสุด เข้าเรียน ${weeks.flat().filter(d => d.on).length} วัน`}>
        <div className="visit-dow" aria-hidden="true">{DOW_TH.map(d => <span key={d}>{d}</span>)}</div>
        <div className="visit-grid" aria-hidden="true">
          {weeks.map(w => (
            <div key={w[0].key} className="visit-week">
              {w.map(d => (
                <i key={d.key} className={d.on ? 'on' : d.future ? 'future' : ''} title={d.future ? undefined : `${dayTh(d.key)}${d.on ? ' · เข้าเรียน' : ''}`} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="visit-legend"><i /> ไม่ได้เข้า <i className="on" /> เข้าเรียน · 12 สัปดาห์ล่าสุด</p>
    </>
  );
}
