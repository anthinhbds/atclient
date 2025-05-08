import React, { memo, useMemo } from "react";
import { Grid } from "@mui/material";
import { DataTable } from "components";
import { ActiveColumns } from "./data";
import { useProject } from "hooks";
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

const GridArchived = ({
  pagination,
  handleCellDbClick,
  handleActionClick,
  handleUpdateParams,
}: IGrid) => {
  const { archivedRecords, isLoading, archivedCount } = useProject();
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
        buttons={[{ key: IAction.DELETE }, { key: IAction.RESTORE }]}
        actionBars={[
          { key: IAction.DELETE },
          { key: IAction.RESTORE },
          { key: IAction.COPY },
        ]}
        columns={columns}
        rows={
          archivedRecords?.map((record, idx) => ({ ...record, id: idx })) ?? []
        }
        rowCount={archivedCount}
        loading={isLoading}
        paginationModel={pagination}
        handlePagination={(paginationModel) => {
          handleUpdateParams({
            id: "ARCHIVED",
            pagination: paginationModel,
          });
        }}
        onSortModelChange={(sortModel) => {
          const sorts = sortModel.map((v) => ({
            property: v.field,
            direction: v.sort ?? "asc",
          }));
          handleUpdateParams({ id: "ARCHIVED", sort: sorts });
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
          handleUpdateParams({ id: "ARCHIVED", refresh: true });
        }}
      />
    </Grid>
  );
};

export default memo(GridArchived);
