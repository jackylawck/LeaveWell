# 留愛心安 · LeaveWell

> **留愛於生，遇事心安。**  
> *Anchored in Love, Leave Well for Kin.*

[繁體中文](#繁體中文) | [English](#english)

---

## 繁體中文

**留愛心安 (LeaveWell)** 是一個純本地端、零後端伺服器（Zero-Knowledge / Offline-First）的家庭應急資產導航保險庫。

面對至親突發變故，家屬最需要的不是繁複的財務報表，而是**「即時的保險索償導航」**與**「關鍵數碼存取權限」**。本工具透過三層漸進式架構，兼顧家人的免密急救可用性與金融級防釣魚、防外洩密碼學安全。

### 🌟 核心特色

- **零依賴與純離線 (Zero-Dependency & Offline-First)**：無引入任何外部 NPM 套件或遠端 CDN，直接使用瀏覽器原生 Web Crypto API，支援離線 `file://` 雙擊即開。
- **三層存取架構 (3-Tier Progressive Access)**：
  1. **第一層：公開急救層 (Public Triage)**：官方保險索償熱線與 App 查核渠道，免密碼即開即閱。
  2. **第二層：個人顧問層 (Personal Index)**：專屬經紀電話與保單存放位置，採用 **Ed25519 數位簽名** 與 **TOFU 信任錨 (SHA-256 64-bit 指紋)** 保護，防止釣魚置換電話。
  3. **第三層：數碼金庫層 (Digital Vault)**：手機解鎖 PIN、主 Email 存取提示等核心憑證，採用 **AES-GCM-256 + 雙重 AAD 信封加密 (PBKDF2 600,000 次疊代)**。
- **雙重解鎖路徑 (Dual-KEK Recovery)**：同時支援約定家庭密語或 52 碼紙本緊急恢復碼（Crockford Base32），避免單點遺忘死鎖。
- **零明文留存 (Zero-Plaintext Residual)**：本機儲存不留存任何明文，關閉標籤頁自動清除記憶體；內置 180 秒會話超時與連續錯誤 15 分鐘指數鎖定。

---

### 🛡️ 威脅模型與安全邊界聲明 (Threat Model & Security Boundary)

| 場景 / 攻擊面 | 防禦狀態 | 防護機制與說明 |
| :--- | :---: | :--- |
| **隨身碟遺失 / 他人窺探** | ✅ 完全防禦 | 第三層使用 AES-GCM-256 加密，未經密語或恢復碼在數學上無法破解。 |
| **經紀電話竄改 / 精準釣魚** | ✅ 完全防禦 | 第二層由持有人私鑰簽名，JSON 一旦被改動，驗簽即刻報警並強制隱藏資料。 |
| **離線暴力破解密語** | ✅ 高度防禦 | PBKDF2-SHA256 600,000 次疊代，搭配 15 分鐘錯誤鎖定機制。 |
| **執行檔/前端被替換 (XSS)** | ⚠️ 邊界限制 | 純前端無法防禦 HTML 本體被惡意置換，建議將檔案備份於防寫唯讀媒介。 |
| **實體紙本恢復碼洩漏** | ⚠️ 邊界限制 | 紙本恢復碼等同於主金鑰，嚴禁拍照或數碼傳輸，須如房契印鑑般鎖於保險箱。 |

---

### 🚀 快速使用指引

#### 1. 建立與備份 (日常維護)
1. 使用瀏覽器開啟 [LeaveWell 頁面](https://jackylawck.github.io/LeaveWell/) 或本地 `index.html`。
2. 點擊右下方 **「⚙️ 建立／編輯／簽署保險庫」**。
3. 點擊 **「🔑 產生新 Ed25519 金鑰對」**，妥善保存私鑰（私鑰僅暫存於本地記憶體）。
4. 選擇香港主流保險公司或自填，新增保單項目、經紀電話及文件存放處。
5. 填寫第三層機密（手機 PIN、主 Email）並設定家庭密語。
6. 將畫面產生的 **52 碼紙本恢復碼 (RC-...)** 抄寫於實體紙本，勾選確認。
7. 點擊 **「✍️ 簽署並匯出完整 JSON」**，下載產出的備份檔。

#### 2. 身後應急檢視 (家人使用)
1. 開啟 `index.html`，點擊 **「📥 匯入 JSON 檔案」**。
2. 首次匯入時，核對彈出的 **SHA-256 公鑰指紋** 是否與「紙本應急小卡」一致，確認後自動建立本機信任錨。
3. 頂部即時顯示保險公司官方熱線及專屬顧問電話。
4. 如需取得手機解鎖 PIN 或登入 Email 查單，於第三層輸入家庭密語或紙本恢復碼解鎖。

---

### 📄 紙本應急小卡製作建議

建議將下列資訊抄寫或列印於 A4 四分之一折疊卡片，與備份隨身碟一同存放於保險箱：

```text
┌───────────────────────────────────────────────────────────────────┐
│                     🛡️ 留愛心安 · LeaveWell                        │
│                   家庭緊急應急資產導航卡 (存根)                     │
├───────────────────────────────────────────────────────────────────┤
│ 1. 工具檔案位置：客廳專用隨身碟 LeaveWell 目錄                     │
│ 2. 簽署公鑰指紋：[ ____-____-____-____ ] (64-bit SHA-256)        │
│ 3. 紙本緊急恢復碼：RC-[ ____________________________________ ]    │
│                                                                   │
│ 【提示】此卡等同於印鑑，嚴禁拍照上傳；遇事優先致電第一層官方熱線。│
└───────────────────────────────────────────────────────────────────┘

```

---

## English

**LeaveWell (留愛心安)** is a zero-knowledge, offline-first personal emergency vault designed to assist family members in locating vital insurance policies and recovering essential digital credentials during sudden life events.

### 🌟 Key Highlights

* **Zero-Dependency & Offline-First**: Built with vanilla HTML/CSS/JavaScript and the Web Crypto API. Works completely offline via `file://`.
* **3-Tier Progressive Disclosure**:
1. **Tier 1 (Public Triage)**: Official insurer hotline directory (password-free, verifiable).
2. **Tier 2 (Personal Index)**: Personal advisor details and physical contract locations protected by **Ed25519 digital signature** and **TOFU trust anchoring (SHA-256 64-bit fingerprint)** to prevent fraud.
3. **Tier 3 (Digital Vault)**: Device PINs, primary email clues, and legacy access directives encrypted via **AES-GCM-256 with Dual AAD** (PBKDF2 600,000 iterations).


* **Dual-KEK Recovery Mechanism**: Supports decryption via either master family passphrase or a 52-character paper Emergency Recovery Code (Crockford Base32).
* **Zero Plaintext Persistence**: Plaintext is never stored in `localStorage`. Features automatic memory wiping, 180-second session lock, and exponential backoff lockout after 5 failed attempts.

---

### 🛡️ Threat Model & Security Boundaries

| Scenario / Attack Vector | Protection Level | Defense Mechanism |
| --- | --- | --- |
| **Lost USB / Physical Sniffing** | ✅ Fully Protected | Tier 3 ciphertext is mathematically infeasible to crack without passphrase or recovery code. |
| **Advisor Contact Spoofing** | ✅ Fully Protected | Signed via Ed25519; any payload tampering triggers immediate visual isolation and warnings. |
| **Offline Brute Force** | ✅ Strong Defense | PBKDF2-SHA256 with 600,000 iterations and progressive lockouts. |
| **HTML Source Tampering (XSS)** | ⚠️ Boundary Limit | Pure client-side code cannot prevent binary replacement of HTML itself. Use read-only media. |
| **Physical Paper Code Compromise** | ⚠️ Boundary Limit | The paper recovery code equals master access. Must be kept physically secured in a lockbox. |

---

### 🚀 Usage Guide

1. **Deploy/Run**: Open `index.html` in any modern web browser or visit [GitHub Pages](https://www.google.com/url?sa=E&source=gmail&q=https://jackylawck.github.io/LeaveWell/).
2. **Editor**: Click **"⚙️ Create / Edit / Sign Vault"** to generate keys, input policies, and set up your passphrase.
3. **Recovery Card**: Accurately transcribe the generated **Emergency Recovery Code** onto physical paper.
4. **Export**: Sign and export the `.json` vault. Distribute the file alongside the offline HTML package.

---

## 📜 License

Distributed under the [MIT License](https://www.google.com/search?q=LICENSE).
