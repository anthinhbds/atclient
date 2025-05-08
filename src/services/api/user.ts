import { IQueryParam, IUserSearchProfileItem, IUserItem, IChangePwd } from "types";
import {
  handleDeletes,
  // handlePutWithKey,
  handlePost,
  handlePut,
  handleDelete,
  handleGet,
} from "../utils";

const login = (params: { userId: string, password: string }, callback?: (data: any) => void) =>
  handlePost("Auth/Login", params, callback);

const logout = (refreshToken: string, callback?: (data: any) => void) =>
  handlePost(`Auth/Logout/${refreshToken}`, null, callback);

const getMeInfo = (refreshToken: string, callback?: (data: any) => void) => {
  return handleGet(`User/getMe/${refreshToken}`, null, callback);
};

const get = (params: IQueryParam, callback?: (data: any) => void) => {
  const { page = 0, pageSize = 15, ...ps } = params;
  return handlePost(
    `User/query?page=${page + 1}&pageSize=${pageSize}`,
    {
      ...ps,
    },
    callback
  );
};
const getById = (id: string, callback?: (data: any) => void) => {
  return handleGet(`User/${id}`, null, callback);
};
const add = (params: IUserItem, callback?: (data: any) => void) => {
  return handlePost(
    `User`,
    {
      ...params,
    },
    callback
  );
};
const update = (params: any, callback?: (data: any) => void) => {
  return handlePut(
    `User`,
    params.userId,
    {
      ...params,
    },
    callback
  );
};
const del = (id: string, callback?: (data: any) => void) => {
  return handleDelete(`User`, id, callback);
};
const dels = (
  params: string[],
  callback?: (data: any) => void
) => {
  return handleDeletes(`User/deletes`, params, callback);
};
const deleteAll = (
  params: { archived: number },
  callback?: (data: any) => void
) => {
  return handlePost(`User/deleteAll`, params, callback);
};
const getSummary = (params: IQueryParam, callback?: (data: any) => void) => {
  return handlePost(
    `User/getSummary`,
    {
      ...params,
    },
    callback
  );
};
const checkExistName = (params: any, callback?: (data: any) => void) => {
  return handlePost(
    `User/checkExistName`,
    {
      ...params,
    },
    callback
  );
};
const getSearchProfile = (params: IQueryParam, callback?: (data: any) => void) => {
  return handlePost(
    `User/searchProfile`,
    params,
    callback
  );
};
const checkExistSearchProfile = (params: any, callback?: (data: any) => void) => {
  return handlePost(
    "User/checkExistSearchProfile",
    {
      ...params,
    },
    callback
  );
};
const addSearchProfile = (params: IUserSearchProfileItem, callback?: (data: any) => void) => {
  return handlePost(
    `User/addSearchProfile`,
    params,
    callback
  );
};
const updateSearchProfile = (params: any, callback?: (data: any) => void) => {
  return handlePut(
    `User/updSearchProfile`,
    params.id,
    {
      ...params,
    },
    callback
  );
};
const delSearchProfile = (id: string, callback?: (data: any) => void) => {
  return handleDelete(`User/delSearchProfile`, id, callback);
};

const getCombo = (params: IQueryParam, callback?: (data: any) => void) => {
  const { page = 0, pageSize = 15, ...ps } = params;
  return handlePost(
    `User/getCombo?page=${page + 1}&pageSize=${pageSize}`,
    {
      ...ps,
    },
    callback
  );
};

const changePassword = (params: IChangePwd, callback?: (data: any) => void) => {
  return handlePost(
    `Auth/changePassword`,
    params,
    callback
  );
};

export {
  login,
  logout,
  get,
  getSummary,
  add,
  update,
  del,
  dels,
  deleteAll,
  checkExistName,
  getById,
  getMeInfo,
  getSearchProfile,
  addSearchProfile,
  updateSearchProfile,
  delSearchProfile,
  checkExistSearchProfile,
  getCombo,
  changePassword,
};