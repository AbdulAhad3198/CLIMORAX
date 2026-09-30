'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AppProvider } from '../context/AppContext';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { X } from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
        <div className="flex flex-1 overflow-hidden">
          {/* Desktop Sidebar */}
          <Sidebar className="hidden md:flex" />

          {/* Mobile Sidebar Overlay Drawer */}
          {mobileNavOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden bg-slate-950/80 backdrop-blur-sm">
              <Sidebar className="flex h-full w-72 shadow-2xl" />
              <button
                onClick={() => setMobileNavOpen(false)}
                className="p-4 text-slate-400 hover:text-slate-100 self-start mt-2"
                aria-label="Close navigation"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          )}

          {/* Main Layout Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            <Header onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)} />
            <main className="flex-1 p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </main>
          </div>
        </div>
      </div>
    </AppProvider>
  );
}
