import React, { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker, StandaloneSearchBox } from "@react-google-maps/api";
import {useDispatch, useSelector} from "react-redux";
import * as storeActions from "./../../stores/actions";
import {
    Paper,
    IconButton,
    InputBase,
    Divider,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import SearchPlaceCard from "./SearchPlaceCard";
import EmptyPlaceCard from "./EmptyPlaceCard";
import BackspaceIcon from '@material-ui/icons/Backspace';
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        textOverflow: 'ellipsis',
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
}));

const libraries = ["places"];
const refs = {};

const ActionGoogleMap = (props) => {
    const classes = useStyles();
    const location = useSelector( state => state.location );
    const dispatch = useDispatch();
    const screenType = props.screenType;
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.MIX_GOOGLE_MAPS_API_KEY,
        libraries: libraries,
    });
    const inputBaseRef = useRef(null);

    const [map, setMap] = useState(null);

    useEffect(() => {
        if (!inputBaseRef) {
            return;
        }

        if (!("add" === screenType)) {
            dispatch(storeActions.setMapCenter(location.form.location.lat, location.form.location.lng));
            dispatch(storeActions.setMapZoom(16));
            return;
        }

        setTimeout(() => {
            inputBaseRef.current.focus();
        }, 500);
    }, []);

    const onLoad = useCallback(function callback(map) {
        setMap(map)
    }, []);

    const onUnmount = useCallback(function callback(map) {
        setMap(null)
    }, []);

    const markerReportPosition = (marker) => {
        dispatch(storeActions.setLocationPosition(marker.latLng.lat(),marker.latLng.lng()));
    };

    if (!location?.form) {
        return null;
    }

    if (!isLoaded) {
        return null;
    }

    const containerStyle = {
        width: '90vw',
        height: '600px'
    };

    const position = location.form.location;

    const options = {
        zoomControlOptions: {
            position: window.google.maps.ControlPosition.LEFT_CENTER // 'right-center' ,
        },
        fullscreenControlOptions: {
            position: window.google.maps.ControlPosition.RIGHT_CENTER,
        },
        center: location.mapCenter,
        zoom: location.mapZoom,
        mapTypeControl: false,
        autoComplete: false,
    }

    const zoomHandler = () => {
        if (!map) {
            return;
        }

        if (map.zoom === location.mapZoom) {
            return;
        }

        dispatch(storeActions.setMapZoom(map.zoom));
    };

    const centerHandler = () => {
        if (!map) {
            return;
        }

        let changed = false;
        if (location.mapCenter.lat !== map.center.lat()) {
            changed = true;
        }
        if (location.mapCenter.lng !== map.center.lng()) {
            changed = true;
        }

        if (!changed) {
            return;
        }

        dispatch(storeActions.setMapCenter(map.center.lat(),map.center.lng()))
    };

    const searchOptions = {
        componentRestrictions: {
            country: 'ro',
        },
        autoComplete: false,
    };

    const onSearchLoad = ref => refs.searchBox = ref;
    const onPlacesChanged = () => {
        let places = refs.searchBox.getPlaces();

        dispatch(storeActions.setMapPlaces(places));
        dispatch(storeActions.setPlacesLoading(false));
    };
    const searchHandler = (evt) => {
        if (location.placesLoading) {
            return;
        }

        dispatch(storeActions.setPlacesLoading(true));
        inputBaseRef.current.focus();
        window.google.maps.event.trigger(inputBaseRef.current, 'keydown', { keyCode: 13 });
    };
    const clearHandler = () => {
        dispatch(storeActions.clearMapSearch());
        inputBaseRef.current.focus();
    };
    const searchFieldHandler = (evt) => {
        let searchTerm = evt.target.value;
        dispatch(storeActions.setMapSearch(searchTerm));
    }

    const searchPlaceItems = () => {
        if (location.placesLoading) {
            return (
                <div className={"placeItems"}>
                    <EmptyPlaceCard />
                </div>
            );
        }

        if (!(location.mapPlaces?.length > 0)) {
            return null;
        }

        const placeItems = [];
        location.mapPlaces.forEach((place) => {
            let placeItem = <SearchPlaceCard place={place} key={`search_item_${place.place_id}`} />
            placeItems.push(placeItem);
        });

        return (
            <div className={"placeItems"}>{ placeItems }</div>
        );
    };

    return (
        <GoogleMap
            id={"shopLocationMarker"}
            mapContainerStyle={containerStyle}
            options={options}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onZoomChanged={zoomHandler}
            onCenterChanged={centerHandler}
        >
            <StandaloneSearchBox
                onLoad={onSearchLoad}
                onPlacesChanged={onPlacesChanged}
                options={searchOptions}
            >
                <div>
                    <Paper className={clsx(classes.paper, "mapSearchArea")} elevation={3}>
                        <InputBase
                            className={classes.input}
                            placeholder={"Search shop location"}
                            inputProps={{ 'aria-label': 'search google maps'  }}
                            inputRef={inputBaseRef}
                            value={location.mapSearch}
                            onChange={searchFieldHandler}
                        />
                        <IconButton
                            className={classes.iconButton}
                            aria-label={"search"}
                            onClick={searchHandler}
                        >
                            <SearchIcon />
                        </IconButton>
                        <Divider className={classes.divider} orientation={"vertical"} />
                        <IconButton
                            className={classes.iconButton}
                            aria-label={"clear"}
                            onClick={clearHandler}
                            color={"secondary"}
                        >
                            <BackspaceIcon />
                        </IconButton>
                    </Paper>
                    { searchPlaceItems() }
                </div>
            </StandaloneSearchBox>
            <Marker
                position={position}
                icon={"https://www.artizanatweb.ro/assets/pins/esshop.png"}
                draggable={true}
                onDragEnd={markerReportPosition}
            />
        </GoogleMap>
    )
};

ActionGoogleMap.propTypes = {
    screenType: PropTypes.string.isRequired,
};

export default ActionGoogleMap;
