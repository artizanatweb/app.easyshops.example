import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Alert as MuiAlert } from "@material-ui/lab";
import { Button, Snackbar } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import * as storeActions from "./../stores/actions";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

const MainMessage = (props) => {
    const classes = useStyles();
    const mainMessage = useSelector( state => state.mainMessage );
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();

    const closeHandler = (event, reason) => {
        if ('clickaway' === reason) {
            return;
        }

        dispatch(storeActions.hideMainMessage());
    };

    return (
        <div className={"mainMessage"}>
            <Snackbar open={mainMessage.open} autoHideDuration={6000} onClose={closeHandler} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={closeHandler} severity={mainMessage.severity}>
                    { t(mainMessage.message) }
                </Alert>
            </Snackbar>
        </div>
    );
};

export default MainMessage;
