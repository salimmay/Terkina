'use client';

import React, { useEffect, useState } from 'react';
import styles from './BrandLoader.module.css';

// Held long enough for the bracket wipe + wordmark fade to actually land,
// even when the page is already cached and `load` fires immediately.
const MIN_VISIBLE_MS = 1800;
const FADE_MS = 500;

const TAGS = ['ART', 'CREATIVITY', 'TECHNOLOGIE'];

export default function BrandLoader() {
  const [mounted, setMounted] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const startedAt = performance.now();
    let fadeTimer: ReturnType<typeof setTimeout>;
    let unmountTimer: ReturnType<typeof setTimeout>;

    const dismiss = () => {
      const remaining = Math.max(0, MIN_VISIBLE_MS - (performance.now() - startedAt));
      fadeTimer = setTimeout(() => {
        setLeaving(true);
        unmountTimer = setTimeout(() => setMounted(false), FADE_MS);
      }, remaining);
    };

    if (document.readyState === 'complete') {
      dismiss();
    } else {
      window.addEventListener('load', dismiss);
    }

    return () => {
      window.removeEventListener('load', dismiss);
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  // Keep the page from scrolling underneath the splash.
  useEffect(() => {
    if (!mounted) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      role="status"
      aria-label="Loading TERKINA"
      className={`${styles.container} ${leaving ? styles.leaving : ''}`}
    >
      <div className={styles.box}>
        <svg
          className={styles.bulb}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M9 18h6m-4 3h2m-4-6a9 9 0 1 1 6 0c-1.2.8-2 2.2-2 3.5V17H9v-1.5c0-1.3-.8-2.7-2-3.5z" />
        </svg>

        <div className={styles.bracket} />

        <div className={styles.tagViewport} aria-hidden="true">
          <div className={styles.tagTrack}>
            {TAGS.map((tag) => (
              <span key={tag} className={styles.tagItem}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div>
          <span className={styles.title}>TERKINA</span>
        </div>
      </div>
    </div>
  );
}
