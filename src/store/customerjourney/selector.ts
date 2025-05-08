import { createSelector } from "reselect";
import { ICustomerJourneyState } from "./reducer";

const selector = (state: { customerjourney: ICustomerJourneyState }) => state.customerjourney;

const error = createSelector(selector, ({ error }: ICustomerJourneyState) => error);
const loading = createSelector(
  selector,
  ({ loading }: ICustomerJourneyState) => loading
);
const saving = createSelector(selector, ({ saving }: ICustomerJourneyState) => saving);
const deleting = createSelector(
  selector,
  ({ deleting }: ICustomerJourneyState) => deleting
);
const restored = createSelector(
  selector,
  ({ restored }: ICustomerJourneyState) => restored
);
const row = createSelector(selector, ({ record }: ICustomerJourneyState) => record);

const data = createSelector(selector, ({ data }: ICustomerJourneyState) => data);
const totalData = createSelector(
  selector,
  ({ totalData }: ICustomerJourneyState) => totalData
);

export {
  error,
  loading,
  row,
  data,
  totalData,
  saving,
  deleting,
  restored,
};
