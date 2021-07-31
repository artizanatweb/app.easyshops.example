import * as actionTypes from "./actionTypes";

export const requestTemplateItems = () => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.services.REQUEST_TEMPLATES,
            user: state.authentication.user,
            templates: state.serviceTemplates.items,
        })
    }
};

export const setShopServices = (items) => {
    return {
        type: actionTypes.services.SET_ITEMS,
        items: items,
    }
};

export const clearServices = () => {
    return {
        type: actionTypes.services.CLEAR,
    }
};

export const requestServices = () => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.services.REQUEST_ITEMS,
            user: state.authentication.user,
            shop: state.shop.data,
        })
    }
};

export const setDeleteServiceObject = (object = null) => {
    return {
        type: actionTypes.services.SET_DELETE_OBJECT,
        object: object,
    }
};

export const openServiceDeleteDialog = () => {
    return {
        type: actionTypes.services.DELETE_DIALOG,
        open: true,
    }
};

export const closeServiceDeleteDialog = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.services.DELETE_DIALOG,
            open: false,
        });

        dispatch(setServiceRemoving(false));
        dispatch(setDeleteServiceObject());
    }
};

export const setServiceRemoving = (removing = false) => {
    return {
        type: actionTypes.services.REMOVING,
        removing: removing,
    }
};

export const requestServiceRemoval = () => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.services.DELETE,
            object: state.services.deleteObject,
            user: state.authentication.user,
            shop: state.shop.data,
        });
    }
};
