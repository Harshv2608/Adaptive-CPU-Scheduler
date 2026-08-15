import React from 'react';

export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-1 overflow-auto bg-background/50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  );
};
