/** @format */
import { createSlice } from "@reduxjs/toolkit";
import { IAction, ICustomerItem } from "types";

interface ICustomerState {
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  restored: boolean;
  error: any;
  message: any;
  record: ICustomerItem | null;
  data: ICustomerItem[] | null;
  totalData: number;
  myCustomerData: ICustomerItem[] | null;
  totalMyCustomer: number;
}
// // TODO: Store design
const initialState: ICustomerState = {
  loading: false,
  saving: false,
  deleting: false,
  restored: false,
  error: null,
  message: null,
  record: null,
  data: null,
  totalData: 0,
  myCustomerData: null,
  totalMyCustomer: 0,
};
const slice = createSlice({
  name: "customer",
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
      { payload }: { payload: { data: ICustomerItem[]; total: number } }
    ) => ({
      ...state,
      data: payload.data,
      totalData: payload.total,
      error: null,
      message: null,
      loading: false,
    }),
    getMyCustomerRequest: (state, _data: { payload: { params: any } }) => ({
      ...state,
      error: null,
      message: null,
      loading: true,
    }),
    getMyCustomerRequestSuccess: (
      state,
      { payload }: { payload: { data: ICustomerItem[]; total: number } }
    ) => ({
      ...state,
      myCustomerData: payload.data,
      totalMyCustomer: payload.total,
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
      totalMyCustomer:
        payload.data?.filter((v: any) => v['key'] === "MYCUSTOMER")[0]?.count || 0,
      // totalPartner:
      //   payload.data?.filter((v: any) => v['key'] === "PARTNER")[0]?.count || 0,
      // totalExpired:
      //   payload.data?.filter((v: any) => v['key'] === "EXPIRED")[0]?.count || 0,
      error: null,
      message: null,
    }),
    addRequest: (
      state,
      _data: {
        payload: { data: ICustomerItem; actionKey?: IAction };
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
        payload: { data: ICustomerItem; actionKey?: IAction };
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
  getMyCustomerRequest,
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
  getMyCustomerRequestSuccess,
  getSummaryRequestSuccess,
  syncSuccess,
} = actions;

export {
  getRequest,
  getMyCustomerRequest,
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
  getMyCustomerRequestSuccess,
  getSummaryRequestSuccess,
  syncSuccess,
};
export type { ICustomerState };
export default reducer;
