import React, { memo, useEffect, useState, useCallback } from "react";
import {
  addAppListener,
  useAppDispatch,
  UnsubscribeListener,
} from "store/listenerMiddleware";
import {
  Box,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid2,
  DialogActions,
  Typography,
  // PaperProps,
  // Paper,
} from "@mui/material";
import {
  TextField,
  Autocomplete,
  // NumberField,
  Button,
} from "components";
import defaultStyle from "utils/styles";
import { Clear } from "@mui/icons-material";
import {
  IAdvSearchButton,
  IFilterItem,
  IUserSearchProfileItem,
  IAction,
  SourceBedroom,
  EClaimType,
} from "types";
import { loadRecord, data2Filter } from "utils";
import { saveSearchProfileSuccess } from "store/user/reducer";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getSearchProfile as apiGetSearchProfile } from "services/api/user";
import { useUser, useNotify } from "hooks";
import { IFormValues, initialAdvanceFilter } from "./data";
import { get as getProject, getDistrict } from 'services/api/project';
import { getCombo as getUser } from 'services/api/user';
import DialogAddAdvance from "./DialogAddAdvance";

interface IAdvanceSearch {
  handleButtonClick: (
    searchItems?: IFilterItem[],
    idProfile?: string,
    catchedData?: any
  ) => void;
  handleClose: () => void;
  defaultValues: IFormValues;
}
const AdvanceSearch = ({
  defaultValues,
  handleButtonClick,
  handleClose,
}: IAdvanceSearch) => {
  const dStyles = defaultStyle();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const {
    getSearchProfile,
    addSearchProfile,
    updSearchProfile,
    delSearchProfile,
    info
  } = useUser();
  const { success } = useNotify();
  const appDispatch = useAppDispatch();
  const [key, setKey] = useState(0);

  const form = useForm<IFormValues>({ defaultValues });
  const { getValues, setValue, register, handleSubmit, control } = form;
  const searchProfile = useWatch({ control, name: "id" });
  useWatch({ control, name: "projectId" });

  const buttonClick = useCallback(
    (o: any, actionKey: IAdvSearchButton, record?: IUserSearchProfileItem) => {
      if (o.project) {
        o['project.districtId'] = o.project.districtId;
        delete o.project;
      }
      const fs: IFilterItem[] = data2Filter(o, {
        dateFields: [],
        numberFields: ["area", "price"],
        arrFields: ["projectId", "bedroom"],
      });
      const { id } = o;
      delete o.id;

      // Object.keys(rest).forEach((key) => {
      //   if (rest[key]) {
      //     let method = "contain";
      //     let value = rest[key];
      //     if (key === "projectId" || key === "bedroom") {
      //       method = "in";
      //       value = [...(rest[key] ?? [])];
      //     }

      //     fs.push({ property: key, value, method });
      //   }
      // });
      if (actionKey === IAdvSearchButton.SEARCH) handleButtonClick(fs, id, o);
      else {
        if (record) {
          const formId = "apartment";
          const profileName = record?.profileName;
          const searchingContent = JSON.stringify(fs ?? []);
          if (record.id) {
            updSearchProfile({ id: record.id, searchingContent }, IAction.EDIT);
          } else {
            addSearchProfile(
              { formId, profileName, searchingContent },
              IAction.ADD
            );
          }
        }
      }
    },
    [handleButtonClick]
  );

  useEffect(() => {
    const unsubscribe = appDispatch(
      addAppListener({
        actionCreator: saveSearchProfileSuccess,
        effect: ({
          payload,
        }: {
          payload: { actionKey?: IAction; data: any; requestPayload: any };
        }) => {
          const { actionKey } = payload;
          if (actionKey === IAction.ADD) {
            setValue("id", payload.data.id);
            success(t("text.msg_welldone001"));
          } else if (actionKey === IAction.EDIT) {
            success(t("text.msg_welldone002"));
          } else if (actionKey === IAction.DELETE) {
            loadRecord(initialAdvanceFilter, form, "id");
            success(t("text.msg_welldone099"));
          }
          getSearchProfile({
            page: 0,
            pageSize: 100,
            filter: [{ property: "formId", value: "apartment", method: "eq" }],
          });
        },
      })
    );
    return unsubscribe as unknown as UnsubscribeListener;
  }, []);

  return (
    <React.Fragment>
      <Dialog
        sx={{
          "& .MuiPaper-root": {
            width: "680px",
            maxWidth: "730px",
            height: "640px",
            ...dStyles.dialogPaper,
          },
        }}
        // PaperComponent={PaperComponent}
        open={true}>
        <Box display={"flex"} style={dStyles.dialogTitleWrapper}>
          <DialogTitle
            sx={dStyles.dialogTitleLabel}
            id="draggable-dialog-advsearch">
            {`${t("SEARCH.title")} chính chủ`}
          </DialogTitle>
          <Clear sx={dStyles.dialogTitleButton} onClick={handleClose} />
        </Box>
        <DialogContent key={key} sx={{ p: "20px 0px" }}>
          <Box px={"32px"} display={"flex"}>
            <Autocomplete
              fullWidth
              label={t(`SEARCH.title1`)}
              idField="id"
              defaultValue={searchProfile}
              textField="profileName"
              store={{
                fnGetData: apiGetSearchProfile,
                params: {
                  filter: [
                    { property: "formId", value: "apartment", method: "eq" },
                  ],
                },
              }}
              {...register("id", {
                onChange: (e) => {
                  const { rec } = e.target;
                  if (rec) {
                    const fs = JSON.parse(
                      rec.searchingContent !== ""
                        ? rec.searchingContent
                        : "[]"
                    );
                    fs.forEach((item: any) => {
                      setValue(item.property, item.value);
                    });
                  }
                },
              })}
            />
            {searchProfile && (
              <Button
                sx={{
                  ...dStyles.dialogActionButton,
                  ml: "18px",
                  mt: "auto",
                }}
                text={t("SEARCH.btn_delete")}
                onClick={() => {
                  delSearchProfile(searchProfile, IAction.DELETE);
                }}
              />
            )}
          </Box>
          <Grid2
            container
            {...dStyles.containerResponsive}
            sx={{
              p: "16px 32px",
              mt: '24px'
            }}
          >
            <Grid2 size={6}>
              <TextField
                fullWidth
                label={t("Nhu cầu")}
                defaultValue={getValues("demand")}
                {...register("demand")}
              />
            </Grid2>
            <Grid2 size={6}>
              <TextField
                fullWidth
                defaultValue={getValues("telephone")}
                label={t("Số điện thoại")}
                {...register("telephone")}
              />
            </Grid2>
            <Grid2 size={6}>
              <TextField
                fullWidth
                label={t("Mã căn hộ")}
                defaultValue={getValues("apartmentno")}
                {...register("apartmentno")}
              />
            </Grid2>
            <Grid2 size={6}>
              <Autocomplete
                label={'Quận/Huyện'}
                idField="districtId"
                textField="districtname"
                defaultValue={getValues("project.districtId")}
                store={{
                  fnGetData: getDistrict,
                }}
                {...register("project.districtId")}
              />
            </Grid2>
            {info && info.claimType && info.claimType.indexOf(EClaimType.ADMIN) !== -1 && (
              <Grid2 size={6}>
                <Autocomplete
                  label={'Nhân viên'}
                  idField="userId"
                  textField="name"
                  defaultValue={getValues("userId")}
                  store={{
                    fnGetData: getUser,
                  }}
                  {...register("userId")}
                />
              </Grid2>
            )}
            <Grid2 size={12}>
              <Autocomplete
                multiple={true}
                label={'Dự án'}
                idField="projectId"
                textField="projectname"
                defaultValue={getValues("projectId")}
                store={{
                  fnGetData: getProject,
                }}
                {...register("projectId")}
              />
            </Grid2>
            <Grid2 size={12}>
              <TextField
                fullWidth
                label={t("Ghi chú")}
                defaultValue={getValues("notes")}
                {...register("notes")}
              />
            </Grid2>
            <Grid2 size={6}>
              <Autocomplete
                multiple={true}
                label={'Số phòng ngủ'}
                defaultValue={getValues("bedroom")}
                store={{
                  mode: 'local',
                  data: SourceBedroom
                }}
                {...register("bedroom")}
              />
            </Grid2>
            <Grid2 size={6}>
              <TextField
                fullWidth
                label={t("Nội thất")}
                defaultValue={getValues("furniture")}
                {...register("furniture")}
              />
            </Grid2>

            <Grid2 container size={12} mt={1}>
              <Stack width={1}>
                <Typography sx={{ fontWeight: 700 }}>Diện tích</Typography>
                <Stack direction={'row'} mt={0.5}>
                  <TextField
                    fullWidth
                    label={t("Từ")}
                    defaultValue={getValues("areaFrom")}
                    {...register("areaFrom")}
                  />
                  <div style={{ minWidth: '36px' }}></div>
                  <TextField
                    fullWidth
                    label={t("Đến")}
                    defaultValue={getValues("areaTo")}
                    {...register("areaTo")}
                  />
                </Stack>
              </Stack>
            </Grid2>
            <Grid2 container size={12} mt={1}>
              <Stack width={1}>
                <Typography sx={{ fontWeight: 900 }}>Giá</Typography>
                <Stack direction={'row'} mt={0.5}>
                  <TextField
                    fullWidth
                    label={t("Từ")}
                    defaultValue={getValues("priceFrom")}
                    {...register("priceFrom")}
                  />
                  <div style={{ minWidth: '36px' }}></div>
                  <TextField
                    fullWidth
                    label={t("Đến")}
                    defaultValue={getValues("priceTo")}
                    {...register("priceTo")}
                  />
                </Stack>
              </Stack>
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions
          sx={dStyles.dialogBottomWrapper}>
          <Button
            sx={dStyles.dialogActionButton}
            text={t("Đặt lại")}
            onClick={() => {
              setKey((old) => ++old);
              loadRecord(initialAdvanceFilter, form, "id");
            }}
          />
          <Button
            sx={dStyles.dialogActionButton}
            text={t("Lưu hồ sơ")}
            onClick={() => {
              setOpen(true);
            }}
          />
          {searchProfile && (
            <Button
              sx={dStyles.dialogActionButton}
              text={t("Lưu")}
              onClick={() => {
                const id = getValues("id");
                handleSubmit((o) => {
                  buttonClick(o, IAdvSearchButton.SAVE, { id });
                })();
              }}
            />
          )}
          <Button
            sx={dStyles.dialogActionButton}
            text={t("Tìm kiếm")}
            onClick={() => {
              handleSubmit((o) => {
                buttonClick(o, IAdvSearchButton.SEARCH);
              })();
            }}
          />
        </DialogActions>
      </Dialog>
      {open && (
        <DialogAddAdvance
          handleClose={() => {
            setOpen(false);
          }}
          handleButtonClick={(profileName: any) => {
            const record = { profileName };
            handleSubmit((o) => {
              buttonClick(o, IAdvSearchButton.SAVE, record);
            })();
            setOpen(false);
          }}
        />
      )}
    </React.Fragment>
  );
};

export default memo(AdvanceSearch);
