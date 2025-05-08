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
import { EClaimType, IAction, IFilterItem, IQueryParam, ISortItem } from "types";
import { SearchField } from 'components';
import { useApartment, useUser } from "hooks";
import { IFilters, IUserSearchProfileItem } from "types";
import { GridPaginationModel, GridCellParams } from "@mui/x-data-grid";
import {
  getParametersByKey,
  getDefaultPageSize,
  getDefaultGridHeight,
  filter2Data,
} from "utils";
import { ITab, fixedFilters } from "./data";
import { useTranslation } from "react-i18next";
import GridAll from "./All";
import GridMyApartment from "./MyApartment";
import GridPartner from "./Partner";
import GridExpired from "./Expired";
import GridAssignment from "./Assignment";
import AdvanceSearch from "./AdvanceSearch";
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
    [ITab.ALL]: { pagination: { page: 0, pageSize } },
    [ITab.MYAPARTMENT]: { pagination: { page: 0, pageSize } },
    [ITab.PARTNER]: { pagination: { page: 0, pageSize } },
    [ITab.EXPIRED]: { pagination: { page: 0, pageSize } },
    [ITab.ASSIGNMENT]: { pagination: { page: 0, pageSize } },
  });
  const prevParameters = useRef<IFilters>({ ACTIVE: {}, ARCHIVED: {} }).current;

  const dataSearch = useRef<any>({});
  const [activeTab, setActiveTab] = useState(currentTab);

  const {
    records,
    myApartmentRecord,
    myApartmentCount,
    expiredRecord,
    expiredCount,
    partnerRecord,
    partnerCount,
    assigmentRecord,
    assigmentCount,
    getSummary,
    get,
    getMyApartment,
    getPartner,
    getExpired,
    getAssigment,
  } = useApartment();

  const handlePagination = (obj: {
    id: string;
    sort?: ISortItem[] | null;
    pagination?: GridPaginationModel;
    refresh?: boolean;
  }) => {
    const parameters = { ...filters };
    if (obj.refresh) {
      loadData(ITab.ALL, true);
      loadData(ITab.MYAPARTMENT, true);
      loadData(ITab.PARTNER, true);
      loadData(ITab.EXPIRED, true);
      loadData(ITab.ASSIGNMENT, true);
      return;
    }
    if (obj.pagination) parameters[obj.id].pagination = obj.pagination;
    if (obj.sort) parameters[obj.id].sort = obj.sort ?? null;
    setFilters(parameters);
  };

  const itemList = useMemo(
    () => {
      const items = [
        { label: `${t('tab.' + ITab.ALL)}`, key: ITab.ALL },
        {
          label: `${t('tab.' + ITab.MYAPARTMENT)} (${myApartmentCount})`,
          key: ITab.MYAPARTMENT,
        },
      ];
      if (info && info.claimType && info.claimType.includes(EClaimType.ADMIN)) {
        items.push({
          label: `${t('tab.' + ITab.PARTNER)} (${partnerCount})`,
          key: ITab.PARTNER,
        });
      }
      items.push(
        {
          label: `${t('tab.' + ITab.ASSIGNMENT)} (${assigmentCount})`,
          key: ITab.ASSIGNMENT,
        });
      items.push(
        {
          label: `${t('tab.' + ITab.EXPIRED)} (${expiredCount})`,
          key: ITab.EXPIRED,
        });
      return items;
    },
    [info, myApartmentCount, partnerCount, expiredCount, assigmentCount]
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
      if (tab === ITab.ALL) {
        if (
          !records ||
          reload ||
          JSON.stringify(prevParameters) !== JSON.stringify(parameters)
        ) {
          if (prevParameters) {
            prevParameters[ITab.ALL] = { ...parameters[ITab.ALL] };
          }
          get(fs);
        }
      } else if (tab === ITab.MYAPARTMENT) {
        if (
          !myApartmentRecord ||
          reload ||
          JSON.stringify(prevParameters) !== JSON.stringify(parameters)
        ) {
          if (prevParameters) {
            prevParameters[ITab.MYAPARTMENT] = { ...parameters[ITab.MYAPARTMENT] };
          }
          const filters = [...fs.filter];
          // if (info && info.userId) {
          //   filters.push({ property: "userId", method: "eq", value: info.userId });
          // }
          getMyApartment({ ...fs, filter: filters });
        }
      } else if (tab === ITab.PARTNER) {
        if (
          !partnerRecord ||
          reload ||
          JSON.stringify(prevParameters) !== JSON.stringify(parameters)
        ) {
          if (prevParameters) {
            prevParameters[ITab.PARTNER] = { ...parameters[ITab.PARTNER] };
          }
          const filters = [...fs.filter];
          // if (info && info.userId) {
          //   filters.push({ property: "userId", method: "eq", value: info.userId });
          // }
          getPartner({ ...fs, filter: filters });
        }
      } else if (tab === ITab.ASSIGNMENT) {
        if (
          !assigmentRecord ||
          reload ||
          JSON.stringify(prevParameters) !== JSON.stringify(parameters)
        ) {
          if (prevParameters) {
            prevParameters[ITab.ASSIGNMENT] = { ...parameters[ITab.ASSIGNMENT] };
          }
          const filters = [...fs.filter];
          // if (info && info.userId) {
          //   filters.push({ property: "userId", method: "eq", value: info.userId });
          // }
          getAssigment({ ...fs, filter: filters });
        }
      } else if (tab === ITab.EXPIRED) {
        if (
          !expiredRecord ||
          reload ||
          JSON.stringify(prevParameters) !== JSON.stringify(parameters)
        ) {
          if (prevParameters) {
            prevParameters[ITab.EXPIRED] = { ...parameters[ITab.EXPIRED] };
          }
          const filters = [...fs.filter];
          // if (info && info.userId) {
          //   filters.push({ property: "userId", method: "eq", value: info.userId });
          // }
          getExpired({ ...fs, filter: filters });
        }
      }
      setReloadTabs?.((c) => [...c.filter((i) => i !== tab)]);
    },
    [JSON.stringify(filters), info, records, myApartmentRecord, partnerRecord, expiredRecord, assigmentRecord]
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
      dataSearch.current = filter2Data(fs);
    }
  };

  useEffect(() => {
    getSearchProfile({ filter: [{ property: "formId", value: "apartment", method: "eq" }] });
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
      const fs = filters[ITab.ALL].filter ? [...filters[ITab.ALL].filter] : [];
      getSummary({
        params: {
          filter: fs,
          searchString: filters[ITab.ALL].searchString,
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
    }
    else loadData(currentTab);
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
            // loadData(newValue);
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
            placeHolder={'Nhập số điện thoại, dự án, số căn...'}
            handleSearchChange={handleSearchChange}
          />
          <Box display={"flex"} alignItems={"center"}>
            <Search
              sx={{
                cursor: "pointer",
                color: Object.keys(dataSearch.current).length === 0 ? "hsl(0,0%,50%)" : "#A31D1D",
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
      {activeTab === ITab.ALL && <GridAll {...gridProps} />}
      {activeTab === ITab.MYAPARTMENT && <GridMyApartment {...gridProps} />}
      {activeTab === ITab.PARTNER && <GridPartner {...gridProps} />}
      {activeTab === ITab.ASSIGNMENT && <GridAssignment {...gridProps} />}
      {activeTab === ITab.EXPIRED && <GridExpired {...gridProps} />}
    </Box>
  );
};

export default memo(Grids);
