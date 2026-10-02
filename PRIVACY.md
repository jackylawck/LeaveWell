# 隱私政策與安全聲明 / Privacy Policy & Security Disclaimer

> **最新生效日期 / Effective Date**: 2026-10-02  
> **專案版本 / Release Version**: v4.1 (Two-Tier Deterministic Clue Vault)

[繁體中文](#繁體中文) | [English](#english)

---

## 繁體中文

### 一、 核心隱私承諾：零伺服器與零資料收集 (Zero-Knowledge Architecture)
1. **無資料傳輸 (Zero Network Transmission)**：
   本系統具備嚴格的內容安全策略（Content Security Policy），設定為 `connect-src 'none'`。在任何情況下，系統皆不會向任何伺服器發送網路請求。
2. **無遙測與分析 (No Analytics & Tracking)**：
   本專案不包含 Google Analytics、Facebook Pixel、Sentry 或任何第三方追蹤／分析代碼。
3. **無明文落地 (Zero-Plaintext Persistence)**：
   使用者的密語、保單敏感編號、顧問電話及手機 PIN 僅在解密後的瀏覽器運行時記憶體中存在，永不以明文形式寫入硬碟或 `localStorage`。

---

### 二、 使用者自主權與責任宣告 (User Autonomy & Responsibilities)
1. **密語管理責任**：
   本系統採用零知識密碼學模型，開發者在數學上及架構上均無法提供「密碼重設」或「遠端找回」服務。使用者須自行保管實體提示卡或約定密語。
2. **實體安全責任**：
   本工具能防禦隨身碟遺失後的密碼學攻擊，但無法抵禦實體紙本卡片遭他人翻閱或近端螢幕側錄。使用者應將提示卡放置於合適的實體保險設施中。

---

### 三、 法律免責聲明 (Legal Disclaimer)
- 本軟體按「現狀」（AS IS）形式依 MIT 授權條款釋出，不提供任何形式的明示或暗示擔保。
- 軟體內所列之保險公司分類僅供家庭應急導航使用。開發者不承擔因使用者遺忘密語、硬體損毀、或保險機構作業變更所引致的任何直接或間接法律與財務責任。

---

## English

### 1. Zero-Knowledge Privacy Architecture
1. **Zero Network Transmission**:
   Protected by a strict Content Security Policy (`connect-src 'none'`), LeaveWell generates zero network traffic. All operations are performed exclusively within the local browser environment.
2. **Zero Telemetry & Third-Party Scripts**:
   No tracking cookies, web beacons, telemetry, or analytics suites are embedded.
3. **Zero Plaintext Residuals**:
   Decrypted credentials and personal policies reside transiently within volatile memory and are never serialized in plaintext to disk or local browser storage.

---

### 2. User Autonomy & Responsibilities
1. **Passphrase Sovereignty**:
   Under the zero-knowledge mathematical framework, developers maintain zero backdoor or key escrow capability. Lost passphrases cannot be recovered remotely.
2. **Physical Vector Protection**:
   Users remain responsible for physical security measures, including safeguarding memory clue cards in locked home safes.

---

### 3. Legal Disclaimer
- This software is distributed under the MIT License on an "AS IS" basis, without warranties of any kind, either express or implied.
- In no event shall the authors or copyright holders be liable for any claim, damages, or other liability arising from loss of passphrases, local storage corruption, or insurance claim delays.
