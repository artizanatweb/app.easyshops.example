import { takeEvery, all, call } from "redux-saga/effects";
import * as actionTypes from "./../actions/actionTypes";
import { hideDummyLoader, requestPageContent, clearApplicationSaga } from "./application";
import {
    authEmailChangedSaga, authPasswordChangedSaga,
    requestAuthenticationSaga, logoutSaga, refreshTokenSaga
} from "./authentication";
import {
    addUserFormSaga, editUserFormSaga, setUserImageFile,
    getUserTypesSaga, changeUserFieldValueSaga, saveUserFormSaga,
    requestUserRemoval, requestAllLocationsSaga
} from "./users";
import {
    userProfileFormSaga, setUserProfileImageFile, changeUserProfileFieldValueSaga,
    saveUserProfileFormSaga,
} from "./user";
import {
    addShopFormSaga, editShopFormSaga, setShopImageFileSaga,
    changeShopFieldValueSaga, saveShopFormSaga, requestShopSaga,
} from "./shop";
import { requestShopRemovalSaga, requestShopsAllSaga } from "./shops";
import {
    addLocationFormSaga, editLocationFormSaga, changeLocationFieldValueSaga,
    addLocationFormImageSaga, removeLocationFormImageSaga, setLocationDefaultImage,
    setLocationImageFile, saveLocationSaga, setFromGooglePlaceSaga,
    requestLocationSaga,
} from "./location";
import { requestLocationsSaga, requestLocationRemovalSaga } from "./locations";
import { requestServiceTemplatesSaga, requestServiceTemplateRemovalSaga } from "./serviceTemplates";
import {
    addServiceTemplateFormSaga,
    editServiceTemplateFormSaga,
    changeServiceTemplateFieldValueSaga,
    saveServiceTemplateSaga,
} from "./serviceTemplate";
import {
    addServiceFormSaga,
    editServiceFormSaga,
    changeServiceFieldValueSaga,
    saveServiceSaga,
} from "./service";
import {
    requestTemplateItemsSaga,
    requestServicesSaga,
    requestServiceRemovalSaga,
} from "./services";
import {changeServiceFieldContent} from "../actions";

export function* watchApplication() {
    yield takeEvery(actionTypes.application.SHOW, hideDummyLoader);
    yield takeEvery(actionTypes.application.REQUEST_PAGE_CONTENT, requestPageContent);
    yield takeEvery(actionTypes.application.CLEAR, clearApplicationSaga);
}

export function* watchAuthentication() {
    yield takeEvery(actionTypes.authentication.CHANGE_EMAIL, authEmailChangedSaga);
    yield takeEvery(actionTypes.authentication.CHANGE_PASSWORD, authPasswordChangedSaga);
    yield takeEvery(actionTypes.authentication.REQUEST_AUTHENTICATION, requestAuthenticationSaga);
    yield takeEvery(actionTypes.authentication.LOGOUT, logoutSaga);
    yield takeEvery(actionTypes.authentication.WEB_STORAGE_AUTH, refreshTokenSaga);
}

export function* watchUsers() {
    yield takeEvery(actionTypes.users.ADD, addUserFormSaga);
    yield takeEvery(actionTypes.users.EDIT, editUserFormSaga);
    yield takeEvery(actionTypes.users.SET_IMAGE_FILE, setUserImageFile);
    yield takeEvery(actionTypes.users.REQUEST_TYPES, getUserTypesSaga);
    yield takeEvery(actionTypes.users.CHANGE_FIELD_CONTENT, changeUserFieldValueSaga);
    yield takeEvery(actionTypes.users.SAVE, saveUserFormSaga);
    yield takeEvery(actionTypes.users.DELETE, requestUserRemoval);
    yield takeEvery(actionTypes.users.REQUEST_SELECT_LOCATIONS, requestAllLocationsSaga);
}

export function* watchUser() {
    yield takeEvery(actionTypes.user.REQUEST_FORM, userProfileFormSaga);
    yield takeEvery(actionTypes.user.SET_IMAGE_FILE, setUserProfileImageFile);
    yield takeEvery(actionTypes.user.CHANGE_FIELD_CONTENT, changeUserProfileFieldValueSaga);
    yield takeEvery(actionTypes.user.SAVE, saveUserProfileFormSaga);
}

