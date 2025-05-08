import { IQueryParam, IUserItem } from "types";
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
    `CustomerJourney/query?page=${page + 1}&pageSize=${pageSize}`,
    {
      ...ps,
    },
    callback
  );
};
const getById = (id: string, callback?: (data: any) => void) => {
  return handleGet(`Project/${id}`, null, callback);
};
const getDetails = (id: string, callback?: (data: any) => void) => {
  return handleGet(`CustomerJourney/details/${id}`, null, callback);
};
const add = (params: IUserItem, callback?: (data: any) => void) => {
  return handlePost(
    `CustomerJourney`,
    {
      ...params,
    },
    callback
  );
};
const update = (params: any, callback?: (data: any) => void) => {
  return handlePut(
    `CustomerJourney`,
    params.customerId,
    {
      ...params,
    },
    callback
  );
};

const del = (id: string, callback?: (data: any) => void) => {
  return handleDelete(`CustomerJourney`, id, callback);
};
const dels = (
  params: string[],
  callback?: (data: any) => void
) => {
  return handleDeletes(`CustomerJourney/deletes`, params, callback);
};
const deleteAll = (
  params: { archived: number },
  callback?: (data: any) => void
) => {
  return handlePost(`CustomerJourney/deleteAll`, params, callback);
};

const getCustomer = (params: IQueryParam, callback?: (data: any) => void) => {
  const { page = 0, pageSize = 15, ...ps } = params;
  return handlePost(
    `CustomerJourney/queryCustomer?page=${page + 1}&pageSize=${pageSize}`,
    {
      ...ps,
    },
    callback
  );
};

export {
  get,
  add,
  update,
  del,
  dels,
  deleteAll,
  getById,
  getDetails,
  getCustomer,
};