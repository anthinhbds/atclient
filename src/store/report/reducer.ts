/** @format */
/** @format */
import { createSlice } from "@reduxjs/toolkit";
import { IViewStatisticItem } from "types";

interface IReportState {
  loading: boolean;
  error: any;
  message: any;
  viewStatisticItems: IViewStatisticItem[];
}
// // TODO: Store design
const initialState: IReportState = {
  loading: false,
  error: null,
  message: null,
  viewStatisticItems: [],
};
const slice = createSlice({
  name: "report",
  initialState: initialState,
  reducers: {
    getTotalViewRequest: (state) => ({
      ...state,
      error: null,
      message: null,
      loading: true,
    }),
    getTotalViewRequestSuccess: (
      state,
      { payload }: { payload: { data: IViewStatisticItem[] } }
    ) => ({
      ...state,
      viewStatisticItems: payload.data,
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
  getTotalViewRequest,
  getTotalViewRequestSuccess,
  requestFailure,
} = actions;

export {
  getTotalViewRequest,
  getTotalViewRequestSuccess,
  requestFailure,
};
export type { IReportState };
export default reducer;
