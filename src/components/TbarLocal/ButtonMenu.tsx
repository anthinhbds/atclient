import React, { memo, useCallback } from "react";
import { ButtonIcon } from "components";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { IAction, IActionAndSub } from "types";
import { KeyboardArrowDownOutlined } from "@mui/icons-material";

interface ISubButton {
  icon: JSX.Element;
  actionKey?: IAction;
  label?: string;
  handleActionClick?: (key: IAction | IActionAndSub) => void;
  items: { key: IAction | "splitRegion"; sub?: string; label?: string }[];
  type?: "submit" | "reset" | "button" | undefined;
  isEditing?: boolean;
}

const ButtonMenu = ({
  items,
  label = "",
  actionKey,
  type,
  icon,
  isEditing,
  handleActionClick,
}: ISubButton) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const IconElement = React.cloneElement(icon, {
    onClick: (e: any) => {
      e.preventDefault();
    },
  });

  const handleClick = useCallback(() => {
    if (isEditing) return;
    return handleActionClick?.(actionKey ?? IAction.SAVE);
  }, [actionKey, isEditing]);

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (key: any, sub?: any) => {
    setTimeout(() => {
      if (sub) handleActionClick?.({ key, sub });
      else handleActionClick?.(key);
    }, 50);
  };

  return (
    <div>
      <ButtonIcon
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={(e) => {
          if (actionKey === IAction.MORE) openMenu(e);
          else handleClick();
        }}
        IconComponent={IconElement}
        text={label}
        type={type ?? "button"}
        sx={
          actionKey === IAction.MORE
            ? {
              minWidth: "24px !important",
              "& svg": {
                fontSize: "24px !important",
              },
            }
            : {}
        }
      />
      {actionKey !== IAction.MORE && (
        <ButtonIcon
          iconOnly
          IconComponent={<KeyboardArrowDownOutlined />}
          onClick={openMenu}
          style={{ paddingLeft: "0px" }}
        />
      )}
      <Menu
        id="basic-menu"
        disableRestoreFocus
        anchorEl={anchorEl}
        open={open}
        onClose={(e, d) => {
          setAnchorEl(null);
          handleClose(e, d);
        }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
        {items.map((item) =>
          item.key !== "splitRegion" ? (
            <MenuItem
              key={item.key}
              sx={{ color: "#000" }}
              onClick={() => {
                setAnchorEl(null);
                handleClose(item.key, item.sub);
              }}>
              {item.label}
            </MenuItem>
          ) : (
            <div
              key={item.key}
              style={{
                width: "100%",
                height: "1px",
                backgroundColor: "#F2F2F2",
              }}></div>
          )
        )}
      </Menu>
    </div>
  );
};

export default memo(ButtonMenu);
