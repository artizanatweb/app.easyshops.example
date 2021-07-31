import { put, call, delay } from "redux-saga/effects";
import axios from "./../../utils/axios";
import * as storeActions from "./../actions";
import * as paths from "./../../utils/paths";
import ServiceTemplateObject from "../../utils/ServiceTemplateObject";
import { createFormErrorsObject } from "./../../utils/utils";

export function* addServiceTemplateFormSaga(action) {
    let form = action.form;

    if (0 === form?.id) {
        return;
    }

    yield put(storeActions.resetServiceTemplate());
    let template = new ServiceTemplateObject();

    if (!form) {
        return yield put(storeActions.setFormTemplate(template));
    }

    if (form?.id > 0) {
        return yield put(storeActions.setFormTemplate(template));
    }
}

export function* editServiceTemplateFormSaga(action) {
    let form = action.form;
    let requestId = action.id;

    if (form?.id === requestId) {
        return;
    }

    yield put(storeActions.resetServiceTemplate());

    // request template object from API
    let responseObject = null;
    let isError = false;

    yield axios.get(paths.serviceTemplates.show(requestId))
        .then((response) => {
            responseObject = response.data;
        })
        .catch((error) => {
            responseObject = error.response;
            isError = true;
        });

    if (!responseObject?.success) {
        yield put(storeActions.closeServiceTemplateActionScreen());
        return yield put(storeActions.setMainMessage('error', "Server error!"));
    }

    if (isError) {
        yield put(storeActions.closeServiceTemplateActionScreen());
        return yield put(storeActions.setMainMessage('error', responseObject.message));
    }

    let template = new ServiceTemplateObject();
    template.fill(responseObject?.data)
    yield put(storeActions.setFormTemplate(template));
}

export function* changeServiceTemplateFieldValueSaga(action) {
    let field = action.field;
    let content = action.content;

    if ("duration" === field) {
        if (!(content > 0)) {
            content = 0;
        }

        if (content > 1440) {
            content = 1440;
        }

        if (content >= 1) {
            let durationStr = content.toString();
            if (durationStr.length > 1 && '0' === durationStr[0]) {
                content = content.replace(/^0+/, '');
            }
        }
    }

    if (action.formErrors) {
        let errors = { ...action.formErrors };

        if (errors.hasOwnProperty(field)) {
            delete errors[field];
        }
        yield put(storeActions.setTemplateFormErrors(errors));
    }

    yield put(storeActions.setTemplateFieldContent(field, content));
}

function createFormData(action, actionType = "create") {
    const itemForm = new FormData();
    itemForm.append('name', action.form.name);
    itemForm.append('duration', action.form.duration);

    if ("update" === actionType) {
        itemForm.append('_method', "put");
    }

    return itemForm;
}

export function* saveServiceTemplateSaga(action) {
    yield put(storeActions.setTemplateSaving(true));

    let actionType = "create";
    let apiPath = paths.serviceTemplates.create;
    if (action.form?.id > 0) {
        actionType = "update";
        apiPath = paths.serviceTemplates.update(action.form.id);
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
        yield put(storeActions.setTemplateSaving(false));
        yield put(storeActions.setMainMessage('error', responseObject?.data?.message));

        if (responseObject.status !== 406) {
            const errorsObject = createFormErrorsObject(responseObject.data);
            yield put(storeActions.setTemplateFormErrors(errorsObject));
            yield put(storeActions.checkTemplateErrors(true));
        }

        return;
    }

    yield put(storeActions.setTemplateSaved(true));
    yield put(storeActions.setMainMessage('success', responseObject?.data?.message));

    yield put(storeActions.requestServiceTemplates());

    yield delay(1000);
    yield put(storeActions.closeServiceTemplateActionScreen());

    // reset serviceTemplate form
    yield delay(500);
    yield put(storeActions.resetServiceTemplate());
}
