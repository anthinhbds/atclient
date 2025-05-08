
// import { useTheme } from "@mui/material/styles";
export default () => {
  // const theme = useTheme();
  return {
    drawer: {
      "& .MuiAvatar-root": {
        backgroundColor: '#A31D1D',
        color: '#FFF !important',
      },
      "& svg": {
        color: '#FFF',
      },
    },
    listItem: {
      p: "0px",
      "& .MuiAvatar-root": {
        m: "10px",
        width: "28px",
        height: "28px",
        borderRadius: "5px",
      },
      "& svg": {
        m: "10px",
        width: "28px",
        height: "28px",
        color: "#FFF",
        borderRadius: "5px",
      },
      "& p": {
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "4px",
        my: "auto",
      },
    },
    listItemButton: {
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        "& .MuiTypography-root": {
          color: "#A31D1D",
        },
      },
      p: "0px 12px 0px 0px",
      "& .MuiAvatar-root": {
        m: "13px",
        width: "28px",
        height: "28px",
        color: "#A31D1D",
        borderRadius: "5px",
      },
      "& .MuiTypography-root": {
        fontSize: "16px",
        fontWeight: 700,
        color: "#A31D1D",
        lineHeight: "24px",
        my: "auto",
      },
      "& svg": {
        color: "#A31D1D",
      },
    },
    listItemButtonNoChild: {
      p: "0px 12px 0px 54px",
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        "& .MuiTypography-root": {
          color: "hsl(220, 30%, 7%)",
        },
      },
      "& .MuiTypography-root": {
        fontSize: "16px",
        color: "hsl(220, 30%, 7%)",
        lineHeight: "24px",
        my: "8px",
      },
    },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: "#E3E3E3",
    },
  };
};
