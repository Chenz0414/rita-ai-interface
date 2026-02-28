# Nuxt 4 重构施工图纸 — Rita AI Chat

> 本文档基于已确认的 React 原型，为 Cursor 在 Nuxt 4 + @nuxt/ui 下完全重构提供精确指导。  
> **严禁自由发挥**，所有文案、尺寸、交互状态均以本文档为准。

---

## 1. 组件拆解清单

按最小功能模块抽离原则，页面 `pages/index.vue` 由以下子组件组成：

| 序号 | 组件文件名 | 功能描述 | 父级 |
|------|-----------|---------|------|
| 1 | `IconSidebar.vue` | 最左侧图标导航栏（w-16），含 Logo + 4 个导航图标 | `index.vue` |
| 2 | `IconSidebarLogo.vue` | Logo 区域，显示字母 "R"，圆角方块，带呼吸发光动画 | `IconSidebar` |
| 3 | `IconSidebarNavItem.vue` | 单个导航图标按钮，接收 `icon`、`label`、`active` props | `IconSidebar` |
| 4 | `InnerSidebar.vue` | 内侧边栏（w-64），含新建对话、模型列表、历史、用户信息 | `index.vue` |
| 5 | `NewChatButton.vue` | "New Chat" 按钮，带 Plus 图标 | `InnerSidebar` |
| 6 | `ModelTabs.vue` | 三段式标签切换：All / Free Models / Pro Models | `InnerSidebar` |
| 7 | `ModelList.vue` | 模型列表，当前选中项为 "Rita" | `InnerSidebar` |
| 8 | `ModelListItem.vue` | 单个模型行，接收 `name`、`selected`、`icon` props | `ModelList` |
| 9 | `ChatHistoryList.vue` | "7 Days Ago" 历史对话列表 | `InnerSidebar` |
| 10 | `ChatHistoryItem.vue` | 单条历史记录，显示截断标题 | `ChatHistoryList` |
| 11 | `UserProfile.vue` | 底部用户信息：头像、名称、余额、设置按钮 | `InnerSidebar` |
| 12 | `ChatArea.vue` | 主聊天区域，管理空状态与对话状态的切换 | `index.vue` |
| 13 | `ChatEmptyState.vue` | 空状态视图：欢迎语 + 输入框 + 快捷操作 | `ChatArea` |
| 14 | `ChatMessageList.vue` | 消息列表区域，可滚动，含自动滚底逻辑 | `ChatArea` |
| 15 | `ChatMessageBubble.vue` | 单条消息气泡，区分 user / assistant 两种样式 | `ChatMessageList` |
| 16 | `ChatInputBox.vue` | 输入框容器（共享组件，空状态与对话状态复用） | `ChatArea` |
| 17 | `QuickActionPills.vue` | 快捷操作按钮行（仅空状态显示） | `ChatEmptyState` |
| 18 | `QuickActionPillItem.vue` | 单个快捷操作按钮 | `QuickActionPills` |
| 19 | `StreamingIndicator.vue` | AI 回复中的三点呼吸动画指示器 | `ChatMessageList` |

---

## 2. @nuxt/ui 映射指南

### 2.1 按钮类

| 原型元素 | @nuxt/ui 组件 | 关键 Props / 说明 |
|---------|--------------|------------------|
| "New Chat" 按钮 | `<UButton>` | `block`, `color="primary"`, `size="md"`, `icon="i-lucide-plus"`, `label="New Chat"` |
| 发送按钮（圆形） | `<UButton>` | `color="primary"`, `variant="solid"`, `icon="i-lucide-send"`, `:disabled="!input.trim() \|\| isStreaming"`, `class="rounded-full"` |
| 附件按钮 | `<UButton>` | `variant="ghost"`, `color="neutral"`, `icon="i-lucide-paperclip"`, `size="xs"` |
| 联网搜索切换 | `<UButton>` | `variant="ghost"`, `icon="i-lucide-globe"`, 动态绑定 `color` 根据 `webSearch` 状态切换 `"primary"` / `"neutral"` |
| 设置齿轮按钮 | `<UButton>` | `variant="ghost"`, `color="neutral"`, `icon="i-lucide-settings"`, `size="xs"` |
| 导航图标按钮 (`IconSidebarNavItem`) | `<UButton>` | `variant="ghost"`, `square`, 根据 `active` 动态添加 `bg-primary/10 text-primary` 样式 |
| 模型列表项 (`ModelListItem`) | `<UButton>` | `block`, `variant="ghost"`, `class="justify-start"`, 选中时追加 `bg-primary/8 text-primary font-medium` |
| 历史记录项 (`ChatHistoryItem`) | `<UButton>` | `block`, `variant="ghost"`, `class="justify-start truncate"` |
| 快捷操作按钮 (`QuickActionPillItem`) | `<UButton>` | `variant="outline"`, `size="sm"`, `class="rounded-full"`, 传入对应 `icon` |
| 标签切换 (`ModelTabs`) | `<UTabs>` | `:items="[{label:'All'},{label:'Free Models'},{label:'Pro Models'}]"`, 使用 `variant="pill"` 风格 |

