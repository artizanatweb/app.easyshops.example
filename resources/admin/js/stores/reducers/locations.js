import * as actionTypes from "./../actions/actionTypes";

const initialState = {
    items: null,
    deleteObject: null,
    deleteDialog: false,
    removing: false,
    loading: false,
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.locations.CLEAR:
            return {
                ...initialState
            }
        case actionTypes.locations.SET_ITEMS:
            return {
                ...state,
                items: action.items,
            }
        case actionTypes.locations.REMOVING:
            return {
                ...state,
                removing: action.removing,
            }
        case actionTypes.locations.DELETE_DIALOG:
            return {
                ...state,
                deleteDialog: action.open,
            }
        case actionTypes.locations.SET_DELETE_OBJECT:
            return {
                ...state,
                deleteObject: action.object,
            }
        case actionTypes.locations.LOADING:
            return {
                ...state,
                loading: action.loading
            }
        default:
            return state;
    }
}

export default reducer;