export function* watchShop() {
    yield takeEvery(actionTypes.shop.ADD, addShopFormSaga);
    yield takeEvery(actionTypes.shop.EDIT, editShopFormSaga);
    yield takeEvery(actionTypes.shop.SET_IMAGE_FILE, setShopImageFileSaga);
    yield takeEvery(actionTypes.shop.CHANGE_FIELD_CONTENT, changeShopFieldValueSaga);
    yield takeEvery(actionTypes.shop.SAVE, saveShopFormSaga);
    yield takeEvery(actionTypes.shop.REQUEST_DATA, requestShopSaga);
}

export function* watchShops() {
    yield takeEvery(actionTypes.shops.DELETE, requestShopRemovalSaga);
    yield takeEvery(actionTypes.shops.REQUEST_ALL_ITEMS, requestShopsAllSaga);
}

export function* watchLocation() {
    yield takeEvery(actionTypes.location.ADD, addLocationFormSaga);
    yield takeEvery(actionTypes.location.EDIT, editLocationFormSaga);
    yield takeEvery(actionTypes.location.CHANGE_FIELD_CONTENT, changeLocationFieldValueSaga);
    yield takeEvery(actionTypes.location.ADD_IMAGE, addLocationFormImageSaga);
    yield takeEvery(actionTypes.location.REMOVE_IMAGE, removeLocationFormImageSaga);
    yield takeEvery(actionTypes.location.SET_DEFAULT_IMAGE, setLocationDefaultImage);
    yield takeEvery(actionTypes.location.SET_IMAGE_FILE, setLocationImageFile);
    yield takeEvery(actionTypes.location.SAVE, saveLocationSaga);
    yield takeEvery(actionTypes.location.SET_FROM_GPLACE, setFromGooglePlaceSaga);
    yield takeEvery(actionTypes.location.REQUEST_DATA, requestLocationSaga);
}

export function* watchLocations() {
    yield takeEvery(actionTypes.locations.REQUEST_ITEMS, requestLocationsSaga);
    yield takeEvery(actionTypes.locations.DELETE, requestLocationRemovalSaga);
}

export function* watchServiceTemplates() {
    yield takeEvery(actionTypes.serviceTemplates.REQUEST_ITEMS, requestServiceTemplatesSaga);
    yield takeEvery(actionTypes.serviceTemplates.DELETE, requestServiceTemplateRemovalSaga);
}

export function* watchServiceTemplate() {
    yield takeEvery(actionTypes.serviceTemplate.ADD, addServiceTemplateFormSaga);
    yield takeEvery(actionTypes.serviceTemplate.EDIT, editServiceTemplateFormSaga);
    yield takeEvery(actionTypes.serviceTemplate.CHANGE_FIELD_CONTENT, changeServiceTemplateFieldValueSaga);
    yield takeEvery(actionTypes.serviceTemplate.SAVE, saveServiceTemplateSaga);
}

export function* watchService() {
    yield takeEvery(actionTypes.service.ADD, addServiceFormSaga);
    yield takeEvery(actionTypes.service.EDIT, editServiceFormSaga);
    yield takeEvery(actionTypes.service.CHANGE_FIELD_CONTENT, changeServiceFieldValueSaga);
    yield takeEvery(actionTypes.service.SAVE, saveServiceSaga);
}

export function* watchServices() {
    yield takeEvery(actionTypes.services.REQUEST_TEMPLATES, requestTemplateItemsSaga);
    yield takeEvery(actionTypes.services.REQUEST_ITEMS, requestServicesSaga);
    yield takeEvery(actionTypes.services.DELETE, requestServiceRemovalSaga);
}

export function* rootSaga() {
    yield all([
        call(watchApplication),
        call(watchAuthentication),
        call(watchUsers),
        call(watchUser),
        call(watchShop),
        call(watchShops),
        call(watchLocation),
        call(watchLocations),
        call(watchServiceTemplates),
        call(watchServiceTemplate),
        call(watchService),
        call(watchServices),
    ]);
}
