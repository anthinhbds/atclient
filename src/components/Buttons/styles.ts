export default () => {
  return {
    buttonIcon: {
      color: 'hsl(0, 0%, 100%)',
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "24px",
      textTransform: "none",
      pr: "0px",
      "& .MuiButton-startIcon": {
        mr: "3px !important",
      },
      "&.Mui-disabled": {
        color: "rgba(0, 0, 0, 0.4) !important", // replace with your desired color
      },
      "& svg": {
        fontSize: "16px !important",
      },
    },
    button: {
      color: 'hsl(0, 0%, 100%)',
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "24px",
      minWidth: '100px',
      textTransform: "none",
      "& .MuiButton-startIcon": {
        mr: "3px !important",
      },
      "&.Mui-disabled": {
        color: "rgba(0, 0, 0, 0.4) !important", // replace with your desired color
      },
      "& svg": {
        fontSize: "16px !important",
      },
    },
  };
};
