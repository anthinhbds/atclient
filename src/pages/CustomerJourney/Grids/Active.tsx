import React, { memo, useMemo } from "react";
import { Grid2 } from "@mui/material";
import { DataTable } from "components";
import { ActiveColumns } from "./data";
import { useCustomerJourney } from "hooks";
import { getDefaultGridHeight } from "utils";
import { ISortItem, IAction, IProjectItem } from "types";
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

const GridActive = ({
  pagination,
  handleCellDbClick,
  handleActionClick,
  handleUpdateParams,
}: IGrid) => {
  const { records, isLoading, totalCount } = useCustomerJourney();
  const apiRef = useGridApiRef();
  const columns = useMemo(() => ActiveColumns(), []);

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
        buttons={[{ key: IAction.ARCHIVE }, { key: IAction.DELETE }]}
        actionBars={[
          { key: IAction.ARCHIVE },
          { key: IAction.COPY },
          { key: IAction.DELETE },
        ]}
        columns={columns}
        rows={records?.map((record, idx) => ({ ...record, id: idx })) ?? []}
        rowCount={totalCount}
        loading={isLoading}
        paginationModel={pagination}
        handlePagination={(paginationModel) => {
          handleUpdateParams({ id: "ACTIVE", pagination: paginationModel });
        }}
        onSortModelChange={(sortModel) => {
          const sorts = sortModel.map((v) => ({
            property: v.field,
            direction: v.sort ?? "asc",
          }));
          handleUpdateParams({ id: "ACTIVE", sort: sorts });
        }}
        onCellDoubleClick={handleCellDbClick}
        handleButtonClick={(key, rowIds) => {
          const rows: IProjectItem[] = [];
          if (Array.isArray(rowIds)) {
            rowIds.forEach((rowId) => {
              const row = apiRef.current?.getRow(rowId);
              rows.push(row as IProjectItem);
            });
          } else {
            const row = apiRef.current?.getRow(rowIds);
            rows.push(row as IProjectItem);
          }
          handleActionClick?.(key, rows);
        }}
        handleItemPaginationClick={(_key) => {
          handleUpdateParams({ id: "ACTIVE", refresh: true });
        }}
      />
    </Grid2>
  );
};

export default memo(GridActive);
