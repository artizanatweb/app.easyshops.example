import { put, call, delay } from "redux-saga/effects";
import axios from "./../../utils/axios";
import * as storeActions from "./../actions";
import * as paths from "./../../utils/paths";
import Pages from "../../utils/Pages";

export function* requestServiceTemplatesSaga(action) {
    yield put(storeActions.setApplicationLoading(true));

    // request service templates collection from API
    let responseObject = null;
    let isError = false;

    yield axios.get(paths.serviceTemplates.list)
        .then((response) => {
            responseObject = response.data;
        })
        .catch((error) => {
            responseObject = error.response;
            isError = true;
        });

    if (!responseObject?.success || isError) {
        // TODO say something ...
        yield put(storeActions.setMainMessage('error', "Nașpa, aiurea, cam nasol!"));
        yield delay(500);
        yield put(storeActions.setApplicationLoading(false));
        return;
    }

    let templates = responseObject.data;
    yield put(storeActions.setServiceTemplates(templates));

    yield delay(500);
    yield put(storeActions.setApplicationLoading(false));
}

export function* requestServiceTemplateRemovalSaga(action) {
    yield put(storeActions.setServiceTemplateRemoving(true));

    if (!(action.object?.id > 0)) {
        yield delay(500);
        return yield put(storeActions.setServiceTemplateRemoving(false));
    }

    let responseObject = null;
    let isError = false;

    yield axios.delete(paths.serviceTemplates.delete(action.object.id))
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
    yield put(storeActions.requestServiceTemplates());

    yield delay(500);
    yield put(storeActions.closeTemplateDeleteDialog());
}

function* removeError(message = null) {
    if (!message) {
        message = "Error encountered!"
    }

    yield put(storeActions.setMainMessage('error', message));
    yield put(storeActions.setServiceTemplateRemoving(false));
}

function* removeSuccess(message = null) {
    if (!message) {
        message = "Success!";
    }

    yield put(storeActions.setMainMessage('success', message));
}
