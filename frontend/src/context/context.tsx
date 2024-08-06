// The "use client" directive indicates that this module is intended to run in the client environment,
// which is particularly relevant for Next.js applications that support server-side rendering (SSR).
"use client";

import { getUser } from "@/lib/api";
import { usePathname, useRouter } from "next/navigation";
// Import createContext and useContext hooks from React to create and consume the context.
import { createContext, useContext, useEffect, useState } from "react";
import { ModalProvider } from "./modal";
import { DecodedToken, FetchUserData } from "@/lib/requests";
import { SnackbarProvider } from "./snackbar";
import { PATHS, cookieStore } from "@consts";
import Cookies from "js-cookie";
import { isResponseErrorI } from "@utils";
import { useDocumentVisibility } from "@hooks";
import { TopBannerContextProvider } from "./topBanner";
import { UsersnapProvider } from "./usersnap";

interface AppContextType {
  userSession: DecodedToken | null;
  setUserSession: (userSession: DecodedToken | null) => void;
  user: FetchUserData | null;
  resetState: () => void;
  fetchUserData: (userId: string) => Promise<void>;
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
  const currentPath = usePathname();
  const authCookie = Cookies.get(cookieStore.token);
  const isDocumentVisible = useDocumentVisibility();

  async function fetchUserData(userId: string) {
    const userData = await getUser(userId);
    if (!isResponseErrorI(userData)) {
      setUser(userData);
    }
  }

  useEffect(() => {
    if (userSession?.userId) {
      fetchUserData(userSession.userId);
    }
  }, [userSession]);

  useEffect(() => {
    // Reset app state if user is on Logout page
    if (currentPath.includes(PATHS.logout) || (user && !authCookie)) {
      resetState();
    }
  }, [currentPath, authCookie, isDocumentVisible]);

  const resetState = () => {
    setUser(null);
    setUserSession(null);
    router.refresh();
  };

  // Render the provider component of your context, passing in the values or functions as the value prop.
  // Any child components will be able to access these values via the useAppContext hook.
  return (
    <AppContext.Provider
      value={{
        userSession,
        setUserSession,
        user,
        resetState,
        fetchUserData,
      }}
    >
      <ModalProvider>
        <SnackbarProvider>
          <TopBannerContextProvider>
            <UsersnapProvider>{children}</UsersnapProvider>
          </TopBannerContextProvider>
        </SnackbarProvider>
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
