import "./globals.css";

import FlyonuiScript from "../components/FlyonuiScript";
import DefaultTheme from "../components/DefaultTheme";

import { NextIntlClientProvider } from "next-intl";

import { getUserLocale } from "../services/locale";
import { getUserTheme } from "../services/theme";

import { AuthProvider } from "../contexts/authcontext";

export default async function RootLayout({ children }) {
  /* ------------------------------------------------------------------ */
  /* Préférences utilisateur                                            */
  /* ------------------------------------------------------------------ */
  const locale = await getUserLocale(); // ex. “fr” ou “en”
  const userTheme = await getUserTheme(); // ex. “light” / “dark”

  /* RTL pour l’arabe, LTR sinon */
  const dir = locale === "ar" ? "rtl" : "ltr";

  /* ------------------------------------------------------------------ */
  /* Layout HTML                                                        */
  /* ------------------------------------------------------------------ */
  return (
    <html lang={locale} dir={dir} data-theme={userTheme}>
      {/* Provider des traductions */}
      <NextIntlClientProvider locale={locale} dir={dir}>
        {/* Provider d’authentification : tout le site a accès à useAuth */}
        <AuthProvider>
          <body>
            <DefaultTheme /> {/* applique le thème Tailwind/DaisyUI */}
            {children} {/* pages rendues ici */}
            <script src="../../node_modules/flyonui/flyonui.js"></script>
          </body>

          {/* Scripts éventuels de ta lib Flyonui */}
          <FlyonuiScript />
        </AuthProvider>
      </NextIntlClientProvider>
    </html>
  );
}
