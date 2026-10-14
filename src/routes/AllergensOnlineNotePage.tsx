import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { Seo } from "../seo/Seo";
import {
  ALLERGENS_ONLINE_NOTE_DATE,
  ALLERGENS_ONLINE_NOTE_DATE_LABEL,
  ALLERGENS_ONLINE_NOTE_TITLE,
  buildAllergensOnlineNoteMeta,
} from "../seo/seoData";

const NOTE_META = buildAllergensOnlineNoteMeta(
  typeof window !== "undefined" ? window.location.origin : "",
);
const LINK_CLASS =
  "font-medium text-brand-700 underline decoration-brand-300 underline-offset-2 hover:text-brand-800";

/**
 * A dated article: its counts are those of its date, written into the text rather than computed
 * from restaurants.json, so a later data release leaves it saying what was true when it was
 * signed. The census figures come from the import repository's August audit
 * (docs/audit-exhaustif-sites-2026-08-10.md: 8 023 sites, 820 unreadable, 6 874 without
 * anything found, so 7 203 examined); the published ones from public/data on 8 October 2026.
 */

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-4">
      <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">{title}</h2>
      <div className="mt-4 space-y-4 leading-relaxed">{children}</div>
    </section>
  );
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className={LINK_CLASS} href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

export function AllergensOnlineNotePage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Seo meta={NOTE_META} />
      <Navbar showSearch={false} />

      <div className="overflow-y-auto">
        <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
          <header className="border-b border-neutral-200 pb-8">
            <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
              {ALLERGENS_ONLINE_NOTE_TITLE}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-neutral-700">
              Depuis 2015, les restaurants doivent mettre à disposition de leurs clients une
              information écrite sur les allergènes présents dans leurs plats. Mais lorsqu’on
              souhaite choisir un restaurant à l’avance, cette information reste difficile à
              trouver. J’ai parcouru plusieurs milliers de sites de restaurants parisiens pour
              mesurer cette difficulté et chercher comment, ensemble, nous pouvons améliorer les
              choses.
            </p>
            <p className="mt-3 text-sm text-neutral-500">
              <time dateTime={ALLERGENS_ONLINE_NOTE_DATE}>{ALLERGENS_ONLINE_NOTE_DATE_LABEL}</time>
            </p>
          </header>

          <div className="space-y-10 py-8 text-neutral-700">
            <Section
              id="parcours"
              title="Manger au restaurant quand on est allergique : un parcours compliqué"
            >
              <p>
                Choisir un restaurant devrait être un plaisir. On regarde les photos, on consulte la
                carte, on hésite entre plusieurs adresses. Mais lorsqu’on vit avec une allergie
                alimentaire, les choses sont souvent un peu plus compliquées.
              </p>
              <p>
                Avant même de réserver, il faut essayer de déterminer si l’établissement propose des
                plats que l’on pourra manger. La carte est parfois disponible en ligne, mais les
                ingrédients ne sont pas toujours détaillés. Et même lorsqu’ils le sont, difficile de
                savoir si une sauce contient du soja, si un plat a été préparé avec du céleri ou si
                un dessert contient des fruits à coque.
              </p>
              <p>
                Faute d’informations, il reste souvent une solution : contacter directement le
                restaurant, expliquer son allergie et attendre une réponse. Ou se déplacer sans
                savoir si l’on trouvera quelque chose d’adapté.
              </p>
              <p>
                Pourtant, l’information sur les allergènes est obligatoire depuis plus de dix ans.
                Alors pourquoi est-elle encore si difficile à consulter avant de se rendre au
                restaurant ?
              </p>
            </Section>

            <Section id="loi" title="Ce que dit la loi sur les allergènes au restaurant">
              <p>
                Le{" "}
                <ExternalLink href="https://eur-lex.europa.eu/legal-content/FR/ALL/?uri=CELEX:32011R1169">
                  règlement européen n°&nbsp;1169/2011
                </ExternalLink>
                , appelé règlement «&nbsp;INCO&nbsp;», impose d’informer les consommateurs de la
                présence de certaines substances provoquant des allergies ou des intolérances dans
                les aliments.
              </p>
              <p>
                Applicable pour l’essentiel depuis le 13 décembre 2014, ce règlement définit
                notamment une liste de 14 catégories d’allergènes à déclaration obligatoire, parmi
                lesquelles les céréales contenant du gluten, les œufs, le lait, les arachides, le
                soja, le céleri et les fruits à coque.
              </p>
              <p>
                En France, le{" "}
                <ExternalLink href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000030491684">
                  décret n°&nbsp;2015-447 du 17 avril 2015
                </ExternalLink>
                , entré en vigueur le 1er juillet 2015, a précisé les modalités d’information pour
                les denrées non préemballées, notamment dans les restaurants.
              </p>
              <p>
                Aujourd’hui, l’
                <ExternalLink href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032807854">
                  article R.&nbsp;412-14 du Code de la consommation
                </ExternalLink>{" "}
                prévoit que les restaurants doivent informer leurs clients, par écrit, des
                allergènes présents dans les plats proposés. Cette information doit être lisible et
                visible, ou les modalités permettant de la consulter doivent être indiquées. Dans ce
                second cas, le client doit pouvoir accéder directement et librement à l’information
                écrite.
              </p>
              <p>
                Concrètement, elle peut figurer sur la carte, sur un tableau affiché dans
                l’établissement ou dans un cahier des allergènes mis à disposition des clients. Ce
                sont quelques-uns des supports observés par la DGCCRF lors de ses contrôles.
              </p>
              <p>
                En revanche, la réglementation n’impose pas systématiquement aux restaurants de
                publier leur liste d’allergènes sur internet. Une distinction existe toutefois pour
                la vente à distance : lorsqu’un établissement propose de commander des plats en
                ligne, les informations obligatoires sur les allergènes doivent être accessibles
                avant la conclusion de l’achat, conformément à l’article 14 du règlement INCO.
              </p>
            </Section>

            <Section
              id="controles"
              title="Les contrôles de la DGCCRF : des difficultés déjà identifiées"
            >
              <p>
                La Direction générale de la concurrence, de la consommation et de la répression des
                fraudes (DGCCRF) contrôle notamment le respect des obligations d’information des
                consommateurs.
              </p>
              <p>
                En 2015, une{" "}
                <ExternalLink href="https://www.economie.gouv.fr/dgccrf/laction-de-la-dgccrf/les-enquetes/etiquetage-des-denrees-alimentaires-controle-de">
                  enquête consacrée à l’application du règlement INCO
                </ExternalLink>{" "}
                a porté sur 3&nbsp;671 établissements, tous secteurs alimentaires concernés
                confondus. Elle a donné lieu à 1&nbsp;844 avertissements et 60 procès-verbaux.
              </p>
              <p>
                Dans la restauration, les enquêteurs constataient une situation inégale : les
                chaînes connaissaient généralement mieux leurs obligations que les restaurateurs
                indépendants. Beaucoup de professionnels comprenaient encore mal les règles,
                notamment la différence entre les allergènes présents dans les ingrédients et les
                risques de contamination croisée. La DGCCRF avait alors privilégié les actions
                pédagogiques et les avertissements.
              </p>
              <p>
                Plus récemment, une{" "}
                <ExternalLink href="https://www.economie.gouv.fr/dgccrf/laction-de-la-dgccrf/les-enquetes-et-les-controles/gare-aux-tromperies-sur-les-plats-livres">
                  enquête menée en 2023 sur la livraison de repas, publiée en août 2025
                </ExternalLink>
                , a montré que ces difficultés persistaient.
              </p>
              <p>
                Sur 646 établissements contrôlés, 136 présentaient des infractions, soit 21&nbsp;%,
                toutes catégories de manquements confondues. Les contrôles ont notamment abouti à
                114 injonctions de mise en conformité. L’absence d’informations sur les allergènes
                figurait parmi les problèmes fréquemment relevés.
              </p>
              <p>
                La DGCCRF rapporte également qu’une plateforme de livraison a dû modifier son site
                et son application pour permettre aux restaurateurs d’indiquer les allergènes de
                leurs plats.
              </p>
              <p>
                Ces contrôles montrent que l’accès à une information fiable reste un sujet
                d’actualité, malgré l’ancienneté de la réglementation.
              </p>
            </Section>

            <Section
              id="recherche"
              title="J’ai recherché les allergènes sur les sites des restaurants parisiens"
            >
              <p>
                En août 2026, j’ai voulu mesurer à quel point il était possible de connaître les
                allergènes d’un restaurant avant de s’y rendre.
              </p>
              <p>
                J’ai donc réalisé une recherche à grande échelle sur les sites internet des
                restaurants, cafés et établissements de restauration rapide de Paris, à partir des
                données de Google Maps et d’OpenStreetMap.
              </p>
              <p>
                Sur Google Maps, 13&nbsp;703 établissements ont été relevés, dont 3&nbsp;932 sans
                site internet renseigné.
              </p>
              <p>
                Après avoir réuni les différentes sources et supprimé les doublons, j’ai obtenu
                8&nbsp;023 sites internet distincts. La recherche a porté sur leurs pages, leurs
                menus, leurs documents PDF et leurs images. Les résultats potentiellement pertinents
                ont ensuite été vérifiés manuellement.
              </p>
              <p>Voici ce que j’ai constaté :</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  7&nbsp;203 sites ont pu être examinés, parmi lesquels 6&nbsp;874 ne présentaient
                  aucune information trouvée permettant de relier les plats proposés à leurs
                  allergènes.
                </li>
                <li>
                  820 sites n’ont pas pu être examinés, parce qu’ils étaient indisponibles ou
                  bloquaient la lecture automatique.
                </li>
              </ul>
              <p>
                Plus de 95&nbsp;% des sites examinés ne présentaient aucune information trouvée
                reliant les plats proposés à leurs allergènes.
              </p>
              <p>
                Ce résultat doit être interprété avec précaution. Cette recherche ne constitue pas
                un recensement exhaustif de tous les restaurants parisiens. Certains contenus ont
                également pu échapper à la recherche automatisée, et les informations peuvent avoir
                changé depuis août 2026.
              </p>
              <p>Surtout, cette étude concerne uniquement les informations accessibles en ligne.</p>
              <p>
                L’absence d’information trouvée sur internet ne signifie donc pas que le restaurant
                ne respecte pas ses obligations légales sur place. Elle montre néanmoins combien il
                reste difficile, pour une personne allergique, de choisir un établissement en
                connaissance de cause avant de s’y rendre.
              </p>
            </Section>

            <Section
              id="sans-allergenes"
              title="Sans Allergènes : rendre ces informations plus faciles à trouver"
            >
              <p>
                C’est pour répondre à cette difficulté que j’ai créé{" "}
                <Link className={LINK_CLASS} to="/">
                  Sans Allergènes
                </Link>
                .
              </p>
              <p>
                L’objectif est simple : permettre aux personnes concernées par les allergies
                alimentaires de rechercher un restaurant et de consulter les informations
                disponibles sur les allergènes de ses plats.
              </p>
              <p>
                Au 8 octobre 2026, Sans Allergènes référence 369 restaurants, représentant
                7&nbsp;246 plats et boissons issus de 127 cartes. Une même carte peut concerner
                plusieurs établissements, notamment lorsqu’ils appartiennent à une chaîne.
              </p>
              <p>
                Dans les prochains mois, l’objectif est d’élargir progressivement cette couverture à
                davantage de restaurants et de sites internet, afin de rendre toujours plus
                d’informations accessibles aux personnes allergiques.
              </p>
              <p>
                Mais référencer les informations existantes ne suffit pas. Encore faut-il encourager
                les restaurants à les rendre accessibles et à les maintenir à jour.
              </p>
            </Section>

            <Section
              id="demander"
              title="Et si nous demandions aux restaurants de publier leurs allergènes ?"
            >
              <p>
                Les restaurants disposent souvent déjà de ces informations pour leurs clients sur
                place. Les publier sur internet permettrait aux personnes allergiques de préparer
                leurs sorties plus facilement, sans devoir systématiquement appeler ou écrire à
                chaque établissement.
              </p>
              <p>
                Pour faciliter cette démarche, j’ai ajouté à Sans Allergènes la possibilité de
                contacter les restaurants grâce à des messages préparés.
              </p>
              <p>
                La carte du site recense également des établissements pour lesquels aucune carte
                d’allergènes n’a pu être intégrée. Parmi les restaurants identifiés :
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  855 restaurants sans liste d’allergènes trouvée en ligne disposent d’une adresse
                  e-mail et peuvent être contactés pour leur demander de publier ces informations.
                </li>
                <li>
                  274 restaurants disposant déjà d’une liste d’allergènes en ligne et d’une adresse
                  e-mail peuvent être contactés pour demander une précision ou une mise à jour.
                </li>
              </ul>
              <p>
                Ces chiffres concernent les possibilités de contact proposées sur la carte, et pas
                uniquement les 369 restaurants dont les cartes sont référencées avec leurs
                allergènes.
              </p>

              <h3 id="participer" className="scroll-mt-4 pt-2 text-lg font-bold text-neutral-900">
                Comment participer ?
              </h3>
              <p>
                Rendez-vous sur la{" "}
                <Link className={LINK_CLASS} to="/carte">
                  carte de Sans Allergènes
                </Link>
                .
              </p>
              <p>
                Pour afficher également les restaurants sans informations allergènes trouvées en
                ligne, décochez le filtre «&nbsp;Informations allergènes disponibles
                uniquement&nbsp;».
              </p>
              <p>
                Lorsqu’une adresse e-mail est disponible, vous pouvez utiliser le message préparé
                pour contacter l’établissement. Le message s’ouvre dans votre propre messagerie et
                vous l’envoyez directement au restaurant, sans passer par Sans Allergènes.
              </p>
              <p>
                L’objectif est d’encourager des demandes individuelles, courtoises et constructives,
                plutôt que des envois massifs. Quelques minutes suffisent pour expliquer à un
                restaurateur pourquoi une liste d’allergènes consultable en ligne serait utile à ses
                clients.
              </p>
              <p>
                Si vous constatez en revanche qu’un restaurant ne met pas à disposition
                l’information écrite obligatoire sur place, vous pouvez signaler ce problème sur{" "}
                <ExternalLink href="https://signal.conso.gouv.fr/fr/cafe-restaurant">
                  SignalConso
                </ExternalLink>
                , la plateforme publique de la DGCCRF.
              </p>
            </Section>

            <Section
              id="dialogue"
              title="Une information utile, qui ne remplace pas le dialogue avec le restaurant"
            >
              <p>
                Une liste d’allergènes disponible en ligne permet de faire un premier choix, mais
                elle ne garantit pas à elle seule qu’un plat soit adapté à toutes les allergies.
              </p>
              <p>
                Les recettes peuvent évoluer, les informations ne pas être à jour et des
                contaminations croisées peuvent survenir pendant la préparation.
              </p>
              <p>
                Même lorsqu’une liste est disponible, il reste donc essentiel de toujours signaler
                son allergie au personnel avant de commander, afin de vérifier les ingrédients et
                les conditions de préparation.
              </p>
              <p>
                Alors, si un restaurant que vous aimez ne publie pas encore ses allergènes, pourquoi
                ne pas lui envoyer un petit message ? Une liste rendue accessible pourra être utile
                à toutes les personnes qui cherchent, elles aussi, à savoir ce qu’elles pourront
                manger avant de sortir.
              </p>
            </Section>

            <Section id="sources" title="Sources officielles">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <ExternalLink href="https://eur-lex.europa.eu/legal-content/FR/ALL/?uri=CELEX:32011R1169">
                    Règlement européen n°&nbsp;1169/2011, articles 9, 14 et 44 et annexe II
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000030491684">
                    Décret n°&nbsp;2015-447 du 17 avril 2015, Légifrance
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032807854">
                    Code de la consommation, article R.&nbsp;412-14, Légifrance
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink href="https://www.economie.gouv.fr/dgccrf/laction-de-la-dgccrf/les-enquetes/etiquetage-des-denrees-alimentaires-controle-de">
                    DGCCRF, Contrôle de l’application du règlement INCO, enquête de 2015
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink href="https://www.economie.gouv.fr/dgccrf/laction-de-la-dgccrf/les-enquetes-et-les-controles/gare-aux-tromperies-sur-les-plats-livres">
                    DGCCRF, Gare aux tromperies sur les plats livrés à domicile, 8 août 2025
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink href="https://signal.conso.gouv.fr/fr/cafe-restaurant">
                    SignalConso, Cafés et restaurants
                  </ExternalLink>
                </li>
              </ul>
            </Section>
          </div>
        </article>
      </div>
    </div>
  );
}
