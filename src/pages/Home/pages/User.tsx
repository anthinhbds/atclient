import React, { memo, useMemo, useEffect, useState, useRef } from "react";
import {
    Box,
    Divider,
    Menu,
    MenuItem,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import { ArrowDropDown } from '@mui/icons-material';
import { useHome, useUser } from 'hooks'
import { number2String } from "utils";
import { monthList } from './data';
import { EClaimType, IUserItem } from "types";
import { getCombo } from 'services/api/user'
// import { LineChart } from '@mui/x-charts';

const UserHome = () => {
    const [anchorElMenu, setAnchorElMenu] = useState<null | SVGSVGElement>(null);
    const [anchorUserElMenu, setAnchorUserElMenu] = useState<null | SVGSVGElement>(null);
    const [userList, setUserList] = useState<IUserItem[]>([]);
    const refSelected = useRef({
        month: 0,
        userId: ''
    });
    const [labelMonth, setLabelMonth] = useState('');
    const [labelUser, setLabelUser] = useState('');
    const { info } = useUser();
    const { reveneUserData, getRevenueMonthlyByUser } = useHome();


    const totalRevenue = useMemo(() => {
        return reveneUserData.length === 0 ? 0 : reveneUserData.reduce((acc, item) => acc + (item.rate / 100 * item.amount), 0);
    }, [reveneUserData]);

    const realAmount = useMemo(() => {
        let amount = 0;
        let temp = totalRevenue;
        if (temp > 10000000) {
            amount += 3000000;
            temp -= 10000000;
            if (totalRevenue > 40000000) {
                amount += 10500000;
                temp -= 40000000;
                if (temp > 0) {
                    amount += temp * 0.4;
                }
            }
            else {
                amount += temp * 0.35;
            }
        }
        else {
            amount = totalRevenue * 0.3;
        }

        return amount;
    }, [totalRevenue]);

    useEffect(() => {
        if (info && info.userId) {
            setLabelMonth(`${String(new Date().getMonth() + 1).padStart(2, "0")}/${new Date().getFullYear()}`);
            setLabelUser(info.name ?? '');
            refSelected.current.month = new Date().getMonth() + 1;
            refSelected.current.userId = info.userId;

            getRevenueMonthlyByUser({ userId: info.userId, month: new Date().getMonth() + 1 });
        }
    }, [info]);

    useEffect(() => {
        getCombo({}, (rp) => {
            const rs = rp.data;
            if (rs.success) {
                setUserList(rs.data);
            }
        })
    }, []);

    return (
        <Box p={2}>
            <Paper sx={{ px: 3, py: 2 }}>
                <Box display={'flex'}>
                    <Typography my={1} color='#A31D1D' variant="h6">{`Doanh thu tháng ${labelMonth}`}</Typography>
                    <Box ml={0.5} display={'flex'}>
                        <ArrowDropDown sx={{ my: 'auto' }} onClick={(e) => { setAnchorElMenu(e.currentTarget); }} />
                    </Box>
                </Box>
                {info && info.claimType?.indexOf(EClaimType.ADMIN) !== -1 && (<Box display={'flex'}>
                    <Typography
                        my={1}
                        variant="subtitle1"
                        fontWeight={700}
                        color='rgb(1, 87, 155)'
                    >{`Nhân viên: ${labelUser}`}</Typography>
                    <Box ml={0.5} display={'flex'}>
                        <ArrowDropDown sx={{ my: 'auto' }} onClick={(e) => { setAnchorUserElMenu(e.currentTarget); }} />
                    </Box>
                </Box>)}
                <Stack spacing={1} mb={2} >
                    <Stack
                        direction="row"
                        spacing={3}
                        mb={1}
                    >
                        <Box flex={1}>
                            <Typography sx={{ fontWeight: 700 }}>Nội dung</Typography>
                        </Box>
                        <Box width={100} display={'flex'} justifyContent={'center'}>
                            <Typography sx={{ fontWeight: 700 }}>Đợt</Typography>
                        </Box>
                        <Box width={100} display={'flex'} justifyContent={'end'}>
                            <Typography sx={{ fontWeight: 700 }}>Phí môi giới</Typography>
                        </Box>
                        <Box width={100} display={'flex'} justifyContent={'center'}>
                            <Typography sx={{ fontWeight: 700 }}>Hoa hồng(%)</Typography>
                        </Box>
                        <Box width={100} display={'flex'} justifyContent={'end'}>
                            <Typography sx={{ fontWeight: 700 }}>Doanh thu</Typography>
                        </Box>
                    </Stack>
                    {reveneUserData.length > 0 &&
                        reveneUserData.map((item, index) => {
                            const amount = number2String(item.amount);
                            const net = number2String(item.rate / 100 * item.amount);
                            return (
                                <Stack direction="row" spacing={3} key={index}>
                                    <Box flex={1}>
                                        <Typography sx={{ fontSize: '14px' }}>{item.description}</Typography>
                                    </Box>
                                    <Box width={100} display={'flex'} justifyContent={'center'}>
                                        <Typography sx={{ fontSize: '14px' }}>{item.linenum}</Typography>
                                    </Box>
                                    <Box width={100} display={'flex'} justifyContent={'end'}>
                                        <Typography sx={{ fontSize: '14px' }}>{amount}</Typography>
                                    </Box>
                                    <Box width={100} display={'flex'} justifyContent={'center'}>
                                        <Typography sx={{ fontSize: '14px' }}>{item.rate}</Typography>
                                    </Box>
                                    <Box width={100} display={'flex'} justifyContent={'end'}>
                                        <Typography sx={{ fontSize: '14px' }}>{net}</Typography>
                                    </Box>
                                </Stack>
                            )
                        })
                    }
                </Stack>
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" spacing={1} mb={0.5}>
                    <Typography variant="subtitle2" width={150}>Tổng doanh thu:</Typography>
                    <Box display={'flex'} width={60} justifyContent={'end'}>
                        <Typography variant="subtitle2">{number2String(totalRevenue)}</Typography>
                    </Box>

                </Stack>
                <Stack direction="row" spacing={1}>
                    <Typography fontWeight={600} variant="subtitle1" width={150}>Số tiền thực lãnh:</Typography>
                    <Box display={'flex'} width={60} justifyContent={'end'}>
                        <Typography fontWeight={600} variant="subtitle1">{number2String(realAmount)}</Typography>
                    </Box>
                </Stack>
            </Paper>
            {/* <Stack direction={'row'} columnGap={3}>
                <Paper sx={{ px: 3, py: 2, mt: 2, width: '50%', height: 250 }}>
                    <Typography color='#A31D1D' variant="h6">{`Chính chủ +12`}</Typography>
                    <Box width={1} height={1}>
                        <LineChart
                            xAxis={[{ data: [1, 2, 3,] }]}
                            series={[
                                {
                                    data: [2, 5.5, 2,],
                                },
                            ]}
                            sx={{
                                width: '100%',
                                height: '100%',
                            }}

                        />
                    </Box>
                </Paper>
                <Paper sx={{ px: 3, py: 2, mt: 2, width: '50%', height: 250 }}>
                    <Typography color='#A31D1D' variant="h6">{`Khách hàng +5`}</Typography>
                    <Box width={1} height={1}>
                        <LineChart
                            xAxis={[{ data: [1, 2, 3,] }]}
                            series={[
                                {
                                    data: [2, 5.5, 2,],
                                },
                            ]}
                            sx={{
                                width: '100%',
                                height: '100%',
                            }}

                        />
                    </Box>
                </Paper>
            </Stack> */}
            <Menu
                id="basic-menu-home-month"
                anchorEl={anchorElMenu}
                open={!!anchorElMenu}
                onClose={() => {
                    setAnchorElMenu(null);
                }}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {monthList.map((item, index) => (
                    <MenuItem key={index} onClick={() => {
                        if (info && info.userId) {
                            setLabelMonth(item.label);
                            refSelected.current.month = item.value;
                            getRevenueMonthlyByUser({ userId: refSelected.current.userId, month: refSelected.current.month });
                        }
                        setAnchorElMenu(null);
                    }}>{item.label}</MenuItem>
                ))}
            </Menu>
            <Menu
                id="basic-menu-home-user"
                anchorEl={anchorUserElMenu}
                open={!!anchorUserElMenu}
                onClose={() => {
                    setAnchorUserElMenu(null);
                }}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {userList.map((item, index) => (
                    <MenuItem key={index} onClick={() => {
                        if (info && info.userId) {
                            setLabelUser(item.name ?? '');
                            refSelected.current.userId = item.userId ?? '';
                            getRevenueMonthlyByUser({ userId: refSelected.current.userId, month: refSelected.current.month });
                        }
                        setAnchorUserElMenu(null);
                    }}>{item.name}</MenuItem>
                ))}
            </Menu>
        </Box >
    );
}

export default memo(UserHome);