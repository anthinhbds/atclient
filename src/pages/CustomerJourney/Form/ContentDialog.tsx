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
  Autocomplete,
} from "components";
import defaultStyle from "utils/styles";
import { Clear } from "@mui/icons-material";
import {
  ICustomerJourneyDetItem,
} from "types";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { get as getProject } from "services/api/project";

interface IAdvanceSearch {
  handleButtonClick: (data: any) => void;
  handleClose: () => void;
  defaultValues: ICustomerJourneyDetItem;
}
const ContentDialog = ({
  defaultValues,
  handleButtonClick,
  handleClose,
}: IAdvanceSearch) => {
  const dStyles = defaultStyle();
  const { t } = useTranslation();


  const form = useForm<ICustomerJourneyDetItem>({ defaultValues });
  const { getValues, setValue, register, handleSubmit } = form;

  const buttonClick = () => {
    handleSubmit((o) => {
      // o['ojourneydate'] = 
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
            Nội dung
          </DialogTitle>
          <Clear sx={dStyles.dialogTitleButton} onClick={handleClose} />
        </Box>
        <DialogContent sx={{ px: '36px', py: "24px" }}>
          <Grid2 container spacing={2}>
            <Grid2 size={12}>
              <DateField
                type="datetime"
                label={'Ngày'}
                defaultValue={getValues('journeydate')}
                {...register("journeydate")}
              />
            </Grid2>
            <Grid2 size={12}>
              <Autocomplete
                multiple
                label={'Dự án'}
                idField="projectId"
                textField="projectname"
                defaultValue={getValues("arrayProject")}
                store={{
                  fnGetData: getProject,
                }}
                {...register("arrayProject", {
                  onChange: (e: any) => {
                    if (e.target.value && e.target.value.length > 0)
                      setValue('projectname', e.target.text.join(', '));
                  }
                })}
              />
            </Grid2>
            <Grid2 size={12}>
              <TextField
                fullWidth
                label={'Ghi chú'}
                defaultValue={getValues('notes')}
                {...register("notes")}
              />
            </Grid2>
            <Grid2 size={12}>
              <TextField
                fullWidth
                label={'Phản hồi từ khách hàng'}
                defaultValue={getValues('feedback')}
                {...register("feedback")}
              />
            </Grid2>
            <Grid2 size={12}>
              <TextField
                fullWidth
                label={'Vấn đề đang gặp'}
                defaultValue={getValues('problem')}
                {...register("problem")}
              />
            </Grid2>
            <Grid2 size={12}>
              <TextField
                fullWidth
                label={'Kế hoặc tiếp theo'}
                defaultValue={getValues('nextstep')}
                {...register("nextstep")}
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
