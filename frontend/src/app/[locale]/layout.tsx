import React from "react";

import { AppContextProvider } from "@context";
import { NextIntlClientProvider } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../theme";
import { poppins, locales, IMAGES } from "@consts";
import { Box, CssBaseline } from "@mui/material";
import { RenderModal } from "@atoms";
import { decodeUserToken } from "@/lib/api";

export function generateStaticParams() {
  // Generate static params for each locale, used in static generation methods.
  return locales.map((locale) => ({ locale }));
}

// Define common metadata for the application.
export const metadata = {
  title: "Constitutional Committee Portal",
  description: "Constitutional Committee Portal",
};

async function RootLayout({ children, params: { locale } }) {
  // Root layout component, sets up locale, loads messages, and wraps the app with providers.
  unstable_setRequestLocale(locale); // Set the locale for the request, use with caution due to unstable API.
  if (!locales.includes(locale)) notFound(); // Check if the locale is supported, otherwise trigger a 404.

  let messages;
  try {
    // Attempt to dynamically load the message bundle for the current locale.
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound(); // Trigger a 404 if the message bundle cannot be loaded.
  }
  const user = await decodeUserToken();

  return (
    // Set the document language
    <html lang={locale}>
      <head>
        <title>{metadata.title}</title>
        <link rel="icon" href={IMAGES.favicon} type="image/x-icon" />
        {/* Matomo script */}
        {process.env.NODE_ENV === "production" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                var _paq = window._paq = window._paq || [];
                _paq.push(['trackPageView']);
                _paq.push(['enableLinkTracking']);
                (function() {
                  var u="//analytics.gov.tools/";
                  _paq.push(['setTrackerUrl', u+'matomo.php']);
                  _paq.push(['setSiteId', '3']);
                  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                  g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
                })();
              `,
            }}
          />
        )}
      </head>
      {/* Apply font class and suppress hydration warning. */}
      <body className={poppins.className} suppressHydrationWarning={true}>
        {/* Provide internationalization context. */}
        <NextIntlClientProvider locale={locale} messages={messages}>
          {/* Wrap children in global state context */}
          <AppContextProvider session={user}>
            <AppRouterCacheProvider>
              {/** Customize Material UI & inject a theme into the app */}
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <RenderModal />
                <main>
                  <Box display="flex" flexDirection="column" minHeight="100vh">
                    {children}
                  </Box>
                </main>
              </ThemeProvider>
            </AppRouterCacheProvider>
          </AppContextProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export default RootLayout;
