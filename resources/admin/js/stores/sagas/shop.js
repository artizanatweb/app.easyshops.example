import { put, call, delay } from "redux-saga/effects";
import axios from "./../../utils/axios";
import * as storeActions from "./../actions";
import * as paths from "./../../utils/paths";
import ShopObject from "../../utils/ShopObject";
import { createFormErrorsObject, makeCode } from "./../../utils/utils";
import Pages from "./../../utils/Pages";

export function* addShopFormSaga(action) {
    let form = action.form;

    if (0 === form?.id) {
        return;
    }

    yield put(storeActions.resetShop());
    let shop = new ShopObject();

    if (!form) {
        return yield put(storeActions.setFormShop(shop));
    }

    if (form?.id > 0) {
        return yield put(storeActions.setFormShop(shop));
    }
}

export function* editShopFormSaga(action) {
    let form = action.form;
    let requestId = action.id;

    if (form?.id === requestId) {
        return;
    }

    yield put(storeActions.resetShop());

    // request api
    let requestApiPath = paths.shop.show(requestId);
    if (action?.user && action.user?.shop_id > 0) {
        requestApiPath = paths.shop.get(action.user.shop_id);
    }

    // request shop object from API
    let responseObject = null;
    let isError = false;

    yield axios.get(requestApiPath)
        .then((response) => {
            responseObject = response.data;
        })
        .catch((error) => {
            responseObject = error.response;
            isError = true;
        });

    if (!responseObject?.success) {
        yield put(storeActions.closeShopActionScreen());
        return yield put(storeActions.setMainMessage('error', "Server error!"));
    }

    if (isError) {
        yield put(storeActions.closeShopActionScreen());
        return yield put(storeActions.setMainMessage('error', responseObject.message));
    }

    let shopData = responseObject.data;
    let shop = new ShopObject();
    shop.fill(shopData);
    yield put(storeActions.setFormShop(shop));
}

export function* setShopImageFileSaga(action) {
    const shop = action.formObject;
    shop.imageReader = action.reader;
    shop.uploadFile = action.file;

    yield put(storeActions.setFormShop(shop));
}

export function* changeShopFieldValueSaga(action) {
    let field = action.field;
    let content = action.content;

    if ("name" === field) {
        let slug = makeCode(content);
        yield put(storeActions.setShopFieldContent('slug', slug));
    }

    if (action.formErrors) {
        let errors = { ...action.formErrors };
        if ("name" === field) {
            if (errors.hasOwnProperty("slug")) {
                delete errors.slug;
            }
        }
        if (errors.hasOwnProperty(field)) {
            delete errors[field];
        }
        yield put(storeActions.setShopFormErrors(errors));
    }

    yield put(storeActions.setShopFieldContent(field, content));
}

function createShopFormData(action, actionType = "create") {
    const shopForm = new FormData();
    shopForm.append('id', action.form.id);
    shopForm.append('slug', action.form.slug);
    shopForm.append('name', action.form.name);
    shopForm.append('description', action.form.description);
    let activeStatus = 0;
    if (true === action.form.active) {
        activeStatus = 1;
    }
    shopForm.append('active', activeStatus);
    if (action.form?.uploadFile) {
        shopForm.append('file', action.form.uploadFile);
    }

    if ("update" === actionType) {
        shopForm.append('_method', "put");
    }

    return shopForm;
}

export function* saveShopFormSaga(action) {
    yield put(storeActions.setShopSaving(true));

    let actionType, apiPath = "";
    let superAdmin = false;
    if (action.user?.type === 1) {
        superAdmin = true;
    }
    action.superAdmin = superAdmin;

    if (superAdmin) {
        actionType = "create";
        apiPath = paths.shop.create;
        if (action.form?.id > 0) {
            actionType = "update";
            apiPath = paths.shop.update(action.form.id);
        }
    }

    if (!superAdmin) {
        if (!(action.form?.id > 0)) {
            yield put(storeActions.setShopSaving(false));
            return yield put(storeActions.setMainMessage('error', "Not allowed!"));
        }

        actionType = "update";
        apiPath = paths.shop.get(action.form.id);
    }

    const shopForm = createShopFormData(action, actionType);

    let responseObject = null;
    let isError = false;

    yield axios.post(apiPath, shopForm)
        .then((response) => {
            responseObject = response;
        })
        .catch((error) => {
            responseObject = error.response;
            isError = true;
        });

    yield call(shopActionReceived, isError, responseObject, actionType, action);
}

function* shopActionReceived(isError, responseObject, actionType = "create", action) {
    if (isError) {
        yield put(storeActions.setShopSaving(false));
        yield put(storeActions.setMainMessage('error', responseObject.data.message));

        if (responseObject.status !== 406) {
            const errorsObject = createFormErrorsObject(responseObject.data);
            yield put(storeActions.setShopFormErrors(errorsObject));
            yield put(storeActions.checkShopErrors(true));
        }

        return;
    }

    let successMessage = "Shop saved!";
    if ("update" === actionType) {
        successMessage = "Shop modified with success!";
    }

    yield put(storeActions.setShopSaved(true));
    yield put(storeActions.setMainMessage('success', successMessage));

    if (!action.superAdmin) {
        yield delay(200);
        yield call(requestShopSaga, { id: action.form?.id }, false);
        yield delay(300);
        yield put(storeActions.closeShopActionScreen());
        yield delay(500);
        yield put(storeActions.resetShop());
        return;
    }

    let page = Pages.getByCode('shops');
    if (page?.api) {
        yield put(storeActions.requestPageContent(page));
    }

    yield delay(1000);
    yield put(storeActions.closeShopActionScreen());

    // update shops all items
    yield put(storeActions.requestShopsSelect(true));
    // reset user form
    yield delay(500);
    yield put(storeActions.resetShop());
}

export function* requestShopSaga(action, loading = true) {
    if (loading) {
        yield put(storeActions.setApplicationLoading(true));
    }

    // request shop object from API
    let responseObject = null;
    let isError = false;

    yield axios.get(paths.shop.user(action.id))
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

    let shopData = responseObject.data;

    if (shopData.hasOwnProperty("locations")) {
        yield put(storeActions.setLocations(shopData.locations));
        delete shopData.locations;
    }

    let shop = new ShopObject();
    shop.fill(shopData);
    yield put(storeActions.setShop(shop));

    if (loading) {
        yield put(storeActions.setApplicationLoading(false));
    }
}
