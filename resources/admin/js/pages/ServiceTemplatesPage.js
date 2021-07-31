import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import {Fab} from "@material-ui/core";
import {motion} from "framer-motion";
import RoundLoading from "./../components/RoundLoading";
import AddIcon from "@material-ui/icons/Add";
import clsx from "clsx";
import ServiceTemplateActionScreen from "./../screens/ServiceTemplateActionScreen";
import * as storeActions from "./../stores/actions";
import TemplatesTable from "../components/services/TemplatesTable";
import RemoveTemplateDialog from "../components/services/RemoveTemplateDialog";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    }
}));

const ServiceTemplatesPage = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const application = useSelector(state => state.application);
    const serviceTemplates = useSelector(state => state.serviceTemplates);

    const showContent = () => {
        if (application.loading) {
            return (
                <div className={"loadingPageContent"}>
                    <RoundLoading />
                </div>
            );
        }

        if (!(serviceTemplates?.items?.length > 0)) {
            return (
                <div className={"emptyList"}>
                    <p>No templates found in database.</p>
                    <p>Please add some templates!</p>
                </div>
            );
        }

        return (
            <div className={"itemsTableSupport"}>
                <TemplatesTable />
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

    const addTemplate = () => {
        dispatch(storeActions.openServiceTemplateActionScreen());
        dispatch(storeActions.addFormTemplate());
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
                    <Fab aria-label={"Add service template"} color={"primary"} onClick={addTemplate}>
                        <AddIcon />
                    </Fab>
                </motion.div>
            </div>
            <ServiceTemplateActionScreen />
            <RemoveTemplateDialog />
        </div>
    );
};

export default ServiceTemplatesPage;