### 2.2 输入类

| 原型元素 | @nuxt/ui 组件 | 关键说明 |
|---------|--------------|---------|
| 聊天输入框 | `<UTextarea>` | `autoresize`, `placeholder="欢迎随时提问或输入 '/' 选择一项技能"`, `:rows="1"`, `:maxrows="6"` |

### 2.3 样式强约束

- **所有 `<UButton>` 和 `<a>` 标签**：hover 时 `cursor: pointer`（@nuxt/ui 默认满足，确认无覆盖）。
- **所有 `<UButton>`**：必须有 hover 视觉反馈（背景色变化或透明度变化）。@nuxt/ui 的 `variant="ghost"` 默认带 hover 背景，无需额外处理。
- **`<UTextarea>` focus 状态**：**不加 shadow**。通过 `ui` prop 覆盖：`{ base: 'focus:ring-0 focus:shadow-none' }`，或在 `app.config.ts` 中全局配置。
- **Markdown 渲染**：AI 回复使用 `<ContentRenderer>` 或第三方 markdown 组件（如 `vue-markdown-render`），需支持 `**bold**`、`` `code` ``、代码块、有序/无序列表。

---

## 3. 占位与文案说明

### 3.1 图片占位

本原型中**无真实图片资源**。以下元素涉及视觉占位：

| 元素 | 处理方式 | 尺寸 |
|------|---------|------|
| Logo "R" | 纯 CSS 圆角方块 + 文字，**非图片** | `w-9 h-9`（36×36px） |
| 用户头像 | 纯 CSS 渐变圆形 + 首字母 "B"，**非图片** | `w-8 h-8`（32×32px） |
| AI 回复头像 | 纯 CSS 圆角方块 + Sparkles 图标，**非图片** | `w-7 h-7`（28×28px） |

> ⚠️ 如后续需替换为真实图片，使用 `<img src="" width="36" height="36" alt="Rita Logo" />` 占位，**严禁生成装饰性无用元素**。

### 3.2 固定文案（原封不动，禁止润色）

| 位置 | 文案内容 |
|------|---------|
| 空状态标题 | `今天我能为您做些什么？` |
| 空状态副标题 | `Rita · 您的智能助理` |
| 输入框 placeholder | `欢迎随时提问或输入 '/' 选择一项技能` |
| 新建对话按钮 | `New Chat` |
| 标签页 | `All` / `Free Models` / `Pro Models` |
| 模型列表标题 | `Models` |
| 模型名称 | `Rita` / `GPT-4o` / `Claude 3.5` / `Gemini Pro` / `Llama 3` |
| 历史标题 | `7 Days Ago` |
| 历史条目 | `如何优化React性能` / `Python数据分析教程` / `企业级API设计最佳实践` / `机器学习入门指南` |
| 用户名 | `bonjour0414` |
| 余额数字 | `1006` |
| 模型指示器（输入框内） | `Rita` |
| 快捷操作标签 | `Deep Research` / `Image Generation` / `Quick Question` / `Writing` / `Translation` / `More Tools` |

### 3.3 图标映射（Lucide）

安装 `@iconify-json/lucide`，使用 `i-lucide-*` 格式：

| 用途 | 图标名 |
|------|--------|
| AI Chat 导航 | `i-lucide-message-square` |
| AI Image 导航 | `i-lucide-image` |
| AI Video 导航 | `i-lucide-video` |
| AI Audio 导航 | `i-lucide-audio-lines` |
| 新建对话 | `i-lucide-plus` |
| Rita 模型标识 | `i-lucide-sparkles` |
| 设置 | `i-lucide-settings` |
| 余额闪电 | `i-lucide-zap` |
| 附件 | `i-lucide-paperclip` |
| 联网搜索 | `i-lucide-globe` |
| 发送 | `i-lucide-send` |
| Deep Research | `i-lucide-search` |
| Image Generation | `i-lucide-image` |
| Quick Question | `i-lucide-help-circle` |
| Writing | `i-lucide-pen` |
| Translation | `i-lucide-languages` |
| More Tools | `i-lucide-wrench` |

---

## 4. CSS 变量与页面级样式提示

### 4.1 主题色变量（写入 `app.config.ts` 或页面级 CSS）

