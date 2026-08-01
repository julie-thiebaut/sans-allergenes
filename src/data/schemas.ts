import { z } from "zod";

/**
 * The 14 EU-regulated allergens (Regulation (EU) No 1169/2011, Annex II).
 * Used as object keys, so identifiers are ASCII/snake_case rather than the French labels
 * (see allergenLabels.ts for the French display strings).
 */
export const ALLERGEN_IDS = [
  "gluten",
  "crustaces",
  "oeufs",
  "poisson",
  "arachides",
  "soja",
  "lait",
  "fruits_a_coque",
  "celeri",
  "moutarde",
  "sesame",
  "sulfites",
  "lupin",
  "mollusques",
] as const;

export const AllergenIdSchema = z.enum(ALLERGEN_IDS);
export type AllergenId = z.infer<typeof AllergenIdSchema>;

/**
 * Safety-critical: this type intentionally has no "safe" / "absent" value.
 * `not_declared` and `unknown` must never be treated as equivalent to "no allergen" —
 * see src/filtering/allergenLogic.ts, the single place allowed to turn this into UI copy.
 */
export const AllergenStatusSchema = z.enum(["present", "may_contain", "not_declared", "unknown"]);
export type AllergenStatus = z.infer<typeof AllergenStatusSchema>;

// z.record with an enum key does NOT enforce that every key is present, only that any
// keys that ARE present are valid — hence the .refine() forcing all 14 allergens to be
// declared per dish, so a missing key can never be silently mistaken for "no info".
export const AllergenMapSchema = z
  .record(AllergenIdSchema, AllergenStatusSchema)
  .refine((map) => ALLERGEN_IDS.every((id) => id in map), {
    message: "All 14 EU allergens must have an explicit status for every dish",
  });
export type AllergenMap = Record<AllergenId, AllergenStatus>;

export const PriceLevelSchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]);
export type PriceLevel = z.infer<typeof PriceLevelSchema>;

export const RestaurantSourceSchema = z.object({
  label: z.string().min(1),
  url: z.string().url().optional(),
});

export const RestaurantSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase kebab-case"),
  address: z.string().min(1),
  postalCode: z.string().regex(/^\d{5}$/, "postalCode must be a 5-digit French postal code"),
  city: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  cuisineTypes: z.array(z.string().min(1)).min(1),
  description: z.string().optional(),
  websiteUrl: z.string().url().optional(),
  phone: z.string().optional(),
  priceLevel: PriceLevelSchema.optional(),
  vegetarianOptions: z.boolean(),
  veganOptions: z.boolean(),
  imageUrl: z.string().optional(),
  allergenInformationAvailable: z.boolean(),
  lastVerifiedAt: z.string().datetime().optional(),
  source: RestaurantSourceSchema.optional(),
  menuId: z.string().optional(),
  /** Marks clearly-fictional demo entries. Absent/false = not demo data. */
  isDemoData: z.literal(true).optional(),
});
export type Restaurant = z.infer<typeof RestaurantSchema>;

export const RestaurantListSchema = z
  .array(RestaurantSchema)
  .refine((list) => new Set(list.map((r) => r.id)).size === list.length, {
    message: "Restaurant ids must be unique",
  })
  .refine((list) => new Set(list.map((r) => r.slug)).size === list.length, {
    message: "Restaurant slugs must be unique",
  });

export const DishSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  allergens: AllergenMapSchema,
  description: z.string().optional(),
});
// Zod infers z.record(enumKey, value) as Partial<Record<...>> (it can't statically guarantee
// every enum key is present, only validate the ones that are — that's exactly why the .refine()
// above enforces it at runtime). Override the field here so the *type* matches what's actually
// guaranteed once validation has run, instead of forcing `?? "unknown"` fallbacks everywhere
// this is consumed.
export type Dish = Omit<z.infer<typeof DishSchema>, "allergens"> & { allergens: AllergenMap };

export const MenuCategorySchema = z.object({
  category: z.string().min(1),
  dishes: z.array(DishSchema).min(1),
});
export type MenuCategory = Omit<z.infer<typeof MenuCategorySchema>, "dishes"> & { dishes: Dish[] };

export const MenuSchema = z.object({
  menuId: z.string().min(1),
  restaurantId: z.string().min(1),
  categories: z.array(MenuCategorySchema).min(1),
});
export type Menu = Omit<z.infer<typeof MenuSchema>, "categories"> & { categories: MenuCategory[] };

export const ConfigSchema = z.object({
  googleMapsEnabled: z.boolean(),
});
export type AppConfig = z.infer<typeof ConfigSchema>;
