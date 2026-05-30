"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { CATEGORY_META, type UnitCategory } from "@/lib/units";
import { Wordmark } from "@/components/brand/logo";

const NAV_CATS: UnitCategory[] = ["length", "weight", "temperature", "volume", "area", "speed", "time", "data", "cooking"];

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // Sync with whatever the boot script set
  useEffect(() => {
    setDark(document.documentElement.getAttribute("data-theme") === "dark");
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-border-soft bg-surface text-foreground-muted transition-colors [@media(hover:hover)]:hover:border-ink [@media(hover:hover)]:hover:text-foreground"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border-soft bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="UnitCrate home">
          <Wordmark className="text-lg" />
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

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            className="md:hidden p-2 text-foreground-muted"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border-soft bg-background px-4 py-3">
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
