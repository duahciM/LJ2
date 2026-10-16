import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/utils/cn";
import { clamp } from "@/lib/comb";

/** Fades content in the first time it enters the viewport. Motion serves reading. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal", seen && "is-in", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/** Chapter header: index, chinese title, latin subtitle. */
export function Section({
  id,
  index,
  title,
  latin,
  lead,
  children,
}: {
  id: string;
  index: string;
  title: string;
  latin: string;
  lead?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-14 border-t border-line py-14 sm:py-20"
    >
      <Reveal>
        <header className="grid gap-4 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <div className="font-mono text-xs tnum tracking-[0.2em] text-muted">
              {index}
            </div>
          </div>
          <div className="lg:col-span-9">
            <h2 className="text-[2rem] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[2.9rem]">
              {title}
            </h2>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
              {latin}
            </p>
            {lead ? (
              <div className="mt-5 max-w-[62ch] text-[15px] leading-[1.95] text-ink/80">
                {lead}
              </div>
            ) : null}
          </div>
        </header>
      </Reveal>
      <div className="mt-10 sm:mt-14">{children}</div>
    </section>
  );
}

/** Bordered note block with a monospaced marker in the margin. */
export function Note({
  mark = "注",
  title,
  children,
}: {
  mark?: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="instrument flex gap-4 p-4 sm:p-5">
      <div className="label shrink-0 pt-1">{mark}</div>
      <div className="min-w-0 flex-1 text-[14px] leading-[1.9] text-ink/85">
        {title ? (
          <div className="mb-1 text-[13px] font-semibold tracking-tight text-ink">
            {title}
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}

/** Touch friendly + / − stepper. */
export function Stepper({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
  suffix,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  suffix?: string;
}) {
  const dec = () => onChange(clamp(Number((value - step).toFixed(4)), min, max));
  const inc = () => onChange(clamp(Number((value + step).toFixed(4)), min, max));

  return (
    <div className="flex items-center gap-3">
      <span className="label">{label}</span>
      <div className="flex items-stretch border border-line">
        <button
          type="button"
          onClick={dec}
          disabled={value <= min}
          aria-label={`${label} 减少`}
          className="h-11 w-11 text-lg leading-none transition-colors hover:bg-ink hover:text-paper disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink active:scale-95"
        >
          −
        </button>
        <div className="flex min-w-[3.6rem] items-center justify-center border-x border-line px-2 font-mono text-sm tnum">
          {format ? format(value) : value}
          {suffix ? <span className="ml-0.5 text-muted">{suffix}</span> : null}
        </div>
        <button
          type="button"
          onClick={inc}
          disabled={value >= max}
          aria-label={`${label} 增加`}
          className="h-11 w-11 text-lg leading-none transition-colors hover:bg-ink hover:text-paper disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink active:scale-95"
        >
          +
        </button>
      </div>
    </div>
  );
}

/** Touch friendly range input with a live readout. */
export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  display,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  display?: (v: number) => string;
  hint?: ReactNode;
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <span className="label">{label}</span>
        <span className="font-mono text-sm tnum">
          {display ? display(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      {hint ? (
        <div className="mt-1 text-[12px] leading-relaxed text-muted">{hint}</div>
      ) : null}
    </div>
  );
}

/** Chip used for mode switches. */
export function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-[38px] border px-3 font-mono text-[11px] tracking-[0.08em] transition-colors active:scale-95",
        active
          ? "border-ink bg-ink text-paper"
          : "border-line text-muted hover:border-ink hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

/** Bordered container for interactive instruments. */
export function Instrument({
  title,
  note,
  children,
  className,
}: {
  title: string;
  note?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("instrument", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line px-4 py-3 sm:px-5">
        <span className="label text-ink">{title}</span>
        {note ? (
          <span className="font-mono text-[10px] text-muted">{note}</span>
        ) : null}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

/** Definition list used for properties and special cases. */
export function DefList({
  items,
}: {
  items: { k: ReactNode; v: ReactNode }[];
}) {
  return (
    <dl className="border-t border-line">
      {items.map((it, i) => (
        <div
          key={i}
          className="grid grid-cols-1 gap-1 border-b border-line py-3 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-6"
        >
          <dt className="font-mono text-[13px] leading-7">{it.k}</dt>
          <dd className="text-[14px] leading-7 text-ink/80">{it.v}</dd>
        </div>
      ))}
    </dl>
  );
}
