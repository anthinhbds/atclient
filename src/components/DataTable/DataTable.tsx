import React, {
  useMemo,
  useCallback,
  memo,
  useEffect,
  useState,
  useRef,
  // useLayoutEffect,
} from "react";
import {
  DataGrid,
  DataGridProps,
  useGridApiRef,
  GridPaginationModel,
  GridColumnMenu,
  GridColumnMenuProps,
  GridCellEditStopReasons,
  GridCellModesModel,
  GridCellModes,
  GridCellParams,
  GridRowSelectionModel,
  GridCallbackDetails,
} from "@mui/x-data-grid";
import { Box, Stack, SxProps, Popover } from "@mui/material";
import { ButtonIcon } from "components";
import { useTheme } from "@mui/material/styles";
import { IAction, IGridColDef, } from "types";
import { date2Srting, number2String } from "utils";
import { MoreVert } from "@mui/icons-material";
import { useDatatable } from "hooks";
import { useTranslation } from 'react-i18next';
import Icons from "assets/Icons";
import CellEditNumber from "./CellEditNumber";
import CellEditText from "./CellEditText";
import Pagination from "./Pagination";
import ActionBar from "./ActionBar";
import createStyle from "./styles";

interface IButton {
  label?: string;
  key: IAction;
  icon?: string;
  disabled?: boolean;
  iconPosition?: "start" | "end";
}
type IDataTable = DataGridProps & {
  height?: number;
  buttons?: IButton[];
  getActionBars?: (rowId: any) => IButton[];
  actionBars?: IButton[];
  useI18n?: boolean;
  autoRowHeight?: boolean;
  parameters?: any;
  disableCellClick?: {
    row: any;
    field?: string;
  }[];
  tableId?: string;
  hidePaging?: boolean;
  forceEnableButtonsHeader?: boolean;
  handleButtonClick?: (key: string, rowId: any | any[]) => void;
  handleItemPaginationClick?: (key: string) => void;
  handlePagination?: (data: GridPaginationModel) => void;
  handleRowOrderChange?: (params: any) => void;
  getData?: (params?: any, onSuccess?: (data: any) => void) => void;
  handleProcessRowUpdate?: (row?: any) => void;
  addRowByTabKey?: () => void;
  handleDialogAdd?: (params: any) => void;
  handleRowSelectionModelChange?: (
    rowSelectionModel: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => void;
  setEditing?: React.Dispatch<React.SetStateAction<boolean>>;
};

const DataTable = ({
  height,
  buttons,
  actionBars,
  getActionBars,
  // forceEnableButtonsHeader = false,
  parameters = {},
  columns,
  rows,
  rowCount,
  loading,
  autoRowHeight = false,
  hidePaging = false,
  checkboxSelection = true,
  // rowReordering = false,
  initialState,
  disableCellClick = [],
  tableId,
  paginationModel: defaultPagination,
  onCellDoubleClick,
  onCellClick,
  handleRowSelectionModelChange,
  handleButtonClick,
  handleItemPaginationClick,
  handlePagination,
  handleProcessRowUpdate,
  // handleRowOrderChange,
  addRowByTabKey,
  getData,
  setEditing,
  ...props
}: IDataTable) => {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const apiRef = props.apiRef ?? useGridApiRef();
  const styles = createStyle();

  const { dialogCfg,
    // dialogAddSuccess, dialogAddFailure
  } = useDatatable();
  const [openDialog, setOpenDialog] = useState(false);

  // const refTableSize = useRef({ width: 0, height: 0 });

  // Set cell edit mode
  const refCellModesModel = useRef<GridCellModesModel>({});
  const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({});
  const refNextColumn = useRef<{ rowId: any; field: any } | null>(null);

  const [selections, setSelections] = useState<any[]>([]);

  const handleCellClick = useCallback(
    (params: GridCellParams, event: any, _detail: any) => {
      if (onCellClick) {
        onCellClick(params, event, _detail);
      }

      if (
        disableCellClick.filter(
          (c: any) => c.field === params.field && c.row === params.id
        ).length > 0
      ) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      if (event.target.classList.contains("MuiAutocomplete-option")) {
        return;
      }
      if (params.isEditable === false) return;

      setCellModesModel((prevModel: any) => {
        const temp = {
          // Revert the mode of the other cells from other rows
          ...Object.keys(prevModel).reduce(
            (acc, id) => ({
              ...acc,
              [id]: Object.keys(prevModel[id]).reduce(
                (acc2, field) => ({
                  ...acc2,
                  [field]: { mode: GridCellModes.View },
                }),
                {}
              ),
            }),
            {}
          ),
          [params.id]: {
            // Revert the mode of other cells in the same row
            ...Object.keys(prevModel[params.id] || {}).reduce(
              (acc, field) => ({
                ...acc,
                [field]: { mode: GridCellModes.View },
              }),
              {}
            ),
            [params.field]: { mode: GridCellModes.Edit },
          },
        };

        refCellModesModel.current = temp;

        return temp;
      });
      setEditing?.(true);
    },
    [disableCellClick, tableId]
  );

  const handleCellModesModelChange = useCallback(
    (newModel: any) => {
      if (refNextColumn.current !== null) {
        const { rowId, field } = refNextColumn.current;

        setCellModesModel((prevModel: any) => {
          const temp = {
            // Revert the mode of the other cells from other rows
            ...Object.keys(prevModel).reduce(
              (acc, id) => ({
                ...acc,
                [id]: Object.keys(prevModel[id]).reduce(
                  (acc2, field) => ({
                    ...acc2,
                    [field]: { mode: GridCellModes.View },
                  }),
                  {}
                ),
              }),
              {}
            ),
            [rowId]: {
              // Revert the mode of other cells in the same row
              ...Object.keys(prevModel[rowId] || {}).reduce(
                (acc, field) => ({
                  ...acc,
                  [field]: { mode: GridCellModes.View },
                }),
                {}
              ),
              [field]: { mode: GridCellModes.Edit },
            },
          };
          if (dialogCfg.formid === null) refCellModesModel.current = temp;
          return temp;
        });
      } else {
        if (dialogCfg.formid === null) {
          setCellModesModel(newModel);
          refCellModesModel.current = newModel;
        }
      }
    },
    [
      JSON.stringify(dialogCfg),
      // tableId,
    ]
  );

  //Init columns visibility
  const columnVisibilityModel = useMemo(() => {
    const obj: any = {};
    columns.forEach((column: any) => {
      if (column["hidden"] === true) obj[column.field] = false;
    });

    return obj;
  }, [columns]);

  const ActionBarsItem = ({ rowId }: { rowId: any }) => {
    const [actionsEl, setActionsEl] = useState<null | HTMLElement>(null);

    return (
      <React.Fragment>
        <MoreVert
          sx={{ mt: '9px', color: "rgba(0, 0, 0, 0.87)" }}
          onClick={(e: any) => setActionsEl(actionsEl ? null : e.currentTarget)}
        />
        <Popover
          open={!!actionsEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          anchorEl={actionsEl}
          onClose={() => setActionsEl(null)}>
          <Box sx={{ border: 0, p: 1, bgcolor: "background.paper" }}>
            <ActionBar
              buttons={getActionBars?.(rowId) ?? actionBars}
              onClick={(key) => {
                handleButtonClick?.(key, rowId);
                setActionsEl(null);
              }}
            />
          </Box>
        </Popover>
      </React.Fragment>
    );
  };
  // const { columns } = dataGridProps;
  const buildColumns = useMemo(() => {
    const colItems: IGridColDef[] = columns?.map((column: IGridColDef) => {
      const {
        type,
        valueFormatter,
        valueGetter,
        renderEditCell,
        decimalPlaces = 2,
        // useI18n = true,
        // formatNumberByCurrency = false,
        absNumber = false,
        ...colProps
      } = {
        ...column,
      };
      const width = colProps.width
        ? colProps.width
        : type === "date"
          ? 110
          : 100;
      const title = column.headerName;

      return {
        ...colProps,
        headerName: title,
        type,
        width,
        valueGetter:
          valueGetter ??
          ((v: any, detail) => {
            if (!detail) return '';
            const { field } = colProps;
            if (field.indexOf(".") > -1) {
              const fields = field.split(".");
              let value = detail;
              if (value[fields[0]]) {
                value = value[fields[0]][fields[1]];
              } else value = "";
              return value;
            }
            return detail[field];
          }),
        valueFormatter:
          valueFormatter ??
          ((params: any) => {
            if (!params) return null;

            const value = typeof params === "object" ? params.value : params;

            if (type === "date") {
              return date2Srting(value);
            }
            if (type === "dateTime") {
              return date2Srting(value, true);
            }
            if (type === "number" && typeof value === "number") {
              const v = absNumber ? Math.abs(value) : value;
              return number2String(v, decimalPlaces);
            }

            if (column.translateContent && value?.trim() !== "") {
              return t(`${column.prexFixTranslate}.${value}`);
            }
            return value;
          }),
        renderEditCell:
          renderEditCell ??
          ((params: any) => {
            if (column.editable === false) return null;

            if (type === "number") {
              return (
                <CellEditNumber
                  value={params.value}
                  hasFocus={params.hasFocus}
                  apiRef={apiRef}
                  rowId={params.id}
                  field={params.field}
                  decimalScale={decimalPlaces}
                  handleChange={colProps.handleCellValueChange}
                />
              );
            }
            if (column.customType && column.customType === "textArea") {
              return (
                <CellEditText
                  value={params.value}
                  multiline={true}
                  hasFocus={params.hasFocus}
                  apiRef={apiRef}
                  rowId={params.id}
                  field={params.field}
                />
              );
            }

            return (
              <CellEditText
                value={params.value}
                multiline={false}
                hasFocus={params.hasFocus}
                apiRef={apiRef}
                rowId={params.id}
                field={params.field}
              />
            );
          }),
      };
    });

    ((actionBars && actionBars.length > 0) || !!getActionBars) &&
      colItems.push({
        field: "actions",
        headerName: "",
        minWidth: 30,
        maxWidth: 30,
        sortable: false,
        disableColumnMenu: true,
        resizable: false,
        renderCell: (params: any) => {
          return <ActionBarsItem rowId={params.id} />;
        },
      });
    return colItems;
  }, [columns, apiRef, buttons]);

  const [paginationModel, setPaginationModel] = useState(
    defaultPagination
      ? defaultPagination
      : {
        pageSize: initialState?.pagination?.paginationModel?.pageSize ?? 22,
        page: initialState?.pagination?.paginationModel?.page ?? 0,
      }
  );

  useEffect(() => {
    defaultPagination && setPaginationModel(defaultPagination);
  }, [JSON.stringify(defaultPagination)]);

  useEffect(() => {
    getData?.({ ...parameters, ...paginationModel });
  }, [JSON.stringify(paginationModel)]);

  useEffect(() => {
    if (dialogCfg.formid !== null) {
      setCellModesModel((prevModel: any) => {
        setTimeout(() => {
          setOpenDialog(true);
        }, 50);

        return {
          // Revert the mode of the other cells from other rows
          ...Object.keys(prevModel).reduce(
            (acc, id) => ({
              ...acc,
              [id]: Object.keys(prevModel[id]).reduce(
                (acc2, field) => ({
                  ...acc2,
                  [field]: { mode: GridCellModes.View },
                }),
                {}
              ),
            }),
            {}
          ),
        };
      });
    } else setOpenDialog(false);
  }, [dialogCfg]);

  useEffect(() => {
    if (!autoRowHeight) return;
    let isEditMode = false;
    Object.keys(cellModesModel).forEach((k) => {
      Object.keys(cellModesModel[k]).forEach((ck) => {
        // if (cellModesModel[k][k1]["mode"] === "edit") 
        if (cellModesModel[k][ck].mode === "edit") isEditMode = true;
      });
    });
    if (isEditMode === false) {
      setTimeout(() => {
        apiRef.current.resetRowHeights();
      }, 300);

    }
  }, [cellModesModel, autoRowHeight]);

  const IconComponent = useCallback((icKey: string) => {
    const ICon = Icons[icKey as keyof typeof Icons];
    if (ICon) {
      return (
        <ICon
          color={palette.primary.main}
          width={12}
          height={12}
          viewBox={"0 0 12 12"}
          sx={{ ml: "4px", mr: "8px" }}
        />
      );
    } else {
      return <></>;
    }
  }, []);

  const buildButtons = useMemo(() => {
    const disabled = selections.length === 0;
    return (buttons && buttons.length > 0) || !hidePaging ? (
      <Box display={"flex"} minHeight={"50px"} maxHeight={"50px"}>
        <Stack direction={"row"}>
          {buttons?.map((button: any) => {
            return (
              <ButtonIcon
                sx={{
                  color: disabled ? 'hsl(0,0%,65%) !important' : '#A31D1D !important',
                  border: "none !important",
                  pl: "12px",
                }}
                key={button.key}
                text={
                  !button.label ? t(`button.${button.key}`) : button.label
                }
                disabled={
                  button.disabled !== undefined ? button.disabled : disabled
                }
                onClick={() => {
                  handleButtonClick?.(button.key, selections);
                }}
                IconComponent={
                  button.iconPosition !== "end"
                    ? IconComponent(button.icon ?? button.key)
                    : undefined
                }
              >
              </ButtonIcon>
            );
          })}
        </Stack>
        {!hidePaging && (
          <Pagination
            totalRowCount={rowCount}
            paginationModel={paginationModel}
            handleButtonClick={handleItemPaginationClick}
            handleChangePage={(page) => {
              if (page < 0 || page * paginationModel.pageSize > (rowCount ?? 0))
                return;
              setPaginationModel((prev: any) => {
                const newModel = { ...prev, page };
                handlePagination?.(newModel);
                return newModel;
              });
            }}
            handleChangePageSize={(pageSize) => {
              setPaginationModel((prev: any) => {
                const newModel = { ...prev, pageSize };
                handlePagination?.(newModel);
                return newModel;
              });
            }}
          />
        )}
      </Box>
    ) : (
      <React.Fragment></React.Fragment>
    );
  }, [
    buttons,
    rowCount,
    paginationModel,
    hidePaging,
    handleButtonClick,
    handleItemPaginationClick,
    selections,
    rows,
  ]);

  const dataGridStyles = useMemo(
    () => [
      styles.dataTable,
      props?.sx,
      rows && rows.length === 0
        ? {
          "& .MuiDataGrid-virtualScroller": {
            minHeight: "78px !important",
            overflowY: "hidden !important",
          },
        }
        : {},
      autoRowHeight
        ? {
          "& .MuiDataGrid-cell": {
            px: '10px',
            pt: '10px',
            whiteSpace: 'break-spaces !important',
          },
        }
        : {},
    ],
    [props?.sx, rows, autoRowHeight]
  ) as SxProps;

  const CustomColumnMenu = useCallback(
    (props: GridColumnMenuProps) => (
      <GridColumnMenu
        {...props}
        slots={{
          columnMenuFilterItem: null,
          columnMenuPinningItem: null,
          columnMenuSortItem: null,
        }}
      />
    ),
    []
  );


  const gridHeight = useMemo(() => {
    if (height && height > 0) return height - 16;
    if (rows && rows.length > 0) return ((rows.length + 1) * 38) + 28;
    return height;
  }, [height, rows]);

  //Reset Seleciton when new rows
  useEffect(() => {
    setSelections([]);
  }, [JSON.stringify(rows)]);


  return (
    <Box sx={{
      height: gridHeight,
      width: 1,
      overflow: 'hidden',
    }}>
      <DataGrid
        {...props}
        rows={rows}
        columns={buildColumns}
        getCellClassName={(params: GridCellParams<any, any, number>) => {
          const { type } = params.colDef;
          if (type === "number") {
            return "numberCell";
          }
          return "";
        }}
        apiRef={apiRef}
        sx={dataGridStyles}
        loading={loading}
        getRowHeight={() => (autoRowHeight ? "auto" : 38)}
        rowHeight={38}
        checkboxSelection={checkboxSelection}

        rowSelectionModel={selections}
        onRowSelectionModelChange={(params: any, details: any) => {
          handleRowSelectionModelChange?.(params, details);
          setSelections(params);
        }}
        // rowReordering={rowReordering}
        sortingOrder={["asc", "desc"]}
        // onRowOrderChange={handleRowOrderChange}
        //Initial state
        initialState={{
          columns: { columnVisibilityModel },

          // pinnedColumns: { right: ["actions"] },
        }}
        // columnVisibilityModel={}
        //Paingation
        hideFooterPagination={true}
        hideFooter={true}
        slots={{
          toolbar: () => buildButtons,
          columnMenu: CustomColumnMenu,
        }}
        slotProps={{
          baseCheckbox: {
            disableTouchRipple: true,
            disableRipple: true,
          }
        }}
        cellModesModel={cellModesModel}
        onCellModesModelChange={(newModel: any) => {
          const obj = newModel[Object.keys(newModel)[0]];
          if (obj) {
            const field = Object.keys(obj).find((f) => obj[f].mode === "edit");
            if (
              disableCellClick &&
              disableCellClick.filter(
                (f: any) =>
                  f.field === field &&
                  Object.keys(newModel).filter((f1) => f1 == f.row).length !== 0
              ).length !== 0
            ) {
              return;
            } else {
              handleCellModesModelChange(newModel);
            }
          }
        }}
        onCellClick={handleCellClick}
        onCellDoubleClick={(params: any, event: any, details: any) => {
          if (params.colDef.field === 'actions' || params.colDef.editable === true) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          onCellDoubleClick?.(params, event, details);
        }}
        onCellEditStop={(params: any, _event: any) => {
          const rowId = params.id as number;
          if (
            params.reason !== GridCellEditStopReasons.enterKeyDown &&
            params.reason !== GridCellEditStopReasons.cellFocusOut
          ) {
            if (
              params.reason === GridCellEditStopReasons.tabKeyDown ||
              params.reason === GridCellEditStopReasons.shiftTabKeyDown
            ) {
              const columnsEditor = [
                ...apiRef.current.getVisibleColumns(),
              ].filter((c) => c.editable === true);

              const currentColumnIndex = columnsEditor.findIndex(
                (c) => c.field === params.field
              );

              if (params.reason === GridCellEditStopReasons.tabKeyDown) {
                let nextIndex = currentColumnIndex + 1;
                while (
                  nextIndex < columnsEditor.length - 1 &&
                  disableCellClick.filter(
                    (c: any) =>
                      c.field === columnsEditor[nextIndex].field &&
                      c.row === rowId
                  ).length > 0
                ) {
                  nextIndex++;
                }

                if (nextIndex < columnsEditor.length) {
                  refNextColumn.current = {
                    rowId,
                    field: columnsEditor[nextIndex].field,
                  };
                } else {
                  if (rowId < apiRef.current.getRowsCount()) {
                    const newId = rowId + 1;
                    refNextColumn.current = {
                      rowId: newId,
                      field: columnsEditor[0].field,
                    };
                  } else {
                    if (addRowByTabKey) {
                      addRowByTabKey?.();
                      refNextColumn.current = {
                        rowId: rowId + 1,
                        field: columnsEditor[0].field,
                      };
                    }
                  }
                }
              } else {
                if (currentColumnIndex === 0) {
                  const newId = rowId - 1;
                  if (newId === 0) refNextColumn.current = null;
                  else {
                    refNextColumn.current = {
                      rowId: newId,
                      field: columnsEditor[columnsEditor.length - 1].field,
                    };
                  }
                } else {
                  let nextIndex = currentColumnIndex - 1;
                  while (
                    disableCellClick.filter(
                      (c: any) =>
                        c.field === columnsEditor[nextIndex].field &&
                        c.row === rowId
                    ).length > 0
                  ) {
                    nextIndex--;
                  }
                  refNextColumn.current = {
                    rowId,
                    field: columnsEditor[nextIndex].field,
                  };
                }
              }
              return;
            } else {
              refNextColumn.current = null;
              return;
            }
          }

          // if (
          //   apiRef.current["dialogActive"] !== true &&
          //   (!params.colDef["customType"] ||
          //     params.colDef["customType"] !== "textArea")
          // ) {
          //   if (params.reason === GridCellEditStopReasons.cellFocusOut)
          //     refNextColumn.current = null;
          //   return;
          // }

          // if (isKeyboardEvent(event) && !event.ctrlKey && !event.metaKey) {
          //   event.defaultPrevented = true;
          // }

          // apiRef.current["dialogActive"] = false;
        }}
        processRowUpdate={(_newRow: any, _oldRow: any) => {
          handleProcessRowUpdate?.(_newRow);
          setEditing?.(false);
          return _newRow;
        }}
        onColumnWidthChange={() => {
          apiRef.current.resetRowHeights();
        }}
      // onResize={(containerSize) => {
      //   if (!autoRowHeight) return;
      //   debouncedHandleResizeChange(containerSize);
      // }}
      // slots
      />
      {openDialog && dialogCfg && dialogCfg.formid && (
        // <AddDialog
        //   formId={dialogCfg.formid}
        //   addText={dialogCfg.addText}
        //   field={dialogCfg.field ? dialogCfg.field : ""}
        //   handleOk={(type: any, data: any) => {
        //     if (type === "add") {
        //       setCellModesModel(refCellModesModel.current);
        //       if (data) {
        //         dialogAddSuccess(data);
        //       }
        //     }
        //   }}
        //   handleClose={() => {
        //     setCellModesModel(refCellModesModel.current);
        //     dialogAddFailure({ newRecord: "-1" });
        //   }}
        // />
        <React.Fragment></React.Fragment>
      )}
    </Box>
  );
};

export default memo(DataTable);