/** @format */
import { createSlice } from "@reduxjs/toolkit";
import { IAction, IUserItem, IUserSearchProfileItem, IUser } from "types";

interface IUserState {
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  restored: boolean;
  error: any;
  message: any;
  me?: IUser,
  record: IUserItem | null;
  data: IUserItem[] | null;
  totalData: number;
  archviedData: IUserItem[] | null;
  totalArchvied: number;
  searchProfiles?: IUserSearchProfileItem[];
}
// // TODO: Store design
const initialState: IUserState = {
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
  searchProfiles: [],
};
const slice = createSlice({
  name: "user",
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
      { payload }: { payload: { data: IUserItem[]; total: number } }
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
      { payload }: { payload: { data: IUserItem[]; total: number } }
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
      totalData: payload.data?.filter((v: IUserItem) => v.archived === 0)[0]?.count ?? 0,
      totalArchvied:
        payload.data?.filter((v: IUserItem) => v.archived === 1)[0]?.count ?? 0,
      error: null,
      message: null,
    }),
    loginSuccess: (state, { payload }: { payload: { data: IUser } }) => {
      return {
        ...state,
        me: payload.data,
        error: null,
        message: null,
        loading: false,
      }
    },
    logoutSuccess: (state, { payload }: { payload: { data: IUser } }) => {
      return {
        ...state,
        me: payload.data,
        error: null,
        message: null,
        loading: false,
      }
    },
    // changePasswordRequest: (
    //   state,
    //   _data: {
    //     payload: { data: IChangePwd; actionKey?: IAction };
    //   }
    // ) => ({
    //   ...state,
    //   error: null,
    //   message: null,
    // }),
    addRequest: (
      state,
      _data: {
        payload: { data: IUserItem; actionKey?: IAction };
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
        payload: { data: IUserItem; actionKey?: IAction };
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
    getSearchProfileRequest: (state, _data: { payload: { params: any } }) => ({
      ...state,
      error: null,
      message: null,
      loading: true,
    }),
    getSearchProfileRequestSuccess: (
      state,
      { payload }: { payload: { data: IUserSearchProfileItem[]; total: number } }
    ) => ({
      ...state,
      searchProfiles: payload.data,
      error: null,
      message: null,
      loading: false,
    }),
    addSearchProfileRequest: (
      state,
      _data: {
        payload: { data: IUserSearchProfileItem; actionKey?: IAction };
      }
    ) => ({
      ...state,
      saving: true,
      error: null,
      message: null,
    }),
    updSearchProfileRequest: (
      state,
      _data: {
        payload: { data: IUserSearchProfileItem; actionKey?: IAction };
      }
    ) => ({
      ...state,
      saving: true,
      error: null,
      message: null,
    }),
    delSearchProfileRequest: (
      state,
      _data: {
        payload: {
          data: string;
          actionKey?: IAction
        };
      }
    ) => ({
      ...state,
      deleting: true,
      error: null,
      message: null,
    }),
    saveSearchProfileSuccess: (
      state,
      { payload }: { payload: any; actionKey?: IAction }
    ) => ({
      ...state,
      saving: false,
      error: null,
      message: payload,
      loading: false,
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
  loginSuccess,
  logoutSuccess,
  addRequest,
  updRequest,
  delRequest,
  delSuccess,
  delFailure,
  deleteAllRequest,
  requestSuccess,
  requestFailure,
  getRequestSuccess,
  getArchivedRequestSuccess,
  getSummaryRequestSuccess,
  syncSuccess,
  getSearchProfileRequest,
  getSearchProfileRequestSuccess,
  addSearchProfileRequest,
  updSearchProfileRequest,
  delSearchProfileRequest,
  saveSearchProfileSuccess,
} = actions;

export {
  getRequest,
  getArchivedRequest,
  getSummaryRequest,
  loginSuccess,
  logoutSuccess,
  addRequest,
  updRequest,
  delRequest,
  delSuccess,
  delFailure,
  requestSuccess,
  requestFailure,
  deleteAllRequest,
  getRequestSuccess,
  getArchivedRequestSuccess,
  getSummaryRequestSuccess,
  syncSuccess,
  getSearchProfileRequest,
  getSearchProfileRequestSuccess,
  addSearchProfileRequest,
  updSearchProfileRequest,
  delSearchProfileRequest,
  saveSearchProfileSuccess,
};
export type { IUserState };
export default reducer;
