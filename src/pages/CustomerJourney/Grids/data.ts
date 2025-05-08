import { IFilterItem, IGridColDef, ISortItem } from "types";
import clsx from "clsx";

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

export const ActiveColumns = () => {
  return [
    { field: "customer.customername", headerName: "Tên", width: 125 },
    { field: "customer.telephone", headerName: "Số điện thoại", width: 115 },
    {
      field: "status", headerName: "Tình trạng", width: 130, translateContent: true, prexFixTranslate: "CUS.src_status", cellClassName: (params: any) => {
        const { row } = params;
        if (row.status === 'DDK') {
          return clsx("cellColor", {
            blue: true,
          });
        }
        else if (row.status === 'HL' || row.status === 'BL' || row.status === 'F') {
          return clsx("cellColor", {
            statusDB: true,
          });
        }
        return clsx("cellColor", {
          main: true,
        });
      },
    },
    {
      field: "userId", headerName: "Nhân viên", width: 100, valueGetter: ((v: any) => {
        if (!v) return null;

        return v === 'DTD' ? ' Diễm' : v === 'NNT' ? 'Thi' : v === 'PTM' ? 'Mỹ' : 'Công ty';
      })
    },
    {
      field: "quality", headerName: "Tiềm năng", width: 100, translateContent: true, prexFixTranslate: "CUS.src_quality", cellClassName: (params: any) => {
        const { row } = params;
        if (row.quality === '01') {
          return clsx("cellColor", {
            priority: true,
          });
        }
        return clsx("cellColor", {
          main: true,
        });
      },
    },
    { field: "comments", headerName: "Ghi chú", flex: 1 },
  ] as IGridColDef[];
};
