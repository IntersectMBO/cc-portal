"use client";
import React, { useEffect, useState, useContext } from "react";
import { usePathname } from "next/navigation";
import { InitOptions, loadSpace, SpaceApi } from "@usersnap/browser";

export const UsersnapContext = React.createContext<SpaceApi | null>(null);

// This context is used to integrate the Usersnap widget,
// Usersnap is a tool for collecting user feedback and bug reports directly from the application
export const UsersnapProvider = ({
  initParams,
  children,
}: UsersnapProviderProps) => {
  const [usersnapApi, setUsersnapApi] = useState<SpaceApi | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_USERSNAP_SPACE_API_KEY) {
      const hiddenProjects =
        process.env.NEXT_PUBLIC_HIDDEN_USERSNAP_PROJECT_IDS?.split("||") || [];
      loadSpace(process.env.NEXT_PUBLIC_USERSNAP_SPACE_API_KEY).then(
        (api: SpaceApi) => {
          api.init(initParams);
          setUsersnapApi(api);
          const hideHiddenProjects = () => {
            hiddenProjects.forEach((p) => {
              api.hide(p);
            });
          };
          hideHiddenProjects();
          api.on("close", hideHiddenProjects);
          api.on("submit", hideHiddenProjects);
        }
      );
    }
  }, [initParams, pathname]);

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
