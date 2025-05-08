import React, { memo, useRef } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { TextField, Button } from "components";
import defaultStyle from "utils/styles";
import { Clear } from "@mui/icons-material";
import { useForm, useFormState } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { checkExistSearchProfile } from "services/api/user";

interface IAdvanceSearch {
  handleButtonClick: (name?: string) => void;
  handleClose: () => void;
}

const DialogAddAdvance = ({
  handleButtonClick,
  handleClose,
}: IAdvanceSearch) => {
  const dStyles = defaultStyle();
  const { t } = useTranslation();
  const profileNameRef = useRef<HTMLInputElement>(null);

  const formAdd = useForm<{ profileName: string }>({
    mode: "onSubmit",
  });
  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    getValues: getValuesAdd,
    // formState: { errors: errorsAdd },
    control: controlAdd,
  } = formAdd;
  const { errors: errorsAdd } = useFormState({ control: controlAdd });

  const checkNameExists = async (v: any) => {
    let error: any = true;
    if (!v) {
      return error;
    }
    const ps = {
      profileName: v,
    };
    // if (getValuesAdd("nbpayitemId")) ps["nbpayitemId"] = getValuesAdd("nbpayitemId");

    await checkExistSearchProfile(ps, (rp) => {
      const rs = rp.data;
      if (rs.data === true)
        error = t("text.msg_error001", { 0: t(`SAS.profileName`) });
    });
    return error;
  };

  return (
    <Dialog
      open={true}
      onChange={() => {
        profileNameRef.current && profileNameRef.current.focus();
      }}
      sx={{
        "& .MuiPaper-root": {
          ...dStyles.dialogPaper,
        },
      }}
      onClose={() => {
        handleClose();
      }}>
      <Box display={"flex"} style={dStyles.dialogTitleWrapper}>
        <DialogTitle sx={dStyles.dialogTitleLabel}>{t("SEARCH.newtitle")}</DialogTitle>
        <Clear
          sx={dStyles.dialogTitleButton}
          onClick={() => {
            handleClose();
          }}
        />
      </Box>
      <DialogContent>
        <TextField
          autoFocus
          inputRef={profileNameRef}
          label="Tên"
          error={errorsAdd.profileName ? true : false}
          helperText={
            errorsAdd.profileName ? errorsAdd.profileName.message : ""
          }
          required
          defaultValue={getValuesAdd("profileName")}
          {...registerAdd("profileName", {
            required: t("text.msg_error003", {
              0: t(`Profile Name`),
            }),
            validate: checkNameExists,
          })}
        />
      </DialogContent>
      <DialogActions sx={{ p: "16px 24px" }}>
        <Button
          text="OK"
          onClick={() => {
            handleSubmitAdd((o) => {
              handleButtonClick(o.profileName);
            })();
          }}
        />
      </DialogActions>
    </Dialog>
  );
};

export default memo(DialogAddAdvance);
