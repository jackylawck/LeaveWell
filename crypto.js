/**
 * crypto.js - 雙層架構密碼學核心 (純 AES-GCM-256 + PBKDF2 600k 疊代)
 */
window.LeaveWell = window.LeaveWell || {};

(function(exports) {
  "use strict";

  const PBKDF2_ITER = 600000;
  const ALLOWED_VERSIONS = new Set(["4.1-clue-tier"]);

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

  async function deriveKey(passphrase, salt, iterations) {
    const enc = new TextEncoder();
    const raw = enc.encode(passphrase.normalize("NFC"));
    const keyMaterial = await crypto.subtle.importKey("raw", raw, "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: salt, iterations: iterations, hash: "SHA-256" },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  async function encryptVault(secretData, passphrase) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const meta = { app: "LeaveWell-Vault", v: "4.1", kdf: "PBKDF2-SHA256", iter: PBKDF2_ITER };

    const aesKey = await deriveKey(passphrase, salt, PBKDF2_ITER);
    const dataAad = new TextEncoder().encode(canonicalStringify({ meta: meta, purpose: "vault-data" }));

    const encryptedBuf = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv, additionalData: dataAad },
      aesKey,
      new TextEncoder().encode(JSON.stringify(secretData))
    );

    return {
      meta: meta,
      salt: Array.from(salt),
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encryptedBuf))
    };
  }

  async function decryptVault(passphrase, secVault) {
    const salt = new Uint8Array(secVault.salt);
    const iv = new Uint8Array(secVault.iv);
    const aesKey = await deriveKey(passphrase, salt, secVault.meta.iter);

    const dataAad = new TextEncoder().encode(canonicalStringify({ meta: secVault.meta, purpose: "vault-data" }));
    const decryptedBuf = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv, additionalData: dataAad },
      aesKey,
      new Uint8Array(secVault.data)
    );

    return JSON.parse(new TextDecoder().decode(decryptedBuf));
  }

  exports.validateSchema = validateSchema;
  exports.encryptVault = encryptVault;
  exports.decryptVault = decryptVault;
})(window.LeaveWell.Crypto = {});
