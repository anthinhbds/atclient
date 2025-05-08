import { all, takeLatest } from "redux-saga/effects";
import {
  getRevenueMonthlyByUserRequest,
  getRevenueMonthlyByUserRequestSuccess,
  requestFailure,
} from "./reducer";
import { request } from "store/utils";
import {
  getRevenueUserByMonthly
} from "services/api/home";

function* getRevenueMonthlyByUserAction({ payload }: { payload: { userId: string, month: number } }) {
  // const { id } = payload;
  yield request({
    service: getRevenueUserByMonthly,
    successAction: getRevenueMonthlyByUserRequestSuccess,
    failureAction: requestFailure,
    params: payload,
  });
}

export default function* sagas() {
  yield all([takeLatest(getRevenueMonthlyByUserRequest, getRevenueMonthlyByUserAction)]);
}
