"use client";
import React, { useEffect, useState, useContext } from "react";
import { InitOptions, loadSpace, SpaceApi } from "@usersnap/browser";
import { usePathname } from "next/navigation";

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
    let api: SpaceApi | null = null;

    const hideHiddenProjects = () => {
      if (api) {
        const hiddenProjects = process.env.NEXT_PUBLIC_HIDDEN_USERSNAP_PROJECT_IDS?.split("||") || [];
        hiddenProjects.forEach(p => {
          api.hide(p);
        });
      }
    };

    if (process.env.NEXT_PUBLIC_USERSNAP_SPACE_API_KEY) {
      loadSpace(process.env.NEXT_PUBLIC_USERSNAP_SPACE_API_KEY).then(
        (loadedApi: SpaceApi) => {
          api = loadedApi;
          api.init(initParams);
          setUsersnapApi(api);

          api.on("submit", hideHiddenProjects);
          api.on("open", hideHiddenProjects);
          hideHiddenProjects();
        }
      );
    }

    return () => {
      if (api) {
        api.off("submit", hideHiddenProjects);
        api.off("open", hideHiddenProjects);
      }
    };
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
