import { createSelector } from "reselect";
import { IProjectState } from "./reducer";

const selector = (state: { project: IProjectState }) => state.project;

const error = createSelector(selector, ({ error }: IProjectState) => error);
const loading = createSelector(
  selector,
  ({ loading }: IProjectState) => loading
);
const saving = createSelector(selector, ({ saving }: IProjectState) => saving);
const deleting = createSelector(
  selector,
  ({ deleting }: IProjectState) => deleting
);
const restored = createSelector(
  selector,
  ({ restored }: IProjectState) => restored
);
const row = createSelector(selector, ({ record }: IProjectState) => record);

const data = createSelector(selector, ({ data }: IProjectState) => data);
const totalData = createSelector(
  selector,
  ({ totalData }: IProjectState) => totalData
);

const archivedData = createSelector(
  selector,
  ({ archviedData }: IProjectState) => archviedData
);
const totalArchived = createSelector(
  selector,
  ({ totalArchvied }: IProjectState) => totalArchvied
);
export {
  error,
  loading,
  row,
  data,
  totalData,
  archivedData,
  totalArchived,
  saving,
  deleting,
  restored,
};
