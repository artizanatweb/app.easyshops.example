import * as actionTypes from "./../actions/actionTypes";

const initialState = {
    show: false,
    loading: false,
    page: null,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.application.SHOW:
            return {
                ...state,
                show: action.show,
            }
        case actionTypes.application.SET_LOADING:
            return {
                ...state,
                loading: action.loading,
            }
        case actionTypes.application.SET_PAGE:
            return {
                ...state,
                page: action.page,
            }
        case actionTypes.application.CLEAR:
            return {
                ...initialState,
            }
        default:
            return state;
    }
};

export default reducer;
