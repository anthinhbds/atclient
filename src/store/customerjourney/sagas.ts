import { all, takeLatest } from "redux-saga/effects";
import {
  getRequest,
  getRequestSuccess,
  addRequest,
  updRequest,
  delRequest,
  requestFailure,
  deleteAllRequest,
  delSuccess,
  delFailure,
  syncSuccess,
} from "./reducer";
import { IAction, IQueryParam, ICustomerJourneyItem } from "types";
import { request } from "store/utils";
import {
  get,
  add,
  update,
  dels,
  deleteAll,
} from "services/api/customerjourney";

function* getActiveAction({ payload }: { payload: { params: IQueryParam } }) {
  const { params } = payload;
  yield request({
    service: get,
    successAction: getRequestSuccess,
    failureAction: requestFailure,
    params,
  });
}
function* addAction({
  payload,
}: {
  payload: {
    data: ICustomerJourneyItem;
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
    data: ICustomerJourneyItem;
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
  yield all([takeLatest(addRequest, addAction)]);
  yield all([takeLatest(updRequest, updAction)]);
  yield all([takeLatest(delRequest, delAction)]);
  yield all([takeLatest(deleteAllRequest, deleteAllAction)]);
}
