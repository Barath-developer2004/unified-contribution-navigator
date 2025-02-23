import React from 'react';
import { Background } from '../ui/background';
import { Navbar } from '../navbar';

interface PageContainerProps {
  children: React.ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Background />
      <Navbar />
      <main className="flex-1 relative z-10">
        {children}
      </main>
    </div>
  );
}
