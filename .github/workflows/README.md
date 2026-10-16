# 二项式定理 · 组合数学学习笔记

一份以排版为唯一素材的组合数学学习笔记（阶乘 / 组合数 / 杨辉三角 / 二项式定理 / 题型方法）。
构建产物是**单个自包含的 `dist/index.html`**（CSS 与 JS 全部内联），可直接作为 GitHub Pages 的静态页面使用。

---

## 一、直接部署（最省事）

1. 本地构建：

   ```bash
   npm install
   npm run build
   ```

2. 把 `dist/index.html` 上传到你的仓库根目录，命名为 `index.html`：

   ```
   your-repo/
   └── index.html        ← 由 dist/index.html 复制而来
   ```

3. 在仓库 **Settings → Pages** 中选择：

   - Source: **Deploy from a branch**
   - Branch: **main** / **/ (root)**

4. 访问 `https://<用户名>.github.io/<仓库名>/` 即可。

> 由于整个页面被内联进单个 HTML 文件，无需任何构建环境，GitHub Pages 会直接原样提供它。

## 二、保持自动构建（推荐给长期维护）

在仓库中保留本项目的源码，并在仓库根目录添加 `.github/workflows/pages.yml`：

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

然后在 **Settings → Pages** 中把 Source 改为 **GitHub Actions**。

## 三、离线使用

`dist/index.html` 除了 Google Fonts（Inter / IBM Plex Mono）之外不依赖任何外部资源。
断网时系统回落到 Helvetica / Arial / 系统等宽字体，排版结构保持不变。

---

## 版式原则

| 原则 | 落实方式 |
| --- | --- |
| 强调色只用一次 | 全页仅报头一枚朱红色标，其余状态一律用黑白反转 |
| 字体先于装饰 | 没有图片、图标、阴影与圆角；公式与表格全部由排版生成 |
| 动效为阅读服务 | 仅滚动淡入、状态反馈、滑块联动，并尊重 `prefers-reduced-motion` |
| 触屏优先 | 可点区域 ≥ 44px，横向内容可滑动，不依赖 hover |

## 交互清单

| 位置 | 交互 |
| --- | --- |
| 01 阶乘 | 阶乘展开尺（逐步揭示因子）、阶乘约分分步演示 |
| 02 组合 | 组合数计算器（n / r 步进）、性质与帕斯卡恒等式实时核对 |
| 03 杨辉三角 | 可横向滑动的三角表、点选任意格子查看来历 |
| 04 二项式定理 | 展开式构造器（n 步进、符号 / 数值切换、点选任意一项） |
| 05 题型 | 特定项求解器（拖动 r、切换「常数项 / x^k 系数」） |
| 06 特例 | C₁ⁿ / C₂ⁿ / C₃ⁿ 随 n 实时代入 |
| 07 未知参数 | 联立方程求解 k 与 n、比例关系滑块验证 n = 7 |
| 08 乘积 | 特定项配对（点选两侧项）、a 的滑块与解的高亮 |
| 09 自测 | 八道单选题 + 解析 + 阅读进度清单（本地保存） |
