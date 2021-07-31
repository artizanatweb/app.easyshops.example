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
    deleteObject: null,
    deleteDialog: false,
    removing: false,
    items: null,
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.shops.CLEAR:
            return {
                ...initialState
            }
        case actionTypes.shops.SET_ITEMS:
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
        case actionTypes.shops.REMOVING:
            return {
                ...state,
                removing: action.removing,
            }
        case actionTypes.shops.DELETE_DIALOG:
            return {
                ...state,
                deleteDialog: action.open,
            }
        case actionTypes.shops.SET_DELETE_OBJECT:
            return {
                ...state,
                deleteObject: action.object,
            }
        case actionTypes.shops.SET_ALL_ITEMS:
            return {
                ...state,
                items: action.items,
            }
        default:
            return state;
    }
}

export default reducer;
