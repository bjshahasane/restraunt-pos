import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { SnackbarProvider, useSnackbar } from 'notistack';

import { clearNotification } from '../slices/siteSettingSlice';

function ToasterPopup({notification}) {

    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

 

    useEffect(() => {
        if (notification.message) {
            enqueueSnackbar(notification.message, {
                autoHideDuration: 5000,
                variant: notification.type,
                anchorOrigin: { horizontal: "right", vertical: "top" }
            });
            dispatch(clearNotification());
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notification,enqueueSnackbar])

    return (
        <React.Fragment>
            {
                null
            }
            {/* <Button onClick={handleClickVariant('success')}>Show success snackbar</Button> */}
        </React.Fragment>
    );
}

export default function TriggerNotification() {

    const [notification, setNotification] = useState({});

    const store = useSelector((state) => state.siteSettings)

    useEffect(() => {
        setNotification(store.notification);
    }, [store]);

    return (
        <SnackbarProvider maxSnack={3}>
            <ToasterPopup notification={notification} />
        </SnackbarProvider>
    );
}
