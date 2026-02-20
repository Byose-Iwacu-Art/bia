'use client';
import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import AuthModal from './AuthModal';

type Tab = 'login' | 'signup';

interface AuthModalCtx {
  openLogin: (onSuccess?: () => void) => void;
  openSignup: (onSuccess?: () => void) => void;
}

const AuthModalContext = createContext<AuthModalCtx>({
  openLogin: () => {},
  openSignup: () => {},
});

export const useAuthModal = () => useContext(AuthModalContext);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('login');
  const [onSuccessCb, setOnSuccessCb] = useState<(() => void) | undefined>();

  const openLogin = useCallback((cb?: () => void) => {
    setTab('login');
    setOnSuccessCb(() => cb);
    setOpen(true);
  }, []);

  const openSignup = useCallback((cb?: () => void) => {
    setTab('signup');
    setOnSuccessCb(() => cb);
    setOpen(true);
  }, []);

  return (
    <AuthModalContext.Provider value={{ openLogin, openSignup }}>
      {children}
      <AuthModal
        open={open}
        tab={tab}
        setTab={setTab}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setOpen(false);
          onSuccessCb?.();
        }}
      />
    </AuthModalContext.Provider>
  );
}
