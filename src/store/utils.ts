import { ActionCreator } from "@reduxjs/toolkit";
import { all, cancel, fork, put, take } from "redux-saga/effects";
// import { error } from "store/notify";
import { IAction } from "types";

const SUCCESS_STATUS = [200, 201, 202];

interface IResponse {
  status: any;
  data: {
    success: boolean;
    message: string;
    data: any;
    langOpts?: any;
  };
  code: string;
  response?: any;
}
interface IGetRequest<TParam> {
  service: (data: TParam, callback?: (res: any) => void) => Promise<IResponse>;
  params?: TParam;
  successAction: ActionCreator<any> | ActionCreator<any>[];
  failureAction: ActionCreator<any>;
  onSuccess?: (data: any) => void;
  onFailure?: (error: any) => void;
  actionKey?: IAction;
}
function* _request<TParam>({
  service,
  params,
  successAction,
  failureAction,
  onSuccess,
  onFailure,
  actionKey,
}: IGetRequest<TParam>) {
  // const { t } = useTranslation();
  try {
    const rq: IResponse = yield service(params!);
    if (!rq) {
      // TODO: Handle server communication error
    } else {
      const response = rq?.data;
      if (SUCCESS_STATUS.includes(rq?.status) && response) {
        if (response?.success) {
          if (Array.isArray(successAction)) {
            yield all(
              successAction.map((action) =>
                put(action({
                  ...response,
                  requestPayload: params,
                  actionKey
                }))
              )
            );
          } else
            yield put(
              successAction({
                ...response,
                requestPayload: params,
                actionKey
              })
            );
          onSuccess && onSuccess(response?.data);
        } else {
          const response = rq?.data;
          if (SUCCESS_STATUS.includes(rq?.status) && response) {
            if (response?.success) {
              if (Array.isArray(successAction)) {
                yield all(
                  successAction.map((action) =>
                    put(
                      action({
                        ...response,
                        requestPayload: params,
                        actionKey
                      })
                    )
                  )
                );
              } else
                yield put(
                  successAction({
                    ...response,
                    requestPayload: params,
                    actionKey,
                  })
                );
              onSuccess && onSuccess(response?.data);
            } else {
              yield put(failureAction(response?.message));
              // yield put(
              //   error({
              //     message: response?.message,
              //     options: { useI18n: true },
              //     langOpts: response?.langOpts,
              //   })
              // ); 
              onFailure && onFailure(response?.message);
            }
          } else {
            const message = response?.message || rq.code;

            yield put(failureAction(message));
            // yield put(
            //   error({
            //     message,
            //     options: { useI18n: true },
            //     langOpts: response?.langOpts,
            //   })
            // );
            onFailure && onFailure(message);
          }
        }
      }
      else {
        const rp = rq["response"].data;
        yield put(failureAction(rp?.message));
        // yield put(
        //   error({
        //     message: rp?.message,
        //     options: { useI18n: true },
        //     langOpts: rp?.langOpts,
        //   })
        // );
        onFailure && onFailure(rp?.message);
      }
    }
  } catch (e: any) {
    yield put(failureAction(e?.message));
    // yield put(error({ message: e?.message }));
    onFailure && onFailure(e?.message);
  }
}

type ICancelRequest<TParam> = { cancelId?: string } & IGetRequest<TParam>;

export function* request<TParam>({
  cancelId,
  ...rest
}: ICancelRequest<TParam>): Generator {
  const myRequest = yield fork(_request<TParam>, rest);
  if (cancelId) {
    yield take(`${cancelId}`);
    yield cancel(myRequest);
  }
  return myRequest;
}
