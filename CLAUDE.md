# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

全端互動式寶箱遊戲。玩家點擊三個寶箱尋找隱藏的寶藏（+$100），其餘藏有骷髏（-$50）。找到寶藏或所有寶箱皆被打開時遊戲結束。支援使用者註冊/登入，登入後自動儲存遊戲分數並可查看歷史紀錄。

## 常用指令

- `npm install` — 安裝依賴套件
- `npm run dev` — 同時啟動前端（port 3000）與後端（port 3001），使用 concurrently
- `npm run dev:frontend` — 僅啟動 Vite 前端開發伺服器
- `npm run dev:server` — 僅啟動 Express 後端（tsx watch，自動重載）
- `npm run build` — 正式環境建置，輸出至 `build/`

目前未設定測試框架或 linter。

## 架構

### 全端架構

```
React Frontend (port 3000) → Express API (port 3001) → SQLite Database
```

### 前端

- **建置工具**：Vite + React SWC plugin
- **前端框架**：React 18 + TypeScript
- **樣式**：Tailwind CSS v4（預編譯，內嵌於 `src/index.css`）— 部分 Tailwind CSS 變數/class 可能缺失，新增 UI 時優先使用 inline style
- **動畫**：Motion（framer-motion），用於寶箱開啟與 hover 動畫
- **UI 元件**：shadcn/ui 元件位於 `src/components/ui/`（基於 Radix UI + Tailwind）
- **路徑別名**：`@` → `./src`（設定於 `vite.config.ts`）

### 後端

- **伺服器**：Express 5，進入點為 `server/index.ts`
- **資料庫**：SQLite（better-sqlite3），檔案位於 `data/treasure-game.db`，WAL 模式
- **認證**：JWT（jsonwebtoken）+ bcryptjs 密碼雜湊，token 有效期 7 天
- **JWT Secret**：預設 `treasure-game-secret-key`，可透過 `JWT_SECRET` 環境變數覆蓋

### API 端點

- `POST /api/auth/signup` — 註冊（username 3-20 字元，password 6+ 字元）
- `POST /api/auth/signin` — 登入，回傳 JWT token
- `POST /api/scores` — 儲存遊戲分數（需認證）
- `GET /api/scores` — 取得玩家最近 50 筆分數（需認證）

### 重要檔案

- `src/App.tsx` — 遊戲核心邏輯：狀態管理（boxes、score、gameEnded）、隨機寶藏配置、點擊處理、音效播放、分數儲存、完整 UI 渲染
- `src/main.tsx` — 應用程式進入點，包裹 AuthProvider 與 Toaster
- `src/contexts/AuthContext.tsx` — 認證 context：提供 user、isAuthenticated、signin/signup/signout，token 存於 localStorage
- `src/components/AuthButton.tsx` — 登入/註冊 Dialog、已登入狀態顯示、分數歷史 Dialog、登出
- `src/lib/api.ts` — API 客戶端，自動附加 Authorization header
- `server/index.ts` — Express 伺服器設定與路由掛載
- `server/db.ts` — SQLite 初始化與 schema（users、game_scores）
- `server/middleware/auth.ts` — JWT 驗證 middleware
- `server/routes/auth.ts` — 認證路由
- `server/routes/scores.ts` — 分數路由

### 資料庫 Schema

- **users**：id, username (UNIQUE), password_hash, created_at
- **game_scores**：id, user_id (FK→users), score, treasure_found, played_at
