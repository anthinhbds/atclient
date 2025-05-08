import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SideBar, Header } from "components";
import { useLayout } from "hooks";
import { useDispatch } from 'react-redux';
import { EClaimType, EClaimValue, IFormKey, IFormText } from 'types';
import { useNavigate, useLocation } from "react-router-dom";
import { useUser, useNotify } from 'hooks';
import { getMeInfo } from 'services/api/user';
import { getRefreshToken, convertDMY } from 'utils';
import {
    // Backdrop,
    Box,
    // CircularProgress,
} from "@mui/material";
import { menus } from "types";
import {
    UserPage,
    ProjectPage,
    ApartmentPage,
    CustomerPage,
    CustomerJourneyPage,
    HomePage,
    RevenuePage,
    ExpensePage,
    BCTCReportPage,
    MobilePage,
    ApartmentStatisticPage,
    HistoryPage,
    ViewStatisticPage,
} from "pages";
import { loginSuccess } from "store/user/reducer";
import { getBadgeCountRequestSuccess } from "store/notify/reducer";
import { isMobile } from 'react-device-detect';
import { startSignalRConnection, getSignalRConnection } from "signalR/signalrService";

startSignalRConnection();
const connection = getSignalRConnection();

interface TabPanelProps {
    children?: React.ReactNode;
    index: string;
    value: string;
}
const TabPanel = (props: TabPanelProps) => {
    const { children, value, index } = props;
    return (
        <Box
            component={"div"}
            width={1}
            height={1}
            sx={{
                position: "absolute",
                left: value !== index ? -99999 : 0,
                overflow: "hidden",
            }}
            role="tabpanel"
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}>
            {children}
        </Box>
    );
};

