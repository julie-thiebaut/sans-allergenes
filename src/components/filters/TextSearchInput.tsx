import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import type { AddressSuggestion } from "../../maps/MapsAdapter";
import { useMapActionsContext } from "../../state/mapActionsContext";

const SUGGESTION_DEBOUNCE_MS = 300;

/**
 * Address-only search: typing shows live Paris-biased address suggestions, and picking one
 * recenters the map there. It deliberately does NOT filter the restaurant list by text — the
 * map's visible area is the single mechanism that decides which restaurants are listed.
 */
export function TextSearchInput() {
  const { actions } = useMapActionsContext();
  const [inputText, setInputText] = useState("");
  const [addressNotFound, setAddressNotFound] = useState(false);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const requestIdRef = useRef(0);
  // Selecting a suggestion fills the input with its full description, which would otherwise
  // re-trigger the fetch effect and pop the dropdown back open right after picking a result.
  const suppressNextFetchRef = useRef(false);

  // Debounced live suggestions as the user types — never fires per keystroke, to keep the
  // Places quota (and the session-token billing bundling) sane.
  useEffect(() => {
    if (suppressNextFetchRef.current) {
      suppressNextFetchRef.current = false;
      return;
    }
    if (!actions || !inputText.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    const requestId = ++requestIdRef.current;
    const timer = setTimeout(() => {
      void actions.getAddressSuggestions(inputText).then((results) => {
        if (requestId !== requestIdRef.current) return; // a newer request has since started
        setSuggestions(results);
        setIsOpen(results.length > 0);
        setHighlightedIndex(-1);
      });
    }, SUGGESTION_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [inputText, actions]);

  // Submitting without picking a suggestion falls back to whichever suggestion is currently
  // first — no extra geocoding call needed, since Autocomplete has already fetched it.
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const topSuggestion = suggestions[0];
    if (!topSuggestion) {
      setIsOpen(false);
      setAddressNotFound(inputText.trim().length > 0);
      return;
    }
    await selectSuggestion(topSuggestion);
  }

  async function selectSuggestion(suggestion: AddressSuggestion) {
    setIsOpen(false);
    setSuggestions([]);
    suppressNextFetchRef.current = true;
    setInputText(suggestion.description);
    if (!actions) return;
    const found = await actions.selectSuggestion(suggestion.placeId);
    setAddressNotFound(!found);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || suggestions.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1));
    } else if (event.key === "Escape") {
      setIsOpen(false);
    } else if (event.key === "Enter" && highlightedIndex >= 0) {
      const suggestion = suggestions[highlightedIndex];
      if (!suggestion) return;
      event.preventDefault();
      void selectSuggestion(suggestion);
    }
  }

  return (
    <form className="relative" onSubmit={handleSubmit}>
      <label htmlFor="address-search" className="sr-only">
        Rechercher une adresse
      </label>
      <input
        id="address-search"
        type="search"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="address-suggestions"
        aria-autocomplete="list"
        autoComplete="off"
        value={inputText}
        onChange={(event) => {
          setInputText(event.target.value);
          setAddressNotFound(false);
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => setIsOpen(false)}
        placeholder="Rechercher une adresse…"
        className="w-full rounded-full border border-neutral-300 py-2 pl-4 pr-10 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
      />
      <button
        type="submit"
        aria-label="Zoomer sur l'adresse recherchée"
        className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="m20 20-3.5-3.5" />
        </svg>
      </button>
      {isOpen && (
        <ul
          id="address-suggestions"
          role="listbox"
          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-md border border-neutral-200 bg-white py-1 shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <li key={suggestion.placeId} role="option" aria-selected={index === highlightedIndex}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectSuggestion(suggestion)}
                className={`block w-full px-4 py-2 text-left text-sm ${
                  index === highlightedIndex
                    ? "bg-brand-50 text-brand-800"
                    : "text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                {suggestion.description}
              </button>
            </li>
          ))}
        </ul>
      )}
      {addressNotFound && (
        <p className="absolute left-4 top-full mt-1 text-xs text-red-600">Adresse introuvable</p>
      )}
    </form>
  );
}