**严格按以下值配置，不修改 @nuxt/ui 其他默认变量：**

```css
/* assets/css/rita-theme.css — 页面级样式，不要写入 main.css */

:root {
  /* 主题强约束变量 */
  --primary: 240 73.9% 61%;
  --background: 0 0% 100%;
  --foreground: 0 0% 9%;
  --border: 240 15% 88%;

  /* 扩展变量（用于特殊效果） */
  --primary-glow: 240 80% 72%;
  --sidebar-bg: 240 20% 98%;
  --sidebar-border: 240 15% 92%;
  --sidebar-foreground: 240 5% 35%;
  --chat-user-bg: 240 15% 95%;
  --chat-input-shadow: 240 20% 90%;
}

.dark {
  --primary: 240 73.9% 61%;
  --background: 240 6.7% 20.6%;
  --foreground: 0 0% 100%;
  --border: 240 16% 94%;

  /* 扩展变量（暗色适配） */
  --primary-glow: 240 80% 72%;
  --sidebar-bg: 240 10% 18%;
  --sidebar-border: 240 10% 25%;
  --sidebar-foreground: 240 5% 65%;
  --chat-user-bg: 240 10% 25%;
  --chat-input-shadow: 240 10% 15%;
}
```

> ⚠️ 暗色模式的 `--background` 为 `240 6.7% 20.6%`（深灰蓝），**非纯黑**，与亮色模式不同。  
> ⚠️ 在 `app.config.ts` 中通过 `ui.primary` 配置主色以确保 @nuxt/ui 组件正确引用。

### 4.2 特殊效果类（写入 `assets/css/rita-theme.css`）

```css
/* 发光效果 */
.glow-primary {
  box-shadow: 0 0 20px -5px hsl(var(--primary) / 0.25),
              0 0 40px -10px hsl(var(--primary-glow) / 0.15);
}
.glow-primary-sm {
  box-shadow: 0 0 12px -3px hsl(var(--primary) / 0.2);
}

/* 渐变边框（输入框聚焦效果） */
.gradient-border {
  position: relative;
}
.gradient-border::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, hsl(var(--primary) / 0.3), transparent 50%, hsl(var(--primary) / 0.15));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

/* 科技感背景 */
.tech-grid-bg {
  background-image:
    radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, hsl(var(--primary) / 0.02) 0%, transparent 50%);
}

/* 精简滚动条 */
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--border)) transparent;
}
.scrollbar-thin::-webkit-scrollbar { width: 4px; }
.scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: hsl(var(--border));
  border-radius: 20px;
}
```

### 4.3 Tailwind 扩展（`tailwind.config.ts`）

需在 Tailwind 配置中注册以下自定义色：

```
colors: {
  sidebar: {
    bg: 'hsl(var(--sidebar-bg))',
    border: 'hsl(var(--sidebar-border))',
    foreground: 'hsl(var(--sidebar-foreground))',
  },
  'chat-user-bg': 'hsl(var(--chat-user-bg))',
}
```

---

## 5. 状态机与逻辑插槽

### 5.1 页面级状态

| 状态变量 | 类型 | 初始值 | 说明 |
|---------|------|--------|------|
| `messages` | `Array<{role: 'user'|'assistant', content: string}>` | `[]` | 当前对话消息列表 |
| `input` | `string` | `""` | 输入框绑定值 |
| `isStreaming` | `boolean` | `false` | AI 回复流式输出中，禁用发送按钮 |
| `webSearch` | `boolean` | `false` | 联网搜索开关状态 |
| `activeTab` | `string` | `"All"` | 模型标签页当前选中 |
| `selectedModel` | `string` | `"Rita"` | 当前选中模型（UI 显示） |

### 5.2 计算属性

| 名称 | 逻辑 |
|------|------|
| `isEmpty` | `messages.length === 0`，控制空状态 vs 对话状态视图切换 |
| `canSend` | `input.trim().length > 0 && !isStreaming`，控制发送按钮可用性 |

### 5.3 交互事件与接口插槽

#### `handleSend()`
```
触发条件：点击发送按钮 或 按下 Enter（非 Shift+Enter）
逻辑流程：
  1. 校验 canSend
  2. 将 input 值追加到 messages（role: 'user'）
  3. 清空 input
  4. 设置 isStreaming = true
  5. 调用 API 接口（见下方 API 插槽）
  6. 流式追加 AI 回复到 messages（role: 'assistant'）
  7. 设置 isStreaming = false
  8. 滚动到底部
```

#### `handleNewChat()`
```
触发条件：点击 "New Chat" 按钮
逻辑：清空 messages 数组，重置为空状态
```

#### `toggleWebSearch()`
```
触发条件：点击联网搜索图标
逻辑：webSearch = !webSearch
```

