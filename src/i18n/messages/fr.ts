import type { AllergenId, AllergenStatus, DietTag } from "../../data/schemas";

/**
 * Every interface string the site shows, in French. `en.ts` must have the same shape: the type
 * `Messages` is taken from this file, so a string missing in English fails the type check.
 *
 * Wording rule, in both languages: describe what a restaurant DECLARED, never what a dish
 * contains. Nothing may read as "safe", "sans risque", "allergen-free" or a guarantee.
 */
export const fr = {
  siteName: "Sans Allergènes",

  allergens: {
    gluten: "Gluten",
    crustaces: "Crustacés",
    oeufs: "Œufs",
    poisson: "Poisson",
    arachides: "Arachides",
    soja: "Soja",
    lait: "Lait",
    fruits_a_coque: "Fruits à coque",
    celeri: "Céleri",
    moutarde: "Moutarde",
    sesame: "Sésame",
    sulfites: "Sulfites",
    lupin: "Lupin",
    mollusques: "Mollusques",
  } satisfies Record<AllergenId, string> as Record<AllergenId, string>,

  /** Deliberately none of these say "safe"/"sûr"/"sans risque". */
  allergenStatus: {
    present: "Présent",
    may_contain: "Traces possibles",
    not_declared: "Non renseigné",
    unknown: "Inconnu",
  } satisfies Record<AllergenStatus, string> as Record<AllergenStatus, string>,

  allergenStatusDescriptions: {
    present: "Cet allergène est déclaré présent dans ce plat.",
    may_contain: "Des traces de cet allergène sont possibles (contamination croisée).",
    not_declared: "Le restaurant n'a pas renseigné d'information pour cet allergène.",
    unknown: "Aucune information disponible pour cet allergène.",
  } satisfies Record<AllergenStatus, string> as Record<AllergenStatus, string>,

  dietTags: {
    vegetarien: "Végétarien",
    vegan: "Végan",
  } satisfies Record<DietTag, string> as Record<DietTag, string>,

  common: {
    loading: "Chargement…",
    errorTitle: "Une erreur est survenue",
    unexpectedDataError: "Une erreur inattendue est survenue lors du chargement des restaurants.",
    demoData: "Donnée de démonstration",
    allergenInfoUnavailable: "Infos allergènes non disponibles",
    priceLevel: (level: number, max: number) => `Niveau de prix : ${level} sur ${max}`,
    exploreMap: "Explorer la carte",
  },

  languageSwitch: {
    /** The link to the other language, written in that language. */
    label: "English",
    ariaLabel: "Read this page in English",
    hreflang: "en",
  },

  footer: {
    navLabel: "Informations sur le site",
    notes: "Notes",
    legal: "Mentions légales",
    privacy: "Politique de confidentialité",
    cookies: "Gérer les cookies",
    contact: "Contact",
  },

  legalLayout: {
    lastUpdated: "Dernière mise à jour : 4 octobre 2026",
  },

  notFound: {
    title: "Page introuvable",
    backHome: "Retour à l’accueil",
  },

  mapPage: {
    heading: "La carte des restaurants et des allergènes de leurs plats",
    loadingRestaurants: "Chargement des restaurants…",
    filterByAllergens: "Filtrer par allergènes",
    lastUpdate: (monthYear: string) => `Mise à jour : ${monthYear}`,
    viewToggleLabel: "Affichage",
    viewList: "Liste",
    viewMap: "Carte",
  },

  filters: {
    sheetTitle: "Filtres",
    closeSheet: "Fermer les filtres",
    vegetarian: "Plats végétariens",
    vegan: "Plats végétaliens",
    meat: "Plats carnés",
    allergenInfoOnly: "Informations allergènes disponibles uniquement",
    excludeTraces: "Exclure les traces possibles",
    reset: "Réinitialiser les filtres",
    allergensToAvoid: "Allergènes à éviter",
    listDescription: (excludeTraces: boolean, several: boolean) =>
      "Un restaurant est retiré des résultats quand tous ses plats déclarent " +
      (several ? "l’un de ces allergènes" : "cet allergène") +
      " comme " +
      (excludeTraces ? "présent ou en traces." : "présent."),
    menuDescription: (excludeTraces: boolean, several: boolean) => {
      const allergen = several ? "l’un de ces allergènes" : "cet allergène";
      return excludeTraces
        ? `Les plats déclarant ${allergen}, présent ou en traces, sont masqués. Ceux sans ` +
            "information restent affichés : leur présence dans la carte ne constitue jamais une " +
            "garantie."
        : `Les plats déclarant ${allergen} comme présent sont masqués. Les plats « traces ` +
            "possibles » et ceux sans information restent affichés : leur présence dans la carte ne " +
            "constitue jamais une garantie.";
    },
  },

  addressSearch: {
    label: "Rechercher une adresse",
    placeholder: "Rechercher une adresse…",
    submit: "Zoomer sur l'adresse recherchée",
    notFound: "Adresse introuvable",
  },

  list: {
    label: "Liste des restaurants",
    empty: "Aucun restaurant ne correspond à votre recherche. Essayez d’élargir vos filtres.",
    resultCount: (count: number) =>
      `${count} restaurant${count > 1 ? "s" : ""} ${count > 1 ? "trouvés" : "trouvé"}`,
    verifiedOn: (date: string) => `Vérifié le ${date}`,
    /**
     * « 10 plats sur 99 ne déclarent pas l'allergène à éviter » : ne le déclarent pas PRÉSENT.
     * « Ne déclare pas », jamais « sans » : un plat qui ne déclare rien ne promet rien.
     */
    avoidance: {
      incomplete: (several: boolean) =>
        `Information incomplète pour ${several ? "les allergènes" : "l’allergène"} à éviter`,
      clear: (clear: number, total: number, drinks: boolean, several: boolean) => {
        const noun = drinks ? (clear > 1 ? "boissons" : "boisson") : clear > 1 ? "plats" : "plat";
        const verb = clear > 1 ? "ne déclarent" : "ne déclare";
        return `${clear} ${noun} sur ${total} ${verb} ${several ? "aucun des allergènes" : "pas l’allergène"} à éviter`;
      },
      none: (drinks: boolean, several: boolean) =>
        `${drinks ? "Aucune boisson" : "Aucun plat"} ne déclare ${several ? "les allergènes" : "l’allergène"} à éviter`,
    },
  },

  map: {
    label: "Carte des restaurants",
    loading: "Chargement de la carte…",
    unavailableTitle: "Carte temporairement indisponible",
    unavailableBody:
      "La liste des restaurants reste utilisable sans la carte. Réessayez plus tard.",
    closePreview: "Fermer l'aperçu",
    openRecord: "Voir la fiche",
    outsideCoverageBefore:
      "Pour le moment, les restaurants référencés se situent dans un nombre limité de villes. La carte a vocation à s’étendre progressivement à toute la France. Si vous souhaitez suggérer une ville à ajouter, écrivez à ",
  },

  restaurant: {
    notFound: "Restaurant introuvable.",
    backToMap: "Retour à la carte",
    backToList: "Retour à la liste",
    website: "Site du restaurant",
    /** Shown only in English: dish names and sections are quoted as published. */
    menuLanguageNote: null as string | null,
    hidden: (dishCount: number, drinkCount: number) => {
      // « 3 plats et 2 boissons masqués », « 1 boisson masquée » : les boissons comptées à part.
      const dishes = `${dishCount} plat${dishCount > 1 ? "s" : ""}`;
      const drinks = `${drinkCount} boisson${drinkCount > 1 ? "s" : ""}`;
      if (drinkCount === 0) return `${dishes} masqué${dishCount > 1 ? "s" : ""}`;
      if (dishCount === 0) return `${drinks} masquée${drinkCount > 1 ? "s" : ""}`;
      return `${dishes} et ${drinks} masqués`;
    },
    hiddenReason: (several: boolean, excludeTraces: boolean) =>
      `${several ? "un des allergènes" : "l’allergène"} à éviter y est déclaré${excludeTraces ? ", présent ou en traces." : " présent."}`,
    noDishLeft: "Aucun plat de cette carte ne correspond aux allergènes à éviter sélectionnés.",
    publishedElsewhere:
      "Ce restaurant publie ses informations allergènes, mais elles ne sont pas reprises plat par plat sur ce site.",
    consult: "Consultez",
    publishedSource: "la source publiée par l’enseigne",
    orAskInRoom: "ou demandez le document en salle avant de commander.",
    askInRoom: "Demandez le document en salle avant de commander.",
    noInformation:
      "Aucune information sur les allergènes n’est disponible pour ce restaurant. Contactez directement l’établissement avant de commander si vous avez une allergie.",
    source: "Source :",
    alsoPublished: "Également publié :",
    lastVerified: (date: string) => `Dernière vérification : ${date}`,
    disclaimer:
      "Les informations présentées sont indicatives et peuvent évoluer. En cas d’allergie, contactez directement le restaurant avant de commander et signalez votre allergie au personnel. Une absence d’information ne signifie pas une absence d’allergène.",
    dish: {
      present: "Présent :",
      mayContain: "Traces possibles :",
      presentList: (dish: string) => `Allergènes présents dans ${dish}`,
      mayContainList: (dish: string) => `Traces possibles dans ${dish}`,
      diets: (dish: string) => `Régimes signalés pour ${dish}`,
      noneDeclared: "Aucun allergène signalé par le restaurant",
    },
    contact: {
      readerChain: "au service client de l’enseigne",
      readerRestaurant: "au restaurant",
      publishTitle: "Demandez-lui de publier ses allergènes",
      publishBody:
        "Chaque message compte : une fois sa liste en ligne, sa carte pourra figurer ici, plat par plat.",
      publishButton: "Écrire au restaurant",
      publishHint: (reader: string, email: string) =>
        `Votre messagerie s’ouvre sur un message prêt à envoyer, adressé ${reader} (${email}).`,
      questionTitle: "Une question sur un plat ou un allergène ?",
      questionBody:
        "Un plat absent, un allergène qui vous semble oublié : demandez au restaurant de préciser sa carte des allergènes.",
      questionButton: "Contacter le restaurant",
      questionHint: (reader: string, email: string) =>
        `Votre messagerie s’ouvre sur un message à compléter, adressé ${reader} (${email}).`,
      reportQuestion: "Une erreur sur cette fiche ?",
      reportLink: "Signaler un problème",
      reportEmail: (email: string) => ` (courriel à ${email})`,
    },
  },

  cuisine: {
    vegan: "végétaliens",
    vegetarian: "végétariens",
    meat: "carnés",
    /** « plats végétariens et carnés disponibles » */
    dietMention: (diets: string[]) => `plats ${diets.join(" et ")} disponibles`,
  },

  consent: {
    label: "Choix relatifs à la mesure d’audience",
    title: "Mesure d’audience facultative",
    body: "Sans Allergènes est gratuit. Compter les visites et les pages consultées nous aide à savoir quels restaurants ajouter ensuite. Vos filtres d’allergènes et vos recherches d’adresse ne sont jamais transmis à Analytics.",
    learnMore: "En savoir plus",
    close: "Fermer les réglages de cookies",
    refuse: "Refuser",
    accept: "Accepter",
  },

  landing: {
    titleBefore: "Trouvez où manger",
    titleHighlight: "sans allergènes",
    intro:
      "En France, la loi impose aux restaurants de déclarer la présence de 14 allergènes. Consultez leurs déclarations et préparez votre sortie plus sereinement.",
    howItWorks: "Comment ça marche ?",
    steps: [
      {
        title: "Recherchez une adresse",
        body: "Découvrez les restaurants référencés autour de l’adresse de votre choix.",
      },
      {
        title: "Sélectionnez vos allergènes",
        body: "Les plats pour lesquels les allergènes que vous évitez sont déclarés sont automatiquement masqués.",
      },
      {
        title: "Consultez les menus",
        body: "Retrouvez, pour chaque plat, les allergènes communiqués par le restaurant.",
      },
    ],
    allergensTitle: "Les 14 allergènes suivis",
    allergensBody:
      "Tous les allergènes dont la présence doit obligatoirement être signalée dans la restauration.",
    whoTitle: "Qui est derrière ce site ?",
    // Le texte de Julie, à la première personne : à garder tel quel.
    whoBody:
      "Moi-même allergique, je sais combien il peut être difficile de trouver les informations sur les allergènes avant de choisir un restaurant. J’ai créé Sans Allergènes pour les rendre plus accessibles et aider d’autres personnes à préparer leurs sorties. Je m’en occupe bénévolement : c’est un projet personnel, sans partenariat commercial avec les restaurants.",
    noteKicker: "Note",
    noteBody1:
      "En août 2026, j’ai examiné plus de 7 200 sites de restaurants parisiens. Sur plus de 95 % d’entre eux, aucune information reliant les plats à leurs allergènes n’a été trouvée.",
    noteBody2:
      "Découvrez les résultats de cette recherche et comment aider à rendre ces informations plus accessibles.",
    readNote: "Lire la note",
    limitsTitle: "Signalez toujours votre allergie",
    limitsBody:
      "Les informations présentées sur ce site correspondent aux allergènes déclarés par les restaurants. Les recettes, les ingrédients et les méthodes de préparation peuvent toutefois évoluer.",
    limitsStrong:
      "Avant de commander, informez toujours le personnel de votre allergie et vérifiez avec lui que le plat peut vous convenir, notamment en cas de risque de contamination croisée.",
    closingTitle: "Trouvez votre prochain restaurant",
    closingBody:
      "Découvrez les restaurants autour de vous et filtrez leurs plats selon les allergènes que vous évitez.",
  },

  /** Search and share metadata. No city named in a title: the coverage area is meant to grow. */
  seo: {
    shareImageAlt: "Sans Allergènes : les allergènes déclarés par les restaurants, plat par plat.",
    homeTitle: "Sans Allergènes · Trouvez un restaurant selon vos allergies",
    homeDescription:
      "Les 14 allergènes réglementaires déclarés par les restaurants, plat par plat. Filtrez la carte selon ceux que vous évitez.",
    mapTitle: "La carte des restaurants · Sans Allergènes",
    mapDescription:
      "Parcourez la carte des restaurants et consultez les informations disponibles sur les allergènes de leurs plats.",
    legalTitle: "Mentions légales et conditions d’utilisation · Sans Allergènes",
    legalDescription:
      "Mentions légales, hébergement et conditions d’utilisation du service Sans Allergènes.",
    privacyTitle: "Confidentialité et cookies · Sans Allergènes",
    privacyDescription:
      "Politique de confidentialité et informations sur les cookies et services tiers utilisés par Sans Allergènes.",
    noteTitle: "Allergènes au restaurant : ce que dit la loi, ce que l’on trouve en ligne",
    /** Written out rather than formatted from the ISO date, which would shift a day west of Paris. */
    noteDateLabel: "8 octobre 2026",
    noteDescription:
      "Ce que la loi impose aux restaurants sur les allergènes, ce que constatent les contrôles de la DGCCRF, et ce que l’on trouve sur plus de 7 200 sites de restaurants parisiens.",
    restaurantTopicWith: "allergènes de la carte",
    restaurantTopicWithout: "allergènes non publiés",
    restaurantDescriptionWith: (name: string, cuisines: string, city: string) =>
      `Informations sur les allergènes pour ${name}, ${cuisines} à ${city}.`,
    restaurantDescriptionWithout: (name: string) =>
      `${name} ne publie pas les allergènes de ses plats en ligne. Demandez-lui de publier sa liste.`,
  },
};

export type Messages = typeof fr;
