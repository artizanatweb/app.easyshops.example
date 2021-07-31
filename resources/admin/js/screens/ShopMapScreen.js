import React, { Component, forwardRef } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { withTranslation } from 'react-i18next';
import {
    Dialog,
    Slide,
    IconButton,
    Toolbar,
    AppBar, Typography, Fab, CircularProgress,
} from "@material-ui/core";
import ShopGoogleMap from "../components/shop/ShopGoogleMap";
import CloseIcon from "@material-ui/icons/Close";
import clsx from "clsx";
import RoundLoading from "../components/RoundLoading";
import * as storeActions from "./../stores/actions";

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    field: {
        width: '100%',
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
});

const Trasition = forwardRef(function Trasition(props, ref) {
    return <Slide direction={"up"} ref={ref} {...props} />;
});

class ServiceActionScreen extends Component {
    constructor(props) {
        super(props);
    }

    closeHandler() {
        this.props.close();
    }

    showMap() {
        if (!this.props.shop.mapScreen) {
            return null;
        }

        if (!(this.props.locations.items?.length > 0)) {
            return <RoundLoading/>;
        }

        return (
            <div className={"cardMap"}>
                <div className={"shopMap"}>
                    <ShopGoogleMap locations={this.props.locations.items} />
                </div>
            </div>
        );
    }

    render() {
        const classes = this.props.classes;
        const { t } = this.props;

        let dialogTitle = "Shop locations map";

        return (
            <div className={"elementActionScreen"}>
                <Dialog fullScreen={true} open={ this.props.shop.mapScreen } TransitionComponent={ Trasition } onClose={this.closeHandler.bind(this)} className={"elementActionsDialog"}>
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton edge={"start"} color={"inherit"} onClick={this.closeHandler.bind(this)} aria-label={"close"}>
                                <CloseIcon />
                            </IconButton>
                            <Typography variant={"h6"} className={classes.title}>{ t(dialogTitle) }</Typography>
                        </Toolbar>
                    </AppBar>
                    <div className={clsx("elementActionsFormPlace")}>
                        { this.showMap() }
                    </div>
                </Dialog>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        locations: state.locations,
        shop: state.shop,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        close: () => dispatch(storeActions.closeShopMapScreen()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTranslation()(ServiceActionScreen)));
