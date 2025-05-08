/** @format */

import React, { FC, memo } from 'react';
import { Button, TextField, Dialog, DialogContent, DialogActions, DialogTitle, Stack } from '@mui/material';
import { changePassword } from 'services/api/user';
import { useForm } from 'react-hook-form';
import { IChangePwd } from 'types';
import { useUser, useNotify } from 'hooks';
import { setAuthToken, setRefreshToken } from 'utils';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutSuccess } from 'store/user/reducer';

interface IChangePassword {
    open: boolean;
    onClose?: () => void;
}

const ChangePassword: FC<IChangePassword> = ({ open, onClose }) => {
    const { info } = useUser();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error, success } = useNotify();
    const {
        handleSubmit,
        register,
        formState: { isSubmitting, errors },
    } = useForm<IChangePwd>({
        defaultValues: {
            userId: info?.userId,
            oldpassword: '',
            newpassword: '',
            confirmpasssword: '',

        }
    });
    const onSubmit = (data: IChangePwd) => {
        changePassword(data).then((rp) => {
            if (rp) {
                const rs = rp.data;
                if (!rs.success) {
                    error(rs.message);
                    return;
                }
                success('Cập nhật mật khẩu thành công. Đăng nhập lại để sử dụng')
                dispatch(logoutSuccess({ data: rs.data }));
                setAuthToken('');
                setRefreshToken('');
                navigate('/login');
                onClose?.();
            }
        });
    };

    return (
        <Dialog
            open={open}
            scroll={'paper'}
            onClose={onClose}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >
            <DialogTitle id="scroll-dialog-title">{'Thay đổi mật khẩu'}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <DialogContent dividers={true}>

                    <Stack spacing={2} width={400}>
                        <TextField

                            required
                            variant="standard"
                            type={'password'}
                            label={'Mật khẩu hiện tại'}
                            fullWidth
                            {...register('oldpassword', {
                                required: 'Mật khẩu hiện tại',
                            })}
                            error={!!errors.oldpassword}
                            helperText={errors.oldpassword?.message}
                        />
                        <TextField
                            required
                            variant="standard"
                            type={'password'}
                            label={'Mật khẩu mới'}
                            fullWidth
                            {...register('newpassword', {
                                required: 'Mật khẩu mới',
                            })}
                            error={!!errors.newpassword}
                            helperText={errors.newpassword?.message}
                        />
                        <TextField
                            required
                            variant="standard"
                            type={'password'}
                            label={'Xác nhận mật khẩu mới'}
                            fullWidth
                            {...register('confirmpasssword', {
                                required: 'Xác nhận mật khẩu mới',
                            })}
                            error={!!errors.confirmpasssword}
                            helperText={errors.confirmpasssword?.message}
                        />
                    </Stack>

                </DialogContent>
                <DialogActions>
                    <Button type='submit' disabled={isSubmitting}  >
                        {isSubmitting ? 'Đang lưu' + '...' : 'Lưu'}
                    </Button>
                    <Button onClick={() => onClose?.()} >
                        {'Hủy'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog >

    );
};

export default memo(ChangePassword);
