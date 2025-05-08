/** @format */

import { all } from "redux-saga/effects";
import userSagas from "./user/sagas";
import projectSagas from "./project/sagas";
import apartmentSagas from "./apartment/sagas";
import customerSagas from "./customer/sagas";
import customerJourneySagas from "./customerjourney/sagas";
import transactionSagas from "./transaction/sagas";
import homeSagas from "./home/sagas";
import reportSagas from "./report/sagas";
import noticeSagas from "./notify/sagas";

export default function* rootSaga() {
  yield all([
    userSagas(),
    projectSagas(),
    apartmentSagas(),
    customerSagas(),
    customerJourneySagas(),
    transactionSagas(),
    homeSagas(),
    reportSagas(),
    noticeSagas(),
  ]);
}
