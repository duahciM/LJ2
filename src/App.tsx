import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Binom, Formula, Fr, Var } from "@/components/math";
import { DefList, Note, Reveal, Section } from "@/components/ui";
import {
  CombinationLab,
  ExpansionLab,
  FactorialLab,
  PascalTriangle,
  SpecialCases,
} from "@/components/labs1";
import {
  ConstantTermLab,
  NoteBox,
  ProductFormula,
  ProductLab,
  Quiz,
  SpecialCaseFormula,
  UnknownLab,
} from "@/components/labs2";
import {
  BackToTop,
  CHAPTERS,
  ProgressBar,
  Shell,
  TocSheet,
  TopBar,
  useActiveSection,
  useScrollProgress,
} from "@/components/nav";

/* ---------------------------------------------------------------- */
/* helpers                                                          */
/* ---------------------------------------------------------------- */

function Sum({ from, to }: { from: ReactNode; to: ReactNode }) {
  return (
    <span className="inline-flex flex-col items-center" style={{ verticalAlign: "middle" }}>
      <span className="font-mono text-[0.42em] leading-[1.1]">{to}</span>
      <span className="text-[1.55em] leading-[0.8]">∑</span>
      <span className="font-mono text-[0.42em] leading-[1.1]">{from}</span>
    </span>
  );
}

function Body({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[64ch] space-y-4 text-[15px] leading-[1.95] text-ink/85">
      {children}
    </div>
  );
}

