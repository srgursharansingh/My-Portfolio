import React, { createContext, useContext, useState } from 'react';

const CopyContext = createContext();

export const useCopy = () => useContext(CopyContext);

export const CopyProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const copy = (text, e) => {
    navigator.clipboard.writeText(text).then(() => {
      setCursor({ x: e.clientX, y: e.clientY });
      setIsActive(true);
      setTimeout(() => setIsActive(false), 3000);
    });
  };

  return (
    <CopyContext.Provider value={{ isActive, cursor, copy }}>
      {children}
    </CopyContext.Provider>
  );
};
