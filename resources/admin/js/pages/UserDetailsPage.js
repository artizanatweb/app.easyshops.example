import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import RoundLoading from "./../components/RoundLoading";
import * as storeActions from "./../stores/actions";
import clsx from "clsx";
import { Button, Typography } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import UserProfile from "./../components/users/UserProfile";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    button: {
        margin: theme.spacing(1),
        marginLeft: 0,
    },
    title: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(1),
    },
    description: {
        paddingTop: 0,
        paddingBottom: theme.spacing(1),
    },
    card: {
        maxWidth: 174,
    },
    cardMedia: {
        maxHeight: 98,
    }
}));

const UserDetailsPage = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = useSelector( state => state.user );
    const application = useSelector(state => state.application);
    const history = useHistory();

    const { match: {params} } = props;

    const pageObject = {
        name: "User details",
        code: "user",
        api: `/admin/api/users/${params.id}`,
    };

    useEffect(() => {
        dispatch(storeActions.setActualPage(pageObject));
        dispatch(storeActions.requestPageContent(pageObject));

        return () => {
            dispatch(storeActions.setUser(null));
        }
    }, []);

    const backHandler = () => {
        history.push('/admin/users');
    };

    const showContent = () => {
        if (application.loading) {
            return (
                <div className={"loadingPageContent"}>
                    <RoundLoading />
                </div>
            );
        }

        if (!user.data) {
            return (
                <div className={"loadingPageContent"}>
                    <RoundLoading />
                </div>
            );
        }

        return (
            <div className={"viewPage"}>
                <div className={"viewPageToolbar"}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        className={classes.button}
                        onClick={backHandler}
                    >Back</Button>
                </div>
                <UserProfile user={user.data} />
            </div>
        );
    };

    return (
        <div className={clsx(classes.root, "page")}>
            <div className={"pageContent"}>
                { showContent() }
            </div>
        </div>
    );
};

export default UserDetailsPage;
