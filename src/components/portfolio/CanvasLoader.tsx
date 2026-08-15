'use client';

import { Html, useProgress } from '@react-three/drei';

export default function CanvasLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 pointer-events-none">
        <div className="w-10 h-10 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        <span className="text-[10px] font-mono tracking-widest text-purple-300">
          INITIALIZING {progress.toFixed(0)}%
        </span>
      </div>
    </Html>
  );
}
