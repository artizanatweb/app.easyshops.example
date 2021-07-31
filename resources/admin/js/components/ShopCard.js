import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
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
import * as storeActions from "./../stores/actions";
import { getUserThumbnail } from "./../utils/utils";
import MapLocationsIcon from "./locations/MapLocationsIcon";
import { green } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 350,
        minWidth: 350,
    },
    media: {
        minHeight: 140,
        maxHeight: 140,
    },
    actionArea: {
        justifyContent: 'space-between'
    },
}));

const ShopCard = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const shop = props.shop;
    const history = useHistory();

    const editHandler = () => {
        dispatch(storeActions.openShopActionScreen());
        dispatch(storeActions.editFormShop(shop.id));
    };
    const deleteHandler = () => {
        dispatch(storeActions.setDeleteShopObject(shop));
        dispatch(storeActions.openShopDeleteDialog());
    };
    const openHandler = () => {
        dispatch(storeActions.setApplicationLoading(true));
        history.push(`/admin/shop/${shop.slug}`);
    };

    let shopImage = getUserThumbnail(shop);

    return (
        <Card className={clsx(classes.root, "shopCard", "elementCard")}>
            <CardMedia
                className={clsx(classes.media, "categoryImage")}
                image={shopImage}
                title={shop.name}
                component={"img"}
            />
            <CardContent className={clsx("shopCardContent","elementCardContent")}>
                <Typography component={"p"}>{shop.slug}</Typography>
                <Typography component={"h1"}><b>{shop.name}</b></Typography>
                <Typography component={"p"} className={"elementStatus"}>
                    {t("status")}: <Typography component={"b"} color={(shop.active) ? "secondary" : "error"}>{(shop.active) ? t("active") : t("inactive")}</Typography>
                </Typography>
                <Typography component={"p"}><span className={"contentLabel"}>{t("description")}:</span> <br />{shop.description}</Typography>
                <div className={"shopLocations"}>
                    <MapLocationsIcon />
                    <Typography component={"p"}>{t("Shop locations")}:</Typography>
                    <Typography component={"b"}>{ shop.locations }</Typography>
                </div>
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

ShopCard.propTypes = {
    shop: PropTypes.object.isRequired,
};

export default ShopCard;
