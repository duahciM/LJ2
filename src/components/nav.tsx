import { useEffect, useState, type ReactNode } from "react";

export type Chapter = {
  id: string;
  index: string;
  title: string;
  latin: string;
};

export const CHAPTERS: Chapter[] = [
  { id: "cover", index: "00", title: "导览", latin: "Contents" },
  { id: "factorial", index: "01", title: "阶乘", latin: "Factorials" },
  { id: "combination", index: "02", title: "组合", latin: "Combinations" },
  { id: "pascal", index: "03", title: "杨辉三角", latin: "Pascal's Triangle" },
  { id: "theorem", index: "04", title: "二项式定理", latin: "Binomial Theorem" },
  { id: "problems", index: "05", title: "题型与通项", latin: "Problem Types" },
  { id: "cases", index: "06", title: "常用特例", latin: "Special Cases" },
  { id: "unknowns", index: "07", title: "未知参数", latin: "Unknowns" },
  { id: "products", index: "08", title: "乘积的特定项", latin: "Products" },
  { id: "review", index: "09", title: "速查与自测", latin: "Review" },
];

export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);

  return active;
}

export function useScrollProgress(): number {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return p;
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="no-print fixed inset-x-0 top-0 z-50 h-[2px] bg-transparent">
      <div
        className="h-full bg-ink transition-[width] duration-150 ease-out"
        style={{ width: `${value * 100}%` }}
      />
    </div>
  );
}

export function TopBar({
  activeId,
  onMenu,
}: {
  activeId: string;
  onMenu: () => void;
}) {
  const current = CHAPTERS.find((c) => c.id === activeId) ?? CHAPTERS[0];
  return (
    <header className="no-print sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-[1180px] items-center justify-between gap-4 px-5 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="font-mono text-[11px] tnum tracking-[0.2em] text-muted">
            {current.index}
          </span>
          <span className="truncate text-[13px] font-medium tracking-tight">
            {current.title}
          </span>
          <span className="hidden truncate font-mono text-[10px] uppercase tracking-[0.18em] text-muted sm:inline">
            {current.latin}
          </span>
        </div>
        <button
          type="button"
          onClick={onMenu}
          className="flex h-10 items-center gap-2 border border-line px-3 font-mono text-[11px] tracking-[0.14em] transition-colors hover:border-ink"
        >
          目录
          <span className="flex flex-col gap-[3px]">
            <span className="block h-px w-3 bg-current" />
            <span className="block h-px w-3 bg-current" />
            <span className="block h-px w-3 bg-current" />
          </span>
        </button>
      </div>
    </header>
  );
}

export function TocSheet({
  open,
  onClose,
  activeId,
}: {
  open: boolean;
  onClose: () => void;
  activeId: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const go = (id: string) => {
    onClose();
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  return (
    <div className="no-print fixed inset-0 z-50 flex flex-col bg-paper" role="dialog" aria-label="目录">
      <div className="flex h-14 items-center justify-between border-b border-line px-5 sm:px-8">
        <span className="label text-ink">目录 / CONTENTS</span>
        <button type="button" onClick={onClose} className="btn btn-ghost h-10 min-h-0 px-3">
          关闭 ✕
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto px-5 py-4 sm:px-8">
        <ul>
          {CHAPTERS.map((c) => (
            <li key={c.id} className="border-b border-line">
              <button
                type="button"
                onClick={() => go(c.id)}
                className="flex w-full items-baseline gap-4 py-4 text-left transition-opacity hover:opacity-60"
              >
                <span className="font-mono text-[11px] tnum tracking-[0.2em] text-muted">
                  {c.index}
                </span>
                <span className="text-[1.35rem] font-medium tracking-tight">{c.title}</span>
                <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                  {c.latin}
                </span>
                {c.id === activeId ? (
                  <span className="font-mono text-[10px] text-ink">●</span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-line px-5 py-4 font-mono text-[10px] tracking-[0.16em] text-muted sm:px-8">
        COMBINATORICS · STUDY NOTE · 2026
      </div>
    </div>
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="no-print fixed bottom-5 left-5 z-30 flex h-12 w-12 items-center justify-center border border-ink bg-paper font-mono text-[11px] transition-colors hover:bg-ink hover:text-paper active:scale-95"
      aria-label="回到顶部"
    >
      ↑
    </button>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8">{children}</div>
  );
}
