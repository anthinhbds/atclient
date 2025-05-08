import React, { memo } from "react";
import {
  Button as MuiButton,
  ButtonProps,
  IconButtonProps,
  SxProps,
} from "@mui/material";
import createStyles from "./styles";

type IButtonIcon = ButtonProps &
  IconButtonProps & {
    IconComponent?: JSX.Element;
    EndIconComponent?: JSX.Element;
    text?: string;
    iconOnly?: boolean;
  };

const Button = ({
  text = "",
  sx,
  ...props
}: IButtonIcon) => {
  const styles = createStyles();
  const mergedStyles = (
    sx ? { ...styles.button, ...sx } : styles.button
  ) as SxProps;
  return (
    <MuiButton
      variant="outlined"
      {...props}
      sx={mergedStyles}>
      {text}
    </MuiButton>
  );
};

export default memo(Button);
