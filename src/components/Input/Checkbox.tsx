import React, { forwardRef, useState, memo, useEffect } from "react";
import {
  FormControlLabel,
  Checkbox as MuiCheckbox,
  CheckboxProps,
  FormGroup,
  FormHelperText,
} from "@mui/material";
import { RefCallBack } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { parseYNByBoolean, checkBooleanByYN } from "utils";
// import createStyle from "./styles";

type ICheckbox = Omit<CheckboxProps, "onChange"> & {
  onChange?: (event: { target: any; type?: string }) => void;
  onBlur?: (event: { target: any; type?: string }) => void;
  ref?: RefCallBack;
  name?: string;
  min?: string | number;
  max?: string | number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  required?: boolean;
  disabled?: boolean;
} & { //ReturnType<UseFormRegister<any>> &
  label?: string;
  helperText?: string;
};

const Checkbox = forwardRef<HTMLButtonElement, ICheckbox>(function Input(
  {
    onChange,
    onBlur,
    label = "",
    name,
    defaultValue,
    helperText,
    sx,
    ...props
  },
  ref
) {
  const { t } = useTranslation();
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    setChecked(checkBooleanByYN(defaultValue as string));
  }, [defaultValue]);

  return (
    <FormGroup>
      <FormControlLabel
        sx={{
          ...sx,
          pt: "11px",
          '& svg': {
            color: 'rgba(0,0,0,0.8) !important',
          }
        }}
        control={
          <MuiCheckbox
            {...props}
            sx={{}}
            checked={checked}
            onChange={(e, v) => {
              const value = checked === v ? !v : v;
              const s = parseYNByBoolean(value);
              setChecked(checkBooleanByYN(s as string));
              onChange?.({
                target: {
                  name,
                  value: s,
                },
              });
            }}
            onBlur={onBlur}
            ref={ref}
          />
        }
        label={t(label)}
      />
      {helperText && <FormHelperText>{t(helperText)}</FormHelperText>}
    </FormGroup>
  );
});

export default memo(Checkbox);
