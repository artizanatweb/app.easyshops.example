import { put, call, delay } from "redux-saga/effects";
import axios from "./../../utils/axios";
import * as storeActions from "./../actions";
import * as paths from "./../../utils/paths";

export function* requestTemplateItemsSaga(action) {
    if (!(action.user?.shop_id > 0)) {
        return;
    }

    if (action.templates?.length > 0) {
        // it has templates
        return;
    }

    // request service templates collection from API
    let responseObject = null;
    let isError = false;

    yield axios.get(paths.serviceTemplates.items)
        .then((response) => {
            responseObject = response.data;
        })
        .catch((error) => {
            responseObject = error.response;
            isError = true;
        });

    if (!responseObject?.success || isError) {
        yield put(storeActions.setMainMessage('error', "Can't load templates!"));
        return;
    }

    let templates = responseObject.data;
    yield put(storeActions.setServiceTemplates(templates));
}

export function* requestServicesSaga(action) {
    let shopId = 0;
    if (action.user?.shop_id > 0) {
        shopId = action.user.shop_id;
    }

    if (1 === action.user?.type) {
        if (action.shop?.id > 0) {
            shopId = action.shop.id;
        }
    }

    if (!(shopId > 0)) {
        return;
    }

    yield put(storeActions.setApplicationLoading(true));

    // request service templates collection from API
    let responseObject = null;
    let isError = false;

    yield axios.get(paths.services.list(shopId))
        .then((response) => {
            responseObject = response.data;
        })
        .catch((error) => {
            responseObject = error.response;
            isError = true;
        });

    if (!responseObject?.success || isError) {
        // TODO say something ...
        yield put(storeActions.setMainMessage('error', responseObject.message));
        yield delay(500);
        yield put(storeActions.setApplicationLoading(false));
        return;
    }

    let services = responseObject.data;
    yield put(storeActions.setShopServices(services));

    yield delay(500);
    yield put(storeActions.setApplicationLoading(false));
}

export function* requestServiceRemovalSaga(action) {
    let shopId = 0;
    if (action.user?.shop_id > 0) {
        shopId = action.user.shop_id;
    }

    if (1 === action.user?.type) {
        if (action.shop?.id > 0) {
            shopId = action.shop.id;
        }
    }

    if (!(shopId > 0)) {
        return;
    }

    yield put(storeActions.setServiceRemoving(true));

    if (!(action.object?.id > 0)) {
        yield delay(500);
        return yield put(storeActions.setServiceRemoving(false));
    }

    let responseObject = null;
    let isError = false;

    yield axios.delete(paths.services.delete(shopId, action.object.id))
        .then((response) => {
            responseObject = response;
        })
        .catch((error) => {
            responseObject = error.response;
            isError = true;
        });

    if (isError) {
        return yield call(removeError, responseObject?.data?.message);
    }

    if (!responseObject?.data?.success) {
        return yield call(removeError, responseObject?.data?.message);
    }

    yield call(removeSuccess, responseObject?.data?.message);

    // reload service templates
    yield put(storeActions.requestServices());

    yield delay(500);
    yield put(storeActions.closeServiceDeleteDialog());
}

function* removeError(message = null) {
    if (!message) {
        message = "Error encountered!"
    }

    yield put(storeActions.setMainMessage('error', message));
    yield put(storeActions.setServiceRemoving(false));
}

function* removeSuccess(message = null) {
    if (!message) {
        message = "Success!";
    }

    yield put(storeActions.setMainMessage('success', message));
}
