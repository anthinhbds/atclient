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
  TextField,
  Button,
  NumberField,
  Autocomplete,
} from "components";
import { Clear } from "@mui/icons-material";
import {
  ITransactionMember,
} from "types";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getCombo } from 'services/api/user';
import defaultStyle from "utils/styles";

interface IMemberDialog {
  handleButtonClick: (data: any) => void;
  handleClose: () => void;
  defaultValues: ITransactionMember;
}
const MemberDialog = ({
  defaultValues,
  handleButtonClick,
  handleClose,
}: IMemberDialog) => {
  const dStyles = defaultStyle();
  const { t } = useTranslation();

  const form = useForm<ITransactionMember>({ defaultValues });
  const { getValues, register, handleSubmit } = form;

  const buttonClick = () => {
    handleSubmit((o) => {
      handleButtonClick(o);
    }, () => {
      // 
    })();
  };


  return (
    <React.Fragment>
      <Dialog
        sx={{
          "& .MuiPaper-root": {
            width: "680px",
            maxWidth: "730px",
            height: "640px",
            ...dStyles.dialogPaper,
          },
        }}
        // PaperComponent={PaperComponent}
        open={true}>
        <Box display={"flex"} style={dStyles.dialogTitleWrapper}>
          <DialogTitle
            sx={dStyles.dialogTitleLabel}>
            Đợt thu
          </DialogTitle>
          <Clear sx={dStyles.dialogTitleButton} onClick={handleClose} />
        </Box>
        <DialogContent sx={{ px: '36px', py: "24px" }}>
          <Grid2 container spacing={2}>
            <Grid2 size={12}>
              <Autocomplete
                autoFocus
                label={'Nhân viên'}
                idField="userId"
                textField="name"
                defaultValue={getValues("userId")}
                store={{
                  fnGetData: getCombo,
                }}
                {...register("userId", {
                  required: true,
                })}
              />
            </Grid2>
            <Grid2 size={12}>
              <NumberField
                decimalScale={2}
                label={'Tỷ lệ'}
                required
                defaultValue={getValues('rate')}
                {...register("rate", {
                  required: true,
                })}
              />
            </Grid2>
            <Grid2 size={12}>
              <TextField
                fullWidth
                multiline
                label={'Nội dung'}
                defaultValue={getValues('notes')}
                {...register("notes")}
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

export default memo(MemberDialog);
