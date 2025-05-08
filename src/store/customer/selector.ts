import { createSelector } from "reselect";
import { ICustomerState } from "./reducer";

const selector = (state: { customer: ICustomerState }) => state.customer;

const error = createSelector(selector, ({ error }: ICustomerState) => error);
const loading = createSelector(
  selector,
  ({ loading }: ICustomerState) => loading
);
const saving = createSelector(selector, ({ saving }: ICustomerState) => saving);
const deleting = createSelector(
  selector,
  ({ deleting }: ICustomerState) => deleting
);
const restored = createSelector(
  selector,
  ({ restored }: ICustomerState) => restored
);
const row = createSelector(selector, ({ record }: ICustomerState) => record);

const data = createSelector(selector, ({ data }: ICustomerState) => data);
const totalData = createSelector(
  selector,
  ({ totalData }: ICustomerState) => totalData
);

const myCustomerData = createSelector(
  selector,
  ({ myCustomerData }: ICustomerState) => myCustomerData
);
const totalMyCustomer = createSelector(
  selector,
  ({ totalMyCustomer }: ICustomerState) => totalMyCustomer
);


export {
  error,
  loading,
  row,
  data,
  totalData,
  myCustomerData,
  totalMyCustomer,
  saving,
  deleting,
  restored,
};
