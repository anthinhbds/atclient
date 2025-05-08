/** @format */
import { createSlice } from "@reduxjs/toolkit";
import { IAction, ITransactionItem } from "types";

interface ITransactionState {
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  restored: boolean;
  error: any;
  message: any;
  record: ITransactionItem | null;
  data: ITransactionItem[] | null;
  totalData: number;
  pmgData: ITransactionItem[] | null;
  totalPMG: number;
  pgtData: ITransactionItem[] | null;
  totalPGT: number;
  ctlData: ITransactionItem[] | null;
  totalCTL: number;
  cthData: ITransactionItem[] | null;
  totalCTH: number;
  ctdData: ITransactionItem[] | null;
  totalCTD: number;
}
// // TODO: Store design
const initialState: ITransactionState = {
  loading: false,
  saving: false,
  deleting: false,
  restored: false,
  error: null,
  message: null,
  record: null,
  data: null,
  totalData: 0,
  pmgData: null,
  totalPMG: 0,
  pgtData: null,
  totalPGT: 0,
  ctlData: null,
  totalCTL: 0,
  cthData: null,
  totalCTH: 0,
  ctdData: null,
  totalCTD: 0,
};
const slice = createSlice({
  name: "transaction",
  initialState: initialState,
  reducers: {
    getRequest: (state, _data: { payload: { params: any } }) => ({
      ...state,
      error: null,
      message: null,
      loading: true,
    }),
    getRequestSuccess: (
      state,
      { payload }: { payload: { data: ITransactionItem[]; total: number } }
    ) => ({
      ...state,
      data: payload.data,
      totalData: payload.total,
      error: null,
      message: null,
      loading: false,
    }),
    getPMGRequest: (state, _data: { payload: { params: any } }) => ({
      ...state,
      error: null,
      message: null,
      loading: true,
    }),
    getPMGRequestSuccess: (
      state,
      { payload }: { payload: { data: ITransactionItem[]; total: number } }
    ) => ({
      ...state,
      pmgData: payload.data,
      totalPMG: payload.total,
      error: null,
      message: null,
      loading: false,
    }),
    getPGTRequest: (state, _data: { payload: { params: any } }) => ({
      ...state,
      error: null,
      message: null,
      loading: true,
    }),
    getPGTRequestSuccess: (
      state,
      { payload }: { payload: { data: ITransactionItem[]; total: number } }
    ) => ({
      ...state,
      pgtData: payload.data,
      totalPGT: payload.total,
      error: null,
      message: null,
      loading: false,
    }),
    getCTLRequest: (state, _data: { payload: { params: any } }) => ({
      ...state,
      error: null,
      message: null,
      loading: true,
    }),
    getCTLRequestSuccess: (
      state,
      { payload }: { payload: { data: ITransactionItem[]; total: number } }
    ) => ({
      ...state,
      ctlData: payload.data,
      totalCTL: payload.total,
      error: null,
      message: null,
      loading: false,
    }),
    getCTHRequest: (state, _data: { payload: { params: any } }) => ({
      ...state,
      error: null,
      message: null,
      loading: true,
    }),
    getCTHRequestSuccess: (
      state,
      { payload }: { payload: { data: ITransactionItem[]; total: number } }
    ) => ({
      ...state,
      cthData: payload.data,
      totalCTH: payload.total,
      error: null,
      message: null,
      loading: false,
    }),
    getCTDRequest: (state, _data: { payload: { params: any } }) => ({
      ...state,
      error: null,
      message: null,
      loading: true,
    }),
    getCTDRequestSuccess: (
      state,
      { payload }: { payload: { data: ITransactionItem[]; total: number } }
    ) => ({
      ...state,
      ctdData: payload.data,
      totalCTD: payload.total,
      error: null,
      message: null,
      loading: false,
    }),
    getSummaryRequest: (
      state,
      _data: { payload: { params: any, onSuccess?: (data: any) => void } }
    ) => ({
      ...state,
      error: null,
      message: null,
    }),
    getSummaryRequestSuccess: (
      state,
      { payload }: { payload: { data: any } }
    ) => ({
      ...state,
      totalPMG:
        payload.data?.filter((v: any) => v['key'] === "PMGB" || v['key'] === "PMGT")[0]?.count || 0,
      totalPGT:
        payload.data?.filter((v: any) => v['key'] === "PGT")[0]?.count || 0,
      totalCTL:
        payload.data?.filter((v: any) => v['key'] === "CTL")[0]?.count || 0,
      totalCTH:
        payload.data?.filter((v: any) => v['key'] === "CTH")[0]?.count || 0,
      totalCTD:
        payload.data?.filter((v: any) => v['key'] === "CTD" || v['key'] === "CK")[0]?.count || 0,
      error: null,
      message: null,
    }),
    addRequest: (
      state,
      _data: {
        payload: { data: ITransactionItem; actionKey?: IAction };
      }
    ) => ({
      ...state,
      saving: true,
      error: null,
      message: null,
    }),
    updRequest: (
      state,
      _data: {
        payload: { data: ITransactionItem; actionKey?: IAction };
      }
    ) => ({
      ...state,
      saving: true,
      error: null,
      message: null,
    }),
    delRequest: (
      state,
      _data: {
        payload: {
          data: string[];
          actionKey?: IAction
        };
      }
    ) => ({
      ...state,
      deleting: true,
      error: null,
      message: null,
    }),
    assignmentRequest: (
      state,
      _data: {
        payload: { data: { ids: string[], assignee: string }; actionKey?: IAction };
      }
    ) => ({
      ...state,
      deleted: false,
      error: null,
      message: null,
    }),
    deleteAllRequest: (
      state,
      _data: {
        payload: { data: { archived: number }; actionKey?: IAction };
      }
    ) => ({
      ...state,
      deleting: true,
      error: null,
      message: null,
    }),
    requestSuccess: (state, { payload }) => ({
      ...state,
      saving: false,
      error: null,
      message: payload,
      loading: false,
    }),
    requestFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      message: null,
      loading: false,
    }),
    delSuccess: (state, { payload }) => ({
      ...state,
      error: null,
      message: payload,
      deleting: false,
    }),
    delFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      message: null,
      deleting: false,
    }),
    syncSuccess: (state, { payload }) => ({
      ...state,
      saving: false,
      error: null,
      message: payload,
      loading: false,
    }),
  },
});

