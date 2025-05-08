import { createSelector } from "reselect";
import { ITransactionState } from "./reducer";

const selector = (state: { transaction: ITransactionState }) => state.transaction;

const error = createSelector(selector, ({ error }: ITransactionState) => error);
const loading = createSelector(
  selector,
  ({ loading }: ITransactionState) => loading
);
const saving = createSelector(selector, ({ saving }: ITransactionState) => saving);
const deleting = createSelector(
  selector,
  ({ deleting }: ITransactionState) => deleting
);
const restored = createSelector(
  selector,
  ({ restored }: ITransactionState) => restored
);
const row = createSelector(selector, ({ record }: ITransactionState) => record);

const data = createSelector(selector, ({ data }: ITransactionState) => data);
const totalData = createSelector(
  selector,
  ({ totalData }: ITransactionState) => totalData
);

const pmgData = createSelector(
  selector,
  ({ pmgData }: ITransactionState) => pmgData
);
const totalPMG = createSelector(
  selector,
  ({ totalPMG }: ITransactionState) => totalPMG
);

const pgtData = createSelector(
  selector,
  ({ pgtData }: ITransactionState) => pgtData
);
const totalPGT = createSelector(
  selector,
  ({ totalPGT }: ITransactionState) => totalPGT
);

const ctlData = createSelector(
  selector,
  ({ ctlData }: ITransactionState) => ctlData
);
const totalCTL = createSelector(
  selector,
  ({ totalCTL }: ITransactionState) => totalCTL
);

const cthData = createSelector(
  selector,
  ({ cthData }: ITransactionState) => cthData
);
const totalCTH = createSelector(
  selector,
  ({ totalCTH }: ITransactionState) => totalCTH
);


const ctdData = createSelector(
  selector,
  ({ ctdData }: ITransactionState) => ctdData
);
const totalCTD = createSelector(
  selector,
  ({ totalCTD }: ITransactionState) => totalCTD
);


export {
  error,
  loading,
  row,
  data,
  totalData,
  pmgData,
  totalPMG,
  pgtData,
  totalPGT,
  ctlData,
  totalCTL,
  cthData,
  totalCTH,
  ctdData,
  totalCTD,
  saving,
  deleting,
  restored,
};
