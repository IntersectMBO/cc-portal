"use client";
import React, { useEffect, useState, useContext } from "react";
import { InitOptions, loadSpace, SpaceApi } from "@usersnap/browser";

export const UsersnapContext = React.createContext<SpaceApi | null>(null);

// This context is used to integrate the Usersnap widget,
// Usersnap is a tool for collecting user feedback and bug reports directly from the application
export const UsersnapProvider = ({
  initParams,
  children,
}: UsersnapProviderProps) => {
  const [usersnapApi, setUsersnapApi] = useState<SpaceApi | null>(null);

  useEffect(() => {
    loadSpace(process.env.NEXT_PUBLIC_USERSNAP_GLOBAL_API_KEY).then(
      (api: SpaceApi) => {
        api.init(initParams);
        setUsersnapApi(api);
      }
    );
  }, [initParams]);

  return (
    <UsersnapContext.Provider value={usersnapApi}>
      {children}
    </UsersnapContext.Provider>
  );
};

interface UsersnapProviderProps {
  initParams?: InitOptions;
  children: React.ReactNode;
}

export function useUsersnapApi() {
  return useContext(UsersnapContext);
}
