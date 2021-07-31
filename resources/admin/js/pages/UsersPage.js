import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import RoundLoading from "./../components/RoundLoading";
import clsx from "clsx";
import AddIcon from '@material-ui/icons/Add';
import { Fab } from "@material-ui/core";
import { motion } from "framer-motion";
import * as storeActions from "./../stores/actions";
import UserCard from "./../components/UserCard";
import UserActionScreen from "./../screens/UserActionScreen";
import RemoveUserDialog from "../components/RemoveUserDialog";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    }
}));

const UsersPage = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const application = useSelector(state => state.application);
    const users = useSelector(state => state.users);

    const showContent = () => {
        if (application.loading) {
            return (
                <div className={"loadingPageContent"}>
                    <RoundLoading />
                </div>
            );
        }

        if (!(users.pager?.data?.length > 0)) {
            return (
                <div className={"emptyList"}>
                    <p>No users found in database.</p>
                    <p>Please add users!</p>
                </div>
            );
        }

        return (
            <div className={"responseList"}>
                {
                    users.pager.data.map((user, index) => {
                        return (<UserCard user={user} key={`user_card_elem_${user.id}`} />);
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

    const addUser = () => {
        dispatch(storeActions.usersActionsScreen(true));
        dispatch(storeActions.requestUserTypes());
        dispatch(storeActions.addFormUser());
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
                    <Fab aria-label={"Add user"} color={"primary"} onClick={addUser}>
                        <AddIcon />
                    </Fab>
                </motion.div>
            </div>
            <UserActionScreen />
            <RemoveUserDialog />
        </div>
    );
};

export default UsersPage;