const { actions, reducer } = slice;
const {
  getRequest,
  getPMGRequest,
  getPGTRequest,
  getCTLRequest,
  getCTHRequest,
  getCTDRequest,
  getSummaryRequest,
  addRequest,
  updRequest,
  delRequest,
  assignmentRequest,
  delSuccess,
  delFailure,
  deleteAllRequest,
  requestSuccess,
  requestFailure,
  getRequestSuccess,
  getPMGRequestSuccess,
  getPGTRequestSuccess,
  getCTLRequestSuccess,
  getCTHRequestSuccess,
  getCTDRequestSuccess,
  getSummaryRequestSuccess,
  syncSuccess,
} = actions;

export {
  getRequest,
  getPMGRequest,
  getPGTRequest,
  getCTLRequest,
  getCTHRequest,
  getCTDRequest,
  getSummaryRequest,
  addRequest,
  updRequest,
  delRequest,
  assignmentRequest,
  delSuccess,
  delFailure,
  requestSuccess,
  requestFailure,
  deleteAllRequest,
  getRequestSuccess,
  getPMGRequestSuccess,
  getPGTRequestSuccess,
  getCTLRequestSuccess,
  getCTHRequestSuccess,
  getCTDRequestSuccess,
  getSummaryRequestSuccess,
  syncSuccess,
};
export type { ITransactionState };
export default reducer;
