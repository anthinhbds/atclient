import React, { useEffect, useCallback, useState } from "react";
import {
  Avatar, Collapse,
  ListItemButton, ListItemText,
  Typography,
  List, Drawer, Box,
  Divider
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import createStyles from "./styles";
import { Link, useNavigate } from "react-router-dom";
// import { menus } from "./data";

interface ISideBar {
  openSideBar: boolean;
  menus: any;
  // handleAddTab: (newTab: any) => void;
  handleClose: (v: boolean) => void;
  // setShowCpn?: (v: boolean) => void;
  onChangeCpn?: (id: string) => void;
}

const SideBar = ({ menus, openSideBar, handleClose }: ISideBar) => {
  const drawerWidth = 264;
  // const { t } = useTranslation();
  const navigate = useNavigate();
  // const { getCpn, userCpns, isLoading, changeCpn, isSaving, info, } = useUser(); //hasPermit

  // const { getNBS } = useSetting();
  const styles = createStyles();
  // const [cpnName, setCpnName] = useState("");
  // const [companies, setCompanies] = useState<ICompany[]>([]);
  const [open, setOpen] = useState(openSideBar);
  const [expandedItems, setExpandedItems] = useState<string[]>(["business"]);

  // const { setLayoutKey } = useLayout();

  const hasChildren = (item: any) => {
    const { items: children } = item;

    if (children === undefined) {
      return false;
    }

    if (children.constructor !== Array) {
      return false;
    }

    if (children.length === 0) {
      return false;
    }

    return true;
  };

  const MenuItem = useCallback(
    ({ item }: any) => {
      const Component = hasChildren(item) ? MultiLevel : SingleLevel;
      return <Component item={item} />;
    },
    [expandedItems]
  );

  const SingleLevel = useCallback(
    ({ item }: any) => {
      if (item.single) {
        return (
          <React.Fragment>
            <ListItemButton
              // selected={expandedItem === item.key}
              component={Link}
              to={item.key}
              sx={styles.listItemButton}
              onClick={() => {
                navigate(item);
              }}>
              <Avatar>{item.icon}</Avatar>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </React.Fragment>
        )
      }
      else {
        if (item.endRegion === true) {
          return (
            <React.Fragment>
              <ListItemButton
                //   selected={item.key === menuItemSelect}
                sx={styles.listItemButtonNoChild}
                component={Link}
                to={item.key}
                onClick={() => {
                  navigate(item);
                  // open && setMenuItemSelect(item.key);
                  // navigate(item.key);
                }}>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </React.Fragment>
          );
        }
        return (
          <ListItemButton
            //   selected={item.key === menuItemSelect}
            sx={styles.listItemButtonNoChild}
            component={Link}
            to={item.key}
            onClick={() => {
              navigate(item);
              // open && setMenuItemSelect(item.key);
              // navigate(item.key);
            }}>
            <ListItemText primary={item.text} />
          </ListItemButton>
        );
      }
    },
    [expandedItems]
  );

  const MultiLevel = useCallback(
    ({ item }: any) => {
      const { items: children, key } = item;

      const handleClick = (k: any) => {
        setExpandedItems((old) => {
          const temp = [...old];
          const indexOf = temp.indexOf(k);
          if (indexOf !== -1) temp.splice(indexOf, 1);
          else temp.push(k);
          return temp;
        });
      };

      return (
        <React.Fragment>
          <ListItemButton
            component="div"
            // selected={expandedItem === item.key}
            id={item.key}
            sx={styles.listItemButton}
            onClick={() => {
              handleClick(item.key);
            }}
          >
            <Avatar
            >
              {item.icon}
            </Avatar>
            <ListItemText primary={item.text} />
            {expandedItems.indexOf(key) !== -1 ? (
              <ExpandLess />
            ) : (
              <ExpandMore />
            )}
          </ListItemButton>
          <Collapse
            in={expandedItems.indexOf(key) !== -1}
            timeout="auto"
            unmountOnExit>
            <List component="div" disablePadding>
              {children.map((child: any, key: any) => {
                return <MenuItem key={key} item={child} />;
              })}
            </List>
          </Collapse>
        </React.Fragment>
      );
    },
    [expandedItems]
  );





  useEffect(() => {
    // !userCpns && getCpn();

  }, []);

  // useEffect(() => {
  //   !favMenus && info?.country && getFavMenu({
  //     serviceid: "NB",
  //     country: info?.country ?? "VN",
  //   });
  // }, [info]);

  useEffect(() => {
    setOpen(openSideBar);
    // setLayoutKey({ sideBar: openSideBar });
  }, [openSideBar]);

  // const companyListItemStyle = useMemo(() => ({ cursor: isSaving ? "wait" : 'pointer' }), [isSaving]);

  return (
    <Drawer
      sx={[
        {
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            height: 1,
            backgroundColor: 'hsl(0, 0%, 100%)',
            zIndex: 1200,
            backgroundImage: 'none',
            outline: "0px",
            boxShadow: "rgb(136, 136, 136) 2px 0px 5px -1px",
            transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)"
          },
        },
        styles.drawer,
        !open && { display: "none" },
      ]}
      variant="permanent"
      anchor="left">
      <Box
        sx={{
          display: "flex",
          p: 2,
        }}
      >
        <Box
          width={1}
          justifyContent={'center'}
          display={'flex'}
          // border={'1px solid hsl(348, 96%, 42%)'}
          p={1}
          borderRadius={'8px'}
          sx={{
            cursor: "pointer",
          }}
          onClick={() => {
            setOpen(!open);
            handleClose(true);
          }}
        >
          <Typography
            sx={{
              color: "rgb(0,0,0)",
              fontSize: "16px",
              fontWeight: 700,
              lineHeight: "36px",

            }}
          >
            An Thịnh - Real Estate
          </Typography>
        </Box>
      </Box>
      <Divider sx={{
        borderWidth: '0px 0px 1px',
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.12) rgba(0, 0, 0, 0.12) rgb(227, 227, 227)',
      }} />
      {menus && menus.length > 0 && (
        <Box padding={"0px"} >
          {menus.map((item: any) => (
            <MenuItem key={item.key} item={item} />
          ))}
        </Box>
      )}
    </Drawer>
  );
};

export default SideBar;
