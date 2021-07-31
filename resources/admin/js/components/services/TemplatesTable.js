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

const TemplatesTable = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const templates = useSelector(state => state.serviceTemplates);

    const editHandler = (id) => {
        dispatch(storeActions.openServiceTemplateActionScreen());
        dispatch(storeActions.editFormTemplate(id));
    };

    const deleteHandler = (obj) => {
        dispatch(storeActions.setDeleteTemplateObject(obj));
        dispatch(storeActions.openTemplateDeleteDialog());
    };

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell align="right">{t("service title")}</TableCell>
                        <TableCell align="right">{t("service duration")}</TableCell>
                        <TableCell align="right">{t("last update")}</TableCell>
                        <TableCell align="right">{t("actions")}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {templates.items.map((row) => (
                        <TableRow key={`st_${row.id}`}>
                            <TableCell component="th" scope="row">
                                {row.id}
                            </TableCell>
                            <TableCell align="right">{row.name}</TableCell>
                            <TableCell align="right">{row.duration}</TableCell>
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

export default TemplatesTable;
