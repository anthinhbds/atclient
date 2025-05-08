import { createSelector } from "reselect";
import { IDatatableState } from "./reducer";

const selector = (state: { datatable: IDatatableState }) => state.datatable;

const dialogInfo = createSelector(
  selector,
  ({ dialogInfo }: IDatatableState) => dialogInfo
);
const newRecord = createSelector(
  selector,
  ({ newRecord }: IDatatableState) => newRecord
);
const editting = createSelector(
  selector,
  ({ editting }: IDatatableState) => editting
);

const getCellModeModelyKey = (key: string) =>
  createSelector(
    selector,
    (datatable) =>
      datatable[`cellModeModel_${key}` as keyof IDatatableState] || {}
  );

export { dialogInfo, newRecord, editting, getCellModeModelyKey };
