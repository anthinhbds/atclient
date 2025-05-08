import { all, takeLatest } from "redux-saga/effects";
import {
  getRequest,
  getRequestSuccess,
  getPMGRequest,
  getPMGRequestSuccess,
  getPGTRequest,
  getPGTRequestSuccess,
  getSummaryRequest,
  getSummaryRequestSuccess,
  getCTLRequest,
  getCTHRequest,
  getCTDRequest,
  getCTLRequestSuccess,
  getCTHRequestSuccess,
  getCTDRequestSuccess,
  addRequest,
  updRequest,
  delRequest,
  requestFailure,
  deleteAllRequest,
  delSuccess,
  delFailure,
  syncSuccess,
} from "./reducer";
import { IAction, IQueryParam, ITransactionItem } from "types";
import { request } from "store/utils";
import {
  get,
  getExpense,
  add,
  getSummary,
  update,
  dels,
  deleteAll,
} from "services/api/transaction";

function* getActiveAction({ payload }: { payload: { params: IQueryParam } }) {
  const { params } = payload;
  yield request({
    service: get,
    successAction: getRequestSuccess,
    failureAction: requestFailure,
    params,
  });
}
function* getPMGAction({ payload }: { payload: { params: IQueryParam } }) {
  const { params } = payload;
  yield request({
    service: get,
    successAction: getPMGRequestSuccess,
    failureAction: requestFailure,
    params,
  });
}
function* getPGTAction({ payload }: { payload: { params: IQueryParam } }) {
  const { params } = payload;
  yield request({
    service: get,
    successAction: getPGTRequestSuccess,
    failureAction: requestFailure,
    params,
  });
}
function* getCTLAction({ payload }: { payload: { params: IQueryParam } }) {
  const { params } = payload;
  yield request({
    service: getExpense,
    successAction: getCTLRequestSuccess,
    failureAction: requestFailure,
    params,
  });
}
function* getCTHAction({ payload }: { payload: { params: IQueryParam } }) {
  const { params } = payload;
  yield request({
    service: getExpense,
    successAction: getCTHRequestSuccess,
    failureAction: requestFailure,
    params,
  });
}
function* getCTDAction({ payload }: { payload: { params: IQueryParam } }) {
  const { params } = payload;
  yield request({
    service: getExpense,
    successAction: getCTDRequestSuccess,
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
    data: ITransactionItem;
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
    data: ITransactionItem;
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

export default function* sagas() {
  yield all([takeLatest(getRequest, getActiveAction)]);
  yield all([takeLatest(getPMGRequest, getPMGAction)]);
  yield all([takeLatest(getPGTRequest, getPGTAction)]);
  yield all([takeLatest(getCTLRequest, getCTLAction)]);
  yield all([takeLatest(getCTHRequest, getCTHAction)]);
  yield all([takeLatest(getCTDRequest, getCTDAction)]);
  yield all([takeLatest(getSummaryRequest, getSummaryAction)]);
  yield all([takeLatest(addRequest, addAction)]);
  yield all([takeLatest(updRequest, updAction)]);
  yield all([takeLatest(delRequest, delAction)]);
  yield all([takeLatest(deleteAllRequest, deleteAllAction)]);
}
