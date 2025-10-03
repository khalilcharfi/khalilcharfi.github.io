import React, { createContext, useContext, useState, useEffect } from 'react';

export const AnimationPauseContext = createContext<boolean>(false);

export const useAnimationPause = () => useContext(AnimationPauseContext);

export const AnimationPauseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  return (
    <AnimationPauseContext.Provider value={paused}>
      {children}
    </AnimationPauseContext.Provider>
  );
};

