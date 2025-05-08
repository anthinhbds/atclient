/** @format */
import React, { memo, useRef, useEffect } from 'react';
// import { CameraAlt, Check } from '@mui/icons-material';
import {
  Avatar, Box,
  //  CircularProgress, Input, 
  Typography,
} from '@mui/material';
import { useUser } from 'hooks';
import createStyle from '../styles';
import { useForm } from 'react-hook-form';

const Info = () => {
  // const { updateAvatar, info, isSaving } = useUser();
  const styles = createStyle();
  const { info } = useUser();
  const { watch } = useForm();
  const imgRef = useRef<any>(null);

  useEffect(() => {
    const subscription = watch(value => {
      const file = value?.file?.[0] as File;
      // console.log("THIS FILE", file, value);
      imgRef.current = null
      if (!file.type?.includes('image')) {
        // return error('text.format_invalid', { useI18n: true });
      }

      // return setState(oldS => ({ ...oldS, file: value?.file?.[0] }));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const showPicker = () => {
    imgRef.current?.click();
  };
  // const onUpdateAvatar = (data: any) => {
  //   const formData = new FormData();
  //   formData.append("file", data?.file?.[0]);
  //   // updateAvatar(formData);
  // }

  return (
    <Box sx={styles.wrapOpAvContent}>
      <Box sx={styles.flexCenter}>
        <Box sx={styles.wrapOptAvatar}>
          <Box sx={styles.avatarBox}>
            <Avatar sx={styles.avatar} onClick={showPicker}>
              U
            </Avatar>
            {/* <Box sx={styles.cameraBox}>
              {isSaving ? <CircularProgress sx={styles.camera} />
                : state.file ? (
                  <Check sx={styles.camera} onClick={handleSubmit(onUpdateAvatar)} />)
                  : (
                    <CameraAlt sx={styles.camera} onClick={showPicker} />
                  )}
            </Box> */}
          </Box>
        </Box>
      </Box>
      {/* {info ? <Input
        inputProps={{ accept: "image/png, image/gif, image/jpeg" }}
        inputRef={imgRef}
        type={'file'}
        sx={{ display: 'none' }}
        {...register('file')}
      />
        : <></>} */}
      <div style={{ marginTop: "8px", textAlign: 'center', color: 'hsl(0,0%,95%)' }}>
        <Typography >{info?.name}</Typography>
        <Typography>{info?.userId}</Typography>
      </div>
    </Box >
  );
};

export default memo(Info);
