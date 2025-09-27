import { useState } from "react";
import { computeAddress } from "ethers/lib/utils";
import { arrayify } from "@ethersproject/bytes";
import { keccak256 } from "@ethersproject/keccak256";
import elliptic from "elliptic";
import BN from "bn.js";
import {
  PaperAirplaneIcon,
  ShieldCheckIcon,
  DocumentDuplicateIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import DefaultLayout from "@/layouts/default";

/* ------------------- ELLIPTIC STEALTH LOGIC ------------------- */
const EC = elliptic.ec;
const ec = new EC("secp256k1");
const CURVE_N = new BN(
  "fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",
  16
);
function strip0x(s: string) { return s.startsWith("0x") ? s.slice(2) : s; }
function norm0x(s: string) { return s.startsWith("0x") ? s.toLowerCase() : "0x" + s.toLowerCase(); }
function concatBytes(parts: Uint8Array[]) {
  const out = new Uint8Array(parts.reduce((s, p) => s + p.length, 0));
  let off = 0; for (const p of parts) { out.set(p, off); off += p.length; }
  return out;
}
function deterministicPrivFromAddress(address: string) {
  const hex = keccak256(address.startsWith("0x") ? address : "0x" + address);
  let bi = new BN(strip0x(hex), 16).mod(CURVE_N);
  if (bi.isZero()) bi = bi.add(new BN(1));
  return "0x" + bi.toString(16).padStart(64, "0");
}
function parsePubkeyHex(pubHex: string) {
  try { return ec.keyFromPublic(strip0x(pubHex), "hex").getPublic(); }
  catch { throw new Error("Invalid public key hex"); }
}
function deriveSpendViewFromMainPub(mainPubHex: string) {
  const mainPub = parsePubkeyHex(mainPubHex);
  const enc = new TextEncoder();
  const mainBytes = arrayify(norm0x(mainPubHex));
  const spendHash = keccak256(concatBytes([enc.encode("spend"), mainBytes]));
  const viewHash = keccak256(concatBytes([enc.encode("view"), mainBytes]));
  const dSpend = new BN(strip0x(spendHash), 16).mod(CURVE_N);
  const dView = new BN(strip0x(viewHash), 16).mod(CURVE_N);
  const spendPoint = mainPub.add(ec.g.mul(dSpend));
  const viewPoint = mainPub.add(ec.g.mul(dView));
  return {
    spendPubUncompressedHex: "0x04" + spendPoint.encode("hex", false).slice(2),
    spendPubCompressedHex: "0x" + spendPoint.encodeCompressed("hex"),
    viewPubUncompressedHex: "0x04" + viewPoint.encode("hex", false).slice(2),
    viewPubCompressedHex: "0x" + viewPoint.encodeCompressed("hex"),
  };
}
function generateEphemeral() {
  const key = ec.genKeyPair();
  const privBN = key.getPrivate();
  return {
    ephemeralPrivHex: "0x" + privBN.toString(16).padStart(64, "0"),
    ephemeralPubHex: "0x" + key.getPublic().encodeCompressed("hex"),
    ephemeralPrivBN: privBN,
  };
}
function computeSharedScalar(ephemeralPrivBN: BN, viewPubPoint: elliptic.ec.Point) {
  const sharedPoint = viewPubPoint.mul(ephemeralPrivBN);
  const rawUncompressedHex = "04" + sharedPoint.encode("hex", false).slice(2);
  return new BN(strip0x(keccak256(arrayify("0x" + rawUncompressedHex))), 16).mod(CURVE_N);
}
function generateStealthFromMainKey(mainPubOrAddress: string, useDeterministicFromAddress = true) {
  let mainPubHex = mainPubOrAddress.trim();
  const maybeAddr = mainPubHex.startsWith("0x") ? mainPubHex : "0x" + mainPubHex;
  if (strip0x(maybeAddr).length === 40 && useDeterministicFromAddress) {
    const demoPriv = deterministicPrivFromAddress(maybeAddr);
    const demoPubPoint = ec.keyFromPrivate(strip0x(demoPriv), "hex").getPublic();
    mainPubHex = "0x04" + demoPubPoint.encode("hex", false).slice(2);
  }
  const { spendPubUncompressedHex, spendPubCompressedHex, viewPubUncompressedHex, viewPubCompressedHex } =
    deriveSpendViewFromMainPub(mainPubHex);
  const ep = generateEphemeral();
  const scalarBN = computeSharedScalar(ep.ephemeralPrivBN, parsePubkeyHex(viewPubUncompressedHex));
  const stealthPoint = parsePubkeyHex(spendPubUncompressedHex).add(ec.g.mul(scalarBN));
  const stealthPubUncompHex = "0x04" + stealthPoint.encode("hex", false).slice(2);
  return {
    stealthEthAddress: computeAddress(stealthPubUncompHex),
    stealthPubUncompHex,
    stealthPubCompHex: "0x" + stealthPoint.encodeCompressed("hex"),
    ephemeralPubHex: ep.ephemeralPubHex,
    ephemeralPrivHex: ep.ephemeralPrivHex,
    spendPubCompressedHex,
    viewPubCompressedHex,
  };
}

/* ------------------- REACT UI ------------------- */
export default function SendEllipticUI() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [stealthResult, setStealthResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = () => setIsConnected(!isConnected);
  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  const handleGenerateStealth = () => {
    setError(null);
    try {
      if (!recipient) throw new Error("Enter recipient pubkey or address");
      const result = generateStealthFromMainKey(recipient, true);
      setStealthResult(result);
    } catch (e: any) { setError(e.message ?? String(e)); }
  };

  const handleSendPayment = () => {
    if (!stealthResult || !amount) return alert("Generate stealth address and enter amount first!");
    console.log("Sending payment:", { to: stealthResult.stealthEthAddress, amount });
    alert(`Payment of ${amount} ETH to ${stealthResult.stealthEthAddress} triggered (demo)`);
  };

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gray-950">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <ShieldCheckIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">StealthPay</h1>
                <p className="text-xs text-gray-400">Privacy Protocol</p>
              </div>
            </div>
            <button
              onClick={handleConnect}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${isConnected ? "bg-gray-800 text-gray-300" : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
            >
              <WalletIcon className="w-4 h-4" />
              {isConnected ? "0x...7a9b" : "Connect Wallet"}
            </button>
          </div>

          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
                <PaperAirplaneIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Send Payment</h2>
              <p className="text-gray-400">Send anonymous payments using stealth addresses</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 space-y-4">
              <input
                type="text"
                placeholder="Recipient pubkey or address"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              />
              <button
                onClick={handleGenerateStealth}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold"
              >
                Generate Stealth Address
              </button>

              {error && <div className="text-red-500">{error}</div>}

              {stealthResult && (
                <div className="bg-gray-800/50 border border-gray-700 p-3 rounded-xl text-gray-300 space-y-1">
                  <div>
                    <strong>Stealth ETH Address:</strong> {stealthResult.stealthEthAddress}
                    <button onClick={() => copyToClipboard(stealthResult.stealthEthAddress)} className="ml-2 text-gray-400 hover:text-white">
                      <DocumentDuplicateIcon className="w-4 h-4 inline" />
                    </button>
                  </div>
                  <div><strong>Ephemeral Pub:</strong> {stealthResult.ephemeralPubHex}</div>
                  {/* <div><strong>Ephemeral Priv:</strong> {stealthResult.ephemeralPrivHex}</div>
                  <div><strong>Derived Spend Pub:</strong> {stealthResult.spendPubCompressedHex}</div>
                  <div><strong>Derived View Pub:</strong> {stealthResult.viewPubCompressedHex}</div> */}
                </div>
              )}

              <input
                type="number"
                placeholder="Amount (ETH)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              />

              <div className="flex gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <ExclamationTriangleIcon className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-amber-400 font-medium mb-1">Privacy Notice</p>
                  <p className="text-gray-300">This transaction uses stealth addresses for complete anonymity.</p>
                </div>
              </div>

              <button
                onClick={handleSendPayment}
                disabled={!isConnected || !stealthResult || !amount}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-xl transition-colors"
              >
                Send Anonymous Payment
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}