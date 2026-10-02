/**
 * app.js - 雙層架構控制器 (方案 B：保險箱提示卡版 + 全面雙語合規同步)
 */
window.LeaveWell = window.LeaveWell || {};

(function() {
  "use strict";

  const { Crypto, I18N } = window.LeaveWell;
  const MAX_FAILS = 5;
  const LOCKOUT_MS = 15 * 60 * 1000;
  const STORAGE_KEY = "leavewell_saved_vault_v41";

  const HK_INSURERS = [
    "友邦保險 (AIA)", "保誠保險 (Prudential)", "宏利金融 (Manulife)", "安盛保險 (AXA)",
    "永明金融 (Sun Life)", "中銀人壽 (BOC Life)", "滙豐保險 (HSBC Life)", "恒生保險 (Hang Seng)",
    "周大福人壽 (CTF Life)", "富衛保險 (FWD)", "中國人壽(海外) (China Life)", "信諾環球 (Cigna)",
    "忠意保險 (Generali)", "保達保險 (Bowtie)"
  ];

  let currentLang = localStorage.getItem("vault_lang") || "zh";
  let memoryVault = null;
  let decryptedPayload = null;
  let lockCountdown = null;
  let currentEditorItems = [];
  let hiddenSince = null;

  function escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(/[&<>"']/g, m => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[m]);
  }

  function checkLockout() {
    const until = parseInt(localStorage.getItem("vault_lockout_until") || "0", 10);
    const now = Date.now();
    return now < until ? Math.ceil((until - now) / 1000) : 0;
  }

  function recordFail() {
    const count = parseInt(localStorage.getItem("vault_fail_count") || "0", 10) + 1;
    localStorage.setItem("vault_fail_count", count.toString());
    if (count >= MAX_FAILS) {
      localStorage.setItem("vault_lockout_until", (Date.now() + LOCKOUT_MS).toString());
      localStorage.removeItem("vault_fail_count");
      return { locked: true, remain: Math.ceil(LOCKOUT_MS / 1000) };
    }
    return { locked: false, fails: count };
  }

  function resetFails() {
    localStorage.removeItem("vault_fail_count");
    localStorage.removeItem("vault_lockout_until");
  }

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("vault_lang", lang);
    const t = I18N[lang];

    // 頂部應用標題與提示
    document.getElementById("uiAppTitle").innerText = t.appTitle;
    document.getElementById("uiAppSub").innerText = t.appSub;
    document.getElementById("uiSessionHint").innerText = t.sessionHint;

    // 🏛️ 合規橫額標籤與鏈接同步
    if (document.getElementById("uiBadgeIso")) document.getElementById("uiBadgeIso").innerText = t.badgeIso;
    if (document.getElementById("uiBadgeGdpr")) document.getElementById("uiBadgeGdpr").innerText = t.badgeGdpr;
    if (document.getElementById("uiBadgePdpo")) document.getElementById("uiBadgePdpo").innerText = t.badgePdpo;
    if (document.getElementById("uiBadgeAi")) document.getElementById("uiBadgeAi").innerText = t.badgeAi;
    if (document.getElementById("uiLinkCompliance")) document.getElementById("uiLinkCompliance").innerText = t.linkCompliance;

    // 🏛️ 合規說明彈窗內文同步
    if (document.getElementById("uiModalCompTitle")) document.getElementById("uiModalCompTitle").innerText = t.modalCompTitle;
    if (document.getElementById("uiModalSec1Title")) document.getElementById("uiModalSec1Title").innerText = t.modalSec1Title;
    if (document.getElementById("uiModalSec1Content")) document.getElementById("uiModalSec1Content").innerHTML = t.modalSec1Content;
    if (document.getElementById("uiModalSec2Title")) document.getElementById("uiModalSec2Title").innerText = t.modalSec2Title;
    if (document.getElementById("uiModalSec2Content")) document.getElementById("uiModalSec2Content").innerHTML = t.modalSec2Content;
    if (document.getElementById("uiModalSec3Title")) document.getElementById("uiModalSec3Title").innerText = t.modalSec3Title;
    if (document.getElementById("uiModalSec3Content")) document.getElementById("uiModalSec3Content").innerHTML = t.modalSec3Content;

    // 💡 家人應急指南步驟與折疊按鈕同步
    document.getElementById("uiGuideTitle").innerText = t.guideTitle;
    document.getElementById("uiGuideStep1").innerHTML = t.guideStep1;
    document.getElementById("uiGuideStep2").innerHTML = t.guideStep2;
    document.getElementById("uiGuideStep3").innerHTML = t.guideStep3;
    const btnToggleGuide = document.getElementById("btnToggleGuide");
    if (btnToggleGuide) {
      const isHidden = document.getElementById("guideContent").classList.contains("hidden");
      btnToggleGuide.innerText = isHidden ? t.guideExpand : t.guideCollapse;
    }

    // 第一層公開名冊介面文字
    document.getElementById("uiPublicTitle").innerText = t.publicTitle;
    document.getElementById("uiPublicBadge").innerText = t.publicBadge;
    document.getElementById("uiPublicDisclaimer").innerText = t.publicDisclaimer;

    // 第二層機密金庫介面文字
    document.getElementById("uiSecretTitle").innerText = t.secretTitle;
    document.getElementById("uiSecretBadge").innerText = t.secretBadge;
    document.getElementById("uiPassphraseLabel").innerText = t.passphraseLabel;
    document.getElementById("passphrase").placeholder = t.passphrasePlaceholder;
    document.getElementById("btnUnlockVault").innerText = t.unlockBtn;
    document.getElementById("btnLockVault").innerText = t.lockBtn;

    // 解鎖後詳細欄位標籤
    document.getElementById("uiSecPoliciesTitle").innerText = t.policiesTitle;
    document.getElementById("uiDevicePinTitle").innerText = t.devicePinTitle;
    document.getElementById("uiEmailTitle").innerText = t.emailTitle;
    document.getElementById("uiNotesTitle").innerText = t.notesTitle;

    // 底部工具列按鈕
    document.getElementById("btnTriggerImport").innerText = t.btnImport;
    document.getElementById("btnExport").innerText = t.btnExport;
    document.getElementById("btnOpenEditor").innerText = t.btnEditor;

    if (memoryVault) {
      renderPublicDirectory(memoryVault.public_directory);
      if (decryptedPayload) renderSecretDetails(decryptedPayload);
    } else {
      document.getElementById("uiPublicEmpty").innerText = t.publicEmpty;
    }
  }

  function handleFileImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const parsed = JSON.parse(evt.target.result);
        Crypto.validateSchema(parsed);

        memoryVault = parsed;
        localStorage.setItem(STORAGE_KEY, evt.target.result);

        renderPublicDirectory(memoryVault.public_directory);
        lockVault();

        document.getElementById("btnExport").disabled = false;
        alert(currentLang === 'zh' ? "✅ 匯入成功！已顯示第一層保險名冊，並已在本機建立快取。" : "✅ Imported successfully! Tier 1 directory loaded.");
      } catch (err) {
        alert((currentLang === 'zh' ? "❌ 匯入失敗：" : "❌ Import failed: ") + err.message);
      } finally {
        e.target.value = "";
      }
    };
    reader.readAsText(file);
  }

  function renderPublicDirectory(pub) {
    const container = document.getElementById("publicDisplay");
    container.innerHTML = "";

    if (!pub.insurers || pub.insurers.length === 0) {
      container.innerHTML = `<div class="empty-hint">${currentLang === 'zh' ? "無保險紀錄" : "No records found"}</div>`;
      return;
    }

    pub.insurers.forEach(item => {
      const div = document.createElement("div");
      div.className = "item-card";
      div.innerHTML = `
        <div style="font-weight:700; color:#34d399; font-size:0.95rem;">🏢 ${escapeHtml(item.company)}</div>
        <div style="margin-top:0.25rem; font-size:0.8rem; color:#a7f3d0;">🛡️ 險種分類：${escapeHtml(item.type)}</div>
      `;
      container.appendChild(div);
    });
  }

  async function unlockVault() {
    const lockedSec = checkLockout();
    if (lockedSec > 0) {
      alert(currentLang === 'zh' ? `⛔ 密語錯誤過多，系統鎖定中。請等待 ${lockedSec} 秒。` : `⛔ Locked. Wait ${lockedSec}s.`);
      return;
    }
    if (!memoryVault) return alert(currentLang === 'zh' ? "請先匯入備份檔案！" : "Please import a backup file first!");

    const pass = document.getElementById("passphrase").value;
    if (!pass) return alert(currentLang === 'zh' ? "請輸入密語！" : "Enter passphrase!");

    try {
      decryptedPayload = await Crypto.decryptVault(pass, memoryVault.encrypted_vault);
      renderSecretDetails(decryptedPayload);

      document.getElementById("secretLockSection").classList.add("hidden");
      document.getElementById("secretContentSection").classList.remove("hidden");
      document.getElementById("authErrorMsg").style.display = "none";
      document.getElementById("passphrase").value = "";

      resetFails();
      startLockTimer(180);
    } catch (err) {
      const res = recordFail();
      const errMsg = document.getElementById("authErrorMsg");
      errMsg.style.display = "block";
      errMsg.innerText = res.locked 
        ? (currentLang === 'zh' ? `⛔ 連續錯誤達 ${MAX_FAILS} 次，已鎖定 15 分鐘。` : `⛔ Locked for 15 minutes.`)
        : (currentLang === 'zh' ? `❌ 認證失敗 (${res.fails}/${MAX_FAILS})。密語不正確，請參考保險箱提示卡。` : `❌ Auth failed (${res.fails}/${MAX_FAILS}). Incorrect passphrase.`);
    }
  }

  function renderSecretDetails(payload) {
    const t = I18N[currentLang];
    const pContainer = document.getElementById("secretPoliciesList");
    pContainer.innerHTML = "";

    if (!payload.policies || payload.policies.length === 0) {
      pContainer.innerHTML = `<div style="color:var(--sub); font-size:0.8rem;">無詳細顧問資料</div>`;
    } else {
      payload.policies.forEach(item => {
        const div = document.createElement("div");
        div.className = "item-card";
        div.innerHTML = `
          <div style="font-weight:700; color:#93c5fd;">🏢 ${escapeHtml(item.company)} (${escapeHtml(item.type)})</div>
          <div style="margin:0.25rem 0;">👤 ${t.agentName}: <strong>${escapeHtml(item.agentName)}</strong> ｜ 📞 ${t.agentPhone}: <a href="tel:${escapeHtml(item.agentPhone)}" class="tel-link">${escapeHtml(item.agentPhone)}</a></div>
          <div style="font-size:0.75rem; color:var(--sub);">📄 ${t.policyNo}: <strong>${escapeHtml(item.policyNumber)}</strong></div>
          <div style="font-size:0.75rem; color:#38bdf8; margin-top:0.2rem;">📍 ${t.fileLoc}: ${escapeHtml(item.fileLocation)}</div>
        `;
        pContainer.appendChild(div);
      });
    }

    document.getElementById("valDevicePin").innerText = payload.devicePin || "N/A";
    document.getElementById("valPrimaryEmail").innerText = payload.primaryEmail || "N/A";
    document.getElementById("valMasterNotes").innerText = payload.masterNotes || "N/A";
  }

  function lockVault() {
    clearInterval(lockCountdown);
    decryptedPayload = null;
    document.getElementById("secretLockSection").classList.remove("hidden");
    document.getElementById("secretContentSection").classList.add("hidden");
    document.getElementById("lockTimer").classList.add("hidden");
    document.getElementById("secretPoliciesList").innerHTML = "";
    document.getElementById("valDevicePin").innerText = "";
    document.getElementById("valPrimaryEmail").innerText = "";
    document.getElementById("valMasterNotes").innerText = "";
  }

  function startLockTimer(sec) {
    let r = sec;
    const badge = document.getElementById("lockTimer");
    badge.classList.remove("hidden");
    badge.innerText = `會話倒數: ${r}s`;
    clearInterval(lockCountdown);
    lockCountdown = setInterval(() => {
      r--;
      if (r <= 0) lockVault();
      else badge.innerText = `會話倒數: ${r}s`;
    }, 1000);
  }

  function renderEditorItems() {
    const box = document.getElementById("editorItemsList");
    box.innerHTML = "";
    currentEditorItems.forEach((it, idx) => {
      const d = document.createElement("div");
      d.style = "background:#0b0f19; padding:0.4rem; border-radius:4px; font-size:0.75rem; margin-bottom:0.25rem; display:flex; justify-content:space-between; align-items:center;";
      d.innerHTML = `
        <span>🏢 ${escapeHtml(it.company)} (${escapeHtml(it.type)}) - 👤 ${escapeHtml(it.agentName)}</span>
        <button style="min-width:40px; padding:2px 4px; background:#e11d48; color:white; border-radius:4px;" data-del="${idx}">${currentLang === 'zh' ? "刪除" : "Delete"}</button>
      `;
      box.appendChild(d);
    });
    box.querySelectorAll("[data-del]").forEach(b => {
      b.addEventListener("click", (e) => {
        const i = parseInt(e.target.getAttribute("data-del"), 10);
        currentEditorItems.splice(i, 1);
        renderEditorItems();
      });
    });
  }

  function wipeEditorFields() {
    ["editPassphrase", "editConfirmPassphrase", "editPassphraseHint", "editDevicePin", "editPrimaryEmail", "editMasterNotes",
     "inputCustomName", "inputAgentName", "inputAgentPhone", "inputPolicyNum", "inputFileLoc"
    ].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });

    document.getElementById("editorInsurerSelect").selectedIndex = 0;
    document.getElementById("editorInsurerType").selectedIndex = 0;
    document.getElementById("editorCustomBox").classList.add("hidden");
    
    currentEditorItems = [];
    renderEditorItems();
  }

  async function loadExistingFileForEditing(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(evt) {
      try {
        const parsed = JSON.parse(evt.target.result);
        Crypto.validateSchema(parsed);

        const pass = prompt(currentLang === 'zh' ? "請輸入此備份檔的家庭密語以解鎖載入：" : "Enter master passphrase to unlock and edit:");
        if (!pass) return;

        const unlocked = await Crypto.decryptVault(pass, parsed.encrypted_vault);

        currentEditorItems = unlocked.policies || [];
        renderEditorItems();

        document.getElementById("editDevicePin").value = unlocked.devicePin || "";
        document.getElementById("editPrimaryEmail").value = unlocked.primaryEmail || "";
        document.getElementById("editMasterNotes").value = unlocked.masterNotes || "";
        document.getElementById("editPassphraseHint").value = parsed.public_hint || "";

        alert(currentLang === 'zh' ? "✅ 舊資料已成功解密並填入編輯器！修改完成後請設定密語重新匯出。" : "✅ Loaded and decrypted! Edit details and save.");
      } catch (err) {
        alert((currentLang === 'zh' ? "❌ 載入解密失敗（密語不正確或檔案損毀）：" : "❌ Failed to decrypt: ") + err.message);
      } finally {
        e.target.value = "";
      }
    };
    reader.readAsText(file);
  }

  async function saveAndExportVault() {
    const pass = document.getElementById("editPassphrase").value;
    const confirmPass = document.getElementById("editConfirmPassphrase").value;
    const hint = document.getElementById("editPassphraseHint").value.trim();

    if (!pass || pass.length < 12) return alert(currentLang === 'zh' ? "主密語長度需至少 12 字元！" : "Passphrase must be >= 12 chars!");
    if (pass !== confirmPass) return alert(currentLang === 'zh' ? "兩次輸入的密語不相符！" : "Passphrases do not match!");
    if (currentEditorItems.length === 0) return alert(currentLang === 'zh' ? "請至少加入一筆保單！" : "Please add at least one policy!");

    try {
      const publicInsurers = currentEditorItems.map(it => ({
        company: it.company,
        type: it.type
      }));

      const secretData = {
        policies: currentEditorItems,
        devicePin: document.getElementById("editDevicePin").value,
        primaryEmail: document.getElementById("editPrimaryEmail").value,
        masterNotes: document.getElementById("editMasterNotes").value
      };

      const encryptedPart = await Crypto.encryptVault(secretData, pass);

      const fullPackage = {
        version: "4.1-clue-tier",
        appName: "LeaveWell",
        exportedAt: new Date().toISOString(),
        public_hint: hint,
        public_directory: { insurers: publicInsurers },
        encrypted_vault: encryptedPart
      };

      const rawJson = JSON.stringify(fullPackage, null, 2);

      localStorage.setItem(STORAGE_KEY, rawJson);
      memoryVault = fullPackage;
      renderPublicDirectory(memoryVault.public_directory);
      document.getElementById("btnExport").disabled = false;

      const blob = new Blob([rawJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `LeaveWell-Vault-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);

      wipeEditorFields();
      document.getElementById("editorModal").classList.add("hidden");

      alert(currentLang === 'zh' 
        ? `🎉 保險庫打包完成！已下載 JSON 檔案並快取於本機。\n\n【重要下一步】\n請將你設定的線索提示：\n「${hint || '你的自訂線索'}」\n抄寫在實體小卡上，放進保險箱！` 
        : "🎉 Export complete! Please write down the clue onto your paper card.");
    } catch (err) {
      alert("儲存過程發生錯誤：" + err.message);
    }
  }

  window.addEventListener("DOMContentLoaded", () => {
    const sel = document.getElementById("editorInsurerSelect");
    sel.innerHTML = `<option value="">${currentLang === 'zh' ? "-- 請選擇保險公司 --" : "-- Select Insurer --"}</option>`;
    HK_INSURERS.forEach(name => sel.innerHTML += `<option value="${name}">${name}</option>`);
    sel.innerHTML += `<option value="__OTHER__">${currentLang === 'zh' ? "➕ 其他保險公司 (手動自填)" : "➕ Other Insurer (Manual)"}</option>`;

    sel.addEventListener("change", (e) => {
      const isOther = e.target.value === "__OTHER__";
      document.getElementById("editorCustomBox").classList.toggle("hidden", !isOther);
    });

    document.getElementById("btnLangZh").addEventListener("click", () => setLanguage("zh"));
    document.getElementById("btnLangEn").addEventListener("click", () => setLanguage("en"));

    const btnToggleGuide = document.getElementById("btnToggleGuide");
    if (btnToggleGuide) {
      btnToggleGuide.addEventListener("click", () => {
        const content = document.getElementById("guideContent");
        const isHidden = content.classList.toggle("hidden");
        const t = I18N[currentLang];
        btnToggleGuide.innerText = isHidden ? t.guideExpand : t.guideCollapse;
      });
    }

    document.getElementById("fileInput").addEventListener("change", handleFileImport);
    document.getElementById("btnTriggerImport").addEventListener("click", () => document.getElementById("fileInput").click());
    document.getElementById("btnExport").addEventListener("click", () => {
      if (!memoryVault) return;
      const blob = new Blob([JSON.stringify(memoryVault, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `LeaveWell-Backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    document.getElementById("btnUnlockVault").addEventListener("click", unlockVault);
    document.getElementById("btnLockVault").addEventListener("click", lockVault);

    document.getElementById("btnOpenEditor").addEventListener("click", async () => {
      document.getElementById("editorModal").classList.remove("hidden");

      if (memoryVault && currentEditorItems.length === 0) {
        const wantLoad = confirm(currentLang === 'zh' ? "偵測到本機已有保險庫。是否輸入密語載入舊資料再編輯？" : "Detected vault. Unlock to edit?");
        if (wantLoad) {
          const pass = prompt(currentLang === 'zh' ? "請輸入家庭密語以解密編輯：" : "Enter master passphrase:");
          if (pass) {
            try {
              const unlocked = await Crypto.decryptVault(pass, memoryVault.encrypted_vault);
              currentEditorItems = unlocked.policies || [];
              renderEditorItems();
              document.getElementById("editDevicePin").value = unlocked.devicePin || "";
              document.getElementById("editPrimaryEmail").value = unlocked.primaryEmail || "";
              document.getElementById("editMasterNotes").value = unlocked.masterNotes || "";
              document.getElementById("editPassphraseHint").value = memoryVault.public_hint || "";
              alert(currentLang === 'zh' ? "✅ 舊資料已載入！修改完成後重新設定密語匯出即可。" : "✅ Loaded! Update and save.");
            } catch (err) {
              alert((currentLang === 'zh' ? "❌ 解密失敗：" : "❌ Failed: ") + err.message);
            }
          }
        }
      }
    });

    document.getElementById("btnCloseEditor").addEventListener("click", () => {
      wipeEditorFields();
      document.getElementById("editorModal").classList.add("hidden");
    });

    document.getElementById("btnEditorLoadExisting").addEventListener("click", () => document.getElementById("editorLoadFileInput").click());
    document.getElementById("editorLoadFileInput").addEventListener("change", loadExistingFileForEditing);

    document.getElementById("btnAddInsuranceItem").addEventListener("click", () => {
      const selVal = document.getElementById("editorInsurerSelect").value;
      const typeVal = document.getElementById("editorInsurerType").value;
      let companyName = "";

      if (selVal === "__OTHER__") {
        companyName = document.getElementById("inputCustomName").value.trim();
        if (!companyName) return alert("請填寫自訂公司名稱！");
      } else if (selVal) {
        companyName = selVal;
      } else {
        return alert("請選擇保險公司！");
      }

      const agentName = document.getElementById("inputAgentName").value.trim() || (currentLang === 'zh' ? "未指派" : "Unassigned");
      const agentPhone = document.getElementById("inputAgentPhone").value.trim() || "N/A";
      const policyNum = document.getElementById("inputPolicyNum").value.trim() || (currentLang === 'zh' ? "待查" : "TBD");
      const fileLoc = document.getElementById("inputFileLoc").value.trim() || (currentLang === 'zh' ? "書房文件夾" : "Study Folder");

      currentEditorItems.push({
        company: companyName,
        type: typeVal,
        agentName: agentName,
        agentPhone: agentPhone,
        policyNumber: policyNum,
        fileLocation: fileLoc
      });

      renderEditorItems();
      document.getElementById("inputAgentName").value = "";
      document.getElementById("inputAgentPhone").value = "";
      document.getElementById("inputPolicyNum").value = "";
    });

    document.getElementById("btnSaveExport").addEventListener("click", saveAndExportVault);

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        hiddenSince = Date.now();
      } else if (document.visibilityState === "visible") {
        if (hiddenSince && (Date.now() - hiddenSince > 60000)) {
          lockVault();
          document.getElementById("editPassphrase").value = "";
          document.getElementById("editConfirmPassphrase").value = "";
        }
        hiddenSince = null;
      }
    });

    window.addEventListener("beforeunload", () => {
      decryptedPayload = null;
      lockVault();
    });

    const cachedVaultRaw = localStorage.getItem(STORAGE_KEY);
    if (cachedVaultRaw) {
      try {
        const cached = JSON.parse(cachedVaultRaw);
        Crypto.validateSchema(cached);
        memoryVault = cached;
        renderPublicDirectory(memoryVault.public_directory);
        document.getElementById("btnExport").disabled = false;
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    setLanguage(currentLang);
  });
})();
