import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CLIMORAX — Adaptive Weather Intelligence',
  description: 'An adaptive multi-model weather intelligence platform combining NWP, AI and ensemble forecasts for explainable hybrid forecasting, risk analysis and verification.',
  openGraph: {
    title: 'CLIMORAX — Adaptive Weather Intelligence',
    description: 'An adaptive multi-model weather intelligence platform combining NWP, AI and ensemble forecasts for explainable hybrid forecasting, risk analysis and verification.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CLIMORAX — Adaptive Weather Intelligence',
    description: 'An adaptive multi-model weather intelligence platform combining NWP, AI and ensemble forecasts for explainable hybrid forecasting, risk analysis and verification.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body suppressHydrationWarning className="bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
