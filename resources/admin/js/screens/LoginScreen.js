import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import Logo from "./../components/Logo";
import LoginForm from "./../components/LoginForm";
import * as storeActions from "./../stores/actions";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "none",
    }
}));

const LoginScreen = (props) => {
    const classes = useStyles();
    const authentication = useSelector(state => state.authentication);
    const dispatch = useDispatch();

    const screenVariants = {
        open: {
            opacity: 1, display: "flex", transition: { duration: 0.5, ease: "easeOut" }
        },
        close: {
            opacity: 0, transition: { duration: 0.5, ease: "easeOut" }, transitionEnd: {display: "none"}
        }
    };

    const elementVariants = {
        initial: { y: 0, transition: { duration: 0.5, ease: "backIn" } },
        move: { y: -170, transition: { duration: 0.5, ease: "backOut", delay: 1 } }
    };

    const stopSvgAnimation = () => {
        dispatch(storeActions.riseAppLogo(true));
    };

    const showLoginForm = (animationName) => {
        if ("move" != animationName) {
            return;
        }

        dispatch(storeActions.showLoginForm(true));
    };

    return (
        <motion.div
            className={clsx(classes.root, "loginScreenElement")}
            variants={screenVariants}
            animate={ (authentication.showScreen) ? "open" : "close" }
            initial={"close"}
            onAnimationStart={stopSvgAnimation}
        >
            <motion.div
                className={"loginFormElement"}
                variants={ elementVariants }
                initial={ "initial" }
                animate={ (authentication.riseLogo) ? "move" : "initial" }
                onAnimationComplete={showLoginForm}
            >
                <div className={"appLogo"}>
                    <Logo />
                </div>
                <motion.div layout className={"appLoginForm"}>
                    <AnimatePresence>{ authentication.showForm && <LoginForm /> }</AnimatePresence>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default LoginScreen;
