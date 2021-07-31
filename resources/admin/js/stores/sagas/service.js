import { put, call, delay } from "redux-saga/effects";
import axios from "./../../utils/axios";
import * as storeActions from "./../actions";
import * as paths from "./../../utils/paths";
import ServiceObject from "../../utils/ServiceObject";
import { createFormErrorsObject } from "./../../utils/utils";

export function* addServiceFormSaga(action) {
    let form = action.form;

    if (0 === form?.id) {
        return;
    }

    yield put(storeActions.resetService());
    let service = new ServiceObject();

    if (!form) {
        return yield put(storeActions.setFormService(service));
    }

    if (form?.id > 0) {
        return yield put(storeActions.setFormService(service));
    }
}

export function* editServiceFormSaga(action) {
    let form = action.form;
    let requestId = action.id;
    let shopId = action.shop?.id;

    if (form?.id === requestId) {
        return;
    }

    if (!shopId) {
        return;
    }

    yield put(storeActions.resetService());

    // request template object from API
    let responseObject = null;
    let isError = false;

    yield axios.get(paths.services.show(shopId,requestId))
        .then((response) => {
            responseObject = response.data;
        })
        .catch((error) => {
            responseObject = error.response;
            isError = true;
        });

    if (!responseObject?.success) {
        yield put(storeActions.closeServiceActionScreen());
        return yield put(storeActions.setMainMessage('error', "Server error!"));
    }

    if (isError) {
        yield put(storeActions.closeServiceActionScreen());
        return yield put(storeActions.setMainMessage('error', responseObject.message));
    }

    let service = new ServiceObject();
    service.fill(responseObject?.data)
    yield put(storeActions.setFormService(service));

    yield put(storeActions.serviceFieldOverwrite("name"));
    yield put(storeActions.serviceFieldOverwrite("duration"));
}

export function* changeServiceFieldValueSaga(action) {
    let field = action.field;
    let content = action.content;

    if ("service_template_id" === field && content > 0) {
        let template = action.templates.find(item => item.id === content);
        if (template) {
            if (action.overwrite.name) {
                yield put(storeActions.setServiceFieldContent("name", template.name));
            }
            if (action.overwrite.duration) {
                yield put(storeActions.setServiceFieldContent("duration", template.duration));
            }
        }
    }

    if ("duration" === field) {
        if (!(content > 0)) {
            content = 0;
        }

        if (content > 1440) {
            content = 1440;
        }

        yield put(storeActions.serviceFieldOverwrite(field));
    }

    if ("price" === field) {
        if (!(content > 0)) {
            content = 0.0;
        }

        if (content > 99999.9) {
            content = 99999.9;
        }
    }

    if (["duration","price"].includes(field)) {
        if (content >= 1) {
            let durationStr = content.toString();
            if (durationStr.length > 1 && '0' === durationStr[0]) {
                content = content.replace(/^0+/, '');
            }
        }
    }

    if ("name" === field) {
        yield put(storeActions.serviceFieldOverwrite(field));
    }

    if (action.formErrors) {
        let errors = { ...action.formErrors };

        if (errors.hasOwnProperty(field)) {
            delete errors[field];
        }
        yield put(storeActions.setServiceFormErrors(errors));
    }

    yield put(storeActions.setServiceFieldContent(field, content));
}

function createFormData(action, actionType = "create") {
    const itemForm = new FormData();
    itemForm.append('service_template_id', action.form.service_template_id);
    itemForm.append('name', action.form.name);
    itemForm.append('duration', action.form.duration);
    itemForm.append('price', action.form.price);
    itemForm.append('description', action.form.description);

    if ("update" === actionType) {
        itemForm.append('_method', "put");
    }

    return itemForm;
}

export function* saveServiceSaga(action) {
    yield put(storeActions.setServiceSaving(true));

    let shopId = 0;
    if (action.user?.shop_id > 0) {
        shopId = action.user.shop_id;
    }

    console.log(action.user.type);
    if (1 === action.user?.type) {
        if (action.shop?.id > 0) {
            shopId = action.shop.id;
        }
    }

    if (!(shopId > 0)) {
        yield put(storeActions.setServiceSaving(false));
        return;
    }

    let actionType = "create";
    let apiPath = paths.services.create(shopId);
    if (action.form?.id > 0) {
        actionType = "update";
        apiPath = paths.services.update(shopId, action.form.id);
    }

    const formData = createFormData(action, actionType);

    let responseObject = null;
    let isError = false;

    yield axios.post(apiPath, formData)
        .then((response) => {
            responseObject = response;
        })
        .catch((error) => {
            responseObject = error.response;
            isError = true;
        });

    yield call(responseActionReceived, isError, responseObject, actionType);
}

function* responseActionReceived(isError, responseObject, actionType = "create") {
    if (isError) {
        yield put(storeActions.setServiceSaving(false));
        yield put(storeActions.setMainMessage('error', responseObject?.data?.message));

        if (responseObject.status !== 406) {
            const errorsObject = createFormErrorsObject(responseObject.data);
            yield put(storeActions.setServiceFormErrors(errorsObject));
            yield put(storeActions.checkServiceErrors(true));
        }

        return;
    }

    yield put(storeActions.setServiceSaved(true));
    yield put(storeActions.setMainMessage('success', responseObject?.data?.message));

    yield put(storeActions.requestServices());

    yield delay(1000);
    yield put(storeActions.closeServiceActionScreen());

    // reset serviceTemplate form
    yield delay(500);
    yield put(storeActions.resetService());
}
