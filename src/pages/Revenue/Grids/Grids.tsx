import React, {
  memo,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Tabs, Tab, Box, Stack } from "@mui/material";
import { Search } from "@mui/icons-material";
import {
  IAction,
  IFilter,
  IFilterItem,
  IQueryParam,
  ISortItem
} from "types";
import { SearchField } from 'components';
import { useTransaction, useUser } from "hooks";
import { IFilters, IUserSearchProfileItem } from "types";
import { GridPaginationModel, GridCellParams } from "@mui/x-data-grid";
import {
  getParametersByKey,
  getDefaultPageSize,
  getDefaultGridHeight,
} from "utils";
import { ITab, fixedFilters } from "./data";
import { useTranslation } from "react-i18next";
import AdvanceSearch from "./AdvanceSearch";
import GridPMGFee from "./PMGFee";
import GridPGTFee from "./PGTFee";
import defaultStyle from "utils/styles";

interface IGrids {
  hidden: boolean;
  currentTab: ITab;
  tabChange: any;
  action: IAction;
  reloadTabs: ITab[];
  updateFilter: (param: IQueryParam) => void;
  updateTbarLocal: (hasFilter: boolean) => void;
  setReloadTabs: React.Dispatch<React.SetStateAction<ITab[]>>;
  handleCellDbClick: (params: GridCellParams, event?: any, details?: any) => void;
  handleActionClick?: (key: any, row?: any) => void;
}

