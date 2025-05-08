import React, { useMemo, memo } from "react";
import { Box, Toolbar, Typography } from "@mui/material";
import createStyles from "./styles";
import { Stack } from "@mui/material";
import ButtonIcon from "components/Buttons/ButtonIcon";
import {
  IAction,
  ITbarButton,
  IModeForm,
  actionButtons,
  IActionAndSub,
} from "types";
import { findItemInArray } from "utils";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import Icons from "assets/Icons";
import ButtonMenu from "./ButtonMenu";

interface ITbarLocal {
  rootAction?: IAction;
  formMode?: IModeForm;
  title?: string;
  content?: string;
  subContent?: string;
  buttons?: (ITbarButton | IAction)[];
  isEditing?: boolean;
  handleButtonClick?: (action: IAction | IActionAndSub) => void;
}

const TbarLocal = ({
  formMode,
  title = "",
  content = "",
  subContent = "",
  buttons = [],
  handleButtonClick,
  rootAction = IAction.LIST,
  isEditing = false,
}: ITbarLocal) => {
  const { t } = useTranslation();
  const styles = createStyles();
  const IconComponent = useCallback((icKey: keyof typeof Icons) => {
    const ICon = Icons[icKey];
    return ICon ? (
      <ICon color={"#FFF"} width={14} height={14} viewBox={"0 0 14 14"} />
    ) : (
      <></>
    );
  }, []);

  const items = buttons.map((button) => {
    if (typeof button === "string") {
      const i = findItemInArray(actionButtons, button);
      return { ...i };
    } else {
      return { ...button };
    }
  });

  const sxOverride = useMemo(
    () => (formMode === "form" ? { cursor: "normal" } : { cursor: "pointer" }),
    [formMode]
  );

  return (
    <Box display={"flex"}>
      <Toolbar sx={styles.tbarLocal}>
        <Stack direction={"row"} columnGap={0.5}>
          <Typography
            sx={{ ...styles.labelForm, ...sxOverride }}
            onClick={() => {
              if (isEditing) return;
              handleButtonClick?.(rootAction);
            }}>
            {title}
          </Typography>
          {content && (
            <>
              <Typography sx={{ ...styles.labelForm, ...sxOverride }}>
                {" > "}
              </Typography>
              <Typography
                sx={{ ...styles.content, ...(subContent ? sxOverride : {}) }}
                onClick={() => {
                  if (isEditing) return;
                  subContent && handleButtonClick?.(IAction.LIST);
                }}>
                {content}
              </Typography>
            </>
          )}
          {subContent && (
            <>
              <Typography sx={{ ...styles.labelForm, ...sxOverride }}>
                {" > "}
              </Typography>
              <Typography sx={styles.content}>{subContent}</Typography>
            </>
          )}
        </Stack>

        <Stack sx={{ ml: "auto" }} direction={"row"}>
          {items.map((button, idx) => {
            if (button.items?.length > 0) {
              return (
                <ButtonMenu
                  icon={IconComponent(button.icon)}
                  type={button.type ?? "button"}
                  key={idx}
                  actionKey={button.key}
                  label={button.label}
                  items={button.items}
                  isEditing={isEditing}
                  handleActionClick={handleButtonClick}
                />
              );
            } else {
              return (
                <ButtonIcon
                  key={idx}
                  type={button.type ?? "button"}
                  IconComponent={IconComponent(button.icon)}
                  text={t(`button.${button.key}`)}
                  onClick={() => {
                    if (isEditing) return;
                    handleButtonClick?.(button.key);
                  }}
                />
              );
            }
          })}
        </Stack>
      </Toolbar>
    </Box>
  );
};

export default memo(TbarLocal);
