import * as actionTypes from "./../actions/actionTypes";
import AuthUser from "./../../utils/AuthUser";

const initialState = {
    showScreen: false,
    riseLogo: false,
    showForm: false,
    remember: false,
    showPassword: false,
    credentials: {
        email: "",
        password: "",
    },
    user: null,
    invalidEmail: false,
    invalidPassword: false,
    validating: false,
    refreshing: false,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.authentication.SHOW_SCREEN:
            return {
                ...state,
                showScreen: action.open,
            }
        case actionTypes.authentication.RISE_LOGO:
            return {
                ...state,
                riseLogo: action.rise,
            }
        case actionTypes.authentication.SHOW_FORM:
            return {
                ...state,
                showForm: action.show,
            }
        case actionTypes.authentication.SHOW_PASSWORD:
            return {
                ...state,
                showPassword: action.show,
            }
        case actionTypes.authentication.SET_EMAIL:
            return {
                ...state,
                credentials: {
                    ...state.credentials,
                    email: action.email,
                }
            }
        case actionTypes.authentication.SET_PASSWORD:
            return {
                ...state,
                credentials: {
                    ...state.credentials,
                    password: action.password,
                }
            }
        case actionTypes.authentication.VALID_EMAIL:
            return {
                ...state,
                invalidEmail: !action.valid,
            }
        case actionTypes.authentication.VALID_PASSWORD:
            return {
                ...state,
                invalidPassword: !action.valid,
            }
        case actionTypes.authentication.VALIDATING:
            return {
                ...state,
                validating: action.validating,
            }
        case actionTypes.authentication.SET_USER:
            return {
                ...state,
                user: (action.user === AuthUser) ? action.user : null,
            }
        case actionTypes.authentication.REFRESHING:
            return {
                ...state,
                refreshing: action.refreshing,
            }
        case actionTypes.authentication.REMEMBER_ME:
            return {
                ...state,
                remember: action.rState,
            }
        default:
            return state;
    }
};

export default reducer;
