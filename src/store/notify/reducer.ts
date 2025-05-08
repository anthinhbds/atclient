/** @format */

import { createSlice } from "@reduxjs/toolkit";
import { INotification } from 'types';

interface IOptions {
  position?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  };
  autoHideDuration?: number;
  useI18n?: boolean;
}

interface INofifyState {
  message: string;
  type?: "success" | "info" | "warning" | "error";
  options?: IOptions;
  notificationBadgeCount?: number;
  notificationBadge?: INotification[];
  loading?: boolean;
  total?: number;
  error?: any;
  saving?: boolean;
}

const initialState: INofifyState = {
  message: "",
  type: "info",
  options: {
    position: {
      horizontal: "center",
      vertical: "top",
    },
    autoHideDuration: 2000,
    useI18n: false,
  },
  notificationBadgeCount: 0,
  notificationBadge: undefined,
  loading: false,
  error: null,
  total: 0,
  saving: false
};

const slice = createSlice({
  name: "notify",
  initialState,
  reducers: {
    getBadgeCountRequest: (state, _data: { payload: { params: undefined } }) => ({
      ...state,
      error: null,
      message: '',
      loading: true,
    }),
    getBadgeCountRequestSuccess: (
      state,
      { payload }: { payload: { data: number } }
    ) => ({
      ...state,
      error: null,
      message: '',
      loading: false,
      notificationBadgeCount: payload.data,
    }),
    getNoticeRequest: (state, _data: { payload: { params: undefined } }) => ({
      ...state,
      error: null,
      message: '',
      loading: true,
    }),
    getNoticeRequestSuccess: (
      state,
      { payload }: { payload: { data: INotification[] } }
    ) => ({
      ...state,
      error: null,
      message: '',
      loading: false,
      notificationBadge: payload.data,
    }),
    markReadRequest: (
      state,
      _data: {
        payload: { data: string };
      }
    ) => ({
      ...state,
      saving: true,
      error: null,
      message: '',
    }),
    requestSuccess: (state) => ({
      ...state,
      saving: false,
      error: null,
      // message: '',
      loading: false,
    }),
    requestFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      message: '',
      loading: false,
    }),
    show: (state, { payload }: { payload: INofifyState }) => {
      return {
        ...state,
        options: payload.options,
        message: payload.message,
        type: payload.type || "info",
      };
    },
    info: (state, { payload }: { payload: INofifyState }) => {
      return {
        ...state,
        message: payload.message,
        type: "info",
      };
    },
    success: (state, { payload }: { payload: INofifyState }) => {
      return {
        ...state,
        message: payload.message,
        type: "success",
      };
    },
    warning: (state, { payload }: { payload: INofifyState }) => {
      return {
        ...state,
        message: payload.message,
        type: "warning",
      };
    },
    error: (
      state,
      {
        payload,
      }: { payload: { message: string; } }
    ) => {
      return {
        ...state,
        message: payload.message,
        type: "error",
      };
    },
    hide: (state) => {
      return {
        ...state,
        message: "",
      };
    },


  },
});
const { actions, reducer } = slice;

const {
  hide,
  error,
  info,
  warning,
  success,
  show,
  getBadgeCountRequest,
  getBadgeCountRequestSuccess,
  getNoticeRequest,
  getNoticeRequestSuccess,
  requestFailure,
  requestSuccess,
  markReadRequest,
} = actions;

export {
  hide,
  error,
  info,
  warning,
  success,
  show,
  getBadgeCountRequest,
  getBadgeCountRequestSuccess,
  getNoticeRequest,
  getNoticeRequestSuccess,
  markReadRequest,
  requestSuccess,
  requestFailure,
};
export type { INofifyState, IOptions };
export default reducer;