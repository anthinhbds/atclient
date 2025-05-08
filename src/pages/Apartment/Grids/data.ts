import { IApartmentStatus, IFilterItem, IGridColDef, ISortItem } from "types";
import { numberToShortWords } from "utils";
import clsx from "clsx";
import dayjs from "dayjs";

export interface IGridFilter {
  searchString?: string;
  filter?: IFilterItem[] | null;
  pagination: {
    [T: string]: {
      page: number;
      pageSize: number;
    };
  };
  sort?: {
    [T: string]: ISortItem[] | null;
  };
}
export interface IFilters {
  [T: string]: {
    searchString?: string;
    filter?: IFilterItem[] | null;
    sort?: ISortItem[];
    pagination?: {
      page: number;
      pageSize: number;
    };
  };
}

export type IParameter = {
  searchString?: string | null;
  filter?: IFilterItem[] | null;
  sort?: any;
  page: number;
  pageSize: number;
};

export const AllColumns = () => {
  return [
    { field: "owner", headerName: "Người liên hệ", width: 150, },
    {
      field: "telephone", headerName: "Số điện thoại", width: 105, cellClassName: (params: any) => {
        const { row } = params;
        if (row.priority === true || row.priority === 'Y') {
          return clsx("cellColor", {
            priority: true,
          });
        }
        return clsx("cellColor", {
          main: true,
        });
      },
      valueGetter: ((value: any, row: any) => {
        let msg = "";
        if (row.telephone) msg += row.telephone;
        if (row.telephone2) msg += " - " + row.telephone2;
        if (row.telephone3) msg += " - " + row.telephone3;
        if (row.telephone4) msg += " - " + row.telephone4;
        if (row.telephone5) msg += " - " + row.telephone5;
        return msg;
      }),
    },
    { field: "project.projectname", headerName: "Tên dự án", width: 240 },
    {
      field: "userId", headerName: "Nhân viên", width: 100, valueGetter: ((v: any) => {
        if (!v) return null;

        return v === 'DTD' ? ' Diễm' : v === 'NNT' ? 'Thi' : v === 'PTM' ? 'Mỹ' : 'Công ty';
      })
    },
    { field: "apartmentno", headerName: "Mã căn", width: 95, },
    // { field: "demand", headerName: "Nhu cầu", width: 120, translateContent: true, prexFixTranslate: "MAP.src_demand" },
    // { field: "status", headerName: "Tình trạng", width: 95, translateContent: true, prexFixTranslate: "MAP.src_status" },
    { field: "area", headerName: "Diện tích", width: 75, },
    { field: "bedroom", headerName: "Phòng ngủ", width: 88, },
    {
      field: "salesprice", headerName: "Giá bán", width: 80, valueFormatter: ((v: any) => {
        if (!v) return null;

        return numberToShortWords(v);
      })
    },
    {
      field: "rentprice", headerName: "Giá cho thuê", width: 98, valueFormatter: ((v: any) => {
        if (!v) return null;

        return numberToShortWords(v);
      })
    },
    { field: "notes", headerName: "Ghi chú", flex: 1 },
    { field: "lastUpdate", headerName: "Ngày cập nhật", type: 'date', width: 115 },
  ] as IGridColDef[];
};


