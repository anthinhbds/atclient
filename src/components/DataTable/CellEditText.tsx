import React, { forwardRef, useRef, memo } from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { GridEditInputCellProps, GridApi } from "@mui/x-data-grid";
import { unstable_useEnhancedEffect as useEnhancedEffect } from "@mui/utils";
import { updateRow } from "utils";
import createStyle from "./styles";

type IEditTextField = GridEditInputCellProps &
  Omit<TextFieldProps, "onChange" | "onBlur"> & {
    apiRef: React.MutableRefObject<GridApi>;
    rowId: any;
    field: string;
  };

const CellEditText = forwardRef<HTMLInputElement, IEditTextField>(
  function Input(
    { value, hasFocus, multiline = false, apiRef, rowId, field, ...props },
    ref
  ) {
    const styles = createStyle();
    const inputRef = useRef<HTMLInputElement>();

    useEnhancedEffect(() => {
      if (hasFocus) {
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }, [hasFocus]);
    return (
      <TextField
        ref={ref}
        inputRef={inputRef}
        {...props}
        sx={styles.baseInputEdit}
        onFocus={(e) =>
          e.currentTarget.setSelectionRange(
            e.currentTarget.value.length,
            e.currentTarget.value.length
          )
        }
        onChange={(e) => {
          apiRef.current.setEditCellValue({
            id: rowId,
            field: field,
            value: e.target.value,
          });
          updateRow(apiRef, rowId, {
            [field]: e.target.value,
          });
        }}
        value={value}
        multiline={multiline}
      />
    );
  }
);

export default memo(CellEditText);
