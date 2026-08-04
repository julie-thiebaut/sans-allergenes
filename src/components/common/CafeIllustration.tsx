import cafeUrl from "../../assets/cafe.svg";

/**
 * Hero illustration, loaded as a URL rather than inlined: the artwork is large, and keeping it
 * a separate file means the browser caches it on its own instead of it riding along in every
 * JS bundle download.
 *
 * The movement lives inside the SVG, not here. It animates the arms, head, plant and hanging
 * lamps independently, the way the Lottie source does — a transform on this <img> could only
 * ever move the whole picture at once, which reads as the drawing sliding rather than the
 * scene being alive. CSS animations still run in an `<img>`-referenced SVG (scripts do not),
 * and the reduced-motion query inside it follows the viewer's system preference.
 *
 * `alt=""` because it is decorative — the heading beside it already says what the page is
 * about, so announcing the drawing would only add noise for screen readers.
 */
export function CafeIllustration() {
  return <img src={cafeUrl} alt="" loading="eager" className="h-auto w-full max-w-lg" />;
}
