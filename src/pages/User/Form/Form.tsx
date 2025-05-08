import React, {
  memo,
  useMemo,
  // useState,
  // useRef,
  //  useEffect
} from "react";
import { Box, Container, FormControlLabel, Grid2, Paper, Radio, RadioGroup, ToggleButton, ToggleButtonGroup } from "@mui/material";
import {
  TextField,
  Typography,
  // Autocomplete,
  //  NumberField, Autocomplete, Checkbox
} from "components";
import defaultStyle from "utils/styles";
import { IUserItem, EClaimType, EClaimValue } from "types";
import { UseFormReturn, useWatch } from "react-hook-form";

interface IForm {
  useForm: UseFormReturn<IUserItem>;
  keyNum?: number;
}
const Form = ({ useForm, keyNum = 0 }: IForm) => {
  const dStyles = defaultStyle();
  const { getValues, setValue, register, control } = useForm;
  const claims = useWatch({ control, name: 'claims' });

  const claimType = useMemo(() => {
    if (!claims) return EClaimType.EMPLOYEE;

    return claims ? claims[0].claimId : EClaimType.EMPLOYEE;
  }, [claims]);

  const claimValue = useMemo(() => {
    if (!claims) return EClaimValue.STANDARD;

    return claims ? claims[0].claimvalue : EClaimValue.STANDARD;
  }, [claims]);


  // const checkItemName = async (v: any) => {
  //   let error: any = true;
  //   if (!v) {
  //     return error;
  //   }
  //   const ps = {
  //     itemname: v,
  //   };
  //   if (getValues("nbpayitemId")) ps["nbpayitemId"] = getValues("nbpayitemId");

  //   await checkExistName(ps, (rp) => {
  //     const rs = rp.data;
  //     if (rs.data === true)
  //       error = t("text.msg_error001", { 0: t(`BPI.itemname`) });
  //   });
  //   return error;
  // };

  return (
    <Container key={keyNum} maxWidth="md" sx={dStyles.container}>
      <Grid2 container {...dStyles.containerResponsive} marginBottom={"18px"}>
        <Grid2 size={4}>
          <TextField
            disabled={true}
            label={'Mã nhân viên'}
            defaultValue={getValues("userId")}
            required
            {...register("userId")}
          />
        </Grid2>
        <Grid2 size={8}>
          <TextField
            autoFocus
            label={'Họ và tên'}
            defaultValue={getValues("name")}
            required
            {...register("name", {
              required: 'Họ và tên: Chưa nhập',
              // validate: checkItemName,
            })}
          />
        </Grid2>
        <Grid2 size={4}>
          <TextField
            label={'Số điện thoại'}
            defaultValue={getValues("telephone")}
            {...register("telephone")}
          />
        </Grid2>
        <Grid2 size={8}>
          <TextField
            label={'Email'}
            defaultValue={getValues("email")}
            {...register("email")}
          />
        </Grid2>
        <Grid2 size={12}>
          <Paper sx={{
            border: '1px solid hsla(220, 20%, 25%, 0.6)',
            backgroundColor: 'transparent',
            borderRadius: '8px',
            mt: 2,
            p: 2
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }} text={'Quyền quản trị'} />
            <Box display={'flex'} justifyContent={'center'}>
              <ToggleButtonGroup
                value={claimType}
                exclusive
                sx={{
                  '& button': {
                    textTransform: 'none',
                    fontWeight: 700,
                    width: '120px',
                    color: 'hsl(0,0%,35%)',
                    border: '1px solid hsla(220, 20%, 25%, 0.6)',
                  },
                  '& .Mui-selected': {
                    color: 'hsl(0,0%,95%) !important',
                  }
                }}
                onChange={(_e, v) => {
                  if (v) {
                    setValue('claims', [
                      {
                        claimId: v,
                        claimvalue: EClaimValue.STANDARD
                      }
                    ])
                  }
                }}
              >
                <ToggleButton value={EClaimType.ADMIN} aria-label="list">
                  Admin
                </ToggleButton>
                <ToggleButton value={EClaimType.EMPLOYEE} aria-label="module">
                  Employee
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            {claimType === EClaimType.ADMIN && (
              <RadioGroup
                defaultValue={claimValue}
                onChange={(_e, v) => {
                  setValue('claims', [
                    {
                      claimId: claimType,
                      claimvalue: v as EClaimValue
                    }
                  ])
                }}
              >
                <FormControlLabel value={EClaimValue.STANDARD} control={<Radio />} label="Tiêu chuẩn" />
                <FormControlLabel value={EClaimValue.MANAGER_USER} control={<Radio />} label="Quản lý nhân viên" />
              </RadioGroup>
            )}
            {claimType === EClaimType.EMPLOYEE && (
              <RadioGroup
                defaultValue={claimValue}
              >
                <FormControlLabel value={EClaimValue.STANDARD} control={<Radio />} label="Tiêu chuẩn" />
                <FormControlLabel value={EClaimValue.LEADER} control={<Radio />} label="Trưởng nhóm" />
              </RadioGroup>
            )}
          </Paper>

        </Grid2>
      </Grid2>
    </Container>
  );
};

export default memo(Form);
