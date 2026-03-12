"use client";

import React, { createContext, useContext, useState } from "react";

type ExpandedResourceContextType = {
  expandedResourceId: number | null;
  setExpandedResourceId: (id: number | null) => void;
};

const ExpandedResourceContext = createContext<ExpandedResourceContextType | undefined>(undefined);

export function ExpandedResourceProvider({ children }: { children: React.ReactNode }) {
  const [expandedResourceId, setExpandedResourceId] = useState<number | null>(null);

  return (
    <ExpandedResourceContext.Provider value={{ expandedResourceId, setExpandedResourceId }}>
      {children}
    </ExpandedResourceContext.Provider>
  );
}

export function useExpandedResource() {
  const context = useContext(ExpandedResourceContext);
  if (!context) {
    throw new Error("useExpandedResource must be used within ExpandedResourceProvider");
  }
  return context;
}

