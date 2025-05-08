import { IQueryParam, IUserItem } from "types";
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
    `Project/query?page=${page + 1}&pageSize=${pageSize}`,
    {
      ...ps,
    },
    callback
  );
};
const getById = (id: string, callback?: (data: any) => void) => {
  return handleGet(`Project/${id}`, null, callback);
};
const getDistrict = (params: IQueryParam, callback?: (data: any) => void) => {
  return handlePost(
    `Project/getDistrict`,
    params,
    callback
  );
};
const add = (params: IUserItem, callback?: (data: any) => void) => {
  return handlePost(
    `Project`,
    {
      ...params,
    },
    callback
  );
};
const update = (params: any, callback?: (data: any) => void) => {
  return handlePut(
    `Project`,
    params.userId,
    {
      ...params,
    },
    callback
  );
};
const archive = (params: string[], callback?: (data: any) => void) => {
  return handlePutWithKey(`Project/archive`, params, callback);
};
const archiveAll = (callback?: (data: any) => void) => {
  return handlePost(`Project/archiveAll`, null, callback);
};
const restore = (params: string[], callback?: (data: any) => void) => {
  return handlePutWithKey(`Project/restore`, params, callback);
};
const restoreAll = (callback?: (data: any) => void) => {
  return handlePost(`Project/restoreAll`, null, callback);
};
const del = (id: string, callback?: (data: any) => void) => {
  return handleDelete(`Project`, id, callback);
};
const dels = (
  params: string[],
  callback?: (data: any) => void
) => {
  return handleDeletes(`Project/deletes`, params, callback);
};
const deleteAll = (
  params: { archived: number },
  callback?: (data: any) => void
) => {
  return handlePost(`Project/deleteAll`, params, callback);
};
const getSummary = (params: IQueryParam, callback?: (data: any) => void) => {
  return handlePost(
    `Project/getSummary`,
    {
      ...params,
    },
    callback
  );
};
const checkExistName = (params: any, callback?: (data: any) => void) => {
  return handlePost(
    `Project/checkExistName`,
    {
      ...params,
    },
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
  checkExistName,
  getById,
  getDistrict,
};