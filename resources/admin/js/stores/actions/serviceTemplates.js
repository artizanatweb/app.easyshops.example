import * as actionTypes from "./actionTypes";

export const clearServiceTemplates = () => {
    return {
        type: actionTypes.serviceTemplates.CLEAR,
    }
};

export const setServiceTemplates = (data = []) => {
    return {
        type: actionTypes.serviceTemplates.SET_ITEMS,
        data: data,
    }
};

export const requestServiceTemplates = () => {
    return {
        type: actionTypes.serviceTemplates.REQUEST_ITEMS,
    }
};

export const setDeleteTemplateObject = (object = null) => {
    return {
        type: actionTypes.serviceTemplates.SET_DELETE_OBJECT,
        object: object,
    }
};

export const openTemplateDeleteDialog = () => {
    return {
        type: actionTypes.serviceTemplates.DELETE_DIALOG,
        open: true,
    }
};

export const closeTemplateDeleteDialog = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.serviceTemplates.DELETE_DIALOG,
            open: false,
        });

        dispatch(setServiceTemplateRemoving(false));
        dispatch(setDeleteTemplateObject());
    }
};

export const setServiceTemplateRemoving = (removing = false) => {
    return {
        type: actionTypes.serviceTemplates.REMOVING,
        removing: removing,
    }
};

export const requestServiceTemplateRemoval = () => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.serviceTemplates.DELETE,
            object: state.serviceTemplates.deleteObject,
        });
    }
};
