import React from 'react';

/**
 * Shared chrome for the 3D lab across every locale.
 *
 * Navbar and GoldenCursorTrail are deliberately absent — the root layout and
 * ClientShell already render them globally, and mounting them again here meant
 * /3d ran two fixed navbars and two cursor-trail canvases stacked on top of
 * each other.
 */
export default function ThreeDShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#050409] text-white selection:bg-purple-600 selection:text-white overflow-x-hidden antialiased">
      {children}
    </div>
  );
}
