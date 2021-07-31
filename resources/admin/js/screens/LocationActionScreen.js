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
    Select,
    MenuItem,
    FormControlLabel,
    Switch, InputLabel,
} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import CheckIcon from '@material-ui/icons/Check';
import * as storeActions from "./../stores/actions";
import RoundLoading from "./../components/RoundLoading";
import {green} from '@material-ui/core/colors';
import { withTranslation } from 'react-i18next';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import ActionGoogleMap from "../components/locations/ActionGoogleMap";
import ImageElement from "./../components/locations/ImageElement";

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

class LocationActionScreen extends Component {
    constructor(props) {
        super(props);

        this.refFields = {
            name: createRef(),
            address: createRef(),
            phone: createRef(),
            email: createRef(),
        };
        this.focused = false;
        this.focusTimer = 0;

        this.imagesBottomElementRef = createRef();
        this.lastImageElementRef = createRef();

        // this.bottomTimer = 0;
        this.imageBottomTimer = 0;

        this.fieldMessages = {
            name: this.props.t("Dristor / Crângași / Titan"),
            address: this.props.t("Bd. Timișoara 26, Sector 6, București"),
            phone: this.props.t("Location phone number"),
            email: this.props.t("Location email address"),
        };
    }

    closeHandler() {
        if (this.props.location.saving) {
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

    getFieldState(field) {
        const result = {
            error: false,
            message: this.fieldMessages[field],
        };

        if (!this.props.location.formErrors) {
            return result;
        }

        if (Object.keys(this.props.location.formErrors).includes(field)) {
            result.error = true;
            result.message = this.props.location.formErrors[field];
        }

        return result;
    }

    fieldChanged(fieldName, event) {
        let content = event.target.value;

        this.props.setFieldContent(fieldName, content);
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
        if (!this.props.location.actionsScreen) {
            if (this.focused) {
                this.focused = false;
            }

            return;
        }

        if (!this.props.location.form) {
            return;
        }

        if (this.props.location.formErrors && this.props.location.checkErrors) {
            Object.keys(this.props.location.formErrors).every((field) => {
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

    componentDidMount() {
        //
    }

    scrollToLastImage() {
        this.lastImageElementRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    scrollToImagesBottom() {
        this.imagesBottomElementRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    addImageHandler() {
        if (!this.props.location.form) {
            return;
        }

        this.props.addImage();

        clearTimeout(this.imageBottomTimer);
        this.imageBottomTimer = setTimeout(() => {
            this.scrollToLastImage();
        }, 300);
    }

    showForm() {
        if (!this.props.location?.form) {
            return <RoundLoading/>;
        }

        const images = [];
        this.props.location.formImages.forEach((imageObj, index) => {
            let imageElement = <ImageElement key={`location_image_${index}`} image={imageObj} elementIndex={index} />;
            if (index === (this.props.location.formImages.length - 1)) {
                imageElement = <ImageElement key={`location_image_${index}`} image={imageObj} elementIndex={index} forwardedRef={this.lastImageElementRef} />;
            }
            images.push(imageElement);
        });

        let screenType = "add";
        if (this.props.location.form?.id > 0) {
            screenType = "edit";
        }

        const fieldState = {
            name: this.getFieldState('name'),
            address: this.getFieldState('address'),
            phone: this.getFieldState('phone'),
            email: this.getFieldState('email'),
        };

        return (
            <form noValidate autoComplete={"off"} className={"actionScreenForm centerScreenForm"}>
                <div className={"mapSupport"}>
                    <ActionGoogleMap screenType={screenType} />
                </div>
                <div className={"fillRows"}>
                    <FormControl className="formRow" error={fieldState.name.error}>
                        <TextField inputRef={this.refFields.name} className={this.props.classes.field} label={this.props.t("Location name")} value={this.props.location.form.name} onChange={this.fieldChanged.bind(this, 'name')} color={"secondary"} />
                        <FormHelperText>{ fieldState.name.message }</FormHelperText>
                    </FormControl>
                    <FormControl className="formRow" error={fieldState.address.error}>
                        <TextField inputRef={this.refFields.address} className={this.props.classes.field} label={this.props.t("Address details")} value={this.props.location.form.address} onChange={this.fieldChanged.bind(this, 'address')} color={"secondary"} />
                        <FormHelperText>{ fieldState.address.message }</FormHelperText>
                    </FormControl>
                    <FormControl className="formRow" error={fieldState.phone.error}>
                        <TextField inputRef={this.refFields.phone} className={this.props.classes.field} label="Phone" value={this.props.location.form.phone} onChange={this.fieldChanged.bind(this, 'phone')} color={"secondary"} />
                        <FormHelperText>{ fieldState.phone.message }</FormHelperText>
                    </FormControl>
                    <FormControl className="formRow" error={fieldState.email.error}>
                        <TextField inputRef={this.refFields.email} className={this.props.classes.field} label="Email" value={this.props.location.form.email} onChange={this.fieldChanged.bind(this, 'email')} color={"secondary"} />
                        <FormHelperText>{ fieldState.email.message }</FormHelperText>
                    </FormControl>
                </div>
                <div className={"imagesList"}>
                    { images }
                </div>
                <div ref={this.imagesBottomElementRef} />
            </form>
        )
    }

    render() {
        const classes = this.props.classes;
        const { t } = this.props;

        let dialogTitle = "Add shop location";
        if (this.props.location.form?.id > 0) {
            dialogTitle = "Edit shop location";
        }

        const buttonClassname = clsx({
            [this.props.classes.buttonSuccess]: this.props.location.saved,
            [this.props.classes.buttonSave]: !this.props.location.saved,
        });

        return (
            <div className={"elementActionScreen"}>
                <Dialog fullScreen={true} open={ this.props.location.actionsScreen } TransitionComponent={ Trasition } onClose={this.closeHandler.bind(this)} className={"elementActionsDialog"}>
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
                                    { this.props.location.saved ? <CheckIcon /> : <SaveIcon /> }
                                </Fab>
                                {this.props.location.saving && <CircularProgress size={68} className={classes.fabProgress} />}
                            </div>
                        </Toolbar>
                    </AppBar>
                    <div className={clsx("elementActionsFormPlace hasFabs")}>
                        { this.showForm() }
                    </div>
                    <div className={"bottomFabs"}>
                        <Fab variant="extended" className={classes.extendedIcon} onClick={this.addImageHandler.bind(this)}>
                            <InsertPhotoIcon />
                            { t("Add image") }
                        </Fab>
                    </div>
                </Dialog>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        shop: state.shop,
        location: state.location,
        locations: state.locations,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        close: () => dispatch(storeActions.closeLocationActionScreen()),
        showMessage: (severity, message) => dispatch(storeActions.setMainMessage(severity, message)),
        closeMessage: () => dispatch(storeActions.hideMainMessage()),
        setFieldContent: (field, content) => dispatch(storeActions.changeLocationFieldContent(field, content)),
        errorField: (field, errorsObj) => {
            if (!errorsObj) {
                errorsObj = {};
            }

            errorsObj[field] = "error";
            dispatch(storeActions.setLocationFormErrors(errorsObj));
        },
        setErrors: (errorsObj) => dispatch(storeActions.setShopFormErrors(errorsObj)),
        save: () => dispatch(storeActions.requestLocationSave()),
        addImage: () => dispatch(storeActions.addLocationImageElement()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTranslation()(LocationActionScreen)));
