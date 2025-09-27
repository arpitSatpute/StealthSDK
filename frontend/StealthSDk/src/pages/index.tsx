import DefaultLayout from "@/layouts/default";
import { motion } from "framer-motion";

// Animation presets
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.8, ease: "easeOut" },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay, duration: 0.8, ease: "easeOut" },
});

export default function IndexPage() {
  return (
    <DefaultLayout>
      <div className="min-h-screen bg-black text-gray-100">
        {/* ================= HERO SECTION ================= */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <motion.h1
            {...fadeUp(0)}
            className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-gray-200 to-gray-500 bg-clip-text text-transparent"
          >
            StealthSDK
          </motion.h1>

          <motion.p
            {...fadeUp(0.3)}
            className="text-xl md:text-2xl text-gray-400 max-w-3xl leading-relaxed"
          >
            Private, auditable, and compliant payments on EVM chains.  
            A developer-first SDK balancing{" "}
            <span className="text-gray-200">privacy</span>,{" "}
            <span className="text-gray-200">compliance</span>, and{" "}
            <span className="text-gray-200">usability</span>.
          </motion.p>

          <motion.button
            {...fadeUp(0.6)}
            className="mt-10 px-10 py-4 rounded-2xl bg-gradient-to-r from-gray-800 to-gray-700 text-gray-100 shadow-lg hover:shadow-gray-800/50 transition text-lg"
          >
            Get Started
          </motion.button>
        </section>

        {/* ================= PROBLEM SECTION ================= */}
        <section className="min-h-screen flex items-center px-8 py-20">
          <div className="max-w-5xl mx-auto">
            <motion.h2
              {...fadeUp(0)}
              className="text-4xl font-bold mb-6 text-gray-100"
            >
              The Problem
            </motion.h2>

            <motion.p
              {...fadeUp(0.2)}
              className="text-lg text-gray-400 mb-8 leading-relaxed"
            >
              Blockchain payments today suffer from a fundamental trade-off:
              either you settle for{" "}
              <span className="text-gray-200">full transparency</span>,
              compromising user confidentiality, or you use{" "}
              <span className="text-gray-200">privacy mixers</span>, which face
              regulatory crackdowns.  
              Businesses, developers, and institutions lack a system that is{" "}
              <span className="text-gray-200">private, auditable, and compliant</span>.
            </motion.p>

            <motion.div
              {...fadeUp(0.4)}
              className="grid md:grid-cols-2 gap-8 mt-10"
            >
              <div className="p-6 rounded-2xl bg-gray-900 shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">
                  Transparency Problem
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Public blockchains expose sender–receiver links.  
                  Competitors, bots, and even malicious actors can track flows, 
                  break confidentiality, and compromise business strategies.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-gray-900 shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">
                  Privacy Tool Problem
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Mixers and tumblers obscure flows but fail compliance.  
                  They are blacklisted, regulated, or banned—leaving users in legal uncertainty.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= SOLUTION SECTION ================= */}
        <section className="min-h-screen flex items-center px-8 py-20 bg-gradient-to-b from-black to-gray-950">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h2
              {...fadeUp(0)}
              className="text-4xl font-bold mb-6 text-gray-100"
            >
              The Solution — StealthSDK
            </motion.h2>
            <motion.p
              {...fadeUp(0.3)}
              className="text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto mb-12"
            >
              StealthSDK introduces a new standard for payments:{" "}
              <span className="text-gray-200">private yet auditable</span>.  
              It empowers developers to integrate compliant stealth transactions
              with a single line of code—abstracting cryptography, key management, 
              and settlement behind a simple API.
            </motion.p>

            <motion.div
              {...fadeUp(0.6)}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {[
                {
                  title: "One-line Integration",
                  desc: "Stripe-like simplicity with blockchain-grade privacy.",
                },
                {
                  title: "Four-layer Privacy Pool",
                  desc: "AI-assisted fragmentation splits and redistributes funds.",
                },
                {
                  title: "zk-KYC",
                  desc: "Users are verified without exposing their identity on-chain.",
                },
                {
                  title: "Encrypted Audit Trail",
                  desc: "2-of-3 guardian multisig unlocks compliance when required.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-gray-900 shadow-lg hover:shadow-gray-800/50 transition"
                >
                  <h3 className="text-xl font-semibold mb-3 text-gray-200">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="min-h-screen flex items-center px-8 py-20">
          <div className="max-w-5xl mx-auto">
            <motion.h2
              {...fadeUp(0)}
              className="text-4xl font-bold mb-10 text-gray-100 text-center"
            >
              How It Works
            </motion.h2>

            <motion.ol
              {...fadeUp(0.2)}
              className="space-y-8 text-gray-300 text-lg leading-relaxed"
            >
              <li>
                <span className="font-semibold text-gray-200">1. Deposit</span> — 
                Funds enter the privacy pool, fragmented into randomized slices.
              </li>
              <li>
                <span className="font-semibold text-gray-200">2. Redistribution</span> — 
                AI re-shuffles slices across ephemeral stealth addresses.
              </li>
              <li>
                <span className="font-semibold text-gray-200">3. Withdrawal</span> — 
                Recipient receives in unlinkable stealth addresses, swept to main.
              </li>
              <li>
                <span className="font-semibold text-gray-200">4. Audit Option</span> — 
                Encrypted trail accessible only via guardian multisig when legally required.
              </li>
            </motion.ol>
          </div>
        </section>

        {/* ================= COMPLIANCE SECTION ================= */}
        <section className="min-h-screen flex items-center px-8 py-20 bg-gradient-to-b from-gray-950 to-black">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              {...fadeUp(0)}
              className="text-4xl font-bold mb-6 text-gray-100"
            >
              Privacy Meets Compliance
            </motion.h2>
            <motion.p
              {...fadeUp(0.2)}
              className="text-lg text-gray-400 leading-relaxed mb-8"
            >
              StealthSDK doesn’t choose between privacy and compliance.  
              It provides both: privacy for users, and auditability for regulators.
            </motion.p>
            <motion.div
              {...fadeUp(0.4)}
              className="grid md:grid-cols-2 gap-8"
            >
              <div className="p-6 rounded-2xl bg-gray-900 shadow-lg">
                <h3 className="text-2xl font-semibold mb-3">zk-KYC Registry</h3>
                <p className="text-gray-400">
                  Users verify identity off-chain. Only proof of verification
                  is stored, never personal data.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-gray-900 shadow-lg">
                <h3 className="text-2xl font-semibold mb-3">
                  Guardian Multisig
                </h3>
                <p className="text-gray-400">
                  A 2-of-3 guardian setup ensures encrypted metadata can be
                  unlocked only under lawful request.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= DEVELOPER EXPERIENCE ================= */}
        <section className="min-h-screen flex items-center px-8 py-20">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h2
              {...fadeUp(0)}
              className="text-4xl font-bold mb-8 text-gray-100"
            >
              Built for Developers
            </motion.h2>
            <motion.p
              {...fadeUp(0.2)}
              className="text-lg text-gray-400 leading-relaxed mb-12"
            >
              Complex blockchain operations are abstracted away.  
              Developers integrate with a clean API, getting instant privacy,
              compliance, and notifications—without writing custom cryptography.
            </motion.p>

            <motion.div
              {...fadeUp(0.4)}
              className="p-6 rounded-2xl bg-gray-900 shadow-lg text-left"
            >
              <pre className="bg-gray-950 text-green-400 text-sm md:text-base rounded-xl p-6 overflow-x-auto">
{`import { Stealth } from "stealth-sdk";

const sdk = new Stealth({ apiKey: "YOUR_KEY" });

// One-line private payment
await sdk.pay({
  to: "0xRecipient",
  amount: "100 USDC",
});
`}
              </pre>
            </motion.div>
          </div>
        </section>

        {/* ================= CTA SECTION ================= */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gradient-to-b from-black to-gray-950">
          <motion.h2
            {...fadeUp(0)}
            className="text-5xl font-extrabold mb-6 text-gray-100"
          >
            Ready to build with StealthSDK?
          </motion.h2>
          <motion.p
            {...fadeUp(0.3)}
            className="text-lg text-gray-400 max-w-2xl mb-10"
          >
            Join the new era of private, auditable, and compliant blockchain payments.  
            Empower your users without sacrificing confidentiality or compliance.
          </motion.p>
          <motion.button
            {...fadeUp(0.6)}
            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-gray-800 to-gray-700 text-gray-100 shadow-lg hover:shadow-gray-800/50 transition text-lg"
          >
            Get Started Today
          </motion.button>
        </section>
      </div>
    </DefaultLayout>
  );
}
