import React, { forwardRef, memo, useEffect, useRef, useState } from "react";
import { TextField as MuiTextField, TextFieldProps } from "@mui/material";
import { UseFormRegister } from "react-hook-form";
// import createStyle from "./styles";

type ITextField = Omit<TextFieldProps, "onChange"> &
  ReturnType<UseFormRegister<any>> & {
    label?: string;
  };

const TextFieldOld = forwardRef<HTMLInputElement, ITextField>(function Input(
  { onChange, onBlur, name, defaultValue, autoFocus, ...props },
  ref
) {
  // const styles = createStyle();
  const [shrink, setShrink] = useState(false);
  const refFocus = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (refFocus.current === true) {
      setShrink(true);
      return;
    }
    if (!defaultValue && props.placeholder) {
      setShrink(true);
      return;
    }
    setShrink(!!defaultValue);
  }, [refFocus.current, props.placeholder, defaultValue]);

  useEffect(() => {
    inputRef && inputRef.current && autoFocus && inputRef.current.focus();
  }, [autoFocus]);

  return (
    <MuiTextField
      {...props}
      autoComplete="off"
      inputRef={inputRef}
      ref={ref}
      variant="standard"
      name={name}
      onChange={(e) => {
        onChange(e);
      }}
      onFocus={() => {
        setShrink(true);
        refFocus.current = true;
      }}
      onBlur={(e) => {
        setShrink(!!e.target.value);
        refFocus.current = false;
        onBlur(e);
      }}
      fullWidth
      slotProps={{
        inputLabel: {
          shrink
        }
      }}
    />
  );
});

export default memo(TextFieldOld);
