import { useTheme } from "@mui/material/styles";

export default () => {
  const theme = useTheme();
  return {
    tbarLocal: {
      px: "18px !important",
      width: "100%",
      minHeight: "50px !important",
      backgroundColor: theme.palette.primary.main,
    },
    labelForm: {
      // fontWeight: 500,
      fontSize: "18px",
      lineHeight: "50px",
      color: 'hsl(0, 0%, 100%)'
    },
    content: {
      // fontWeight: 500,
      fontSize: "14px",
      color: 'hsl(0, 0%, 65%)',
      lineHeight: "14px",
      mt: "18px",
    },
  };
};
