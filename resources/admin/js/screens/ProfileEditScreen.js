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
    CircularProgress,
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

class ProfileEditScreen extends Component {
    constructor(props) {
        super(props);

        this.refFields = {
            name: createRef(),
            surname: createRef(),
            email: createRef(),
            password: createRef(),
            phone: createRef(),
            about_me: createRef()
        };
        this.focused = false;
        this.focusTimer = 0;

        this.inputFileRef = createRef();
        this.chooseFileRef = createRef();

        this.allowedTypes = ['image/png', 'image/jpeg'];

        this.fieldMessages = {
            name: "Your first name",
            surname: "Your last name",
            email: "Your email address",
            password: "Change your password",
            phone: "Your phone number",
            about_me: "Your description",
            file: "",
        };
    }

    getFieldState(field) {
        const result = {
            error: false,
            message: this.fieldMessages[field],
        };

        if (!this.props.user.formErrors) {
            return result;
        }

        if (Object.keys(this.props.user.formErrors).includes(field)) {
            result.error = true;
            result.message = this.props.user.formErrors[field];
        }

        return result;
    }

    closeHandler() {
        if (this.props.user.saving) {
            return;
        }

        this.props.close();
    }

    saveHandler() {
        if (this.props.user.saving) {
            return;
        }

        if (this.props.user.saved) {
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

        clearTimeout(this.focusTimer);
        this.focusTimer = setTimeout(() => {
            this.refFields[field].current.focus();
        }, 500);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.props.user.editScreen) {
            if (this.focused) {
                this.focused = false;
            }

            return;
        }

        if (!this.props.user.form) {
            return;
        }

        if (this.props.user.formErrors && this.props.user.checkErrors) {
            Object.keys(this.props.user.formErrors).every((field) => {
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
                this.props.errorField('file', this.props.user.formErrors);
                return;
            }

            if (!this.allowedTypes.includes(uFile.type)) {
                this.props.showMessage('error', `File type "${uFile.type}" is not allowed!`);
                return;
            }

            this.props.closeMessage();
            if (this.props.user.formErrors?.hasOwnProperty('file')) {
                let errors = { ...this.props.user.formErrors };
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

    showForm() {
        if (!this.props.user?.form?.id) {
            return <RoundLoading/>;
        }

        const fieldState = {
            name: this.getFieldState('name'),
            surname: this.getFieldState('surname'),
            email: this.getFieldState('email'),
            password: this.getFieldState('password'),
            phone: this.getFieldState('phone'),
            about_me: this.getFieldState('about_me'),
            file: this.getFieldState('file'),
        };

        return (
            <form noValidate autoComplete={"off"} className={"actionScreenForm centerScreenForm"}>
                <FormControl className="formRow" error={fieldState.name.error}>
                    <TextField inputRef={this.refFields.name} className={this.props.classes.field} label="Name" value={this.props.user.form.name} onChange={this.fieldChanged.bind(this, 'name')} color={"secondary"} />
                    <FormHelperText>{ fieldState.name.message }</FormHelperText>
                </FormControl>
                <FormControl className="formRow" error={fieldState.surname.error}>
                    <TextField inputRef={this.refFields.surname} className={this.props.classes.field} label="Surame" value={this.props.user.form.surname} onChange={this.fieldChanged.bind(this, 'surname')} color={"secondary"} />
                    <FormHelperText>{ fieldState.surname.message }</FormHelperText>
                </FormControl>
                <FormControl className="formRow" error={fieldState.email.error}>
                    <TextField inputRef={this.refFields.email} className={this.props.classes.field} label="Email" value={this.props.user.form.email} onChange={this.fieldChanged.bind(this, 'email')} color={"secondary"} />
                    <FormHelperText>{ fieldState.email.message }</FormHelperText>
                </FormControl>
                <FormControl className="formRow" error={fieldState.password.error}>
                    <TextField inputRef={this.refFields.password} className={this.props.classes.field} label="Password" value={this.props.user.form.password} onChange={this.fieldChanged.bind(this, 'password')} color={"secondary"} />
                    <FormHelperText>{ fieldState.password.message }</FormHelperText>
                </FormControl>
                <FormControl className="formRow" error={fieldState.phone.error}>
                    <TextField inputRef={this.refFields.phone} className={this.props.classes.field} label="Phone" value={this.props.user.form.phone} onChange={this.fieldChanged.bind(this, 'phone')} color={"secondary"} />
                    <FormHelperText>{ fieldState.phone.message }</FormHelperText>
                </FormControl>
                <FormControl className={clsx("formRow", (fieldState.file.error) ? "fileRowError" : "")} error={fieldState.file.error}>
                    <FormHelperText>User profile image. Only .png, .jpg and .jpeg files accepted</FormHelperText>
                    <label htmlFor={"btn-upload"} className={"fileUploadSupport"}>
                        <input type={"file"} ref={this.inputFileRef} style={{ display: "none" }} id={"btn-upload"} onChange={this.inputFileHandler.bind(this)} />
                        <Button ref={this.chooseFileRef} component={"span"} variant={"outlined"} className={"btn-choose"}>Choose file</Button>
                        <div className={"fileHoler"} style={{ backgroundImage: `url(${this.props.user.form.imageReader.result})` }}></div>
                    </label>
                </FormControl>
                <FormControl className="formRow" error={fieldState.about_me.error}>
                    <TextField
                        className={this.props.classes.field}
                        label="About me"
                        value={this.props.user.form.about_me}
                        onChange={this.fieldChanged.bind(this, 'about_me')}
                        multiline
                        minRows={5}
                        maxRows={10}
                        inputRef={this.refFields.about_me}
                    />
                    <FormHelperText>{fieldState.about_me.message}</FormHelperText>
                </FormControl>
            </form>
        )
    }

    render() {
        const classes = this.props.classes;

        let dialogTitle = "Edit profile"

        const buttonClassname = clsx({
            [this.props.classes.buttonSuccess]: this.props.user.saved,
            [this.props.classes.buttonSave]: !this.props.user.saved,
        });

        return (
            <div className={"elementActionScreen"}>
                <Dialog fullScreen={true} open={ this.props.user.editScreen } TransitionComponent={ Trasition } onClose={this.closeHandler.bind(this)} className={"elementActionsDialog"}>
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
                                    { this.props.user.saved ? <CheckIcon /> : <SaveIcon /> }
                                </Fab>
                                {this.props.user.saving && <CircularProgress size={68} className={classes.fabProgress} />}
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
        user: state.user,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        close: () => dispatch(storeActions.closeEditProfileScreen()),
        showMessage: (severity, message) => dispatch(storeActions.setMainMessage(severity, message)),
        closeMessage: () => dispatch(storeActions.hideMainMessage()),
        setFieldContent: (field, content) => dispatch(storeActions.changeUserProfileFieldContent(field, content)),
        setImageFile: (file, reader) => dispatch(storeActions.userProfileFileImage(file, reader)),
        errorField: (field, errorsObj) => {
            if (!errorsObj) {
                errorsObj = {};
            }

            errorsObj[field] = "error";
            dispatch(storeActions.setUserProfileFormErrors(errorsObj));
        },
        setErrors: (errorsObj) => dispatch(storeActions.setUserProfileFormErrors(errorsObj)),
        save: () => dispatch(storeActions.requestUserProfileSave()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProfileEditScreen));
