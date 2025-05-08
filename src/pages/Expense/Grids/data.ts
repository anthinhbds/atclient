import clsx from "clsx";
import { IFilterItem, ISortItem, ITransactionStatus } from "types";

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
    { field: "transno", headerName: "Số phiếu thu", width: 115, },
    { field: "transdate", headerName: "Ngày", type: 'date' },
    { field: "transtype", headerName: "Loại phiếu", translateContent: true, prexFixTranslate: "TRANS.src_transtype", width: 235, },
    // { field: "objectId", headerName: "Căn hộ", width: 115 },
    {
      field: "status", headerName: "Tình trạng", width: 125, translateContent: true, prexFixTranslate: "TRANS.src_status", cellClassName: (params: any) => {
        const { row } = params;
        if (row.status === ITransactionStatus.P) {

          return clsx("cellColor", {
            statusTransP: true,
          });
        }
        return clsx("cellColor", {
          main: true,
        });
      },
    },
    { field: "description", headerName: "Nội dung", flex: 1 },
  ];
};


export const PMGColumns = () => {
  return [
    { field: "transno", headerName: "Số phiếu chi", width: 115, },
    { field: "transdate", headerName: "Ngày", type: 'date' },
    { field: "employee.name", headerName: "Nhân viên", width: 175, },
    {
      field: "status", headerName: "Tình trạng", width: 125, translateContent: true, prexFixTranslate: "TRANS.src_status", cellClassName: (params: any) => {
        const { row } = params;
        if (row.status === ITransactionStatus.P) {

          return clsx("cellColor", {
            statusTransP: true,
          });
        }
        return clsx("cellColor", {
          main: true,
        });
      },
    },
    { field: "description", headerName: "Nội dung", flex: 1 },
  ];
};

export enum ITab {
  // ALL = "ALL",
  CTL = "CTL",
  CTH = "CTH",
  CTD = "CTD",
}

export enum IArchived {
  ACTIVE = "0",
  ARCHIVED = "1",
}

type IFixedFilter = {
  [key in ITab]: IFilterItem[];
};
export const fixedFilters: IFixedFilter = {
  // [ITab.ALL]: [],
  [ITab.CTL]: [{ property: "transtype", method: "eq", value: "CTL" },],
  [ITab.CTH]: [{ property: "transtype", method: "eq", value: "CTH" },],
  [ITab.CTD]: [{ property: "transtype", method: "in", value: ["CTD", "CK"] },],
};


export interface IFormValues {
  id?: string;
  demand?: string;
  project?: string;
  telephone?: string;
  apartmentno?: string;
  notes?: string;
  areaFrom?: number;
  areaTo?: number;
  priceFrom?: number;
  priceTo?: number;
}
export const initialAdvanceFilter: IFormValues = {
  id: "",
  demand: "",
  project: "",
  telephone: "",
  apartmentno: "",
  notes: "",
  areaFrom: undefined,
  areaTo: undefined,
  priceFrom: undefined,
  priceTo: undefined,
};