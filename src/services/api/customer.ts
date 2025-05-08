import { IQueryParam, ICustomerItem } from "types";
import {
  handleDeletes,
  handlePutWithKey,
  handlePost,
  handlePut,
  handleDelete,
  handleGet,
} from "../utils";

const get = (params: IQueryParam, callback?: (data: any) => void) => {
  const { page = 0, pageSize = 15, ...ps } = params;
  return handlePost(
    `Customer/query?page=${page + 1}&pageSize=${pageSize}`,
    {
      ...ps,
    },
    callback
  );
};
const getAll = (params: IQueryParam, callback?: (data: any) => void) => {
  const { page = 0, pageSize = 15, ...ps } = params;
  return handlePost(
    `Customer/queryAll?page=${page + 1}&pageSize=${pageSize}`,
    {
      ...ps,
    },
    callback
  );
};
const getById = (id: string, callback?: (data: any) => void) => {
  return handleGet(`Customer/${id}`, null, callback);
};
const getCombo = (params: IQueryParam, callback?: (data: any) => void) => {
  const { page = 0, pageSize = 15, ...ps } = params;
  return handlePost(
    `Customer/combo?page=${page + 1}&pageSize=${pageSize}`,
    {
      ...ps,
    },
    callback
  );
};
const getNotes = (id: string, callback?: (data: any) => void) => {
  return handleGet(`Customer/notes/${id}`, null, callback);
};
const add = (params: ICustomerItem, callback?: (data: any) => void) => {
  return handlePost(
    `Customer`,
    {
      ...params,
    },
    callback
  );
};
const update = (params: ICustomerItem, callback?: (data: any) => void) => {
  return handlePut(
    `Customer`,
    params.customerId ?? '',
    {
      ...params,
    },
    callback
  );
};
const archive = (params: string[], callback?: (data: any) => void) => {
  return handlePutWithKey(`Customer/archive`, params, callback);
};
const archiveAll = (callback?: (data: any) => void) => {
  return handlePost(`Customer/archiveAll`, null, callback);
};
const restore = (params: string[], callback?: (data: any) => void) => {
  return handlePutWithKey(`Customer/restore`, params, callback);
};
const restoreAll = (callback?: (data: any) => void) => {
  return handlePost(`Customer/restoreAll`, null, callback);
};
const del = (id: string, callback?: (data: any) => void) => {
  return handleDelete(`Customer`, id, callback);
};
const dels = (
  params: string[],
  callback?: (data: any) => void
) => {
  return handleDeletes(`Customer/deletes`, params, callback);
};
const deleteAll = (
  params: { archived: number },
  callback?: (data: any) => void
) => {
  return handlePost(`Customer/deleteAll`, params, callback);
};
const getSummary = (params: IQueryParam, callback?: (data: any) => void) => {
  return handlePost(
    `Customer/getSummary`,
    {
      ...params,
    },
    callback
  );
};
const assigment = (params: { ids: string[], assignee: string }, callback?: (data: any) => void) => {
  return handlePost(
    `Customer/assigment`,
    params,
    callback
  );
};
const getAssigment = (id: string, callback?: (data: any) => void) => {
  return handlePost(
    `Customer/getAssignment?id=${id}`,
    null,
    callback
  );
};

const checkTelephone = (params: { apartmentId: string, phones: string[] }, callback?: (data: any) => void) => {
  return handlePost(
    `Customer/checkTelephone`,
    params,
    callback
  );
};

export {
  get,
  getSummary,
  add,
  update,
  archive,
  archiveAll,
  restore,
  restoreAll,
  del,
  dels,
  deleteAll,
  getById,
  assigment,
  getAssigment,
  getNotes,
  getAll,
  checkTelephone,
  getCombo,
};