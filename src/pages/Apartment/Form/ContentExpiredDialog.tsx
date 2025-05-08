import React, { memo, useRef } from "react";

import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid2,
  DialogActions,
  TextField
} from "@mui/material";
import {
  Button,
} from "components";
import defaultStyle from "utils/styles";
import { Clear } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

interface IContentExpiredDialog {
  handleButtonClick: (data: any) => void;
  handleClose: () => void;
}
const ContentExpiredDialog = ({
  handleButtonClick,
  handleClose,
}: IContentExpiredDialog) => {
  const dStyles = defaultStyle();
  const { t } = useTranslation();

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <React.Fragment>
      <Dialog
        sx={{
          "& .MuiPaper-root": {
            width: "680px",
            maxWidth: "730px",
            height: "240px",
            ...dStyles.dialogPaper,
          },
        }}
        // PaperComponent={PaperComponent}
        open={true}>
        <Box display={"flex"} style={dStyles.dialogTitleWrapper}>
          <DialogTitle
            sx={dStyles.dialogTitleLabel}>
            Nội dung cập nhật
          </DialogTitle>
          <Clear sx={dStyles.dialogTitleButton} onClick={handleClose} />
        </Box>
        <DialogContent sx={{ px: '36px', py: "24px" }}>
          <Grid2 container spacing={2}>
            <Grid2 size={12}>
              <TextField
                inputRef={inputRef}
                variant="standard"
                autoFocus
                fullWidth
                label={'Nội dung'}
              />
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions
          sx={dStyles.dialogBottomWrapper}>
          <Button
            sx={dStyles.dialogActionButton}
            text={t("OK")}
            onClick={() => {
              if (!inputRef.current || !inputRef.current.value) {
                inputRef.current?.focus();
                return;
              }
              handleButtonClick(inputRef.current.value);
            }}
          />
        </DialogActions>
      </Dialog>

    </React.Fragment>
  );
};

export default memo(ContentExpiredDialog);
