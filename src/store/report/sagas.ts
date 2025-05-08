import { all, takeLatest } from "redux-saga/effects";
import {
  getTotalViewRequest,
  getTotalViewRequestSuccess,
  requestFailure,
} from "./reducer";
import { request } from "store/utils";
import {
  getTotalView
} from "services/api/report";

function* getTotalViewAction() {
  yield request({
    service: getTotalView,
    successAction: getTotalViewRequestSuccess,
    failureAction: requestFailure,
    params: null,
  });
}

export default function* sagas() {
  yield all([takeLatest(getTotalViewRequest, getTotalViewAction)]);
}
