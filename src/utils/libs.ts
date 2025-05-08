import {
  IAction,
  IModeForm,
  IQueryParam,
  ITbarButton,
  IFilterItem,
} from "types";
import dayjs from "dayjs";
import { GridApi } from "@mui/x-data-grid";
// import { emptyDate, emptyGuid } from "./constants";

function toCamelCase(key: string, value: any) {
  if (value && typeof value === "object") {
    for (const k in value) {
      if (/^[A-Z]/.test(k) && Object.hasOwnProperty.call(value, k)) {
        value[k.charAt(0).toLowerCase() + k.substring(1)] = value[k];
        delete value[k];
      }
    }
  }
  return value;
}
export const toTitleCase = (str: string): string => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
export const parseJSON = (data: string, out: any = null) => {
  try {
    const value = JSON.parse(data, toCamelCase);
    return value;
  } catch (error) {
    return out;
  }
};

export const debounce = (func: any, timeout = 300) => {
  let timer: any;
  return function (...args: any) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      func.apply(debounce, args);
    }, timeout);
  };
};

export const findItemInArray = (array: any[], value: any, key = "key") => {
  return array.find((item) =>
    typeof item === "object" ? item[key] === value : item === value
  );
};

export const findItemsInArray = (array: any[], value: any, key = "key") => {
  if (Array.isArray(value))
    return array.filter((item) =>
      typeof item === "object"
        ? value.indexOf(item[key]) !== -1
        : value.indexOf(item) !== -1
    );
  return array.filter((item) =>
    typeof item === "object" ? item[key] === value : item === value
  );
};

export const getButtonsByAction = (
  buttons: (IAction | ITbarButton)[],
  action: IAction
) => {
  const btns: (IAction | ITbarButton)[] = [];
  switch (action) {
    case IAction.NEW:
    case IAction.COPY:
    case IAction.EDIT:
      btns.push(
        ...findItemsInArray(buttons, [
          IAction.SAVE,
          IAction.CANCEL,
          IAction.MORE,
        ])
      );

      break;
    case IAction.CANCEL:
      btns.push(
        ...findItemsInArray(buttons, [
          IAction.NEW,
          IAction.IMPORT,
          IAction.EXPORT,
        ])
      );
      break;
    case IAction.CANCELVIEW:
      btns.push(...findItemsInArray(buttons, [IAction.NEW]));
      break;
    case IAction.LIST:
      btns.push(
        ...findItemsInArray(buttons, [
          IAction.NEW,
          IAction.IMPORT,
          IAction.EXPORT,
        ])
      );
      break;
    case IAction.VIEW:
      btns.push(
        ...findItemsInArray(buttons, [
          IAction.NEW,
          IAction.EDIT,
          IAction.DELETE,
          IAction.COPY,
          IAction.PRINT,
          IAction.MORE,
        ])
      );
      break;
  }
  return btns;
};

export const getModeForm = (action: IAction) => {
  switch (action) {
    case IAction.NEW:
    case IAction.COPY:
    case IAction.EDIT:
    case IAction.CANCELVIEW:
      return IModeForm.FORM;
    case IAction.LIST:
    case IAction.CANCEL:
      return IModeForm.LIST;
    default:
      return IModeForm.VIEW;
  }
};

export const getDefaultGridHeight = () => window.innerHeight - 129;

export const getDefaultPageSize = (height: number) => Math.floor(height / 40);

export const convertYMDtoSync = (date: Date | string, hasTime?: boolean) => {
  if (!date) return "1911-01-01";
  const d = dayjs(date);
  if (d.format("YYYY-MM-DD") === "1911-01-01") return "1911-01-01";
  if (hasTime) {
    // d.subtract(7, 'hour');
    return d.subtract(7, 'hour').format("YYYY-MM-DDTHH:mm:ss");
  }
  else return d.format("YYYY-MM-DD");
};

export const convertDMY = (date: Date | string | null | undefined) => {
  if (!date) return "";
  const d = dayjs(date);
  if (d.format("YYYY-MM-DD") === "1911-01-01") return "";
  return d.format("DD/MM/YYYY");
};

