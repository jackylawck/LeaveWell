/**
 * i18n.js - 雙層架構雙語字典 (方案 B：保險箱提示卡版)
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
      guideTitle: "💡 家人緊急應急指南（3 步即用）",
      guideCollapse: "[收起指引]",
      guideExpand: "[展開指引]",
      guideStep1: "<strong>免密即看</strong>：上方綠色區已<strong>自動顯示</strong>生前所有保險公司；致電官方報出死者全名及身份證號碼即可查詢保單。",
      guideStep2: "<strong>保險箱找卡</strong>：取出家中保險箱內的「實體記憶提示卡」，依照提示拼出約定密語。",
      guideStep3: "<strong>解鎖金庫</strong>：在紅色區輸入密語，即時解鎖經紀電話、保單號碼、實體合約位置與手機 PIN。",
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
      guideTitle: "💡 Quick Emergency Guide (3 Steps)",
      guideCollapse: "[Hide Guide]",
      guideExpand: "[Show Guide]",
      guideStep1: "<strong>Instant Access</strong>: Top green panel shows all insurance companies <strong>without password</strong>; call insurers to file claims using name & HKID.",
      guideStep2: "<strong>Safe Box Clue</strong>: Retrieve the memory clue card from the family safe to recall the master passphrase.",
      guideStep3: "<strong>Unlock Vault</strong>: Enter the passphrase below to reveal advisor contacts, policy numbers, contract locations, and device PIN.",
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
