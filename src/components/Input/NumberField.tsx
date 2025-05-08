import React, { memo, useEffect, forwardRef, useState, useRef } from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { UseFormRegister, UseFormTrigger } from "react-hook-form";
import { TextField, SxProps } from "@mui/material";
import { useTranslation } from "react-i18next";
import createStyles from "./styles";

type INumberField = Omit<NumericFormatProps, "onChange"> &
  ReturnType<UseFormRegister<any>> & {
    label?: string;
    fullWidth?: boolean;
    handleChange?: (e: any) => void;
    sx?: SxProps;
    inputRef?: any;
    trigger?: UseFormTrigger<any>;
    error?: boolean;
    helperText?: string;
    isAbs?: boolean;
    endAdornment?: React.ReactNode;

  };

const NumberField = forwardRef<HTMLInputElement, INumberField>(function Input({
  label = "",
  name,
  thousandSeparator = ",",
  decimalSeparator = ".",
  decimalScale = 2,
  required = false,
  disabled = false,
  fullWidth = true,
  defaultValue,
  sx,
  onChange,
  // onBlur,
  // trigger,
  autoFocus,
  inputRef,
  isAbs,
  ...props
}) {
  const { t } = useTranslation();
  const inputTextRef = useRef<HTMLInputElement | null>(null);
  const styles = createStyles();
  const [value, setValue] = useState(defaultValue);

  const handleChange = (values: any, params: any) => {
    if (params.source.toString() === "prop") return;
    onChange({
      target: {
        name,
        value: values.floatValue ?? 0,
      },
    } as any);
    setValue(values.floatValue);
  };

  const handleBlur = () => {
    if (value) {
      onChange({
        target: {
          name,
          value: value,
        },
        type: "blur",
      } as any);
    } else {
      onChange({
        target: {
          name,
          value: 0,
        },
        type: "blur",
      } as any);
    }
  };

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  useEffect(() => {
    if (autoFocus) {
      inputTextRef.current?.focus();
    }
  }, [autoFocus]);

  return (
    <NumericFormat
      getInputRef={inputRef}
      sx={{ ...sx, ...styles.labelDefault }}
      variant="standard"
      label={label}
      defaultValue={defaultValue}
      value={value}
      required={required}
      disabled={disabled}
      fullWidth={fullWidth}
      error={props.error}
      helperText={props.helperText && t(props.helperText)}
      onValueChange={handleChange}
      onKeyDown={(e) => {
        if (e.key === "-" && isAbs === true) {
          e.preventDefault();
        }
      }}
      thousandSeparator={thousandSeparator}
      decimalSeparator={decimalSeparator}
      decimalScale={decimalScale}
      customInput={TextField}
      slotProps={{
        input: {
          sx: { ...styles.labelDefault },
          inputRef: inputTextRef,
          endAdornment: props.endAdornment,
          onBlur: () => {
            handleBlur();
          },
        }
      }}
    />
  );
});

export default memo(NumberField);
