import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import Pages from "./../utils/Pages";
import clsx from "clsx";
import * as storeActions from "./../stores/actions";
import UserDetailsPage from "./../pages/UserDetailsPage";
import ShopPage from "./../pages/ShopPage";
import LocationDetailsPage from "./../pages/LocationDetailsPage";

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    offset: theme.mixins.toolbar,
});


class Content extends Component {
    constructor(props) {
        super(props);

        this.routes = [];
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.props.authentication.user) {
            this.routes = [];
            return;
        }

        this.createRoutes();

        let actualPage = Pages.getByPathname(this.props.location.pathname);
        if (actualPage && actualPage.path === this.props.application.page?.path) {
            return;
        }

        if (!actualPage) {
            return;
        }

        this.props.requestContent(actualPage);
    }

    createRoutes() {
        if (!this.props.authentication.user?.type) {
            this.routes = [];
            return;
        }

        if (this.routes.length > 0) {
            return;
        }

        let pages = Pages.getPages(this.props.authentication.user);
        pages.forEach((page, index) => {
            let paths = [page.path];
            if ("dashboard" === page.code) {
                paths.push('/admin/');
            }
            let route = <Route path={paths} exact={true} key={`content_page_${index}`} component={page.component} />;
            this.routes.push(route);
        });

        if (1 === this.props.authentication.user.type) {
            let userDetailsRoute = <Route path={['/admin/user/:id?']} exact={true} key={"user_page_route"} component={UserDetailsPage}/>
            this.routes.push(userDetailsRoute);

            let shopRoute = <Route path={['/admin/shop/:slug?']} exact={true} key={"shop_page_route"} component={ShopPage} />
            this.routes.push(shopRoute);

            let lRoute = <Route path={['/admin/shop/:shop/location/:id?']} exact={true} key={"l_page_route"} component={LocationDetailsPage} />
            this.routes.push(lRoute);
        }

        if (2 === this.props.authentication.user.type) {
            let locationRoute = <Route path={['/admin/location/:id?']} exact={true} key={"location_page_route"} component={LocationDetailsPage} />
            this.routes.push(locationRoute);
        }
    }

    render() {
        let classes = this.props.classes;

        if (!this.props.authentication.user?.type) {
            return null;
        }

        return (
            <Container>
                <div className={"content"} id={"content"}>
                    <div className={"pagesSupport"}>
                        <div className={classes.offset}></div>
                        <Switch location={this.props.location} key={this.props.location.key}>
                            {this.routes}
                        </Switch>
                    </div>
                </div>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {
        authentication: state.authentication,
        application: state.application,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        requestContent: (page) => {
            dispatch(storeActions.setActualPage(page));
            dispatch(storeActions.requestPageContent(page));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(Content)));
