import { useDispatch, useSelector } from "react-redux";
import {
  getRequest,
  getArchivedRequest,
  addRequest,
  updRequest,
  delRequest,
  archiveRequest,
  archiveAllRequest,
  restoreRequest,
  restoreAllRequest,
  getSummaryRequest,
  deleteAllRequest
} from "store/project/reducer";
import {
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
} from "store/project/selector";
import { IAction, IProjectItem, IQueryParam } from "types";

export function useProject() {
  const dispatch = useDispatch();
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

  const get = (params: IQueryParam) => {
    dispatch(getRequest({ params: { ...params } }));
  };

  const getArchived = (params: IQueryParam) => {
    dispatch(getArchivedRequest({ params: { ...params } }));
  };

  const add = (data: IProjectItem, actionKey?: IAction) =>
    dispatch(addRequest({ data, actionKey }));

  const upd = (data: IProjectItem, actionKey?: IAction) => {
    dispatch(updRequest({ data, actionKey }));
  };

  const dels = (data: string[], actionKey?: IAction) =>
    dispatch(delRequest({ data, actionKey }));

  const delAll = (data: { archived: number }, actionKey?: IAction) =>
    dispatch(deleteAllRequest({ data, actionKey }));


  const archive = (data: string[], actionKey?: IAction) =>
    dispatch(archiveRequest({ data, actionKey }));

  const archiveAll = (actionKey?: IAction) =>
    dispatch(archiveAllRequest({ actionKey }));

  const restore = (data: string[], actionKey?: IAction) =>
    dispatch(restoreRequest({ data, actionKey }));

  const restoreAll = (actionKey?: IAction) =>
    dispatch(restoreAllRequest({ actionKey }));

  const getSummary = (params: any) => dispatch(getSummaryRequest(params));

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
    get,
    getArchived,
    add,
    upd,
    dels,
    delAll,
    archive,
    archiveAll,
    restore,
    restoreAll,
    getSummary,
  };
}
