import { createSelector } from "reselect";
import { IApartmentState } from "./reducer";

const selector = (state: { apartment: IApartmentState }) => state.apartment;

const error = createSelector(selector, ({ error }: IApartmentState) => error);
const loading = createSelector(
  selector,
  ({ loading }: IApartmentState) => loading
);
const saving = createSelector(selector, ({ saving }: IApartmentState) => saving);
const deleting = createSelector(
  selector,
  ({ deleting }: IApartmentState) => deleting
);
const restored = createSelector(
  selector,
  ({ restored }: IApartmentState) => restored
);
const row = createSelector(selector, ({ record }: IApartmentState) => record);

const data = createSelector(selector, ({ data }: IApartmentState) => data);
const totalData = createSelector(
  selector,
  ({ totalData }: IApartmentState) => totalData
);

const myApartmentData = createSelector(
  selector,
  ({ myApartmentData }: IApartmentState) => myApartmentData
);
const totalMyApartment = createSelector(
  selector,
  ({ totalMyApartment }: IApartmentState) => totalMyApartment
);

const partnerData = createSelector(
  selector,
  ({ partnerData }: IApartmentState) => partnerData
);
const totalPartner = createSelector(
  selector,
  ({ totalPartner }: IApartmentState) => totalPartner
);


const expiredData = createSelector(
  selector,
  ({ expiredData }: IApartmentState) => expiredData
);
const totalExpired = createSelector(
  selector,
  ({ totalExpired }: IApartmentState) => totalExpired
);

const assigmentData = createSelector(
  selector,
  ({ assigmentData }: IApartmentState) => assigmentData
);
const totalAssigment = createSelector(
  selector,
  ({ totalAssigment }: IApartmentState) => totalAssigment
);

export {
  error,
  loading,
  row,
  data,
  totalData,
  myApartmentData,
  totalMyApartment,
  expiredData,
  totalExpired,
  partnerData,
  totalPartner,
  assigmentData,
  totalAssigment,
  saving,
  deleting,
  restored,
};
