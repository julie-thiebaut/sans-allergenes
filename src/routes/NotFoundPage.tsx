import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-xl font-semibold">Page introuvable</h1>
      <Link to="/" className="mt-2 inline-block text-brand-500 underline">
        Retour à l&rsquo;accueil
      </Link>
    </div>
  );
}
