import React, { createContext, useReducer, useContext } from "react";
import { useLayout } from "hooks";
import { IThemeMode } from "types";
import {
  themes,
  defaultTheme
} from "theme/themes";
import { ThemeProvider, createTheme } from "@mui/material";
// import { useTranslation } from "react-i18next";
// import *  as locales from '@mui/material/locale';


interface IReportMenu {
  key: string;
  text: string;
}
export interface IContextState {
  sideBarOpen: boolean;
  themeMode: IThemeMode;
  activePage: string;
  reportSetting: IReportMenu[];
}
export enum ILayoutActionsType {
  CHANGE_PAGE = "CHANGE_PAGE",
  CHANGE_THEME = "CHANGE_THEME",
  SIDEBAR_CHANGE = "SIDEBAR_CHANGE",
  REPORT_SETTING = "REPORT_SETTING",
}
const LayoutStateContext = createContext<IContextState>({
  sideBarOpen: true,
  activePage: "",
  themeMode: IThemeMode.MAIN,
  reportSetting: [],
});
const LayoutDispatchContext = createContext<any>(null);

function layoutReducer(state: any, action: any) {
  switch (action.type) {
    case ILayoutActionsType.CHANGE_PAGE:
      return {
        ...state,
        activePage: action.payload,
      };
    case ILayoutActionsType.CHANGE_THEME:
      return {
        ...state,
        themeMode: action.payload,
      };
    case ILayoutActionsType.SIDEBAR_CHANGE:
      return {
        ...state,
        sideBarOpen: action.payload,
      };
    case ILayoutActionsType.REPORT_SETTING:
      return {
        ...state,
        reportSetting: action.payload,
      };
  }
}
function LayoutProvider({ children }: any) {

  const { getLayoutKey } = useLayout();
  const layout = getLayoutKey();
  const [state, dispatch] = useReducer(layoutReducer, {
    sideBarOpen: layout.sideBar ?? true,
    themeMode: (layout.theme ?? IThemeMode.MAIN) as IThemeMode,

  });
  const theme = state.themeMode ? createTheme(themes[state.themeMode as IThemeMode]) : createTheme(defaultTheme);
  return (
    <LayoutStateContext.Provider value={state}>
      <LayoutDispatchContext.Provider value={dispatch}>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </LayoutDispatchContext.Provider>
    </LayoutStateContext.Provider>
  );
}

function useLayoutState(): IContextState {
  const context = useContext(LayoutStateContext);
  if (!context) {
    throw new Error("useLayoutState must be used within a LayoutProvider");
  }
  return context;
}

function useLayoutDispatch() {
  const context = useContext(LayoutDispatchContext);
  if (context === undefined) {
    throw new Error("useLayoutDispatch must be used within a LayoutProvider");
  }
  return context;
}

function dispatchActions(
  { type = ILayoutActionsType.CHANGE_PAGE, payload }: any,
  dispatch: any
) {
  return dispatch({
    type,
    payload,
  });
}
export { LayoutProvider, useLayoutState, useLayoutDispatch, dispatchActions };
