
import { createSelector } from "reselect";
import { IHomeState } from "./reducer";

const selector = (state: { home: IHomeState }) => state.home;

const error = createSelector(selector, ({ error }: IHomeState) => error);
const loading = createSelector(
  selector,
  ({ loading }: IHomeState) => loading
);
const saving = createSelector(selector, ({ saving }: IHomeState) => saving);
const deleting = createSelector(
  selector,
  ({ deleting }: IHomeState) => deleting
);
const restored = createSelector(
  selector,
  ({ restored }: IHomeState) => restored
);

const revenuesMonthly = createSelector(selector, ({ revenuesMonthly }: IHomeState) => revenuesMonthly);

export {
  error,
  loading,
  revenuesMonthly,
  saving,
  deleting,
  restored,
};
