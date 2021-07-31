import * as actionTypes from "./actionTypes";

export const clearShop = () => {
    return {
        type: actionTypes.shop.CLEAR,
    }
};

export const resetShop = () => {
    return {
        type: actionTypes.shop.RESET,
    }
};

export const openShopActionScreen = () => {
    return {
        type: actionTypes.shop.ACTIONS_SCREEN,
        open: true,
    }
};

export const closeShopActionScreen = () => {
    return {
        type: actionTypes.shop.ACTIONS_SCREEN,
        open: false,
    }
};

export const addFormShop = () => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.shop.ADD,
            form: state.shop.form,
        });
    }
};

export const editFormShop = (id = 0) => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.shop.EDIT,
            form: state.shop.form,
            id: id,
            user: state.authentication.user,
        });
    }
};

export const setFormShop = (formObject) => {
    return {
        type: actionTypes.shop.SET_FORM,
        form: formObject,
    }
}

export const changeShopFieldContent = (field, content) => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.shop.CHANGE_FIELD_CONTENT,
            field: field,
            content: content,
            formErrors: state.shop.formErrors,
        });
    }
};

export const setShopFieldContent = (field, content) => {
    return {
        type: actionTypes.shop.SET_FIELD_CONTENT,
        field: field,
        content: content,
    }
};

export const setShopFormErrors = (errorsObject = null) => {
    return {
        type: actionTypes.shop.SET_FORM_ERRORS,
        errorsObject: errorsObject,
    }
};

export const requestShopSave = () => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.shop.SAVE,
            form: state.shop.form,
            user: state.authentication.user,
        });
    }
};

export const shopFileImage = (file, reader) => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.shop.SET_IMAGE_FILE,
            file: file,
            reader: reader,
            formObject: state.shop.form,
        });
    }
};

export const setShopSaving = (saving = false) => {
    return {
        type: actionTypes.shop.SAVING,
        saving: saving,
    }
}

export const setShopSaved = (saved = false) => {
    return {
        type: actionTypes.shop.SAVED,
        saved: saved,
    }
}

export const checkShopErrors = (check = false) => {
    return {
        type: actionTypes.shop.CHECK_ERRORS,
        check: check,
    }
};

export const setShop = (data = []) => {
    return {
        type: actionTypes.shop.SET_DATA,
        data: data,
    }
};

export const shopDataError = (error = null) => {
    return {
        type: actionTypes.shop.DATA_ERROR,
        error: error,
    }
};

export const requestShopData = (id) => {
    return {
        type: actionTypes.shop.REQUEST_DATA,
        id: id,
    }
};

export const openShopMapScreen = () => {
    return {
        type: actionTypes.shop.MAP_SCREEN,
        open: true,
    }
};

export const closeShopMapScreen = () => {
    return {
        type: actionTypes.shop.MAP_SCREEN,
        open: false,
    }
};