// export const convertDMY1 = (date: Date | string) => {
//   if (!date) return "";

//   const d = dayjs(date);
//   if (d.format("YYYY-MM-DD") === "1911-01-01") return "";
//   return d.format("DD MMM YYYY");
// };

// export const convertYMD = (date: Date | string) => {
//   if (!date) return "";
//   const d = dayjs(date);
//   if (d.format("YYYY-MM-DD") === "1911-01-01") return "";
//   return d.format("YYYY-MM-DD");
// };

export const date2Srting = (date: Date | string, isDateTime?: boolean) => {
  if (!date) return "";

  const d = dayjs(date);

  if (d.format("YYYY-MM-DD") === "1911-01-01") return "";

  if (isDateTime) return d.format("DD/MM/YYYY HH:mm");

  return d.format("DD/MM/YYYY");
};


// export const fotmatNumber2 = (
//   value: number,
//   decimalPlace = 0,
//   locale = "en-Us"
// ) => {
//   return value != 0
//     ? value.toLocaleString(locale, {
//       minimumFractionDigits: decimalPlace,
//       maximumFractionDigits: decimalPlace,
//     })
//     : "0";
// };

export const number2String = (
  value: number,
  decimalPlace = 0,
  locale = "en-Us"
) => {
  value = value ?? 0;
  return value >= 0
    ? value.toLocaleString(locale, {
      maximumFractionDigits: decimalPlace,
    })
    : `(${Math.abs(value).toLocaleString(locale, {
      maximumFractionDigits: decimalPlace,
    })})`;
};

// export const number2StringAbs = (
//   value: number,
//   decimalPlace = 0,
//   locale = "en-Us"
// ) => {
//   value = value ?? 0;
//   return Math.abs(value).toLocaleString(locale, {
//     maximumFractionDigits: decimalPlace,
//   });
// };

// export const date2String = (
//   value: Date | string | undefined | null,
//   options: {
//     year?: "numeric" | "2-digit";
//     month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
//     day?: "numeric" | "2-digit";
//   } = {
//       year: "numeric",
//       month: "short",
//       day: "2-digit",
//     },
//   locale = "en-Us"
// ) => {
//   if (!value) return "";
//   const date = dayjs(value);
//   return date.isValid()
//     ? date.toDate().toLocaleString(locale, options)
//     : "";
// };

// export const getRows = (api: React.MutableRefObject<GridApiPro>) => {
//   if (!api.current.getAllRowIds || api.current.getAllRowIds().length === 0)
//     return [];
//   return api.current
//     .getAllRowIds()
//     .map((id) => ({ ...api.current.getRow(id), id }));
// };

export const updateRow = (
  api: React.MutableRefObject<GridApi>,
  rowId: any,
  data: any
) => {
  //
  const newRows = api.current.getAllRowIds().map((id: any) => {
    const row = api.current.getRow(id);
    if (id === rowId) return { ...row, ...data };
    return { ...row };
  });
  api.current.updateRows(newRows);
};

export const checkBooleanByYN = (str: string | boolean | undefined) => {
  return (
    (typeof str === "string" && str === "Y") ||
    (typeof str === "boolean" && str)
  );
};

export const parseYNByBoolean = (t: boolean): string => {
  return t ? "Y" : "N";
};

export const loadRecord = <T extends object>(
  record: T,
  form: any,
  keyField: string,
  options: {
    dirties?: string[];
    guidFields?: string[];
  } = { dirties: [], guidFields: [] }
) => {
  const keys = Object.keys(record);

  keys.forEach((key) => {
    const field = key as keyof T;
    if (record[keyField as keyof T]) {
      form.resetField(field);
      if (
        field === keyField ||
        (options?.dirties &&
          options?.dirties.length > 0 &&
          options?.dirties.includes(key))
      ) {
        form.setValue(field, record[field], { shouldDirty: true });
      } else {
        form.setValue(field, record[field], { shouldDirty: false });
      }
    } else {
      form.setValue(field, record[field], { shouldDirty: true });
    }
  });
  options.guidFields &&
    options.guidFields.forEach((field) => {
      keys.indexOf(field) === -1 && form.setValue(field, null);
    });
};

