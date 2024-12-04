"use client";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * For client-side redirects in React Server Components (RSC)
 *
 * Trying to redirect in server using `redirect` from `next/navigation`
 * gives an odd error "Rendered more hooks than during the previous render"
 * which seems impossible to debug, as we don't have any hooks that are
 * conditionally rendered or skipped. There's no solution available for this
 * specific problem; most solutions point to checking for conditional hooks.
 *
 * At present, client-based redirection works correctly, therefore we are
 * creating a client component whose function is purely to redirect. It
 * doesn't return any JSX.Element. Note that we should return this component
 * early, otherwise the other components will flash while redirecting.
 *
 * @param {Route} href - The route path to which the client will be redirected.
 * @returns {null} - Returns null as void is not assignable to JSX.Element.
 */
export default function ClientRedirect({ href }: { href: Route }): null {
  const router = useRouter();

  useEffect(() => {
    router.push(href);
  }, [href, router]);

  return null;
}
