import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Icon, Button } from './UIPrimitives.jsx';

export function LessonSlideDeck({
  lessonId,
  slides = [],
  unitLabel = "UNIT 01",
  backLabel = "เมนูบทเรียน",
  deckTitle = "",
  onBack = null,
  onFinish = null,
  finishLabel = "",
  defaultFullscreen = true
}) {
  const [current, setCurrent] = useState(() => {
    try {
      const saved = sessionStorage.getItem(`slide_${lessonId}`);
      const idx = parseInt(saved, 10);
      return (!isNaN(idx) && idx >= 0 && idx < slides.length) ? idx : 0;
    } catch (e) {
      return 0;
    }
  });

  const [mode, setMode] = useState('slide'); // 'slide' | 'all'
  const [isFullscreen, setIsFullscreen] = useState(defaultFullscreen);
  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(
    () => typeof document !== 'undefined' && !!(document.fullscreenElement || document.webkitFullscreenElement)
  );
  const [tocOpen, setTocOpen] = useState(false);
  const deckRef = useRef(null);
  const touchStartX = useRef(null);

  // Sync browser fullscreen state
  useEffect(() => {
    const handleFsChange = () => {
      setIsBrowserFullscreen(!!(document.fullscreenElement || document.webkitFullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  // Sync slide index when lessonId changes
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(`slide_${lessonId}`);
      const idx = parseInt(saved, 10);
      setCurrent((!isNaN(idx) && idx >= 0 && idx < slides.length) ? idx : 0);
    } catch (e) {
      setCurrent(0);
    }
    setIsFullscreen(defaultFullscreen);
    setTocOpen(false);
  }, [lessonId, slides.length, defaultFullscreen]);

  // Save current slide to session storage
  useEffect(() => {
    try {
      sessionStorage.setItem(`slide_${lessonId}`, current);
    } catch (e) {}
  }, [lessonId, current]);

  // Lock body scroll when in fullscreen mode
  useEffect(() => {
    if (!isFullscreen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isFullscreen]);

  // Keyboard navigation when in slide mode
  useEffect(() => {
    if (mode !== 'slide') return;
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrent((prev) => Math.min(slides.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrent((prev) => Math.max(0, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, slides.length]);

  // Touch swipe support on mobile devices
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 55) {
      setCurrent((prev) => Math.min(slides.length - 1, prev + 1));
    } else if (diff < -55) {
      setCurrent((prev) => Math.max(0, prev - 1));
    }
    touchStartX.current = null;
  };

  const handleBackClick = () => {
    if (typeof document !== 'undefined' && (document.fullscreenElement || document.webkitFullscreenElement)) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
    if (onBack) onBack();
  };

  const toggleFullscreen = () => {
    const doc = document;
    const el = doc.documentElement;
    if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
      if (!isFullscreen) setIsFullscreen(true);
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      }
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen().catch(() => {});
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const onEscKey = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        if (tocOpen) {
          setTocOpen(false);
        } else if (!document.fullscreenElement && !document.webkitFullscreenElement) {
          if (onBack) {
            onBack();
          } else {
            setIsFullscreen(false);
          }
        }
      }
    };
    window.addEventListener('keydown', onEscKey);
    return () => window.removeEventListener('keydown', onEscKey);
  }, [isFullscreen, tocOpen, onBack]);

  const slide = slides[current] || slides[0];
  const progressPercent = Math.round(((current + 1) / slides.length) * 100);

  const deckElement = (
    <div
      ref={deckRef}
      className={`lesson-slide-deck ${isFullscreen ? 'deck-fullscreen' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="สไลด์บทเรียน"
    >
      {/* 1. Header Toolbar */}
      <div className="deck-toolbar">
        <div className="deck-toolbar-left">
          {onBack && (
            <button
              type="button"
              className="deck-fs-back-btn"
              onClick={handleBackClick}
              title={`กลับไปหน้า ${backLabel}`}
            >
              <Icon name="grid" size={15} />
              <span>{backLabel}</span>
            </button>
          )}
          <div className="deck-fs-unit-meta">
            <span className="deck-fs-unit-kicker">{unitLabel}</span>
            <span className="deck-fs-unit-title">{deckTitle || slide.title}</span>
          </div>
        </div>

        <div className="deck-toolbar-right">
          {/* Table of Contents Button */}
          <div className="deck-toc-wrapper">
            <button
              type="button"
              className={`deck-fullscreen-btn ${tocOpen ? 'active' : ''}`}
              onClick={() => setTocOpen(o => !o)}
              title="เปิดสารบัญสไลด์ทั้งหมด"
            >
              <Icon name="list" size={15} />
              <span>สารบัญ</span>
            </button>
            {tocOpen && (
              <div className="deck-toc-popover" role="menu">
                <div className="deck-toc-header">
                  <strong>สารบัญสไลด์ ({slides.length} หน้า)</strong>
                  <button
                    type="button"
                    className="deck-toc-close"
                    onClick={() => setTocOpen(false)}
                    aria-label="ปิดสารบัญ"
                  >
                    ✕
                  </button>
                </div>
                <div className="deck-toc-list">
                  {slides.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`deck-toc-item ${idx === current ? 'active' : ''}`}
                      onClick={() => {
                        setCurrent(idx);
                        setMode('slide');
                        setTocOpen(false);
                      }}
                    >
                      <span className="deck-toc-num">{idx + 1}</span>
                      <span className="deck-toc-text">{s.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Fullscreen / Exit Fullscreen Button */}
          <button
            type="button"
            className={`deck-fullscreen-btn ${isBrowserFullscreen ? 'active' : ''}`}
            onClick={toggleFullscreen}
            title={isBrowserFullscreen ? "ออกจากโหมดเต็มจอ (หรือกด Esc)" : "ขยายสไลด์ให้เต็มจอทั้งหมด"}
            aria-label={isBrowserFullscreen ? "ออกจากเต็มจอ" : "เต็มจอ"}
          >
            <Icon name={isBrowserFullscreen ? "minimize" : "expand"} size={15} />
            <span>{isBrowserFullscreen ? "ออกจากเต็มจอ" : "เต็มจอ"}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar (Non-Fullscreen Slide Mode only) */}
      {mode === 'slide' && !isFullscreen && (
        <div className="deck-progress-track" aria-hidden="true">
          <div
            className="deck-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* 2. Main Slide Area */}
      {mode === 'slide' ? (
        <div className="deck-slide-stage">
          {/* Floating Navigation: Prev */}
          <button
            type="button"
            className="deck-nav-arrow deck-nav-prev"
            disabled={current === 0}
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            title="สไลด์ก่อนหน้า (หรือกดลูกศรซ้าย ←)"
            aria-label="สไลด์ก่อนหน้า"
          >
            <Icon name="chevL" size={24} />
          </button>

          {/* Slide Content Card */}
          <div
            className={[
              'deck-slide-card',
              slide.theme ? `slide-theme-${slide.theme}` : 'slide-theme-blue',
              slide.variant ? `slide-variant-${slide.variant}` : ''
            ].filter(Boolean).join(' ')}
            key={`${lessonId}-slide-${current}`}
          >
            <div className="deck-dots-pattern" aria-hidden="true" />
            {slide.variant !== 'cover' && slide.variant !== 'divider' && slide.variant !== 'think' && (
              <div className="deck-slide-header">
                <div className="deck-slide-header-row">
                  <span className={`deck-slide-icon-badge ${slide.theme || 'blue'}`}>
                    <Icon name={slide.icon || 'bulb'} size={22} />
                  </span>
                  <div className="deck-slide-header-text">
                    <div className="deck-slide-eyebrow">
                      {slide.tag || `SLIDE ${current + 1} OF ${slides.length}`}
                    </div>
                    <h3 className="deck-slide-heading">{slide.title}</h3>
                  </div>
                </div>
                {slide.subtitle && (
                  <p className="deck-slide-sub">{slide.subtitle}</p>
                )}
              </div>
            )}

            <div className="deck-slide-body">
              {slide.content}
            </div>

            {slide.footer && (
              <div className="deck-slide-footer-meta">
                {slide.footer}
              </div>
            )}

            {/* Checkpoint Banner on Last Slide */}
            {current === slides.length - 1 && !slide.hideDoneBanner && (
              <div className="deck-slide-done-banner" role="status">
                <span className="banner-icon">
                  <Icon name="sparkle" size={22} />
                </span>
                <div className="banner-text">
                  <strong>ยอดเยี่ยมมาก! ศึกษาเนื้อหาครบทุกสไลด์แล้ว</strong>
                  <span>กดปุ่มบันทึกความก้าวหน้าด้านล่าง หรือเลือกชุดการเรียนรู้ถัดไปได้เลย</span>
                </div>
              </div>
            )}
          </div>

          {/* Floating Navigation: Next */}
          <button
            type="button"
            className="deck-nav-arrow deck-nav-next"
            disabled={current === slides.length - 1}
            onClick={() => setCurrent((c) => Math.min(slides.length - 1, c + 1))}
            title="สไลด์ถัดไป (หรือกดลูกศรขวา →)"
            aria-label="สไลด์ถัดไป"
          >
            <Icon name="chevR" size={24} />
          </button>
        </div>
      ) : (
        /* Overview Mode: Stack all slides */
        <div className="deck-all-slides">
          {slides.map((s, idx) => (
            <div
              className={[
                'deck-slide-card stacked',
                s.theme ? `slide-theme-${s.theme}` : 'slide-theme-blue',
                s.variant ? `slide-variant-${s.variant}` : ''
              ].filter(Boolean).join(' ')}
              key={`${lessonId}-all-${idx}`}
            >
              <div className="deck-dots-pattern" aria-hidden="true" />
              {s.variant !== 'cover' && s.variant !== 'divider' && s.variant !== 'think' && (
                <div className="deck-slide-header">
                  <div className="deck-slide-header-row">
                    <span className={`deck-slide-icon-badge ${s.theme || 'blue'}`}>
                      <Icon name={s.icon || 'bulb'} size={22} />
                    </span>
                    <div className="deck-slide-header-text">
                      <div className="deck-slide-eyebrow">
                        {s.tag || `ส่วนที่ ${idx + 1} จาก ${slides.length}`}
                      </div>
                      <h3 className="deck-slide-heading">{s.title}</h3>
                    </div>
                  </div>
                  {s.subtitle && <p className="deck-slide-sub">{s.subtitle}</p>}
                </div>
              )}
              <div className="deck-slide-body">{s.content}</div>
              {s.footer && <div className="deck-slide-footer-meta">{s.footer}</div>}
            </div>
          ))}
        </div>
      )}

      {/* 3. Bottom Navigation Controls (Slide Mode only) */}
      {mode === 'slide' && (
        <div className="deck-bottom-bar">
          <button
            type="button"
            className="deck-fs-nav-btn deck-fs-prev"
            disabled={current === 0}
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          >
            ← ก่อนหน้า
          </button>

          {/* Segmented Horizontal Slide Track (Reference Style) */}
          <div className="deck-seg-track" role="tablist" aria-label="เลือกสไลด์">
            {slides.map((s, idx) => {
              const isVisited = idx < current;
              const isTeal = isVisited && idx >= Math.ceil(slides.length * 0.35);
              return (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={idx === current}
                  aria-label={`สไลด์ ${idx + 1}: ${s.title}`}
                  className={[
                    'deck-seg-bar',
                    idx === current ? 'active' : '',
                    isVisited ? 'visited' : '',
                    isTeal ? 'visited-teal' : ''
                  ].filter(Boolean).join(' ')}
                  onClick={() => setCurrent(idx)}
                  title={`สไลด์ ${idx + 1}: ${s.title}`}
                />
              );
            })}
          </div>

          <div className="deck-bottom-right">
            <span className="deck-fs-counter">
              <strong>{current + 1}</strong> / {slides.length}
            </span>
            <button
              type="button"
              className="deck-fs-nav-btn deck-fs-next"
              disabled={current === slides.length - 1 && !onFinish}
              onClick={() => {
                if (current === slides.length - 1) {
                  if (onFinish) onFinish();
                } else {
                  setCurrent((c) => Math.min(slides.length - 1, c + 1));
                }
              }}
            >
              {current === slides.length - 1 ? (finishLabel || 'สไลด์สุดท้าย') : 'ถัดไป →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (isFullscreen && typeof document !== 'undefined') {
    return createPortal(deckElement, document.body);
  }

  return deckElement;
}

export default LessonSlideDeck;
