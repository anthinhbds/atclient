import React, { memo, useState, useEffect, useMemo, useCallback } from "react";
import { Backdrop, Box, CircularProgress } from "@mui/material";
import { TbarLocal, DeleteConfirm } from "components";
import Grids from "./Grids/Grids";
import {
  ITbarButton,
  IAction,
  IModeForm,
  ICustomerJourneyItem,
  initCustomerJourneyRecord,
  IActionAndSub,
} from "types";
import { getModeForm, getButtonsByAction, loadRecord, convertYMDtoSync } from "utils";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  useCustomerJourney,
  useNotify
} from "hooks";
import {
  addAppListener,
  useAppDispatch,
  UnsubscribeListener,
} from "store/listenerMiddleware";
import { syncSuccess } from "store/customerjourney/reducer";
import Form from "./Form/Form";

interface IConfirm {
  delete: boolean;
  archive: boolean;
  actionKey: IAction;
  id: string;
  no: string;
  data: ICustomerJourneyItem[];
}

const CustomerJourneyPage = () => {
  const appDispatch = useAppDispatch();
  const { t } = useTranslation();
  const [formMode, setFormMode] = useState<IModeForm>(IModeForm.LIST);
  const [records, setRecords] = useState<ICustomerJourneyItem[]>([]);
  const { success, error } = useNotify();
  const {
    add,
    upd,
    dels,
    isSaving,
    records: activeRecords,
    totalCount,
  } = useCustomerJourney();
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState<IConfirm>({
    delete: false,
    archive: false,
    actionKey: IAction.LIST,
    id: "",
    no: "",
    data: [],
  });
  // const [key, setKey] = useState(0);

  const form = useForm<ICustomerJourneyItem>({ mode: "onBlur" });
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
    loadRecord(initCustomerJourneyRecord, form, "customerId");
    setFormMode(getModeForm(IAction.NEW));
    setTbarButtons(getButtonsByAction(initButtons, IAction.NEW));
  };

  const editRecord = useCallback((r: ICustomerJourneyItem) => {
    loadRecord(r, form, "customerId", { guidFields: [] });
    setFormMode(getModeForm(IAction.EDIT));
    setTbarButtons(getButtonsByAction(initButtons, IAction.EDIT));
  }, []);

  const copyRecord = useCallback((r: ICustomerJourneyItem) => {
    const newRecord = { ...r };
    loadRecord(newRecord, form, "customerId", { guidFields: [] });
    setFormMode(getModeForm(IAction.COPY));
    setTbarButtons(getButtonsByAction(initButtons, IAction.COPY));
  }, []);



  const deleteRecord = useCallback((rows: any) => {

    if (rows.length > 1) {
      const ids: any[] = [];
      rows.forEach((r: any) => {
        ids.push(r.customerId);
      });
      dels(ids, IAction.DELETE);
    } else {
      dels([rows[0].customerId], IAction.DELETE);
    }
    setOpenDeleteConfirm((c) => ({
      ...c,
      delete: false,
      archive: false,
    }));
  },
    [totalCount]
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
          if (key === 'details') {
            if (o[key] && o[key].length > 0) {
              data[key] = o[key]?.map(r => ({
                ...r,
                project: r.arrayProject?.join(';'),
                journeydate: r.journeydate ? convertYMDtoSync(r.journeydate, true) : '1911-01-01'
              }));
            }
            else {
              data[key] = o[key as keyof ICustomerJourneyItem];
            }
          }
          else {
            data[key] = o[key as keyof ICustomerJourneyItem];
          }
        });


        if (o.isNew === true) {
          add(data, type);
        } else {
          upd(data, type);
        }
      },
      (errors) => {
        let errMessage = "";
        Object.keys(errors).forEach((key) => {
          const err = errors[key as keyof ICustomerJourneyItem];
          errMessage += `${err?.message} \n`;
        });
        error(errMessage);
      }
    )();
  };

  const handleActionClick = (key: IAction | IActionAndSub, r?: ICustomerJourneyItem[]) => {
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
    if (records.length > 0 && records[0].customerId) {
      return formMode === "form" ? `${t('button.' + IAction.EDIT)}` : "";
    }
    return "";
  }, [records, formMode]);

  const ConfirmDeleteTitle = useMemo(() => {
    if (!records || records.length === 0) return "";
    if (
      records.length !== 1 &&
      activeRecords &&
      records.length === activeRecords.length
    ) {
      return openDeleteConfirm.archive
        ? t("text.archivesConfirm", { 0: totalCount, 1: 'Dự án' })
        : t("text.deletesConfirm", { 0: totalCount, 1: 'Dự án' });
    }

    if (records.length > 1) {
      return openDeleteConfirm.archive
        ? t("text.archivesConfirm", { 0: records.length, 1: 'Dự án' })
        : t("text.deletesConfirm", { 0: records.length, 1: 'Dự án' });
    }
    return openDeleteConfirm.archive
      ? t("text.archiveConfirm", { 0: 'Dự án' })
      : t("text.deleteConfirm", { 0: 'Dự án' });
  }, [openDeleteConfirm, activeRecords, records]);

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
          formMode === IModeForm.VIEW
            ? (msg = t("text.msg_welldone005"))
            : records.length === 1
              ? (msg = t("text.msg_welldone008"))
              : (msg = t("text.msg_welldone011", { 0: records.length }));

          break;
        case IAction.ARCHIVE:
          formMode === IModeForm.VIEW
            ? (msg = t("text.msg_welldone003"))
            : records.length === 1
              ? (msg = t("text.msg_welldone006"))
              : (msg = t("text.msg_welldone009", { 0: records.length }));

          break;
        case IAction.RESTORE:
          formMode === IModeForm.VIEW
            ? (msg = t("text.msg_welldone004"))
            : records.length === 1
              ? (msg = t("text.msg_welldone007"))
              : (msg = t("text.msg_welldone010", { 0: records.length }));

          break;
      }
      return success(msg);
    },
    [formMode, records]
  );


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
              if (actionKey === IAction.SAVE) {
                welldoneAlert(actionKey, requestPayload["customerId"]);
              }
              if (!requestPayload['customerId']) list();
              break;
            case IAction.ARCHIVE:
            case IAction.RESTORE:
            case IAction.DELETE:
              welldoneAlert(actionKey);
              break;
          }
        },
      })
    );
    return unsubscribe as unknown as UnsubscribeListener;
  }, [records, formMode]);
  return (
    <Box width={1} height={1}>
      <TbarLocal
        formMode={formMode}
        title={"Lịch dẫn khách"}
        content={TbarTitle}
        buttons={tbarButtons}
        handleButtonClick={handleActionClick}
      />
      <Grids
        hidden={formMode === IModeForm.LIST ? false : true}
        handleCellDbClick={(params) => {
          setRecords([params.row as ICustomerJourneyItem]);
          handleActionClick(IAction.EDIT, [params.row as ICustomerJourneyItem]);
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

export default memo(CustomerJourneyPage);