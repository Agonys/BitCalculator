import { type RefObject, useEffect, useRef } from 'react';

export const useClickOutside = <T extends HTMLElement>(handler: () => void): RefObject<T | null> => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [handler]);

  return ref;
};
