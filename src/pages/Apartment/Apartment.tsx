import React, { memo, useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Backdrop, Box, CircularProgress } from "@mui/material";
import { TbarLocal, DeleteConfirm } from "components";
import Grids from "./Grids/Grids";
import {
  ITbarButton,
  IAction,
  IModeForm,
  IApartmentItem,
  initApartmentRecord,
  IActionAndSub,
  IQueryParam,
  IApartmentStatus,
  IHistoryItem,
  IApartmentNote,
} from "types";
import { getModeForm, getButtonsByAction, loadRecord } from "utils";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  useApartment,
  useUser,
  useNotify
} from "hooks";
import {
  addAppListener,
  useAppDispatch,
  UnsubscribeListener,
} from "store/listenerMiddleware";
import { syncSuccess } from "store/apartment/reducer";
import { ITab } from "./Grids/data";
import { checkTelephone } from 'services/api/apartment';
import { getSignalRConnection } from "signalR/signalrService";
import { add as addHistory } from "services/api/history";
import Form from "./Form/Form";
import FormView from "./Form/FormView";
import AssignmentDialog from "./Form/AssignmentDialog";
import AssignmentHisDialog from "./Form/AssignmentHisDialog";
import ContentExpiredDialog from "./Form/ContentExpiredDialog";
import ConfirmSaveDialog from './ConfirmSaveDialog';
import dayjs from "dayjs";


interface IConfirm {
  delete: boolean;
  assignment: boolean;
  viewassignment: boolean;
  expiredcontent: boolean;
  validatesave: boolean;
  actionKey: IAction;
  id: string;
  no: string;
  data: IApartmentItem[];
}

const connection = getSignalRConnection();

