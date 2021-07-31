import React, { useEffect, useLayoutEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from "framer-motion";
import {Fab, FormControl, FormHelperText, InputLabel, MenuItem, Select} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RoundLoading from "./../components/RoundLoading";
import clsx from "clsx";
import * as storeActions from "./../stores/actions";
import ServiceActionScreen from "../screens/ServiceActionScreen";
import ServicesTable from "../components/services/ServicesTable";
import RemoveServiceDialog from "../components/services/RemoveServiceDialog";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    }
}));

const ServicesPage = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const application = useSelector(state => state.application);
    const shop = useSelector(state => state.shop.data);
    const shops = useSelector(state => state.shops.items);
    const services = useSelector(state => state.services);
    const user = useSelector(state => state.authentication.user);
    const templates = useSelector(state => state.serviceTemplates.items);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        if (shops?.length > 0) {
            return;
        }

        dispatch(storeActions.requestShopsSelect(true));
    }, []);

    useEffect(() => {
        if (templates?.length > 0) {
            return;
        }

        dispatch(storeActions.requestServiceTemplates());
    }, []);

    useLayoutEffect(() => {
        return () => {
            if (!(1 === user.type)) {
                return null;
            }

            dispatch(storeActions.setShop([]));
        };
    }, []);

    const shopChangedHandler = (event) => {
        let shopId = event.target.value;

        let newShop = shops.find((item) => item.id === shopId);

        dispatch(storeActions.setShop(newShop));
        dispatch(storeActions.requestServices());
    };

    const loadingComponent = <div className={"loadingPageContent"}><RoundLoading /></div>;

    const shopSelector = () => {
        if (!(1 === user.type)) {
            return null;
        }

        if (!(shops?.length > 0)) {
            return loadingComponent;
        }

        const shopItems = [];
        let shopItemDefault = <MenuItem value={`0`} key={"shop_0"}>{t("Select a shop")}</MenuItem>;
        shopItems.push(shopItemDefault);

        shops.forEach((element) => {
            let shopItem = <MenuItem value={element.id} key={`shop_${element.id}`}>{element.name}</MenuItem>;
            shopItems.push(shopItem);
        });

        let selectedShop = "0";
        if (shop?.id > 0) {
            selectedShop = shop.id;
        }

        return (
            <div className={"headerSelectElement"}>
                <FormControl className="formRow">
                    <InputLabel id="shop-select-label" color={"secondary"}>{t("Shop")}</InputLabel>
                    <Select
                        labelId={"shop-select-label"}
                        onChange={shopChangedHandler}
                        value={selectedShop}
                        color={"secondary"}
                    >
                        { shopItems }
                    </Select>
                    <FormHelperText>{t("View services for the selected shop.")}</FormHelperText>
                </FormControl>
            </div>
        );
    };

    const showContent = () => {
        if (application.loading) {
            return loadingComponent;
        }

        if (!shop?.id) {
            if (1 === user.type) {
                return null;
            }

            return loadingComponent;
        }

        if (!(services.items?.length > 0)) {
            return (
                <div className={"emptyList"}>
                    <p><b>{shop.name}</b> {t("has no services")}.</p>
                    <p>{t("Please add some services")}!</p>
                </div>
            );
        }

        return (
            <div className={"itemsTableSupport"}>
                <ServicesTable />
            </div>
        );
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

    const addService = () => {
        dispatch(storeActions.openServiceActionScreen());
        dispatch(storeActions.addFormService());
    };

    const addButton = () => {
        if (!(shop?.id > 0)) {
            return <AnimatePresence></AnimatePresence>;
        }

        return (
            <AnimatePresence>
                <motion.div
                    variants={addButtonVariants}
                    initial={"initial"}
                    animate={"animate"}
                    exit={"initial"}
                    className={"pageAddButton"}
                >
                    <Fab aria-label={t("Add service")} color={"primary"} onClick={addService}>
                        <AddIcon />
                    </Fab>
                </motion.div>
            </AnimatePresence>
        );
    };

    return (
        <div className={clsx(classes.root, "page")}>
            <div className={"pageContent"}>
                { shopSelector() }
                { showContent() }
                { addButton() }
            </div>
            <ServiceActionScreen />
            <RemoveServiceDialog />
        </div>
    );
};

export default ServicesPage;

