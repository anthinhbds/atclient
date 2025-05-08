import { useDispatch, useSelector } from "react-redux";
import {
  getRequest,
  getArchivedRequest,
  addRequest,
  updRequest,
  delRequest,
  getSummaryRequest,
  deleteAllRequest,
  getSearchProfileRequest,
  addSearchProfileRequest,
  updSearchProfileRequest,
  delSearchProfileRequest,
} from "store/user/reducer";
import {
  me,
  row,
  data,
  totalData,
  archivedData,
  totalArchived,
  loading,
  error,
  saving,
  deleting,
  restored,
  searchProfiles,
} from "store/user/selector";
import { IAction, IUserItem, IQueryParam, IUserSearchProfileItem } from "types";

export function useUser() {
  const dispatch = useDispatch();
  const info = useSelector(me);
  const record = useSelector(row);
  const records = useSelector(data);
  const totalCount = useSelector(totalData);
  const archivedRecords = useSelector(archivedData);
  const archivedCount = useSelector(totalArchived);
  const isSaving = useSelector(saving);
  const errorInfo = useSelector(error);
  const isLoading = useSelector(loading);
  const isDeleting = useSelector(deleting);
  const isRestored = useSelector(restored);
  const userSearchProfiles = useSelector(searchProfiles);

  const get = (params: IQueryParam) => {
    dispatch(getRequest({ params: { ...params } }));
  };

  const getArchived = (params: IQueryParam) => {
    dispatch(getArchivedRequest({ params: { ...params } }));
  };

  const add = (data: IUserItem, actionKey?: IAction) =>
    dispatch(addRequest({ data, actionKey }));

  const upd = (data: IUserItem, actionKey?: IAction) => {
    dispatch(updRequest({ data, actionKey }));
  };

  const dels = (data: string[], actionKey?: IAction) =>
    dispatch(delRequest({ data, actionKey }));

  const delAll = (data: { archived: number }, actionKey?: IAction) =>
    dispatch(deleteAllRequest({ data, actionKey }));

  const getSummary = (params: any) => dispatch(getSummaryRequest(params));

  const getSearchProfile = (params: IQueryParam) => {
    dispatch(getSearchProfileRequest({ params: { ...params } }));
  };

  const addSearchProfile = (data: IUserSearchProfileItem, actionKey?: IAction) =>
    dispatch(addSearchProfileRequest({ data, actionKey }));

  const updSearchProfile = (data: IUserSearchProfileItem, actionKey?: IAction) => {
    dispatch(updSearchProfileRequest({ data, actionKey }));
  };

  const delSearchProfile = (data: string, actionKey?: IAction) =>
    dispatch(delSearchProfileRequest({ data, actionKey }));

  return {
    record,
    records,
    totalCount,
    archivedRecords,
    archivedCount,
    errorInfo,
    isLoading,
    isDeleting,
    isSaving,
    isRestored,
    info,
    userSearchProfiles,
    get,
    getArchived,
    add,
    upd,
    dels,
    delAll,
    getSummary,
    getSearchProfile,
    addSearchProfile,
    updSearchProfile,
    delSearchProfile,
  };
}
