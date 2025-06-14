import "./globals.css";

import FlyonuiScript from "../components/FlyonuiScript";

import { NextIntlClientProvider } from "next-intl";
import { getUserLocale } from "../services/locale";
import { getUserTheme } from "../services/theme";
import DefaultTheme from "../components/DefaultTheme";

export default async function RootLayout({ children }) {
  const locale = await getUserLocale();
  const userTheme = await getUserTheme();

  // Si arabe, on passe en RTL, sinon LTR
  const dir = locale === "ar" ? "rtl" : "ltr";
  return (
    <html lang={locale} dir={dir} data-theme={userTheme}>
      <NextIntlClientProvider locale={locale} dir={dir}>
        <body>
          <DefaultTheme />
          {children}
        </body>
        <FlyonuiScript />
      </NextIntlClientProvider>
    </html>
  );
}
