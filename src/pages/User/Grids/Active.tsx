import React, { memo, useMemo } from "react";
import { Grid } from "@mui/material";
import { DataTable } from "components";
import { ActiveColumns } from "./data";
import { useUser } from "hooks";
import { getDefaultGridHeight } from "utils";
import { ISortItem, IAction, IUserItem } from "types";
import {
  GridPaginationModel,
  GridCellParams,
  useGridApiRef,
} from "@mui/x-data-grid";

interface IGrid {
  pagination?: GridPaginationModel;
  handleCellDbClick?: (params: GridCellParams, event?: any, details?: any) => void;
  handleActionClick?: (key: any, row?: IUserItem[]) => void;
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
  const { records, isLoading, totalCount } = useUser();
  const apiRef = useGridApiRef();
  const columns = useMemo(() => ActiveColumns(), []);

  return (
    <Grid
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
          const rows: IUserItem[] = [];
          if (Array.isArray(rowIds)) {
            rowIds.forEach((rowId) => {
              const row = apiRef.current?.getRow(rowId);
              rows.push(row as IUserItem);
            });
          } else {
            const row = apiRef.current?.getRow(rowIds);
            rows.push(row as IUserItem);
          }
          handleActionClick?.(key, rows);
        }}
        handleItemPaginationClick={(_key) => {
          handleUpdateParams({ id: "ACTIVE", refresh: true });
        }}
      />
    </Grid>
  );
};

export default memo(GridActive);
