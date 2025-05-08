interface IColorDefault {
  primary: string; //#1976D2
  secondary: string; // '#21303f';
  warning: string; // '#FFC260';
  success: string; // '#3CD4A0';
  info: string; // '#9013FE';
  error: string; // '#750606';
  grey: string; // '#4D4D4D';
}


export const defaultColorTheme: IColorDefault = {
  primary: "#1976D2",
  secondary: "#21303f",
  warning: "#FFC260",
  success: "#3CD4A0",
  info: "#9013FE",
  error: "#750606",
  grey: "#4D4D4D",
};

export const defaultLvColorTheme = {
  lightenRate: 7.5,
  darkenRate: 15,
};

export default {
  palette: {
    primary: {
      main: defaultColorTheme.primary,
    },
    text: {
      primary: "#21303f",
      secondary: "#566879",
      third: "#566879",
      hint: "#B9B9B9",
    },
  },
};
