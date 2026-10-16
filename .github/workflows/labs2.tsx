import { useMemo, useState, type ReactNode } from "react";
import { Binom, Formula, Fr, Pow, Var } from "@/components/math";
import { Chip, Instrument, Note, Reveal, Slider, Stepper } from "@/components/ui";
import { choose, signed } from "@/lib/comb";

/* ------------------------------------------------------------------ */
/* 05(题型3) · 求特定项 / 常数项                                         */
/* ------------------------------------------------------------------ */

const N = 8;
/** 指数： (2x²)^(8−r) · (1/(3x²))^r  →  x^(16−4r) */
const expo = (r: number) => 2 * (N - r) - 2 * r;
/** 系数： C_r^8 · 2^(8−r) / 3^r */
const coef = (r: number) => (choose(N, r) * Math.pow(2, N - r)) / Math.pow(3, r);

const trim = (v: number, digits = 4) => {
  const s = v.toFixed(digits);
  return s.replace(/0+$/, "").replace(/\.$/, "");
};

const neg = (s: string) => s.replace(/-/g, "−");

export function ConstantTermLab() {
  const [r, setR] = useState(4);
  const [mode, setMode] = useState<"const" | "power">("const");
  const [k, setK] = useState(0);

  const rows = useMemo(
    () =>
      Array.from({ length: N + 1 }, (_, i) => ({
        r: i,
        exp: expo(i),
        coef: coef(i),
      })),
    [],
  );

  const exact = (16 - k) % 4 === 0;
  const rForK = (16 - k) / 4;
  const powerValid = exact && rForK >= 0 && rForK <= N;

  return (
    <Instrument title="特定项求解器 / TERM SOLVER" note="(2x² + 1/(3x²))⁸">
      <div className="flex flex-wrap gap-2">
        <Chip active={mode === "const"} onClick={() => setMode("const")}>
          求常数项
        </Chip>
        <Chip active={mode === "power"} onClick={() => setMode("power")}>
          求 x^k 的系数
        </Chip>
      </div>

      <Formula className="mt-5" label="第一步 / 通项" latex="T_{r+1}=C_r^n a^{n-r}b^r">
        <div className="space-y-1.5">
          <div>
            T<sub className="font-mono text-[11px]">r+1</sub> = <Binom n={N} r={<Var>r</Var>} /> ·{" "}
            <Pow
              base={<>2<Var>x</Var>²</>}
              exp={
                <>
                  {N}
                  <span className="sign"> − </span>
                  <Var>r</Var>
                </>
              }
            />{" "}
            ·{" "}
            <Pow base={<>1/(3<Var>x</Var>²)</>} exp={<Var>r</Var>} />
          </div>
          <div>
            = <Binom n={N} r={<Var>r</Var>} /> ·{" "}
            <Fr
              num={
                <>
                  2<sup className="font-mono text-[.6em]">{N}−r</sup>
                </>
              }
              den={
                <>
                  3<sup className="font-mono text-[.6em]">r</sup>
                </>
              }
            />{" "}
            · <Var>x</Var>
            <sup className="font-mono text-[.6em]">16−4r</sup>
          </div>
        </div>
      </Formula>

      {mode === "const" ? (
        <div className="mt-4">
          <div className="label mb-2">第三步 / 解方程</div>
          <div className="space-y-1.5 text-[15px] leading-8">
            <div>
              常数项 ⇒ 令 <Var>x</Var> 的指数等于 0：
              <span className="ml-2 font-mono">16 − 4r = 0</span>
            </div>
            <div>
              ⇒ <span className="font-mono">4r = 16</span> ⇒{" "}
              <span className="font-mono">r = 4</span>（即第 <span className="font-mono tnum">5</span> 项）
            </div>
            <div className="text-ink/80">
              系数 = C<sub className="font-mono text-[11px]">4</sub>
              <sup className="font-mono text-[11px]">8</sup> · 2⁴ / 3⁴ = 70 × 16 / 81 ={" "}
              <span className="font-mono">1120/81</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-6">
          <Stepper label="k" value={k} min={0} max={16} onChange={setK} />
          <div className="text-[15px] leading-8">
            {powerValid ? (
              <>
                <div>
                  <span className="font-mono">16 − 4r = {k}</span> ⇒{" "}
                  <span className="font-mono">r = {rForK}</span>
                </div>
                <div>
                  系数 = <span className="font-mono tnum">{neg(signed(coef(rForK), 4))}</span>{" "}
                  <span className="text-muted">（r = {rForK} 处的通项系数）</span>
                </div>
              </>
            ) : (
              <div className="text-muted">
                指数 16 − 4r 只能取 4 的倍数（0, 4, 8, 12, 16），因此展开式中
                <span className="mx-1 font-mono text-ink">没有 x^{k}</span> 项。
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 border-t border-line pt-5">
        <Slider
          label="拖动通项中的 r"
          value={r}
          min={0}
          max={N}
          onChange={setR}
          display={(v) => `r = ${v}（第 ${v + 1} 项）`}
          hint={
            <>
              当前：<span className="font-mono text-ink">C_r^8 · 2^(8−r)/3^r · x^{expo(r)}</span>
              {expo(r) === 0 ? (
                <span className="ml-2 underline decoration-1 underline-offset-4">
                  ← 指数为 0，即常数项
                </span>
              ) : null}
            </>
          }
        />
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[26rem] border-collapse text-left">
          <thead>
            <tr className="border-y border-line">
              <th className="label py-2 pr-4 font-normal">r</th>
              <th className="label py-2 pr-4 font-normal">x 的指数</th>
              <th className="label py-2 pr-4 font-normal">系数</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.r} className={`border-b border-line ${row.r === r ? "bg-ink/5" : ""}`}>
                <td className="py-2 pr-4 font-mono text-[13px] tnum">{row.r}</td>
                <td className="py-2 pr-4 font-mono text-[13px] tnum">{row.exp}</td>
                <td className="py-2 pr-4 font-mono text-[13px] tnum">{trim(row.coef)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Instrument>
  );
}

/* ------------------------------------------------------------------ */
/* 08(进阶二) · 两个二项式乘积的特定项                                    */
/* ------------------------------------------------------------------ */

type PTerm = {
  deg: number;
  label: string;
  coef: (a: number) => number;
};

type Product = {
  id: string;
  title: string;
  f1: string;
  f2: string;
  target: number;
  targetLabel: string;
  f1Terms: PTerm[];
  f2Terms: PTerm[];
  symbolic?: string;
  given?: number;
  solutions?: number[];
  solveNote?: string;
};

const PRODUCTS: Product[] = [
  {
    id: "A",
    title: "题 A",
    f1: "(1 + 2x)⁴",
    f2: "(1 − ax)³",
    target: 2,
    targetLabel: "x² 的系数",
    f1Terms: [
      { deg: 0, label: "1", coef: () => 1 },
      { deg: 1, label: "8x", coef: () => 8 },
      { deg: 2, label: "24x²", coef: () => 24 },
      { deg: 3, label: "32x³", coef: () => 32 },
      { deg: 4, label: "16x⁴", coef: () => 16 },
    ],
    f2Terms: [
      { deg: 0, label: "1", coef: () => 1 },
      { deg: 1, label: "−3ax", coef: (a) => -3 * a },
      { deg: 2, label: "3a²x²", coef: (a) => 3 * a * a },
      { deg: 3, label: "−a³x³", coef: (a) => -Math.pow(a, 3) },
    ],
    symbolic: "3a² − 24a + 24",
    given: -21,
    solutions: [3, 5],
    solveNote: "3a² − 24a + 24 = −21 ⇒ a² − 8a + 15 = 0 ⇒ (a − 3)(a − 5) = 0",
  },
  {
    id: "B",
    title: "题 B",
    f1: "(x + 5/x)²",
    f2: "(x − 2)⁵",
    target: 2,
    targetLabel: "x² 的系数",
    f1Terms: [
      { deg: 2, label: "x²", coef: () => 1 },
      { deg: 0, label: "10", coef: () => 10 },
      { deg: -2, label: "25/x²", coef: () => 25 },
    ],
    f2Terms: [
      { deg: 5, label: "x⁵", coef: () => 1 },
      { deg: 4, label: "−10x⁴", coef: () => -10 },
      { deg: 3, label: "40x³", coef: () => 40 },
      { deg: 2, label: "−80x²", coef: () => -80 },
      { deg: 1, label: "80x", coef: () => 80 },
      { deg: 0, label: "−32", coef: () => -32 },
    ],
  },
];

export function ProductLab() {
  const [pid, setPid] = useState("A");
  const [a, setA] = useState(3);
  const [sel1, setSel1] = useState<number | null>(null);
  const [sel2, setSel2] = useState<number | null>(null);

  const p = PRODUCTS.find((x) => x.id === pid)!;

  const pairs = p.f1Terms.flatMap((t1, i) =>
    p.f2Terms
      .map((t2, j) => ({ t1, t2, i, j }))
      .filter((pair) => pair.t1.deg + pair.t2.deg === p.target),
  );
  const matchIdx = (i: number, j: number) => pairs.some((pair) => pair.i === i && pair.j === j);

  const total = pairs.reduce((acc, pair) => acc + pair.t1.coef(a) * pair.t2.coef(a), 0);

  const chosen =
    sel1 !== null && sel2 !== null ? { t1: p.f1Terms[sel1], t2: p.f2Terms[sel2] } : null;

  return (
    <Instrument title="乘积特定项 / MATCHING TERMS" note="部分展开 → 配对 → 求和">
      <div className="flex flex-wrap gap-2">
        {PRODUCTS.map((x) => (
          <Chip
            key={x.id}
            active={x.id === pid}
            onClick={() => {
              setPid(x.id);
              setSel1(null);
              setSel2(null);
            }}
          >
            {x.title} {x.f1}
          </Chip>
        ))}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <div className="label mb-2">因式一 / {p.f1}</div>
          <div className="flex flex-wrap gap-2">
            {p.f1Terms.map((t, i) => {
              const hit = pairs.some((pair) => pair.i === i);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSel1(sel1 === i ? null : i)}
                  className={`min-h-[44px] border px-3 font-mono text-[13px] transition-colors active:scale-95 ${
                    sel1 === i ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"
                  }`}
                >
                  {hit ? <span className="mark">■</span> : null}
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <div className="label mb-2">因式二 / {p.f2}</div>
          <div className="flex flex-wrap gap-2">
            {p.f2Terms.map((t, j) => {
              const hit = pairs.some((pair) => pair.j === j);
              return (
                <button
                  key={j}
                  type="button"
                  onClick={() => setSel2(sel2 === j ? null : j)}
                  className={`min-h-[44px] border px-3 font-mono text-[13px] transition-colors active:scale-95 ${
                    sel2 === j ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"
                  }`}
                >
                  {hit ? <span className="mark">■</span> : null}
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-line pt-5">
        <div className="label mb-2">配对结果 / MATCHING PAIRS</div>
        <div className="space-y-2">
          {pairs.map((pair) => (
            <div key={`${pair.i}-${pair.j}`} className="flex items-baseline gap-3 font-mono text-[13px]">
              <span className="text-muted">
                ({pair.t1.label}) × ({pair.t2.label})
              </span>
              <span className="text-muted">=</span>
              <span className="tnum">{neg(signed(pair.t1.coef(a) * pair.t2.coef(a), 3))}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-baseline gap-3 border-t border-line pt-4">
          <span className="label">{p.targetLabel}</span>
          <span className="font-mono text-[1.1rem] tnum">{neg(signed(total, 3))}</span>
          {p.symbolic ? (
            <span className="font-mono text-[12px] text-muted">= {p.symbolic}</span>
          ) : null}
        </div>
      </div>

      {chosen ? (
        <div className="mt-4 border border-line bg-paper/70 p-3 font-mono text-[13px] leading-7">
          ({chosen.t1.label}) × ({chosen.t2.label}) ⇒{" "}
          {matchIdx(sel1!, sel2!) ? (
            <span className="underline decoration-1 underline-offset-4">命中 {p.targetLabel}</span>
          ) : (
            <span className="text-muted">次数不等于 {p.target}，不计入</span>
          )}
        </div>
      ) : (
        <div className="mt-4 text-[12px] text-muted">
          点击两侧的项进行配对，验证「哪些组合恰好凑成 {p.targetLabel}」。
        </div>
      )}

      {p.given !== undefined ? (
        <div className="mt-6 border-t border-line pt-5">
          <div className="label mb-3">第四步 / 解参数 a</div>
          <Slider
            label="a 的取值"
            value={a}
            min={-2}
            max={8}
            step={0.5}
            onChange={setA}
            display={(v) => String(v)}
            hint={
              p.given !== undefined && Math.abs(total - p.given) < 1e-9 ? (
                <span className="text-ink underline decoration-1 underline-offset-4">
                  当前系数正好等于 {p.given} ✓
                </span>
              ) : (
                <span>拖动 a，观察 {p.targetLabel} 如何变化</span>
              )
            }
          />
          <div className="mt-4 space-y-1.5 text-[14px] leading-7">
            <div>
              已知 {p.targetLabel} = <span className="font-mono tnum">{p.given}</span>：
            </div>
            <div className="font-mono text-[13px]">{p.solveNote}</div>
            <div>⇒ {p.solutions?.map((s) => `a = ${s}`).join(" 或 ")}</div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {p.solutions?.map((s) => (
              <button key={s} type="button" className="btn btn-ghost" onClick={() => setA(s)}>
                跳到 a = {s}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </Instrument>
  );
}

/* ------------------------------------------------------------------ */
/* 07(进阶一) · 未知参数                                                 */
/* ------------------------------------------------------------------ */

export function UnknownLab() {
  const [A, setA] = useState(-6);
  const [B, setB] = useState(12);
  const [nRatio, setNRatio] = useState(7);

  const k = A === 0 ? NaN : (2 * B - A * A) / A;
  const n = A === 0 || k === 0 ? NaN : -A / k;
  const valid =
    Number.isFinite(n) && Number.isFinite(k) && n > 0 && Math.abs(n - Math.round(n)) < 1e-9;

  const expansion = valid
    ? Array.from({ length: Math.min(Math.round(n), 8) + 1 }, (_, r) => ({
        r,
        c: choose(Math.round(n), r) * Math.pow(-k, r),
      }))
    : [];

  const ratioLeft = nRatio - 1;
  const ratioRight = nRatio + 1;
  const ratioOk = ratioLeft * 4 === ratioRight * 3;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Instrument title="未知参数求解 / SOLVE THE UNKNOWNS" note="(1 − kx)ⁿ">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="label">x 的系数 A</span>
            <input
              type="number"
              value={A}
              onChange={(e) => setA(Number(e.target.value))}
              className="mt-1 h-11 w-full border border-line bg-transparent px-3 font-mono text-sm tnum"
            />
          </label>
          <label className="block">
            <span className="label">x² 的系数 B</span>
            <input
              type="number"
              value={B}
              onChange={(e) => setB(Number(e.target.value))}
              className="mt-1 h-11 w-full border border-line bg-transparent px-3 font-mono text-sm tnum"
            />
          </label>
        </div>

        <div className="mt-5 space-y-2 text-[14px] leading-8">
          <div className="label">联立方程 / SIMULTANEOUS EQUATIONS</div>
          <div className="font-mono text-[13px]">(1 − kx)ⁿ = 1 − nk·x + [n(n−1)/2]k²·x² − ⋯</div>
          <div className="font-mono text-[13px]">−nk = A ⇒ n = −A/k</div>
          <div className="font-mono text-[13px]">
            n(n−1)k²/2 = B ⇒ (A² + A·k)/2 = B ⇒ k = (2B − A²)/A
          </div>
        </div>

        <div className="mt-5 border-t border-line pt-4">
          {valid ? (
            <div>
              <div className="label mb-2">结果 / SOLUTION</div>
              <div className="text-[1.2rem]">
                k = <span className="font-mono tnum">{neg(signed(k, 4))}</span>
                <span className="mx-3 text-muted">·</span>
                n = <span className="font-mono tnum">{Math.round(n)}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[12px] text-muted">
                <span>−nk = {neg(signed(-n * k, 4))}</span>
                <span>(n(n−1)/2)k² = {neg(signed(((n * (n - 1)) / 2) * k * k, 4))}</span>
              </div>
              <div className="mt-4 border-t border-line pt-3">
                <div className="label mb-2">展开式 / EXPANSION</div>
                <div className="flex flex-wrap items-baseline gap-x-1 gap-y-1 font-mono text-[13px]">
                  {expansion.map((t, i) => (
                    <span key={t.r}>
                      {i > 0 ? (t.c < 0 ? " − " : " + ") : ""}
                      {trim(Math.abs(t.c), 3)}
                      {t.r > 0 ? (
                        <span className="tnum">
                          x<sup className="text-[.7em]">{t.r}</sup>
                        </span>
                      ) : null}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-[13px] text-muted">
              当前 A、B 不能给出正整数 n，请调整系数（例如 A = −6、B = 12 得到 n = 3、k = 2）。
            </div>
          )}
        </div>
      </Instrument>

      <Instrument title="比例关系 / RATIO OF COEFFICIENTS" note="λ_k : μ_k">
        <div className="text-[14px] leading-8">
          设展开式中 <Var>x</Var>
          <sup className="font-mono text-[.6em]">k</sup> 的系数为 <span className="font-mono">λ_k = C_k^n</span>
          ，而在 <span className="font-mono">(1+x)^{n+1}</span> 中的系数为{" "}
          <span className="font-mono">μ_k = C_k^{n+1}</span>。
        </div>
        <div className="mt-4 font-mono text-[13px] leading-7">
          λ₂ : μ₂ = C_2^n : C_2^{n+1} = [n(n−1)/2] : [n(n+1)/2] = (n−1) : (n+1)
        </div>
        <div className="mt-3 font-mono text-[13px] leading-7">
          已知 λ₂ : μ₂ = 3 : 4 ⇒ 4(n−1) = 3(n+1) ⇒{" "}
          <span className="underline decoration-1 underline-offset-4">n = 7</span>
        </div>
        <div className="mt-5 border-t border-line pt-4">
          <Slider
            label="验证：拖动 n"
            value={nRatio}
            min={1}
            max={20}
            onChange={setNRatio}
            display={(v) => `n = ${v} → ${v - 1} : ${v + 1}`}
            hint={
              ratioOk ? (
                <span className="text-ink underline decoration-1 underline-offset-4">
                  此时 (n−1):(n+1) = 3:4 ✓
                </span>
              ) : (
                <span>找出使比值等于 3:4 的 n</span>
              )
            }
          />
        </div>
      </Instrument>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 自测                                                                  */
/* ------------------------------------------------------------------ */

type Q = {
  q: string;
  options: string[];
  answer: number;
  why: string;
};

const QUESTIONS: Q[] = [
  {
    q: "0! 的值是？",
    options: ["0", "1", "无定义", "−1"],
    answer: 1,
    why: "阶乘的两条重要规定：0! = 1；负整数的阶乘无定义。",
  },
  {
    q: "C₅³ 等于？",
    options: ["10", "15", "20", "30"],
    answer: 0,
    why: "C₅³ = 5!/(3!·2!) = 120/12 = 10，也等于 C₂⁵（对称性）。",
  },
  {
    q: "帕斯卡恒等式 C_r^n + C_{r+1}^n = ？",
    options: ["C_r^{n+1}", "C_{r+1}^{n+1}", "C_{r+1}^{n}", "2·C_r^n"],
    answer: 1,
    why: "C_r^n + C_{r+1}^n = C_{r+1}^{n+1}，正是杨辉三角中「上方两数相加」。",
  },
  {
    q: "(a + b)⁴ 的展开式共有几项？",
    options: ["4", "5", "6", "8"],
    answer: 1,
    why: "展开式共有 n + 1 项，n = 4 时为 5 项。",
  },
  {
    q: "展开式中第 (r+1) 项的通项公式是？",
    options: ["C_r^n · aⁿbʳ", "C_r^n · a^{n−r}bʳ", "C_{r+1}^n · a^{n−r}bʳ", "n!/(r!(n−r)!)"],
    answer: 1,
    why: "通项 T_{r+1} = C_r^n · a^{n−r}bʳ，每项中 a、b 的指数之和恒为 n。",
  },
  {
    q: "在 (2x² + 1/(3x²))⁸ 中，常数项对应 r = ？",
    options: ["2", "3", "4", "8"],
    answer: 2,
    why: "通项中 x 的指数为 16 − 4r，令其等于 0 得 r = 4，系数 = 70·2⁴/3⁴ = 1120/81。",
  },
  {
    q: "C₃ⁿ 的化简结果是？",
    options: ["n(n−1)/2", "n(n−1)(n−2)/6", "n(n+1)(n+2)/6", "n³/6"],
    answer: 1,
    why: "把 r = 3 代入 C_r^n = n!/[r!(n−r)!] 即得 n(n−1)(n−2)/6。",
  },
  {
    q: "杨辉三角第 n 行共有几个数？",
    options: ["n", "n+1", "2n", "n²"],
    answer: 1,
    why: "第 0 行只有 1 个数，因此第 n 行共有 n + 1 个数。",
  },
];

export function Quiz() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUESTIONS[i];

  const pick = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    if (idx === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (i === QUESTIONS.length - 1) {
      setDone(true);
      return;
    }
    setI(i + 1);
    setPicked(null);
  };

  const reset = () => {
    setI(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    return (
      <Instrument title="自测结果 / SELF-TEST" note={`${QUESTIONS.length} 题`}>
        <div className="text-[1.6rem]">
          <span className="font-mono tnum">{score}</span>
          <span className="text-muted"> / {QUESTIONS.length}</span>
        </div>
        <div className="mt-3 max-w-[52ch] text-[14px] leading-8 text-ink/80">
          {score === QUESTIONS.length
            ? "全部正确。可以直接进入进阶题型：未知参数与乘积的特定项。"
            : score >= QUESTIONS.length - 2
              ? "基本掌握。回到第 02 节的性质核对，再做一次第 05 节的通项练习。"
              : "建议从阶乘与组合的基本公式重新走一遍：先记牢 C_r^n = n!/[r!(n−r)!]。"}
        </div>
        <button type="button" className="btn btn-solid mt-5" onClick={reset}>
          再做一次
        </button>
      </Instrument>
    );
  }

  return (
    <Instrument title="自测 / SELF-TEST" note={`第 ${i + 1} / ${QUESTIONS.length} 题`}>
      <div className="text-[1.1rem] leading-snug sm:text-[1.25rem]">{q.q}</div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {q.options.map((opt, idx) => {
          const isAnswer = idx === q.answer;
          const chosen = picked === idx;
          const show = picked !== null;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => pick(idx)}
              className={`min-h-[52px] border px-4 text-left text-[14px] leading-6 transition-colors active:scale-[.99] ${
                show && isAnswer
                  ? "border-ink bg-ink text-paper"
                  : show && chosen
                    ? "border-ink line-through"
                    : "border-line hover:border-ink"
              }`}
            >
              <span className="mr-3 font-mono text-[11px] text-muted">
                {String.fromCharCode(65 + idx)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {picked !== null ? (
        <div className="mt-4 border-t border-line pt-4">
          <div className="text-[13px] leading-7 text-ink/85">{q.why}</div>
          <button type="button" className="btn btn-solid mt-4" onClick={next}>
            {i === QUESTIONS.length - 1 ? "查看结果" : "下一题"}
          </button>
        </div>
      ) : (
        <div className="mt-4 text-[12px] text-muted">选择一个答案后显示解析。</div>
      )}
    </Instrument>
  );
}

/* 供正文使用的静态公式 */
export function SpecialCaseFormula() {
  return (
    <Formula
      label="特例 / SPECIAL CASES"
      latex="C_1^n=n,\quad C_2^n=\frac{n(n-1)}{2},\quad C_3^n=\frac{n(n-1)(n-2)}{6}"
    >
      <div className="flex flex-col gap-1">
        <div>
          C<sub className="font-mono text-[11px]">1</sub>
          <sup className="font-mono text-[11px]">n</sup> = <Var>n</Var>
        </div>
        <div>
          C<sub className="font-mono text-[11px]">2</sub>
          <sup className="font-mono text-[11px]">n</sup> ={" "}
          <Fr
            num={
              <>
                <Var>n</Var>(<Var>n</Var>−1)
              </>
            }
            den={<>2</>}
          />
        </div>
        <div>
          C<sub className="font-mono text-[11px]">3</sub>
          <sup className="font-mono text-[11px]">n</sup> ={" "}
          <Fr
            num={
              <>
                <Var>n</Var>(<Var>n</Var>−1)(<Var>n</Var>−2)
              </>
            }
            den={<>6</>}
          />
        </div>
      </div>
    </Formula>
  );
}

export function ProductFormula() {
  return (
    <Formula
      label="乘积的特定项 / PRODUCT"
      latex="(1+2x)^4(1-ax)^3:\ [x^2]=3a^2-24a+24"
    >
      <span>
        (1 + 2<Var>x</Var>)⁴(1 − <Var>a</Var>
        <Var>x</Var>)³ 的 <Var>x</Var>² 系数 = <span className="font-mono">3a² − 24a + 24</span>
      </span>
    </Formula>
  );
}

export function NoteBox({ children }: { children: ReactNode }) {
  return (
    <Reveal>
      <Note mark="要点">{children}</Note>
    </Reveal>
  );
}
