import React, { memo, useEffect, useState } from "react";
import {
    Box,
    Container,
    FormControl,
    Grid2,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import { TbarLocal, Autocomplete, Button, DataTable } from "components";
import { useForm, useWatch } from 'react-hook-form';
import { getCombo } from 'services/api/customer';
import { getHistory } from 'services/api/history';
import { IModeForm, IHistoryItem } from "types";

const HistoryPage = () => {
    const [rows, setRows] = useState<IHistoryItem[]>([]);
    const [referenceConfig, setReferenceConfig] = useState<{
        idField: string,
        textField: string,
        store: any
    }>({
        idField: 'id',
        textField: 'name',
        store: {
            method: 'local',
            data: [
            ]
        }
    });
    const { register, getValues, setValue, control } = useForm<{
        referenceId: string,
        formId: string,
    }>();
    const formId = useWatch({ control, name: 'formId' });
    const handleFormChange = (event: any) => {
        setValue('formId', event.target.value);
    }

    const handleSearchClick = () => {
        const referenceId = getValues('referenceId');
        const formId = getValues('formId');
        if (formId && referenceId) {
            getHistory({ formId, referenceId }, (rp) => {
                const rs = rp.data;
                if (rs.success) {
                    const data = rs.data.map((r: any) => {
                        const actiontype = r.actiontype === 'C' ? 'Thêm' : (r.actiontype === 'U' ? 'Cập nhật' : r.actiontype === 'D' ? 'Xóa' : 'Khác');
                        const userId = r.userId === 'DTD' ? 'Diễm' : (r.userId === 'NNT' ? 'Thi' : r.userId === 'PTM' ? 'Mỹ' : 'Khác');
                        return { ...r, actiontype, userId };

                    })
                    setRows(data);
                }
            });
        }
    };

    useEffect(() => {
        if (formId) {
            if (formId === 'CUS') {
                setReferenceConfig({
                    idField: 'customerId',
                    textField: 'displaycustomer',
                    store: {
                        method: 'remote',
                        fnGetData: getCombo
                    }
                });
            }
        }
    }, [formId]);
    return (
        <Box width={1} height={1} sx={{ backgroundColor: 'rgb(238, 238, 238)' }}>
            <TbarLocal
                formMode={IModeForm.VIEW}
                title={"Lịch sử thao tác"}
                buttons={[]}
            />
            <Container maxWidth={'md'}>
                <Grid2 container size={12} sx={{ mt: 3 }} spacing={3} >
                    <Grid2 size={4}>
                        <FormControl fullWidth>
                            <InputLabel>Form</InputLabel>
                            <Select
                                name="formId"
                                variant="standard"
                                onChange={handleFormChange}
                            >
                                <MenuItem value={'CUS'}>Khách hàng</MenuItem>
                                <MenuItem value={'APT'}>Chính chủ</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid2>
                    <Grid2 size={8} >
                        <Autocomplete
                            label='Đối tượng'
                            {...referenceConfig}
                            {...register('referenceId')}
                        />
                    </Grid2>
                    <Grid2 size={4} display={'flex'}>
                        <Button text="Tìm kiếm" sx={{ color: '#A31D1D' }} onClick={handleSearchClick} />
                    </Grid2>
                    <Grid2 size={12}>
                        <DataTable
                            checkboxSelection={false}
                            hidePaging={true}
                            disableColumnMenu={true}
                            disableColumnSorting={true}
                            disableColumnResize={true}
                            rows={(rows && rows.length > 0) ? rows.map((r, idx) => ({ ...r, id: idx })) : []}
                            columns={[
                                { field: 'actiondate', headerName: 'Ngày thực hiện', width: 125, type: 'dateTime' },
                                { field: 'actiontype', headerName: 'Hành động', width: 100 },
                                { field: 'contentlog', headerName: 'Nội dung', flex: 1 },
                                { field: 'userId', headerName: 'Nhân viên', width: 90 },
                            ]}
                        />
                    </Grid2>
                </Grid2>
            </Container >
        </Box>

    );
}

export default memo(HistoryPage);