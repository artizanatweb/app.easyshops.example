import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import RoundLoading from "./../components/RoundLoading";
import clsx from "clsx";
import ShopCard from "../components/ShopCard";
import * as storeActions from "../stores/actions";
import {Fab} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import {motion} from "framer-motion";
import ShopActionScreen from "../screens/ShopActionScreen";
import RemoveShopDialog from "../components/RemoveShopDialog";
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    }
}));

const ShopsPage = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const application = useSelector(state => state.application);
    const shops = useSelector(state => state.shops);
    const { t, i18n } = useTranslation();

    const showContent = () => {
        if (application.loading) {
            return (
                <div className={"loadingPageContent"}>
                    <RoundLoading />
                </div>
            );
        }

        if (!(shops.pager?.data?.length > 0)) {
            return (
                <div className={"emptyList"}>
                    <p>{t("No shops found in database")}.</p>
                    <p>{t("Please add some shops")}!</p>
                </div>
            );
        }

        return (
            <div className={"responseList"}>
                {
                    shops.pager.data.map((shop, index) => {
                        return (<ShopCard shop={shop} key={`shop_card_element_${shop.id}`} />);
                    })
                }
            </div>
        )
    };

    const addButtonVariants = {
        initial: {
            y: 100,
            opacity: 0,
        },
        animate: {
            y: 0,
            opacity: 1,
            transition: {delay: 0.5}
        }
    };

    const addShop = () => {
        dispatch(storeActions.openShopActionScreen());
        dispatch(storeActions.addFormShop());
    };

    return (
        <div className={clsx(classes.root, "page")}>
            <div className={"pageContent"}>
                { showContent() }
                <motion.div
                    variants={addButtonVariants}
                    initial={"initial"}
                    animate={"animate"}
                    exit={"initial"}
                    className={"pageAddButton"}
                >
                    <Fab aria-label={"Add shop"} color={"primary"} onClick={addShop}>
                        <AddIcon />
                    </Fab>
                </motion.div>
            </div>
            <ShopActionScreen />
            <RemoveShopDialog />
        </div>
    );
};

export default ShopsPage;

