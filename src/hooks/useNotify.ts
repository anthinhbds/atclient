/**
 * @format
 * @description the hook to show notification by toast message
 */

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  show as showActions,
  hide as hideActions,
  INofifyState,
  IOptions,
  getNoticeRequest,
  getBadgeCountRequest,
  markReadRequest,
} from "store/notify";
import { notificationBadgeCount, notificationBadge } from "store/notify/selector";

export const useNotify = () => {
  const dispatch = useDispatch();
  const badgeCount = useSelector(notificationBadgeCount);
  const notifications = useSelector(notificationBadge);

  const show = useCallback(
    (params: INofifyState) => {
      dispatch(showActions(params));
    },
    [dispatch]
  );

  const info = useCallback(
    (message: string, options?: IOptions) =>
      show({ type: "info", message, options }),
    [show]
  );

  const success = useCallback(
    (message: string, options?: Partial<INofifyState["options"]>) =>
      show({ type: "success", message, options }),
    [show]
  );

  const error = useCallback(
    (message: string, options?: Partial<INofifyState["options"]>) =>
      show({ type: "error", message, options }),
    [show]
  );

  const warning = useCallback(
    (message: string, options?: Partial<INofifyState["options"]>) =>
      show({ type: "warning", message, options }),
    [show]
  );
  const hide = useCallback(() => dispatch(hideActions()), []);

  const getNotice = () => {
    dispatch(getNoticeRequest({ params: undefined }));
  };
  const getBadgetCount = () => {
    dispatch(getBadgeCountRequest({ params: undefined }));
  };
  const onMarkRead = (data: string) => {
    dispatch(markReadRequest({ data }));
  };

  return {
    show,
    hide,
    info,
    success,
    error,
    warning,
    getNotice,
    getBadgetCount,
    notifications,
    badgeCount,
    onMarkRead,
  };
};
