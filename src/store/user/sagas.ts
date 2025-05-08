import { all, takeLatest } from "redux-saga/effects";
import {
  getRequest,
  getArchivedRequest,
  getRequestSuccess,
  getArchivedRequestSuccess,
  getSummaryRequest,
  getSummaryRequestSuccess,
  addRequest,
  updRequest,
  delRequest,
  requestFailure,
  deleteAllRequest,
  delSuccess,
  delFailure,
  syncSuccess,
  saveSearchProfileSuccess,
  getSearchProfileRequest,
  getSearchProfileRequestSuccess,
  addSearchProfileRequest,
  updSearchProfileRequest,
  delSearchProfileRequest,
} from "./reducer";
import { IAction, IQueryParam, IUserItem, IUserSearchProfileItem } from "types";
import { request } from "store/utils";
import {
  get,
  add,
  getSummary,
  update,
  dels,
  deleteAll,
  getSearchProfile,
  addSearchProfile,
  updateSearchProfile,
  delSearchProfile,
} from "services/api/user";

function* getActiveAction({ payload }: { payload: { params: IQueryParam } }) {
  const { params } = payload;
  yield request({
    service: get,
    successAction: getRequestSuccess,
    failureAction: requestFailure,
    params,
  });
}
function* getArchivedAction({ payload }: { payload: { params: IQueryParam } }) {
  const { params } = payload;
  yield request({
    service: get,
    successAction: getArchivedRequestSuccess,
    failureAction: requestFailure,
    params,
  });
}
function* getSummaryAction({ payload }: { payload: { params: IQueryParam } }) {
  const { params } = payload;
  yield request({
    service: getSummary,
    successAction: getSummaryRequestSuccess,
    failureAction: requestFailure,
    params,
  });
}
function* addAction({
  payload,
}: {
  payload: {
    data: IUserItem;
    actionKey?: IAction;
  };
}) {
  const { actionKey, data } = payload;
  yield request({
    service: add,
    successAction: syncSuccess,
    failureAction: requestFailure,
    params: data,
    actionKey,
  });
}
function* updAction({
  payload,
}: {
  payload: {
    data: IUserItem;
    actionKey?: IAction;
  };
}) {
  const { actionKey, data } = payload;
  yield request({
    service: update,
    successAction: syncSuccess,
    failureAction: requestFailure,
    params: data,
    actionKey,
  });
}
function* delAction({
  payload,
}: {
  payload: {
    data: string[];
    actionKey?: IAction;
  };
}) {
  const { data, actionKey } = payload;
  yield request({
    service: dels,
    successAction: [delSuccess, syncSuccess],
    failureAction: delFailure,
    params: data,
    actionKey,
  });
}
function* deleteAllAction({
  payload,
}: {
  payload: {
    data: { archived: number };
    actionKey?: IAction;
  };
}) {
  const { data, actionKey } = payload;
  yield request({
    service: deleteAll,
    successAction: syncSuccess,
    failureAction: delFailure,
    actionKey,
    params: data,
  });
}
function* getSearchProfileAction({ payload }: { payload: { params: IQueryParam } }) {
  const { params } = payload;
  yield request({
    service: getSearchProfile,
    successAction: getSearchProfileRequestSuccess,
    failureAction: requestFailure,
    params,
  });
}
function* addSearchProfileAction({
  payload,
}: {
  payload: {
    data: IUserSearchProfileItem;
    actionKey?: IAction;
  };
}) {
  const { actionKey, data } = payload;
  yield request({
    service: addSearchProfile,
    successAction: saveSearchProfileSuccess,
    failureAction: requestFailure,
    params: data,
    actionKey,
  });
}
function* updSearchProfileAction({
  payload,
}: {
  payload: {
    data: IUserSearchProfileItem;
    actionKey?: IAction;
  };
}) {
  const { actionKey, data } = payload;
  yield request({
    service: updateSearchProfile,
    successAction: saveSearchProfileSuccess,
    failureAction: requestFailure,
    params: data,
    actionKey,
  });
}
function* delSearchProfileAction({
  payload,
}: {
  payload: {
    data: string;
    actionKey?: IAction;
  };
}) {
  const { data, actionKey } = payload;
  yield request({
    service: delSearchProfile,
    successAction: [saveSearchProfileSuccess],
    failureAction: delFailure,
    params: data,
    actionKey,
  });
}

export default function* sagas() {
  yield all([takeLatest(getRequest, getActiveAction)]);
  yield all([takeLatest(getArchivedRequest, getArchivedAction)]);
  yield all([takeLatest(getSummaryRequest, getSummaryAction)]);
  yield all([takeLatest(addRequest, addAction)]);
  yield all([takeLatest(updRequest, updAction)]);
  yield all([takeLatest(delRequest, delAction)]);
  yield all([takeLatest(deleteAllRequest, deleteAllAction)]);
  yield all([takeLatest(getSearchProfileRequest, getSearchProfileAction)]);
  yield all([takeLatest(addSearchProfileRequest, addSearchProfileAction)]);
  yield all([takeLatest(updSearchProfileRequest, updSearchProfileAction)]);
  yield all([takeLatest(delSearchProfileRequest, delSearchProfileAction)]);
}
