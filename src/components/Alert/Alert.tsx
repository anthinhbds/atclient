import React, {
  memo,
  // useMemo
} from "react";
import {
  Snackbar,
  Alert as MuiAlert,
  AlertProps,
  Typography,
} from "@mui/material";
import { useNotify, } from "hooks";
import { useSelector } from "react-redux";
import { NotifySelectors } from "store/notify";
// import { useTranslation } from "react-i18next";

const Alert = () => {
  // const { t } = useTranslation();
  const { hide } = useNotify();
  const message = useSelector(NotifySelectors.getMessage);
  const type = useSelector(NotifySelectors.getType);
  const options = useSelector(NotifySelectors.options);

  const handleClose = () => {
    hide();
  };

  const AlertCus = React.forwardRef<HTMLDivElement, AlertProps>(
    function AlertCus(props, ref) {
      return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    }
  );

  return (
    <Snackbar
      open={!!message}
      autoHideDuration={options?.autoHideDuration || 1500}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      onClose={handleClose}
      style={{ whiteSpace: "pre-line" }}>
      <AlertCus variant="standard" onClose={handleClose} severity={type}>
        <Typography sx={{ lineHeight: '16px' }}>{`${message}`}</Typography>
      </AlertCus>
    </Snackbar>
  );
};

export default memo(Alert);
