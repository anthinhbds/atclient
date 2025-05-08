import React, { memo, forwardRef, useMemo } from "react";
import AutocompleteSingle from "./AutocompleteSingle";
import AutocompleteMultiple from "./AutocompleteMultiple";
import { IAutocomplete, IAutocompleteMultiple } from "types";

const Autocomplete = forwardRef<
  HTMLDivElement,
  IAutocomplete | IAutocompleteMultiple
>(function Input({ multiple, ...props }, ref) {
  const InputCompo = useMemo(
    () => ({
      ["AutocompleteSingle"]: AutocompleteSingle,
      ["AutocompleteMultiple"]: AutocompleteMultiple,
    }),
    []
  );
  const ContentInputComponent = multiple
    ? InputCompo["AutocompleteMultiple"]
    : InputCompo["AutocompleteSingle"];
  return (
    <ContentInputComponent ref={ref} multiple={multiple} {...(props as any)} />
  );
});

export default memo(Autocomplete);
