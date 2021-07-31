import React, {useEffect, useLayoutEffect} from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import RoundLoading from "./../RoundLoading";
import clsx from "clsx";
import { Button, Typography, Card, CardMedia, CardActionArea } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import * as storeActions from "./../../stores/actions";
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import DisplayGoogleMap from "./DisplayGoogleMap";

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
        flexDirection: "column",
        alignItems: "flex-start",
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
    },
    cardAction: {
        height: "100%",
    },
}));

const LocationDetails = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useSelector(state => state.location);
    const shop = useSelector(state => state.shop);
    const user = useSelector(state => state.authentication.user);
    const application = useSelector(state => state.application);

    const locationId = props.id;

    const pageObject = {
        name: "Location details",
        code: "locationDetails",
        api: `/admin/api/shops/${shop.data.id}/locations/${locationId}`,
    };

    useEffect(() => {
        dispatch(storeActions.setActualPage(pageObject));
        dispatch(storeActions.requestLocation(locationId));
    }, []);

    useLayoutEffect(() => {
        return () => {
            dispatch(storeActions.setApplicationLoading(true));
            dispatch(storeActions.clearLocation());
        }
    }, []);

    const backHandler = () => {
        if (1 === user.type) {
            dispatch(storeActions.clearShop());
            return history.push(`/admin/shop/${shop.data.slug}`);
        }

        return history.push('/admin/shop-details');
    };

    const imageHandler = (imageObject) => {
        dispatch(storeActions.setLocationMainImage(imageObject));
    };

    const listImages = () => {
        if (!location.data) {
            return null;
        }

        if (!location.data.images) {
            return null;
        }

        if (!(location.data.images?.length > 1)) {
            return null;
        }

        const thumbnailCards = [];
        location.data.images.forEach((imageObject, index) => {
            let element = (
                <Card className={clsx(classes.card, "imageThumbnailCard")} key={`thumbnailCard_${index}_${imageObject.id}`}>
                    <CardActionArea className={classes.cardAction} onClick={() => {imageHandler(imageObject);}}>
                        <CardMedia
                            component={"img"}
                            alt={imageObject.name}
                            title={imageObject.name}
                            image={imageObject.thumbnail}
                            className={classes.cardMedia}
                        />
                    </CardActionArea>
                </Card>
            );
            thumbnailCards.push(element)
        });

        return (
            <div className={"viewPageImagesList"}>{ thumbnailCards }</div>
        );
    };

    const loadingElement = (
        <div className={"loadingPageContent"}>
            <RoundLoading />
        </div>
    );

    const showContent = () => {
        if (application.loading) {
            return loadingElement;
        }

        if (!location.data) {
            return loadingElement;
        }

        let imageElement = null;
        if (location.image) {
            imageElement = (
                <div className={"viewPageBigImage"}>
                    <img src={location.image.image} />
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
                { imageElement }
                { listImages() }
                <div className={clsx("viewPageTitle", classes.title, "addressTitle")}>
                    <Typography component={"h1"}>{location.data.name}</Typography>
                    <Typography component={"p"}>{location.data.address}</Typography>
                </div>
                <div className={clsx(classes.description,"viewPageContact")}>
                    <div className={"withIcon"}>
                        <EmailIcon />
                        <h3>{location.data.email}</h3>
                    </div>
                    <div className={"withIcon"}>
                        <PhoneIcon />
                        <h3>{location.data.phone}</h3>
                    </div>
                </div>
                <div className={"viewPageLocation"}>
                    <DisplayGoogleMap location={location.data} />
                </div>
            </div>
        );
    };

    return (
        <div className={"pageContent"}>
            { showContent() }
        </div>
    );
};

LocationDetails.propTypes = {
    id: PropTypes.number.isRequired,
};

export default LocationDetails;
