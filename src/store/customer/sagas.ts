import { all, takeLatest } from "redux-saga/effects";
import {
  getRequest,
  getRequestSuccess,
  getMyCustomerRequest,
  getMyCustomerRequestSuccess,
  getSummaryRequest,
  getSummaryRequestSuccess,
  addRequest,
  updRequest,
  delRequest,
  requestFailure,
  deleteAllRequest,
  assignmentRequest,
  delSuccess,
  delFailure,
  syncSuccess,
} from "./reducer";
import { IAction, IQueryParam, ICustomerItem } from "types";
import { request } from "store/utils";
import {
  get,
  getAll,
  add,
  getSummary,
  update,
  dels,
  assigment,
  deleteAll,
} from "services/api/customer";

function* getActiveAction({ payload }: { payload: { params: IQueryParam } }) {
  const { params } = payload;
  yield request({
    service: getAll,
    successAction: getRequestSuccess,
    failureAction: requestFailure,
    params,
  });
}
function* getMyCustomerAction({ payload }: { payload: { params: IQueryParam } }) {
  const { params } = payload;
  yield request({
    service: get,
    successAction: getMyCustomerRequestSuccess,
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
    data: ICustomerItem;
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
    data: ICustomerItem;
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
function* assignmentAction({
  payload,
}: {
  payload: {
    data: { ids: string[], assignee: string };
    actionKey?: IAction;
  };
}) {
  const { actionKey, data } = payload;
  yield request({
    service: assigment,
    successAction: syncSuccess,
    failureAction: requestFailure,
    params: data,
    actionKey,
  });
}
export default function* sagas() {
  yield all([takeLatest(getRequest, getActiveAction)]);
  yield all([takeLatest(getMyCustomerRequest, getMyCustomerAction)]);
  yield all([takeLatest(getSummaryRequest, getSummaryAction)]);
  yield all([takeLatest(addRequest, addAction)]);
  yield all([takeLatest(updRequest, updAction)]);
  yield all([takeLatest(delRequest, delAction)]);
  yield all([takeLatest(deleteAllRequest, deleteAllAction)]);
  yield all([takeLatest(assignmentRequest, assignmentAction)]);
}
