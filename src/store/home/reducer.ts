
import { createSlice } from "@reduxjs/toolkit";
import { IRevenueMonthlyItem } from "types";

interface IHomeState {
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  restored: boolean;
  error: any;
  message: any;
  revenuesMonthly: IRevenueMonthlyItem[];
}
// // TODO: Store design
const initialState: IHomeState = {
  loading: false,
  saving: false,
  deleting: false,
  restored: false,
  error: null,
  message: null,
  revenuesMonthly: [],
};
const slice = createSlice({
  name: "home",
  initialState: initialState,
  reducers: {
    getRevenueMonthlyByUserRequest: (state, _data: { payload: { userId: string, month: number } }) => ({
      ...state,
      error: null,
      message: null,
      loading: true,
    }),
    getRevenueMonthlyByUserRequestSuccess: (
      state,
      { payload }: { payload: { data: IRevenueMonthlyItem[]; total: number } }
    ) => ({
      ...state,
      revenuesMonthly: payload.data,
      error: null,
      message: null,
      loading: false,
    }),
    requestFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      message: null,
      loading: false,
    }),
  },
});

const { actions, reducer } = slice;
const {
  getRevenueMonthlyByUserRequest,
  getRevenueMonthlyByUserRequestSuccess,
  requestFailure,
} = actions;

export {
  getRevenueMonthlyByUserRequest,
  getRevenueMonthlyByUserRequestSuccess,
  requestFailure,
};
export type { IHomeState };
export default reducer;
