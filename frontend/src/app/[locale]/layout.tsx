import React from "react";

import { AppContextProvider } from "@context";
import { NextIntlClientProvider } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../theme";
import { Footer, TopNav } from "@organisms";
import { poppins, locales, ICONS } from "@consts";
import { Box, CssBaseline } from "@mui/material";
import { RenderModal } from "@atoms";

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

  return (
    // Set the document language
    <html lang={locale}>
      <head>
        <title>{metadata.title}</title>
        <link rel="icon" href={ICONS.favicon} sizes="any" />
      </head>
      {/* Apply font class and suppress hydration warning. */}
      <body className={poppins.className} suppressHydrationWarning={true}>
        {/* Provide internationalization context. */}
        <NextIntlClientProvider locale={locale} messages={messages}>
          {/* Wrap children in global state context */}
          <AppContextProvider>
            <AppRouterCacheProvider>
              {/** Customize Material UI & inject a theme into the app */}
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <TopNav />
                <RenderModal />
                <Box mt="80px">{children} </Box>
                <Footer />
              </ThemeProvider>
            </AppRouterCacheProvider>
          </AppContextProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export default RootLayout;
