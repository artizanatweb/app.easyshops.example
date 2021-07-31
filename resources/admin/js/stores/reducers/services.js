import * as actionTypes from "./../actions/actionTypes";

const initialState = {
    items: [],
    deleteObject: null,
    deleteDialog: false,
    removing: false,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.services.CLEAR:
            return {
                ...initialState,
            }
        case actionTypes.services.SET_ITEMS:
            return {
                ...state,
                items: action.items,
            }
        case actionTypes.services.REMOVING:
            return {
                ...state,
                removing: action.removing,
            }
        case actionTypes.services.DELETE_DIALOG:
            return {
                ...state,
                deleteDialog: action.open,
            }
        case actionTypes.services.SET_DELETE_OBJECT:
            return {
                ...state,
                deleteObject: action.object,
            }
        default:
            return state;
    }
};

export default reducer;
