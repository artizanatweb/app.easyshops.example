import * as actionTypes from "./actionTypes";

export const clearServiceTemplate = () => {
    return {
        type: actionTypes.serviceTemplate.CLEAR,
    }
};

export const resetServiceTemplate = () => {
    return {
        type: actionTypes.serviceTemplate.RESET,
    }
};

export const openServiceTemplateActionScreen = () => {
    return {
        type: actionTypes.serviceTemplate.ACTIONS_SCREEN,
        open: true,
    }
};

export const closeServiceTemplateActionScreen = () => {
    return {
        type: actionTypes.serviceTemplate.ACTIONS_SCREEN,
        open: false,
    }
};

export const addFormTemplate = () => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.serviceTemplate.ADD,
            form: state.serviceTemplate.form,
        });
    }
};

export const editFormTemplate = (id = 0) => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.serviceTemplate.EDIT,
            form: state.serviceTemplate.form,
            id: id,
        });
    }
};

export const setFormTemplate = (formObject) => {
    return {
        type: actionTypes.serviceTemplate.SET_FORM,
        form: formObject,
    }
}

export const changeTemplateFieldContent = (field, content) => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.serviceTemplate.CHANGE_FIELD_CONTENT,
            field: field,
            content: content,
            formErrors: state.serviceTemplate.formErrors,
        });
    }
};

export const setTemplateFieldContent = (field, content) => {
    return {
        type: actionTypes.serviceTemplate.SET_FIELD_CONTENT,
        field: field,
        content: content,
    }
};

export const setTemplateFormErrors = (errorsObject = null) => {
    return {
        type: actionTypes.serviceTemplate.SET_FORM_ERRORS,
        errorsObject: errorsObject,
    }
};

export const requestTemplateSave = () => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.serviceTemplate.SAVE,
            form: state.serviceTemplate.form,
        });
    }
};

export const setTemplateSaving = (saving = false) => {
    return {
        type: actionTypes.serviceTemplate.SAVING,
        saving: saving,
    }
};

export const checkTemplateErrors = (check = false) => {
    return {
        type: actionTypes.serviceTemplate.CHECK_ERRORS,
        check: check,
    }
};

export const setTemplateSaved = (saved = false) => {
    return {
        type: actionTypes.serviceTemplate.SAVED,
        saved: saved,
    }
}
