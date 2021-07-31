import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { withRouter, NavLink, Route } from "react-router-dom";
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography
} from "@material-ui/core";
import * as storeActions from "./../stores/actions";
import Pages from "./../utils/Pages";
import clsx from 'clsx';
import Logo from "./Logo";
import { withTranslation } from 'react-i18next';

const styles = theme => ({
    root: {
        // backgroundColor: theme.palette.primary[700],
        // color: '#ffffff',
    },
    list: {
        minWidth: 260,
    },
    fullList: {
        width: 'auto',
    },
    icon: {
        fill: '#ffffff',
    },
    offset: theme.mixins.toolbar,
});

class MainMenu extends Component {
    constructor(props) {
        super(props);

        this.escHandler = this.escHandler.bind(this);
    }

    componentDidMount() {
        document.addEventListener('keydown', this.escHandler, false);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.escHandler, false);
    }

    escHandler(event) {
        if (!this.props.menu.open) {
            return;
        }

        if (!(27 === event.keyCode)) {
            return;
        }

        this.props.close();
    }

    clickHandler(page, selected = false, evt) {
        if (selected) {
            return;
        }

        let actualPath = this.props.location.pathname;
        if (page.path === actualPath) {
            return;
        }

        this.props.clearPage();

        this.props.history.push(page.path);
    }

    render() {
        if (!(this.props.authentication.user?.type > 0)) {
            return null;
        }

        let classes = this.props.classes;
        const { t } = this.props;

        let actualPath = this.props.location.pathname;

        let buttons = [];
        let pages = Pages.getPages(this.props.authentication.user);
        if (!pages) {
            return null;
        }

        pages.forEach((page, index) => {
            let selected = false;
            if (page.path === actualPath) {
                selected = true;
            }
            if ("/admin" === actualPath) {
                if ("dashboard" === page.code) {
                    selected = true;
                }
            }

            let button = (
                <ListItem button key={`menu_button_${index}`} onClick={this.clickHandler.bind(this, page, selected)} selected={selected}>
                    <ListItemIcon className={clsx(classes.icon,"pageIcon")}>{page.icon}</ListItemIcon>
                    <ListItemText primary={t(page.name)} />
                </ListItem>
            );
            buttons.push(button);
        });

        return (
            <div className={"mainMenuSupport"}>
                <Drawer anchor={'left'} open={this.props.menu.open} onClose={this.props.close} classes={{ paper: classes.root}}>
                    <div className={clsx(classes.list, classes.fullList)}
                         role={"presentation"}
                         onClick={this.props.close}
                         onKeyDown={this.props.close}>
                        <div className={clsx(classes.offset, "menuLogo")}>
                            {/*<Logo />*/}
                            <Typography component={"h6"}>
                                { process.env.MIX_APP_NAME }
                            </Typography>
                        </div>
                        <List>
                            {buttons}
                        </List>
                    </div>
                </Drawer>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        menu: state.menu,
        authentication: state.authentication,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        close: () => dispatch(storeActions.openMainMenu(false)),
        clearPage: () => {
            dispatch(storeActions.setApplicationLoading(true));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(withTranslation()(MainMenu))));
