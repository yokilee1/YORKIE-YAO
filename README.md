<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 六爻 · 灵感 (I Ching Divination)

一个极简主义设计的数字化六爻排盘与 AI 解读工具。

本项目结合了传统《易经》六爻预测术与现代人工智能技术（阿里云百炼/通义千问），为您提供专业、深入且富有哲理的卦象解析。

## ✨ 功能特点

*   **沉浸式体验**：模拟传统“金钱卦”起卦过程，提供优雅的极简 UI 交互。
*   **智能排盘**：自动推算本卦、变卦、六亲、六神、纳音及世应关系。
*   **AI 深度解析**：
    *   集成阿里云百炼 (Qwen-Plus) 大模型。
    *   综合分析世应生克、月令旺衰、动爻变化。
    *   提供吉凶判断与生活建议。

## 🚀 快速开始

### 1. 环境准备

确保您的本地环境已安装 [Node.js](https://nodejs.org/) (推荐 v18+)。

### 2. 安装依赖

在项目根目录下运行：

```bash
npm install
```

### 3. 配置 API Key

本项目使用阿里云百炼 (Bailian) 服务。

1.  访问 [阿里云百炼控制台](https://bailian.console.aliyun.com/) 获取您的 API Key。
2.  在项目根目录创建 `.env.local` 文件。
3.  添加以下内容：

```env
BAILIAN_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> **注意**：请务必使用以 `sk-` 开头的阿里云 API Key，不要使用 Google Gemini 的 Key。

### 4. 启动项目

```bash
npm run dev
```

启动成功后，访问终端显示的本地地址（通常为 `http://localhost:3000` 或 `3001`）即可使用。

## 🛠️ 技术栈

*   **前端框架**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **UI 样式**: [Tailwind CSS](https://tailwindcss.com/)
*   **图标库**: [Lucide React](https://lucide.dev/)
*   **AI 服务**: [Alibaba Cloud Bailian (Qwen-Plus)](https://bailian.console.aliyun.com/)
*   **SDK**: OpenAI Node.js SDK (兼容百炼 API)

## 📄 许可证

MIT License
