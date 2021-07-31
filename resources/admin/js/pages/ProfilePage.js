import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import RoundLoading from "./../components/RoundLoading";
import clsx from "clsx";
import {Button} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import UserProfile from "../components/users/UserProfile";
import * as storeActions from "./../stores/actions";
import ProfileEditScreen from "./../screens/ProfileEditScreen";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    button: {
        margin: theme.spacing(1),
        marginLeft: 0,
    },
}));

const ProfilePage = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const application = useSelector(state => state.application);
    const user = useSelector(state => state.user);

    const editHandler = () => {
        dispatch(storeActions.openEditProfileScreen());
    };

    const showContent = () => {
        if (application.loading) {
            return (
                <div className={"loadingPageContent"}>
                    <RoundLoading />
                </div>
            );
        }

        if (!user.data?.id) {
            return (
                <div className={"loadingPageContent"}>
                    <RoundLoading />
                </div>
            );
        }

        return (
            <div className={"viewPage userProfile"}>
                <div className={"viewPageToolbar"}>
                    <Button
                        startIcon={<EditIcon />}
                        className={classes.button}
                        onClick={editHandler}
                    >Edit</Button>
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
            <ProfileEditScreen />
        </div>
    );
};

export default ProfilePage;

