import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
    Card,
    CardContent,
    LinearProgress,
} from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 500,
        marginBottom: 6,
    },
}));

const EmptyPlaceCard = (props) => {
    const classes = useStyles();

    return (
        <Card className={clsx(classes.root, "placeItem")}>
            <CardContent className={"emptyPlaceDetails"}>
                <LinearProgress color={"primary"} />
            </CardContent>
        </Card>
    );
};

export default EmptyPlaceCard;
