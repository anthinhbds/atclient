import { useDispatch, useSelector } from "react-redux";
import {
  getRequest,
  getMyApartmentRequest,
  getPartnerRequest,
  getExpiredRequest,
  getAssignmentRequest,
  addRequest,
  updRequest,
  delRequest,
  getSummaryRequest,
  assignmentRequest,
  deleteAllRequest
} from "store/apartment/reducer";
import {
  row,
  data,
  totalData,
  myApartmentData,
  totalMyApartment,
  partnerData,
  totalPartner,
  expiredData,
  totalExpired,
  assigmentData,
  totalAssigment,
  loading,
  error,
  saving,
  deleting,
  restored,
} from "store/apartment/selector";
import { IAction, IApartmentItem, IQueryParam } from "types";

export function useApartment() {
  const dispatch = useDispatch();
  const record = useSelector(row);
  const records = useSelector(data);
  const totalCount = useSelector(totalData);
  const myApartmentRecord = useSelector(myApartmentData);
  const myApartmentCount = useSelector(totalMyApartment);
  const partnerRecord = useSelector(partnerData);
  const partnerCount = useSelector(totalPartner);
  const expiredRecord = useSelector(expiredData);
  const expiredCount = useSelector(totalExpired);
  const assigmentRecord = useSelector(assigmentData);
  const assigmentCount = useSelector(totalAssigment);
  const isSaving = useSelector(saving);
  const errorInfo = useSelector(error);
  const isLoading = useSelector(loading);
  const isDeleting = useSelector(deleting);
  const isRestored = useSelector(restored);

  const get = (params: IQueryParam) => {
    dispatch(getRequest({ params: { ...params } }));
  };

  const getMyApartment = (params: IQueryParam) => {
    dispatch(getMyApartmentRequest({ params: { ...params } }));
  };
  const getPartner = (params: IQueryParam) => {
    dispatch(getPartnerRequest({ params: { ...params } }));
  };

  const getExpired = (params: IQueryParam) => {
    dispatch(getExpiredRequest({ params: { ...params } }));
  };

  const getAssigment = (params: IQueryParam) => {
    dispatch(getAssignmentRequest({ params: { ...params } }));
  };

  const add = (data: IApartmentItem, actionKey?: IAction) =>
    dispatch(addRequest({ data, actionKey }));

  const upd = (data: IApartmentItem, actionKey?: IAction) => {
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
    myApartmentRecord,
    myApartmentCount,
    expiredRecord,
    expiredCount,
    partnerRecord,
    partnerCount,
    assigmentRecord,
    assigmentCount,
    errorInfo,
    isLoading,
    isDeleting,
    isSaving,
    isRestored,
    get,
    getMyApartment,
    getExpired,
    getPartner,
    getAssigment,
    add,
    upd,
    dels,
    delAll,
    assignment,
    getSummary,
  };
}
