import { useMessages } from "../../i18n/useLocale";

export function ErrorState({ message }: { message: string }) {
  const t = useMessages();
  return (
    <div role="alert" className="m-4 rounded-md border border-red-300 bg-red-50 p-4 text-red-800">
      <p className="font-medium">{t.common.errorTitle}</p>
      <p className="text-sm">{message}</p>
    </div>
  );
}
