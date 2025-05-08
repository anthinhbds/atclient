import React, {
  memo,
  useEffect,
  useRef,
  useCallback,
  useState,
} from "react";
import { Box, Stack } from "@mui/material";
import GridActive from "./Active";
import { IFilter, ISortItem } from "types";
import { SearchField } from 'components';
import {
  useCustomerJourney,
} from "hooks";
import { IUserSearchProfileItem } from "types";
import { GridPaginationModel, GridCellParams } from "@mui/x-data-grid";
import {
  getDefaultPageSize,
  getDefaultGridHeight,
  // tabMessage,
} from "utils";

interface IGrids {
  hidden: boolean;
  handleCellDbClick: (params: GridCellParams, event?: any, details?: any) => void;
  handleActionClick?: (key: any, row?: any) => void;
}

const Grids = ({
  hidden,
  handleCellDbClick,
  handleActionClick,
}: IGrids) => {
  const pageSize = getDefaultPageSize(getDefaultGridHeight() - 106);
  const [filter, setFilter] = useState<IFilter>({
    pagination: { page: 0, pageSize }
  });

  const dataSearch = useRef<any>({});

  const {
    records,
    get,
  } = useCustomerJourney();

  const handlePagination = (obj: {
    id: string;
    sort?: ISortItem[] | null;
    pagination?: GridPaginationModel;
    refresh?: boolean;
  }) => {
    const parameters = { ...filter };
    if (obj.refresh) {
      loadData();
      return;
    }
    if (obj.pagination) parameters.pagination = obj.pagination;
    if (obj.sort) parameters.sort = obj.sort ?? null;
    setFilter(parameters);
  };

  const loadData = useCallback(
    () => {
      // const parameters = { ...filter };
      get({
        filter: filter.filter ?? [],
        searchString: filter.searchString,
        sort: filter.sort,
        page: filter.pagination?.page,
        pageSize: filter.pagination?.pageSize,
      });
    },
    [JSON.stringify(filter), records]
  );

  const handleSearchChange = (v?: string | IUserSearchProfileItem) => {
    const parameters = { ...filter };

    //Reset pagination
    parameters.pagination = {
      page: 0,
      pageSize: parameters.pagination?.pageSize ?? pageSize,
    };

    if (!v) {
      parameters.searchString = null;
      parameters.filter = null;
      dataSearch.current = {};
      // setCurrentProfile(undefined);
      setFilter(parameters);
    } else if (typeof v === "string") {
      parameters.searchString = v
      setFilter(parameters);
    } else {
      const fs = JSON.parse((v && v.searchingContent) ?? "[]");
      parameters.filter = fs
      setFilter(parameters);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const gridProps = {
    pagination: filter.pagination,
    handleUpdateParams: handlePagination,
    handleCellDbClick: handleCellDbClick,
    handleActionClick: handleActionClick,
  };

  return (
    <Box
      width={1}
      height={1}
      boxShadow={"2px 0 5px -1px #888"}
      visibility={hidden ? "hidden" : "visible"}
      position={hidden ? "absolute" : "static"}
      left={hidden ? "-100000px" : "auto"}>
      <Box display={"flex"}>
        <Stack margin={"13px 16px auto auto"} direction={"row"} spacing={1}>
          <SearchField
            // currentProfile={currentProfile}
            // profiles={userSearchProfiles}
            placeHolder={'Nhập tên khách hàng, số điện thoại'}
            handleSearchChange={handleSearchChange}
          />
        </Stack>
      </Box>
      <GridActive {...gridProps} />
    </Box>
  );
};

export default memo(Grids);
