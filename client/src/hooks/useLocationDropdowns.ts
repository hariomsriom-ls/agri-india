"use client";

import { useEffect, useState } from "react";
import type { DropdownProps } from "@/components/ui/Dropdown";
import {fetchCountries,fetchStates,fetchDistricts,type LocationOption,} from "@/services/fetchDropdownlist";

export type LocationSelection = {
  country: string;
  state: string;
  district: string;
};

type UseLocationDropdownsOptions = {
  value: Partial<LocationSelection>;
  onChange: (changes: Partial<LocationSelection>) => void;
  enabled?: boolean;
};

type OptionsResult = {
  parentId: string;
  attempt: number;
  options: LocationOption[];
  error: string;
};

type LocationLoader = (parentId: string, signal: AbortSignal) => Promise<LocationOption[]>;

function loadCountryOptions(_parentId: string, signal: AbortSignal) {
  return fetchCountries(signal);
}

function useLocationOptions(
  parentId: string,
  loader: LocationLoader,
  resourceName: string,
  enabled: boolean,
) {
  const [result, setResult] = useState<OptionsResult | null>(null);
  const [attempt, setAttempt] = useState(0);
  const currentResult = result?.parentId === parentId && result.attempt === attempt? result: null;

  useEffect(() => {
    if (!enabled || !parentId || currentResult) return;

    const controller = new AbortController();

    async function loadOptions() {
      try {
        const options = await loader(parentId, controller.signal);
        if (!controller.signal.aborted) {
          setResult({ parentId, attempt, options, error: "" });
        }
      } catch {
        if (!controller.signal.aborted) {
          setResult({ parentId, attempt, options: [], error: `Unable to load ${resourceName}. Please try again.`,});
        }
      }
    }

    void loadOptions();
    return () => controller.abort();
  }, [enabled, parentId, attempt, currentResult, loader, resourceName]);

  return {
    options: currentResult?.options ?? [],
    loading: Boolean(enabled && parentId && !currentResult),
    error: currentResult?.error ?? "",
    reload: () => setAttempt((previous) => previous + 1),
  };
}

export function useLocationDropdowns({
  value,
  onChange,
  enabled = true,
}: UseLocationDropdownsOptions) {
  const countries = useLocationOptions("countries", loadCountryOptions, "countries", enabled);
  const countryId = value.country ?? (
    countries.options.length === 1 ? String(countries.options[0]._id) : ""
  );
  const states = useLocationOptions(countryId, fetchStates, "states", enabled);
  const stateName = value.state ?? "";
  const stateId = String(states.options.find((state) => state.name === stateName)?._id ?? "");
  const districts = useLocationOptions(stateId, fetchDistricts, "districts", enabled);

  const country: DropdownProps = {
    label: "Country",
    name: "country",
    value: countryId,
    onChange: (event) => onChange({ country: event.currentTarget.value, state: "", district: "" }),
    options: countries.options.map((option) => ({ value: String(option._id), label: option.name })),
    disabled: !enabled,
    loading: countries.loading,
    error: countries.error,
    onRetry: countries.reload,
    placeholder: countries.loading
      ? "Loading countries..."
      : countries.error
        ? "Countries unavailable"
        : countries.options.length === 0
          ? "No countries available"
          : "Select country",
  };

  const state: DropdownProps = {
    label: "State",
    name: "state",
    value: stateName,
    onChange: (event) => onChange({ state: event.currentTarget.value, district: "" }),
    options: states.options.map((option) => ({ value: option.name, label: option.name })),
    disabled: !enabled || !countryId,
    loading: states.loading,
    error: states.error,
    onRetry: states.reload,
    preserveValue: true,
    placeholder: !countryId
      ? "Select country first"
      : states.loading
        ? "Loading states..."
        : states.error
          ? "States unavailable"
          : states.options.length === 0
            ? "No states available"
            : "Select state",
  };

  const district: DropdownProps = {
    label: "District",
    name: "district",
    value: value.district ?? "",
    onChange: (event) => onChange({ district: event.currentTarget.value }),
    options: districts.options.map((option) => ({ value: option.name, label: option.name })),
    disabled: !enabled || !stateId,
    loading: districts.loading,
    error: districts.error,
    onRetry: districts.reload,
    preserveValue: true,
    placeholder: !stateId
      ? "Select state first"
      : districts.loading
        ? "Loading districts..."
        : districts.error
          ? "Districts unavailable"
          : districts.options.length === 0
            ? "No districts available"
            : "Select district",
  };

  return { country, state, district };
}
