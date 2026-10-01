/**
 * app.js - UI 控制器 (v3.5.1)
 */
window.LeaveWell = window.LeaveWell || {};

(function() {
  "use strict";

  const { Crypto, I18N } = window.LeaveWell;
  const MAX_FAILS = 5;
  const LOCKOUT_MS = 15 * 60 * 1000;

  const HK_INSURERS = [
    { name: "友邦保險 (AIA)", hotline: "+852 2232 8282", app: "AIA Connect" },
    { name: "保誠保險 (Prudential)", hotline: "+852 2281 1333", app: "Pulse" },
    { name: "宏利金融 (Manulife)", hotline: "+852 2108 1188", app: "Manulife HK" },
    { name: "安盛保險 (AXA)", hotline: "+852 2802 2812", app: "Emma by AXA" },
    { name: "永明金融 (Sun Life)", hotline: "+852 2103 8888", app: "Sun Life HK" },
    { name: "中銀人壽 (BOC Life)", hotline: "+852 2860 0688", app: "BOC Life Mobile" },
    { name: "滙豐保險 (HSBC Life)", hotline: "+852 2583 8000", app: "HSBC HK Mobile" },
    { name: "恒生保險 (Hang Seng)", hotline: "+852 2596 6262", app: "Hang Seng Olive" },
    { name: "周大福人壽 / 富通 (CTF Life)", hotline: "+852 2838 3999", app: "CTF Life Connect" },
    { name: "富衛保險 (FWD)", hotline: "+852 3123 3123", app: "FWD MAX" },
    { name: "中國人壽(海外) (China Life)", hotline: "+852 3999 5519", app: "國壽海外" },
    { name: "信諾環球 (Cigna)", hotline: "+852 8100 2340", app: "MyCigna HK" },
    { name: "忠意保險 (Generali)", hotline: "+852 2521 0707", app: "Generali Bravo" },
    { name: "保達保險 (Bowtie)", hotline: "+852 3008 8128", app: "Bowtie Portal" }
  ];

  let currentLang = localStorage.getItem("vault_lang") || "zh";
  let memoryVault = null;
  let currentSigValid = false;
  let lockCountdown = null;
  let currentEditorItems = [];
  let generatedRecoveryCode = "";
  let hiddenSince = null;

  async function updateAnchorUI() {
    const anchor = localStorage.getItem("vault_anchor_pub");
    const el = document.getElementById("uiAnchorStatus");
    if (anchor) {
      const fp = await Crypto.computeFingerprint(anchor);
      el.innerText = `信任錨已建立 (指紋: ${fp})`;
      el.style.color = "#34d399";
    } else {
      el.innerText = "信任錨指紋：未綁定 (首次匯入時建立)";
      el.style.color = "var(--sub)";
    }
  }

  async function verifyAndResolveTrustAnchor(incomingPubHex, sigHex, payload) {
    const isSigValid = await Crypto.verifyEd25519(incomingPubHex, sigHex, payload);
    if (!isSigValid) {
      throw new Error("數位簽名校驗不符！檔案可能遭竄改，未寫入信任錨。");
    }

    const current = localStorage.getItem("vault_anchor_pub");
    const incomingFp = await Crypto.computeFingerprint(incomingPubHex);

    if (!current) {
      const msg = currentLang === 'zh'
        ? `【留愛心安 ‧ 首次匯入安全核對】\n檔案簽名有效！簽署者 SHA-256 指紋為：\n${incomingFp}\n\n請核對此指紋是否與「紙本應急小卡」一致？\n點擊「確定」將此公鑰永久錨定為本機信任錨。`
        : `[LeaveWell ‧ First-Time Trust on Use]\nSignature is valid! Signer SHA-256 fingerprint:\n${incomingFp}\n\nDoes this match your paper Emergency Sheet?\nClick OK to permanently anchor this key as trusted.`;
      
      if (!confirm(msg)) {
        throw new Error("使用者拒絕信任此簽署者指紋，終止載入。");
      }
      localStorage.setItem("vault_anchor_pub", incomingPubHex);
      await updateAnchorUI();
      return incomingPubHex;
    }

    if (current !== incomingPubHex) {
      const curFp = await Crypto.computeFingerprint(current);
      throw new Error(`公鑰與本機已建立的信任錨不符！\n(本機錨點指紋: ${curFp}, 檔案指紋: ${incomingFp})`);
    }

    return current;
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

  function buildTelHref(phoneStr) {
    if (typeof phoneStr !== "string") return null;
    const cleaned = phoneStr.trim().replace(/[\s\-\(\)]/g, "");
    return /^\+?\d{5,20}$/.test(cleaned) ? `tel:${cleaned}` : null;
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(/[&<>"']/g, m => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[m]);
  }

  async function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("vault_lang", lang);
    const t = I18N[lang];
    document.getElementById("uiAppTitle").innerText = t.appTitle;
    document.getElementById("uiAppSub").innerText = t.appSub;
    document.getElementById("uiTamperAlert").innerText = t.tamperAlert;
    document.getElementById("uiTier1Title").innerText = t.tier1Title;
    document.getElementById("uiTier1Badge").innerText = t.tier1Badge;
    document.getElementById("uiTier2Title").innerText = t.tier2Title;
    document.getElementById("uiTier3Title").innerText = t.tier3Title;
    document.getElementById("uiTier3Badge").innerText = t.tier3Badge;
    document.getElementById("uiPassphraseLabel").innerText = t.passphraseLabel;
    document.getElementById("uiRecoveryLabel").innerText = t.recoveryLabel;
    document.getElementById("uiDevicePinTitle").innerText = t.devicePinTitle;
    document.getElementById("uiEmailTitle").innerText = t.emailTitle;
    document.getElementById("uiNotesTitle").innerText = t.notesTitle;
    document.getElementById("uiHotlineDisclaimer").innerText = t.hotlineDisclaimer;
    await updateAnchorUI();

    if (memoryVault) {
      renderTier1(memoryVault.tier1_public);
      renderTier2(memoryVault.tier1_public, memoryVault.tier2_personal_signed, currentSigValid);
    }
  }

  async function handleFileImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(evt) {
      try {
        const parsed = JSON.parse(evt.target.result);
        Crypto.validateSchemaStrict(parsed);

        const verifiedPayload = Crypto.buildSignedPayload(parsed.tier1_public, parsed.tier2_personal_signed.insurance);
        await verifyAndResolveTrustAnchor(
          parsed.tier2_personal_signed.publicKeyHex,
          parsed.tier2_personal_signed.signature,
          verifiedPayload
        );

        currentSigValid = true;
        memoryVault = parsed;

        renderTier1(memoryVault.tier1_public);
        renderTier2(memoryVault.tier1_public, memoryVault.tier2_personal_signed, true);
        lockTier3();

        // 依備份檔是否有恢復碼切換按鈕，若無則重設回密語分頁
        const hasRec = Boolean(memoryVault.tier3_vault_encrypted && memoryVault.tier3_vault_encrypted.wrappedRecoveryDEK);
        document.getElementById("tabUseRecovery").classList.toggle("hidden", !hasRec);
        if (!hasRec) {
          document.getElementById("modeRecoveryBox").classList.add("hidden");
          document.getElementById("modePassphraseBox").classList.remove("hidden");
          document.getElementById("tabUsePass").classList.add("active");
          document.getElementById("tabUseRecovery").classList.remove("active");
        }

        document.getElementById("btnExport").disabled = false;
        alert(currentLang === 'zh' ? "✅ 匯入成功！已通過本機信任錨與 Ed25519 簽名校驗。" : "✅ Import successful! Verified with local trust anchor.");
      } catch (err) {
        currentSigValid = false;
        alert((currentLang === 'zh' ? "❌ 匯入失敗：" : "❌ Import failed: ") + err.message);
      } finally {
        e.target.value = "";
      }
    };
    reader.readAsText(file);
  }

  function renderTier1(t1) {
    const t = I18N[currentLang];
    const container = document.getElementById("tier1Display");
    container.innerHTML = "";
    
    if (!t1.insurance || t1.insurance.length === 0) {
      container.innerHTML = `<div class="empty-hint tier1-hint">${currentLang === 'zh' ? "無保單紀錄" : "No insurance records"}</div>`;
      return;
    }

    t1.insurance.forEach(item => {
      const telHref = buildTelHref(item.officialHotline);
      const div = document.createElement("div");
      div.className = "item-card";
      const phoneHtml = telHref 
        ? `<a href="${telHref}" class="tel-link">${escapeHtml(item.officialHotline)}</a>`
        : `<span style="color:#fda4af;">${escapeHtml(item.officialHotline)} ${t.invalidPhone}</span>`;

      div.innerHTML = `
        <div style="font-weight:700; color:#34d399;">🏢 ${escapeHtml(item.company)} (${escapeHtml(item.type || "壽險")})</div>
        <div style="margin-top:0.25rem;">📞 ${t.officialHotline}: ${phoneHtml}</div>
        <div style="font-size:0.75rem; color:#a7f3d0; margin-top:0.2rem;">📱 ${t.officialApp}: ${escapeHtml(item.officialApp || "官網查詢")}</div>
      `;
      container.appendChild(div);
    });
  }

  function renderTier2(t1, t2, isSigValid) {
    const t = I18N[currentLang];
    const badge = document.getElementById("tier2StatusBadge");
    const banner = document.getElementById("tamperWarning");
    const container = document.getElementById("tier2Display");
    container.innerHTML = "";

    if (!isSigValid) {
      badge.className = "badge badge-red";
      badge.innerText = t.tier2BadgeInvalid;
      banner.style.display = "block";
      container.innerHTML = `<div style="color:#fda4af; font-size:0.8rem; padding:0.5rem;">${t.tier2Blocked}</div>`;
      return;
    }

    badge.className = "badge badge-green";
    badge.innerText = t.tier2BadgeValid;
    banner.style.display = "none";

    if (!t2.insurance || t2.insurance.length === 0) {
      container.innerHTML = `<div class="empty-hint">${currentLang === 'zh' ? "無經紀顧問資料" : "No advisor records"}</div>`;
      return;
    }

    t2.insurance.forEach(item => {
      const telHref = buildTelHref(item.agentPhone);
      const div = document.createElement("div");
      div.className = "item-card";
      const phoneHtml = telHref 
        ? `<a href="${telHref}" class="tel-link">${escapeHtml(item.agentPhone)}</a>`
        : `<span style="color:#fda4af;">${escapeHtml(item.agentPhone)} ${t.invalidPhone}</span>`;

      div.innerHTML = `
        <div style="font-weight:700; color:#93c5fd;">👤 ${t.agentName}: ${escapeHtml(item.agentName)} (${escapeHtml(item.company)})</div>
        <div style="margin:0.25rem 0;">📞 ${t.agentPhone}: ${phoneHtml}</div>
        <div style="font-size:0.75rem; color:var(--sub);">📄 ${t.policyNo}: <strong>${escapeHtml(item.policyNumber)}</strong></div>
        <div style="font-size:0.75rem; color:#38bdf8; margin-top:0.2rem;">📍 ${t.fileLocation}: ${escapeHtml(item.fileLocation)}</div>
      `;
      container.appendChild(div);
    });
  }

  async function unlockTier3() {
    const lockedSec = checkLockout();
    if (lockedSec > 0) {
      alert(currentLang === 'zh' ? `⛔ 密語錯誤過多，系統鎖定中。請等待 ${lockedSec} 秒。` : `⛔ Locked. Please wait ${lockedSec}s.`);
      return;
    }
    if (!memoryVault) return alert(currentLang === 'zh' ? "請先匯入檔案！" : "Import file first!");

    const isRecoveryMode = !document.getElementById("modeRecoveryBox").classList.contains("hidden");
    let secretInput = "";

    if (isRecoveryMode) {
      const rawRc = document.getElementById("recoveryCodeInput").value.trim();
      if (!rawRc) return alert("請輸入紙本恢復碼！");
      secretInput = Crypto.base32ToUint8(rawRc);
      if (secretInput.length !== 32) return alert("恢復碼長度非法 (需為 32 位元組 Base32)！");
    } else {
      secretInput = document.getElementById("passphrase").value;
      if (!secretInput) return alert("請輸入密語！");
    }

    try {
      const payload = await Crypto.decryptTier3Vault(secretInput, isRecoveryMode, memoryVault.tier3_vault_encrypted);
      document.getElementById("valDevicePin").innerText = payload.devicePin || "N/A";
      document.getElementById("valPrimaryEmail").innerText = payload.primaryEmail || "N/A";
      document.getElementById("valMasterNotes").innerText = payload.masterNotes || "N/A";

      document.getElementById("tier3LockSection").classList.add("hidden");
      document.getElementById("tier3ContentSection").classList.remove("hidden");
      document.getElementById("authErrorMsg").style.display = "none";
      document.getElementById("passphrase").value = "";
      document.getElementById("recoveryCodeInput").value = "";

      resetFails();
      startLockTimer(180);
    } catch (err) {
      const res = recordFail();
      const errMsg = document.getElementById("authErrorMsg");
      errMsg.style.display = "block";
      errMsg.innerText = res.locked 
        ? `⛔ 連續錯誤達 ${MAX_FAILS} 次，已鎖定 15 分鐘。`
        : `❌ 認證失敗 (${res.fails}/${MAX_FAILS})。密語或恢復碼不符。`;
    }
  }

  function lockTier3() {
    clearInterval(lockCountdown);
    document.getElementById("tier3LockSection").classList.remove("hidden");
    document.getElementById("tier3ContentSection").classList.add("hidden");
    document.getElementById("lockTimer").classList.add("hidden");
    document.getElementById("valDevicePin").innerText = "";
    document.getElementById("valPrimaryEmail").innerText = "";
    document.getElementById("valMasterNotes").innerText = "";
  }

  function startLockTimer(sec) {
    let r = sec;
    const badge = document.getElementById("lockTimer");
    badge.classList.remove("hidden");
    badge.innerText = `${I18N[currentLang].lockTimer}: ${r}s`;
    clearInterval(lockCountdown);
    lockCountdown = setInterval(() => {
      r--;
      if (r <= 0) lockTier3();
      else badge.innerText = `${I18N[currentLang].lockTimer}: ${r}s`;
    }, 1000);
  }

  function saveEditorDraft() {
    sessionStorage.setItem("leavewell_editor_items", JSON.stringify(currentEditorItems));
  }

  function restoreEditorDraft() {
    const raw = sessionStorage.getItem("leavewell_editor_items");
    if (raw) {
      try {
        currentEditorItems = JSON.parse(raw);
        renderEditorItems();
      } catch (e) {}
    }
  }

  function refreshRecoveryCode() {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    generatedRecoveryCode = Crypto.uint8ToBase32(bytes);
    const chunks = generatedRecoveryCode.match(/.{1,5}/g) || [];
    document.getElementById("displayRecoveryCode").innerText = "RC-" + chunks.join("-");
    document.getElementById("chkRecoveryConfirmed").checked = false;
  }

  function renderEditorItems() {
    const box = document.getElementById("editorItemsList");
    box.innerHTML = "";
    currentEditorItems.forEach((it, idx) => {
      const d = document.createElement("div");
      d.style = "background:#0b0f19; padding:0.4rem; border-radius:4px; font-size:0.75rem; margin-bottom:0.25rem; display:flex; justify-content:space-between; align-items:center;";
      d.innerHTML = `
        <span>🏢 ${escapeHtml(it.company)} (${escapeHtml(it.type)}) - 👤 ${escapeHtml(it.agentName)}</span>
        <button style="min-width:40px; padding:2px 4px; background:#e11d48; color:white; border-radius:4px;" data-del="${idx}">刪除</button>
      `;
      box.appendChild(d);
    });
    box.querySelectorAll("[data-del]").forEach(b => {
      b.addEventListener("click", (e) => {
        const i = parseInt(e.target.getAttribute("data-del"), 10);
        currentEditorItems.splice(i, 1);
        renderEditorItems();
        saveEditorDraft();
      });
    });
  }

  function wipeEditorFields() {
    [
      "editPublicKeyHex", "editPrivateKeyHex", "editPassphrase", "editConfirmPassphrase",
      "editDevicePin", "editPrimaryEmail", "editMasterNotes",
      "inputCustomName", "inputCustomHotline", "inputAgentName", "inputAgentPhone",
      "inputPolicyNum", "inputFileLoc"
    ].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });

    document.getElementById("fingerprintPreview").innerText = "指紋: 待產生";
    document.getElementById("chkRecoveryConfirmed").checked = false;
    document.getElementById("editorInsurerSelect").selectedIndex = 0;
    document.getElementById("editorInsurerType").selectedIndex = 0;
    document.getElementById("editorCustomBox").classList.add("hidden");
    
    currentEditorItems = [];
    renderEditorItems();
    sessionStorage.removeItem("leavewell_editor_items");

    generatedRecoveryCode = "";
    document.getElementById("displayRecoveryCode").innerText = "尚未生成";
  }

  function loadExistingJsonToEditor(parsed) {
    try {
      Crypto.validateSchemaStrict(parsed);
      currentEditorItems = [];

      const t1 = parsed.tier1_public.insurance || [];
      const t2 = parsed.tier2_personal_signed.insurance || [];

      t1.forEach((it1, idx) => {
        const it2 = t2[idx] || {};
        currentEditorItems.push({
          company: it1.company,
          officialHotline: it1.officialHotline,
          officialApp: it1.officialApp,
          type: it1.type,
          agentName: it2.agentName || "",
          agentPhone: it2.agentPhone || "",
          policyNumber: it2.policyNumber || "",
          fileLocation: it2.fileLocation || ""
        });
      });

      renderEditorItems();
      saveEditorDraft();

      if (parsed.tier2_personal_signed.publicKeyHex) {
        document.getElementById("editPublicKeyHex").value = parsed.tier2_personal_signed.publicKeyHex;
        Crypto.computeFingerprint(parsed.tier2_personal_signed.publicKeyHex).then(fp => {
          document.getElementById("fingerprintPreview").innerText = "指紋: " + fp;
        });
      }
      alert("⚠️ 已載入舊檔至編輯器（此操作未經驗簽）。請確認各欄位內容正確無誤後再進行簽署！");
    } catch (e) {
      alert("載入舊檔失敗：" + e.message);
    }
  }

  async function signAndExportPackage() {
    const pubHex = document.getElementById("editPublicKeyHex").value.trim();
    const privHex = document.getElementById("editPrivateKeyHex").value.trim();
    const pass = document.getElementById("editPassphrase").value;
    const confirmPass = document.getElementById("editConfirmPassphrase").value;

    if (pubHex.length !== 64 || privHex.length !== 64) {
      return alert("公鑰與私鑰需為 64 個十六進位字元 (32 bytes)！");
    }

    const isMatch = await Crypto.verifyKeyPairMatch(pubHex, privHex);
    if (!isMatch) {
      return alert("⛔ 安全阻斷：公鑰與私鑰不匹配！簽名無法通過自我驗證，請重新檢查。");
    }

    if (!pass || pass.length < 12) return alert("主密語長度需至少 12 字元！");
    if (pass !== confirmPass) return alert("兩次輸入的主密語不相符！");
    if (currentEditorItems.length === 0) return alert("請至少加入一筆保單項目！");

    if (!document.getElementById("chkRecoveryConfirmed").checked) {
      return alert("⚠ 請先抄寫紙本恢復碼，並勾選「我已完整抄寫」確認框！");
    }

    try {
      const t1Data = currentEditorItems.map(it => ({
        company: it.company,
        officialHotline: it.officialHotline,
        officialApp: it.officialApp,
        type: it.type
      }));
      const t2Data = currentEditorItems.map(it => ({
        company: it.company,
        agentName: it.agentName,
        agentPhone: it.agentPhone,
        policyNumber: it.policyNumber,
        fileLocation: it.fileLocation
      }));

      const payloadToSign = Crypto.buildSignedPayload({ insurance: t1Data }, t2Data);
      const signatureHex = await Crypto.signEd25519(privHex, payloadToSign);

      const dek = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const dekIv = crypto.getRandomValues(new Uint8Array(12));
      const dataIv = crypto.getRandomValues(new Uint8Array(12));

      const meta = { app: "Family-Vault-Resilient", v: "3.5", kdf: "PBKDF2-SHA256", iter: Crypto.PBKDF2_ITER };
      const kekPass = await Crypto.deriveKEK(pass, salt, Crypto.PBKDF2_ITER);

      const wrapAad = new TextEncoder().encode(Crypto.canonicalStringify({ meta: meta, purpose: "dek-wrap" }));
      const wrappedDEK = await crypto.subtle.wrapKey("raw", dek, kekPass, { name: "AES-GCM", iv: dekIv, additionalData: wrapAad });

      const recBytes = Crypto.base32ToUint8(generatedRecoveryCode);
      const recSalt = crypto.getRandomValues(new Uint8Array(16));
      const recDekIv = crypto.getRandomValues(new Uint8Array(12));
      const kekRec = await Crypto.deriveKEK(recBytes, recSalt, Crypto.PBKDF2_ITER);
      const wrapRecAad = new TextEncoder().encode(Crypto.canonicalStringify({ meta: meta, purpose: "dek-recovery-wrap" }));
      const wrappedRecoveryDEK = await crypto.subtle.wrapKey("raw", dek, kekRec, { name: "AES-GCM", iv: recDekIv, additionalData: wrapRecAad });

      const secretData = {
        devicePin: document.getElementById("editDevicePin").value,
        primaryEmail: document.getElementById("editPrimaryEmail").value,
        masterNotes: document.getElementById("editMasterNotes").value
      };
      const dataAad = new TextEncoder().encode(Crypto.canonicalStringify({ meta: meta, purpose: "vault-data" }));
      const encryptedBuf = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: dataIv, additionalData: dataAad },
        dek,
        new TextEncoder().encode(JSON.stringify(secretData))
      );

      const fullPackage = {
        version: "3.5-tiered",
        appName: "LeaveWell",
        exportedAt: new Date().toISOString(),
        tier1_public: { insurance: t1Data },
        tier2_personal_signed: {
          publicKeyHex: pubHex,
          signature: signatureHex,
          insurance: t2Data
        },
        tier3_vault_encrypted: {
          meta: meta,
          salt: Array.from(salt),
          dekIv: Array.from(dekIv),
          wrappedDEK: Array.from(new Uint8Array(wrappedDEK)),
          recoverySalt: Array.from(recSalt),
          recoveryDekIv: Array.from(recDekIv),
          wrappedRecoveryDEK: Array.from(new Uint8Array(wrappedRecoveryDEK)),
          iv: Array.from(dataIv),
          data: Array.from(new Uint8Array(encryptedBuf))
        }
      };

      const blob = new Blob([JSON.stringify(fullPackage, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `LeaveWell-Vault-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);

      localStorage.setItem("vault_anchor_pub", pubHex);
      await updateAnchorUI();

      const fp = await Crypto.computeFingerprint(pubHex);
      wipeEditorFields();
      document.getElementById("editorModal").classList.add("hidden");

      alert(`🎉 留愛心安 ‧ 打包完成！\n簽署公鑰 SHA-256 指紋為：\n${fp}\n已自動設為本機信任錨。請妥善保存下載之 JSON 與紙本恢復碼。`);
    } catch (err) {
      alert("簽署過程發生錯誤：" + err.message);
    }
  }

  window.addEventListener("DOMContentLoaded", () => {
    const sel = document.getElementById("editorInsurerSelect");
    sel.innerHTML = '<option value="">-- 請選擇保險公司 --</option>';
    HK_INSURERS.forEach(i => sel.innerHTML += `<option value="${i.name}">${i.name}</option>`);
    sel.innerHTML += '<option value="__OTHER__">➕ 其他保險公司 (手動自填)</option>';

    sel.addEventListener("change", (e) => {
      const isOther = e.target.value === "__OTHER__";
      document.getElementById("editorCustomBox").classList.toggle("hidden", !isOther);
    });

    document.getElementById("btnLangZh").addEventListener("click", () => setLanguage("zh"));
    document.getElementById("btnLangEn").addEventListener("click", () => setLanguage("en"));

    document.getElementById("btnResetAnchor").addEventListener("click", async () => {
      if (confirm("確定要重設本機信任錨？下次匯入檔案時將重新核對指紋。")) {
        localStorage.removeItem("vault_anchor_pub");
        await updateAnchorUI();
        alert("本機信任錨已清除。");
      }
    });

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

    document.getElementById("tabUsePass").addEventListener("click", () => {
      document.getElementById("modePassphraseBox").classList.remove("hidden");
      document.getElementById("modeRecoveryBox").classList.add("hidden");
      document.getElementById("tabUsePass").classList.add("active");
      document.getElementById("tabUseRecovery").classList.remove("active");
    });
    document.getElementById("tabUseRecovery").addEventListener("click", () => {
      document.getElementById("modePassphraseBox").classList.add("hidden");
      document.getElementById("modeRecoveryBox").classList.remove("hidden");
      document.getElementById("tabUsePass").classList.remove("active");
      document.getElementById("tabUseRecovery").classList.add("active");
    });

    document.getElementById("btnUnlockTier3").addEventListener("click", unlockTier3);
    document.getElementById("btnLockTier3").addEventListener("click", lockTier3);

    document.getElementById("btnOpenEditor").addEventListener("click", () => {
      document.getElementById("editorModal").classList.remove("hidden");
      restoreEditorDraft();
      if (!generatedRecoveryCode) refreshRecoveryCode();
    });
    document.getElementById("btnCloseEditor").addEventListener("click", () => {
      wipeEditorFields();
      document.getElementById("editorModal").classList.add("hidden");
    });

    document.getElementById("btnGenKeys").addEventListener("click", async () => {
      const kp = await Crypto.generateEd25519();
      document.getElementById("editPublicKeyHex").value = kp.pubHex;
      document.getElementById("editPrivateKeyHex").value = kp.privHex;
      const fp = await Crypto.computeFingerprint(kp.pubHex);
      document.getElementById("fingerprintPreview").innerText = "指紋: " + fp;
      alert("🔑 已生成全新 Ed25519 金鑰對！私鑰已填入本機簽署欄位。");
    });

    document.getElementById("btnWipeKeys").addEventListener("click", () => {
      document.getElementById("editPublicKeyHex").value = "";
      document.getElementById("editPrivateKeyHex").value = "";
      document.getElementById("fingerprintPreview").innerText = "指紋: 待產生";
    });

    document.getElementById("btnRefreshRecovery").addEventListener("click", () => {
      if (generatedRecoveryCode && !confirm("重新生成會使舊恢復碼永久作廢，確定要產生新恢復碼嗎？")) return;
      refreshRecoveryCode();
    });

    document.getElementById("btnEditorLoadExisting").addEventListener("click", () => document.getElementById("editorLoadFileInput").click());
    document.getElementById("editorLoadFileInput").addEventListener("change", (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = (evt) => {
        try {
          const p = JSON.parse(evt.target.result);
          loadExistingJsonToEditor(p);
        } catch (err) { alert("讀取舊檔失敗: " + err.message); }
        finally { e.target.value = ""; }
      };
      r.readAsText(f);
    });

    document.getElementById("btnAddInsuranceItem").addEventListener("click", () => {
      const selVal = document.getElementById("editorInsurerSelect").value;
      const typeVal = document.getElementById("editorInsurerType").value;
      let companyName = "", hotline = "", app = "";

      if (selVal === "__OTHER__") {
        companyName = document.getElementById("inputCustomName").value.trim();
        hotline = document.getElementById("inputCustomHotline").value.trim();
        app = "官方網站";
        if (!companyName || !hotline) return alert("請填寫自訂公司名稱與官方熱線！");
      } else if (selVal) {
        const found = HK_INSURERS.find(i => i.name === selVal);
        companyName = found.name;
        hotline = found.hotline;
        app = found.app;
      } else {
        return alert("請選擇保險公司！");
      }

      const agentName = document.getElementById("inputAgentName").value.trim() || "未指派";
      const agentPhone = document.getElementById("inputAgentPhone").value.trim() || hotline;
      const policyNum = document.getElementById("inputPolicyNum").value.trim() || "待查";
      const fileLoc = document.getElementById("inputFileLoc").value.trim() || "書房文件夾";

      currentEditorItems.push({
        company: companyName,
        officialHotline: hotline,
        officialApp: app,
        type: typeVal,
        agentName: agentName,
        agentPhone: agentPhone,
        policyNumber: policyNum,
        fileLocation: fileLoc
      });

      renderEditorItems();
      saveEditorDraft();
      document.getElementById("inputAgentName").value = "";
      document.getElementById("inputAgentPhone").value = "";
      document.getElementById("inputPolicyNum").value = "";
    });

    document.getElementById("btnSignExport").addEventListener("click", signAndExportPackage);

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        hiddenSince = Date.now();
      } else if (document.visibilityState === "visible") {
        if (hiddenSince && (Date.now() - hiddenSince > 60000)) {
          lockTier3();
          document.getElementById("editPrivateKeyHex").value = "";
          document.getElementById("editPassphrase").value = "";
          document.getElementById("editConfirmPassphrase").value = "";
        }
        hiddenSince = null;
      }
    });

    window.addEventListener("beforeunload", () => {
      memoryVault = null;
      sessionStorage.removeItem("leavewell_editor_items");
      lockTier3();
    });

    setLanguage(currentLang);
  });
})();
