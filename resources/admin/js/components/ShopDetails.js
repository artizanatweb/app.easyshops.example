import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import { useTranslation } from 'react-i18next';
import {
    Typography,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Fab,
} from "@material-ui/core";
import {motion} from "framer-motion";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AddIcon from "@material-ui/icons/Add";
import clsx from "clsx";
import { getUserImage } from "./../utils/utils";
import {useHistory} from "react-router-dom";
import * as storeActions from "../stores/actions";
import LocationsList from "./LocationsList";
import LocationActionScreen from "./../screens/LocationActionScreen";
import RemoveLocationDialog from "./locations/RemoveLocationDialog";
import RoundLoading from "./RoundLoading";
import EditIcon from '@material-ui/icons/Edit';
import ShopActionScreen from "../screens/ShopActionScreen";
import ShopGoogleMap from "./shop/ShopGoogleMap";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    mainMedia: {
        minWidth: 140,
        maxWidth: 700,
        maxHeight: 440,
    },
    actionArea: {
        justifyContent: 'space-between'
    },
}));

const ShopDetails = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const shop = useSelector(state => state.shop);
    const locations = useSelector(state => state.locations);
    const user = useSelector(state => state.authentication.user);
    const history = useHistory();
    const { t, i18n } = useTranslation();

    if (!(shop.data?.id > 0)) {
        return null;
    }

    const backHandler = () => {
        history.push('/admin/shops');
    };

    let shopState = t("inactive");
    if (shop.data?.active) {
        shopState = t("active");
    }

    const editShopHandler = () => {
        dispatch(storeActions.openShopActionScreen());
        dispatch(storeActions.editFormShop(shop.data.id));
    };

    const addButtonVariants = {
        initial: {
            y: 100,
            opacity: 0,
        },
        animate: {
            y: 0,
            opacity: 1,
            transition: {delay: 0.5}
        }
    };

    const addLocation = () => {
        dispatch(storeActions.openLocationActionScreen());
        dispatch(storeActions.addFormLocation());
    };

    const shopImage = getUserImage(shop.data);

    const showLocationsArea = () => {
        if (locations.loading) {
            return (
                <div className={"loadingPageContent"}>
                    <RoundLoading />
                </div>
            );
        }

        return (
            <div className={"shopItemsArea"}>
                <div className={"shopLocations"}>
                    <LocationsList />
                </div>
            </div>
        );
    };

    const actionButton = () => {
        if (user?.type > 1) {
            return (
                <Button
                    startIcon={<EditIcon />}
                    onClick={editShopHandler}
                >{t("edit")}</Button>
            );
        }

        return (
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={backHandler}
            >{t("back")}</Button>
        );
    };

    const shopActionScreen = () => {
        if (1 === user?.type) {
            return false;
        }

        return <ShopActionScreen />;
    };

    return (
        <div className={"shopDetails"}>
            <Card className={clsx("shopDetailsCard", "bigElementCard")} variant={"elevation"}>
                <CardMedia
                    className={clsx(classes.mainMedia, "shopLogoImage")}
                    image={shopImage}
                    title={shop.data?.name}
                    component={"img"}
                />
                <CardContent className={clsx("shopDetailsContent","elementCardContent")}>
                    <div className={"details"}>
                        <div className={"shopName"}>
                            <Typography component={"h1"}>
                                <b>{ shop.data?.name }</b>
                            </Typography>
                        </div>
                        <div className={"shopDescription"}>
                            <Typography component={"p"}>{ shop.data?.description }</Typography>
                        </div>
                        <div className={"shopState"}>{t("shop state")}: <b>{ shopState }</b></div>
                        <div className={"cardMap"}>
                            <div className={"shopMap"}>
                                <ShopGoogleMap locations={locations.items} />
                            </div>
                        </div>
                    </div>
                    <CardActions className={ clsx(classes.actionArea, "shopCardActions") }>
                        { actionButton() }
                        <Button
                            startIcon={<AddIcon />}
                            onClick={addLocation}
                        >{t("add location")}</Button>
                    </CardActions>
                </CardContent>
            </Card>
            <div className={"shopLocationsArea"}>
                { showLocationsArea() }
                <motion.div
                    variants={addButtonVariants}
                    initial={"initial"}
                    animate={"animate"}
                    exit={"initial"}
                    className={"pageAddButton"}
                >
                    <Fab aria-label={"Add location for shop"} color={"primary"} onClick={addLocation}>
                        <AddIcon />
                    </Fab>
                </motion.div>
            </div>
            <LocationActionScreen />
            <RemoveLocationDialog />
            { shopActionScreen() }
        </div>
    );
};

export default ShopDetails;
