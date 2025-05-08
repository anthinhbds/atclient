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
  NumberField,
  DataTable,
  Button,
} from "components";
import defaultStyle from "utils/styles";
import {
  IApartmentDemand,
  IApartmentItem,
  SourceApartmentDemand,
  SourceApartmentStatus,
  SourceApartmentDirection,
  IApartmentNote,
  IAction,
  SourceBedroom,
  EClaimType
} from "types";
import {
  UseFormReturn,
  useWatch
} from "react-hook-form";
import { get as getProject } from 'services/api/project';
import { getNotes } from 'services/api/apartment';
import { useGridApiRef } from "@mui/x-data-grid";
import { useUser } from 'hooks';
import ContentDialog from "./ContentDialog";
import dayjs from "dayjs";


interface IForm {
  useForm: UseFormReturn<IApartmentItem>;
  keyNum?: number;
}
const Form = ({ useForm, keyNum = 0 }: IForm) => {
  const dStyles = defaultStyle();
  const apiRef = useGridApiRef();
  const { getValues, setValue, register, control } = useForm;
  const { info } = useUser();

  const [openDialog, setOpenDialog] = useState<IApartmentNote | null>(null);

  const apartmentId = useWatch({ control, name: "apartmentId" });
  const projectId = useWatch({ control, name: "projectId" });
  const demand = useWatch({ control, name: "demand" });
  const ispartner = useWatch({ control, name: "ispartner" });
  const details = useWatch({ control, name: "details" });

  useEffect(() => {
    if (apartmentId) {
      getNotes(apartmentId, (rp) => {
        const rs = rp.data;
        if (rs.success) {
          setValue("details", rs.data);
        }
      });
    }
  }, [apartmentId]);

  return (
    <Container key={keyNum} maxWidth="md" sx={dStyles.container}>
      <Grid2 container {...dStyles.containerResponsive} mb={3} mx={2}>
        <Grid2 size={dStyles.itemResponsive}>
          <Autocomplete
            autoFocus
            label={'Nhu cầu'}
            defaultValue={getValues("demand")}
            required
            store={{
              mode: 'local',
              data: SourceApartmentDemand
            }}
            {...register("demand", {
              required: true,
            })}
          />
        </Grid2>
        <Grid2 size={dStyles.itemResponsive}>
          <Autocomplete
            label={'Trình trạng'}
            defaultValue={getValues("status")}
            required
            store={{
              mode: 'local',
              data: SourceApartmentStatus
            }}
            {...register("status", {
              required: true,
            })}
          />
        </Grid2>
        <Grid2 size={dStyles.itemResponsive}>
          <Checkbox
            label={'Ưu tiên?'}
            defaultValue={getValues("priority")}
            {...register("priority")}
          />
        </Grid2>
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
          <Typography text={'GIÁ VÀ PHÍ'} sx={{ color: 'rgb(0,0,0)', fontWeight: 700 }} />
        </Grid2>
        {(demand === IApartmentDemand.B || demand === IApartmentDemand.BT) && (<Grid2 container size={12}>
          <Grid2 size={4}>
            <NumberField
              decimalScale={0}
              label={'Giá bán'}
              defaultValue={getValues("salesprice")}
              {...register("salesprice")}
            />
          </Grid2>
          <Grid2 size={4}>
            <NumberField
              decimalScale={0}
              label={'Phí bán'}
              defaultValue={getValues("salesfee")}
              {...register("salesfee")}
            />
          </Grid2>
        </Grid2>)}
        {(demand === IApartmentDemand.T || demand === IApartmentDemand.BT) && (<Grid2 container size={12}>
          <Grid2 size={4}>
            <NumberField
              decimalScale={0}
              label={'Giá cho thuê'}
              defaultValue={getValues("rentprice")}
              {...register("rentprice")}
            />
          </Grid2>
          <Grid2 size={4}>
            <NumberField
              decimalScale={0}
              label={'Phí cho thuê'}
              defaultValue={getValues("rentfee")}
              {...register("rentfee")}
            />
          </Grid2>
        </Grid2>)}
        {info && info.claimType && info.claimType.indexOf(EClaimType.ADMIN) !== -1 && (
          <Grid2 container size={12}>
            <Grid2 size={dStyles.itemResponsive}>
              <Checkbox
                label={'Hợp tác?'}
                defaultValue={getValues("ispartner")}
                {...register("ispartner")}
              />
            </Grid2>
            {ispartner === "Y" && (<Grid2 size={dStyles.itemResponsive}>
              <TextField
                label={'Tên'}
                defaultValue={getValues("partnername")}
                {...register("partnername")}
              />
            </Grid2>)}
            {ispartner === "Y" && <Grid2 size={dStyles.itemResponsive}>
              <TextField
                label={'Số điện thoại'}
                defaultValue={getValues("partnertelephone")}
                {...register("partnertelephone")}
              />
            </Grid2>
            }
          </Grid2>
        )}
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
          <Typography text={'ĐẶC ĐIỂM BẤT ĐỘNG SẢN'} sx={{ color: 'rgb(0,0,0)', fontWeight: 700 }} />
        </Grid2>
        <Grid2 size={12}>
          <Autocomplete
            label={'Dự án'}
            idField="projectId"
            textField="projectname"
            required
            defaultValue={getValues("projectId")}
            store={{
              fnGetData: getProject,
            }}
            {...register("projectId", {
              required: 'Dự án không được để trống'
            })}
          />
        </Grid2>
        {projectId == '1000' ? (
          <Grid2 size={12}>
            <TextField
              label={'Địa chỉ'}
              defaultValue={getValues("address")}
              {...register("address")}
            />
          </Grid2>
        ) : (
          <React.Fragment>
            <Grid2 size={4}>
              <TextField
                label={'Mã căn'}
                defaultValue={getValues("apartmentno")}
                {...register("apartmentno")}
              />
            </Grid2>
            <Grid2 size={4}>
              <NumberField
                label={'Diện tích'}
                defaultValue={getValues("area")}
                {...register("area")}
              />
            </Grid2>
            <Grid2 size={4}>
              <Autocomplete
                store={{
                  mode: 'local',
                  data: SourceBedroom
                }}
                label={'Số phòng ngủ'}
                defaultValue={getValues("bedroom")}
                {...register("bedroom")}
              />
            </Grid2>
            <Grid2 size={4}>
              <Autocomplete
                label={'Hướng cửa'}
                defaultValue={getValues("apartmentview")}
                store={{
                  mode: 'local',
                  data: SourceApartmentDirection
                }}
                {...register("apartmentview")}
              />
            </Grid2>
            <Grid2 size={4}>
              <Autocomplete
                label={'Hướng ban công'}
                defaultValue={getValues("banconyview")}
                store={{
                  mode: 'local',
                  data: SourceApartmentDirection
                }}
                {...register("banconyview")}
              />
            </Grid2>
          </React.Fragment>
        )}
        <Grid2 size={12}>
          <TextField
            label={'Nội thất'}
            defaultValue={getValues("furniture")}
            {...register("furniture")}
          />
        </Grid2>
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
          <Typography text={'LIÊN HỆ'} sx={{ color: 'rgb(0,0,0)', fontWeight: 700 }} />
        </Grid2>
        <Grid2 size={4}>
          <TextField
            label={'Tên'}
            defaultValue={getValues("owner")}
            {...register("owner")}
          />
        </Grid2>
        <Grid2 size={4}>
          <TextField
            label={'Số điện thoại'}
            defaultValue={getValues("telephone")}
            {...register("telephone")}
          />
        </Grid2>
        <Grid2 size={4}>
          <TextField
            label={'Số điện thoại 2'}
            defaultValue={getValues("telephone2")}
            {...register("telephone2")}
          />
        </Grid2>
        <Grid2 size={4}>
          <TextField
            label={'Số điện thoại 3'}
            defaultValue={getValues("telephone3")}
            {...register("telephone3")}
          />
        </Grid2>
        <Grid2 size={4}>
          <TextField
            label={'Số điện thoại 4'}
            defaultValue={getValues("telephone4")}
            {...register("telephone4")}
          />
        </Grid2>
        <Grid2 size={4}>
          <TextField
            label={'Số điện thoại 5'}
            defaultValue={getValues("telephone5")}
            {...register("telephone5")}
          />
        </Grid2>
        <Grid2 size={12}>
          <TextField
            label={'Ghi chú'}
            multiline
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
              setOpenDialog(params.row as IApartmentNote);
            }}
            disableColumnResize={true}
            checkboxSelection={false}
            hidePaging={true}
          />
          <Button text={'Thêm'} sx={{ color: "#A31D1D", width: '100px' }} onClick={() => {
            setOpenDialog({
              entrydate: dayjs().format("YYYY-MM-DD"),
              notes: "",
            });
          }} />
        </Grid2>
      </Grid2>
      {openDialog && <ContentDialog
        defaultValues={openDialog}
        handleButtonClick={(row: IApartmentNote) => {
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
