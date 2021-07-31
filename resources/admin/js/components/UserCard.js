import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    CardActions,
    Button,
    Fab,
} from "@material-ui/core";
import PropTypes from "prop-types";
import clsx from "clsx";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import * as storeActions from "./../stores/actions";
import parse from "html-react-parser";
import { getUserThumbnail } from "./../utils/utils";
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import StoreIcon from '@material-ui/icons/Store';
import HomeWorkIcon from '@material-ui/icons/HomeWork';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 350,
        minWidth: 350,
    },
    media: {
        minHeight: 140,
        maxHeight: 140,
        objectPosition: 'center top',
    },
    actionArea: {
        justifyContent: 'space-between'
    },
}));

const UserCard = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = props.user;
    const history = useHistory();

    const editHandler = () => {
        dispatch(storeActions.usersActionsScreen(true));
        dispatch(storeActions.requestUserTypes());
        dispatch(storeActions.editFormUser(user.id));
    };
    const deleteHandler = () => {
        dispatch(storeActions.setDeleteUserObject(user));
        dispatch(storeActions.openUserDeleteDialog());
    };
    const openHandler = () => {
        dispatch(storeActions.setApplicationLoading(true));
        history.push(`/admin/user/${user.id}`);
    };

    const getShop = () => {
        if (!user.shop) {
            return null;
        }

        return (
            <div className={"withIcon startIcon"}>
                <StoreIcon />
                <Typography component={"p"}>{user.shop?.name}</Typography>
            </div>
        );
    };

    const getLocation = () => {
        if (!user.location) {
            return null;
        }

        return (
            <div className={"withIcon startIcon"}>
                <HomeWorkIcon />
                <Typography component={"p"}>{user.location?.name}</Typography>
            </div>
        );
    };

    const getAboutMe = () => {
        if (!user.about_me) {
            return null;
        }

        return (
            <Typography component={"p"}>{parse(user.about_me)}</Typography>
        );
    };
    const getPhone = () => {
        if (!user.phone) {
            return null;
        }

        return (
            <div className={"withIcon"}>
                <PhoneIcon />
                <Typography component={"p"}>{user.phone}</Typography>
            </div>
        );
    };

    let userImage = getUserThumbnail(user);

    return (
        <Card className={clsx(classes.root, "shopCard", "elementCard")}>
            <CardMedia
                className={clsx(classes.media, "categoryImage")}
                image={userImage}
                title={user.name}
                component={"img"}
            />
            <CardContent className={clsx("shopCardContent","elementCardContent")}>
                <div className={"personal"}>
                    <Typography component={"h1"}>{user.name} {user.surname}</Typography>
                    { getAboutMe() }
                </div>
                <Typography component={"p"}>Type: <b>{user.type?.name}</b></Typography>
                { getShop() }
                { getLocation() }
                <div className={"withIcon"}>
                    <EmailIcon />
                    <Typography component={"p"}>{user.email}</Typography>
                </div>
                { getPhone() }
                <Fab aria-label={"View user"} color={"secondary"} className={clsx("shopViewButton")} onClick={openHandler}>
                    <FullscreenIcon />
                </Fab>
            </CardContent>
            <CardActions className={clsx(classes.actionArea,"elementCardActions")}>
                <Button startIcon={<EditIcon />} onClick={editHandler}>edit</Button>
                <Button startIcon={<DeleteIcon />} onClick={deleteHandler}>delete</Button>
            </CardActions>
        </Card>
    );
};

UserCard.propTypes = {
    user: PropTypes.object.isRequired,
};

export default UserCard;
