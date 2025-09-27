import { Route, Routes } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./config/WagmiConfig.ts";

import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import Send from "@/pages/send";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import KYCTestPage from "@/pages/kyc-test";

function App() {
  const queryClient = new QueryClient();

  return (
<<<<<<< HEAD
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route element={<IndexPage />} path="/" />
          <Route element={<DocsPage />} path="/docs" />
          <Route element={<Send />} path="/send" />
          <Route element={<BlogPage />} path="/blog" />
          <Route element={<AboutPage />} path="/about" />
        </Routes>
      </QueryClientProvider>
    </WagmiProvider>
=======
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<DocsPage />} path="/docs" />
      <Route element={<PricingPage />} path="/pricing" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />
      <Route element={<KYCTestPage />} path="/kyc-test" />
    </Routes>
>>>>>>> 5272877 (KYC part done)
  );
}

export default App;
