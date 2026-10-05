# YT Dot-Bypass

貼上 YouTube 網址，自動在 `.com` 後面加一個點（`youtube.com.`），複製或直接開新分頁使用。
同學間使用的小工具，介面是 360×480 的擴充功能彈出視窗樣式。

- 線上版：https://louis996vtec666.github.io/yt-dot-bypass/
- 原始設計：[Figma](https://www.figma.com/design/sN92wCFTn1wDdcg4XqDCcf/youtube-ad-by-passer)（由 Figma Make 匯出）

## 功能

- **網址轉換**：貼上網址即時轉換，可複製或開新分頁。
- **歷史紀錄**：最多 50 筆，存在使用者自己的瀏覽器（`localStorage`）。每個人各自一份，換瀏覽器或清除資料就會消失。
- **設定記憶**：主題（深色／淺色）、logo、自動套用開關，重新整理後保留。
- **Feedback**：使用者送出的意見會寫進你的 Google Sheet。

## 開發

需要 Node.js 與 [pnpm](https://pnpm.io)。

```bash
pnpm install     # 安裝套件（只需做一次）
pnpm dev         # 開發伺服器，網址 http://localhost:5173
pnpm build       # 打包到 dist/
pnpm storybook   # 元件展示間，網址 http://localhost:6006
```

第一次執行 `pnpm install` 若出現 `Ignored build scripts` 的提示，執行 `pnpm approve-builds --all` 後再試一次。

## 設定 Feedback 後台

Feedback 會送到 Google Apps Script，再寫入 Google Sheet。完整步驟見
[docs/feedback-apps-script.md](docs/feedback-apps-script.md)。

設定好後，複製 `.env.example` 為 `.env`，填入網址：

```
VITE_FEEDBACK_URL=https://script.google.com/macros/s/xxxxxxxx/exec
```

改 `.env` 後要重啟 `pnpm dev`。`.env` 已被 `.gitignore` 忽略，不會進版本控制。
沒有設定時，按 Send 會顯示「Couldn't send」，其他功能不受影響。

## 部署

推送到 `main` 分支會觸發 GitHub Actions（[.github/workflows/deploy.yml](.github/workflows/deploy.yml)），
自動建置並發佈到 GitHub Pages，約一分鐘後生效。

建置時的 `VITE_FEEDBACK_URL` 來自 GitHub repo 的 Secret（Settings → Secrets and variables → Actions）。
如果更換了 Apps Script 網址，要同步更新這個 Secret，並重新執行部署（Actions 頁面按 Re-run，或再推送一次）。

## 專案結構

```
src/app/
  App.tsx              主畫面與狀態
  storage.ts           所有 localStorage 讀寫都在這裡（之後換資料庫只改這個檔案）
  feedback.ts          Feedback 傳送（之後換後台只改這個檔案）
  components/          UI 元件，旁邊的 *.stories.tsx 是 Storybook 展示
  context/ThemeContext.tsx   深色／淺色主題
.storybook/            Storybook 設定
docs/                  後台設定說明
```

## Storybook

`pnpm storybook` 可以單獨檢視每個元件的各種狀態（空資料、載入中、錯誤、成功等）。
stories 全部使用假資料，不會讀寫 `localStorage`，也不會真的送出 Feedback。
Storybook 只用於開發，不會出現在線上版。
