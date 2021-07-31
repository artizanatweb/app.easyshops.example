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

class RemoveTemplateDialog extends Component {
    closeHandler(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        if (!this.props.templates.deleteDialog) {
            return;
        }

        if (this.props.templates.removing) {
            return;
        }

        this.props.close();
    }

    deleteHandler() {
        if (!this.props.templates.deleteDialog) {
            return;
        }

        if (this.props.templates.removing) {
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

        if (this.props.templates.removing) {
            return loadingComponent;
        }

        if (!(this.props.templates.deleteObject?.id > 0)) {
            return loadingComponent;
        }

        let template = this.props.templates.deleteObject;

        return (
            <DialogContent dividers className={"removeDialogContent"}>
                <div>
                    <Typography component={'h1'} gutterBottom>{this.props.t("service title")}: <b>{template.name}</b></Typography>
                    <Typography gutterBottom>{this.props.t("service duration")}: <b>{template.duration} {this.props.t("minutes")}</b></Typography>
                    <Typography gutterBottom>{this.props.t("last update")}: <b>{template.last_update}</b></Typography>
                </div>
            </DialogContent>
        );
    }

    render() {
        let classes = this.props.classes;
        const { t } = this.props;

        return (
            <Dialog onClose={this.closeHandler.bind(this)} aria-labelledby="remove-company-dialog" open={this.props.templates.deleteDialog}>
                <DialogTitle id="customized-dialog-title" onClose={this.closeHandler.bind(this)}>
                    <Typography>{ t("Remove service template") }</Typography>
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
        templates: state.serviceTemplates,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        close: () => dispatch(storeActions.closeTemplateDeleteDialog()),
        delete: () => dispatch(storeActions.requestServiceTemplateRemoval()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTranslation()(RemoveTemplateDialog)));
