# 画伴 DrawMate

![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-ff69b4)

**画伴 DrawMate** 是一个为零基础到进阶学习者打造的绘画学习应用：系统分步课程 + 浏览器画布 + 科学练习模式 + 进度追踪。纯前端实现、无需注册登录、所有数据保存在本地浏览器，打开网页就能画。

> 为什么叫“画伴”？因为它不是一本教材，而是每天陪你在画布前待 15 分钟的伙伴。

## ✨ 功能

- **📚 系统课程**：6 门真实可学的课程——线条控制、基本形状、透视基础、明暗关系、色彩基础、头像比例。每课包含学习目标、讲解正文、4 个分步学习任务（含要点提示）、课后练习与内置 SVG 参考图。
- **🖌️ 绘画画布**：基于 Pointer Events，同时支持鼠标、触控与手写笔（压感接口已预留）；笔刷颜色 / 大小 / 透明度、橡皮、撤销 / 重做、清空、保存 PNG、下载全尺寸作品。
- **🖼️ 参考图模式**：内置线稿图库或上传自己的图片，支持不透明度调节（垫在笔下描摹）、网格 / 九宫格、镜像翻转。
- **⏱️ 四种练习模式**：30 秒速写、盲画（落笔自动隐藏笔迹）、一笔画（抬笔即锁定）、临摹计时，完成自动计入统计。
- **📈 进度追踪**：课程完成度、练习次数与总时长、连续打卡天数、最近 7 天打卡视图。
- **🎨 作品画廊**：作品以缩略图形式保存到 localStorage，可查看大图、下载、删除。
- **⚙️ 更多**：暗色模式、键盘快捷键、一键重置数据；响应式适配手机 / 平板 / 桌面；按钮均带 aria-label，常用操作有快捷键。

## 📸 截图

<!-- 截图占位：部署后补充真实截图 -->

| 首页 | 画室 | 练习模式 |
| :---: | :---: | :---: |
| ![首页](screenshots/home.png) | ![画室](screenshots/studio.png) | ![练习](screenshots/practice.png) |

| 课程详情 | 进度追踪 | 暗色模式 |
| :---: | :---: | :---: |
| ![课程](screenshots/course.png) | ![进度](screenshots/progress.png) | ![暗色](screenshots/dark.png) |

## 🛠️ 技术栈

- **框架**：React 18 + TypeScript 5
- **构建**：Vite 5
- **样式**：Tailwind CSS 3（暗色模式为 class 策略）
- **路由**：React Router 6（HashRouter，纯静态托管友好）
- **状态**：Zustand 5（persist 中间件持久化到 localStorage）
- **绘图**：原生 Canvas 2D API + Pointer Events（双层画布解决笔刷透明度叠加问题）
- **图标**：lucide-react
- **部署**：GitHub Actions → GitHub Pages

## 🚀 本地运行

要求 Node.js ≥ 18。

```bash
git clone https://github.com/luo173176/drawmate.git
cd drawmate
npm install
npm run dev        # 开发服务器，默认 http://localhost:5173
```

## 📦 构建

```bash
npm run build      # 类型检查 (tsc --noEmit) + 产物输出到 dist/
npm run preview    # 本地预览生产构建
```

## ☁️ 部署到 GitHub Pages

1. 把仓库推送到 GitHub（见下文）。
2. 进入仓库 **Settings → Pages → Build and deployment → Source**，选择 **GitHub Actions**。
3. 推送到 `main` 分支（或在 Actions 页手动触发 `workflow_dispatch`），工作流会自动构建并部署。
4. 稍等片刻，访问 `https://<你的用户名>.github.io/<仓库名>/`。

> 项目根路径适配：部署工作流使用 `--base=/<仓库名>/` 动态传给 Vite，
> 因此仓库无论叫什么名字都能正确部署；如果部署到 `用户名.github.io` 主站，
> 把工作流里的 `--base` 参数改为 `--base=/` 即可。

## 📁 目录结构

```text
drawmate/
├── .github/workflows/deploy.yml   # GitHub Actions 自动部署
├── public/favicon.svg             # 站点图标
├── src/
│   ├── main.tsx                   # 入口
│   ├── App.tsx                    # 路由与主题切换
│   ├── index.css                  # Tailwind 与全局样式
│   ├── types.ts                   # Course / Step / Artwork / Progress 等类型
│   ├── data/
│   │   ├── courses.ts             # 6 门课程内容（目标/讲解/步骤/练习/SVG 参考图）
│   │   └── references.ts          # 静物参考图库
│   ├── stores/                    # Zustand 状态（全部持久化到 localStorage）
│   │   ├── settingsStore.ts       # 主题设置
│   │   ├── brushStore.ts          # 画笔参数（含压感开关）
│   │   ├── progressStore.ts       # 课程进度 / 练习记录 / 连续打卡
│   │   ├── galleryStore.ts        # 作品画廊（缩略图 dataURL）
│   │   └── toastStore.ts          # 全局轻提示
│   ├── components/
│   │   ├── Layout.tsx             # 顶部导航 + 移动端底部导航
│   │   ├── CourseCard.tsx / ProgressBar.tsx / EmptyState.tsx
│   │   ├── ConfirmDialog.tsx / Toasts.tsx
│   │   └── canvas/
│   │       ├── DrawingCanvas.tsx  # 画布核心（Pointer Events / 撤销重做 / 压感预留）
│   │       ├── Toolbar.tsx        # 工具栏
│   │       ├── ReferencePanel.tsx # 参考图面板
│   │       └── useReferenceState.ts
│   ├── pages/                     # 首页 / 课程 / 画室 / 练习 / 画廊 / 进度 / 设置
│   ├── constants/                 # 色板、练习模式、快捷键、难度样式
│   └── utils/                     # 日期、格式化、图片、id 工具
├── index.html
├── package.json
├── vite.config.ts / tsconfig.json / tailwind.config.js / postcss.config.js
├── LICENSE
└── README.md
```

## 🗺️ 路线图

- [ ] **v0.2**：数据导出 / 导入（JSON 备份与迁移）；作品备注与标签
- [ ] **v0.3**：多图层支持；铅笔 / 马克笔纹理笔刷；对称绘图模式
- [ ] **v0.4**：PWA 离线可用；i18n 多语言；新增课程（人体动态、风景、动物）
- [ ] **v0.5**：笔画录制与回放（作画过程动画）；课程小测验
- [ ] **v0.6**：可选的静态数据同步方案（用户自托管）

## 🤝 贡献指南

欢迎一切形式的贡献！

1. Fork 本仓库并创建特性分支：`git checkout -b feature/awesome`
2. 提交前请确保 `npm run build` 通过（含 TypeScript 类型检查）
3. 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)，如 `feat: 新增对称绘图模式`
4. 发起 Pull Request 并简要描述改动

也欢迎通过 Issue 提出功能建议或反馈课程内容的问题。

## 📄 协议

本项目基于 [MIT License](LICENSE) 开源。课程内容与参考图为原创线稿，可自由使用。