const Grids = ({
  hidden,
  currentTab,
  tabChange,
  action,
  reloadTabs,
  setReloadTabs,
  handleCellDbClick,
  handleActionClick,
  updateTbarLocal,
  updateFilter,
}: IGrids) => {
  const dStyles = defaultStyle();
  const [openAdvSearch, setOpenAdvSearch] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<IUserSearchProfileItem>();
  const { info, getSearchProfile, userSearchProfiles, } = useUser();
  const { t } = useTranslation();
  const pageSize = getDefaultPageSize(getDefaultGridHeight() - 106);
  const [filters, setFilters] = useState<IFilters>({
    // [ITab.ALL]: { pagination: { page: 0, pageSize } },
    [ITab.PMG]: { pagination: { page: 0, pageSize } },
    [ITab.PGT]: { pagination: { page: 0, pageSize } },
  });
  const prevParameters = useRef<IFilters>({ ACTIVE: {}, ARCHIVED: {} }).current;

  const dataSearch = useRef<any>({});
  const [activeTab, setActiveTab] = useState(currentTab);

  const {
    records,
    pmgRecords,
    pmgCount,
    pgtRecords,
    pgtCount,
    getSummary,
    // get,
    getPMG,
    getPGT,
  } = useTransaction();

  const handlePagination = (obj: {
    id: string;
    sort?: ISortItem[] | null;
    pagination?: GridPaginationModel;
    refresh?: boolean;
  }) => {
    const parameters = { ...filters };
    if (obj.refresh) {
      // loadData(ITab.ALL, true);
      loadData(ITab.PMG, true);
      loadData(ITab.PGT, true);
      return;
    }
    if (obj.pagination) parameters[obj.id].pagination = obj.pagination;
    if (obj.sort) parameters[obj.id].sort = obj.sort ?? null;
    setFilters(parameters);
  };

  const itemList = useMemo(
    () => [
      // { label: `${t('tab.' + ITab.ALL)}`, key: ITab.ALL },
      {
        label: `${t('tab.' + ITab.PMG)} (${pmgCount})`,
        key: ITab.PMG,
      },
      {
        label: `${t('tab.' + ITab.PGT)} (${pgtCount})`,
        key: ITab.PGT,
      },
    ],
    [pmgCount, pgtCount]
  );

  const handleAdvanceSearch = useCallback(
    (searchItems?: IFilterItem[], idProfile?: string, catchedData?: any) => {
      Object.keys(catchedData).forEach((k) => {
        dataSearch.current[k] = catchedData[k];
      });

      if (idProfile) {
        const profile = userSearchProfiles?.find((v) => v.id === idProfile);
        profile && setCurrentProfile(profile);
        setOpenAdvSearch(false);
      } else {
        const parameters = { ...filters };
        //Reset pagination
        Object.keys(parameters).forEach((key) => {
          parameters[key].pagination = {
            page: 0,
            pageSize: parameters[key].pagination?.pageSize ?? pageSize,
          };
        });

        Object.keys(parameters).forEach((key) => {
          parameters[key].searchString = null;
          parameters[key].filter = searchItems;
        });
        setFilters(parameters);
        updateTbarLocal(searchItems ? searchItems.length > 0 : false);
        setOpenAdvSearch(false);
      }
    },
    [userSearchProfiles, JSON.stringify(filters)]
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
      updateFilter(fs);
      if (tab === ITab.PMG) {
        if (
          !pmgRecords ||
          reload ||
          JSON.stringify(prevParameters) !== JSON.stringify(parameters)
        ) {
          if (prevParameters) {
            prevParameters[ITab.PMG] = { ...parameters[ITab.PMG] };
          }
          const filters = [...fs.filter];
          getPMG({ ...fs, filter: filters });
        }
      } else if (tab === ITab.PGT) {
        if (
          !pgtRecords ||
          reload ||
          JSON.stringify(prevParameters) !== JSON.stringify(parameters)
        ) {
          if (prevParameters) {
            prevParameters[ITab.PGT] = { ...parameters[ITab.PGT] };
          }
          const filters = [...fs.filter];
          getPGT({ ...fs, filter: filters });
        }
      }
      setReloadTabs?.((c) => [...c.filter((i) => i !== tab)]);
    },
    [JSON.stringify(filters), info, records, pmgRecords, pgtRecords]
  );

  const handleSearchChange = (v?: string | IUserSearchProfileItem) => {
    const parameters = { ...filters };

    //Reset pagination
    Object.keys(parameters).forEach((key) => {
      parameters[key].pagination = {
        page: 0,
        pageSize: parameters[key].pagination?.pageSize ?? pageSize,
      };
    });

    if (!v) {
      Object.keys(parameters).forEach((key) => {
        parameters[key].searchString = null;
        parameters[key].filter = null;
      });
      dataSearch.current = {};
      setCurrentProfile(undefined);
      setFilters(parameters);
    } else if (typeof v === "string") {
      Object.keys(parameters).forEach(
        (key) => (parameters[key].searchString = v)
      );
      setFilters(parameters);
    } else {
      const fs = JSON.parse((v && v.searchingContent) ?? "[]");
      Object.keys(parameters).forEach((key) => (parameters[key].filter = fs));
      setFilters(parameters);
    }
  };

  useEffect(() => {
    getSearchProfile({ filter: [{ property: "formId", value: "revenue", method: "eq" }] });
  }, []);

  useEffect(() => {
    if (action === IAction.CLEAR_SEARCH) {
      setFilters((old) => {
        const temp = { ...old };
        Object.keys(temp).forEach((key) => {
          temp[key].filter = null;
          if (fixedFilters[key as keyof typeof ITab]) temp[key].filter = fixedFilters[key as keyof typeof ITab];
        });
        return temp;
      });
      updateTbarLocal(false);
      dataSearch.current = {};
    }
  }, [action]);

  useEffect(() => {
    if (info && info.userId) {
      const fs: IFilter[] = [];
      getSummary({
        params: {
          filter: fs,
          searchString: filters[ITab.PMG].searchString,
        }
      });
    }
  }, [JSON.stringify(filters), info]);

  useEffect(() => {
    if (
      reloadTabs &&
      reloadTabs.length > 0 &&
      reloadTabs.includes(currentTab)
    ) {
      loadData(currentTab, true);
    } else loadData(currentTab);
  }, [JSON.stringify(filters), JSON.stringify(reloadTabs), currentTab]);

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
        <Stack margin={"13px 16px auto auto"} direction={"row"} spacing={1}>
          <SearchField
            currentProfile={currentProfile}
            profiles={userSearchProfiles}
            placeHolder={'Nhập loại phiếu thu, tên khách hàng,...'}
            handleSearchChange={handleSearchChange}
          />
          <Box display={"flex"} alignItems={"center"}>
            <Search
              sx={{
                cursor: "pointer",
                color: Object.keys(dataSearch.current).length === 0 ? "hsl(0,0%,50%)" : "hsl(0,0%,100%)"
              }}
              onClick={() => setOpenAdvSearch(true)}
            />
          </Box>
          {openAdvSearch && (
            <AdvanceSearch
              defaultValues={dataSearch.current}
              handleButtonClick={handleAdvanceSearch}
              handleClose={() => {
                setOpenAdvSearch(false);
              }}
            />
          )}
        </Stack>
      </Box>
      {/* {activeTab === ITab.ALL && <GridAll {...gridProps} />} */}
      {activeTab === ITab.PMG && <GridPMGFee {...gridProps} />}
      {activeTab === ITab.PGT && <GridPGTFee {...gridProps} />}
    </Box>
  );
};

export default memo(Grids);
