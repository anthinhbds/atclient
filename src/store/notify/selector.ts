/**
 * @description get data from redux store when perform the user authentication
 */
import { createSelector } from 'reselect';
import { INofifyState } from './reducer';

const selector = (state: { notify: INofifyState }) => state.notify;

const notificationBadgeCount = createSelector(selector, ({ notificationBadgeCount }: INofifyState) => notificationBadgeCount);
const notificationBadge = createSelector(selector, ({ notificationBadge }: INofifyState) => notificationBadge);

export const getMessage = createSelector(selector, ({ message }: INofifyState) => message);
export const getType = createSelector(selector, ({ type }: INofifyState) => type);
export const options = createSelector(selector, ({ options }: INofifyState) => options);


export { notificationBadgeCount, notificationBadge };