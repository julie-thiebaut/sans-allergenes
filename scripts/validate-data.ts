import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MenuSchema, RestaurantListSchema } from "../src/data/schemas";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, "../public/data");

function printErrorsAndExit(errors: string[]): void {
  if (errors.length > 0) {
    console.error(`\n❌ Validation des données échouée (${errors.length} erreur(s)) :\n`);
    for (const error of errors) console.error(`- ${error}\n`);
    process.exit(1);
  }
  console.log("✅ Toutes les données (restaurants + menus) sont valides.");
}

async function main(): Promise<void> {
  const errors: string[] = [];

  const restaurantsRaw = await readFile(path.join(DATA_DIR, "restaurants.json"), "utf-8");
  const restaurantsResult = RestaurantListSchema.safeParse(JSON.parse(restaurantsRaw));

  if (!restaurantsResult.success) {
    printErrorsAndExit([`restaurants.json invalide :\n${restaurantsResult.error.message}`]);
    return;
  }

  const restaurants = restaurantsResult.data;
  const menusDir = path.join(DATA_DIR, "menus");
  const menuFiles = (await readdir(menusDir)).filter((file) => file.endsWith(".json"));

  const menuIdsOnDisk = new Set(menuFiles.map((file) => file.replace(/\.json$/, "")));
  const menuIdsReferenced = new Set(
    restaurants.map((restaurant) => restaurant.menuId).filter((id): id is string => Boolean(id)),
  );

  for (const menuId of menuIdsReferenced) {
    if (!menuIdsOnDisk.has(menuId)) {
      errors.push(
        `Un restaurant référence menuId="${menuId}" mais public/data/menus/${menuId}.json est introuvable.`,
      );
    }
  }

  for (const file of menuFiles) {
    const menuId = file.replace(/\.json$/, "");
    const raw = await readFile(path.join(menusDir, file), "utf-8");

    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch (error) {
      errors.push(`menus/${file} n'est pas un JSON valide : ${(error as Error).message}`);
      continue;
    }

    const result = MenuSchema.safeParse(json);
    if (!result.success) {
      errors.push(`menus/${file} invalide :\n${result.error.message}`);
      continue;
    }

    const menu = result.data;
    if (menu.menuId !== menuId) {
      errors.push(
        `menus/${file} : le champ menuId ("${menu.menuId}") ne correspond pas au nom de fichier ("${menuId}").`,
      );
    }
    if (!restaurants.some((restaurant) => restaurant.id === menu.restaurantId)) {
      errors.push(
        `menus/${file} : restaurantId "${menu.restaurantId}" ne correspond à aucun restaurant.`,
      );
    }
    if (!menuIdsReferenced.has(menuId)) {
      errors.push(
        `menus/${file} : ce menu n'est référencé par aucun restaurant (menuId orphelin).`,
      );
    }
  }

  printErrorsAndExit(errors);
}

main().catch((error: unknown) => {
  console.error("Erreur inattendue lors de la validation des données :", error);
  process.exit(1);
});
