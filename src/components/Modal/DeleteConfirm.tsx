import React, { memo } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  SxProps,
} from "@mui/material";

import createStyle from "./styles";

interface IDeleteConfirmProps {
  open: boolean;
  title?: string;
  okLabel?: string;
  cancelLabel?: string;
  isSaving?: boolean;
  children?: React.ReactNode;
  handleOK?: () => void;
  handleClose?: () => void;
  sx?: SxProps;
}
const DeleteConfirm = ({
  open,
  title = "",
  children,
  okLabel,
  cancelLabel,
  isSaving = false,
  // sx,
  handleOK,
  handleClose,
}: IDeleteConfirmProps) => {
  // const { palette } = useTheme();
  const styles = createStyle();
  return (
    <React.Fragment>
      <Dialog
        style={{ overflow: "hidden" }}
        open={open}
        sx={styles.dialog}
        onClose={() => {
          handleClose?.();
        }}>
        <Stack>
          <DialogTitle sx={{ ...styles.dialogTitle, whiteSpace: "pre-line" }}>
            {title}
          </DialogTitle>
        </Stack>
        {children && (
          <DialogContent sx={styles.dialogContent}>{children}</DialogContent>
        )}

        <DialogActions sx={{ px: "16px !important" }}>
          <Button
            sx={styles.dialogButton}
            onClick={() => {
              handleClose?.();
            }}>
            {cancelLabel ?? 'Thoát'}
          </Button>
          <Button
            sx={styles.dialogButton}
            disabled={isSaving}
            onClick={() => {
              handleOK?.();
            }}>
            {okLabel ?? 'Ok'}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
export default memo(DeleteConfirm);
