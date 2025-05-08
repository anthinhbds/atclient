import React, { memo } from "react";

import {
  Box,
  Typography,
} from "@mui/material";

interface IDisplayField {
  label: string;
  value: any;
}
const DisplayField = ({
  label,
  value,
}: IDisplayField) => {

  return (
    <Box>
      <Typography variant="body2" color={'rgba(0, 0, 0, 0.6)'} mb={'2px'}> {label}</Typography>
      <Typography variant="body1"> {value}</Typography>
    </Box>
  );
};

export default memo(DisplayField);
