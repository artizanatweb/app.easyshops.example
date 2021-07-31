import * as actionTypes from "./../actions/actionTypes";
import Position from "./../../utils/Position";

const initialState = {
    data: null,
    form: null,
    formImages: [],
    formImageErrors: null,
    saved: false,
    saving: false,
    actionsScreen: false,
    formErrors: null,
    checkErrors: false,
    dataError: null,
    mapZoom: 12,
    mapCenter: {
        lat: 44.439663,
        lng: 26.096306
    },
    mapSearch: "",
    mapPlaces: [],
    placesLoading: false,
    image: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.location.CLEAR:
            return {
                ...initialState,
            }
        case actionTypes.location.ACTIONS_SCREEN:
            return {
                ...state,
                actionsScreen: action.open,
            }
        case actionTypes.location.SET_FORM:
            return {
                ...state,
                form: action.form,
                saved: false,
            }
        case actionTypes.location.RESET:
            return {
                ...state,
                form: null,
                formErrors: null,
                formImages: [],
                formImageErrors: null,
                saved: false,
                saving: false,
                mapZoom: 12,
                mapCenter: {
                    lat: 44.439663,
                    lng: 26.096306
                },
                mapSearch: "",
                mapPlaces: [],
                placesLoading: false,
            }
        case actionTypes.location.SET_FIELD_CONTENT:
            let form = state.form;
            form[action.field] = action.content;

            return {
                ...state,
                form: {
                    ...form,
                },
                checkErrors: false,
            }
        case actionTypes.location.SET_FORM_IMAGES:
            return {
                ...state,
                formImages: [
                    ...action.images,
                ],
            }
        case actionTypes.location.SAVING:
            return {
                ...state,
                saving: action.saving,
            }
        case actionTypes.location.SET_FORM_ERRORS:
            return {
                ...state,
                formErrors: action.errorsObject,
            }
        case actionTypes.location.SAVED:
            return {
                ...state,
                saved: action.saved,
            }
        case actionTypes.location.SET_POSITION:
            let position = state.form?.location;
            if (!(position instanceof Position)) {
                position = new Position();
            }

            position.set("lat", action.lat);
            position.set("lng", action.lng);

            return {
                ...state,
                form: {
                    ...state.form,
                    location: position,
                }
            }
        case actionTypes.location.MAP_ZOOM:
            return {
                ...state,
                mapZoom: action.zoom,
            }
        case actionTypes.location.MAP_CENTER:
            return {
                ...state,
                mapCenter: {
                    ...state.mapCenter,
                    lat: action.lat,
                    lng: action.lng,
                },
            }
        case actionTypes.location.CHECK_ERRORS:
            return {
                ...state,
                checkErrors: action.check,
            }
        case actionTypes.location.MAP_SEARCH:
            return {
                ...state,
                mapSearch: action.searchTerm,
            }
        case actionTypes.location.MAP_PLACES:
            return {
                ...state,
                mapPlaces: action.places,
            }
        case actionTypes.location.PLACES_LOADING:
            return {
                ...state,
                placesLoading: action.loading,
            }
        case actionTypes.location.CLEAR_MAP_SEARCH:
            return {
                ...state,
                mapSearch: "",
                mapPlaces: [],
                placesLoading: false,
            }
        case actionTypes.location.SET_IMAGE:
            return {
                ...state,
                image: action.imageObject,
            }
        case actionTypes.location.SET_DATA:
            return {
                ...state,
                data: action.location,
            }
        case actionTypes.location.DATA_ERROR:
            return {
                ...state,
                dataError: action.error,
            }
        default:
            return state;
    }
};

export default reducer;
