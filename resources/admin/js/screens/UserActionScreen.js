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
    Divider,
    Typography,
    Button,
    TextField,
    FormControl,
    FormControlLabel,
    FormHelperText,
    InputLabel,
    Select,
    MenuItem,
    Fab,
    CircularProgress,
    Switch,
} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import CheckIcon from '@material-ui/icons/Check';
import * as storeActions from "./../stores/actions";
import RoundLoading from "./../components/RoundLoading";
import {green, grey, orange, purple, pink, red, deepPurple} from '@material-ui/core/colors';
import LinearProgress from '@material-ui/core/LinearProgress';
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
    linearLoadingSupport: {
        width: '100%',
        minHeight: 75,
        paddingTop: 30,
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    }
});

const Trasition = forwardRef(function Trasition(props, ref) {
    return <Slide direction={"up"} ref={ref} {...props} />;
});

class UserActionScreen extends Component {
    constructor(props) {
        super(props);

        this.refFields = {
            name: createRef(),
            surname: createRef(),
            email: createRef(),
            password: createRef(),
            phone: createRef(),
            user_type_id: createRef(),
            about_me: createRef(),
            shop_id: createRef(),
            location_id: createRef(),
        };
        this.focused = false;
        this.focusTimer = 0;

        this.inputFileRef = createRef();
        this.chooseFileRef = createRef();

        this.allowedTypes = ['image/png', 'image/jpeg'];

        this.fieldMessages = {
            name: this.props.t("User first name"),
            surname: this.props.t("User last name"),
            email: this.props.t("User email address"),
            password: this.props.t("User password"),
            phone: this.props.t("User phone number"),
            user_type_id: this.props.t("Select user type."),
            about_me: this.props.t("User description"),
            file: "",
            shop_id: this.props.t("the shop to which the user is assigned"),
            location_id: this.props.t("the location to which the user is assigned"),
        };
    }

    getFieldState(field) {
        const result = {
            error: false,
            message: this.fieldMessages[field],
        };

        if (!this.props.users.formErrors) {
            return result;
        }

        if (Object.keys(this.props.users.formErrors).includes(field)) {
            result.error = true;
            result.message = this.props.users.formErrors[field];
        }

        return result;
    }

    closeHandler() {
        if (this.props.users.saving) {
            return;
        }

        this.props.close();
    }

