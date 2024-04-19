// The "use client" directive indicates that this module is intended to run in the client environment,
// which is particularly relevant for Next.js applications that support server-side rendering (SSR).
"use client";

import { PATHS } from "@consts";
import { getUser, logout as removeCookies } from "@/lib/api";
import { useRouter } from "next/navigation";
// Import createContext and useContext hooks from React to create and consume the context.
import { createContext, useContext, useEffect, useState } from "react";
import { ModalProvider } from "./modal";
import { DecodedToken, FetchUserData } from "@/lib/requests";
import { SnackbarProvider } from "./snackbar";

interface AppContextType {
  userSession: DecodedToken | null;
  setUserSession: (userSession: DecodedToken | null) => void;
  user: FetchUserData | null;
  resetState: () => void;
  logout: () => void;
}

// Create a new Context object. This will be used to provide and consume the context.
const AppContext = createContext<AppContextType>({} as AppContextType);
AppContext.displayName = "AppContext";

// Define a provider component. This component will wrap the part of your app where you want the context to be accessible.
export function AppContextProvider({ session, children }) {
  // Define any values or functions you want to make available throughout your component tree.
  const [userSession, setUserSession] = useState<DecodedToken | null>(session);
  const [user, setUser] = useState<FetchUserData | null>();
  const router = useRouter();

  useEffect(() => {
    async function fetchUserData(userId: string) {
      const userData = await getUser(userId);
      setUser(userData);
    }

    if (userSession?.userId) {
      fetchUserData(userSession.userId);
    }
  }, [userSession]);

  const resetState = () => {
    setUser(null);
    setUserSession(null);
  };

  const logout = async () => {
    removeCookies();
    resetState();
    router.push(PATHS.home);
  };
  // Render the provider component of your context, passing in the values or functions as the value prop.
  // Any child components will be able to access these values via the useAppContext hook.
  return (
    <AppContext.Provider
      value={{ userSession, setUserSession, user, resetState, logout }}
    >
      <ModalProvider>
        <SnackbarProvider>{children}</SnackbarProvider>
      </ModalProvider>
    </AppContext.Provider>
  );
}

// Define a custom hook to provide a convenient way to access the context values.
// This hook abstracts away the useContext hook specifically for this context.
export function useAppContext() {
  const context = useContext(AppContext);

  // Perform a check to ensure that this hook is used within a component wrapped in AppContextProvider.
  // This helps prevent errors from occurring if the context is used outside of the provider.
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }

  // Return the context value, making it accessible to components that call this hook.
  return context;
}