export const getParametersByKey = (params: any, key: any): IQueryParam => ({
  filter: params[key].filter,
  searchString: params[key].searchString,
  sort: params[key].sort,
  page: params[key].pagination?.page,
  pageSize: params[key].pagination?.pageSize,
});

// export const transform2Submit = (
//   key,
//   value,
//   guidFields?: string[],
//   dateFields?: string[]
// ) => {
//   if (guidFields?.includes(key)) {
//     return value ? value : emptyGuid;
//   } else if (dateFields?.includes(key)) {
//     return value ? convertYMDtoSync(value) : emptyDate;
//   }
//   return value;
// };

// export const guidEmpty = (v) => {
//   v === emptyGuid;
// };

// export const convertToBaseAmt = (
//   value: number | undefined,
//   rate: number,
//   decimalPlace: number
// ) => {
//   const v = value ? value : 0;
//   return parseFloat((v * rate).toFixed(decimalPlace));
// };

// export const roundNumber = (
//   value: number | undefined,
//   decimalPlace: number
// ) => {
//   const v = value ? value : 0;
//   return parseFloat(v.toFixed(decimalPlace));
// };

// export const formatBytes = (bytes, decimals = 2) => {
//   if (bytes === 0) return "0 Bytes";

//   const k = 1024;
//   const dm = decimals < 0 ? 0 : decimals;
//   const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

//   const i = Math.floor(Math.log(bytes) / Math.log(k));

//   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
// };

// export const convertBase64ToFile = (base64String, fileName) => {
//   const bstr = atob(base64String);
//   let n = bstr.length;
//   const uint8Array = new Uint8Array(n);
//   while (n--) {
//     uint8Array[n] = bstr.charCodeAt(n);
//   }
//   const file = new File([uint8Array], fileName, { type: base64String });
//   return file;
// };

// export const allowFieldToAddLog = (
//   key: string,
//   values,
//   pKey: string
//   // logFields: string[]
// ) => {
//   // if (!logFields.includes(key)) return false;
//   if (values[pKey]) return true;

//   const v = values[key];

//   if (isNaN(Date.parse(v))) {
//     return v !== emptyGuid && v !== undefined && v !== null && v !== ""
//       ? true
//       : false;
//   } else {
//     return v !== "1911-01-01" ? true : false;
//   }
// };

// export const createLogObject = (
//   data,
//   key: string,
//   logFields: string[],
//   details?: { name: string; key: string }[]
//   // dateFields?: string[]
// ) => {
//   const contentLog = {};
//   logFields.forEach((f) => {
//     if (data[f]) {
//       if (f !== key) {
//         const item = details?.find((v) => v.name === f);
//         if (item) {
//           const dets: any[] = [];
//           data[f].forEach((d) => {
//             const det = {};
//             Object.keys(d).forEach((k1) => {
//               if (item.key !== k1 && logFields.indexOf(k1) !== -1) {
//                 if (allowFieldToAddLog(k1, d, item.key)) det[k1] = d[k1];
//               }
//             });
//             dets.push(det);
//           });
//           contentLog[f] = dets;
//         } else {
//           if (allowFieldToAddLog(f, data, key)) {
//             let c = data[f];
//             if (c === emptyGuid) c = "";
//             contentLog[f] = c;
//           }
//         }
//       }
//     }
//   });
//   return contentLog;
// };

// export const setNameOfLog = (obj, propertyName: string, dataArray: any[]) => {
//   if (obj[propertyName] && Array.isArray(dataArray)) {
//     const foundItem = dataArray.find((item) => item.code === obj[propertyName]);
//     if (foundItem) {
//       obj[propertyName] = foundItem.name;
//     }
//   }
// };
export const filter2Data = (filter: any[]) => {
  const data = filter.reduce((acc, item) => {
    if (item.method === "in") {
      acc[item.property] = item.value.split(";");
    } else if (item.method === "eq") {
      acc[item.property] = item.value;
    }
    return acc;
  }, {});
  return data;
};


