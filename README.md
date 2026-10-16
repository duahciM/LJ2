# 二项式定理 · 组合数学学习笔记

一份以排版为唯一素材的组合数学学习笔记（阶乘 / 组合数 / 杨辉三角 / 二项式定理 / 题型方法），
基于 **Vite + React 19 + Tailwind CSS 4** 构建。

构建产物是**单个自包含的 `dist/index.html`**（CSS 与 JS 全部内联、无外部路径依赖），
因此可以原样作为 GitHub Pages 的静态页面使用。

🔗 在线访问：<https://duahcim.github.io/LJ2/>

---

## 一、项目结构

```
LJ2/
├─ .github/workflows/pages.yml   # 自动构建 + 部署到 GitHub Pages
├─ index.html                    # Vite 入口 HTML（含字体、meta、favicon）
├─ package.json / package-lock.json
├─ tsconfig.json
├─ vite.config.ts                # React + Tailwind + singlefile，base: "./"
├─ src/
│  ├─ main.tsx                   # 挂载入口
│  ├─ App.tsx                    # 页面骨架与章节组织
│  ├─ index.css                  # 设计令牌、排版与动效（Tailwind 4）
│  ├─ components/
│  │  ├─ nav.tsx                 # 顶栏 / 进度条 / 目录抽屉 / 回到顶部
│  │  ├─ ui.tsx                  # Section / Note / Stepper / Slider 等基础件
│  │  ├─ math.tsx                # 分数、组合数、幂、公式等排版组件
│  │  ├─ labs1.tsx               # 01–04 交互实验（阶乘 / 组合 / 杨辉三角 / 展开式）
│  │  └─ labs2.tsx               # 05–09 交互实验（特定项 / 参数 / 乘积 / 自测）
│  ├─ lib/comb.ts                # 阶乘、组合数、clamp、符号排版等纯函数
│  └─ utils/cn.ts               # className 合并工具
├─ NOTES.md                      # 版式原则与交互清单
└─ README.md
```

## 二、本地开发

```bash
npm install      # 安装依赖
npm run dev      # 开发服务器（默认 http://localhost:5173）
npm run build    # 构建 → dist/index.html（单文件）
npm run preview  # 预览构建产物
```

## 三、GitHub Pages 部署

已配置为**自动部署**，无需手动上传文件：

1. 工作流文件 `.github/workflows/pages.yml` 会在推送到 `main` 时执行
   `npm ci` → `npm run build`，然后把 `dist/` 目录发布到 Pages。
2. 仓库 **Settings → Pages → Build and deployment → Source** 需为
   **GitHub Actions**（本仓库已设置）。
3. 每次推送 `main` 后，到 **Actions** 标签页可以看到构建与部署进度；
   部署完成后访问 <https://duahcim.github.io/LJ2/>（首次生效可能需要一两分钟）。
4. 也可以在 Actions 页面点击 **Deploy to GitHub Pages → Run workflow** 手动触发。

> 因为构建产物是单文件 HTML，即使不用 Actions，也可以本地 `npm run build`
> 后把 `dist/index.html` 上传到任意静态托管（或在 Settings → Pages 里选择
> 「Deploy from a branch」并指定一个放着该文件的目录）。

## 四、离线使用

`dist/index.html` 除了 Google Fonts（Inter / IBM Plex Mono）之外不依赖任何外部资源。
断网时系统回落到 Helvetica / Arial / 系统等宽字体，排版结构保持不变。

详细的版式原则与交互清单见 [NOTES.md](./NOTES.md)。
