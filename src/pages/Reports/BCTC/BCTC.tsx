import React, { memo, useEffect, useMemo, useState } from "react";
import {
    Box,
    Container,
    Divider,
    Menu,
    MenuItem,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import { DataTable, TbarLocal } from "components";
import { IModeForm } from "types";
import { ArrowDropDown } from '@mui/icons-material';
import { useUser } from 'hooks'
import { number2String } from "utils";
import { monthList } from './data';
import { getBctcByMonthly } from 'services/api/transaction';

const BCTCReportPage = () => {
    const [anchorElMonthMenu, setAnchorElMonthMenu] = useState<null | SVGSVGElement>(null);
    const [labelMonth, setLabelMonth] = useState('');
    const { info } = useUser();
    const [revenueRows, setRevenueRows] = useState<any[]>([]);
    const [expenseRows, setExpenseRows] = useState<any[]>([]);

    const totalRevenue = useMemo(() => {
        return revenueRows.length === 0 ? 0 : revenueRows.reduce((acc, item) => acc + item.amount, 0);
    }, [revenueRows]);
    const totalExpense = useMemo(() => {
        return expenseRows.length === 0 ? 0 : expenseRows.reduce((acc, item) => acc + item.amount, 0);
    }, [expenseRows]);


    useEffect(() => {
        setLabelMonth(`${String(new Date().getMonth() + 1).padStart(2, "0")}/${new Date().getFullYear()}`);
        getBctcByMonthly({
            revenuetype: "T",
            month: new Date().getMonth() + 1
        }, (rp) => {
            const rs = rp.data;
            if (rs.success) {
                setRevenueRows(rs.data);
            }
        });
        getBctcByMonthly({
            revenuetype: "C",
            month: new Date().getMonth() + 1
        }, (rp) => {
            const rs = rp.data;
            if (rs.success) {
                setExpenseRows(rs.data);
            }
        });
    }, []);


    return (
        <Box width={1} height={1} sx={{ backgroundColor: 'rgb(238, 238, 238)' }}>
            <TbarLocal
                formMode={IModeForm.VIEW}
                title={"Tổng quan thu chi"}
                buttons={[]}
            />
            <Container>
                <Box p={2}>
                    <Paper sx={{ px: 3, py: 2 }}>
                        <Box display={'flex'}>
                            <Typography my={1} color='#A31D1D' variant="h6">{`Tổng quan thu chi tháng ${labelMonth}`}</Typography>
                            <Box ml={0.5} display={'flex'}>
                                <ArrowDropDown sx={{ my: 'auto' }} onClick={(e) => { setAnchorElMonthMenu(e.currentTarget); }} />
                            </Box>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Stack direction="row" spacing={1} mb={1}>
                            <Typography variant="subtitle1" fontWeight={700} width={135}> - Tổng thu:</Typography>
                            <Box display={'flex'} width={60} justifyContent={'end'}>
                                <Typography variant="subtitle1" fontWeight={700}>{number2String(totalRevenue)}</Typography>
                            </Box>

                        </Stack>
                        <Stack direction="row" spacing={1} mb={1}>
                            <Typography variant="subtitle1" fontWeight={700} width={135} color={'#A31D1D'}> - Tổng chi:</Typography>
                            <Box display={'flex'} width={60} justifyContent={'end'}>
                                <Typography variant="subtitle1" fontWeight={700} color={'#A31D1D'}>{number2String(totalExpense)}</Typography>
                            </Box>

                        </Stack>
                        <Stack direction="row" spacing={1} mb={1}>
                            <Typography variant="subtitle1" fontWeight={700} width={135} color={'#187C19'}> - Chênh lệch:</Typography>
                            <Box display={'flex'} width={60} justifyContent={'end'}>
                                <Typography variant="subtitle1" fontWeight={700} color={'#187C19'}>{number2String(totalRevenue - totalExpense)}</Typography>
                            </Box>

                        </Stack>
                        <Box width={1} my={2} display={'flex'} justifyContent={'center'}>
                            <Typography my={1} variant="h6">{`Chi tiết các khoản thu`}</Typography>
                        </Box>
                        <DataTable
                            rows={revenueRows.map((r, index) => ({ ...r, id: index }))}
                            checkboxSelection={false}
                            hidePaging={true}
                            columns={[
                                { field: 'linenum', headerName: 'Đợt', width: 40 },
                                { field: 'date', headerName: 'Ngày', width: 100, type: 'date' },
                                { field: 'description', headerName: 'Nội dung', flex: 1 },
                                { field: 'amount', headerName: 'Số tiền', width: 180, type: 'number' },
                            ]}
                        />
                        <Box width={1} my={2} display={'flex'} justifyContent={'center'}>
                            <Typography my={1} variant="h6">{`Chi tiết các khoản chi`}</Typography>
                        </Box>
                        <DataTable
                            rows={expenseRows.map((r, index) => ({ ...r, id: index }))}
                            checkboxSelection={false}
                            hidePaging={true}
                            columns={[
                                { field: 'date', headerName: 'Ngày', width: 100, type: 'date' },
                                { field: 'description', headerName: 'Nội dung', flex: 1 },
                                { field: 'amount', headerName: 'Số tiền', width: 180, type: 'number' },
                            ]}
                        />
                    </Paper>
                    <Menu
                        id="basic-menu-home-user"
                        anchorEl={anchorElMonthMenu}
                        open={!!anchorElMonthMenu}
                        onClose={() => {
                            setAnchorElMonthMenu(null);
                        }}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        {monthList.map((item, index) => (
                            <MenuItem key={index} onClick={() => {
                                if (info && info.userId) {
                                    setLabelMonth(item.label);
                                    getBctcByMonthly({
                                        revenuetype: "T",
                                        month: item.value
                                    }, (rp) => {
                                        const rs = rp.data;
                                        if (rs.success) {
                                            setRevenueRows(rs.data);
                                        }
                                    });
                                    getBctcByMonthly({
                                        revenuetype: "C",
                                        month: item.value
                                    }, (rp) => {
                                        const rs = rp.data;
                                        if (rs.success) {
                                            setExpenseRows(rs.data);
                                        }
                                    });
                                }
                                setAnchorElMonthMenu(null);
                            }}>{item.label}</MenuItem>
                        ))}
                    </Menu>
                </Box >
            </Container >
        </Box>

    );
}

export default memo(BCTCReportPage);