export const data2Filter = (
  data: any,
  options: {
    dateFields?: string[];
    numberFields?: string[];
    arrFields?: string[];
  }
) => {
  const fs: IFilterItem[] = [];
  const o = { ...data };
  options.dateFields &&
    options.dateFields.forEach((key) => {
      let method = "eq";
      let value: string | null = null;
      if (o[`${key}From`] && o[`${key}To`]) {
        value = `${convertYMDtoSync(o[`${key}From`])};${convertYMDtoSync(
          o[`${key}To`]
        )}`;
        method = "bet";
      }
      else if (o[`${key}From`]) {
        value = convertYMDtoSync(o[`${key}From`]);
      }
      if (value) {
        fs.push({ property: key, value, method });
      }
      delete o[`${key}From`];
      delete o[`${key}To`];
    });

  options.numberFields &&
    options.numberFields.forEach((key) => {
      let method = "eq";
      let value: string | null = null;
      if (o[`${key}From`] && o[`${key}To`]) {
        value = `${o[`${key}From`].toString()};${o[`${key}To`].toString()}`;
        method = "bet";
      } else if (o[`${key}From`]) {
        value = o[`${key}From`].toString();
      } else if (o[`${key}To`]) {
        value = o[`${key}To`].toString();
      }
      if (value) {
        fs.push({ property: key, value, method });
      }
      delete o[`${key}From`];
      delete o[`${key}To`];
    });

  options.arrFields &&
    options.arrFields.forEach((key) => {
      if (o[key]) {
        const method = "in";
        const value = [...(o[key] ?? [])];
        fs.push({ property: key, value, method });
      }
      delete o[key];
    });

  Object.keys(o).forEach((key) => {
    if (o[key]) {
      fs.push({ property: key, value: o[key], method: 'like' });
    }
  });
  return fs;
};

// export const getAvatarColor = () => {
//   const colors = [
//     "#ff5252", //red
//     "#508D43", //green
//     "#00b4d8", //blue
//     "#7554AE", //purple
//     "brown",
//     "#DAB600", // "yellow",
//   ];
//   const randomIndex = Math.floor(Math.random() * colors.length);
//   return colors[randomIndex];
// };

// // export const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
// //   return new Promise((resolve, reject) => {
// //     if (navigator.geolocation) {
// //       navigator.geolocation.getCurrentPosition(
// //         (position) => {
// //           const { latitude, longitude } = position.coords;
// //           resolve({ latitude, longitude });
// //         },
// //         (error) => {
// //           reject(error);
// //         }
// //       );
// //     } else {
// //       reject(new Error('Geolocation is not supported by this browser.'));
// //     }
// //   });
// // };

// // export const getCountryCode = async (setState: React.Dispatch<React.SetStateAction<any>>) => {
// //   try {
// //     const { latitude, longitude } = await getCurrentLocation();
// //     const response = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
// //     const countryCode = response.data.countryCode;
// //     setState({ country_code: countryCode ? countryCode.toUpperCase() : 'US' });
// //   } catch (error) {
// //     console.error('Error fetching country code:', error);
// //     setState({ country_code: 'VN' }); // Default to 'US' in case of an error
// //   }
// // };

export const getMessage = (type: IAction, text: string) => {
  let msg = "";
  switch (type) {
    case IAction.NEW:
      msg = `${text} đã được thêm thành công`;
      break;
    case IAction.EDIT:
      msg = `${text} đã được cập nhật thành công`;
      break;
    case IAction.DELETE:
      msg = `${text} đã xóa thành công`;
      break;
  }
  return msg;
};

export const numberToShortWords = (value: number) => {
  if (!value || value < 1000000) {
    return "";
  }

  const units = ["", "triệu", "tỷ", "nghìn tỷ"];
  let unitIndex = -1;

  // Lặp để tìm đơn vị thích hợp (triệu, tỷ, ...)
  while (value >= 1000 && unitIndex < units.length - 1) {
    value /= 1000;
    unitIndex++;
  }

  // Làm tròn số đến 2 chữ số thập phân (nếu cần)
  const roundedNum = Math.round(value * 100) / 100;

  return `${roundedNum} ${units[unitIndex]}`;
}