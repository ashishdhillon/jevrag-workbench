import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JevRAG Workbench | Naive RAG vs 3-Stage Jev-Gated Modular RAG",
  description:
    "Side-by-side evaluation workbench demonstrating Jev System One decision model: hallucination blocking, contradiction preservation, calibrated probabilities, and 75%+ token savings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
