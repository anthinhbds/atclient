import React, {
    FC, memo,
    useEffect,
    useState,
    useCallback,
    // useMemo,
} from "react";

import {
    Popover, PopoverVirtualElement,
    Avatar,
    List, ListItem, ListItemAvatar, ListItemText,
    Typography,
    // Button,Skeleton,
} from "@mui/material";
import {
    Home
} from "@mui/icons-material";
import { useNotify } from "hooks";
import { INotification } from "types";
import { useDispatch } from "react-redux";
import { dimension } from "utils";
import { getBadgeCountRequestSuccess } from 'store/notify/reducer'

interface IUserOptions {
    onClose?: () => void;
    anchorEl?:
    | null
    | Element
    | (() => Element)
    | PopoverVirtualElement
    | (() => PopoverVirtualElement);
}
const NotiPopover: FC<IUserOptions> = ({ onClose, anchorEl }) => {
    const open = Boolean(anchorEl);
    const dispatch = useDispatch();
    // const id = useMemo(() => open ? 'noti-popover' : undefined, [open]);
    // const [pagination, setPagination] = useState<IPagination>({ page: 1, pageSize: 5 })
    const {
        notifications,
        getNotice,
        onMarkRead,
        //  onMarkRead, onDelete,
        // notifications, isLoading, isSaving, totalCount
    } = useNotify();

    const [data, setData] = useState<INotification[]>([]);
    const [markRead, setMarkRead] = useState<{ [key: string]: boolean }>({});
    // const { t } = useTranslation();
    // const canShowMore = useMemo(() =>
    //     ((pagination.page ?? 0) * (pagination.pageSize ?? 0) < (totalCount ?? 0)),
    //     [pagination, totalCount]);
    // const handleShowMore = useCallback(() => {
    //     setPagination(p => ({ ...p, page: (p.page ?? 0) + 1 }));
    // }, []);

    useEffect(() => {
        getNotice();
    }, [])

    useEffect(() => {
        notifications && setData(d => [...d, ...notifications]);
        notifications && setMarkRead(m => notifications.reduce((a, c) => ({ ...a, [c.notificationId]: c.isread }), m));
    }, [notifications]);

    useEffect(() => {
        setData(d => d.map(i => ({ ...i, isRead: markRead[i.notificationId] })))
        const data = Object.keys(markRead).reduce((a, c) => markRead[c] === false ? a + 1 : a, 0);
        dispatch(getBadgeCountRequestSuccess({ data }))
    }, [markRead]);

    // const handleDelete = useCallback((id) => {
    //     setData(d => d.filter(i => i.notificationId !== id));
    //     onDelete(id);
    // }, [])

    const handleRead = useCallback((id: string) => {
        if (!markRead[id]) {
            setMarkRead(m => ({ ...m, [id]: true }));
            onMarkRead(id);
        }
    }, [markRead]);
    return (
        <Popover
            // id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            sx={{ maxHeight: dimension.height * 0.5, }}
        >
            <List sx={{ width: '365px' }} dense={true}>
                {data?.map((noti, index) => {
                    return (
                        <ListItem
                            sx={{
                                cursor: "pointer", // Ensures it behaves like a clickable item
                                "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.08)", // Adjust for light/dark mode
                                },
                            }}

                            onMouseEnter={() => {
                                handleRead(noti.notificationId)
                            }}
                            key={index}
                        >
                            <ListItemAvatar sx={{ display: 'flex' }}>
                                <Avatar sx={{
                                    width: '24px',
                                    height: '24px'
                                }}>
                                    <Home sx={{ fontSize: '16px' }} />
                                </Avatar>
                                {markRead[noti.notificationId] === false && (
                                    <Typography sx={{
                                        transform: 'translate(0px, -16px)',
                                        color: '#A31D1D',
                                        fontWeight: 700,
                                        fontSize: '10px',
                                        fontStyle: 'italic'
                                    }} >Mới</Typography>
                                )}
                            </ListItemAvatar>
                            <ListItemText sx={{ wordBreak: 'break-all', width: 200 }}>
                                {noti.payload}
                            </ListItemText>
                        </ListItem>
                    )
                }
                )}
                {/* {isLoading ? <Skeleton variant="text" width={320} height={100} />
                    : canShowMore ? <Button variant="text" color="primary" fullWidth onClick={handleShowMore}>
                        {t('text.show_more')}
                    </Button>
                        : null} */}

            </List>
        </Popover>
    )
}

export default memo(NotiPopover);