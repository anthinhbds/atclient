import { IQueryParam, IApartmentItem } from "types";
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
    `Apartment/query?page=${page + 1}&pageSize=${pageSize}`,
    {
      ...ps,
    },
    callback
  );
};
const getAll = (params: IQueryParam, callback?: (data: any) => void) => {
  const { page = 0, pageSize = 15, ...ps } = params;
  return handlePost(
    `Apartment/queryAll?page=${page + 1}&pageSize=${pageSize}`,
    {
      ...ps,
    },
    callback
  );
};
const getPartner = (params: IQueryParam, callback?: (data: any) => void) => {
  const { page = 0, pageSize = 15, ...ps } = params;
  return handlePost(
    `Apartment/queryPartner?page=${page + 1}&pageSize=${pageSize}`,
    {
      ...ps,
    },
    callback
  );
};
const getCombo = (params: IQueryParam, callback?: (data: any) => void) => {
  const { page = 0, pageSize = 15, ...ps } = params;
  return handlePost(
    `Apartment/getCombo?page=${page + 1}&pageSize=${pageSize}`,
    {
      ...ps,
    },
    callback
  );
};
const getExpired = (params: IQueryParam, callback?: (data: any) => void) => {
  const { page = 0, pageSize = 15, ...ps } = params;
  return handlePost(
    `Apartment/getExpired?page=${page + 1}&pageSize=${pageSize}`,
    {
      ...ps,
    },
    callback
  );
};
const getAllocated = (params: IQueryParam, callback?: (data: any) => void) => {
  const { page = 0, pageSize = 15, ...ps } = params;
  return handlePost(
    `Apartment/queryAssignment?page=${page + 1}&pageSize=${pageSize}`,
    {
      ...ps,
    },
    callback
  );
};
const getById = (id: string, callback?: (data: any) => void) => {
  return handleGet(`Apartment/${id}`, null, callback);
};
const getNotes = (id: string, callback?: (data: any) => void) => {
  return handleGet(`Apartment/notes/${id}`, null, callback);
};
const add = (params: IApartmentItem, callback?: (data: any) => void) => {
  return handlePost(
    `Apartment`,
    {
      ...params,
    },
    callback
  );
};
const update = (params: any, callback?: (data: any) => void) => {
  return handlePut(
    `Apartment`,
    params.apartmentId,
    {
      ...params,
    },
    callback
  );
};
const archive = (params: string[], callback?: (data: any) => void) => {
  return handlePutWithKey(`Apartment/archive`, params, callback);
};
const archiveAll = (callback?: (data: any) => void) => {
  return handlePost(`Apartment/archiveAll`, null, callback);
};
const restore = (params: string[], callback?: (data: any) => void) => {
  return handlePutWithKey(`Apartment/restore`, params, callback);
};
const restoreAll = (callback?: (data: any) => void) => {
  return handlePost(`Apartment/restoreAll`, null, callback);
};
const del = (id: string, callback?: (data: any) => void) => {
  return handleDelete(`Apartment`, id, callback);
};
const dels = (
  params: string[],
  callback?: (data: any) => void
) => {
  return handleDeletes(`Apartment/deletes`, params, callback);
};
const deleteAll = (
  params: { archived: number },
  callback?: (data: any) => void
) => {
  return handlePost(`Apartment/deleteAll`, params, callback);
};
const getSummary = (params: IQueryParam, callback?: (data: any) => void) => {
  return handlePost(
    `Apartment/getSummary`,
    {
      ...params,
    },
    callback
  );
};
const assigment = (params: { ids: string[], assignee: string }, callback?: (data: any) => void) => {
  return handlePost(
    `Apartment/assigment`,
    params,
    callback
  );
};
const getAssigment = (id: string, callback?: (data: any) => void) => {
  return handlePost(
    `Apartment/getAssignment?id=${id}`,
    null,
    callback
  );
};

const checkTelephone = (params: { apartmentId: string, phones: string[] }, callback?: (data: any) => void) => {
  return handlePost(
    `Apartment/checkTelephone`,
    params,
    callback
  );
};


export {
  get,
  getAll,
  getPartner,
  getExpired,
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
  checkTelephone,
  getCombo,
  getAllocated,
};