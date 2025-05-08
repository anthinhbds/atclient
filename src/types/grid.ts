import { GridColDef } from "@mui/x-data-grid";

export interface IFilterItem {
  property: string;
  method: string;
  value: string | number | boolean | string[] | number[] | null | object;
  filterType?: string;
}

export interface ISortItem {
  property: string;
  direction: "asc" | "desc";
}
export type IQueryParam = IPagination &
  IEextendFilter & {
    filter?: IFilterItem[];
    sort?: ISortItem[];
    searchString?: string | null;
  };
export interface IPagination {
  page?: number;
  pageSize?: number;
}
export interface IEextendFilter {
  contactGroup?: string;
}

export type IResponse = {
  total?: number;
  success?: boolean;
  data?: any[];
};

export enum IAdvSearchButton {
  SEARCH = "SEARCH",
  SAVE = "SAVE",
  RESET = "RESET",
}

export type IGridColDef = GridColDef & {
  hidden?: boolean;
  customType?: "textArea";
  translateContent?: boolean;
  prexFixTranslate?: string;
  decimalPlaces?: number;
  formatNumberByCurrency?: boolean;
  absNumber?: boolean;
  handleCellValueChange?: (v: any, rowId: any) => void;
  useI18n?: boolean;
};
export interface IFilter {
  searchString?: string | null;
  filter?: IFilterItem[] | null;
  sort?: ISortItem[];
  pagination?: {
    page: number;
    pageSize: number;
  };
}
export interface IFilters {
  [T: string]: IFilter;
}
