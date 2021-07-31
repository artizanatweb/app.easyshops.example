import * as actionTypes from "./actionTypes";

export const setUsers = (data = []) => {
    return {
        type: actionTypes.users.SET_ITEMS,
        data: data,
    }
};

export const setUsersLoading = (loading = false) => {
    return {
        type: actionTypes.users.SET_LOADING,
        loading: loading,
    }
};

export const usersActionsScreen = (open = false) => {
    return {
        type: actionTypes.users.ACTIONS_SCREEN,
        open: open,
    }
}

export const setUsersForm = (formObject) => {
    return {
        type: actionTypes.users.SET_FORM,
        form: formObject,
    }
}

export const addFormUser = () => {
    return (dispatch, getState) => {
        const state = getState();

        return dispatch({
            type: actionTypes.users.ADD,
            form: state.users.form,
        });
    }
};

export const editFormUser = (id = 0) => {
    return (dispatch, getState) => {
        const state = getState();

        return dispatch({
            type: actionTypes.users.EDIT,
            form: state.users.form,
            id: id,
        });
    }
};

export const changeUserFieldContent = (field, content) => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.users.CHANGE_FIELD_CONTENT,
            field: field,
            content: content,
            formErrors: state.users.formErrors,
        });
    }
};

export const setUserFieldContent = (field, content) => {
    return {
        type: actionTypes.users.SET_FIELD_CONTENT,
        field: field,
        content: content,
    }
};

export const checkUserErrors = (check = false) => {
    return {
        type: actionTypes.users.CHECK_ERRORS,
        check: check,
    }
};

export const resetUserForm = () => {
    return {
        type: actionTypes.users.RESET,
    }
};

export const userFileImage = (file, reader) => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.users.SET_IMAGE_FILE,
            file: file,
            reader: reader,
            formObject: state.users.form,
        });
    }
};

export const setUserFormErrors = (errorsObject = null) => {
    return {
        type: actionTypes.users.SET_FORM_ERRORS,
        errorsObject: errorsObject,
    }
};

export const requestUserTypes = () => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.users.REQUEST_TYPES,
            storeTypes: state.users.types,
        });
    }
};

export const setUserTypes = (userTypes = []) => {
    return {
        type: actionTypes.users.SET_TYPES,
        userTypes: userTypes,
    }
};

export const setUserSaving = (saving = false) => {
    return {
        type: actionTypes.users.SAVING,
        saving: saving,
    }
};

export const requestUserSave = () => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.users.SAVE,
            form: state.users.form,
        });
    }
};

export const setUserSaved = (saved = false) => {
    return {
        type: actionTypes.users.SAVED,
        saved: saved,
    }
};

export const setDeleteUserObject = (object = null) => {
    return {
        type: actionTypes.users.SET_DELETE_OBJECT,
        object: object,
    }
};

export const openUserDeleteDialog = () => {
    return {
        type: actionTypes.users.DELETE_DIALOG,
        open: true,
    }
};

export const closeUserDeleteDialog = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.users.DELETE_DIALOG,
            open: false,
        });

        dispatch(setUserRemoving(false));
        dispatch(setDeleteUserObject());
    }
};

export const setUserRemoving = (removing = false) => {
    return {
        type: actionTypes.users.REMOVING,
        removing: removing,
    }
};

export const requestUserRemoval = () => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.users.DELETE,
            user: state.users.deleteUser,
        });
    }
};

export const resetUsersModule = () => {
    return {
        type: actionTypes.users.RESET_ALL,
    }
};

export const requestSelectLocations = () => {
    return {
        type: actionTypes.users.REQUEST_SELECT_LOCATIONS,
    }
};

export const setSelectLocations = (locations) => {
    return {
        type: actionTypes.users.SET_SELECT_LOCATIONS,
        locations: locations,
    }
};
