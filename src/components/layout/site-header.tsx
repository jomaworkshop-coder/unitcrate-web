"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { CATEGORY_META, type UnitCategory } from "@/lib/units";

const NAV_CATS: UnitCategory[] = ["length", "weight", "temperature", "volume", "area", "speed", "time", "data", "cooking"];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border-soft bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <span className="text-primary">Unit</span>
          <span>Crate</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          {NAV_CATS.map((cat) => (
            <Link
              key={cat}
              href={`/${cat}`}
              className="px-3 py-1.5 rounded text-foreground-muted hover:text-foreground hover:bg-surface-muted transition-colors"
            >
              {CATEGORY_META[cat].label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden p-2 text-foreground-muted"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-ink bg-background px-4 py-3">
          <div className="grid grid-cols-2 gap-1">
            {NAV_CATS.map((cat) => (
              <Link
                key={cat}
                href={`/${cat}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-surface-muted"
              >
                <span>{CATEGORY_META[cat].emoji}</span>
                <span>{CATEGORY_META[cat].label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
