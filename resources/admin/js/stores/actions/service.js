import * as actionTypes from "./actionTypes";

export const clearService = () => {
    return {
        type: actionTypes.service.CLEAR,
    }
};

export const resetService = () => {
    return {
        type: actionTypes.service.RESET,
    }
};

export const openServiceActionScreen = () => {
    return {
        type: actionTypes.service.ACTIONS_SCREEN,
        open: true,
    }
};

export const closeServiceActionScreen = () => {
    return {
        type: actionTypes.service.ACTIONS_SCREEN,
        open: false,
    }
};

export const addFormService = () => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.service.ADD,
            form: state.service.form,
        });
    }
};

export const editFormService = (id = 0) => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.service.EDIT,
            form: state.service.form,
            id: id,
            shop: state.shop.data,
        });
    }
};

export const setFormService = (formObject) => {
    return {
        type: actionTypes.service.SET_FORM,
        form: formObject,
    }
}

export const changeServiceFieldContent = (field, content) => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.service.CHANGE_FIELD_CONTENT,
            field: field,
            content: content,
            formErrors: state.service.formErrors,
            templates: state.serviceTemplates.items,
            overwrite: state.service.overwrite,
        });
    }
};

export const setServiceFieldContent = (field, content) => {
    return {
        type: actionTypes.service.SET_FIELD_CONTENT,
        field: field,
        content: content,
    }
};

export const setServiceFormErrors = (errorsObject = null) => {
    return {
        type: actionTypes.service.SET_FORM_ERRORS,
        errorsObject: errorsObject,
    }
};

export const requestServiceSave = () => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.service.SAVE,
            form: state.service.form,
            user: state.authentication.user,
            shop: state.shop.data,
        });
    }
};

export const serviceFieldOverwrite = (field) => {
    return {
        type: actionTypes.service.OVERWRITE,
        field: field,
    }
};

export const setServiceSaving = (saving = false) => {
    return {
        type: actionTypes.service.SAVING,
        saving: saving,
    }
};

export const checkServiceErrors = (check = false) => {
    return {
        type: actionTypes.service.CHECK_ERRORS,
        check: check,
    }
};

export const setServiceSaved = (saved = false) => {
    return {
        type: actionTypes.service.SAVED,
        saved: saved,
    }
}
