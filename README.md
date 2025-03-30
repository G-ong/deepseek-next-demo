# AI 聊天应用

这是一个基于 Next.js 构建的 AI 聊天应用，支持多轮对话和模型切换功能。

> 项目最初来源：[B 站 视频教程](https://www.bilibili.com/video/BV19wRAY6E69)

## 技术栈说明

### 核心框架

-   [Next.js](https://nextjs.org/): React 框架，用于构建服务端渲染和客户端渲染的 Web 应用
-   [React](https://react.dev/): 用于构建用户界面的 JavaScript 库

### 身份认证

-   [Clerk](https://clerk.com/): 提供用户认证和授权服务，处理用户登录、注册等功能

### AI 功能

-   [AI SDK](https://sdk.vercel.ai/): 提供与 AI 模型交互的接口
-   [Deepseek](https://deepseek.ai/): 提供 AI 对话能力，支持 V3 和 R1 两个模型版本
-   [阿里云百炼](https://bailian.console.aliyun.com/): 提供 AI 模型服务

### 数据存储

-   [Supabase](https://supabase.com/): 提供数据库服务，存储聊天记录和用户数据
-   [Drizzle](https://orm.drizzle.team/): ORM 工具，用于数据库操作和类型安全

### 状态管理

-   [TanStack Query](https://tanstack.com/query/latest): 处理服务端状态管理，提供数据获取、缓存和更新功能

### UI 组件

-   [Material UI](https://mui.com/): 提供预构建的 UI 组件
-   [Tailwind CSS](https://tailwindcss.com/): 用于样式设计和响应式布局

## 主要功能

1. 用户认证

    - 支持用户注册和登录
    - 保护路由和 API 端点

2. 聊天功能

    - 支持多轮对话
    - 实时消息流式响应
    - 消息历史记录保存
    - 支持模型切换（V3/R1）

3. 用户体验

    - 响应式设计
    - 自动滚动到最新消息
    - 支持回车发送消息
    - 输入状态管理

4. 数据管理
    - 实时数据同步
    - 消息持久化存储
    - 缓存管理

## 项目运行

```bash
npm run dev
```

## 环境变量配置

需要配置以下环境变量：

-   `DEEPSEEK_API_KEY`: Deepseek API 密钥
-   `BASE_URL`: API 基础 URL
-   `DATABASE_URL`: 数据库连接 URL
-   Clerk 相关配置

## 开发说明

1. 使用 TypeScript 确保类型安全
2. 采用 React Query 进行数据管理
3. 使用 Drizzle 进行数据库操作
4. 实现了优雅的错误处理和加载状态
