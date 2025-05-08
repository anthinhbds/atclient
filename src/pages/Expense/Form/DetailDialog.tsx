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
  DateField,
  TextField,
  Button,
  NumberField,
} from "components";
import { Clear } from "@mui/icons-material";
import {
  ITransactionDetail,
} from "types";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import defaultStyle from "utils/styles";

interface IDetailDialog {
  handleButtonClick: (data: any) => void;
  handleClose: () => void;
  defaultValues: ITransactionDetail;
}
const DetailDialog = ({
  defaultValues,
  handleButtonClick,
  handleClose,
}: IDetailDialog) => {
  const dStyles = defaultStyle();
  const { t } = useTranslation();

  const form = useForm<ITransactionDetail>({ defaultValues });
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
            <Grid2 size={dStyles.itemResponsive2Cols}>
              <DateField
                label={'Ngày'}
                required
                defaultValue={getValues('date')}
                {...register("date", {
                  required: true,
                })}
              />
            </Grid2>
            <Grid2 size={dStyles.itemResponsive2Cols}>
              <NumberField
                autoFocus
                label={'Số tiền'}
                required
                defaultValue={getValues('amount')}
                {...register("amount", {
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

export default memo(DetailDialog);
