import React, {
    // useCallback, useState, useEffect, useMemo 
} from "react";
import createStyles from './style';
import {
    Box,
    Button,
    Grid2,
} from "@mui/material";
import { Typography, TextField } from 'components';
import { ILoginParams } from 'types';
import { login } from 'services/api/user';
import { setAuthToken, setRefreshToken } from 'utils';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from 'store/user/reducer';

export default function MainPage() {
    const dispatch = useDispatch();
    const styles = createStyles();
    const navigate = useNavigate();
    const { register, getValues, control } = useForm<ILoginParams>();
    const userId = useWatch({ control, name: 'userId' });
    const password = useWatch({ control, name: 'password' });
    return (
        <Box sx={styles.loginBody}>
            <Box sx={{
                width: '400px',
                p: 0,
                backgroundColor: 'hsl(0,0%,100%)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)',
            }}
            >
                <Box sx={{ justifyItems: 'center', px: 4, py: 4 }}>
                    <Typography
                        sx={{
                            color: '#A31D1D',
                            fontWeight: 700
                        }}
                        variant="h5"
                        text={'An Thịnh - Real Estate'}
                    />
                    <Grid2 mt={5} container rowSpacing={3}>
                        <Grid2 size={12}>
                            <TextField
                                fullWidth
                                label="Tên đăng nhập"
                                defaultValue={getValues('userId')}
                                {...register('userId')}
                            />
                        </Grid2>
                        <Grid2 size={12}>
                            <TextField
                                fullWidth
                                label="Mật khẩu"
                                type="password"
                                defaultValue={getValues('password')}
                                {...register('password')}
                            />
                        </Grid2>
                        <Grid2 size={12}>
                            <Button
                                fullWidth
                                sx={{
                                    mt: 3,
                                    color: '#A31D1D',
                                    border: '1px solid hsla(348, 96%, 42%)',
                                    textTransform: 'none',
                                    fontWeight: 600
                                }}
                                onClick={() => {
                                    if (userId && password) {
                                        login({ userId, password }, (rp) => {
                                            const rs = rp.data;
                                            if (rs && rs.success && rs.data) {
                                                dispatch(loginSuccess({ data: rs.data }));
                                                setAuthToken(rs.data.accessToken);
                                                setRefreshToken(rs.data.refreshToken);
                                                navigate('/');
                                            }
                                            else alert('Mật khẩu hoặc tên đăng nhập không đúng');
                                        });
                                    }
                                    else {
                                        alert('Vui lòng nhập đầy đủ thông tin đăng nhập');
                                    }
                                }}
                            >
                                Đăng nhập
                            </Button>
                        </Grid2>
                    </Grid2>
                    <Box mt={2}>
                        <Typography sx={{ color: 'rgb(0,0,0)', textDecoration: 'underline' }} variant="caption" text={'Quên mật khẩu?'} />
                    </Box>
                </Box>
            </Box>
        </Box >
    );
}
