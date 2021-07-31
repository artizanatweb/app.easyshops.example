import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import RoundLoading from "./../components/RoundLoading";
import LocationDetails from "./../components/locations/LocationDetails";
import clsx from "clsx";
import * as storeActions from "./../stores/actions";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
}));

const LocationDetailsPage = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const shop = useSelector(state => state.shop);

    const { match: {params} } = props;

    useEffect(() => {
        if (!(params?.shop > 0)) {
            return;
        }

        if (shop.data?.id > 0) {
            return;
        }

        dispatch(storeActions.requestShopData(params.shop));
    }, []);

    const loadingElement = (
        <div className={"loadingPageContent"}>
            <RoundLoading />
        </div>
    );

    const showContent = () => {
        if (!shop.data) {
            return loadingElement;
        }

        if (!(shop.data.id > 0)) {
            return loadingElement;
        }

        return <LocationDetails id={parseInt(params.id)} />;
    };

    return (
        <div className={clsx(classes.root, "page")}>
            { showContent() }
        </div>
    );
};

export default LocationDetailsPage;
