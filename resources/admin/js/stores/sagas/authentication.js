import { put, call, delay } from "redux-saga/effects";
import * as EmailValidator from "email-validator";
import axios from "axios";
import * as storeActions from "./../actions";
import AuthenticationRequestObject from "./../../utils/AuthenticationRequestObject";
import * as paths from "./../../utils/paths";
import APIClient from "./../../utils/APIClient";
import AuthUser from "./../../utils/AuthUser";
import RefreshTokenRequestObject from "./../../utils/RefreshTokenRequestObject";


const passwordMinLength = parseInt(process.env.MIX_ADMIN_MIN_PASSWORD_LENGTH);

export function* authEmailChangedSaga(action) {
    let email = action.email.replace(/[^a-z0-9.+@_-]/g, "");
    yield put(storeActions.authSetEmail(email));

    if (!action?.invalidEmail) {
        return;
    }

    yield validEmail(email);
}

export function* authPasswordChangedSaga(action) {
    let password = action.password.trim();
    yield put(storeActions.authSetPassword(password));

    if (!action?.invalidPassword) {
        return;
    }

    yield validPassword(password);
}

export function* validEmail(email, auth = false) {
    if (!(email.length > 6)) {
        if (auth) {
            yield call(showValidationError, 'Email address is not valid!', 'email');
        }
        return false;
    }

    let validEmail = EmailValidator.validate(email);
    if (!validEmail) {
        if (auth) {
            yield call(showValidationError, 'Email address is not valid!', 'email');
        }
        return false;
    }

    yield put(storeActions.validAuthEmail(true));
    return true;
}

export function* validPassword(password, auth = false) {
    if (!(password.length >= passwordMinLength)) {
        if (auth) {
            yield call(showValidationError, 'Password is not valid!', 'password');
        }
        return false;
    }

    yield put(storeActions.validAuthPassword(true));
    return true;
}

export function* requestAuthenticationSaga(action) {
    let credentials = action.credentials;

    let email = (credentials.hasOwnProperty('email')) ? credentials.email : "";
    let password = (credentials.hasOwnProperty('password')) ? credentials.password : "";

    let emailValidation = yield validEmail(email, true);
    if (!emailValidation) {
        return;
    }

    let passwordValidation = yield validPassword(password, true);
    if (!passwordValidation) {
        return;
    }

    // hide main message
    yield put(storeActions.hideMainMessage());

    // send request to server
    const authRequestObj = new AuthenticationRequestObject(email, password);
    yield call(requestTokenSaga, authRequestObj);
}

function* showValidationError(message, type = 'email') {
    if ('email' === type) {
        yield put(storeActions.validAuthEmail());
    }

    if ('password' === type) {
        yield put(storeActions.validAuthPassword());
    }

    yield put(storeActions.setMainMessage('error', message));
    yield delay(500);
    yield put(storeActions.validatingUserRequest());
};

export function* requestTokenSaga(authRequestObj) {
    let loginError = false;
    let success = false;

    yield axios.post(paths.authentication.token, authRequestObj)
        .then((response) =>{
            success = APIClient.setFromResponse(response.data);
        })
        .catch((error) => {
            console.log("ERROR");
            console.log(error);
            loginError = true;
        });

    if (loginError) {
        return yield call(showValidationError, 'Incorrect email or password!', 'email');
    }

    if (!success) {
        return yield call(showValidationError, 'Login request failed!', 'email');
    }

    yield call(loginSuccessSaga);
};

function* showSuccessMessage(message) {
    yield put(storeActions.setMainMessage('success', message));
    yield put(storeActions.validatingUserRequest());
}

function* loginSuccessSaga() {
    const axios = APIClient.getInstance();

    let userError = false;
    let successUser = false;
    let responseData = null;

    // request authenticated user object -- to get user name
    yield axios.get(paths.authentication.user)
        .then((response) => {
            responseData = response;
            if (response.hasOwnProperty('data')) {
                successUser = AuthUser.set(response.data);
            }
        })
        .catch((error) => {
            userError = true;
            responseData = error.response;
        });

    if (403 === responseData.status) {
        APIClient.forceClearStorage();
        return yield call(showValidationError, responseData.data.message, 'email');
    }

    if (userError) {
        return yield call(showValidationError, 'User error encountered!', 'email');
    }

    if (!successUser) {
        return yield call(showValidationError, 'User not allowed!', 'email');
    }

    yield put(storeActions.setAuthUser(AuthUser));

    // success message
    yield call(showSuccessMessage, `Hello ${AuthUser.name}, Welcome Back!`);

    yield put(storeActions.showLoginForm(false));
    yield delay(500);
    yield put(storeActions.riseAppLogo(false));

    if (2 === AuthUser.type && AuthUser?.shop_id > 0) {
        // request salon details
        yield put(storeActions.requestShopData(AuthUser.shop_id));
    }

    yield delay(2000);

    // hide login screen
    yield put(storeActions.openLoginScreen(false));

    yield delay(500);
    yield put(storeActions.hideMainMessage());
}

export function* logoutSaga() {
    try {
        yield APIClient.clearStorage();
    } catch (e) {
        console.log(e);
    }
}

export function* refreshTokenSaga() {
    if (!APIClient.loadFromStorage()) {
        return yield call(showLogin);
    }

    yield put(storeActions.refreshingAuthToken(true));

    let authError = false;
    let success = false;

    const authRequestObj = new RefreshTokenRequestObject(APIClient.authObject.refresh_token);
    yield axios.post(paths.authentication.token, authRequestObj)
        .then((response) =>{
            success = APIClient.setFromResponse(response.data);
        })
        .catch((error) => {
            authError = true;
        });


    if (!success) {
        yield put(storeActions.refreshingAuthToken());
        yield call(showLogin);
        yield put(storeActions.showApplication());
        return;
    }

    const authAxios = APIClient.getInstance();

    let userError = false;
    let successUser = false;

    // request authenticated user object -- to get user name
    yield authAxios.get(paths.authentication.user)
        .then((response) => {
            if (response.hasOwnProperty('data')) {
                successUser = AuthUser.set(response.data);
            }
        })
        .catch((error) => {
            userError = true;
        });

    yield put(storeActions.refreshingAuthToken(false));
    yield put(storeActions.showApplication());

    if (userError || !successUser) {
        yield put(storeActions.refreshingAuthToken());
        yield call(showLogin);
        yield put(storeActions.showApplication());
        return;
    }

    yield put(storeActions.setAuthUser(AuthUser));

    if (2 === AuthUser.type && AuthUser?.shop_id > 0) {
        // request shop details
        yield put(storeActions.requestShopData(AuthUser.shop_id));
    }

    // success message
    yield call(showSuccessMessage, `Hello ${AuthUser.name}, Welcome Back!`);
}

function* showLogin() {
    yield put(storeActions.openLoginScreen(true));
}
