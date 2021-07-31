import * as actionTypes from "./../actions/actionTypes";

const initialState = {
    open: false,
    severity: "error",
    message: "",
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.mainMessage.OPEN:
            return {
                ...state,
                open: action.open,
            }
        case actionTypes.mainMessage.SEVERITY:
            return {
                ...state,
                severity: action.severity,
            }
        case actionTypes.mainMessage.MESSAGE:
            return {
                ...state,
                message: action.message,
            }
        case actionTypes.authentication.VALID_EMAIL:
            return {
                ...state,
                validEmail: action.valid,
            }
        case actionTypes.authentication.VALID_PASSWORD:
            return {
                ...state,
                validPassword: action.valid,
            }
        default:
            return state;
    }
};

export default reducer;
