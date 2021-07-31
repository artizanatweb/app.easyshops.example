import * as actionTypes from "./actionTypes";

export const clearShops = () => {
    return {
        type: actionTypes.shops.CLEAR,
    }
};

export const setShops = (data = []) => {
    return {
        type: actionTypes.shops.SET_ITEMS,
        data: data,
    }
};

export const setDeleteShopObject = (object = null) => {
    return {
        type: actionTypes.shops.SET_DELETE_OBJECT,
        object: object,
    }
};

export const openShopDeleteDialog = () => {
    return {
        type: actionTypes.shops.DELETE_DIALOG,
        open: true,
    }
};

export const closeShopDeleteDialog = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.shops.DELETE_DIALOG,
            open: false,
        });

        dispatch(setShopRemoving(false));
        dispatch(setDeleteShopObject());
    }
};

export const setShopRemoving = (removing = false) => {
    return {
        type: actionTypes.shops.REMOVING,
        removing: removing,
    }
};

export const requestShopRemoval = () => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.shops.DELETE,
            object: state.shops.deleteObject,
        });
    }
};

export const requestShopsPager = () => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.shops.REQUEST_ITEMS,
            pager: state.shops.pager,
        });
    }
};

export const requestShopsSelect = (force = false) => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.shops.REQUEST_ALL_ITEMS,
            force: force,
            items: state.shops.items,
        });
    }
};

export const setAllItemsShops = (items = []) => {
    return {
        type: actionTypes.shops.SET_ALL_ITEMS,
        items: items,
    }
};
