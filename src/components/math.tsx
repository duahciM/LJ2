import { useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";

/** Inline fraction, drawn with a hairline rule. */
export function Fr({
  num,
  den,
  className,
}: {
  num: ReactNode;
  den: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("frac", className)}>
      <span className="num">{num}</span>
      <span className="den">{den}</span>
    </span>
  );
}

/** C with n stacked over r — the notation used throughout this notebook. */
export function Binom({
  n,
  r,
  className,
}: {
  n: ReactNode;
  r: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("binom", className)}>
      <span className="b-letter">C</span>
      <span className="b-stack">
        <span className="b-top">{n}</span>
        <span className="b-bot">{r}</span>
      </span>
    </span>
  );
}

export function Pow({
  base,
  exp,
  className,
}: {
  base: ReactNode;
  exp: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("pow", className)}>
      {base}
      <sup>{exp}</sup>
    </span>
  );
}

export function Var({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <i className={cn("v", className)}>{children}</i>;
}

export function CopyButton({
  value,
  label = "复制 LaTeX",
}: {
  value: string;
  label?: string;
}) {
  const [done, setDone] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* clipboard unavailable */
      }
      document.body.removeChild(ta);
    }
    setDone(true);
    window.setTimeout(() => setDone(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="label inline-flex h-9 shrink-0 items-center border border-line px-2.5 text-[10px] transition-colors hover:border-ink hover:text-ink active:scale-95"
    >
      {done ? "已复制 ✓" : label}
    </button>
  );
}

export function Formula({
  children,
  latex,
  label,
  size,
  className,
}: {
  children: ReactNode;
  latex?: string;
  label?: string;
  size?: "lg";
  className?: string;
}) {
  return (
    <figure className={cn("formula", size === "lg" && "formula-lg", className)}>
      <div className="flex items-start justify-between gap-3">
        <figcaption className="label">{label ?? " "}</figcaption>
        {latex ? <CopyButton value={latex} /> : null}
      </div>
      <div className="formula-body mt-3">{children}</div>
    </figure>
  );
}

/** A row of small monospaced facts, e.g. 7! = 5040 */
export function Fact({
  k,
  v,
}: {
  k: ReactNode;
  v: ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-2 last:border-b-0">
      <span className="font-mono text-xs text-muted">{k}</span>
      <span className="font-mono text-sm tnum">{v}</span>
    </div>
  );
}
