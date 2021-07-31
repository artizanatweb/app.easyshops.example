import React, { Component, forwardRef, createRef } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { withTranslation } from 'react-i18next';
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
    CircularProgress, InputLabel, MenuItem, Select
} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import CheckIcon from '@material-ui/icons/Check';
import * as storeActions from "./../stores/actions";
import RoundLoading from "./../components/RoundLoading";
import {green} from '@material-ui/core/colors';

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

class ServiceActionScreen extends Component {
    constructor(props) {
        super(props);

        this.refFields = {
            service_template_id: createRef(),
            name: createRef(),
            duration: createRef(),
            price: createRef(),
            description: createRef(),
        };
        this.focused = false;
        this.focusTimer = 0;

        this.fieldMessages = {
            name: this.props.t("name for this service"),
            description: this.props.t("description for this service"),
            duration: this.props.t("service execution time in minutes"),
            price: this.props.t("service price in RON"),
            service_template_id: this.props.t("template for this service"),
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

        if (!this.props.service.formErrors) {
            return result;
        }

        if (Object.keys(this.props.service.formErrors).includes(field)) {
            result.error = true;
            result.message = this.props.service.formErrors[field];
        }

        return result;
    }

    closeHandler() {
        if (this.props.service.saving) {
            return;
        }

        this.props.close();
    }

    saveHandler() {
        if (this.props.service.saving) {
            return;
        }

        if (this.props.service.saved) {
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
        if (!this.props.service.actionsScreen) {
            if (this.focused) {
                this.focused = false;
            }

            return;
        }

        if (!this.props.service.form) {
            return;
        }

        if (this.props.service.formErrors && this.props.service.checkErrors) {
            Object.keys(this.props.service.formErrors).every((field) => {
                if ("service_template_id" === field) {
                    field = "name";
                }

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

    templateSelect(fieldState) {
        const { t } = this.props;
        const templates = [];
        let emptyItem = <MenuItem value={`0`} key={"user_type_0"}>{t("Select service template")}</MenuItem>;
        templates.push(emptyItem);

        const templatesList = this.props.serviceTemplates.items;
        if (templatesList?.length > 0) {
            templatesList.forEach((template) => {
                let templateItem = <MenuItem value={template.id} key={`template_${template.id}`}>{template.name}</MenuItem>;
                templates.push(templateItem);
            })
        }

        let templateId = "0";
        if (this.props.service.form?.service_template_id > 0) {
            templateId = String(this.props.service.form.service_template_id);
        }

        return (
            <FormControl className="formRow" error={fieldState.error}>
                <InputLabel id="types-select-label" color={"secondary"}>{t("service template")}</InputLabel>
                <Select
                    labelId={"template-select-label"}
                    onChange={this.fieldChanged.bind(this, 'service_template_id')}
                    value={templateId}
                    color={"secondary"}
                    ref={this.refFields.service_template_id}
                >
                    { templates }
                </Select>
                <FormHelperText>{ fieldState.message }</FormHelperText>
            </FormControl>
        );
    }

    showForm() {
        if (!this.props.service?.form) {
            return <RoundLoading/>;
        }

        const { t } = this.props;

        const durationProps = {
            step: 10,
            min: 0,
            max: 1440,
        };

        const priceProps = {
            step: 1,
            min: 0.0,
            max: 99999.9,
        };

        const fieldState = {
            service_template_id: this.getFieldState('service_template_id'),
            name: this.getFieldState('name'),
            description: this.getFieldState('description'),
            duration: this.getFieldState('duration'),
            price: this.getFieldState('price'),
        };

        return (
            <form noValidate autoComplete={"off"} className={"actionScreenForm centerScreenForm"}>
                { this.templateSelect(fieldState.service_template_id)}
                <FormControl className="formRow" error={fieldState.name.error}>
                    <TextField inputRef={this.refFields.name} className={this.props.classes.field} label={t("service title")} value={this.props.service.form.name} onChange={this.fieldChanged.bind(this, 'name')} color={"secondary"} />
                    <FormHelperText>{ fieldState.name.message }</FormHelperText>
                </FormControl>
                <FormControl className="formRow" error={fieldState.duration.error}>
                    <TextField
                        className={this.props.classes.field}
                        label={t("service duration")}
                        value={this.props.service.form.duration}
                        onChange={this.fieldChanged.bind(this, 'duration')}
                        type="number"
                        inputProps={durationProps}
                        inputRef={this.refFields.duration}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        color={"secondary"}
                    />
                    <FormHelperText>{fieldState.duration.message}</FormHelperText>
                </FormControl>
                <FormControl className="formRow" error={fieldState.price.error}>
                    <TextField
                        className={this.props.classes.field}
                        label={t("price")}
                        value={this.props.service.form.price}
                        onChange={this.fieldChanged.bind(this, 'price')}
                        type="number"
                        inputProps={priceProps}
                        inputRef={this.refFields.price}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        color={"secondary"}
                    />
                    <FormHelperText>{fieldState.price.message}</FormHelperText>
                </FormControl>
                <FormControl className="formRow" error={fieldState.description.error}>
                    <TextField
                        className={this.props.classes.field}
                        label={t("service description")}
                        value={this.props.service.form.description}
                        onChange={this.fieldChanged.bind(this, 'description')}
                        multiline
                        minRows={5}
                        maxRows={10}
                        inputRef={this.refFields.description}
                        color={"secondary"}
                    />
                    <FormHelperText>{fieldState.description.message}</FormHelperText>
                </FormControl>
            </form>
        )
    }

    render() {
        const classes = this.props.classes;
        const { t } = this.props;

        let dialogTitle = "Add service";
        if (this.props.service.form?.id > 0) {
            dialogTitle = `Edit service`;
        }

        const buttonClassname = clsx({
            [this.props.classes.buttonSuccess]: this.props.service.saved,
            [this.props.classes.buttonSave]: !this.props.service.saved,
        });

        return (
            <div className={"elementActionScreen"}>
                <Dialog fullScreen={true} open={ this.props.service.actionsScreen } TransitionComponent={ Trasition } onClose={this.closeHandler.bind(this)} className={"elementActionsDialog"}>
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
                                    { this.props.service.saved ? <CheckIcon /> : <SaveIcon /> }
                                </Fab>
                                {this.props.service.saving && <CircularProgress size={68} className={classes.fabProgress} />}
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
        service: state.service,
        serviceTemplates: state.serviceTemplates,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        close: () => dispatch(storeActions.closeServiceActionScreen()),
        showMessage: (severity, message) => dispatch(storeActions.setMainMessage(severity, message)),
        closeMessage: () => dispatch(storeActions.hideMainMessage()),
        setFieldContent: (field, content) => dispatch(storeActions.changeServiceFieldContent(field, content)),
        errorField: (field, errorsObj) => {
            if (!errorsObj) {
                errorsObj = {};
            }

            errorsObj[field] = "error";
            dispatch(storeActions.setServiceFormErrors(errorsObj));
        },
        setErrors: (errorsObj) => dispatch(storeActions.setServiceFormErrors(errorsObj)),
        save: () => dispatch(storeActions.requestServiceSave()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTranslation()(ServiceActionScreen)));
