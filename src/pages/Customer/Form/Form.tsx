import React, {
  memo,
  // useMemo,
  useState,
  // useRef,
  useEffect
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
  Typography,
  Autocomplete,
  Checkbox,
  // NumberField,
  DataTable,
  Button,
} from "components";
import defaultStyle from "utils/styles";
import {
  // ICustomerDemand,
  ICustomerItem,
  SourceCustomerDemand,
  SourceCustomerLeadsource,
  SourceCustomerBedroom,
  IAction,
  ICustomerNote,
} from "types";
import {
  UseFormReturn,
  useWatch
} from "react-hook-form";
import { getNotes } from 'services/api/customer';
import { useGridApiRef } from "@mui/x-data-grid";
import { get as getProject } from "services/api/project";
import ContentDialog from "./ContentDialog";
import dayjs from "dayjs";

interface IForm {
  useForm: UseFormReturn<ICustomerItem>;
  keyNum?: number;
}
const Form = ({ useForm, keyNum = 0 }: IForm) => {
  const dStyles = defaultStyle();
  const apiRef = useGridApiRef();
  const { getValues, setValue, register, control } = useForm;

  const [openDialog, setOpenDialog] = useState<ICustomerNote | null>(null);

  const customerId = useWatch({ control, name: "customerId" });
  const leadsource = useWatch({ control, name: "leadsource" });
  const details = useWatch({ control, name: "details" });

  useEffect(() => {
    if (customerId) {
      getNotes(customerId, (rp) => {
        const rs = rp.data;
        if (rs.success) {
          setValue("details", rs.data);
        }
      });
    }
  }, [customerId]);

  return (
    <Container key={keyNum} maxWidth="md" sx={dStyles.container}>
      <Grid2 container {...dStyles.containerResponsive} mb={3} mx={2}>
        <Grid2 size={{ sm: 8, xs: 8, md: 8, lg: 8 }}>
          <TextField
            autoFocus
            label={'Tên khách hàng'}
            defaultValue={getValues("customername")}
            {...register("customername")}
          />
        </Grid2>
        <Grid2 size={dStyles.itemResponsive}>
          <Checkbox
            label={'Ưu tiên?'}
            defaultValue={getValues("priority")}
            {...register("priority")}
          />
        </Grid2>
        <Grid2 size={dStyles.itemResponsive}>
          <TextField
            label={'Số điện thoại'}
            defaultValue={getValues("telephone")}
            {...register("telephone")}
          />
        </Grid2>
        <Grid2 size={dStyles.itemResponsive}>
          <TextField
            label={'Số điện thoại 2'}
            defaultValue={getValues("telephone2")}
            {...register("telephone2")}
          />
        </Grid2>
        <Grid2 size={dStyles.itemResponsive}>
          <TextField
            label={'Số điện thoại 3'}
            defaultValue={getValues("telephone3")}
            {...register("telephone3")}
          />
        </Grid2>
        {/* <Grid2 size={dStyles.itemResponsive}>
          <TextField
            label={'Số điện thoại 4'}
            defaultValue={getValues("telephone4")}
            {...register("telephone4")}
          />
        </Grid2> */}
      </Grid2>
      <Grid2 container {...dStyles.containerResponsive} mb={3} mx={2}>
        <Grid2 size={4}>
          <Autocomplete
            autoFocus
            label={'Nguồn khách hàng'}
            defaultValue={getValues("leadsourceother")}
            store={{
              mode: 'local',
              data: SourceCustomerLeadsource
            }}
            {...register("leadsource")}
          />
        </Grid2>
        {leadsource === '99' &&
          (<Grid2 size={8}>
            <TextField
              label={'Khác'}
              defaultValue={getValues("leadsourceother")}
              {...register("leadsourceother")}
            />
          </Grid2>
          )
        }
      </Grid2>
      <Grid2 container {...dStyles.containerResponsive}
        sx={{
          mb: 3,
          p: 2,
          backgroundColor: 'rgb(242, 242, 242)',
          borderRadius: '8px',
        }}
      >
        <Grid2 size={12}>
          <Typography text={'NHU CẦU KHÁCH HÀNG'} sx={{ color: 'rgb(0,0,0)', fontWeight: 700 }} />
        </Grid2>
        <Grid2 size={dStyles.itemResponsive}>
          <Autocomplete
            autoFocus
            label={'Nhu cầu'}
            defaultValue={getValues("demand")}
            required
            store={{
              mode: 'local',
              data: SourceCustomerDemand
            }}
            {...register("demand", {
              required: true,
            })}
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
            {...register("arrayProject")}
          />
        </Grid2>
        {/* <Grid2 size={dStyles.itemResponsive}>
          <NumberField
            decimalScale={0}
            label={'Số phòng ngủ'}
            defaultValue={getValues("bedroom")}
            {...register("bedroom")}
          />
        </Grid2> */}
        <Grid2 size={dStyles.itemResponsive}>
          <Autocomplete
            multiple
            label={'Số phòng ngủ'}
            defaultValue={getValues("arrayBedroom")}
            store={{
              mode: 'local',
              data: SourceCustomerBedroom
            }}
            {...register("arrayBedroom")}
          />
        </Grid2>
        <Grid2 size={dStyles.itemResponsive}>
          <TextField
            label={'Diện tích'}
            defaultValue={getValues("arearange")}
            {...register("arearange")}
          />
        </Grid2>
        <Grid2 size={dStyles.itemResponsive}>
          <TextField
            label={'Khoảng giá'}
            defaultValue={getValues("pricerange")}
            {...register("pricerange")}
          />
        </Grid2>
        <Grid2 size={12}>
          <TextField
            label={'Nội thất'}
            defaultValue={getValues("furniture")}
            {...register("furniture")}
          />
        </Grid2>
        <Grid2 size={12}>
          <TextField
            multiline
            label={'Ghi chú'}
            defaultValue={getValues("notes")}
            {...register("notes")}
          />
        </Grid2>
      </Grid2>
      <Grid2 container {...dStyles.containerResponsive}
        sx={{
          mb: 3,
        }}
      >
        <Grid2 size={12}>
          <Typography text={'NỘI DUNG TRAO ĐỔI'} sx={{ color: 'rgb(0,0,0)', fontWeight: 700 }} />
        </Grid2>
        <Grid2 size={12}>
          <DataTable
            apiRef={apiRef}
            rows={details?.filter(f => f.deleted !== true).map((r, index) => ({ ...r, id: index })) ?? []}
            actionBars={[{ key: IAction.DELETE }]}
            handleButtonClick={(key, rowId) => {
              const row = apiRef.current?.getRow(rowId);

              if (key === IAction.DELETE) {
                const datas = details?.map((r) => r.linenum === row.linenum ? { ...row, deleted: true } : r);
                setValue("details", datas, { shouldDirty: true });

              }
            }
            }
            columns={[
              {
                field: 'entrydate',
                headerName: 'Ngày',
                width: 100,
                type: 'date',
              },
              {
                field: 'notes',
                headerName: 'Ghi chú',
                flex: 1,

              },
            ]}
            onCellDoubleClick={(params) => {
              setOpenDialog(params.row as ICustomerNote);
            }}
            disableColumnResize={true}
            checkboxSelection={false}
            hidePaging={true}
          />
          <Button
            text={'Thêm'}
            sx={{ color: "#A31D1D", width: '100px' }}
            onClick={() => {
              setOpenDialog({
                entrydate: dayjs().format("YYYY-MM-DD"),
                notes: "",
              });
            }} />
        </Grid2>
      </Grid2>
      {openDialog && <ContentDialog
        defaultValues={openDialog}
        handleButtonClick={(row: ICustomerNote) => {
          if (!row.linenum) {
            const maxLine = details ? (details.length + 1) : 1
            setValue("details", details ? [...details, { ...row, linenum: maxLine }] : [{ ...row, linenum: maxLine }], { shouldDirty: true });
          }
          else {
            const datas = details?.map((r) => r.linenum === row.linenum ? row : r);
            setValue("details", datas, { shouldDirty: true });
          }
          setOpenDialog(null);
        }}
        handleClose={() => { setOpenDialog(null) }} />}
    </Container>
  );
};

export default memo(Form);
