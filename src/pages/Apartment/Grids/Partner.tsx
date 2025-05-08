import React, { memo, useMemo } from "react";
import { Grid2 } from "@mui/material";
import { DataTable } from "components";
import { ITab, PartnerColumns } from "./data";
import { useApartment, useUser } from "hooks";
import { getDefaultGridHeight } from "utils";
import { ISortItem, IAction, IApartmentItem, IApartmentStatus, EClaimType } from "types";
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

const GridPartner = ({
  pagination,
  handleCellDbClick,
  handleActionClick,
  handleUpdateParams,
}: IGrid) => {
  const { partnerRecord, isLoading, partnerCount } = useApartment();
  const { info } = useUser();
  const apiRef = useGridApiRef();
  const columns = useMemo(() => PartnerColumns(), []);

  const buttons = useMemo(() => {
    if (!info || !info.claimType || info.claimType.length === 0) return [{ key: IAction.DELETE }];
    if (info.claimType.filter(f => f === EClaimType.ADMIN).length > 0) return [{ key: IAction.ASSIGNMENT }, { key: IAction.DELETE }];
    else return [{ key: IAction.DELETE }];
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
        getActionBars={(rowId) => {
          const row = apiRef.current?.getRow(rowId);
          if (row.status === IApartmentStatus.DB) {
            return [
              { key: IAction.EDIT },
              { key: IAction.COPY },
              { key: IAction.REGENERATE },
              { key: IAction.VIEWASSIGNMENT },
              { key: IAction.DELETE },
            ]
          }
          return [
            { key: IAction.EDIT },
            { key: IAction.COPY },
            { key: IAction.VIEWASSIGNMENT },
            { key: IAction.DELETE },
          ]
        }}

        columns={columns}
        rows={partnerRecord?.map((record, idx) => ({ ...record, id: idx })) ?? []}
        rowCount={partnerCount}
        loading={isLoading}
        paginationModel={pagination}
        handlePagination={(paginationModel) => {
          handleUpdateParams({ id: ITab.PARTNER, pagination: paginationModel });
        }}
        onSortModelChange={(sortModel) => {
          const sorts = sortModel.map((v) => ({
            property: v.field,
            direction: v.sort ?? "asc",
          }));
          handleUpdateParams({ id: ITab.PARTNER, sort: sorts });
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
          handleUpdateParams({ id: ITab.PARTNER, refresh: true });
        }}
      />
    </Grid2>
  );
};

export default memo(GridPartner);
