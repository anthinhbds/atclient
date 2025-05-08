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
} from "components";
import defaultStyle from "utils/styles";
import { Clear } from "@mui/icons-material";
import {
  IApartmentNote,
} from "types";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface IAdvanceSearch {
  handleButtonClick: (data: any) => void;
  handleClose: () => void;
  defaultValues: IApartmentNote;
}
const ContentDialog = ({
  defaultValues,
  handleButtonClick,
  handleClose,
}: IAdvanceSearch) => {
  const dStyles = defaultStyle();
  const { t } = useTranslation();

  const form = useForm<IApartmentNote>({ defaultValues });
  const { getValues, register, handleSubmit, formState: { errors } } = form;

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
            Nội dung trao đổi
          </DialogTitle>
          <Clear sx={dStyles.dialogTitleButton} onClick={handleClose} />
        </Box>
        <DialogContent sx={{ px: '36px', py: "24px" }}>
          <Grid2 container spacing={2}>
            <Grid2 size={12}>
              <DateField
                label={'Ngày'}
                defaultValue={getValues('entrydate')}
                {...register("entrydate")}
              />
            </Grid2>
            <Grid2 size={12}>
              <TextField
                fullWidth
                autoFocus
                multiline
                label={'Nội dung'}
                defaultValue={getValues('notes')}
                error={!!errors.notes}
                helperText={errors.notes?.message}
                {...register("notes", {
                  required: 'Nội dung không được để trống.'
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

export default memo(ContentDialog);
