export default () => {
  return {
    labelPagination: {
      color: "#858585",
      fontSize: "12px",
      lineHeight: "24px",
      my: "auto",
    },
    buttonPagination: {
      color: "#858585",
      fontSize: "1.1rem",
      my: "auto",
    },
    dataTable: {
      border: "none",
      '& .MuiDataGrid-main .MuiDataGrid-scrollbar--horizontal': {
        display: 'none !important',
      },
      "& .MuiDataGrid-main": {
        mb: "8px",
        borderRadius: '8px',
      },
      "& .MuiDataGrid-columnHeaderCheckbox": {
        width: "37px !important",
        minWidth: "37px !important",
        maxWidth: "37px !important",
      },
      '& .MuiDataGrid-scrollbarFiller': {
        borderTop: 'unset !important',
      },
      "& .MuiDataGrid-filler": {
        // '--rowBorderColor': 'transparent !important',
        backgroundColor: "transparent !important",
      },
      "& .MuiDataGrid-overlay": {
        color: 'rgb(0,0,0)',
        backgroundColor: "transparent"
      },
      "& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root": {
        padding: "9px 11px 9px 9px!important",
      },
      "& .MuiDataGrid-cellCheckbox": {
        width: "37px !important",
        minWidth: "37px !important",
        maxWidth: "37px !important",
      },
      "& .MuiDataGrid-row.Mui-selected": {
        backgroundColor: "rgba(0, 0, 0, 0.04) !important",
      },
      "& .MuiDataGrid-columnHeaders": {
        // borderTopLeftRadius: "8px",
        // borderTopRightRadius: "8px",
        '& .MuiDataGrid-row--borderBottom': {
          backgroundColor: "transparent",
        },
        "& .MuiDataGrid-columnHeader": {
          backgroundColor: "hsl(0,0%,95%)",
          height: "38px !important",
          minHeight: "38px !important",
          maxHeight: "38px !important",
          // borderBottom: "1px solid hsl(220, 20%, 25%)",
          outline: 'none !important'
        },
        '& .MuiDataGrid-columnHeader[aria-colindex="1"]': {
          '& span': {
            backgroundColor: "hsl(0,0%,95%)",
          },

        },
        "& .MuiDataGrid-filler": {
          backgroundColor: "transparent",
        },
        '& .MuiDataGrid-scrollbarFiller': {
          borderBottom: '1px solid hsl(220, 20%, 25%) !important',
        },
        '& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer svg': {
          color: 'rgb(0,0,0)',
          fontSize: '20px'
        },
        '& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer .Mui-checked svg': {
          color: "#A31D1D",
          fontSize: '20px',
        }
      },
      "& .MuiDataGrid-columnHeaderTitle": {
        fontWeight: 600,
        color: 'rgb(0,0,0)',
      },
      "& .MuiDataGrid-row": {
        // '--rowBorderColor': 'unset',
      },
      "& .MuiDataGrid-row--lastVisible": {
      },
      "& .MuiDataGrid-cell": {
        color: "rgb(0,0,0)",
        '& svg': {
          color: "hsl(220, 20%, 25%)",
          fontSize: '20px',
        },
        '& .Mui-checked svg': {
          color: "#A31D1D",
          fontSize: '20px',
        }
      },
      "& .MuiDataGrid-columnSeparator svg": {
        color: "transparent",
      },
      "& .MuiDataGrid-pinnedColumnHeaders": {
        backgroundColor: "transparent",
        minWidth: "48px",
        maxWidth: "48px",
      },
      "& .MuiDataGrid-columnHeaderReorder": {
        p: "0px",
        minWidth: "36px !important",
        maxWidth: "36px !important",
      },
      "& .MuiDataGrid-columnHeader--lastUnpinned[data-field='actions']": {
        minWidth: "48px",
        maxWidth: "48px",
        borderRight: 'none !important'
      },
      "& .MuiDataGrid-pinnedColumns .MuiDataGrid-cell": {
        padding: "10px",
      },
      "& .MuiDataGrid-rowReorderCellContainer": {
        minWidth: "36px !important",
        maxWidth: "36px !important",
      },
      "&. numberCell": {
        color: "red",
      },
      "& .cellColor.main.MuiDataGrid-cell": {
        color: "rgb(0,0,0)",
      },
      "& .cellColor.priority.MuiDataGrid-cell": {
        color: "#A31D1D",
        fontWeight: 600,
      },
      "& .cellColor.blue.MuiDataGrid-cell": {
        color: "rgb(0, 115, 230)",
        fontWeight: 600,
      },
      "& .cellColor.statusDB.MuiDataGrid-cell": {
        color: "hsl(0, 0%, 55%)",
        fontStyle: 'italic',
      },
      "& .cellColor.statusTransP.MuiDataGrid-cell": {
        color: "#A31D1D",
      },
      "& .cellColor.input": {
        backgroundColor: "#fff",
      },
      "& .cellColor.readOnly": {
        backgroundColor: "#00000008",
      },
      "& .cellColor.invalid": {
        backgroundColor: "#ffcccc",
        "& .MuiDataGrid-cellContent": {
          color: "#d8000c",
        },
      },
      "& .cellFormat.breakLine .MuiDataGrid-cellContent": {
        whiteSpace: "pre-line",
      },
    },
    baseInputEdit: {
      width: "100%",
      "& .MuiInputBase-root": { fontSize: "14px", padding: "0px !important" },
      "& .MuiInputBase-root input": {
        padding: "10px !important",
      },
      "& .MuiInputBase-root textarea": {
        padding: "10px !important",
      },
      "& fieldset": { border: "none" },
    },
  };
};
