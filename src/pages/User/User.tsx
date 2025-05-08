import React, { memo, useState, useEffect, useMemo, useCallback } from "react";
import { Backdrop, Box, CircularProgress } from "@mui/material";
import { TbarLocal, DeleteConfirm } from "components";
import Grids from "./Grids/Grids";
import {
  ITbarButton,
  IAction,
  IModeForm,
  IUserItem,
  initUserRecord,
  IActionAndSub,
} from "types";
import { getModeForm, getButtonsByAction, loadRecord } from "utils";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  useUser,
  useNotify
} from "hooks";
import {
  addAppListener,
  useAppDispatch,
  UnsubscribeListener,
} from "store/listenerMiddleware";
import { syncSuccess } from "store/user/reducer";
import { ITab } from "./Grids/data";
import Form from "./Form/Form";

interface IConfirm {
  delete: boolean;
  archive: boolean;
  actionKey: IAction;
  id: string;
  no: string;
  data: IUserItem[];
}

const UserPage = () => {
  const appDispatch = useAppDispatch();
  const { t } = useTranslation();
  const [formMode, setFormMode] = useState<IModeForm>(IModeForm.LIST);
  const [records, setRecords] = useState<IUserItem[]>([]);
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
    archivedRecords,
    archivedCount,
  } = useUser();
  const [currentTab, setCurrentTab] = useState<ITab>(ITab.ACTIVE);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState<IConfirm>({
    delete: false,
    archive: false,
    actionKey: IAction.LIST,
    id: "",
    no: "",
    data: [],
  });
  // const [key, setKey] = useState(0);

  const form = useForm<IUserItem>({ mode: "onBlur" });
  const {
    handleSubmit,
    reset,
    formState: { dirtyFields },
    // trigger,
  } = form;

  const initButtons: (IAction | ITbarButton)[] = [
    IAction.NEW,
    IAction.SAVE,
    IAction.CANCEL,
  ];
  const [tbarButtons, setTbarButtons] =
    useState<(IAction | ITbarButton)[]>(initButtons);

  const addRecord = () => {
    loadRecord(initUserRecord, form, "nbpayitemId");
    setFormMode(getModeForm(IAction.NEW));
    setTbarButtons(getButtonsByAction(initButtons, IAction.NEW));
  };

  const editRecord = useCallback((r: IUserItem) => {
    loadRecord(r, form, "userId", { guidFields: [] });
    setFormMode(getModeForm(IAction.EDIT));
    setTbarButtons(getButtonsByAction(initButtons, IAction.EDIT));
  }, []);

  const copyRecord = useCallback((r: IUserItem) => {
    const newRecord = { ...r };
    newRecord.userId = '';
    newRecord.archived = 0;
    loadRecord(newRecord, form, "nbpayitemId", { guidFields: [] });
    setFormMode(getModeForm(IAction.COPY));
    setTbarButtons(getButtonsByAction(initButtons, IAction.COPY));
  }, []);

  const deleteRecord = useCallback((rows: any) => {
    const c = currentTab === ITab.ACTIVE ? totalCount : archivedCount;

    if (rows.length !== c) {
      if (rows.length > 1) {
        const ids: any[] = [];
        rows.forEach((r: any) => {
          ids.push(r.nbpayitemId);
        });
        dels(ids, IAction.DELETE);
      } else {
        dels([rows[0].nbpayitemId], IAction.DELETE);
      }
    } else {
      delAll({ archived: currentTab === ITab.ACTIVE ? 0 : 1 }, IAction.DELETE);
    }
    setOpenDeleteConfirm((c) => ({
      ...c,
      delete: false,
      archive: false,
    }));
  },
    [currentTab, totalCount, archivedCount]
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

  const saveRecord = (type: IAction) => {
    handleSubmit(
      (o) => {
        const data: { [key: string]: any } = {};
        Object.keys(dirtyFields).forEach((key) => {
          data[key] = o[key as keyof IUserItem];
        });
        data['claims'] = o.claims;
        if (o.userId) {
          upd(data, type);
        } else {
          add(data, type);
        }
      },
      (errors) => {
        let errMessage = "";
        Object.keys(errors).forEach((key) => {
          const err = errors[key as keyof IUserItem];
          errMessage += `${err?.message} \n`;
        });
        error(errMessage);
      }
    )();
  };

  const handleActionClick = (key: IAction | IActionAndSub, r?: IUserItem[]) => {
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
        setOpenDeleteConfirm((o) => ({
          ...o,
          [key]: true,
          actionKey: key,
          data: recs,
        }));
        break;
      case IAction.SAVE:
        saveRecord(key);
        break;
      case IAction.CANCEL:
        cancelRecord();
        break;
      case IAction.LIST:
        if (formMode !== "form") {
          list();
        }
        break;
    }
  };

  const TbarTitle = useMemo(() => {
    if (records) {
      return formMode === "form" ? `${t('button.' + IAction.EDIT)}` : "";
    }
    return "";
  }, [records, formMode]);

  const ConfirmDeleteTitle = useMemo(() => {
    if (!records || records.length === 0) return "";
    if (currentTab === ITab.ACTIVE) {
      if (
        records.length !== 1 &&
        activeRecords &&
        records.length === activeRecords.length
      ) {
        return '';
        // return openDeleteConfirm.archive
        //   ? t("text.msg_confirm003", { 0: totalCount })
        //   : t("text.msg_confirm006", { 0: totalCount });
      }
    }
    if (currentTab === ITab.ARCHIVED) {
      if (
        records.length !== 1 &&
        archivedRecords &&
        records.length === archivedRecords.length
      ) {
        return '';
        // return openDeleteConfirm.archive
        //   ? t("text.msg_confirm003", { 0: archivedCount })
        //   : t("text.msg_confirm006", { 0: archivedCount });
      }
    }

    if (records.length > 1) {
      return '';
      // return openDeleteConfirm.archive
      //   ? t("text.msg_confirm003", { 0: records.length })
      //   : t("text.msg_confirm006", { 0: records.length });
    }
    return '';
    // return openDeleteConfirm.archive
    //   ? t("text.msg_confirm002")
    //   : t("text.msg_confirm005");
  }, [openDeleteConfirm, currentTab, activeRecords, records, archivedRecords]);

  useEffect(() => {
    setFormMode(getModeForm(IAction.LIST));
    setTbarButtons(getButtonsByAction(initButtons, IAction.LIST));
  }, []);

  const welldoneAlert = useCallback(
    (_actionKey: IAction, _id?: string) => {
      // console.log('chua code', actionKey, id)
      let msg = "";
      // switch (actionKey) {
      //   case IAction.SAVE:
      //     !id
      //       ? (msg = t("text.msg_welldone001"))
      //       : (msg = t("text.msg_welldone002"));
      //     break;
      //   case IAction.DELETE:
      //     formMode === IModeForm.VIEW
      //       ? (msg = t("text.msg_welldone005"))
      //       : records.length === 1
      //         ? (msg = t("text.msg_welldone008"))
      //         : (msg = t("text.msg_welldone011", { 0: records.length }));

      //     break;
      //   case IAction.ARCHIVE:
      //     formMode === IModeForm.VIEW
      //       ? (msg = t("text.msg_welldone003"))
      //       : records.length === 1
      //         ? (msg = t("text.msg_welldone006"))
      //         : (msg = t("text.msg_welldone009", { 0: records.length }));

      //     break;
      //   case IAction.RESTORE:
      //     formMode === IModeForm.VIEW
      //       ? (msg = t("text.msg_welldone004"))
      //       : records.length === 1
      //         ? (msg = t("text.msg_welldone007"))
      //         : (msg = t("text.msg_welldone010", { 0: records.length }));

      //     break;
      // }
      msg = 'xxx';
      return success(msg);
    },
    [formMode, records]
  );

  const processTabsLoad = (newTabs: ITab[]) => {
    const notExits: ITab[] = [];
    newTabs.forEach((tab) => {
      !reloadTabs.includes(tab) && notExits.push(tab);
    });
    getSummary({});
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
          setOpenDeleteConfirm((c) => ({
            ...c,
            delete: false,
            archive: false,
          }));

          switch (actionKey) {
            case IAction.SAVE:
              processTabsLoad([ITab.ACTIVE, ITab.ARCHIVED]);
              if (actionKey === IAction.SAVE) {
                list();
                welldoneAlert(actionKey, requestPayload["userId"]);
              }
              break;
            case IAction.ARCHIVE:
            case IAction.RESTORE:
            case IAction.DELETE:
              welldoneAlert(actionKey);
              processTabsLoad([ITab.ACTIVE, ITab.ARCHIVED]);
              break;
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
        title={"Nhân viên"}
        content={TbarTitle}
        buttons={tbarButtons}
        handleButtonClick={handleActionClick}
      />
      <Grids
        hidden={formMode === IModeForm.LIST ? false : true}
        currentTab={currentTab}
        tabChange={setCurrentTab}
        setReloadTabs={setReloadTabs}
        reloadTabs={reloadTabs}
        handleCellDbClick={(params) => {
          setRecords([params.row as IUserItem]);
          handleActionClick(IAction.EDIT, [params.row as IUserItem]);
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
      {(openDeleteConfirm.delete || openDeleteConfirm.archive) && (
        <DeleteConfirm
          open={openDeleteConfirm.delete || openDeleteConfirm.archive}
          title={ConfirmDeleteTitle}
          handleOK={() => {
            deleteRecord(records);
          }}
          handleClose={() => {
            setOpenDeleteConfirm((c) => ({
              ...c,
              delete: false,
              archive: false,
            }));
          }}
        />
      )}
    </Box>
  );
};

export default memo(UserPage);
