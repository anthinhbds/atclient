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
  archiveRequest,
  archiveAllRequest,
  restoreRequest,
  restoreAllRequest,
  requestFailure,
  deleteAllRequest,
  delSuccess,
  delFailure,
  syncSuccess,
} from "./reducer";
import { IAction, IQueryParam, IProjectItem } from "types";
import { request } from "store/utils";
import {
  get,
  add,
  getSummary,
  update,
  dels,
  archive,
  archiveAll,
  restore,
  restoreAll,
  deleteAll,
} from "services/api/project";

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
    data: IProjectItem;
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
    data: IProjectItem;
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
function* archiveAction({
  payload,
}: {
  payload: {
    data: string[];
    actionKey?: IAction;
  };
}) {
  const { actionKey, data } = payload;
  yield request({
    service: archive,
    successAction: syncSuccess,
    failureAction: requestFailure,
    params: data,
    actionKey,
  });
}

function* archiveAllAction({
  payload,
}: {
  payload: {
    actionKey?: IAction;
  };
}) {
  const { actionKey } = payload;
  yield request({
    service: archiveAll,
    successAction: syncSuccess,
    failureAction: requestFailure,
    actionKey,
  });
}
function* restoreAction({
  payload,
}: {
  payload: {
    data: string[];
    actionKey?: IAction;
  };
}) {
  const { actionKey, data } = payload;
  yield request({
    service: restore,
    successAction: syncSuccess,
    failureAction: requestFailure,
    params: data,
    actionKey,
  });
}
function* restoreAllAction({
  payload,
}: {
  payload: {
    actionKey?: IAction;
  };
}) {
  const { actionKey } = payload;
  yield request({
    service: restoreAll,
    successAction: syncSuccess,
    failureAction: requestFailure,
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
  yield all([takeLatest(restoreRequest, restoreAction)]);
  yield all([takeLatest(restoreAllRequest, restoreAllAction)]);
  yield all([takeLatest(archiveRequest, archiveAction)]);
  yield all([takeLatest(archiveAllRequest, archiveAllAction)]);
}
