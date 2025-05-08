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
  DataTable,
  Autocomplete,
  Button
} from "components";
import defaultStyle from "utils/styles";
import {
  ICustomerJourneyItem,
  SourceCustomerQuality,
  SourceCustomerJourneyStatus,
  IAction,
  ICustomerJourneyDetItem,
  //  EClaimType, EClaimValue 
} from "types";
import { useGridApiRef } from "@mui/x-data-grid";
import {
  UseFormReturn,
  useWatch,
  //  useWatch
} from "react-hook-form";
import { getCustomer } from 'services/api/customerjourney';
import { getCombo } from 'services/api/user';
import { getDetails } from 'services/api/customerjourney';
import ContentDialog from "./ContentDialog";

interface IForm {
  useForm: UseFormReturn<ICustomerJourneyItem>;
  keyNum?: number;
}
const Form = ({ useForm, keyNum = 0 }: IForm) => {
  const dStyles = defaultStyle();
  const apiRef = useGridApiRef();
  const [openDialog, setOpenDialog] = useState<ICustomerJourneyDetItem | null>(null);
  const { getValues, setValue, register, control } = useForm;

  const customerId = useWatch({ control, name: "customerId" });
  const details = useWatch({ control, name: "details" });
  useWatch({ control, name: ['comments'] });
  useEffect(() => {
    if (customerId) {
      getDetails(customerId, (rp) => {
        const rs = rp.data;
        if (rs.success) {
          setValue("details", rs.data.map((r: any, idx: any) => ({ ...r, id: idx })));
        }
      });
    }
  }, [customerId]);

  return (
    <Container key={keyNum} maxWidth="xl" sx={dStyles.container}>
      <Grid2 container {...dStyles.containerResponsive} marginBottom={"18px"}>
        <Grid2 size={4}>
          <Autocomplete
            autoFocus
            disabled={!getValues('isNew')}
            label={'Khách hàng'}
            idField="customerId"
            textField="displaycustomer"
            defaultValue={getValues("customerId")}
            store={{
              fnGetData: getCustomer,
            }}
            {...register("customerId", {
              onChange: (e) => {
                const value = e.target.value;
                if (value) {
                  getCustomer({
                    filter: [
                      { property: 'customerId', method: 'eq', value },
                    ]
                  }, (rp) => {
                    const rs = rp.data;
                    if (rs.success && rs.data.length > 0) {
                      setValue('comments', rs.data[0].notes, { shouldDirty: true });
                    }
                  });
                }
              }
            })}
          />
        </Grid2>
        <Grid2 size={4}>
          <Autocomplete
            label={'Nhân viên'}
            idField="userId"
            textField="name"
            defaultValue={getValues("userId")}
            store={{
              fnGetData: getCombo,
            }}
            {...register("userId")}
          />
        </Grid2>
        <Grid2 size={4}>
          <Autocomplete
            label={'Tình trạng'}
            defaultValue={getValues("status")}
            store={{
              mode: 'local',
              data: SourceCustomerJourneyStatus
            }}
            {...register("status")}
          />
        </Grid2>
        <Grid2 size={4}>
          <Autocomplete
            label={'Tiềm năng'}
            defaultValue={getValues("quality")}
            store={{
              mode: 'local',
              data: SourceCustomerQuality
            }}
            {...register("quality")}
          />
        </Grid2>
        <Grid2 size={4}>
          <TextField
            label={'Nhu cầu'}
            defaultValue={getValues("demand")}
            {...register("demand")}
          />
        </Grid2>
        <Grid2 size={4}>
          <TextField
            label={'Tài chính'}
            defaultValue={getValues("finance")}
            {...register("finance")}
          />
        </Grid2>
        <Grid2 size={4}>
          <TextField
            label={'Giai đoạn tìm kiếm'}
            defaultValue={getValues("searching")}
            {...register("searching")}
          />
        </Grid2>
        <Grid2 size={8}>
          <TextField
            label={'Ghi chú'}
            defaultValue={getValues("comments")}
            {...register("comments")}
          />
        </Grid2>
        <Grid2 container {...dStyles.containerResponsive}
          sx={{
            mb: 3,
          }}
        >
          <Grid2 size={12}>
            <Typography text={'LỊCH GẶP KHÁCH HÀNG'} sx={{ color: 'rgb(0,0,0)', fontWeight: 700 }} />
          </Grid2>
          <Grid2 size={12}>
            <DataTable
              apiRef={apiRef}
              rows={details?.filter(f => f.deleted !== true).map((r, index) => ({ ...r, id: index })) ?? []}
              actionBars={[{ key: IAction.DELETE }]}
              handleButtonClick={(key, rowId) => {
                const row = apiRef.current?.getRow(rowId);

                if (key === IAction.DELETE) {
                  const datas = details?.filter((r) => r.id !== row.id).map((r, index) => ({ ...r, id: index }));

                  setValue("details", datas, { shouldDirty: true });
                }
              }}
              columns={[
                {
                  field: 'journeydate',
                  headerName: 'Ngày',
                  width: 140,
                  type: 'dateTime',
                  sortable: false,
                  disableColumnMenu: true,
                },
                {
                  field: 'projectname',
                  headerName: 'Căn hộ',
                  sortable: false,
                  disableColumnMenu: true,
                  flex: 1,

                },
                {
                  field: 'notes',
                  headerName: 'Nội dung',
                  sortable: false,
                  disableColumnMenu: true,
                  flex: 1,

                },
                {
                  field: 'feedback',
                  headerName: 'Phản hồi từ khách hàng',
                  sortable: false,
                  disableColumnMenu: true,
                  flex: 1,

                },
                {
                  field: 'problem',
                  headerName: 'Vấn đề đang gặp',
                  sortable: false,
                  disableColumnMenu: true,
                  flex: 1,
                },
                {
                  field: 'nextstep',
                  headerName: 'Kế hoạch tiếp theo',
                  sortable: false,
                  disableColumnMenu: true,
                  flex: 1,
                },
              ]}
              onCellDoubleClick={(params) => {
                if (!params.row.arrayProject && params.row.project) params.row.arrayProject = params.row.project.split(";");
                setOpenDialog(params.row as ICustomerJourneyDetItem);
              }}
              disableColumnResize={true}
              checkboxSelection={false}
              hidePaging={true}
            />
            <Button text={'Thêm'} sx={{ color: "#A31D1D", width: '100px' }} onClick={() => {
              setOpenDialog({
                isNew: true,
                id: details?.length ?? 0,
              });
            }} />
          </Grid2>
        </Grid2>
      </Grid2>
      {openDialog && <ContentDialog
        defaultValues={openDialog}
        handleButtonClick={(row: ICustomerJourneyDetItem) => {
          if (row.isNew === true) {
            setValue("details", details ? [...details, { ...row, isNew: false }] : [{ ...row, isNew: false }], { shouldDirty: true });
          }
          else {
            const datas = details?.map((r) => r.id === row.id ? row : r);
            setValue("details", datas, { shouldDirty: true });
          }


          setOpenDialog(null);
        }}
        handleClose={() => { setOpenDialog(null) }} />}
    </Container>
  );
};

export default memo(Form);
