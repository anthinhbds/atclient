import { createSelector } from "reselect";
import { IAutocompleteState } from "./reducer";

const selector = (state: { autocomplete: IAutocompleteState }) =>
  state.autocomplete;

const getDataByKey = (formId: string) =>
  createSelector(
    selector,
    (autocomplete) => autocomplete[`data_${formId}` as keyof IAutocompleteState]
  );

export { getDataByKey };
