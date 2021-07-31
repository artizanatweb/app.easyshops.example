import { put, call, delay } from "redux-saga/effects";
import axios from "./../../utils/axios";
import * as storeActions from "./../actions";
import * as paths from "./../../utils/paths";
import {createFormErrorsObject, getItemDefaultAsset} from "./../../utils/utils";
import Pages from "./../../utils/Pages";
import LocationObject from "../../utils/LocationObject";
import LocationImageObject from "../../utils/LocationImageObject";
import Position from "./../../utils/Position";
import axiosClear from "axios";

export function* addLocationFormSaga(action) {
    let form = action.form;

    if (0 === form?.id) {
        return;
    }

    yield put(storeActions.resetLocation());
    let location = new LocationObject();

    if (!form) {
        return yield put(storeActions.setFormLocation(location));
    }

    if (form?.id > 0) {
        return yield put(storeActions.setFormLocation(location));
    }
}

export function* editLocationFormSaga(action) {
    let form = action.form;
    let requestId = action.id;

    if (form?.id === requestId) {
        return;
    }

    if (!action?.shop?.id) {
        yield put(storeActions.setMainMessage('error', "Shop data is missing!"));
        return yield put(storeActions.closeLocationActionScreen());
    }

    yield put(storeActions.resetLocation());

    // request location object from API
    let responseObject = null;
    let isError = false;

    yield axios.get(paths.locations.show(action.shop.id,requestId))
        .then((response) => {
            responseObject = response.data;
        })
        .catch((error) => {
            responseObject = error.response;
            isError = true;
        });

    if (!responseObject?.success) {
        yield put(storeActions.closeLocationActionScreen());
        return yield put(storeActions.setMainMessage('error', "Server error!"));
    }

    if (isError) {
        yield put(storeActions.closeLocationActionScreen());
        return yield put(storeActions.setMainMessage('error', responseObject.message));
    }

    let locationData = responseObject.data;
    let location = new LocationObject();
    location.fill(locationData);
    yield put(storeActions.setFormLocation(location));

    let images = [];
    if (locationData.images?.length > 0) {
        locationData.images.forEach((imageData) => {
            let locationImage = new LocationImageObject();
            locationImage.fill(imageData);
            images.push(locationImage);
        });
    }

    yield put(storeActions.setLocationFormImages(images));
}

export function* changeLocationFieldValueSaga(action) {
    let field = action.field;
    let content = action.content;

    if ("email" === field) {
        content = content.trim().replace(/[^a-z0-9.+@_-]/g, "").toLowerCase();
    }

    if ("phone" === field) {
        content = content.trim().replace(/[^0-9.+]/g, "");
    }

    if (action.formErrors) {
        let errors = { ...action.formErrors };

        if (errors.hasOwnProperty(field)) {
            delete errors[field];
        }
        yield put(storeActions.setLocationFormErrors(errors));
    }

    yield put(storeActions.setLocationFieldContent(field, content));
}

export function* addLocationFormImageSaga(action) {
    const images = action.images;
    const image = new LocationImageObject();
    images.push(image);

    yield put(storeActions.setLocationFormImages(images));
}

export function* removeLocationFormImageSaga(action) {
    const image = action.image;

    const images = action.images.filter(item => item !== image);
    yield put(storeActions.setLocationFormImages(images));
}

export function* setLocationDefaultImage(action) {
    action.images.forEach((image) => {
        if (image === action.image) {
            return image.default = true;
        }

        image.default = false;
    });

    yield put(storeActions.setLocationFormImages(action.images));
}

export function* setLocationImageFile(action) {
    const image = action.images.find(item => item === action.image);
    image.imageReader = action.reader;
    image.uploadFile = action.file;

    yield put(storeActions.setLocationFormImages(action.images));
}

function createLocationFormData(action, actionType = "create") {
    const elemForm = new FormData();
    elemForm.append('id', action.form.id);
    elemForm.append('name', action.form.name);
    elemForm.append('address', action.form.address);
    elemForm.append('location[lat]', action.form.location.lat);
    elemForm.append('location[lng]', action.form.location.lng);

    elemForm.append('phone', action.form.phone);
    elemForm.append('email', action.form.email);


    if ("update" === actionType) {
        elemForm.append('_method', "put");
    }

    if (action.images && action.images.length > 0) {
        action.images.forEach((elem,index) => {
            if (elem.uploadFile) {
                elemForm.append(`images[${index}]`, elem.uploadFile);
            }
            elemForm.append(`imageDetails[${index}][id]`, elem.id);
            elemForm.append(`imageDetails[${index}][name]`, elem.name);
            elemForm.append(`imageDetails[${index}][default]`, elem.default);
            elemForm.append(`imageDetails[${index}][assetKey]`, elem.assetKey);
        });
    }

    return elemForm;
}

