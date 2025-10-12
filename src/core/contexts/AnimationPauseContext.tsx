import React, { createContext, useContext, useState, useEffect } from 'react';

interface AnimationPauseContextValue {
  paused: boolean;
  setPaused: (paused: boolean) => void;
}

export const AnimationPauseContext = createContext<AnimationPauseContextValue>({
  paused: false,
  setPaused: () => {}
});

export const useAnimationPause = () => {
  const context = useContext(AnimationPauseContext);
  return context.paused;
};

export const useAnimationPauseControl = () => {
  const context = useContext(AnimationPauseContext);
  return context;
};

export const AnimationPauseProvider: React.FC<{ children: React.ReactNode }> = React.memo(({ children }) => {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const handleVisibility = () => {
      setPaused(document.hidden || document.visibilityState !== 'visible');
    };
    const handleBlur = () => setPaused(true);
    const handleFocus = () => setPaused(document.hidden || document.visibilityState !== 'visible');

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    handleVisibility();
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const value = { paused, setPaused };

  return (
    <AnimationPauseContext.Provider value={value}>
      {children}
    </AnimationPauseContext.Provider>
  );
});