const ApartmentPage = () => {
  const appDispatch = useAppDispatch();
  const { t } = useTranslation();
  const refSearch = useRef<{
    filter: IQueryParam;
    updTbar: boolean;
  }>({ updTbar: false, filter: {} });
  const [formMode, setFormMode] = useState<IModeForm>(IModeForm.LIST);
  const [records, setRecords] = useState<IApartmentItem[]>([]);
  const [reloadTabs, setReloadTabs] = useState<ITab[]>([]);
  const { success, error } = useNotify();
  const {
    add,
    upd,
    dels,
    delAll,
    assignment,
    isSaving,
    getSummary,
    records: activeRecords,
    totalCount,
  } = useApartment();
  const { info } = useUser();
  const [currentTab, setCurrentTab] = useState<ITab>(ITab.ALL);
  const [openConfirm, setOpenConfirm] = useState<IConfirm>({
    delete: false,
    assignment: false,
    viewassignment: false,
    expiredcontent: false,
    validatesave: false,
    actionKey: IAction.LIST,
    id: "",
    no: "",
    data: [],
  });
  // const [key, setKey] = useState(0);
  const [action, setAction] = useState<IAction>(IAction.LIST);

  const form = useForm<IApartmentItem>({ mode: "onBlur" });
  const {
    handleSubmit,
    reset,
    getValues,
    formState: { dirtyFields },
  } = form;

  const initButtons: (IAction | ITbarButton)[] = [
    IAction.NEW,
    IAction.EDIT,
    IAction.SAVE,
    IAction.CANCEL,
  ];
  const [tbarButtons, setTbarButtons] =
    useState<(IAction | ITbarButton)[]>(initButtons);

  const checkTelephoneExists = (apartmentId: string, phones: string[]) => {
    checkTelephone({ apartmentId, phones }, (rp) => {
      const rs = rp.data;
      if (rs.success) {
        const data = rs.data;
        if (data.exists) {
          setOpenConfirm(c =>
          ({
            ...c,
            validatesave: true,
            data: data.items
          }
          ));
        }
        else {
          saveRecord();
        }
      }
    });
  };

  const addLog = (data: IApartmentItem, actiontype: string) => {
    const logData = { ...data };
    const logRecord: IHistoryItem = {
      actiontype,
      formId: 'APT',
      referenceId: logData.apartmentId,
    };
    delete logData.apartmentId;
    delete logData.previoususerId;
    delete logData.userId;

    // if (!logData.details || logData.details.length === 0) delete logData.details;

    let contentlog = '';

    Object.keys(logData).forEach((key) => {
      if (key === 'details' && dirtyFields.details) {
        if (!logData.details || logData.details.length === 0) delete logData.details;
        else {
          let detLog = 'Nội dung trao đổi: [';

          logData.details.filter(f => !f.deleted).forEach((det) => {
            detLog += `\n Dòng ${det.linenum}: `;
            Object.keys(det).forEach((key) => {
              if (key !== 'apartmentId' && key !== 'deleted' && key !== 'linenum' && key !== 'type') {
                const title = t('APT.' + key);
                detLog += `${title}: ${det[key as keyof IApartmentNote]} \n`;
              }

            });
          });

          detLog += ']'
          contentlog += detLog;
        }
      }
      else if (key === 'd_Details') {
        // 
      }
      else {
        const title = t('APT.' + key);
        contentlog += `${title}: ${logData[key as keyof IApartmentItem]} \n`;
      }
    });

    logRecord.contentlog = contentlog;

    addHistory(logRecord);
  };

  const addRecord = () => {
    const record = { ...initApartmentRecord };
    record.userId = info?.userId;
    record.previoususerId = info?.userId;
    loadRecord(record, form, "apartmentId");
    setRecords([record]);
    setFormMode(getModeForm(IAction.NEW));
    setTbarButtons(getButtonsByAction(initButtons, IAction.NEW));
  };

  const editRecord = useCallback((r: IApartmentItem) => {
    if (currentTab === ITab.EXPIRED) r.isExpired = true;
    loadRecord(r, form, "apartmentId", { guidFields: [] });
    setRecords([r]);
    setFormMode(getModeForm(IAction.EDIT));
    setTbarButtons(getButtonsByAction(initButtons, IAction.EDIT));
  }, [currentTab]);

  const copyRecord = useCallback((r: IApartmentItem) => {
    const newRecord = { ...r };
    newRecord.apartmentId = '';
    newRecord.status = IApartmentStatus.HD;
    newRecord.priority = 'N';
    loadRecord(newRecord, form, "apartmentId", { guidFields: [] });
    setRecords([newRecord]);
    setFormMode(getModeForm(IAction.COPY));
    setTbarButtons(getButtonsByAction(initButtons, IAction.COPY));
  }, []);

  const deleteRecord = useCallback((rows: any) => {
    const c = totalCount;

    if (rows.length !== c) {
      if (rows.length > 1) {
        const ids: any[] = [];
        rows.forEach((r: any) => {
          ids.push(r.apartmentId);
        });
        dels(ids, IAction.DELETE);
      } else {
        dels([rows[0].apartmentId], IAction.DELETE);
      }
    } else {
      delAll({ archived: currentTab === ITab.ALL ? 0 : 1 }, IAction.DELETE);
    }
    setOpenConfirm((c) => ({
      ...c,
      delete: false,
      archive: false,
    }));
  },
    [currentTab, totalCount]
  );

  const viewRecord = useCallback((r: IApartmentItem) => {
    if (currentTab === ITab.EXPIRED) r.isExpired = true;
    loadRecord(r, form, "apartmentId", { guidFields: [] });
    setRecords([r]);
    setFormMode(getModeForm(IAction.VIEW));
    setTbarButtons(getButtonsByAction(initButtons, IAction.VIEW));
  }, [currentTab]);

  const cancelRecord = useCallback(() => {
    setFormMode(getModeForm(IAction.CANCEL));
    setTbarButtons(refSearch.current.updTbar ? [IAction.CLEAR_SEARCH, ...getButtonsByAction(initButtons, IAction.CANCEL)] : getButtonsByAction(initButtons, IAction.CANCEL));
    reset();
  }, []);

  const list = useCallback(() => {
    setRecords([]);
    setFormMode(getModeForm(IAction.LIST));
    setTbarButtons(getButtonsByAction(initButtons, IAction.LIST));
  }, []);

  const validateOnSave = () => {
    const hasModifiedTelephone = Object.keys(dirtyFields).filter(f => f === 'telephone' || f === 'telephone2' || f === 'telephone3').length > 0;
    const isNew = getValues('apartmentId') === '' || getValues('apartmentId') === undefined;
    if (hasModifiedTelephone || isNew) {
      const phones: string[] = [];
      if (getValues('telephone')) phones.push(getValues('telephone') ?? '');
      if (getValues('telephone2')) phones.push(getValues('telephone2') ?? '');
      if (getValues('telephone3')) phones.push(getValues('telephone3') ?? '');

      checkTelephoneExists(getValues('apartmentId') ?? '', phones);
    }
    else saveRecord();
  };

  const saveRecord = () => {
    handleSubmit(
      (o) => {
        const data: { [key: string]: any } = {};

        if (Object.keys(dirtyFields).length === 1 && dirtyFields.apartmentId) {
          list();
          return;
        }

        Object.keys(dirtyFields).forEach((key) => {
          data[key] = o[key as keyof IApartmentItem];
          if (key === 'details') {
            data[key] = o.details?.filter(f => f.deleted !== true);
            data['d_Details'] = o.details?.filter(f => f.deleted === true);
          }
        });

        let lookupcode = '';
        if (o.telephone) {
          lookupcode += `${o.telephone.substring(5)} - `;
        }
        if (o.telephone2) {
          lookupcode += `${o.telephone2.substring(5)} - `;
        }
        if (o.telephone3) {
          lookupcode += `${o.telephone3.substring(5)} - `;
        }
        if (lookupcode !== '') {
          lookupcode = lookupcode.substring(0, lookupcode.length - 3);
          if (lookupcode !== o.lookupcode)
            data['lookupcode'] = lookupcode;
        }

        if (o.apartmentId) {
          upd(data, IAction.SAVE);
        } else {
          add(data, IAction.SAVE);
        }
      },
      (errors) => {
        let errMessage = "";
        Object.keys(errors).forEach((key) => {
          const err = errors[key as keyof IApartmentItem];
          errMessage += `${err?.message} \n`;
        });
        error(errMessage);
      }
    )();
  };

  const handleActionClick = (key: IAction | IActionAndSub, r?: IApartmentItem[]) => {
    const recs = r ?? records;
    switch (key) {
      case IAction.NEW:
        addRecord();
        break;
      case IAction.COPY:
        copyRecord(recs[0]);
        break;
      case IAction.EDIT:
        editRecord(recs[0]);
        break;
      case IAction.VIEW:
        viewRecord(recs[0]);
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
        if (recs[0].isExpired) {
          setOpenConfirm((o) => ({
            ...o,
            expiredcontent: true,
            [key]: true,
            actionKey: key,
            data: recs,
          }));
        }
        else {
          // saveRecord();
          validateOnSave();
        }

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
        refSearch.current.updTbar = false;
        setAction(key);
        break;
    }
  };

  const TbarTitle = useMemo(() => {
    if (records.length > 0 && records[0].apartmentId) {
      return formMode === "form" ? `${t('button.' + IAction.EDIT)}` : "";
    }
    return "";
  }, [records, formMode]);

  const ConfirmDeleteTitle = useMemo(() => {
    if (!records || records.length === 0) return "";

    if (records.length > 1) {
      return t("text.deletesConfirm", { 0: records.length, 1: 'Chính chủ' });
    }
    return t("text.deleteConfirm", { 0: 'Chính chủ' });
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
          msg = t("text.msg_welldone008", { 0: records.length, 1: 'Chính chủ' });

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
          const { actionKey, data, requestPayload } = payload;
          setOpenConfirm((c) => ({
            ...c,
            delete: false,
            assignment: false,
          }));

          switch (actionKey) {
            case IAction.SAVE:
              if (requestPayload.apartmentId) addLog(requestPayload, 'U');
              else addLog({ ...requestPayload, apartmentId: data['apartmentId'] }, 'C');

              processTabsLoad([ITab.ALL, currentTab]);
              if (actionKey === IAction.SAVE) {
                welldoneAlert(actionKey, requestPayload["apartmentId"]);
              }
              if (connection && !requestPayload["apartmentId"]) {
                connection.invoke("GetBadgetCountApartment", data["apartmentId"]);
              }
              list();
              break;
            case IAction.ARCHIVE:
            case IAction.RESTORE:
            case IAction.DELETE:
              welldoneAlert(actionKey);
              processTabsLoad([ITab.ALL]);
              break;
            case IAction.ASSIGNMENT:
              processTabsLoad([ITab.ALL]);
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
        title={"Chính chủ"}
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
          setRecords([params.row as IApartmentItem]);
          handleActionClick(IAction.VIEW, [params.row as IApartmentItem]);
        }}
        handleActionClick={(key, rows) => {
          setRecords(rows);
          handleActionClick(key, rows);
        }}
      />
      {formMode === IModeForm.FORM && <Form useForm={form} />}
      {formMode === IModeForm.VIEW && <FormView record={records[0]} />}
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
              viewassignment: false,
              expiredcontent: false,
              validatesave: false,
            }));
          }}
        />
      )}
      {openConfirm.assignment && (
        <AssignmentDialog
          handleButtonClick={(userId: string) => {
            const ids = openConfirm.data.map(f => { return f.apartmentId ? f.apartmentId : '' });
            assignment({
              ids,
              assignee: userId
            }, IAction.ASSIGNMENT);
          }}
          handleClose={() => {
            setOpenConfirm((c) => ({
              ...c,
              delete: false,
              assignment: false,
              viewassignment: false,
              expiredcontent: false,
              validatesave: false,
            }));
          }}
        />
      )}
      {openConfirm.viewassignment && (
        <AssignmentHisDialog
          data={openConfirm.data[0]}
          handleClose={() => {
            setOpenConfirm((c) => ({
              ...c,
              delete: false,
              assignment: false,
              viewassignment: false,
              expiredcontent: false,
              validatesave: false,
            }));
          }}
        />
      )}
      {openConfirm.expiredcontent && (
        <ContentExpiredDialog
          handleButtonClick={(v) => {
            const details = form.getValues('details') ?? [];
            details.push({
              type: 'E',
              entrydate: dayjs().format("YYYY-MM-DD"),
              notes: v,
            });
            form.setValue('details', details, { shouldDirty: true });
            saveRecord();
            setOpenConfirm((c) => ({
              ...c,
              delete: false,
              assignment: false,
              viewassignment: false,
              expiredcontent: false,
              validatesave: false,
            }));
          }}
          handleClose={() => {
            setOpenConfirm((c) => ({
              ...c,
              delete: false,
              assignment: false,
              viewassignment: false,
              expiredcontent: false,
              validatesave: false,
            }));
          }}
        />
      )}
      {openConfirm.validatesave && (
        <ConfirmSaveDialog
          items={openConfirm.data}
          handleButtonClick={() => {
            saveRecord();
            setOpenConfirm((c) => ({
              ...c,
              delete: false,
              assignment: false,
              viewassignment: false,
              expiredcontent: false,
              validatesave: false,
            }));
          }}
          handleClose={() => {
            setOpenConfirm((c) => ({
              ...c,
              delete: false,
              assignment: false,
              viewassignment: false,
              expiredcontent: false,
              validatesave: false,
            }));
          }}
        />
      )}
    </Box>
  );
};

export default memo(ApartmentPage);