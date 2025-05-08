import { axiosClient } from "utils/axios";

type TParams = object | null | object[] | boolean;
const handleGetPost = (
  route: string,
  params: TParams,
  callback?: (data: any) => void
) => {
  return axiosClient
    .post(`${route}`, params)
    .then((res) => {
      callback?.(res);
      return res;
    })
    .catch((err) => {
      callback?.(err);
      return err;
    });
};

const handleGet = (
  route: string,
  params: TParams,
  callback?: (data: any) => void
) => {
  return axiosClient
    .get(`${route}`, { params })
    .then((res) => {
      callback?.(res);
      return res;
    })
    .catch((err) => {
      callback?.(err);
      return err;
    });
};

const handlePost = (
  route: string,
  params: TParams,
  callback?: (data: any) => void,
) => {
  return axiosClient
    .post(`${route}`, params)
    .then((res) => {
      callback?.(res);
      return res;
    })
    .catch((err) => {
      callback?.(err);
      return err;
    });
};
const formPost = (
  route: string,
  params: FormData,
  callback?: (data: any) => void
) => {
  return axiosClient
    .post(`${route}`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      callback?.(res);
      return res;
    })
    .catch((err) => {
      callback?.(err);
      return err;
    });
};

const handlePut = (
  route: string,
  key: string,
  params: TParams,
  callback?: (data: any) => void
) => {
  return axiosClient
    .put(`${route}/${key}`, params)
    .then((res) => {
      callback?.(res);
      return res;
    })
    .catch((err) => {
      callback?.(err);
      return err;
    });
};
const handlePutWithKey = (
  route: string,
  params: TParams,
  callback?: (data: any) => void
) => {
  return axiosClient
    .put(`${route}`, params)
    .then((res) => {
      callback?.(res);
      return res;
    })
    .catch((err) => {
      callback?.(err);
      return err;
    });
};
const handleDelete = (
  route: string,
  key: string,
  callback?: (data: any) => void
) => {
  return axiosClient
    .delete(`${route}/${key}`)
    .then((res) => {
      callback?.(res);
      return res;
    })
    .catch((err) => {
      callback?.(err);
      return err;
    });
};
const handleDeletes = (
  route: string,
  params: TParams,
  callback?: (data: any) => void
) => {
  return axiosClient
    .post(`${route}`, params)
    .then((res) => {
      callback?.(res);
      return res;
    })
    .catch((err) => {
      callback?.(err);
      return err;
    });
};

const handleGetData = (
  route: string,
  params: TParams,
  callback?: (data: any) => void
) => {
  return axiosClient
    .get(`${route}`, { params })
    .then((res) => {
      callback?.(res.data);
      return res.data;
    })
    .catch((err) => {
      callback?.(err);
      return err;
    });
};

// export { handleGetPost, handleGet, handlePost, handlePut, authPost };
export {
  handleGetPost,
  handleGet,
  handleGetData,
  handlePost,
  handlePut,
  handlePutWithKey,
  handleDelete,
  handleDeletes,
  formPost,
};
