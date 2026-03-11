---
description: 一鍵部署本專案到 GitHub Pages，完成後顯示網址
---

部署本專案到 GitHub Pages。

請依照以下步驟執行：

1. 確認目前 git remote 是否已設定，取得 repository 名稱（格式為 `owner/repo`）。若未設定 remote，請詢問使用者 GitHub repository URL。

2. 從 remote URL 解析出 repo 名稱（例如 `repo`），用於設定 Vite 的 base path。

3. 暫時將 `vite.config.ts` 的 `build` 區段加入 `base: '/<repo>/'`（若已存在則更新）。

4. 執行 `npm run build` 建置專案。

5. 使用 `gh-pages` 部署：
   - 檢查是否已安裝 `gh-pages`，若未安裝則執行 `npx gh-pages -d build`
   - 將 `build/` 目錄的內容推送到 `gh-pages` 分支

6. 部署完成後，還原 `vite.config.ts` 中對 `base` 的修改（保持原始設定不被污染）。

7. 確認 GitHub Pages 設定是否正確（使用 `gh api` 檢查並設定 Pages source 為 gh-pages 分支）。

8. 最後顯示部署完成的網址：`https://<owner>.github.io/<repo>/`
