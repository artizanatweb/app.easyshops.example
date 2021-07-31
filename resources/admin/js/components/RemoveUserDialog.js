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

class RemoveUserDialog extends Component {
    closeHandler(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        if (!this.props.users.deleteDialog) {
            return;
        }

        if (this.props.users.removing) {
            return;
        }

        this.props.close();
    }

    deleteHandler() {
        if (!this.props.users.deleteDialog) {
            return;
        }

        if (this.props.users.removing) {
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

        if (this.props.users.removing) {
            return loadingComponent;
        }

        if (!(this.props.users.deleteUser?.id > 0)) {
            return loadingComponent;
        }

        let user = this.props.users.deleteUser;
        let userImage = getUserThumbnail(user);

        return (
            <DialogContent dividers className={"removeDialogContent"}>
                <div className={"rdcElement"}>
                    <img src={userImage} />
                </div>
                <div className={"rdcElement"}>
                    <Typography component={'h1'} gutterBottom>{user.name} {user.surname}</Typography>
                    <Typography gutterBottom>{user.type?.name}</Typography>
                    <Typography gutterBottom>{user.email}</Typography>
                    <Typography gutterBottom>{user.phone}</Typography>
                </div>
            </DialogContent>
        );
    }

    render() {
        let classes = this.props.classes;

        return (
            <Dialog onClose={this.closeHandler.bind(this)} aria-labelledby="remove-company-dialog" open={this.props.users.deleteDialog}>
                <DialogTitle id="customized-dialog-title" onClose={this.closeHandler.bind(this)}>
                    <Typography>Remove user</Typography>
                    <IconButton aria-label="close" className={classes.closeButton} onClick={this.closeHandler.bind(this)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                { this.showDialogContent() }
                <DialogActions>
                    <Button onClick={this.deleteHandler.bind(this)}
                            color="primary"
                            startIcon={<DeleteIcon />}>
                        Remove
                    </Button>
                    <Button
                        autoFocus
                        onClick={this.closeHandler.bind(this)}
                        startIcon={<CancelIcon />}
                        color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapStateToProps = state => {
    return {
        users: state.users,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        close: () => dispatch(storeActions.closeUserDeleteDialog()),
        delete: () => dispatch(storeActions.requestUserRemoval()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RemoveUserDialog));
