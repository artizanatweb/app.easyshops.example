import * as actionTypes from "./../actions/actionTypes";

const initialState = {
    data: null,
    form: null,
    saved: false,
    saving: false,
    actionsScreen: false,
    formErrors: null,
    checkErrors: false,
    editScreen: false,
    dataError: null,
    mapScreen: false,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.shop.SET_DATA:
            return {
                ...state,
                data: action.data,
                dataError: null,
            }
        case actionTypes.shop.CLEAR:
            return {
                ...initialState,
            }
        case actionTypes.shop.ACTIONS_SCREEN:
            return {
                ...state,
                actionsScreen: action.open,
            }
        case actionTypes.shop.EDIT_SCREEN:
            return {
                ...state,
                editScreen: action.open,
            }
        case actionTypes.shop.SET_FORM:
            return {
                ...state,
                form: action.form,
                saved: false,
            }
        case actionTypes.shop.CHECK_ERRORS:
            return {
                ...state,
                checkErrors: action.check,
            }
        case actionTypes.shop.SET_FORM_ERRORS:
            return {
                ...state,
                formErrors: action.errorsObject,
            }
        case actionTypes.shop.SAVING:
            return {
                ...state,
                saving: action.saving,
            }
        case actionTypes.shop.SAVED:
            return {
                ...state,
                saved: action.saved,
            }
        case actionTypes.shop.SET_FIELD_CONTENT:
            let form = state.form;
            form[action.field] = action.content;

            return {
                ...state,
                form: {
                    ...form,
                },
                checkErrors: false,
            }
        case actionTypes.shop.RESET:
            return {
                ...state,
                form: null,
                formErrors: null,
                saved: false,
                saving: false,
            }
        case actionTypes.shop.DATA_ERROR:
            return {
                ...state,
                dataError: action.error,
            }
        case actionTypes.shop.MAP_SCREEN:
            return {
                ...state,
                mapScreen: action.open,
            }
        default:
            return state;
    }
};

export default reducer;
