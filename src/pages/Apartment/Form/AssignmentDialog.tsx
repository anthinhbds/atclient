import React, { memo } from "react";

import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid2,
  DialogActions,
  // PaperProps,
  // Paper,
} from "@mui/material";
import {
  Autocomplete,
  Button,
} from "components";
import defaultStyle from "utils/styles";
import { Clear } from "@mui/icons-material";
import {
  IAssignmentLog,
} from "types";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { get as getUser } from 'services/api/user'

interface IAssignmentDialog {
  handleButtonClick: (data: any) => void;
  handleClose: () => void;
}
const AssignmentDialog = ({
  handleButtonClick,
  handleClose,
}: IAssignmentDialog) => {
  const dStyles = defaultStyle();
  const { t } = useTranslation();

  const form = useForm<IAssignmentLog>();
  const { getValues, register, handleSubmit } = form;

  const buttonClick = () => {
    handleSubmit((o) => {
      handleButtonClick(o.assignee);
    }, () => {
      // 
    })();
  };

  return (
    <React.Fragment>
      <Dialog
        sx={{
          "& .MuiPaper-root": {
            width: "440px",
            maxWidth: "440px",
            height: "230px",
            ...dStyles.dialogPaper,
          },
        }}
        // PaperComponent={PaperComponent}
        open={true}>
        <Box display={"flex"} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <DialogTitle
            sx={dStyles.dialogTitleLabel}>
            Chuyển giao chính chủ
          </DialogTitle>
          <Clear sx={dStyles.dialogTitleButton} onClick={handleClose} />
        </Box>
        <DialogContent sx={{ p: 2 }}>
          <Grid2 container spacing={2}>
            <Grid2 size={12}>
              <Autocomplete
                idField='userId'
                textField="name"
                store={{
                  fnGetData: getUser
                }}
                label={'Nhân viên'}
                defaultValue={getValues('assignee')}
                {...register("assignee", {
                  required: 'Nhân viên không được để trống'
                })}
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
              buttonClick();
            }}
          />
        </DialogActions>
      </Dialog>

    </React.Fragment>
  );
};

export default memo(AssignmentDialog);
