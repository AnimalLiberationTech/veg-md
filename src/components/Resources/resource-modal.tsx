"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const subscribe = () => () => {};

function useIsHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

type ResourceModalProps = {
  isOpen: boolean;
  onCloseAction: () => void;
  title: string;
  description: string;
};

export default function ResourceModal({ isOpen, onCloseAction, title, description }: ResourceModalProps) {
  const isHydrated = useIsHydrated();

  if (!isOpen || !isHydrated) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60">
      <div className="relative w-full max-w-2xl mx-4 max-h-[80vh] bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        <button
          onClick={onCloseAction}
          className="absolute -top-2 -right-4 translate-x-full text-7xl leading-none text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <span className="sr-only">Close modal</span>
          &times;
        </button>
        
        <div className="p-8 overflow-y-auto max-h-[80vh]">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">{title}</h2>
          <div className="text-base leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {description}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

