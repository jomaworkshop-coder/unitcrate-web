/* Temporary internal page for choosing a logo mark. Not linked, not in sitemap. */

function CubeMark({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden>
      {/* isometric cube — orange top, ink sides */}
      <path d="M12 2.5 20.5 7 12 11.5 3.5 7Z" fill="var(--primary)" />
      <path d="M3.5 7 12 11.5 12 21.5 3.5 17Z" fill="currentColor" opacity="0.92" />
      <path d="M20.5 7 12 11.5 12 21.5 20.5 17Z" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

function SlatCrateMark({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" aria-hidden>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <line x1="3.5" y1="9.5" x2="20.5" y2="9.5" stroke="currentColor" strokeWidth="1.6" />
      <line x1="3.5" y1="14.5" x2="20.5" y2="14.5" stroke="var(--primary)" strokeWidth="1.8" />
      <line x1="8.5" y1="4.5" x2="8.5" y2="19.5" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      <line x1="15.5" y1="4.5" x2="15.5" y2="19.5" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
    </svg>
  );
}

function SwapSquareMark({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="var(--primary-soft)" stroke="var(--primary)" strokeWidth="1.6" />
      <path d="M8 10h7l-2-2" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 14H9l2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function OpenCrateMark({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" aria-hidden>
      {/* open box: front face + flap lid + a unit token rising out */}
      <path d="M4 11 12 8 20 11 20 18 12 21 4 18Z" fill="currentColor" opacity="0.9" />
      <path d="M4 11 12 14 20 11" stroke="var(--background)" strokeWidth="1.2" opacity="0.6" />
      <path d="M12 14 12 21" stroke="var(--background)" strokeWidth="1.2" opacity="0.6" />
      <circle cx="12" cy="5.5" r="2.6" fill="var(--primary)" />
    </svg>
  );
}

const VARIANTS = [
  { key: "A", name: "Isometric cube", Mark: CubeMark, note: "A solid 3-D box. Orange top face. Strongest 'container' read, great at tiny sizes." },
  { key: "B", name: "Slatted crate", Mark: SlatCrateMark, note: "Literal wooden crate with slats. Most on-the-nose to the name; gets busy below 20px." },
  { key: "C", name: "Swap square", Mark: SwapSquareMark, note: "Conversion ⇄ in a tile. Communicates the action over the name." },
  { key: "D", name: "Open crate + token", Mark: OpenCrateMark, note: "A box with a unit 'token' popping out. Most narrative, slightly more complex." },
];

function Wordmark({ Mark, size }: { Mark: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; size: number }) {
  return (
    <div className="flex items-center" style={{ gap: size * 0.28 }}>
      <Mark className="text-foreground" style={{ width: size, height: size } as React.CSSProperties} />
      <span className="font-bold tracking-tight" style={{ fontSize: size * 0.62 }}>
        <span className="text-primary">Unit</span>Crate
      </span>
    </div>
  );
}

export default function LogoLab() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12 space-y-10">
      <h1 className="text-2xl font-bold">Logo lab — pick a mark</h1>

      {VARIANTS.map(({ key, name, Mark, note }) => (
        <section key={key} className="rounded-2xl border border-border-soft bg-surface p-6 elev-1">
          <div className="mb-5 flex items-baseline gap-3">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{key}</span>
            <h2 className="text-lg font-semibold">{name}</h2>
            <p className="text-sm text-foreground-muted">{note}</p>
          </div>

          <div className="flex flex-wrap items-end gap-10">
            {/* favicon sizes */}
            <div className="flex items-end gap-4">
              {[16, 24, 32, 48].map((s) => (
                <div key={s} className="flex flex-col items-center gap-1.5">
                  <Mark className="text-foreground" style={{ width: s, height: s } as React.CSSProperties} />
                  <span className="text-[10px] text-foreground-muted">{s}px</span>
                </div>
              ))}
            </div>
            {/* wordmarks */}
            <div className="flex flex-col gap-3">
              <Wordmark Mark={Mark} size={28} />
              <Wordmark Mark={Mark} size={40} />
            </div>
            {/* on-color tile (app icon) */}
            <div className="flex items-end gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-surface-muted">
                <Mark className="text-foreground" style={{ width: 36, height: 36 } as React.CSSProperties} />
              </div>
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-foreground">
                <Mark className="text-background" style={{ width: 36, height: 36 } as React.CSSProperties} />
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
