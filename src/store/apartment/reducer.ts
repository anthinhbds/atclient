/** @format */
import { createSlice } from "@reduxjs/toolkit";
import { IAction, IApartmentItem } from "types";

interface IApartmentState {
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  restored: boolean;
  error: any;
  message: any;
  record: IApartmentItem | null;
  data: IApartmentItem[] | null;
  totalData: number;
  myApartmentData: IApartmentItem[] | null;
  totalMyApartment: number;
  partnerData: IApartmentItem[] | null;
  totalPartner: number;
  expiredData: IApartmentItem[] | null;
  totalExpired: number;
  expiryData: IApartmentItem[] | null;
  totalExpiry: number;
  assigmentData: IApartmentItem[] | null;
  totalAssigment: number;
}
// // TODO: Store design
const initialState: IApartmentState = {
  loading: false,
  saving: false,
  deleting: false,
  restored: false,
  error: null,
  message: null,
  record: null,
  data: null,
  totalData: 0,
  myApartmentData: null,
  totalMyApartment: 0,
  partnerData: null,
  totalPartner: 0,
  expiredData: null,
  totalExpired: 0,
  expiryData: null,
  totalExpiry: 0,
  assigmentData: null,
  totalAssigment: 0,
};
const slice = createSlice({
  name: "apartment",
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
      { payload }: { payload: { data: IApartmentItem[]; total: number } }
    ) => ({
      ...state,
      data: payload.data,
      totalData: payload.total,
      error: null,
      message: null,
      loading: false,
    }),
    getMyApartmentRequest: (state, _data: { payload: { params: any } }) => ({
      ...state,
      error: null,
      message: null,
      loading: true,
    }),
    getMyApartmentRequestSuccess: (
      state,
      { payload }: { payload: { data: IApartmentItem[]; total: number } }
    ) => ({
      ...state,
      myApartmentData: payload.data,
      totalMyApartment: payload.total,
      error: null,
      message: null,
      loading: false,
    }),
    getPartnerRequest: (state, _data: { payload: { params: any } }) => ({
      ...state,
      error: null,
      message: null,
      loading: true,
    }),
    getPartnerRequestSuccess: (
      state,
      { payload }: { payload: { data: IApartmentItem[]; total: number } }
    ) => ({
      ...state,
      partnerData: payload.data,
      totalPartner: payload.total,
      error: null,
      message: null,
      loading: false,
    }),
    getExpiredRequest: (state, _data: { payload: { params: any } }) => ({
      ...state,
      error: null,
      message: null,
      loading: true,
    }),
    getExpiredRequestSuccess: (
      state,
      { payload }: { payload: { data: IApartmentItem[]; total: number } }
    ) => ({
      ...state,
      expiredData: payload.data,
      totalExpired: payload.total,
      error: null,
      message: null,
      loading: false,
    }),
    getAssignmentRequest: (state, _data: { payload: { params: any } }) => ({
      ...state,
      error: null,
      message: null,
      loading: true,
    }),
    getAssignmentRequestSuccess: (
      state,
      { payload }: { payload: { data: IApartmentItem[]; total: number } }
    ) => ({
      ...state,
      assigmentData: payload.data,
      totalAssigment: payload.total,
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
      totalMyApartment:
        payload.data?.filter((v: any) => v['key'] === "MYAPARTMENT")[0]?.count || 0,
      totalPartner:
        payload.data?.filter((v: any) => v['key'] === "PARTNER")[0]?.count || 0,
      totalExpired:
        payload.data?.filter((v: any) => v['key'] === "EXPIRED")[0]?.count || 0,
      totalAssigment:
        payload.data?.filter((v: any) => v['key'] === "ASSIGNMENT")[0]?.count || 0,
      error: null,
      message: null,
    }),
    addRequest: (
      state,
      _data: {
        payload: { data: IApartmentItem; actionKey?: IAction };
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
        payload: { data: IApartmentItem; actionKey?: IAction };
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
  getMyApartmentRequest,
  getExpiredRequest,
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
  getMyApartmentRequestSuccess,
  getPartnerRequest,
  getPartnerRequestSuccess,
  getExpiredRequestSuccess,
  getAssignmentRequest,
  getAssignmentRequestSuccess,
  getSummaryRequestSuccess,
  syncSuccess,
} = actions;

export {
  getRequest,
  getMyApartmentRequest,
  getExpiredRequest,
  getPartnerRequest,
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
  getMyApartmentRequestSuccess,
  getPartnerRequestSuccess,
  getExpiredRequestSuccess,
  getAssignmentRequest,
  getAssignmentRequestSuccess,
  getSummaryRequestSuccess,
  syncSuccess,
};
export type { IApartmentState };
export default reducer;
