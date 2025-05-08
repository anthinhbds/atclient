import React, { memo } from "react";

import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
} from "@mui/material";
import {
  Button,
} from "components";
import { useUser } from 'hooks';
import { Clear } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import defaultStyle from "utils/styles";

interface IConfirmSaveDialog {
  items: any[];
  handleButtonClick: () => void;
  handleClose: () => void;
}
const ConfirmSaveDialog = ({
  items,
  handleButtonClick,
  handleClose,
}: IConfirmSaveDialog) => {
  const dStyles = defaultStyle();
  const { t } = useTranslation();
  const { info } = useUser();

  return (
    <React.Fragment>
      <Dialog
        sx={{
          "& .MuiPaper-root": {
            maxWidth: "620px",
            ...dStyles.dialogPaper,
          },
        }}
        open={true}>
        <Box display={"flex"} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <DialogTitle
            sx={dStyles.dialogTitleLabel}>
            Số điện thoại đang nhập đã tồn tại
          </DialogTitle>
          <Clear sx={dStyles.dialogTitleButton} onClick={handleClose} />
        </Box>
        <DialogContent sx={{ p: 2 }}>
          {items.map((r, index) => (
            <Box key={index} ml={1.5} my={1}>
              <Box mb={0.5}><Typography variant="subtitle2">{r.projectname}</Typography></Box>
              <Stack direction={'row'} columnGap={2}>
                <Typography fontSize={'14px'}>{`Tên liên hệ: ${r.owner}`}</Typography>
                <Typography fontSize={'14px'}>{`Mã căn: ${r.apartmentno}`}</Typography>
                {
                  info && info.userId && info.userId !== r.userid &&
                  (<Typography fontSize={'14px'}>{`Nhân viên: ${r.username}`}</Typography>)
                }
              </Stack>
            </Box>
          ))}
        </DialogContent>
        <DialogActions
          sx={dStyles.dialogBottomWrapper}>
          <Button
            sx={dStyles.dialogActionButton}
            text={t("Lưu")}
            onClick={() => {
              handleButtonClick();
            }}
          />
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default memo(ConfirmSaveDialog);
