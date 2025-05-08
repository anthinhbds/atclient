import React, { memo, useMemo } from "react";
import { Grid2 } from "@mui/material";
import { DataTable } from "components";
import { AllColumns, ITab } from "./data";
import { useUser, useApartment } from "hooks";
import { getDefaultGridHeight } from "utils";
import { ISortItem, IApartmentItem, IAction, EClaimType } from "types";
import {
  GridPaginationModel,
  GridCellParams,
  useGridApiRef,
} from "@mui/x-data-grid";

interface IGrid {
  pagination?: GridPaginationModel;
  handleCellDbClick?: (params: GridCellParams, event?: any, details?: any) => void;
  handleActionClick?: (key: any, row?: IApartmentItem[]) => void;
  handleUpdateParams: (obj: {
    id: string;
    sort?: ISortItem[] | null;
    pagination?: GridPaginationModel;
    refresh?: boolean;
  }) => void;
}

const GridActive = ({
  pagination,
  // handleCellDbClick,
  handleActionClick,
  handleUpdateParams,
}: IGrid) => {
  const { records, isLoading, totalCount } = useApartment();
  const { info } = useUser();
  const apiRef = useGridApiRef();
  const columns = useMemo(() => AllColumns(), []);

  const buttons = useMemo(() => {
    if (!info || !info.claimType || info.claimType.length === 0) return [];
    if (info.claimType.filter(f => f === EClaimType.ADMIN).length > 0) return [{ key: IAction.ASSIGNMENT }, { key: IAction.VIEWASSIGNMENT }];
    return [];
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
        buttons={buttons.filter(f => f.key !== IAction.VIEWASSIGNMENT)}
        actionBars={buttons.filter(f => f.key !== IAction.ASSIGNMENT)}
        columns={columns}
        rows={records?.map((record, idx) => ({ ...record, id: idx })) ?? []}
        rowCount={totalCount}
        loading={isLoading}
        paginationModel={pagination}
        handlePagination={(paginationModel) => {
          handleUpdateParams({ id: ITab.ALL, pagination: paginationModel });
        }}
        onSortModelChange={(sortModel) => {
          const sorts = sortModel.map((v) => ({
            property: v.field,
            direction: v.sort ?? "asc",
          }));
          handleUpdateParams({ id: ITab.ALL, sort: sorts });
        }}
        checkboxSelection={buttons && buttons.length > 0}
        // onCellDoubleClick={handleCellDbClick}
        handleButtonClick={(key, rowIds) => {
          const rows: IApartmentItem[] = [];
          if (Array.isArray(rowIds)) {
            rowIds.forEach((rowId) => {
              const row = apiRef.current?.getRow(rowId);
              rows.push(row as IApartmentItem);
            });
          } else {
            const row = apiRef.current?.getRow(rowIds);
            rows.push(row as IApartmentItem);
          }
          handleActionClick?.(key, rows);
        }}
        handleItemPaginationClick={(_key) => {
          handleUpdateParams({ id: ITab.ALL, refresh: true });
        }}
      />
    </Grid2>
  );
};

export default memo(GridActive);
