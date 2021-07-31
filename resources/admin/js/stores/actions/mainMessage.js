import * as actionTypes from "./actionTypes.js";

export const setMainMessage = (severity,message) => {
    return (dispatch) => {
        dispatch(showMainMessage());
        dispatch(setSeverity(severity));
        dispatch(setMessage(message));
    };
};

export const hideMainMessage = () => {
    return {
        type: actionTypes.mainMessage.OPEN,
        open: false,
    }
};

const showMainMessage = () => {
    return {
        type: actionTypes.mainMessage.OPEN,
        open: true,
    }
};

const setSeverity = (severity) => {
    return {
        type: actionTypes.mainMessage.SEVERITY,
        severity: severity,
    }
};

const setMessage = (message) => {
    return {
        type: actionTypes.mainMessage.MESSAGE,
        message: message,
    }
};
