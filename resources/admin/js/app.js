require('./bootstrap');

import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";
import thunk from "redux-thunk";
import { createStore, applyMiddleware, combineReducers } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import "./../sass/app.scss";
import App from "./containers/App";
import applicationReducer from "./stores/reducers/application";
import authenticationReducer from "./stores/reducers/authentication";
import mainMessageReducer from "./stores/reducers/mainMessage";
import menuReducer from "./stores/reducers/menu";
import usersReducer from "./stores/reducers/users";
import userReducer from "./stores/reducers/user";
import shopsReducer from "./stores/reducers/shops";
import shopReducer from "./stores/reducers/shop";
import locationsReducer from "./stores/reducers/locations";
import locationReducer from "./stores/reducers/location";
import serviceTemplatesReducer from "./stores/reducers/serviceTemplates";
import serviceTemplateReducer from "./stores/reducers/serviceTemplate";
import servicesReducer from "./stores/reducers/services";
import serviceReducer from "./stores/reducers/service";
import { rootSaga } from "./stores/sagas";
import APIClient from "./utils/APIClient";
import "./i18n";

const rootReducer = combineReducers({
    application: applicationReducer,
    authentication: authenticationReducer,
    mainMessage: mainMessageReducer,
    menu: menuReducer,
    users: usersReducer,
    user: userReducer,
    shops: shopsReducer,
    shop: shopReducer,
    locations: locationsReducer,
    location: locationReducer,
    serviceTemplates: serviceTemplatesReducer,
    serviceTemplate: serviceTemplateReducer,
    services: servicesReducer,
    service: serviceReducer,
});

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, applyMiddleware(thunk, sagaMiddleware));
APIClient.setStore(store);

sagaMiddleware.run(rootSaga);

const app = (
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
);

if (document.getElementById("adminApp")) {
    ReactDOM.render(app, document.getElementById("adminApp"));
}
