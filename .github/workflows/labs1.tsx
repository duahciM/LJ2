import { useMemo, useState } from "react";
import { Binom, Fact, Formula, Fr, Pow, Var } from "@/components/math";
import { Chip, Instrument, Note, Stepper } from "@/components/ui";
import { choose, clamp, factorial, signed } from "@/lib/comb";

/* ------------------------------------------------------------------ */
/* 01 · 阶乘：展开尺 + 化简实验室                                        */
/* ------------------------------------------------------------------ */

type SimplifyPreset = {
  id: string;
  label: string;
  /** top factorial = n + topOffset (or a concrete number when concrete) */
  topOffset: number;
  bottomOffset: number;
  concrete?: number;
};

const PRESETS: SimplifyPreset[] = [
  { id: "p1", label: "(n+3)! / (n+1)!", topOffset: 3, bottomOffset: 1 },
  { id: "p2", label: "(n+2)! / n!", topOffset: 2, bottomOffset: 0 },
  { id: "p3", label: "n! / (n−3)!", topOffset: 0, bottomOffset: -3 },
  { id: "p4", label: "8! / 5!", topOffset: 3, bottomOffset: 0, concrete: 8 },
];

function OffsetTerm({
  offset,
  concrete,
}: {
  offset: number;
  concrete?: number;
}) {
  if (concrete !== undefined) {
    return <span className="tnum">{concrete + offset}</span>;
  }
  if (offset === 0) return <Var>n</Var>;
  return (
    <>
      <Var>n</Var>
      <span className="sign">{offset > 0 ? ` + ${offset}` : ` − ${Math.abs(offset)}`}</span>
    </>
  );
}

