import { IQueryParam, ITransactionItem } from "types";
import {
  handleDeletes,
  // handlePutWithKey,
  handlePost,
  handlePut,
  handleDelete,
  handleGet,
} from "../utils";

const get = (params: IQueryParam, callback?: (data: any) => void) => {
  const { page = 0, pageSize = 15, ...ps } = params;
  return handlePost(
    `Transaction/query?page=${page + 1}&pageSize=${pageSize}`,
    {
      ...ps,
    },
    callback
  );
};
const getExpense = (params: IQueryParam, callback?: (data: any) => void) => {
  const { page = 0, pageSize = 15, ...ps } = params;
  return handlePost(
    `Transaction/expense?page=${page + 1}&pageSize=${pageSize}`,
    {
      ...ps,
    },
    callback
  );
};
const getById = (id: string, callback?: (data: any) => void) => {
  return handleGet(`Transaction/${id}`, null, callback);
};
const getDetails = (id: string, callback?: (data: any) => void) => {
  return handleGet(`Transaction/details/${id}`, null, callback);
};
const getMembers = (id: string, callback?: (data: any) => void) => {
  return handleGet(`Transaction/members/${id}`, null, callback);
};
const add = (params: ITransactionItem, callback?: (data: any) => void) => {
  return handlePost(
    `Transaction`,
    {
      ...params,
    },
    callback
  );
};
const update = (params: ITransactionItem, callback?: (data: any) => void) => {
  return handlePut(
    `Transaction`,
    params.transId ?? '',
    {
      ...params,
    },
    callback
  );
};

const del = (id: string, callback?: (data: any) => void) => {
  return handleDelete(`Transaction`, id, callback);
};
const dels = (
  params: string[],
  callback?: (data: any) => void
) => {
  return handleDeletes(`Transaction/deletes`, params, callback);
};
const deleteAll = (
  params: { archived: number },
  callback?: (data: any) => void
) => {
  return handlePost(`Transaction/deleteAll`, params, callback);
};
const getSummary = (params: IQueryParam, callback?: (data: any) => void) => {
  return handlePost(
    `Transaction/getSummary`,
    {
      ...params,
    },
    callback
  );
};

const getTransactionNo = (params: ITransactionItem, callback?: (data: any) => void) => {
  return handlePost(
    `Transaction/transactionNo`,
    params,
    callback
  );
};

const getBctcByMonthly = (params: { revenuetype: string, month: number }, callback?: (data: any) => void) => {
  return handlePost(
    `Transaction/bctcByMonth`,
    params,
    callback
  );
};

export {
  get,
  getExpense,
  getSummary,
  add,
  update,
  del,
  dels,
  deleteAll,
  getById,
  getDetails,
  getTransactionNo,
  getMembers,
  getBctcByMonthly
};