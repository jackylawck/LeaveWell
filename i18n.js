/**
 * i18n.js - 雙層架構雙語字典 (深凍結)
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
      guideStep1: "<strong>搵備份檔</strong>：找出隨身碟或書房之 <code>LeaveWell-Vault-*.json</code> 檔案。",
      guideStep2: "<strong>撳匯入</strong>：點擊底部 <span class=\"highlight-btn\">📥 匯入 JSON 檔案</span> 上傳。",
      guideStep3: "<strong>即時查閱</strong>：綠色區<strong>免密碼即時顯示</strong>所有持有之保險公司；若需經紀電話、保單號或手機 PIN，於紅色區輸入密語或紙本 52 碼恢復碼。",
      publicTitle: "🟢 第一層：保險公司名冊（免密碼・公開指引）",
      publicBadge: "免密碼公開",
      publicEmpty: "尚未匯入任何備份檔案...",
      publicDisclaimer: "💡 如無密碼，請直接搜尋上述官方熱線，向理賠部報出受保人英文姓名及身份證號碼即可核查保單。",
      secretTitle: "🔴 第二層：核心應急金庫（需家庭密語／恢復碼）",
      secretBadge: "AES-256 加密",
      tabPass: "使用主密語",
      tabRec: "使用紙本恢復碼",
      passphraseLabel: "輸入約定家庭密語 (Passphrase)：",
      passphrasePlaceholder: "輸入家庭密語",
      recoveryLabel: "輸入紙本 52 碼恢復碼 (Emergency Recovery Code)：",
      recoveryPlaceholder: "RC-XXXXX-XXXXX...",
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
      guideStep1: "<strong>Find Backup</strong>: Locate the <code>LeaveWell-Vault-*.json</code> file on your USB or folder.",
      guideStep2: "<strong>Click Import</strong>: Click <span class=\"highlight-btn\">📥 Import JSON File</span> below.",
      guideStep3: "<strong>Instant Access</strong>: Top green panel shows all insurance companies <strong>without password</strong>; for advisor details and PINs, enter passphrase or recovery code below.",
      publicTitle: "🟢 Tier 1: Insurance Directory (No Password ‧ Public Guide)",
      publicBadge: "Public Access",
      publicEmpty: "No backup file imported yet...",
      publicDisclaimer: "💡 Without password, search the insurer official hotline and provide the insured's full English name and HKID to file a claim.",
      secretTitle: "🔴 Tier 2: Confidential Emergency Vault (Passphrase / Recovery Code)",
      secretBadge: "AES-256 Encrypted",
      tabPass: "Use Passphrase",
      tabRec: "Use Recovery Code",
      passphraseLabel: "Enter agreed family master passphrase:",
      passphrasePlaceholder: "Enter master passphrase",
      recoveryLabel: "Enter paper 52-char Emergency Recovery Code:",
      recoveryPlaceholder: "RC-XXXXX-XXXXX...",
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