export function FactorialLab() {
  const [n, setN] = useState(6);
  const [revealed, setRevealed] = useState(3);
  const [presetId, setPresetId] = useState(PRESETS[0].id);
  const [step, setStep] = useState(1);

  const preset = PRESETS.find((p) => p.id === presetId)!;
  const factors = useMemo(() => {
    const out: number[] = [];
    for (let i = n; i >= 1; i--) out.push(i);
    return out;
  }, [n]);

  const shown = clamp(revealed, 0, factors.length);
  const running = factors.slice(0, shown).reduce((a, b) => a * b, 1);

  const offsetList: number[] = [];
  for (let o = preset.topOffset; o > preset.bottomOffset; o--) offsetList.push(o);
  const count = offsetList.length;
  const resultTerms = offsetList.map((o) => (
    <OffsetTerm key={o} offset={o} concrete={preset.concrete} />
  ));
  const numericValue = preset.concrete
    ? offsetList.reduce((acc, o) => acc * (preset.concrete! + o), 1)
    : null;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* --- 展开尺 --- */}
      <Instrument title="阶乘展开尺 / FACTORIAL LADDER" note="0! = 1">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Stepper
            label="n"
            value={n}
            min={0}
            max={12}
            onChange={(v) => {
              setN(v);
              setRevealed(Math.min(revealed, Math.max(v, 1)));
            }}
            format={(v) => `${v}!`}
          />
          <div className="font-mono text-sm tnum">
            {shown} / {factors.length} 个因子
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-1.5 font-mono text-[15px]">
          <span className="tnum">{n}!</span>
          <span className="text-muted">=</span>
          {factors.length === 0 ? (
            <span className="tnum">1</span>
          ) : (
            factors.map((f, i) => (
              <span key={f} className="flex items-center gap-1.5">
                {i > 0 ? <span className="text-muted">×</span> : null}
                <span
                  className={
                    i < shown
                      ? "tnum underline decoration-1 underline-offset-4"
                      : "tnum text-muted/40"
                  }
                >
                  {f}
                </span>
              </span>
            ))
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="btn btn-solid"
            onClick={() => setRevealed(shown + 1)}
            disabled={shown >= factors.length}
          >
            下一个因子
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setRevealed(0)}
          >
            重置
          </button>
          <div className="ml-auto font-mono text-sm tnum">
            累乘 = {running}
            {shown === factors.length ? (
              <span className="ml-2 text-muted">= {factorial(n)}</span>
            ) : null}
          </div>
        </div>

        <div className="mt-5 border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
          规定 <span className="font-mono text-ink">0! = 1</span>；负整数的阶乘无定义。
          乘法律在约分时是主力工具：
          <span className="ml-1 font-mono text-ink">
            (n+3)! = (n+3)(n+2)(n+1)!
          </span>
        </div>
      </Instrument>

      {/* --- 化简实验室 --- */}
      <Instrument title="阶乘约分 / CANCELLING FACTORIALS" note="分步揭示">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <Chip key={p.id} active={p.id === presetId} onClick={() => { setPresetId(p.id); setStep(1); }}>
              {p.label}
            </Chip>
          ))}
        </div>

        <div className="mt-5 min-h-[9rem] space-y-3">
          {step >= 1 ? (
            <div className="flex gap-3 border-l border-line pl-3">
              <span className="label pt-1">01</span>
              <div className="text-[15px] leading-8">
                原式 ={" "}
                <Fr
                  num={
                    <>
                      (<OffsetTerm offset={preset.topOffset} concrete={preset.concrete} />)!
                    </>
                  }
                  den={
                    <>
                      (<OffsetTerm offset={preset.bottomOffset} concrete={preset.concrete} />)!
                    </>
                  }
                />
              </div>
            </div>
          ) : null}

          {step >= 2 ? (
            <div className="flex gap-3 border-l border-line pl-3">
              <span className="label pt-1">02</span>
              <div className="text-[15px] leading-8">
                分子展开：
                <span className="font-mono">
                  {" "}
                  (<OffsetTerm offset={preset.topOffset} concrete={preset.concrete} />)!
                  {" = "}
                  {resultTerms.map((t, i) => (
                    <span key={i}>
                      {i > 0 ? "·" : ""}
                      {t}
                    </span>
                  ))}
                  {" · ("}
                  <OffsetTerm offset={preset.bottomOffset} concrete={preset.concrete} />
                  )!
                </span>
              </div>
            </div>
          ) : null}

          {step >= 3 ? (
            <div className="flex gap-3 border-l border-ink pl-3">
              <span className="label pt-1 text-ink">03</span>
              <div className="text-[15px] leading-8">
                约去公共的{" "}
                <span className="font-mono">
                  (<OffsetTerm offset={preset.bottomOffset} concrete={preset.concrete} />)!
                </span>
                {" → "}
                <span className="font-mono">
                  {resultTerms.map((t, i) => (
                    <span key={i}>
                      {i > 0 ? "·" : ""}
                      {t}
                    </span>
                  ))}
                </span>
                {numericValue !== null ? (
                  <span className="font-mono"> = {numericValue}</span>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            className="btn btn-solid"
            onClick={() => setStep((s) => Math.min(count >= 3 ? 3 : count, s + 1))}
            disabled={step >= 3}
          >
            下一步
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
            重置
          </button>
          <span className="ml-auto font-mono text-[11px] text-muted">
            步骤 {step} / 3
          </span>
        </div>
      </Instrument>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 02 · 组合：计算器 + 性质核对                                          */
/* ------------------------------------------------------------------ */

export function CombinationLab() {
  const [n, setN] = useState(7);
  const [r, setR] = useState(3);
  const valid = r >= 0 && r <= n;
  const value = valid ? choose(n, r) : NaN;
  const mirror = valid ? choose(n, n - r) : NaN;
  const pascalLeft = valid ? choose(n, r) : 0;
  const pascalRight = r + 1 <= n ? choose(n, r + 1) : 0;
  const pascalSum = valid ? choose(n + 1, r + 1) : 0;

  return (
    <Instrument
      title="组合数计算器 / COMBINATION CALCULATOR"
      note="C_r^n = n! / r!(n−r)!"
    >
      <div className="grid gap-5 md:grid-cols-[auto_1fr] md:items-start md:gap-8">
        <div className="space-y-4">
          <Stepper label="n" value={n} min={1} max={12} onChange={(v) => { setN(v); setR((old) => clamp(old, 0, v)); }} />
          <Stepper label="r" value={r} min={0} max={12} onChange={(v) => setR(v)} />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <div className="text-[1.6rem] leading-tight sm:text-[2rem]">
              <Binom n={n} r={r} /> <span className="sign">=</span>{" "}
              {valid ? (
                <span className="font-mono tnum">{value}</span>
              ) : (
                <span className="font-mono text-muted">无定义</span>
              )}
            </div>
            <div className="font-mono text-[12px] text-muted">
              {valid
                ? `从 ${n} 个元素中选 ${r} 个（不计顺序）`
                : "需满足 0 ≤ r ≤ n"}
            </div>
          </div>

          {/* dot diagram */}
          <div className="mt-4 flex flex-wrap gap-1.5" aria-hidden>
            {Array.from({ length: n }).map((_, i) => (
              <span
                key={i}
                className={
                  i < r
                    ? "h-4 w-4 border border-ink bg-ink"
                    : "h-4 w-4 border border-line"
                }
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <div className="label mb-2">计算过程 / CALCULATION</div>
          <div className="border-t border-line">
            <Fact k="n!" v={factorial(n)} />
            <Fact k="r!" v={factorial(r)} />
            <Fact k="(n−r)!" v={factorial(n - r)} />
            <Fact k="r!·(n−r)!" v={factorial(r) * factorial(n - r)} />
            <Fact k="结果" v={valid ? value : "—"} />
          </div>
        </div>
        <div>
          <div className="label mb-2">性质核对 / PROPERTIES</div>
          <div className="border-t border-line">
            <Fact
              k={<span><Binom n={n} r={0} /> = 1</span>}
              v={<span className="text-muted">平凡项</span>}
            />
            <Fact
              k={<span><Binom n={n} r={n} /> = 1</span>}
              v={<span className="text-muted">平凡项</span>}
            />
            <Fact
              k={
                <span>
                  对称 <Binom n={n} r={r} /> = <Binom n={n} r={n - r} />
                </span>
              }
              v={valid ? `${value} = ${mirror} ✓` : "—"}
            />
            <Fact
              k={
                <span>
                  帕斯卡 <Binom n={n} r={r} /> + <Binom n={n} r={r + 1} /> ={" "}
                  <Binom n={n + 1} r={r + 1} />
                </span>
              }
              v={valid ? `${pascalLeft} + ${pascalRight} = ${pascalSum} ✓` : "—"}
            />
          </div>
        </div>
      </div>
    </Instrument>
  );
}

/* ------------------------------------------------------------------ */
/* 03 · 杨辉三角                                                        */
/* ------------------------------------------------------------------ */

function pascalRows(n: number): number[][] {
  const rows: number[][] = [[1]];
  for (let i = 1; i <= n; i++) {
    const prev = rows[i - 1];
    const row: number[] = [1];
    for (let j = 1; j < i; j++) row.push(prev[j - 1] + prev[j]);
    row.push(1);
    rows.push(row);
  }
  return rows;
}

export function PascalTriangle() {
  const [depth, setDepth] = useState(8);
  const [sel, setSel] = useState<{ n: number; r: number }>({ n: 4, r: 2 });
  const rows = useMemo(() => pascalRows(depth), [depth]);

  const row = rows[sel.n];
  const cell = row[sel.r];
  const parents =
    sel.r === 0 || sel.r === sel.n
      ? null
      : { left: rows[sel.n - 1][sel.r - 1], right: rows[sel.n - 1][sel.r] };

  return (
    <Instrument
      title="杨辉三角 / PASCAL'S TRIANGLE"
      note={`第 n 行有 n+1 个数 · 共 ${depth + 1} 行`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Chip active={depth === 8} onClick={() => setDepth(8)}>至第 8 行</Chip>
        <Chip active={depth === 12} onClick={() => setDepth(12)}>至第 12 行</Chip>
      </div>

      <div className="mt-5 overflow-x-auto pb-2">
        <div className="min-w-max">
          {rows.map((r, i) => (
            <div key={i} className="mb-1 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSel({ n: i, r: 0 })}
                className="w-7 shrink-0 text-right font-mono text-[10px] tnum text-muted transition-colors hover:text-ink"
              >
                {String(i).padStart(2, "0")}
              </button>
              <div className="flex gap-1">
                {r.map((v, j) => {
                  const on = sel.n === i && sel.r === j;
                  return (
                    <button
                      key={j}
                      type="button"
                      onClick={() => setSel({ n: i, r: j })}
                      className={`cell ${on ? "cell-on" : ""}`}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 border-t border-line pt-5 md:grid-cols-2">
        <div>
          <div className="label mb-2">选中位置 / SELECTED</div>
          <div className="text-[1.3rem] leading-snug">
            第 <span className="font-mono tnum">{sel.n}</span> 行，第{" "}
            <span className="font-mono tnum">{sel.r + 1}</span> 个数
          </div>
          <div className="mt-2 font-mono text-sm text-muted">
            值 = <span className="text-ink tnum">{cell}</span>
          </div>
        </div>
        <div>
          <div className="label mb-2">它是怎么来的 / DERIVATION</div>
          <div className="text-[15px] leading-8">
            <div>
              <Binom n={sel.n} r={sel.r} /> ={" "}
              <Fr
                num={<>{sel.n}!</>}
                den={
                  <>
                    {sel.r}!({sel.n - sel.r})!
                  </>
                }
              />{" "}
              = <span className="font-mono tnum">{cell}</span>
            </div>
            <div className="mt-1 text-muted">
              {parents ? (
                <>
                  正上方两数相加：{parents.left} + {parents.right} = {cell}
                </>
              ) : (
                <>每行的两端都是 1</>
              )}
            </div>
            <div className="mt-1 text-muted">
              该行即 (1+x)^{sel.n} 展开式的系数
            </div>
          </div>
        </div>
      </div>
    </Instrument>
  );
}

/* ------------------------------------------------------------------ */
/* 04 · 二项式展开构造器                                                */
/* ------------------------------------------------------------------ */

export function ExpansionLab() {
  const [n, setN] = useState(5);
  const [mode, setMode] = useState<"sym" | "num">("sym");
  const [sel, setSel] = useState<number | null>(2);

  const terms = Array.from({ length: n + 1 }, (_, r) => r);
  const aExp = terms.map((r) => n - r);
  const bExp = terms.map((r) => r);

  return (
    <Instrument
      title="二项式展开构造器 / EXPANSION BUILDER"
      note={`(a+b)^${n}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Stepper label="n" value={n} min={0} max={9} onChange={(v) => { setN(v); setSel(null); }} />
        <div className="flex gap-2">
          <Chip active={mode === "sym"} onClick={() => setMode("sym")}>a + b</Chip>
          <Chip active={mode === "num"} onClick={() => setMode("num")}>2x + 1</Chip>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <div className="flex flex-wrap items-center gap-x-1 gap-y-2 text-[1.05rem] sm:text-[1.25rem]">
          <span className="font-mono text-muted">({mode === "sym" ? "a + b" : "2x + 1"})</span>
          <Pow base="" exp={n} />
          <span className="sign">=</span>
          {terms.map((r) => (
            <span key={r} className="flex items-center gap-1">
              {r > 0 ? <span className="text-muted">+</span> : null}
              <button
                type="button"
                onClick={() => setSel(r === sel ? null : r)}
                className={`px-1.5 py-1 transition-colors ${
                  sel === r
                    ? "bg-ink text-paper"
                    : "hover:bg-ink/10"
                }`}
              >
                {mode === "sym" ? (
                  <span>
                    <Binom n={n} r={r} />
                    <Pow base={<Var>a</Var>} exp={n - r} />
                    <Pow base={<Var>b</Var>} exp={r} />
                  </span>
                ) : (
                  <span className="font-mono tnum">
                    {choose(n, r) * Math.pow(2, n - r)}
                    <Pow base="x" exp={n - r} />
                  </span>
                )}
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 border-t border-line pt-5 md:grid-cols-[1fr_1fr]">
        <div>
          <div className="label mb-2">指数阶梯 / EXPONENT LADDER</div>
          <div className="space-y-1 font-mono text-[13px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-10 text-muted">a</span>
              {aExp.map((e, i) => (
                <span key={i} className="tnum w-6 text-center">{e}</span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-10 text-muted">b</span>
              {bExp.map((e, i) => (
                <span key={i} className="tnum w-6 text-center">{e}</span>
              ))}
            </div>
          </div>
          <div className="mt-3 text-[13px] leading-relaxed text-muted">
            每一项中 a 与 b 的指数之和恒等于 n；共 {n + 1} 项。
          </div>
        </div>

        <div>
          <div className="label mb-2">通项 / GENERAL TERM</div>
          {sel === null ? (
            <div className="text-[13px] leading-relaxed text-muted">
              点击上式中的任意一项，查看它与通项公式的对应关系。
            </div>
          ) : (
            <div className="text-[15px] leading-8">
              <div>
                第 <span className="font-mono tnum">{sel + 1}</span> 项：
                <span className="ml-2">
                  T<sub className="font-mono text-[11px]">{sel + 1}</sub> ={" "}
                  <Binom n={n} r={sel} />
                  <Pow base={<Var>a</Var>} exp={n - sel} />
                  <Pow base={<Var>b</Var>} exp={sel} />
                </span>
              </div>
              <div className="mt-1 font-mono text-[12px] text-muted">
                a 指数 {n - sel} + b 指数 {sel} = {n}
              </div>
            </div>
          )}
        </div>
      </div>
    </Instrument>
  );
}

/* ------------------------------------------------------------------ */
/* 06 · 常用特例                                                        */
/* ------------------------------------------------------------------ */

export function SpecialCases() {
  const [n, setN] = useState(10);
  const rows = [
    { r: 1, expr: <>C<sub>1</sub><sup>n</sup></>, fn: (x: number) => x, form: "n" },
    { r: 2, expr: <>C<sub>2</sub><sup>n</sup></>, fn: (x: number) => (x * (x - 1)) / 2, form: "n(n−1)/2" },
    { r: 3, expr: <>C<sub>3</sub><sup>n</sup></>, fn: (x: number) => (x * (x - 1) * (x - 2)) / 6, form: "n(n−1)(n−2)/6" },
  ];

  return (
    <Instrument title="常用特例 / USEFUL SPECIAL CASES" note="把 r 代入 C_r^n">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Stepper label="n" value={n} min={3} max={20} onChange={setN} />
        <div className="font-mono text-[12px] text-muted">
          代数形式 → 数值代入，两步到位
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[30rem] border-collapse text-left">
          <thead>
            <tr className="border-y border-line">
              <th className="label py-2 pr-4 font-normal">组合数</th>
              <th className="label py-2 pr-4 font-normal">代数形式</th>
              <th className="label py-2 pr-4 font-normal">代入 n = {n}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.r} className="border-b border-line">
                <td className="py-3 pr-4 text-[15px]">
                  <Binom n={<Var>n</Var>} r={row.r} />
                </td>
                <td className="py-3 pr-4 font-mono text-[13px]">{row.form}</td>
                <td className="py-3 pr-4 font-mono text-[13px] tnum">
                  {signed(row.fn(n), row.fn(n) % 1 === 0 ? 0 : 2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5">
        <Note mark="用" title="为什么重要">
          含未知数 n 的二项式问题，先把{" "}
          <span className="font-mono">C_2^n</span>、{" "}
          <span className="font-mono">C_3^n</span> 展开成多项式，往往比保留阶乘更省力。
        </Note>
      </div>
    </Instrument>
  );
}

/* 供正文引用的静态公式块 */
export function FactorialFormula() {
  return (
    <Formula label="定义 / DEFINITION" latex="n! = n(n-1)\cdots 3\cdot 2\cdot 1">
      <span>
        <Var>n</Var>! = <Var>n</Var> × (<Var>n</Var> − 1) × (<Var>n</Var> − 2) × ⋯ × 3 × 2 × 1
      </span>
    </Formula>
  );
}
