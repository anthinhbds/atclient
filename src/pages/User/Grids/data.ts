import { IFilterItem, ISortItem } from "types";
// import clsx from "clsx";

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
    { field: "userId", headerName: "Id", width: 150 },
    { field: "name", headerName: "Tên", flex: 1 },
  ];
};
export const ArchivedColumns = () => {
  return [
    { field: "userId", headerName: "Id", width: 150 },
    { field: "name", headerName: "Tên", flex: 1 },
  ];
};

export enum ITab {
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
}

export enum IArchived {
  ACTIVE = "0",
  ARCHIVED = "1",
}

type IFixedFilter = {
  [key in ITab]: IFilterItem[];
};
export const fixedFilters: IFixedFilter = {
  [ITab.ACTIVE]: [
    { property: "archived", method: "eq", value: IArchived.ACTIVE },
  ],
  [ITab.ARCHIVED]: [
    { property: "archived", method: "eq", value: IArchived.ARCHIVED },
  ],
};
