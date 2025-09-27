// src/pages/send-elliptic.tsx
import { useState } from "react";
import { computeAddress } from 'ethers/lib/utils';
import { arrayify } from "@ethersproject/bytes";
import { keccak256 } from "@ethersproject/keccak256";
import elliptic from "elliptic";
import BN from "bn.js";

/**
 * Uses elliptic (secp256k1) + ethers for address derivation.
 * Install: npm i elliptic bn.js ethers @ethersproject/bytes @ethersproject/keccak256
 */

const EC = elliptic.ec;
const ec = new EC("secp256k1");

// curve order n
const CURVE_N = new BN(
  "fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",
  16
);

function strip0x(s: string) {
  return s.startsWith("0x") ? s.slice(2) : s;
}
function norm0x(s: string) {
  if (!s) throw new Error("empty");
  return s.startsWith("0x") ? s.toLowerCase() : "0x" + s.toLowerCase();
}
function bytesToHex(u8: Uint8Array) {
  return Array.from(u8).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Deterministic (insecure) private key from address for demo only */
function deterministicPrivFromAddress(address: string) {
  const a = address.trim().toLowerCase();
  const hex = keccak256(a.startsWith("0x") ? a : "0x" + a); // 0x...
  let bi = new BN(strip0x(hex), 16).mod(CURVE_N);
  if (bi.isZero()) bi = bi.add(new BN(1));
  return "0x" + bi.toString(16).padStart(64, "0");
}

/** parse a public key (compressed or uncompressed) into elliptic Point */
function parsePubkeyHex(pubHex: string) {
  const h = strip0x(pubHex);
  // elliptic accepts hex with prefix or without; use ec.keyFromPublic
  try {
    const key = ec.keyFromPublic(h, "hex");
    return key.getPublic();
  } catch (e) {
    throw new Error("Invalid public key hex format");
  }
}

/** derive spend & view public points from main public key */
function deriveSpendViewFromMainPub(mainPubHex: string) {
  const mainPub = parsePubkeyHex(mainPubHex);

  // H("spend" || mainPub) and H("view" || mainPub)
  const enc = new TextEncoder();
  const mainBytes = arrayify(norm0x(mainPubHex));
  const spendHash = keccak256(concatBytes([enc.encode("spend"), mainBytes])); // 0x...
  const viewHash = keccak256(concatBytes([enc.encode("view"), mainBytes]));

  const dSpend = new BN(strip0x(spendHash), 16).mod(CURVE_N);
  const dView = new BN(strip0x(viewHash), 16).mod(CURVE_N);
  if (dSpend.isZero() || dView.isZero()) throw new Error("derived zero scalar (very unlikely)");

  const derivedSpendPoint = ec.g.mul(dSpend);
  const derivedViewPoint = ec.g.mul(dView);

  const spendPoint = mainPub.add(derivedSpendPoint);
  const viewPoint = mainPub.add(derivedViewPoint);

  return {
    spendPubUncompressedHex: "0x04" + spendPoint.encode("hex", false).slice(2), // ensure 0x04...
    spendPubCompressedHex: "0x" + spendPoint.encodeCompressed("hex"),
    viewPubUncompressedHex: "0x04" + viewPoint.encode("hex", false).slice(2),
    viewPubCompressedHex: "0x" + viewPoint.encodeCompressed("hex"),
  };
}

/** helper concatenate Uint8Array pieces */
function concatBytes(parts: Uint8Array[]) {
  const out = new Uint8Array(parts.reduce((s, p) => s + p.length, 0));
  let off = 0;
  for (const p of parts) {
    out.set(p, off);
    off += p.length;
  }
  return out;
}

/** generate ephemeral keypair */
function generateEphemeral() {
  const key = ec.genKeyPair();
  const privBN = key.getPrivate(); // BN
  const privHex = privBN.toString(16).padStart(64, "0");
  const pubCompressed = key.getPublic().encodeCompressed("hex"); // 02/03...
  return {
    ephemeralPrivHex: "0x" + privHex,
    ephemeralPubHex: "0x" + pubCompressed,
    ephemeralPrivBN: privBN,
  };
}

/** ECDH shared: ephemeralPriv * viewPubPoint -> point; then keccak on compressed/uncompressed bytes */
function computeSharedScalar(ephemeralPrivBN: BN, viewPubPoint: elliptic.ec.Point) {
  const sharedPoint = viewPubPoint.mul(ephemeralPrivBN); // point
  // take compressed x/y bytes -> use uncompressed bytes for keccak
  const rawUncompressedHex = "04" + sharedPoint.encode("hex", false).slice(2);
  const sharedBytes = arrayify("0x" + rawUncompressedHex);
  const hash = keccak256(sharedBytes); // 0x...
  const scalarBN = new BN(strip0x(hash), 16).mod(CURVE_N);
  if (scalarBN.isZero()) throw new Error("derived scalar == 0");
  return scalarBN;
}

/** main generator: derive stealth address */
function generateStealthFromMainKey(mainPubOrAddress: string, useDeterministicFromAddress = false) {
  // if input looks like an address and user wants demo, derive demo private & pub
  let mainPubHex = mainPubOrAddress.trim();
  const maybeAddr = mainPubHex.startsWith("0x") ? mainPubHex : "0x" + mainPubHex;
  const isAddress = strip0x(maybeAddr).length === 40;
  if (isAddress && useDeterministicFromAddress) {
    // produce demo private from address and derive pub
    const demoPriv = deterministicPrivFromAddress(maybeAddr);
    const demoPubPoint = ec.keyFromPrivate(strip0x(demoPriv), "hex").getPublic();
    mainPubHex = "0x04" + demoPubPoint.encode("hex", false).slice(2);
  }

  // validate mainPubHex is now a pubkey
  const mainPoint = parsePubkeyHex(mainPubHex);

  // derive spend/view pubkeys
  const { spendPubUncompressedHex, viewPubUncompressedHex, spendPubCompressedHex, viewPubCompressedHex } =
    deriveSpendViewFromMainPub(mainPubHex);

  // ephemeral
  const ep = generateEphemeral();

  // compute shared scalar: ephemeralPriv * viewPub
  const viewPoint = parsePubkeyHex(viewPubUncompressedHex);
  const scalarBN = computeSharedScalar(ep.ephemeralPrivBN, viewPoint);

  // stealth point = spendPoint + scalar * G
  const spendPoint = parsePubkeyHex(spendPubUncompressedHex);
  const derivedPoint = ec.g.mul(scalarBN);
  const stealthPoint = spendPoint.add(derivedPoint);

  const stealthPubUncompHex = "0x04" + stealthPoint.encode("hex", false).slice(2);
  const stealthPubCompHex = "0x" + stealthPoint.encodeCompressed("hex");
  const stealthEthAddress = computeAddress(stealthPubUncompHex);

  return {
    stealthEthAddress,
    stealthPubUncompHex,
    stealthPubCompHex,
    ephemeralPubHex: ep.ephemeralPubHex,
    ephemeralPrivHex: ep.ephemeralPrivHex,
    spendPubCompressedHex,
    viewPubCompressedHex,
  };
}

/* ---------------- SIMPLE UI (minimal) ---------------- */

export default function SendEllipticPage() {
  const [input, setInput] = useState("");
  const [demoFromAddress, setDemoFromAddress] = useState(true); // if address input, derive demo keypair
  const [result, setResult] = useState<any | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function handleGenerate() {
    setErr(null);
    setResult(null);
    try {
      if (!input) throw new Error("Enter recipient public key or address");
      const out = generateStealthFromMainKey(input, demoFromAddress);
      setResult(out);
    } catch (e: any) {
      setErr(String(e?.message ?? e));
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "Inter, Arial" }}>
      <h3>Stealth (elliptic) — minimal demo</h3>

      <div style={{ marginTop: 12 }}>
        <input
          placeholder="Recipient pubkey (0x04... or 0x02/0x03...) or address"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: 520, padding: 8 }}
        />
      </div>

      <div style={{ marginTop: 8 }}>
        <label style={{ marginRight: 8 }}>
          <input type="checkbox" checked={demoFromAddress} onChange={(e) => setDemoFromAddress(e.target.checked)} />{" "}
          If you pasted an address, derive demo keypair (DEMO ONLY)
        </label>
      </div>

      <div style={{ marginTop: 8 }}>
        <button onClick={handleGenerate} style={{ padding: "8px 16px" }}>
          Generate Stealth Address
        </button>
      </div>

      {err && <div style={{ color: "red", marginTop: 12 }}>❌ {err}</div>}

      {result && (
        <div style={{ marginTop: 12, background: "#f6f7f9", padding: 12, borderRadius: 8, maxWidth: 760 }}>
          <div><strong>Stealth ETH Address:</strong> {result.stealthEthAddress}</div>
          <div style={{ marginTop: 6 }}><strong>Ephemeral Pub (announce):</strong> {result.ephemeralPubHex}</div>
          <div style={{ marginTop: 6 }}><strong>Ephemeral Priv (keep secret):</strong> {result.ephemeralPrivHex}</div>
          <div style={{ marginTop: 6 }}><strong>Derived Spend Pub (compressed):</strong> {result.spendPubCompressedHex}</div>
          <div style={{ marginTop: 6 }}><strong>Derived View Pub (compressed):</strong> {result.viewPubCompressedHex}</div>
        </div>
      )}
    </div>
  );
}