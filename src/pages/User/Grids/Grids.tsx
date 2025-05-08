import React, {
  memo,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Tabs, Tab, Box } from "@mui/material";
import GridActive from "./Active";
import GridArchived from "./Archived";
import { ISortItem } from "types";
import {
  useUser,
} from "hooks";
import { IFilters } from "types";
import { GridPaginationModel, GridCellParams } from "@mui/x-data-grid";
import {
  getParametersByKey,
  getDefaultPageSize,
  getDefaultGridHeight,
  // tabMessage,
} from "utils";
import { ITab, fixedFilters } from "./data";
import { useTranslation } from "react-i18next";
import defaultStyle from "utils/styles";

interface IGrids {
  hidden: boolean;
  currentTab: ITab;
  tabChange: any;
  reloadTabs: ITab[];
  setReloadTabs: React.Dispatch<React.SetStateAction<ITab[]>>;
  handleCellDbClick: (params: GridCellParams, event?: any, details?: any) => void;
  handleActionClick?: (key: any, row?: any) => void;
}

const Grids = ({
  hidden,
  currentTab,
  tabChange,
  reloadTabs,
  setReloadTabs,
  handleCellDbClick,
  handleActionClick,
}: IGrids) => {
  const dStyles = defaultStyle();
  const { t } = useTranslation();
  const pageSize = getDefaultPageSize(getDefaultGridHeight() - 106);
  const [filters, setFilters] = useState<IFilters>({
    [ITab.ACTIVE]: { pagination: { page: 0, pageSize } },
    [ITab.ARCHIVED]: { pagination: { page: 0, pageSize } },
  });
  const prevParameters = useRef<IFilters>({ ACTIVE: {}, ARCHIVED: {} }).current;

  const [activeTab, setActiveTab] = useState(currentTab);

  const {
    records,
    archivedRecords,
    totalCount,
    archivedCount,
    getSummary,
    get,
    getArchived,
  } = useUser();

  const handlePagination = (obj: {
    id: string;
    sort?: ISortItem[] | null;
    pagination?: GridPaginationModel;
    refresh?: boolean;
  }) => {
    const parameters = { ...filters };
    if (obj.refresh) {
      loadData(ITab.ACTIVE, true);
      loadData(ITab.ARCHIVED, true);
      return;
    }
    if (obj.pagination) parameters[obj.id].pagination = obj.pagination;
    if (obj.sort) parameters[obj.id].sort = obj.sort ?? null;
    setFilters(parameters);
  };

  const itemList = useMemo(
    () => [
      { label: `${t('tab.' + ITab.ACTIVE)} (${totalCount})`, key: ITab.ACTIVE },
      {
        label: `${t('tab.' + ITab.ARCHIVED)} (${archivedCount})`,
        key: ITab.ARCHIVED,
      },
    ],
    [totalCount, archivedCount]
  );

  const loadData = useCallback(
    (tab: any, reload?: boolean) => {
      const parameters = { ...filters };

      reload =
        reload === true ||
        reloadTabs?.includes(tab) ||
        JSON.stringify(prevParameters[tab]) !== JSON.stringify(parameters[tab]);

      const fs = getParametersByKey(parameters, tab);
      fs.filter = [...(fs.filter ?? []), ...fixedFilters[tab as keyof typeof ITab]];
      if (tab === ITab.ACTIVE) {
        if (
          !records ||
          reload ||
          JSON.stringify(prevParameters) !== JSON.stringify(parameters)
        ) {
          if (prevParameters) {
            prevParameters[ITab.ACTIVE] = { ...parameters[ITab.ACTIVE] };
          }
          get(fs);
        }
      } else if (tab === ITab.ARCHIVED) {
        if (
          !archivedRecords ||
          reload ||
          JSON.stringify(prevParameters) !== JSON.stringify(parameters)
        ) {
          if (prevParameters) {
            prevParameters[ITab.ARCHIVED] = { ...parameters[ITab.ARCHIVED] };
          }
          getArchived(fs);
        }
      }
      setReloadTabs?.((c) => [...c.filter((i) => i !== tab)]);
    },
    [JSON.stringify(filters), records, archivedRecords]
  );

  useEffect(() => {
    getSummary({});
  }, []);

  useEffect(() => {
    loadData(currentTab);
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    if (
      reloadTabs &&
      reloadTabs.length > 0 &&
      reloadTabs.includes(currentTab)
    ) {
      loadData(currentTab, true);
    }
  }, [reloadTabs, currentTab]);

  const gridProps = {
    pagination: filters[activeTab].pagination,
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
        <Tabs
          sx={dStyles.tabs}
          value={activeTab}
          onChange={(e, newValue) => {
            setActiveTab(newValue);
            tabChange(newValue);
            loadData(newValue);
          }}
          aria-label="basic tabs example">
          {itemList.map((item) => (
            <Tab
              key={item.key}
              label={t(item.label)}
              value={ITab[item.key]}
              sx={dStyles.tab}
            />
          ))}
        </Tabs>
      </Box>
      {activeTab === ITab.ACTIVE && <GridActive {...gridProps} />}
      {activeTab === ITab.ARCHIVED && <GridArchived {...gridProps} />}
    </Box>
  );
};

export default memo(Grids);
