/**
 * i18n.js - 留愛心安 LeaveWell 雙語字典 (深凍結版)
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
      appSub: "留愛於生，遇事心安 ‧ 三層家庭應急資產索引 ‧ 純本地加密",
      lockTimer: "會話倒數",
      tamperAlert: "⛔ 安全防禦阻斷：Ed25519 簽名無效！公鑰與本機信任錨不相符，或檔案資料曾遭未授權竄改。請直接致電第一層官方熱線核實。",
      tier1Title: "🟢 第一層：官方保險索償熱線（免密碼・官方防偽）",
      tier1Badge: "公開驗證",
      tier1Empty: "尚未匯入任何備份檔案...",
      officialHotline: "官方查詢熱線",
      officialApp: "官方 App",
      tier2Title: "🔵 第二層：個人經紀聯絡與保單定位（免密碼・Ed25519 簽名）",
      tier2BadgePending: "待驗簽",
      tier2BadgeValid: "Ed25519 錨定驗簽通過",
      tier2BadgeInvalid: "簽名無效 (已竄改)",
      tier2Empty: "尚未匯入任何備份檔案...",
      tier2Blocked: "⛔ 第二層資料簽名不符，已被強制隱藏防詐騙。請撥打第一層官方熱線。",
      agentName: "專屬顧問",
      agentPhone: "顧問電話",
      policyNo: "保單編號",
      fileLocation: "合約存放位置",
      tier3Title: "🔴 第三層：數碼存取主閘門（AES-GCM-256 + 雙重 AAD）",
      tier3Badge: "需家庭密語／恢復碼",
      passphraseLabel: "輸入家庭約定高熵密語 (Passphrase)：",
      recoveryLabel: "輸入紙本 52 碼恢復碼 (Emergency Recovery Code)：",
      devicePinTitle: "📱 手機解鎖與雙重驗證 (2FA/SMS)",
      emailTitle: "📧 主電郵帳號與取回線索",
      notesTitle: "🔑 密碼庫與官方身後繼承設定 (Apple / Google)",
      hotlineDisclaimer: "⚠️ 熱線僅供參考，理賠前請核對保單或官方網站。",
      invalidPhone: "[格式不符，請核對]"
    },
    en: {
      appTitle: "🛡️ LeaveWell 留愛心安",
      appSub: "Anchored in Love, Leave Well for Kin ‧ 3-Tier Emergency Life Index ‧ Zero-Knowledge",
      lockTimer: "Session Timeout",
      tamperAlert: "⛔ Security Alert: Invalid Signature! Key does not match local trust anchor or content was tampered. Please call Tier 1 hotlines.",
      tier1Title: "🟢 Tier 1: Official Insurance Claims Hotlines (No Password ‧ Public Verifiable)",
      tier1Badge: "Public Verified",
      tier1Empty: "No backup file imported yet...",
      officialHotline: "Official Hotline",
      officialApp: "Official App",
      tier2Title: "🔵 Tier 2: Personal Advisor & Policy Index (No Password ‧ Ed25519 Signed)",
      tier2BadgePending: "Pending Verification",
      tier2BadgeValid: "Ed25519 Anchored Valid",
      tier2BadgeInvalid: "Invalid Signature",
      tier2Empty: "No backup file imported yet...",
      tier2Blocked: "⛔ Tier 2 advisor data signature mismatch. Blocked to prevent fraud. Please use Tier 1 hotlines.",
      agentName: "Dedicated Advisor",
      agentPhone: "Advisor Contact",
      policyNo: "Policy Number",
      fileLocation: "Physical File Location",
      tier3Title: "🔴 Tier 3: Digital Gateway Access (AES-GCM-256 + Dual AAD)",
      tier3Badge: "Passphrase / Recovery Code Required",
      passphraseLabel: "Enter agreed family master passphrase:",
      recoveryLabel: "Enter paper 52-char Emergency Recovery Code:",
      devicePinTitle: "📱 Device PIN & 2FA Access",
      emailTitle: "📧 Primary Email & Recovery Clues",
      notesTitle: "🔑 Password Manager & Legacy Contacts (Apple / Google)",
      hotlineDisclaimer: "⚠️ Hotlines for reference only. Verify with official website before claims.",
      invalidPhone: "[Invalid Format - Caution]"
    }
  });
})();