### 5.4 API 接口插槽

```typescript
// 接口函数签名（研发对接时替换内部实现）
async function sendChatMessage(payload: {
  model: string;        // 固定值 "glm-4.7"，不随 UI 显示变化
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  web_search?: boolean; // 联网搜索开关
}): Promise<ReadableStream<string>> {
  // TODO: 对接真实 API
  // 当前 mock：延迟 400ms 后返回固定文本，逐字符模拟流式输出
}
```

> ⚠️ **关键约束**：UI 始终显示模型名为 "Rita"，但 API payload 中 `model` 字段**必须**发送 `"glm-4.7"`。

### 5.5 输入框行为

| 行为 | 说明 |
|------|------|
| 自动增高 | 随内容行数增长，最小 1 行，最大 6 行（约 160px），超出后滚动 |
| Enter 发送 | `Enter` 键触发 `handleSend()`；`Shift+Enter` 换行 |
| 流式禁用 | `isStreaming` 为 true 时，发送按钮 `disabled`，`opacity-40` |

### 5.6 动画规格

| 元素 | 动画类型 | 参数 |
|------|---------|------|
| Logo "R" | 呼吸发光 | `box-shadow` 在 `0.2` 和 `0.4` 透明度间循环，`duration: 3s`，`ease: easeInOut`，无限循环 |
| 空状态图标 | 呼吸发光 | 同上，`0.2` ↔ `0.35` 透明度 |
| 空状态标题 | 入场 | `opacity: 0→1`，`translateY: 20→0`，`duration: 0.5s` |
| 输入框区域 | 入场 | `opacity: 0→1`，`translateY: 10→0`，`duration: 0.5s`，`delay: 0.15s` |
| 快捷操作行 | 入场 | `opacity: 0→1`，`duration: 0.4s`，`delay: 0.3s` |
| 消息气泡 | 入场 | `opacity: 0→1`，`translateY: 8→0`，`duration: 0.25s` |
| 流式指示器 | 三点呼吸 | 3 个圆点 `opacity` 在 `0.3` 和 `1` 间循环，`duration: 1s`，各延迟 `0.2s` |
| 导航图标 hover | 缩放 | `scale: 1.05`，点击 `scale: 0.95` |
| New Chat 按钮 hover | 缩放 | `scale: 1.01`，点击 `scale: 0.98` |

> 动画库建议：使用 `@vueuse/motion` 或直接 CSS `@keyframes` + `transition`。

### 5.7 布局结构速览

```
┌──────────────────────────────────────────────────┐
│ index.vue — flex h-screen                        │
│ ┌────┬──────────┬───────────────────────────────┐ │
│ │Icon│  Inner   │                               │ │
│ │Side│  Side    │       ChatArea                │ │
│ │bar │  bar     │                               │ │
│ │w-16│  w-64    │       flex-1                  │ │
│ │    │          │                               │ │
│ │    │          │  ┌─────────────────────────┐  │ │
│ │    │          │  │ Empty / MessageList     │  │ │
│ │    │          │  │                         │  │ │
│ │    │          │  └─────────────────────────┘  │ │
│ │    │          │  ┌─────────────────────────┐  │ │
│ │    │          │  │ ChatInputBox (底部浮动) │  │ │
│ │    │          │  └─────────────────────────┘  │ │
│ └────┴──────────┴───────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

### 5.8 关键尺寸速查

| 元素 | 尺寸 | 圆角 |
|------|------|------|
| IconSidebar 宽度 | `w-16`（64px） | — |
| InnerSidebar 宽度 | `w-64`（256px） | — |
| Logo 方块 | `w-9 h-9`（36px） | `rounded-xl` |
| 导航图标按钮 | `w-10 h-10`（40px） | `rounded-xl` |
| 用户头像 | `w-8 h-8`（32px） | `rounded-full` |
| AI 头像 | `w-7 h-7`（28px） | `rounded-lg` |
| 发送按钮 | `w-8 h-8`（32px） | `rounded-full` |
| 输入框容器 | `max-w-3xl` | `rounded-2xl` |
| 用户消息气泡 | `max-w-[85%]` | `rounded-2xl rounded-br-md` |
| 快捷操作按钮 | — | `rounded-full` |
| New Chat 按钮 | 全宽 `h-10` | `rounded-xl` |

---

## 附录：消息区域与输入框无分割线说明

对话状态下，消息滚动区域和底部输入框之间**不使用 border-top 分割线**。输入框区域背景透明，与消息区域共享同一背景色，形成无缝衔接的高级观感。输入框容器仅通过自身的 `border` + 微弱 `box-shadow` 实现视觉层次。
