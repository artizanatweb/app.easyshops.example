import axios from "axios";
import * as paths from "./paths";
import RefreshTokenRequestObject from "./RefreshTokenRequestObject";
import * as storeActions from "./../stores/actions";
import AuthObject from "./AuthObject";

class APIClient {
    constructor() {
        this.authObject = null;
        this.nextRefresh = 0;
        this.tokenSetTime = 0;

        this.axiosInstance = axios.create();

        this.store = null;

        this.requestsQueue = [];
        this.isAlreadyFetchingAccessToken = false;
    }

    init() {
        if (!this.store) {
            return;
        }

        this.startResponseInterceptors();
    }

    setStore(store) {
        this.store = store;

        this.init();
    }

    startResponseInterceptors() {
        this.axiosInstance.interceptors.response.use(
            response => {
                return response;
            },
            error => {
                const errorResponse = error.response;
                if (this.isTokenExpiredError(errorResponse)) {
                    return this.resetTokenAndReattemptRequest(error);
                }

                return Promise.reject(error);
            }
        );
    }

    isTokenExpiredError(errorResponse) {
        if (!(401 === errorResponse.status)) {
            return false;
        }

        if (!("Unauthenticated." === errorResponse.data.message)) {
            return false;
        }

        return true;
    }

    async resetTokenAndReattemptRequest(error) {
        if (!this.authObject) {
            return Promise.reject(error);
        }

        const self = this;

        try {
            const { response: errorResponse }  = error;
            const refreshToken = this.authObject.refresh_token;

            const retryOriginalRequest = new Promise( resolve => {
                self.addToQueue(newAuthorization => {
                    errorResponse.config.headers.Authorization = newAuthorization;
                    resolve(axios(errorResponse.config));
                });
            });

            if (!this.isAlreadyFetchingAccessToken) {
                this.isAlreadyFetchingAccessToken = true;

                const authRequestObj = new RefreshTokenRequestObject(refreshToken);
                const response = await axios.post(paths.authentication.token, authRequestObj);

                if (!response.data) {
                    return Promise.reject(error);
                }
                if (!this.setFromResponse(response.data)) {
                    return Promise.reject(error);
                }

                this.isAlreadyFetchingAccessToken = false;
                let newAuthorization = `${this.authObject.token_type} ${this.authObject.access_token}`;
                this.resolveRequestsQueue(newAuthorization);
            }

            return retryOriginalRequest;
        } catch (e) {
            if (this.store) {
                this.store.dispatch(storeActions.logoutAuthUser());
            }

            return Promise.reject(e);
        }
    }

    addToQueue(callback) {
        this.requestsQueue.push(callback);
    }

    resolveRequestsQueue(newAuthorization) {
        this.requestsQueue.forEach(callback => callback(newAuthorization));
        this.requestsQueue = [];
    }

    setFromResponse(jsonResponse) {
        if (!jsonResponse.hasOwnProperty("access_token")) {
            return false;
        }

        if (!jsonResponse.hasOwnProperty("expires_in")) {
            return false;
        }

        if (!jsonResponse.hasOwnProperty("refresh_token")) {
            return false;
        }

        if (!jsonResponse.hasOwnProperty("token_type")) {
            return false;
        }

        const authObject = new AuthObject();

        authObject.access_token = jsonResponse.access_token;

        authObject.expires_in = parseInt(jsonResponse.expires_in);

        authObject.refresh_token = jsonResponse.refresh_token;

        authObject.token_type = jsonResponse.token_type;

        this.nextRefresh = authObject.expires_in * 1000;
        this.tokenSetTime = Date.now();

        this.authObject = authObject;

        try {
            this.saveToStorage();
        } catch (e) {
            console.log(e);
        }

        this.axiosInstance.defaults.headers.common['Authorization'] = `${this.authObject.token_type} ${this.authObject.access_token}`;

        return true;
    }

    getInstance() {
        return this.axiosInstance;
    }

    saveToStorage() {
        const state = this.store.getState();
        if (!state.authentication.remember) {
            this.forceClearStorage();
            return;
        }

        if (!this.authObject) {
            throw new Error("AuthObject is null!");
        }

        for (const [field, value] of Object.entries(this.authObject)) {
            localStorage.setItem(field, value);
        }

    }

    clearStorage() {
        this.nextRefresh = 0;
        this.tokenSetTime = 0;

        if (!this.authObject) {
            throw new Error("AuthObject is null!");
        }

        Object.keys(this.authObject).forEach((field) => {
            localStorage.removeItem(field);
        });

        this.authObject = null;
    }

    forceClearStorage() {
        let authObject = new AuthObject();

        Object.keys(authObject).forEach((field) => {
            localStorage.removeItem(field);
        });
    }

    loadFromStorage() {
        const authObject = new AuthObject();

        let webStorageValid = true;
        for (let field of Object.keys(authObject)) {
            if (null === localStorage.getItem(field)) {
                console.log(`[${field}] not found in webStorage!`);
                webStorageValid = false;
                break;
            }

            authObject[field] = localStorage.getItem(field);
        }

        if (!webStorageValid) {
            return false;
        }

        this.authObject = authObject;

        this.store.dispatch(storeActions.loginRememberMe(true));

        return true;
    }
}

export default new APIClient();
