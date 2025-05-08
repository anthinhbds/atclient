import { all, takeLatest } from "redux-saga/effects";
import {
  getBadgeCountRequest,
  getBadgeCountRequestSuccess,
  getNoticeRequest,
  getNoticeRequestSuccess,
  markReadRequest,
  requestSuccess,
  requestFailure,
} from "./reducer";
// import { IAction, IQueryParam, INotification } from "types";
import { request } from "store/utils";
import {
  getNotice,
  getBadgetCount,
  markRead,
} from "services/api/notice";

function* getBadgetCountAction({ payload }: { payload: { params: undefined } }) {
  const { params } = payload;
  yield request({
    service: getBadgetCount,
    successAction: getBadgeCountRequestSuccess,
    failureAction: requestFailure,
    params,
  });
}

function* getNoticeAction({ payload }: { payload: { params: undefined } }) {
  const { params } = payload;
  yield request({
    service: getNotice,
    successAction: getNoticeRequestSuccess,
    failureAction: requestFailure,
    params,
  });
}

function* markReadAction({ payload }: { payload: { data: string } }) {
  const { data } = payload;
  yield request({
    service: markRead,
    successAction: requestSuccess,
    failureAction: requestFailure,
    params: data,
  });
}


export default function* sagas() {
  yield all([takeLatest(getNoticeRequest, getNoticeAction)]);
  yield all([takeLatest(getBadgeCountRequest, getBadgetCountAction)]);
  yield all([takeLatest(markReadRequest, markReadAction)]);
}