export default function MainPage() {
    const { info } = useUser();
    const { getBadgetCount, info: notiInfo } = useNotify();
    const dispatch = useDispatch();
    const { updSideBar, updActivePage, sideBarOpen, activePage } = useLayout();

    const addTab = (newTab: { key: string; text: string }) => {
        const { key, text } = newTab;

        setTabButtons((old) => {
            const filterItem = [...old].filter((item) => item.id === key);

            if (filterItem.length === 0) {
                return [...old, { id: key, text }];
            } else {
                return [...old];
            }
        });
    };


    const routesContent = useMemo(
        () => ({
            [IFormKey.USR]: <UserPage />,
            [IFormKey.PROJECT]: <ProjectPage />,
            [IFormKey.APARTMENT]: <ApartmentPage />,
            [IFormKey.CUSTOMER]: <CustomerPage />,
            [IFormKey.CUSTOMERJOURNEY]: <CustomerJourneyPage />,
            [IFormKey.HOME]: <HomePage />,
            [IFormKey.REVENUE]: <RevenuePage />,
            [IFormKey.EXPENSE]: <ExpensePage />,
            [IFormKey.RP_BCTC]: <BCTCReportPage />,
            [IFormKey.RP_APARTMENTSTATICTIS]: <ApartmentStatisticPage />,
            [IFormKey.RP_VIEWSTATISTIC]: <ViewStatisticPage />,
            [IFormKey.HIS]: <HistoryPage />,
        }),
        []
    );

    const navigate = useNavigate();
    const { pathname } = useLocation();
    // const [searchParams] = useSearchParams();

    const initForm = (pathname === "/" ? IFormKey.HOME : pathname).replace(
        "/",
        ""
    );

    const [contentPage, setContentPage] = useState<{
        [key: string]: JSX.Element;
    }>({
        [initForm]: routesContent[initForm as keyof typeof routesContent],
    });
    const [tabButtons, setTabButtons] = useState<{ id: string; text: string }[]>(
        initForm === IFormKey.HOME
            ? [{ id: IFormKey.HOME, text: 'Trang chủ' }] //IForm.HOME
            : [
                {
                    id: IFormKey[initForm.toUpperCase() as keyof typeof IFormKey],
                    text: IFormText[initForm.toUpperCase() as keyof typeof IFormText],
                },
            ]
    );

    const renderTabs = useCallback(() => {
        // let formId = activePage || "";
        // if (formId.indexOf("report/") !== -1) {
        //   formId = formId.replace("report/", "");
        // }
        return (
            <>
                {!!Object.keys(contentPage).length &&
                    Object.keys(contentPage).map((e) => {
                        // const ItemContent = contentPage[e];
                        return (
                            <TabPanel key={e} value={e} index={activePage}>
                                {contentPage[e]}
                            </TabPanel>
                        );
                    })}
            </>
        );
    }, [contentPage, activePage]);

    const menuItems = useMemo(() => {
        if (info) {
            const userPermissions: string[] = [];
            if (info.claimType?.indexOf(EClaimType.ADMIN) !== -1) {
                if (info.claimValue?.indexOf(EClaimValue.MANAGER_USER) !== -1)
                    userPermissions.push('apartment', 'customer', 'customerjourney', 'dtcp', 'settings', 'revenue', 'expense', 'dm', 'reports', 'user', 'his',);
                else
                    userPermissions.push('apartment', 'customer', 'customerjourney', 'dtcp', 'settings', 'revenue', 'expense', 'dm', 'reports', 'his');
            }
            else {
                userPermissions.push('apartment', 'customer', 'reports', 'rp_viewstatistic');
            }
            return menus.map(i => {
                if (i.items && i.items.length > 0) {
                    const childs = i.items.filter(j => userPermissions.includes(j.key));
                    if (childs.length > 0) {
                        return { ...i, items: childs };
                    }
                }
                return userPermissions.includes(i.key) ? i : null;
            }).filter(Boolean);
        }
        return [];
    }, [info]);



    useEffect(() => {
        const refreshToken = getRefreshToken();
        getMeInfo(refreshToken ?? '', (rp) => {
            const rs = rp.data;
            if (rs.success && rs.data) {
                dispatch(loginSuccess({ data: rs.data }));
            }
        });
        getBadgetCount();
    }, [])

    useEffect(() => {
        if (info && info.userId) {
            if (connection) {
                connection.on("ReceiveApartmentNotice", (userIds) => {
                    const user = userIds.find((x: any) => x.userId === info.userId);
                    if (user) {
                        dispatch(getBadgeCountRequestSuccess({ data: user.count }));
                    }
                });
                connection.on("SendApartmentExpire", (data) => {
                    const items = data.filter((f: any) => f.key === info.userId);
                    if (items.length > 0) {
                        const date = new Date();
                        date.setDate(25);
                        notiInfo(`Có ${items[0].count} chính chủ sắp hết hạn vào ngày ${convertDMY(date)}.`, { autoHideDuration: 3000000 })
                    }
                });
            }
        }
    }, [info]);

    useEffect(() => {
        let active = `${IFormKey.HOME}`;
        if (pathname === "/") {
            active = IFormKey.HOME;
        } else if (IFormKey[pathname.replace("/", "").toUpperCase() as keyof typeof IFormKey]) {
            active = IFormKey[pathname.replace("/", "").toUpperCase() as keyof typeof IFormKey];
        } else if (pathname.indexOf("report/") !== -1) {
            active =
                pathname.indexOf("/") === 0
                    ? `${pathname.substring(1).toLowerCase()}`
                    : `${pathname.toLowerCase()}`;
        }

        if (active !== activePage) {
            updActivePage(active);
        }
    }, [pathname, activePage]);

    //Update activePage
    useEffect(() => {
        if (!activePage) return;

        const formId = activePage;
        const formText = IFormText[formId.toUpperCase() as keyof typeof IFormText];
        /* NORMAL FORM */
        if (routesContent[formId as keyof typeof routesContent]) {
            setTabButtons((old) => {
                const idx = old.findIndex((item) => item.id === formId);
                if (idx !== -1) return old;
                return [...old, { id: formId, text: formText }];
            });
            setContentPage((p) => ({ ...p, [formId]: routesContent[formId as keyof typeof routesContent] }));
        } else {
            setContentPage((p) => ({ ...p, [formId]: <h1>Page Not found</h1> }));
        }
    }, [activePage]);

    if (isMobile) {
        return (
            <Box sx={{ display: "flex", width: 1, height: 1 }}>
                <MobilePage />
            </Box>
        )
    }

    return (
        <Box sx={{ display: "flex" }}>
            <SideBar
                menus={menuItems}
                openSideBar={sideBarOpen}
                handleClose={() => {
                    updSideBar(false);
                }}
            />
            <Header
                buttons={tabButtons}
                openSideBar={sideBarOpen}
                active={''}
                removeTab={(tab, newIndex) => {
                    const newButtons = [...tabButtons];
                    const index = newButtons.findIndex((item) => item.id === tab);
                    newButtons.splice(index, 1);
                    setTabButtons(newButtons);
                    // clearAttachment(tab.toUpperCase() as IFormKey);

                    const temp = { ...contentPage };
                    delete temp[tab];
                    setContentPage(temp);
                    const page = Object.keys(temp)[newIndex];
                    if (page) {
                        navigate(page);
                    }
                }}
                handleChangeTab={(tabKey: any) => {
                    // updActivePage(tabKey);
                    navigate(tabKey);
                }}
                handleOpenSideBar={() => {
                    updSideBar(true);
                }}
                handleRightButtonsClick={(e) => {
                    if (e === IFormKey.HOME) {
                        addTab({ key: IFormKey.HOME, text: IFormText.HOME });
                    }
                }}
            />
            <Box
                component={"main"}
                position={"absolute"}
                top={37}
                width={sideBarOpen ? "calc(100% - 264px)" : "100%"}
                height={"calc(100vh - 37px)"}
                left={sideBarOpen ? 264 : 0}
                bgcolor={'white'}
            >
                <Box height={1}>
                    {renderTabs()}
                </Box>
            </Box>
        </Box>
    )

    // return info ? (
    //     <Box sx={{ display: "flex" }}>
    //         <SideBar
    //             openSideBar={sideBarOpen}
    //             handleClose={() => {
    //                 updSideBar(false);
    //             }}
    //         />
    //         <Header
    //             buttons={tabButtons}
    //             openSideBar={sideBarOpen}
    //             active={''}
    //             removeTab={(tab, newIndex) => {
    //                 const newButtons = [...tabButtons];
    //                 const index = newButtons.findIndex((item) => item.id === tab);
    //                 newButtons.splice(index, 1);
    //                 setTabButtons(newButtons);
    //                 // clearAttachment(tab.toUpperCase() as IFormKey);

    //                 const temp = { ...contentPage };
    //                 delete temp[tab];
    //                 setContentPage(temp);
    //                 const page = Object.keys(temp)[newIndex];
    //                 if (page) {
    //                     navigate(page);
    //                 }
    //             }}
    //             handleChangeTab={(tabKey: any) => {
    //                 // updActivePage(tabKey);
    //                 navigate(tabKey);
    //             }}
    //             handleOpenSideBar={() => {
    //                 updSideBar(true);
    //             }}
    //             handleRightButtonsClick={(e) => {
    //                 if (e === IFormKey.HOME) {
    //                     addTab({ key: IFormKey.HOME, text: IFormText.HOME });
    //                 }
    //             }}
    //         />
    //         <Box
    //             component={"main"}
    //             position={"absolute"}
    //             top={37}
    //             width={sideBarOpen ? "calc(100% - 264px)" : "100%"}
    //             height={"calc(100vh - 37px)"}
    //             left={sideBarOpen ? 264 : 0}
    //             bgcolor={'rgb(5,7,10)'}
    //         >
    //             <Box height={1}>
    //                 {renderTabs()}
    //             </Box>
    //         </Box>
    //     </Box>
    // )
    //     :
    //     (<Backdrop
    //         sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    //         open={true}
    //     >
    //         Loading...
    //         <CircularProgress color="inherit" />
    //     </Backdrop>);
}
