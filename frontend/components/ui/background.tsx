import React from 'react';

export function Background() {
  return (
    <div className="fixed inset-0 -z-10">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-black"></div>
      
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full animate-move-slow">
          <div className="absolute w-96 h-96 bg-violet-500 rounded-full filter blur-3xl opacity-30"></div>
        </div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full animate-move-slow-reverse">
          <div className="absolute w-96 h-96 bg-fuchsia-500 rounded-full filter blur-3xl opacity-30"></div>
        </div>
      </div>
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    </div>
  );
}
