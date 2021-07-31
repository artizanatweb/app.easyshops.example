import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
    },
    bottom: {
        color: theme.palette.grey[theme.palette.type === 'light' ? 300 : 700],
    },
    top: {
        color: theme.palette.primary.main,
        animationDuration: '550ms',
        position: 'absolute',
        left: 0,
    },
    circle: {
        strokeLinecap: 'round',
    },
}));

const RoundLoading = (props) => {
    const classes = useStyles();

    return (
        <div className={ clsx(classes.root, "roundLoading") }>
            <CircularProgress
                variant="determinate"
                className={classes.bottom}
                size={60}
                thickness={4}
                {...props}
                value={100}
            />
            <CircularProgress
                variant="indeterminate"
                disableShrink
                className={classes.top}
                classes={{
                    circle: classes.circle,
                }}
                size={60}
                thickness={4}
                {...props}
            />
        </div>
    );
};

export default RoundLoading;
