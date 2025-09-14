import { useCallback, useRef, useState } from 'react';

type GlowMap = Record<string, boolean>;

export const useGlow = (timeoutMs = 3000, fadeMs = 400) => {
  const [glowMap, setGlowMap] = useState<GlowMap>({});
  const [fadeMap, setFadeMap] = useState<GlowMap>({});

  const timers = useRef<Record<string, { fadeTimeout?: number; clearTimeout?: number }>>({});

  const triggerGlow = useCallback(
    (id: string) => {
      setFadeMap((prev) => ({ ...prev, [id]: false }));
      setGlowMap((prev) => ({ ...prev, [id]: true }));

      if (timers.current[id]) {
        clearTimeout(timers.current[id].fadeTimeout);
        clearTimeout(timers.current[id].clearTimeout);
      }

      const fadeTimeout = window.setTimeout(() => {
        setFadeMap((prev) => ({ ...prev, [id]: true }));

        const clearTimeoutId = window.setTimeout(() => {
          setGlowMap((prev) => ({ ...prev, [id]: false }));
          setFadeMap((prev) => ({ ...prev, [id]: false }));
          timers.current[id] = {};
        }, fadeMs);

        timers.current[id].clearTimeout = clearTimeoutId;
      }, timeoutMs);

      timers.current[id] = { fadeTimeout };
    },
    [timeoutMs, fadeMs],
  );

  const clearGlow = useCallback(
    (id: string) => {
      setGlowMap((prev) => {
        if (!prev[id]) return prev;

        if (timers.current[id]) {
          clearTimeout(timers.current[id].fadeTimeout);
          clearTimeout(timers.current[id].clearTimeout);
        }

        setFadeMap((prev) => ({ ...prev, [id]: true }));

        const timeout = window.setTimeout(() => {
          setGlowMap((prev) => ({ ...prev, [id]: false }));
          setFadeMap((prev) => ({ ...prev, [id]: false }));
          timers.current[id] = {};
        }, fadeMs);

        timers.current[id] = { clearTimeout: timeout };

        return prev;
      });
    },
    [fadeMs],
  );

  return {
    glowActiveMap: glowMap,
    glowFadeMap: fadeMap,
    triggerGlow,
    clearGlow,
  };
};
