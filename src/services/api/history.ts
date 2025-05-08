import { IHistoryItem } from "types";
import {
  handlePost,
  // handleGet,
} from "../utils";



const getHistory = (params: { formId: string, referenceId: string }, callback?: (data: any) => void) => {
  return handlePost(`History/get`, params, callback);
};
const add = (params: IHistoryItem, callback?: (data: any) => void) => {
  return handlePost(
    `History`,
    {
      ...params,
    },
    callback
  );
};

export {
  add,
  getHistory,
};