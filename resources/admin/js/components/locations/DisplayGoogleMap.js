import React, { useState, useCallback } from "react";
import {GoogleMap, useJsApiLoader, Marker} from "@react-google-maps/api";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        flex: "auto"
    },
}));

const libraries = ["places"];

const DisplayGoogleMap = (props) => {
    const classes = useStyles();
    const location = props.location;

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

    const containerStyle = {
        width: '100%',
        height: '600px'
    };

    const position = location.location;

    const options = {
        zoomControlOptions: {
            position: window.google.maps.ControlPosition.LEFT_CENTER // 'right-center' ,
        },
        fullscreenControlOptions: {
            position: window.google.maps.ControlPosition.RIGHT_CENTER,
        },
        center: position,
        zoom: 16,
        mapTypeControl: false,
        autoComplete: false,
    }

    return (
        <GoogleMap
            id={"locationMapMarker"}
            mapContainerStyle={containerStyle}
            options={options}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            <Marker
                position={position}
                icon={"https://www.artizanatweb.ro/assets/pins/esshop.png"}
            />
        </GoogleMap>
    )
};

DisplayGoogleMap.propTypes = {
    location: PropTypes.object.isRequired,
};

export default DisplayGoogleMap;
