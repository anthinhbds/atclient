import React, { memo, useMemo } from "react";
import { Grid2 } from "@mui/material";
import { DataTable } from "components";
import { AssignmentColumns, ITab } from "./data";
import { useApartment, useUser } from "hooks";
import { getDefaultGridHeight } from "utils";
import { ISortItem, IAction, IApartmentItem, EClaimType } from "types";
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

const GridAssignment = ({
  pagination,
  handleCellDbClick,
  handleActionClick,
  handleUpdateParams,
}: IGrid) => {
  const { assigmentRecord, isLoading, assigmentCount } = useApartment();
  const apiRef = useGridApiRef();
  const { info } = useUser();
  const columns = useMemo(() => {
    if (info && info.claimType && info.claimType.indexOf(EClaimType.ADMIN) !== -1)
      return [
        ...AssignmentColumns(),
        {
          field: "userId", headerName: "Nhân viên", width: 100, valueGetter: ((v: any) => {
            if (!v) return null;

            return v === 'DTD' ? ' Diễm' : v === 'NNT' ? 'Thi' : v === 'PTM' ? 'Mỹ' : 'Công ty';
          })
        },
      ];
    return AssignmentColumns();
  }, []);

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
        buttons={[{ key: IAction.DELETE }]}
        actionBars={[
          { key: IAction.EDIT },
          { key: IAction.VIEWASSIGNMENT },
          { key: IAction.COPY },
          { key: IAction.DELETE },
        ]}
        columns={columns}
        rows={assigmentRecord?.map((record, idx) => ({ ...record, id: idx })) ?? []}
        rowCount={assigmentCount}
        loading={isLoading}
        paginationModel={pagination}
        handlePagination={(paginationModel) => {
          handleUpdateParams({ id: ITab.EXPIRED, pagination: paginationModel });
        }}
        onSortModelChange={(sortModel) => {
          const sorts = sortModel.map((v) => ({
            property: v.field,
            direction: v.sort ?? "asc",
          }));
          handleUpdateParams({ id: ITab.EXPIRED, sort: sorts });
        }}
        onCellDoubleClick={handleCellDbClick}
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
          handleUpdateParams({ id: ITab.EXPIRED, refresh: true });
        }}
      />
    </Grid2>
  );
};

export default memo(GridAssignment);