export const MyApartmentColumns = () => {
  return [
    {
      field: "owner", headerName: "Người liên hệ", width: 104
    },
    {
      field: "telephone",
      headerName: "Số điện thoại",
      width: 105,
      cellClassName: (params: any) => {
        const { row } = params;
        if (row.priority === true || row.priority === 'Y') {
          return clsx("cellColor", {
            priority: true,
          });
        }
        return clsx("cellColor", {
          main: true,
        });
      }
    },
    { field: "project.projectname", headerName: "Tên dự án", width: 180 },
    { field: "apartmentno", headerName: "Mã căn", width: 95, },
    { field: "demand", headerName: "Nhu cầu", width: 117, translateContent: true, prexFixTranslate: "MAP.src_demand" },
    { field: "area", headerName: "Diện tích", width: 75, },
    { field: "bedroom", headerName: "Phòng ngủ", width: 88, },
    {
      field: "salesprice", headerName: "Giá bán", width: 80, valueFormatter: ((v: any) => {
        if (!v) return null;

        return numberToShortWords(v);
      })
    },
    {
      field: "rentprice", headerName: "Giá cho thuê", width: 98, valueFormatter: ((v: any) => {
        if (!v) return null;

        return numberToShortWords(v);
      })
    },
    { field: "notes", headerName: "Ghi chú", flex: 1 },
    {
      field: "status", headerName: "Tình trạng", width: 88, translateContent: true, prexFixTranslate: "MAP.src_status", cellClassName: (params: any) => {
        const { row } = params;
        if (row.status === IApartmentStatus.DB) {

          return clsx("cellColor", {
            statusDB: true,
          });
        }
        return clsx("cellColor", {
          main: true,
        });
      },
    },
    { field: "lastUpdate", headerName: "Ngày cập nhật", type: 'date', width: 115 },
  ] as IGridColDef[];
};

export const ExpiredColumns = () => {
  return [
    {
      field: "lastUpdate", headerName: "Ngày cập nhật cuối", width: 150, valueFormatter: ((v: any) => {
        if (!v) return null;

        return dayjs(v).format("DD/MM/YYYY");
      })
    },
    {
      field: "owner", headerName: "Người liên hệ", width: 150
    },
    {
      field: "telephone", headerName: "Số điện thoại", width: 105, cellClassName: (params: any) => {
        const { row } = params;
        if (row.priority === true || row.priority === 'Y') {
          return clsx("cellColor", {
            priority: true,
          });
        }
        return clsx("cellColor", {
          main: true,
        });
      },
    },
    { field: "project.projectname", headerName: "Tên dự án", width: 240 },
    { field: "apartmentno", headerName: "Mã căn", width: 95, },
    { field: "demand", headerName: "Nhu cầu", width: 120, translateContent: true, prexFixTranslate: "MAP.src_demand" },
    {
      field: "status", headerName: "Tình trạng", width: 95, translateContent: true, prexFixTranslate: "MAP.src_status", cellClassName: (params: any) => {
        const { row } = params;
        if (row.status === IApartmentStatus.DB) {

          return clsx("cellColor", {
            statusDB: true,
          });
        }
        return clsx("cellColor", {
          main: true,
        });
      },
    },
    { field: "area", headerName: "Diện tích", width: 75, },
    { field: "bedroom", headerName: "Phòng ngủ", width: 88, },
    {
      field: "salesprice", headerName: "Giá bán", width: 80, valueFormatter: ((v: any) => {
        if (!v) return null;

        return numberToShortWords(v);
      })
    },
    {
      field: "rentprice", headerName: "Giá cho thuê", width: 98, valueFormatter: ((v: any) => {
        if (!v) return null;

        return numberToShortWords(v);
      })
    },
    { field: "notes", headerName: "Ghi chú", flex: 1 },
  ];
};

export const AssignmentColumns = () => {
  return [
    {
      field: "lastUpdate", headerName: "Ngày nhận", width: 150, valueFormatter: ((v: any) => {
        if (!v) return null;

        return dayjs(v).format("DD/MM/YYYY");
      })
    },
    {
      field: "owner", headerName: "Người liên hệ", width: 150
    },
    {
      field: "telephone", headerName: "Số điện thoại", width: 105, cellClassName: (params: any) => {
        const { row } = params;
        if (row.priority === true || row.priority === 'Y') {
          return clsx("cellColor", {
            priority: true,
          });
        }
        return clsx("cellColor", {
          main: true,
        });
      },
    },
    { field: "project.projectname", headerName: "Tên dự án", width: 240 },
    { field: "apartmentno", headerName: "Mã căn", width: 95, },
    { field: "demand", headerName: "Nhu cầu", width: 120, translateContent: true, prexFixTranslate: "MAP.src_demand" },
    {
      field: "status", headerName: "Tình trạng", width: 95, translateContent: true, prexFixTranslate: "MAP.src_status", cellClassName: (params: any) => {
        const { row } = params;
        if (row.status === IApartmentStatus.DB) {

          return clsx("cellColor", {
            statusDB: true,
          });
        }
        return clsx("cellColor", {
          main: true,
        });
      },
    },
    { field: "area", headerName: "Diện tích", width: 75, },
    { field: "bedroom", headerName: "Phòng ngủ", width: 88, },
    { field: "notes", headerName: "Ghi chú", flex: 1 },
  ];
};

