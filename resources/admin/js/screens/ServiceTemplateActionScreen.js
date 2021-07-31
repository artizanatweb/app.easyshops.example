import React, { Component, forwardRef, createRef } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import {
    Dialog,
    Slide,
    IconButton,
    Toolbar,
    AppBar,
    Typography,
    Button,
    TextField,
    FormControl,
    FormHelperText,
    Fab,
    CircularProgress, FormControlLabel, Switch,
} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import CheckIcon from '@material-ui/icons/Check';
import * as storeActions from "./../stores/actions";
import RoundLoading from "./../components/RoundLoading";
import {green} from '@material-ui/core/colors';
import { withTranslation } from 'react-i18next';

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
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    fabProgress: {
        color: green[500],
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1,
    },
    buttonSave: {
        backgroundColor: theme.palette.secondary.main,
        color: '#ffffff',
        '&:hover': {
            backgroundColor: theme.palette.secondary.dark,
        },
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
});

const Trasition = forwardRef(function Trasition(props, ref) {
    return <Slide direction={"up"} ref={ref} {...props} />;
});

class ServiceTemplateActionScreen extends Component {
    constructor(props) {
        super(props);

        this.refFields = {
            name: createRef(),
            duration: createRef()
        };
        this.focused = false;
        this.focusTimer = 0;

        this.fieldMessages = {
            name: this.props.t("global name for this service"),
            duration: this.props.t("service execution time in minutes"),
        };
    }

    activeHandler(event) {
        let checked = event.target.checked;
        let value = false;
        if (checked) {
            value = true;
        }

        this.props.setFieldContent('active', value);
    }

    getFieldState(field) {
        const result = {
            error: false,
            message: this.fieldMessages[field],
        };

        if (!this.props.template.formErrors) {
            return result;
        }

        if (Object.keys(this.props.template.formErrors).includes(field)) {
            result.error = true;
            result.message = this.props.template.formErrors[field];
        }

        return result;
    }

    closeHandler() {
        if (this.props.template.saving) {
            return;
        }

        this.props.close();
    }

    saveHandler() {
        if (this.props.template.saving) {
            return;
        }

        if (this.props.template.saved) {
            return;
        }

        this.props.save();
    }

    fieldChanged(fieldName, event) {
        let content = event.target.value;

        this.props.setFieldContent(fieldName, content);
    }

    activeHandler(event) {
        let checked = event.target.checked;
        let value = false;
        if (checked) {
            value = true;
        }

        this.props.setFieldContent('active', value);
    }

    focusField(field) {
        if (!field) {
            return;
        }

        if ('code' === field) {
            field = 'name';
        }

        clearTimeout(this.focusTimer);
        this.focusTimer = setTimeout(() => {
            this.refFields[field].current.focus();
        }, 500);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.props.template.actionsScreen) {
            if (this.focused) {
                this.focused = false;
            }

            return;
        }

        if (!this.props.template.form) {
            return;
        }

        if (this.props.template.formErrors && this.props.template.checkErrors) {
            Object.keys(this.props.template.formErrors).every((field) => {
                this.focusField(field);
                return false;
            });
        }

        if (this.focused) {
            return;
        }

        clearTimeout(this.focusTimer);
        this.focusTimer = setTimeout(() =>{
            if (!this.refFields.name.current) {
                return;
            }

            this.focused = true;
            this.refFields.name.current.focus();
        }, 500);
    }

    showForm() {
        if (!this.props.template?.form) {
            return <RoundLoading/>;
        }

        const durationProps = {
            step: 10,
            min: 0,
            max: 1440,
        };

        const fieldState = {
            name: this.getFieldState('name'),
            duration: this.getFieldState('duration'),
        };

        return (
            <form noValidate autoComplete={"off"} className={"actionScreenForm centerScreenForm"}>
                <FormControl className="formRow" error={fieldState.name.error}>
                    <TextField inputRef={this.refFields.name} className={this.props.classes.field} label={this.props.t("service name")} value={this.props.template.form.name} onChange={this.fieldChanged.bind(this, 'name')} color={"secondary"} />
                    <FormHelperText>{ fieldState.name.message }</FormHelperText>
                </FormControl>
                <FormControl className="formRow" error={fieldState.duration.error}>
                    <TextField
                        color={"secondary"}
                        className={this.props.classes.field}
                        label={this.props.t("service duration")}
                        value={this.props.template.form.duration}
                        onChange={this.fieldChanged.bind(this, 'duration')}
                        type="number"
                        inputProps={durationProps}
                        inputRef={this.refFields.duration}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <FormHelperText>{fieldState.duration.message}</FormHelperText>
                </FormControl>
            </form>
        )
    }

    render() {
        const classes = this.props.classes;
        const { t } = this.props;

        let dialogTitle = "Add service template";
        if (this.props.template.form?.id > 0) {
            dialogTitle = `Edit service template`;
        }

        const buttonClassname = clsx({
            [this.props.classes.buttonSuccess]: this.props.template.saved,
            [this.props.classes.buttonSave]: !this.props.template.saved,
        });

        return (
            <div className={"elementActionScreen"}>
                <Dialog fullScreen={true} open={ this.props.template.actionsScreen } TransitionComponent={ Trasition } onClose={this.closeHandler.bind(this)} className={"elementActionsDialog"}>
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton edge={"start"} color={"inherit"} onClick={this.closeHandler.bind(this)} aria-label={"close"}>
                                <CloseIcon />
                            </IconButton>
                            <Typography variant={"h6"} className={classes.title}>{ t(dialogTitle) }</Typography>
                            <div className={classes.wrapper}>
                                <Fab
                                    aria-label="save"
                                    olor={"inherit"}
                                    className={`${buttonClassname} saveButton`}
                                    onClick={this.saveHandler.bind(this)}
                                >
                                    { this.props.template.saved ? <CheckIcon /> : <SaveIcon /> }
                                </Fab>
                                {this.props.template.saving && <CircularProgress size={68} className={classes.fabProgress} />}
                            </div>
                        </Toolbar>
                    </AppBar>
                    <div className={clsx("elementActionsFormPlace")}>
                        { this.showForm() }
                    </div>
                </Dialog>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        template: state.serviceTemplate,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        close: () => dispatch(storeActions.closeServiceTemplateActionScreen()),
        showMessage: (severity, message) => dispatch(storeActions.setMainMessage(severity, message)),
        closeMessage: () => dispatch(storeActions.hideMainMessage()),
        setFieldContent: (field, content) => dispatch(storeActions.changeTemplateFieldContent(field, content)),
        errorField: (field, errorsObj) => {
            if (!errorsObj) {
                errorsObj = {};
            }

            errorsObj[field] = "error";
            dispatch(storeActions.setTemplateFormErrors(errorsObj));
        },
        setErrors: (errorsObj) => dispatch(storeActions.setTemplateFormErrors(errorsObj)),
        save: () => dispatch(storeActions.requestTemplateSave()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTranslation()(ServiceTemplateActionScreen)));
