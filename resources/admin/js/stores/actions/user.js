import * as actionTypes from "./actionTypes";

export const setUser = (data = null) => {
    return {
        type: actionTypes.user.SET,
        data: data,
    }
};

export const openEditProfileScreen = () => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.user.EDIT_SCREEN,
            open: true,
        });

        dispatch({
            type: actionTypes.user.REQUEST_FORM,
            form: state.user.form,
            data: state.user.data,
        })
    }
};

export const closeEditProfileScreen = () => {
    return {
        type: actionTypes.user.EDIT_SCREEN,
        open: false,
    }
};

export const resetUserProfile = () => {
    return {
        type: actionTypes.user.RESET,
    }
};

export const setUserProfileForm = (profileObject = null) => {
    return {
        type: actionTypes.user.SET_FORM,
        form: profileObject,
    }
};

export const changeUserProfileFieldContent = (field, content) => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.user.CHANGE_FIELD_CONTENT,
            field: field,
            content: content,
            formErrors: state.user.formErrors,
        });
    }
};

export const setUserProfileFormErrors = (errorsObject = null) => {
    return {
        type: actionTypes.user.SET_FORM_ERRORS,
        errorsObject: errorsObject,
    }
};

export const setUserProfileFieldContent = (field, content) => {
    return {
        type: actionTypes.user.SET_FIELD_CONTENT,
        field: field,
        content: content,
    }
};

export const checkUserProfileErrors = (check = false) => {
    return {
        type: actionTypes.user.CHECK_ERRORS,
        check: check,
    }
};

export const userProfileFileImage = (file, reader) => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.user.SET_IMAGE_FILE,
            file: file,
            reader: reader,
            formObject: state.user.form,
        });
    }
};

export const requestUserProfileSave = () => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.user.SAVE,
            form: state.user.form,
        });
    }
};

export const setUserProfileSaving = (saving = false) => {
    return {
        type: actionTypes.user.SAVING,
        saving: saving,
    }
};

export const setUserProfileSaved = (saved = false) => {
    return {
        type: actionTypes.user.SAVED,
        saved: saved,
    }
};

export const resetUserProfileForm = () => {
    return {
        type: actionTypes.user.RESET_FORM,
    }
};
