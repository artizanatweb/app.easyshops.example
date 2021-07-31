import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CssBaseline, useMediaQuery } from "@material-ui/core";
import { createTheme, MuiThemeProvider } from "@material-ui/core/styles";
import YellowColor from "@material-ui/core/colors/orange";
import TealColor from "@material-ui/core/colors/teal";
import * as storeActions from "./../stores/actions";
import LoginScreen from "./../screens/LoginScreen";
import MainMessage from "./../components/MainMessage";
import MainToolbar from "./../components/MainToolbar";
import MainMenu from "./../components/MainMenu";
import Content from "./Content";

function App(props) {
    const dispatch = useDispatch();
    const application = useSelector(state => state.application);

    useEffect(() => {
        setTimeout(() => {
            dispatch(storeActions.showApplication());
        }, 500);
    }, []);

    useEffect(() => {
        setTimeout(() => {
            dispatch(storeActions.authFromStorage());
        }, 100);
    }, []);

    const darkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = createTheme({
        palette: {
            type: darkMode ? "dark" : "light",
            primary: darkMode ? YellowColor : TealColor,
            secondary: darkMode ? {
                light: '#767676',
                main: '#ffffff',
                dark: '#e2e2e2',
            } : {
                light: '#898989',
                main: '#000000',
                dark: '#343434',
            },
            background: {
                default: darkMode ? "#303030" : "#ffffff",
            }
        },
    });

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline/>
            <MainToolbar />
            <div className={"adminApplication"}>
                <Content />
            </div>
            <MainMenu />
            <LoginScreen />
            <MainMessage />
        </MuiThemeProvider>
    );
}

export default App;
