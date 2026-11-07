import { requestAreaMailto } from "../../utils/contactLinks";

export function OutsideCoverageBanner() {
  return (
    <p
      role="status"
      className="mx-3 mb-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900"
    >
      Pour le moment, les restaurants référencés se situent dans un nombre limité de villes. La
      carte a vocation à s&rsquo;étendre progressivement à toute la France. Si vous souhaitez
      suggérer une ville à ajouter, écrivez à{" "}
      <a className="font-medium underline" href={requestAreaMailto()}>
        contact@sans-allergenes.fr
      </a>
      .
    </p>
  );
}
