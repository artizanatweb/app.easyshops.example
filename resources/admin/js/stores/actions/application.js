import * as actionTypes from "./actionTypes";

export const showApplication = (force = false) => {
    return (dispatch, getState) => {
        const state = getState();

        if (!force && state.authentication.refreshing) {
            return;
        }

        dispatch({
            type: actionTypes.application.SHOW,
            show: true,
        });
    }
};
export const hideApplication = () => {
    return {
        type: actionTypes.application.SHOW,
        show: false,
    }
};

export const setApplicationLoading = (loading = false) => {
    return {
        type: actionTypes.application.SET_LOADING,
        loading: loading,
    }
};

export const requestPageContent = (page) => {
    return {
        type: actionTypes.application.REQUEST_PAGE_CONTENT,
        page: page,
    }
};

export const setActualPage = (page) => {
    return {
        type: actionTypes.application.SET_PAGE,
        page: page,
    }
};

export const clearApplication = () => {
    return {
        type: actionTypes.application.CLEAR,
    }
};
