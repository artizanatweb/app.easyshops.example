import * as actionTypes from "./actionTypes.js";

export const openMainMenu = (open = false) => {
    return {
        type: actionTypes.menu.OPEN,
        open: open,
    }
};
