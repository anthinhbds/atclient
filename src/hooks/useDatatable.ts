import { useDispatch, useSelector } from "react-redux";
import {
  updateCellModeModelRequest,
  callDialogAddRequest,
  callDialogAddSuccess,
  callDialogAddFailure,
  edittingChangeRequest,
} from "store/datatable/reducer";
import {
  dialogInfo,
  newRecord,
  editting,
  getCellModeModelyKey,
} from "store/datatable/selector";
import { GridCellModesModel } from "@mui/x-data-grid";

export function useDatatable() {
  const dispatch = useDispatch();
  const dialogCfg = useSelector(dialogInfo);
  const record = useSelector(newRecord);
  const isEditting = useSelector(editting);

  const cellModeModelyKey = (tableId: any) => {
    return useSelector(getCellModeModelyKey(tableId));
  };

  const updateCellModeModel = (data: GridCellModesModel, tableId: string) => {
    dispatch(updateCellModeModelRequest({ data, tableId }));
  };

  const callDialogAdd = (id: any, field: string, addText?: string) => {
    dispatch(callDialogAddRequest({ id, addText: addText ?? "", field }));
  };

  const dialogAddSuccess = (data: any) => {
    dispatch(callDialogAddSuccess(data));
  };

  const dialogAddFailure = (data: any) => {
    dispatch(callDialogAddFailure(data));
  };

  const edittingChange = (data: boolean) => {
    dispatch(edittingChangeRequest({ data }));
  };

  return {
    dialogCfg,
    record,
    isEditting,
    updateCellModeModel,
    cellModeModelyKey,
    callDialogAdd,
    dialogAddSuccess,
    dialogAddFailure,
    edittingChange,
  };
}
