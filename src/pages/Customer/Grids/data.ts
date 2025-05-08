import clsx from "clsx";
import { IFilterItem, IGridColDef, ISortItem } from "types";

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
    { field: "customername", headerName: "Tên khách hàng", width: 150, },
    {
      field: "telephone", headerName: "Số điện thoại", width: 105,
      valueGetter: ((value: any, row: any) => {
        let msg = "";
        if (row.telephone) msg += row.telephone;
        if (row.telephone2) msg += " - " + row.telephone2;
        if (row.telephone3) msg += " - " + row.telephone3;
        if (row.telephone4) msg += " - " + row.telephone4;
        return msg;
      }),
    },
    {
      field: "userId", headerName: "Nhân viên", width: 100, valueGetter: ((v: any) => {
        if (!v) return null;

        return v === 'DTD' ? 'Diễm' : v === 'NNT' ? 'Thi' : v === 'PTM' ? 'Mỹ' : 'Công ty';
      })
    },
    { field: "notes", headerName: "Ghi chú", flex: 1 },
    { field: "lastUpdate", headerName: "Ngày cập nhật", type: 'date', width: 115 },
  ] as IGridColDef[];
};


export const MyCustomerColumns = () => {
  return [
    { field: "customername", headerName: "Tên khách hàng", width: 150, },
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
      }
    },
    { field: "notes", headerName: "Ghi chú", flex: 1 },
    { field: "lastUpdate", headerName: "Ngày cập nhật", type: 'date', width: 115 },
  ] as IGridColDef[];
};

export enum ITab {
  ALL = "ALL",
  MYCUSTOMER = "MYCUSTOMER",
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
  [ITab.MYCUSTOMER]: [],
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