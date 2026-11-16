import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../../UIPrimitives.jsx';
import { COURSE } from '../../../data/courseData.js';
import { KS_TABS, SELF_CHECK_GOALS } from './knowledgeData.js';
import { scrollToKnowledgeSection } from './KnowledgeWidgets.jsx';
import Topic1WhatIsAI from './Topic1WhatIsAI.jsx';
import Topic2EthicsAndRisk from './Topic2EthicsAndRisk.jsx';
import Topic3PdpaAndDeepfake from './Topic3PdpaAndDeepfake.jsx';
import Topic4SummaryAndRefs from './Topic4SummaryAndRefs.jsx';

const TAB_ARTICLE_IDS = {
  ks1: 'ks-part-1',
  ks2: 'ks-part-2',
  ks3: 'ks-part-3',
  summary: 'ks-summary'
};

/* =====================================================================
   โครงหลักหน้าอ่านใบความรู้หน่วยที่ 1 (แถบเครื่องมือ แท็บหัวข้อ และโหมดพิมพ์ PDF)
   ===================================================================== */

export default function Unit1KnowledgeSheet({
  initialTopic = 'ks1',
  onBack,
  onOpenSlides,
  checkedItems = {},
  onToggleCheck,
  onMarkSetDone,
  isBrowserFs = false,
  onToggleBrowserFs
}) {
  const [activeTab, setActiveTab] = useState(initialTopic || 'ks1');
  const [continuousMode, setContinuousMode] = useState(false);
  const [selfChecks, setSelfChecks] = useState(() => {
    try {
      const saved = localStorage.getItem('krunok_u1_ks_selfchecks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const scrollContainerRef = useRef(null);

  const handleExitBack = useCallback(() => {
    if (typeof document !== 'undefined' && (document.fullscreenElement || document.webkitFullscreenElement)) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
    onBack?.();
  }, [onBack]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    if (initialTopic) {
      setActiveTab(initialTopic);
    }
  }, [initialTopic]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab, continuousMode]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !document.fullscreenElement && !document.webkitFullscreenElement) {
        handleExitBack();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleExitBack]);

  const toggleSelfCheck = (id) => {
    setSelfChecks(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('krunok_u1_ks_selfchecks', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const currentMeta = KS_TABS.find(t => t.id === activeTab) || KS_TABS[0];
  const showPart1 = continuousMode || activeTab === 'ks1';
  const showPart2 = continuousMode || activeTab === 'ks2';
  const showPart3 = continuousMode || activeTab === 'ks3';
  const showSummary = continuousMode || activeTab === 'summary';

  const handleCompleteTopic = (tabMeta, nextTabId) => {
    if (tabMeta.checkId && !checkedItems[tabMeta.checkId]) {
      onToggleCheck?.(tabMeta.checkId);
    }
    if (tabMeta.lessonIds?.length) {
      onMarkSetDone?.(tabMeta.lessonIds, `ใบความรู้: ${tabMeta.title}`);
    }
    if (nextTabId) {
      if (!continuousMode) {
        setActiveTab(nextTabId);
      } else if (TAB_ARTICLE_IDS[nextTabId]) {
        scrollToKnowledgeSection(TAB_ARTICLE_IDS[nextTabId]);
      }
    }
  };

  const handlePrintPdf = () => {
    if (!continuousMode) {
      setContinuousMode(true);
      const restoreMode = () => setContinuousMode(false);
      window.addEventListener('afterprint', restoreMode, { once: true });
      setTimeout(() => window.print(), 150);
    } else {
      window.print();
    }
  };

  const selfCheckedCount = SELF_CHECK_GOALS.filter(g => selfChecks[g.id]).length;

  const content = (
    <div className="u1ks-portal" ref={scrollContainerRef}>
      {/* 1. Top Toolbar */}
      <header className="u1ks-topbar no-print">
        <div className="u1ks-topbar-left">
          <button type="button" className="deck-fs-back-btn" onClick={handleExitBack}>
            <Icon name="grid" size={15} />
            <span>เมนูบทเรียน</span>
          </button>
          <div className="u1ks-unit-meta">
            <span className="u1ks-kicker-pill">UNIT 01 · ใบความรู้ 1.1</span>
            <strong className="u1ks-top-title">
              {continuousMode ? 'ใบความรู้หน่วยที่ 1 (ฉบับเต็มทั้ง 3 หัวข้อ)' : currentMeta.title}
            </strong>
          </div>
        </div>

        <div className="u1ks-topbar-right">
          <button
            type="button"
            className={`u1ks-action-btn ${continuousMode ? 'is-active' : ''}`}
            onClick={() => setContinuousMode(v => !v)}
            title="สลับโหมดอ่านทีละหัวข้อ หรือเลื่อนอ่านทั้งหน่วยต่อเนื่อง"
          >
            <Icon name="fileText" size={15} />
            <span>{continuousMode ? 'แยกอ่านทีละบท' : 'อ่านต่อเนื่องทั้งหน่วย'}</span>
          </button>

          <button
            type="button"
            className="u1ks-action-btn slide-jump"
            onClick={() => onOpenSlides?.(currentMeta.slideSection || 'set1')}
            title="เปิดสไลด์นำเสนอของหัวข้อนี้แบบเต็มจอ"
          >
            <Icon name="tv" size={15} />
            <span>สไลด์เต็มจอ</span>
          </button>

          <button
            type="button"
            className="u1ks-action-btn"
            onClick={handlePrintPdf}
            title="พิมพ์ใบความรู้ หรือบันทึกเป็น PDF"
          >
            <Icon name="copy" size={15} />
            <span>พิมพ์ / PDF</span>
          </button>

          {onToggleBrowserFs && (
            <button
              type="button"
              className={`deck-fullscreen-btn ${isBrowserFs ? 'active' : ''}`}
              onClick={onToggleBrowserFs}
              title={isBrowserFs ? 'ออกจากโหมดเต็มจอ (หรือกด Esc)' : 'ขยายใบความรู้ให้เต็มจอทั้งหมด'}
            >
              <Icon name={isBrowserFs ? 'minimize' : 'expand'} size={15} />
              <span>{isBrowserFs ? 'ออกจากเต็มจอ' : 'เต็มจอ'}</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. Topic Navigation Bar */}
      <nav className="u1ks-tabbar no-print" aria-label="เลือกหัวข้อใบความรู้หน่วยที่ 1">
        <div className="u1ks-tabbar-inner">
          {KS_TABS.map((tab) => {
            const isDone = tab.checkId ? !!checkedItems[tab.checkId] : selfCheckedCount === SELF_CHECK_GOALS.length;
            const isCurrent = !continuousMode && activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`u1ks-tab theme-${tab.theme} ${isCurrent ? 'is-active' : ''}`}
                onClick={() => {
                  setContinuousMode(false);
                  setActiveTab(tab.id);
                }}
              >
                <span className="u1ks-tab-icon">
                  <Icon name={isDone ? 'check' : tab.icon} size={15} />
                </span>
                <span className="u1ks-tab-label">{tab.shortLabel}</span>
                {isDone && <span className="u1ks-tab-done-dot" title="อ่านจบแล้ว" />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. Main Sheet Body */}
      <main className="u1ks-main">
        {/* Print-only Master Header */}
        <div className="u1ks-print-header print-only">
          <div>
            <strong>{COURSE.academy} · รายวิชา {COURSE.code} {COURSE.name} ({COURSE.level})</strong>
            <h1>ใบความรู้หน่วยการเรียนรู้ที่ 1: แนวคิดเบื้องต้นเกี่ยวกับปัญญาประดิษฐ์</h1>
            <p>{COURSE.term} · กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี (สาขาเทคโนโลยี)</p>
          </div>
        </div>

        {showPart1 && (
          <Topic1WhatIsAI
            checkedItems={checkedItems}
            handleCompleteTopic={handleCompleteTopic}
          />
        )}

        {showPart2 && (
          <Topic2EthicsAndRisk
            checkedItems={checkedItems}
            handleCompleteTopic={handleCompleteTopic}
          />
        )}

        {showPart3 && (
          <Topic3PdpaAndDeepfake
            checkedItems={checkedItems}
            handleCompleteTopic={handleCompleteTopic}
          />
        )}

        {showSummary && (
          <Topic4SummaryAndRefs
            selfChecks={selfChecks}
            selfCheckedCount={selfCheckedCount}
            toggleSelfCheck={toggleSelfCheck}
            onBack={handleExitBack}
          />
        )}
      </main>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(content, document.body);
  }
  return content;
}
