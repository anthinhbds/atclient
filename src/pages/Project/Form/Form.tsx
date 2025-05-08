import React, {
  memo,
  // useMemo,
  // useState,
  // useRef,
  //  useEffect
} from "react";
import {
  // Box, 
  Container,
  //  FormControlLabel,
  Grid2,
  //  Paper, Radio, RadioGroup, ToggleButton, ToggleButtonGroup
} from "@mui/material";
import {
  TextField,
  // Typography,
  Autocomplete,
  //  NumberField, Autocomplete, Checkbox
} from "components";
import defaultStyle from "utils/styles";
import {
  IProjectItem,
  //  EClaimType, EClaimValue 
} from "types";
import {
  UseFormReturn,
  //  useWatch
} from "react-hook-form";
import { getDistrict } from 'services/api/address';

interface IForm {
  useForm: UseFormReturn<IProjectItem>;
  keyNum?: number;
}
const Form = ({ useForm, keyNum = 0 }: IForm) => {
  const dStyles = defaultStyle();
  const { getValues, register } = useForm;

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
            label={'Mã dự án'}
            defaultValue={getValues("projectId")}
            required
            {...register("projectId")}
          />
        </Grid2>
        <Grid2 size={8}>
          <TextField
            autoFocus
            label={'Tên dự án'}
            defaultValue={getValues("projectname")}
            required
            {...register("projectname", {
              required: true,
              // validate: checkItemName,
            })}
          />
        </Grid2>
        <Grid2 size={4}>
          <TextField
            label={'Tình trạng'}
            defaultValue={getValues("status")}
            {...register("status")}
          />
        </Grid2>
        <Grid2 size={4}>
          <TextField
            label={'Diện tích'}
            defaultValue={getValues("arearange")}
            {...register("arearange")}
          />
        </Grid2>
        <Grid2 size={4}>
          <Autocomplete
            label={'Quận/Huyện'}
            required
            defaultValue={getValues("districtId")}
            idField="districtId"
            textField="districtname"
            store={{
              fnGetData: getDistrict
            }}
            {...register("districtId", {
              required: 'Quận/Huyện: Chưa nhập'
            })}
          />
        </Grid2>

      </Grid2>
    </Container>
  );
};

export default memo(Form);
