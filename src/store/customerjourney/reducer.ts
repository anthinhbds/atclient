/** @format */
import { createSlice } from "@reduxjs/toolkit";
import { IAction, ICustomerJourneyItem } from "types";

interface ICustomerJourneyState {
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  restored: boolean;
  error: any;
  message: any;
  record: ICustomerJourneyItem | null;
  data: ICustomerJourneyItem[] | null;
  totalData: number;
}
// // TODO: Store design
const initialState: ICustomerJourneyState = {
  loading: false,
  saving: false,
  deleting: false,
  restored: false,
  error: null,
  message: null,
  record: null,
  data: null,
  totalData: 0,
};
const slice = createSlice({
  name: "customerjourney",
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
      { payload }: { payload: { data: ICustomerJourneyItem[]; total: number } }
    ) => ({
      ...state,
      data: payload.data,
      totalData: payload.total,
      error: null,
      message: null,
      loading: false,
    }),
    addRequest: (
      state,
      _data: {
        payload: { data: ICustomerJourneyItem; actionKey?: IAction };
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
        payload: { data: ICustomerJourneyItem; actionKey?: IAction };
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
  addRequest,
  updRequest,
  delRequest,
  delSuccess,
  delFailure,
  deleteAllRequest,
  requestSuccess,
  requestFailure,
  getRequestSuccess,
  syncSuccess,
} = actions;

export {
  getRequest,
  addRequest,
  updRequest,
  delRequest,
  delSuccess,
  delFailure,
  requestSuccess,
  requestFailure,
  deleteAllRequest,
  getRequestSuccess,
  syncSuccess,
};
export type { ICustomerJourneyState };
export default reducer;
