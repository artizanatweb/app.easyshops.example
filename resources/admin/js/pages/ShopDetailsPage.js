import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import RoundLoading from "./../components/RoundLoading";
import clsx from "clsx";
import ShopDetails from "../components/ShopDetails";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    }
}));

const ShopDetailsPage = (props) => {
    const classes = useStyles();
    const application = useSelector(state => state.application);
    const shop = useSelector(state => state.shop);

    const loadingElement = (
        <div className={"loadingPageContent"}>
            <RoundLoading />
        </div>
    );

    const showContent = () => {
        if (application.loading) {
            return loadingElement;
        }

        if (shop.dataError?.length > 2) {
            return (
                <div className={"errorPageContent"}>
                    <p>{shop.dataError}</p>
                </div>
            );
        }

        if (!shop.data) {
            return loadingElement;
        }

        return (<ShopDetails />);
    };

    return (
        <div className={clsx(classes.root, "page")}>
            <div className={"pageContent"}>
                { showContent() }
            </div>
        </div>
    );
};

export default ShopDetailsPage;

