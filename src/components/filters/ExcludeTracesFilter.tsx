import { useMessages } from "../../i18n/useLocale";
import { useFilterDispatch, useFilterState } from "../../state/FilterStateContext";

export function ExcludeTracesFilter() {
  const { excludeTraces } = useFilterState();
  const dispatch = useFilterDispatch();
  const t = useMessages();

  return (
    <label className="flex items-center gap-2 text-sm text-neutral-700 md:whitespace-nowrap">
      <input
        type="checkbox"
        checked={excludeTraces}
        onChange={(event) => dispatch({ type: "SET_EXCLUDE_TRACES", value: event.target.checked })}
      />
      {t.filters.excludeTraces}
    </label>
  );
}
