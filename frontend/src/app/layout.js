import "./globals.css";

import FlyonuiScript from "../components/FlyonuiScript";
import NavBar from "../components/NavBar";

import { NextIntlClientProvider } from "next-intl";
import { getUserLocale } from "../services/locale";

export default async function RootLayout({ children }) {
  const locale = await getUserLocale();

  // Si arabe, on passe en RTL, sinon LTR
  const dir = locale === "ar" ? "rtl" : "ltr";
  return (
    <html lang={locale} dir={dir}>
      <NextIntlClientProvider locale={locale} dir={dir}>
        <body className="min-h-screen bg-base-200">
          <NavBar />
          <div className="p-6">{children}</div>
        </body>
        <FlyonuiScript />
      </NextIntlClientProvider>
    </html>
  );
}
