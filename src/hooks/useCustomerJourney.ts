import { useDispatch, useSelector } from "react-redux";
import {
  getRequest,
  addRequest,
  updRequest,
  delRequest,
  deleteAllRequest
} from "store/customerjourney/reducer";
import {
  row,
  data,
  totalData,
  loading,
  error,
  saving,
  deleting,
  restored,
} from "store/customerjourney/selector";
import { IAction, ICustomerJourneyItem, IQueryParam } from "types";

export function useCustomerJourney() {
  const dispatch = useDispatch();
  const record = useSelector(row);
  const records = useSelector(data);
  const totalCount = useSelector(totalData);
  const isSaving = useSelector(saving);
  const errorInfo = useSelector(error);
  const isLoading = useSelector(loading);
  const isDeleting = useSelector(deleting);
  const isRestored = useSelector(restored);

  const get = (params: IQueryParam) => {
    dispatch(getRequest({ params: { ...params } }));
  };

  const add = (data: ICustomerJourneyItem, actionKey?: IAction) =>
    dispatch(addRequest({ data, actionKey }));

  const upd = (data: ICustomerJourneyItem, actionKey?: IAction) => {
    dispatch(updRequest({ data, actionKey }));
  };

  const dels = (data: string[], actionKey?: IAction) =>
    dispatch(delRequest({ data, actionKey }));

  const delAll = (data: { archived: number }, actionKey?: IAction) =>
    dispatch(deleteAllRequest({ data, actionKey }));

  return {
    record,
    records,
    totalCount,
    errorInfo,
    isLoading,
    isDeleting,
    isSaving,
    isRestored,
    get,
    add,
    upd,
    dels,
    delAll,
  };
}
