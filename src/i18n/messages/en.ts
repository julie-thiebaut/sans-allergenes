import type { Messages } from "./fr";

/**
 * The English interface. British spelling throughout (sulphites, molluscs, soya): it is the spelling
 * of the EU regulation's English text, which these 14 allergens come from.
 *
 * Same wording rule as in French: describe what a restaurant DECLARED, never what a dish contains.
 * "Does not declare", never "free from", "safe" or "without".
 */
export const en: Messages = {
  siteName: "Sans Allergènes",

  allergens: {
    gluten: "Gluten",
    crustaces: "Crustaceans",
    oeufs: "Eggs",
    poisson: "Fish",
    arachides: "Peanuts",
    soja: "Soya",
    lait: "Milk",
    fruits_a_coque: "Tree nuts",
    celeri: "Celery",
    moutarde: "Mustard",
    sesame: "Sesame",
    sulfites: "Sulphites",
    lupin: "Lupin",
    mollusques: "Molluscs",
  },

  allergenStatus: {
    present: "Present",
    may_contain: "Possible traces",
    not_declared: "Not specified",
    unknown: "Unknown",
  },

  allergenStatusDescriptions: {
    present: "This allergen is declared present in this dish.",
    may_contain: "Traces of this allergen are possible (cross-contamination).",
    not_declared: "The restaurant has not given any information for this allergen.",
    unknown: "No information available for this allergen.",
  },

  dietTags: {
    vegetarien: "Vegetarian",
    vegan: "Vegan",
  },

  common: {
    loading: "Loading…",
    errorTitle: "Something went wrong",
    unexpectedDataError: "An unexpected error occurred while loading the restaurants.",
    demoData: "Demo data",
    allergenInfoUnavailable: "Allergen information not available",
    priceLevel: (level, max) => `Price level: ${level} out of ${max}`,
    exploreMap: "Explore the map",
  },

  languageSwitch: {
    label: "Français",
    ariaLabel: "Lire cette page en français",
    hreflang: "fr",
  },

  footer: {
    navLabel: "About the site",
    notes: "Notes",
    legal: "Legal notice",
    privacy: "Privacy policy",
    cookies: "Manage cookies",
    contact: "Contact",
  },

  legalLayout: {
    lastUpdated: "Last updated: 4 October 2026",
  },

  notFound: {
    title: "Page not found",
    backHome: "Back to the home page",
  },

  mapPage: {
    heading: "The map of restaurants and the allergens in their dishes",
    loadingRestaurants: "Loading restaurants…",
    filterByAllergens: "Filter by allergens",
    lastUpdate: (monthYear) => `Updated: ${monthYear}`,
    viewToggleLabel: "View",
    viewList: "List",
    viewMap: "Map",
  },

  filters: {
    sheetTitle: "Filters",
    closeSheet: "Close the filters",
    vegetarian: "Vegetarian dishes",
    vegan: "Vegan dishes",
    meat: "Meat dishes",
    allergenInfoOnly: "Only restaurants with allergen information",
    excludeTraces: "Exclude possible traces",
    reset: "Reset filters",
    allergensToAvoid: "Allergens to avoid",
    listDescription: (excludeTraces, several) =>
      "A restaurant is removed from the results when all of its dishes declare " +
      (several ? "one of these allergens" : "this allergen") +
      " as " +
      (excludeTraces ? "present or as traces." : "present."),
    menuDescription: (excludeTraces, several) => {
      const allergen = several ? "one of these allergens" : "this allergen";
      return excludeTraces
        ? `Dishes declaring ${allergen}, present or as traces, are hidden. Dishes with no ` +
            "information stay visible: being on the menu is never a guarantee."
        : `Dishes declaring ${allergen} as present are hidden. Dishes with “possible traces” ` +
            "and dishes with no information stay visible: being on the menu is never a guarantee.";
    },
  },

  addressSearch: {
    label: "Search for an address",
    placeholder: "Search for an address…",
    submit: "Zoom to the address",
    notFound: "Address not found",
  },

  list: {
    label: "Restaurant list",
    empty: "No restaurant matches your search. Try widening your filters.",
    resultCount: (count) => `${count} restaurant${count === 1 ? "" : "s"} found`,
    verifiedOn: (date) => `Checked on ${date}`,
    avoidance: {
      incomplete: (several) =>
        `Incomplete information for the ${several ? "allergens" : "allergen"} to avoid`,
      clear: (clear, total, drinks, several) => {
        const noun = drinks ? (clear > 1 ? "drinks" : "drink") : clear > 1 ? "dishes" : "dish";
        const verb = clear > 1 ? "do not declare" : "does not declare";
        return `${clear} ${noun} out of ${total} ${verb} ${several ? "any of the allergens" : "the allergen"} to avoid`;
      },
      none: (drinks, several) =>
        `No ${drinks ? "drink" : "dish"} declares the ${several ? "allergens" : "allergen"} to avoid`,
    },
  },

  map: {
    label: "Restaurant map",
    loading: "Loading the map…",
    unavailableTitle: "Map temporarily unavailable",
    unavailableBody: "The restaurant list still works without the map. Please try again later.",
    closePreview: "Close the preview",
    openRecord: "View restaurant",
    outsideCoverageBefore:
      "For now, the restaurants listed are in a limited number of cities. The map is meant to grow gradually to cover the whole of France. To suggest a city, write to ",
  },

  restaurant: {
    notFound: "Restaurant not found.",
    backToMap: "Back to the map",
    backToList: "Back to the list",
    website: "Restaurant website",
    menuLanguageNote:
      "Dish names and menu sections are shown in French, exactly as the restaurant publishes them.",
    hidden: (dishCount, drinkCount) => {
      const dishes = `${dishCount} ${dishCount === 1 ? "dish" : "dishes"}`;
      const drinks = `${drinkCount} ${drinkCount === 1 ? "drink" : "drinks"}`;
      if (drinkCount === 0) return `${dishes} hidden`;
      if (dishCount === 0) return `${drinks} hidden`;
      return `${dishes} and ${drinks} hidden`;
    },
    hiddenReason: (several, excludeTraces) =>
      `${several ? "one of the allergens" : "the allergen"} to avoid is declared${excludeTraces ? ", present or as traces." : " present."}`,
    noDishLeft: "No dish on this menu matches the allergens to avoid you selected.",
    publishedElsewhere:
      "This restaurant publishes its allergen information, but it is not reproduced dish by dish on this site.",
    consult: "See",
    publishedSource: "the source published by the restaurant",
    orAskInRoom: "or ask staff for the document before ordering.",
    askInRoom: "Ask staff for the document before ordering.",
    noInformation:
      "No allergen information is available for this restaurant. If you have an allergy, contact the restaurant directly before ordering.",
    source: "Source:",
    alsoPublished: "Also published:",
    lastVerified: (date) => `Last checked: ${date}`,
    disclaimer:
      "This information is for guidance only and may change. If you have an allergy, contact the restaurant directly before ordering and tell the staff about your allergy. No information does not mean no allergen.",
    dish: {
      present: "Present:",
      mayContain: "Possible traces:",
      presentList: (dish) => `Allergens present in ${dish}`,
      mayContainList: (dish) => `Possible traces in ${dish}`,
      diets: (dish) => `Diets indicated for ${dish}`,
      noneDeclared: "No allergen reported by the restaurant",
    },
    contact: {
      readerChain: "the chain’s customer service",
      readerRestaurant: "the restaurant",
      publishTitle: "Ask them to publish their allergens",
      publishBody:
        "Every message counts: once their list is online, their menu can appear here, dish by dish.",
      publishButton: "Write to the restaurant",
      publishHint: (reader, email) =>
        `Your email app opens with a message ready to send, in French, addressed to ${reader} (${email}).`,
      questionTitle: "A question about a dish or an allergen?",
      questionBody:
        "A dish that is missing, an allergen that seems to have been left out: ask the restaurant to clarify its allergen menu.",
      questionButton: "Contact the restaurant",
      questionHint: (reader, email) =>
        `Your email app opens with a message in French to complete, addressed to ${reader} (${email}). You can write your question in English.`,
      reportQuestion: "Something wrong on this page?",
      reportLink: "Report a problem",
      reportEmail: (email) => ` (email to ${email})`,
    },
  },

  cuisine: {
    vegan: "vegan",
    vegetarian: "vegetarian",
    meat: "meat",
    dietMention: (diets) => `${diets.join(" and ")} dishes available`,
  },

  consent: {
    label: "Audience measurement choices",
    title: "Optional audience measurement",
    body: "Sans Allergènes is free. Counting visits and pages viewed helps us decide which restaurants to add next. Your allergen filters and address searches are never sent to Analytics.",
    learnMore: "Learn more",
    close: "Close cookie settings",
    refuse: "Decline",
    accept: "Accept",
  },

  landing: {
    titleBefore: "Find where to eat",
    titleHighlight: "with your allergies",
    intro:
      "In France, the law requires restaurants to declare the presence of 14 allergens. Read their declarations and plan your meal out with more peace of mind.",
    howItWorks: "How does it work?",
    steps: [
      {
        title: "Search for an address",
        body: "See the restaurants listed around the address of your choice.",
      },
      {
        title: "Select your allergens",
        body: "Dishes that declare the allergens you avoid are hidden automatically.",
      },
      {
        title: "Read the menus",
        body: "For each dish, see the allergens reported by the restaurant.",
      },
    ],
    allergensTitle: "The 14 allergens covered",
    allergensBody: "Every allergen whose presence restaurants are required to declare.",
    whoTitle: "Who is behind this site?",
    whoBody:
      "As someone with allergies myself, I know how hard it can be to find allergen information before choosing a restaurant. I created Sans Allergènes to make it easier to find and to help others plan their meals out. I run it as a volunteer: it is a personal project, with no commercial partnership with the restaurants.",
    noteKicker: "Note",
    noteBody1:
      "In August 2026, I looked at more than 7,200 Paris restaurant websites. On more than 95% of them, no information linking dishes to their allergens could be found.",
    noteBody2:
      "Read the results of this research, and how you can help make this information easier to find.",
    readNote: "Read the note",
    limitsTitle: "Always tell staff about your allergy",
    limitsBody:
      "The information on this site reflects the allergens declared by restaurants. Recipes, ingredients and preparation methods may change, however.",
    limitsStrong:
      "Before ordering, always tell the staff about your allergy and check with them that the dish is suitable for you, especially where there is a risk of cross-contamination.",
    closingTitle: "Find your next restaurant",
    closingBody:
      "Discover the restaurants around you and filter their dishes by the allergens you avoid.",
  },

  seo: {
    shareImageAlt: "Sans Allergènes: the allergens declared by restaurants, dish by dish.",
    homeTitle: "Sans Allergènes · Find a restaurant that suits your allergies",
    homeDescription:
      "The 14 regulated allergens as declared by restaurants, dish by dish. Filter the map by the ones you avoid.",
    mapTitle: "Restaurant map · Sans Allergènes",
    mapDescription:
      "Browse the map of restaurants and read the information available on the allergens in their dishes.",
    legalTitle: "Legal notice and terms of use · Sans Allergènes",
    legalDescription: "Legal notice, hosting and terms of use of the Sans Allergènes service.",
    privacyTitle: "Privacy and cookies · Sans Allergènes",
    privacyDescription:
      "Privacy policy and information on the cookies and third-party services used by Sans Allergènes.",
    noteTitle: "Allergens in restaurants: what the law says, what you find online",
    noteDateLabel: "8 October 2026",
    noteDescription:
      "What the law requires of restaurants on allergens, what French consumer-protection inspections find, and what can be found on more than 7,200 Paris restaurant websites.",
    restaurantTopicWith: "menu allergens",
    restaurantTopicWithout: "allergens not published",
    restaurantDescriptionWith: (name, cuisines, city) =>
      `Allergen information for ${name}, ${cuisines} in ${city}.`,
    restaurantDescriptionWithout: (name) =>
      `${name} does not publish the allergens in its dishes online. Ask them to publish their list.`,
  },
};
