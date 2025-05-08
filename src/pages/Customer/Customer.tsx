import React, { memo, useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Backdrop, Box, CircularProgress } from "@mui/material";
import { TbarLocal, DeleteConfirm } from "components";
import Grids from "./Grids/Grids";
import {
  ITbarButton,
  IAction,
  IModeForm,
  ICustomerItem,
  initCustomerRecord,
  IActionAndSub,
  IQueryParam,
  ICustomerStatus,
  IHistoryItem,
  ICustomerNote,
} from "types";
import { getModeForm, getButtonsByAction, loadRecord } from "utils";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  useCustomer,
  useUser,
  useNotify
} from "hooks";
import {
  addAppListener,
  useAppDispatch,
  UnsubscribeListener,
} from "store/listenerMiddleware";
import { syncSuccess } from "store/customer/reducer";
import { ITab } from "./Grids/data";
import { checkTelephone } from "services/api/customer";
import { add as addHistory } from "services/api/history";
import Form from "./Form/Form";
import AssignmentDialog from "./Form/AssignmentDialog";
import AssignmentHisDialog from "./Form/AssignmentHisDialog";

interface IConfirm {
  delete: boolean;
  assignment: boolean;
  viewassignment: boolean;
  actionKey: IAction;
  id: string;
  no: string;
  data: ICustomerItem[];
}

