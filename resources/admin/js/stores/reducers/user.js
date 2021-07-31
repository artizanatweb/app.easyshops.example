import * as actionTypes from "./../actions/actionTypes";

const initialState = {
    data: null,
    form: null,
    saved: false,
    saving: false,
    editScreen: false,
    formErrors: null,
    checkErrors: false,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.user.SET:
            return {
                ...state,
                data: action.data,
            }
        case actionTypes.user.RESET:
            return {
                ...initialState,
            }
        case actionTypes.user.EDIT_SCREEN:
            return {
                ...state,
                editScreen: action.open,
            }
        case actionTypes.user.SET_FORM:
            return {
                ...state,
                form: action.form,
                saved: false,
            }
        case actionTypes.user.CHECK_ERRORS:
            return {
                ...state,
                checkErrors: action.check,
            }
        case actionTypes.user.SET_FORM_ERRORS:
            return {
                ...state,
                formErrors: action.errorsObject,
            }
        case actionTypes.user.SAVING:
            return {
                ...state,
                saving: action.saving,
            }
        case actionTypes.user.SAVED:
            return {
                ...state,
                saved: action.saved,
            }
        case actionTypes.user.SET_FIELD_CONTENT:
            let form = state.form;
            form[action.field] = action.content;

            return {
                ...state,
                form: {
                    ...form,
                },
                checkErrors: false,
            }
        case actionTypes.user.RESET_FORM:
            return {
                ...state,
                form: null,
                formErrors: null,
                saved: false,
                saving: false,
            }
        default:
            return state;
    }
};

export default reducer;
