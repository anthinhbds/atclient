import { createSelector } from "reselect";
import { IReportState } from "./reducer";

const selector = (state: { report: IReportState }) => state.report;

const error = createSelector(selector, ({ error }: IReportState) => error);
const loading = createSelector(
  selector,
  ({ loading }: IReportState) => loading
);

const viewStatisticItems = createSelector(selector, ({ viewStatisticItems }: IReportState) => viewStatisticItems);

export {
  error,
  loading,
  viewStatisticItems,
};
