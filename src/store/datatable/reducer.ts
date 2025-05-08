/** @format */
import { GridCellModesModel } from "@mui/x-data-grid";
import { createSlice } from "@reduxjs/toolkit";

interface IDatatableState {
  newRecord: any; // if -1 => Addialog is closed
  cellModeModel: GridCellModesModel;
  dialogInfo: {
    formid: string | null;
    addText: string;
    field: string | null;
  };
  editting: boolean;
}
// // TODO: Store design
const initialState: IDatatableState = {
  cellModeModel: {},
  newRecord: null,
  dialogInfo: {
    formid: null,
    addText: "",
    field: null,
  },
  editting: false,
};
const slice = createSlice({
  name: "datatable",
  initialState: initialState,
  reducers: {
    updateCellModeModelRequest: (
      state,
      _data: { payload: { data: any; tableId: string } }
    ) => {
      const { tableId, data } = _data.payload;
      return {
        ...state,
        [`cellModeModel_${tableId}`]: data,
      };
    },
    edittingChangeRequest: (state, _data: { payload: { data: boolean } }) => {
      const { data } = _data.payload;
      return {
        ...state,
        editting: data,
      };
    },
    callDialogAddRequest: (
      state,
      _data: { payload: { id: any; addText: string; field: string } }
    ) => {
      return {
        ...state,
        newRecord: null,
        dialogInfo: {
          formid: _data.payload.id || null,
          addText: _data.payload.addText,
          field: _data.payload.field,
        },
      };
    },
    callDialogAddSuccess: (state, { payload }) => {
      return {
        ...state,
        newRecord: payload,
        dialogInfo: {
          formid: null,
          addText: "",
          field: null,
        },
      };
    },
    callDialogAddFailure: (state, _data: { payload: { newRecord: any } }) => {
      return {
        ...state,
        newRecord: _data.payload.newRecord,
        dialogInfo: {
          formid: null,
          addText: "",
          field: null,
        },
      };
    },
  },
});

const { actions, reducer } = slice;
const {
  updateCellModeModelRequest,
  callDialogAddRequest,
  callDialogAddSuccess,
  callDialogAddFailure,
  edittingChangeRequest,
} = actions;

export {
  updateCellModeModelRequest,
  callDialogAddRequest,
  callDialogAddSuccess,
  callDialogAddFailure,
  edittingChangeRequest,
};
export type { IDatatableState };
export default reducer;
