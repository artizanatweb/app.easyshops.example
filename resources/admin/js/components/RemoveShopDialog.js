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
import * as storeActions from "./../stores/actions";
import RoundLoading from "./RoundLoading";
import { getUserThumbnail } from "./../utils/utils";
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

class RemoveShopDialog extends Component {
    closeHandler(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        if (!this.props.shops.deleteDialog) {
            return;
        }

        if (this.props.shops.removing) {
            return;
        }

        this.props.close();
    }

    deleteHandler() {
        if (!this.props.shops.deleteDialog) {
            return;
        }

        if (this.props.shops.removing) {
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

        if (this.props.shops.removing) {
            return loadingComponent;
        }

        if (!(this.props.shops.deleteObject?.id > 0)) {
            return loadingComponent;
        }

        let shop = this.props.shops.deleteObject;
        let shopImage = getUserThumbnail(shop);

        return (
            <DialogContent dividers className={"removeDialogContent"}>
                <div className={"rdcElement"}>
                    <img src={shopImage} />
                </div>
                <div className={"rdcElement"}>
                    <Typography component={'h1'} gutterBottom>{shop.name}</Typography>
                    <Typography gutterBottom>{shop.slug}</Typography>
                    <Typography gutterBottom>{shop.description}</Typography>
                </div>
            </DialogContent>
        );
    }

    render() {
        let classes = this.props.classes;

        return (
            <Dialog onClose={this.closeHandler.bind(this)} aria-labelledby="remove-company-dialog" open={this.props.shops.deleteDialog}>
                <DialogTitle id="customized-dialog-title" onClose={this.closeHandler.bind(this)}>
                    <Typography>{this.props.t("Remove shop")}</Typography>
                    <IconButton aria-label="close" className={classes.closeButton} onClick={this.closeHandler.bind(this)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                { this.showDialogContent() }
                <DialogActions>
                    <Button onClick={this.deleteHandler.bind(this)}
                            color="primary"
                            startIcon={<DeleteIcon />}>
                        {this.props.t("remove")}
                    </Button>
                    <Button
                        autoFocus
                        onClick={this.closeHandler.bind(this)}
                        startIcon={<CancelIcon />}
                        color="secondary">
                        {this.props.t("cancel")}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapStateToProps = state => {
    return {
        shops: state.shops,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        close: () => dispatch(storeActions.closeShopDeleteDialog()),
        delete: () => dispatch(storeActions.requestShopRemoval()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTranslation()(RemoveShopDialog)));
