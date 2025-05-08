import { all, takeLatest } from "redux-saga/effects";
import {
  getRequest,
  getRequestSuccess,
  getMyApartmentRequest,
  getMyApartmentRequestSuccess,
  getExpiredRequest,
  getExpiredRequestSuccess,
  getSummaryRequest,
  getSummaryRequestSuccess,
  getPartnerRequest,
  getPartnerRequestSuccess,
  getAssignmentRequest,
  getAssignmentRequestSuccess,
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
import { IAction, IQueryParam, IApartmentItem } from "types";
import { request } from "store/utils";
import {
  get,
  getAll,
  add,
  getPartner,
  getExpired,
  getSummary,
  update,
  dels,
  assigment,
  deleteAll,
  getAllocated,
} from "services/api/apartment";

function* getActiveAction({ payload }: { payload: { params: IQueryParam } }) {
  const { params } = payload;
  yield request({
    service: getAll,
    successAction: getRequestSuccess,
    failureAction: requestFailure,
    params,
  });
}
function* getMyAprtmentAction({ payload }: { payload: { params: IQueryParam } }) {
  const { params } = payload;
  yield request({
    service: get,
    successAction: getMyApartmentRequestSuccess,
    failureAction: requestFailure,
    params,
  });
}
function* getPartnerAction({ payload }: { payload: { params: IQueryParam } }) {
  const { params } = payload;
  yield request({
    service: getPartner,
    successAction: getPartnerRequestSuccess,
    failureAction: requestFailure,
    params,
  });
}
function* getExpiredAction({ payload }: { payload: { params: IQueryParam } }) {
  const { params } = payload;
  yield request({
    service: getExpired,
    successAction: getExpiredRequestSuccess,
    failureAction: requestFailure,
    params,
  });
}
function* getAssignmentAction({ payload }: { payload: { params: IQueryParam } }) {
  const { params } = payload;
  yield request({
    service: getAllocated,
    successAction: getAssignmentRequestSuccess,
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
    data: IApartmentItem;
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
    data: IApartmentItem;
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
  yield all([takeLatest(getMyApartmentRequest, getMyAprtmentAction)]);
  yield all([takeLatest(getPartnerRequest, getPartnerAction)]);
  yield all([takeLatest(getExpiredRequest, getExpiredAction)]);
  yield all([takeLatest(getAssignmentRequest, getAssignmentAction)]);
  yield all([takeLatest(getSummaryRequest, getSummaryAction)]);
  yield all([takeLatest(addRequest, addAction)]);
  yield all([takeLatest(updRequest, updAction)]);
  yield all([takeLatest(delRequest, delAction)]);
  yield all([takeLatest(deleteAllRequest, deleteAllAction)]);
  yield all([takeLatest(assignmentRequest, assignmentAction)]);
}
