/** @format */

import { IThemeMode } from "types";
import defaultTheme from "./default";

const themes = {
  [IThemeMode.MAIN]: {
    palette: {
      primary: {
        main: "#A31D1D",
      },
    },
    components: {
      MuiFormControlLabel: {
        styleOverrides: {
          root: {
            color: 'rgba(0,0,0,0.87)',
          }
        },
      },
      MuiRadio: {
        styleOverrides: {
          root: {
            '& svg': {
              color: 'hsl(220, 30%, 7%)'
            }
          }
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiInputLabel-root": {
              color: "rgba(0,0,0,0.0.6)", // Label color
            },
            '& input': {
              color: 'rgba(0,0,0,0.87) !important'
            },
            '& .MuiInput-underline:before': {
              borderColor: 'hsl(0,0%,55%)'
            },
            "& .MuiInput-underline:hover:before": {
              borderColor: 'hsl(0,0%,55%) !important', // Hover border color
            },
            '& .Mui-disabled:before': {
              borderBottomStyle: 'solid !important'
            },
            '& .MuiFormLabel-root.MuiInputLabel-root.Mui-disabled': {
              color: "hsl(220,20%,65%) !important", // Label color
            },
            '& input.Mui-disabled': {
              color: 'hsl(0,0%,35%) !important',
              '-webkit-text-fill-color': 'unset',
            },
            '& .MuiFormLabel-asterisk': {
              color: '#A31D1D'
            }
          }
        }
      }
    }
  },
  [IThemeMode.LIGHT]: {
    palette: {
      primary: {
        main: "#03a9f4",
      },
    },
  },
  [IThemeMode.DARK]: {
    palette: {
      primary: {
        main: "#1076BB",
      },
    },
  }
};
export { themes, defaultTheme };
