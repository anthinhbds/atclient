import {
  // handleDeletes,
  // handlePutWithKey,
  handlePost,
  // handlePut,
  // handleDelete,
  handleGet,
} from "../utils";

const getNotice = (callback?: (data: any) => void) => {
  return handleGet(`Notification`, null, callback);
}

const getBadgetCount = (callback?: (data: any) => void) => {
  return handleGet(`Notification/badgetCount`, null, callback);
}


const markRead = (id: string, callback?: (data: any) => void) => {
  return handlePost(`Notification/markRead/${id}`, null, callback);
}

export {
  getNotice,
  getBadgetCount,
  markRead,
};