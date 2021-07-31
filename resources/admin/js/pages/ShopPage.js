import React, {useEffect} from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import RoundLoading from "./../components/RoundLoading";
import clsx from "clsx";
import * as storeActions from "../stores/actions";
import ShopDetails from "../components/ShopDetails";
import * as paths from "./../utils/paths";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    }
}));

const ShopPage = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const application = useSelector(state => state.application);
    const shop = useSelector(state => state.shop);
    const history = useHistory();

    const { match: {params} } = props;

    const pageObject = {
        name: "Shop details",
        code: "shop",
        api: paths.shop.details(params.slug),
    };

    useEffect(() => {
        dispatch(storeActions.setApplicationLoading(true));
        dispatch(storeActions.setActualPage(pageObject));
        dispatch(storeActions.requestPageContent(pageObject));
    }, []);

    const showContent = () => {
        if (application.loading) {
            return (
                <div className={"loadingPageContent"}>
                    <RoundLoading />
                </div>
            );
        }

        if (shop.dataError?.length > 2) {
            return (
                <div className={"errorPageContent"}>
                    <p>{shop.dataError}</p>
                </div>
            );
        }

        return <ShopDetails />;
    };

    return (
        <div className={clsx(classes.root, "page")}>
            <div className={"pageContent"}>
                { showContent() }
            </div>
        </div>
    );
};

export default ShopPage;