    saveHandler() {
        if (this.props.users.saving) {
            return;
        }

        if (this.props.users.saved) {
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
        if (!this.props.users.actionsScreen) {
            if (this.focused) {
                this.focused = false;
            }

            return;
        }

        if (!this.props.users.form) {
            return;
        }

        if (this.props.users.formErrors && this.props.users.checkErrors) {
            Object.keys(this.props.users.formErrors).every((field) => {
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
                this.props.errorField('file', this.props.users.formErrors);
                return;
            }

            if (!this.allowedTypes.includes(uFile.type)) {
                this.props.showMessage('error', `File type "${uFile.type}" is not allowed!`);
                return;
            }

            this.props.closeMessage();
            if (this.props.users.formErrors?.hasOwnProperty('file')) {
                let errors = { ...this.props.users.formErrors };
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

    userTypeSelect(fieldState) {
        const typeItems = [];
        let emptyItem = <MenuItem value={`0`} key={"user_type_0"}>Select user type</MenuItem>;
        typeItems.push(emptyItem);

        const typesList = this.props.users.types;
        if (typesList?.length > 0) {
            typesList.forEach((type) => {
                let typeItem = <MenuItem value={type.id} key={`user_type_${type.id}`}>{type.name}</MenuItem>;
                typeItems.push(typeItem);
            })
        }

        let userType = "0";
        if (this.props.users.form?.user_type_id > 0) {
            userType = String(this.props.users.form.user_type_id);
        }

        return (
            <FormControl className="formRow" error={fieldState.error}>
                    <InputLabel id="types-select-label" color={"secondary"}>User Type</InputLabel>
                    <Select
                        labelId={"company-select-label"}
                        onChange={this.fieldChanged.bind(this, 'user_type_id')}
                        value={userType}
                        color={"secondary"}
                        ref={this.refFields.user_type_id}
                    >
                        { typeItems }
                    </Select>
                    <FormHelperText>{ fieldState.message }</FormHelperText>
            </FormControl>
        );
    }

    getUserStateLabel() {
        let label = "Activate user";

        if (this.props.users.form.active) {
            label = "Deactivate user";
        }

        return label;
    }

    getShopRelatedSelections(fieldState) {
        if (![2,3].includes(this.props.users.form.user_type_id)) {
            return null;
        }

        if (2 === this.props.users.form.user_type_id) {
            if (null === this.props.shops.items) {
                return (
                    <div className={clsx("formRow",this.props.classes.linearLoadingSupport)}>
                        <LinearProgress color={"primary"} />
                    </div>
                );
            }

            if (!(this.props.shops.items?.length > 0)) {
                return null;
            }

            const shops = [];
            let shopItemDefault = <MenuItem value={`0`} key={"shop_0"}>Select shop for this user</MenuItem>;
            shops.push(shopItemDefault);

            const apiShops = this.props.shops.items;
            apiShops.forEach((shop) => {
                let shopItem = <MenuItem value={shop.id} key={`shop_${shop.id}`}>{shop.name}</MenuItem>;
                shops.push(shopItem);
            });

            let userShop = "0";
            if (this.props.users.form?.shop_id > 0) {
                userShop = String(this.props.users.form.shop_id);
            }

            return (
                <FormControl className="formRow" error={fieldState.shop_id.error}>
                    <InputLabel id="shop-select-label" color={"secondary"}>Shop</InputLabel>
                    <Select
                        labelId={"shop-select-label"}
                        onChange={this.fieldChanged.bind(this, 'shop_id')}
                        value={userShop}
                        color={"secondary"}
                        ref={this.refFields.shop_id}
                    >
                        { shops }
                    </Select>
                    <FormHelperText>{fieldState.shop_id.message}</FormHelperText>
                </FormControl>
            );
        }

        if (null === this.props.users.locations) {
            return (
                <div className={clsx("formRow",this.props.classes.linearLoadingSupport)}>
                    <LinearProgress color={"primary"} />
                </div>
            );
        }

        if (!(this.props.users.locations?.length > 0)) {
            return null;
        }

        const locations = [];
        let defaultLocationItem = <MenuItem value={`0`} key={"location_0"}>Select location for this user</MenuItem>;
        locations.push(defaultLocationItem);

        const apiLocations = this.props.users.locations;
        apiLocations.forEach((location) => {
            let locationItem = <MenuItem value={location.id} key={`location_${location.id}`}>{location.name}</MenuItem>;
            locations.push(locationItem);
        });

        let userLocation = "0";
        if (this.props.users.form?.location_id > 0) {
            userLocation = String(this.props.users.form.location_id);
        }

        return (
            <FormControl className="formRow" error={fieldState.location_id.error}>
                <InputLabel id="shop-select-label" color={"secondary"}>Shop Location</InputLabel>
                <Select
                    labelId={"shop-select-label"}
                    onChange={this.fieldChanged.bind(this, 'location_id')}
                    value={userLocation}
                    color={"secondary"}
                    ref={this.refFields.location_id}
                >
                    { locations }
                </Select>
                <FormHelperText>{fieldState.location_id.message}</FormHelperText>
            </FormControl>
        );
    }

    showForm() {
        if (!this.props.users.form) {
            return <RoundLoading/>;
        }

        if (!(this.props.users.types.length > 0)) {
            return <RoundLoading/>;
        }

        const fieldState = {
            name: this.getFieldState('name'),
            surname: this.getFieldState('surname'),
            email: this.getFieldState('email'),
            password: this.getFieldState('password'),
            phone: this.getFieldState('phone'),
            user_type_id: this.getFieldState('user_type_id'),
            about_me: this.getFieldState('about_me'),
            file: this.getFieldState('file'),
            shop_id: this.getFieldState('shop_id'),
            location_id: this.getFieldState('location_id'),
        };

        return (
            <form noValidate autoComplete={"off"} className={"actionScreenForm centerScreenForm"}>
                <FormControl className="formRow" error={fieldState.name.error}>
                    <TextField inputRef={this.refFields.name} className={this.props.classes.field} label="Name" value={this.props.users.form.name} onChange={this.fieldChanged.bind(this, 'name')} color={"secondary"} />
                    <FormHelperText>{ fieldState.name.message }</FormHelperText>
                </FormControl>
                <FormControl className="formRow" error={fieldState.surname.error}>
                    <TextField inputRef={this.refFields.surname} className={this.props.classes.field} label="Surame" value={this.props.users.form.surname} onChange={this.fieldChanged.bind(this, 'surname')} color={"secondary"} />
                    <FormHelperText>{ fieldState.surname.message }</FormHelperText>
                </FormControl>
                <FormControl className="formRow" error={fieldState.email.error}>
                    <TextField inputRef={this.refFields.email} className={this.props.classes.field} label="Email" value={this.props.users.form.email} onChange={this.fieldChanged.bind(this, 'email')} color={"secondary"} />
                    <FormHelperText>{ fieldState.email.message }</FormHelperText>
                </FormControl>
                <FormControl className="formRow" error={fieldState.password.error}>
                    <TextField inputRef={this.refFields.password} className={this.props.classes.field} label="Password" value={this.props.users.form.password} onChange={this.fieldChanged.bind(this, 'password')} color={"secondary"} />
                    <FormHelperText>{ fieldState.password.message }</FormHelperText>
                </FormControl>
                <FormControl className="formRow" error={fieldState.phone.error}>
                    <TextField inputRef={this.refFields.phone} className={this.props.classes.field} label="Phone" value={this.props.users.form.phone} onChange={this.fieldChanged.bind(this, 'phone')} color={"secondary"} />
                    <FormHelperText>{ fieldState.phone.message }</FormHelperText>
                </FormControl>
                { this.userTypeSelect(fieldState.user_type_id) }
                { this.getShopRelatedSelections(fieldState) }
                <FormControl className={clsx("formRow", "switchRow")}>
                    <FormControlLabel className="activeSwitch" control={
                        <Switch
                            checked={this.props.users.form.active}
                            onChange={this.activeHandler.bind(this)}
                            name={"default"}
                            color={"primary"}
                        />
                    } label={this.getUserStateLabel()} labelPlacement={"start"} />
                </FormControl>
                <FormControl className={clsx("formRow", (fieldState.file.error) ? "fileRowError" : "")} error={fieldState.file.error}>
                    <FormHelperText>User profile image. Only .png, .jpg and .jpeg files accepted</FormHelperText>
                    <label htmlFor={"btn-upload"} className={"fileUploadSupport"}>
                        <input type={"file"} ref={this.inputFileRef} style={{ display: "none" }} id={"btn-upload"} onChange={this.inputFileHandler.bind(this)} />
                        <Button ref={this.chooseFileRef} component={"span"} variant={"outlined"} className={"btn-choose"}>Choose file</Button>
                        <div className={"fileHoler"} style={{ backgroundImage: `url(${this.props.users.form.imageReader.result})` }}></div>
                    </label>
                </FormControl>
                <FormControl className="formRow" error={fieldState.about_me.error}>
                    <TextField
                        className={this.props.classes.field}
                        label="About user"
                        value={this.props.users.form.about_me}
                        onChange={this.fieldChanged.bind(this, 'about_me')}
                        multiline
                        minRows={5}
                        maxRows={10}
                        inputRef={this.refFields.about_me}
                        color={"secondary"}
                    />
                    <FormHelperText>{fieldState.about_me.message}</FormHelperText>
                </FormControl>
            </form>
        )
    }

    render() {
        const classes = this.props.classes;

        let dialogTitle = "Add user";
        if (this.props.users.form?.id > 0) {
            dialogTitle = `Edit user`;
        }

        const buttonClassname = clsx({
            [this.props.classes.buttonSuccess]: this.props.users.saved,
            [this.props.classes.buttonSave]: !this.props.users.saved,
        });

        return (
            <div className={"elementActionScreen"}>
                <Dialog fullScreen={true} open={ this.props.users.actionsScreen } TransitionComponent={ Trasition } onClose={this.closeHandler.bind(this)} className={"elementActionsDialog"}>
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
                                    { this.props.users.saved ? <CheckIcon /> : <SaveIcon /> }
                                </Fab>
                                {this.props.users.saving && <CircularProgress size={68} className={classes.fabProgress} />}
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
        users: state.users,
        shops: state.shops,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        close: () => dispatch(storeActions.usersActionsScreen()),
        setFieldContent: (field, content) => dispatch(storeActions.changeUserFieldContent(field, content)),
        showMessage: (severity, message) => dispatch(storeActions.setMainMessage(severity, message)),
        closeMessage: () => dispatch(storeActions.hideMainMessage()),
        setImageFile: (file, reader) => dispatch(storeActions.userFileImage(file, reader)),
        save: () => dispatch(storeActions.requestUserSave()),
        errorField: (field, errorsObj) => {
            if (!errorsObj) {
                errorsObj = {};
            }

            errorsObj[field] = "error";
            dispatch(storeActions.setUserFormErrors(errorsObj));
        },
        setErrors: (errorsObj) => dispatch(storeActions.setUserFormErrors(errorsObj)),
        // addImage: () => dispatch(),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTranslation()(UserActionScreen)));
