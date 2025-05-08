import React, {
  memo,
  useEffect,
  // useMemo,
  useState,
  // useRef,
  // useEffect
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
  DateField,
  NumberField,
  Typography,
  DataTable,
  Button,
  // Checkbox,
  // NumberField,
  // DataTable,
  // Button,
} from "components";
import {
  ITransactionItem,
  SourceTransactionType,
  SourceTransactionStatus,
  ITransactionDetail,
  ITransactionMember,
  IAction,
  ITransactionType,
  // IApartmentStatus,
  // IAction,
} from "types";
import {
  UseFormReturn,
  useWatch,
  // useWatch
} from "react-hook-form";
import { getCombo as getApartment } from "services/api/apartment";
import { useGridApiRef } from "@mui/x-data-grid";
import { getTransactionNo } from 'services/api/transaction';
import { getDetails, getMembers } from 'services/api/transaction';
import { getAll as getCustomer } from 'services/api/customer';
import defaultStyle from "utils/styles";
import dayjs from "dayjs";
import DetailDialog from "./DetailDialog";
import MemberDialog from "./MemberDialog";

interface IForm {
  useForm: UseFormReturn<ITransactionItem>;
  keyNum?: number;
}
const Form = ({ useForm, keyNum = 0 }: IForm) => {
  const dStyles = defaultStyle();
  const apiRef = useGridApiRef();
  const [openDialog, setOpenDialog] = useState<{
    detail: boolean;
    member: boolean;
    data: any;
  }>({
    detail: false,
    member: false,
    data: null
  });
  const {
    getValues,
    setValue,
    register,
    control
  } = useForm;
  const transId = useWatch({ control, name: "transId" });
  const details = useWatch({ control, name: "details" });
  const members = useWatch({ control, name: "members" });
  const transtype = useWatch({ control, name: "transtype" });
  useWatch({ control, name: "transno" });
  useWatch({ control, name: "description" });

  useEffect(() => {
    if (transId) {
      getDetails(transId, (rp) => {
        const rs = rp.data;
        if (rs.success) {
          setValue("details", rs.data);
        }
      });
      getMembers(transId, (rp) => {
        const rs = rp.data;
        if (rs.success) {
          setValue("members", rs.data);
        }
      });
    }
  }, [transId]);

  return (
    <Container key={keyNum} maxWidth="md" sx={dStyles.container}>
      <Grid2 container {...dStyles.containerResponsive} mb={3} mx={2}>
        <Grid2 size={8}>
          <Autocomplete
            autoFocus
            required
            label={'Loại phiếu'}
            defaultValue={getValues("transtype")}
            store={{
              mode: 'local',
              data: SourceTransactionType.filter(f => f.type === 'T'),
            }}
            {...register("transtype", {
              required: true,
              onChange: (e) => {
                const v = e.target.value;
                if (v && (v === ITransactionType.PMGB || v === ITransactionType.PMGT)) {
                  getTransactionNo({ transtype: v }, (rp => {
                    const rs = rp.data;
                    if (rs.success) {
                      setValue("transno", rs.data, { shouldDirty: true });
                    }
                  }));
                }
                else {
                  setValue("transno", '', { shouldDirty: true });
                }
              }
            })}
          />
        </Grid2>
        <Grid2 size={dStyles.itemResponsive}>
          <DateField
            label={'Ngày'}
            required
            defaultValue={getValues("transdate")}
            {...register("transdate", {
              required: true,
            })}
          />
        </Grid2>
        <Grid2 size={(transtype === ITransactionType.PMGB || transtype === ITransactionType.PMGT) ? 8 : 12}>
          <Autocomplete
            label={'Căn hộ'}
            required={(transtype === ITransactionType.PMGB || transtype === ITransactionType.PMGT) ? true : false}
            idField="apartmentId"
            textField="displayapartment"
            defaultValue={getValues("objectId")}
            store={{
              fnGetData: getApartment,
              // params: {
              //   filter: [
              //     { property: "status", method: "eq", value: IApartmentStatus.HD }
              //   ]
              // }
            }}
            {...register("objectId", {
              required: (transtype === ITransactionType.PMGB || transtype === ITransactionType.PMGT) ? 'Chưa nhập Căn hộ' : false,
              onChange: (e) => {
                const rec = e.target.rec;
                if (rec) {
                  const type = getValues("transtype");
                  let s = '';
                  if (type === ITransactionType.PMGB) s = `Thu phí môi giới bán căn hộ ${rec.text}`;
                  else s = `Thu phí môi giới cho thuê căn hộ ${rec.text}`;
                  setValue("description", s, { shouldDirty: true });
                }
              }
            })}
          />
        </Grid2>
        {(transtype === ITransactionType.PMGB || transtype === ITransactionType.PMGT) && (
          <Grid2 size={4}>
            <Autocomplete
              label={'Khách hàng'}
              idField="customerId"
              textField="displaycustomer"
              defaultValue={getValues("customerId")}
              store={{
                fnGetData: getCustomer,
              }}
              {...register("customerId")}
            />
          </Grid2>
        )}
        <Grid2 size={dStyles.itemResponsive}>
          <TextField
            label={'Số phiếu'}
            defaultValue={getValues("transno")}
            {...register("transno")}
          />
        </Grid2>
        <Grid2 size={dStyles.itemResponsive}>
          <NumberField
            label={'Số tiền'}
            required
            defaultValue={getValues("totalamount")}
            {...register("totalamount", {
              required: 'Chưa nhập Số tiền',
              validate: (v => {
                if (!v || v <= 0) return "Số tiền phải lớn hơn 0";
                return true;
              })
            })}
          />
        </Grid2>
        <Grid2 size={dStyles.itemResponsive}>
          <Autocomplete
            label={'Tình trạng'}
            defaultValue={getValues("status")}
            required
            store={{
              mode: 'local',
              data: SourceTransactionStatus
            }}
            {...register("status", {
              required: true,
            })}
          />
        </Grid2>
        <Grid2 size={12}>
          <TextField
            label={'Nội dung'}
            defaultValue={getValues("description")}
            {...register("description")}
          />
        </Grid2>
        <Grid2 size={12}>
          <TextField
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
          <Typography text={'Đợt thu'} sx={{ color: 'rgb(0,0,0)', fontWeight: 700 }} />
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
                field: 'date',
                headerName: 'Ngày',
                width: 100,
                type: 'date',
              },
              {
                field: 'amount',
                headerName: 'Số tiền',
                width: 120,
                type: 'number',
              },
              {
                field: 'notes',
                headerName: 'Ghi chú',
                flex: 1,

              },
            ]}
            onCellDoubleClick={(params) => {
              setOpenDialog({
                detail: true,
                member: false,
                data: params.row as ITransactionDetail
              });
            }}
            disableColumnResize={true}
            checkboxSelection={false}
            hidePaging={true}
          />
          <Button
            text={'Thêm đợt thu'}
            sx={{ color: "#A31D1D", width: '140px' }}
            onClick={() => {
              setOpenDialog({
                detail: true,
                member: false,
                data: {
                  date: dayjs().format("YYYY-MM-DD"),
                  notes: "",
                }
              });
            }} />
        </Grid2>
      </Grid2>
      <Grid2 container {...dStyles.containerResponsive}
        sx={{
          mb: 3,
        }}
      >
        <Grid2 size={12}>
          <Typography text={'Nhân viên'} sx={{ color: 'rgb(0,0,0)', fontWeight: 700 }} />
        </Grid2>
        <Grid2 size={12}>
          <DataTable
            apiRef={apiRef}
            rows={members?.filter(f => f.deleted !== true).map((r, index) => ({ ...r, id: index })) ?? []}
            actionBars={[{ key: IAction.DELETE }]}
            handleButtonClick={(key, rowId) => {
              const row = apiRef.current?.getRow(rowId);

              if (key === IAction.DELETE) {
                const datas = members?.map((r) => r.linenum === row.linenum ? { ...row, deleted: true } : r);
                setValue("members", datas, { shouldDirty: true });

              }
            }
            }
            columns={[
              {
                field: 'userId',
                headerName: 'Nhân viên',
                width: 100,
              },
              {
                field: 'rate',
                headerName: 'Tỷ lệ %',
                width: 120,
                type: 'number',
              },
              {
                field: 'notes',
                headerName: 'Ghi chú',
                flex: 1,

              },
            ]}
            onCellDoubleClick={(params) => {
              setOpenDialog({
                detail: false,
                member: true,
                data: params.row as ITransactionMember
              });
            }}
            disableColumnResize={true}
            checkboxSelection={false}
            hidePaging={true}
          />
          <Button
            text={'Thêm nhân viên'}
            sx={{ color: "#A31D1D", width: '140px' }}
            onClick={() => {
              setOpenDialog({
                detail: false,
                member: true,
                data: {
                  rate: 0,
                }
              });
            }} />
        </Grid2>
      </Grid2>
      {openDialog.detail && <DetailDialog
        defaultValues={openDialog.data as ITransactionDetail}
        handleButtonClick={(row: ITransactionDetail) => {
          if (!row.linenum) {
            const maxLine = details ? (details.length + 1) : 1
            setValue("details", details ? [...details, { ...row, linenum: maxLine }] : [{ ...row, linenum: maxLine }], { shouldDirty: true });
          }
          else {
            const datas = details?.map((r) => r.linenum === row.linenum ? row : r);
            setValue("details", datas, { shouldDirty: true });
          }
          setOpenDialog({
            detail: false,
            member: false,
            data: null
          });
        }}
        handleClose={() => {
          setOpenDialog({
            detail: false,
            member: false,
            data: null
          })
        }} />}
      {openDialog.member && <MemberDialog
        defaultValues={openDialog.data as ITransactionMember}
        handleButtonClick={(row: ITransactionMember) => {
          if (!row.linenum) {
            const maxLine = members ? (members.length + 1) : 1
            setValue("members", members ? [...members, { ...row, linenum: maxLine }] : [{ ...row, linenum: maxLine }], { shouldDirty: true });
          }
          else {
            const datas = members?.map((r) => r.linenum === row.linenum ? row : r);
            setValue("members", datas, { shouldDirty: true });
          }
          setOpenDialog({
            detail: false,
            member: false,
            data: null
          });
        }}
        handleClose={() => {
          setOpenDialog({
            detail: false,
            member: false,
            data: null
          })
        }} />}
    </Container>
  );
};

export default memo(Form);
