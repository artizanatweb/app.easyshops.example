import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from '@material-ui/core';
import PropTypes from "prop-types";
import clsx from "clsx";
import parse from "html-react-parser";
import { getUserImage } from "./../../utils/utils";

const useStyles = makeStyles((theme) => ({
    title: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(1),
    }
}));

const UserProfile = (props) => {
    const classes = useStyles();
    const user = props.user;

    let imageElement = null;
    let userImage = getUserImage(user);
    if (userImage) {
        imageElement = (
            <div className={"viewPageBigImage"}>
                <img src={userImage} />
            </div>
        );
    }

    return (
        <div className={"viewPageContent"}>
            { imageElement }
            <div className={clsx("viewPageTitle", classes.title)}>
                <Typography component={"h1"}>{user.name} {user.surname}</Typography>
            </div>
            <Typography component={"p"}><b>{user?.type?.name}</b></Typography>
            <Typography component={"p"}>Email: <b>{user.email}</b></Typography>
            <Typography component={"p"}>Phone: <b>{user.phone}</b></Typography>
            <Typography component={"p"}>Status: <b>{(user.active) ? "Active" : "Inactive"}</b></Typography>
            <div className={clsx(classes.description, "viewPageDescription")}>
                <Typography component={"p"}>About:</Typography>
                <p>{(user.about_me) ? parse(user.about_me) : ""}</p>
            </div>
        </div>
    );
};

UserProfile.propTypes = {
    user: PropTypes.object.isRequired,
};

export default UserProfile;
