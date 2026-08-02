export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-white px-4 py-3 text-center text-sm text-neutral-500">
      © {year} Julie Thiebaut
    </footer>
  );
}
