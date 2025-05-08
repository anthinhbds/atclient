/** @format */
import React, { FC, memo, useState } from "react";
import {
  Box,
  // ListItemIcon,
  // ListItemText,
  // Menu,
  MenuItem,
  MenuList,
  Popover,
  PopoverVirtualElement,
} from "@mui/material";
import { userOptionsData } from "./data";
import { useTranslation } from "react-i18next";
import { logout } from 'services/api/user';
import { logoutSuccess } from 'store/user/reducer';
import { getRefreshToken, setAuthToken, setRefreshToken } from 'utils';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Info from "./Info";
import ChangePassword from './ChangePassword';

interface IUserOptions {
  open: boolean;
  onClose?: () => void;
  anchorEl?:
  | null
  | Element
  | (() => Element)
  | PopoverVirtualElement
  | (() => PopoverVirtualElement);
}
const UserOptions: FC<IUserOptions> = ({ open, onClose, anchorEl }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [state, setState] = useState({
    // expandLang: null,
    // expandTheme: null,
    isShowChPass: false,
  });

  const handleAction = (action: string) => async (_value: unknown) => {
    const refeshToken = getRefreshToken();
    switch (action) {
      case "change_password":
        setState({ ...state, isShowChPass: true });
        break;
      case "logout":
        if (refeshToken) {
          logout(refeshToken, (rp) => {
            const rs = rp.data;
            if (rs.success) {
              dispatch(logoutSuccess({ data: rs.data }));
              setAuthToken('');
              setRefreshToken('');
              navigate('/login');
            }
          });
        }
        else {
          handleClose();
        }
        break;
    }
  };
  const handleClose = () => {
    onClose?.();
  };

  return (
    <>
      <Popover
        id={"user_option"}

        open={!!open}
        onClose={handleClose}
        anchorEl={anchorEl}>
        <MenuList
          sx={{ backgroundColor: 'hsl(220, 30%, 7%)' }}
        >
          <Info />
          {userOptionsData?.map((item) => {
            return (
              <MenuItem key={`${item.id}`} onClick={handleAction(item.key)}>
                <Box sx={{ display: "flex" }}>
                  <item.icon sx={{ mr: 1, color: 'hsl(0,0%,65%)' }} />
                  <span style={{ color: 'hsl(0,0%,65%)' }}>{t(item?.title)}</span>
                </Box>

              </MenuItem>
            );
          })}
        </MenuList>
      </Popover>
      {state.isShowChPass && (
        <ChangePassword
          open={state.isShowChPass}
          onClose={() => {
            setState({ ...state, isShowChPass: false });
          }}
        />
      )}
    </>
  );
};
export default memo(UserOptions);
