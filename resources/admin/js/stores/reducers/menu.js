import * as actionTypes from "./../actions/actionTypes";

const initialState = {
    open: false,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.menu.OPEN:
            return {
                ...state,
                open: action.open,
            }
        default:
            return state;
    }
};

export default reducer;
