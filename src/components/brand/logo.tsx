/**
 * UnitCrate cube mark — isometric box, variant A.
 *
 * Three faces, each a distinct value so both light and dark themes
 * show a clear 3-plane read:
 *   top   → brand orange (primary)
 *   left  → foreground at full opacity (the "lit" side)
 *   right → foreground at 0.52 opacity (the "shadow" side)
 *
 * Use `className` for sizing (e.g. "h-7 w-7"), `aria-hidden` is set by default.
 */
export function CubeMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* Top face — orange */}
      <path d="M12 2.5 20.5 7 12 11.5 3.5 7Z" fill="var(--primary)" />
      {/* Left face — fully lit */}
      <path d="M3.5 7 12 11.5 12 21.5 3.5 17Z" fill="currentColor" />
      {/* Right face — shadow side */}
      <path d="M20.5 7 12 11.5 12 21.5 20.5 17Z" fill="currentColor" opacity="0.52" />
    </svg>
  );
}

/** Full wordmark: cube + "UnitCrate" */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 font-bold tracking-tight ${className}`}>
      <CubeMark className="h-6 w-6" />
      <span>
        <span className="text-primary">Unit</span>Crate
      </span>
    </span>
  );
}
