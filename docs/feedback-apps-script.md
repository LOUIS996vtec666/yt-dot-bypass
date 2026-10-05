# Feedback 後台設定（Google Sheet + Apps Script）

使用者在 app 送出的 feedback 會 POST 到一個 Google Apps Script 網頁應用程式，
由它在 Google Sheet 新增一列。你只要打開試算表就能看到所有回饋。

## 1. 建立試算表

1. 到 Google Sheets 建立新試算表，命名例如「YT Dot-Bypass Feedback」。
2. 第一列填入標題（A、B、C 欄）：`timestamp`、`version`、`message`。

## 2. 加入 Apps Script

1. 在試算表選單點「擴充功能」→「Apps Script」。
2. 刪掉預設程式碼，貼上：

```js
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var message = String(data.message || "").slice(0, 2000);
    if (!message) {
      return ContentService.createTextOutput("empty");
    }
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    // Prefix an apostrophe so the cell is stored as text, never as a formula.
    if (/^[=+\-@]/.test(message)) message = "'" + message;
    sheet.appendRow([
      String(data.timestamp || new Date().toISOString()),
      String(data.version || ""),
      message,
    ]);
    return ContentService.createTextOutput("ok");
  } catch (err) {
    return ContentService.createTextOutput("error");
  }
}
```

3. 按「儲存」。

## 3. 部署

1. 右上角「部署」→「新增部署作業」。
2. 類型選「網頁應用程式」。
3. 「執行身分」選「我」，「誰可以存取」選「所有人」。
4. 按「部署」，第一次會要求授權（用你自己的 Google 帳號同意）。
5. 複製「網頁應用程式網址」（`https://script.google.com/macros/s/.../exec`）。

之後如果修改了 Apps Script 程式碼，要再「管理部署作業」→ 編輯 → 新版本，網址才會生效。

## 4. 設定 app

在專案根目錄複製 `.env.example` 為 `.env`，填入網址：

```
VITE_FEEDBACK_URL=https://script.google.com/macros/s/xxxxxxxx/exec
```

重新啟動 `pnpm dev`（改 `.env` 需要重啟）。`.env` 已被 `.gitignore` 忽略，不會進版本控制。

## 注意事項

- 網址一旦公開（例如打包成 Chrome 擴充功能發佈），任何人都能對它送資料。
  腳本已限制長度並避免試算表公式注入，但無法防止有人灌垃圾訊息。
- 因為瀏覽器的 CORS 限制，app 用 `no-cors` 送出，**無法得知腳本是否真的寫入成功**，
  只能偵測到網路失敗。部署後請自己送一筆測試，確認試算表有出現。
- 回饋內容只包含：訊息文字、時間、app 版本號，沒有任何個人資料。
