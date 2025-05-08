import React, { memo, useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Backdrop, Box, CircularProgress } from "@mui/material";
import { TbarLocal, DeleteConfirm } from "components";
import Grids from "./Grids/Grids";
import {
  ITbarButton,
  IAction,
  IModeForm,
  ITransactionItem,
  initTransactionRecord,
  IActionAndSub,
  IQueryParam,
  ICustomerStatus,
} from "types";
import { getModeForm, getButtonsByAction, loadRecord } from "utils";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  useTransaction,
  useUser,
  useNotify
} from "hooks";
import {
  addAppListener,
  useAppDispatch,
  UnsubscribeListener,
} from "store/listenerMiddleware";
import { syncSuccess } from "store/transaction/reducer";
import { ITab } from "./Grids/data";
import Form from "./Form/Form";

interface IConfirm {
  delete: boolean;
  assignment: boolean;
  viewassignment: boolean;
  actionKey: IAction;
  id: string;
  no: string;
  data: ITransactionItem[];
}

const RevenuePage = () => {
  const appDispatch = useAppDispatch();
  const { t } = useTranslation();
  const refSearch = useRef<{
    filter: IQueryParam;
    updTbar: boolean;
  }>({ updTbar: false, filter: {} });
  const [formMode, setFormMode] = useState<IModeForm>(IModeForm.LIST);
  const [records, setRecords] = useState<ITransactionItem[]>([]);
  const [reloadTabs, setReloadTabs] = useState<ITab[]>([]);
  const { success, error } = useNotify();
  const {
    add,
    upd,
    dels,
    delAll,
    isSaving,
    getSummary,
    records: activeRecords,
    totalCount,
  } = useTransaction();
  const { info } = useUser();
  const [currentTab, setCurrentTab] = useState<ITab>(ITab.PMG);
  const [openConfirm, setOpenConfirm] = useState<IConfirm>({
    delete: false,
    assignment: false,
    viewassignment: false,
    actionKey: IAction.LIST,
    id: "",
    no: "",
    data: [],
  });
  // const [key, setKey] = useState(0);
  const [action, setAction] = useState<IAction>(IAction.LIST);

  const form = useForm<ITransactionItem>({ mode: "onBlur" });
  const {
    handleSubmit,
    reset,
    formState: { dirtyFields },
  } = form;

  const initButtons: (IAction | ITbarButton)[] = [
    IAction.NEW,
    IAction.SAVE,
    IAction.CANCEL,
  ];
  const [tbarButtons, setTbarButtons] =
    useState<(IAction | ITbarButton)[]>(initButtons);

  const addRecord = () => {
    const record = { ...initTransactionRecord };
    loadRecord(record, form, "transId");
    setFormMode(getModeForm(IAction.NEW));
    setTbarButtons(getButtonsByAction(initButtons, IAction.NEW));
  };

  const editRecord = useCallback((r: ITransactionItem) => {
    loadRecord(r, form, "transId", { guidFields: [] });
    setFormMode(getModeForm(IAction.EDIT));
    setTbarButtons(getButtonsByAction(initButtons, IAction.EDIT));
  }, [currentTab]);

  const copyRecord = useCallback((r: ITransactionItem) => {
    const newRecord = { ...r };
    newRecord.transId = '';
    newRecord.status = ICustomerStatus.HD;
    loadRecord(newRecord, form, "transId", { guidFields: [] });
    setFormMode(getModeForm(IAction.COPY));
    setTbarButtons(getButtonsByAction(initButtons, IAction.COPY));
  }, []);

  const deleteRecord = useCallback((rows: any) => {
    const c = totalCount;

    if (rows.length !== c) {
      if (rows.length > 1) {
        const ids: any[] = [];
        rows.forEach((r: any) => {
          ids.push(r.transId);
        });
        dels(ids, IAction.DELETE);
      } else {
        dels([rows[0].transId], IAction.DELETE);
      }
    } else {
      delAll({ archived: 0 }, IAction.DELETE);
    }
    setOpenConfirm((c) => ({
      ...c,
      delete: false,
      archive: false,
    }));
  },
    [currentTab, totalCount]
  );

  const cancelRecord = useCallback(() => {
    setFormMode(getModeForm(IAction.CANCEL));
    setTbarButtons(getButtonsByAction(initButtons, IAction.CANCEL));
    reset();
  }, []);

  const list = useCallback(() => {
    setRecords([]);
    setFormMode(getModeForm(IAction.LIST));
    setTbarButtons(getButtonsByAction(initButtons, IAction.LIST));
  }, []);

  const saveRecord = () => {
    handleSubmit(
      (o) => {
        //Validate before save
        if (o.details) {
          const detailInvalid = o.details.filter(f => f.deleted !== true && (f.amount ?? 0) <= 0);
          if (detailInvalid.length > 0) {
            error(`Đợt thu: Dòng ${detailInvalid[0].linenum} Số tiền phải lớn hơn 0`);
            return;
          }

          const sumAmount = o.details.reduce((acc, curr) => acc + (curr.amount ?? 0), 0)
          if (sumAmount > (o.totalamount ?? 0)) {
            error(`Tổng số tiền trong đợt thu phải nhỏ số tiền của phiếu thu`);
            return;
          }
        }

        const data: { [key: string]: any } = {};
        Object.keys(dirtyFields).forEach((key) => {
          data[key] = o[key as keyof ITransactionItem];
          // if (key === 'details') {
          //   data[key] = o.details?.filter(f => f.deleted !== true);
          //   data['d_Details'] = o.details?.filter(f => f.deleted === true);
          // }
        });

        if (o.transId) {
          upd(data, IAction.SAVE);
        } else {
          add(data, IAction.SAVE);
        }
      },
      (errors) => {
        let errMessage = "";
        Object.keys(errors).forEach((key) => {
          const err = errors[key as keyof ITransactionItem];
          errMessage += `${err?.message} \n`;
        });
        error(errMessage);
      }
    )();
  };

  const handleActionClick = (key: IAction | IActionAndSub, r?: ITransactionItem[]) => {
    const recs = r ?? records;
    switch (key) {
      case IAction.NEW:
        addRecord();
        break;
      case IAction.COPY:
        r && copyRecord(r[0]);
        break;
      case IAction.EDIT:
        r && editRecord(r[0]);
        break;
      case IAction.DELETE:
        setOpenConfirm((o) => ({
          ...o,
          [key]: true,
          actionKey: key,
          data: recs,
        }));
        break;
      case IAction.ASSIGNMENT:
        setOpenConfirm((o) => ({
          ...o,
          [key]: true,
          actionKey: key,
          data: recs,
        }));
        break;
      case IAction.VIEWASSIGNMENT:
        setOpenConfirm((o) => ({
          ...o,
          [key]: true,
          actionKey: key,
          data: recs,
        }));
        break;
      case IAction.SAVE:
        saveRecord();
        break;
      case IAction.CANCEL:
        cancelRecord();
        break;
      case IAction.LIST:
        if (formMode !== "form") {
          list();
        }
        break;
      case IAction.CLEAR_SEARCH:
        setAction(key);
        break;
    }
  };

  const TbarTitle = useMemo(() => {
    if (records.length > 0 && records[0].transId) {
      return formMode === "form" ? `${t('button.' + IAction.EDIT)}` : "";
    }
    return "";
  }, [records, formMode]);

  const ConfirmDeleteTitle = useMemo(() => {
    if (!records || records.length === 0) return "";

    if (records.length > 1) {
      return t("text.deletesConfirm", { 0: records.length, 1: 'Khách hàng' });
    }
    return t("text.deleteConfirm", { 0: 'Khách hàng' });
  }, [openConfirm, currentTab, activeRecords, records]);

  useEffect(() => {
    setFormMode(getModeForm(IAction.LIST));
    setTbarButtons(getButtonsByAction(initButtons, IAction.LIST));
  }, []);

  const welldoneAlert = useCallback(
    (actionKey: IAction, id?: string) => {
      let msg = "";
      switch (actionKey) {
        case IAction.SAVE:
          !id
            ? (msg = t("text.msg_welldone001"))
            : (msg = t("text.msg_welldone002"));
          break;
        case IAction.DELETE:
          msg = t("text.msg_welldone008", { 0: records.length, 1: 'Khách hàng' });

          break;
      }
      return success(msg);
    },
    [formMode, records]
  );

  const processTabsLoad = (newTabs: ITab[]) => {
    const notExits: ITab[] = [];
    newTabs.forEach((tab) => {
      !reloadTabs.includes(tab) && notExits.push(tab);
    });
    getSummary({
      filter: [{ property: "userId", method: "eq", value: info?.userId }],
    });
    setReloadTabs([...reloadTabs, ...notExits]);
  };

  useEffect(() => {
    const unsubscribe = appDispatch(
      addAppListener({
        actionCreator: syncSuccess,
        effect: ({
          payload,
        }: {
          payload: { actionKey?: IAction; data: any; requestPayload: any };
        }) => {
          const { actionKey, requestPayload } = payload;
          setOpenConfirm((c) => ({
            ...c,
            delete: false,
            assignment: false,
          }));

          switch (actionKey) {
            case IAction.SAVE:
              processTabsLoad([currentTab]);
              if (actionKey === IAction.SAVE) {
                welldoneAlert(actionKey, requestPayload["transId"]);
              }
              list();
              break;
            case IAction.ARCHIVE:
            case IAction.RESTORE:
            case IAction.DELETE:
              welldoneAlert(actionKey);
              processTabsLoad([currentTab]);
              break;
              break
          }
        },
      })
    );
    return unsubscribe as unknown as UnsubscribeListener;
  }, [records, formMode, currentTab]);
  return (
    <Box width={1} height={1}>
      <TbarLocal
        formMode={formMode}
        title={"Phiếu thu"}
        content={TbarTitle}
        buttons={tbarButtons}
        handleButtonClick={handleActionClick}
      />
      <Grids
        hidden={formMode === IModeForm.LIST ? false : true}
        currentTab={currentTab}
        action={action}
        tabChange={setCurrentTab}
        setReloadTabs={setReloadTabs}
        updateFilter={(param) => {
          refSearch.current.filter = param;
        }}
        updateTbarLocal={(hasFilter) => {
          refSearch.current.updTbar = hasFilter;
          if (hasFilter) {
            setTbarButtons((btns) => [
              IAction.CLEAR_SEARCH,
              ...btns.filter((btn) => btn !== IAction.CLEAR_SEARCH),
            ]);
          } else {
            setTbarButtons((btns) =>
              btns.filter((btn) => btn !== IAction.CLEAR_SEARCH)
            );
            setAction(IAction.LIST);
          }
        }}
        reloadTabs={reloadTabs}
        handleCellDbClick={(params) => {
          setRecords([params.row as ITransactionItem]);
          handleActionClick(IAction.EDIT, [params.row as ITransactionItem]);
        }}
        handleActionClick={(key, rows) => {
          setRecords(rows);
          handleActionClick(key, rows);
        }}
      />
      {formMode === IModeForm.FORM && <Form useForm={form} />}
      {isSaving === true && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}>
          Saving...
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {openConfirm.delete && (
        <DeleteConfirm
          open={openConfirm.delete}
          title={ConfirmDeleteTitle}
          handleOK={() => {
            deleteRecord(records);
          }}
          handleClose={() => {
            setOpenConfirm((c) => ({
              ...c,
              delete: false,
              assignment: false,
            }));
          }}
        />
      )}
    </Box>
  );
};

export default memo(RevenuePage);