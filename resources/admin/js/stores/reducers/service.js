import * as actionTypes from "./../actions/actionTypes";

const initialState = {
    form: null,
    saved: false,
    saving: false,
    actionsScreen: false,
    formErrors: null,
    checkErrors: false,
    overwrite: {
        name: true,
        duration: true,
    },
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.service.CLEAR:
            return {
                ...initialState,
            }
        case actionTypes.service.ACTIONS_SCREEN:
            return {
                ...state,
                actionsScreen: action.open,
            }
        case actionTypes.service.SET_FORM:
            return {
                ...state,
                form: action.form,
                saved: false,
            }
        case actionTypes.service.SET_FIELD_CONTENT:
            let form = state.form;
            form[action.field] = action.content;

            return {
                ...state,
                form: {
                    ...form,
                },
                checkErrors: false,
            }
        case actionTypes.service.CHECK_ERRORS:
            return {
                ...state,
                checkErrors: action.check,
            }
        case actionTypes.service.SET_FORM_ERRORS:
            return {
                ...state,
                formErrors: action.errorsObject,
            }
        case actionTypes.service.SAVING:
            return {
                ...state,
                saving: action.saving,
            }
        case actionTypes.service.SAVED:
            return {
                ...state,
                saved: action.saved,
            }
        case actionTypes.service.RESET:
            return {
                ...state,
                form: null,
                formErrors: null,
                saved: false,
                saving: false,
                overwrite: initialState.overwrite
            }
        case actionTypes.service.OVERWRITE:
            let overwrite = {
                ...state.overwrite,
            }

            overwrite[action.field] = false;

            return {
                ...state,
                overwrite: overwrite,
            }
        default:
            return state;
    }
};

export default reducer;
