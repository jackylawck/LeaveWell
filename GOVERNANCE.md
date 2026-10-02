# 治理與法規合規架構說明 / Governance & Regulatory Compliance Statement

> **專案定位 / System Taxonomy**: 純本地端確定性加密應急保險庫 (Deterministic Client-Side Emergency Vault)  
> **發布模式 / Distribution Model**: 零知識靜態開源架構 (Zero-Knowledge Static Open-Source Software)

[繁體中文](#繁體中文) | [English](#english)

---

## 繁體中文

### 一、 適用範圍與負向法規排除聲明 (Negative Scope Exclusion)
本專案堅持誠實與嚴謹的治理原則，對全球相關法規之適用性界定如下：

1. **AI 相關規範（歐盟 EU AI Act、國家網信辦演算法規定、ISO/IEC 42001 AIMS）— 明確排除**：
   - **判定**：**不適用 (Out of Scope)**。
   - **依據**：本系統為完全確定性（Deterministic）的靜態純前端工具，代碼邏輯均由硬編碼流程與 W3C Web Crypto API 標準密碼學函式組成，**不包含任何機器學習模型、神經網絡、LLM 生成式推論或自動化決策系統（ADM）**。因此，本專案依法豁免於 AI 相關監管要求與高風險評估義務。

2. **歐盟 GDPR 與香港私隱條例 (Cap. 486 PDPO) — 家用豁免與零傳輸**：
   - **判定**：**非資料受託者 / 家用豁免 (Household Exemption)**。
   - **依據**：依據 GDPR Article 2(2)(c) 及香港《個人資料（私隱）條例》第 52 條，本系統由使用者純粹用於個人及家庭應急事務。本軟體無遠端伺服器、無資料庫、無遙測收集（No Telemetry），軟體作者／維護者無法接觸、處理或持有任何使用者資料，並非資料控制者（Data Controller）或處理者（Data Processor）。

---

### 二、 國際資訊安全與隱私標準控制項對齊 (Security & Privacy Controls Mapping)

本專案在系統架構層面，嚴格落實 **ISO/IEC 27001:2022** 及 **ISO/IEC 27701:2019** 的核心控制精神：

| ISO 27001 / 27701 控制項 | 系統落實機制 | 治理說明 |
| :--- | :--- | :--- |
| **A.5.15 存取控制 (Access Control)** | 雙層架構物理隔離 | 第一層公開名冊與第二層核心機密實施密碼學隔離。 |
| **A.8.24 密碼學使用 (Cryptography)** | AES-GCM-256 + PBKDF2 (600,000 iter) | 使用業界公認之高強度標準算法，杜絕專有自製加密。 |
| **A.8.10 資訊刪除 (Information Deletion)** | 動態記憶體清零 | 關閉分頁或閒置 180 秒自動觸發會話鎖定，抹除金鑰記憶體。 |
| **PIMS 資料最小化 (Data Minimization)** | 零伺服器架構 (Zero-Knowledge) | 完全不要求使用者註冊帳戶、上傳個人身分或提供追蹤資訊。 |
| **PIMS 儲存限制 (Storage Limitation)** | 本地密文快取 | 明文不落地，本地僅存儲經 AES-256 加密之密文。 |

---

## English

### 1. Scope & Regulatory Negative Scope Exclusion
LeaveWell adheres to strict compliance and governance accuracy:

1. **AI Regulations (EU AI Act, CAC Algorithm Provisions, ISO/IEC 42001) — Explicitly Out of Scope**:
   - **Status**: **Not Applicable**.
   - **Rationale**: LeaveWell is a deterministic, rule-based, client-side utility executing native Web Crypto API standards. It incorporates **zero machine learning algorithms, deep learning models, generative AI components, or automated decision-making (ADM) systems**. Consequently, it falls outside the definitions set forth by the EU AI Act and ISO/IEC 42001.

2. **Data Protection (GDPR & HK PDPO Cap. 486) — Household Exemption**:
   - **Status**: **Household Exemption / Non-Controller**.
   - **Rationale**: Pursuant to Article 2(2)(c) of the GDPR and Section 52 of the Hong Kong Personal Data (Privacy) Ordinance (Cap. 486), the software is utilized purely for personal and household emergency planning. The developers operate no central backend, collect zero telemetry, and possess no technical ability to access, store, or process user plaintext data.

---

### 2. ISO/IEC 27001:2022 & ISO/IEC 27701:2019 Controls Alignment

| ISO Control Identifier | Technical Implementation | Governance Rationale |
| :--- | :--- | :--- |
| **A.5.15 Access Control** | Progressive Two-Tier Architecture | Cryptographic separation between public index and confidential payload. |
| **A.8.24 Cryptography** | AES-GCM-256 with PBKDF2 (600k iters) | Adherence to standardized, non-proprietary cryptographic primitives. |
| **A.8.10 Information Deletion** | In-Memory Scrubbing & Timed Auto-Lock | Plaintext purged from browser memory upon session timeout (180s) or window closure. |
| **PIMS Data Minimization** | Zero-Server Architecture | Zero tracking, zero analytics, zero external API connections. |
| **PIMS Storage Limitation** | Ciphertext-Only Local Storage | No plaintext is ever written to persistent storage (`localStorage`). |