export function* saveLocationSaga(action) {
    yield put(storeActions.setLocationSaving(true));

    if (!action?.shop?.id) {
        yield put(storeActions.setMainMessage('error', "Shop data is missing!"));
        return yield put(storeActions.setLocationSaving(false));
    }

    let actionType = "create";
    let apiPath = paths.locations.create(action.shop.id);
    if (action.form?.id > 0) {
        actionType = "update";
        apiPath = paths.locations.update(action.shop.id, action.form.id);
    }

    const locationForm = createLocationFormData(action, actionType);

    let responseObject = null;
    let isError = false;

    yield axios.post(apiPath, locationForm)
        .then((response) => {
            responseObject = response;
        })
        .catch((error) => {
            responseObject = error.response;
            isError = true;
        });

    yield call(locationActionReceived, isError, responseObject, actionType, action.shop.id);
}

function* locationActionReceived(isError, responseObject, actionType = "create", shopId) {
    if (isError) {
        yield put(storeActions.setLocationSaving(false));
        yield put(storeActions.setMainMessage('error', responseObject.data.message));

        if (405 === responseObject.status) {
            if (responseObject.data?.data) {
                yield put(storeActions.setLocationImageErrors(responseObject.data.data));
            }
            return;
        }

        if (responseObject.status !== 406) {
            const errorsObject = createFormErrorsObject(responseObject.data);
            yield put(storeActions.setLocationFormErrors(errorsObject));
            yield put(storeActions.checkLocationErrors(true));
        }

        return;
    }

    let successMessage = "Shop location added!";
    if ("update" === actionType) {
        successMessage = "Shop location modified with success!";
    }

    yield put(storeActions.setLocationSaved(true));
    yield put(storeActions.setMainMessage('success', successMessage));

    yield put(storeActions.requestLocations(shopId));

    yield delay(1000);
    yield put(storeActions.closeLocationActionScreen());
    // reset user form
    yield delay(500);
    yield put(storeActions.resetLocation());
}

export function* setFromGooglePlaceSaga(action) {
    if (!action.place) {
        return;
    }

    let place = action.place;
    let form = action.form;
    let images = action.images;

    if (place?.name?.length > 0) {
        form.name = place.name;
    }
    if (place?.formatted_address?.length > 0) {
        form.address = place.formatted_address;
    }
    if (place?.geometry?.location) {
        form.location = new Position(
            place.geometry.location.lat(),
            place.geometry.location.lng(),
        );
    }
    if (place?.place_id?.length > 0) {
        yield call(getPlacePhotos, place.place_id);
    }

    yield put(storeActions.setFormLocation(form));
    yield put(storeActions.setMapCenter(form.location.lat, form.location.lng));
    yield put(storeActions.setMapZoom(16));
    yield put(storeActions.setPlacesLoading(false));
    yield put(storeActions.clearMapSearch());
}

function* getPlacePhotos(placeId) {
    let responseObject = null;
    let isError = false;

    const params = {
        place_id: placeId
    };
    yield axios.post(paths.location.placePhotos, params)
        .then((response) => {
            responseObject = response;
        })
        .catch((error) => {
            responseObject = error.response;
            isError = true;
        });

    if (isError) {
        return yield put(storeActions.setMainMessage('error', responseObject?.data?.message));
    }

    let photos = responseObject?.data?.data;
    if (!(photos?.length > 0)) {
        return;
    }

    yield call(createPlaceImages, photos);
}

function* createPlaceImages(photos = []) {
    const images = [];

    for (const photo of photos) {
        let imageData = {
            thumbnail: photo.url,
            image: photo.url,
        };
        let locationImage = new LocationImageObject();
        locationImage.fill(imageData);

        const base64Photo = yield fetch(photo.file);
        const blobImage = yield base64Photo.blob();
        const fileImage = new File([blobImage], photo.name, { type: photo.type });

        locationImage.uploadFile = fileImage;

        if (0 === images.length) {
            locationImage.default = true;
        }
        images.push(locationImage);
    }

    yield put(storeActions.setLocationFormImages(images));
}

export function* requestLocationSaga(action) {
    yield put(storeActions.setApplicationLoading(true));

    let shop = action.shop;
    let requestId = action.id;

    // request location object from API
    let responseObject = null;
    let isError = false;

    yield axios.get(paths.locations.show(shop.id,requestId))
        .then((response) => {
            responseObject = response.data;
        })
        .catch((error) => {
            responseObject = error.response;
            isError = true;
        });

    if (!responseObject?.success) {
        return yield put(storeActions.setMainMessage('error', "Server error!"));
    }

    if (isError) {
        return yield put(storeActions.setMainMessage('error', responseObject.message));
    }

    let locationData = responseObject.data;
    yield put(storeActions.setLocation(locationData));
    const defaultImage = getItemDefaultAsset(locationData);
    yield put(storeActions.setLocationMainImage(defaultImage));

    yield put(storeActions.setApplicationLoading(false));
}
