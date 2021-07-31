import * as actionTypes from "./../actions/actionTypes";

const PAGER = {
    current_page: 1,
    from: 0,
    to: 0,
    per_page: 0,
    data: [],
    next_page: 1,
    prev_page: 1,
    total: 0,
    page: 0,
    error: null,
}

const initialState = {
    pager: PAGER,
    loading: false,
    form: null,
    actionsScreen: false,
    saving: false,
    saved: false,
    checkErrors: false,
    formErrors: null,
    removing: false,
    types: [],
    deleteUser: null,
    deleteDialog: false,
    locations: null,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.users.SET_ITEMS:
            let pager = {
                ...state.pager,
            };

            for (let [prop, value] of Object.entries(pager)) {
                if (!action.data.hasOwnProperty(prop)) {
                    continue;
                }

                if ('current_page' === prop) {
                    pager.page = action.data.current_page - 1;
                }

                pager[prop] = action.data[prop];
            }

            return {
                ...state,
                pager: pager,
            }
        case actionTypes.users.SET_LOADING:
            return {
                ...state,
                loading: action.loading,
            }
        case actionTypes.users.ACTIONS_SCREEN:
            return {
                ...state,
                actionsScreen: action.open,
            }
        case actionTypes.users.SET_FORM:
            return {
                ...state,
                form: action.form,
                saved: false,
            }
        case actionTypes.users.SET_FIELD_CONTENT:
            let actualForm = state.form;
            actualForm[action.field] = action.content;

            return {
                ...state,
                form: {
                    ...actualForm,
                },
                checkErrors: false,
            }
        case actionTypes.users.RESET:
            return {
                ...state,
                form: null,
                formErrors: null,
                saved: false,
                saving: false,
            }
        case actionTypes.users.CHECK_ERRORS:
            return {
                ...state,
                checkErrors: action.check,
            }
        case actionTypes.users.SET_FORM_ERRORS:
            return {
                ...state,
                formErrors: action.errorsObject,
            }
        case actionTypes.users.SET_TYPES:
            return {
                ...state,
                types: action.userTypes,
            }
        case actionTypes.users.SAVING:
            return {
                ...state,
                saving: action.saving,
            }
        case actionTypes.users.SAVED:
            return {
                ...state,
                saved: action.saved,
            }
        case actionTypes.users.SET_DELETE_OBJECT:
            return {
                ...state,
                deleteUser: action.object,
            }
        case actionTypes.users.DELETE_DIALOG:
            return {
                ...state,
                deleteDialog: action.open,
            }
        case actionTypes.users.REMOVING:
            return {
                ...state,
                removing: action.removing
            }
        case actionTypes.users.RESET_ALL:
            return {
                ...initialState,
            }
        case actionTypes.users.SET_SELECT_LOCATIONS:
            return {
                ...state,
                locations: action.locations,
            }
        default:
            return state;
    }
}

export default reducer;
