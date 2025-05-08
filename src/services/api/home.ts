// import { IQueryParam, ITransactionItem } from "types";
import {
  // handleDeletes,
  // // handlePutWithKey,
  handlePost,
  // handlePut,
  // handleDelete,
  // handleGet,
} from "../utils";

const getRevenueUserByMonthly = (params: { userId: string, month: number }, callback?: (data: any) => void) => {
  return handlePost(
    `Home/revenueMonthly`,
    params,
    callback
  );
};

export {
  getRevenueUserByMonthly,
};