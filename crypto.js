/**
 * crypto.js - 核心密碼學設施 (v3.5.1)
 */
window.LeaveWell = window.LeaveWell || {};

(function(exports) {
  "use strict";

  const PBKDF2_ITER = 600000;
  const ALLOWED_VERSIONS = new Set(["3.1-tiered", "3.2-tiered", "3.3-tiered", "3.4-tiered", "3.5-tiered"]);
  const ALLOWED_META_VERSIONS = new Set(["3.5", 35]);
  const BASE32_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

  function hexToUint8(hexString) {
    if (!hexString || hexString.length % 2 !== 0) return new Uint8Array();
    const matches = hexString.match(/.{1,2}/g) || [];
    return new Uint8Array(matches.map(b => parseInt(b, 16)));
  }

  function uint8ToHex(bytes) {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function base64urlToUint8(base64url) {
    let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    const bin = atob(base64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return arr;
  }

  // SHA-256 密碼學指紋 (前 16 Hex 字元 = 64 bits 熵)
  async function computeFingerprint(pubHex) {
    if (!pubHex || pubHex.length !== 64) return "UNKNOWN";
    const pubBytes = hexToUint8(pubHex);
    const hashBuf = await crypto.subtle.digest("SHA-256", pubBytes);
    const hashHex = uint8ToHex(new Uint8Array(hashBuf));
    return (
      hashHex.slice(0, 4) + "-" +
      hashHex.slice(4, 8) + "-" +
      hashHex.slice(8, 12) + "-" +
      hashHex.slice(12, 16)
    ).toUpperCase();
  }

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

  // RFC 8785 Canonical JSON (正規化 -0、Unicode NFC、排除 NaN/undefined)
  function canonicalStringify(obj) {
    if (obj === null) return "null";
    if (typeof obj === "number") {
      if (!Number.isFinite(obj)) throw new Error("Invalid number: NaN or Infinity prohibited");
      if (Object.is(obj, -0)) return "0";
      return obj.toString();
    }
    if (typeof obj === "boolean") return obj ? "true" : "false";
    if (typeof obj === "string") return JSON.stringify(obj.normalize("NFC"));
    if (typeof obj === "undefined") throw new Error("Invalid type: undefined prohibited in JSON");
    if (Array.isArray(obj)) return "[" + obj.map(canonicalStringify).join(",") + "]";
    if (typeof obj === "object") {
      const sortedKeys = Object.keys(obj).sort();
      const pairs = sortedKeys.map(k => JSON.stringify(k.normalize("NFC")) + ":" + canonicalStringify(obj[k]));
      return "{" + pairs.join(",") + "}";
    }
    throw new Error("Unsupported type for serialization");
  }

  function buildSignedPayload(tier1Public, tier2Insurance) {
    return { t1: tier1Public, insurance: tier2Insurance };
  }

  function assertByteArray(arr, len, name) {
    if (!Array.isArray(arr) || arr.length !== len) throw new Error(`${name} length invalid. Expected ${len}`);
    for (const b of arr) {
      if (!Number.isInteger(b) || b < 0 || b > 255) throw new Error(`${name} contains invalid byte value`);
    }
  }

  function validateSchemaStrict(v) {
    if (!v || !ALLOWED_VERSIONS.has(v.version)) {
      throw new Error(`不支援或未知的版本：${v ? v.version : 'null'}`);
    }
    if (v.appName && v.appName !== "LeaveWell") {
      throw new Error(`非 LeaveWell 相容檔案：${v.appName}`);
    }
    if (!v.tier1_public || !Array.isArray(v.tier1_public.insurance)) throw new Error("Tier 1 corrupt");
    
    const t2 = v.tier2_personal_signed;
    if (!t2 || typeof t2.signature !== "string" || t2.signature.length !== 128) throw new Error("Tier 2 signature invalid");
    if (!t2.publicKeyHex || t2.publicKeyHex.length !== 64) throw new Error("Tier 2 public key invalid");
    if (!Array.isArray(t2.insurance)) throw new Error("Tier 2 insurance array missing");

    const t3 = v.tier3_vault_encrypted;
    if (!t3 || !t3.meta || t3.meta.app !== "Family-Vault-Resilient") throw new Error("Tier 3 meta corrupt");
    if (!ALLOWED_META_VERSIONS.has(t3.meta.v)) {
      throw new Error(`不支援的加密元資料版本：${t3.meta.v}`);
    }
    if (!Number.isInteger(t3.meta.iter) || t3.meta.iter < 600000) throw new Error("PBKDF2 iteration below 600k");

    assertByteArray(t3.salt, 16, "salt");
    assertByteArray(t3.iv, 12, "iv");
    assertByteArray(t3.dekIv, 12, "dekIv");
    assertByteArray(t3.wrappedDEK, 48, "wrappedDEK");
    if (t3.wrappedRecoveryDEK) {
      assertByteArray(t3.recoverySalt, 16, "recoverySalt");
      assertByteArray(t3.recoveryDekIv, 12, "recoveryDekIv");
      assertByteArray(t3.wrappedRecoveryDEK, 48, "wrappedRecoveryDEK");
    }
    if (!Array.isArray(t3.data) || t3.data.length < 16) throw new Error("Tier 3 ciphertext corrupt");
  }

  // 跨瀏覽器穩健生成 Ed25519 (JWK d 參數)
  async function generateEd25519() {
    const kp = await crypto.subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"]);
    const pub = await crypto.subtle.exportKey("raw", kp.publicKey);
    const jwkPriv = await crypto.subtle.exportKey("jwk", kp.privateKey);
    const rawSeed = base64urlToUint8(jwkPriv.d);
    if (rawSeed.length !== 32) throw new Error("Ed25519 seed extraction failed");
    return {
      pubHex: uint8ToHex(new Uint8Array(pub)),
      privHex: uint8ToHex(rawSeed)
    };
  }

  async function signEd25519(privSeedHex, payload) {
    const seed = hexToUint8(privSeedHex);
    if (seed.length !== 32) throw new Error("Private key must be 32 bytes");
    const pkcs8Prefix = hexToUint8("302e020100300506032b657004220420");
    const fullPkcs8 = new Uint8Array(48);
    fullPkcs8.set(pkcs8Prefix, 0);
    fullPkcs8.set(seed, 16);

    const privKey = await crypto.subtle.importKey("pkcs8", fullPkcs8, { name: "Ed25519" }, false, ["sign"]);
    const bytes = new TextEncoder().encode(canonicalStringify(payload));
    const sig = await crypto.subtle.sign("Ed25519", privKey, bytes);
    return uint8ToHex(new Uint8Array(sig));
  }

  async function verifyEd25519(pubHex, sigHex, payload) {
    const pub = hexToUint8(pubHex);
    const sig = hexToUint8(sigHex);
    if (pub.length !== 32 || sig.length !== 64) return false;
    try {
      const pubKey = await crypto.subtle.importKey("raw", pub, { name: "Ed25519" }, false, ["verify"]);
      const bytes = new TextEncoder().encode(canonicalStringify(payload));
      return await crypto.subtle.verify("Ed25519", pubKey, sig, bytes);
    } catch (e) {
      return false;
    }
  }

  async function verifyKeyPairMatch(pubHex, privHex) {
    try {
      const testPayload = { testProbe: Date.now() };
      const sig = await signEd25519(privHex, testPayload);
      return await verifyEd25519(pubHex, sig, testPayload);
    } catch (e) {
      return false;
    }
  }

  async function deriveKEK(secret, salt, iterations) {
    const enc = new TextEncoder();
    const rawSecret = typeof secret === "string" ? enc.encode(secret.normalize("NFC")) : secret;
    const keyMaterial = await crypto.subtle.importKey("raw", rawSecret, "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: salt, iterations: iterations, hash: "SHA-256" },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["unwrapKey", "wrapKey"]
    );
  }

  async function decryptTier3Vault(secretInput, isRecovery, t3) {
    const salt = new Uint8Array(isRecovery ? t3.recoverySalt : t3.salt);
    const dekIv = new Uint8Array(isRecovery ? t3.recoveryDekIv : t3.dekIv);
    const wrappedDEK = new Uint8Array(isRecovery ? t3.wrappedRecoveryDEK : t3.wrappedDEK);

    const kek = await deriveKEK(secretInput, salt, t3.meta.iter);
    const wrapAad = new TextEncoder().encode(canonicalStringify({ meta: t3.meta, purpose: isRecovery ? "dek-recovery-wrap" : "dek-wrap" }));

    const dek = await crypto.subtle.unwrapKey(
      "raw",
      wrappedDEK,
      kek,
      { name: "AES-GCM", iv: dekIv, additionalData: wrapAad },
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );

    const dataAad = new TextEncoder().encode(canonicalStringify({ meta: t3.meta, purpose: "vault-data" }));
    const decryptedBuf = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(t3.iv), additionalData: dataAad },
      dek,
      new Uint8Array(t3.data)
    );

    return JSON.parse(new TextDecoder().decode(decryptedBuf));
  }

  exports.PBKDF2_ITER = PBKDF2_ITER;
  exports.computeFingerprint = computeFingerprint;
  exports.uint8ToBase32 = uint8ToBase32;
  exports.base32ToUint8 = base32ToUint8;
  exports.canonicalStringify = canonicalStringify;
  exports.buildSignedPayload = buildSignedPayload;
  exports.validateSchemaStrict = validateSchemaStrict;
  exports.generateEd25519 = generateEd25519;
  exports.signEd25519 = signEd25519;
  exports.verifyEd25519 = verifyEd25519;
  exports.verifyKeyPairMatch = verifyKeyPairMatch;
  exports.deriveKEK = deriveKEK;
  exports.decryptTier3Vault = decryptTier3Vault;
})(window.LeaveWell.Crypto = {});
