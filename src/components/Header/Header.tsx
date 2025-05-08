import React, { useMemo, useRef } from "react";
import {
  Avatar, Typography, Badge, Button, IconButton, Stack, Toolbar, AppBar
} from "@mui/material";
import {
  Menu, Home,
  Notifications,
} from "@mui/icons-material";
import createStyles from "./styles";
import { useState, useEffect, } from "react";
import { IHeaderButton } from "types";
import {
  useLayout,
  useNotify,
} from "hooks";
import UserOptions from "./components/UserOptions";
import NotiPopover from "./components/NotiPopover";
import { useNavigate } from "react-router-dom";


interface IHeader {
  handleOpenSideBar: () => void;
  openSideBar: boolean;
  buttons: any[];
  active: string;
  removeTab: (tab: string, newIndex: number) => void;
  handleChangeTab: (tab: string) => void;
  handleRightButtonsClick?: (button: string) => void;
}

const Header = ({
  openSideBar,
  buttons,
  handleOpenSideBar,
  handleChangeTab,
  removeTab,
  handleRightButtonsClick,
}: IHeader) => {
  const styles = createStyles();
  const navigate = useNavigate();
  // const { info, getMe, isLoading } = useUser();
  const { badgeCount } = useNotify();

  const [maxWidthCtn, setMaxWidthCtn] = useState(0);
  const [notiEl, setNotiEl] = React.useState<HTMLButtonElement | null>(null);
  const tbarButtonRef = useRef<HTMLDivElement>(null);

  const handleNotiClick = (event: React.MouseEvent<HTMLButtonElement>) => {

    setNotiEl(event.currentTarget);
  };

  const handleNotiClose = () => {
    setNotiEl(null);
  };

  const styleOpenSideBar = openSideBar
    ? { width: `calc(100% - ${264}px)`, ml: `${264}px` }
    : { width: `100%`, ml: `0px` };

  const { activePage, } = useLayout();
  // const [activeButton, setActiveButton] = useState(active);
  const [items, setItems] = useState<any>(buttons);
  const [userEl, setUserEl] = React.useState<HTMLButtonElement | null>(null);

  const handleUserClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setUserEl(event.currentTarget);
  };
  const handleUserClose = () => {
    setUserEl(null);
  };
  const handleButtonClick = (e: any) => {
    if (e.target.tagName !== "BUTTON") return;
    const tabKey = e.target.id;
    // updActivePage(tabKey);
    navigate(tabKey)
    handleChangeTab(tabKey);
  };
  const handleClose = (buttonId: any) => {
    const temp = [...items];
    const currentItem = temp.filter((item) => item.id === buttonId)[0];

    let nextIndex = temp.indexOf(currentItem);
    if (nextIndex >= temp.length - 1) nextIndex -= 1;

    temp.filter((item) => item.id === buttonId).length > 0 &&
      temp.splice(currentItem, 1);

    setItems(temp);
    removeTab(buttonId, nextIndex);
  };
  const handleClick = (e: any) => {
    if (e === IHeaderButton.HOME) {
      handleRightButtonsClick?.(e);
    }
  };

  const getIndexItemActive = (v: any) => {
    const activeIndex = items.findIndex((item: any) => item.id === activePage);
    const findIndex = items.findIndex((item: any) => item.id === v);
    return findIndex - 1 === activeIndex

  };

  const Buttons = useMemo(() => {
    return items.map((item: any) => {
      return (
        <React.Fragment key={item.id}>
          <Button
            disableRipple
            id={item.id}
            sx={{
              ...(activePage === item.id ? styles.btnMenuActive : styles.btnMenu),
              ...(getIndexItemActive(item.id)
                ?
                {
                  '&::before': {
                    content: '""',
                    display: 'none'
                  }
                }
                :
                {})
            }}
            onClick={(event) => {
              const button = event.currentTarget;
              const buttonRect = button.getBoundingClientRect();

              // Calculate the coordinates for the close icon area
              const closeIconArea = {
                right: buttonRect.right - 10,
                top: buttonRect.top + buttonRect.height / 2 - 8, // Adjust for icon's center
                width: 16, // Adjust based on icon font-size
                height: 16
              };

              // Check if the click is within the close icon area
              if (
                event.clientX >= closeIconArea.right - closeIconArea.width &&
                event.clientX <= closeIconArea.right &&
                event.clientY >= closeIconArea.top &&
                event.clientY <= closeIconArea.top + closeIconArea.height
              ) {
                handleClose(item.id);
              } else {
                // alert("Button clicked");
                handleButtonClick(event);
              }

            }}>
            {item.text}
          </Button>
        </React.Fragment >
      );
    })
  }, [JSON.stringify(items), activePage,]);

  useEffect(() => {
    // !info && !isLoading && getMe();
    // onGetBadgetCount();

    const handleResize = () => {
      let maxWidth = window.innerWidth - 24; //padding x = 24
      if (openSideBar) {
        maxWidth -= 330; //Left Menu
        maxWidth -= 148; //Right Buttons
      }
      else {
        maxWidth -= 23; //ListIcon 
        maxWidth -= 140; //Company button
        maxWidth -= 148; //right Buttons 

      }
      setMaxWidthCtn(maxWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setItems(buttons);
  }, [buttons]);

  useEffect(() => {
    let maxWidth = window.innerWidth - 24; //padding x = 24
    if (openSideBar) {
      maxWidth -= 330; //Left Menu
      maxWidth -= 148; //Right Buttons
    }
    else {
      maxWidth -= 23; //ListIcon 
      maxWidth -= 140; //Company button
      maxWidth -= 148; //right Buttons 

    }
    setMaxWidthCtn(maxWidth)
  }, [openSideBar, items]);

  return (
    <AppBar
      position="fixed"
      sx={{
        ...styleOpenSideBar,
        backgroundColor: "hsl(0,0%,100%)",
        boxShadow: "none",
        // borderBottom: '1px solid hsla(220, 20%, 25%, 0.6)'
      }}>
      <Toolbar sx={{ minHeight: "37px !important", px: "12px !important" }}>
        {!openSideBar && (
          <React.Fragment>
            <Menu
              sx={{
                width: "32px",
                height: "32px",
                color: "hsl(0, 0%, 45%)",
                fontSize: "30px",
              }}
              onClick={() => {
                handleOpenSideBar();
              }}
            />
            <Typography sx={styles.labelCompany}>An Thịnh - Real Estate</Typography>
          </React.Fragment>
        )}

        <Stack
          ref={tbarButtonRef}
          sx={{
            ...styles.wrapper,
            maxWidth: maxWidthCtn,
            '& div': {
              maxWidth: ((tbarButtonRef.current?.clientWidth || 0) + 140) >= maxWidthCtn ? `${maxWidthCtn / items.length}px` : 'unset',
            }
          }}
          direction={"row"}
        // onResize={(e) => {
        //   console.log('onResize', e)
        // }}
        >
          {Buttons}
        </Stack>
        <Stack sx={styles.userBar} direction={"row"}>
          <IconButton
            sx={styles.rightButton}
            onClick={() => handleClick(IHeaderButton.HOME)}
          >
            <Home
              sx={{
                '&:hover': {
                  color: '#A31D1D'
                }
              }}
              onClick={() => {
                navigate('/home');
              }}
            />
          </IconButton>
          <IconButton sx={styles.rightButton}
            onClick={handleNotiClick}
          >
            <Badge badgeContent={badgeCount} color="info" max={99} >
              <Notifications sx={{
                '&:hover': {
                  color: '#A31D1D'
                }
              }} />
            </Badge>
          </IconButton>

          <IconButton sx={{ mx: styles.avatarButton.mx, my: styles.avatarButton.my, width: 37 }} onClick={handleUserClick}>
            <Avatar sx={styles.avatarButton}>U</Avatar>
          </IconButton>
        </Stack>
      </Toolbar>
      <UserOptions
        open={Boolean(userEl)}
        anchorEl={userEl}
        onClose={handleUserClose}
      />
      {notiEl && <NotiPopover
        anchorEl={notiEl}
        onClose={handleNotiClose}
      />
      }

    </AppBar>
  );
};

export default Header;
