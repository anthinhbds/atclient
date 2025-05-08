import { useDispatch, useSelector } from "react-redux";
import {
  getRequest,
  getMyCustomerRequest,
  addRequest,
  updRequest,
  delRequest,
  getSummaryRequest,
  assignmentRequest,
  deleteAllRequest
} from "store/customer/reducer";
import {
  row,
  data,
  totalData,
  myCustomerData,
  totalMyCustomer,
  loading,
  error,
  saving,
  deleting,
  restored,
} from "store/customer/selector";
import { IAction, ICustomerItem, IQueryParam } from "types";

export function useCustomer() {
  const dispatch = useDispatch();
  const record = useSelector(row);
  const records = useSelector(data);
  const totalCount = useSelector(totalData);
  const myCustomerRecord = useSelector(myCustomerData);
  const myCustomerCount = useSelector(totalMyCustomer);
  const isSaving = useSelector(saving);
  const errorInfo = useSelector(error);
  const isLoading = useSelector(loading);
  const isDeleting = useSelector(deleting);
  const isRestored = useSelector(restored);

  const get = (params: IQueryParam) => {
    dispatch(getRequest({ params: { ...params } }));
  };

  const getMyCustomer = (params: IQueryParam) => {
    dispatch(getMyCustomerRequest({ params: { ...params } }));
  };

  const add = (data: ICustomerItem, actionKey?: IAction) =>
    dispatch(addRequest({ data, actionKey }));

  const upd = (data: ICustomerItem, actionKey?: IAction) => {
    dispatch(updRequest({ data, actionKey }));
  };

  const dels = (data: string[], actionKey?: IAction) =>
    dispatch(delRequest({ data, actionKey }));

  const delAll = (data: { archived: number }, actionKey?: IAction) =>
    dispatch(deleteAllRequest({ data, actionKey }));


  const assignment = (data: { ids: string[], assignee: string }, actionKey?: IAction) =>
    dispatch(assignmentRequest({ data, actionKey }));



  const getSummary = (params: any) => dispatch(getSummaryRequest(params));

  return {
    record,
    records,
    totalCount,
    myCustomerRecord,
    myCustomerCount,
    errorInfo,
    isLoading,
    isDeleting,
    isSaving,
    isRestored,
    get,
    getMyCustomer,
    add,
    upd,
    dels,
    delAll,
    assignment,
    getSummary,

  };
}
