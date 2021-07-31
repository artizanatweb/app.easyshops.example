import * as actionTypes from "./../actions/actionTypes";

const initialState = {
    items: [],
    deleteObject: null,
    deleteDialog: false,
    removing: false,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.serviceTemplates.CLEAR:
            return {
                ...initialState,
            }
        case actionTypes.serviceTemplates.SET_ITEMS:
            return {
                ...state,
                items: action.data,
            }
        case actionTypes.serviceTemplates.REMOVING:
            return {
                ...state,
                removing: action.removing,
            }
        case actionTypes.serviceTemplates.DELETE_DIALOG:
            return {
                ...state,
                deleteDialog: action.open,
            }
        case actionTypes.serviceTemplates.SET_DELETE_OBJECT:
            return {
                ...state,
                deleteObject: action.object,
            }
        default:
            return state;
    }
};

export default reducer;