const CustomerPage = () => {
  const appDispatch = useAppDispatch();
  const { t } = useTranslation();
  const refSearch = useRef<{
    filter: IQueryParam;
    updTbar: boolean;
  }>({ updTbar: false, filter: {} });
  const [formMode, setFormMode] = useState<IModeForm>(IModeForm.LIST);
  const [records, setRecords] = useState<ICustomerItem[]>([]);
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
  } = useCustomer();
  const { info } = useUser();
  const [currentTab, setCurrentTab] = useState<ITab>(ITab.ALL);
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

  const form = useForm<ICustomerItem>({ mode: "onBlur" });
  const {
    handleSubmit,
    reset,
    getValues,
    formState: { dirtyFields },
  } = form;

  const initButtons: (IAction | ITbarButton)[] = [
    IAction.NEW,
    IAction.SAVE,
    IAction.CANCEL,
  ];
  const [tbarButtons, setTbarButtons] =
    useState<(IAction | ITbarButton)[]>(initButtons);

  const checkTelephoneExists = (apartmentId: string, phones: string[]) => {
    checkTelephone({ apartmentId, phones }, (rp: any) => {
      const rs = rp.data;
      if (rs.success) {
        const data = rs.data;
        if (data.exists) {
          if (data.items.length > 0) error(`Số điện thoại này đang thuộc nhân viên (${data.items[0].username}) trong hệ thống!`);
          else error(`Số điện thoại này đã tồn tại trong hệ thống!`);
          return;

        }
        else {
          saveRecord();
        }
      }
    });
  };

  const addLog = (data: ICustomerItem, actiontype: string) => {
    const logData = { ...data };
    const logRecord: IHistoryItem = {
      actiontype,
      formId: 'CUS',
      referenceId: logData.customerId,
    };
    delete logData.customerId;
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
              if (key !== 'customerId' && key !== 'deleted' && key !== 'linenum' && key !== 'type') {
                const title = t('CUS.' + key);
                detLog += `${title}: ${det[key as keyof ICustomerNote]} \n`;
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
        const title = t('CUS.' + key);
        contentlog += `${title}: ${logData[key as keyof ICustomerItem]} \n`;
      }
    });

    logRecord.contentlog = contentlog;

    addHistory(logRecord);
  };

  const addRecord = () => {
    const record = { ...initCustomerRecord };
    record.userId = info?.userId;
    record.previoususerId = info?.userId;
    loadRecord(record, form, "customerId");
    setFormMode(getModeForm(IAction.NEW));
    setTbarButtons(getButtonsByAction(initButtons, IAction.NEW));
  };

  const editRecord = useCallback((r: ICustomerItem) => {
    r.arrayProject = r.project ? r.project.split(';') : [];
    r.arrayBedroom = r.bedroom ? r.bedroom.split(';') : [];
    loadRecord(r, form, "customerId", { guidFields: [] });
    setFormMode(getModeForm(IAction.EDIT));
    setTbarButtons(getButtonsByAction(initButtons, IAction.EDIT));
  }, [currentTab]);

  const copyRecord = useCallback((r: ICustomerItem) => {
    const newRecord = { ...r };
    newRecord.customerId = '';
    newRecord.status = ICustomerStatus.HD;
    newRecord.priority = 'N';
    loadRecord(newRecord, form, "customerId", { guidFields: [] });
    setFormMode(getModeForm(IAction.COPY));
    setTbarButtons(getButtonsByAction(initButtons, IAction.COPY));
  }, []);

  const deleteRecord = useCallback((rows: any) => {
    const c = totalCount;

    if (rows.length !== c) {
      if (rows.length > 1) {
        const ids: any[] = [];
        rows.forEach((r: any) => {
          ids.push(r.customerId);
        });
        dels(ids, IAction.DELETE);
      } else {
        dels([rows[0].customerId], IAction.DELETE);
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

  const validateOnSave = () => {
    const hasModifiedTelephone = Object.keys(dirtyFields).filter(f => f === 'telephone' || f === 'telephone2' || f === 'telephone3').length > 0;
    const isNew = getValues('customerId') === '' || getValues('customerId') === undefined;
    if (hasModifiedTelephone || isNew) {
      const phones: string[] = [];
      if (getValues('telephone')) phones.push(getValues('telephone') ?? '');
      if (getValues('telephone2')) phones.push(getValues('telephone2') ?? '');
      if (getValues('telephone3')) phones.push(getValues('telephone3') ?? '');

      checkTelephoneExists(getValues('customerId') ?? '', phones);
    }
    else saveRecord();
  };

  const saveRecord = () => {
    handleSubmit(
      (o) => {
        const data: { [key: string]: any } = {};
        if (Object.keys(dirtyFields).length === 1 && dirtyFields.customerId) {
          list();
          return;
        }
        Object.keys(dirtyFields).forEach((key) => {

          if (key === 'arrayProject') {
            const vals = o.arrayProject;
            data['project'] = vals ? vals.join(';') : '';
          }
          else if (key === 'arrayBedroom') {
            const vals = o.arrayBedroom;
            data['bedroom'] = vals ? vals.join(';') : '';
          }
          else data[key] = o[key as keyof ICustomerItem];

          if (key === 'details') {
            data[key] = o.details?.filter(f => f.deleted !== true);
            data['d_Details'] = o.details?.filter(f => f.deleted === true);
          }
        });

        if (o.customerId) {
          upd(data, IAction.SAVE);
        } else {
          add(data, IAction.SAVE);
        }
      },
      (errors) => {
        let errMessage = "";
        Object.keys(errors).forEach((key) => {
          const err = errors[key as keyof ICustomerItem];
          errMessage += `${err?.message} \n`;
        });
        error(errMessage);
      }
    )();
  };

  const handleActionClick = (key: IAction | IActionAndSub, r?: ICustomerItem[]) => {
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
        validateOnSave();
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
    if (records.length > 0 && records[0].customerId) {
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
          const { data, actionKey, requestPayload } = payload;
          setOpenConfirm((c) => ({
            ...c,
            delete: false,
            assignment: false,
          }));

          switch (actionKey) {
            case IAction.SAVE:
              if (requestPayload.customerId) addLog(requestPayload, 'U');
              else addLog({ ...requestPayload, customerId: data['customerId'] }, 'C');

              processTabsLoad([ITab.ALL, currentTab]);
              if (actionKey === IAction.SAVE) {
                welldoneAlert(actionKey, requestPayload["customerId"]);
              }
              list();
              break;
            case IAction.ARCHIVE:
            case IAction.RESTORE:
            case IAction.DELETE:
              addHistory({
                referenceId: requestPayload[0],
                actiontype: 'D',
                formId: 'CUS',
                contentlog: '',
              });
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
        title={"Khách hàng"}
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
          setRecords([params.row as ICustomerItem]);
          handleActionClick(IAction.EDIT, [params.row as ICustomerItem]);
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
      {openConfirm.assignment && (
        <AssignmentDialog
          handleButtonClick={(userId: string) => {
            const ids = openConfirm.data.map(f => { return f.customerId ? f.customerId : '' });
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
            }));
          }}
        />
      )}

    </Box>
  );
};

export default memo(CustomerPage);