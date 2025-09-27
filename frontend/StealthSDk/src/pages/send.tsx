import DefaultLayout from "@/layouts/default";
import { useState } from "react";
// Illustrative import — replace with your real SDK API if different
// import StealthSDK from "@scopelift/stealth-address-sdk";

export default function Send() {
  // form state
  const [amount, setAmount] = useState(0.1);
  const [receiver, setReceiver] = useState("");
  const [privacyLevel, setPrivacyLevel] = useState(1); // 0..3
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [stealthAddr, setStealthAddr] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const privacyLabels = ["Low", "Medium", "High", "Very High"];

  // const sdk = new StealthSDK({
  //   apiKey: process.env.NEXT_PUBLIC_STEALTH_KEY ?? undefined,
  // });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setTxHash(null);
    setStealthAddr(null);

    if (!receiver) {
      setError("Receiver address is required.");
      return;
    }
    if (amount < 0.1) {
      setError("Minimum amount to send is 0.1 vETH");
      return;
    }

    setBusy(true);
    setStatus("⚙️ Preparing transaction (mocked)...");

    try {
      // --- Commented SDK Integration ---
      // const generated = await sdk.generateStealthAddress({ receiver, entropy: privacyLevel });
      // if (!generated?.stealthAddress) throw new Error("Stealth SDK didn't return a stealth address.");
      // setStealthAddr(generated.stealthAddress);

      // const sendResult = await sdk.createStealthPayment({ to: generated.stealthAddress, amount, privacyLevel });
      // if (sendResult?.txHash) setTxHash(sendResult.txHash);

      // Mocked results for demo
      setTimeout(() => {
        setStealthAddr("0xMockedStealthAddress1234567890");
        setTxHash("0xMockedTransactionHash9876543210");
        setStatus("✅ Transaction simulated successfully.");
        setBusy(false);
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Unknown error while creating stealth payment.");
      setStatus(null);
      setBusy(false);
    }
  }

  function copyStealthAddr() {
    if (!stealthAddr) return;
    navigator.clipboard?.writeText(stealthAddr);
  }

  const sendDisabled = busy || !receiver || amount < 0.1;

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-10">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 border border-zinc-200 dark:border-zinc-800">
            <h1 className="text-3xl font-extrabold text-center text-zinc-800 dark:text-zinc-100">
              🔒 Private Transactions
            </h1>
            <p className="mt-3 text-center text-zinc-600 dark:text-zinc-400 text-sm">
              Protect your payments with stealth addresses and customizable privacy levels.
            </p>

            <form className="flex flex-col gap-6 mt-8" onSubmit={handleSubmit}>
              {/* Receiver */}
              <div>
                <label
                  htmlFor="receiver"
                  className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Receiver Address
                </label>
                <input
                  id="receiver"
                  type="text"
                  placeholder="0x123...abcd"
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  required
                />
              </div>

              {/* vETH Amount */}
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Amount (vETH)
                </label>
                <input
                  id="amount"
                  type="number"
                  placeholder="Enter vETH amount"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  min={0.1}
                  step={0.01}
                  required
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Minimum: <span className="font-medium">0.1 vETH</span>
                </p>
              </div>

              {/* Privacy Slider */}
              <div>
                <label
                  htmlFor="privacy"
                  className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Privacy Level:{" "}
                  <span className="font-semibold text-blue-600">
                    {privacyLabels[privacyLevel]}
                  </span>
                </label>
                <input
                  id="privacy"
                  type="range"
                  min={0}
                  max={3}
                  step={1}
                  value={privacyLevel}
                  onChange={(e) => setPrivacyLevel(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-zinc-500 mt-1">
                  {privacyLabels.map((label, i) => (
                    <span key={i}>{label}</span>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={sendDisabled}
                className={`w-full text-white font-semibold py-3 rounded-lg shadow-md flex items-center justify-center gap-2 transition
                  ${sendDisabled ? "bg-zinc-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {busy ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Processing...
                  </>
                ) : (
                  `Send ${amount} vETH with ${privacyLabels[privacyLevel]} Privacy`
                )}
              </button>
            </form>

            {/* Status / result pane */}
            <div className="mt-6 space-y-3">
              {status && (
                <div className="px-3 py-2 rounded bg-blue-50 dark:bg-zinc-800 text-blue-700 dark:text-blue-400 text-sm font-medium">
                  {status}
                </div>
              )}
              {error && (
                <div className="px-3 py-2 rounded bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium">
                  ❌ {error}
                </div>
              )}
              {stealthAddr && (
                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
                  <div className="text-xs text-zinc-500">Stealth Address</div>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-sm truncate">{stealthAddr}</span>
                    <button
                      onClick={copyStealthAddr}
                      className="ml-2 px-2 py-1 text-xs border rounded bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
              {txHash && (
                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-xs">
                  <span className="text-zinc-500">Tx Hash:</span>{" "}
                  <span className="font-mono">{txHash}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
