import { Link } from "react-router-dom";
import { pagePath } from "../i18n/locale";
import { useLocale, useMessages } from "../i18n/useLocale";

export function NotFoundPage() {
  const locale = useLocale();
  const t = useMessages();
  return (
    <div className="overflow-y-auto p-6 text-center">
      <h1 className="text-xl font-semibold">{t.notFound.title}</h1>
      <Link to={pagePath("home", locale)} className="mt-2 inline-block text-brand-500 underline">
        {t.notFound.backHome}
      </Link>
    </div>
  );
}
