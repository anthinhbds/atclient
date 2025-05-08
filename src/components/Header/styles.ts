// import theme from "theme/themes";
import { useTheme } from "@mui/material/styles";

export default () => {
  const { palette } = useTheme();
  return {
    wrapper: {
      pt: "3px",
      minHeight: "37px",
      height: "37px",
      '& button:first-of-type': {
        borderTopLeftRadius: "5px",
        '&::before': {
          content: '""',
          display: 'none',
        }
      },
      "& button:last-child": {
        borderTopRightRadius: "5px"
      },
    },
    userBar: {
      minHeight: "37px",
      height: "37px",
      mr: "0",
      ml: "auto",
    },
    labelCompany: {
      p: "3px 8px",
      ml: "12px",
      mr: "12px",
      color: "#FFF",
      fontSize: "13px",
      lineHeight: "24px",
      overflow: "hidden !important",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      fontWeight: 400,
      textTransform: "none",
      maxWidth: 206,
      minWidth: 140,
      textAlign: "center",
      borderRadius: "5px",
      backgroundColor: "#A31D1D",
    },
    tabButton: {
      p: "6px 18px",
      mt: "3px",
      fontSize: "12px",
      lineHeight: "21px",
      textTransform: "none",
      minHeight: "37px",
      bgcolor: "#DBDBE0",
      color: "#000",
      "& svg": { fontSize: "13px !important", color: "#DBDBE0" },
      "&:hover svg": { color: "#000" },
    },
    wrapButton: {
      mt: "3px",
      display: 'flex',
      '& svg': {
        fontSize: "13px !important",
        // color: "#000",
        visibility: 'hidden'
      },
      "&:hover svg": {
        visibility: 'visible'
      }
    },
    button: {
      display: 'block',
      pl: "18px",
      color: "#000",
      fontSize: "12px",
      textTransform: "none",
      bgcolor: "#DBDBE0",
      borderRadius: "unset",
      overflow: "hidden !important",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      // "& svg": { fontSize: "13px !important" },
      "& .MuiButton-endIcon": {
        color: "#000",
      },
      "&:hover": {
        bgcolor: "#DBDBE0",
      },
      "&:hover .MuiButton-endIcon": {
        color: "#000",
      },
    },

    buttonActive: {
      display: 'block',
      mx: "-1px",
      px: "24px",
      color: "#FFF",
      fontSize: "12px",
      textTransform: "none",
      bgcolor: palette.primary.main,
      borderRadius: "unset",
      borderTopLeftRadius: "5px",
      // borderTopRightRadius: "5px",
      overflow: "hidden !important",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      "& svg": { fontSize: "13px !important" },
      "& .MuiButton-endIcon": {
        color: palette.primary.main,
      },
      "&:hover .MuiButton-endIcon": {
        color: "#FFF",
      },
      "&:hover": {
        bgcolor: palette.primary.main,
      },
    },
    rightButton: {
      mx: 0,
      my: 0,
      width: 37,
      height: 37,
      '& svg': {
        color: 'hsl(0, 0%, 85%)'
      }
    },
    avatarButton: {
      mx: 0,
      my: 0,
      width: "27px",
      height: "27px",
      bgcolor: palette.primary.main,
    },
    wrapOpAvContent: {
      py: 2,
      px: 2,
      borderBottom: '2px solid hsla(220, 20%, 25%, 0.6)',
    },
    flexCenter: {
      display: 'flex',
      justifyContent: 'center',
      mb: 2,
    },
    wrapOptAvatar: {
      boxShadow: '0px 4px 8px 1px rgba(0, 0, 0, 0.55)',
      borderRadius: '50%',
      width: 55,
      height: 55,
      cursor: 'pointer',
    },
    avatarBox: {
      position: 'relative',
      width: '100%',
      height: '100%',
    },
    avatar: {
      width: '100%',
      height: '100%',
      backgroundColor: palette.primary.main,
    },
    cameraBox: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      p: '0.9em',
      backgroundColor: 'white',
      borderRadius: '50%',
      width: '1.5em',
      height: '1.5em',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.55)',
    },
    camera: {
      fontSize: 20,
      color: palette.primary.main,
    },

    btnMenu: {
      position: 'relative',
      display: 'block',
      minWidth: 'unset',
      pl: {
        xs: "8px",
        sm: "8px",
        md: "18px",
      },
      pr: {
        xs: "10px",
        sm: "10px",
        md: "22px",
      },
      color: "rgb(0,0,0)",
      fontSize: '12px',
      fontWeight: 700,
      textTransform: "none",
      bgcolor: "rgba(0,0,0,0.15)",

      borderRadius: "unset",
      overflow: "hidden !important",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      '&::before': {
        content: '"|"', // Close icon character
        position: 'absolute',
        fontSize: '14px',
        top: '50%',
        left: 0,
        transform: 'translateY(-50%)',
        transition: 'opacity 0.3s ease',
        // color: '#FFF',
      },
      '&::after': {
        content: '"x"', // Close icon character
        position: 'absolute',
        fontSize: '14px',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        opacity: 0, // Hidden by default
        transition: 'opacity 0.3s ease',
        // color: '#FFF',
      },
      '&:hover::after': {
        opacity: 1, // Show on hover
      }
    },
    btnMenuActive: {
      position: 'relative',
      display: 'block',
      minWidth: 'unset',
      pl: {
        xs: "8px",
        sm: "8px",
        md: "18px",
      },
      pr: {
        xs: "10px",
        sm: "10px",
        md: "22px",
      },
      color: "#FFF",
      fontSize: '12px',
      fontWeight: 700,
      textTransform: "none",
      bgcolor: palette.primary.main,
      borderRadius: "unset",
      overflow: "hidden !important",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      cursor: 'pointer',
      borderTopLeftRadius: "5px",
      borderTopRightRadius: "5px",
      transition: 'background-color 0.3s ease',
      '&:hover': {
        backgroundColor: palette.primary.main,
        // color: {
        //   xs: "transparent",
        //   sm: "transparent",
        //   md: "#FFF",
        // },
      },
      '&::after': {
        content: '"x"', // Close icon character
        position: 'absolute',
        fontSize: '14px',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        opacity: 0, // Hidden by default
        transition: 'opacity 0.3s ease',
        color: '#FFF',
      },
      '&:hover::after': {
        opacity: 1, // Show on hover
      }
    },
  };
};
