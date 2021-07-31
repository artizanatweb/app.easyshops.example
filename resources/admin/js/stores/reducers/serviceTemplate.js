import * as actionTypes from "./../actions/actionTypes";

const initialState = {
    form: null,
    saved: false,
    saving: false,
    actionsScreen: false,
    formErrors: null,
    checkErrors: false,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.serviceTemplate.CLEAR:
            return {
                ...initialState,
            }
        case actionTypes.serviceTemplate.ACTIONS_SCREEN:
            return {
                ...state,
                actionsScreen: action.open,
            }
        case actionTypes.serviceTemplate.SET_FORM:
            return {
                ...state,
                form: action.form,
                saved: false,
            }
        case actionTypes.serviceTemplate.SET_FIELD_CONTENT:
            let form = state.form;
            form[action.field] = action.content;

            return {
                ...state,
                form: {
                    ...form,
                },
                checkErrors: false,
            }
        case actionTypes.serviceTemplate.CHECK_ERRORS:
            return {
                ...state,
                checkErrors: action.check,
            }
        case actionTypes.serviceTemplate.SET_FORM_ERRORS:
            return {
                ...state,
                formErrors: action.errorsObject,
            }
        case actionTypes.serviceTemplate.SAVING:
            return {
                ...state,
                saving: action.saving,
            }
        case actionTypes.serviceTemplate.SAVED:
            return {
                ...state,
                saved: action.saved,
            }
        case actionTypes.serviceTemplate.RESET:
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
