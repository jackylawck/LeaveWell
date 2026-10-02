/**
 * i18n.js - 雙層架構雙語字典 (完整中英文對齊版)
 */
window.LeaveWell = window.LeaveWell || {};

(function() {
  function deepFreeze(obj) {
    Object.keys(obj).forEach(prop => {
      if (typeof obj[prop] === 'object' && obj[prop] !== null && !Object.isFrozen(obj[prop])) {
        deepFreeze(obj[prop]);
      }
    });
    return Object.freeze(obj);
  }

  window.LeaveWell.I18N = deepFreeze({
    zh: {
      appTitle: "🛡️ 留愛心安 LeaveWell",
      appSub: "留愛於生，遇事心安 ‧ 家庭應急資產雙層索引 ‧ 純本地加密",
      sessionHint: "離線安全保護中 ‧ 零雲端數據留存",
      // 合規橫額
      badgeIso: "🛡️ ISO 27001/27701 控制項對齊",
      badgeGdpr: "🔒 歐盟 GDPR 家用豁免",
      badgePdpo: "⚖️ 香港私隱條例 S.52 豁免",
      badgeAi: "🚫 零 AI / 負向排除",
      linkCompliance: "[檢視完整治理與合規聲明 ➔]",
      // 合規彈窗
      modalCompTitle: "⚖️ 留愛心安 ‧ 全球法規治理與資安架構聲明",
      modalSec1Title: "1. 負向範圍排除聲明 (Negative Scope Exclusion)",
      modalSec1Content: "• <strong>EU AI Act / 國家網信辦 / ISO 42001 (AIMS)</strong>：<strong>明確不適用 (Out of Scope)</strong>。本系統為純確定性（Deterministic）密碼學前端工具，無任何機器學習演算法、生成式 AI 或自動決策模組，依法豁免相關監管義務。<br>• <strong>歐盟 GDPR (Art. 2(2)(c)) & 香港 PDPO (第 52 條)</strong>：<strong>家用豁免 (Household Exemption)</strong>。本系統由使用者純粹用於個人及家庭事務，作者與系統不收集、傳輸或持有任何個資，非資料控制者。",
      modalSec2Title: "2. 國際資安與隱私標準控制項對齊 (ISO 27001 / 27701)",
      modalSec2Content: "• <strong>A.8.24 密碼學控制</strong>：使用 NIST 認證之 AES-GCM-256 加密與 PBKDF2 (600,000 次疊代)。<br>• <strong>A.8.10 資訊刪除</strong>：會話閒置 180 秒自動鎖定，關閉視窗即時清除記憶體明文。<br>• <strong>Privacy by Design & Default</strong>：CSP 宣告 <code>connect-src 'none'</code>，徹底封死任何外網數據傳輸。",
      modalSec3Title: "3. 零知識架構與責任聲明",
      modalSec3Content: "本軟體按「現狀」（AS IS）於 MIT 授權條款釋出。開發者在數學與架構層面均無後門或代管密鑰，密語及實體提示卡須由使用者自行妥善保管於安全保險箱。",
      // 家人指引
      guideTitle: "💡 家人緊急應急指南（3 步即用）",
      guideCollapse: "[收起指引]",
      guideExpand: "[展開指引]",
      guideStep1: "<strong>免密即看</strong>：上方綠色區已<strong>自動顯示</strong>生前所有保險公司；致電官方報出死者全名及身份證號碼即可查詢保單。",
      guideStep2: "<strong>保險箱找卡</strong>：取出家中保險箱內的「實體記憶提示卡」，依照提示拼出約定密語。",
      guideStep3: "<strong>解鎖金庫</strong>：在紅色區輸入密語，即時解鎖經紀電話、保單號碼、實體合約位置與手機 PIN。",
      // 介面欄位
      publicTitle: "🟢 第一層：保險公司名冊（免密碼・公開指引）",
      publicBadge: "免密碼公開",
      publicEmpty: "尚未匯入任何備份檔案...",
      publicDisclaimer: "💡 如無密碼，請直接搜尋上述官方熱線，向理賠部報出受保人英文姓名及身份證號碼即可核查保單。",
      secretTitle: "🔴 第二層：核心應急金庫（需家庭約定密語）",
      secretBadge: "AES-256 加密",
      passphraseLabel: "輸入家庭約定密語（參考保險箱提示卡）：",
      passphrasePlaceholder: "輸入約定密語",
      unlockBtn: "🔓 解密完整應急金庫",
      lockBtn: "🔒 立即鎖定金庫",
      policiesTitle: "📋 專屬顧問、保單編號與存放位置",
      devicePinTitle: "📱 手機解鎖與雙重驗證 (2FA/SMS)",
      emailTitle: "📧 主電郵帳號與取回線索",
      notesTitle: "🔑 密碼庫 Master Key 與身後重要交代",
      btnImport: "📥 匯入 JSON 檔案",
      btnExport: "💾 匯出目前備份檔",
      btnEditor: "⚙️ 建立／修改保險庫",
      agentName: "專屬顧問",
      agentPhone: "顧問電話",
      policyNo: "保單編號",
      fileLoc: "合約存放位置"
    },
    en: {
      appTitle: "🛡️ LeaveWell 留愛心安",
      appSub: "Anchored in Love, Leave Well for Kin ‧ Two-Tier Emergency Vault ‧ Zero-Knowledge",
      sessionHint: "Offline Security Active ‧ Zero Cloud Storage",
      // 合規橫額
      badgeIso: "🛡️ ISO 27001/27701 Aligned",
      badgeGdpr: "🔒 EU GDPR Household Exemption",
      badgePdpo: "⚖️ HK PDPO S.52 Exemption",
      badgeAi: "🚫 Zero AI / Out of Scope",
      linkCompliance: "[View Full Governance & Legal Disclosures ➔]",
      // 合規彈窗
      modalCompTitle: "⚖️ LeaveWell ‧ Global Governance & Compliance Disclosures",
      modalSec1Title: "1. Negative Scope Exclusion (AI Frameworks)",
      modalSec1Content: "• <strong>EU AI Act / CAC Algorithm Provisions / ISO 42001 (AIMS)</strong>: <strong>Explicitly Out of Scope</strong>. Pure deterministic cryptographic client-side utility with zero machine learning, generative models, or automated decision-making.<br>• <strong>GDPR (Art. 2(2)(c)) & HK PDPO (Section 52)</strong>: <strong>Household Exemption</strong>. Designed solely for personal and family emergency purposes. Zero data collection, transmission, or custody.",
      modalSec2Title: "2. Information Security & Privacy Controls (ISO 27001 / 27701)",
      modalSec2Content: "• <strong>A.8.24 Cryptographic Controls</strong>: NIST-standard AES-GCM-256 with PBKDF2 (600,000 iterations).<br>• <strong>A.8.10 Information Deletion</strong>: Automatic 180s idle session lock, immediate in-memory credential purging.<br>• <strong>Privacy by Design & Default</strong>: Strict CSP <code>connect-src 'none'</code> blocking all egress transmissions.",
      modalSec3Title: "3. Zero-Knowledge Framework & Disclaimer",
      modalSec3Content: "Provided on an 'AS IS' basis under the MIT License. The developers possess zero backdoors or key escrow capabilities. Passphrases and clue cards must be safeguarded in a physical home safe.",
      // 家人指引
      guideTitle: "💡 Quick Emergency Guide (3 Steps)",
      guideCollapse: "[Hide Guide]",
      guideExpand: "[Show Guide]",
      guideStep1: "<strong>Instant Access</strong>: Top green panel shows all insurance companies <strong>without password</strong>; call insurers to file claims using legal name & HKID.",
      guideStep2: "<strong>Safe Box Clue</strong>: Retrieve the memory clue card from the family safe to recall the master passphrase.",
      guideStep3: "<strong>Unlock Vault</strong>: Enter the passphrase below to reveal advisor contacts, policy numbers, contract locations, and device PIN.",
      // 介面欄位
      publicTitle: "🟢 Tier 1: Insurance Directory (No Password ‧ Public Guide)",
      publicBadge: "Public Access",
      publicEmpty: "No backup file imported yet...",
      publicDisclaimer: "💡 Without password, search the insurer hotline and provide the insured's full name & HKID to file a claim.",
      secretTitle: "🔴 Tier 2: Confidential Emergency Vault (Passphrase Required)",
      secretBadge: "AES-256 Encrypted",
      passphraseLabel: "Enter family master passphrase (refer to safe box clue):",
      passphrasePlaceholder: "Enter passphrase",
      unlockBtn: "🔓 Decrypt Emergency Vault",
      lockBtn: "🔒 Lock Vault Now",
      policiesTitle: "📋 Dedicated Advisors & Policy Index",
      devicePinTitle: "📱 Device PIN & 2FA Access",
      emailTitle: "📧 Primary Email & Recovery Clues",
      notesTitle: "🔑 Password Manager Master Key & Legacy Directives",
      btnImport: "📥 Import JSON File",
      btnExport: "💾 Export Backup File",
      btnEditor: "⚙️ Create / Edit Vault",
      agentName: "Dedicated Advisor",
      agentPhone: "Advisor Contact",
      policyNo: "Policy Number",
      fileLoc: "Physical Location"
    }
  });
})();
