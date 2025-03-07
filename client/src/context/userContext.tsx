import React, { createContext, useContext, useState } from 'react';

import { Dispatch, SetStateAction } from 'react';
import { ReactNode } from 'react';

const UserContext = createContext<{
  user: null;
  setUser: Dispatch<SetStateAction<null>>;
}>({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);