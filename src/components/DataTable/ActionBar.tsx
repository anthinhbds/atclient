import React, { useCallback, useMemo } from "react";
import { MenuList, MenuItem, ListItemText } from "@mui/material";
import { IAction } from "types";
import { useTranslation } from "react-i18next";
// import { useTranslation } from "react-i18next";

interface IGridActionBar {
  buttons?: {
    key: IAction;
    label?: string;
    // icon?: JSX.Element;
  }[];
  onClick: (key: any) => void;
}

const GridActionBar = ({ buttons, onClick }: IGridActionBar) => {
  const handleClick = useCallback(
    (key: any) => {
      // setPopperAnchorEl(null);
      onClick?.(key);
    },
    [onClick]
  );

  const { t } = useTranslation();

  const ButtonList = useMemo(() => {
    if (buttons) {
      return buttons.map((button) => {
        return (
          <MenuItem key={button.key} onClick={() => handleClick(button.key)}>
            <ListItemText sx={{ color: "#000" }}>
              {button.label ? button.label : t(`button.${button.key}`)}
            </ListItemText>
          </MenuItem>
        );
      });
    }
  }, [buttons]);
  return <MenuList>{ButtonList}</MenuList>;
};
export default GridActionBar;
