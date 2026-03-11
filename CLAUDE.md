# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

互動式寶箱遊戲。玩家點擊三個寶箱尋找隱藏的寶藏（+$100），其餘藏有骷髏（-$50）。找到寶藏或所有寶箱皆被打開時遊戲結束。支援使用者註冊/登入，登入後自動儲存遊戲分數並可查看歷史紀錄。

## 常用指令

- `npm install` — 安裝依賴套件
- `npm run dev` — 啟動 Vite 前端開發伺服器
- `npm run build` — 正式環境建置，輸出至 `build/`

目前未設定測試框架或 linter。

## 架構

### 前端

- **建置工具**：Vite + React SWC plugin
- **前端框架**：React 18 + TypeScript
- **樣式**：Tailwind CSS v4（預編譯，內嵌於 `src/index.css`）— 部分 Tailwind CSS 變數/class 可能缺失，新增 UI 時優先使用 inline style
- **動畫**：Motion（framer-motion），用於寶箱開啟與 hover 動畫
- **UI 元件**：shadcn/ui 元件位於 `src/components/ui/`（基於 Radix UI + Tailwind）
- **路徑別名**：`@` → `./src`（設定於 `vite.config.ts`）

### 認證與資料儲存（localStorage）

- `src/lib/api.ts` — 所有資料操作皆透過 localStorage，密碼使用 Web Crypto API SHA-256 雜湊
  - localStorage key `users`：使用者陣列 `[{ username, passwordHash }]`
  - localStorage key `game_scores`：分數陣列 `[{ username, score, treasureFound, playedAt }]`
  - localStorage key `current_user`：當前登入的 username 字串
- `src/contexts/AuthContext.tsx` — 認證 context，從 `current_user` 讀取登入狀態

### 重要檔案

- `src/App.tsx` — 遊戲核心邏輯：狀態管理（boxes、score、gameEnded）、隨機寶藏配置、點擊處理、音效播放、分數儲存、完整 UI 渲染
- `src/main.tsx` — 應用程式進入點，包裹 AuthProvider 與 Toaster
- `src/contexts/AuthContext.tsx` — 認證 context：提供 user、isAuthenticated、signin/signup/signout
- `src/components/AuthButton.tsx` — 登入/註冊 Dialog、已登入狀態顯示、分數歷史 Dialog、登出
- `src/lib/api.ts` — localStorage 資料層（signup、signin、saveGameScore、getScores）

## 部署

GitHub Pages 部署使用自訂指令 `/deploy_github_pages`，會自動設定 `base: '/<repo>/'` 建置後推送至 `gh-pages` 分支，部署完成後還原 vite.config.ts。

部署網址：`https://trleee.github.io/claude_code_treasure_game-initial/`
