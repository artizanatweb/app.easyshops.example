import { put, call, delay } from "redux-saga/effects";
import axios from "./../../utils/axios";
import * as storeActions from "./../actions";
import * as paths from "./../../utils/paths";
import UserObject from "./../../utils/UserObject";
import { createFormErrorsObject } from "./../../utils/utils";
import * as EmailValidator from "email-validator";
import Pages from "./../../utils/Pages";

export function* addUserFormSaga(action) {
    let form = action.form;

    if (0 === form?.id) {
        return;
    }

    yield put(storeActions.requestShopsSelect());
    yield put(storeActions.requestSelectLocations());

    yield put(storeActions.resetUserForm());
    let user = new UserObject();

    if (!form) {
        return yield put(storeActions.setUsersForm(user));
    }

    if (form?.id > 0) {
        return yield put(storeActions.setUsersForm(user));
    }
}

export function* editUserFormSaga(action) {
    let form = action.form;
    let requestId = action.id;

    if (form?.id === requestId) {
        return;
    }

    yield put(storeActions.requestShopsSelect());
    yield put(storeActions.requestSelectLocations());

    yield put(storeActions.resetUserForm());

    // request user object from API
    let responseObject = null;
    let isError = false;

    yield axios.get(paths.users.show(requestId))
        .then((response) => {
            responseObject = response.data;
        })
        .catch((error) => {
            responseObject = error.response;
            isError = true;
        });

    if (!responseObject?.success) {
        yield put(storeActions.usersActionsScreen(false));
        return yield put(storeActions.setMainMessage('error', "Server error!"));
    }

    if (isError) {
        yield put(storeActions.usersActionsScreen(false));
        return yield put(storeActions.setMainMessage('error', responseObject.message));
    }

    let userData = responseObject.data;
    let user = new UserObject();
    user.fill(userData);
    yield put(storeActions.setUsersForm(user));
}

export function* setUserImageFile(action) {
    const user = action.formObject;
    user.imageReader = action.reader;
    user.uploadFile = action.file;

    yield put(storeActions.setUsersForm(user));
}

export function* getUserTypesSaga(action) {
    if (action.storeTypes?.length > 0) {
        return;
    }

    // request userTypes collection from API
    let responseObject = null;
    let isError = false;

    yield axios.get(paths.users.types)
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

    let userTypes = responseObject.data;
    yield put(storeActions.setUserTypes(userTypes));
}

export function* changeUserFieldValueSaga(action) {
    let field = action.field;
    let content = action.content;

    if ("email" === field) {
        content = content.trim().replace(/[^a-z0-9.+@_-]/g, "").toLowerCase();
    }

    if ("phone" === field) {
        content = content.trim().replace(/[^0-9.+]/g, "");
    }

    if ("password" === field) {
        content = content.trim().replace(/\s+/g, "");
    }

    if (action.formErrors) {
        let errors = { ...action.formErrors };

        if (errors.hasOwnProperty(field)) {
            delete errors[field];
        }

        yield put(storeActions.setUserFormErrors(errors));
    }

    yield put(storeActions.setUserFieldContent(field, content));
}

function createUserFormData(action, actionType = "create") {
    const userForm = new FormData();
    userForm.append('id', action.form.id);
    userForm.append('name', action.form.name);
    userForm.append('surname', action.form.surname);
    userForm.append('email', action.form.email);
    if (action.form.password?.length > 0) {
        userForm.append('password', action.form.password);
    }
    userForm.append('user_type_id', action.form.user_type_id);
    userForm.append('phone', action.form.phone);
    userForm.append('about_me', action.form.about_me);
    let activeStatus = 0;
    if (true === action.form.active) {
        activeStatus = 1;
    }
    userForm.append('active', activeStatus);
    if (action.form?.uploadFile) {
        userForm.append('file', action.form.uploadFile);
    }

    if (2 === action.form.user_type_id) {
        userForm.append('shop_id', action.form.shop_id);
    }

    if (3 === action.form.user_type_id) {
        userForm.append('location_id', action.form.location_id);
    }

    if ("update" === actionType) {
        userForm.append('_method', "put");
    }

    return userForm;
}

export function* saveUserFormSaga(action) {
    yield put(storeActions.setUserSaving(true));

    let actionType = "create";
    let apiPath = paths.users.create;
    if (action.form?.id > 0) {
        actionType = "update";
        apiPath = paths.users.update(action.form.id);
    }

    const userForm = createUserFormData(action, actionType);

    let responseObject = null;
    let isError = false;

    yield axios.post(apiPath, userForm)
        .then((response) => {
            responseObject = response;
        })
        .catch((error) => {
            responseObject = error.response;
            isError = true;
        });

    yield call(userActionReceived, isError, responseObject, actionType);
}

function* userActionReceived(isError, responseObject, actionType = "create") {
    if (isError) {
        yield put(storeActions.setUserSaving(false));
        yield put(storeActions.setMainMessage('error', responseObject.data.message));

        if (responseObject.status !== 406) {
            const errorsObject = createFormErrorsObject(responseObject.data);
            yield put(storeActions.setUserFormErrors(errorsObject));
            yield put(storeActions.checkUserErrors(true));
        }

        return;
    }

    let successMessage = "User saved!";
    if ("update" === actionType) {
        successMessage = "User modified with success!";
    }

    yield put(storeActions.setUserSaved(true));
    yield put(storeActions.setMainMessage('success', successMessage));

    let page = Pages.getByCode('users');
    if (page?.api) {
        yield put(storeActions.requestPageContent(page));
    }

    yield delay(1000);
    yield put(storeActions.usersActionsScreen(false));
    // reset user form
    yield delay(500);
    yield put(storeActions.resetUserForm());
}

export function* requestUserRemoval(action) {
    yield put(storeActions.setUserRemoving(true));

    if (!(action.user?.id > 0)) {
        yield delay(500);
        return yield put(storeActions.setUserRemoving(false));
    }

    let responseObject = null;
    let isError = false;

    yield axios.delete(paths.users.delete(action.user.id))
        .then((response) => {
            responseObject = response;
        })
        .catch((error) => {
            responseObject = error.response;
            isError = true;
        });

    if (isError) {
        return yield call(userRemoveError, responseObject?.data?.message);
    }

    if (!responseObject?.data?.success) {
        return yield call(userRemoveError, responseObject?.data?.message);
    }

    yield call(userRemoveSuccess, "User removed!");

    // reload users
    let page = Pages.getByCode("users");
    if (page) {
        yield put(storeActions.requestPageContent(page));
    }

    yield delay(500);
    yield put(storeActions.closeUserDeleteDialog());
}

function* userRemoveError(message = null) {
    if (!message) {
        message = "Error encountered!"
    }

    yield put(storeActions.setMainMessage('error', message));
    yield put(storeActions.setUserRemoving(false));
}

function* userRemoveSuccess(message = null) {
    if (!message) {
        message = "Success!";
    }

    yield put(storeActions.setMainMessage('success', message));
}

export function* requestAllLocationsSaga() {
    // request locations collection from API
    let responseObject = null;
    let isError = false;

    yield axios.get(paths.locations.items)
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

    let locations = responseObject.data;
    yield put(storeActions.setSelectLocations(locations));
}
