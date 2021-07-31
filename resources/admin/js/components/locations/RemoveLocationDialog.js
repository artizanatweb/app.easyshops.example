import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import {
    Button,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Typography
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import * as storeActions from "./../../stores/actions";
import RoundLoading from "./../RoundLoading";
import { getItemDefaultAsset } from "./../../utils/utils";
import { withTranslation } from 'react-i18next';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    button: {
        margin: theme.spacing(1),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

class RemoveLocationDialog extends Component {
    closeHandler(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        if (!this.props.locations.deleteDialog) {
            return;
        }

        if (this.props.locations.removing) {
            return;
        }

        this.props.close();
    }

    deleteHandler() {
        if (!this.props.locations.deleteDialog) {
            return;
        }

        if (this.props.locations.removing) {
            return;
        }

        this.props.delete();
    }

    showDialogContent() {
        const loadingComponent = (
            <DialogContent dividers className={"removeDialogContent"}>
                <RoundLoading />
            </DialogContent>
        );

        if (this.props.locations.removing) {
            return loadingComponent;
        }

        if (!(this.props.locations.deleteObject?.id > 0)) {
            return loadingComponent;
        }

        let location = this.props.locations.deleteObject;
        let locationImage = getItemDefaultAsset(location);

        return (
            <DialogContent dividers className={"removeDialogContent"}>
                <div className={"rdcElement"}>
                    <img src={locationImage.thumbnail} />
                </div>
                <div className={"rdcElement"}>
                    <Typography component={'h1'} gutterBottom>{location.name}</Typography>
                    <Typography gutterBottom>{location.address}</Typography>
                </div>
            </DialogContent>
        );
    }

    render() {
        let classes = this.props.classes;
        const { t } = this.props;

        return (
            <Dialog onClose={this.closeHandler.bind(this)} aria-labelledby="remove-company-dialog" open={this.props.locations.deleteDialog}>
                <DialogTitle id="customized-dialog-title" onClose={this.closeHandler.bind(this)}>
                    <Typography>{ t("Remove shop location") }</Typography>
                    <IconButton aria-label="close" className={classes.closeButton} onClick={this.closeHandler.bind(this)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                { this.showDialogContent() }
                <DialogActions>
                    <Button onClick={this.deleteHandler.bind(this)}
                            color="primary"
                            startIcon={<DeleteIcon />}>
                        {t("remove")}
                    </Button>
                    <Button
                        autoFocus
                        onClick={this.closeHandler.bind(this)}
                        startIcon={<CancelIcon />}
                        color="secondary">
                        {t("cancel")}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapStateToProps = state => {
    return {
        locations: state.locations,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        close: () => dispatch(storeActions.closeLocationDeleteDialog()),
        delete: () => dispatch(storeActions.requestLocationRemoval()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTranslation()(RemoveLocationDialog)));
