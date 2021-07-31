import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    CardActions,
    Button,
} from "@material-ui/core";
import PropTypes from "prop-types";
import clsx from "clsx";
import * as storeActions from "./../../stores/actions";

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 500,
        marginBottom: 6,
    },
    media: {
        maxHeight: 120,
        width: 120,
    },
    actionArea: {
        justifyContent: 'flex-start',
        cursor: 'pointer',
    },
}));

const SearchPlaceCard = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const placeItem = props.place;

    const placeImage = () => {
        let img = "/assets/images/shop-location.png";
        if (!(placeItem.photos?.length > 0)) {
            return img;
        }

        return placeItem.photos[0].getUrl();
    };

    const setFromPlace = () => {
        dispatch(storeActions.setPlacesLoading(true));
        dispatch(storeActions.setFromGooglePlace(placeItem));
    };

    return (
        <Card className={clsx(classes.root, "placeItem")}>
            <CardActions className={classes.actionArea} onClick={setFromPlace}>
                <CardMedia
                    className={classes.media}
                    image={placeImage()}
                    title={placeItem.name}
                    component={"img"}
                />
                <div className={"placeDetails"}>
                    <Typography component={"h1"}>{ placeItem.name }</Typography>
                    <Typography component={"p"}>{ placeItem.formatted_address }</Typography>
                </div>
            </CardActions>
        </Card>
    );
};

SearchPlaceCard.propTypes = {
    place: PropTypes.object.isRequired,
};

export default SearchPlaceCard;
