
'use client';

import React, { createContext, useContext, useState, type ReactNode, type Dispatch, type SetStateAction } from 'react';

interface SearchContextProps {
  isSearchVisible: boolean;
  setIsSearchVisible: Dispatch<SetStateAction<boolean>>;
  toggleSearch: () => void;
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleSearch = () => {
    setIsSearchVisible(prev => !prev);
  };

  return (
    <SearchContext.Provider value={{ isSearchVisible, setIsSearchVisible, toggleSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchVisibility = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearchVisibility must be used within a SearchProvider');
  }
  return context;
};
