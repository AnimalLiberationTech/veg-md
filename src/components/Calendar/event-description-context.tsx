"use client";

import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useState} from "react";

type EventDescriptionContextType = {
  expandedEventId: string | null;
  setExpandedEventId: Dispatch<SetStateAction<string | null>>;
};
const EventDescriptionContext = createContext<EventDescriptionContextType | undefined>(undefined);
export const EventDescriptionProvider = ({children}: { children: ReactNode }) => {
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  return (
    <EventDescriptionContext.Provider value={{expandedEventId, setExpandedEventId}}>
      {children}
    </EventDescriptionContext.Provider>
  );
};
export const useEventDescription = () => {
  const context = useContext(EventDescriptionContext);

  if (!context) {
    throw new Error("useExpandedEventDescription must be used within ExpandedEventDescriptionProvider");
  }

  return context;
};