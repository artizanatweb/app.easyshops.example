import { put, call, delay } from "redux-saga/effects";
import axios from "./../../utils/axios";
import * as storeActions from "./../actions";
import * as paths from "./../../utils/paths";
import Pages from "./../../utils/Pages";

export function* requestShopRemovalSaga(action) {
    yield put(storeActions.setShopRemoving(true));

    if (!(action.object?.id > 0)) {
        yield delay(500);
        return yield put(storeActions.setShopRemoving(false));
    }

    let responseObject = null;
    let isError = false;

    yield axios.delete(paths.shop.delete(action.object.id))
        .then((response) => {
            responseObject = response;
        })
        .catch((error) => {
            responseObject = error.response;
            isError = true;
        });

    if (isError) {
        return yield call(shopRemoveError, responseObject?.data?.message);
    }

    if (!responseObject?.data?.success) {
        return yield call(shopRemoveError, responseObject?.data?.message);
    }

    yield call(shopRemoveSuccess, "Shop removed!");

    // reload shops
    let page = Pages.getByCode("shops");
    if (page) {
        yield put(storeActions.requestPageContent(page));
    }

    yield delay(500);
    yield put(storeActions.closeShopDeleteDialog());
}

function* shopRemoveError(message = null) {
    if (!message) {
        message = "Error encountered!"
    }

    yield put(storeActions.setMainMessage('error', message));
    yield put(storeActions.setShopRemoving(false));
}

function* shopRemoveSuccess(message = null) {
    if (!message) {
        message = "Success!";
    }

    yield put(storeActions.setMainMessage('success', message));
}

export function* requestShopsAllSaga(action) {
    if (!action?.force) {
        if (action?.items?.length > 0) {
            return;
        }
    }

    // request shops collection from API
    let responseObject = null;
    let isError = false;

    yield axios.get(paths.shop.items)
        .then((response) => {
            responseObject = response.data;
        })
        .catch((error) => {
            responseObject = error.response;
            isError = true;
        });

    if (!responseObject?.success || isError) {
        // TODO say something ...
        return;
    }

    let shops = responseObject.data;
    yield put(storeActions.setAllItemsShops(shops));
}
