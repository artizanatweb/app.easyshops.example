import * as actionTypes from "./actionTypes";

export const clearLocations = () => {
    return {
        type: actionTypes.locations.CLEAR,
    }
};

export const setLocations = (items = []) => {
    return {
        type: actionTypes.locations.SET_ITEMS,
        items: items,
    }
};

export const setDeleteLocationObject = (object = null) => {
    return {
        type: actionTypes.locations.SET_DELETE_OBJECT,
        object: object,
    }
};

export const openLocationDeleteDialog = () => {
    return {
        type: actionTypes.locations.DELETE_DIALOG,
        open: true,
    }
};

export const closeLocationDeleteDialog = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.locations.DELETE_DIALOG,
            open: false,
        });

        dispatch(setLocationRemoving(false));
        dispatch(setDeleteLocationObject());
    }
};

export const setLocationRemoving = (removing = false) => {
    return {
        type: actionTypes.locations.REMOVING,
        removing: removing,
    }
};

export const requestLocationRemoval = () => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.locations.DELETE,
            object: state.locations.deleteObject,
            shop: state.shop.data,
        });
    }
};

export const requestLocations = (shopId) => {
    return {
        type: actionTypes.locations.REQUEST_ITEMS,
        shopId: shopId,
    }
};

export const locationsLoading = (loading = false) => {
    return {
        type: actionTypes.locations.LOADING,
        loading: loading,
    }
};

export const requestShopLocations = () => {
    return (dispatch, getState) => {
        const state = getState();

        console.log(state.shop);
        dispatch(requestLocations(state.shop?.id));
    }
};
