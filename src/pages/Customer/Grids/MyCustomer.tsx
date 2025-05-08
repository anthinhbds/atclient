import React, { memo, useMemo } from "react";
import { Grid2 } from "@mui/material";
import { DataTable } from "components";
import { ITab, MyCustomerColumns } from "./data";
import { useCustomer, useUser } from "hooks";
import { getDefaultGridHeight } from "utils";
import { ISortItem, IAction, IProjectItem, EClaimType, ICustomerItem } from "types";
import {
  GridPaginationModel,
  GridCellParams,
  useGridApiRef,
} from "@mui/x-data-grid";

interface IGrid {
  pagination?: GridPaginationModel;
  handleCellDbClick?: (params: GridCellParams, event?: any, details?: any) => void;
  handleActionClick?: (key: any, row?: IProjectItem[]) => void;
  handleUpdateParams: (obj: {
    id: string;
    sort?: ISortItem[] | null;
    pagination?: GridPaginationModel;
    refresh?: boolean;
  }) => void;
}

const GridMyCustomer = ({
  pagination,
  handleCellDbClick,
  handleActionClick,
  handleUpdateParams,
}: IGrid) => {
  const { myCustomerRecord, isLoading, myCustomerCount } = useCustomer();
  const { info } = useUser();
  const apiRef = useGridApiRef();

  const buttons = useMemo(() => {
    if (!info || !info.claimType || info.claimType.length === 0) return [{ key: IAction.DELETE }];
    if (info.claimType.filter(f => f === EClaimType.ADMIN).length > 0) return [{ key: IAction.ASSIGNMENT }, { key: IAction.DELETE }];
    else return [{ key: IAction.DELETE }];
  }, [info]);

  const columns = useMemo(() => {
    if (info && info.claimType && info.claimType.indexOf(EClaimType.ADMIN) !== -1)
      return [
        ...MyCustomerColumns(),
        {
          field: "userId", headerName: "Nhân viên", width: 100, valueGetter: ((v: any) => {
            if (!v) return null;

            return v === 'DTD' ? ' Diễm' : v === 'NNT' ? 'Thi' : v === 'PTM' ? 'Mỹ' : 'Công ty';
          })
        },
      ];
    return MyCustomerColumns();
  }, [info]);

  return (
    <Grid2
      component={"div"}
      container
      height={1}
      sx={{
        px: "16px",
      }}
      role="tabpanel">
      <DataTable
        height={getDefaultGridHeight()}
        apiRef={apiRef}
        buttons={buttons}
        getActionBars={(_rowId) => {
          return [
            { key: IAction.COPY },
            { key: IAction.VIEWASSIGNMENT },
            { key: IAction.DELETE },
          ]

        }}

        columns={columns}
        rows={myCustomerRecord?.map((record, idx) => ({ ...record, id: idx })) ?? []}
        rowCount={myCustomerCount}
        loading={isLoading}
        paginationModel={pagination}
        handlePagination={(paginationModel) => {
          handleUpdateParams({ id: ITab.MYCUSTOMER, pagination: paginationModel });
        }}
        onSortModelChange={(sortModel) => {
          const sorts = sortModel.map((v) => ({
            property: v.field,
            direction: v.sort ?? "asc",
          }));
          handleUpdateParams({ id: ITab.MYCUSTOMER, sort: sorts });
        }}
        onCellDoubleClick={handleCellDbClick}
        handleButtonClick={(key, rowIds) => {
          const rows: ICustomerItem[] = [];
          if (Array.isArray(rowIds)) {
            rowIds.forEach((rowId) => {
              const row = apiRef.current?.getRow(rowId);
              rows.push(row as ICustomerItem);
            });
          } else {
            const row = apiRef.current?.getRow(rowIds);
            rows.push(row as ICustomerItem);
          }
          handleActionClick?.(key, rows);
        }}
        handleItemPaginationClick={(_key) => {
          handleUpdateParams({ id: ITab.MYCUSTOMER, refresh: true });
        }}
      />
    </Grid2>
  );
};

export default memo(GridMyCustomer);
