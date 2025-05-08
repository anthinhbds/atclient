import { TextFieldProps, SelectProps, AutocompleteProps } from "@mui/material";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { UseFormRegister } from "react-hook-form";
export enum EnumInputVariant {
  textfield = "textfield",
  select = "select",
}

interface IitemResponse {
  xs: number | 12;
  sm: number | 12;
  md: number | 12;
  lg: number | 12;
}

export type IBaseInput = {
  inputVariant?: EnumInputVariant;
  recfgResponsive?: IitemResponse;
  label?: string;
  itemSelect?: any;
};

export type ITextField = Omit<TextFieldProps, "variant"> & IBaseInput;

export type ISelect = Omit<SelectProps, "variant"> & IBaseInput;

export const defaultItemResponse = {
  xs: 12,
  sm: 6,
  md: 4,
  lg: 4,
};

export enum EAutoCompleteAddPopup {
  BNA = "bna",
  BCA = "bca",
  BPS = "bps",
  BTR = "btr",
  BWH = "bwh",
  BAC = "bac",
  BPI = "bpi",
}

export type IAmountField = Omit<
  AutocompleteProps<any, false, boolean, any>,
  "options" | "renderInput"
> &
  ReturnType<UseFormRegister<any>> & {
    label?: string;
    idField?: string;
    textField?: string;
    error?: boolean;
    helperText?: string;
    inputRef?: React.Ref<any>;
    forceSelection?: boolean;
  };

export type IAutocomplete = Omit<
  AutocompleteProps<any, false, boolean, any>,
  "options" | "renderInput"
> &
  ReturnType<UseFormRegister<any>> & {
    label?: string;
    addPopup?: {
      title?: string;
      formId: EAutoCompleteAddPopup;
    };
    idField?: string;
    textField?: string;
    error?: boolean;
    helperText?: string;
    store: {
      data?: any[];
      params?: any;
      fnGetData?: (params: any, onSuccess?: any) => void;
      mode?: "local" | "remote";
    };
    inputRef?: React.Ref<any>;
    forceSelection?: boolean;
    handleAddTab?: (newTab: { key: string; text: string }) => void;
    logKey?: string;
    onInitDefaultRecord?: (record: any) => void;
    reducerSyncStore?: ActionCreatorWithPayload<any, string>;
  };

export type IAutocompleteMultiple = Omit<
  AutocompleteProps<any, true, boolean, any>,
  "options" | "renderInput"
> &
  ReturnType<UseFormRegister<any>> & {
    label?: string;
    idField?: string;
    textField?: string;
    error?: boolean;
    helperText?: string;
    addPopup?: {
      title?: string;
      formId: EAutoCompleteAddPopup;
    };
    store: {
      data?: any[];
      params?: any;
      fnGetData?: (params: any, onSuccess?: any) => void;
      mode?: "local" | "remote";
    };
    handleAddTab?: (newTab: { key: string; text: string }) => void;
  };

export interface SearchElememt {
  clear: () => void;
}