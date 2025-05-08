import { IQueryParam } from "types";
import {
  handlePost,
  // handleDeletes,
  // handlePutWithKey,
  // handlePut,
  // handleDelete,
  // handleGet,
} from "../utils";

const getDistrict = (params: IQueryParam, callback?: (data: any) => void) => {
  const { page = 0, pageSize = 15, ...ps } = params;
  return handlePost(
    `Address/district?page=${page + 1}&pageSize=${pageSize}`,
    {
      ...ps,
    },
    callback
  );
};

export {
  getDistrict,
};