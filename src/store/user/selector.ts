import { createSelector } from "reselect";
import { IUserState } from "./reducer";

const selector = (state: { user: IUserState }) => state.user;

const error = createSelector(selector, ({ error }: IUserState) => error);
const loading = createSelector(
  selector,
  ({ loading }: IUserState) => loading
);
const saving = createSelector(selector, ({ saving }: IUserState) => saving);
const deleting = createSelector(
  selector,
  ({ deleting }: IUserState) => deleting
);
const restored = createSelector(
  selector,
  ({ restored }: IUserState) => restored
);
const me = createSelector(selector, ({ me }: IUserState) => me);
const row = createSelector(selector, ({ record }: IUserState) => record);
const data = createSelector(selector, ({ data }: IUserState) => data);
const totalData = createSelector(
  selector,
  ({ totalData }: IUserState) => totalData
);

const archivedData = createSelector(
  selector,
  ({ archviedData }: IUserState) => archviedData
);
const totalArchived = createSelector(
  selector,
  ({ totalArchvied }: IUserState) => totalArchvied
);
const searchProfiles = createSelector(
  selector,
  ({ searchProfiles }: IUserState) => searchProfiles
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
  me,
  searchProfiles,
};
