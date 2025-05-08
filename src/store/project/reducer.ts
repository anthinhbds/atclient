/** @format */
import { createSlice } from "@reduxjs/toolkit";
import { IAction, IProjectItem } from "types";

interface IProjectState {
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  restored: boolean;
  error: any;
  message: any;
  record: IProjectItem | null;
  data: IProjectItem[] | null;
  totalData: number;
  archviedData: IProjectItem[] | null;
  totalArchvied: number;
}
// // TODO: Store design
const initialState: IProjectState = {
  loading: false,
  saving: false,
  deleting: false,
  restored: false,
  error: null,
  message: null,
  record: null,
  data: null,
  totalData: 0,
  archviedData: null,
  totalArchvied: 0,
};
const slice = createSlice({
  name: "project",
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
      { payload }: { payload: { data: IProjectItem[]; total: number } }
    ) => ({
      ...state,
      data: payload.data,
      totalData: payload.total,
      error: null,
      message: null,
      loading: false,
    }),
    getArchivedRequest: (state, _data: { payload: { params: any } }) => ({
      ...state,
      error: null,
      message: null,
      loading: true,
    }),
    getArchivedRequestSuccess: (
      state,
      { payload }: { payload: { data: IProjectItem[]; total: number } }
    ) => ({
      ...state,
      archviedData: payload.data,
      totalArchvied: payload.total,
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
      totalData: payload.data?.filter((v: IProjectItem) => v.archived === 0)[0]?.count ?? 0,
      totalArchvied:
        payload.data?.filter((v: IProjectItem) => v.archived === 1)[0]?.count ?? 0,
      error: null,
      message: null,
    }),
    addRequest: (
      state,
      _data: {
        payload: { data: IProjectItem; actionKey?: IAction };
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
        payload: { data: IProjectItem; actionKey?: IAction };
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
    archiveRequest: (
      state,
      _data: {
        payload: { data: string[]; actionKey?: IAction };
      }
    ) => ({
      ...state,
      deleted: false,
      error: null,
      message: null,
    }),
    archiveAllRequest: (
      state,
      _data: {
        payload: { actionKey?: IAction };
      }
    ) => ({
      ...state,
      deleted: false,
      error: null,
      message: null,
    }),
    restoreRequest: (
      state,
      _data: {
        payload: { data: string[]; actionKey?: IAction };
      }
    ) => ({
      ...state,
      restored: false,
      error: null,
      message: null,
    }),
    restoreAllRequest: (
      state,
      _data: {
        payload: { actionKey?: IAction };
      }
    ) => ({
      ...state,
      restored: false,
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
  getArchivedRequest,
  getSummaryRequest,
  addRequest,
  updRequest,
  delRequest,
  archiveRequest,
  archiveAllRequest,
  restoreRequest,
  restoreAllRequest,
  delSuccess,
  delFailure,
  deleteAllRequest,
  requestSuccess,
  requestFailure,
  getRequestSuccess,
  getArchivedRequestSuccess,
  getSummaryRequestSuccess,
  syncSuccess,
} = actions;

export {
  getRequest,
  getArchivedRequest,
  getSummaryRequest,
  addRequest,
  updRequest,
  delRequest,
  archiveRequest,
  archiveAllRequest,
  restoreRequest,
  restoreAllRequest,
  delSuccess,
  delFailure,
  requestSuccess,
  requestFailure,
  deleteAllRequest,
  getRequestSuccess,
  getArchivedRequestSuccess,
  getSummaryRequestSuccess,
  syncSuccess,
};
export type { IProjectState };
export default reducer;
