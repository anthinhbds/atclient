import {
  dispatchActions,
  useLayoutDispatch,
  useLayoutState,
  //   IContextState,
  ILayoutActionsType,
} from "context/LayoutContext";
// import { useDispatch, useSelector } from "react-redux";

import { KEY_CONTEXT } from 'utils/constants';

import { IThemeMode } from "types";
import { useKey } from "hooks";
import { parseJSON } from "utils";
export function useLayout() {
  const { setKey, getKey } = useKey();
  const layoutDispatch = useLayoutDispatch();
  const { activePage, sideBarOpen, reportSetting } = useLayoutState();

  const updActivePage = (payload: string) => {
    dispatchActions(
      { type: ILayoutActionsType.CHANGE_PAGE, payload },
      layoutDispatch
    );
  };
  const updSideBar = (payload: boolean) => {
    dispatchActions(
      { type: ILayoutActionsType.SIDEBAR_CHANGE, payload },
      layoutDispatch
    );
  };
  const updReportMenu = (payload: any[]) => {
    dispatchActions(
      { type: ILayoutActionsType.REPORT_SETTING, payload },
      layoutDispatch
    );
  };

  type TLayoutKey = {
    sideBar: boolean,
    theme: IThemeMode
  };

  const setLayoutKey = (data: { [key in keyof TLayoutKey]?: any }) => {
    const layout = getLayoutKey();
    setKey(KEY_CONTEXT.LAYOUT, JSON.stringify({ ...layout, ...data }));
  }
  const getLayoutKey = () => {
    return parseJSON(getKey(KEY_CONTEXT.LAYOUT) ?? '{}', {}) as TLayoutKey;
  }
  // const changeTheme = (themeMode: IThemeMode) => {
  //   dispatchActions(
  //     { type: ILayoutActionsType.CHANGE_THEME, payload: themeMode },
  //     layoutDispatch,
  //   );
  //   setLayoutKey({ theme: themeMode });
  // };
  // const changeLang = (lang: string) => {
  //   i18n.changeLanguage(lang);
  //   // dispatchActions(
  //   //   { type: ILayoutActionsType.CHANGE_LANGUAGE, payload: lang },
  //   //   layoutDispatch,
  //   // );
  //   setLayoutKey({ lang: lang ?? 'en' });
  // };

  return {
    updActivePage,
    updSideBar,
    updReportMenu,
    // changeTheme,
    // changeLang,
    getLayoutKey,
    setLayoutKey,
    activePage,
    sideBarOpen,
    reportSetting,
  };
}
