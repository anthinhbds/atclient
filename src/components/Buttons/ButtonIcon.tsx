import React, { memo } from "react";
import {
  Button,
  IconButton,
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

const ButtonIcon = ({
  text = "",
  iconOnly = false,
  EndIconComponent,
  IconComponent,
  sx,
  ...props
}: IButtonIcon) => {
  const styles = createStyles();
  const mergedStyles = (
    sx ? { ...styles.buttonIcon, ...sx } : styles.buttonIcon
  ) as SxProps;
  if (!iconOnly) {
    return (
      <Button
        variant="outlined"
        {...props}
        sx={mergedStyles}
        endIcon={EndIconComponent}
        startIcon={IconComponent}>
        {text}
      </Button>
    );
  } else {
    return (
      <IconButton {...props} sx={mergedStyles}>
        {IconComponent}
      </IconButton>
    );
  }
};

export default memo(ButtonIcon);
