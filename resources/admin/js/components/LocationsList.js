import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import { useTranslation } from 'react-i18next';
import * as storeActions from "../stores/actions";
import LocationCard from "./locations/LocationCard";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
}));

const LocationsList = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const locations = useSelector(state => state.locations);
    const { t, i18n } = useTranslation();

    const showContent = () => {
        if (!(locations.items?.length > 0)) {
            return (
                <div className={"emptyList"}>
                    <p>{ t("This shop has no locations.") }</p>
                    <p>{ t("Please add some locations for this shop!") }</p>
                </div>
            )
        }

        return (
            <div className={"responseList"}>
                {
                    locations.items.map((location, index) => {
                        return (<LocationCard location={location} key={`shop_location_${location.id}`} />)
                    })
                }
            </div>
        )
    };

    return (
        <div className={"shopLocationsList"}>
            { showContent() }
        </div>
    );
};

export default LocationsList;
