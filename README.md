# 留愛心安 · LeaveWell

> **留愛於生，遇事心安。**  
> *Anchored in Love, Leave Well for Kin.*

[繁體中文](#繁體中文) | [English](#english)

---

## 繁體中文

**留愛心安 (LeaveWell)** 是一個純本地端、零後端伺服器（Zero-Knowledge / Offline-First）的家庭應急資產導航金庫。

面對至親突發變故，家屬最需要的不是繁複的財務報表，而是**「即時的保險索償導航」**與**「關鍵數碼存取權限」**。本工具採用符合人性的**「雙層漸進式架構」**，在生時嚴守個人數碼隱私，身後給予家人最即時、零門檻的理賠指引。

### 🌟 核心特色

- **零依賴與純離線 (Zero-Dependency & Offline-First)**：無引入任何外部 NPM 套件或遠端 CDN，直接使用瀏覽器原生 Web Crypto API，支援離線 `file://` 雙擊即開。
- **雙層漸進存取架構 (Two-Tier Progressive Access)**：
  1. **🟢 第一層：公開名冊（免密碼・一開即睇）**：自動列出生前持有的保險公司名冊與險種分類。家人無需密碼即可致電官方索償部，報出死者英文全名及身份證號碼核查保單，免除「不知買過哪間保險」的慌亂。
  2. **🔴 第二層：機密金庫（單一家庭密語）**：涵蓋專屬經紀電話、保單編號、實體合約位置、手機 PIN 及主電郵線索。採用 **AES-GCM-256 + PBKDF2 (600,000 次疊代)** 工業標準加密。
- **人性化實體提示卡 (Memory Clue Card)**：徹底拋棄反人性的 52 碼隨機亂碼，改用「保險箱記憶線索卡」。卡片只記錄家庭共同記憶拼圖提示，即便外人撿到也無法破解，家人一睇秒懂。
- **本地免密快取 (Instant Local Cache)**：本機完成設定或匯入後，加密檔案自動快取於本地瀏覽器。日後家人打開死者手機或常用電腦，**免找檔案、免匯入，第一層保險名冊即刻呈現在眼前**。
- **PWA 行動裝置體驗**：支援 Progressive Web App，可一鍵「加入主畫面」離線使用，兼具原生 App 般的操作體驗與零伺服器安全保障。
- **密語解密反填編輯 (Load & Edit)**：日後增減保單或修改資料時，直接載入舊檔並輸入密語，所有公開與機密資料自動解密反填至編輯器，隨時修改並重新打包。
- **動態記憶體防禦 (Memory Safety)**：本機無明文留存，關閉視窗即時抹除金鑰記憶體；內置 180 秒會話超時鎖定與連續 5 次錯誤強制鎖定 15 分鐘機制。

---

### 🛡️ 威脅模型與安全邊界聲明 (Threat Model & Security Boundary)

| 場景 / 攻擊面 | 防禦狀態 | 防護機制與說明 |
| :--- | :---: | :--- |
| **隨身碟遺失 / 他人窺探** | ✅ 完全防禦 | 核心金庫使用 AES-GCM-256 強加密，未經家庭密語在數學上無法破解。 |
| **生前借用手機 / 隱私外洩** | ✅ 完全防禦 | 即使他人打開網頁，第二層經紀電話、保單號碼與手機 PIN 依然處於加密狀態，無法查閱。 |
| **提示卡遭外人偷看** | ✅ 完全防禦 | 卡片僅記錄記憶拼圖（如：仔仔出生年+紀念日），無密碼明文，外人不知家庭隱私無法拼湊。 |
| **離線暴力破解密語** | ✅ 高度防禦 | PBKDF2-SHA256 600,000 次疊代，搭配錯誤鎖定防護，抵禦離線字典攻擊。 |
| **執行檔/前端被替換 (XSS)** | ⚠️ 邊界限制 | 純前端架構無法防禦 HTML 本體被惡意置換，建議將檔案備份於防寫唯讀隨身碟。 |

---

### 🏛️ 全球法規治理與國際資安標準對齊 (Governance & Standards)

本專案依循嚴謹的資訊治理原則，對全球相關法規之適用性與標準映射界定如下：

- **EU AI Act / 國家網信辦 / ISO 42001 (AIMS) — 明確排除**：本專案為純確定性（Deterministic）密碼學工具，不含任何機器學習模型或自動化決策系統，**依法不適用 (Out of Scope)**。
- **歐盟 GDPR (Art. 2(2)(c)) & 香港 PDPO (第 52 條) — 家用豁免**：純粹用於個人及家庭事務，系統無伺服器、無遙測收集，開發者非資料控制者。
- **ISO/IEC 27001:2022 & ISO/IEC 27701:2019 控制項對齊**：落實 A.8.24 密碼學標準、A.8.10 記憶體資訊即時清除，以及 Privacy by Design 零外部連線架構 (`connect-src 'none'`)。
- 詳細合規分析請參閱 [GOVERNANCE.md](GOVERNANCE.md) 與 [PRIVACY.md](PRIVACY.md)。

---

### 🚀 快速使用指引

#### 1. 建立保險庫 (自己操作)
1. 使用瀏覽器開啟 [LeaveWell 頁面](https://jackylawck.github.io/LeaveWell/) 或雙擊本地 `index.html`。
2. 點擊右下方 **「⚙️ 建立／修改保險庫」**。
3. 選擇保險公司與險種，填寫顧問電話、保單號碼及合約位置（保險公司名自動納入第一層公開名冊）。
4. 填寫第二層機密（手機 PIN、主 Email），設定家庭密語（建議 ≥ 12 字元）。
5. 填寫給家人的**「實體卡提示線索」**（例如：仔仔出生年份 + 媽媽英文名 + 結婚紀念日）。
6. 點擊 **「💾 加密並匯出完整 JSON」**，下載備份檔並同步寫入本機安全快取。
7. 將記憶線索抄寫在實體小卡上，鎖入家中保險箱。

#### 2. 身後應急查閱 (家人操作)
- **情境 A（使用死者手機/常用電腦）**：直接打開 LeaveWell，**第一層保險公司名冊已自動顯示**。
- **情境 B（使用新裝置/USB 開啟）**：點擊 **「📥 匯入 JSON 檔案」** 載入備份檔，第一層名冊即刻顯示。
- **解鎖詳細資料**：如需聯絡經紀或解鎖手機，從保險箱取出實體小卡，依照提示拼出密語於第二層解鎖。

#### 3. 日後修改與年檢
- 點擊 **「⚙️ 建立／修改保險庫」** ➔ 點擊 **「📂 載入舊檔編輯」**（或直接同意解密本機快取）。
- 輸入原有的家庭密語，舊資料自動反填至編輯器。
- 修改完成後，設定密語重新匯出最新 JSON 檔替換舊備份。

---

### 📄 紙本應急小卡製作建議（放入保險箱）

建議將下列資訊抄寫或列印於 A4 四分之一折疊卡片，與備份隨身碟一同存放於家中實體保險箱：

```text
┌───────────────────────────────────────────────────────────────────┐
│                     🛡️ 留愛心安 · LeaveWell                        │
│                   家庭緊急應急資產導航卡 (存根)                      │
├───────────────────────────────────────────────────────────────────┤
│ 1. 檔案位置：客廳專用隨身碟 / 死者常用電腦瀏覽器                      │
│                                                                   │
│ 2. 第一步（免密碼即開）：                                            │
│    打開網頁，頂部綠色區已列出生前所有保險公司。                       │
│    直接致電官方索償部，報出死者英文全名及身份證號碼即可查單。          │
│                                                                   │
│ 3. 第二步（解鎖經紀電話及手機 PIN）：                                │
│    在紅色金庫區輸入約定密語。                                       │
│                                                                   │
│ 💡【家庭密語線索提示】：                                             │
│    [ 仔仔出生年份(4位) + 媽媽英文名小寫 + 我們結婚紀念日(4位) ]      │
│    （例：2020mary0520）                                           │
└───────────────────────────────────────────────────────────────────┘

```

---

## English

**LeaveWell (留愛心安)** is a zero-knowledge, offline-first personal emergency vault designed to assist family members in locating insurance policies and vital digital credentials during sudden life events.

### 🌟 Key Highlights

* **Zero-Dependency & Offline-First**: Pure vanilla HTML/CSS/JavaScript using the native Web Crypto API. Runs offline via `file://`.
* **Two-Tier Progressive Disclosure**:
1. **🟢 Tier 1: Public Insurance Directory (Password-Free)**: Displays all held insurers and policy types. Family members can initiate claim verification immediately by calling the insurer and providing the insured's full legal name and HKID.
2. **🔴 Tier 2: Confidential Emergency Vault (Passphrase Required)**: Protects advisor contacts, policy numbers, document locations, device PINs, and primary email credentials via **AES-GCM-256** (PBKDF2 600,000 iterations).


* **Human-Centric Memory Clue Card**: Replaces awkward, error-prone 52-char random codes with a physical clue card stored in a home safe. The card only contains memory puzzle hints that only family members can decipher.
* **Instant Local Cache**: Once configured, the vault is securely cached in local storage. Family members opening the app on the deceased's personal device will see the Tier 1 directory immediately without having to locate backup files.
* **Progressive Web App (PWA)**: Installable directly to home screens on iOS, Android, and desktop for an app-like offline experience.
* **Load & Edit Workflow**: Easily update records by loading the existing JSON and entering the passphrase. Data is decrypted and autofilled into the editor for seamless updates.
* **In-Memory Protection**: Zero plaintext persisted to disk. Features 180-second session auto-lock and exponential lockout after 5 consecutive failed attempts.

---

### 🛡️ Threat Model & Security Boundaries

| Scenario / Attack Vector | Protection Level | Defense Mechanism |
| --- | --- | --- |
| **Lost USB / Physical Sniffing** | ✅ Fully Protected | Tier 2 ciphertext is mathematically infeasible to decrypt without the passphrase. |
| **Borrowing Device While Alive** | ✅ Fully Protected | Sensitive PINs and notes remain encrypted; only generic insurer names are visible without unlocking. |
| **Clue Card Interception** | ✅ Fully Protected | The card contains puzzle clues rather than the plaintext password. Meaningless to third parties. |
| **Offline Brute Force** | ✅ Strong Defense | PBKDF2-SHA256 with 600,000 iterations protects against offline dictionary attacks. |
| **HTML Source Tampering (XSS)** | ⚠️ Boundary Limit | Client-side code cannot prevent binary replacement of the HTML file itself. Store on write-protected media. |

---

### 🏛️ Global Governance & Compliance Alignment

* **EU AI Act / CAC Algorithm Regulations / ISO 42001 (AIMS)**: **Explicitly Out of Scope**. LeaveWell is a deterministic, rule-based cryptographic tool without machine learning or automated decision-making.
* **GDPR (Art. 2(2)(c)) & HK PDPO (Section 52)**: Covered under the **Household Exemption**. The developer operates zero backends, collects zero telemetry, and is not a Data Controller.
* **ISO/IEC 27001 & ISO/IEC 27701 Mapping**: Adheres to A.8.24 (Cryptography), A.8.10 (Information Deletion), and strict Privacy-by-Design (`connect-src 'none'`).
* See [GOVERNANCE.md](GOVERNANCE.md) and [PRIVACY.md](PRIVACY.md) for full compliance disclosures.

---

### 🚀 Usage Guide

1. **Create / Edit**: Open `index.html` or visit [GitHub Pages](https://jackylawck.github.io/LeaveWell/). Click **"⚙️ Create / Edit Vault"**.
2. **Add Policies**: Enter insurance providers (automatically indexed in Tier 1) and advisor/credential details.
3. **Set Passphrase & Clue**: Set a family passphrase (≥ 12 chars), input the memory clue for your family, and click **"💾 Encrypt & Export Full JSON"**.
4. **Physical Safe Card**: Transcribe the clue hint onto a paper card and store it in your safe box.
5. **Maintenance**: Click **"📂 Load Existing File"** anytime, enter your passphrase to edit existing records, and re-export the updated vault.

---

## ⚖️ Governance, Privacy & Legal Boundaries

* [GOVERNANCE.md](GOVERNANCE.md): 治理架構、ISO 27001/27701 控制項映射及 EU AI Act 負向排除聲明。
* [PRIVACY.md](PRIVACY.md): 零知識架構隱私政策與免責聲明。
* [LICENSE](https://github.com/jackylawck/LeaveWell/blob/main/LICENSE): MIT 開源授權條款。

---

## 📜 License

Distributed under the [MIT License](https://github.com/jackylawck/LeaveWell/blob/main/LICENSE).



