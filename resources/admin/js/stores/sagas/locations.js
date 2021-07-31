import { put, call, delay } from "redux-saga/effects";
import axios from "./../../utils/axios";
import * as storeActions from "./../actions";
import * as paths from "./../../utils/paths";
import Pages from "../../utils/Pages";

export function* requestLocationsSaga(action) {
    yield put(storeActions.locationsLoading(true));

    if (!action?.shopId) {
        yield put(storeActions.locationsLoading(false));
        return yield put(storeActions.setMainMessage('error', 'Shop is missing!'));
    }

    let apiPath = paths.locations.list(action.shopId);

    let responseData = null;
    let responseError = false;

    yield axios.get(apiPath)
        .then((response) => {
            responseData = response.data;
        })
        .catch((error) => {
            responseData = error.response;
            responseError = true;
        });

    if (responseError) {
        yield put(storeActions.locationsLoading(false));
        return yield put(storeActions.shopDataError(responseData?.data?.message));
    }

    if (!responseData.success || !responseData.hasOwnProperty("data")) {
        yield put(storeActions.locationsLoading(false));
        return yield put(storeActions.setMainMessage('error', 'Page content response error!'));
    }

    yield put(storeActions.setLocations(responseData.data));
    yield delay(500);
    yield put(storeActions.locationsLoading(false));
}

export function* requestLocationRemovalSaga(action) {
    yield put(storeActions.setLocationRemoving(true));

    if (!(action.shop?.id > 0)) {
        yield delay(500);
        return yield put(storeActions.setLocationRemoving(false));
    }

    if (!(action.object?.id > 0)) {
        yield delay(500);
        return yield put(storeActions.setLocationRemoving(false));
    }

    let responseObject = null;
    let isError = false;

    yield axios.delete(paths.locations.delete(action.shop.id, action.object.id))
        .then((response) => {
            responseObject = response;
        })
        .catch((error) => {
            responseObject = error.response;
            isError = true;
        });

    if (isError) {
        yield put(storeActions.setLocationRemoving(false));
        return yield call(locationRemoveError, responseObject?.data?.message);
    }

    if (!responseObject?.data?.success) {
        yield put(storeActions.setLocationRemoving(false));
        return yield call(locationRemoveError, responseObject?.data?.message);
    }

    yield call(locationRemoveSuccess, "Shop location removed!");

    // reload locations
    yield put(storeActions.requestLocations(action.shop.id));

    yield delay(500);
    yield put(storeActions.closeLocationDeleteDialog());
}

function* locationRemoveError(message = null) {
    if (!message) {
        message = "Error encountered!"
    }

    yield put(storeActions.setMainMessage('error', message));
    yield put(storeActions.setLocationRemoving(false));
}

function* locationRemoveSuccess(message = null) {
    if (!message) {
        message = "Success!";
    }

    yield put(storeActions.setMainMessage('success', message));
}
