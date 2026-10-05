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
// 防灌水設定
var MAX_MESSAGE_LENGTH = 2000; // 單則訊息最大長度
var MAX_PER_HOUR = 30;         // 每小時最多寫入幾筆（所有人合計）
var DUPLICATE_WINDOW_SEC = 600; // 相同內容在這段時間內只收一次
var MAX_ROWS = 5000;           // 試算表總列數上限

function doPost(e) {
  // 同一時間只處理一個請求，避免計數互相覆蓋
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return reply("busy");
  try {
    var data = JSON.parse(e.postData.contents);
    var message = String(data.message || "").trim().slice(0, MAX_MESSAGE_LENGTH);
    if (!message) return reply("empty");

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() >= MAX_ROWS) return reply("full");

    var cache = CacheService.getScriptCache();

    // 相同內容短時間內不重複收
    var digest = Utilities.base64Encode(
      Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, message)
    );
    if (cache.get("dup:" + digest)) return reply("duplicate");

    // 每小時總量限制
    var hourKey = "count:" + Math.floor(Date.now() / 3600000);
    var count = Number(cache.get(hourKey) || 0);
    if (count >= MAX_PER_HOUR) return reply("rate-limited");

    cache.put("dup:" + digest, "1", DUPLICATE_WINDOW_SEC);
    cache.put(hourKey, String(count + 1), 3600);

    // 開頭是 = + - @ 時加上單引號，避免被當成試算表公式
    if (/^[=+\-@]/.test(message)) message = "'" + message;

    sheet.appendRow([
      String(data.timestamp || new Date().toISOString()),
      String(data.version || ""),
      message,
    ]);
    return reply("ok");
  } catch (err) {
    return reply("error");
  } finally {
    lock.releaseLock();
  }
}

function reply(text) {
  return ContentService.createTextOutput(text);
}
```

3. 按「儲存」。

## 3. 部署

1. 右上角「部署」→「新增部署作業」。
2. 類型選「網頁應用程式」。
3. 「執行身分」選「我」，「誰可以存取」選「所有人」。
4. 按「部署」，第一次會要求授權（用你自己的 Google 帳號同意）。
5. 複製「網頁應用程式網址」（`https://script.google.com/macros/s/.../exec`）。

**之後修改了 Apps Script 程式碼**：要到「部署」→「管理部署作業」→ 鉛筆圖示 → 版本選「新版本」→ 部署。
網址不會變，但不做這步，線上跑的還是舊程式。

## 4. 設定 app

在專案根目錄複製 `.env.example` 為 `.env`，填入網址：

```
VITE_FEEDBACK_URL=https://script.google.com/macros/s/xxxxxxxx/exec
```

重新啟動 `pnpm dev`（改 `.env` 需要重啟）。`.env` 已被 `.gitignore` 忽略，不會進版本控制。

線上版的網址放在 GitHub repo 的 Secret `VITE_FEEDBACK_URL`，更新後要重新部署才會生效（見 README）。

## 防灌水機制說明

網址一旦公開，任何人都能對它送資料。Apps Script 看不到對方的 IP 或身分，所以無法針對個人限制，
只能做「整體」的限制，預設值如下，可在程式碼最上方調整：

| 機制 | 預設 | 效果 |
|---|---|---|
| 單則長度上限 | 2000 字 | 超過的部分直接截掉 |
| 重複內容 | 10 分鐘內只收一次 | 擋掉重複送同一句話 |
| 每小時總量 | 30 筆（所有人合計） | 被灌時最多一小時寫入 30 筆 |
| 試算表總列數 | 5000 列 | 滿了就停止寫入 |

**這個設計的取捨**：每小時上限是所有人共用的。如果有人惡意灌滿 30 筆，正常使用者在那一小時也送不進去。
對同學間的小工具，這比被灌爆整份試算表好；但如果你的同學很多、回饋量大，可以調高 `MAX_PER_HOUR`。

## 注意事項

- 因為瀏覽器的 CORS 限制，app 用 `no-cors` 送出，**無法得知腳本是否真的寫入成功**，
  只能偵測到網路失敗。被防灌水擋掉時，使用者仍會看到「送出成功」的畫面，但試算表不會新增那一列。
- 回饋內容只包含：訊息文字、時間、app 版本號，沒有任何個人資料。
- 從 Windows 終端機用 `curl` 測試中文時，編碼可能不是 UTF-8 而變成亂碼，請直接用 app 測試。
