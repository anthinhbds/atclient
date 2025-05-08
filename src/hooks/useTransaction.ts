import { useDispatch, useSelector } from "react-redux";
import {
  getRequest,
  getPMGRequest,
  getPGTRequest,
  getCTLRequest,
  getCTHRequest,
  getCTDRequest,
  addRequest,
  updRequest,
  delRequest,
  getSummaryRequest,
  deleteAllRequest
} from "store/transaction/reducer";
import {
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
  loading,
  error,
  saving,
  deleting,
  restored,
} from "store/transaction/selector";
import { IAction, ITransactionItem, IQueryParam } from "types";

export function useTransaction() {
  const dispatch = useDispatch();
  const record = useSelector(row);

  const records = useSelector(data);
  const totalCount = useSelector(totalData);

  const pmgRecords = useSelector(pmgData);
  const pmgCount = useSelector(totalPMG);
  const pgtRecords = useSelector(pgtData);
  const pgtCount = useSelector(totalPGT);

  const ctlRecords = useSelector(ctlData);
  const ctlCount = useSelector(totalCTL);
  const cthRecords = useSelector(cthData);
  const cthCount = useSelector(totalCTH);
  const ctdRecords = useSelector(ctdData);
  const ctdCount = useSelector(totalCTD);

  const isSaving = useSelector(saving);
  const errorInfo = useSelector(error);
  const isLoading = useSelector(loading);
  const isDeleting = useSelector(deleting);
  const isRestored = useSelector(restored);

  const get = (params: IQueryParam) => {
    dispatch(getRequest({ params: { ...params } }));
  };

  const getPMG = (params: IQueryParam) => {
    dispatch(getPMGRequest({ params: { ...params } }));
  };

  const getPGT = (params: IQueryParam) => {
    dispatch(getPGTRequest({ params: { ...params } }));
  };

  const getCTL = (params: IQueryParam) => {
    dispatch(getCTLRequest({ params: { ...params } }));
  };

  const getCTH = (params: IQueryParam) => {
    dispatch(getCTHRequest({ params: { ...params } }));
  };

  const getCTD = (params: IQueryParam) => {
    dispatch(getCTDRequest({ params: { ...params } }));
  };

  const add = (data: ITransactionItem, actionKey?: IAction) =>
    dispatch(addRequest({ data, actionKey }));

  const upd = (data: ITransactionItem, actionKey?: IAction) => {
    dispatch(updRequest({ data, actionKey }));
  };

  const dels = (data: string[], actionKey?: IAction) =>
    dispatch(delRequest({ data, actionKey }));

  const delAll = (data: { archived: number }, actionKey?: IAction) =>
    dispatch(deleteAllRequest({ data, actionKey }));



  const getSummary = (params: any) => dispatch(getSummaryRequest(params));

  return {
    record,
    records,
    totalCount,
    pmgRecords,
    pmgCount,
    pgtRecords,
    pgtCount,
    ctlRecords,
    ctlCount,
    cthRecords,
    cthCount,
    ctdRecords,
    ctdCount,
    errorInfo,
    isLoading,
    isDeleting,
    isSaving,
    isRestored,
    get,
    getPMG,
    getPGT,
    getCTL,
    getCTH,
    getCTD,
    add,
    upd,
    dels,
    delAll,
    getSummary,
  };
}
