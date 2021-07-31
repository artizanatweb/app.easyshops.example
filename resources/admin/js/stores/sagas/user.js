import { put, call, delay } from "redux-saga/effects";
import axios from "./../../utils/axios";
import * as storeActions from "./../actions";
import * as paths from "./../../utils/paths";
import UserProfileObject from "./../../utils/UserProfileObject";
import { createFormErrorsObject } from "../../utils/utils";
import Pages from "../../utils/Pages";

export function* userProfileFormSaga(action) {
    if (action.form?.id > 0) {
        return;
    }

    // request user object from API
    let responseObject = null;
    let isError = false;

    yield axios.get(paths.user.show(action.data?.id))
        .then((response) => {
            responseObject = response.data;
        })
        .catch((error) => {
            responseObject = error.response;
            isError = true;
        });

    if (!responseObject?.success) {
        yield put(storeActions.closeEditProfileScreen());
        return yield put(storeActions.setMainMessage('error', "Server error!"));
    }

    if (isError) {
        yield put(storeActions.closeEditProfileScreen());
        return yield put(storeActions.setMainMessage('error', responseObject.message));
    }

    let userData = responseObject.data;
    const profile = new UserProfileObject();
    profile.fill(userData);
    yield put(storeActions.setUserProfileForm(profile));
}

export function* setUserProfileImageFile(action) {
    const user = action.formObject;
    user.imageReader = action.reader;
    user.uploadFile = action.file;

    yield put(storeActions.setUserProfileForm(user));
}

export function* changeUserProfileFieldValueSaga(action) {
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

        yield put(storeActions.setUserProfileFormErrors(errors));
    }

    yield put(storeActions.setUserProfileFieldContent(field, content));
}

function createFormData(action) {
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
    if (action.form?.uploadFile) {
        userForm.append('file', action.form.uploadFile);
    }
    userForm.append('_method', "put");

    return userForm;
}

export function* saveUserProfileFormSaga(action) {
    yield put(storeActions.setUserProfileSaving(true));

    let apiPath = paths.user.update(action.form?.id);
    const userForm = createFormData(action);

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

    yield call(actionReceived, isError, responseObject);
}

function* actionReceived(isError, responseObject) {
    if (isError) {
        yield put(storeActions.setUserProfileSaving(false));
        yield put(storeActions.setMainMessage('error', responseObject.data.message));

        if (responseObject.status !== 406) {
            const errorsObject = createFormErrorsObject(responseObject.data);
            yield put(storeActions.setUserProfileFormErrors(errorsObject));
            yield put(storeActions.checkUserProfileErrors(true));
        }

        return;
    }

    let successMessage = "Profile modified with success!";

    yield put(storeActions.setUserSaved(true));
    yield put(storeActions.setMainMessage('success', successMessage));

    let page = Pages.getByCode('profile');
    if (page?.api) {
        yield put(storeActions.requestPageContent(page));
    }

    yield delay(1000);
    yield put(storeActions.closeEditProfileScreen());
    // reset user form
    yield delay(500);
    yield put(storeActions.resetUserProfileForm());
}
