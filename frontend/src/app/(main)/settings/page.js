import { useTranslations } from "next-intl";

export default function Index() {
  const t = useTranslations("Settings");
  return (
    <main>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </main>
  );
}
