# 系统实施运维 · 学习路径站

一个**纯静态、零依赖、可离线打开**的学习网站，面向系统实施 / 运维工程师，覆盖从入门到专家的完整成长路径。

## 内容构成

| 页面 | 内容 |
| --- | --- |
| `index.html` | 8 阶段学习路径时间线、技能矩阵（初/中/高级对照）、24 周执行计划 |
| `knowledge.html` | 17 个知识模块、102 个知识点，含「必背」标记与可复制命令示例 |
| `interview.html` | 147 道分级面试题（初级 27 / 中级 97 / 高级 23），含答题要点与加分提示 |
| `resources.html` | 67 条资源链接，分 10 组：官方文档优先，中文实战文章补充 |
| `job.html` | 岗位对标页：8 条任职要求逐条拆解、6 个月实习计划、商旅/财务共享业务速成、工具清单 |

## 目录结构

```
alo_program/
├── index.html              学习路径首页
├── knowledge.html          知识点手册
├── interview.html          面试题库
├── resources.html          资源库
├── job.html                岗位对标（系统实施运维实习岗准备清单）
├── README.md
└── assets/
    ├── css/style.css       深/浅色双主题样式（CSS 变量驱动）
    ├── js/app.js           渲染与交互逻辑（原生 JS，无框架）
    └── data/
        ├── knowledge.js    window.MODULES   知识模块数据
        ├── interview-a.js  window.QUESTIONS 题库 1–40（系统/Linux/网络/存储）
        ├── interview-b.js  window.QUESTIONS 题库 41–72（数据库/中间件）
        ├── interview-c.js  window.QUESTIONS 题库 73–117（监控/容器/云/安全/实施/排障/职业）
        ├── interview-d.js  window.QUESTIONS 题库 118–147（ERP与财务/实施交付/Excel与数据/职业发展）
        └── resources.js    window.RESOURCES 资源链接
```

## 使用方法

### 方式一：直接双击

直接双击 `index.html` 用浏览器打开即可。所有数据以 `window.*` 全局变量的形式内联在 `.js` 文件中，**不使用 fetch**，因此 `file://` 协议下也能完整运行。

### 方式二：本地起一个静态服务（推荐）

```bash
# Python 3
cd alo_program && python -m http.server 8080

# Node.js
npx serve .
```

然后访问 <http://127.0.0.1:8080>。

### 方式三：部署到任意静态托管

上传整个目录即可，无需构建步骤。适用于 Nginx、GitHub Pages、对象存储静态网站、内网 IIS 等。

```nginx
server {
    listen 80;
    server_name ops.example.com;
    root /var/www/alo_program;
    index index.html;
    location / { try_files $uri $uri/ =404; }
}
```

### 方式四：GitHub Pages（推荐给个人展示）

仓库根目录就是站点根目录，不需要构建：

```bash
git init
git add .
git commit -m "feat: 系统实施运维学习路径站"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

然后在 GitHub 仓库 → **Settings → Pages** → *Build and deployment* → Source 选 **Deploy from a branch**，
Branch 选 `main` / 目录选 `/ (root)` → Save。约 1 分钟后访问：

```
https://<你的用户名>.github.io/<仓库名>/
```

注意：
- 页面之间的链接都是相对路径，放在子目录（`/仓库名/`）下也能正常工作。
- 若用自定义域名（如 `www.example.com`），需在仓库 Settings → Pages 填 Custom domain，并在域名 DNS 加 CNAME 记录；HTTPS 勾选 Enforce。
- 仓库名若取 `<用户名>.github.io`，站点会直接挂在根域名。

## 交互功能

- **深/浅色主题切换**：右上角按钮，选择保存在 `localStorage`（键 `alo.theme`）。
- **题库筛选**：按模块、难度筛选，关键词搜索，随机抽题，「只看已掌握」。
- **收藏与进度**：★ 收藏重点题（`alo.star`），展开过的题目记为已掌握（`alo.seen`），数据仅存本地浏览器。
- **知识点折叠 + 搜索**：支持一键展开/收起全部模块。
- **资源筛选**：按类型（官方文档 / 教程 / 实战 / 面试 / 规范）过滤 + 搜索。
- **打印友好**：`@media print` 已适配，可直接打印成 PDF 做纸质复习材料。

## 内容维护

数据与视图完全分离，改内容只需要动 `assets/data/` 下的 js 文件：

```js
// 新增一道面试题（追加到任意 interview-*.js 的数组里）
{ id: 118, mod: '故障排查', diff: '高级', q: '题目', a: '<ul><li>要点</li></ul>',
  tip: '可选：加分提示', tags: ['标签'], cmd: '可选：命令示例' }

// 新增一个知识点（knowledge.js 的 modules[].items[]）
{ t: '知识点名', lv: '必会/熟悉/了解', must: true, d: ['说明'], cmd: '可选命令' }

// 新增一条资源（resources.js 的 groups[].items[]）
{ t: '标题', u: 'https://...', d: '一句话说明', type: '官方文档/教程/实战/面试/规范' }
```

注意：题库 `id` 需全局唯一（四份数据文件按 a→b→c→d 顺序依次 `concat` 到 `window.QUESTIONS`），难度 `diff` 只认 `初级 / 中级 / 高级`（样式表里另有余量可支持「专家」）。

## 关于链接

资源链接取自公开搜索结果与各产品官方文档入口，未做逐条在线校验。外链内容可能随作者更新而变化，遇到与官方文档冲突的说法以官方文档为准。

## 数据来源与免责

题库答案、知识点说明为工程经验整理，用于复习与自测，不代表任何公司的面试标准。生产环境执行任何命令前请先在测试环境验证。
