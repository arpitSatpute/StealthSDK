import { useState, useEffect } from 'react';
import { Shield, Zap, Brain, Eye, CheckCircle, ArrowRight, Coins, Lock, Users, TrendingUp } from 'lucide-react';

export default function IndexPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className={`container mx-auto px-6 py-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-white/20">
              <Brain className="w-5 h-5 text-purple-300" />
              <span className="text-sm font-medium">AI-Enhanced Privacy Protocol</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
              Private Payments
              <br />
              <span className="text-5xl md:text-6xl">Reimagined</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              Send crypto with complete privacy using AI-powered fragmentation, stealth addresses, 
              and zero-knowledge proofs on Polygon. One click. Total anonymity. Automatic delivery.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              
              <button className="px-8 py-4 border border-white/30 rounded-2xl font-semibold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-md">
                View Protocol
              </button>
            </div>
          </div>

          {/* Key Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="group p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">AI-Optimized Privacy</h3>
              <p className="text-gray-300 leading-relaxed">
                Intelligent fragmentation automatically breaks payments into optimal denominations, 
                maximizing anonymity through advanced mixing strategies.
              </p>
            </div>

            <div className="group p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">One-Click Experience</h3>
              <p className="text-gray-300 leading-relaxed">
                Simple payment intent triggers automatic stealth address generation, 
                ZK proof creation, and seamless delivery to recipients.
              </p>
            </div>

            <div className="group p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Zero-Knowledge Proofs</h3>
              <p className="text-gray-300 leading-relaxed">
                Cryptographic proofs ensure transaction validity without revealing 
                sender, recipient, or amount information to the network.
              </p>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              How It Works
            </h2>
            
            <div className="max-w-5xl mx-auto">
              <div className="space-y-12">
                {[
                  {
                    step: "01",
                    title: "AI-Powered Deposit",
                    description: "Enter a single payment intent. AI automatically fragments your payment into optimal denominations and assigns them to the best-mixed pools for maximum privacy.",
                    icon: Brain,
                    color: "from-purple-500 to-blue-500"
                  },
                  {
                    step: "02", 
                    title: "Zero-Knowledge Release",
                    description: "ZK proofs verify your authorization without revealing identity. Batched proofs are efficiently processed on Polygon for cost-effective transactions.",
                    icon: Lock,
                    color: "from-blue-500 to-indigo-500"
                  },
                  {
                    step: "03",
                    title: "Automatic Delivery",
                    description: "Funds are automatically swept to recipient's wallet through stealth addresses. No manual claiming required - completely seamless experience.",
                    icon: Zap,
                    color: "from-indigo-500 to-purple-500"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-4`}>
                          <item.icon className="w-10 h-10" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-sm font-bold">
                          {item.step}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                      <p className="text-gray-300 text-lg leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Why Choose Our Protocol
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Eye, title: "Complete Privacy", desc: "Unlinked transactions" },
                { icon: Zap, title: "Gas Efficient", desc: "AI-optimized batching" },
                { icon: Users, title: "Seamless UX", desc: "One-click payments" },
                { icon: CheckCircle, title: "Compliant", desc: "Selective disclosure" }
              ].map((benefit, index) => (
                <div key={index} className="text-center p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold mb-2">{benefit.title}</h4>
                  <p className="text-gray-300 text-sm">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="text-center mb-20">
            <div className="inline-block p-12 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
              <div className="flex flex-col md:flex-row gap-12 items-center justify-center">
                <div>
                  <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    100%
                  </div>
                  <div className="text-gray-300">Privacy Preserved</div>
                </div>
                <div className="hidden md:block w-px h-16 bg-white/20"></div>
                <div>
                  <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    90%
                  </div>
                  <div className="text-gray-300">Gas Savings</div>
                </div>
                <div className="hidden md:block w-px h-16 bg-white/20"></div>
                <div>
                  <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  </div>
                  <div className="text-gray-300">Transaction Time</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="max-w-2xl mx-auto p-12 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md rounded-3xl border border-white/20">
              <h2 className="text-3xl font-bold mb-6">Ready to Send Privately?</h2>
              <p className="text-gray-300 mb-8 text-lg">
                Join the future of private payments with our AI-enhanced protocol on Polygon.
              </p>
              <button className="group px-10 py-4 bg-gradient-to-r from-white to-gray-100 text-gray-900 rounded-2xl font-semibold text-lg hover:from-gray-100 hover:to-white transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <span className="flex items-center gap-2">
                  Launch App
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}