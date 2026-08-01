export function ErrorState({ message }: { message: string }) {
  return (
    <div role="alert" className="m-4 rounded-md border border-red-300 bg-red-50 p-4 text-red-800">
      <p className="font-medium">Une erreur est survenue</p>
      <p className="text-sm">{message}</p>
    </div>
  );
}
