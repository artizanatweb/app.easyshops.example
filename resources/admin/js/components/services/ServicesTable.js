import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import * as storeActions from "./../../stores/actions";

const useStyles = makeStyles({
    table: {
        minWidth: 320,
    },
});

const ServicesTable = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const services = useSelector(state => state.services);

    const editHandler = (id) => {
        dispatch(storeActions.openServiceActionScreen());
        dispatch(storeActions.editFormService(id));
    };

    const deleteHandler = (obj) => {
        dispatch(storeActions.setDeleteServiceObject(obj));
        dispatch(storeActions.openServiceDeleteDialog());
    };

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell align="right">{t("service title")}</TableCell>
                        <TableCell align="right">{t("service duration")}</TableCell>
                        <TableCell align="right">{t("service price")}</TableCell>
                        <TableCell align="right">{t("service template name")}</TableCell>
                        <TableCell align="right">{t("last update")}</TableCell>
                        <TableCell align="right">{t("actions")}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {services.items.map((row) => (
                        <TableRow key={`st_${row.id}`}>
                            <TableCell component="th" scope="row">
                                {row.id}
                            </TableCell>
                            <TableCell align="right" className={"nameAndDescription"}>
                                <b>{row.name}</b>
                                <p>{row.description}</p>
                            </TableCell>
                            <TableCell align="right">{row.duration} min</TableCell>
                            <TableCell align="right">{row.price} LEI</TableCell>
                            <TableCell align="right">{row.template?.name}</TableCell>
                            <TableCell align="right">{row.last_update}</TableCell>
                            <TableCell align="right">
                                <IconButton component={"span"} onClick={() => editHandler(row.id)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton component={"span"} onClick={() => deleteHandler(row)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ServicesTable;
