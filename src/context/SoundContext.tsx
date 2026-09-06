'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { playShutter } from '@/lib/shutter';

const STORAGE_KEY = 'terkina-shutter-sound';
/** Rapid clicking would otherwise stack shutters into mush. */
const MIN_INTERVAL_MS = 70;

interface SoundValue {
  enabled: boolean;
  toggle: () => void;
}

const SoundContext = createContext<SoundValue>({ enabled: false, toggle: () => {} });

export function SoundProvider({
  children,
  active = true,
}: {
  children: React.ReactNode;
  /** False inside the CRM — context still exists, but nothing ever plays. */
  active?: boolean;
}) {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const lastPlayedRef = useRef(0);

  // Restore the visitor's choice. On by default — only an explicit opt-out
  // ('0', written by the toggle) silences it, so a first-time visitor hears
  // the shutter. Nothing can actually sound before their first click anyway:
  // browsers keep the AudioContext suspended until a user gesture.
  useEffect(() => {
    try {
      setEnabled(localStorage.getItem(STORAGE_KEY) !== '0');
    } catch {
      /* private mode / blocked storage — fall back to the default */
      setEnabled(true);
    }
  }, []);

  const play = useCallback(() => {
    const now = Date.now();
    if (now - lastPlayedRef.current < MIN_INTERVAL_MS) return;
    lastPlayedRef.current = now;

    try {
      const AudioCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtor) return;

      if (!ctxRef.current) ctxRef.current = new AudioCtor();
      const ctx = ctxRef.current;
      // Browsers park the context until a gesture; a click is one.
      if (ctx.state === 'suspended') void ctx.resume();

      playShutter(ctx);
    } catch {
      /* audio unavailable — never let this break a click */
    }
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
      } catch {
        /* ignore */
      }
      // Fire once on enable so the choice is immediately audible.
      if (next) setTimeout(play, 0);
      return next;
    });
  }, [play]);

  // One delegated listener covers every interactive element on the page,
  // rather than threading a sound prop through every component.
  useEffect(() => {
    if (!enabled || !active) return;

    const handler = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest) return;
      const interactive = target.closest(
        'a, button, [role="button"], input[type="checkbox"], input[type="radio"], select'
      );
      if (!interactive) return;
      // The toggle handles its own feedback on enable.
      if (interactive.hasAttribute('data-no-shutter')) return;
      play();
    };

    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [enabled, active, play]);

  // Release the audio hardware when the provider unmounts.
  useEffect(() => {
    return () => {
      void ctxRef.current?.close();
      ctxRef.current = null;
    };
  }, []);

  return (
    <SoundContext.Provider value={{ enabled: enabled && active, toggle }}>
      {children}
    </SoundContext.Provider>
  );
}

export const useSound = () => useContext(SoundContext);
