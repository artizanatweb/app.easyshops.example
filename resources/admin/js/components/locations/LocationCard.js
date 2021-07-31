import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
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
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import * as storeActions from "./../../stores/actions";
import { getItemDefaultAsset } from "./../../utils/utils";

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 350,
        minWidth: 300,
    },
    media: {
        minHeight: 140,
        maxHeight: 140,
    },
    actionArea: {
        justifyContent: 'space-between'
    },
}));

const LocationCard = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const user = useSelector(state => state.authentication.user);
    const location = props.location;
    const history = useHistory();

    const editHandler = () => {
        dispatch(storeActions.openLocationActionScreen());
        dispatch(storeActions.editFormLocation(location.id));
    };
    const deleteHandler = () => {
        dispatch(storeActions.setDeleteLocationObject(location));
        dispatch(storeActions.openLocationDeleteDialog());
    };
    const openHandler = () => {
        dispatch(storeActions.setApplicationLoading(true));

        if (1 === user.type) {
            return history.push(`/admin/shop/${location.shop_id}/location/${location.id}`);
        }

        history.push(`/admin/location/${location.id}`);
    };

    let locationImage = getItemDefaultAsset(location);

    const getAddress = () => {
        let address = "";

        if (location.address?.length > 0) {
            address += location.address;
        }

        return address;
    }

    const emailAddress = () => {
        if (!(location?.email?.length > 0)) {
            return null;
        }

        let str = location.email;

        return (
            <div className={"withIcon"}>
                <EmailIcon />
                <Typography component={"p"}>{ str }</Typography>
            </div>
        );
    };

    const phoneNumber = () => {
        if (!(location?.phone?.length > 0)) {
            return null;
        }

        let str = location.phone;

        return (
            <div className={"withIcon"}>
                <PhoneIcon />
                <Typography component={"p"}>{ str }</Typography>
            </div>
        );
    };

    return (
        <Card className={clsx(classes.root, "shopCard", "elementCard")}>
            <CardMedia
                className={clsx(classes.media, "categoryImage")}
                image={locationImage.thumbnail}
                title={location.name}
                component={"img"}
            />
            <CardContent className={clsx("shopCardContent","elementCardContent")}>
                <Typography component={"h1"}><b>{(location.name?.length > 0) ? location.name : ""}</b></Typography>
                <Typography component={"p"}>{ getAddress() }</Typography>
                { emailAddress() }
                { phoneNumber() }
                <Fab aria-label={"View user"} color={"secondary"} className={clsx("shopViewButton")} onClick={openHandler}>
                    <FullscreenIcon />
                </Fab>
            </CardContent>
            <CardActions className={clsx(classes.actionArea,"elementCardActions")}>
                <Button startIcon={<EditIcon />} onClick={editHandler}>{t("edit")}</Button>
                <Button startIcon={<DeleteIcon />} onClick={deleteHandler}>{t("delete")}</Button>
            </CardActions>
        </Card>
    );
};

LocationCard.propTypes = {
    location: PropTypes.object.isRequired,
};

export default LocationCard;