export const PartnerColumns = () => {
  return [
    {
      field: "partnername", headerName: "Người hợp tác", width: 150
    },
    {
      field: "partnertelephone", headerName: "Số điện thoại", width: 105, cellClassName: (params: any) => {
        const { row } = params;
        if (row.priority === true || row.priority === 'Y') {
          return clsx("cellColor", {
            priority: true,
          });
        }
        return clsx("cellColor", {
          main: true,
        });
      },
    },
    { field: "project.projectname", headerName: "Tên dự án", width: 240 },
    { field: "demand", headerName: "Nhu cầu", width: 120, translateContent: true, prexFixTranslate: "MAP.src_demand" },
    {
      field: "status", headerName: "Tình trạng", width: 95, translateContent: true, prexFixTranslate: "MAP.src_status", cellClassName: (params: any) => {
        const { row } = params;
        if (row.status === IApartmentStatus.DB) {

          return clsx("cellColor", {
            statusDB: true,
          });
        }
        return clsx("cellColor", {
          main: true,
        });
      },
    },
    { field: "area", headerName: "Diện tích", width: 75, },
    { field: "bedroom", headerName: "Phòng ngủ", width: 88, },
    {
      field: "salesprice", headerName: "Giá bán", width: 80, valueFormatter: ((v: any) => {
        if (!v) return null;

        return numberToShortWords(v);
      })
    },
    {
      field: "rentprice", headerName: "Giá cho thuê", width: 98, valueFormatter: ((v: any) => {
        if (!v) return null;

        return numberToShortWords(v);
      })
    },
    { field: "notes", headerName: "Ghi chú", flex: 1 },
    { field: "lastUpdate", headerName: "Ngày cập nhật", type: 'date', width: 115 },
  ] as IGridColDef[];
};

export enum ITab {
  ALL = "ALL",
  MYAPARTMENT = "MYAPARTMENT",
  PARTNER = "PARTNER",
  EXPIRED = "EXPIRED",
  ASSIGNMENT = "ASSIGNMENT",
}

export enum IArchived {
  ACTIVE = "0",
  ARCHIVED = "1",
}

type IFixedFilter = {
  [key in ITab]: IFilterItem[];
};
export const fixedFilters: IFixedFilter = {
  [ITab.ALL]: [],
  [ITab.MYAPARTMENT]: [
    // { property: "ispartner", method: "ne", value: "Y" },
  ],
  [ITab.PARTNER]: [
    // { property: "ispartner", method: "eq", value: "Y" },
  ],
  [ITab.EXPIRED]: [],
  [ITab.ASSIGNMENT]: []
};


export interface IFormValues {
  id?: string;
  demand?: string;
  projectId?: string[];
  bedroom?: number[];
  telephone?: string;
  apartmentno?: string;
  notes?: string;
  furniture?: string;
  userId?: string;
  'project.districtId'?: string;
  areaFrom?: number;
  areaTo?: number;
  priceFrom?: number;
  priceTo?: number;
}
export const initialAdvanceFilter: IFormValues = {
  id: "",
  demand: "",
  projectId: [],
  bedroom: [],
  telephone: "",
  apartmentno: "",
  notes: "",
  furniture: "",
  userId: "",
  'project.districtId': "",
  areaFrom: undefined,
  areaTo: undefined,
  priceFrom: undefined,
  priceTo: undefined,
};