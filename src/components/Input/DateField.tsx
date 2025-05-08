import React, { memo, useState, useMemo, useEffect, forwardRef, useRef } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  DatePicker,
  DateTimePicker,
  TimePicker,
  DatePickerProps,
  DateTimePickerProps,
} from "@mui/x-date-pickers";
import "dayjs/locale/en-gb";
import { UseFormRegister } from "react-hook-form";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { TextFieldProps } from "@mui/material";
import createStyle from "./styles";

type IDateField = DatePickerProps<any> & DateTimePickerProps<any> &
  ReturnType<UseFormRegister<any>> & {
    type?: "date" | "datetime" | "time";
    textFieldProps?: Omit<TextFieldProps, "onChange" | "onBlur">;
    name?: string;
    error?: boolean;
    helperText?: string;
    // sx?: SxProps;
  };

dayjs.extend(utc);
dayjs.extend(timezone);
// dayjs.tz.setDefault(dayjs.tz.guess());

const DateField = forwardRef<HTMLInputElement, IDateField>(function Input(
  {
    textFieldProps,
    type = "date",
    label = "",
    name = "",
    autoFocus,
    onChange,
    // onBlur,
    defaultValue,
    ...props
  },
  ref
) {
  const styles = createStyle();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const defaultValueConvert = useMemo(() => {
    const d = dayjs(defaultValue);
    if (!defaultValue) return null;
    if (d.format("YYYY-MM-DD") === "1911-01-01") return null;
    return d;
  }, [defaultValue]);

  const [value, setValue] = useState(defaultValueConvert);

  const handleChange = (val: any) => {
    if (!val) {
      onChange?.({
        target: {
          name,
          value: null,
        },
      });
      setValue(null);
      return;
    }
    if (type === "date") {
      onChange?.({
        target: {
          name,
          value: val.format("YYYY-MM-DD"),
        },
      });
    } else if (type === "datetime") {
      onChange?.({
        target: {
          name,
          value: val.format("YYYY-MM-DD HH:mm:ss"),
        },
      });
    } else if (type === "time") {
      onChange?.({
        target: {
          name,
          value: val.format("HH:mm:ss"),
        },
      });
    }

    setValue(val);
  };

  const handleBlur = () => {
    if (value !== null) {
      onChange?.({
        target: {
          name,
          value,
        },
        type: "blur",
      });
    } else {
      onChange?.({
        target: {
          name,
          value: null,
        },
        type: "blur",
      });
    }
  };

  const sx =
    textFieldProps && textFieldProps.sx
      ? {
        ...styles.labelDefault,
        "& .MuiButtonBase-root": {
          p: "8px 10px 8px 6px",
          color: 'rgba(0,0,0,0.6)'
        },
        ...textFieldProps.sx,

      }
      : {
        ...styles.labelDefault,
        "& .MuiButtonBase-root": {
          p: "8px 10px 8px 6px",
          color: 'rgba(0,0,0,0.6)'
        },
      };

  useEffect(() => {
    setValue(defaultValueConvert);
  }, [defaultValueConvert]);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  return (
    <LocalizationProvider adapterLocale={"en-gb"} dateAdapter={AdapterDayjs}>
      {type === "date" && (
        <DatePicker
          {...props}
          ref={ref}
          defaultValue={defaultValueConvert}
          value={value ? dayjs(value) : null}
          name={name}
          onChange={handleChange}
          slotProps={{
            textField: {
              error: props.error ?? false,
              helperText: props.helperText,
              required: props.required,
              inputRef: inputRef,
              ...textFieldProps,
              sx,
              label,
              variant: "standard",
              fullWidth: textFieldProps?.fullWidth ?? true,
              onBlur: () => {
                handleBlur();
              },
            },
          }}
        />
      )}
      {type === "datetime" && (
        <DateTimePicker
          // {...props}
          {...props}
          ref={ref}
          defaultValue={defaultValueConvert}
          value={value ? dayjs(value) : null}
          name={name}
          onChange={handleChange}
          slotProps={{
            textField: {
              ...textFieldProps,
              sx: [{ ...styles.labelDefault }],
              variant: "standard",
              fullWidth: textFieldProps?.fullWidth ?? true,
              onBlur: () => {
                handleBlur();
              },
            },
          }}
        />
      )}
      {type === "time" && (
        <TimePicker
          slotProps={{
            textField: {
              ...textFieldProps,
              sx: [{ ...styles.labelDefault }],
              variant: "standard",
              fullWidth: textFieldProps?.fullWidth ?? true,
            },
          }}
        />
      )}
    </LocalizationProvider>
  );
});

export default memo(DateField);
