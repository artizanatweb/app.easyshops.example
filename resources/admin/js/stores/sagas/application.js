import { put, delay } from "redux-saga/effects";
import * as storeActions from "./../actions";
import axios from "./../../utils/axios";
import Pages from "./../../utils/Pages";

export function* hideDummyLoader(action) {
    if (!document.getElementById('loader')) {
        return;
    }

    let loaderElement = document.getElementById('loader');

    if (!action.show) {
        loaderElement.classList.remove('hide');
        loaderElement.style.display = 'flex';
        return loaderElement.classList.add('show');
    }

    loaderElement.classList.remove('show');
    // inject hide into class attribute
    loaderElement.classList.add('hide');
    setTimeout(() => {
        loaderElement.style.display = 'none';
    }, 500);

    yield delay(1000);
    yield put(storeActions.riseAppLogo(true));
}

// page content is obtain with GET request
export function* requestPageContent(action) {
    const page = action.page;

    let apiPath = page.api;
    if (!apiPath) {
        yield put(storeActions.setApplicationLoading(false));
        return;
    }

    yield put(storeActions.setApplicationLoading(true));
    console.log(`[APPLICATION] Page content from: ${apiPath}`);

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

    yield put(storeActions.setApplicationLoading(false));
    if (responseError) {
        if (["shop","shopDetails"].includes(page.code)) {
            return yield put(storeActions.shopDataError(responseData?.data?.message));
        }

        if (responseData?.data?.message?.length > 5) {
            return yield put(storeActions.setMainMessage('error', responseData?.data?.message));
        }

        return yield put(storeActions.setMainMessage('error', 'Page content response error!'));
    }

    if (!responseData.success || !responseData.hasOwnProperty("data")) {
        return yield put(storeActions.setMainMessage('error', 'Page content response error!'));
    }

    if ("users" === page.code) {
        return yield put(storeActions.setUsers(responseData));
    }

    if (["user","profile"].includes(page.code)) {
        return yield put(storeActions.setUser(responseData?.data));
    }

    if ("shops" === page.code) {
        return yield put(storeActions.setShops(responseData));
    }

    if (["shop","shopDetails"].includes(page.code)) {
        const shopDetails = responseData?.data;
        if (shopDetails.hasOwnProperty("locations")) {
            yield put(storeActions.setLocations(shopDetails.locations));
            delete shopDetails.locations;
        }

        return yield put(storeActions.setShop(shopDetails));
    }

    if ("serviceTemplates" === page.code) {
        const serviceTemplates = responseData?.data;
        return yield put(storeActions.setServiceTemplates(serviceTemplates));
    }

    if ("services" === page.code) {
        const services = responseData?.data;
        yield put(storeActions.setShopServices(services));
        return yield put(storeActions.requestTemplateItems());
    }
}

export function* clearApplicationSaga() {
    // yield put(storeActions.setUser(null));
    yield put(storeActions.setActualPage(null));
    yield put(storeActions.resetUsersModule());
    yield put(storeActions.resetUserProfile());
    yield put(storeActions.clearShops());
    yield put(storeActions.clearShop());
    yield put(storeActions.clearServiceTemplates());
    yield put(storeActions.clearServiceTemplates());
    Pages.reset();
    yield delay(500);
    yield put(storeActions.showApplication(true));
}
