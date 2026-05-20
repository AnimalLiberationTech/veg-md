"use client";

import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useState} from "react";

type ExpandedEventDescriptionContextType = {
  expandedEventId: string | null;
  setExpandedEventId: Dispatch<SetStateAction<string | null>>;
};

const ExpandedEventDescriptionContext = createContext<ExpandedEventDescriptionContextType | undefined>(undefined);

export const ExpandedEventDescriptionProvider = ({children}: {children: ReactNode}) => {
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  return (
    <ExpandedEventDescriptionContext.Provider value={{expandedEventId, setExpandedEventId}}>
      {children}
    </ExpandedEventDescriptionContext.Provider>
  );
};

export const useExpandedEventDescription = () => {
  const context = useContext(ExpandedEventDescriptionContext);

  if (!context) {
    throw new Error("useExpandedEventDescription must be used within ExpandedEventDescriptionProvider");
  }

  return context;
};

