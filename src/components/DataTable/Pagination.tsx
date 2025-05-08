/** @format */

import React, {
  // useCallback,
  useMemo, useRef, memo
} from "react";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
  CachedOutlined,
} from "@mui/icons-material";
import { Box, Grid2, IconButton, TextField, Typography } from "@mui/material";
import createStyle from "./styles";
// import { ButtonIcon } from "components";
// import Icons from "assets/Icons";
import { IAction } from "types";

interface IPagination {
  paginationModel: { pageSize: number; page: number };
  totalRowCount?: number;
  handleButtonClick?: (key: IAction) => void;
  handleChangePage: (page: number) => void;
  handleChangePageSize: (pageSize: number) => void;
}

const Pagination = ({
  paginationModel,
  totalRowCount = 0,
  handleButtonClick,
  handleChangePage,
  handleChangePageSize,
}: IPagination) => {
  // const apiRef = useGrid2ApiContext();
  const styles = createStyle();
  const { page, pageSize } = paginationModel;
  const pageCount = Math.ceil(totalRowCount / pageSize);
  const pageSizeRef = useRef(null);

  const from = useMemo(
    () => page * +pageSize + 1,
    [pageSize, page, totalRowCount]
  );
  const to = useMemo(
    () =>
      totalRowCount < pageSize || from + pageSize - 1 > totalRowCount
        ? totalRowCount
        : from + pageSize - 1,
    [pageSize, page, totalRowCount, from]
  );


  return (
    <Box display={"flex"} marginLeft={"auto"}>
      <Typography
        sx={
          styles.labelPagination
        }>{`${from} - ${to} of ${totalRowCount}`}</Typography>
      <IconButton onClick={() => handleChangePage(0)}>
        <KeyboardDoubleArrowLeft sx={styles.buttonPagination} />
      </IconButton>
      <IconButton onClick={() => handleChangePage(+page - 1)}>
        <KeyboardArrowLeft sx={styles.buttonPagination} />
      </IconButton>
      <IconButton onClick={() => handleChangePage(+page + 1)}>
        <KeyboardArrowRight sx={styles.buttonPagination} />
      </IconButton>
      <IconButton
        onClick={() => {
          handleChangePage(pageCount - 1);
        }}>
        <KeyboardDoubleArrowRight sx={styles.buttonPagination} />
      </IconButton>
      <Grid2
        sx={{ maxWidth: `${pageSize}`.length < 4 ? 40 : 50 }}
        width="fit-content">
        <TextField
          inputRef={pageSizeRef}
          sx={{
            mt: "12px",
            width: "28px",
            "& input": {
              fontSize: "12px",
              textAlign: "center",
            },
          }}
          variant="standard"
          defaultValue={pageSize}
          onKeyDown={(event) => {
            if (event.code === "Enter") {
              pageSizeRef.current &&
                (pageSizeRef.current as HTMLInputElement).blur();
            }
          }}
          onBlur={(event) => {
            const pSize = +event.target?.value;
            handleChangePageSize(pSize);
          }}
        />
      </Grid2>
      <Box sx={{
        ml: "12px",
        alignContent: 'center',
      }}>
        <CachedOutlined
          sx={{
            color: '#858585',
            fontSize: '18px',
          }}
          onClick={() => {
            handleButtonClick?.(IAction.REFRESH);
          }}
        />
      </Box>
    </Box>
  );
};

export default memo(Pagination);
