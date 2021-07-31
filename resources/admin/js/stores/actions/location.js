import * as actionTypes from "./actionTypes";

export const clearLocation = () => {
    return {
        type: actionTypes.location.CLEAR,
    }
};

export const openLocationActionScreen = () => {
    return {
        type: actionTypes.location.ACTIONS_SCREEN,
        open: true,
    }
};

export const closeLocationActionScreen = () => {
    return {
        type: actionTypes.location.ACTIONS_SCREEN,
        open: false,
    }
};

export const addFormLocation = () => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.location.ADD,
            form: state.location.form,
            shop: state.shop.data,
        });
    }
};

export const editFormLocation = (id = 0) => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.location.EDIT,
            form: state.location.form,
            id: id,
            shop: state.shop.data,
        });
    }
};

export const setFormLocation = (formObject) => {
    return {
        type: actionTypes.location.SET_FORM,
        form: formObject,
    }
}

export const changeLocationFieldContent = (field, content) => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.location.CHANGE_FIELD_CONTENT,
            field: field,
            content: content,
            formErrors: state.location.formErrors,
        });
    }
};

export const setLocationFieldContent = (field, content) => {
    return {
        type: actionTypes.location.SET_FIELD_CONTENT,
        field: field,
        content: content,
    }
};

export const setLocationFormErrors = (errorsObject = null) => {
    return {
        type: actionTypes.location.SET_FORM_ERRORS,
        errorsObject: errorsObject,
    }
};

export const requestLocationSave = () => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.location.SAVE,
            form: state.location.form,
            images: state.location.formImages,
            shop: state.shop.data,
        });
    }
};

export const addLocationImageElement = () => {
    return (dispatch, getState) => {
        const state = getState();
        dispatch({
            type: actionTypes.location.ADD_IMAGE,
            images: state.location.formImages,
        });
    }
};

export const resetLocation = () => {
    return {
        type: actionTypes.location.RESET,
    }
};

export const setLocationFormImages = (images = []) => {
    return {
        type: actionTypes.location.SET_FORM_IMAGES,
        images: images,
    }
};

export const removeLocationImageElement = (imageObj) => {
    return (dispatch, getState) => {
        const state = getState();
        dispatch({
            type: actionTypes.location.REMOVE_IMAGE,
            image: imageObj,
            images: state.location.formImages,
        });
    }
};

export const changeImageField = (field, value, image) => {
    return (dispatch, getState) => {
        const state = getState();

        if ('default' === field && value) {
            return dispatch({
                type: actionTypes.location.SET_DEFAULT_IMAGE,
                image: image,
                images: state.location.formImages,
            });
        }

        const chImage = state.location.formImages.find(item => item === image);
        chImage[field] = value;

        dispatch(setLocationFormImages(state.location.formImages));

        if (!state.location.formImageErrors) {
            return;
        }

        if (!state.location.formImageErrors.hasOwnProperty(image.assetKey)) {
            return;
        }

        if (!(field === state.location.formImageErrors[image.assetKey])) {
            return
        }

        dispatch(setLocationImageErrors());
    }
}

export const addLocationFileImage = (file, reader, imageObject) => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.location.SET_IMAGE_FILE,
            file: file,
            reader: reader,
            image: imageObject,
            images: state.location.formImages,
        });
    }
};

export const setLocationImageErrors = (error = null) => {
    return {
        type: actionTypes.location.FORM_IMAGE_ERRORS,
        error: error,
    }
};

export const setLocationSaving = (saving = false) => {
    return {
        type: actionTypes.location.SAVING,
        saving: saving,
    }
};

export const setLocationPosition = (lat = null, lng = null) => {
    return {
        type: actionTypes.location.SET_POSITION,
        lat: lat,
        lng: lng,
    }
};

export const setMapZoom = (zoom) => {
    return {
        type: actionTypes.location.MAP_ZOOM,
        zoom: zoom,
    }
};

export const setMapCenter = (lat = 0, lng = 0) => {
    return {
        type: actionTypes.location.MAP_CENTER,
        lat: lat,
        lng: lng,
    }
};

export const checkLocationErrors = (check = false) => {
    return {
        type: actionTypes.location.CHECK_ERRORS,
        check: check,
    }
};

export const setLocationSaved = (saved = false) => {
    return {
        type: actionTypes.location.SAVED,
        saved: saved,
    }
};

export const setMapSearch = (searchTerm = "") => {
    return {
        type: actionTypes.location.MAP_SEARCH,
        searchTerm: searchTerm,
    }
};

export const setMapPlaces = (places = []) => {
    return {
        type: actionTypes.location.MAP_PLACES,
        places: places,
    }
};

export const setPlacesLoading = (loading = false) => {
    return {
        type: actionTypes.location.PLACES_LOADING,
        loading: loading,
    }
};

export const clearMapSearch = () => {
    return {
        type: actionTypes.location.CLEAR_MAP_SEARCH,
    }
};

export const setFromGooglePlace = (googlePlace = {}) => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.location.SET_FROM_GPLACE,
            place: googlePlace,
            form: state.location.form,
            images: state.location.formImages,
        });
    }
};

export const requestLocation = (id) => {
    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: actionTypes.location.REQUEST_DATA,
            id: id,
            shop: state.shop.data,
        });
    }
};

export const setLocation = (location) => {
    return {
        type: actionTypes.location.SET_DATA,
        location: location,
    }
};

export const setLocationMainImage = (imageObject = null) => {
    return {
        type: actionTypes.location.SET_IMAGE,
        imageObject: imageObject,
    }
};

export const locationDataError = (error = null) => {
    return {
        type: actionTypes.shop.DATA_ERROR,
        error: error,
    }
};
