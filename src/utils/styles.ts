/** @format */

export default () => {
  return {
    itemResponsive: {
      xs: 12,
      sm: 12,
      md: 6,
      lg: 4,
      xl: 4,
    },
    containerResponsive: {
      columnSpacing: "35px",
      rowSpacing: "16px",
    },
    itemResponsive2Cols: {
      xs: 12,
      sm: 12,
      md: 6,
      xl: 6,
      lg: 6,
    },
    itemResponsive3Cols: {
      xs: 12,
      sm: 12,
      md: 4,
      lg: 4,
      xl: 4,
    },
    itemResponsive6Cols: {
      xs: 12,
      sm: 6,
      md: 4,
      lg: 2,
      xl: 2,
    },
    itemResponsive4Cols: {
      xs: 12,
      sm: 12,
      md: 6,
      lg: 3,
      xl: 3,
    },
    dialogPaper: {
      m: "0px",
      overflowX: "hidden",
      // backgroundColor: "rgb(18,18,18)",
      // border: '1px solid rgba(255, 255, 255, 0.12)',
    },
    dialogTitleWrapper: {
      width: "680px",
      borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
    },
    dialogTitleLabel: {
      // color: 'hsl(0, 0%, 95%)',
      fontWeight: 700,
    },
    dialogTitleButton: {
      cursor: "pointer",
      fontSize: "20px",
      m: "auto 20px auto auto",
    },
    dialogBottomWrapper: {
      height: "65px",
      justifyContent: "center",
      borderTop: '1px solid rgba(255, 255, 255, 0.12)',
    },
    dialogActionButton: {
      color: "A31D1D",
      border: '1px solid A31D1D',
    },
    boxStyle1: {
      width: "100%",
      backgroundColor: "#F2F2F2",
      px: "16px",
      pt: "12px",
      borderRadius: "8px",
      mt: 2,
    },
    tabs: {
      height: "50px",
      pt: "12px",
      "& button:first-child": {
        pl: "27px",
        alignItems: "flex-start !important",
        minWidth: "fit-content",
      },
      '& .Mui-selected': {
        color: '#A31D1D !important',
      }
    },
    tab: {
      minHeight: "38px",
      maxHeight: "38px",
      py: "0px",
      color: 'hsl(0, 0%, 65%)',
      fontWeight: 600,
    },
    rgb_standard: {
      backgroundColor: "#F2F2F2",
      borderRadius: "8px",
    },
    container: {
      width: "100%",
      py: "16px",
      overflowY: "auto",
      height: "calc(100vh - 87px)",
    },
  };
};
