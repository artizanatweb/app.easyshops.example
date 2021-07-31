import React, { useState, useCallback, useRef, useEffect } from "react";
import {GoogleMap, useJsApiLoader, Marker, StandaloneSearchBox} from "@react-google-maps/api";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import * as storeActions from "../../stores/actions";

const useStyles = makeStyles((theme) => ({
    root: {
        flex: "auto"
    },
}));

const libraries = ["places"];

const ShopGoogleMap = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const locations = props.locations;
    const locationStore = useSelector( state => state.location );
    const user = useSelector( state => state.authentication.user );

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.MIX_GOOGLE_MAPS_API_KEY,
        libraries: libraries,
    });

    const [map, setMap] = useState(null);

    const onLoad = useCallback(function callback(map) {
        setMap(map)
    }, []);

    const onUnmount = useCallback(function callback(map) {
        setMap(null)
    }, []);

    if (!isLoaded) {
        return null;
    }

    if (!locations?.length) {
        return null;
    }

    const containerStyle = {
        width: '100%',
        height: '260px',
    };

    let mapCenter = locationStore.mapCenter;
    let mapZoom = 10;
    if (!(locations.length > 1)) {
        mapZoom = 14;
        mapCenter = locations[0].location;
    }

    const options = {
        zoomControlOptions: {
            position: window.google.maps.ControlPosition.LEFT_CENTER // 'right-center' ,
        },
        fullscreenControlOptions: {
            position: window.google.maps.ControlPosition.RIGHT_CENTER,
        },
        center: mapCenter,
        zoom: mapZoom,
        mapTypeControl: false,
        autoComplete: false,
    }

    const openLocationHandler = (location) => {
        dispatch(storeActions.setApplicationLoading(true));

        if (1 === user.type) {
            return history.push(`/admin/shop/${location.shop_id}/location/${location.id}`);
        }

        history.push(`/admin/location/${location.id}`);
    };

    const markers = [];
    locations.forEach((location, index) => {
        let marker = <Marker onClick={() => {openLocationHandler(location);}} key={`location_pin_${location.id}`} position={location.location} icon={"https://www.artizanatweb.ro/assets/pins/esshop.png"} />;
        markers.push(marker);
    });

    return (
        <GoogleMap
            id={"shopLocationsMarkers"}
            mapContainerStyle={containerStyle}
            options={options}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            <div>
                { markers }
            </div>
        </GoogleMap>
    )
};

ShopGoogleMap.propTypes = {
    locations: PropTypes.array.isRequired,
};

export default ShopGoogleMap;
