import * as actionTypes from "./actionTypes";

export const openLoginScreen = (open = false) => {
    return {
        type: actionTypes.authentication.SHOW_SCREEN,
        open: open,
    }
};

export const riseAppLogo = (rise = false) => {
    return(dispatch, getState) => {
        const state = getState();

        if (!state.authentication.showScreen) {
            console.log("SHOW SCREEN is false!");
            return;
        }

        dispatch({
            type: actionTypes.authentication.RISE_LOGO,
            rise: rise,
        });
    }
};

export const showLoginForm = (show = false) => {
    return (dispatch, getState) => {
        const state = getState();

        if (!state.authentication.riseLogo) {
            console.log("SHOW SCREEN is false!");
            return;
        }

        dispatch({
            type: actionTypes.authentication.SHOW_FORM,
            show: show,
        });
    };
};

export const authShowPassword = (show = false) => {
    return {
        type: actionTypes.authentication.SHOW_PASSWORD,
        show: show,
    }
};

export const authEmailChanged = (email) => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.authentication.CHANGE_EMAIL,
            email: email,
            invalidEmail: state.authentication.invalidEmail,
        })
    }
};

export const authSetEmail = (email) => {
    return {
        type: actionTypes.authentication.SET_EMAIL,
        email: email,
    }
};

export const authPasswordChanged = (password) => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.authentication.CHANGE_PASSWORD,
            password: password,
            invalidPassword: state.authentication.invalidPassword,
        });
    }
};

export const authSetPassword = (password) => {
    return {
        type: actionTypes.authentication.SET_PASSWORD,
        password: password,
    }
};

export const validAuthEmail = (valid = false) => {
    return {
        type: actionTypes.authentication.VALID_EMAIL,
        valid: valid,
    }
};

export const validAuthPassword = (valid = false) => {
    return {
        type: actionTypes.authentication.VALID_PASSWORD,
        valid: valid,
    }
};

export const validatingUserRequest = (validating = false) => {
    return {
        type: actionTypes.authentication.VALIDATING,
        validating: validating,
    }
};

const requestAuthentication = (credentials) => {
    return {
        type: actionTypes.authentication.REQUEST_AUTHENTICATION,
        credentials: credentials,
    }
};

export const requestUserAuthentication = () => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch(validatingUserRequest(true));
        dispatch(requestAuthentication(state.authentication.credentials));
    }
};

export const setAuthUser = (user) => {
    return {
        type: actionTypes.authentication.SET_USER,
        user: user,
    }
};

export const authFromStorage = () => {
    return {
        type: actionTypes.authentication.WEB_STORAGE_AUTH,
    }
};

export const logoutAuthUser = () => {
    return (dispatch) => {
        dispatch(setAuthUser("t"));
        dispatch(validatingUserRequest(false));
        dispatch(openLoginScreen(true));
        dispatch(logout());
    };
};

export const logout = () => {
    return {
        type: actionTypes.authentication.LOGOUT,
    }
};

export const refreshingAuthToken = (refreshing = false) => {
    return {
        type: actionTypes.authentication.REFRESHING,
        refreshing: refreshing,
    }
};

export const loginRememberMe = (rState = false) => {
    return {
        type: actionTypes.authentication.REMEMBER_ME,
        rState: rState,
    }
};
