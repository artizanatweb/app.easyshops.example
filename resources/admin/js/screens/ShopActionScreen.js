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

class ShopActionScreen extends Component {
    constructor(props) {
        super(props);

        this.refFields = {
            slug: createRef(),
            name: createRef(),
            description: createRef()
        };
        this.focused = false;
        this.focusTimer = 0;

        this.inputFileRef = createRef();
        this.chooseFileRef = createRef();

        this.allowedTypes = ['image/png', 'image/jpeg'];

        this.fieldMessages = {
            slug: "Shop unique identifier",
            name: "Shop name",
            description: "Shop description",
            file: "",
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

        if (!this.props.shop.formErrors) {
            return result;
        }

        if (Object.keys(this.props.shop.formErrors).includes(field)) {
            result.error = true;
            result.message = this.props.shop.formErrors[field];
        }

        return result;
    }

    closeHandler() {
        if (this.props.shop.saving) {
            return;
        }

        this.props.close();
    }

    saveHandler() {
        if (this.props.shop.saving) {
            return;
        }

        if (this.props.shop.saved) {
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

        if ('slug' === field) {
            field = 'name';
        }

        clearTimeout(this.focusTimer);
        this.focusTimer = setTimeout(() => {
            this.refFields[field].current.focus();
        }, 500);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.props.shop.actionsScreen) {
            if (this.focused) {
                this.focused = false;
            }

            return;
        }

        if (!this.props.shop.form) {
            return;
        }

        if (this.props.shop.formErrors && this.props.shop.checkErrors) {
            Object.keys(this.props.shop.formErrors).every((field) => {
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

    inputFileHandler(event) {
        const files = this.inputFileRef.current.files;

        Object.keys(files).forEach((attr) => {
            const uFile = files[attr];

            if (uFile.size > process.env.MIX_MAX_FILE_SIZE) {
                this.props.showMessage('error', `File size is to big!`);
                this.props.errorField('file', this.props.shop.formErrors);
                return;
            }

            if (!this.allowedTypes.includes(uFile.type)) {
                this.props.showMessage('error', `File type "${uFile.type}" is not allowed!`);
                return;
            }

            this.props.closeMessage();
            if (this.props.shop.formErrors?.hasOwnProperty('file')) {
                let errors = { ...this.props.shop.formErrors };
                delete errors['file'];
                this.props.setErrors(errors);
            }

            const reader = new FileReader();
            reader.onload = (evt) => {
                this.props.setImageFile(uFile, evt.target);
            };
            reader.onabort = (evt) => {
                this.props.showMessage('error', `Error encountered! Please try another file.`);
            };

            reader.readAsDataURL(uFile);
        });
    }

    getStateLabel() {
        let label = "Activate shop";

        if (this.props.shop.form.active) {
            label = "Deactivate shop";
        }

        return label;
    }

    showForm() {
        if (!this.props.shop?.form) {
            return <RoundLoading/>;
        }

        const fieldState = {
            slug: this.getFieldState('slug'),
            name: this.getFieldState('name'),
            description: this.getFieldState('description'),
            file: this.getFieldState('file'),
        };

        return (
            <form noValidate autoComplete={"off"} className={"actionScreenForm centerScreenForm"}>
                <FormControl className="formRow" error={fieldState.slug.error}>
                    <TextField className={this.props.classes.field} label="Slug" value={this.props.shop.form.slug} color={"secondary"} InputProps={{ readOnly: true }} />
                    <FormHelperText>{fieldState.slug.message}</FormHelperText>
                </FormControl>
                <FormControl className="formRow" error={fieldState.name.error}>
                    <TextField inputRef={this.refFields.name} className={this.props.classes.field} label="Name" value={this.props.shop.form.name} onChange={this.fieldChanged.bind(this, 'name')} color={"secondary"} />
                    <FormHelperText>{ fieldState.name.message }</FormHelperText>
                </FormControl>
                <FormControl className="formRow" error={fieldState.description.error}>
                    <TextField
                        className={this.props.classes.field}
                        label="Description"
                        value={this.props.shop.form.description}
                        onChange={this.fieldChanged.bind(this, 'description')}
                        multiline
                        minRows={5}
                        maxRows={10}
                        inputRef={this.refFields.description}
                        color={"secondary"}
                    />
                    <FormHelperText>{fieldState.description.message}</FormHelperText>
                </FormControl>
                <FormControl className={clsx("formRow", (fieldState.file.error) ? "fileRowError" : "")} error={fieldState.file.error}>
                    <FormHelperText>Shop logo image. Only .png, .jpg and .jpeg files accepted</FormHelperText>
                    <label htmlFor={"btn-upload"} className={"fileUploadSupport"}>
                        <input type={"file"} ref={this.inputFileRef} style={{ display: "none" }} id={"btn-upload"} onChange={this.inputFileHandler.bind(this)} />
                        <Button ref={this.chooseFileRef} component={"span"} variant={"outlined"} className={"btn-choose"}>Choose file</Button>
                        <div className={"fileHoler"} style={{ backgroundImage: `url(${this.props.shop.form.imageReader.result})` }}></div>
                    </label>
                </FormControl>
                <FormControl className={clsx("formRow", "switchRow")}>
                    <FormControlLabel className="activeSwitch" control={
                        <Switch
                            checked={this.props.shop.form.active}
                            onChange={this.activeHandler.bind(this)}
                            name={"active"}
                            color={"primary"}
                        />
                    } label={this.getStateLabel()} labelPlacement={"start"} />
                </FormControl>
            </form>
        )
    }

    render() {
        const classes = this.props.classes;

        let dialogTitle = "Add shop";
        if (this.props.shop.form?.id > 0) {
            dialogTitle = `Edit shop`;
        }

        const buttonClassname = clsx({
            [this.props.classes.buttonSuccess]: this.props.shop.saved,
            [this.props.classes.buttonSave]: !this.props.shop.saved,
        });

        return (
            <div className={"elementActionScreen"}>
                <Dialog fullScreen={true} open={ this.props.shop.actionsScreen } TransitionComponent={ Trasition } onClose={this.closeHandler.bind(this)} className={"elementActionsDialog"}>
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton edge={"start"} color={"inherit"} onClick={this.closeHandler.bind(this)} aria-label={"close"}>
                                <CloseIcon />
                            </IconButton>
                            <Typography variant={"h6"} className={classes.title}>{ dialogTitle }</Typography>
                            <div className={classes.wrapper}>
                                <Fab
                                    aria-label="save"
                                    olor={"inherit"}
                                    className={`${buttonClassname} saveButton`}
                                    onClick={this.saveHandler.bind(this)}
                                >
                                    { this.props.shop.saved ? <CheckIcon /> : <SaveIcon /> }
                                </Fab>
                                {this.props.shop.saving && <CircularProgress size={68} className={classes.fabProgress} />}
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
        shop: state.shop,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        close: () => dispatch(storeActions.closeShopActionScreen()),
        showMessage: (severity, message) => dispatch(storeActions.setMainMessage(severity, message)),
        closeMessage: () => dispatch(storeActions.hideMainMessage()),
        setFieldContent: (field, content) => dispatch(storeActions.changeShopFieldContent(field, content)),
        setImageFile: (file, reader) => dispatch(storeActions.shopFileImage(file, reader)),
        errorField: (field, errorsObj) => {
            if (!errorsObj) {
                errorsObj = {};
            }

            errorsObj[field] = "error";
            dispatch(storeActions.setShopFormErrors(errorsObj));
        },
        setErrors: (errorsObj) => dispatch(storeActions.setShopFormErrors(errorsObj)),
        save: () => dispatch(storeActions.requestShopSave()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ShopActionScreen));
