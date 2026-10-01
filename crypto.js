/**
 * crypto.js - 雙層金庫密碼學核心 (AES-GCM-256 + PBKDF2 信封加密)
 */
window.LeaveWell = window.LeaveWell || {};

(function(exports) {
  "use strict";

  const PBKDF2_ITER = 600000;
  const ALLOWED_VERSIONS = new Set(["4.0-two-tier"]);
  const BASE32_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

  function uint8ToBase32(bytes) {
    let bits = 0, value = 0, output = '';
    for (let i = 0; i < bytes.length; i++) {
      value = (value << 8) | bytes[i];
      bits += 8;
      while (bits >= 5) {
        output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
        bits -= 5;
      }
    }
    if (bits > 0) output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
    return output;
  }

  function base32ToUint8(str) {
    const clean = str.toUpperCase().replace(/[^0-9A-Z]/g, '').replace(/O/g, '0').replace(/[IL]/g, '1');
    let bits = 0, value = 0;
    const bytes = [];
    for (let i = 0; i < clean.length; i++) {
      const idx = BASE32_ALPHABET.indexOf(clean[i]);
      if (idx === -1) continue;
      value = (value << 5) | idx;
      bits += 5;
      if (bits >= 8) {
        bytes.push((value >>> (bits - 8)) & 255);
        bits -= 8;
      }
    }
    return new Uint8Array(bytes);
  }

  function canonicalStringify(obj) {
    if (obj === null) return "null";
    if (typeof obj === "number") {
      if (!Number.isFinite(obj)) throw new Error("Invalid number");
      return Object.is(obj, -0) ? "0" : obj.toString();
    }
    if (typeof obj === "boolean") return obj ? "true" : "false";
    if (typeof obj === "string") return JSON.stringify(obj.normalize("NFC"));
    if (Array.isArray(obj)) return "[" + obj.map(canonicalStringify).join(",") + "]";
    if (typeof obj === "object") {
      const sortedKeys = Object.keys(obj).sort();
      return "{" + sortedKeys.map(k => JSON.stringify(k.normalize("NFC")) + ":" + canonicalStringify(obj[k])).join(",") + "}";
    }
    throw new Error("Unsupported type");
  }

  function validateSchema(v) {
    if (!v || !ALLOWED_VERSIONS.has(v.version)) {
      throw new Error(`不支援或未知的備份格式版本：${v ? v.version : 'null'}`);
    }
    if (!v.public_directory || !Array.isArray(v.public_directory.insurers)) {
      throw new Error("第一層公開名冊格式損壞");
    }
    const sec = v.encrypted_vault;
    if (!sec || !sec.meta || sec.meta.app !== "LeaveWell-Vault") throw new Error("第二層金庫元資料損壞");
    if (!Array.isArray(sec.salt) || !Array.isArray(sec.iv) || !Array.isArray(sec.data)) {
      throw new Error("密文數據損壞");
    }
  }

  async function deriveKEK(secret, salt, iterations) {
    const enc = new TextEncoder();
    const raw = typeof secret === "string" ? enc.encode(secret.normalize("NFC")) : secret;
    const keyMaterial = await crypto.subtle.importKey("raw", raw, "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: salt, iterations: iterations, hash: "SHA-256" },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["unwrapKey", "wrapKey"]
    );
  }

  async function decryptVault(secretInput, isRecovery, secVault) {
    const salt = new Uint8Array(isRecovery ? secVault.recoverySalt : secVault.salt);
    const dekIv = new Uint8Array(isRecovery ? secVault.recoveryDekIv : secVault.dekIv);
    const wrappedDEK = new Uint8Array(isRecovery ? secVault.wrappedRecoveryDEK : secVault.wrappedDEK);

    const kek = await deriveKEK(secretInput, salt, secVault.meta.iter);
    const wrapAad = new TextEncoder().encode(canonicalStringify({ meta: secVault.meta, purpose: isRecovery ? "dek-rec-wrap" : "dek-wrap" }));

    const dek = await crypto.subtle.unwrapKey(
      "raw",
      wrappedDEK,
      kek,
      { name: "AES-GCM", iv: dekIv, additionalData: wrapAad },
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );

    const dataAad = new TextEncoder().encode(canonicalStringify({ meta: secVault.meta, purpose: "vault-data" }));
    const decryptedBuf = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(secVault.iv), additionalData: dataAad },
      dek,
      new Uint8Array(secVault.data)
    );

    return JSON.parse(new TextDecoder().decode(decryptedBuf));
  }

  async function encryptVault(secretData, passphrase, recoveryCodeStr) {
    const dek = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const dekIv = crypto.getRandomValues(new Uint8Array(12));
    const dataIv = crypto.getRandomValues(new Uint8Array(12));

    const meta = { app: "LeaveWell-Vault", v: "4.0", kdf: "PBKDF2-SHA256", iter: PBKDF2_ITER };
    const kekPass = await deriveKEK(passphrase, salt, PBKDF2_ITER);

    const wrapAad = new TextEncoder().encode(canonicalStringify({ meta: meta, purpose: "dek-wrap" }));
    const wrappedDEK = await crypto.subtle.wrapKey("raw", dek, kekPass, { name: "AES-GCM", iv: dekIv, additionalData: wrapAad });

    const recBytes = base32ToUint8(recoveryCodeStr);
    const recSalt = crypto.getRandomValues(new Uint8Array(16));
    const recDekIv = crypto.getRandomValues(new Uint8Array(12));
    const kekRec = await deriveKEK(recBytes, recSalt, PBKDF2_ITER);
    const wrapRecAad = new TextEncoder().encode(canonicalStringify({ meta: meta, purpose: "dek-rec-wrap" }));
    const wrappedRecoveryDEK = await crypto.subtle.wrapKey("raw", dek, kekRec, { name: "AES-GCM", iv: recDekIv, additionalData: wrapRecAad });

    const dataAad = new TextEncoder().encode(canonicalStringify({ meta: meta, purpose: "vault-data" }));
    const encryptedBuf = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: dataIv, additionalData: dataAad },
      dek,
      new TextEncoder().encode(JSON.stringify(secretData))
    );

    return {
      meta: meta,
      salt: Array.from(salt),
      dekIv: Array.from(dekIv),
      wrappedDEK: Array.from(new Uint8Array(wrappedDEK)),
      recoverySalt: Array.from(recSalt),
      recoveryDekIv: Array.from(recDekIv),
      wrappedRecoveryDEK: Array.from(new Uint8Array(wrappedRecoveryDEK)),
      iv: Array.from(dataIv),
      data: Array.from(new Uint8Array(encryptedBuf))
    };
  }

  exports.uint8ToBase32 = uint8ToBase32;
  exports.base32ToUint8 = base32ToUint8;
  exports.validateSchema = validateSchema;
  exports.decryptVault = decryptVault;
  exports.encryptVault = encryptVault;
})(window.LeaveWell.Crypto = {});
