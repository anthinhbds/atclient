import React, { memo, useRef, forwardRef } from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { SxProps, TextField } from "@mui/material";
import { GridEditInputCellProps, GridApi } from "@mui/x-data-grid";
import { unstable_useEnhancedEffect as useEnhancedEffect } from "@mui/utils";
import createStyle from "./styles";
import { updateRow } from "utils";

type ICellEditNumber = GridEditInputCellProps &
  Omit<NumericFormatProps, "onChange" | "onBlur"> & {
    apiRef: React.MutableRefObject<GridApi>;
    rowId: any;
    field: string;
    isAbs?: boolean;
    handleChange?: (v: any, detail: any) => void;
  };
const CellEditNumber = forwardRef<HTMLInputElement, ICellEditNumber>(
  function Input(
    {
      value,
      thousandSeparator = ",",
      decimalSeparator = ".",
      decimalScale = 2,
      isAbs,
      apiRef,
      rowId,
      field,
      hasFocus,
      handleChange,
      ...props
    },
    ref
  ) {
    const styles = createStyle();
    const inputRef = useRef<HTMLInputElement>();

    useEnhancedEffect(() => {
      if (hasFocus) {
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }, [hasFocus, ref]);

    return (
      <NumericFormat
        {...props}
        value={value}
        sx={styles.baseInputEdit as SxProps}
        variant="outlined"
        thousandSeparator={thousandSeparator}
        decimalSeparator={decimalSeparator}
        decimalScale={decimalScale}
        inputRef={inputRef}
        customInput={TextField}
        onValueChange={(e) => {
          const v = e.floatValue ?? 0;
          apiRef.current.setEditCellValue({
            id: rowId,
            field: field,
            value: v,
          });
          updateRow(apiRef, rowId, {
            [field]: v,
          });
          handleChange?.(v, rowId);
        }}
        onKeyDown={(e) => {
          if (e.key === "-" && isAbs === true) {
            e.preventDefault();
          }
        }}
      />
    );
  }
);

export default memo(CellEditNumber);