function Jump({ id, children }: { id: string; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={() =>
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      className="inline-flex items-center gap-2 border-b border-ink pb-0.5 font-mono text-[11px] tracking-[0.14em] transition-opacity hover:opacity-60"
    >
      {children}
      <span>→</span>
    </button>
  );
}

function Subhead({ index, children }: { index: string; children: ReactNode }) {
  return (
    <div className="mb-3 flex items-baseline gap-3">
      <span className="font-mono text-[11px] tnum tracking-[0.2em] text-muted">{index}</span>
      <h3 className="text-[1.15rem] font-semibold tracking-tight sm:text-[1.35rem]">{children}</h3>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* cover                                                            */
/* ---------------------------------------------------------------- */

function Cover() {
  const jump = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div id="cover" className="scroll-mt-14 pt-12 pb-16 sm:pt-20 sm:pb-24">
      <Reveal>
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 bg-accent" aria-hidden />
          <span className="label">组合数学 · 学习笔记 / COMBINATORICS NOTE</span>
        </div>
      </Reveal>

      <Reveal delay={60}>
        <h1 className="mt-8 text-[clamp(2.5rem,10.5vw,6.6rem)] font-semibold leading-[0.95] tracking-[-0.035em]">
          阶乘、组合数
          <br />
          与二项式定理
        </h1>
      </Reveal>

      <Reveal delay={120}>
        <p className="mt-5 max-w-[52ch] text-[15px] leading-[1.9] text-ink/75 sm:text-base">
          一份可以点、可以拖、可以自测的组合数学笔记。从阶乘的定义出发，经组合数与杨辉三角，
          抵达二项式展开式与通项；再把「求特定项」「求未知参数」「乘积的系数」
          三类高频题型拆成可复用的步骤。
        </p>
      </Reveal>

      <Reveal delay={160}>
        <div className="mt-10 border-y border-ink py-8 sm:py-12">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-[clamp(1.35rem,5.6vw,3.2rem)] leading-none tracking-[-0.02em]">
            <span>
              (<Var>a</Var> + <Var>b</Var>)
              <sup className="text-[0.42em]">n</sup>
            </span>
            <span className="text-muted">=</span>
            <Sum from="r=0" to="n" />
            <span className="flex items-center gap-1">
              <Binom n={<Var>n</Var>} r={<Var>r</Var>} />
              <Var>a</Var>
              <sup className="text-[0.42em]">n−r</sup>
              <Var>b</Var>
              <sup className="text-[0.42em]">r</sup>
            </span>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] tracking-[0.14em] text-muted">
            <span>展开共 n+1 项</span>
            <span>·</span>
            <span>每项 a、b 指数和为 n</span>
            <span>·</span>
            <span>通项 T(r+1) = C(r,n)·a^(n−r)·b^r</span>
          </div>
        </div>
      </Reveal>

      <Reveal delay={200}>
        <dl className="mt-10 grid grid-cols-2 border-t border-line sm:grid-cols-4">
          {[
            ["章节", "09", "CHAPTERS"],
            ["交互实验", "08", "LABS"],
            ["自测题", "08", "QUIZ"],
            ["图片素材", "00", "IMAGES"],
          ].map(([k, v, en], i) => (
            <div
              key={k}
              className={`border-b border-line py-5 ${
                i % 2 === 1 ? "border-l border-line pl-4" : "pr-4"
              } ${i > 0 ? "sm:border-l sm:border-line sm:pl-4" : ""} ${
                i % 2 === 0 ? "sm:pr-4" : ""
              }`}
            >
              <dt className="label">{k}</dt>
              <dd className="mt-2 font-mono text-[2rem] leading-none tnum">{v}</dd>
              <dd className="mt-1 font-mono text-[10px] tracking-[0.16em] text-muted">{en}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal delay={240}>
        <div className="mt-14">
          <div className="label mb-4">目录 / CONTENTS</div>
          <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {CHAPTERS.slice(1).map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => jump(c.id)}
                  className="group flex w-full items-baseline gap-4 border-b border-line py-4 text-left"
                >
                  <span className="font-mono text-[11px] tnum tracking-[0.2em] text-muted">
                    {c.index}
                  </span>
                  <span className="text-[1.05rem] font-medium tracking-tight group-hover:underline group-hover:underline-offset-4">
                    {c.title}
                  </span>
                  <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    {c.latin}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal delay={280}>
        <div className="mt-12 grid gap-4 border-t border-line pt-8 sm:grid-cols-3">
          {[
            ["滑动", "纵向阅读全文，章节进入视野时淡入"],
            ["点击", "高亮表格中的数字、展开式中的任意一项"],
            ["拖动", "滑块调整 n、r、a、k，公式即时更新"],
          ].map(([t, d]) => (
            <div key={t}>
              <div className="font-mono text-[11px] tracking-[0.18em] text-muted">{t}</div>
              <div className="mt-2 text-[14px] leading-relaxed text-ink/80">{d}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* reference sheet                                                  */
/* ---------------------------------------------------------------- */

function QuickRef() {
  const cells: { k: string; v: ReactNode }[] = [
    {
      k: "阶乘",
      v: (
        <span>
          <Var>n</Var>! = <Var>n</Var>(<Var>n</Var>−1)⋯1，
          <span className="font-mono text-[.9em]">0! = 1</span>
        </span>
      ),
    },
    {
      k: "组合数",
      v: (
        <span>
          <Binom n={<Var>n</Var>} r={<Var>r</Var>} /> ={" "}
          <Fr
            num={<><Var>n</Var>!</>}
            den={
              <>
                <Var>r</Var>!({<Var>n</Var>}−{<Var>r</Var>})!
              </>
            }
          />
        </span>
      ),
    },
    {
      k: "平凡项",
      v: (
        <span>
          <Binom n={<Var>n</Var>} r={0} /> = 1，<Binom n={<Var>n</Var>} r={<Var>n</Var>} /> = 1
        </span>
      ),
    },
    {
      k: "对称性",
      v: (
        <span>
          <Binom n={<Var>n</Var>} r={<Var>r</Var>} /> ={" "}
          <Binom n={<Var>n</Var>} r={<><Var>n</Var>−<Var>r</Var></>} />
        </span>
      ),
    },
    {
      k: "帕斯卡恒等式",
      v: (
        <span>
          <Binom n={<Var>n</Var>} r={<Var>r</Var>} /> +{" "}
          <Binom n={<Var>n</Var>} r={<><Var>r</Var>+1</>} /> ={" "}
          <Binom n={<><Var>n</Var>+1</>} r={<><Var>r</Var>+1</>} />
        </span>
      ),
    },
    {
      k: "二项式定理",
      v: (
        <span>
          (<Var>a</Var>+<Var>b</Var>)
          <sup className="font-mono text-[.6em]">n</sup> = ∑
          <sub className="font-mono text-[.55em]">r=0</sub>
          <sup className="font-mono text-[.55em]">n</sup>{" "}
          <Binom n={<Var>n</Var>} r={<Var>r</Var>} />
          <Var>a</Var>
          <sup className="font-mono text-[.6em]">n−r</sup>
          <Var>b</Var>
          <sup className="font-mono text-[.6em]">r</sup>
        </span>
      ),
    },
    {
      k: "通项",
      v: (
        <span>
          T<sub className="font-mono text-[.6em]">r+1</sub> ={" "}
          <Binom n={<Var>n</Var>} r={<Var>r</Var>} />
          <Var>a</Var>
          <sup className="font-mono text-[.6em]">n−r</sup>
          <Var>b</Var>
          <sup className="font-mono text-[.6em]">r</sup>
        </span>
      ),
    },
    {
      k: "特例",
      v: (
        <span className="flex flex-wrap items-center gap-x-3">
          <span>
            C<sub className="font-mono text-[.6em]">1</sub>
            <sup className="font-mono text-[.6em]">n</sup> = <Var>n</Var>
          </span>
          <span>
            C<sub className="font-mono text-[.6em]">2</sub>
            <sup className="font-mono text-[.6em]">n</sup> ={" "}
            <Fr num={<><Var>n</Var>(<Var>n</Var>−1)</>} den={<>2</>} />
          </span>
          <span>
            C<sub className="font-mono text-[.6em]">3</sub>
            <sup className="font-mono text-[.6em]">n</sup> ={" "}
            <Fr
              num={<><Var>n</Var>(<Var>n</Var>−1)(<Var>n</Var>−2)</>}
              den={<>6</>}
            />
          </span>
        </span>
      ),
    },
  ];

  return (
    <div className="grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
      {cells.map((c) => (
        <div key={c.k} className="border-b border-line p-4 sm:border-r sm:p-5">
          <div className="label">{c.k}</div>
          <div className="mt-3 text-[14px] leading-8">{c.v}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* colophon / checklist                                             */
/* ---------------------------------------------------------------- */

function Colophon() {
  const key = "combinatorics-note-read";
  const [read, setRead] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem(key) || "{}") as Record<string, boolean>;
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(read));
    } catch {
      /* storage unavailable */
    }
  }, [read]);

  const total = CHAPTERS.length;
  const done = CHAPTERS.filter((c) => read[c.id]).length;
  const pct = Math.round((done / total) * 100);

  const rules = [
    ["强调色只用一次", "全页仅在报头出现一枚色标，其余状态一律用黑白反转表示"],
    ["字体先于装饰", "没有图片、图标与阴影；公式、表格、图形全部由排版生成"],
    ["动效为阅读服务", "仅保留滚动淡入、状态反馈与滑块联动，必要时尊重系统的减弱动效设置"],
    ["触屏优先", "所有可点区域不小于 44px，横向内容可滑动，交互状态不依赖 hover"],
  ];

  return (
    <div className="mt-16 border-t border-ink pt-10">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="label mb-4">版式说明 / COLOPHON</div>
          <dl className="border-t border-line">
            {rules.map(([k, v]) => (
              <div key={k} className="grid gap-1 border-b border-line py-3 sm:grid-cols-[11rem_1fr] sm:gap-5">
                <dt className="text-[14px] font-medium">{k}</dt>
                <dd className="text-[13px] leading-relaxed text-ink/75">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-5">
          <div className="label mb-4">阅读进度 / PROGRESS</div>
          <div className="border border-line p-4">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[2rem] leading-none tnum">{pct}%</span>
              <span className="font-mono text-[11px] text-muted">
                {done} / {total} 章
              </span>
            </div>
            <div className="mt-3 h-[3px] w-full bg-line">
              <div
                className="h-full bg-ink transition-[width] duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <ul className="mt-4 grid gap-1.5">
              {CHAPTERS.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setRead((r) => ({ ...r, [c.id]: !r[c.id] }))}
                    className="flex w-full items-center gap-3 py-1.5 text-left"
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center border font-mono text-[11px] ${
                        read[c.id] ? "border-ink bg-ink text-paper" : "border-line text-muted"
                      }`}
                    >
                      {read[c.id] ? "✓" : ""}
                    </span>
                    <span className="font-mono text-[11px] tnum text-muted">{c.index}</span>
                    <span
                      className={`text-[14px] ${
                        read[c.id] ? "text-muted line-through" : "text-ink"
                      }`}
                    >
                      {c.title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="btn btn-ghost mt-4"
              onClick={() => setRead({})}
            >
              清空进度
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-6">
        <div>
          <div className="text-[1.1rem] font-semibold tracking-tight">组合数学学习笔记</div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            Factorials · Combinations · Pascal's Triangle · Binomial Theorem
          </div>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          2026 · 版面由排版生成，无图片素材
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* app                                                              */
/* ---------------------------------------------------------------- */

export default function App() {
  const [menu, setMenu] = useState(false);
  const ids = useMemo(() => CHAPTERS.map((c) => c.id), []);
  const active = useActiveSection(ids);
  const progress = useScrollProgress();

  return (
    <div className="min-h-screen">
      <ProgressBar value={progress} />
      <TopBar activeId={active} onMenu={() => setMenu(true)} />
      <TocSheet open={menu} onClose={() => setMenu(false)} activeId={active} />
      <BackToTop />

      <main>
        <Shell>
          <Cover />

          {/* 01 */}
          <Section
            id="factorial"
            index="01"
            title="阶乘"
            latin="Factorials"
            lead={
              <Body>
                <p>
                  前 <Var>n</Var> 个正整数的乘积记作 <Var>n</Var>!，读作「<Var>n</Var> 的阶乘」。
                  它是组合数公式的原料，也是所有约分技巧的起点。
                </p>
              </Body>
            }
          >
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-6">
                <Formula
                  label="定义 / DEFINITION"
                  latex="n! = n(n-1)\cdots 3\cdot 2\cdot 1"
                >
                  <span>
                    <Var>n</Var>! = <Var>n</Var> × (<Var>n</Var> − 1) × (<Var>n</Var> − 2) × ⋯ × 3 ×
                    2 × 1
                  </span>
                </Formula>
                <div className="mt-6">
                  <DefList
                    items={[
                      {
                        k: "0! = 1",
                        v: "空乘积的约定；它让 n = 0 时一切组合数仍然成立。",
                      },
                      {
                        k: "负整数的阶乘",
                        v: "无定义。解题时若出现 (−1)! 之类的写法，直接判定为非法。",
                      },
                      {
                        k: "化简方法",
                        v: (
                          <>
                            <span>
                              写成 (<Var>n</Var>+3)! = (<Var>n</Var>+3)(<Var>n</Var>+2)(<Var>n</Var>+1)!，
                              再与分母约去公共阶乘：
                            </span>
                            <span className="mt-1 block">
                              <Fr
                                num={<>(<Var>n</Var>+3)!</>}
                                den={<>(<Var>n</Var>+1)!</>}
                              />{" "}
                              = (<Var>n</Var>+3)(<Var>n</Var>+2)
                            </span>
                          </>
                        ),
                      },
                    ]}
                  />
                </div>
              </div>
              <div className="lg:col-span-6">
                <Reveal>
                  <Note mark="记" title="把阶乘当作乘积的缩写">
                    阶乘本身没有新东西，它只是把一长串连乘压缩成符号。
                    做题时真正要做的是：把它重新展开成可以约分的形式。
                  </Note>
                </Reveal>
              </div>
            </div>

            <div className="mt-10">
              <FactorialLab />
            </div>
          </Section>

          {/* 02 */}
          <Section
            id="combination"
            index="02"
            title="组合"
            latin="Combinations · C_r^n"
            lead={
              <Body>
                <p>
                  从 <Var>n</Var> 个不同元素中，不重复地选取 <Var>r</Var> 个元素（
                  <Var>r</Var> ≤ <Var>n</Var>），且<b className="font-semibold">不考虑顺序</b>
                  的选法总数，记作 C<sub className="font-mono text-[.7em]">r</sub>
                  <sup className="font-mono text-[.7em]">n</sup>。
                </p>
              </Body>
            }
          >
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-6">
                <Formula
                  label="计算公式 / FORMULA"
                  latex="C_r^n=\frac{n!}{r!(n-r)!}\quad(0\le r\le n)"
                >
                  <span>
                    C<sub className="font-mono text-[.7em]">r</sub>
                    <sup className="font-mono text-[.7em]">n</sup> ={" "}
                    <Fr
                      num={<><Var>n</Var>!</>}
                      den={
                        <>
                          <Var>r</Var>!({<Var>n</Var>} − {<Var>r</Var>})!
                        </>
                      }
                    />{" "}
                    <span className="font-mono text-[.8em] text-muted">(0 ≤ r ≤ n)</span>
                  </span>
                </Formula>
              </div>
              <div className="lg:col-span-6">
                <DefList
                  items={[
                    {
                      k: "C_0^n = 1，C_n^n = 1",
                      v: "两个平凡项：全不选与全选，都只有一种选法。",
                    },
                    {
                      k: "对称性 C_r^n = C_(n−r)^n",
                      v: "选 r 个与选 n−r 个一一对应，于是数值相等。",
                    },
                    {
                      k: "组合恒等式（帕斯卡恒等式）",
                      v: "C_r^n + C_(r+1)^n = C_(r+1)^(n+1)",
                    },
                  ]}
                />
              </div>
            </div>

            <div className="mt-10">
              <CombinationLab />
            </div>
          </Section>

          {/* 03 */}
          <Section
            id="pascal"
            index="03"
            title="杨辉三角"
            latin="Pascal's Triangle"
            lead={
              <Body>
                <p>
                  组合数按行排开，就得到杨辉三角：它把帕斯卡恒等式画成了图形，
                  也是快速写出低次展开式的工具。
                </p>
              </Body>
            }
          >
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <DefList
                  items={[
                    { k: "第 n 行有 n+1 个数", v: "编号从第 0 行开始，第 0 行只有一个 1。" },
                    { k: "两端均为 1，左右对称", v: "正是 C_0^n = C_n^n = 1 与对称性的直接体现。" },
                    {
                      k: "上方两数相加",
                      v: "除 1 外，每个数都等于正上方两个数之和，即 C_r^n + C_(r+1)^n = C_(r+1)^(n+1)。",
                    },
                    {
                      k: "用途",
                      v: "当 n 较小时，直接用杨辉三角里的数字当作系数，快速写出 (a+b)ⁿ 的展开式。",
                    },
                  ]}
                />
                <div className="mt-6">
                  <Formula label="例 / (a+b)³" latex="(a+b)^3=a^3+3a^2b+3ab^2+b^3">
                    <span>
                      (<Var>a</Var> + <Var>b</Var>)³ = <Var>a</Var>³ + 3<Var>a</Var>²<Var>b</Var> +
                      3<Var>a</Var>
                      <Var>b</Var>² + <Var>b</Var>³
                    </span>
                  </Formula>
                </div>
              </div>
              <div className="lg:col-span-7">
                <PascalTriangle />
              </div>
            </div>
          </Section>

          {/* 04 */}
          <Section
            id="theorem"
            index="04"
            title="二项式定理"
            latin="Binomial Theorem"
            lead={
              <Body>
                <p>
                  若 <Var>n</Var> 为正整数，且 0 ≤ <Var>r</Var> ≤ <Var>n</Var>，则：
                </p>
              </Body>
            }
          >
            <Formula
              size="lg"
              label="定理 / THEOREM"
              latex="(a+b)^n=\sum_{r=0}^{n}C_r^n a^{n-r}b^r"
            >
              <div className="space-y-1.5">
                <div>
                  (<Var>a</Var> + <Var>b</Var>)
                  <sup className="font-mono text-[.55em]">n</sup> = C<sub className="font-mono text-[.55em]">0</sub>
                  <sup className="font-mono text-[.55em]">n</sup> <Var>a</Var>
                  <sup className="font-mono text-[.55em]">n</sup> + C<sub className="font-mono text-[.55em]">1</sub>
                  <sup className="font-mono text-[.55em]">n</sup> <Var>a</Var>
                  <sup className="font-mono text-[.55em]">n−1</sup>
                  <Var>b</Var> + ⋯ + C<sub className="font-mono text-[.55em]">r</sub>
                  <sup className="font-mono text-[.55em]">n</sup> <Var>a</Var>
                  <sup className="font-mono text-[.55em]">n−r</sup>
                  <Var>b</Var>
                  <sup className="font-mono text-[.55em]">r</sup> + ⋯ + C<sub className="font-mono text-[.55em]">n</sub>
                  <sup className="font-mono text-[.55em]">n</sup> <Var>b</Var>
                  <sup className="font-mono text-[.55em]">n</sup>
                </div>
                <div className="text-muted">
                  = ∑<sub className="font-mono text-[.55em]">r=0</sub>
                  <sup className="font-mono text-[.55em]">n</sup> C<sub className="font-mono text-[.55em]">r</sub>
                  <sup className="font-mono text-[.55em]">n</sup> <Var>a</Var>
                  <sup className="font-mono text-[.55em]">n−r</sup>
                  <Var>b</Var>
                  <sup className="font-mono text-[.55em]">r</sup>
                </div>
              </div>
            </Formula>

            <div className="mt-8 grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <Subhead index="a">核心特征</Subhead>
                <DefList
                  items={[
                    { k: "共有 n+1 项", v: "r 从 0 取到 n，一项不漏。" },
                    {
                      k: "指数之和恒为 n",
                      v: "每一项中 a 与 b 的指数相加都等于 n。",
                    },
                    {
                      k: "a 降幂，b 升幂",
                      v: "a 的指数依次递减，b 的指数依次递增。",
                    },
                    {
                      k: "通项公式",
                      v: (
                        <>
                          第 (<Var>r</Var>+1) 项为{" "}
                          <span className="font-mono">
                            T_(r+1) = C_r^n · a^(n−r) · b^r
                          </span>
                        </>
                      ),
                    },
                  ]}
                />
              </div>
              <div className="lg:col-span-7">
                <ExpansionLab />
              </div>
            </div>
          </Section>

          {/* 05 */}
          <Section
            id="problems"
            index="05"
            title="题型与通项"
            latin="Problem Types"
            lead={
              <Body>
                <p>
                  组合数学的题目很少超过三种骨架：先化简、再展开、最后定向。
                  下面把每种骨架拆成可以复述的步骤。
                </p>
              </Body>
            }
          >
            <div className="space-y-12">
              <Reveal>
                <div className="grid gap-6 lg:grid-cols-12">
                  <div className="lg:col-span-4">
                    <Subhead index="1">阶乘与组合数的化简 / 计算</Subhead>
                    <p className="text-[14px] leading-[1.95] text-ink/80">
                      熟练运用{" "}
                      <span className="font-mono">C_r^n = n!/[r!(n−r)!]</span>{" "}
                      及阶乘的展开形式，通过约分化简复杂表达式。
                    </p>
                  </div>
                  <div className="lg:col-span-8">
                    <div className="border-t border-line">
                      <div className="grid gap-4 border-b border-line py-4 sm:grid-cols-[auto_1fr] sm:gap-8">
                        <span className="label pt-1">例</span>
                        <div className="text-[15px] leading-9">
                          <Fr
                            num={<>(<Var>n</Var>+3)!</>}
                            den={<>(<Var>n</Var>+1)!</>}
                          />{" "}
                          ={" "}
                          <Fr
                            num={<>(<Var>n</Var>+3)(<Var>n</Var>+2)(<Var>n</Var>+1)!</>}
                            den={<>(<Var>n</Var>+1)!</>}
                          />{" "}
                          = (<Var>n</Var>+3)(<Var>n</Var>+2)
                        </div>
                      </div>
                      <div className="grid gap-4 border-b border-line py-4 sm:grid-cols-[auto_1fr] sm:gap-8">
                        <span className="label pt-1">例</span>
                        <div className="text-[15px] leading-9">
                          <Binom n={5} r={2} /> ={" "}
                          <Fr
                            num={<>5!</>}
                            den={<>2!·3!</>}
                          />{" "}
                          = (5 × 4 × 3)/(2 × 1) = 10
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 flex flex-wrap items-center gap-3 text-[13px] leading-relaxed text-muted">
                      <Jump id="combination">到第 02 节的计算器逐项练习</Jump>
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <div className="grid gap-6 lg:grid-cols-12">
                  <div className="lg:col-span-4">
                    <Subhead index="2">多项式的二项式展开</Subhead>
                    <p className="text-[14px] leading-[1.95] text-ink/80">
                      以 (2<Var>x</Var> + 1)⁵ 为例：
                    </p>
                    <ol className="mt-3 space-y-2 text-[14px] leading-[1.9] text-ink/80">
                      <li>1. 确定公式中的 a、b 以及指数 n。</li>
                      <li>2. 代入二项式定理的通项或各项展开：∑ C_r^n a^(n−r) b^r。</li>
                      <li>3. 注意括号和负号的运算，逐项化简。</li>
                    </ol>
                    <div className="mt-4">
                      <Jump id="theorem">到第 04 节的展开构造器切换到 2x + 1</Jump>
                    </div>
                  </div>
                  <div className="lg:col-span-8">
                    <Formula label="展开 / EXPANSION" latex="(2x+1)^5=32x^5+80x^4+80x^3+40x^2+10x+1">
                      <div className="space-y-1.5">
                        <div className="text-[13px] text-muted">
                          a = 2<Var>x</Var>，b = 1，n = 5 ⇒ T<sub className="font-mono text-[.7em]">r+1</sub> ={" "}
                          <Binom n={5} r={<Var>r</Var>} /> · (2<Var>x</Var>)
                          <sup className="font-mono text-[.7em]">5−r</sup>
                        </div>
                        <div>
                          (2<Var>x</Var> + 1)⁵ = 32<Var>x</Var>⁵ + 80<Var>x</Var>⁴ + 80<Var>x</Var>³ +
                          40<Var>x</Var>² + 10<Var>x</Var> + 1
                        </div>
                        <div className="font-mono text-[12px] text-muted">
                          C_0^5=1，C_1^5=5，C_2^5=10，C_3^5=10，C_4^5=5，C_5^5=1
                        </div>
                      </div>
                    </Formula>
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <div className="grid gap-6 lg:grid-cols-12">
                  <div className="lg:col-span-4">
                    <Subhead index="3">求特定项 / 指定项的系数</Subhead>
                    <ol className="space-y-3 text-[14px] leading-[1.85] text-ink/80">
                      <li>
                        <span className="font-mono text-[12px] text-muted">01</span>{" "}
                        <b className="font-semibold">写通项：</b>
                        T_(r+1) = C_r^n · a^(n−r) · b^r。
                      </li>
                      <li>
                        <span className="font-mono text-[12px] text-muted">02</span>{" "}
                        <b className="font-semibold">代入并化简：</b>
                        把具体的 a、b 代进去，把所有 x 合并成 x 的某次幂。
                      </li>
                      <li>
                        <span className="font-mono text-[12px] text-muted">03</span>{" "}
                        <b className="font-semibold">建立方程求 r：</b>
                        求 x^k 的系数令指数 = k；求常数项令指数 = 0。
                      </li>
                      <li>
                        <span className="font-mono text-[12px] text-muted">04</span>{" "}
                        <b className="font-semibold">得出结果：</b>
                        把 r 代回通项或系数公式。
                      </li>
                    </ol>
                  </div>
                  <div className="lg:col-span-8">
                    <ConstantTermLab />
                  </div>
                </div>
              </Reveal>
            </div>
          </Section>

          {/* 06 */}
          <Section
            id="cases"
            index="06"
            title="常用特例"
            latin="Special Cases"
            lead={
              <Body>
                <p>
                  把 <Var>r</Var> = 1, 2, 3 代入组合数公式，可以得到三把极快的计算器。
                  它们能大大加快含未知数 <Var>n</Var> 的二项式问题。
                </p>
              </Body>
            }
          >
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <SpecialCaseFormula />
                <div className="mt-6">
                  <NoteBox>
                    含未知数的题目里，先把 C_2^n、C_3^n 展开成 n 的多项式，
                    再和展开式里的系数对照，通常比保留阶乘形式快得多。
                  </NoteBox>
                </div>
              </div>
              <div className="lg:col-span-7">
                <SpecialCases />
              </div>
            </div>
          </Section>

          {/* 07 */}
          <Section
            id="unknowns"
            index="07"
            title="进阶一 · 未知参数"
            latin="Unknowns"
            lead={
              <Body>
                <p>
                  已知形如 (1 − <Var>kx</Var>)
                  <sup className="font-mono text-[.7em]">n</sup> 的展开式前几项，
                  或已知由求和符号定义的系数关系（如 λ<sub className="font-mono text-[.7em]">k</sub>、μ
                  <sub className="font-mono text-[.7em]">k</sub>），求未知常数 <Var>k</Var>、
                  <Var>n</Var> 或 <Var>a</Var>。
                </p>
              </Body>
            }
          >
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <DefList
                  items={[
                    {
                      k: "1 · 展开并提取系数",
                      v: "用二项式定理或常用特例，展开到题目要求的最高幂次（如 x 与 x² 项）。",
                    },
                    {
                      k: "2 · 建立联立方程",
                      v: "对比等式两边对应幂次的系数，或利用比例关系（如 λ₂ : μ₃ = 3 : 2）。",
                    },
                    {
                      k: "3 · 求解未知数",
                      v: "代入消元法或因式分解解出参数。",
                    },
                    {
                      k: "例",
                      v: (
                        <span className="font-mono text-[13px] leading-7">
                          (1−2x)³ = 1 − 6x + 12x² − 8x³
                          <br />
                          ⇒ A = −6，B = 12 ⇒ n = 3，k = 2
                        </span>
                      ),
                    },
                  ]}
                />
              </div>
              <div className="lg:col-span-8">
                <UnknownLab />
              </div>
            </div>
          </Section>

          {/* 08 */}
          <Section
            id="products"
            index="08"
            title="进阶二 · 乘积的特定项"
            latin="Product of Binomials"
            lead={
              <Body>
                <p>
                  两个二项式相乘（或多项式与二项式相乘）后求某特定次幂的系数。
                  关键是：<b className="font-semibold">不必全展开</b>，
                  只展开到能凑出目标次幂的程度。
                </p>
              </Body>
            }
          >
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <DefList
                  items={[
                    {
                      k: "1 · 部分展开",
                      v: "分别把两个因式展开到满足目标次数所需的最高幂次（例如展开到 x²）。",
                    },
                    {
                      k: "2 · 项的匹配",
                      v: "找出相乘后能够组合成目标次幂的所有项：常数项 × x² 项、一次项 × 一次项、二次项 × 常数项……",
                    },
                    {
                      k: "3 · 计算并求和",
                      v: "把对应组合的系数相乘再相加，即为该目标项的总系数。",
                    },
                    {
                      k: "4 · 求解参数",
                      v: "若系数中含有未知数 a，整理成关于 a 的方程，再按题目给定的系数数值求解。",
                    },
                  ]}
                />
                <div className="mt-6">
                  <ProductFormula />
                </div>
                <div className="mt-4">
                  <Formula
                    label="题 B 的静态解 / (x + 5/x)²(x − 2)⁵"
                    latex="[x^2]=-32-800-250=-1082"
                  >
                    <div className="font-mono text-[13px] leading-7">
                      (x + 5/x)² = x² + 10 + 25/x²
                      <br />
                      (x − 2)⁵ = x⁵ − 10x⁴ + 40x³ − 80x² + 80x − 32
                      <br />
                      [x²] = (−32) + 10·(−80) + 25·(−10) = −1082
                    </div>
                  </Formula>
                </div>
              </div>
              <div className="lg:col-span-8">
                <ProductLab />
              </div>
            </div>
          </Section>

          {/* 09 */}
          <Section
            id="review"
            index="09"
            title="速查与自测"
            latin="Review"
            lead={
              <Body>
                <p>先扫一遍公式表，再做八道题。错的题回到对应的章节即可。</p>
              </Body>
            }
          >
            <Reveal>
              <div className="label mb-3">公式速查 / QUICK REFERENCE</div>
              <QuickRef />
            </Reveal>
            <div className="mt-12">
              <Quiz />
            </div>
            <Colophon />
          </Section>
        </Shell>
      </main>
    </div>
  );
}
