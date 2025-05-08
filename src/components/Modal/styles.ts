export default () => {
  return {
    dialog: {
      p: 2,
      '& .MuiDialog-paper': {
        backgroundColor: 'hsl(220, 30%, 7%)'
      }
    },
    dialogTitle: {
      minWidth: "300px",
      fontWeight: 700,
      fontSize: "16px",
      color: 'hsl(0,0%,85%)',
    },
    dialogContent: {
      borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
      borderTop: "1px solid rgba(0, 0, 0, 0.12)",
      minWidth: "420px",
      minHeight: "50px",
    },
    dialogButton: {
      color: 'hsl(0,0%,85%)',
      fontSize: "16px",
      textTransform: 'none',
      minWidth: "66px"
    },
  };
};
